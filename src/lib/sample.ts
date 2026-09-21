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

/** The same sample debate in Hindi, for Sample mode when the family chose Hindi. */
export const SAMPLE_DEBATE_HI: Debate = {
  id: "dbt-sample-hi",
  mode: "sample",
  model: "sample (pre-computed)",
  latencyMs: 0,
  supporter: {
    position: "नॉमिनी वाला रास्ता सही है: पासबुक पर नॉमिनी का नाम है और रकम बैंक की सीमा से कम है।",
    points: [
      { claim: "पासबुक पर नॉमिनी का नाम लिखा है।", evidence: "nominee_name.value = Sunita R Kulkarni (मध्यम भरोसा)" },
      { claim: "रकम 5,00,000 रुपये की सीमा से कम है, इसलिए कोर्ट के प्रमाणपत्र की ज़रूरत नहीं।", evidence: "last_balance = 1,58,420" },
      { claim: "दावा करने वाली ही नॉमिनी और पत्नी हैं, इसलिए वे दोनों तरह से हकदार हैं।", evidence: "claimant_relation = spouse" },
    ],
  },
  challenger: {
    position: "रास्ता शायद सही है, पर पासबुक का नाम पहचान पत्र से अलग हो सकता है, और नामांकन केवल मध्यम भरोसे से पढ़ा गया है।",
    points: [
      { claim: "पासबुक पर नाम 'Sunita R Kulkarni' है। पहचान पत्र पर 'Sunita Ramesh Kulkarni' हो सकता है। बैंक वर्तनी के फ़र्क़ पर दावा लौटा देते हैं।", evidence: "nominee_name.confidence = medium" },
      { claim: "अगर शाखा के रिकॉर्ड में नामांकन दर्ज नहीं है, तो रास्ता बदलकर कानूनी वारिस वाला हो जाएगा।", evidence: "नॉमिनी फोटो से पढ़ा गया, बैंक से पुष्टि नहीं हुई" },
      { claim: "अगर बैंक नॉमिनी को न्यासी मानता है तो बच्चों के दस्तख़त भी लग सकते हैं।", evidence: "other_heirs = true" },
    ],
  },
  verdict: {
    verdict: "नॉमिनी वाला रास्ता। आगे बढ़ें, पर ऐसा पहचान पत्र साथ रखें जिस पर नाम बिल्कुल वैसा ही हो।",
    confidence: "high",
    reasons: ["नॉमिनी का नाम दर्ज है और दावा करने वाली वही हैं।", "रकम सीमा से कम है, इसलिए कोर्ट का प्रमाणपत्र नहीं चाहिए।", "नियम SBI_NOMINEE_V1 लागू होता है।"],
    risks: ["पासबुक पर नॉमिनी के नाम की वर्तनी पहचान पत्र से अलग हो सकती है।", "शाखा को पुष्टि करनी होगी कि नामांकन रिकॉर्ड में है।"],
    what_would_change_my_mind: "अगर शाखा कहे कि कोई नामांकन दर्ज नहीं है, तो कानूनी वारिस वाला रास्ता लागू होगा।",
    next_step_for_user: "ऐसा पहचान पत्र ले जाएँ जिस पर नाम ठीक 'Sunita R Kulkarni' लिखा हो, या नाम के फ़र्क़ के लिए शपथ पत्र, दावा पैक के साथ।",
    rule_ids_checked: ["SBI_NOMINEE_V1"],
    raise_to_human_review: false,
  },
};
