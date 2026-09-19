// Fails if any user-facing text contains an emoji or an em or en dash.
import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

const ROOT = "src";
const bad = [];
const emoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|css|md)$/.test(f)) {
      readFileSync(p, "utf8").split("\n").forEach((line, i) => {
        if (line.includes("—") || line.includes("–") || emoji.test(line)) bad.push(`${p}:${i + 1}: ${line.trim().slice(0, 80)}`);
      });
    }
  }
}
walk(ROOT);
if (bad.length) {
  console.error("Writing check failed (no emojis, no em or en dashes):\n" + bad.join("\n"));
  process.exit(1);
}
console.log("Writing check passed: no emojis, no em or en dashes.");
