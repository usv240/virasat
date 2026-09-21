import type { Usage } from "./cost";
import Anthropic from "@anthropic-ai/sdk";

export const MODEL = "claude-opus-5";

/** True when live AI can run. Otherwise the app uses sample mode. */
export function hasKey(override?: string | null): boolean {
  return Boolean(override || process.env.ANTHROPIC_API_KEY);
}

/**
 * Bring Your Own Key: a caller may pass their own key for this request only.
 * It is never stored or logged.
 */
export function client(override?: string | null): Anthropic {
  return override ? new Anthropic({ apiKey: override }) : new Anthropic();
}

export function keyFromRequest(req: Request): string | null {
  const byo = req.headers.get("x-byo-anthropic-key");
  return byo && byo.startsWith("sk-ant-") ? byo : null;
}

/**
 * The shape the SDK reports usage in. Kept narrow on purpose: these four
 * numbers are all the cost model needs, and every one of them is billable.
 */
type SdkUsage = {
  input_tokens?: number | null;
  output_tokens?: number | null;
  cache_read_input_tokens?: number | null;
  cache_creation_input_tokens?: number | null;
};

/**
 * Turn an SDK usage block into the shape src/lib/cost.ts prices.
 *
 * Every AI call in this app reports what it cost, so the family sees a real
 * figure rather than a promise, and the unit economics on the site are
 * arithmetic on measured tokens rather than a number someone liked.
 */
export function toUsage(u: SdkUsage | null | undefined): Usage {
  return {
    input: u?.input_tokens ?? 0,
    output: u?.output_tokens ?? 0,
    cacheRead: u?.cache_read_input_tokens ?? 0,
    cacheWrite: u?.cache_creation_input_tokens ?? 0,
  };
}

/** Add usage from several calls together, so one journey reports one figure. */
export function addUsage(...parts: Usage[]): Usage {
  return parts.reduce((a, b) => ({
    input: a.input + b.input,
    output: a.output + b.output,
    cacheRead: a.cacheRead + b.cacheRead,
    cacheWrite: a.cacheWrite + b.cacheWrite,
  }), { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 });
}
