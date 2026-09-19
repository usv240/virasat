import { describe, expect, it } from "vitest";
import { decide, RULES, RuleSchema } from "../src/lib/rules";
import type { ClaimInput } from "../src/lib/types";

const base: ClaimInput = { assetType: "bank", institution: "State Bank of India", amountInr: 158420, nomineePresent: true, jointHolder: false, claimantRelation: "spouse", otherHeirs: true };

describe("rule engine", () => {
  it("every built-in rule set validates against the schema", () => {
    for (const r of RULES) expect(RuleSchema.safeParse(r).success).toBe(true);
  });

  it("SBI: nominee route when a nominee is named", () => {
    const d = decide(base);
    expect(d.route).toBe("nominee");
    expect(d.ruleId).toBe("SBI_NOMINEE_V1");
    expect(d.checklist.map((c) => c.id)).toContain("nominee_id");
  });

  it("SBI: simplified legal heir route under the threshold", () => {
    const d = decide({ ...base, nomineePresent: false, amountInr: 400000 });
    expect(d.route).toBe("legal_heir_simplified");
    expect(d.checklist.map((c) => c.id)).toContain("indemnity_bond");
    expect(d.checklist.map((c) => c.id)).not.toContain("succession_certificate");
  });

  it("SBI: succession certificate above the threshold", () => {
    const d = decide({ ...base, nomineePresent: false, amountInr: 900000 });
    expect(d.route).toBe("legal_heir_succession");
    expect(d.checklist.map((c) => c.id)).toContain("succession_certificate");
  });

  it("SBI: exactly at the threshold stays simplified", () => {
    expect(decide({ ...base, nomineePresent: false, amountInr: 500000 }).route).toBe("legal_heir_simplified");
    expect(decide({ ...base, nomineePresent: false, amountInr: 500001 }).route).toBe("legal_heir_succession");
  });

  it("SBI: joint holder needs review regardless of nominee", () => {
    expect(decide({ ...base, jointHolder: true }).route).toBe("needs_review");
    expect(decide({ ...base, jointHolder: true, nomineePresent: false }).route).toBe("needs_review");
  });

  it("unknown nominee status asks the family to check first", () => {
    const d = decide({ ...base, nomineePresent: null });
    expect(d.route).toBe("needs_review");
    expect(d.notes.join(" ")).toMatch(/nominee/i);
  });

  it("other heirs adds a note on heir routes only", () => {
    expect(decide({ ...base, nomineePresent: false, amountInr: 1000 }).notes.join(" ")).toMatch(/no-objection/);
    expect(decide({ ...base, otherHeirs: true }).notes.join(" ")).not.toMatch(/no-objection/);
  });

  it("LIC: nominee and no-nominee routes", () => {
    const lic = { ...base, assetType: "insurance" as const, institution: "Life Insurance Corporation of India", amountInr: 200000 };
    expect(decide(lic).ruleId).toBe("LIC_NOMINEE_V1");
    expect(decide({ ...lic, nomineePresent: false }).route).toBe("legal_heir_simplified");
    expect(decide({ ...lic, nomineePresent: false }).escalation.to).toMatch(/Insurance Ombudsman/);
  });

  it("EPFO: form 20 in both routes", () => {
    const pf = { ...base, assetType: "pf" as const, institution: "EPFO", amountInr: 50000 };
    expect(decide(pf).checklist.map((c) => c.id)).toContain("form_20");
    expect(decide({ ...pf, nomineePresent: false }).checklist.map((c) => c.id)).toContain("form_20");
  });

  it("IEPF: threshold splits small and large holdings", () => {
    const sh = { ...base, assetType: "shares" as const, institution: "Bharat Cement Ltd", nomineePresent: false };
    expect(decide({ ...sh, amountInr: 60000 }).route).toBe("legal_heir_simplified");
    expect(decide({ ...sh, amountInr: 800000 }).route).toBe("legal_heir_succession");
    expect(decide({ ...sh, amountInr: 60000 }).checklist.map((c) => c.id)).toContain("iepf5");
  });

  it("India Post: three routes", () => {
    const post = { ...base, assetType: "post" as const, institution: "India Post" };
    expect(decide(post).route).toBe("nominee");
    expect(decide({ ...post, nomineePresent: false, amountInr: 100000 }).route).toBe("legal_heir_simplified");
    expect(decide({ ...post, nomineePresent: false, amountInr: 600000 }).route).toBe("legal_heir_succession");
  });

  it("mutual funds fall back to needs_review with no rule set", () => {
    const d = decide({ ...base, assetType: "mf", institution: "Nivesh Balanced Fund" });
    expect(d.route).toBe("needs_review");
    expect(d.ruleId).toBe("NO_RULESET");
  });

  it("Bring Your Own Rules take priority over built-ins", () => {
    const byo = { institution: "State Bank of India", assetType: "bank" as const, version: 9, rules: [{ id: "BYO_NOMINEE", when: { nomineePresent: true }, route: "nominee" as const, documents: ["claim_form"], timelineDays: 5 }], escalation: { afterDays: 10, to: "X", how: "Y" } };
    const d = decide(base, [byo]);
    expect(d.ruleId).toBe("BYO_NOMINEE");
    expect(d.ruleVersion).toBe(9);
    expect(d.timelineDays).toBe(5);
  });

  it("every rule set covers nominee true and false for a small amount", () => {
    for (const r of RULES) {
      for (const nominee of [true, false]) {
        const d = decide({ ...base, assetType: r.assetType, institution: r.institution, amountInr: 10000, nomineePresent: nominee });
        expect(d.route).not.toBe("needs_review");
        expect(d.ruleVersion).toBe(r.version);
      }
    }
  });
});
