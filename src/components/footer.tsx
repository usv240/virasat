import Link from "next/link";

export function Footer() {
  const links = [
    ["/judges", "For judges"],
    ["/developers", "Developers"],
    ["/how-ai-works", "How our AI works"],
    ["/glossary", "Glossary"],
    ["/references", "Sources"],
    ["/privacy", "Privacy"],
    ["/accessibility", "Accessibility"],
  ];
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-md">
          <p className="text-lg font-semibold text-brand">Virasat</p>
          <p className="mt-1 text-sm text-muted">Your money, your right. Built by Team Virasat for the Global Innovation Hackathon 2026: Build for a Better Future.</p>
          <p className="mt-3 text-xs text-muted">
            Virasat prepares. You decide. Nothing is submitted to any bank or government portal without you. This is guidance, not legal advice.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="py-1 hover:underline">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
