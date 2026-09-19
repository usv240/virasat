"use client";

/**
 * Browser store. Everything a family does lives in their own browser
 * (localStorage). Nothing is uploaded unless they run the AI on a document.
 */
import type { Asset, Claim, Extraction, VaultItem } from "./types";
import { createJsonStore, useHydrated } from "./use-local-storage";

export type FamilyState = {
  consentAt: string | null;
  claimant: { name: string; relation: string; address: string; phone: string };
  documents: { id: string; title: string; preview?: string; extraction: Extraction; mode: "live" | "sample" }[];
  assets: Asset[];
  claims: Claim[];
  vault: VaultItem[];
  byoKey: string | null;
};

export const EMPTY: FamilyState = {
  consentAt: null,
  claimant: { name: "", relation: "spouse", address: "", phone: "" },
  documents: [],
  assets: [],
  claims: [],
  vault: [],
  byoKey: null,
};

const family = createJsonStore<FamilyState>("virasat.family.v1", EMPTY);

export function useFamily() {
  const state = family.use();
  const ready = useHydrated();
  return { state, update: family.update, reset: family.reset, ready };
}

export function extractionToAsset(e: Extraction, id: string): Asset {
  const amount = e.amounts.find((a) => /balance|sum|amount|value/i.test(a.label))?.value_inr ?? null;
  const conf = e.institution.confidence === "high" && e.identifier.confidence === "high" ? "high" : e.institution.confidence === "low" ? "low" : "medium";
  return {
    id,
    type: e.asset_type,
    institution: e.institution.name,
    identifierMasked: e.identifier.value_masked,
    holderName: e.holder_name.value,
    nomineeName: e.nominee_name.value,
    amountEstimateInr: amount,
    source: "document",
    sourceDetail: `Read from ${e.document_kind.replace("_", " ")}`,
    confidence: conf,
    status: "found",
  };
}

export function inr(n: number | null | undefined): string {
  if (n === null || n === undefined) return "Unknown";
  return `₹${n.toLocaleString("en-IN")}`;
}
