/**
 * Re-runs every claim this project makes, and writes down what it found.
 *
 *   npm run audit                            audits the live deployment
 *   npm run audit -- --host=http://localhost:3000
 *   npm run audit -- --skip=lighthouse       when you only want the fast checks
 *
 * The point is falsifiability. Anyone can print a score in a pitch deck. This
 * script hands a judge the means to check ours, including the means to catch us
 * out, and writes the result to docs/AUDIT-REPORT.md whether it passed or not.
 *
 * Accessibility and Lighthouse need a browser, which npx fetches on first run.
 * Everything else runs on a plain checkout.
 */
import { execSync, spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (name: string, fallback: string) =>
  process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=") ?? fallback;

const HOST = arg("host", "https://virasat-indol.vercel.app");
const SKIP = arg("skip", "").split(",").filter(Boolean);

/** The pages a visitor can actually reach. If you add a page, add it here. */
const PAGES = ["/", "/try", "/judges", "/developers", "/how-ai-works", "/glossary", "/references", "/accessibility", "/privacy", "/proof"];

type Check = { name: string; how: string; result: string; ok: boolean; detail?: string };
const checks: Check[] = [];

function shell(name: string, how: string, command: string, pass: string) {
  process.stdout.write(`${name}... `);
  const r = spawnSync(command, { cwd: root, shell: true, encoding: "utf8" });
  const ok = r.status === 0;
  console.log(ok ? "ok" : "FAILED");
  const tail = `${r.stdout ?? ""}${r.stderr ?? ""}`.trim().split("\n").slice(-6).join("\n");
  checks.push({ name, how: command, result: ok ? pass : "Failed", ok, detail: ok ? undefined : tail });
  return ok;
}

shell("Lint", "eslint", "npm run lint", "No errors");
shell("Writing rules", "the house style checker", "npm run check:writing", "No emojis, no dashes, plain words");
shell("Types", "tsc", "npx tsc --noEmit", "No type errors");
shell("Tests", "vitest", "npm test", "All green");
shell("Production build", "next build", "npm run build", "Builds clean");

/* ---------------- accessibility ---------------- */

if (!SKIP.includes("a11y")) {
  process.stdout.write("Accessibility (axe, WCAG 2.2 AA)... ");
  try {
    const { chromium } = await import("playwright");
    const { default: AxeBuilder } = await import("@axe-core/playwright");
    const browser = await chromium.launch();
    let serious = 0;
    let moderate = 0;
    const worst: string[] = [];
    for (const theme of ["light", "dark"] as const) {
      const context = await browser.newContext({ colorScheme: theme });
      const page = await context.newPage();
      for (const path of PAGES) {
        await page.goto(`${HOST}${path}`, { waitUntil: "networkidle" });
        const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
        for (const v of violations) {
          if (v.impact === "serious" || v.impact === "critical") {
            serious += v.nodes.length;
            worst.push(`${theme} ${path}: ${v.id} (${v.nodes.length})`);
          } else if (v.impact === "moderate") moderate += v.nodes.length;
        }
      }
      await context.close();
    }
    await browser.close();
    console.log(serious === 0 ? "ok" : "FAILED");
    checks.push({
      name: "Accessibility (axe, WCAG 2.2 AA)",
      how: `${PAGES.length} pages, light and dark`,
      result: `${serious} serious or critical, ${moderate} moderate`,
      ok: serious === 0,
      detail: worst.join("\n") || undefined,
    });
  } catch (e) {
    console.log("skipped");
    checks.push({
      name: "Accessibility (axe, WCAG 2.2 AA)",
      how: `${PAGES.length} pages, light and dark`,
      result: "Not run",
      ok: false,
      detail: `Needs a browser: npm i -D playwright @axe-core/playwright && npx playwright install chromium\n${(e as Error).message}`,
    });
  }
}

/* ---------------- lighthouse ---------------- */

if (!SKIP.includes("lighthouse")) {
  process.stdout.write("Lighthouse (3 runs, we publish the range)... ");
  const runs: Record<string, number>[] = [];
  for (let i = 0; i < 3; i += 1) {
    try {
      const out = execSync(
        `npx --yes lighthouse ${HOST} --quiet --chrome-flags="--headless" --preset=desktop --output=json --output-path=stdout`,
        { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
      );
      const r = JSON.parse(out);
      runs.push(Object.fromEntries(Object.entries(r.categories).map(([k, v]) => [k, Math.round((v as { score: number }).score * 100)])));
    } catch {
      break;
    }
  }
  if (runs.length === 0) {
    console.log("skipped");
    checks.push({ name: "Lighthouse", how: `3 runs against ${HOST}`, result: "Not run", ok: false, detail: "Needs Chrome on the machine running the audit." });
  } else {
    // A single run flatters or punishes you depending on whether the webfont
    // beat the largest paint that time, so the range is what gets published.
    const range = (key: string) => {
      const vals = runs.map((r) => r[key]).filter((v) => typeof v === "number");
      const lo = Math.min(...vals);
      const hi = Math.max(...vals);
      return lo === hi ? `${lo}` : `${lo} to ${hi}`;
    };
    const perf = range("performance");
    console.log("ok");
    checks.push({
      name: "Lighthouse (desktop)",
      how: `${runs.length} runs against ${HOST}`,
      result: `performance ${perf}, accessibility ${range("accessibility")}, best practices ${range("best-practices")}, SEO ${range("seo")}`,
      ok: true,
    });
  }
}

/* ---------------- links ---------------- */

if (!SKIP.includes("links")) {
  process.stdout.write("Every page answers... ");
  const bad: string[] = [];
  for (const path of PAGES) {
    const res = await fetch(`${HOST}${path}?audit=${Date.now()}`).catch(() => null);
    if (!res || !res.ok) bad.push(`${path}: ${res ? res.status : "no answer"}`);
  }
  console.log(bad.length === 0 ? "ok" : "FAILED");
  checks.push({ name: "Every page answers", how: `HTTP GET on ${PAGES.length} pages`, result: bad.length === 0 ? `${PAGES.length} of ${PAGES.length} return 200` : `${bad.length} failing`, ok: bad.length === 0, detail: bad.join("\n") || undefined });
}

/* ---------------- report ---------------- */

const when = new Date().toISOString().slice(0, 16).replace("T", " ");
const commit = (() => {
  try {
    return execSync("git rev-parse --short HEAD", { cwd: root, encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
})();

const failed = checks.filter((c) => !c.ok);
const lines = [
  "# Audit report",
  "",
  "Produced by `npm run audit`. Every number published on the site comes from this run.",
  "Re-run it yourself: the command that produced each row is in the table.",
  "",
  `- Audited: ${HOST}`,
  `- When: ${when} UTC`,
  `- Commit: ${commit}`,
  `- Result: ${failed.length === 0 ? "all checks passed" : `${failed.length} of ${checks.length} checks did not pass`}`,
  "",
  "| Check | How | Result |",
  "| --- | --- | --- |",
  ...checks.map((c) => `| ${c.name} | \`${c.how}\` | ${c.ok ? "" : "Did not pass. "}${c.result} |`),
];

if (failed.length) {
  lines.push("", "## What did not pass", "");
  for (const c of failed) lines.push(`### ${c.name}`, "", "```", c.detail ?? c.result, "```", "");
}

writeFileSync(join(root, "docs", "AUDIT-REPORT.md"), `${lines.join("\n")}\n`);
console.log(`\nWrote docs/AUDIT-REPORT.md. ${failed.length === 0 ? "Everything passed." : `${failed.length} check(s) did not pass.`}`);
process.exit(failed.some((c) => c.result !== "Not run") ? 1 : 0);
