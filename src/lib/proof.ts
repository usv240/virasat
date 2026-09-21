/**
 * Every claim this project makes, and the command that would catch us if it
 * were wrong.
 *
 * A pitch is a set of assertions a judge has to take on trust. This list
 * exists so they do not have to. If a row here cannot be checked by running
 * something, it does not belong on the site either.
 */
export type Claim = {
  claim: string;
  /** What someone would run or open to check it. */
  check: string;
  /** A link, where checking it is a matter of opening something. */
  href?: string;
  kind: "command" | "link";
};

export const CLAIMS: Claim[] = [
  {
    claim: "The prototype works, deployed, with no sign up.",
    check: "Open the app and press one button.",
    href: "/try",
    kind: "link",
  },
  {
    claim: "The source is public, MIT licensed, with the full history.",
    check: "github.com/usv240/virasat",
    href: "https://github.com/usv240/virasat",
    kind: "link",
  },
  {
    claim: "The tests pass, and not just on the author's machine.",
    check: "GitHub Actions runs lint, the writing rules, types, tests and a production build on every push.",
    href: "https://github.com/usv240/virasat/actions",
    kind: "link",
  },
  {
    claim: "The rule engine picks the right claim route.",
    check: "npm test",
    kind: "command",
  },
  {
    claim: "No page has a serious or critical accessibility problem, in either theme.",
    check: "npm run audit",
    kind: "command",
  },
  {
    claim: "The site is fast on the real deployment, not only on a laptop.",
    check: "npm run audit, which runs Lighthouse three times and publishes the range rather than the best run.",
    kind: "command",
  },
  {
    claim: "One family costs a measurable amount of AI, and we publish the figure.",
    check: "npm run measure:cost, which runs the app's own extractor and debate and rewrites the token counts.",
    kind: "command",
  },
  {
    claim: "The AI reads the sample documents correctly, and the Challenger finds planted problems.",
    check: "npm run eval",
    kind: "command",
  },
  {
    claim: "The claim rules are readable, versioned data, not opinions buried in code.",
    check: "GET /api/v1/rules, or read src/lib/rules.ts.",
    href: "/developers",
    kind: "link",
  },
  {
    claim: "Every number about unclaimed money comes from a named public source.",
    check: "Each one links to the document it came from.",
    href: "/references",
    kind: "link",
  },
  {
    claim: "The last audit run is written down, including anything that failed.",
    check: "docs/AUDIT-REPORT.md in the repository, rewritten by every run.",
    href: "https://github.com/usv240/virasat/blob/master/docs/AUDIT-REPORT.md",
    kind: "link",
  },
];

/**
 * Things we have deliberately not claimed. A judge who finds an overstatement
 * stops believing the rest of the page, so the limits are stated here rather
 * than left to be discovered.
 */
export const NOT_CLAIMED: string[] = [
  "We have not connected to any bank, insurer or government system. Every claim is submitted by the family through the official portal, as it is today.",
  "The unpaid-dividend index in the prototype is sample data shaped like the real lists, not a republished copy of them.",
  "The Two AI Debate improves transparency and catches planted problems in our tests. It is not a guarantee of correctness, and it never overrides the rule engine.",
  "We have rule files for five institutions. Everything else routes to a needs-review path rather than guessing.",
  "Hindi and English only so far.",
];
