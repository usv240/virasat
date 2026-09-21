"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle, X } from "lucide-react";
import { usePrefs } from "./providers";
import { Listen } from "./ui";

const summaries: Record<string, string> = {
  "/": "This website helps families find money that belongs to them in old bank accounts, insurance, provident fund and shares, and claim it. Take a photo of an old paper to start. It is free.",
  "/try": "This is the working product on sample data. Follow the steps: Find, Claim, Track, Vault. Nothing you do here is sent to any bank.",
  "/app": "This is the working product. Follow the steps: Find, Claim, Track, Vault. Your data stays in your browser unless you choose to run the AI.",
  "/judges": "This page is for judges. It maps every judging criterion to proof, lists what is real and what is sample, and links every deliverable.",
  "/developers": "This page explains how to use Virasat inside your own app through the API, and how to bring your own data, key or rules.",
};

export function HelpButton() {
  const [open, setOpen] = useState(false);
  const { t } = usePrefs();
  const path = usePathname() ?? "/";
  const summary = summaries[path] ?? "Use the menu to move around. Every info button explains a feature. The glossary explains every term.";
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("app.help")}
        className={`fixed right-4 z-30 ${path.startsWith("/app") || path.startsWith("/try") ? "bottom-20 lg:bottom-4" : "bottom-4"} press inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand text-brand-contrast shadow-[var(--shadow-2)] [transition:box-shadow_180ms_var(--ease-out),filter_120ms_var(--ease-out)] hover:shadow-[var(--shadow-3)] hover:brightness-110`}
      >
        <HelpCircle aria-hidden />
      </button>
      {open && (
        <div role="dialog" aria-modal="true" aria-label="Help" className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-t-2xl bg-raised p-5 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t("app.help")}</h2>
              <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="p-2">
                <X aria-hidden />
              </button>
            </div>
            <p className="mt-3 text-sm font-semibold text-muted">Explain this page</p>
            <p className="mt-1">{summary}</p>
            <Listen text={summary} />
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {[
                ["/#faq", "FAQ"],
                ["/glossary", "Glossary"],
                ["/judges", "For judges"],
                ["/how-ai-works", "How our AI works"],
                ["/privacy", "Privacy and delete my data"],
                ["mailto:team@virasat.example", "Contact"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} onClick={() => setOpen(false)} className="block rounded-lg border border-border px-3 py-2 hover:bg-surface">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
