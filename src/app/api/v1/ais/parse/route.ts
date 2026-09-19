import { guard, problem, withHeaders } from "@/lib/api-auth";
import { parseAisText, rowsToAssets } from "@/lib/ais";
import { SAMPLE_AIS_ASSETS } from "@/lib/sample";

export const maxDuration = 60;

/**
 * POST /api/v1/ais/parse
 * multipart: file (AIS PDF) OR sample=true
 * Returns { assets, rows, mode }. No AI is needed: the tables are read by code.
 */
export async function POST(req: Request) {
  const g = guard(req);
  if (g instanceof Response) return g;
  const form = await req.formData().catch(() => null);
  if (!form) return problem(400, "Bad request", "Send multipart form data with a PDF file or sample=true.");
  const file = form.get("file");

  if (form.get("sample") === "true" && !(file instanceof File)) {
    return withHeaders(Response.json({ assets: SAMPLE_AIS_ASSETS, rows: [], mode: "sample" }), g.info, g.rl);
  }
  if (!(file instanceof File)) return problem(400, "Bad request", "No file was uploaded.");
  if (file.type !== "application/pdf") return problem(415, "Unsupported file type", "Upload the AIS as a PDF.");
  if (file.size > 20 * 1024 * 1024) return problem(413, "File too large", "PDFs must be under 20 MB.");

  try {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: new Uint8Array(await file.arrayBuffer()) });
    const parsed = await parser.getText();
    await parser.destroy();
    const rows = parseAisText(parsed.text);
    const assets = rowsToAssets(rows);
    return withHeaders(Response.json({ assets, rows, pages: parsed.total, mode: "live" }), g.info, g.rl);
  } catch (err) {
    return problem(500, "Could not read the PDF", err instanceof Error ? err.message : "Unknown error");
  }
}
