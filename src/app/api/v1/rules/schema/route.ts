import { z } from "zod";
import { RuleSchema } from "@/lib/rules";

/**
 * GET /api/v1/rules/schema: the JSON Schema a rule set must satisfy.
 *
 * Generated from the same Zod schema that validates incoming rule sets, so the
 * published contract and the enforced one cannot drift. Anyone writing a rule
 * file for their own institution can validate it before sending it.
 */
export async function GET() {
  return Response.json(z.toJSONSchema(RuleSchema, { target: "draft-2020-12" }), {
    headers: {
      "access-control-allow-origin": "*",
      "cache-control": "public, max-age=3600",
    },
  });
}
