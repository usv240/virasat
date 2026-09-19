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
