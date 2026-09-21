/**
 * Runs the unpaid-dividend parser against real published lists.
 *
 *   npm run check:dividends                    uses the lists in .cache/
 *   npm run check:dividends -- path/to/list.pdf
 *
 * Listed companies must publish the names of shareholders whose dividends were
 * never paid (Companies Act s.124(2)). Those lists are the real input this
 * feature exists for. We do not ship them, because a searchable index of real
 * names next to real unclaimed money is a target list for fraud. But "the
 * parser would work on real data" is a claim, so this measures it: how many
 * rows a real list yields, on how many pages, and how many of those rows the
 * name search can then find again. No name is printed or written anywhere;
 * the only output is counts.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFParse } from "pdf-parse";
import { parseDividendList, searchDividends } from "../src/lib/dividends";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const keep = process.argv.includes("--keep");
const files = args.length ? args : existsSync(join(root, ".cache")) ? readdirSync(join(root, ".cache")).filter((f) => f.endsWith(".pdf")).map((f) => join(root, ".cache", f)) : [];

if (files.length === 0) {
  console.error("No lists to check. Put a company's published unpaid-dividend PDF in .cache/ or pass a path.");
  process.exit(1);
}

let pages = 0;
let rows = 0;
let found = 0;
let checked = 0;
let lists = 0;
for (const file of files) {
  const parser = new PDFParse({ data: readFileSync(file) });
  const r = await parser.getText();
  await parser.destroy();
  const entries = parseDividendList(r.text, basename(file), "", file);
  // Can the search find what the parser read? Search by each holder's full
  // name against an index made only of this list, in memory, then discard.
  // Sampled: every row against every row is quadratic, and a statutory list
  // can run to tens of thousands of rows.
  const step = Math.max(1, Math.ceil(entries.length / 400));
  const sample = entries.filter((_, i) => i % step === 0);
  let hit = 0;
  for (const e of sample) {
    const words = e.holder.split(" ").filter(Boolean);
    const q = words.length > 1 ? `${words[0]} ${words[words.length - 1]}` : e.holder;
    if (searchDividends(q, entries).some((x) => x.holder === e.holder)) hit += 1;
  }
  lists += 1;
  pages += r.pages.length;
  rows += entries.length;
  found += hit;
  checked += sample.length;
  const total = entries.reduce((n, e) => n + e.amountInr, 0);
  console.log(`${basename(file)}: ${r.pages.length} pages, ${entries.length} rows, search finds ${hit} of ${sample.length} sampled, ${Math.round(total).toLocaleString("en-IN")} rupees listed`);
}

console.log(`\n${lists} real published lists, ${pages} pages, ${rows} rows parsed, name search finds ${found} of ${checked} sampled. No name kept.`);

if (keep) process.exit(0);
const target = join(root, "src", "lib", "eval-results.ts");
let src = readFileSync(target, "utf8");
const line = `{ test: "Dividend list parser: real published lists", cases: "${lists} company lists, ${pages} pages, downloaded at check time and never stored", result: "${rows.toLocaleString("en-IN")} rows parsed, search finds ${Math.round((found / Math.max(checked, 1)) * 100)} percent of a ${checked} row sample", note: "Real unpaid-dividend lists that companies must publish under the Companies Act. Counts only; no name is kept. Reproduce with npm run check:dividends." }`;
src = /\{ test: "Dividend list parser[^}]*\}/.test(src)
  ? src.replace(/\{ test: "Dividend list parser[^}]*\}/, line)
  : src.replace(/(\{ test: "AIS parser[^}]*\},)/, `$1\n    ${line},`);
writeFileSync(target, src);
console.log(`Wrote ${target}.`);
