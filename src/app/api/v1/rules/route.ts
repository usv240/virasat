import { z } from "zod";
import { guard, problem, withHeaders } from "@/lib/api-auth";
import { RuleSchema, ruleSetsSummary } from "@/lib/rules";

/** GET /api/v1/rules: list built-in rule sets. */
export async function GET(req: Request) {
  const g = await guard(req);
  if (g instanceof Response) return g;
  return withHeaders(Response.json({ ruleSets: ruleSetsSummary() }), g.info, g.rl);
}

/** POST /api/v1/rules: validate a Bring Your Own rule set. Returns the normalised set or the problems. */
export async function POST(req: Request) {
  const g = await guard(req);
  if (g instanceof Response) return g;
  const body = await req.json().catch(() => null);
  const parsed = Array.isArray(body) ? z.array(RuleSchema).safeParse(body) : RuleSchema.safeParse(body);
  if (!parsed.success) {
    return withHeaders(
      Response.json({ valid: false, problems: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })) }, { status: 422 }),
      g.info,
      g.rl,
    );
  }
  const sets = Array.isArray(parsed.data) ? parsed.data : [parsed.data];
  return withHeaders(Response.json({ valid: true, ruleSets: sets.map((s) => ({ institution: s.institution, version: s.version, rules: s.rules.length })) }), g.info, g.rl);
}

export async function OPTIONS() {
  return problem(405, "Method not allowed", "Use GET or POST.");
}
