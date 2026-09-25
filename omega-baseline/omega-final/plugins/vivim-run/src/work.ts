// vivim.run — durable Work runtime.
// The existing vivim.run pool remains the worker/scheduling substrate. This module
// owns canonical Work/Plan/Attempt lifecycle persistence and never keeps execution
// truth in memory. All durable state is written through the existing vault port.

import { randomBytes } from "node:crypto";
import type { PluginContext } from "@vivim/omega-shim";
import type { PortResult, VaultProvenanceRef, WorkAttempt, WorkPlan, WorkRecord, WorkStep } from "@vivim/omega-contracts";
import {
  WORK_NS,
  assertWorkTransition,
  isTerminalWorkState,
  readyStepIds,
  validateWorkPlan,
  type AttemptState,
  type WorkState,
} from "@vivim/omega-contracts";

interface VaultAppendResult { rev: number; cid: string; seq: number }
interface VaultGetResult { rev: number; cid: string; data: unknown; meta: unknown; refs: unknown }
interface VaultQueryRow { id: string; rev: number; cid: string }

function id(prefix: string): string {
  return `${prefix}_${randomBytes(12).toString("hex")}`;
}

async function call<T>(ctx: PluginContext, op: string, payload: unknown): Promise<T> {
  const r: PortResult = await ctx.port.call(op, payload);
  if (!r.ok) throw new Error(`vivim.run: ${op} ${r.error}: ${r.detail ?? ""}`);
  return r.value as T;
}

async function tryGet<T>(ctx: PluginContext, ns: string, objectId: string): Promise<{ rev: number; data: T } | null> {
  const r: PortResult = await ctx.port.call("vault.get@1", { ns, id: objectId });
  return r.ok ? { rev: Number((r.value as VaultGetResult).rev), data: (r.value as VaultGetResult).data as T } : null;
}

async function append<T>(ctx: PluginContext, objectId: string, data: T, refs: VaultProvenanceRef[] = [], type: string): Promise<VaultAppendResult> {
  return call<VaultAppendResult>(ctx, "vault.append@1", {
    ns: WORK_NS,
    id: objectId,
    data,
    meta: { type },
    refs,
  });
}

function requireString(op: string, field: string, value: unknown): string {
  if (typeof value !== "string" || value.length === 0) throw new Error(`${op}: ${field} must be a non-empty string`);
  return value;
}

function asWork(value: unknown): WorkRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("WORK_RECORD_INVALID");
  const v = value as Record<string, unknown>;
  if (
    typeof v.workId !== "string" ||
    typeof v.requestedBy !== "string" ||
    typeof v.objective !== "string" ||
    typeof v.state !== "string" ||
    typeof v.createdAt !== "number" ||
    typeof v.updatedAt !== "number" ||
    !v.planRef || typeof v.planRef !== "object"
  ) throw new Error("WORK_RECORD_INVALID");
  const planRef = v.planRef as Record<string, unknown>;
  if (typeof planRef.planId !== "string" || typeof planRef.version !== "string" || typeof planRef.rev !== "number") {
    throw new Error("WORK_PLAN_REF_INVALID");
  }
  return value as WorkRecord;
}

function asPlan(value: unknown): WorkPlan {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("WORK_PLAN_INVALID");
  const plan = value as WorkPlan;
  validateWorkPlan(plan);
  return plan;
}

function asAttempt(value: unknown): WorkAttempt {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("WORK_ATTEMPT_INVALID");
  const v = value as Record<string, unknown>;
  if (
    typeof v.attemptId !== "string" ||
    typeof v.workId !== "string" ||
    typeof v.stepId !== "string" ||
    typeof v.attemptNumber !== "number" ||
    typeof v.state !== "string" ||
    typeof v.startedAt !== "number" ||
    !Array.isArray(v.evidence)
  ) throw new Error("WORK_ATTEMPT_INVALID");
  return value as WorkAttempt;
}

async function readWork(ctx: PluginContext, workId: string): Promise<{ work: WorkRecord; rev: number }> {
  const got = await tryGet<unknown>(ctx, WORK_NS, workId);
  if (!got) throw new Error(`WORK_UNKNOWN: ${workId}`);
  return { work: asWork(got.data), rev: got.rev };
}

async function readPlan(ctx: PluginContext, planId: string): Promise<{ plan: WorkPlan; rev: number }> {
  const got = await tryGet<unknown>(ctx, WORK_NS, planId);
  if (!got) throw new Error(`WORK_PLAN_UNKNOWN: ${planId}`);
  return { plan: asPlan(got.data), rev: got.rev };
}

