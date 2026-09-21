# Virasat

**Find and claim your family's money.** Take a photo of old papers. Virasat finds where the money is (bank, insurance, provident fund, shares), explains what to do in your language, and fills the forms.

Built by Team USV for the Global Innovation Hackathon 2026: Build for a Better Future.

**Live app: https://virasat-indol.vercel.app**  
Start at [/try](https://virasat-indol.vercel.app/try) for the one click walkthrough, or [/judges](https://virasat-indol.vercel.app/judges) for the scoring map.

## The problem in one line

About ₹1.84 lakh crore of Indians' own money lies unclaimed (Finance Minister, October 2025). Families do not know it exists, it is spread across many portals, claiming is confusing, and agents charge 5 to 15 percent to help.

## What Virasat does

| Step | What happens |
|---|---|
| Find | Photograph a passbook, policy bond, share certificate or PF slip, or upload the income tax statement (AIS). Virasat lists every place the family may have money, with a confidence per field. |
| Claim | A rule engine (one tested rule file per institution) decides the route: nominee, legal heir, or court certificate. Two AI reviewers argue for and against it, a referee explains. Virasat fills the claim form and cover letter (English and Hindi) into a PDF claim pack. |
| Track | Every claim has a status, a next action, and an escalation path to the ombudsman after 30 days. |
| Prevent | The Parivaar Vault records every account and checks that each has a nominee. |

Everything works with no sign-up on sample data: open `/try`.

## Run it in one minute

```bash
npm install
cp .env.example .env.local   # optional: ANTHROPIC_API_KEY=sk-ant-... for live AI
npm run dev                  # http://localhost:3000
```

Without a key the app runs in Sample mode: AI steps replay pre-computed results for the sample family, and the whole demo still works end to end. With a key, your own photos are read live and the Two AI Debate runs live. You can also paste your own key in the app's Help tab (Bring Your Own Key); it stays in your browser.

## Checks

```bash
npm run verify     # lint, writing check (no emojis, no em dashes), tests, type check
npm test           # 23 tests: rule engine, AIS parser, claim pack PDF, dividend search
npm run eval       # measures the AI: document reading and the debate (needs an API key)
npm run build      # production build
```

Measured on the current build:

| Check | Result |
|---|---|
| Automated tests | 23 of 23 pass |
| Accessibility (axe, WCAG 2.2 AA), 10 pages, light and dark | 0 serious or critical, 0 moderate |
| Lighthouse, landing page | Live deployment, mobile: 96 performance, 100 accessibility, 100 best practices, 100 SEO. Localhost, desktop: 99 performance. |
| Writing check | no emojis, no em or en dashes |

## Technology stack

| Layer | Choice |
|---|---|
| App | Next.js 16 (App Router, TypeScript), React 19, Tailwind CSS 4 |
| AI | Anthropic SDK, model `claude-opus-5`, structured outputs (Zod schemas), prompt caching |
| Documents | pdf-parse (AIS tables), pdf-lib (claim pack PDFs) |
| Voice | Browser Web Speech API (speech recognition and text to speech), Hindi and English |
| Languages | English and Hindi across every screen, the rule engine output and the AI debate |
| Data | Family data in the browser (localStorage). Nothing personal is stored on the server. |
| API | Route handlers under `/api/v1`, API keys (`vs_test_demo` sandbox), rate limit headers, RFC 9457 errors |
| Quality | ESLint, Vitest, TypeScript strict, writing check, Playwright screenshots in light and dark, mobile and desktop |

## Pages

| Route | What it is |
|---|---|
| `/` | Landing page: problem, how it works, live demo, the Two AI Debate, impact and savings calculator, trust, developers, technology, roadmap, FAQ, glossary, sources |
| `/try` | The product with Sunita's sample papers loaded |
| `/app` | The product, empty, for your own papers |
| `/judges` | Judge Mode: criteria map, what is real and what is sample, deliverables |
| `/developers` | API docs, playground, Bring Your Own Data, Key and Rules |
| `/how-ai-works` | Transparency: what the AI does and never does, test results, limits |
| `/glossary`, `/references`, `/privacy`, `/accessibility` | Supporting pages |

Top bar on every page: language (English, Hindi), theme (system, light, dark), and Simple or Technical mode. Info buttons explain every feature. The help button is in the same place on every page.

## Public API

```bash
curl -X POST $HOST/api/v1/claims/route \
  -H "Authorization: Bearer vs_test_demo" -H "Content-Type: application/json" \
  -d '{"input":{"assetType":"bank","institution":"State Bank of India","amountInr":158420,"nomineePresent":true,"jointHolder":false,"claimantRelation":"spouse","otherHeirs":true}}'
```

Endpoints: `POST /extract`, `POST /ais/parse`, `POST /claims/route`, `POST /claims/pack`, `GET /dividends/search`, `GET|POST /rules`, `GET /health`. Full docs and a playground at `/developers`.

## Repository layout

```
src/app/            pages and API route handlers
src/components/     design system (ui.tsx), top bar, footer, help, landing sections, the app (find, claim, track, vault)
src/lib/            rules engine, portals, AIS parser, extraction, debate, forms, sample data, store
tests/              vitest tests
scripts/            sample AIS generator, writing check
public/samples/     synthetic sample documents (all names and numbers are made up)
../projects/        the full plan, technical design and UX specification
```

## Honesty

- Sunita, Ramesh, their papers and amounts are made up.
- The unpaid-dividend index is sample data in the same shape as companies' public lists.
- Rule files exist for SBI, LIC, EPFO, IEPF and India Post. Other institutions get a "needs review" route.
- Virasat never logs in to any portal, never asks for passwords, and never submits anything for you.
- This is guidance from public sources, not legal advice.

## Licence and credits

MIT. Third-party resources are listed in `CREDITS.md`. Sources for every number are on `/references`.
