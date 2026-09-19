/**
 * AIS parser.
 *
 * Plain words: the Annual Information Statement (AIS) is a yearly PDF from the
 * Income Tax Department. It lists interest paid by every bank and dividends paid
 * by every company to a person. We read its tables with code (no AI needed for
 * the common cases) and turn each row into a place to search.
 */
import type { Asset, AssetKind } from "./types";

export type AisRow = { section: "interest" | "dividend" | "mf" | "other"; payer: string; amountInr: number; page?: number };

const INSTITUTIONS: { match: RegExp; name: string; type: AssetKind }[] = [
  { match: /state bank of india|\bsbi\b/i, name: "State Bank of India", type: "bank" },
  { match: /hdfc bank/i, name: "HDFC Bank", type: "bank" },
  { match: /icici bank/i, name: "ICICI Bank", type: "bank" },
  { match: /bank of (baroda|india|maharashtra)|punjab national|canara|union bank|axis bank|kotak/i, name: "Bank", type: "bank" },
  { match: /post ?office|india post|department of posts/i, name: "India Post", type: "post" },
  { match: /life insurance corporation|\blic\b/i, name: "Life Insurance Corporation of India", type: "insurance" },
  { match: /insurance|assurance/i, name: "Insurer", type: "insurance" },
  { match: /mutual fund|asset management|\bamc\b/i, name: "Mutual fund", type: "mf" },
  { match: /provident fund|epfo|employees'? provident/i, name: "EPFO", type: "pf" },
  { match: /limited|ltd\b|\binc\b|corporation/i, name: "Company", type: "shares" },
];

export function classifyPayer(payer: string): { name: string; type: AssetKind } {
  for (const i of INSTITUTIONS) if (i.match.test(payer)) return { name: i.name === "Bank" || i.name === "Insurer" || i.name === "Mutual fund" || i.name === "Company" ? payer.trim() : i.name, type: i.type };
  return { name: payer.trim(), type: "bank" };
}

/** Parse the plain text of an AIS PDF into rows. Handles the common table layouts. */
export function parseAisText(text: string): AisRow[] {
  const rows: AisRow[] = [];
  let section: AisRow["section"] = "other";
  const lines = text.split(/\r?\n/).map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean);
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (/interest from (savings|deposit|deposits|term)/.test(lower) || /^interest/.test(lower)) section = "interest";
    else if (/^dividend/.test(lower) || /dividend received/.test(lower)) section = "dividend";
    else if (/mutual fund|purchase of units|sale of units/.test(lower)) section = "mf";
    else if (/^(salary|rent|business|capital gain)/.test(lower)) section = "other";
    // A row: payer name ... amount (Indian format allowed)
    const m = line.match(/^(?:\d+\s+)?([A-Za-z][A-Za-z0-9&.,()' -]{1,80}?)\s+(?:[A-Z]{5}\d{4}[A-Z]\s+)?(?:INR|Rs\.?|₹)?\s*([\d,]+(?:\.\d{1,2})?)\s*$/);
    if (m && section !== "other") {
      const payer = m[1].replace(/\s+(Ltd|Limited)\.?$/i, (s) => s).trim();
      const amount = Number(m[2].replace(/,/g, ""));
      if (!Number.isNaN(amount) && amount > 0 && !/^(total|sub total|grand total)/i.test(payer)) rows.push({ section, payer, amountInr: amount });
    }
  }
  return rows;
}

/** Turn rows into assets. Interest and dividends are yearly amounts; we estimate the principal. */
export function rowsToAssets(rows: AisRow[]): Asset[] {
  const byPayer = new Map<string, AisRow>();
  for (const r of rows) {
    const key = r.payer.toLowerCase();
    const prev = byPayer.get(key);
    if (prev) prev.amountInr += r.amountInr;
    else byPayer.set(key, { ...r });
  }
  return [...byPayer.values()].map((r, i) => {
    const cls = classifyPayer(r.payer);
    const type: AssetKind = r.section === "dividend" ? "shares" : r.section === "mf" ? "mf" : cls.type;
    // Rough principal estimate: interest at about 6 percent a year; dividends at about 1.5 percent yield.
    const estimate = r.section === "interest" ? Math.round(r.amountInr / 0.06) : r.section === "dividend" ? Math.round(r.amountInr / 0.015) : r.amountInr;
    return {
      id: `ais-${i}`,
      type,
      institution: type === "shares" ? r.payer : cls.name,
      identifierMasked: "Not in AIS",
      holderName: "Account holder (from AIS)",
      nomineeName: null,
      amountEstimateInr: estimate,
      source: "ais",
      sourceDetail: `${r.section === "interest" ? "Interest" : r.section === "dividend" ? "Dividend" : "Amount"} in AIS: ₹${r.amountInr.toLocaleString("en-IN")}`,
      confidence: "medium",
      status: "found",
    };
  });
}
