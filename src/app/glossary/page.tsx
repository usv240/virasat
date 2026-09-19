import { Section } from "@/components/ui";
import { GLOSSARY } from "@/lib/glossary";

export const metadata = { title: "Virasat glossary" };

export default function GlossaryPage() {
  return (
    <Section eyebrow="Glossary" title="Every word we use, explained">
      <dl className="grid gap-4 md:grid-cols-2">
        {GLOSSARY.map((g) => (
          <div key={g.term} id={g.term.toLowerCase().replace(/[^a-z]+/g, "-")} className="rounded-card border border-border bg-raised p-4">
            <dt className="font-semibold text-brand">{g.term}</dt>
            <dd className="mt-1 text-sm">{g.def}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
