# Virasat: project description

**Team USV** · Global Innovation Hackathon 2026: Build for a Better Future · Project Submission round

**Source code:** https://github.com/usv240/virasat  
**Live app:** https://virasat-indol.vercel.app · **Walkthrough:** https://virasat-indol.vercel.app/try · **For judges:** https://virasat-indol.vercel.app/judges

---

## Problem statement

About **₹1.84 lakh crore** of Indians' own money is lying unclaimed in bank deposits, insurance policies, provident fund accounts and shares (Union Finance Minister, October 2025). ₹72,454 crore sits in old bank accounts alone, now parked with the Reserve Bank of India.

The money stays stuck for four reasons:

1. **Nobody knew it existed.** One family member held the account or policy and never told anyone.
2. **It is spread across too many places.** Banks, insurers, EPFO, IEPF, mutual funds and the post office each have a separate website, mostly in English.
3. **Claiming is confusing.** Nominee or legal heir? Which certificate? Which form? Recovery agents charge 5 to 15 percent to help.
4. **It keeps happening.** Accounts without a nominee become new unclaimed money every year.

The people who lose the most are women managing on their own, elderly parents, and families in small towns and villages. Only about 8.5 lakh people have ever used RBI's search portal, in a country of 140 crore.

## Proposed solution

Virasat is a web application that takes a family from a box of old papers to a ready claim.

| Step | What the family does | What Virasat does |
|---|---|---|
| **Find** | Photographs a passbook, policy bond, share certificate or PF slip, or uploads the income tax statement (AIS) | Reads each document with AI and lists every place the family may have money, with a confidence level per field and the exact portal to search |
| **Claim** | Answers three plain questions | A tested rule engine picks the route (nominee, legal heir, or court certificate), lists the documents, and generates a filled claim pack as a PDF: claim form, cover letter in English and Hindi, and the checklist |
| **Track** | Updates the status as it moves | Shows the next action and, after 30 days of silence, pre-writes the ombudsman complaint |
| **Prevent** | Records the family's accounts | Checks that each one has a nominee, so the next generation never has to search |

Everything works in **English and Hindi**, by text and by voice, in light and dark mode, on a phone or a laptop. No sign-up is needed to try it.

## Innovation

1. **The tax statement becomes an asset map.** A legal heir can obtain the account holder's Annual Information Statement, which lists interest from every bank and dividends from every company. Virasat parses it into a list of places to claim from, even when the family has no papers at all. No other product does this.
2. **The Two AI Debate.** Before a route is shown, one AI argues for it, a second hunts for what could go wrong (name mismatches, amounts near a threshold, lapsed policies), and a third gives a verdict with reasons, risks and a next step. The referee can only make the advice more careful; it can never overrule the rule engine.
3. **Safety by separation.** The AI reads, explains and translates. Every legal decision comes from a deterministic, versioned, unit-tested rule engine, so the same input always gives the same answer and an institution can audit it.
4. **Bring Your Own data, key and rules.** A bank can send its own claim rules as a JSON file and see them applied and recorded per claim.
5. **Prevention, not only recovery.** The Parivaar Vault and its nominee check stop the next loss.

## Technology

Next.js 16 and React 19 with TypeScript, Tailwind CSS 4. Claude Opus 5 through the official Anthropic SDK, with structured outputs (JSON schemas) so the interface never breaks on an unexpected answer, and prompt caching to cut cost. pdf-parse reads AIS tables; pdf-lib builds the claim packs. The browser's own speech engine handles voice in and out, so voice costs nothing. Family data stays in the browser; nothing personal is stored on the server. A public REST API under `/api/v1` with API keys, rate-limit headers, RFC 9457 errors and a browser playground.

## Impact

- Returning even **0.1 percent** of the unclaimed pool puts **₹184 crore** back with families. Gujarat's manual claim camps returned ₹104 crore across 26,874 claims, an average of **₹38,700 per family**.
- A family like our example keeps **up to ₹63,000** that a recovery agent would have taken on a ₹4.2 lakh claim, plus about 20 days of office visits.
- Running cost is about **₹36 of AI per family**, measured against the live API rather than estimated, so a service centre can charge a small fixed fee instead of a percentage. That is roughly **1,060 rupees recovered per rupee of compute**. We publish the cold prompt cache figure; a warm cache measures ₹33. The full arithmetic is on the Proof page, and `npm run measure:cost` reproduces it.
- It scales a national mission: the Aapki Poonji Aapka Adhikar campaign, RBI UDGAM, SEBI MITRA and IRDAI Bima Bharosa all exist, but reach few people. Virasat is the layer that gets families to them.

## What is built and measured

- 12 pages and 9 API routes, deployed as a production build; `/try` runs the whole journey on sample data in one click.
- **47 automated tests** covering the rule engine for five institutions, the AIS parser, claim pack generation and the dividend search.
- **Accessibility: zero serious or critical axe violations** across 11 pages in both light and dark themes.
- **Lighthouse on the live deployment, three runs of each profile: desktop 99 to 100 performance with a 0.8 s largest paint, mobile on a throttled connection never below 90, having ranged from 90 to 96 across runs, with a 3.5 s largest paint. Both profiles 100 accessibility, 100 best practices and 100 SEO, with layout shift between 0 and 0.024 against a 0.1 threshold.** The range is published rather than the best run, and `npm run audit` reproduces it.
- An evaluation script (`npm run eval`) measures document reading accuracy and how often the Challenger catches a planted problem, and publishes the numbers on the Transparency page.

## Honesty

Sunita, Ramesh, their papers and amounts are made up. The unpaid-dividend index is sample data in the same shape as companies' public lists. Rule files exist for SBI, LIC, EPFO, IEPF and India Post; other institutions get a "needs review" route. Virasat never logs in to a portal, never asks for passwords, never bypasses an OTP, and never submits anything on the family's behalf. It is guidance built from public sources, not legal advice.
