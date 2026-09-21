/**
 * Unpaid dividend index.
 *
 * Plain words: listed companies must publish the names of shareholders whose
 * dividends were never paid. This index lets a family search those lists by name.
 *
 * The demo index below is SAMPLE DATA with made-up names, in the same shape as the
 * public lists. Republishing the real lists next to real names would hand a
 * fraudster a target list, so the product ships without them. The parser that
 * would load them is real, though, and `npm run check:dividends` runs it against
 * real published lists and reports how many rows it recovers, without keeping
 * a single name.
 */
export type DividendEntry = { company: string; year: string; holder: string; city: string; amountInr: number; sourceUrl: string };

export const DIVIDEND_INDEX: DividendEntry[] = [
  { company: "Bharat Cement Ltd", year: "2017-18", holder: "RAMESH KULKARNI", city: "NASHIK", amountInr: 900, sourceUrl: "https://example.com/bharat-cement/unpaid-dividend" },
  { company: "Bharat Cement Ltd", year: "2018-19", holder: "RAMESH KULKARNI", city: "NASHIK", amountInr: 900, sourceUrl: "https://example.com/bharat-cement/unpaid-dividend" },
  { company: "Bharat Cement Ltd", year: "2019-20", holder: "RAMESH KULKARNI", city: "NASHIK", amountInr: 1000, sourceUrl: "https://example.com/bharat-cement/unpaid-dividend" },
  { company: "Deccan Textiles Ltd", year: "2016-17", holder: "RAMESH B KULKARNI", city: "NASHIK", amountInr: 450, sourceUrl: "https://example.com/deccan-textiles/unpaid-dividend" },
  { company: "Sahyadri Motors Ltd", year: "2019-20", holder: "SUNITA R KULKARNI", city: "NASHIK", amountInr: 320, sourceUrl: "https://example.com/sahyadri-motors/unpaid-dividend" },
  { company: "Konkan Sugar Ltd", year: "2018-19", holder: "ANITA DESHPANDE", city: "PUNE", amountInr: 1250, sourceUrl: "https://example.com/konkan-sugar/unpaid-dividend" },
  { company: "Godavari Power Ltd", year: "2017-18", holder: "VIJAY PATIL", city: "AURANGABAD", amountInr: 780, sourceUrl: "https://example.com/godavari-power/unpaid-dividend" },
];

/**
 * Reads the text of a company's published unpaid-dividend list into entries.
 *
 * Companies publish these under section 124(2) of the Companies Act, mostly as
 * PDF, in one of two layouts. The table layout is folio, name, address,
 * pincode, amount, with long addresses wrapping onto the next line. The
 * statutory IEPF-2 layout splits the name into first, middle and last, and
 * every row carries the literal phrase "Amount for unclaimed and unpaid
 * dividend" before the amount. The layout is decided once from the text: the
 * table regex over a ten megabyte statutory file is what made this take
 * minutes, and every scan below moves forward only.
 */
export function parseDividendList(text: string, company: string, year: string, sourceUrl: string): DividendEntry[] {
  const flat = text.replace(/\r/g, "").replace(/[ \t]+/g, " ");
  const out: DividendEntry[] = [];
  let m: RegExpExecArray | null;

  if (!/Amount for unclaimed and\s*unpaid dividend/.test(flat)) {
    // folio, optional title, NAME IN CAPITALS, address (bounded), pincode, amount
    const row = /(?:^|\n) ?(\d{3,}) (?:(?:MR|MRS|MS|SMT|SHRI|DR|M\/S)\.? )?([A-Z][A-Z.'&-]*(?: [A-Z][A-Z.'&-]*){0,4}) (\S[\s\S]{0,300}?)\b(\d{6})\b[\s,]*([\d,]+\.\d{2})(?=\s|$)/g;
    while ((m = row.exec(flat))) {
      const [, , holder, address, , amount] = m;
      const amountInr = Number(amount.replace(/,/g, ""));
      if (!Number.isFinite(amountInr) || holder.trim().split(" ").length > 6) continue;
      out.push({ company, year, holder: holder.trim(), city: lastPlace(address), amountInr, sourceUrl });
    }
    return out;
  }

  const anchor = /Amount for unclaimed and\s*unpaid dividend\s*([\d,]+\.\d{2})\s+\d{2}-[A-Za-z]{3}-\d{4}/g;
  const tail = /FY-\d/g;
  const header = /^(Details|Investor|Name|Father|Address|Country|State|District|Folio|Number|Amount|Praposed|Proposed|Date|Aadhar|Nominee|Joint|Remarks|Is the|Financial|Year|DP-Id)/;
  let prevEnd = 0;
  while ((m = anchor.exec(flat))) {
    const block = flat.slice(prevEnd, m.index);
    tail.lastIndex = m.index + m[0].length;
    const t = tail.exec(flat);
    prevEnd = t && t.index - tail.lastIndex < 400 ? t.index + t[0].length : m.index + m[0].length;
    anchor.lastIndex = prevEnd;
    const firstLine = block.split("\n").map((l) => l.trim()).find((l) => /^[A-Z][A-Za-z .'&-]+/.test(l) && !header.test(l));
    if (!firstLine) continue;
    // Name words are capital letters only; the first token with a digit is
    // the start of the address, and "NA" fills an empty name column.
    const words: string[] = [];
    for (const w of firstLine.split(" ")) {
      if (w === "NA") continue;
      if (!/^[A-Z][A-Za-z.'-]*$/.test(w) || words.length === 4) break;
      words.push(w.toUpperCase());
    }
    const holder = words.join(" ").trim();
    const amountInr = Number(m[1].replace(/,/g, ""));
    if (holder.length < 3 || !Number.isFinite(amountInr)) continue;
    const pin = [...block.matchAll(/\b(\d{6})\b/g)].pop();
    const before = pin ? block.slice(0, pin.index) : block;
    out.push({ company, year, holder, city: lastPlace(before.split("\n").slice(-3).join(",")), amountInr, sourceUrl });
  }
  return out;
}

/** The last word-ish token before the pincode is usually the city or district. */
function lastPlace(address: string) {
  const parts = address.split(/[,\n]/).map((s) => s.trim()).filter((s) => /[A-Za-z]/.test(s));
  return (parts[parts.length - 1] ?? "").toUpperCase().replace(/[^A-Z ]/g, " ").trim();
}

function norm(s: string) {
  return s.toUpperCase().replace(/[^A-Z ]/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Name search: every word of the query must match a whole word of the holder
 * name, or be the start of one, in any order. Initials count as words.
 */
export function searchDividends(name: string, index: DividendEntry[] = DIVIDEND_INDEX): DividendEntry[] {
  const words = norm(name).split(" ").filter(Boolean);
  if (words.length === 0 || norm(name).length < 3) return [];
  return index.filter((e) => {
    const hw = norm(e.holder).split(" ");
    return words.every((w) => hw.some((h) => h === w || (w.length >= 3 && h.startsWith(w))));
  });
}
