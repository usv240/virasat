import { Section } from "@/components/ui";

export const metadata = { title: "Virasat accessibility statement" };

export default function AccessibilityPage() {
  return (
    <Section eyebrow="Accessibility" title="Built for everyone" h1>
      <div className="max-w-3xl space-y-4">
        <p>Virasat aims to meet WCAG 2.2 Level AA and India&apos;s GIGW 3.0 guidelines. What that means in practice:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Text contrast of at least 4.5 to 1 in both light and dark mode.</li>
          <li>Every button and link is at least 44 pixels tall, so it is easy to tap.</li>
          <li>Everything works with a keyboard, and the focus ring is always visible.</li>
          <li>Every screen has a Listen button that reads it aloud, and most inputs accept voice.</li>
          <li>Info buttons open on tap and click, not hover, so they work on phones.</li>
          <li>The site reflows at 320 pixels wide and at 200 percent zoom with no sideways scrolling.</li>
          <li>Colour is never the only signal: status always has a word and an icon too.</li>
          <li>Help is in the same place on every page (bottom right).</li>
          <li>Animations respect the &quot;reduce motion&quot; setting.</li>
        </ul>
        <p>If something does not work for you, tell us through the contact link in the footer and we will fix it.</p>
      </div>
    </Section>
  );
}
