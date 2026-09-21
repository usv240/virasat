"use client";

import { useState } from "react";
import { Button, Card, InfoButton, Listen } from "@/components/ui";
import { inr, type FamilyState } from "@/lib/store";
import type { Asset, Claim as ClaimType, ClaimDecision, ClaimInput, Debate } from "@/lib/types";
import { DebatePanel } from "./debate-panel";
import { VoiceInput } from "./voice-input";
import { usePrefs } from "@/components/providers";

type Family = { state: FamilyState; update: (fn: (s: FamilyState) => FamilyState) => void };

const RELATIONS: ClaimInput["claimantRelation"][] = ["spouse", "child", "parent", "sibling", "other"];

export function Claim({ family, onTrack }: { family: Family; onTrack: () => void }) {
  const { state, update } = family;
  const { t, lang } = usePrefs();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [nominee, setNominee] = useState<boolean | null>(null);
  const [joint, setJoint] = useState(false);
  const [relation, setRelation] = useState<ClaimInput["claimantRelation"]>((state.claimant.relation as ClaimInput["claimantRelation"]) || "spouse");
  const [others, setOthers] = useState(true);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ decision: ClaimDecision; debate: Debate | null; warning?: string } | null>(null);
  const [claimant, setClaimant] = useState(state.claimant);
  const [packBusy, setPackBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const choose = (a: Asset) => {
    setAsset(a);
    setNominee(a.nomineeName ? true : a.source === "document" ? false : null);
    setResult(null);
  };

  async function decideRoute() {
    if (!asset) return;
    setBusy(true);
    setError(null);
    try {
      const doc = state.documents.find((d) => d.id === asset.id);
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (state.byoKey) headers["x-byo-anthropic-key"] = state.byoKey;
      const input: ClaimInput = { assetType: asset.type, institution: asset.institution, amountInr: asset.amountEstimateInr, nomineePresent: nominee, jointHolder: joint, claimantRelation: relation, otherHeirs: others };
      const r = await fetch("/api/v1/claims/route", { method: "POST", headers, body: JSON.stringify({ input, extraction: doc?.extraction ?? null, userNotes: notes, debate: true, lang }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.detail ?? "Failed");
      setResult(j);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function downloadPack() {
    if (!asset || !result) return;
    setPackBusy(true);
    try {
      const claim: ClaimType = {
        id: `claim-${Date.now()}`,
        assetId: asset.id,
        input: { assetType: asset.type, institution: asset.institution, amountInr: asset.amountEstimateInr, nomineePresent: nominee, jointHolder: joint, claimantRelation: relation, otherHeirs: others },
        decision: result.decision,
        debate: result.debate ?? undefined,
        checked: {},
        status: "preparing",
        createdAt: new Date().toISOString(),
        events: [{ at: new Date().toISOString(), note: "Claim pack prepared" }],
      };
      const r = await fetch("/api/v1/claims/pack", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ claim, asset, claimant }) });
      if (!r.ok) throw new Error("Could not build the pack");
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `virasat-claim-pack-${asset.institution.replace(/\s+/g, "-").toLowerCase()}.pdf`;
      a.click();
      update((s) => ({ ...s, claimant, claims: [...s.claims.filter((c) => c.assetId !== asset.id), claim] }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setPackBusy(false);
    }
  }

  if (state.assets.length === 0) {
    return <Card><h2 className="text-2xl">{t("claim.empty.title")}</h2><p className="mt-2">{t("claim.empty.body")}</p></Card>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl">{t("claim.title")}</h2>
        <p className="text-muted">{t("claim.step")} <Listen text={t("claim.step")} /></p>
      </div>

      <Card>
        <p className="font-semibold">{t("claim.which")}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {state.assets.map((a) => (
            <button key={a.id} type="button" onClick={() => choose(a)} aria-pressed={asset?.id === a.id} className={`min-h-11 rounded-lg border px-3 text-sm ${asset?.id === a.id ? "border-brand bg-brand-soft font-semibold text-brand" : "border-border bg-raised"}`}>
              {a.institution} · {inr(a.amountEstimateInr)}
            </button>
          ))}
        </div>
      </Card>

      {asset && (
        <Card className="space-y-5">
          <fieldset>
            <legend className="font-semibold">{t("claim.q.nominee")} {asset.type === "insurance" ? t("claim.q.policy") : t("claim.q.account")}? <InfoButton label="Nominee">A nominee is the person named on the account or policy to receive the money. It is written on the passbook, bond or the institution&apos;s records. If you are not sure, the branch can tell you for free.</InfoButton></legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {[[true, t("claim.yes")], [false, t("claim.no")], [null, t("claim.notsure")]].map(([v, l]) => (
                <button key={String(v)} type="button" onClick={() => setNominee(v as boolean | null)} aria-pressed={nominee === v} className={`min-h-11 rounded-lg border px-4 ${nominee === v ? "border-brand bg-brand-soft font-semibold text-brand" : "border-border"}`}>{l as string}</button>
              ))}
            </div>
            {asset.nomineeName && <p className="mt-1 text-sm text-muted">{t("claim.paper.names")} {asset.nomineeName}</p>}
          </fieldset>
          <fieldset>
            <legend className="font-semibold">{t("claim.q.relation")} {asset.holderName}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {RELATIONS.map((v) => (
                <button key={v} type="button" onClick={() => setRelation(v)} aria-pressed={relation === v} className={`min-h-11 rounded-lg border px-4 ${relation === v ? "border-brand bg-brand-soft font-semibold text-brand" : "border-border"}`}>{t(`claim.rel.${v}`)}</button>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-2"><input type="checkbox" checked={others} onChange={(e) => setOthers(e.target.checked)} className="h-5 w-5" /> {t("claim.q.others")} <InfoButton label="Other heirs">For example children or parents of the account holder. They may need to sign a no-objection letter. Virasat prepares the wording.</InfoButton></label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={joint} onChange={(e) => setJoint(e.target.checked)} className="h-5 w-5" /> {t("claim.q.joint")} <InfoButton label="Joint account">If two people held the account together, it usually passes to the surviving holder. Check the passbook for words like &quot;either or survivor&quot;.</InfoButton></label>
          </div>
          <div>
            <label className="text-sm font-semibold" htmlFor="notes">{t("claim.q.notes")}</label>
            <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-border bg-raised p-2" placeholder={t("claim.notes.placeholder")} />
            <div className="mt-1"><VoiceInput onText={setNotes} label={t("claim.speak")} /></div>
          </div>
          <Button onClick={decideRoute} loading={busy} size="lg">{t("claim.get")}</Button>
          {busy && <p className="text-sm text-muted">{t("claim.working")}</p>}
        </Card>
      )}

      {error && <p role="alert" className="rounded-lg border border-danger/40 bg-raised p-3 text-sm text-danger">{error}</p>}

      {asset && result && (
        <div className="space-y-4">
          <Card tone="brand">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">{t("claim.route")}</p>
            <h3 className="mt-1 text-2xl">{result.decision.routeLabel} <InfoButton label={result.decision.routeLabel}>{result.decision.notes.join(" ") || "Decided by the rule engine from the institution's own procedure."}</InfoButton></h3>
            <p className="mt-2 text-sm text-brand-contrast/80">{t("claim.rule")} {result.decision.ruleId} {t("claim.version")} {result.decision.ruleVersion} · {t("claim.about")} {result.decision.timelineDays} {t("claim.days")} · {t("claim.ifstuck")} {result.decision.escalation.afterDays} {t("claim.days")}: {result.decision.escalation.to}</p>
            {result.decision.notes.map((n) => <p key={n} className="mt-2 text-sm">{n}</p>)}
          </Card>

          {result.debate ? <DebatePanel debate={result.debate} routeLabel={result.decision.routeLabel} /> : <p className="text-sm text-muted">{result.warning ?? "Debate not run."}</p>}

          <Card>
            <h3 className="text-lg">{t("claim.docs")}</h3>
            <ul className="mt-3 space-y-2">
              {result.decision.checklist.map((c) => (
                <li key={c.id} className="flex items-start gap-2 text-sm">
                  <span className={`mt-1 inline-block h-3 w-3 shrink-0 rounded-full ${c.autoFilled ? "bg-success" : "bg-warning"}`} aria-hidden />
                  <span><span className="font-semibold">{c.label}</span>{c.autoFilled && <span className="ml-1 text-success">{t("claim.prepared")}</span>} <InfoButton label={c.label}>{c.what} Where to get it: {c.where}</InfoButton></span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="text-lg">{t("claim.details")}</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {(["name", "address", "phone"] as const).map((k) => (
                <label key={k} className="text-sm">
                  <span className="font-semibold">{t(`claim.${k}`)}</span>
                  <input value={claimant[k]} onChange={(e) => setClaimant({ ...claimant, [k]: e.target.value })} className="mt-1 min-h-11 w-full rounded-lg border border-border bg-raised px-3" />
                </label>
              ))}
              <label className="text-sm"><span className="font-semibold">{t("claim.relation")}</span><input value={t(`claim.rel.${relation}`)} readOnly className="mt-1 min-h-11 w-full rounded-lg border border-border bg-surface px-3" /></label>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={downloadPack} loading={packBusy} disabled={!claimant.name} size="lg">{t("claim.download")}</Button>
              <Button variant="secondary" onClick={onTrack}>{t("claim.trackthis")}</Button>
            </div>
            <p className="mt-2 text-xs text-muted">{t("claim.packnote")}</p>
          </Card>
        </div>
      )}
    </div>
  );
}
