// vivim-run/src/intervene.ts (D-435, Ω-3.5)
// The four intervention verbs as law-gated, ledgered ops — and the break-glass scar.
//
// THE LAW: no out-of-band kill switch. pause/resume/step/cancel run THROUGH
// the gate (every verb produces a ledger row); an ungated intervention is
// EXEC_INTERVENE_UNGATED, refused; a cancel forbidden by the plan's contract
// is EXEC_CANCEL_FORBIDDEN_BY_CONTRACT; cancel is EXTERNAL_MUTATION (it
// unschedules work the principal asked for — the outside-world touch).
// The OS break-glass (killing the compartment from outside) WORKS but SCARS:
// EXEC_BREAKGLASS_EMPLOYED, ledgered loudly, because a scar is the honest
// record of an action the law did not gate.
//
// Pure core: the op layer supplies `now` and the vault; tests inject callers.
import { EXEC_PLAN_OPAQUE, PlanRegistry, type StepStatus } from "./planstate.ts";

export const EXEC_INTERVENE_UNGATED = "EXEC_INTERVENE_UNGATED";
export const EXEC_CANCEL_FORBIDDEN_BY_CONTRACT = "EXEC_CANCEL_FORBIDDEN_BY_CONTRACT";
export const EXEC_BREAKGLASS_EMPLOYED = "EXEC_BREAKGLASS_EMPLOYED";

export const UNGATED_SENTENCE =
  "An intervention was attempted outside the law gate; interventions are ledgered ops or they are not interventions, and this one is refused.";

export type Verb = "pause" | "resume" | "step" | "cancel";

export interface InterveneCaller {
  gated: boolean;   // did the call arrive through the law gate?
  from: string;     // the authenticated caller
}

export interface InterventionRow {
  kind: "exec.intervene@1";
  planId: string;
  verb: Verb;
  by: string;
  at: number;
  risk: "MUTATION" | "EXTERNAL_MUTATION"; // cancel is EXTERNAL_MUTATION
  ledgered: true;
}

export type InterveneOutcome =
  | { ok: true; row: InterventionRow }
  | { ok: false; code: string; sentence: string };

/**
 * THE intervention (D-435). Every verb is a ledgered row; the ungated path
 * refuses; the contract decides cancel. Pure over (registry, caller, now).
 */
export function intervene(
  registry: PlanRegistry,
  planId: string,
  verb: Verb,
  caller: InterveneCaller,
  now: number,
  stepId?: string,
): InterveneOutcome {
  if (!caller.gated) {
    return {
      ok: false,
      code: EXEC_INTERVENE_UNGATED,
      sentence: `${EXEC_INTERVENE_UNGATED}: ${UNGATED_SENTENCE} (caller ${caller.from}, verb ${verb}) (D-435, Ω-3.5)`,
    };
  }
  const plan = registry.get(planId);
  if (!plan) {
    return {
      ok: false,
      code: EXEC_PLAN_OPAQUE,
      sentence: `${EXEC_PLAN_OPAQUE}: plan ${planId} is not registered — intervening on nothing is refused (D-435)`,
    };
  }
  if (verb === "cancel") {
    if (plan.contract?.cancellable === false) {
      return {
        ok: false,
        code: EXEC_CANCEL_FORBIDDEN_BY_CONTRACT,
        sentence: `${EXEC_CANCEL_FORBIDDEN_BY_CONTRACT}: plan ${planId}'s contract declares it non-cancellable (an immutable run); the principal amends the contract, the intervention does not smuggle past it (D-435, Ω-3.5)`,
      };
    }
    for (const s of plan.steps) {
      if (s.status === "running" || s.status === "pending" || s.status === "paused") registry.setStatus(planId, s.stepId, "cancelled", now);
    }
    return {
      ok: true,
      row: { kind: "exec.intervene@1", planId, verb, by: caller.from, at: now, risk: "EXTERNAL_MUTATION", ledgered: true },
    };
  }
  const target = stepId ?? plan.steps.find((s) => s.status === "running" || s.status === "pending" || s.status === "paused")?.stepId;
  if (target === undefined) {
    return {
      ok: false,
      code: EXEC_PLAN_OPAQUE,
      sentence: `${EXEC_PLAN_OPAQUE}: plan ${planId} has no interruptible step to ${verb} (D-435)`,
    };
  }
  const status: Record<Exclude<Verb, "cancel">, StepStatus> = { pause: "paused", resume: "running", step: "running" };
  registry.setStatus(planId, target, status[verb], now);
  if (verb === "resume" || verb === "step") registry.heartbeat(planId, target, now);
  return {
    ok: true,
    row: { kind: "exec.intervene@1", planId, verb, by: caller.from, at: now, risk: "MUTATION", ledgered: true },
  };
}

export interface BreakGlassRow {
  kind: "exec.breakglass@1";
  code: typeof EXEC_BREAKGLASS_EMPLOYED;
  planId: string;
  at: number;
  sentence: string;
}

/** The OS break-glass scar: the kill happened outside the verbs — ledgered
 *  loudly, never silent. The registry marks everything cancelled. */
export function breakGlass(registry: PlanRegistry, planId: string, now: number): BreakGlassRow {
  const plan = registry.get(planId);
  if (plan) {
    for (const s of plan.steps) {
      if (s.status === "running" || s.status === "pending" || s.status === "paused") registry.setStatus(planId, s.stepId, "cancelled", now);
    }
  }
  return {
    kind: "exec.breakglass@1",
    code: EXEC_BREAKGLASS_EMPLOYED,
    planId,
    at: now,
    sentence: `${EXEC_BREAKGLASS_EMPLOYED}: the OS killed plan ${planId} outside the intervention verbs — the break-glass was employed, and the scar is the record (D-435, Ω-3.5)`,
  };
}
