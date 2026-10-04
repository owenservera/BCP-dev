// tooling/gates/test/f-exec-debug.test.ts — the F-EXEC-DEBUG falsifier (D-435, Ω-3.5).
// Generated as a RED stub by `omega:loop --stub D-435`, then implemented.
//  F-EXEC-DEBUG.1 visible-hang — a plan blocked on a dead realization reports blockedOn: liveness with an EXEC_PLAN_STALLED ledgered event; the state renders headlessly as text (plan.state view)
//  F-EXEC-DEBUG.2 gated-intervention — pause/step/resume/cancel run as law-gated ledgered ops; an ungated intervention refuses EXEC_INTERVENE_UNGATED; cancel marks EXTERNAL_MUTATION
//  F-EXEC-DEBUG.3 honest-census — capability deprecation counts dependents from the vault BEFORE ratification and flags them; a census-less ratification refuses CAP_DEPRECATE_CENSUS_UNCITED
//  F-EXEC-DEBUG.4 sunset-road — post-sunset use refuses CAP_SUNSET_BREACH naming the successor (or explicit none); the shim window routes with a shim badge
//  F-EXEC-DEBUG.5 shim-expiry — an expired migration shim refuses CAP_SHIM_EXPIRED; extension mechanically requires a new decision record
//  F-EXEC-DEBUG.6 headless-and-loud — inspect/intervene/lifecycle are CLI/daemon ops; zero silent-failure paths (every anomaly is a named refusal or ledgered event)
import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  PlanRegistry, renderPlanState, EXEC_PLAN_STALLED, EXEC_PLAN_OPAQUE, STALL_SILENCE_MS,
} from "../../../plugins/vivim-run/src/planstate.ts";
import {
  breakGlass, intervene, EXEC_INTERVENE_UNGATED, EXEC_CANCEL_FORBIDDEN_BY_CONTRACT, EXEC_BREAKGLASS_EMPLOYED,
} from "../../../plugins/vivim-run/src/intervene.ts";
import {
  deprecate, extendShim, lifecycleView, useCapability,
  CAP_DEPRECATE_CENSUS_UNCITED, CAP_DEPRECATE_WITHOUT_SUCCESSOR, CAP_SUNSET_BREACH, CAP_SHIM_EXPIRED,
} from "../../../plugins/vivim-run/src/capability.ts";

const T0 = 1_700_000_000_000;

function hungPlan(registry: PlanRegistry): void {
  registry.register({
    planId: "plan-1",
    principal: "user:alice",
    steps: [
      { stepId: "fetch", op: "provider.fetch@1", dependsOn: [], status: "done", lastProgress: T0 },
      { stepId: "summarize", op: "mind.summarize@1", dependsOn: ["fetch"], status: "running", lastProgress: T0 },
    ],
    createdAt: T0 - 60_000,
  });
}

describe("F-EXEC-DEBUG.1 (visible-hang)", () => {
  test("a dead realization reports blockedOn: liveness with an EXEC_PLAN_STALLED event; the state renders as text", () => {
    const registry = new PlanRegistry();
    hungPlan(registry);
    // the heartbeat went silent past the threshold
    const now = T0 + STALL_SILENCE_MS + 5_000;
    const state = registry.stateOf("plan-1", now);
    const liveness = state.blockedOn.find((b) => b.blocker === "liveness");
    expect(liveness).toBeDefined();
    expect(liveness!.stepId).toBe("summarize");
    expect(state.stalled).toBe(true);
    expect(state.state).toBe("stalled");
    // the stall is a LEDGERED event with a sentence
    const stalls = registry.stallCheck(now);
    expect(stalls.length).toBe(1);
    expect(stalls[0]!.kind).toBe(EXEC_PLAN_STALLED);
    expect(stalls[0]!.planId).toBe("plan-1");
    expect(stalls[0]!.sentence).toContain("presumed dead");
    // the headless rendering: text a CLI prints (omega:exec ps)
    const text = renderPlanState(state);
    expect(text).toContain("plan plan-1 [user:alice] — stalled");
    expect(text).toContain("[liveness] summarize");
    expect(text).toContain("no heartbeat for");
    // a healthy plan does not stall
    const healthy = registry.stateOf("plan-1", T0 + 100);
    expect(healthy.stalled).toBe(false);
  });
});

