import Link from "next/link";
import { Card, Section } from "@/components/ui";

export const metadata = { title: "Virasat for judges" };

const CRITERIA = [
  ["Innovation and Originality", "25%", "The tax statement (AIS) asset map and the photo-to-claim flow exist in no other product. The Two AI Debate checks every route in the open. Institutions can bring their own rules.", "/try", "Find tab: use the sample AIS; Claim tab: see the debate"],
  ["Technical Implementation", "25%", "Multimodal AI with strict JSON schemas, a versioned rule engine with 5 institutions, an AIS table parser, PDF claim packs, browser voice in and out, a public API with keys, rate limits and problem-details errors, light and dark themes.", "/developers", "API docs and playground; Technical mode on the home page"],
  ["Real-World Impact", "20%", "₹1.84 lakh crore is unclaimed. Gujarat's camps returned ₹38,700 per family on average. One family like Sunita's keeps up to ₹63,000 that an agent would take.", "/#impact", "Impact section and savings calculator"],
  ["Feasibility and Scalability", "15%", "No private data access needed: official public portals, guided. Rules are files. One deployment serves many institutions. Free for families; institutions and service centres pay.", "/#roadmap", "Roadmap and the Data section"],
  ["User Experience and Design", "10%", "Measured, not claimed: zero serious or critical axe violations across 10 pages in both themes, and Lighthouse 99 performance, 100 accessibility, 100 best practices, 100 SEO. Full Hindi including the claim route and checklist, voice in and out, 44 px controls, info buttons everywhere, works at 320 px.", "/how-ai-works", "Test results on the Transparency page"],
  ["Presentation and Demonstration", "5%", "Sunita's story runs end to end in 3 minutes on sample data with one click. A reset button restores it.", "/try", "Try it"],
];

const DELIVERABLES = [
  ["Working prototype", "This site. Try it with sample data in one click.", "/try"],
  ["Project description", "The home page, sections Problem to Roadmap.", "/"],
  ["Source code", "GitHub repository (link in the README).", "/developers#source"],
  ["Documentation", "README, projects folder (plan, technical design, UX spec), API docs.", "/developers"],
  ["Demonstration video", "Linked from the README and the submission form.", "/developers#source"],
  ["Pitch deck", "Submitted with the idea round; updated for the final.", "/developers#source"],
  ["Technology stack", "Technology section, Technical mode.", "/#technology"],
  ["Demo link", "This deployment.", "/"],
];

export default function JudgesPage() {
  return (
    <>
      <Section eyebrow="For judges" title="Two minutes, everything mapped to the criteria" h1>
        <p className="max-w-3xl text-lg">Thank you for your time. This page maps each judging criterion from the rules to a claim and a proof you can open. It also says plainly what is real, what is sample data, and what is planned.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/try" className="inline-flex min-h-12 items-center rounded-lg bg-brand px-5 font-semibold text-brand-contrast">Start the 3-minute demo (sample data)</Link>
          <Link href="/#how" className="inline-flex min-h-12 items-center rounded-lg border border-border px-5 font-semibold">How it works</Link>
        </div>
        <ol className="mt-8 grid gap-3 md:grid-cols-5">
          {["Open Try it. Sunita's three papers and the AIS are already loaded.", "Find tab: see the asset map, press Search here on one row to see the guided portal steps.", "Claim tab: pick SBI, answer three questions, press Get my route. Read the verdict and open the full debate.", "Download the claim pack PDF. Then open Track and Vault.", "Switch to dark mode, Hindi, and Technical mode from the top bar. Press any info button."].map((s, i) => (
            <li key={s} className="rounded-card border border-border bg-raised p-4 text-sm"><span className="mb-1 block text-2xl font-semibold text-brand">{i + 1}</span>{s}</li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="Criteria map" title="Where each criterion is proven" tone="surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead><tr className="bg-brand text-left text-brand-contrast"><th className="p-3">Criterion (weight)</th><th className="p-3">Our claim</th><th className="p-3">See the proof</th></tr></thead>
            <tbody>
              {CRITERIA.map(([c, w, claim, href, where]) => (
                <tr key={c} className="border-b border-border align-top odd:bg-raised">
                  <td className="p-3 font-semibold">{c} <span className="text-muted">({w})</span></td>
                  <td className="p-3">{claim}</td>
                  <td className="p-3"><Link href={href} className="text-brand underline">{where}</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section eyebrow="Honesty" title="What is real, what is sample, what is planned">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <h3 className="text-lg text-success">Real and working</h3>
            <ul className="mt-2 list-disc pl-5 text-sm">
              <li>Document reading with AI (when an API key is set, or with your own key)</li><li>AIS PDF parsing by code</li><li>Rule engine for SBI, LIC, EPFO, IEPF and India Post</li><li>Claim pack PDF generation</li><li>The Two AI Debate (live with a key)</li><li>Voice in and out in the browser</li><li>Guided portal steps and deep links</li><li>Public API with keys, limits and validation</li><li>Light, dark, Simple and Technical modes</li><li>Full Hindi: every screen, the rule engine output, and the debate</li><li>Zero serious axe violations on 10 pages; Lighthouse 99, 100, 100, 100</li>
            </ul>
          </Card>
          <Card>
            <h3 className="text-lg text-warning">Sample data</h3>
            <ul className="mt-2 list-disc pl-5 text-sm">
              <li>Sunita and Ramesh, their papers and amounts are made up</li><li>The AIS PDF is synthetic</li><li>The unpaid-dividend index has made-up names in the same shape as real company lists</li><li>Without an API key, the AI steps replay pre-computed results for the sample papers</li>
            </ul>
          </Card>
          <Card>
            <h3 className="text-lg text-info">Planned next</h3>
            <ul className="mt-2 list-disc pl-5 text-sm">
              <li>WhatsApp channel</li><li>DigiLocker login and certificate fetch</li><li>Account Aggregator consent for live bank data</li><li>Marathi, Tamil, Telugu and Bengali</li><li>A server database with OTP login for families who want to save across devices</li><li>Real dividend lists fetched from company investor pages</li>
            </ul>
          </Card>
        </div>
        <p className="mt-4 text-sm text-muted">In this prototype, all family data lives in the browser. Nothing personal reaches our servers unless the AI is asked to read a photo, and then the photo is not stored.</p>
      </Section>

      <Section eyebrow="Deliverables" title="Everything the rules ask for" tone="surface">
        <ul className="grid gap-3 md:grid-cols-2">
          {DELIVERABLES.map(([d, w, href]) => (
            <li key={d} className="flex items-start gap-3 rounded-card border border-border bg-raised p-4 text-sm">
              <span className="mt-0.5 inline-block h-5 w-5 shrink-0 rounded-full bg-success" aria-hidden />
              <span><span className="font-semibold">{d}:</span> {w} <Link href={href} className="text-brand underline">Open</Link></span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
