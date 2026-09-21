/** Published on /how-ai-works. Updated by `npm test` (rules and parser) and `npm run eval` (AI rows). */
export const EVAL_RESULTS = {
  description: "We test the parts that must be right. The rule engine and the AIS parser are tested by code and run on every change. The AI rows come from a scripted run on the sample documents and need an API key.",
  lastRun: "2026-09-21",
  rows: [
    { test: "Rule engine: correct route", cases: "24 scenarios across 5 institutions", result: "24 of 24", note: "Every rule set has tests for nominee, no nominee under and over the threshold, joint holder and unknown nominee." },
    { test: "AIS parser: rows found", cases: "3 synthetic statements", result: "13 of 13 rows", note: "Interest, dividend and mutual fund tables." },
    { test: "Claim pack builds", cases: "5 institutions", result: "5 of 5", note: "PDF opens, fields filled, three pages." },
    { test: "Accessibility (axe, WCAG 2.2 AA)", cases: "11 pages, light and dark", result: "0 serious or critical", note: "Also zero moderate issues. Reproduce with npm run audit." },
    { test: "Lighthouse, landing page, live deployment", cases: "2 profiles, 3 runs each", result: "Desktop 99 to 100, mobile 90 or better", note: "Performance. Accessibility, best practices and SEO are 100 on both. Mobile has ranged from 90 to 96 across runs, because on a throttled connection the score turns on whether the webfont arrives before the largest paint, so the floor is what we claim. Layout shift is 0 to 0.024 against a 0.1 threshold, from the hero stat card moving when the webfont reflows the heading above it. Mobile is Lighthouse's throttled phone, which is closer to the families this is for, so the lower number is the one that matters. Reproduce with npm run audit." },
    { test: "Document reading: institution, number, holder, nominee", cases: "3 sample documents, 12 fields", result: "12 of 12", note: "Measured with npm run eval on 2026-09-21." },
    { test: "Debate: Challenger finds the planted problem", cases: "3 scenarios with a known problem", result: "3 of 3 (a single reviewer found 3 of 3)", note: "Name mismatch, amount at the threshold, lapsed policy. On these cases the debate found no more than a single reviewer did. We publish that because it is the result. The case for the debate is that a family can read the disagreement and that the Referee can only raise caution, not accuracy on cases this clear. Measured on 2026-09-21." },
  ],
};
