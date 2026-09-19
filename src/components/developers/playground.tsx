"use client";

import { useState } from "react";
import { Button, Card } from "@/components/ui";

const PRESETS: Record<string, { method: string; path: string; body?: string }> = {
  route: { method: "POST", path: "/api/v1/claims/route", body: JSON.stringify({ input: { assetType: "bank", institution: "State Bank of India", amountInr: 158420, nomineePresent: true, jointHolder: false, claimantRelation: "spouse", otherHeirs: true }, debate: true }, null, 2) },
  rulesOnly: { method: "POST", path: "/api/v1/claims/route", body: JSON.stringify({ input: { assetType: "insurance", institution: "Life Insurance Corporation of India", amountInr: 200000, nomineePresent: false, jointHolder: false, claimantRelation: "spouse", otherHeirs: true }, debate: false }, null, 2) },
  dividends: { method: "GET", path: "/api/v1/dividends/search?name=Ramesh%20Kulkarni" },
  rules: { method: "GET", path: "/api/v1/rules" },
  health: { method: "GET", path: "/api/v1/health" },
};

export function Playground() {
  const [preset, setPreset] = useState("route");
  const [body, setBody] = useState(PRESETS.route.body ?? "");
  const [out, setOut] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const p = PRESETS[preset];

  async function run() {
    setBusy(true);
    setOut("");
    try {
      const r = await fetch(p.path, { method: p.method, headers: { Authorization: "Bearer vs_test_demo", ...(p.method === "POST" ? { "content-type": "application/json" } : {}) }, body: p.method === "POST" ? body : undefined });
      const text = await r.text();
      setStatus(`${r.status} · RateLimit-Remaining: ${r.headers.get("RateLimit-Remaining")} · Tier: ${r.headers.get("X-Virasat-Tier")}`);
      try { setOut(JSON.stringify(JSON.parse(text), null, 2)); } catch { setOut(text); }
    } catch (e) {
      setOut(e instanceof Error ? e.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-sm font-semibold" htmlFor="preset">Request</label>
        <select id="preset" value={preset} onChange={(e) => { setPreset(e.target.value); setBody(PRESETS[e.target.value].body ?? ""); setOut(""); }} className="min-h-11 rounded-lg border border-border bg-raised px-2 text-sm">
          <option value="route">Claim route with debate</option>
          <option value="rulesOnly">Claim route, rules only</option>
          <option value="dividends">Dividend search</option>
          <option value="rules">List rule sets</option>
          <option value="health">Health</option>
        </select>
        <code className="rounded bg-surface px-2 py-1 text-xs">{p.method} {p.path}</code>
        <Button onClick={run} loading={busy}>Send with vs_test_demo</Button>
      </div>
      {p.method === "POST" && <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} aria-label="Request body" className="mt-3 w-full rounded-lg border border-border bg-raised p-2 font-mono text-xs" />}
      {status && <p className="mt-2 text-xs text-muted">{status}</p>}
      {out && <pre className="mt-2 max-h-96 overflow-auto rounded-lg bg-surface p-3 text-xs"><code>{out}</code></pre>}
    </Card>
  );
}
