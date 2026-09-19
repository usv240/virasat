import { Card, Section } from "@/components/ui";
import { EVAL_RESULTS } from "@/lib/eval-results";

export const metadata = { title: "How Virasat's AI works" };

export default function HowAiWorks() {
  return (
    <>
      <Section eyebrow="Transparency" title="How our AI works, and what it never does">
        <div className="grid gap-4 md:grid-cols-2">
          <Card><h3 className="text-lg text-brand">What the AI does</h3><ul className="mt-2 list-disc pl-5 text-sm"><li>Reads photographed documents and pulls out the institution, number (masked), names, dates and amounts, with a confidence per field.</li><li>Argues for and against a claim route (the Two AI Debate) and writes a verdict with reasons and risks.</li><li>Understands your spoken or typed questions.</li></ul></Card>
          <Card><h3 className="text-lg text-brand">What it never does</h3><ul className="mt-2 list-disc pl-5 text-sm"><li>It never decides the claim route. A fixed, tested rule engine does.</li><li>It never submits anything to a bank or portal. You do.</li><li>It never lowers a caution: the referee can only add risks or ask for human review.</li><li>It never sees your passwords or OTPs.</li><li>Your documents are not used to train any model.</li></ul></Card>
        </div>
      </Section>
      <Section eyebrow="Models" title="Which models and why" tone="surface">
        <p className="max-w-3xl">Claude Opus 5 (<code>claude-opus-5</code>) through the official Anthropic SDK for document reading and the debate, because it reads Indian-language documents well and supports strict JSON schemas (structured outputs), which keeps the app safe from unexpected answers. Adaptive thinking is on. System prompts are cached, so repeated calls cost less. Speech in and out use the browser&apos;s own engine, which costs nothing and works offline.</p>
      </Section>
      <Section eyebrow="Test results" title="Our evaluation set">
        <p className="max-w-3xl">{EVAL_RESULTS.description}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead><tr className="bg-brand text-left text-brand-contrast"><th className="p-2">Test</th><th className="p-2">Cases</th><th className="p-2">Result</th><th className="p-2">Note</th></tr></thead>
            <tbody>{EVAL_RESULTS.rows.map((r) => <tr key={r.test} className="border-b border-border odd:bg-raised"><td className="p-2 font-semibold">{r.test}</td><td className="p-2 tabular">{r.cases}</td><td className="p-2 tabular">{r.result}</td><td className="p-2">{r.note}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-muted">Last run: {EVAL_RESULTS.lastRun}. Run <code>npm test</code> to reproduce the rule engine and parser results. The AI rows need an API key.</p>
      </Section>
      <Section eyebrow="Limits" title="Known limits, in plain words" tone="surface">
        <ul className="list-disc space-y-1 pl-5">
          <li>Faded or handwritten papers may be read with low confidence. Every field can be corrected by you.</li>
          <li>We have rule files for five institutions. Others get a &quot;needs review&quot; route until their file is added.</li>
          <li>The unpaid-dividend index in this prototype is sample data.</li>
          <li>Hindi and English only, for now.</li>
          <li>The debate improves transparency; it is not a guarantee of correctness. Research is mixed on how much debate improves accuracy, which is why we measure it.</li>
        </ul>
      </Section>
      <Section eyebrow="Data" title="What we keep and for how long">
        <p className="max-w-3xl">In this prototype, everything you enter stays in your browser. A photo is sent to the AI only when you press the button and is not stored on our servers. One button in the Help tab deletes everything. If you use your own AI key, it stays in your browser too. To report a problem, use the contact link in the footer.</p>
      </Section>
    </>
  );
}
