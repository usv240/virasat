"use client";

import Link from "next/link";
import { usePrefs } from "@/components/providers";
import { InfoButton, Listen } from "@/components/ui";

export function Hero() {
  const { t } = usePrefs();
  return (
    <section className="brand-scope bg-brand text-brand-contrast dark:bg-[#0c2a2b]">
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Virasat <span className="font-normal normal-case tracking-normal text-brand-contrast/70">means inheritance</span></p>
          <h1 className="mt-3 text-4xl leading-tight lg:text-6xl">
            {t("hero.title")}
            <InfoButton label="What Virasat does">This service helps families find money in bank accounts, insurance, provident fund and shares that belongs to them, and claim it without paying an agent. It is free for families.</InfoButton>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-brand-contrast/90">{t("hero.sub")}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/try" className="inline-flex min-h-13 items-center rounded-lg bg-accent px-6 text-lg font-semibold text-[#16201f]">
              {t("cta.try")} <span className="ml-2 text-sm font-normal opacity-80">({t("cta.try.sub")})</span>
            </Link>
            <Link href="/#try" className="inline-flex min-h-13 items-center rounded-lg border border-brand-contrast/40 px-6 font-semibold">{t("cta.video")}</Link>
            <Listen text={`${t("hero.title")} ${t("hero.sub")}`} className="text-brand-contrast hover:bg-white/10" />
          </div>
        </div>
        <div className="rounded-2xl border border-brand-contrast/20 bg-white/5 p-6 shadow-[var(--shadow-2)] lg:mt-6">
          <p className="text-3xl font-semibold text-accent lg:text-4xl">₹1.84 lakh crore</p>
          <p className="mt-2 text-brand-contrast/90">
            of Indians&apos; own money is lying unclaimed in banks, insurance, provident fund and shares.
            <InfoButton label="lakh crore">1 lakh crore = 1,00,000 crore = 1,84,000,00,00,000 rupees, about 1.84 trillion rupees or roughly 21 billion US dollars.</InfoButton>
          </p>
          <p className="mt-4 text-sm italic text-brand-contrast/70">Finance Minister of India, October 2025. <Link href="/references#r1" className="underline">Source</Link></p>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-sm">
            {[["1 photo", "to start"], ["₹0", "cost to families"], ["Hindi", "and English, by voice"]].map(([n, l]) => (
              <div key={n} className="rounded-lg bg-white/5 p-3">
                <p className="text-xl font-bold text-accent">{n}</p>
                <p className="text-brand-contrast/80">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
