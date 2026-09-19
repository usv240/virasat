"use client";

import { useState } from "react";
import { Button, Card, InfoButton, Listen } from "@/components/ui";
import { inr, type FamilyState } from "@/lib/store";
import type { Claim } from "@/lib/types";

type Family = { state: FamilyState; update: (fn: (s: FamilyState) => FamilyState) => void };
const STATUS: Record<Claim["status"], string> = { preparing: "Preparing", submitted: "Submitted", waiting: "Waiting for reply", stuck: "Stuck", done: "Done" };

export function Track({ family }: { family: Family }) {
  const { state, update } = family;
  const [now] = useState(() => Date.now());
  const setStatus = (id: string, status: Claim["status"], note: string) =>
    update((s) => ({ ...s, claims: s.claims.map((c) => (c.id === id ? { ...c, status, submittedAt: status === "submitted" ? new Date().toISOString() : c.submittedAt, events: [...c.events, { at: new Date().toISOString(), note }] } : c)) }));

  if (state.claims.length === 0) return <Card><h2 className="text-2xl">No claims yet</h2><p className="mt-2">Finish the Claim step and download a claim pack. It will appear here with its status and next action.</p></Card>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl">Track your claims</h2>
        <p className="text-muted">Step 3 of 4. Update the status as you go. Virasat tells you the next action and when to escalate. <Listen text="Step 3 of 4. Track your claims. Update the status as you go." /></p>
      </div>
      {state.claims.map((c) => {
        const asset = state.assets.find((a) => a.id === c.assetId);
        const days = c.submittedAt ? Math.floor((now - new Date(c.submittedAt).getTime()) / 86400000) : 0;
        const overdue = c.submittedAt && days >= c.decision.escalation.afterDays;
        const next = c.status === "preparing" ? "Collect the documents in the checklist and submit the pack at the branch." : c.status === "submitted" || c.status === "waiting" ? `Wait for a reply. Expected within about ${c.decision.timelineDays} days.` : c.status === "stuck" ? `Escalate to the ${c.decision.escalation.to}.` : "Nothing more to do.";
        return (
          <Card key={c.id}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-lg">{asset?.institution ?? "Claim"} · {inr(asset?.amountEstimateInr ?? null)}</h3>
                <p className="text-sm text-muted">{c.decision.routeLabel} · {c.decision.checklist.length} documents</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${c.status === "done" ? "bg-brand-soft text-brand" : c.status === "stuck" ? "bg-accent-soft text-warning" : "bg-surface"}`}>{STATUS[c.status]}</span>
            </div>
            <p className="mt-3 rounded-lg bg-accent-soft p-3 text-sm"><span className="font-semibold">Next: </span>{next}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {c.status === "preparing" && <Button onClick={() => setStatus(c.id, "submitted", "Submitted at the branch")}>I submitted it</Button>}
              {(c.status === "submitted" || c.status === "waiting") && <Button variant="secondary" onClick={() => setStatus(c.id, "done", "Money received")}>Money received</Button>}
              {(c.status === "submitted" || c.status === "waiting") && <Button variant="secondary" onClick={() => setStatus(c.id, "stuck", "Marked as stuck")}>No reply, mark as stuck</Button>}
              {c.status === "stuck" && <Button variant="secondary" onClick={() => setStatus(c.id, "waiting", "Escalated")}>I escalated it</Button>}
            </div>
            {(overdue || c.status === "stuck") && (
              <div className="mt-3 rounded-lg border border-warning/40 p-3 text-sm">
                <p className="font-semibold">Stuck for {days} days? Escalate. <InfoButton label={c.decision.escalation.to}>{c.decision.escalation.how}</InfoButton></p>
                <p className="mt-1">{c.decision.escalation.how}</p>
                <p className="mt-2 rounded bg-surface p-2 text-xs">Complaint text (copy): &quot;I submitted a claim for {asset?.type === "insurance" ? "policy" : "account"} {asset?.identifierMasked} at {asset?.institution} on {c.submittedAt?.slice(0, 10)} under the {c.decision.routeLabel.toLowerCase()} with all listed documents. I have received no reply in {days} days. I request your intervention.&quot;</p>
              </div>
            )}
            <details className="mt-3 text-sm"><summary className="cursor-pointer text-muted">History</summary><ul className="mt-1 list-disc pl-5">{c.events.map((e) => <li key={e.at}>{e.at.slice(0, 10)}: {e.note}</li>)}</ul></details>
          </Card>
        );
      })}
    </div>
  );
}