async function listRows(ctx: PluginContext, prefix: string): Promise<VaultQueryRow[]> {
  return call<VaultQueryRow[]>(ctx, "vault.query@1", { ns: WORK_NS, filter: { idPrefix: prefix } });
}

async function loadAttempts(ctx: PluginContext, workId: string): Promise<Array<WorkAttempt & { rev: number }>> {
  const rows = await listRows(ctx, "attempt_");
  const out: Array<WorkAttempt & { rev: number }> = [];
  for (const row of rows) {
    const got = await tryGet<unknown>(ctx, WORK_NS, row.id);
    if (!got) continue;
    const attempt = asAttempt(got.data);
    if (attempt.workId === workId) out.push({ ...attempt, rev: got.rev });
  }
  return out.sort((a, b) => a.attemptNumber - b.attemptNumber || a.attemptId.localeCompare(b.attemptId));
}

function successfulStepIds(attempts: readonly WorkAttempt[]): Set<string> {
  return new Set(attempts.filter((a) => a.state === "succeeded").map((a) => a.stepId));
}

function findStep(plan: WorkPlan, stepId: string): WorkStep {
  const step = plan.steps.find((s) => s.stepId === stepId);
  if (!step) throw new Error(`WORK_STEP_UNKNOWN: ${stepId}`);
  return step;
}

export interface CreateWorkInput {
  workId?: string;
  requestedBy: string;
  objective: string;
  plan: WorkPlan;
  budget?: WorkRecord["budget"];
  parentWorkRef?: WorkRecord["parentWorkRef"];
}

export async function createWork(ctx: PluginContext, input: CreateWorkInput) {
  const requestedBy = requireString("work.create@1", "requestedBy", input.requestedBy);
  const objective = requireString("work.create@1", "objective", input.objective);
  validateWorkPlan(input.plan);

  const workId = input.workId ?? id("work");
  const existing = await tryGet<unknown>(ctx, WORK_NS, workId);
  if (existing) return { workId, rev: existing.rev, work: asWork(existing.data), idempotent: true };

  const planId = input.plan.planId;
  const existingPlan = await tryGet<unknown>(ctx, WORK_NS, planId);
  let planRev: number;
  if (existingPlan) {
    const existingPlanValue = asPlan(existingPlan.data);
    if (existingPlanValue.version !== input.plan.version) {
      throw new Error(`WORK_PLAN_ID_REUSED: ${planId} already exists at version ${existingPlanValue.version}`);
    }
    planRev = existingPlan.rev;
  } else {
    const planAppend = await append(ctx, planId, input.plan, [], "plan");
    planRev = planAppend.rev;
  }

  const now = Date.now();
  const work: WorkRecord = {
    workId,
    requestedBy,
    objective,
    planRef: { planId, version: input.plan.version, rev: planRev },
    state: "draft",
    ...(input.budget ? { budget: input.budget } : {}),
    ...(input.parentWorkRef ? { parentWorkRef: input.parentWorkRef } : {}),
    evidence: [],
    createdAt: now,
    updatedAt: now,
  };
  const appended = await append(ctx, workId, work, [{ ns: WORK_NS, id: planId, rev: planRev }], "work");
  return { workId, rev: appended.rev, work, idempotent: false };
}

export async function getWork(ctx: PluginContext, workId: string) {
  const { work, rev } = await readWork(ctx, workId);
  const { plan, rev: planRev } = await readPlan(ctx, work.planRef.planId);
  return { work, rev, plan, planRev };
}

export async function listWork(ctx: PluginContext) {
  const rows = await listRows(ctx, "work_");
  const out: Array<{ work: WorkRecord; rev: number }> = [];
  for (const row of rows) {
    const got = await tryGet<unknown>(ctx, WORK_NS, row.id);
    if (!got) continue;
    out.push({ work: asWork(got.data), rev: got.rev });
  }
  return out.sort((a, b) => b.work.updatedAt - a.work.updatedAt);
}

export interface WorkPatch {
  state?: WorkState;
  currentStepId?: string | null;
  currentAttemptId?: string | null;
  wait?: WorkRecord["wait"];
  clearWait?: boolean;
  result?: unknown;
  failure?: WorkRecord["failure"];
  evidence?: VaultProvenanceRef[];
}

