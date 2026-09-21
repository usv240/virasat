import Anthropic from "@anthropic-ai/sdk";
import { guard, problem, withHeaders } from "@/lib/api-auth";
import { hasKey, keyFromRequest } from "@/lib/anthropic";
import { extractDocument } from "@/lib/extract";
import { SAMPLE_DOCS } from "@/lib/sample";

export const maxDuration = 60;

const MAX_BYTES = 10 * 1024 * 1024;
const TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

/**
 * POST /api/v1/extract
 * multipart: file (image) OR sampleId (passbook | lic | share)
 * Returns the extraction schema. Sample mode when no AI key is available.
 */
export async function POST(req: Request) {
  const g = await guard(req);
  if (g instanceof Response) return g;
  const form = await req.formData().catch(() => null);
  if (!form) return problem(400, "Bad request", "Send multipart form data with a file or a sampleId.");

  const sampleId = form.get("sampleId");
  const byo = keyFromRequest(req);
  const file = form.get("file");

  if (typeof sampleId === "string" && (!file || !hasKey(byo))) {
    const doc = SAMPLE_DOCS.find((d) => d.id === sampleId);
    if (!doc) return problem(404, "Not found", "Unknown sampleId. Use passbook, lic or share.");
    return withHeaders(Response.json({ extraction: doc.extraction, mode: "sample" }), g.info, g.rl);
  }

  if (!(file instanceof File)) return problem(400, "Bad request", "No file was uploaded.");
  if (!TYPES.has(file.type)) return problem(415, "Unsupported file type", "Upload a JPEG, PNG or WebP photo.");
  if (file.size > MAX_BYTES) return problem(413, "File too large", "Photos must be under 10 MB.");
  if (!hasKey(byo)) return problem(503, "AI not configured", "No AI key is set on this server. Use a sample document, or send your own key in the x-byo-anthropic-key header.");

  try {
    const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
    const extraction = await extractDocument(base64, file.type as "image/jpeg", byo);
    return withHeaders(Response.json({ extraction, mode: "live" }), g.info, g.rl);
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) return problem(502, "AI key rejected", "The AI provider rejected the key.");
    if (err instanceof Anthropic.RateLimitError) return problem(503, "AI busy", "The AI provider is rate limiting us. Try again in a minute.");
    if (err instanceof Anthropic.APIError) return problem(502, "AI error", err.message);
    return problem(500, "Extraction failed", err instanceof Error ? err.message : "Unknown error");
  }
}
