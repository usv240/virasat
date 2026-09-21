# Audit report

Produced by `npm run audit`. Every number published on the site comes from this run.
Re-run it yourself: the command that produced each row is in the table.

- Audited: https://virasat-indol.vercel.app
- When: 2026-09-21 15:29 UTC
- Commit: 32df376
- Result: all checks passed

| Check | How | Result |
| --- | --- | --- |
| Lint | `npm run lint` | No errors |
| Writing rules | `npm run check:writing` | No emojis, no dashes, plain words |
| Types | `npx tsc --noEmit` | No type errors |
| Tests | `npm test` | All green |
| Production build | `npm run build` | Builds clean |
| Accessibility (axe, WCAG 2.2 AA) | `11 pages, light and dark` | 0 serious or critical, 0 moderate |
| Lighthouse (desktop) | `3 runs against https://virasat-indol.vercel.app` | performance 99 to 100, accessibility 100, best practices 100, SEO 100, LCP 0.8 s, CLS 0.000 to 0.001 |
| Lighthouse (mobile) | `3 runs against https://virasat-indol.vercel.app` | performance 91 to 92, accessibility 100, best practices 100, SEO 100, LCP 3.4 s, CLS 0.000 to 0.024 |
| Every page answers | `HTTP GET on 11 pages` | 11 of 11 return 200 |
