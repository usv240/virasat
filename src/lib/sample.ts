/**
 * Sunita's sample family. Every value here is made up.
 * Used for "Try with sample data" and for Sample mode when no AI key is set.
 */
import type { Asset, Debate, Extraction } from "./types";

export const SAMPLE_DOCS: { id: string; file: string; title: string; extraction: Extraction }[] = [
  {
    id: "passbook",
    file: "/samples/passbook.png",
    title: "SBI passbook (photo)",
    extraction: {
      document_kind: "passbook",
      asset_type: "bank",
      institution: { name: "State Bank of India", confidence: "high" },
      identifier: { value_masked: "XXXXXXX4471", kind: "account", confidence: "high" },
      holder_name: { value: "Ramesh Kulkarni", confidence: "high" },
      nominee_name: { value: "Sunita R Kulkarni", confidence: "medium" },
      dates: [{ label: "last_entry", value: "2019-08-12" }],
      amounts: [{ label: "last_balance", value_inr: 158420 }],
      language_detected: "en",
      notes_for_user: "The nominee line names Sunita R Kulkarni; the spelling should match her ID card.",
    },
  },
  {
    id: "lic",
    file: "/samples/lic-bond.png",
    title: "LIC policy bond (photo)",
    extraction: {
      document_kind: "insurance_bond",
      asset_type: "insurance",
      institution: { name: "Life Insurance Corporation of India", confidence: "high" },
      identifier: { value_masked: "XXXXXX4721", kind: "policy", confidence: "high" },
      holder_name: { value: "Ramesh Kulkarni", confidence: "high" },
      nominee_name: { value: null, confidence: "low" },
      dates: [
        { label: "commencement", value: "1999-03-14" },
        { label: "maturity", value: "2019-03-14" },
      ],
      amounts: [{ label: "sum_assured", value_inr: 200000 }],
      language_detected: "en",
      notes_for_user: "The policy matured in 2019 and the nominee line is blank, so the legal heir route will apply unless LIC has a nomination on file.",
    },
  },
  {
    id: "share",
    file: "/samples/share-certificate.png",
    title: "Share certificate (photo)",
    extraction: {
      document_kind: "share_certificate",
      asset_type: "shares",
      institution: { name: "Bharat Cement Ltd", confidence: "medium" },
      identifier: { value_masked: "XXXXX0882", kind: "folio", confidence: "medium" },
      holder_name: { value: "Ramesh Kulkarni", confidence: "high" },
      nominee_name: { value: null, confidence: "low" },
      dates: [{ label: "issued", value: "1996-11-02" }],
      amounts: [{ label: "shares", value_inr: 500 }],
      language_detected: "en",
      notes_for_user: "This is an old paper certificate; the company's registrar can confirm the holding and any unpaid dividends.",
    },
  },
];

export const SAMPLE_AIS_ASSETS: Asset[] = [
  { id: "ais-0", type: "bank", institution: "State Bank of India", identifierMasked: "Not in AIS", holderName: "Ramesh Kulkarni", nomineeName: null, amountEstimateInr: 160000, source: "ais", sourceDetail: "Interest in AIS: ₹9,605", confidence: "medium", status: "found" },
  { id: "ais-1", type: "bank", institution: "Bank of Maharashtra", identifierMasked: "Not in AIS", holderName: "Ramesh Kulkarni", nomineeName: null, amountEstimateInr: 42000, source: "ais", sourceDetail: "Interest in AIS: ₹2,520", confidence: "medium", status: "found" },
  { id: "ais-2", type: "shares", institution: "Bharat Cement Ltd", identifierMasked: "Not in AIS", holderName: "Ramesh Kulkarni", nomineeName: null, amountEstimateInr: 60000, source: "ais", sourceDetail: "Dividend in AIS: ₹900", confidence: "medium", status: "found" },
  { id: "ais-3", type: "mf", institution: "Nivesh Balanced Fund", identifierMasked: "Not in AIS", holderName: "Ramesh Kulkarni", nomineeName: null, amountEstimateInr: 85000, source: "ais", sourceDetail: "Mutual fund units in AIS: ₹85,000", confidence: "medium", status: "found" },
];

export const SAMPLE_DEBATE: Debate = {
  id: "dbt-sample",
  mode: "sample",
  model: "sample (pre-computed)",
  latencyMs: 0,
  supporter: {
    position: "The nominee route is correct: the passbook names a nominee and the amount is below the bank's threshold.",
    points: [
      { claim: "A nominee is named on the passbook.", evidence: "nominee_name.value = Sunita R Kulkarni (medium confidence)" },
      { claim: "The amount is under the 5,00,000 rupee threshold, so no court certificate is needed.", evidence: "last_balance = 1,58,420" },
      { claim: "The claimant is the nominee and the spouse, so she is entitled either way.", evidence: "claimant_relation = spouse" },
    ],
  },
  challenger: {
    position: "The route is probably right, but the nominee name may not match the claimant's ID, and the nomination was read with only medium confidence.",
    points: [
      { claim: "The nominee name on the passbook is 'Sunita R Kulkarni'. The ID may say 'Sunita Ramesh Kulkarni'. Banks reject claims on a spelling mismatch.", evidence: "nominee_name.confidence = medium" },
      { claim: "If the branch has no nomination on file, the route changes to legal heir.", evidence: "nominee read from a photo, not confirmed by the bank" },
      { claim: "Other heirs (children) may need to sign if the bank treats the nominee as a trustee.", evidence: "other_heirs = true" },
    ],
  },
  verdict: {
    verdict: "Nominee route. Proceed, but carry an ID that matches the nominee name exactly.",
    confidence: "high",
    reasons: ["A nominee is named and the claimant is that person.", "The amount is below the threshold, so no court certificate is needed.", "Rule SBI_NOMINEE_V1 applies."],
    risks: ["Nominee name spelling on the passbook may differ from the ID card.", "The branch must confirm the nomination is on file."],
    what_would_change_my_mind: "If the branch says no nomination is registered, the legal heir route applies instead.",
    next_step_for_user: "Take an ID proof that shows the name exactly as 'Sunita R Kulkarni', or an affidavit for the name variation, along with the claim pack.",
    rule_ids_checked: ["SBI_NOMINEE_V1"],
    raise_to_human_review: false,
  },
};
