/**
 * Measures what one family actually costs, using the real code paths.
 *
 *   npm run measure:cost           needs ANTHROPIC_API_KEY
 *   npm run measure:cost -- --keep prints the numbers without writing the file
 *
 * This deliberately calls extractDocument and runDebate, the same functions the
 * app calls, rather than a simplified copy. A cost model that measures a
 * lookalike prompt is a cost model that quietly drifts away from the product.
 *
 * It then rewrites the JOURNEY token counts in src/lib/cost.ts and flips those
 * steps from "estimated" to "measured", so the figure published on the site is
 * arithmetic on real usage.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { extractDocument } from "../src/lib/extract";
import { runDebate } from "../src/lib/debate";
import { addUsage } from "../src/lib/anthropic";
import { JOURNEY, journeyTotal, rupees, usd, type Usage } from "../src/lib/cost";
import { SAMPLE_DOCS } from "../src/lib/sample";
import { decide } from "../src/lib/rules";
import type { ClaimInput } from "../src/lib/types";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const keep = process.argv.includes("--keep");

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("No ANTHROPIC_API_KEY found. Set it in .env.local, then run again.");
  console.error("Until then the site shows the estimated figures and says so.");
  process.exit(1);
}

const DOCS = ["passbook.png", "lic-bond.png", "share-certificate.png"] as const;

const average = (parts: Usage[]): Usage => {
  const t = addUsage(...parts);
  const n = parts.length;
  return {
    input: Math.round(t.input / n),
    output: Math.round(t.output / n),
    cacheRead: Math.round(t.cacheRead / n),
    cacheWrite: Math.round(t.cacheWrite / n),
  };
};

console.log("Reading the sample documents with the app's own extractor...");
const extractRuns: Usage[] = [];
for (const file of DOCS) {
  const data = readFileSync(join(root, "public", "samples", file)).toString("base64");
  await extractDocument(data, "image/png", null, (u) => extractRuns.push(u));
  const last = extractRuns[extractRuns.length - 1];
  console.log(`  ${file}: ${last.input} in, ${last.cacheRead} cached, ${last.output} out`);
}

console.log("Running the Two AI Debate on the sample claim...");
// Sunita's bank passbook: a nominee is named, so this is the common route
// rather than the worst case, which is what a typical family costs.
const input: ClaimInput = {
  assetType: "bank",
  institution: "State Bank of India",
  amountInr: 158420,
  nomineePresent: true,
  jointHolder: false,
  claimantRelation: "spouse",
  otherHeirs: false,
};
const debate = await runDebate({ extraction: SAMPLE_DOCS[0].extraction, input, decision: decide(input), lang: "en" });
const debateUsage = debate.usage!;
console.log(`  three calls: ${debateUsage.input} in, ${debateUsage.cacheRead} cached, ${debateUsage.output} out`);

const measured: Record<string, Usage> = { extract: average(extractRuns), debate: debateUsage };

const perFamily = journeyTotal(
  JOURNEY.map((s) => (measured[s.id] ? { ...s, usage: measured[s.id], source: "measured" as const } : s)),
);
console.log(`\nOne family, measured: ${rupees(perFamily.inr)} (${perFamily.usd.toFixed(4)} US dollars)`);
console.log(`  one document read: ${rupees(usd(measured.extract) * 88)}`);
console.log(`  one debate:        ${rupees(usd(measured.debate) * 88)}`);

if (keep) process.exit(0);

const target = join(root, "src", "lib", "cost.ts");
let src = readFileSync(target, "utf8");
for (const [id, u] of Object.entries(measured)) {
  const block = new RegExp(`(id: "${id}",[\\s\\S]*?)usage: \\{[^}]*\\},([\\s\\S]*?)source: "estimated",`);
  if (!block.test(src)) {
    console.error(`Could not find the ${id} step in cost.ts. Nothing written.`);
    process.exit(1);
  }
  src = src.replace(
    block,
    `$1usage: { input: ${u.input}, cacheRead: ${u.cacheRead}, cacheWrite: ${u.cacheWrite}, output: ${u.output} },$2source: "measured",`,
  );
}
src = src.replace(/export const MEASURED_ON = "[^"]*";/, `export const MEASURED_ON = "${new Date().toISOString().slice(0, 10)}";`);
writeFileSync(target, src);
console.log(`\nWrote ${target}. The site now publishes measured token counts.`);
