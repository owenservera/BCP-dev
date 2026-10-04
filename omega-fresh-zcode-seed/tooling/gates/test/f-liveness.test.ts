// tooling/gates/test/f-liveness.test.ts — the F-LIVENESS falsifier (D-450, Ω-14).
// Generated as a RED stub by `omega:loop --stub D-450`, then implemented.
//  F-LIVENESS.1 two-sided-stall — a plan needing a dormant realization reads blockedOn: liveness citing the state row; wake it through the ceremony → the plan proceeds — the D-435 handshake green on both sides
//  F-LIVENESS.2 budgeted-wake — hydration over profile → LIVENESS_WAKE_BUDGET_UNDECLARED without a budget, LIVENESS_BUDGET_REFUSED naming the trade with one; shed one tile → the wake succeeds, with rows on both sides
//  F-LIVENESS.3 honest-suspend — governor suspends → the typed reason and the §18 badge sentence land on the state row; an untyped reason refuses LIVENESS_STATE_INVALID; never a quiet freeze
//  F-LIVENESS.4 dormancy-proof — a dormant object's probe returns a signed proof citing the current watched revision; kill the watch → the probe refuses LIVENESS_PROOF_STALE
//  F-LIVENESS.5 ghost-refusal — a ghost's mutation attempt → LIVENESS_GHOST_WRITE; no queued write exists anywhere in the tree
//  F-LIVENESS.6 headless — 1–5 daemon-only; liveness.read answers every question the badge could render
//  F-LIVENESS.7 loud-failure — zero quiet freezes — every suspend, drift, and stale proof is a row or a refusal with a sentence
import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  LivenessRegistry, probe, renderLiveness,
  LIVENESS_STATE_INVALID, LIVENESS_PROOF_STALE, LIVENESS_GHOST_WRITE,
  LIVENESS_WAKE_BUDGET_UNDECLARED, LIVENESS_BUDGET_REFUSED, LIVENESS_WAKE_UNGATED, LIVENESS_STATE_DRIFT,
  type DormancyProof,
} from "../../../plugins/vivim-run/src/liveness.ts";

describe("F-LIVENESS.1 (two-sided-stall)", () => {
  test("a plan needing a dormant realization reads blockedOn: liveness citing the state row; wake it through the ceremony → the plan proceeds", () => {
    const reg = new LivenessRegistry();
    expect(reg.set({ tileId: "tile:mail", to: "dormant", by: "user:alice", at: 1000 }).ok).toBe(true);
    // the plan's side: blockedOn: liveness, citing the state row (the D-435 handshake)
    const stalled = reg.stethoscope("tile:mail");
    expect(stalled.blocked).toBe(true);
    expect(stalled.blocker).toBe("liveness");
    expect(stalled.stateRef).toBe("liveness:state:tile:mail");
    expect(stalled.detail).toContain("dormant");
    // the realization's side: wake it through the ceremony (budget + frame), then the plan proceeds
    const wake = reg.wake({ tileId: "tile:mail", budgetRef: "budget:hydrate:mail", gateRef: "frame:wake-1", by: "user:alice", at: 2000 });
    expect(wake.ok).toBe(true);
    if (!wake.ok) throw new Error(wake.sentence);
    expect(wake.row.state).toBe("hydrated");
    expect(wake.row.wakeProof?.gateRef).toBe("frame:wake-1");
    const live = reg.stethoscope("tile:mail");
    expect(live.blocked).toBe(false);
    expect(live.state).toBe("hydrated");
    // rows on both sides of the handshake
    expect(reg.historyOf("tile:mail").map((t) => `${t.from}→${t.to}`)).toEqual(["none→dormant", "dormant→hydrated"]);
  });
});

