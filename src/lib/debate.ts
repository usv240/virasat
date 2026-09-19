/**
 * The Two AI Debate.
 *
 * Plain words: before we show a claim route, two AI reviewers argue about it.
 * The Supporter makes the best case that the route is right. The Challenger looks
 * for what could go wrong. The Referee reads both, checks them against the fixed
 * rules, and gives a verdict with reasons, risks and a next step.
 *
 * Guardrail: the Referee cannot change the route the rule engine chose. It can add
 * risks, raise the document list, or mark the case for human review.
 */
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { client, MODEL } from "./anthropic";
import { ArgumentSchema, VerdictSchema, type Argument, type ClaimDecision, type ClaimInput, type Debate, type Extraction, type Verdict } from "./types";

export type Evidence = {
  extraction?: Extraction | null;
  input: ClaimInput;
  decision: ClaimDecision;
  userNotes?: string;
};

const SHARED = `You are part of a three-role review of a claim route for an Indian family recovering money from a bank, insurer, provident fund or share registry.
Use only the evidence packet. Do not invent facts. Do not use outside assumptions about the family.
Write in plain English a family member can understand. Short sentences. No emojis. No em dashes.`;

const SUPPORTER = `${SHARED}
Your role: the Supporter. Make the strongest honest case that the rule engine's route is correct and complete, citing evidence fields.`;

const CHALLENGER = `${SHARED}
Your role: the Challenger. Find what could go wrong. Check this list every time:
1. Name spelled differently across documents.
2. Nominee status unknown or nominee named but not the claimant.
3. Joint account or joint holder.
4. Amount near a threshold (the route changes at 5,00,000 rupees for several institutions).
5. Expired, lapsed or already-paid policy.
6. Claimant relation that may not make them a legal heir.
7. Other heirs who must sign.
8. Low-confidence extracted fields.
Report only risks supported by the evidence.`;

const REFEREE = `${SHARED}
Your role: the Referee. Read the Supporter and Challenger. Decide.
Rules you must follow:
- You cannot change the route chosen by the rule engine. Your verdict names that route.
- You may add risks, extra documents, or set raise_to_human_review to true.
- confidence is "high" only if the Challenger found no material risk.
- next_step_for_user is one concrete action.
- rule_ids_checked must include the rule engine's rule id.`;

function packet(e: Evidence): string {
  return JSON.stringify(
    {
      extracted_document: e.extraction ?? "none",
      claimant_answers: e.input,
      rule_engine: { route: e.decision.route, rule_id: e.decision.ruleId, version: e.decision.ruleVersion, documents: e.decision.checklist.map((c) => c.id), notes: e.decision.notes },
      user_notes: e.userNotes ?? "",
    },
    null,
    2,
  );
}

async function argue(system: string, ev: string, byo?: string | null): Promise<Argument> {
  const r = await client(byo).messages.parse({
    model: MODEL,
    max_tokens: 2000,
    system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: `Evidence packet:\n${ev}` }],
    output_config: { format: zodOutputFormat(ArgumentSchema) },
  });
  if (!r.parsed_output) throw new Error("debate role failed");
  return r.parsed_output;
}

export async function runDebate(evidence: Evidence, byo?: string | null): Promise<Debate> {
  const started = Date.now();
  const ev = packet(evidence);
  const [supporter, challenger] = await Promise.all([argue(SUPPORTER, ev, byo), argue(CHALLENGER, ev, byo)]);
  const r = await client(byo).messages.parse({
    model: MODEL,
    max_tokens: 2500,
    system: [{ type: "text", text: REFEREE, cache_control: { type: "ephemeral" } }],
    messages: [
      {
        role: "user",
        content: `Evidence packet:\n${ev}\n\nSupporter:\n${JSON.stringify(supporter, null, 2)}\n\nChallenger:\n${JSON.stringify(challenger, null, 2)}`,
      },
    ],
    output_config: { format: zodOutputFormat(VerdictSchema) },
  });
  if (!r.parsed_output) throw new Error("referee failed");
  const verdict = enforce(r.parsed_output, evidence.decision);
  return { id: `dbt-${Date.now()}`, supporter, challenger, verdict, model: MODEL, latencyMs: Date.now() - started, mode: "live" };
}

/** Code-level guardrail: the verdict must name the rule engine's route and rule id. */
function enforce(v: Verdict, d: ClaimDecision): Verdict {
  const ids = new Set(v.rule_ids_checked);
  ids.add(d.ruleId);
  const verdict = v.verdict.toLowerCase().includes(d.routeLabel.toLowerCase().split(" ")[0]) ? v.verdict : `${d.routeLabel}. ${v.verdict}`;
  return { ...v, verdict, rule_ids_checked: [...ids] };
}
