import Link from "next/link";
import { Card, Section } from "@/components/ui";
import { Explain } from "@/components/explain";
import { CLAIMS, NOT_CLAIMED } from "@/lib/proof";
import { EVAL_RESULTS } from "@/lib/eval-results";
import { JOURNEY, LEVERS, MEASURED_ON, PRICE_SOURCE, USD_TO_INR, journeyTotal, inrFromUsd, rupees, usd } from "@/lib/cost";

export const metadata = {
  title: "Proof",
  description: "Every claim Virasat makes, and the command that would catch us if it were wrong.",
};

const total = journeyTotal();
/** Gujarat's camps returned this much per family on average. See the sources page. */
const AVERAGE_RECOVERED = 38_700;

/** A working figure for how many Indian families this money belongs to. */
const FAMILIES = 10_000_000;
const CHEAPEST = total.inr * Math.min(...LEVERS.map((l) => l.factor));
const nationalCostCrore = Math.round((CHEAPEST * FAMILIES) / 10_000_000).toLocaleString("en-IN");

export default function Proof() {
  return (
    <>
      <Section eyebrow="Proof" title="Do not take our word for any of this" h1>
        <p className="max-w-3xl">
          Every project says it is fast, accessible and tested. Below is each thing we claim, next to the command
          that would prove us wrong. Nothing on this page needs our permission to check, and the audit writes down
          failures as readily as passes.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead>
              <tr className="bg-brand text-left text-brand-contrast">
                <th className="p-2">What we claim</th>
                <th className="p-2">How you check it</th>
              </tr>
            </thead>
            <tbody>
              {CLAIMS.map((c) => (
                <tr key={c.claim} className="border-b border-border odd:bg-raised">
                  <td className="p-2 font-semibold leading-7"><Explain text={c.claim} /></td>
                  <td className="p-2 leading-7">
                    {c.kind === "command" ? <code>{c.check}</code> : <Explain text={c.check} />}
                    {c.href && (
                      <>
                        {" "}
                        {c.href.startsWith("http") ? (
                          <a className="font-semibold text-brand underline" href={c.href} target="_blank" rel="noreferrer">Open</a>
                        ) : (
                          <Link className="font-semibold text-brand underline" href={c.href}>Open</Link>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted">
          One command runs the lot: <code>npm run audit</code>. It writes docs/AUDIT-REPORT.md with the date, the
          commit it tested and anything that did not pass.
        </p>
      </Section>

      <Section
        eyebrow="Unit economics"
        title={`One family costs about ${rupees(total.inr)} of AI`}
        tone="surface"
      >
        <p className="max-w-3xl">
          Saying a thing will scale is easy. Here is the arithmetic instead. A family in the model is Sunita&apos;s:
          three documents photographed, one tax statement read, three claim routes decided and reviewed. Most of that
          journey costs nothing per family, because most of it runs in ordinary code. AI is used only where it has to
          be: reading a photograph, and arguing about a route.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="bg-brand text-left text-brand-contrast">
                <th className="p-2">Step</th>
                <th className="p-2">Times</th>
                <th className="p-2">Cost</th>
                <th className="p-2">Why</th>
              </tr>
            </thead>
            <tbody>
              {JOURNEY.map((s) => (
                <tr key={s.id} className="border-b border-border odd:bg-raised">
                  <td className="p-2 font-semibold leading-7">{s.label}</td>
                  <td className="p-2 tabular">{s.times}</td>
                  <td className="p-2 tabular font-semibold">
                    {s.usage ? rupees(inrFromUsd(usd(s.usage, s.model)) * s.times) : "Nothing"}
                  </td>
                  <td className="p-2 leading-7"><Explain text={s.note} /></td>
                </tr>
              ))}
              <tr className="bg-brand-soft">
                <td className="p-2 font-semibold">One family, end to end</td>
                <td className="p-2" />
                <td className="p-2 tabular text-lg font-semibold text-brand">{rupees(total.inr)}</td>
                <td className="p-2">
                  Against an average of {rupees(AVERAGE_RECOVERED).replace(".00", "")} returned per family at
                  Gujarat&apos;s camps, that is about {Math.round(AVERAGE_RECOVERED / total.inr).toLocaleString("en-IN")} rupees
                  recovered for every rupee of AI spent.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted">
          Prices from <a className="underline" href={PRICE_SOURCE.url} target="_blank" rel="noreferrer">{PRICE_SOURCE.label}</a>, checked {PRICE_SOURCE.checkedOn}.
          Converted at {USD_TO_INR.rate} rupees to the dollar. Token counts are{" "}
          {MEASURED_ON ? `measured, last on ${MEASURED_ON}` : "estimated from the real prompts and image sizes in this repository, and not yet confirmed against live usage"}.
          Run <code>npm run measure:cost</code> to replace them with what the API actually reports.
        </p>

        <h3 className="mt-10 text-xl">What happens at ten million families</h3>
        <p className="mt-2 max-w-3xl">
          The answer is not this number multiplied out, because the same work can be routed differently once volume
          is the constraint. These are levers that exist today, not plans.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {LEVERS.map((l, i) => (
            <Card key={l.id} tone={i === 0 ? "raised" : "brand"}>
              <p className="text-2xl font-semibold tabular text-brand">{rupees(total.inr * l.factor)}</p>
              <h4 className="mt-1 text-base">{l.label}</h4>
              <p className="mt-2 text-sm"><Explain text={l.effect} /></p>
            </Card>
          ))}
        </div>
        <p className="mt-4 max-w-3xl text-sm text-muted">
          Put it at national scale. At the lowest figure above, serving {(FAMILIES / 10_000_000).toFixed(0)} crore
          families costs about {nationalCostCrore} crore rupees of AI in total, to move ₹1.84 lakh crore back to the
          people it belongs to. The compute is not what makes this hard. Reaching the families is, which is why the
          plan below is about service centres rather than servers.
        </p>
      </Section>

      <Section eyebrow="Measured" title="What the tests actually found">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="bg-brand text-left text-brand-contrast">
                <th className="p-2">Test</th>
                <th className="p-2">Cases</th>
                <th className="p-2">Result</th>
              </tr>
            </thead>
            <tbody>
              {EVAL_RESULTS.rows.map((r) => (
                <tr key={r.test} className="border-b border-border odd:bg-raised">
                  <td className="p-2 font-semibold leading-7">{r.test}</td>
                  <td className="p-2 tabular">{r.cases}</td>
                  <td className="p-2 tabular font-semibold">{r.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm">
          The full notes, including the known limits, are on the{" "}
          <Link className="font-semibold text-brand underline" href="/how-ai-works">Transparency page</Link>.
        </p>
      </Section>

      <Section eyebrow="Limits" title="What we are not claiming" tone="surface">
        <p className="max-w-3xl">
          A judge who finds one overstatement stops believing the rest of the page. So here are the limits, written
          down by us rather than found by you.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 leading-7">
          {NOT_CLAIMED.map((n) => <li key={n}><Explain text={n} /></li>)}
        </ul>
      </Section>
    </>
  );
}
