import type { Usage } from "./cost";
import { z } from "zod";

export const Confidence = z.enum(["high", "medium", "low"]);
export type ConfidenceLevel = z.infer<typeof Confidence>;

export const AssetType = z.enum(["bank", "insurance", "mf", "shares", "pf", "post"]);
export type AssetKind = z.infer<typeof AssetType>;

/** What the AI extracts from one photographed document. */
export const ExtractionSchema = z.object({
  document_kind: z.enum(["passbook", "insurance_bond", "share_certificate", "pf_slip", "dividend_warrant", "unknown"]),
  asset_type: AssetType,
  institution: z.object({ name: z.string(), confidence: Confidence }),
  identifier: z.object({
    value_masked: z.string().describe("Only the last 4 characters visible, rest as X"),
    kind: z.enum(["account", "policy", "folio", "uan", "certificate", "unknown"]),
    confidence: Confidence,
  }),
  holder_name: z.object({ value: z.string(), confidence: Confidence }),
  nominee_name: z.object({ value: z.string().nullable(), confidence: Confidence }),
  dates: z.array(z.object({ label: z.string(), value: z.string() })),
  amounts: z.array(z.object({ label: z.string(), value_inr: z.number() })),
  language_detected: z.string(),
  notes_for_user: z.string().describe("One plain sentence a family member would understand"),
});
export type Extraction = z.infer<typeof ExtractionSchema>;

/** One place where the family may have money. */
export type Asset = {
  id: string;
  type: AssetKind;
  institution: string;
  identifierMasked: string;
  holderName: string;
  nomineeName: string | null;
  amountEstimateInr: number | null;
  source: "document" | "ais" | "dividend_index" | "manual";
  sourceDetail?: string;
  confidence: ConfidenceLevel;
  status: "found" | "searching" | "confirmed" | "not_found";
};

export type ClaimRoute = "nominee" | "legal_heir_simplified" | "legal_heir_succession" | "needs_review";

export type ClaimInput = {
  assetType: AssetKind;
  institution: string;
  amountInr: number | null;
  nomineePresent: boolean | null;
  jointHolder: boolean;
  claimantRelation: "spouse" | "child" | "parent" | "sibling" | "other";
  otherHeirs: boolean;
};

export type ChecklistItem = { id: string; label: string; what: string; where: string; autoFilled?: boolean };

export type ClaimDecision = {
  route: ClaimRoute;
  routeLabel: string;
  ruleId: string;
  ruleVersion: number;
  checklist: ChecklistItem[];
  timelineDays: number;
  escalation: { afterDays: number; to: string; how: string };
  notes: string[];
};

export const VerdictSchema = z.object({
  verdict: z.string().describe("One line, plain words, names the route"),
  confidence: Confidence,
  reasons: z.array(z.string()).min(1).max(5),
  risks: z.array(z.string()).max(5),
  what_would_change_my_mind: z.string(),
  next_step_for_user: z.string(),
  rule_ids_checked: z.array(z.string()),
  raise_to_human_review: z.boolean(),
});
export type Verdict = z.infer<typeof VerdictSchema>;

export const ArgumentSchema = z.object({
  position: z.string().describe("One line summary of the position"),
  points: z.array(z.object({ claim: z.string(), evidence: z.string() })).min(1).max(5),
});
export type Argument = z.infer<typeof ArgumentSchema>;

export type Debate = {
  id: string;
  supporter: Argument;
  challenger: Argument;
  verdict: Verdict;
  model: string;
  latencyMs: number;
  mode: "live" | "sample";
  /** What the three calls actually cost in tokens. Absent in sample mode, where nothing was spent. */
  usage?: Usage;
};

export type Claim = {
  id: string;
  assetId: string;
  input: ClaimInput;
  decision: ClaimDecision;
  debate?: Debate;
  checked: Record<string, boolean>;
  status: "preparing" | "submitted" | "waiting" | "stuck" | "done";
  createdAt: string;
  submittedAt?: string;
  events: { at: string; note: string }[];
};

export type VaultItem = {
  id: string;
  type: AssetKind;
  institution: string;
  identifierMasked: string;
  nomineeStatus: "ok" | "missing" | "unknown";
  lastChecked: string;
};
