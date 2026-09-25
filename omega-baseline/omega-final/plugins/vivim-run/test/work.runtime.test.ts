// Durable Work runtime tests against an in-memory vault implementation.
// These exercise the actual work.ts code without browser, AI, filesystem, or
// the full µhost. The vault contract is the only persistence dependency.
import { describe, expect, test } from "bun:test";
import {
  createWork,
  finishAttempt,
  getWork,
  recoverWork,
  reconcileWork,
  startAttempt,
  transitionWork,
  verifyWork,
} from "../src/work.ts";
import type { PluginContext } from "@vivim/omega-shim";
import type { WorkPlan } from "@vivim/omega-contracts";

function fakeContext() {
  const rows = new Map<string, { rev: number; cid: string; data: unknown }>();
  let seq = 0;
  const context = {
    port: {
      call: async (op: string, payload: any) => {
        const ns = String(payload?.ns ?? "");
        const id = String(payload?.id ?? "");
        if (op === "vault.append@1") {
          const key = ns + ":" + id;
          const previous = rows.get(key);
          const rev = (previous?.rev ?? 0) + 1;
          const cid = "cid_" + String(++seq);
          rows.set(key, { rev, cid, data: payload.data });
          return { ok: true, value: { rev, cid, seq: rev } };
        }
        if (op === "vault.get@1") {
          const row = rows.get(ns + ":" + id);
          if (!row) return { ok: false, error: "UNKNOWN", detail: "missing " + ns + ":" + id };
          return { ok: true, value: { rev: row.rev, cid: row.cid, data: row.data, meta: {}, refs: payload.refs ?? [] } };
        }
        if (op === "vault.query@1") {
          const prefix = String(payload?.filter?.idPrefix ?? "");
          const out = [...rows.entries()]
            .filter(([key]) => key.startsWith(ns + ":"))
            .map(([key, row]) => ({ id: key.slice(ns.length + 1), rev: row.rev, cid: row.cid }))
            .filter((row) => row.id.startsWith(prefix));
          return { ok: true, value: out };
        }
        throw new Error("unexpected fake-vault op: " + op);
      },
    },
    log: () => {},
  };
  return context as unknown as PluginContext;
}

function makePlan(sideEffecting = false): WorkPlan {
  return {
    planId: "plan_0123456789abcdef",
    version: "1",
    objective: "produce a local artifact",
    createdBy: "user:test",
    createdAt: 1,
    steps: [
      {
        stepId: "step-a",
        capability: "artifact.create@1",
        input: { name: "demo.txt" },
        dependsOn: [],
        sideEffecting,
        verification: { kind: "artifact_exists", value: "demo.txt" },
        state: "pending",
        ...(sideEffecting ? { effectKey: "artifact:create:demo.txt" } : {}),
      },
      {
        stepId: "step-b",
        capability: "artifact.read@1",
        input: { name: "demo.txt" },
        dependsOn: ["step-a"],
        sideEffecting: false,
        verification: { kind: "output_present" },
        state: "pending",
      },
    ],
  };
}

async function queueAndRunStart(ctx: PluginContext, workId: string, stepId = "step-a") {
  await transitionWork(ctx, workId, { state: "validating" });
  await transitionWork(ctx, workId, { state: "queued" });
  await transitionWork(ctx, workId, { state: "running", currentStepId: stepId });
}

describe("durable Work runtime", () => {
  test("executes a dependency-ordered two-step plan to verified success", async () => {
    const ctx = fakeContext();
    const plan = makePlan(true);
    const created = await createWork(ctx, {
      requestedBy: "user:test",
      objective: plan.objective,
      plan,
    });
    await queueAndRunStart(ctx, created.workId);

    const first = await startAttempt(ctx, { workId: created.workId });
    expect(first.attempt.effectId).toBe("artifact:create:demo.txt");

    const firstFinish = await finishAttempt(ctx, {
      workId: created.workId,
      attemptId: first.attempt.attemptId,
      outcome: "succeeded",
      result: { created: true },
      verificationPassed: true,
    });
    expect(firstFinish.work.state).toBe("running");
    expect(firstFinish.work.currentStepId).toBe("step-b");

    const second = await startAttempt(ctx, { workId: created.workId });
    const secondFinish = await finishAttempt(ctx, {
      workId: created.workId,
      attemptId: second.attempt.attemptId,
      outcome: "succeeded",
      result: { read: true },
      verificationPassed: true,
    });
    expect(secondFinish.work.state).toBe("verifying");

    const verified = await verifyWork(ctx, created.workId, { artifact: "demo.txt" });
    expect(verified.work.state).toBe("succeeded");

    const final = await getWork(ctx, created.workId);
    expect(final.work.state).toBe("succeeded");
    expect(final.plan.planId).toBe(plan.planId);
    expect(final.planRev).toBe(final.work.planRef.rev);
  });

  test("recovers an in-flight side effect without inventing success and retries with the same effect identity", async () => {
    const ctx = fakeContext();
    const plan = makePlan(true);
    const created = await createWork(ctx, {
      requestedBy: "user:test",
      objective: plan.objective,
      plan,
    });
    await queueAndRunStart(ctx, created.workId);

    const attempt1 = await startAttempt(ctx, { workId: created.workId });
    expect(attempt1.attempt.effectId).toBe("artifact:create:demo.txt");

    const recovered = await recoverWork(ctx);
    expect(recovered.recovered).toHaveLength(1);
    expect(recovered.recovered[0]?.to).toBe("reconciling");

    const afterRecovery = await getWork(ctx, created.workId);
    expect(afterRecovery.work.state).toBe("reconciling");
    expect(afterRecovery.work.currentAttemptId).toBe(attempt1.attempt.attemptId);

    const noEffect = await reconcileWork(ctx, created.workId, "not_happened");
    expect(noEffect.work.state).toBe("retry_wait");

    await transitionWork(ctx, created.workId, {
      state: "queued",
      currentAttemptId: null,
      clearWait: true,
    });
    await transitionWork(ctx, created.workId, {
      state: "running",
      currentStepId: "step-a",
    });

    const attempt2 = await startAttempt(ctx, { workId: created.workId });
    expect(attempt2.attempt.attemptNumber).toBe(2);
    expect(attempt2.attempt.effectId).toBe(attempt1.attempt.effectId);

    const settled = await finishAttempt(ctx, {
      workId: created.workId,
      attemptId: attempt2.attempt.attemptId,
      outcome: "succeeded",
      result: { created: true },
      verificationPassed: true,
    });
    expect(settled.work.state).toBe("running");
    expect(settled.work.currentStepId).toBe("step-b");
  });

  test("never permits a running Work to be cancelled through the lifecycle contract", async () => {
    const ctx = fakeContext();
    const plan = makePlan();
    const created = await createWork(ctx, {
      requestedBy: "user:test",
      objective: plan.objective,
      plan,
    });
    await queueAndRunStart(ctx, created.workId);

    await expect(
      transitionWork(ctx, created.workId, { state: "cancelled" }),
    ).rejects.toThrow("WORK_TRANSITION_INVALID");
  });

  test("recovery of running Work without an Attempt returns it to the queue safely", async () => {
    const ctx = fakeContext();
    const plan = makePlan();
    const created = await createWork(ctx, {
      requestedBy: "user:test",
      objective: plan.objective,
      plan,
    });
    await queueAndRunStart(ctx, created.workId);

    const recovered = await recoverWork(ctx);
    expect(recovered.recovered[0]?.to).toBe("queued");
    const after = await getWork(ctx, created.workId);
    expect(after.work.state).toBe("queued");
    expect(after.work.currentStepId).toBe("step-a");
  });
});
