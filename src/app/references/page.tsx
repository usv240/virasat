import { Section } from "@/components/ui";
import { REFERENCES } from "@/lib/references";

export const metadata = { title: "Virasat sources" };

export default function ReferencesPage() {
  return (
    <Section eyebrow="Sources" title="Where every number comes from" h1>
      <ol className="list-decimal space-y-3 pl-6">
        {REFERENCES.map((r) => (
          <li key={r.id} id={r.id}><a className="underline" href={r.url} target="_blank" rel="noreferrer">{r.title}</a></li>
        ))}
      </ol>
    </Section>
  );
}
