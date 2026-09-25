// @vivim/omega-contracts — work.ts
// Deterministic-first durable Work vocabulary.
// Work is the canonical execution subject; workers and process runs are not.

import type { VaultProvenanceRef } from "./vocabulary.ts";

export const WORK_NS = "work";

export type WorkState =
  | "draft"
  | "validating"
  | "waiting_authority"
  | "queued"
  | "running"
  | "waiting_resource"
  | "waiting_external"
  | "waiting_human"
  | "retry_wait"
  | "reconciling"
  | "verifying"
  | "succeeded"
  | "failed"
  | "refused"
  | "cancelled"
  | "reviewed";

export type StepState =
  | "pending"
  | "running"
  | "succeeded"
  | "failed"
  | "skipped"
  | "waiting";

export type AttemptState =
  | "started"
  | "succeeded"
  | "failed"
  | "unknown_effect"
  | "reconciling"
  | "cancelled";

export type WaitKind =
  | "resource"
  | "external"
  | "human"
  | "retry"
  | "timer"
  | "dependency";

export type GateKind = "approval" | "input" | "selection" | "question";
export type GateState = "pending" | "approved" | "denied" | "expired" | "resolved";

export interface WorkBudget {
  deadlineAt?: number;
  maxAttempts?: number;
  maxCapabilityCalls?: number;
  maxArtifactBytes?: number;
}

export interface StepVerification {
  kind:
    | "none"
    | "output_present"
    | "state_changed"
    | "artifact_exists"
    | "custom";
  value?: string;
}

export interface WorkStep {
  stepId: string;
  capability: string;
  input: Record<string, unknown>;
  dependsOn: string[];
  sideEffecting: boolean;
  verification: StepVerification;
  /** Stable semantic effect identity. Required for side-effecting work unless
   * the concrete execution supplies the same stable effectId at attempt start. */
  effectKey?: string;
  state: StepState;
}

export interface WorkPlan {
  planId: string;
  version: string;
  objective: string;
  steps: WorkStep[];
  createdBy: string;
  createdAt: number;
}

export interface WorkPlanRef {
  planId: string;
  version: string;
  rev: number;
}

export interface WorkWait {
  kind: WaitKind;
  reason: string;
  resumeAfter?: number;
  gateRef?: CanonicalWorkRef;
  dependencyRef?: CanonicalWorkRef;
}

export interface CanonicalWorkRef {
  ns: string;
  id: string;
  rev?: number;
}

export interface WorkRecord {
  workId: string;
  requestedBy: string;
  objective: string;
  planRef: WorkPlanRef;
  state: WorkState;
  currentStepId?: string;
  currentAttemptId?: string;
  wait?: WorkWait;
  budget?: WorkBudget;
  parentWorkRef?: CanonicalWorkRef;
  result?: unknown;
  failure?: { code: string; detail: string };
  evidence: VaultProvenanceRef[];
  createdAt: number;
  updatedAt: number;
}

export interface WorkAttempt {
  attemptId: string;
  workId: string;
  stepId: string;
  attemptNumber: number;
  effectId?: string;
  state: AttemptState;
  startedAt: number;
  finishedAt?: number;
  workerRef?: string;
  leaseRef?: string;
  result?: unknown;
  failure?: { code: string; detail: string };
  evidence: VaultProvenanceRef[];
}

export interface WorkGate {
  gateId: string;
  workId: string;
  stepId?: string;
  kind: GateKind;
  state: GateState;
  prompt: string;
  options?: string[];
  response?: string;
  resolvedBy?: string;
  createdAt: number;
  expiresAt?: number;
}

export const TERMINAL_WORK_STATES: ReadonlySet<WorkState> = new Set([
  "succeeded", "failed", "refused", "cancelled", "reviewed",
]);

