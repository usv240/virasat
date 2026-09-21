"use client";

import { useState } from "react";
import { ThumbsUp, Search, Gavel } from "lucide-react";
import { clsx } from "clsx";
import { Button, Card, Confidence, InfoButton, Listen } from "@/components/ui";
import type { Debate } from "@/lib/types";
import { inrFromUsd, rupees, usd } from "@/lib/cost";
import { usePrefs } from "@/components/providers";

export function DebatePanel({ debate, routeLabel }: { debate: Debate; routeLabel: string }) {
  const { t } = usePrefs();
  const [open, setOpen] = useState(false);
  const v = debate.verdict;
  const speak = `Verdict: ${v.verdict}. ${v.reasons.join(". ")}. Risks: ${v.risks.join(". ") || "none"}. Next step: ${v.next_step_for_user}`;
  return (
    <div>
      <Card className="border-l-0">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t("debate.verdict")} <InfoButton label="The Two AI Debate">Two AI reviewers argued about this result before we showed it to you. A third one decided. This catches mistakes a single AI can miss. The referee cannot change the route the rules chose; it can only add cautions.</InfoButton></p>
            <h3 className="mt-1 text-xl text-brand">{v.verdict}</h3>
          </div>
          <Confidence level={v.confidence} />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold">{t("debate.why")}</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">{v.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
          </div>
          <div>
            <p className="text-sm font-semibold">{t("debate.risks")}</p>
            {v.risks.length === 0 ? <p className="mt-1 text-sm text-muted">{t("debate.norisks")}</p> : <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">{v.risks.map((r) => <li key={r}>{r}</li>)}</ul>}
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-accent-soft p-3 text-sm">
          <span className="font-semibold">{t("debate.next")} </span>{v.next_step_for_user}
        </div>
        {v.raise_to_human_review && <p className="mt-2 text-sm font-semibold text-warning">{t("debate.human")}</p>}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={() => setOpen((o) => !o)} aria-expanded={open}>{open ? t("debate.hide") : t("debate.see")}</Button>
          <Listen text={speak} />
          <span className="text-xs text-muted">{routeLabel} · {t("debate.rules")} {v.rule_ids_checked.join(", ")} · {debate.mode === "live" ? `${debate.model}, ${(debate.latencyMs / 1000).toFixed(1)} s` : t("debate.sample")}</span>
          {debate.usage && (
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              · {t("debate.cost")} {rupees(inrFromUsd(usd(debate.usage, debate.model)))}
              <InfoButton label={t("debate.cost")}>{t("debate.cost.info")}</InfoButton>
            </span>
          )}
        </div>
      </Card>
      {open && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Role icon={ThumbsUp} name={t("debate.supporter")} color="text-success" position={debate.supporter.position} points={debate.supporter.points} ev={t("debate.evidence")} />
          <Role icon={Search} name={t("debate.challenger")} color="text-warning" position={debate.challenger.position} points={debate.challenger.points} ev={t("debate.evidence")} />
          <Card className="md:col-span-2">
            <p className="flex items-center gap-2 font-semibold text-brand"><Gavel className="h-4 w-4" aria-hidden /> {t("debate.referee")}</p>
            <p className="mt-2 text-sm"><span className="font-semibold">{t("debate.change")} </span>{v.what_would_change_my_mind}</p>
          </Card>
        </div>
      )}
    </div>
  );
}

function Role({ icon: Icon, name, color, position, points, ev }: { icon: typeof ThumbsUp; name: string; color: string; position: string; points: { claim: string; evidence: string }[]; ev: string }) {
  return (
    <Card>
      <p className={clsx("flex items-center gap-2 font-semibold", color)}><Icon className="h-4 w-4" aria-hidden /> {name}</p>
      <p className="mt-2 text-sm font-medium">{position}</p>
      <ul className="mt-3 space-y-2 text-sm">
        {points.map((p) => (
          <li key={p.claim} className="rounded-lg bg-surface p-2">
            <p>{p.claim}</p>
            <p className="mt-1 text-xs text-muted">{ev} {p.evidence}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
