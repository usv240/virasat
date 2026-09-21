import { z } from "zod";
import { guard, problem, withHeaders } from "@/lib/api-auth";
import { buildClaimPack } from "@/lib/forms";
import type { Asset, Claim } from "@/lib/types";

const Body = z.object({
  claim: z.custom<Claim>((v) => typeof v === "object" && v !== null && "decision" in v),
  asset: z.custom<Asset>((v) => typeof v === "object" && v !== null && "institution" in v),
  claimant: z.object({ name: z.string().min(1), relation: z.string().min(1), address: z.string(), phone: z.string(), bankAccountMasked: z.string().optional() }),
});

/** POST /api/v1/claims/pack: returns the claim pack PDF. */
export async function POST(req: Request) {
  const g = await guard(req);
  if (g instanceof Response) return g;
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return problem(400, "Invalid body", "Send claim, asset and claimant.");
  const bytes = await buildClaimPack(parsed.data.claim, parsed.data.asset, parsed.data.claimant);
  const res = new Response(Buffer.from(bytes), {
    headers: { "content-type": "application/pdf", "content-disposition": `attachment; filename="virasat-claim-pack.pdf"` },
  });
  return withHeaders(res, g.info, g.rl);
}
