import { guard, problem, withHeaders } from "@/lib/api-auth";
import { searchDividends } from "@/lib/dividends";

/** GET /api/v1/dividends/search?name=... */
export async function GET(req: Request) {
  const g = guard(req);
  if (g instanceof Response) return g;
  const name = new URL(req.url).searchParams.get("name") ?? "";
  if (name.trim().length < 3) return problem(400, "Name too short", "Give at least 3 characters of the shareholder's name.");
  const results = searchDividends(name);
  return withHeaders(Response.json({ results, count: results.length, source: "sample index (same shape as companies' public unpaid-dividend lists)" }), g.info, g.rl);
}
