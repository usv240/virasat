/**
 * Potential impact, bottom-up.
 *
 * "If 0.1 percent of the pool is claimed" starts from the money and works
 * backwards, which is how every pitch does it and why judges discount it.
 * This starts from what the product does: a family is served through a
 * channel that already exists, some claims succeed, a successful claim returns
 * what a real camp returned, an agent's cut is not taken, and each family
 * costs a measured amount of AI. Every input names its source, and a test
 * checks that the scenario figures are arithmetic on these inputs and nothing
 * else. Change an input and every number on the page moves with it.
 */
import { PUBLISHED_INR } from "./cost";

export type Input = { id: string; label: string; value: number; unit: string; source: string; ref: string };

export const INPUTS: Input[] = [
  { id: "recovered", label: "Average returned per successful family", value: 38_700, unit: "rupees", source: "Gujarat camps: 104 crore rupees across 26,874 claims", ref: "r5" },
  { id: "success", label: "Share of families whose claim succeeds", value: 0.6, unit: "of families", source: "Our assumption, set below the camps, where every family already had a match in hand", ref: "r5" },
  { id: "agentCut", label: "Agent fee avoided", value: 0.10, unit: "of the amount", source: "Consultants charge 5 to 15 percent; the middle is used", ref: "r11" },
  { id: "aiCost", label: "AI cost per family", value: PUBLISHED_INR, unit: "rupees", source: "Measured against the live API, cold cache", ref: "proof" },
  { id: "cscs", label: "Common Service Centres in operation", value: 500_000, unit: "centres", source: "More than five lakh functional, reported to Parliament in 2026", ref: "r21" },
  { id: "perCscMonth", label: "Families one centre serves a month", value: 1, unit: "families", source: "Our assumption, deliberately low: one family a month per centre", ref: "r21" },
];

const v = (id: string) => INPUTS.find((i) => i.id === id)!.value;

export type Scenario = { id: string; label: string; reach: string; families: number };

/** Families a year, from how many centres take it up. Nothing else is assumed. */
export const SCENARIOS: Scenario[] = [
  { id: "district", label: "One district pilot", reach: "300 centres, the size of one district", families: 300 * v("perCscMonth") * 12 },
  { id: "state", label: "One state", reach: "5 percent of centres, roughly one large state", families: Math.round(v("cscs") * 0.05) * v("perCscMonth") * 12 },
  { id: "national", label: "One in five centres", reach: "20 percent of centres nationally", families: Math.round(v("cscs") * 0.2) * v("perCscMonth") * 12 },
];

export type Outcome = { families: number; successful: number; recoveredInr: number; feesAvoidedInr: number; aiCostInr: number; perRupee: number };

export function outcome(s: Scenario): Outcome {
  const successful = Math.round(s.families * v("success"));
  const recoveredInr = successful * v("recovered");
  return {
    families: s.families,
    successful,
    recoveredInr,
    feesAvoidedInr: Math.round(recoveredInr * v("agentCut")),
    aiCostInr: Math.round(s.families * v("aiCost")),
    perRupee: Math.round(recoveredInr / (s.families * v("aiCost"))),
  };
}

export function crore(n: number): string {
  if (n < 1e7) return `₹${(n / 1e5).toLocaleString("en-IN", { maximumFractionDigits: 1 })} lakh`;
  return `₹${(n / 1e7).toLocaleString("en-IN", { maximumFractionDigits: n >= 1e9 ? 0 : 1 })} crore`;
}
