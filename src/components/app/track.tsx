"use client";

import { useState } from "react";
import { Button, Card, InfoButton, Listen } from "@/components/ui";
import { usePrefs } from "@/components/providers";
import { inr, type FamilyState } from "@/lib/store";
import type { Claim } from "@/lib/types";

type Family = { state: FamilyState; update: (fn: (s: FamilyState) => FamilyState) => void };


export function Track({ family }: { family: Family }) {
  const { state, update } = family;
  const { t } = usePrefs();
  const [now] = useState(() => Date.now());
  const setStatus = (id: string, status: Claim["status"], note: string) =>
    update((s) => ({ ...s, claims: s.claims.map((c) => (c.id === id ? { ...c, status, submittedAt: status === "submitted" ? new Date().toISOString() : c.submittedAt, events: [...c.events, { at: new Date().toISOString(), note }] } : c)) }));

  if (state.claims.length === 0) return <Card><h2 className="text-2xl">{t("track.empty.title")}</h2><p className="mt-2">{t("track.empty.body")}</p></Card>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl">{t("track.title")}</h2>
        <p className="text-muted">{t("track.step")} <Listen text={t("track.step")} /></p>
      </div>
      {state.claims.map((c) => {
        const asset = state.assets.find((a) => a.id === c.assetId);
        const days = c.submittedAt ? Math.floor((now - new Date(c.submittedAt).getTime()) / 86400000) : 0;
        const overdue = c.submittedAt && days >= c.decision.escalation.afterDays;
        const next = c.status === "preparing" ? t("track.next.prepare") : c.status === "submitted" || c.status === "waiting" ? t("track.next.wait", { days: c.decision.timelineDays }) : c.status === "stuck" ? t("track.next.escalate", { to: c.decision.escalation.to }) : t("track.next.done");
        return (
          <Card key={c.id}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-lg">{asset?.institution ?? "Claim"} · {inr(asset?.amountEstimateInr ?? null)}</h3>
                <p className="text-sm text-muted">{c.decision.routeLabel} · {c.decision.checklist.length} {t("track.documents")}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${c.status === "done" ? "bg-brand-soft text-brand" : c.status === "stuck" ? "bg-accent-soft text-warning" : "bg-surface"}`}>{t(`track.status.${c.status}`)}</span>
            </div>
            <p className="mt-3 rounded-lg bg-accent-soft p-3 text-sm"><span className="font-semibold">{t("track.next")} </span>{next}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {c.status === "preparing" && <Button onClick={() => setStatus(c.id, "submitted", "Submitted at the branch")}>{t("track.submitted")}</Button>}
              {(c.status === "submitted" || c.status === "waiting") && <Button variant="secondary" onClick={() => setStatus(c.id, "done", "Money received")}>{t("track.received")}</Button>}
              {(c.status === "submitted" || c.status === "waiting") && <Button variant="secondary" onClick={() => setStatus(c.id, "stuck", "Marked as stuck")}>{t("track.stuck")}</Button>}
              {c.status === "stuck" && <Button variant="secondary" onClick={() => setStatus(c.id, "waiting", "Escalated")}>{t("track.escalated")}</Button>}
            </div>
            {(overdue || c.status === "stuck") && (
              <div className="mt-3 rounded-lg border border-warning/40 p-3 text-sm">
                <p className="font-semibold">{t("track.stuckdays", { days })} <InfoButton label={c.decision.escalation.to}>{c.decision.escalation.how}</InfoButton></p>
                <p className="mt-1">{c.decision.escalation.how}</p>
                <p className="mt-2 rounded bg-surface p-2 text-xs">{t("track.complaint")} &quot;I submitted a claim for {asset?.type === "insurance" ? "policy" : "account"} {asset?.identifierMasked} at {asset?.institution} on {c.submittedAt?.slice(0, 10)} under the {c.decision.routeLabel.toLowerCase()} with all listed documents. I have received no reply in {days} days. I request your intervention.&quot;</p>
              </div>
            )}
            <details className="mt-3 text-sm"><summary className="cursor-pointer text-muted">{t("track.history")}</summary><ul className="mt-1 list-disc pl-5">{c.events.map((e) => <li key={e.at}>{e.at.slice(0, 10)}: {e.note}</li>)}</ul></details>
          </Card>
        );
      })}
    </div>
  );
}
