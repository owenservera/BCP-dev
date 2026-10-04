// tooling/gates/perfreg.ts — D-438 (Ω-6.5, spec D-440): the perf discipline.
//
// Budgets become evidence: fixtures are pinned workloads with declared
// budgets and variance; results are environment-pinned rows; breaches carry
// the last-green diff; leaks are monotone growth beyond variance; stage
// attribution names the owner of a regression.
//
// Pure core: measurements arrive as numbers; the two live fixtures measure
// real vault cycles in the falsifier (the discipline layer, over tooling/bench).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const PERF_BUDGET_UNDECLARED = "PERF_BUDGET_UNDECLARED";
export const PERF_SEED_UNPINNED = "PERF_SEED_UNPINNED";
export const PERF_VARIANCE_BREACHED = "PERF_VARIANCE_BREACHED";
export const PERF_BASELINE_CROSSMACHINE = "PERF_BASELINE_CROSSMACHINE";
export const PERF_REGRESSION_RED = "PERF_REGRESSION_RED";

/** Machine-dependent results wear this badge — never compared cross-machine as absolutes. */
export const GEN_ENVIRONMENT = "GEN_ENVIRONMENT";

export interface WorkloadSpec {
  seed: number;              // the pinned PRNG seed — unpinned workloads refuse
  opMix: Record<string, number>; // op → weight (the declared mix; a changed mix is a different fixture)
  thinkTimeMs?: number;
}

export interface BudgetSpec {
  /** metric → budget + allowed variance + direction: "at-most" (latency: lower is better) or "at-least" (throughput: higher is better). */
  metrics: Record<string, { budget: number; variancePct: number; direction: "at-most" | "at-least" }>;
}

export interface FixtureRow {
  fixtureId: string;
  workload: WorkloadSpec;
  budget: BudgetSpec;
  badge: "GEN_ENVIRONMENT" | "GEN_DETERMINISTIC";
  deferredTo?: string;       // the wave that owns the runtime this fixture needs (registered-and-honest)
}

export interface EnvironmentPin {
  os: string;
  arch: string;
  bun: string;
  node: string;
}

export interface ResultRow {
  fixtureId: string;
  metrics: Record<string, number>;
  environment: EnvironmentPin;
  badge: string;
  at: number;
}

export interface AssertionIssue {
  code: string;
  fixtureId: string;
  detail: string;
}

export interface BudgetVerdict {
  ok: boolean;
  issues: AssertionIssue[];
}

/** Validate a fixture row (the discipline door): no budget, no seed, no fixture. */
export function validateFixture(f: FixtureRow): AssertionIssue[] {
  const issues: AssertionIssue[] = [];
  if (Object.keys(f.budget.metrics).length === 0) {
    issues.push({ code: PERF_BUDGET_UNDECLARED, fixtureId: f.fixtureId, detail: `${PERF_BUDGET_UNDECLARED}: fixture ${f.fixtureId} declares no budget — a workload without a budget is a demo, not a fixture` });
  }
  if (!Number.isInteger(f.workload.seed) || f.workload.seed < 0) {
    issues.push({ code: PERF_SEED_UNPINNED, fixtureId: f.fixtureId, detail: `${PERF_SEED_UNPINNED}: fixture ${f.fixtureId}'s workload has no pinned integer seed — an unpinned workload is a different test every run` });
  }
  if (Object.keys(f.workload.opMix).length === 0) {
    issues.push({ code: PERF_BUDGET_UNDECLARED, fixtureId: f.fixtureId, detail: `${PERF_BUDGET_UNDECLARED}: fixture ${f.fixtureId} declares an empty op-mix — nothing to measure` });
  }
  return issues;
}

/**
 * THE budget assertion (D-438): every declared metric within its directional
 * bound — "at-most" metrics (latency, memory) pass under budget × (1 +
 * variance/100); "at-least" metrics (throughput) pass over budget × (1 −
 * variance/100). A breach is PERF_VARIANCE_BREACHED, and against a
 * last-green baseline it is PERF_REGRESSION_RED carrying the diff.
 */
export function assertBudget(
  fixture: FixtureRow,
  result: ResultRow,
  lastGreen?: ResultRow,
): BudgetVerdict {
  const issues: AssertionIssue[] = [];
  issues.push(...validateFixture(fixture));
  for (const [metric, spec] of Object.entries(fixture.budget.metrics).sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
    const value = result.metrics[metric];
    if (value === undefined) {
      issues.push({ code: PERF_VARIANCE_BREACHED, fixtureId: fixture.fixtureId, detail: `${PERF_VARIANCE_BREACHED}: ${fixture.fixtureId} declares budget for ${metric} but the result row does not measure it` });
      continue;
    }
    const direction = spec.direction ?? "at-most";
    const ceiling = spec.budget * (1 + spec.variancePct / 100);
    const floor = spec.budget * (1 - spec.variancePct / 100);
    const breached = direction === "at-most" ? value > ceiling : value < floor;
    if (breached) {
      const base = lastGreen?.metrics[metric];
      if (base !== undefined) {
        const over = direction === "at-most" ? ((value - base) / base) * 100 : ((base - value) / base) * 100;
        issues.push({
          code: PERF_REGRESSION_RED, fixtureId: fixture.fixtureId,
          detail: `${PERF_REGRESSION_RED}: ${fixture.fixtureId}.${metric} = ${value.toFixed(2)} breaches the ${direction === "at-most" ? "ceiling" : "floor"} ${(direction === "at-most" ? ceiling : floor).toFixed(2)} (budget ${spec.budget}, ${direction}, ±${spec.variancePct}% variance) — ${Math.abs(over).toFixed(1)}% ${over >= 0 ? "worse" : "different"} than the last green (${base.toFixed(2)}); the diff names the metric and the baseline`,
        });
      } else {
        issues.push({
          code: PERF_VARIANCE_BREACHED, fixtureId: fixture.fixtureId,
          detail: `${PERF_VARIANCE_BREACHED}: ${fixture.fixtureId}.${metric} = ${value.toFixed(2)} breaches the ${direction === "at-most" ? "ceiling" : "floor"} ${(direction === "at-most" ? ceiling : floor).toFixed(2)} (budget ${spec.budget}, ${direction}, ±${spec.variancePct}% variance)`,
        });
      }
    }
  }
  return { ok: issues.length === 0, issues };
}

