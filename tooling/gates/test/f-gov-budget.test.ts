// tooling/gates/test/f-gov-budget.test.ts — the F-GOV falsifier (D-442, Ω-2).
// Generated as a RED stub by `omega:loop --stub D-442` (emitted as f-gov.test.ts,
// renamed: F-GOV is Ω-2's runtime budget substrate; D-439's corpus-governance
// falsifier is F-GOV-CI in f-gov-ci.test.ts — the two gov verbs never conflate),
// then implemented.
//  F-GOV.1 declared-before-run — consume with no declaration refuses GOV_BUDGET_UNDECLARED; declare; consume; green — the refusal proves the gate
//  F-GOV.2 deterministic-replay — the assert fold over the same declaration + burn rows replays byte-identically ×100; no stored summary exists to disagree
//  F-GOV.3 attributable-burn — samples carry the consumer, the declaration carries the principal; budget.read answers "who spent what" with rows
//  F-GOV.4 exhaustion-is-loud — consumed = limits lands the visible EXHAUSTED state; one unit over refuses GOV_BUDGET_EXCEEDED naming budget + consumer — never a quiet freeze
//  F-GOV.5 refusal-proves — bad scope, undeclared consume, uncited amendment, over-consumption: each register code fired by a planted violation, the sentence naming the budget and the scope
//  F-GOV.6 sampled-burn — burns sample at the declared burnIntervalMs cadence (10 consumes, one row, the spend exact); the cadence is itself a declared field
//  F-GOV.7 headless-loud-failure — the ceremony is daemon/CLI-only, budget.read renders text, and zero quiet paths: every degradation branch refuses named or renders visibly
import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  assertBudget, declarationRef, BudgetLedger,
  GOV_BUDGET_UNDECLARED, GOV_BUDGET_SCOPE_INVALID, GOV_BUDGET_AMENDMENT_UNCITED,
  GOV_BUDGET_EXHAUSTED, GOV_BUDGET_EXCEEDED,
  type BudgetDeclaration,
} from "../../../plugins/vivim-run/src/budget.ts";

const decl = (budgetId: string, over: Partial<BudgetDeclaration> = {}): BudgetDeclaration => ({
  budgetId, principal: "user:alice", scope: "task",
  limits: { cpuMs: 500, memMB: 128, opsCount: 10 },
  window: { burnIntervalMs: 1_000 },
  basis: "manifest runtime.budget (D-388/D-392)",
  at: 1_000,
  ...over,
});

describe("F-GOV.1 (declared-before-run)", () => {
  test("consume with no declaration refuses GOV_BUDGET_UNDECLARED; declare; consume; green — the refusal proves the gate", () => {
    const ledger = new BudgetLedger();
    const refused = ledger.consume("budget:task:t1", "task:t1", { cpuMs: 10 }, 1_000);
    expect(refused.ok).toBe(false);
    expect(refused.code).toBe(GOV_BUDGET_UNDECLARED);
    expect(refused.sentence).toContain("budget:task:t1");
    expect(refused.sentence).toContain("unmetered");
    expect(ledger.sampleRows().length).toBe(0); // refused work never spends
    // declare; run; green
    const declared = ledger.declare(decl("budget:task:t1"));
    expect(declared.ok).toBe(true);
    const ran = ledger.consume("budget:task:t1", "task:t1", { cpuMs: 10 }, 1_100);
    expect(ran.ok).toBe(true);
    expect(ran.state).toBe("CURRENT");
    // the burn counts the moment it happens — sampled or pending, the tick has not elapsed
    const counted = ledger.consume("budget:task:t1", "task:t1", { cpuMs: 495 }, 1_150);
    expect(counted.ok).toBe(false); // 505 of 500 — the un-sampled spend already counts
    expect(counted.code).toBe(GOV_BUDGET_EXCEEDED);
    // the tick lands the row
    const tick = ledger.consume("budget:task:t1", "task:t1", { cpuMs: 0 }, 2_200);
    expect(tick.ok).toBe(true);
    expect(ledger.sampleRows().length).toBe(1);
    expect(ledger.sampleRows()[0]!.spent.cpuMs).toBe(10);
  });
});

