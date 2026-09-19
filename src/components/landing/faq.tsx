const QA: [string, string][] = [
  ["Is Virasat free?", "Yes, for families. Institutions pay to use it inside their own systems."],
  ["Do I need to know what accounts my family had?", "No. A photo of any old paper, or the tax statement (AIS), is enough to start."],
  ["Do you log in to my bank?", "Never. You log in yourself. Virasat guides you step by step and fills the paperwork."],
  ["What is a nominee?", "A person named on an account or policy to receive the money. It is not the same as a legal heir, who is a family member entitled by law."],
  ["What if there is no nominee?", "Virasat shows the legal heir route and the documents needed. For smaller amounts no court is needed."],
  ["Which languages does it support?", "English and Hindi today, by text and voice. More Indian languages are next."],
  ["Is my data safe?", "Your papers stay in your browser. They are sent for AI reading only when you press the button, and are not stored on our servers. One button deletes everything."],
  ["What if the AI makes a mistake?", "The claim rules are fixed and tested. The AI only reads, explains and translates. Two AI reviewers check every route, every result shows its confidence and reasons, and you always review before acting."],
  ["Can I use it without a smartphone?", "Yes, through a Common Service Centre or a helper who runs Virasat for you."],
  ["How is this different from the government portals?", "Portals let you search one place at a time if you know what to look for. Virasat finds everything, tells you exactly where to search, and prepares the forms."],
];

export function Faq() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {QA.map(([q, a]) => (
        <details key={q} className="group rounded-card border border-border bg-raised p-4">
          <summary className="cursor-pointer list-none font-semibold text-brand marker:content-none">{q}</summary>
          <p className="mt-2 text-sm">{a}</p>
        </details>
      ))}
    </div>
  );
}
