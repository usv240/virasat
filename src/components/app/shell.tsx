"use client";

import { useEffect, useState } from "react";
import { Camera, FileSignature, Bell, ShieldCheck, HelpCircle } from "lucide-react";
import { clsx } from "clsx";
import { usePrefs } from "@/components/providers";
import { useFamily, extractionToAsset } from "@/lib/store";
import { SAMPLE_AIS_ASSETS, SAMPLE_DOCS } from "@/lib/sample";
import { Find } from "./find";
import { Claim } from "./claim";
import { Track } from "./track";
import { Vault } from "./vault";
import { HelpTab } from "./help-tab";

type Tab = "find" | "claim" | "track" | "vault" | "help";

export function AppShell({ sample = false }: { sample?: boolean }) {
  const family = useFamily();
  const { t } = usePrefs();
  const [tab, setTab] = useState<Tab>("find");
  const [ai, setAi] = useState<"live" | "sample" | "unknown">("unknown");

  useEffect(() => {
    fetch("/api/v1/health").then((r) => r.json()).then((j) => setAi(j.ai)).catch(() => setAi("sample"));
  }, []);

  // /try: load Sunita's papers once, if the family has nothing yet.
  useEffect(() => {
    if (!sample || !family.ready || family.state.documents.length > 0) return;
    family.update((s) => {
      const docs = SAMPLE_DOCS.map((d) => ({ id: `doc-${d.id}`, title: d.title, preview: d.file, extraction: d.extraction, mode: "sample" as const }));
      const assets = docs.map((d) => extractionToAsset(d.extraction, d.id));
      const ais = SAMPLE_AIS_ASSETS.filter((a) => !assets.some((x) => x.institution.toLowerCase() === a.institution.toLowerCase()));
      return { ...s, consentAt: new Date().toISOString(), claimant: { name: "Sunita R Kulkarni", relation: "spouse", address: "Panchavati, Nashik 422003", phone: "98XXXXXX21" }, documents: docs, assets: [...assets, ...ais] };
    });
  }, [sample, family]);

  const tabs: { id: Tab; label: string; icon: typeof Camera }[] = [
    { id: "find", label: t("app.find"), icon: Camera },
    { id: "claim", label: t("app.claim"), icon: FileSignature },
    { id: "track", label: t("app.track"), icon: Bell },
    { id: "vault", label: t("app.vault"), icon: ShieldCheck },
    { id: "help", label: t("app.help"), icon: HelpCircle },
  ];

  const nav = (
    <nav aria-label="App sections" className="flex lg:flex-col">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => setTab(id)}
          aria-current={tab === id ? "page" : undefined}
          className={clsx("flex flex-1 flex-col items-center gap-1 px-2 py-2 text-xs font-medium lg:flex-row lg:gap-3 lg:rounded-lg lg:px-3 lg:py-3 lg:text-base", tab === id ? "text-brand lg:bg-brand-soft" : "text-muted")}
        >
          <Icon className="h-5 w-5" aria-hidden />
          {label}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 py-6 pb-24 lg:pb-6">
      <aside className="hidden w-48 shrink-0 lg:block">{nav}</aside>
      <div className="min-w-0 flex-1">
        <div className={clsx("mb-4 rounded-lg px-3 py-2 text-sm", ai === "live" ? "bg-brand-soft text-brand" : "bg-accent-soft")}>
          {ai === "live" ? "Live AI is on. Your own photos will be read by the AI when you press the button." : ai === "sample" ? "Sample mode: no AI key is set on this server, so AI steps replay pre-computed results for Sunita's papers. Add ANTHROPIC_API_KEY to run live." : "Checking AI status..."}
        </div>
        {!family.ready ? (
          <div className="skeleton h-40" />
        ) : tab === "find" ? (
          <Find family={family} ai={ai} onClaim={() => setTab("claim")} />
        ) : tab === "claim" ? (
          <Claim family={family} onTrack={() => setTab("track")} />
        ) : tab === "track" ? (
          <Track family={family} />
        ) : tab === "vault" ? (
          <Vault family={family} />
        ) : (
          <HelpTab family={family} />
        )}
      </div>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-bg lg:hidden">{nav}</div>
    </div>
  );
}
