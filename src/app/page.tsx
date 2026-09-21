import Link from "next/link";
import { Camera, FileSearch, Bell, ShieldCheck, Mic, MessageSquare, Store, Scale, Lock, Trash2, UserCheck, Eye } from "lucide-react";
import { Card, InfoButton, Section, Stat, Technical } from "@/components/ui";
import { Hero } from "@/components/landing/hero";
import { SavingsCalculator } from "@/components/landing/savings-calculator";
import { DemoEmbed } from "@/components/landing/demo-embed";
import { DebateExample } from "@/components/landing/debate-example";
import { Faq } from "@/components/landing/faq";
import { Explain } from "@/components/explain";
import { Term } from "@/components/term";
import { Reveal } from "@/components/reveal";
import { GLOSSARY } from "@/lib/glossary";
import { REFERENCES } from "@/lib/references";

export default function Home() {
  return (
    <>
      <Hero />

      <div className="border-y border-border bg-accent-soft">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-sm">
          <span>Judging this project? Everything is mapped to the criteria, with proof.</span>
          <Link href="/judges" className="font-semibold text-brand-strong underline">Take the 2-minute Judge Tour</Link>
        </div>
      </div>

      {/* Problem */}
      <Section id="problem" eyebrow="The problem" title={<>Lakhs of families have money waiting for them. They just do not know it.</>}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal><Stat tone="brand" value="₹1.84 lakh crore" label="lying unclaimed across banks, insurance, provident fund and shares" source="Finance Minister, Oct 2025" sourceHref="/references#r1" /></Reveal>
          <Reveal delay={60}><Stat value="₹72,454 crore" label="in old bank accounts alone, now parked with RBI (Jan 2026)" source="Govt and RBI data" sourceHref="/references#r3" /></Reveal>
          <Reveal delay={120}><Stat value="20 lakh" label="people have used RBI's search portal so far, in a country of 140 crore" source="RBI to the Supreme Court, Apr 2026" sourceHref="/references#r4" /></Reveal>
          <Reveal delay={180}><Stat value="₹38,700" label="average returned per family in Gujarat's recent claim camps" source="All India Radio" sourceHref="/references#r5" /></Reveal>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            {[
              [Eye, "Nobody knew", "One family member held an FD, an LIC policy, a PF account or old shares. Nobody else knew about them."],
              [FileSearch, "Too many places", "Banks, insurance, PF, shares and the post office each have their own website, mostly in English."],
              [Scale, "Too confusing", "Nominee or legal heir? Which certificate? Which form? Every office asks for something different, and agents charge 5 to 15 percent to help."],
              [Bell, "It keeps happening", "Accounts without a nominee turn into new unclaimed money every year."],
            ].map(([Icon, h, d]) => {
              const I = Icon as typeof Eye;
              return (
                <div key={h as string} className="flex gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-brand-contrast"><I className="h-5 w-5" aria-hidden /></span>
                  <div>
                    <h3 className="text-lg font-semibold text-brand">{h as string}</h3>
                    <p className="text-text">{d as string}</p>
                  </div>
                </div>
              );
            })}
            <p className="text-muted">
              The people who lose the most: women managing on their own, elderly parents and families in small towns and villages.
              The Government started the <em>Aapki Poonji, Aapka Adhikar</em> campaign to fix this.
              <InfoButton label="Aapki Poonji, Aapka Adhikar">It means &quot;Your money, your right&quot;. A national campaign launched in October 2025 by the Finance Ministry, RBI, SEBI and IRDAI to return unclaimed money to its owners. Virasat helps families do exactly that.</InfoButton>
            </p>
          </div>
          <Card tone="brand" className="self-start">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">A story many families know</p>
            <h3 className="mt-2 text-2xl">Sunita, 58, Nashik</h3>
            <p className="mt-3 text-brand-contrast/90">When she had to take over the family finances from her husband Ramesh, she found a tin box of old papers: a passbook, an LIC bond and a share certificate.</p>
            <p className="mt-3 text-brand-contrast/90">She did not know what they were worth, where to go, or which form to fill. An agent offered to help, for a share of the money.</p>
            <p className="mt-4 text-xs text-brand-contrast/70">Example user story. Her documents are made up. You can follow her through the whole product.</p>
          </Card>
        </div>
      </Section>

      {/* How it works */}
      <Section id="how" eyebrow="How it works" title="Take a photo. Get your family's money back." tone="surface">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            [Camera, "1. Find", "Photograph old papers or upload the tax statement (AIS). Virasat lists every place your family may have money.", "Tax statement (AIS)", "The Annual Information Statement is a yearly statement from the Income Tax Department. It lists interest from every bank and dividends from every company paid to a person. As a legal heir you can get it, and it shows every account, even when you have no papers."],
            [FileSearch, "2. Claim", "Virasat picks the right route, lists the documents and fills the forms for you.", "Nominee or legal heir", "A nominee is a person named on the account to receive the money. A legal heir is a family member entitled by law. The route decides which documents you need. Virasat's rule engine decides it from fixed, tested rules."],
            [Bell, "3. Track", "Every claim has a status and reminders. If it is stuck, Virasat helps you escalate.", "Ombudsman", "The Banking Ombudsman is a free RBI service that resolves complaints against banks. Insurance and PF have their own. Virasat pre-fills the complaint after 30 days without a reply."],
            [ShieldCheck, "4. Prevent", "The Parivaar Vault keeps a family record and checks nominees, so your children never have to search.", "Parivaar Vault", "A private family record of every account and policy with a nominee check. New rules allow up to four nominees on a bank account. A missing nominee is the most common reason money gets stuck."],
          ].map(([Icon, h, d, il, it]) => {
            const I = Icon as typeof Camera;
            return (
              <Card key={h as string} interactive className="flex flex-col gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-brand-contrast"><I className="h-5 w-5" aria-hidden /></span>
                <h3 className="text-xl">{h as string} <InfoButton label={il as string}>{it as string}</InfoButton></h3>
                <p>{d as string}</p>
              </Card>
            );
          })}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {[[Mic, "Speak in your own language"], [MessageSquare, "Web now, WhatsApp next"], [Store, "Works through village service centres"]].map(([Icon, t]) => {
            const I = Icon as typeof Mic;
            return (
              <span key={t as string} className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-contrast"><I className="h-4 w-4" aria-hidden />{t as string}</span>
            );
          })}
        </div>
        <Technical>
          <p>Extraction: Claude Opus 5 with a strict JSON schema (structured outputs), images sent as base64, identifiers masked by instruction and validated by code.</p>
          <p>AIS: tables are read by code (pdf-parse), payers matched to institutions by rules; no AI call needed for the common case.</p>
          <p>Claims: a deterministic rule engine, one rule set per institution, versioned, unit-tested. Institutions can upload their own rules through the API.</p>
        </Technical>
      </Section>

      {/* The headline innovation, which used to be a bullet inside a card. Laid
          out as a flow rather than another grid of cards, because the page has
          enough of those and this one is a sequence, not a set. */}
      <Section id="asset-map" eyebrow="The idea nobody else has built" title="One tax statement finds accounts the family never knew existed">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <p className="text-lg">
              Every other service asks the family to already know where the money is. That is the whole problem:
              the account they cannot find is the one nobody remembered.
            </p>
            <p className="mt-4">
              A legal heir can request the account holder&apos;s <Term id="ais">Annual Information Statement</Term> from the
              Income Tax Department. It lists interest from every bank and dividends from every company that ever paid
              them. Virasat reads that one PDF and turns it into a map of institutions to claim from, even when the
              family has no papers at all.
            </p>
            <p className="mt-4 font-semibold text-brand">
              A document the family can already get, used as a search index for their own money. No portal does this.
            </p>
          </div>
          <ol className="space-y-3">
            {[
              ["One PDF", "The heir requests the AIS. Free, and already their right."],
              ["Read by code", "Tables parsed by pdf-parse, not by a model. Deterministic, and it costs nothing."],
              ["Payers matched", "Each payer name is matched to an institution by rules."],
              ["A map of claims", "Every bank, insurer and company that owes them, with the portal for each."],
            ].map(([h, d], i) => (
              <li key={h} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-contrast">{i + 1}</span>
                <span>
                  <span className="block font-semibold">{h}</span>
                  <span className="block text-sm text-muted">{d}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Live demo */}
      <Section id="try" eyebrow="Try it" title="Try it with Sunita's papers. No sign up.">
        <DemoEmbed />
      </Section>

      {/* Debate */}
      <Section id="debate" eyebrow="Trust" title="You can read the argument the AI had about your case." tone="surface">
        <p className="max-w-3xl text-lg">The Supporter argues the route is right. The Challenger looks for what could go wrong. The Referee decides and explains. <InfoButton label="The Two AI Debate">Research on whether debate makes models more accurate is mixed (Du and others, ICML 2024, and the counter-view in 2025). We measured our own: on three planted problems the Challenger caught 3 of 3, and so did a single reviewer with no debate. So we do not claim it is righter. We keep it because you can read the disagreement and judge it yourself, and because the Referee is prevented in code from lowering a caution. The numbers are on the How our AI works page.</InfoButton></p>
        <div className="mt-8"><DebateExample /></div>
      </Section>

      {/* Impact */}
      <Section id="impact" eyebrow="Impact" title="Even a small share of ₹1.84 lakh crore changes lives">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-lg">Money back to families (₹ crore)</h3>
            <div className="mt-4 space-y-3" role="img" aria-label="Bar chart: if 0.1 percent of the unclaimed pool is claimed, 184 crore rupees return to families; 0.5 percent, 920 crore; 1 percent, 1,840 crore.">
              {[["If 0.1% is claimed", 184], ["If 0.5% is claimed", 920], ["If 1% is claimed", 1840]].map(([l, v]) => (
                <div key={l as string}>
                  <div className="flex justify-between text-sm"><span>{l as string}</span><span className="tabular font-semibold">₹{(v as number).toLocaleString("en-IN")} cr</span></div>
                  <div className="mt-1 h-3 rounded-full bg-surface"><div className="h-3 rounded-full bg-brand" style={{ width: `${((v as number) / 1840) * 100}%` }} /></div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-muted">Example scenarios based on the ₹1.84 lakh crore total. For scale, Gujarat&apos;s claim camps alone returned ₹104 crore in a few months.</p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              {["Aapki Poonji Aapka Adhikar", "RBI UDGAM", "SEBI MITRA", "IRDAI Bima Bharosa", "Digital India"].map((b) => (
                <span key={b} className="rounded-full border border-border px-3 py-1">Aligned with {b}</span>
              ))}
            </div>
          </div>
          <SavingsCalculator />
        </div>
      </Section>

      {/* Who it is for */}
      <Section id="who" eyebrow="Who it is for" title="Built for the people websites leave behind" tone="surface">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Families taking over the finances", "Spouses, elderly parents and young earners who suddenly have to manage the family's money and paperwork.", "/try"],
            ["People with forgotten money", "Workers who moved cities, people with an old PF from a past job, and families with old share certificates.", "/try"],
            ["Helpers on the ground", "5 lakh+ Common Service Centres, bank mitras and NGOs who can use Virasat to help people who are not online.", "/developers"],
          ].map(([h, d, href]) => (
            <Card key={h} className="flex flex-col">
              <h3 className="text-xl text-brand">{h}</h3>
              <p className="mt-2 flex-1"><Explain text={d as string} /></p>
              <Link href={href} className="mt-4 font-semibold text-brand underline">Start here</Link>
            </Card>
          ))}
        </div>
      </Section>

      {/* Trust */}
      <Section id="trust" eyebrow="Trust and privacy" title="Your data stays yours">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            [UserCheck, "You log in to government portals yourself. We never ask for passwords or get around OTPs."],
            [Lock, "Your papers stay in your browser. They are sent for AI reading only when you press the button, and are not stored on our servers."],
            [Trash2, "Delete everything with one button, any time. We only keep what we need, with your consent, as the DPDP Act 2023 requires."],
            [ShieldCheck, "Virasat prepares. You decide. Nothing is submitted to any bank without you."],
          ].map(([Icon, d]) => {
            const I = Icon as typeof Lock;
            return (
              <div key={d as string} className="flex gap-4 rounded-card border border-border p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand"><I className="h-5 w-5" aria-hidden /></span>
                <p>{d as string}</p>
              </div>
            );
          })}
        </div>
        <Link href="/privacy" className="mt-4 inline-block font-semibold text-brand underline">Read the full privacy page</Link>
      </Section>

      {/* Developers */}
      <Section id="developers" eyebrow="For developers" title="Use Virasat in your own app" tone="surface">
        <p className="max-w-3xl text-lg">Send a document, get the details. Send the details, get the claim route and forms. Bring your own data, your own AI key, or your own rules.</p>
        <pre tabIndex={0} className="mt-6 overflow-x-auto rounded-card border border-border bg-raised p-4 text-sm"><code>{`curl -X POST https://YOUR-HOST/api/v1/claims/route \\
  -H "Authorization: Bearer vs_test_demo" \\
  -H "Content-Type: application/json" \\
  -d '{"input":{"assetType":"bank","institution":"State Bank of India","amountInr":158420,
       "nomineePresent":true,"jointHolder":false,"claimantRelation":"spouse","otherHeirs":true}}'`}</code></pre>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["Bring Your Own Data", "Send your own photos, PDFs or facility lists. Processed for the request only.", "Files you send through the API are processed and returned. Nothing is stored beyond the request unless you save it."],
            ["Bring Your Own Key", "Plug in your own AI provider key. Billing and data agreements stay with you.", "Send your Anthropic key in the x-byo-anthropic-key header. It is used for that request only and never stored or logged."],
            ["Bring Your Own Rules", "Upload your institution's own claim rules. The engine validates and uses them.", "Rules are JSON documents validated against a schema. Every result records the rule version used, so your compliance team can audit it."],
          ].map(([h, d, i]) => (
            <Card key={h}>
              <h3 className="text-lg text-brand">{h} <InfoButton label={h}>{i}</InfoButton></h3>
              <p className="mt-2 text-sm"><Explain text={d as string} /></p>
            </Card>
          ))}
        </div>
        <Link href="/developers" className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-brand px-5 font-semibold text-brand-contrast">Read the API docs and get a sandbox key</Link>
      </Section>

      {/* Technology */}
      <Section id="technology" eyebrow="Technology" title="Simple for the family, smart underneath">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["What goes in", ["Photos of passbooks, bonds and certificates", "Tax statement (AIS) PDFs", "Voice in Hindi or English", "Web now, WhatsApp next"]],
            ["Virasat's brain", ["Reads documents in Indian languages, even handwriting", "Knows the claim rules of each bank and insurer", "Two AI reviewers check every route", "Fills forms and writes letters in two languages"]],
            ["What comes out", ["A list of money owed, with sources", "Ready claim packs (PDF)", "Reminders and tracking", "The family Vault"]],
          ].map(([h, items], i) => (
            <Card key={h as string} tone={i === 1 ? "brand" : "raised"}>
              <h3 className={i === 1 ? "text-accent" : "text-brand"}>{h as string}</h3>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">{(items as string[]).map((x) => <li key={x}><Explain text={x} /></li>)}</ul>
            </Card>
          ))}
        </div>
        <Technical title="Stack">
          <p>Next.js 16 (App Router, TypeScript) with route handlers for the public API. Tailwind CSS 4 with design tokens for light and dark. Anthropic SDK with claude-opus-5, structured outputs (Zod schemas), prompt caching on system prompts. pdf-parse for AIS tables, pdf-lib for claim packs. Browser Web Speech API for voice in and out. Family data in the browser (localStorage); no server database in the prototype.</p>
        </Technical>
      </Section>

      <Section id="faq" eyebrow="FAQ" title="Questions people ask">
        <Faq />
      </Section>

      {/* One band instead of two half previews of pages that already exist in
          full. The glossary and sources sections were reprinting 8 terms and 6
          citations here, 1.7 screens of scroll to say "there is more over
          there". A row of links says the same thing and gets a reader to the
          real page faster. */}
      <Section id="more" eyebrow="Go deeper" title="Everything else, in full" tone="surface">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["/glossary", "Glossary", `Every term we use, explained in plain words. ${GLOSSARY.length} of them.`],
            ["/references", "Sources", `Where every number comes from. ${REFERENCES.length} citations, plus who we credit.`],
            ["/proof", "Proof", "What one family costs, and how to check every claim on this site yourself."],
            ["/how-ai-works", "Transparency", "What the AI does, what it never decides, and our own test results."],
            ["/developers", "For developers", "The public API, the open rule corpus, and how to add an institution."],
            ["/judges", "For judges", "Each judging criterion mapped to something you can open."],
          ].map(([href, title, note]) => (
            <Link
              key={href}
              href={href}
              className="rounded-card border border-border bg-raised p-4 [transition:border-color_160ms_var(--ease-out)] hover:border-brand"
            >
              <span className="font-semibold text-brand underline">{title}</span>
              <span className="mt-1 block text-sm text-muted">{note}</span>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