export async function transitionWork(ctx: PluginContext, workId: string, patch: WorkPatch) {
  const current = await readWork(ctx, workId);
  const state = patch.state ?? current.work.state;
  assertWorkTransition(current.work.state, state);

  if (patch.currentStepId !== undefined && patch.currentStepId !== null) {
    const { plan } = await readPlan(ctx, current.work.planRef.planId);
    findStep(plan, patch.currentStepId);
  }
  if (
    (state === "waiting_human" || state === "waiting_external" || state === "waiting_resource" || state === "retry_wait") &&
    !patch.wait && !current.work.wait
  ) {
    throw new Error(`WORK_WAIT_REASON_REQUIRED: ${state}`);
  }

  const next: WorkRecord = {
    ...current.work,
    state,
    ...(patch.currentStepId !== undefined ? (patch.currentStepId === null ? { currentStepId: undefined } : { currentStepId: patch.currentStepId }) : {}),
    ...(patch.currentAttemptId !== undefined ? (patch.currentAttemptId === null ? { currentAttemptId: undefined } : { currentAttemptId: patch.currentAttemptId }) : {}),
    ...(patch.clearWait ? { wait: undefined } : patch.wait !== undefined ? { wait: patch.wait } : {}),
    ...(patch.result !== undefined ? { result: patch.result } : {}),
    ...(patch.failure !== undefined ? { failure: patch.failure } : {}),
    ...(patch.evidence !== undefined ? { evidence: patch.evidence } : current.work.evidence),
    updatedAt: Date.now(),
  };
  const appended = await append(ctx, workId, next, [{ ns: WORK_NS, id: workId, rev: current.rev }], "work-transition");
  return { work: next, rev: appended.rev };
}

export interface StartAttemptInput {
  workId: string;
  stepId?: string;
  effectId?: string;
  workerRef?: string;
  leaseRef?: string;
}

export async function startAttempt(ctx: PluginContext, input: StartAttemptInput) {
  const current = await readWork(ctx, input.workId);
  if (current.work.state !== "running") throw new Error(`WORK_ATTEMPT_START_INVALID_STATE: ${current.work.state}`);
  const { plan } = await readPlan(ctx, current.work.planRef.planId);
  const attempts = await loadAttempts(ctx, input.workId);
  const stepId = input.stepId ?? current.work.currentStepId;
  if (!stepId) throw new Error("WORK_STEP_REQUIRED");
  const step = findStep(plan, stepId);

  const active = attempts.find((a) => a.stepId === stepId && (a.state === "started" || a.state === "reconciling"));
  if (active) throw new Error(`WORK_ATTEMPT_ALREADY_ACTIVE: ${active.attemptId}`);

  const succeeded = successfulStepIds(attempts);
  const ready = readyStepIds(plan, succeeded);
  if (!ready.includes(stepId)) throw new Error(`WORK_STEP_NOT_READY: ${stepId}`);

  const prior = attempts.filter((a) => a.stepId === stepId);
  const priorEffectIds = new Set(prior.map((a) => a.effectId).filter((v): v is string => typeof v === "string"));
  let effectId = input.effectId;
  if (step.sideEffecting) {
    if (typeof effectId !== "string" || effectId.length === 0) {
      throw new Error(`WORK_EFFECT_ID_REQUIRED: ${stepId} is side-effecting`);
    }
    if (priorEffectIds.size > 0 && !priorEffectIds.has(effectId)) {
      throw new Error(`WORK_EFFECT_ID_CHANGED: retries must reuse effect identity for ${stepId}`);
    }
  } else if (priorEffectIds.size > 0) {
    effectId = [...priorEffectIds][0];
  }

  const attempt: WorkAttempt = {
    attemptId: id("attempt"),
    workId: input.workId,
    stepId,
    attemptNumber: prior.length + 1,
    ...(effectId ? { effectId } : {}),
    state: "started",
    startedAt: Date.now(),
    ...(input.workerRef ? { workerRef: input.workerRef } : {}),
    ...(input.leaseRef ? { leaseRef: input.leaseRef } : {}),
    evidence: [],
  };

  const appended = await append(
    ctx,
    attempt.attemptId,
    attempt,
    [{ ns: WORK_NS, id: input.workId, rev: current.rev }, { ns: WORK_NS, id: plan.planId, rev: current.work.planRef.rev }],
    "attempt",
  );

  const workResult = await transitionWork(ctx, input.workId, {
    state: "running",
    currentStepId: stepId,
    currentAttemptId: attempt.attemptId,
  });

  return { attempt, attemptRev: appended.rev, work: workResult.work, workRev: workResult.rev };
}

export interface FinishAttemptInput {
  workId: string;
  attemptId: string;
  outcome: "succeeded" | "failed" | "unknown_effect";
  result?: unknown;
  failure?: { code: string; detail: string };
  verificationPassed?: boolean;
  retryable?: boolean;
  evidence?: VaultProvenanceRef[];
}

