"use client";

import { useRef, useState } from "react";
import { Camera, FileText, Search, ExternalLink } from "lucide-react";
import { Button, Card, Confidence, InfoButton, Listen, SourceBadge } from "@/components/ui";
import { extractionToAsset, inr, type FamilyState } from "@/lib/store";
import { SAMPLE_DOCS } from "@/lib/sample";
import { searchPlan } from "@/lib/portals";
import type { Asset, Extraction } from "@/lib/types";
import { VoiceInput } from "./voice-input";

type Family = { state: FamilyState; update: (fn: (s: FamilyState) => FamilyState) => void };

export function Find({ family, ai, onClaim }: { family: Family; ai: "live" | "sample" | "unknown"; onClaim: () => void }) {
  const { state, update } = family;
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<Asset | null>(null);
  const [divName, setDivName] = useState("");
  const [divResults, setDivResults] = useState<{ company: string; year: string; holder: string; amountInr: number }[] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const aisRef = useRef<HTMLInputElement>(null);

  const consent = state.consentAt !== null;
  const giveConsent = () => update((s) => ({ ...s, consentAt: new Date().toISOString() }));

  function addDocument(id: string, title: string, extraction: Extraction, mode: "live" | "sample", preview?: string) {
    update((s) => {
      const asset = extractionToAsset(extraction, id);
      return { ...s, documents: [...s.documents.filter((d) => d.id !== id), { id, title, extraction, mode, preview }], assets: [...s.assets.filter((a) => a.id !== id), asset] };
    });
  }

  async function runSample(sampleId: string) {
    setBusy(sampleId);
    setError(null);
    try {
      const fd = new FormData();
      fd.set("sampleId", sampleId);
      const r = await fetch("/api/v1/extract", { method: "POST", body: fd });
      const j = await r.json();
      if (!r.ok) throw new Error(j.detail ?? "Failed");
      const doc = SAMPLE_DOCS.find((d) => d.id === sampleId)!;
      addDocument(`doc-${sampleId}`, doc.title, j.extraction, j.mode, doc.file);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  }

  async function runUpload(file: File) {
    setBusy("upload");
    setError(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const headers: Record<string, string> = {};
      if (state.byoKey) headers["x-byo-anthropic-key"] = state.byoKey;
      const r = await fetch("/api/v1/extract", { method: "POST", body: fd, headers });
      const j = await r.json();
      if (!r.ok) throw new Error(j.detail ?? "Failed");
      const preview = URL.createObjectURL(file);
      addDocument(`doc-${Date.now()}`, file.name, j.extraction, j.mode, preview);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  }

  async function runAis(file?: File) {
    setBusy("ais");
    setError(null);
    try {
      const fd = new FormData();
      if (file) fd.set("file", file);
      else fd.set("sample", "true");
      const r = await fetch("/api/v1/ais/parse", { method: "POST", body: fd });
      const j = await r.json();
      if (!r.ok) throw new Error(j.detail ?? "Failed");
      update((s) => {
        const fresh = (j.assets as Asset[]).filter((a) => !s.assets.some((x) => x.institution.toLowerCase() === a.institution.toLowerCase()));
        return { ...s, assets: [...s.assets, ...fresh.map((a) => ({ ...a, id: `ais-${Date.now()}-${a.id}` }))] };
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  }

  async function runDividends() {
    const r = await fetch(`/api/v1/dividends/search?name=${encodeURIComponent(divName)}`);
    const j = await r.json();
    setDivResults(r.ok ? j.results : []);
  }

  const total = state.assets.reduce((s, a) => s + (a.amountEstimateInr ?? 0), 0);

  if (!consent) {
    return (
      <Card className="max-w-xl">
        <h2 className="text-2xl">Before we start</h2>
        <p className="mt-3">Your papers stay in your browser. When you press &quot;Read this paper&quot;, that one photo is sent to the AI to read and is not stored on our servers. You can delete everything from the Help tab at any time.</p>
        <p className="mt-2 text-sm text-muted">We keep only what is needed, with your consent, as India&apos;s data protection law (DPDP Act 2023) requires. <InfoButton label="What we keep">In this prototype: nothing on our servers. Extracted details, your assets, claims and Vault are stored in your own browser. AI calls are not used for training.</InfoButton></p>
        <div className="mt-5 flex gap-3">
          <Button onClick={giveConsent}>I agree, let us start</Button>
          <Button variant="secondary" onClick={() => history.back()}>Not now</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl">Find your family&apos;s money</h2>
        <p className="text-muted">Step 1 of 4. Add papers, the tax statement, or search by name. <Listen text="Step 1 of 4. Find your family's money. Add papers, the tax statement, or search by name." /></p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <h3 className="flex items-center gap-2 text-lg"><Camera className="h-5 w-5 text-brand" aria-hidden /> Photograph papers</h3>
          <p className="mt-1 text-sm text-muted">Passbook, policy bond, share certificate, PF slip. JPEG or PNG, under 10 MB.</p>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => e.target.files?.[0] && runUpload(e.target.files[0])} />
          <Button className="mt-3 w-full" onClick={() => fileRef.current?.click()} loading={busy === "upload"} disabled={ai !== "live" && !state.byoKey}>
            {ai === "live" || state.byoKey ? "Take or choose a photo" : "Needs live AI (see Help)"}
          </Button>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted">Or use Sunita&apos;s sample papers</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {SAMPLE_DOCS.map((d) => (
              <Button key={d.id} variant="secondary" onClick={() => runSample(d.id)} loading={busy === d.id} disabled={state.documents.some((x) => x.id === `doc-${d.id}`)}>
                {d.id === "passbook" ? "Passbook" : d.id === "lic" ? "LIC bond" : "Share certificate"}
              </Button>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="flex items-center gap-2 text-lg"><FileText className="h-5 w-5 text-brand" aria-hidden /> Tax statement (AIS) <InfoButton label="Tax statement (AIS)">The Annual Information Statement lists interest from every bank and dividends from every company paid to a person. A legal heir can download it from incometax.gov.in after registering as the representative. It finds accounts you never knew about. No AI is needed to read it.</InfoButton></h3>
          <p className="mt-1 text-sm text-muted">Upload the AIS PDF. Virasat reads its tables and lists every payer.</p>
          <input ref={aisRef} type="file" accept="application/pdf" className="sr-only" onChange={(e) => e.target.files?.[0] && runAis(e.target.files[0])} />
          <Button className="mt-3 w-full" onClick={() => aisRef.current?.click()} loading={busy === "ais"}>Upload AIS PDF</Button>
          <div className="mt-2 flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => runAis()} loading={busy === "ais"}>Use Ramesh&apos;s sample AIS</Button>
            <a href="/samples/sample-ais.pdf" className="inline-flex min-h-11 items-center text-sm text-brand underline" download>Download sample</a>
          </div>
        </Card>
        <Card>
          <h3 className="flex items-center gap-2 text-lg"><Search className="h-5 w-5 text-brand" aria-hidden /> Unpaid dividends by name <InfoButton label="Unpaid dividend lists">Listed companies must publish the names of shareholders whose dividends were never paid. Virasat indexes these lists so you can search by name. The demo index is sample data in the same shape as the real lists.</InfoButton></h3>
          <div className="mt-2 flex gap-2">
            <input value={divName} onChange={(e) => setDivName(e.target.value)} placeholder="Shareholder name" aria-label="Shareholder name" className="min-h-11 w-full rounded-lg border border-border bg-raised px-3" />
            <Button onClick={runDividends} disabled={divName.trim().length < 3}>Search</Button>
          </div>
          <div className="mt-2"><VoiceInput onText={setDivName} label="Say the name" /></div>
          {divResults && (
            <ul className="mt-3 space-y-1 text-sm">
              {divResults.length === 0 && <li className="text-muted">No match in the index. Try a shorter name.</li>}
              {divResults.map((r, i) => (
                <li key={i} className="flex justify-between rounded bg-surface px-2 py-1"><span>{r.company} ({r.year})</span><span className="tabular">{inr(r.amountInr)}</span></li>
              ))}
              {divResults.length > 0 && (
                <li>
                  <Button variant="quiet" onClick={() => update((s) => ({ ...s, assets: [...s.assets, { id: `div-${Date.now()}`, type: "shares", institution: divResults[0].company, identifierMasked: "See company list", holderName: divResults[0].holder, nomineeName: null, amountEstimateInr: divResults.reduce((a, b) => a + b.amountInr, 0), source: "dividend_index", sourceDetail: `${divResults.length} unpaid dividend entries`, confidence: "medium", status: "found" }] }))}>Add to my list</Button>
                </li>
              )}
            </ul>
          )}
        </Card>
      </div>

      {error && <p role="alert" className="rounded-lg border border-danger/40 bg-raised p-3 text-sm text-danger">{error}</p>}

      {state.documents.length > 0 && (
        <div>
          <h3 className="text-lg">What Virasat read</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {state.documents.map((d) => (
              <Card key={d.id} className="text-sm">
                {d.preview && /* eslint-disable-next-line @next/next/no-img-element */ <img src={d.preview} alt="" className="mb-2 h-24 w-full rounded object-cover" />}
                <p className="font-semibold">{d.extraction.institution.name}</p>
                <p className="text-muted">{d.extraction.document_kind.replace("_", " ")} · {d.extraction.identifier.value_masked}</p>
                <p>Holder: {d.extraction.holder_name.value}</p>
                <p>Nominee: {d.extraction.nominee_name.value ?? "not visible"}</p>
                <p className="mt-1 italic text-muted">{d.extraction.notes_for_user}</p>
                <div className="mt-2 flex items-center justify-between"><Confidence level={d.extraction.identifier.confidence} /><SourceBadge kind={d.mode === "sample" ? "sample" : "yours"} /></div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {state.assets.length > 0 && (
        <Card>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-3xl font-semibold text-brand tabular">{inr(total)}</p>
              <p className="text-sm text-muted">estimated, waiting in {state.assets.length} places <InfoButton label="How we estimate">Amounts from documents are the last balance or sum assured. Amounts from the AIS are estimated from the yearly interest (about 6 percent) or dividend (about 1.5 percent). The institution confirms the real figure.</InfoButton></p>
            </div>
            <Button onClick={onClaim}>Next: claim this money</Button>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {[...state.assets].sort((a, b) => (b.amountEstimateInr ?? 0) - (a.amountEstimateInr ?? 0)).map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-semibold">{a.institution}</p>
                  <p className="text-xs text-muted">{a.sourceDetail} · {a.identifierMasked} · {a.holderName}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="tabular font-semibold">{inr(a.amountEstimateInr)}</span>
                  <Confidence level={a.confidence} />
                  <SourceBadge kind={a.source === "dividend_index" ? "public" : state.documents.find((d) => d.id === a.id)?.mode === "live" ? "yours" : "sample"} />
                  <Button variant="secondary" onClick={() => setPlan(a)}>Search here</Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {plan && <PlanSheet asset={plan} onClose={() => setPlan(null)} onFound={() => { update((s) => ({ ...s, assets: s.assets.map((x) => (x.id === plan.id ? { ...x, status: "confirmed" } : x)) })); setPlan(null); }} />}
    </div>
  );
}

function PlanSheet({ asset, onClose, onFound }: { asset: Asset; onClose: () => void; onFound: () => void }) {
  const p = searchPlan(asset);
  const speak = `${p.portal}. ${p.steps.join(" ")}`;
  return (
    <div role="dialog" aria-modal="true" aria-label={`How to search ${p.portal}`} className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-raised p-5 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Where to search</p>
        <h3 className="mt-1 text-xl text-brand">{p.portal} <InfoButton label={p.portal}>{p.info}</InfoButton></h3>
        <p className="mt-2 text-sm">You log in yourself. Virasat has pre-filled what you need to type.</p>
        <p className="mt-3 text-sm font-semibold">You will need</p>
        <ul className="list-disc pl-5 text-sm">{p.needs.map((n) => <li key={n}>{n}</li>)}</ul>
        <p className="mt-3 text-sm font-semibold">Steps</p>
        <ol className="list-decimal space-y-1 pl-5 text-sm">{p.steps.map((s) => <li key={s}>{s}</li>)}</ol>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={p.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand px-4 font-semibold text-brand-contrast">Open {p.portal.split(" ")[0]} <ExternalLink className="h-4 w-4" aria-hidden /></a>
          <Button variant="secondary" onClick={onFound}>I found it</Button>
          <Listen text={speak} />
          <Button variant="quiet" onClick={onClose}>Close</Button>
        </div>
        <a href={p.sourceHref} target="_blank" rel="noreferrer" className="mt-3 block text-xs text-muted underline">Source for this guidance</a>
      </div>
    </div>
  );
}
