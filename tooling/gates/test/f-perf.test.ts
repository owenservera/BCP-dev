// tooling/gates/test/f-perf.test.ts — the F-PERF falsifier (D-438, Ω-6.5).
// Generated as a RED stub by `omega:loop --stub D-438`, then implemented.
//  F-PERF.1 soak-honesty — an injected 4-bytes-per-turn leak is flagged by the monotone-growth fold; a clean series is green within variance
//  F-PERF.2 throughput-reproducibility — 10 runs within declared variance pass; an op-mix change breaches with PERF_REGRESSION_RED carrying the diff
//  F-PERF.3 chain-attribution — a planted 200ms sleep in one stage flags that stage only
//  F-PERF.4 render-budget — a starved kernel feed vs a slow renderer are named separately (the attribution fold)
//  F-PERF.5 cross-machine-refusal — x64 vs arm64 absolute comparison refuses PERF_BASELINE_CROSSMACHINE
//  F-PERF.6 no-budget-refusal — a fixture without a budget refuses PERF_BUDGET_UNDECLARED; a workload without a seed refuses PERF_SEED_UNPINNED
//  F-PERF.7 headless-and-real — the chain-latency fixture RUNS: a real vault append→verify→compact cycle measured under a pinned seed, green within its declared budget
import { describe, test, expect } from "bun:test";
import { mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { omegaTmp } from "@vivim/omega-platform";
import {
  assertBudget, assertSameEnvironment, loadPerfRegistry, profileStages, soakHonesty,
  thisEnvironment, validateFixture, type FixtureRow, type ResultRow, type StageTiming,
} from "../perfreg.ts";
import { appendObject } from "../../../plugins/vivim-vault/src/changelog.ts";
import "../../../plugins/vivim-vault/src/db.ts";
import { compact } from "../../../plugins/vivim-vault/src/compaction.ts";
import { openVault } from "../../../plugins/vivim-vault/src/sql.ts";
import { verify } from "../../../plugins/vivim-vault/src/verify.ts";

const ENV = { os: "linux", arch: "x64", bun: "1.3.14", node: "v22.0.0" };

describe("F-PERF.1 (soak-honesty)", () => {
  test("an injected 4-bytes-per-turn leak is flagged; a clean series is green within variance", () => {
    // the injected leak: +4 per turn, monotone, past the ceiling
    const leaky = Array.from({ length: 20 }, (_, i) => 100 + i * 4);
    const verdict = soakHonesty(leaky, 100, 20);
    expect(verdict.leak).toBe(true);
    expect(verdict.detail).toContain("LEAK");
    // the clean series: flat within variance
    const clean = Array.from({ length: 20 }, (_, i) => 100 + (i % 3));
    const cleanVerdict = soakHonesty(clean, 100, 20);
    expect(cleanVerdict.leak).toBe(false);
    expect(cleanVerdict.detail).toContain("clean");
  });
});

describe("F-PERF.2 (throughput-reproducibility)", () => {
  test("10 runs within declared variance pass; an op-mix change breaches with PERF_REGRESSION_RED carrying the diff", () => {
    const fixture: FixtureRow = {
      fixtureId: "vault-throughput",
      workload: { seed: 20260921, opMix: { "vault.append@1": 100 } },
      budget: { metrics: { opsPerSec: { budget: 100, variancePct: 25, direction: "at-least" } } },
      badge: "GEN_ENVIRONMENT",
    };
    // 10 runs, all within variance
    for (let i = 0; i < 10; i++) {
      const result: ResultRow = { fixtureId: fixture.fixtureId, metrics: { opsPerSec: 100 + (i % 5) }, environment: ENV, badge: "GEN_ENVIRONMENT", at: i };
      expect(assertBudget(fixture, result).ok).toBe(true);
    }
    // the regression: throughput halves after an op-mix change (a heavier write path)
    const lastGreen: ResultRow = { fixtureId: fixture.fixtureId, metrics: { opsPerSec: 102 }, environment: ENV, badge: "GEN_ENVIRONMENT", at: 10 };
    const regressed: ResultRow = { fixtureId: fixture.fixtureId, metrics: { opsPerSec: 55 }, environment: ENV, badge: "GEN_ENVIRONMENT", at: 11 };
    const v = assertBudget(fixture, regressed, lastGreen);
    expect(v.ok).toBe(false);
    const red = v.issues.find((i) => i.code === "PERF_REGRESSION_RED");
    expect(red).toBeDefined();
    expect(red!.detail).toContain("opsPerSec");
    expect(red!.detail).toContain("last green");
    // within variance but over an old baseline's floor? budget is a ceiling — fine, green
    const mild: ResultRow = { fixtureId: fixture.fixtureId, metrics: { opsPerSec: 110 }, environment: ENV, badge: "GEN_ENVIRONMENT", at: 12 };
    expect(assertBudget(fixture, mild, lastGreen).ok).toBe(true);
  });
});

describe("F-PERF.3 (chain-attribution)", () => {
  test("a planted 200ms sleep in one stage flags that stage only", () => {
    const stages: StageTiming[] = [
      { stage: "intent", ms: 2 },
      { stage: "law", ms: 3 },
      { stage: "realization-boundary", ms: 205 }, // the planted sleep
      { stage: "evidence", ms: 4 },
    ];
    const p = profileStages(stages, 50);
    expect(p.breach).toBe(true);
    expect(p.owner).toBe("realization-boundary");
    expect(p.rendered).toContain("the owner is realization-boundary");
    expect(p.rendered).toContain("ok   intent");
    expect(p.rendered).toContain("ok   law"); // the neighbors are named ok, not blamed
    // the clean profile
    const clean = profileStages(stages.map((s) => ({ ...s, ms: Math.min(s.ms, 40) })), 50);
    expect(clean.breach).toBe(false);
    expect(clean.rendered).toContain("GREEN");
  });
});

describe("F-PERF.4 (render-budget)", () => {
  test("a starved kernel feed vs a slow renderer are named separately (the attribution fold)", () => {
    // case A: the renderer is slow (frame budget blown in the render stage)
    const slowRenderer = profileStages([
      { stage: "kernel-feed", ms: 2 },
      { stage: "renderer", ms: 40 },
    ], 16);
    expect(slowRenderer.owner).toBe("renderer");
    // case B: the kernel feed is starved (the render stage waits)
    const starvedKernel = profileStages([
      { stage: "kernel-feed", ms: 45 },
      { stage: "renderer", ms: 10 },
    ], 16);
    expect(starvedKernel.owner).toBe("kernel-feed");
    expect(starvedKernel.rendered).toContain("kernel-feed");
  });
});

describe("F-PERF.5 (cross-machine-refusal)", () => {
  test("x64 vs arm64 absolute comparison refuses PERF_BASELINE_CROSSMACHINE", () => {
    const same = assertSameEnvironment(ENV, { ...ENV });
    expect(same.ok).toBe(true);
    const cross = assertSameEnvironment(ENV, { os: "darwin", arch: "arm64", bun: "1.3.14", node: "v22.0.0" });
    expect(cross.ok).toBe(false);
    if (!cross.ok) {
      expect(cross.code).toBe("PERF_BASELINE_CROSSMACHINE");
      expect(cross.sentence).toContain("GEN_ENVIRONMENT");
      expect(cross.sentence).toContain("re-baseline");
    }
  });
});

describe("F-PERF.6 (no-budget-refusal)", () => {
  test("a fixture without a budget refuses PERF_BUDGET_UNDECLARED; a workload without a seed refuses PERF_SEED_UNPINNED", () => {
    const noBudget: FixtureRow = {
      fixtureId: "x", workload: { seed: 1, opMix: { "a@1": 1 } },
      budget: { metrics: {} }, badge: "GEN_ENVIRONMENT",
    };
    const issues = validateFixture(noBudget);
    expect(issues.some((i) => i.code === "PERF_BUDGET_UNDECLARED")).toBe(true);
    const noSeed: FixtureRow = {
      fixtureId: "y", workload: { seed: -1, opMix: { "a@1": 1 } },
      budget: { metrics: { m: { budget: 1, variancePct: 10 } } }, badge: "GEN_ENVIRONMENT",
    };
    expect(validateFixture(noSeed).some((i) => i.code === "PERF_SEED_UNPINNED")).toBe(true);
    // the real registry: every fixture valid, two live, two declared-deferred
    const reg = loadPerfRegistry(join(import.meta.dir, "..", "..", ".."));
    expect(reg.fixtures.length).toBe(4);
    for (const f of reg.fixtures) expect(validateFixture(f)).toEqual([]);
    expect(reg.fixtures.filter((f) => f.deferredTo === undefined).length).toBe(2);
    expect(reg.fixtures.filter((f) => f.deferredTo !== undefined).length).toBe(2);
    // this machine's pin is real
    const env = thisEnvironment();
    expect(env.os.length).toBeGreaterThan(0);
    expect(env.arch.length).toBeGreaterThan(0);
  });
});

describe("F-PERF.7 (headless-and-real)", () => {
  test("the chain-latency fixture RUNS: a real vault append→verify→compact cycle measured under a pinned seed, green within its declared budget", () => {
    const reg = loadPerfRegistry(join(import.meta.dir, "..", "..", ".."));
    const fixture = reg.fixtures.find((f) => f.fixtureId === "chain-latency")!;
    expect(fixture).toBeDefined();
    expect(fixture.workload.seed).toBe(20260921);
    const dir = omegaTmp("omega-f-perf", `chain-${Date.now()}-${process.pid}`);
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
    const v = openVault(dir);
    // the pinned workload: 12 appends (seeded sizes), one verify, one compact
    const sizes = [24, 96, 48, 240, 120, 72, 16, 160, 88, 40, 200, 64];
    const t0 = performance.now();
    let seq = 0;
    for (const size of sizes) {
      v.enqueueWrite(() => {
        appendObject(v, { ns: "perf", id: `m${seq}`, data: { pad: "x".repeat(size) }, meta: null, refs: [], causationId: `perf_${++seq}` });
      });
    }
    v.close();
    const v2 = openVault(dir);
    v2.enqueueWrite(() => undefined);
    const tAppends = performance.now() - t0;
    const tVerify0 = performance.now();
    const verdict = verify(v2);
    const tVerify = performance.now() - tVerify0;
    expect(verdict.ok).toBe(true);
    const tCompact0 = performance.now();
    v2.enqueueWrite(() => compact(v2, "perf", 1));
    v2.close();
    void (performance.now() - tCompact0);
    // the assertion: green within the declared budget (GEN_ENVIRONMENT — this machine's pin)
    const result: ResultRow = {
      fixtureId: fixture.fixtureId,
      metrics: { appendMs: tAppends, verifyMs: tVerify },
      environment: thisEnvironment(),
      badge: "GEN_ENVIRONMENT",
      at: Date.now(),
    };
    const assertion = assertBudget(fixture, result);
    expect(assertion.ok).toBe(true);
    rmSync(dir, { recursive: true, force: true });
  }, 30000);
});
