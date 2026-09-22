import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { guard, problem, withHeaders } from "@/lib/api-auth";
import { hasKey, keyFromRequest } from "@/lib/anthropic";
import { runDebate } from "@/lib/debate";
import { decide, RuleSchema } from "@/lib/rules";
import { localiseDecision } from "@/lib/rules-hi";
import { SAMPLE_DEBATE, SAMPLE_DEBATE_HI } from "@/lib/sample";
import { ExtractionSchema } from "@/lib/types";

export const maxDuration = 90;

const Body = z.object({
  input: z.object({
    assetType: z.enum(["bank", "insurance", "mf", "shares", "pf", "post"]),
    institution: z.string(),
    amountInr: z.number().nullable(),
    nomineePresent: z.boolean().nullable(),
    jointHolder: z.boolean(),
    claimantRelation: z.enum(["spouse", "child", "parent", "sibling", "other"]),
    otherHeirs: z.boolean(),
  }),
  extraction: ExtractionSchema.nullable().optional(),
  userNotes: z.string().max(2000).optional(),
  debate: z.boolean().default(true),
  lang: z.enum(["en", "hi"]).default("en"),
  rules: z.array(RuleSchema).optional().describe("Bring Your Own Rules for this request"),
});

/**
 * POST /api/v1/claims/route
 * Returns the rule engine decision and, if asked, the AI Review verdict.
 */
export async function POST(req: Request) {
  const g = await guard(req);
  if (g instanceof Response) return g;
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return problem(400, "Invalid body", parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "));
  const { input, extraction, userNotes, debate, rules, lang } = parsed.data;

  const decision = localiseDecision(decide(input, rules ?? []), lang);
  if (!debate) return withHeaders(Response.json({ decision, debate: null, mode: "rules" }), g.info, g.rl);

  const byo = keyFromRequest(req);
  if (!hasKey(byo)) {
    const sample = lang === "hi" ? SAMPLE_DEBATE_HI : SAMPLE_DEBATE;
    return withHeaders(Response.json({ decision, debate: { ...sample, verdict: { ...sample.verdict, rule_ids_checked: [decision.ruleId] } }, mode: "sample" }), g.info, g.rl);
  }
  try {
    const result = await runDebate({ extraction: extraction ?? null, input, decision, userNotes, lang }, byo);
    return withHeaders(Response.json({ decision, debate: result, mode: "live" }), g.info, g.rl);
  } catch (err) {
    if (err instanceof Anthropic.APIError) return withHeaders(Response.json({ decision, debate: null, mode: "rules", warning: `Debate unavailable: ${err.message}` }), g.info, g.rl);
    return withHeaders(Response.json({ decision, debate: null, mode: "rules", warning: "Debate unavailable." }), g.info, g.rl);
  }
}
