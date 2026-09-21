import Link from "next/link";
import { Explain } from "@/components/explain";
import { clsx } from "clsx";
import { Card, Section } from "@/components/ui";

export const metadata = { title: "Virasat for judges" };

const CRITERIA = [
  ["Innovation and Originality", "25%", "The tax statement (AIS) asset map and the photo-to-claim flow exist in no other product. The Two AI Debate checks every route in the open. Institutions can bring their own rules.", "/try", "Find tab: use the sample AIS; Claim tab: see the debate"],
  ["Technical Implementation", "25%", "Multimodal AI with strict JSON schemas, a versioned rule engine with 5 institutions, an AIS table parser, PDF claim packs, browser voice in and out, a public API with keys, rate limits and problem-details errors, light and dark themes.", "/developers", "API docs and playground; Technical mode on the home page"],
  ["Real-World Impact", "20%", "₹1.84 lakh crore is unclaimed. Gujarat's camps returned ₹38,700 per family on average. One family like Sunita's keeps up to ₹63,000 that an agent would take.", "/#impact", "Impact section and savings calculator"],
  ["Feasibility and Scalability", "15%", "No private data access needed: official public portals, guided. Rules are files. One deployment serves many institutions. Free for families; institutions and service centres pay.", "/#roadmap", "Roadmap and the Data section"],
  ["User Experience and Design", "10%", "Measured, not claimed: zero serious or critical axe violations across 10 pages in both themes, and Lighthouse on the live deployment of 91 to 96 performance across repeated runs, 100 accessibility, 100 best practices, 100 SEO. Full Hindi including the claim route and checklist, voice in and out, 44 px controls, info buttons everywhere, works at 320 px.", "/how-ai-works", "Test results on the Transparency page"],
  ["Presentation and Demonstration", "5%", "Sunita's story runs end to end in 3 minutes on sample data with one click. A reset button restores it.", "/try", "Try it"],
];

// Each row carries its own status, so the list stays honest if something is
// still outstanding rather than showing a green dot for everything.
const DELIVERABLES: [string, string, string, "done" | "pending"][] = [
  ["Working prototype", "This site. Try it with sample data in one click.", "/try", "done"],
  ["Project description", "The home page, sections Problem to Roadmap. Also a one page version in the repository.", "/", "done"],
  ["Source code", "Public GitHub repository, MIT licensed, with the full commit history.", "https://github.com/usv240/virasat", "done"],
  ["Documentation", "README, technical design, UX spec and API docs.", "/developers", "done"],
  ["Demonstration video", "Being recorded against this deployment. The shot by shot script is in the repository.", "https://github.com/usv240/virasat/blob/master/docs/VIDEO-SCRIPT.md", "pending"],
  ["Pitch deck", "The final deck, as a PDF you can open right now.", "/docs/Virasat-Team-USV-Deck.pdf", "done"],
  ["Technology stack", "Technology section, and Technical mode on every page.", "/#technology", "done"],
  ["Demo link", "This deployment, at virasat-indol.vercel.app.", "/", "done"],
];


// The question every informed Indian judge asks first: RBI already runs UDGAM,
// so why does this need to exist? Answered with capabilities, not adjectives.
const COMPARISON: [string, string, string, string][] = [
  ["Covers banks, insurance, provident fund, shares and mutual funds in one place", "No. One portal per asset type: UDGAM for banks, IEPF for shares, MITRA for mutual funds, Bima Bharosa for insurance", "Sometimes, for a share of the money", "Yes"],
  ["Finds accounts the family never knew existed", "No. You must already know the bank and the name to search", "Rarely", "Yes. The AIS lists every institution that paid them"],
  ["Reads a photograph of an old passbook or policy", "No", "No", "Yes"],
  ["Tells you which claim route applies, and why", "No", "Yes, but you cannot check the reasoning", "Yes. A versioned rule engine, with the rule id shown"],
  ["Fills the claim forms for you", "No", "Yes", "Yes. A claim pack PDF, ready to submit"],
  ["Works in Hindi, including the claim route and checklist", "Partly", "In person only", "Yes, and it reads aloud"],
  ["Tracks the claim and escalates if nobody replies", "No", "Sometimes", "Yes. Escalation to the ombudsman after 30 days"],
  ["Cost to the family", "Free", "10 to 30 percent of the money", "Free"],
];

