"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Card, InfoButton } from "@/components/ui";
import type { FamilyState } from "@/lib/store";

type Family = { state: FamilyState; update: (fn: (s: FamilyState) => FamilyState) => void; reset: () => void };

export function HelpTab({ family }: { family: Family }) {
  const { state, update, reset } = family;
  const [key, setKey] = useState("");
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="space-y-6">
      <h2 className="text-2xl">Help and settings</h2>
      <Card>
        <h3 className="text-lg">Bring your own AI key <InfoButton label="Bring your own key">If this server has no AI key, you can use your own Anthropic key. It stays in your browser and is sent only with your own requests, over HTTPS. It is never stored on our servers or logged.</InfoButton></h3>
        <p className="mt-1 text-sm text-muted">Only needed when the banner says Sample mode and you want to read your own photos.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <input type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="sk-ant-..." aria-label="Anthropic API key" className="min-h-11 flex-1 rounded-lg border border-border bg-raised px-3" />
          <Button onClick={() => { update((s) => ({ ...s, byoKey: key.trim() || null })); setKey(""); }}>{state.byoKey ? "Replace key" : "Save key"}</Button>
          {state.byoKey && <Button variant="secondary" onClick={() => update((s) => ({ ...s, byoKey: null }))}>Remove key</Button>}
        </div>
        {state.byoKey && <p className="mt-2 text-sm text-success">A key is saved in this browser.</p>}
      </Card>
      <Card>
        <h3 className="text-lg">Delete my data</h3>
        <p className="mt-1 text-sm">Removes every document, asset, claim and Vault item from this browser. Nothing is stored on our servers, so this deletes everything.</p>
        {!confirm ? <Button variant="danger" className="mt-3" onClick={() => setConfirm(true)}>Delete everything</Button> : (
          <div className="mt-3 flex gap-2"><Button variant="danger" onClick={() => { reset(); setConfirm(false); }}>Yes, delete it all</Button><Button variant="secondary" onClick={() => setConfirm(false)}>Cancel</Button></div>
        )}
      </Card>
      <Card>
        <h3 className="text-lg">Learn more</h3>
        <ul className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
          {[["/#faq", "Questions people ask"], ["/glossary", "Glossary of terms"], ["/how-ai-works", "How our AI works"], ["/privacy", "Privacy"], ["/judges", "For judges"], ["/developers", "For developers"]].map(([h, l]) => (
            <li key={h}><Link href={h} className="block rounded-lg border border-border px-3 py-2 hover:bg-surface">{l}</Link></li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