describe("F-LIVENESS.2 (budgeted-wake)", () => {
  test("an undeclared budget refuses first; an unaffordable hydration refuses with the trade named; shed one tile → the wake succeeds", () => {
    const reg = new LivenessRegistry();
    expect(reg.set({ tileId: "tile:llm", to: "dormant", weightMB: 4096, by: "policy", at: 1 }).ok).toBe(true);
    expect(reg.set({ tileId: "tile:chat", to: "dormant", weightMB: 2048, by: "policy", at: 1 }).ok).toBe(true);
    expect(reg.wake({ tileId: "tile:chat", budgetRef: "b:chat", gateRef: "g:1", by: "policy", at: 2 }).ok).toBe(true); // 2048MB committed
    // budget-check-FIRST: no budgetRef → the named refusal, even with a frame in hand
    const undeclared = reg.wake({ tileId: "tile:llm", budgetRef: "", gateRef: "g:2", by: "policy", at: 3 });
    expect(undeclared.ok).toBe(false);
    if (!undeclared.ok) { expect(undeclared.code).toBe(LIVENESS_WAKE_BUDGET_UNDECLARED); expect(undeclared.sentence).toContain("FIRST"); }
    // hydration over profile: 2048 committed + 4096 wanted > 4096 capacity → the trade named
    const over = reg.wake({ tileId: "tile:llm", budgetRef: "b:llm", gateRef: "g:2", capacityMB: 4096, profileRef: "profile:laptop", by: "policy", at: 4 });
    expect(over.ok).toBe(false);
    if (!over.ok) { expect(over.code).toBe(LIVENESS_BUDGET_REFUSED); expect(over.sentence).toContain("suspend or shed"); }
    // shed one tile → the wake succeeds, with rows on both sides
    const shed = reg.set({ tileId: "tile:chat", to: "ghost", reason: "shed: idle 6h", by: "policy", at: 5 });
    expect(shed.ok).toBe(true);
    const ok = reg.wake({ tileId: "tile:llm", budgetRef: "b:llm", gateRef: "g:2", capacityMB: 4096, profileRef: "profile:laptop", by: "policy", at: 6 });
    expect(ok.ok).toBe(true);
    if (!ok.ok) throw new Error(ok.sentence);
    expect(reg.get("tile:llm")?.state).toBe("hydrated");
    expect(reg.get("tile:chat")?.state).toBe("ghost");
    expect(reg.historyOf("tile:chat").map((t) => `${t.from}→${t.to}`)).toEqual(["none→dormant", "dormant→hydrated", "hydrated→ghost"]); // the shed has its row
    expect(reg.historyOf("tile:llm").map((t) => `${t.from}→${t.to}`)).toEqual(["none→dormant", "dormant→hydrated"]);                  // the wake has its row
  });
});

describe("F-LIVENESS.3 (honest-suspend)", () => {
  test("the governor's suspend carries the typed reason and the §18 badge sentence; an untyped reason refuses; never a quiet freeze", () => {
    const reg = new LivenessRegistry();
    expect(reg.set({ tileId: "tile:media", to: "ghost", by: "governor", at: 1 }).ok).toBe(true);
    expect(reg.wake({ tileId: "tile:media", budgetRef: "b:media", gateRef: "g:m", by: "governor", at: 2 }).ok).toBe(true); // hydrated
    // an untyped suspend is a quiet freeze wearing a badge shape → refused
    const untyped = reg.set({ tileId: "tile:media", to: "suspended", by: "governor", at: 3 });
    expect(untyped.ok).toBe(false);
    if (!untyped.ok) { expect(untyped.code).toBe(LIVENESS_STATE_INVALID); expect(untyped.sentence).toContain("battery|pressure|law"); }
    // the typed suspend lands the badge state + the state row in the same ceremony
    const suspended = reg.set({ tileId: "tile:media", to: "suspended", suspendReason: "battery", by: "governor", at: 3 });
    expect(suspended.ok).toBe(true);
    if (!suspended.ok) throw new Error(suspended.sentence);
    expect(suspended.row.suspendReason).toBe("battery");
    expect(suspended.row.badgeSentence).toBe("Suspended to save battery. Tap to wake."); // §18's exact sentence
    expect(suspended.row.since).toBe(3);                                                  // the row lands now, not eventually
    const history = reg.historyOf("tile:media");
    expect(history[history.length - 1]!.reason).toBe("suspend:battery");
    // the badge sentence renders headless as a row
    expect(renderLiveness(reg.read().rows, reg.read().proofs)).toContain('"Suspended to save battery. Tap to wake."');
    // the other typed reasons carry their own sentences
    const lawed = new LivenessRegistry();
    lawed.set({ tileId: "t", to: "dormant", by: "governor", at: 1 });
    const law = lawed.set({ tileId: "t", to: "suspended", suspendReason: "law", by: "governor", at: 2 });
    expect(law.ok).toBe(true);
    if (law.ok) expect(law.row.badgeSentence).toBe("Suspended by law. Resolve the cited law first.");
  });
});

