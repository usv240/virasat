import { describe, expect, it } from "vitest";
import { classifyPayer, parseAisText, rowsToAssets } from "../src/lib/ais";

const SAMPLE = `Annual Information Statement (AIS)
PAN: XXXXX1234X Name: RAMESH KULKARNI Financial year: 2018-19
Interest from savings bank / deposits
1 STATE BANK OF INDIA 9,605
2 BANK OF MAHARASHTRA 2,520
Total 12,125
Dividend
1 BHARAT CEMENT LIMITED 900
Total 900
Purchase of units of mutual fund
1 NIVESH BALANCED FUND 85,000`;

describe("AIS parser", () => {
  it("finds every payer row and skips totals", () => {
    const rows = parseAisText(SAMPLE);
    expect(rows).toHaveLength(4);
    expect(rows.map((r) => r.section)).toEqual(["interest", "interest", "dividend", "mf"]);
    expect(rows[0]).toMatchObject({ payer: "STATE BANK OF INDIA", amountInr: 9605 });
  });

  it("handles PAN columns, rupee prefixes and decimals", () => {
    const rows = parseAisText(`Interest from deposits\n1 HDFC BANK LTD ABCDE1234F Rs. 1,234.50\n2 ICICI BANK INR 500`);
    expect(rows).toHaveLength(2);
    expect(rows[0].amountInr).toBe(1234.5);
    expect(rows[1].amountInr).toBe(500);
  });

  it("ignores sections that are not money held elsewhere", () => {
    const rows = parseAisText(`Salary\n1 ACME LTD 6,00,000\nInterest from deposits\n1 SBI 100`);
    expect(rows).toHaveLength(1);
    expect(rows[0].payer).toBe("SBI");
  });

  it("classifies payers into asset types", () => {
    expect(classifyPayer("STATE BANK OF INDIA").type).toBe("bank");
    expect(classifyPayer("LIFE INSURANCE CORPORATION OF INDIA").type).toBe("insurance");
    expect(classifyPayer("EMPLOYEES PROVIDENT FUND").type).toBe("pf");
    expect(classifyPayer("INDIA POST").type).toBe("post");
    expect(classifyPayer("TATA STEEL LIMITED").type).toBe("shares");
  });

  it("estimates principal from yearly interest and dividends, and merges duplicate payers", () => {
    const assets = rowsToAssets(parseAisText(`Interest from deposits\n1 SBI 3,000\n2 SBI 3,000\nDividend\n1 INFOSYS LIMITED 1,500`));
    expect(assets).toHaveLength(2);
    expect(assets[0].amountEstimateInr).toBe(100000);
    expect(assets[1].type).toBe("shares");
    expect(assets[1].amountEstimateInr).toBe(100000);
    expect(assets.every((a) => a.source === "ais")).toBe(true);
  });
});
