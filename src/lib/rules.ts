/**
 * Claim rule engine.
 *
 * Plain words: a rule engine is a written checklist the computer follows exactly.
 * The same input always gives the same answer, and every rule has tests.
 * One rule set per institution. Institutions can bring their own (see /developers).
 */
import { z } from "zod";
import type { AssetKind, ChecklistItem, ClaimDecision, ClaimInput } from "./types";

const DOCS: Record<string, ChecklistItem> = {
  supporting_certificate: {
    id: "supporting_certificate",
    label: "Supporting certificate for the account holder",
    what: "The official certificate that confirms the change of circumstances for the account holder.",
    where: "Municipal corporation or gram panchayat office, or the DigiLocker app.",
  },
  legal_heir_certificate: {
    id: "legal_heir_certificate",
    label: "Legal heir certificate",
    what: "A certificate from the local revenue office listing the family members entitled by law.",
    where: "Tehsildar or taluk office. Usually 15 to 30 days. Some states issue it online.",
  },
  succession_certificate: {
    id: "succession_certificate",
    label: "Succession certificate",
    what: "A court order that names who can collect debts and securities. Needed for larger amounts when there is no nominee.",
    where: "District civil court. Court fee is a percentage of the value in most states, capped by state rules. Usually 2 to 6 months.",
  },
  indemnity_bond: {
    id: "indemnity_bond",
    label: "Indemnity bond",
    what: "A signed promise on stamp paper that you will return the money if someone with a better claim appears.",
    where: "Stamp vendor plus a notary. The bank gives the wording.",
    autoFilled: true,
  },
  nominee_id: { id: "nominee_id", label: "ID proof of the nominee", what: "Aadhaar, PAN, voter ID or passport of the nominee.", where: "Your own documents." },
  nominee_address: { id: "nominee_address", label: "Address proof of the nominee", what: "Aadhaar, utility bill or passport.", where: "Your own documents." },
  heirs_id: { id: "heirs_id", label: "ID proof of all legal heirs", what: "Aadhaar or PAN for every family member entitled.", where: "Each family member." },
  noc_heirs: { id: "noc_heirs", label: "No-objection letters from other heirs", what: "A signed letter from each other heir saying they agree the money goes to the claimant.", where: "Virasat generates the wording; each heir signs.", autoFilled: true },
  passbook_or_bond: { id: "passbook_or_bond", label: "Original passbook, policy bond or certificate", what: "The document you photographed, or a letter explaining it is lost.", where: "Your papers. If lost, the bank or insurer has a lost-document form." },
  claim_form: { id: "claim_form", label: "Claim form (filled by Virasat)", what: "The institution's own claim form, filled in from your details.", where: "In your claim pack.", autoFilled: true },
  cover_letter: { id: "cover_letter", label: "Cover letter in English and your language (filled by Virasat)", what: "A short letter that lists what you are claiming and what you enclose.", where: "In your claim pack.", autoFilled: true },
  cancelled_cheque: { id: "cancelled_cheque", label: "Cancelled cheque or bank passbook of the claimant", what: "So the money can be paid into your account.", where: "Your own bank." },
  policy_bond: { id: "policy_bond", label: "Original policy bond", what: "The insurance policy document.", where: "Your papers. If lost, LIC has an indemnity form." },
  uan_kyc: { id: "uan_kyc", label: "UAN with KYC linked", what: "The 12-digit Universal Account Number for provident fund, with Aadhaar and bank linked.", where: "EPFO member portal (unifiedportal-mem.epfindia.gov.in)." },
  form_20: { id: "form_20", label: "EPFO Form 20 (filled by Virasat)", what: "The provident fund claim form for a nominee or heir.", where: "In your claim pack.", autoFilled: true },
  iepf5: { id: "iepf5", label: "Form IEPF-5 (online) and its acknowledgement", what: "The online claim to the Investor Education and Protection Fund for shares and dividends transferred there.", where: "iepf.gov.in. Virasat pre-fills the fields for you to copy.", autoFilled: true },
  share_docs: { id: "share_docs", label: "Share certificate or demat statement", what: "Proof that the account holder owned the shares.", where: "Your papers, or the company's registrar." },
  transmission_form: { id: "transmission_form", label: "Transmission request form (filled by Virasat)", what: "The registrar's form to move shares to the heir.", where: "In your claim pack.", autoFilled: true },
  post_claim_form: { id: "post_claim_form", label: "India Post claim form (filled by Virasat)", what: "The post office savings claim form.", where: "In your claim pack.", autoFilled: true },
};