export async function finishAttempt(ctx: PluginContext, input: FinishAttemptInput) {
  const current = await readWork(ctx, input.workId);
  const attemptGot = await tryGet<unknown>(ctx, WORK_NS, input.attemptId);
  if (!attemptGot) throw new Error(`WORK_ATTEMPT_UNKNOWN: ${input.attemptId}`);
  const currentAttempt = asAttempt(attemptGot.data);
  if (currentAttempt.workId !== input.workId) throw new Error("WORK_ATTEMPT_WORK_MISMATCH");
  if (currentAttempt.state !== "started" && currentAttempt.state !== "reconciling") {
    throw new Error(`WORK_ATTEMPT_FINISH_INVALID_STATE: ${currentAttempt.state}`);
  }

  const { plan } = await readPlan(ctx, current.work.planRef.planId);
  const step = findStep(plan, currentAttempt.stepId);
  if (input.outcome === "succeeded" && step.verification.kind !== "none" && input.verificationPassed !== true) {
    throw new Error(`WORK_VERIFICATION_REQUIRED: ${currentAttempt.stepId}`);
  }

  const attemptState: AttemptState = input.outcome === "succeeded" ? "succeeded" : input.outcome === "failed" ? "failed" : "unknown_effect";
  const nextAttempt: WorkAttempt = {
    ...currentAttempt,
    state: attemptState,
    ...(input.result !== undefined ? { result: input.result } : {}),
    ...(input.failure !== undefined ? { failure: input.failure } : {}),
    ...(input.evidence !== undefined ? { evidence: input.evidence } : currentAttempt.evidence),
    ...(attemptState !== "started" ? { finishedAt: Date.now() } : {}),
  };
  const attemptAppend = await append(
    ctx,
    input.attemptId,
    nextAttempt,
    [{ ns: WORK_NS, id: input.workId, rev: current.rev }],
    "attempt-settlement",
  );

  if (input.outcome === "unknown_effect") {
    const workResult = await transitionWork(ctx, input.workId, {
      state: "reconciling",
      currentAttemptId: input.attemptId,
      wait: { kind: "external", reason: "effect outcome is unknown; reconciliation required" },
    });
    return { attempt: nextAttempt, attemptRev: attemptAppend.rev, work: workResult.work, workRev: workResult.rev };
  }

  const attempts = await loadAttempts(ctx, input.workId);
  // Include the just-written terminal attempt even if the latest-revision query
  // races a read against a different vault backend.
  const allAttempts = attempts.filter((a) => a.attemptId !== input.attemptId).concat({ ...nextAttempt, rev: attemptAppend.rev });
  const succeeded = successfulStepIds(allAttempts);

  if (input.outcome === "failed") {
    const workState: WorkState = input.retryable ? "retry_wait" : "failed";
    const wait = input.retryable ? { kind: "retry" as const, reason: input.failure?.detail ?? "retryable attempt failure" } : undefined;
    const workResult = await transitionWork(ctx, input.workId, {
      state: workState,
      currentAttemptId: null,
      ...(wait ? { wait } : {}),
      ...(input.failure ? { failure: input.failure } : {}),
    });
    return { attempt: nextAttempt, attemptRev: attemptAppend.rev, work: workResult.work, workRev: workResult.rev };
  }

  const nextSteps = readyStepIds(plan, succeeded);
  if (nextSteps.length === 0) {
    const workResult = await transitionWork(ctx, input.workId, {
      state: "verifying",
      currentStepId: null,
      currentAttemptId: null,
      clearWait: true,
    });
    return { attempt: nextAttempt, attemptRev: attemptAppend.rev, work: workResult.work, workRev: workResult.rev };
  }

  const workResult = await transitionWork(ctx, input.workId, {
    state: "running",
    currentStepId: nextSteps[0]!,
    currentAttemptId: null,
    clearWait: true,
  });
  return { attempt: nextAttempt, attemptRev: attemptAppend.rev, work: workResult.work, workRev: workResult.rev };
}

export async function verifyWork(ctx: PluginContext, workId: string, result?: unknown, evidence?: VaultProvenanceRef[]) {
  const current = await readWork(ctx, workId);
  if (current.work.state !== "verifying") throw new Error(`WORK_VERIFY_INVALID_STATE: ${current.work.state}`);
  const { plan } = await readPlan(ctx, current.work.planRef.planId);
  const attempts = await loadAttempts(ctx, workId);
  const succeeded = successfulStepIds(attempts);
  const missing = plan.steps.filter((s) => !succeeded.has(s.stepId)).map((s) => s.stepId);
  if (missing.length > 0) throw new Error(`WORK_VERIFY_INCOMPLETE: ${missing.join(",")}`);

  return transitionWork(ctx, workId, {
    state: "succeeded",
    result,
    evidence: evidence ?? current.work.evidence,
    clearWait: true,
  });
}

