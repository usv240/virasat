import { Card, Section } from "@/components/ui";
import { REFERENCES } from "@/lib/references";
import { HOW_IT_WAS_BUILT, RUNTIME, SERVICES, TOOLING, type Credit } from "@/lib/credits";

export const metadata = { title: "Virasat sources" };

function Credits({ title, note, items }: { title: string; note: string; items: Credit[] }) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted">{note}</p>
      <ul className="mt-3 space-y-2">
        {items.map((c) => (
          <li key={c.name} className="text-sm">
            <a className="font-medium underline" href={c.url} target="_blank" rel="noreferrer">{c.name}</a>
            <span className="text-muted"> ({c.licence}). {c.what}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ReferencesPage() {
  return (
    <>
      <Section eyebrow="Sources" title="Where every number comes from" h1>
        <ol className="list-decimal space-y-3 pl-6">
          {REFERENCES.map((r) => (
            <li key={r.id} id={r.id}><a className="underline" href={r.url} target="_blank" rel="noreferrer">{r.title}</a></li>
          ))}
        </ol>
      </Section>

      <Section id="credits" eyebrow="Credits" title="What we did not build" tone="surface">
        <p className="max-w-3xl">
          Virasat stands on other people&apos;s work. Everything below is used under its own licence, and the list is
          checked by a test against the real dependencies, so it cannot drift out of date.
        </p>
        <Credits title="In the product" note="Runs in the family's browser, or on the server answering them." items={RUNTIME} />
        <Credits title="For building and checking" note="Never reaches a visitor. These are how we know the numbers are true." items={TOOLING} />
        <Credits title="Services" note="Where it runs." items={SERVICES} />

        <Card tone="brand" className="mt-10">
          <h3 className="text-lg font-semibold">How this was built</h3>
          <p className="mt-2 text-sm">{HOW_IT_WAS_BUILT.tools}</p>
          <p className="mt-3 text-sm">
            The rules allow AI development tools and hold us responsible for what we submit. Here is how we take that on:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {HOW_IT_WAS_BUILT.responsibility.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </Card>
      </Section>
    </>
  );
}
