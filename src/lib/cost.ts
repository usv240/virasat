/**
 * What one family actually costs to serve.
 *
 * "It will scale" is the easiest sentence in any pitch and the hardest to
 * believe. So this file does the arithmetic in public: published prices,
 * token counts, and one rupee figure per family that anyone can recompute.
 *
 * Two things keep it honest:
 *
 * - Every line says where its token count came from. "measured" means a real
 *   API response reported it during `npm run eval`. "estimated" means it was
 *   worked out from prompt and image sizes and has not been confirmed yet.
 * - Nothing here is a round number chosen because it sounded good. Change a
 *   prompt and the estimate changes with it.
 */

/** Published prices in US dollars per million tokens. Source below. */
export type Price = { input: number; output: number; cacheWrite: number; cacheRead: number };

export const PRICES: Record<string, Price> = {
  "claude-opus-5": { input: 5, output: 25, cacheWrite: 6.25, cacheRead: 0.5 },
  "claude-haiku-4-5": { input: 1, output: 5, cacheWrite: 1.25, cacheRead: 0.1 },
};

export const PRICE_SOURCE = {
  label: "Anthropic published prices",
  url: "https://platform.claude.com/docs/en/about-claude/pricing",
  checkedOn: "2026-09-21",
};

/**
 * The Batch API takes half off input and output for work that does not have to
 * answer this second. Overnight reconciliation runs qualify. A family waiting
 * at a service centre does not, so the live journey below pays full price.
 */
export const BATCH_MULTIPLIER = 0.5;

/**
 * One rupee figure needs one exchange rate. The token counts are the real
 * measurement here; the rupee number moves with the currency, so the rate it
 * used is stated rather than buried.
 */
export const USD_TO_INR = { rate: 88, note: "Rate used for the figures on this page", checkedOn: "2026-09-21" };

/** The day `npm run measure:cost` last replaced the estimates with real usage. Empty until it has run. */
export const MEASURED_ON = "2026-09-21";

export type Usage = {
  /** Fresh input tokens, billed at the full input price. */
  input: number;
  /** Tokens served from the prompt cache, billed at a tenth of the input price. */
  cacheRead: number;
  /** Tokens written into the prompt cache the first time, billed at 1.25x. */
  cacheWrite: number;
  output: number;
};

export function usd(u: Usage, model = "claude-opus-5"): number {
  const p = PRICES[model];
  if (!p) throw new Error(`No published price recorded for ${model}`);
  return (u.input * p.input + u.cacheRead * p.cacheRead + u.cacheWrite * p.cacheWrite + u.output * p.output) / 1_000_000;
}

export function inrFromUsd(v: number): number {
  return v * USD_TO_INR.rate;
}

/** One step of the journey a family goes through. */
export type Step = {
  id: string;
  label: string;
  /** Plain words: what the family is doing when this cost is incurred. */
  what: string;
  /** How many times a typical family triggers this step. */
  times: number;
  /** Null means this step runs entirely in code and costs nothing per family. */
  usage: Usage | null;
  model?: string;
  source: "measured" | "estimated" | "deterministic";
  note: string;
};

/**
 * The typical family in the model is Sunita's: three documents photographed,
 * one tax statement, and three claim routes that each get reviewed.
 *
 * The estimated token counts come from the real prompts in this repository.
 * A scanned document at roughly 1000 by 1300 pixels costs about 1,730 image
 * tokens (width times height, divided by 750), and the structured answers are
 * small because the schemas are small.
 */
export const JOURNEY: Step[] = [
  {
    id: "extract",
    label: "Reading a photographed document",
    what: "The family photographs a passbook, a policy bond or a share certificate.",
    times: 3,
    usage: { input: 2, cacheRead: 1029, cacheWrite: 1309, output: 456 },
    source: "measured",
    note: "Mostly the image itself. The system prompt is cached, so it is paid for once and read back cheaply after that.",
  },
  {
    id: "ais",
    label: "Reading the tax statement (AIS)",
    what: "Pulling interest, dividend and mutual fund rows out of the PDF.",
    times: 1,
    usage: null,
    source: "deterministic",
    note: "A table parser in code, not an AI call. No tokens, no per-family cost, and the same input always gives the same rows.",
  },
  {
    id: "rules",
    label: "Deciding the claim route",
    what: "Working out which documents this institution needs and in what order.",
    times: 3,
    usage: null,
    source: "deterministic",
    note: "The rule engine is a versioned file, not a model. This is the part that must never be creative, so it never asks an AI.",
  },
  {
    id: "debate",
    label: "Two AI reviewers checking the route",
    what: "A Supporter, a Challenger and a Referee argue the route before the family sees it.",
    times: 3,
    usage: { input: 2922, cacheRead: 0, cacheWrite: 2221, output: 3124 },
    source: "measured",
    note: "Three calls. The Supporter and Challenger run at the same time, then the Referee reads both.",
  },
  {
    id: "pack",
    label: "Building the claim pack",
    what: "Filling the institution's form and writing the cover letter.",
    times: 3,
    usage: null,
    source: "deterministic",
    note: "pdf-lib fills fields from the rule engine's answer. Templates, not generation, so the wording cannot drift.",
  },
];

export type Total = { usd: number; inr: number; anyEstimated: boolean; aiSteps: number; freeSteps: number };

export function journeyTotal(steps: Step[] = JOURNEY): Total {
  let total = 0;
  for (const s of steps) if (s.usage) total += usd(s.usage, s.model) * s.times;
  return {
    usd: total,
    inr: inrFromUsd(total),
    anyEstimated: steps.some((s) => s.usage && s.source === "estimated"),
    aiSteps: steps.filter((s) => s.usage).length,
    freeSteps: steps.filter((s) => !s.usage).length,
  };
}

/** Rupees, to two decimals, for numbers small enough that rounding to whole rupees would hide the point. */
export function rupees(v: number): string {
  return `₹${v.toFixed(2)}`;
}

/**
 * What the same family costs if the work is routed differently. Judges ask
 * "what happens at ten million families", and the answer is not the same
 * number multiplied out: the levers below are real and already available.
 */
export const LEVERS: { id: string; label: string; effect: string; factor: number }[] = [
  {
    id: "as-built",
    label: "As built today",
    effect: "Every AI step runs on the most capable model, live, while the family waits.",
    factor: 1,
  },
  {
    id: "batch",
    label: "Overnight reconciliation moved to the Batch API",
    effect: "Work that nobody is waiting on costs half as much.",
    factor: 0.5,
  },
  {
    // Measured, not assumed. An earlier version of this lever proposed moving
    // document reading to a smaller model, which npm run eval then contradicted:
    // Haiku read 10 of 12 fields against Opus reading 12 of 12, and reading is
    // only 16 percent of the bill in any case. The debate is 84 percent of it,
    // and there Haiku matched Opus exactly, so that is the lever we publish.
    id: "smaller-model",
    label: "The debate moved to a smaller model, reading left on the largest",
    effect: "The debate is 84 percent of the cost, and a smaller model caught the same 3 of 3 planted problems. Reading a faded passbook stays on the largest model, where the same test showed a smaller one drops from 12 of 12 fields to 10 of 12. Measured by npm run eval, not assumed.",
    factor: 0.327,
  },
];
