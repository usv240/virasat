import { hasKey } from "@/lib/anthropic";

export async function GET() {
  return Response.json({
    ok: true,
    version: "1.0.0",
    ai: hasKey() ? "live" : "sample",
    message: hasKey() ? "Live AI is on." : "Sample mode: no ANTHROPIC_API_KEY is set, so AI steps replay pre-computed results for the sample family.",
  });
}
