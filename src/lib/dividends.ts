/**
 * Unpaid dividend index.
 *
 * Plain words: listed companies must publish the names of shareholders whose
 * dividends were never paid. This index lets a family search those lists by name.
 *
 * The demo index below is SAMPLE DATA with made-up names, in the same shape as the
 * public lists. The fetch script in scripts/fetch-dividends.ts shows how real lists
 * are loaded from company investor pages (Infosys, Exide and others publish them).
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

function norm(s: string) {
  return s.toUpperCase().replace(/[^A-Z ]/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Name search: every word of the query must match a whole word of the holder
 * name, or be the start of one, in any order. Initials count as words.
 */
export function searchDividends(name: string): DividendEntry[] {
  const words = norm(name).split(" ").filter(Boolean);
  if (words.length === 0 || norm(name).length < 3) return [];
  return DIVIDEND_INDEX.filter((e) => {
    const hw = norm(e.holder).split(" ");
    return words.every((w) => hw.some((h) => h === w || (w.length >= 3 && h.startsWith(w))));
  });
}
