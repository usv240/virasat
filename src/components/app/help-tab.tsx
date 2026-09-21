"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Card, InfoButton } from "@/components/ui";
import type { FamilyState } from "@/lib/store";
import { usePrefs } from "@/components/providers";

type Family = { state: FamilyState; update: (fn: (s: FamilyState) => FamilyState) => void; reset: () => void };

export function HelpTab({ family }: { family: Family }) {
  const { state, update, reset } = family;
  const { t } = usePrefs();
  const [key, setKey] = useState("");
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="space-y-6">
      <h2 className="text-2xl">{t("help.title")}</h2>
      <Card>
        <h3 className="text-lg">{t("help.byok")} <InfoButton label="Bring your own key">If this server has no AI key, you can use your own Anthropic key. It stays in your browser and is sent only with your own requests, over HTTPS. It is never stored on our servers or logged.</InfoButton></h3>
        <p className="mt-1 text-sm text-muted">{t("help.byok.sub")}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <input type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="sk-ant-..." aria-label="Anthropic API key" className="min-h-11 flex-1 rounded-lg border border-border bg-raised px-3" />
          <Button onClick={() => { update((s) => ({ ...s, byoKey: key.trim() || null })); setKey(""); }}>{state.byoKey ? t("help.byok.replace") : t("help.byok.save")}</Button>
          {state.byoKey && <Button variant="secondary" onClick={() => update((s) => ({ ...s, byoKey: null }))}>{t("help.byok.remove")}</Button>}
        </div>
        {state.byoKey && <p className="mt-2 text-sm text-success">{t("help.byok.saved")}</p>}
      </Card>
      <Card>
        <h3 className="text-lg">{t("help.delete")}</h3>
        <p className="mt-1 text-sm">{t("help.delete.sub")}</p>
        {!confirm ? <Button variant="danger" className="mt-3" onClick={() => setConfirm(true)}>{t("help.delete.btn")}</Button> : (
          <div className="mt-3 flex gap-2"><Button variant="danger" onClick={() => { reset(); setConfirm(false); }}>{t("help.delete.yes")}</Button><Button variant="secondary" onClick={() => setConfirm(false)}>{t("cancel")}</Button></div>
        )}
      </Card>
      <Card>
        <h3 className="text-lg">{t("help.learn")}</h3>
        <ul className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
          {[["/#faq", "Questions people ask"], ["/glossary", "Glossary of terms"], ["/how-ai-works", "How our AI works"], ["/privacy", "Privacy"], ["/judges", "For judges"], ["/developers", "For developers"]].map(([h, l]) => (
            <li key={h}><Link href={h} className="block rounded-lg border border-border px-3 py-2 hover:bg-surface">{l}</Link></li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
