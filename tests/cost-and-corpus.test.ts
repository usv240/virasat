import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { JOURNEY, LEVERS, PRICES, PUBLISHED_INR, journeyTotal, rupees, usd } from "../src/lib/cost";
import { CORPUS_VERSION, RULES, RuleSchema } from "../src/lib/rules";
import { CLAIMS } from "../src/lib/proof";
import { GLOSSARY } from "../src/lib/glossary";
import { INPUTS, PREVENTION, SCENARIOS, outcome, prevented } from "../src/lib/impact";
import { HOW_IT_WAS_BUILT, RUNTIME, SERVICES, TOOLING } from "../src/lib/credits";

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

/**
 * The rules ask that third-party resources be acknowledged. Credits lists are
 * famous for going stale the day after they are written, so this fails the
 * build if a dependency gets added and nobody says thank you for it.
 */
describe("credits", () => {
  const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
    dependencies: Record<string, string>;
  };

  // Names as published on npm, mapped to how a reader would recognise them.
  const NAMED: Record<string, string> = {
    next: "Next.js",
    react: "React",
    zod: "Zod",
    clsx: "clsx",
    "js-yaml": "js-yaml",
    "pdf-lib": "pdf-lib",
    "pdf-parse": "pdf-parse",
    "lucide-react": "lucide-react",
    "@anthropic-ai/sdk": "Anthropic TypeScript SDK",
  };

  it("acknowledges every package that ships to a family", () => {
    const credited = RUNTIME.map((c) => c.name);
    for (const dep of Object.keys(pkg.dependencies)) {
      expect(NAMED[dep], `${dep} is a new dependency with no entry in credits.ts`).toBeTruthy();
      expect(credited).toContain(NAMED[dep]);
    }
  });

  it("names a licence and a link for everything it credits", () => {
    for (const c of [...RUNTIME, ...TOOLING, ...SERVICES]) {
      expect(c.licence.length).toBeGreaterThan(2);
      expect(c.url).toMatch(/^https:\/\//);
      expect(c.what.endsWith(".")).toBe(true);
    }
  });
});

/**
 * The deck goes in front of the jury without the site next to it, so a stale
 * number on a slide is the one kind of error nobody catches in the room. These
 * check the two figures that have drifted before, and that the eight points the
 * rules ask for appear in the order the rules ask for them.
 */
describe("pitch deck", () => {
  const deck = readFileSync(new URL("../scripts/deck/build.js", import.meta.url), "utf8");

  it("quotes the published cost per family, and never a cheaper one", () => {
    const shown = deck.match(/const COST_PER_FAMILY = "about ₹(\d+)"/);
    expect(shown).toBeTruthy();
    expect(Number(shown![1])).toBe(Math.round(PUBLISHED_INR));
    // The published figure is the cold-cache one, so it must sit at or above
    // the warm measurement. Quoting the cheaper number is the failure mode.
    expect(PUBLISHED_INR).toBeGreaterThanOrEqual(journeyTotal().inr);
  });

  it("never prints a Lighthouse figure without saying which profile it is", () => {
    for (const line of deck.split("\n")) {
      if (!line.includes("Lighthouse")) continue;
      expect(line.toLowerCase()).toMatch(/desktop|mobile|phone|profile/);
    }
  });

  it("covers the eight presentation points in the order the rules list them", () => {
    const points = ["point 1", "point 2", "point 3", "point 4", "point 5", "point 6", "point 7", "point 8"];
    const at = points.map((p) => deck.indexOf(p));
    for (const i of at) expect(i).toBeGreaterThan(-1);
    expect([...at].sort((a, b) => a - b)).toEqual(at);
  });
});

describe("CREDITS.md", () => {
  const md = readFileSync(new URL("../CREDITS.md", import.meta.url), "utf8");

  it("names everything the site credits, so the repository and the page agree", () => {
    for (const c of [...RUNTIME, ...TOOLING, ...SERVICES]) expect(md).toContain(c.name);
  });

  it("discloses how the project was built, as the rules require", () => {
    expect(md).toContain(HOW_IT_WAS_BUILT.tools);
  });
});

/**
 * A test count is the easiest number in a project to quote once and never
 * update again. The deck counts it off disk; the prose cannot, so this checks
 * the prose instead. If you add a test and this fails, update the two files it
 * names rather than deleting this.
 */
describe("published test count", () => {
  it("matches what the README and the project description tell a judge", () => {
    const dir = new URL("./", import.meta.url);
    const actual = readdirSync(dir)
      .filter((f) => f.endsWith(".test.ts"))
      .reduce((n, f) => n + (readFileSync(new URL(f, dir), "utf8").match(/^ {2}it\(/gm) ?? []).length, 0);
    for (const file of ["../README.md", "../public/docs/PROJECT-DESCRIPTION.md"]) {
      const text = readFileSync(new URL(file, import.meta.url), "utf8");
      // Every place the file quotes a count, not just the first: the README
      // once said 53 in one line and "39 of 39 pass" in a table lower down.
      const quoted = [...text.matchAll(/(\d+) (?:automated )?tests\W|(\d+) of \d+ pass/g)].map((m) => Number(m[1] ?? m[2]));
      expect(quoted.length, `${file} never says how many tests there are`).toBeGreaterThan(0);
      for (const q of quoted) expect(q, file).toBe(actual);
    }
  });
});

/**
 * The impact figures are published as potential, not achieved, and the only
 * defence of a potential figure is that it is arithmetic on named inputs.
 */
describe("impact model", () => {
  it("derives every scenario from the cited inputs and nothing else", () => {
    for (const s of SCENARIOS) {
      const o = outcome(s);
      const success = INPUTS.find((i) => i.id === "success")!.value;
      const recovered = INPUTS.find((i) => i.id === "recovered")!.value;
      expect(o.successful).toBe(Math.round(s.families * success));
      expect(o.recoveredInr).toBe(o.successful * recovered);
      expect(o.aiCostInr).toBe(Math.round(s.families * PUBLISHED_INR));
    }
  });

  it("names a source for every input", () => {
    for (const i of INPUTS) expect(i.source.length, i.id).toBeGreaterThan(10);
  });

  it("derives prevention from the cited inflow, and lists the smallest share first", () => {
    const inflow = INPUTS.find((i) => i.id === "inflow")!.value;
    for (const p of PREVENTION) expect(prevented(p.share)).toBe(Math.round(inflow * p.share));
    expect(PREVENTION[0].share).toBe(Math.min(...PREVENTION.map((p) => p.share)));
  });

  it("keeps the success rate below what the camps saw, since camps started with a match in hand", () => {
    expect(INPUTS.find((i) => i.id === "success")!.value).toBeLessThan(1);
  });
});