export const RuleSchema = z.object({
  institution: z.string(),
  assetType: z.enum(["bank", "insurance", "mf", "shares", "pf", "post"]),
  version: z.number(),
  rules: z.array(
    z.object({
      id: z.string(),
      when: z.object({
        nomineePresent: z.boolean().optional(),
        amountMaxInr: z.number().optional(),
        amountMinInr: z.number().optional(),
        jointHolder: z.boolean().optional(),
      }),
      route: z.enum(["nominee", "legal_heir_simplified", "legal_heir_succession", "needs_review"]),
      documents: z.array(z.string()),
      timelineDays: z.number(),
      notes: z.array(z.string()).optional(),
    }),
  ),
  escalation: z.object({ afterDays: z.number(), to: z.string(), how: z.string() }),
});
export type RuleSet = z.infer<typeof RuleSchema>;

const BANK_ESCALATION = {
  afterDays: 30,
  to: "RBI Integrated Ombudsman",
  how: "File a free complaint at cms.rbi.org.in after 30 days without a reply from the bank. Virasat pre-fills the complaint text.",
};

export const RULES: RuleSet[] = [
  {
    institution: "State Bank of India",
    assetType: "bank",
    version: 1,
    rules: [
      { id: "SBI_NOMINEE_V1", when: { nomineePresent: true }, route: "nominee", documents: ["claim_form", "cover_letter", "supporting_certificate", "nominee_id", "nominee_address", "passbook_or_bond", "cancelled_cheque"], timelineDays: 15, notes: ["The nominee receives the money as a trustee for the legal heirs."] },
      { id: "SBI_HEIR_SIMPLE_V1", when: { nomineePresent: false, amountMaxInr: 500000 }, route: "legal_heir_simplified", documents: ["claim_form", "cover_letter", "supporting_certificate", "legal_heir_certificate", "indemnity_bond", "heirs_id", "noc_heirs", "passbook_or_bond", "cancelled_cheque"], timelineDays: 30, notes: ["Below the bank's threshold, a legal heir certificate and an indemnity bond are enough. No court is needed."] },
      { id: "SBI_HEIR_SUCCESSION_V1", when: { nomineePresent: false, amountMinInr: 500001 }, route: "legal_heir_succession", documents: ["claim_form", "cover_letter", "supporting_certificate", "succession_certificate", "heirs_id", "passbook_or_bond", "cancelled_cheque"], timelineDays: 90, notes: ["Above the threshold the bank asks for a court succession certificate. Ask the branch manager whether their threshold is higher; many banks have raised it."] },
      { id: "SBI_JOINT_V1", when: { jointHolder: true }, route: "needs_review", documents: ["claim_form", "cover_letter", "supporting_certificate", "passbook_or_bond"], timelineDays: 15, notes: ["A joint account usually passes to the surviving holder. Check the mode of operation on the passbook (for example 'either or survivor')."] },
    ],
    escalation: BANK_ESCALATION,
  },
  {
    institution: "Life Insurance Corporation of India",
    assetType: "insurance",
    version: 1,
    rules: [
      { id: "LIC_NOMINEE_V1", when: { nomineePresent: true }, route: "nominee", documents: ["claim_form", "cover_letter", "supporting_certificate", "policy_bond", "nominee_id", "cancelled_cheque"], timelineDays: 30, notes: ["LIC pays the nominee directly. For matured policies, the policyholder's own bank details are enough."] },
      { id: "LIC_HEIR_V1", when: { nomineePresent: false }, route: "legal_heir_simplified", documents: ["claim_form", "cover_letter", "supporting_certificate", "policy_bond", "legal_heir_certificate", "indemnity_bond", "heirs_id", "noc_heirs", "cancelled_cheque"], timelineDays: 45, notes: ["Without a nominee LIC accepts a legal heir certificate with an indemnity bond for most amounts. Very large amounts may need a succession certificate."] },
    ],
    escalation: { afterDays: 30, to: "Insurance Ombudsman (Bima Bharosa)", how: "Complain at bimabharosa.irdai.gov.in after 30 days without a reply. Virasat pre-fills the complaint." },
  },
  {
    institution: "EPFO",
    assetType: "pf",
    version: 1,
    rules: [
      { id: "EPFO_NOMINEE_V1", when: { nomineePresent: true }, route: "nominee", documents: ["form_20", "cover_letter", "supporting_certificate", "uan_kyc", "nominee_id", "cancelled_cheque"], timelineDays: 20, notes: ["EPFO also pays pension (EPS) and insurance (EDLI) to the family. Virasat lists all three."] },
      { id: "EPFO_HEIR_V1", when: { nomineePresent: false }, route: "legal_heir_simplified", documents: ["form_20", "cover_letter", "supporting_certificate", "uan_kyc", "legal_heir_certificate", "heirs_id", "cancelled_cheque"], timelineDays: 30, notes: ["Without a nomination, EPFO pays family members in the order set by the scheme rules."] },
    ],
    escalation: { afterDays: 30, to: "EPFO grievance portal (EPFiGMS)", how: "Raise a grievance at epfigms.gov.in with the claim ID after 30 days." },
  },
  {
    institution: "IEPF (shares and dividends)",
    assetType: "shares",
    version: 1,
    rules: [
      { id: "IEPF_NOMINEE_V1", when: { nomineePresent: true }, route: "nominee", documents: ["iepf5", "cover_letter", "supporting_certificate", "share_docs", "transmission_form", "nominee_id", "cancelled_cheque"], timelineDays: 90, notes: ["First the shares are transmitted to the nominee by the company's registrar, then the IEPF claim is filed online."] },
      { id: "IEPF_HEIR_SMALL_V1", when: { nomineePresent: false, amountMaxInr: 500000 }, route: "legal_heir_simplified", documents: ["iepf5", "cover_letter", "supporting_certificate", "share_docs", "transmission_form", "legal_heir_certificate", "indemnity_bond", "heirs_id", "noc_heirs", "cancelled_cheque"], timelineDays: 120, notes: ["For smaller holdings, registrars accept a legal heir certificate with an indemnity bond and no-objection letters."] },
      { id: "IEPF_HEIR_LARGE_V1", when: { nomineePresent: false, amountMinInr: 500001 }, route: "legal_heir_succession", documents: ["iepf5", "cover_letter", "supporting_certificate", "share_docs", "transmission_form", "succession_certificate", "heirs_id", "cancelled_cheque"], timelineDays: 180, notes: ["Above the registrar's threshold a succession certificate or probate is required."] },
    ],
    escalation: { afterDays: 60, to: "IEPF Authority helpline and SEBI SCORES", how: "Check status on iepf.gov.in; escalate on scores.sebi.gov.in for registrar delays." },
  },
  {
    institution: "India Post",
    assetType: "post",
    version: 1,
    rules: [
      { id: "POST_NOMINEE_V1", when: { nomineePresent: true }, route: "nominee", documents: ["post_claim_form", "cover_letter", "supporting_certificate", "passbook_or_bond", "nominee_id", "cancelled_cheque"], timelineDays: 15 },
      { id: "POST_HEIR_SMALL_V1", when: { nomineePresent: false, amountMaxInr: 500000 }, route: "legal_heir_simplified", documents: ["post_claim_form", "cover_letter", "supporting_certificate", "passbook_or_bond", "legal_heir_certificate", "indemnity_bond", "heirs_id", "cancelled_cheque"], timelineDays: 30, notes: ["Post office savings up to the threshold can be paid on a legal heir certificate and indemnity bond."] },
      { id: "POST_HEIR_LARGE_V1", when: { nomineePresent: false, amountMinInr: 500001 }, route: "legal_heir_succession", documents: ["post_claim_form", "cover_letter", "supporting_certificate", "passbook_or_bond", "succession_certificate", "heirs_id", "cancelled_cheque"], timelineDays: 90 },
    ],
    escalation: { afterDays: 30, to: "India Post grievance portal (CPGRAMS)", how: "Raise a complaint at pgportal.gov.in after 30 days without a reply." },
  },
];