const REAL = [
  "Document reading with AI (when an API key is set, or with your own key)",
  "AIS PDF parsing by code",
  "Rule engine for SBI, LIC, EPFO, IEPF and India Post",
  "Claim pack PDF generation",
  "The Two AI Debate (live with a key)",
  "Voice in and out in the browser",
  "Guided portal steps and deep links",
  "Public API with keys, rate limits and validation",
  "Light, dark, Simple and Technical modes",
  "Full Hindi: every screen, the rule engine output, and the debate",
  "Zero serious axe violations on 10 pages, live; Lighthouse 91 to 96, 100, 100, 100, live",
];

const SAMPLE = [
  "Sunita and Ramesh, their papers and amounts are made up",
  "The AIS PDF is synthetic",
  "The unpaid-dividend index has made-up names in the same shape as real company lists",
  "Without an API key, the AI steps replay pre-computed results for the sample papers",
];

const PLANNED = [
  "WhatsApp channel",
  "DigiLocker login and certificate fetch",
  "Account Aggregator consent for live bank data",
  "Marathi, Tamil, Telugu and Bengali",
  "A server database with OTP login for families who want to save across devices",
  "Real dividend lists fetched from company investor pages",
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
            <li key={s} className="rounded-card border border-border bg-raised p-4 text-sm"><span className="mb-1 block text-2xl font-semibold text-brand">{i + 1}</span><Explain text={s} /></li>
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
                  <td className="p-3"><Explain text={claim} /></td>
                  <td className="p-3"><Link href={href} className="text-brand underline">{where}</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section eyebrow="Why this is needed" title="What already exists, and what it still does not do">
        <p className="max-w-3xl">The government portals are good and we send people to them by name. They answer a different question: they let you search one place, if you already know what you are looking for. Nothing joins the picture together, and nothing helps with the part families actually get stuck on, which is the claim itself.</p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="bg-brand text-left text-brand-contrast">
                <th className="p-3">Can a family do this today?</th>
                <th className="p-3">Government portals</th>
                <th className="p-3">A private agent</th>
                <th className="p-3">Virasat</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map(([cap, portal, agent, us]) => (
                <tr key={cap} className="border-b border-border align-top odd:bg-raised">
                  <td className="p-3 font-semibold"><Explain text={cap} /></td>
                  <td className="p-3 text-muted"><Explain text={portal} /></td>
                  <td className="p-3 text-muted">{agent}</td>
                  <td className="p-3 font-medium text-brand-strong"><Explain text={us} /></td>
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
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-7">
              {REAL.map((x) => <li key={x}><Explain text={x} /></li>)}
            </ul>
          </Card>
          <Card>
            <h3 className="text-lg text-warning">Sample data</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-7">
              {SAMPLE.map((x) => <li key={x}><Explain text={x} /></li>)}
            </ul>
          </Card>
          <Card>
            <h3 className="text-lg text-info">Planned next</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-7">
              {PLANNED.map((x) => <li key={x}><Explain text={x} /></li>)}
            </ul>
          </Card>
        </div>
        <p className="mt-4 text-sm text-muted">In this prototype, all family data lives in the browser. Nothing personal reaches our servers unless the AI is asked to read a photo, and then the photo is not stored.</p>
      </Section>

      <Section eyebrow="Deliverables" title="Everything the rules ask for" tone="surface">
        <ul className="grid gap-3 md:grid-cols-2">
          {DELIVERABLES.map(([d, w, href, status]) => (
            <li key={d} className="flex items-start gap-3 rounded-card border border-border bg-raised p-4 text-sm">
              <span className={clsx("mt-0.5 inline-block h-5 w-5 shrink-0 rounded-full", status === "done" ? "bg-success" : "bg-warning")} aria-hidden />
              <span>
                <span className="font-semibold">{d}:</span>{" "}
                <span className="sr-only">{status === "done" ? "Complete." : "In progress."}</span>
                <Explain text={w} />{" "}
                {href.startsWith("http") ? (
                  <a href={href} target="_blank" rel="noreferrer" className="text-brand underline">Open<span className="sr-only"> (opens in a new tab)</span></a>
                ) : (
                  <Link href={href} className="text-brand underline">Open</Link>
                )}
              </span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
