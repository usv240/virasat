"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button, Card, Confidence, SourceBadge } from "@/components/ui";
import { SAMPLE_AIS_ASSETS, SAMPLE_DOCS } from "@/lib/sample";
import { extractionToAsset, inr } from "@/lib/store";
import type { Asset } from "@/lib/types";

export function DemoEmbed() {
  const [assets, setAssets] = useState<Asset[] | null>(null);
  const [loading, setLoading] = useState(false);
  const run = () => {
    setLoading(true);
    setTimeout(() => {
      const fromDocs = SAMPLE_DOCS.map((d) => extractionToAsset(d.extraction, `doc-${d.id}`));
      const merged = [...fromDocs, ...SAMPLE_AIS_ASSETS.filter((a) => !fromDocs.some((f) => f.institution === a.institution))];
      setAssets(merged.sort((a, b) => (b.amountEstimateInr ?? 0) - (a.amountEstimateInr ?? 0)));
      setLoading(false);
    }, 900);
  };
  const total = assets?.reduce((s, a) => s + (a.amountEstimateInr ?? 0), 0) ?? 0;
  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <Card>
        <p className="font-semibold">Sunita&apos;s papers</p>
        <ul className="mt-3 space-y-2">
          {SAMPLE_DOCS.map((d) => (
            <li key={d.id} className="flex items-center gap-3">
              <Image src={d.file} alt="" width={128} height={96} className="h-12 w-16 rounded object-cover" />
              <span className="text-sm">{d.title}</span>
            </li>
          ))}
          <li className="text-sm text-muted">plus Ramesh&apos;s tax statement (AIS)</li>
        </ul>
        <Button onClick={run} loading={loading} className="mt-4 w-full">Use these papers</Button>
        <p className="mt-2 text-xs text-muted">Sample data. Nothing is sent anywhere.</p>
      </Card>
      <Card className="min-h-64" interactive>
        {!assets && !loading && <p className="text-muted">Press the button and Virasat will list every place the family has money.</p>}
        {loading && (
          <div>
            <div className="skeleton h-9 w-40" />
            <div className="skeleton mt-2 h-4 w-28" />
            <div className="mt-4 space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="skeleton h-4 w-44" />
                    <div className="skeleton mt-2 h-3 w-64" />
                  </div>
                  <div className="skeleton h-4 w-20" />
                </div>
              ))}
            </div>
          </div>
        )}
        {assets && (
          <>
            <p className="text-3xl font-semibold text-brand tabular">{inr(total)}</p>
            <p className="text-sm text-muted">estimated, waiting in {assets.length} places</p>
            <ul className="mt-4 divide-y divide-border">
              {assets.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <p className="font-semibold">{a.institution}</p>
                    <p className="text-xs text-muted">{a.sourceDetail} · {a.identifierMasked}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="tabular font-semibold">{inr(a.amountEstimateInr)}</span>
                    <Confidence level={a.confidence} />
                    <SourceBadge kind="sample" />
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/try" className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-brand px-4 font-semibold text-brand-contrast">Continue in the full app: claim this money</Link>
          </>
        )}
      </Card>
    </div>
  );
}
