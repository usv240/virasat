/**
 * One source of truth for every word the product explains.
 *
 * The glossary page renders all of it. The inline <Term> component looks an
 * entry up by id or alias, so a definition is never written down twice and can
 * never drift between the page and the tooltip.
 */
export type GlossaryEntry = { term: string; def: string; id: string; aliases?: string[] };

export const GLOSSARY: GlossaryEntry[] = [
  { term: "Unclaimed money", def: "Money in a bank, insurer, provident fund or company that the owner or family has not collected, often because nobody knew it existed." , id: "unclaimed-money", aliases: ["unclaimed"] },
  { term: "Nominee", def: "A person named on an account or policy to receive the money. Under Indian law the nominee usually holds it in trust for the legal heirs." , id: "nominee" },
  { term: "Legal heir", def: "A family member entitled to the money by law when there is no valid nominee. Who counts depends on the personal law that applies." , id: "legal-heir", aliases: ["heir"] },
  { term: "Legal heir certificate", def: "A certificate from the local revenue office (tehsildar) that lists the family members entitled. Usually 15 to 30 days." , id: "legal-heir-certificate" },
  { term: "Succession certificate", def: "A court order that names who may collect debts and securities. Needed for larger amounts when there is no nominee. Court fees are a percentage of the value, capped by state." , id: "succession-certificate", aliases: ["succession"] },
  { term: "Indemnity bond", def: "A signed promise on stamp paper to return the money if someone with a better claim appears. Banks accept it instead of a court order for smaller amounts." , id: "indemnity-bond", aliases: ["indemnity"] },
  { term: "AIS (Annual Information Statement)", def: "A yearly statement from the Income Tax Department listing interest, dividends and other income paid to a person. It reveals every bank and company that paid them." , id: "ais", aliases: ["AIS", "Annual Information Statement", "tax statement"] },
  { term: "UDGAM", def: "RBI's portal to search unclaimed bank deposits across 30 banks in one place. Deposits with no activity for 10 years or more." , id: "udgam" },
  { term: "DEA Fund", def: "The Depositor Education and Awareness Fund, where banks move deposits unclaimed for 10 years. The money can still be claimed from the bank." , id: "dea-fund", aliases: ["DEA"] },
  { term: "IEPF", def: "The Investor Education and Protection Fund. Companies move dividends unpaid for 7 years, and the related shares, here. Families can claim them back online." , id: "iepf" },
  { term: "MITRA", def: "SEBI's Mutual fund Investment Tracing and Retrieval Assistant, a portal to find forgotten mutual fund folios." , id: "mitra" },
  { term: "Bima Bharosa", def: "IRDAI's insurance grievance portal, which also links every insurer's unclaimed amounts search." , id: "bima-bharosa" },
  { term: "EPFO and UAN", def: "The Employees' Provident Fund Organisation manages provident fund for salaried workers. The UAN is the 12-digit member number." , id: "epfo", aliases: ["EPFO", "UAN", "provident fund"] },
  { term: "Ombudsman", def: "A free official who resolves complaints against a bank (RBI), insurer (IRDAI) or other institution when they do not respond." , id: "ombudsman" },
  { term: "Rule engine", def: "A written checklist the computer follows exactly. The same input always gives the same result, and every rule has tests." , id: "rule-engine", aliases: ["rules engine"] },
  { term: "Structured output", def: "A way of making the AI answer in a fixed format (a JSON schema), so the app never breaks on an unexpected answer." , id: "structured-output", aliases: ["JSON schema"] },
  { term: "The AI Review", def: "Before you see a route, one AI looks for what could go wrong with it, another reviews that concern, and a referee gives a verdict with reasons and risks. The referee can only add caution, never override the rules." , id: "two-ai-debate", aliases: ["AI Review", "debate"] },
  { term: "Bring Your Own (BYO)", def: "Institutions can use Virasat with their own data, their own AI key, or their own claim rules." , id: "byo", aliases: ["BYO", "Bring Your Own"] },
  { term: "Lakh and crore", def: "1 lakh = 1,00,000 (one hundred thousand). 1 crore = 1,00,00,000 (ten million). 1 lakh crore = one trillion." , id: "lakh-crore", aliases: ["lakh", "crore", "lakh crore"] },
  { term: "DPDP Act 2023", def: "India's Digital Personal Data Protection Act: consent, purpose limitation, minimal data, and the right to delete." , id: "dpdp", aliases: ["DPDP"] },
  { term: "Multimodal AI", def: "An AI model that can read images as well as text, so it can look at a photograph of a passbook and pull out the account number.", id: "multimodal", aliases: ["multimodal"] },
  { term: "axe", def: "The industry standard automated accessibility checker. It scans a page against the WCAG rules and reports anything that would block a screen reader or a keyboard user.", id: "axe" },
  { term: "Lighthouse", def: "Google's built-in tool for scoring a web page out of 100 on speed, accessibility, best practices and search visibility. Anyone can run it from Chrome.", id: "lighthouse" },
  { term: "WCAG 2.2 AA", def: "The international accessibility standard for websites. AA is the level most governments require, including India's GIGW guidelines for government sites.", id: "wcag", aliases: ["WCAG"] },
  { term: "Problem details (RFC 9457)", def: "An internet standard for API error messages, so every error comes back in the same predictable shape with a plain-language explanation instead of a bare error code.", id: "problem-details", aliases: ["RFC 9457", "problem details"] },
  { term: "Account Aggregator", def: "India's consent-based system that lets a person share their own bank data with a service they choose, without sharing a password. Regulated by the RBI.", id: "account-aggregator", aliases: ["Account Aggregator framework"] },
  { term: "DigiLocker", def: "The Government of India's official app for storing verified documents such as certificates and identity proofs, so they do not have to be uploaded again.", id: "digilocker" },
  { term: "Common Service Centre (CSC)", def: "A government-backed village level service point where a trained operator helps people with online government services. There are about 5 lakh of them across India.", id: "csc", aliases: ["CSC", "service centre", "Common Service Centres"] },
  { term: "Rate limit", def: "A cap on how many times a minute one key may call the API, so a single user cannot overwhelm the service for everyone else.", id: "rate-limit", aliases: ["rate limits"] },
  { term: "Token", def: "The unit an AI model reads and writes in, roughly three quarters of a word. Models are billed per token, so counting tokens is how you work out what something really costs.", id: "token", aliases: ["tokens"] },
  { term: "Prompt cache", def: "Storing the unchanging part of an instruction so repeat calls do not pay to process it again. A cached read costs about a tenth of a fresh one.", id: "prompt-cache", aliases: ["prompt caching", "cached"] },
  { term: "Batch API", def: "A way of sending work that does not need an answer this second. It costs half as much, which suits overnight jobs but not a family waiting at a counter.", id: "batch-api", aliases: ["Batch API"] },
  { term: "Unit economics", def: "What one user, or in our case one family, actually costs to serve. The number that decides whether something can run at national scale or only in a demo.", id: "unit-economics", aliases: ["unit economics"] },
  { term: "Data minimisation", def: "Collecting and keeping as little personal information as the job needs. Under India's DPDP Act this is a duty, not a courtesy.", id: "data-minimisation", aliases: ["data minimisation"] },
  { term: "Rule corpus", def: "The full collection of claim rule files, one per institution, kept as versioned data anyone can read, check and add to.", id: "rule-corpus", aliases: ["rule corpus", "rule set", "rule sets", "rule file", "rule files"] },
];

/** Look an entry up by id, or by any of the short forms used in the copy. */
export function glossaryLookup(q: string): GlossaryEntry | undefined {
  const k = q.trim().toLowerCase();
  return GLOSSARY.find(
    (g) => g.id === k || g.term.toLowerCase() === k || (g.aliases ?? []).some((a) => a.toLowerCase() === k),
  );
}

/** The anchor for an entry on the glossary page. */
export function glossaryHref(g: GlossaryEntry) {
  return `/glossary#${g.id}`;
}