export async function reconcileWork(
  ctx: PluginContext,
  workId: string,
  outcome: "confirmed_succeeded" | "confirmed_failed" | "not_happened",
  result?: unknown,
  failure?: { code: string; detail: string },
) {
  const current = await readWork(ctx, workId);
  if (current.work.state !== "reconciling") throw new Error(`WORK_RECONCILE_INVALID_STATE: ${current.work.state}`);
  const attemptId = current.work.currentAttemptId;
  if (!attemptId) throw new Error("WORK_RECONCILE_ATTEMPT_REQUIRED");
  const got = await tryGet<unknown>(ctx, WORK_NS, attemptId);
  if (!got) throw new Error(`WORK_ATTEMPT_UNKNOWN: ${attemptId}`);
  const attempt = asAttempt(got.data);
  if (attempt.state !== "started" && attempt.state !== "unknown_effect" && attempt.state !== "reconciling") {
    throw new Error(`WORK_RECONCILE_ATTEMPT_INVALID_STATE: ${attempt.state}`);
  }

  const finalState: AttemptState = outcome === "confirmed_succeeded" ? "succeeded" : outcome === "confirmed_failed" ? "failed" : "cancelled";
  const settled: WorkAttempt = {
    ...attempt,
    state: finalState,
    ...(result !== undefined ? { result } : {}),
    ...(failure !== undefined ? { failure } : {}),
    finishedAt: Date.now(),
  };
  const attemptRev = await append(ctx, attemptId, settled, [{ ns: WORK_NS, id: workId, rev: current.rev }], "attempt-reconciliation");

  if (outcome === "confirmed_succeeded") {
    const { plan } = await readPlan(ctx, current.work.planRef.planId);
    const attempts = await loadAttempts(ctx, workId);
    const all = attempts.filter((a) => a.attemptId !== attemptId).concat({ ...settled, rev: attemptRev.rev });
    const next = readyStepIds(plan, successfulStepIds(all));
    return next.length === 0
      ? { attempt: settled, attemptRev: attemptRev.rev, ...(await transitionWork(ctx, workId, { state: "verifying", currentAttemptId: null, currentStepId: null, clearWait: true })) }
      : { attempt: settled, attemptRev: attemptRev.rev, ...(await transitionWork(ctx, workId, { state: "running", currentAttemptId: null, currentStepId: next[0]!, clearWait: true })) };
  }

  if (outcome === "not_happened") {
    return {
      attempt: settled,
      attemptRev: attemptRev.rev,
      ...(await transitionWork(ctx, workId, { state: "retry_wait", currentAttemptId: null, wait: { kind: "retry", reason: "reconciled effect did not occur" } })),
    };
  }

  return {
    attempt: settled,
    attemptRev: attemptRev.rev,
    ...(await transitionWork(ctx, workId, { state: "failed", currentAttemptId: null, failure: failure ?? { code: "RECONCILED_FAILURE", detail: "effect confirmed failed" }, clearWait: true })),
  };
}

export async function cancelWork(ctx: PluginContext, workId: string, reason = "cancelled by caller") {
  const current = await readWork(ctx, workId);
  if (current.work.state === "running" || current.work.state === "reconciling") {
    throw new Error("WORK_CANCEL_REQUIRES_SAFE_STOP: running/reconciling Work must be resolved before cancellation");
  }
  return transitionWork(ctx, workId, {
    state: "cancelled",
    failure: { code: "CANCELLED", detail: reason },
    clearWait: true,
  });
}

export async function recoverWork(ctx: PluginContext) {
  const works = await listWork(ctx);
  const recovered: Array<{ workId: string; from: WorkState; to: WorkState; rev: number }> = [];
  for (const row of works) {
    if (row.work.state !== "running") continue;
    const out = await transitionWork(ctx, row.work.workId, {
      state: "reconciling",
      wait: { kind: "external", reason: "process recovery: in-flight attempt requires effect reconciliation" },
      currentAttemptId: row.work.currentAttemptId ?? null,
    });
    recovered.push({ workId: row.work.workId, from: "running", to: "reconciling", rev: out.rev });
  }
  return { scanned: works.length, recovered };
}

export function isWorkTerminal(state: WorkState): boolean {
  return isTerminalWorkState(state);
}