describe("F-LIVENESS.4 (dormancy-proof)", () => {
  test("a dormant object's probe returns a signed proof citing the current watched revision; kill the watch → the probe refuses LIVENESS_PROOF_STALE", () => {
    const reg = new LivenessRegistry();
    expect(reg.set({ tileId: "tile:clock", to: "dormant", by: "policy", at: 1 }).ok).toBe(true);
    for (let i = 0; i < 5; i++) reg.watchTick(); // the vault watch advances to rev 5 (D-440's substrate)
    const signed = reg.signProof({ tileId: "tile:clock", signedBy: "realization:clock", watchedRev: 5, at: 1000 });
    expect(signed.ok).toBe(true);
    if (!signed.ok) throw new Error(signed.sentence);
    // the probe passes while the proof cites the current watched revision and is fresh
    const fresh = reg.probe("tile:clock", { now: 1500, watchWindowMs: 10_000, watchWindowRevs: 3 });
    expect(fresh.ok).toBe(true);
    if (fresh.ok) expect(fresh.proof.watchedRev).toBe(5);
    // kill the watch: the world moves on, no new proofs are signed → the nap is now a death
    for (let i = 0; i < 10; i++) reg.watchTick(); // rev 15; the proof still cites 5 → lag 10 > 3
    const stale = reg.probe("tile:clock", { now: 1500, watchWindowMs: 10_000, watchWindowRevs: 3 });
    expect(stale.ok).toBe(false);
    if (!stale.ok) { expect(stale.code).toBe(LIVENESS_PROOF_STALE); expect(stale.sentence).toContain("the watch died"); }
    // the temporal branch: time passes with no fresh proof → stale as well
    const aged = reg.probe("tile:clock", { now: 1500 + 20_000, watchWindowMs: 10_000, watchWindowRevs: 100 });
    expect(aged.ok).toBe(false);
    if (!aged.ok) expect(aged.code).toBe(LIVENESS_PROOF_STALE);
    // tampered testimony: a proof the fold cannot re-derive is drift, not a proof
    const tampered: DormancyProof = { ...signed.proof, digest: "sha256:deadbeef" };
    const drifted = probe("tile:clock", tampered, { now: 1500, watchWindowMs: 10_000, currentWatchRev: 5, watchWindowRevs: 3 });
    expect(drifted.ok).toBe(false);
    if (!drifted.ok) expect(drifted.code).toBe(LIVENESS_STATE_DRIFT);
  });
});

describe("F-LIVENESS.5 (ghost-refusal)", () => {
  test("a ghost's mutation attempt → LIVENESS_GHOST_WRITE; no queued write exists anywhere in the tree", () => {
    const reg = new LivenessRegistry();
    expect(reg.set({ tileId: "tile:shed", to: "ghost", by: "policy", at: 1 }).ok).toBe(true);
    const write = reg.attemptWrite("tile:shed");
    expect(write.ok).toBe(false);
    if (!write.ok) { expect(write.code).toBe(LIVENESS_GHOST_WRITE); expect(write.sentence).toContain("never write"); }
    // no queued write exists: the tree still holds exactly the placement row — the refusal left nothing behind
    expect(reg.historyOf("tile:shed").length).toBe(1);
    expect(reg.read().history.length).toBe(1);
    expect(reg.read().history[0]!.to).toBe("ghost");
    // a hydrated tile writes through the liveness door (the law gate owns the rest)
    expect(reg.set({ tileId: "tile:live", to: "dormant", by: "policy", at: 2 }).ok).toBe(true);
    expect(reg.wake({ tileId: "tile:live", budgetRef: "b", gateRef: "g", by: "policy", at: 3 }).ok).toBe(true);
    expect(reg.attemptWrite("tile:live").ok).toBe(true);
  });
});

