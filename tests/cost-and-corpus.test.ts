import { describe, expect, it } from "vitest";
import { z } from "zod";
import { JOURNEY, LEVERS, PRICES, journeyTotal, rupees, usd } from "../src/lib/cost";
import { CORPUS_VERSION, RULES, RuleSchema } from "../src/lib/rules";
import { CLAIMS } from "../src/lib/proof";
import { GLOSSARY } from "../src/lib/glossary";

/**
 * The cost figure is published to judges as a fact about the system, so it gets
 * tested like one. These do not check that the number is small. They check that
 * it is arithmetic and that nobody can quietly change it into a nicer number.
 */
describe("cost model", () => {
  it("prices a call from published rates, not a guess", () => {
    const one = usd({ input: 1_000_000, cacheRead: 0, cacheWrite: 0, output: 0 });
    expect(one).toBe(PRICES["claude-opus-5"].input);
  });

  it("charges cache reads at a tenth of fresh input", () => {
    const fresh = usd({ input: 10_000, cacheRead: 0, cacheWrite: 0, output: 0 });
    const cached = usd({ input: 0, cacheRead: 10_000, cacheWrite: 0, output: 0 });
    expect(cached).toBeCloseTo(fresh / 10, 10);
  });

  it("refuses to price a model whose published rate we have not recorded", () => {
    expect(() => usd({ input: 1, cacheRead: 0, cacheWrite: 0, output: 0 }, "some-future-model")).toThrow();
  });

  it("counts the steps that cost nothing as costing nothing", () => {
    const free = JOURNEY.filter((s) => !s.usage);
    expect(free.length).toBeGreaterThan(0);
    for (const s of free) expect(s.source).toBe("deterministic");
  });

  it("totals the journey by multiplying each step by how often it happens", () => {
    const byHand = JOURNEY.reduce((n, s) => (s.usage ? n + usd(s.usage, s.model) * s.times : n), 0);
    expect(journeyTotal().usd).toBeCloseTo(byHand, 12);
  });

  it("says out loud when a step is still estimated rather than measured", () => {
    const estimated = JOURNEY.some((s) => s.usage && s.source === "estimated");
    expect(journeyTotal().anyEstimated).toBe(estimated);
  });

  it("keeps the published figure in a range a family would recognise as small", () => {
    // Not a precision check. A change that pushes one family past a hundred
    // rupees changes the whole feasibility argument and should fail loudly.
    const { inr } = journeyTotal();
    expect(inr).toBeGreaterThan(0);
    expect(inr).toBeLessThan(100);
  });

  it("only offers levers that actually make it cheaper", () => {
    expect(LEVERS[0].factor).toBe(1);
    for (const l of LEVERS) expect(l.factor).toBeGreaterThan(0);
    for (const l of LEVERS.slice(1)) expect(l.factor).toBeLessThan(1);
  });

  it("formats rupees so small amounts stay readable", () => {
    expect(rupees(19.992)).toBe("₹19.99");
  });
});

/**
 * The corpus is published as public infrastructure, so the published schema has
 * to keep matching the rules we actually ship.
 */
describe("open rule corpus", () => {
  it("validates every built-in rule set against the published schema", () => {
    for (const set of RULES) expect(() => RuleSchema.parse(set)).not.toThrow();
  });

  it("generates a JSON Schema from the same source that enforces it", () => {
    const schema = z.toJSONSchema(RuleSchema, { target: "draft-2020-12" }) as { properties?: Record<string, unknown> };
    expect(Object.keys(schema.properties ?? {})).toEqual(expect.arrayContaining(["institution", "assetType", "version", "rules"]));
  });

  it("is versioned as a whole so a result can cite which corpus it came from", () => {
    expect(CORPUS_VERSION).toMatch(/^\d+\.\d+$/);
  });

  it("gives every rule set a version, so a decision can be traced back", () => {
    for (const set of RULES) expect(set.version).toBeGreaterThan(0);
  });
});

describe("the claims we publish", () => {
  it("gives every claim something a reader can actually run or open", () => {
    for (const c of CLAIMS) {
      expect(c.check.length).toBeGreaterThan(0);
      if (c.kind === "link") expect(c.href).toBeTruthy();
    }
  });
});

describe("glossary", () => {
  it("has no duplicate ids, so a tooltip can never be ambiguous", () => {
    const ids = GLOSSARY.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every entry a definition worth reading", () => {
    for (const g of GLOSSARY) expect(g.def.length).toBeGreaterThan(20);
  });
});
