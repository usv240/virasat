import Link from "next/link";
import { Section } from "@/components/ui";

export const metadata = { title: "You are offline" };

/**
 * Shown when someone opens a page they have never visited and the network is
 * gone. Its job is to stop a family assuming the app is broken, and to point
 * them at what still works.
 */
export default function OfflinePage() {
  return (
    <Section eyebrow="No internet" title="This page needs signal. Plenty of Virasat does not." h1>
      <p className="max-w-2xl">
        You have opened a page that was not saved to this phone. Nothing is lost and nothing has gone wrong.
        When the signal comes back, this page will load normally.
      </p>
      <h2 className="mt-8 text-xl">What still works right now</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 leading-7">
        <li>Every page you have already opened on this phone.</li>
        <li>Your Vault, and the checklist for any claim you have started.</li>
        <li>The glossary, so you can still look up a word before you reach the counter.</li>
      </ul>
      <h2 className="mt-8 text-xl">What has to wait</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 leading-7">
        <li>Reading a new photograph, which needs to reach the AI.</li>
        <li>Getting a claim route for a new asset.</li>
        <li>Searching the unpaid-dividend index.</li>
      </ul>
      <p className="mt-8">
        <Link href="/" className="font-semibold text-brand underline">Go back to the start</Link>
      </p>
    </Section>
  );
}
