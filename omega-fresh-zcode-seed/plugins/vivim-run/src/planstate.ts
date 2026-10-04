// vivim-run/src/planstate.ts (D-435, Ω-3.5)
// The plan registry + the derived plan.state view + stall detection.
//
// THE LAW: no silent hangs. A plan blocked on a dead realization reports
// blockedOn: liveness with an EXEC_PLAN_STALLED ledgered event, rendered
// headlessly as text (the CLI IS a surface; the canvas is a projection of the
// same rows). The registry is the honest minimal substrate: plans register
// with steps + heartbeats; everything else derives.
//
// Pure core: the op layer supplies `now`; tests inject clocks. No timers,
// no randomness, no transport — the pool and broker stay untouched.
import { createHash } from "node:crypto";

export const EXEC_PLAN_STALLED = "EXEC_PLAN_STALLED";
export const EXEC_PLAN_OPAQUE = "EXEC_PLAN_OPAQUE";

export const STALLED_SENTENCE =
  "This plan is blocked and its blocker is named: nothing progresses until the named cause clears, and the stall is a ledgered event, not a spinning cursor.";

/** Silence window after which a running step counts as liveness-blocked. */
export const STALL_SILENCE_MS = 30_000;

export type StepStatus = "pending" | "running" | "paused" | "done" | "failed" | "cancelled";
export type BlockerKind = "liveness" | "budget" | "consent" | "dependency";

export interface PlanStep {
  stepId: string;
  op: string;
  dependsOn: string[];
  status: StepStatus;
  lastProgress: number;      // epoch ms of the last heartbeat (0 = never)
  budgetMs?: number;         // declared budget (Ω-2 hookup: declared here, asserted by Ω-6.5)
  spentMs?: number;          // consumed budget so far
  awaitingConsent?: boolean; // a consent-gated step waiting on the principal
}

export interface RegisteredPlan {
  planId: string;
  principal: string;
  intentRef?: string;
  steps: PlanStep[];
  contract?: { cancellable: boolean };
  createdAt: number;
  deadlineMs?: number;       // the plan-level wall-clock deadline
}

export interface BlockedOn {
  stepId: string;
  blocker: BlockerKind;
  detail: string;
}

export interface PlanState {
  planId: string;
  principal: string;
  graph: Array<{ stepId: string; op: string; status: StepStatus; dependsOn: string[] }>;
  blockedOn: BlockedOn[];
  budgetTrace: Array<{ stepId: string; spentMs: number; budgetMs: number | null }>;
  lastProgress: number;      // the newest heartbeat in the plan
  stalled: boolean;
  state: "active" | "stalled" | "complete";
}

export interface StallEvent {
  kind: typeof EXEC_PLAN_STALLED;
  planId: string;
  stepId: string;
  blocker: BlockerKind;
  stallDeadline: number;
  at: number;
  sentence: string;
}

