import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  const links = [
    ["/judges", "For judges"],
    ["/proof", "Proof"],
    ["/developers", "Developers"],
    ["/how-ai-works", "How our AI works"],
    ["/glossary", "Glossary"],
    ["/references", "Sources"],
    ["/privacy", "Privacy"],
    ["/accessibility", "Accessibility"],
    ["https://github.com/usv240/virasat", "Source code"],
  ];
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-md">
          <p className="flex items-center gap-2 text-lg font-semibold text-brand"><Logo className="h-6 w-6" />Virasat</p>
          <p className="mt-1 text-sm text-muted">Your money, your right. Built by Team USV for the Global Innovation Hackathon 2026: Build for a Better Future.</p>
          <p className="mt-3 text-xs text-muted">
            Virasat prepares. You decide. Nothing is submitted to any bank or government portal without you. This is guidance, not legal advice.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
          {links.map(([href, label]) =>
            href.startsWith("http") ? (
              <a key={href} href={href} target="_blank" rel="noreferrer" className="py-1 hover:underline">{label}</a>
            ) : (
              <Link key={href} href={href} className="py-1 hover:underline">{label}</Link>
            ),
          )}
        </nav>
      </div>
    </footer>
  );
}
