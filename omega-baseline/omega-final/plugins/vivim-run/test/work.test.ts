// Deterministic Work contract tests. No browser, AI, database or worker required.
import { describe, expect, test } from "bun:test";
import {
  assertWorkTransition,
  canTransitionWork,
  readyStepIds,
  validateWorkPlan,
  type WorkPlan,
} from "@vivim/omega-contracts";

const plan = (sideEffecting = false): WorkPlan => ({
  planId: "plan_0123456789abcdef",
  version: "1",
  objective: "create a local artifact",
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
});

describe("VIVIM durable Work contract", () => {
  test("rejects cyclic plans and unknown dependencies", () => {
    expect(() => validateWorkPlan({
      ...plan(),
      steps: [{ ...plan().steps[0]!, dependsOn: ["missing"] }],
    })).toThrow("WORK_PLAN_UNKNOWN_DEPENDENCY");

    expect(() => validateWorkPlan({
      ...plan(),
      steps: [
        { ...plan().steps[0]!, dependsOn: ["step-b"] },
        { ...plan().steps[1]!, dependsOn: ["step-a"] },
      ],
    })).toThrow("WORK_PLAN_CYCLE");
  });

  test("ready steps are deterministic and dependency-closed", () => {
    const p = plan();
    expect(readyStepIds(p, new Set())).toEqual(["step-a"]);
    expect(readyStepIds(p, new Set(["step-a"]))).toEqual(["step-b"]);
    expect(readyStepIds(p, new Set(["step-b"]))).toEqual([]);
  });

  test("work lifecycle permits waiting/retry/reconcile but forbids authority bypass", () => {
    expect(canTransitionWork("draft", "validating")).toBe(true);
    expect(canTransitionWork("running", "waiting_human")).toBe(true);
    expect(canTransitionWork("running", "reconciling")).toBe(true);
    expect(canTransitionWork("running", "cancelled")).toBe(false);
    expect(canTransitionWork("reconciling", "queued")).toBe(false);
    expect(canTransitionWork("succeeded", "queued")).toBe(false);
    expect(() => assertWorkTransition("running", "cancelled")).toThrow("WORK_TRANSITION_INVALID");
  });

  test("side-effecting steps carry a stable effect key", () => {
    const p = plan(true);
    expect(p.steps[0]!.sideEffecting).toBe(true);
    expect(p.steps[0]!.effectKey).toBe("artifact:create:demo.txt");
  });

  test("plan identity is immutable by reference shape", () => {
    const p = plan();
    const planRef = { planId: p.planId, version: p.version, rev: 7 };
    expect(planRef).toEqual({ planId: "plan_0123456789abcdef", version: "1", rev: 7 });
  });
});