const ROUTE_LABELS: Record<ClaimDecision["route"], string> = {
  nominee: "Nominee route",
  legal_heir_simplified: "Legal heir route (no court needed)",
  legal_heir_succession: "Legal heir route with a court succession certificate",
  needs_review: "Needs a person to review",
};

function matches(when: RuleSet["rules"][number]["when"], input: ClaimInput): boolean {
  if (when.jointHolder !== undefined && when.jointHolder !== input.jointHolder) return false;
  if (when.nomineePresent !== undefined) {
    if (input.nomineePresent === null) return false;
    if (when.nomineePresent !== input.nomineePresent) return false;
  }
  const amount = input.amountInr ?? 0;
  if (when.amountMaxInr !== undefined && amount > when.amountMaxInr) return false;
  if (when.amountMinInr !== undefined && amount < when.amountMinInr) return false;
  return true;
}

export function findRuleSet(assetType: AssetKind, institution: string, extra: RuleSet[] = []): RuleSet | undefined {
  const all = [...extra, ...RULES];
  const byName = all.find((r) => r.assetType === assetType && institution.toLowerCase().includes(r.institution.toLowerCase().split(" ")[0]));
  return byName ?? all.find((r) => r.assetType === assetType);
}

export function decide(input: ClaimInput, extra: RuleSet[] = []): ClaimDecision {
  const set = findRuleSet(input.assetType, input.institution, extra);
  if (!set) {
    return {
      route: "needs_review",
      routeLabel: ROUTE_LABELS.needs_review,
      ruleId: "NO_RULESET",
      ruleVersion: 0,
      checklist: [DOCS.cover_letter, DOCS.supporting_certificate],
      timelineDays: 30,
      escalation: BANK_ESCALATION,
      notes: ["We do not yet have a rule file for this institution. A helper will review your case."],
    };
  }
  // Joint holder check first, then nominee checks in order.
  const ordered = [...set.rules].sort((a, b) => (b.when.jointHolder ? 1 : 0) - (a.when.jointHolder ? 1 : 0));
  const rule = ordered.find((r) => matches(r.when, input));
  if (!rule || input.nomineePresent === null) {
    return {
      route: "needs_review",
      routeLabel: ROUTE_LABELS.needs_review,
      ruleId: `${set.institution.toUpperCase().split(" ")[0]}_UNKNOWN_NOMINEE`,
      ruleVersion: set.version,
      checklist: [DOCS.supporting_certificate, DOCS.passbook_or_bond, DOCS.heirs_id],
      timelineDays: 30,
      escalation: set.escalation,
      notes: ["We could not tell whether a nominee was named. Ask the branch for the nomination status; it is free and takes one visit. Then come back and we will finish the route."],
    };
  }
  const notes = [...(rule.notes ?? [])];
  if (input.otherHeirs && rule.route !== "nominee") notes.push("Because other family members are also entitled, each of them signs a no-objection letter, or the amount is shared as the certificate states.");
  return {
    route: rule.route,
    routeLabel: ROUTE_LABELS[rule.route],
    ruleId: rule.id,
    ruleVersion: set.version,
    checklist: rule.documents.map((d) => DOCS[d]).filter(Boolean),
    timelineDays: rule.timelineDays,
    escalation: set.escalation,
    notes,
  };
}

export function ruleSetsSummary() {
  return RULES.map((r) => ({ institution: r.institution, assetType: r.assetType, version: r.version, rules: r.rules.map((x) => x.id) }));
}

/**
 * The corpus is versioned as a whole, separately from the version on each rule
 * set, so an institution can cite "corpus 1.0, SBI rule set 3" and mean exactly
 * one thing.
 */
export const CORPUS_VERSION = "1.0";

/** Openly licensed on purpose. See /api/v1/rules/corpus for why. */
export const CORPUS_LICENCE = "MIT";
