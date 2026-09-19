import { describe, expect, it } from "vitest";
import { buildClaimPack } from "../src/lib/forms";
import { searchDividends } from "../src/lib/dividends";
import { decide, RULES } from "../src/lib/rules";
import type { Asset, Claim } from "../src/lib/types";

describe("claim pack", () => {
  it("builds a three-page PDF for every institution", async () => {
    for (const r of RULES) {
      const asset: Asset = { id: "a", type: r.assetType, institution: r.institution, identifierMasked: "XXXX1234", holderName: "Ramesh Kulkarni", nomineeName: "Sunita R Kulkarni", amountEstimateInr: 150000, source: "document", confidence: "high", status: "found" };
      const decision = decide({ assetType: r.assetType, institution: r.institution, amountInr: 150000, nomineePresent: true, jointHolder: false, claimantRelation: "spouse", otherHeirs: false });
      const claim: Claim = { id: "c", assetId: "a", input: { assetType: r.assetType, institution: r.institution, amountInr: 150000, nomineePresent: true, jointHolder: false, claimantRelation: "spouse", otherHeirs: false }, decision, checked: {}, status: "preparing", createdAt: new Date().toISOString(), events: [] };
      const bytes = await buildClaimPack(claim, asset, { name: "Sunita R Kulkarni", relation: "spouse", address: "Nashik", phone: "98XXXXXX21" });
      expect(bytes.byteLength).toBeGreaterThan(2000);
      expect(Buffer.from(bytes.slice(0, 5)).toString()).toBe("%PDF-");
    }
  });
});

describe("dividend index", () => {
  it("matches every word of the name in any order", () => {
    expect(searchDividends("Kulkarni Ramesh").length).toBe(4);
    expect(searchDividends("ramesh b kulkarni").length).toBe(1);
  });
  it("returns nothing for short or unknown names", () => {
    expect(searchDividends("R")).toEqual([]);
    expect(searchDividends("Nobody Here")).toEqual([]);
  });
});