describe("F-GOV.2 (deterministic-replay)", () => {
  test("the assert fold over the same declaration + burn rows replays byte-identically ×100; no stored summary exists to disagree", () => {
    const ledger = new BudgetLedger();
    const declaration = decl("budget:plan:p1", { scope: "plan" });
    ledger.declare(declaration);
    ledger.consume("budget:plan:p1", "step:s1", { cpuMs: 100, memMB: 10, opsCount: 1 }, 1_000);
    ledger.consume("budget:plan:p1", "step:s2", { cpuMs: 150, memMB: 5 }, 1_500); // mid-cadence: pending
    ledger.consume("budget:plan:p1", "step:s2", { cpuMs: 100 }, 2_500); // cadence elapsed: the sample lands
    const samples = [...ledger.sampleRows()];
    expect(samples.length).toBe(2);
    const first = JSON.stringify(assertBudget("budget:plan:p1", declaration, "step:s3", { cpuMs: 50 }, samples));
    for (let replay = 0; replay < 100; replay++) {
      expect(JSON.stringify(assertBudget("budget:plan:p1", declaration, "step:s3", { cpuMs: 50 }, samples))).toBe(first);
    }
    // the derived view is recomputed every call — two reads, byte-identical, no stored summary
    const a = ledger.read(undefined, 5_000);
    const b = ledger.read(undefined, 5_000);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(a.rendered).toBe(b.rendered);
  });
});

describe("F-GOV.3 (attributable-burn)", () => {
  test("samples carry the consumer, the declaration carries the principal; budget.read answers \"who spent what\" with rows", () => {
    const ledger = new BudgetLedger();
    ledger.declare(decl("budget:comp:c1", { scope: "realization" }));
    ledger.consume("budget:comp:c1", "task:41", { cpuMs: 200 }, 1_000);
    ledger.consume("budget:comp:c1", "task:42", { cpuMs: 100 }, 1_200);
    ledger.consume("budget:comp:c1", "task:42", { cpuMs: 0 }, 2_200); // the tick lands both samples
    const rows = ledger.sampleRows();
    expect(rows.length).toBe(2);
    // every sample names its consumer — spend never accrues to nobody
    const byConsumer = new Map(rows.map((r) => [r.consumer, r.spent.cpuMs]));
    expect(byConsumer.get("task:41")).toBe(200);
    expect(byConsumer.get("task:42")).toBe(100);
    // the view answers "who melted the laptop" from rows: principal + consumers
    const view = ledger.read("budget:comp:c1", 2_300);
    expect(view.rows[0]!.principal).toBe("user:alice");
    expect(view.rows[0]!.consumers).toEqual(["task:41", "task:42"]);
    expect(view.rows[0]!.consumed.cpuMs).toBe(300);
    expect(view.rendered).toContain("user:alice");
    expect(view.rendered).toContain("task:41,task:42");
  });
});

describe("F-GOV.4 (exhaustion-is-loud)", () => {
  test("consumed = limits lands the visible EXHAUSTED state; one unit over refuses GOV_BUDGET_EXCEEDED naming budget + consumer — never a quiet freeze", () => {
    const ledger = new BudgetLedger();
    ledger.declare(decl("budget:task:t9"));
    const exact = ledger.consume("budget:task:t9", "task:t9", { cpuMs: 500 }, 1_000);
    expect(exact.ok).toBe(true); // the work ran — the budget is spent, loudly
    expect(exact.state).toBe("EXHAUSTED");
    expect(exact.code).toBe(GOV_BUDGET_EXHAUSTED);
    expect(exact.sentence).toContain("visible");
    const view = ledger.read("budget:task:t9", 1_100);
    expect(view.rows[0]!.exhausted).toBe(true);
    expect(view.rendered).toContain("EXHAUSTED");
    // one unit over: the named refusal, budget AND consumer named
    const over = ledger.consume("budget:task:t9", "task:t9", { cpuMs: 1 }, 1_200);
    expect(over.ok).toBe(false);
    expect(over.code).toBe(GOV_BUDGET_EXCEEDED);
    expect(over.sentence).toContain("budget:task:t9");
    expect(over.sentence).toContain("task:t9");
    // refused work never spends — the fold still shows 500, not 501
    expect(ledger.read("budget:task:t9", 1_300).rows[0]!.consumed.cpuMs).toBe(500);
  });
});

describe("F-GOV.5 (refusal-proves)", () => {
  test("bad scope, undeclared consume, uncited amendment, over-consumption: each register code fired by a planted violation, the sentence naming the budget and the scope", () => {
    const ledger = new BudgetLedger();
    // a scope that names nothing meterable
    const scope = ledger.declare(decl("budget:b1", { scope: "vibes" as never }));
    expect(scope.ok).toBe(false);
    if (!scope.ok) {
      expect(scope.code).toBe(GOV_BUDGET_SCOPE_INVALID);
      expect(scope.sentence).toContain("task · plan · watch · context · realization");
    }
    // undeclared consumption (§18)
    const und = ledger.consume("budget:ghost", "task:ghost", { cpuMs: 1 }, 1_000);
    expect(und.ok).toBe(false);
    expect(und.code).toBe(GOV_BUDGET_UNDECLARED);
    // amendment without a basis citation
    const first = ledger.declare(decl("budget:b2"));
    expect(first.ok).toBe(true);
    const uncited = ledger.declare(decl("budget:b2", { at: 2_000 }));
    expect(uncited.ok).toBe(false);
    if (!uncited.ok) {
      expect(uncited.code).toBe(GOV_BUDGET_AMENDMENT_UNCITED);
      expect(uncited.sentence).toContain("budget:b2");
    }
    if (!first.ok) throw new Error("unreachable");
    const cited = ledger.declare(decl("budget:b2", { at: 2_000, basis: "evidence: soak D-401 2026-09 run", supersedes: declarationRef(first.row) }));
    expect(cited.ok).toBe(true);
    // over-consumption
    ledger.declare(decl("budget:b3"));
    const over = ledger.consume("budget:b3", "task:x", { cpuMs: 501 }, 1_000);
    expect(over.ok).toBe(false);
    expect(over.code).toBe(GOV_BUDGET_EXCEEDED);
    // nothing the door refused ever registered
    expect(ledger.list()).not.toContain("budget:b1");
    expect(ledger.list()).toContain("budget:b2");
    expect(ledger.list()).toContain("budget:b3");
  });
});

