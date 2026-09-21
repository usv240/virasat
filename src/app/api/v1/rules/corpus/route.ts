import { CORPUS_LICENCE, CORPUS_VERSION, RULES } from "@/lib/rules";

/**
 * GET /api/v1/rules/corpus: the whole claim rule corpus, openly.
 *
 * Deliberately needs no key and no permission. The app on top of these rules is
 * replaceable; what does not exist anywhere today is the claim procedures of
 * Indian institutions written down as data a machine can read. If a bank, a
 * government portal or a rival team serves families better by taking this,
 * that is the outcome we want, so nothing is put in their way.
 */
export async function GET() {
  return Response.json(
    {
      name: "Virasat claim rule corpus",
      version: CORPUS_VERSION,
      licence: CORPUS_LICENCE,
      schema: "/api/v1/rules/schema",
      describes: "What each institution asks for when a family claims money, and in what order.",
      institutions: RULES.length,
      rules: RULES.reduce((n, r) => n + r.rules.length, 0),
      ruleSets: RULES,
    },
    {
      headers: {
        "access-control-allow-origin": "*",
        "cache-control": "public, max-age=3600",
      },
    },
  );
}