describe("F-EXEC-DEBUG.2 (gated-intervention)", () => {
  test("the verbs are ledgered rows; ungated refuses; cancel is EXTERNAL_MUTATION; the contract can forbid cancel", () => {
    const registry = new PlanRegistry();
    hungPlan(registry);
    const now = T0 + 1_000;
    // UNGATED: refused by name — the out-of-band kill switch does not exist
    const rogue = intervene(registry, "plan-1", "pause", { gated: false, from: "agent:helper" }, now);
    expect(rogue.ok).toBe(false);
    if (!rogue.ok) {
      expect(rogue.code).toBe(EXEC_INTERVENE_UNGATED);
      expect(rogue.sentence).toContain("agent:helper");
    }
    // GATED pause → a ledger row; the step pauses
    const pause = intervene(registry, "plan-1", "pause", { gated: true, from: "user:alice" }, now);
    expect(pause.ok).toBe(true);
    if (pause.ok) {
      expect(pause.row.kind).toBe("exec.intervene@1");
      expect(pause.row.verb).toBe("pause");
      expect(pause.row.risk).toBe("MUTATION");
      expect(pause.row.ledgered).toBe(true);
    }
    expect(registry.stateOf("plan-1", now).graph.find((g) => g.stepId === "summarize")!.status).toBe("paused");
    // GATED step → running again with a fresh heartbeat
    const step = intervene(registry, "plan-1", "step", { gated: true, from: "user:alice" }, now + 1);
    expect(step.ok).toBe(true);
    expect(registry.get("plan-1")!.steps.find((s) => s.stepId === "summarize")!.lastProgress).toBe(now + 1);
    // GATED cancel → EXTERNAL_MUTATION, everything interruptible is cancelled
    const cancel = intervene(registry, "plan-1", "cancel", { gated: true, from: "user:alice" }, now + 2);
    expect(cancel.ok).toBe(true);
    if (cancel.ok) expect(cancel.row.risk).toBe("EXTERNAL_MUTATION");
    expect(registry.stateOf("plan-1", now + 2).state).toBe("complete");
    // the contract-forbidden cancel: an immutable run
    registry.register({
      planId: "plan-immutable",
      principal: "user:alice",
      steps: [{ stepId: "audit", op: "vault.verify@1", dependsOn: [], status: "running", lastProgress: now }],
      contract: { cancellable: false },
      createdAt: now,
    });
    const forbidden = intervene(registry, "plan-immutable", "cancel", { gated: true, from: "user:alice" }, now + 3);
    expect(forbidden.ok).toBe(false);
    if (!forbidden.ok) expect(forbidden.code).toBe(EXEC_CANCEL_FORBIDDEN_BY_CONTRACT);
    // the OS break-glass WORKS but scars: ledgered loudly
    const scar = breakGlass(registry, "plan-immutable", now + 4);
    expect(scar.code).toBe(EXEC_BREAKGLASS_EMPLOYED);
    expect(scar.sentence).toContain("scar");
    expect(registry.stateOf("plan-immutable", now + 4).state).toBe("complete");
    // inspecting an unknown plan refuses EXEC_PLAN_OPAQUE
    expect(() => registry.stateOf("plan-ghost", now)).toThrow(EXEC_PLAN_OPAQUE);
  });
});

describe("F-EXEC-DEBUG.3 (honest-census)", () => {
  test("the census is counted and flagged pre-ratification; census-less ratification refuses", () => {
    // census-less: the caller skipped the vault count → refused, named
    const blind = deprecate({ capability: "mind.summarize@1", census: [], censusCited: false, decisionRef: "D-900", now: T0 });
    expect(blind.ok).toBe(false);
    if (!blind.ok) expect(blind.code).toBe(CAP_DEPRECATE_CENSUS_UNCITED);
    // no successor and no explicit none → refused
    const orphan = deprecate({ capability: "mind.summarize@1", census: [], censusCited: true, decisionRef: "D-900", now: T0 });
    expect(orphan.ok).toBe(false);
    if (!orphan.ok) expect(orphan.code).toBe(CAP_DEPRECATE_WITHOUT_SUCCESSOR);
    // the honest ceremony: 3 dependents counted from the vault, census digest pinned
    const census = [
      { ref: "compose.research/manifest.json", kind: "composition" },
      { ref: "intent:abc123 (plan uses mind.summarize@1)", kind: "plan" },
      { ref: "grant:user:alice:mind.summarize", kind: "grant" },
    ];
    const done = deprecate({ capability: "mind.summarize@1", successor: "mind.summarize@2", census, censusCited: true, decisionRef: "D-900", now: T0, sunsetAfterMs: 1000 });
    expect(done.ok).toBe(true);
    if (done.ok) {
      expect(done.flagged).toEqual(census); // the dependents are flagged BEFORE ratification
      expect(done.row.dependents.length).toBe(3);
      expect(done.row.censusDigest).toMatch(/^[0-9a-f]{64}$/);
      expect(done.row.state).toBe("deprecated");
      expect(done.row.migrationShim).toBeDefined();
      // the lifecycle view is the honest row
      const view = lifecycleView(done.row);
      expect(view.dependents).toBe(3);
      expect(view.successor).toBe("mind.summarize@2");
    }
  });
});

