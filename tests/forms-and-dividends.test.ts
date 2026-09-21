import { describe, expect, it } from "vitest";
import { buildClaimPack } from "../src/lib/forms";
import { parseDividendList, searchDividends } from "../src/lib/dividends";
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

/**
 * The parser is what would load real published lists. Two synthetic snippets
 * in the two real layouts, so a change to either regex fails here rather than
 * in npm run check:dividends, which needs the real files on disk.
 */
describe("dividend list parser", () => {
  it("reads the folio, name, address, pincode, amount table layout across wrapped lines", () => {
    const text = `Folio No. Shareholder Name Address Unpaid dividend\nAmount\n38615 MR ASHA KUMARI 4-D MIG FLATS, DELHI, ,\n110007\n2,043.69\n64808 MRS RITA SEN B-271, NAGAR, KOLKATA, , 700009 2,533.50\n`;
    const rows = parseDividendList(text, "Test Ltd", "2024-25", "https://example.com");
    expect(rows.map((r) => [r.holder, r.amountInr])).toEqual([["ASHA KUMARI", 2043.69], ["RITA SEN", 2533.5]]);
    expect(searchDividends("rita sen", rows)).toHaveLength(1);
  });

  it("reads the statutory IEPF-2 layout by its anchor phrase", () => {
    const text = `GITA B JOSHI NA\n1609 GANDHI CHOWK\nHAPUR\n245101\nINDIA Uttar Pradesh HAPUR IN30000000000001\n7723\nAmount for unclaimed and\nunpaid dividend 60.00 17-Mar-2024 RAM No No FY-5\nKIRAN VERMA NA 341 NEHRU NAGAR\nAGRA AGRA 282002 INDIA Uttar Pradesh AGRA IN30000000000002\n1604\nAmount for unclaimed and\nunpaid dividend 260.00 17-Mar-2024 No No FY-5\n`;
    const rows = parseDividendList(text, "Test Ltd", "", "https://example.com");
    expect(rows.map((r) => [r.holder, r.amountInr])).toEqual([["GITA B JOSHI", 60], ["KIRAN VERMA", 260]]);
  });
});