describe("F-LIVENESS.6 (headless)", () => {
  test("1–5 daemon-only; liveness.read answers every question the badge could render", () => {
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-run", "src", "liveness.ts"), "utf-8");
    expect(/from\s+"@vivim\/(omega-)?(surfaces\/|canvas|web|daemon-client)/.test(src)).toBe(false);
    expect(/\b(document|window|navigator)\s*\./.test(src)).toBe(false);
    const reg = new LivenessRegistry();
    reg.set({ tileId: "tile:media", to: "ghost", by: "governor", at: 1 });
    reg.wake({ tileId: "tile:media", budgetRef: "b", gateRef: "g", by: "governor", at: 2 });
    reg.set({ tileId: "tile:media", to: "suspended", suspendReason: "pressure", by: "governor", at: 3 });
    const view = reg.read();
    expect(view.rendered).toContain("liveness.read — 1 tile(s)");
    expect(view.rendered).toContain("tile:media: suspended since 3");
    expect(view.rendered).toContain('"Suspended to relieve pressure. Tap to wake."'); // the badge sentence, as a row
  });
});

describe("F-LIVENESS.7 (loud-failure)", () => {
  test("zero quiet freezes — drift, unlawful edges, ungated wakes, and unknown writers are rows or refusals with sentences", () => {
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-run", "src", "liveness.ts"), "utf-8");
    for (const code of [LIVENESS_STATE_INVALID, LIVENESS_PROOF_STALE, LIVENESS_GHOST_WRITE, LIVENESS_WAKE_BUDGET_UNDECLARED, LIVENESS_BUDGET_REFUSED, LIVENESS_WAKE_UNGATED, LIVENESS_STATE_DRIFT]) {
      expect(src.includes(code)).toBe(true);
    }
    expect(/catch\s*(\([^)]*\))?\s*\{\s*\}/.test(src)).toBe(false); // no silent swallows
    const reg = new LivenessRegistry();
    // drift: a transition claiming a state the row cannot derive
    reg.set({ tileId: "t1", to: "ghost", by: "p", at: 1 });
    const drift = reg.set({ tileId: "t1", to: "dormant", from: "hydrated", by: "p", at: 2 });
    expect(drift.ok).toBe(false);
    if (!drift.ok) { expect(drift.code).toBe(LIVENESS_STATE_DRIFT); expect(drift.sentence).toContain("cannot derive"); }
    // unlawful edges: ghost→suspended is not in the machine; spawning hydrated bypasses the budget door
    const edge = reg.set({ tileId: "t1", to: "suspended", suspendReason: "battery", by: "p", at: 3 });
    expect(edge.ok).toBe(false);
    if (!edge.ok) { expect(edge.code).toBe(LIVENESS_STATE_INVALID); expect(edge.sentence).toContain("not in the state machine"); }
    const spawn = reg.set({ tileId: "t2", to: "hydrated", by: "p", at: 1 });
    expect(spawn.ok).toBe(false);
    if (!spawn.ok) expect(spawn.code).toBe(LIVENESS_STATE_INVALID);
    // the no-op ceremony
    const noop = reg.set({ tileId: "t1", to: "ghost", by: "p", at: 4 });
    expect(noop.ok).toBe(false);
    if (!noop.ok) expect(noop.code).toBe(LIVENESS_STATE_INVALID);
    // the ungated wake: budget in hand, no framed authority
    const ungated = reg.wake({ tileId: "t1", budgetRef: "b", gateRef: "", by: "p", at: 5 });
    expect(ungated.ok).toBe(false);
    if (!ungated.ok) { expect(ungated.code).toBe(LIVENESS_WAKE_UNGATED); expect(ungated.sentence).toContain("doing pays the gate"); }
    // a write from a tile no row derives
    const phantom = reg.attemptWrite("tile:phantom");
    expect(phantom.ok).toBe(false);
    if (!phantom.ok) expect(phantom.code).toBe(LIVENESS_STATE_DRIFT);
    // a proof from a non-dormant thing is drift, not testimony
    reg.set({ tileId: "t3", to: "dormant", by: "p", at: 1 });
    reg.wake({ tileId: "t3", budgetRef: "b", gateRef: "g", by: "p", at: 2 });
    const awake = reg.signProof({ tileId: "t3", signedBy: "r:t3", watchedRev: 1, at: 3 });
    expect(awake.ok).toBe(false);
    if (!awake.ok) expect(awake.code).toBe(LIVENESS_STATE_DRIFT);
    // the empty registry degrades honestly
    expect(new LivenessRegistry().read().rendered).toContain("0 tile(s), 0 proof(s)");
  });
});
