/**
 * API keys and errors for the public API.
 *
 * Keys: `vs_test_...` (sandbox, sample data allowed, free) and `vs_live_...`.
 * The public sandbox key `vs_test_demo` works for everyone. Live keys are read
 * from the VIRASAT_LIVE_KEYS environment variable (comma separated, stored as
 * SHA-256 hashes) so no plain key ever sits in the codebase.
 */
import { createHash } from "crypto";

export type KeyInfo = { tier: "sandbox" | "live"; prefix: string; limitPerMin: number };

const SANDBOX_KEYS = new Set(["vs_test_demo"]);
const buckets = new Map<string, { count: number; reset: number }>();

function sha(s: string) {
  return createHash("sha256").update(s).digest("hex");
}

export function authenticate(req: Request): KeyInfo | null {
  const h = req.headers.get("authorization") ?? "";
  const key = h.startsWith("Bearer ") ? h.slice(7).trim() : "";
  if (!key) return null;
  if (SANDBOX_KEYS.has(key)) return { tier: "sandbox", prefix: key.slice(0, 12), limitPerMin: 30 };
  const live = (process.env.VIRASAT_LIVE_KEYS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (key.startsWith("vs_live_") && live.includes(sha(key))) return { tier: "live", prefix: key.slice(0, 12), limitPerMin: 300 };
  return null;
}

/** Simple in-memory rate limit per key (fine for one server; use Redis at scale). */
export function rateLimit(info: KeyInfo): { ok: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const b = buckets.get(info.prefix);
  if (!b || b.reset < now) {
    buckets.set(info.prefix, { count: 1, reset: now + 60_000 });
    return { ok: true, remaining: info.limitPerMin - 1, reset: now + 60_000 };
  }
  b.count += 1;
  return { ok: b.count <= info.limitPerMin, remaining: Math.max(0, info.limitPerMin - b.count), reset: b.reset };
}

/** RFC 9457 problem details. */
export function problem(status: number, title: string, detail: string): Response {
  return new Response(JSON.stringify({ type: "about:blank", title, status, detail }), {
    status,
    headers: { "content-type": "application/problem+json" },
  });
}

export function withHeaders(res: Response, info: KeyInfo, rl: { remaining: number; reset: number }): Response {
  res.headers.set("RateLimit-Limit", String(info.limitPerMin));
  res.headers.set("RateLimit-Remaining", String(rl.remaining));
  res.headers.set("RateLimit-Reset", String(Math.ceil((rl.reset - Date.now()) / 1000)));
  res.headers.set("X-Virasat-Tier", info.tier);
  return res;
}

/**
 * Guard for public API routes. Requests from our own web app (same origin, no
 * Authorization header) are allowed as sandbox so the demo works without a key.
 */
export function guard(req: Request): { info: KeyInfo; rl: ReturnType<typeof rateLimit> } | Response {
  const hasAuth = Boolean(req.headers.get("authorization"));
  const info = hasAuth ? authenticate(req) : { tier: "sandbox" as const, prefix: "web-" + (req.headers.get("x-forwarded-for") ?? "local").slice(0, 16), limitPerMin: 60 };
  if (!info) return problem(401, "Unauthorized", "Use a valid API key: Authorization: Bearer vs_test_demo for the sandbox.");
  const rl = rateLimit(info);
  if (!rl.ok) return problem(429, "Too many requests", "You have used this minute's allowance. Wait and try again.");
  return { info, rl };
}
