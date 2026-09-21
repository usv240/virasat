/**
 * What we did not build, and who we owe for it.
 *
 * The hackathon rules ask that third-party resources be properly acknowledged,
 * and the honest reading of that is not a line saying "built with open source".
 * It is a list with licences on it. A test keeps this list matching the real
 * dependencies, so it cannot quietly go stale the way credits usually do.
 */
export type Credit = { name: string; licence: string; url: string; what: string };

/** Ships to the family's browser, or runs on the server serving them. */
export const RUNTIME: Credit[] = [
  { name: "Next.js", licence: "MIT", url: "https://nextjs.org", what: "The framework: routing, rendering and the build." },
  { name: "React", licence: "MIT", url: "https://react.dev", what: "The user interface." },
  { name: "Tailwind CSS", licence: "MIT", url: "https://tailwindcss.com", what: "Styling, and the light and dark tokens." },
  { name: "TypeScript", licence: "Apache-2.0", url: "https://www.typescriptlang.org", what: "Types, checked on every push." },
  { name: "Zod", licence: "MIT", url: "https://zod.dev", what: "Validates the rule files and the shapes the AI must return." },
  { name: "Anthropic TypeScript SDK", licence: "MIT", url: "https://github.com/anthropics/anthropic-sdk-typescript", what: "Talks to the model that reads documents and holds the debate." },
  { name: "lucide-react", licence: "ISC", url: "https://lucide.dev", what: "The icons." },
  { name: "clsx", licence: "MIT", url: "https://github.com/lukeed/clsx", what: "Joins class names." },
  { name: "pdf-lib", licence: "MIT", url: "https://pdf-lib.js.org", what: "Builds the claim pack PDF." },
  { name: "pdf-parse", licence: "Apache-2.0", url: "https://mehmet-kozan.github.io/pdf-parse/", what: "Reads the text out of a tax statement PDF." },
  { name: "js-yaml", licence: "MIT", url: "https://github.com/nodeca/js-yaml", what: "Reads rule files written in YAML." },
  { name: "Inter and Noto Sans Devanagari", licence: "SIL Open Font Licence 1.1", url: "https://fonts.google.com/specimen/Noto+Sans+Devanagari", what: "The typefaces, including the Hindi one." },
];

/** Used to build and to check the work. Never reaches a visitor. */
export const TOOLING: Credit[] = [
  { name: "Vitest", licence: "MIT", url: "https://vitest.dev", what: "Runs the test suite." },
  { name: "ESLint", licence: "MIT", url: "https://eslint.org", what: "Catches mistakes before they ship." },
  { name: "Playwright", licence: "Apache-2.0", url: "https://playwright.dev", what: "Drives a real browser for the accessibility audit." },
  { name: "axe-core", licence: "MPL-2.0", url: "https://www.deque.com/axe/", what: "Finds the accessibility violations we then fix." },
  { name: "Lighthouse", licence: "Apache-2.0", url: "https://developer.chrome.com/docs/lighthouse", what: "Measures performance on desktop and on a throttled phone." },
  { name: "PptxGenJS", licence: "MIT", url: "https://gitbrent.github.io/PptxGenJS/", what: "Builds the pitch deck from code, so it rebuilds when a number changes." },
  { name: "sharp", licence: "Apache-2.0", url: "https://sharp.pixelplumbing.com", what: "Prepares the screenshots in the deck." },
  { name: "react-icons", licence: "MIT", url: "https://github.com/react-icons/react-icons", what: "Icons inside the deck." },
  { name: "tsx", licence: "MIT", url: "https://tsx.hirok.io", what: "Runs the audit and cost scripts." },
];

/** Where the product runs, and what it depends on to stay up. */
export const SERVICES: Credit[] = [
  { name: "Vercel", licence: "Commercial, free tier", url: "https://vercel.com", what: "Hosts the deployment the judges are looking at." },
  { name: "GitHub Actions", licence: "Commercial, free tier", url: "https://github.com/features/actions", what: "Runs lint, types and tests on every push." },
  { name: "Upstash Redis", licence: "Commercial, free tier", url: "https://upstash.com", what: "One shared rate-limit counter across every serverless instance, over its REST API. Optional; without it the limit is per instance and the response header says so." },
  { name: "Anthropic API", licence: "Commercial, pay as you go", url: "https://www.anthropic.com", what: "The model behind document reading and the debate. You can bring your own key instead." },
];

/**
 * Rule 11 says AI development tools are allowed and that we stay responsible
 * for what we submit. Saying which ones, and what we did to discharge that
 * responsibility, is better than leaving a panel to wonder.
 */
export const HOW_IT_WAS_BUILT = {
  tools: "Claude Code, by one developer, over the hackathon period.",
  responsibility: [
    "Every claim on this site is re-checked by one command, npm run audit, which writes down failures as readily as passes.",
    "The rule engine, the part that decides what a family is told to do, is covered by tests and is never decided by a model.",
    "The sources behind every number are listed on this page, and were read rather than taken on trust.",
    "Nothing here was submitted to another competition, and no code was copied from another project.",
  ],
};