/** Environment pins must match — absolute cross-machine comparison refuses. */
export function assertSameEnvironment(a: EnvironmentPin, b: EnvironmentPin): { ok: true } | { ok: false; code: typeof PERF_BASELINE_CROSSMACHINE; sentence: string } {
  if (a.os === b.os && a.arch === b.arch && a.bun === b.bun) return { ok: true };
  return {
    ok: false, code: PERF_BASELINE_CROSSMACHINE,
    sentence: `${PERF_BASELINE_CROSSMACHINE}: refusing to compare absolutes across environments (${a.os}/${a.arch}/bun${a.bun} vs ${b.os}/${b.arch}/bun${b.bun}) — machine-dependent metrics wear GEN_ENVIRONMENT; re-baseline on the comparing machine`,
  };
}

/**
 * THE leak detector (the soak honesty fold): a measurement series whose
 * growth is monotone and beyond variance is a leak; a flat series is clean.
 * Pure over the series + the declared per-step budget.
 */
export function soakHonesty(
  series: readonly number[],
  perStepBudget: number,
  variancePct: number,
): { leak: boolean; detail: string } {
  if (series.length < 3) return { leak: false, detail: "series too short to judge — the soak fold needs at least 3 samples" };
  const ceiling = perStepBudget * (1 + variancePct / 100);
  let monotoneOver = 0;
  for (let i = 1; i < series.length; i++) {
    if (series[i]! > series[i - 1]!) monotoneOver++;
  }
  const growth = series[series.length - 1]! - series[0]!;
  const leak = monotoneOver === series.length - 1 && series[series.length - 1]! > ceiling;
  return {
    leak,
    detail: leak
      ? `LEAK: the series grows monotonically (${monotoneOver}/${series.length - 1} steps up, +${growth.toFixed(1)} total) past the ceiling ${ceiling.toFixed(1)} — a flat-within-variance soak is green, a monotone climb is a leak`
      : `clean: the series stays within ${ceiling.toFixed(1)} (last ${series[series.length - 1]!.toFixed(1)}, growth ${growth >= 0 ? "+" : ""}${growth.toFixed(1)} over ${series.length} samples)`,
  };
}

/**
 * THE stage profiler (the attribution fold): per-stage timings → the stage
 * that owns a breach, named alone. A planted 200ms sleep in one stage flags
 * that stage, not its neighbors.
 */
export interface StageTiming { stage: string; ms: number }

export function profileStages(
  stages: readonly StageTiming[],
  budgetPerStageMs: number,
): { breach: boolean; owner: string | null; rendered: string } {
  const over = stages.filter((s) => s.ms > budgetPerStageMs).sort((a, b) => b.ms - a.ms);
  const lines = stages.map((s) => `  ${s.ms > budgetPerStageMs ? "OVER" : "ok  "} ${s.stage}: ${s.ms.toFixed(1)}ms (budget ${budgetPerStageMs}ms)`);
  if (over.length === 0) {
    return { breach: false, owner: null, rendered: [`profile: GREEN — every stage within ${budgetPerStageMs}ms`, ...lines].join("\n") };
  }
  const owner = over[0]!;
  return {
    breach: true, owner: owner.stage,
    rendered: [
      `profile: RED — ${over.length} stage(s) over budget; the owner is ${owner.stage} (${owner.ms.toFixed(1)}ms, ${(owner.ms / budgetPerStageMs).toFixed(1)}× budget)`,
      ...lines,
    ].join("\n"),
  };
}

// ---- the registry (build/perf/fixtures.json — regenerable evidence) ----------

export interface PerfRegistry {
  fixtures: FixtureRow[];
}

export function loadPerfRegistry(root: string): PerfRegistry {
  const p = join(root, "build", "perf", "fixtures.json");
  if (!existsSync(p)) return { fixtures: [] };
  try {
    const parsed = JSON.parse(readFileSync(p, "utf-8")) as { fixtures?: unknown };
    return { fixtures: Array.isArray(parsed.fixtures) ? parsed.fixtures as FixtureRow[] : [] };
  } catch {
    return { fixtures: [] };
  }
}

export function saveResultRow(root: string, row: ResultRow): string {
  const dir = join(root, "build", "perf", "results");
  mkdirSync(dir, { recursive: true });
  const p = join(dir, `${row.fixtureId}.latest.json`);
  writeFileSync(p, JSON.stringify(row, null, 2) + "\n");
  return p;
}

/** The environment pin of THIS machine (the row every local result carries). */
export function thisEnvironment(): EnvironmentPin {
  return {
    os: process.platform,
    arch: process.arch,
    bun: (globalThis as { Bun?: { version?: string } }).Bun?.version ?? "unknown",
    node: process.version,
  };
}
