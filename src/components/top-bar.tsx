"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Sun, Moon, Laptop } from "lucide-react";
import { clsx } from "clsx";
import { usePrefs } from "./providers";
import { LANGS } from "@/lib/i18n";
import { Logo } from "./logo";

export function TopBar() {
  const { t, theme, setTheme, mode, setMode, lang, setLang } = usePrefs();
  const [open, setOpen] = useState(false);
  const nav = [
    ["/#problem", t("nav.problem")],
    ["/#how", t("nav.how")],
    ["/#impact", t("nav.impact")],
    ["/developers", t("nav.developers")],
    ["/judges", t("nav.judges")],
  ];

  const controls = (
    <div className="flex flex-wrap items-center gap-2">
      <label className="sr-only" htmlFor="lang">Language</label>
      <select
        id="lang"
        value={lang}
        onChange={(e) => setLang(e.target.value as typeof lang)}
        className="min-h-11 rounded-lg border border-border bg-raised px-2 text-sm"
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
      <div role="group" aria-label="Theme" className="flex rounded-lg border border-border bg-raised">
        {(["system", "light", "dark"] as const).map((v) => {
          const Icon = v === "system" ? Laptop : v === "light" ? Sun : Moon;
          return (
            <button
              key={v}
              type="button"
              aria-label={t(`theme.${v}`)}
              aria-pressed={theme === v}
              onClick={() => setTheme(v)}
              className={clsx("min-h-11 min-w-11 px-2", theme === v ? "bg-brand-soft text-brand" : "text-muted")}
            >
              <Icon className="mx-auto h-4 w-4" aria-hidden />
            </button>
          );
        })}
      </div>
      <div role="group" aria-label="Detail level" className="flex rounded-lg border border-border bg-raised text-sm">
        {(["simple", "technical"] as const).map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={mode === v}
            onClick={() => setMode(v)}
            className={clsx("min-h-11 px-3", mode === v ? "bg-brand-soft font-semibold text-brand" : "text-muted")}
          >
            {t(`mode.${v}`)}
          </button>
        ))}
      </div>
      <Link href="/try" className="inline-flex min-h-11 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-brand-contrast">
        {t("cta.try")}
      </Link>
    </div>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold tracking-tight text-brand [transition:opacity_160ms_var(--ease-out)] hover:opacity-80">
          <Logo className="h-7 w-7 shrink-0" />
          <span>Virasat</span>
          <span className="sr-only">home</span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {nav.map(([href, label]) => (
            <Link key={href} href={href} className="rounded-lg px-3 py-2 text-sm font-medium text-text hover:bg-surface">
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:block">{controls}</div>
        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X aria-hidden /> : <Menu aria-hidden />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-bg px-4 py-4 lg:hidden">
          <nav aria-label="Main mobile" className="mb-4 flex flex-col">
            {nav.map(([href, label]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 font-medium hover:bg-surface">
                {label}
              </Link>
            ))}
          </nav>
          {controls}
        </div>
      )}
    </header>
  );
}
