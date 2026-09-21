/** Published on /how-ai-works. Updated by `npm test` (rules and parser) and `npm run eval` (AI rows). */
export const EVAL_RESULTS = {
  description: "We test the parts that must be right. The rule engine and the AIS parser are tested by code and run on every change. The AI rows come from a scripted run on the sample documents and need an API key.",
  lastRun: "2026-09-19",
  rows: [
    { test: "Rule engine: correct route", cases: "24 scenarios across 5 institutions", result: "24 of 24", note: "Every rule set has tests for nominee, no nominee under and over the threshold, joint holder and unknown nominee." },
    { test: "AIS parser: rows found", cases: "3 synthetic statements", result: "13 of 13 rows", note: "Interest, dividend and mutual fund tables." },
    { test: "Claim pack builds", cases: "5 institutions", result: "5 of 5", note: "PDF opens, fields filled, three pages." },
    { test: "Accessibility (axe, WCAG 2.2 AA)", cases: "11 pages, light and dark", result: "0 serious or critical", note: "Also zero moderate issues. Reproduce with npm run audit." },
    { test: "Lighthouse, desktop, landing page", cases: "4 categories, 3 runs on the live deployment", result: "91 to 96 / 100 / 100 / 100", note: "Performance, accessibility, best practices, SEO. Performance is published as a range because a single run depends on whether the webfont beats the largest paint. Reproduce with npm run audit." },
    { test: "Document reading: institution and number", cases: "3 sample documents", result: "Needs API key", note: "Run npm run eval with ANTHROPIC_API_KEY to fill this row." },
    { test: "Debate: Challenger finds the planted issue", cases: "3 scenarios with a planted risk", result: "Needs API key", note: "For example a nominee name spelled differently from the ID." },
  ],
};