const TRANSITIONS: Record<WorkState, readonly WorkState[]> = {
  draft: ["validating", "cancelled"],
  validating: ["waiting_authority", "queued", "refused", "failed", "cancelled"],
  waiting_authority: ["queued", "refused", "cancelled"],
  queued: ["running", "cancelled", "refused"],
  running: [
    "waiting_resource", "waiting_external", "waiting_human",
    "retry_wait", "reconciling", "verifying", "failed",
  ],
  waiting_resource: ["queued", "cancelled", "failed"],
  waiting_external: ["queued", "cancelled", "failed"],
  waiting_human: ["queued", "cancelled", "failed"],
  retry_wait: ["queued", "cancelled", "failed"],
  reconciling: ["verifying", "retry_wait", "failed", "cancelled"],
  verifying: ["succeeded", "failed", "reconciling"],
  succeeded: ["reviewed"],
  failed: ["reviewed"],
  refused: ["reviewed"],
  cancelled: ["reviewed"],
  reviewed: [],
};

export function canTransitionWork(from: WorkState, to: WorkState): boolean {
  return from === to || TRANSITIONS[from].includes(to);
}

export function assertWorkTransition(from: WorkState, to: WorkState): void {
  if (!canTransitionWork(from, to)) {
    throw new Error(`WORK_TRANSITION_INVALID: ${from} -> ${to}`);
  }
}

export function isTerminalWorkState(state: WorkState): boolean {
  return TERMINAL_WORK_STATES.has(state);
}

export function stepIsSideEffecting(step: WorkStep): boolean {
  return step.sideEffecting;
}

export function validateWorkPlan(plan: WorkPlan): void {
  if (!plan.planId || !plan.version || !plan.objective || !plan.createdBy) {
    throw new Error("WORK_PLAN_INVALID: plan identity/objective/author is required");
  }
  if (plan.steps.length === 0) throw new Error("WORK_PLAN_EMPTY");
  const ids = new Set<string>();
  for (const step of plan.steps) {
    if (!step.stepId || ids.has(step.stepId)) throw new Error("WORK_PLAN_DUPLICATE_STEP");
    ids.add(step.stepId);
    if (!step.capability) throw new Error(`WORK_PLAN_STEP_CAPABILITY_MISSING: ${step.stepId}`);
    if (step.dependsOn.includes(step.stepId)) throw new Error(`WORK_PLAN_SELF_DEPENDENCY: ${step.stepId}`);
  }
  for (const step of plan.steps) {
    for (const dep of step.dependsOn) {
      if (!ids.has(dep)) throw new Error(`WORK_PLAN_UNKNOWN_DEPENDENCY: ${step.stepId} -> ${dep}`);
    }
  }
  // DFS cycle check.
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (id: string): void => {
    if (visiting.has(id)) throw new Error(`WORK_PLAN_CYCLE: ${id}`);
    if (visited.has(id)) return;
    visiting.add(id);
    const step = plan.steps.find((s) => s.stepId === id)!;
    for (const dep of step.dependsOn) visit(dep);
    visiting.delete(id);
    visited.add(id);
  };
  for (const id of ids) visit(id);
}

export function readyStepIds(plan: WorkPlan, succeededSteps: ReadonlySet<string>): string[] {
  return plan.steps
    .filter((step) =>
      step.state === "pending" &&
      !succeededSteps.has(step.stepId) &&
      step.dependsOn.every((dep) => succeededSteps.has(dep)),
    )
    .map((step) => step.stepId);
}

export function workIdShape(id: string): boolean {
  return /^work_[0-9a-z_]{16,80}$/.test(id);
}

export function planIdShape(id: string): boolean {
  return /^plan_[0-9a-z_]{16,96}$/.test(id);
}

export function attemptIdShape(id: string): boolean {
  return /^attempt_[0-9a-z_]{16,96}$/.test(id);
}

export function gateIdShape(id: string): boolean {
  return /^gate_[0-9a-z_]{16,96}$/.test(id);
}
