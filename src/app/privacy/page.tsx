import { Section } from "@/components/ui";
import { Term } from "@/components/term";

export const metadata = { title: "Virasat privacy" };

export default function PrivacyPage() {
  return (
    <Section eyebrow="Privacy" title="Your data, in plain words" h1>
      <div className="max-w-3xl space-y-4">
        <p><strong>What we collect.</strong> In this prototype, nothing is stored on our servers. The details Virasat reads from your papers, your list of assets, your claims and your Vault are kept in your own browser on your own device.</p>
        <p><strong>When something leaves your device.</strong> Only when you press a button that needs the AI: reading a photo, or running the <Term id="two-ai-debate">AI Review</Term>. That request goes to our server and on to the AI provider (Anthropic) over an encrypted connection, is processed, and is not stored by us. Anthropic does not use API data to train models.</p>
        <p><strong>Consent.</strong> We ask before the first upload, in two sentences. You can say no and still read everything on the site.</p>
        <p><strong>Deleting.</strong> The Help tab has a &quot;Delete everything&quot; button. It removes all data from your browser immediately.</p>
        <p><strong>Government portals.</strong> We never log in for you, never ask for your passwords, and never get around OTPs or captchas. You log in yourself; we guide and prepare.</p>
        <p><strong>Your own AI key.</strong> If you add one, it stays in your browser and travels only with your own requests. It is never stored or logged on our servers.</p>
        <p><strong>Law.</strong> We follow the principles of India&apos;s <Term id="dpdp">Digital Personal Data Protection Act 2023</Term>: consent, purpose limitation, minimal data, and the right to delete.</p>
        <p><strong>Not legal advice.</strong> Virasat prepares paperwork and explains procedures from public sources. It is not a lawyer, and it never submits anything for you.</p>
      </div>
    </Section>
  );
}