describe("F-EXEC-DEBUG.4 (sunset-road)", () => {
  test("post-sunset use refuses CAP_SUNSET_BREACH naming the successor; the shim window routes with the badge", () => {
    const census = [{ ref: "compose.x", kind: "composition" }];
    const done = deprecate({ capability: "vault.query@1", successor: "vault.search@1", census, censusCited: true, decisionRef: "D-901", now: T0, sunsetAfterMs: 1000 });
    expect(done.ok).toBe(true);
    if (!done.ok) return;
    // during the window: routed through the shim with the badge
    const during = useCapability(done.row, "vault.query@1", T0 + 500);
    expect(during.ok).toBe(true);
    if (during.ok && during.routed === "shim") {
      expect(during.shim.badge).toBe("GEN_SPECULATIVE");
      expect(during.badge).toBe("GEN_SPECULATIVE");
    }
    // post-sunset: refused with directions naming the successor
    const after = useCapability(done.row, "vault.query@1", T0 + 2000);
    expect(after.ok).toBe(false);
    if (!after.ok) {
      expect(after.code).toBe(CAP_SUNSET_BREACH);
      expect(after.successor).toBe("vault.search@1");
      expect(after.sentence).toContain("migrate to vault.search@1");
    }
    // explicit none: the terminal capability names its non-existence honestly
    const terminal = deprecate({ capability: "legacy.bridge@1", successor: "none", census: [], censusCited: true, decisionRef: "D-902", now: T0, sunsetAfterMs: 1000 });
    expect(terminal.ok).toBe(true);
    if (terminal.ok) {
      const refused = useCapability(terminal.row, "legacy.bridge@1", T0 + 2000);
      expect(refused.ok).toBe(false);
      if (!refused.ok) {
        expect(refused.code).toBe(CAP_SUNSET_BREACH);
        expect(refused.sentence).toContain("terminal");
      }
    }
  });
});

describe("F-EXEC-DEBUG.5 (shim-expiry)", () => {
  test("an expired shim refuses CAP_SHIM_EXPIRED; extension requires a NEW decision record", () => {
    const census = [{ ref: "compose.x", kind: "composition" }];
    const done = deprecate({ capability: "old.op@1", successor: "new.op@1", census, censusCited: true, decisionRef: "D-903", now: T0, sunsetAfterMs: 10_000 });
    expect(done.ok).toBe(true);
    if (!done.ok) return;
    const row = done.row;
    // an expired shim refuses (the sunset has not arrived, the shim died first):
    // a shim whose window was authorized shorter than the sunset clock
    const shortShim = { ...row, migrationShim: { ...row.migrationShim!, expiresAt: T0 + 5_000 } };
    const expired = useCapability(shortShim, "old.op@1", T0 + 6_000);
    expect(expired.ok).toBe(false);
    if (!expired.ok) expect(expired.code).toBe(CAP_SHIM_EXPIRED);
    // extension with the SAME decision record → refused (one record, one window)
    const sameRecord = extendShim(row, row.migrationShim!.decisionRef, 5000, T0 + 6_000);
    expect(sameRecord.ok).toBe(false);
    if (!sameRecord.ok) expect(sameRecord.code).toBe(CAP_SHIM_EXPIRED);
    // extension with a NEW decision record → a fresh window
    const extended = extendShim(row, "D-904", 5000, T0 + 6_000);
    expect(extended.ok).toBe(true);
    if (extended.ok) {
      expect(extended.shim!.decisionRef).toBe("D-904");
      expect(extended.shim!.expiresAt).toBe(T0 + 11_000);
      expect(extended.shim!.shimId).toBe(row.migrationShim!.shimId); // same shim identity, new authorization
    }
  });
});

describe("F-EXEC-DEBUG.6 (headless-and-loud)", () => {
  test("the modules are CLI/daemon-shaped; every anomaly is a named refusal or a ledgered event", () => {
    for (const f of ["planstate.ts", "intervene.ts", "capability.ts"] as const) {
      const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-run", "src", f), "utf-8");
      expect(/from\s+"@vivim\/(omega-)?(surfaces|canvas|web|daemon-client)/.test(src)).toBe(false);
      expect(/\b(document|window|navigator)\s*\./.test(src)).toBe(false);
      expect(/catch\s*(\([^)]*\))?\s*\{\s*\}/.test(src)).toBe(false); // no silent swallows
    }
    // loud, mechanically: every refusal code in this falsifier appears in the modules' source
    const all = ["planstate.ts", "intervene.ts", "capability.ts"].map((f) => readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-run", "src", f), "utf-8")).join("\n");
    for (const code of [EXEC_PLAN_STALLED, EXEC_PLAN_OPAQUE, EXEC_INTERVENE_UNGATED, EXEC_CANCEL_FORBIDDEN_BY_CONTRACT, EXEC_BREAKGLASS_EMPLOYED, CAP_DEPRECATE_CENSUS_UNCITED, CAP_DEPRECATE_WITHOUT_SUCCESSOR, CAP_SUNSET_BREACH, CAP_SHIM_EXPIRED]) {
      expect(all.includes(code)).toBe(true);
    }
    // the ps view with no plans degrades honestly (no crash, honest text)
    const empty = new PlanRegistry();
    expect(empty.list()).toEqual([]);
    expect(empty.stallCheck(T0)).toEqual([]);
  });
});