describe("F-GOV.6 (sampled-burn)", () => {
  test("burns sample at the declared burnIntervalMs cadence (10 consumes, one row, the spend exact); the cadence is itself a declared field", () => {
    const ledger = new BudgetLedger();
    ledger.declare(decl("budget:samp")); // the declared cadence: 1_000ms
    for (let i = 0; i < 10; i++) {
      const v = ledger.consume("budget:samp", "task:s", { cpuMs: 10 }, 1_000);
      expect(v.ok).toBe(true);
    }
    // nothing sampled mid-cadence — the rows batch, the fold does not
    expect(ledger.sampleRows().length).toBe(0);
    // enforcement is exact anyway: the unit that would exceed refuses before any row exists
    const refused = ledger.consume("budget:samp", "task:s", { cpuMs: 401 }, 1_050);
    expect(refused.ok).toBe(false);
    expect(refused.code).toBe(GOV_BUDGET_EXCEEDED);
    // the tick flushes ONE row carrying the summed spend — 10 consumes, one row, exact
    const tick = ledger.consume("budget:samp", "task:s", { cpuMs: 0 }, 2_100);
    expect(tick.ok).toBe(true);
    const rows = ledger.sampleRows();
    expect(rows.length).toBe(1);
    expect(rows[0]!.spent.cpuMs).toBe(100);
    expect(rows[0]!.from).toBe(1_000);
    expect(rows[0]!.at).toBe(2_100);
    expect(rows[0]!.refs).toContain("gov.budget:budget:samp");
    // the cadence is itself a declared field: burnIntervalMs 0 = per-op accounting, declared as such
    const perOp = new BudgetLedger();
    perOp.declare(decl("budget:perop", { window: { burnIntervalMs: 0 } }));
    for (let i = 0; i < 3; i++) perOp.consume("budget:perop", "task:p", { cpuMs: 1 }, 1_000 + i);
    expect(perOp.sampleRows().length).toBe(3);
    // the freshness clock follows the declared cadence
    const freshness = (t: number) => ledger.read("budget:samp", t).rows[0]!.freshness;
    expect(freshness(2_600)).toBe("CURRENT"); // 500ms after the tick ≤ the 1_000ms cadence
    expect(freshness(3_200)).toBe("LAGGING"); // 1_100ms
    expect(freshness(4_200)).toBe("STALE"); // 2_100ms
  });
});

describe("F-GOV.7 (headless-loud-failure)", () => {
  test("the ceremony is daemon/CLI-only, budget.read renders text, and zero quiet paths: every degradation branch refuses named or renders visibly", () => {
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-run", "src", "budget.ts"), "utf-8");
    expect(/from\s+"@vivim\/(omega-)?(surfaces\/|canvas|web|daemon-client)/.test(src)).toBe(false);
    expect(/\b(document|window|navigator)\s*\./.test(src)).toBe(false);
    for (const code of [GOV_BUDGET_UNDECLARED, GOV_BUDGET_SCOPE_INVALID, GOV_BUDGET_AMENDMENT_UNCITED, GOV_BUDGET_EXHAUSTED, GOV_BUDGET_EXCEEDED]) {
      expect(src.includes(code)).toBe(true);
    }
    expect(/catch\s*(\([^)]*\))?\s*\{\s*\}/.test(src)).toBe(false); // no silent swallows
    // the empty ledger degrades honestly
    const ledger = new BudgetLedger();
    expect(ledger.read(undefined, 0).rendered).toContain("0 budget(s)");
    // exhaustion renders visibly — never a quiet freeze
    ledger.declare(decl("budget:loud"));
    ledger.consume("budget:loud", "task:l", { cpuMs: 500 }, 1_000);
    const rendered = ledger.read("budget:loud", 1_000).rendered;
    expect(rendered).toContain("EXHAUSTED");
    expect(rendered).toContain("budget.read — 1 budget(s)");
  });
});
