"use client";

import { useState } from "react";
import { Button, Card, InfoButton, Listen } from "@/components/ui";
import type { FamilyState } from "@/lib/store";
import type { AssetKind, VaultItem } from "@/lib/types";
import { usePrefs } from "@/components/providers";

type Family = { state: FamilyState; update: (fn: (s: FamilyState) => FamilyState) => void };

export function Vault({ family }: { family: Family }) {
  const { state, update } = family;
  const { t } = usePrefs();
  const [form, setForm] = useState<{ type: AssetKind; institution: string; last4: string; nominee: VaultItem["nomineeStatus"] }>({ type: "bank", institution: "", last4: "", nominee: "unknown" });

  const add = (item: Omit<VaultItem, "id" | "lastChecked">) => update((s) => ({ ...s, vault: [...s.vault, { ...item, id: `v-${Date.now()}`, lastChecked: new Date().toISOString() }] }));
  const importAssets = () => update((s) => ({ ...s, vault: [...s.vault, ...s.assets.filter((a) => !s.vault.some((v) => v.institution === a.institution)).map((a) => ({ id: `v-${a.id}`, type: a.type, institution: a.institution, identifierMasked: a.identifierMasked, nomineeStatus: (a.nomineeName ? "ok" : a.source === "document" ? "missing" : "unknown") as VaultItem["nomineeStatus"], lastChecked: new Date().toISOString() }))] }));
  const setNominee = (id: string, nomineeStatus: VaultItem["nomineeStatus"]) => update((s) => ({ ...s, vault: s.vault.map((v) => (v.id === id ? { ...v, nomineeStatus, lastChecked: new Date().toISOString() } : v)) }));
  const missing = state.vault.filter((v) => v.nomineeStatus !== "ok").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl">{t("vault.title")} <InfoButton label="Parivaar Vault">A private family record of every account and policy, stored only in your browser. It checks that each one has a nominee, so the next generation never has to search like this. New rules allow up to four nominees on a bank account.</InfoButton></h2>
        <p className="text-muted">{t("vault.step")} <Listen text={t("vault.title") + ". " + t("vault.step")} /></p>
      </div>
      {state.vault.length > 0 && (
        <Card tone={missing > 0 ? "accent" : "raised"}>
          <p className="text-lg font-semibold">{missing === 0 ? t("vault.allok") : t("vault.missing", { n: missing, total: state.vault.length })}</p>
          {missing > 0 && <p className="mt-1 text-sm">{t("vault.missing.why")}</p>}
        </Card>
      )}
      <div className="grid gap-4 md:grid-cols-[1fr_320px]">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg">{t("vault.accounts")}</h3>
            {state.assets.length > 0 && <Button variant="secondary" onClick={importAssets}>{t("vault.import")}</Button>}
          </div>
          {state.vault.length === 0 ? (
            <p className="mt-3 text-sm text-muted">{t("vault.empty")}</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {state.vault.map((v) => (
                <li key={v.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                  <div>
                    <p className="font-semibold">{v.institution}</p>
                    <p className="text-muted">{v.type} · {v.identifierMasked} · {t("vault.checked")} {v.lastChecked.slice(0, 10)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${v.nomineeStatus === "ok" ? "bg-brand-soft text-brand" : v.nomineeStatus === "missing" ? "bg-accent-soft text-warning" : "bg-surface"}`}>{t("vault.nominee")} {v.nomineeStatus === "ok" ? t("vault.ok") : v.nomineeStatus === "missing" ? t("vault.missing.short") : t("vault.unknown")}</span>
                    {v.nomineeStatus !== "ok" && <Button variant="quiet" onClick={() => setNominee(v.id, "ok")}>{t("vault.added")}</Button>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <h3 className="text-lg">{t("vault.addbyhand")}</h3>
          <form className="mt-3 space-y-2 text-sm" onSubmit={(e) => { e.preventDefault(); if (!form.institution) return; add({ type: form.type, institution: form.institution, identifierMasked: form.last4 ? `XXXX${form.last4}` : "Not given", nomineeStatus: form.nominee }); setForm({ type: "bank", institution: "", last4: "", nominee: "unknown" }); }}>
            <label className="block">{t("vault.type")}<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as AssetKind })} className="mt-1 min-h-11 w-full rounded-lg border border-border bg-raised px-2">{["bank", "insurance", "mf", "shares", "pf", "post"].map((k) => <option key={k} value={k}>{k}</option>)}</select></label>
            <label className="block">{t("vault.institution")}<input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} className="mt-1 min-h-11 w-full rounded-lg border border-border bg-raised px-2" /></label>
            <label className="block">{t("vault.last4")}<input value={form.last4} maxLength={4} onChange={(e) => setForm({ ...form, last4: e.target.value.replace(/\D/g, "") })} className="mt-1 min-h-11 w-full rounded-lg border border-border bg-raised px-2" /></label>
            <label className="block">{t("find.nominee")}<select value={form.nominee} onChange={(e) => setForm({ ...form, nominee: e.target.value as VaultItem["nomineeStatus"] })} className="mt-1 min-h-11 w-full rounded-lg border border-border bg-raised px-2"><option value="ok">{t("vault.named")}</option><option value="missing">{t("vault.missing.short")}</option><option value="unknown">{t("vault.notsure")}</option></select></label>
            <Button type="submit" className="w-full">{t("vault.add")}</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