/** Deterministic JSON (sorted keys) — the digest foundation. */
export function canonicalJson(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(canonicalJson).join(",")}]`;
  if (v !== null && typeof v === "object") {
    return `{${Object.keys(v as Record<string, unknown>).sort().map((k) => `${JSON.stringify(k)}:${canonicalJson((v as Record<string, unknown>)[k])}`).join(",")}}`;
  }
  return JSON.stringify(v) ?? "null";
}

export function sha256Hex(s: string): string {
  return createHash("sha256").update(s, "utf-8").digest("hex");
}

/**
 * The plan registry: register, heartbeat, derive. The in-plugin minimal
 * substrate (as-built: the pool's tasks are not yet plan-shaped; this registry
 * is where plan-shaped execution begins, and run.submit grows into it).
 */
export class PlanRegistry {
  private plans = new Map<string, RegisteredPlan>();

  register(plan: RegisteredPlan): void {
    if (typeof plan.planId !== "string" || plan.planId.length === 0) throw new Error("planstate: planId must be a non-empty string");
    if (!Array.isArray(plan.steps) || plan.steps.length === 0) throw new Error(`planstate: plan ${plan.planId} needs at least one step`);
    if (this.plans.has(plan.planId)) throw new Error(`planstate: plan ${plan.planId} already registered (EXEC_PLAN_OPAQUE refuses silent re-registration)`);
    this.plans.set(plan.planId, { ...plan, steps: plan.steps.map((s) => ({ ...s })) });
  }

  heartbeat(planId: string, stepId: string, at: number): void {
    const plan = this.plans.get(planId);
    if (!plan) throw new Error(`${EXEC_PLAN_OPAQUE}: plan ${planId} is not registered — inspect refuses to guess (D-435)`);
    const step = plan.steps.find((s) => s.stepId === stepId);
    if (!step) throw new Error(`${EXEC_PLAN_OPAQUE}: plan ${planId} has no step ${stepId} (D-435)`);
    step.lastProgress = at;
  }

  setStatus(planId: string, stepId: string, status: StepStatus, at: number): void {
    const plan = this.plans.get(planId);
    if (!plan) throw new Error(`${EXEC_PLAN_OPAQUE}: plan ${planId} is not registered (D-435)`);
    const step = plan.steps.find((s) => s.stepId === stepId);
    if (!step) throw new Error(`${EXEC_PLAN_OPAQUE}: plan ${planId} has no step ${stepId} (D-435)`);
    step.status = status;
    if (status === "running" || status === "done" || status === "failed") step.lastProgress = at;
  }

  spend(planId: string, stepId: string, ms: number): void {
    const plan = this.plans.get(planId);
    if (!plan) throw new Error(`${EXEC_PLAN_OPAQUE}: plan ${planId} is not registered (D-435)`);
    const step = plan.steps.find((s) => s.stepId === stepId);
    if (!step) throw new Error(`${EXEC_PLAN_OPAQUE}: plan ${planId} has no step ${stepId} (D-435)`);
    step.spentMs = (step.spentMs ?? 0) + ms;
  }

  get(planId: string): RegisteredPlan | null {
    return this.plans.get(planId) ?? null;
  }

  list(): string[] {
    return [...this.plans.keys()].sort();
  }

  /** THE derived view: graph + blockers + budget trace + last progress. Pure over `now`. */
  stateOf(planId: string, now: number): PlanState {
    const plan = this.plans.get(planId);
    if (!plan) throw new Error(`${EXEC_PLAN_OPAQUE}: plan ${planId} is not registered — what is not registered cannot be inspected, and guessing is refused (D-435)`);
    const blockedOn: BlockedOn[] = [];
    const done = new Set(plan.steps.filter((s) => s.status === "done" || s.status === "failed" || s.status === "cancelled").map((s) => s.stepId));
    for (const s of plan.steps) {
      if (s.status !== "pending" && s.status !== "running" && s.status !== "paused") continue;
      if (s.awaitingConsent === true) {
        blockedOn.push({ stepId: s.stepId, blocker: "consent", detail: "waiting on the principal's consent (the gate did not clear)" });
        continue;
      }
      if (s.status === "pending") {
        const missing = s.dependsOn.filter((d) => !done.has(d));
        if (missing.length > 0) {
          blockedOn.push({ stepId: s.stepId, blocker: "dependency", detail: `depends on ${missing.join(", ")} (not done)` });
          continue;
        }
      }
      if (s.status === "running") {
        const silence = now - s.lastProgress;
        if (s.lastProgress > 0 && silence > STALL_SILENCE_MS) {
          blockedOn.push({ stepId: s.stepId, blocker: "liveness", detail: `no heartbeat for ${Math.round(silence / 1000)}s (threshold ${STALL_SILENCE_MS / 1000}s) — the realization is presumed dead` });
          continue;
        }
      }
      if (s.budgetMs !== undefined && (s.spentMs ?? 0) >= s.budgetMs && s.status !== "done") {
        blockedOn.push({ stepId: s.stepId, blocker: "budget", detail: `spent ${s.spentMs}ms of ${s.budgetMs}ms budget — the budget ledger owns the verdict` });
      }
    }
    const lastProgress = plan.steps.reduce((acc, s) => Math.max(acc, s.lastProgress), 0);
    const stalled = blockedOn.some((b) => b.blocker === "liveness")
      || (plan.deadlineMs !== undefined && now > plan.deadlineMs && plan.steps.some((s) => s.status === "running" || s.status === "pending"));
    const complete = plan.steps.every((s) => s.status === "done" || s.status === "failed" || s.status === "cancelled");
    return {
      planId: plan.planId,
      principal: plan.principal,
      graph: plan.steps.map((s) => ({ stepId: s.stepId, op: s.op, status: s.status, dependsOn: [...s.dependsOn] })),
      blockedOn,
      budgetTrace: plan.steps.map((s) => ({ stepId: s.stepId, spentMs: s.spentMs ?? 0, budgetMs: s.budgetMs ?? null })),
      lastProgress,
      stalled,
      state: complete ? "complete" : stalled ? "stalled" : "active",
    };
  }

  /** The stall sweep: ledgered EXEC_PLAN_STALLED events for every liveness-blocked
   *  step and every blown plan deadline. Pure over `now`. */
  stallCheck(now: number): StallEvent[] {
    const events: StallEvent[] = [];
    for (const planId of this.list()) {
      const state = this.stateOf(planId, now);
      for (const b of state.blockedOn) {
        if (b.blocker !== "liveness") continue;
        events.push({
          kind: EXEC_PLAN_STALLED, planId, stepId: b.stepId, blocker: b.blocker,
          stallDeadline: now, at: now,
          sentence: `${EXEC_PLAN_STALLED}: ${STALLED_SENTENCE} (plan ${planId} step ${b.stepId}: ${b.detail}) (D-435, Ω-3.5)`,
        });
      }
      const plan = this.plans.get(planId)!;
      if (plan.deadlineMs !== undefined && now > plan.deadlineMs && state.state !== "complete") {
        events.push({
          kind: EXEC_PLAN_STALLED, planId, stepId: "(plan)", blocker: "budget",
          stallDeadline: plan.deadlineMs, at: now,
          sentence: `${EXEC_PLAN_STALLED}: ${STALLED_SENTENCE} (plan ${planId} blew its wall-clock deadline ${plan.deadlineMs} — ${now - plan.deadlineMs}ms over) (D-435, Ω-3.5)`,
        });
      }
    }
    return events;
  }
}

/** The headless rendering: `omega:exec ps` in text. The CLI and the canvas read
 *  the SAME rows — surface parity by shared substrate, not by sync ceremonies. */
export function renderPlanState(state: PlanState): string {
  const lines: string[] = [];
  lines.push(`plan ${state.planId} [${state.principal}] — ${state.state}`);
  for (const g of state.graph) {
    lines.push(`  ${g.status.padEnd(9)} ${g.stepId} (${g.op})${g.dependsOn.length > 0 ? ` ← ${g.dependsOn.join(",")}` : ""}`);
  }
  if (state.blockedOn.length > 0) {
    lines.push("  blocked on:");
    for (const b of state.blockedOn) lines.push(`    [${b.blocker}] ${b.stepId}: ${b.detail}`);
  } else {
    lines.push("  blocked on: (nothing)");
  }
  for (const t of state.budgetTrace) {
    if (t.budgetMs !== null) lines.push(`  budget ${t.stepId}: ${t.spentMs}/${t.budgetMs}ms`);
  }
  lines.push(`  last progress: ${state.lastProgress === 0 ? "(never)" : String(state.lastProgress)}`);
  return lines.join("\n");
}
