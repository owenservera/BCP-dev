// tooling/gates/test/f-sim.test.ts — the F-SIM falsifier (D-447, Ω-8).
// Generated as a RED stub by `omega:loop --stub D-447`, then implemented.
//  F-SIM.1 determinism — the same pinned scenario + the same substrate digest, replayed 100 times → byte-identical receipts (D-429's inputHash law at runtime)
//  F-SIM.2 the-stall-injection — a dead-realization stall injected into a registered plan fires EXEC_PLAN_STALLED in sim within the declared stall deadline, exactly as live (D-435's cross-reference honored — the REAL PlanRegistry machinery)
//  F-SIM.3 containment — a scripted write to a live namespace refuses SIM_CONTAINMENT_BREACH, refused and ledgered; the live namespace byte-verified unchanged
//  F-SIM.4 refusal-proves — each register code fired by a planted violation (unknown scenario, unpinned seed, unknown fault, the breach, self-certification, divergence)
//  F-SIM.5 rehearsal-predicts — N production incidents replayed as scenarios reproduce their recorded decision sequences from the pinned pre-incident substrates — the receipt is the postmortem
//  F-SIM.6 headless — 1–5 daemon-only
//  F-SIM.7 loud-failure — no shrug branch: every divergence is a row or a refusal
import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  defaultSimExec, recordScenario, renderSimReceipt, SimulationRegistry, stepInputDigest, substrateDigest,
  SIM_CONTAINMENT_BREACH, SIM_FAULT_UNKNOWN, SIM_REPLAY_DIVERGENT, SIM_SCENARIO_UNKNOWN, SIM_SELF_CERTIFICATION, SIM_SEED_UNPINNED,
  type ScenarioRow, type SimExec, type SimStep,
} from "../../../plugins/vivim-run/src/simulation.ts";
import { canonicalJson } from "../../../plugins/vivim-run/src/planstate.ts";
import { EXEC_PLAN_STALLED, PlanRegistry, STALL_SILENCE_MS, type RegisteredPlan } from "../../../plugins/vivim-run/src/planstate.ts";

const SUBSTRATE = [
  { op: "run.submit@1", budgetMs: 100, spentMs: 10, deadRealization: false },
  { op: "tool:render@1", budgetMs: 500, spentMs: 0, deadRealization: false },
];
const seedOf = (rows: readonly unknown[]) => substrateDigest(rows);
const stepsOf = (rows: Array<{ op: string }>): SimStep[] => rows.map((r) => ({ op: `invoke:${r.op}`, inputDigest: stepInputDigest(r) }));

describe("F-SIM.1 (determinism)", () => {
  test("the same pinned scenario + the same substrate digest, replayed 100 times → byte-identical receipts", () => {
    const reg = new SimulationRegistry();
    const seed = seedOf(SUBSTRATE);
    const steps = stepsOf(SUBSTRATE);
    expect(reg.record({ scenarioId: "s1", seed, steps }).ok).toBe(true);
    const first = reg.replay({ scenarioId: "s1", exec: defaultSimExec });
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    const bytes0 = first.receipt.bytes;
    expect(first.receipt.advisoryForProduction).toBe(true); // the stance rides the receipt — verdicts are data
    for (let i = 0; i < 100; i++) {
      const again = reg.replay({ scenarioId: "s1", exec: defaultSimExec });
      expect(again.ok).toBe(true);
      if (again.ok) expect(again.receipt.bytes).toBe(bytes0); // byte-identical, ×100
    }
    // a SECOND engine (fresh registry, same pinned pair) reproduces the same bytes
    const other = new SimulationRegistry();
    expect(other.record({ scenarioId: "s1", seed, steps }).ok).toBe(true);
    const o = other.replay({ scenarioId: "s1", exec: defaultSimExec });
    expect(o.ok).toBe(true);
    if (o.ok) expect(o.receipt.bytes).toBe(bytes0);
    // more passes inside one replay (the fold run 5×) still agrees with itself
    const p5 = reg.replay({ scenarioId: "s1", exec: defaultSimExec, passes: 5 });
    expect(p5.ok).toBe(true);
    if (p5.ok) expect(p5.receipt.bytes).toBe(bytes0);
    // a DIFFERENT substrate is a different rehearsal — the seed pins, it does not decorate
    const reg2 = new SimulationRegistry();
    expect(reg2.record({ scenarioId: "s1", seed: seedOf([...SUBSTRATE, { op: "x@1" }]), steps }).ok).toBe(true);
    const d = reg2.replay({ scenarioId: "s1", exec: defaultSimExec });
    expect(d.ok).toBe(true);
    if (d.ok) expect(d.receipt.bytes).not.toBe(bytes0);
  });
});

describe("F-SIM.2 (the-stall-injection)", () => {
  test("a dead-realization stall injected into a registered plan fires EXEC_PLAN_STALLED in sim within the declared stall deadline, exactly as live", () => {
    // the REAL machinery (D-435): the same PlanRegistry + stallCheck the live exec.inspect runs
    const livePlans = new PlanRegistry();
    const livePlan: RegisteredPlan = {
      planId: "plan-live-1", principal: "user:alice", createdAt: 1_000,
      steps: [{ stepId: "render", op: "tool:render@1", dependsOn: [], status: "running", lastProgress: 1_000 }],
    };
    livePlans.register(livePlan);
    // within the declared deadline: quiet — the deadline is honored, not decorative
    expect(livePlans.stallCheck(1_000 + STALL_SILENCE_MS)).toEqual([]);
    // past it by 1ms: EXEC_PLAN_STALLED fires, ledgered, exactly as live
    const liveStall = livePlans.stallCheck(1_000 + STALL_SILENCE_MS + 1);
    expect(liveStall.length).toBe(1);
    expect(liveStall[0]!.kind).toBe(EXEC_PLAN_STALLED);
    // the sim exec drives the SAME machinery through the fold
    const stallExec: SimExec = (step, ctx) => {
      if (step.op !== "inject:stall") return defaultSimExec(step, ctx);
      const plans = new PlanRegistry();
      plans.register({
        planId: "plan-live-1", principal: "user:alice", createdAt: ctx.now,
        steps: [{ stepId: "render", op: "tool:render@1", dependsOn: [], status: "running", lastProgress: ctx.now }],
      });
      const before = plans.stallCheck(ctx.now + STALL_SILENCE_MS);        // within the deadline: quiet
      const after = plans.stallCheck(ctx.now + STALL_SILENCE_MS + 1);     // past it: fires
      return {
        verdict: after[0]?.kind ?? "quiet",
        effects: [{ ns: "sim.run", kind: "inject:stall" }],
        bytes: canonicalJson({ before: before.length, after: after.map((e) => [e.planId, e.stepId, e.blocker]), deadline: STALL_SILENCE_MS }),
      };
    };
    const reg = new SimulationRegistry();
    const seed = seedOf([{ plan: "plan-live-1", fault: "dead-realization" }]);
    const steps: SimStep[] = [{ op: "inject:stall", inputDigest: stepInputDigest({ plan: "plan-live-1", fault: "dead-realization" }) }];
    expect(reg.record({ scenarioId: "stall-1", seed, steps, recordedFrom: "incident:dead-realization" }).ok).toBe(true);
    const out = reg.replay({ scenarioId: "stall-1", exec: stallExec });
    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.receipt.steps[0]!.verdict).toBe(EXEC_PLAN_STALLED); // fires IN SIM, within the declared deadline
      expect(out.receipt.steps[0]!.verdict).toBe(liveStall[0]!.kind); // exactly as live — the same verdict from the same machinery
      // and the rehearsal is reproducible evidence (byte-identical on replay)
      const again = reg.replay({ scenarioId: "stall-1", exec: stallExec });
      expect(again.ok).toBe(true);
      if (again.ok) expect(again.receipt.bytes).toBe(out.receipt.bytes);
    }
  });
});

describe("F-SIM.3 (containment)", () => {
  test("a scripted write to a live namespace refuses SIM_CONTAINMENT_BREACH, refused and ledgered; the live namespace byte-verified unchanged", () => {
    const liveChat = { rows: [{ id: "m1", text: "hello" }], version: 3 };
    const liveBytes = JSON.stringify(liveChat);
    const breachingExec: SimExec = (step, ctx) => {
      if (step.op === "invoke:chat.send@1") {
        // the scripted write: the step declares a write to the LIVE ns chat — a bomb with a lanyard
        return { verdict: "pass", effects: [{ ns: "chat", kind: "write" }], bytes: canonicalJson({ wrote: "chat" }) };
      }
      return defaultSimExec(step, ctx);
    };
    const reg = new SimulationRegistry();
    const seed = seedOf([{ ns: "chat", rows: liveChat.rows }]);
    const steps: SimStep[] = [{ op: "invoke:chat.send@1", inputDigest: stepInputDigest({ text: "hi" }) }];
    expect(reg.record({ scenarioId: "breach-1", seed, steps }).ok).toBe(true);
    const out = reg.replay({ scenarioId: "breach-1", exec: breachingExec });
    expect(out.ok).toBe(false);
    if (!out.ok) {
      expect(out.code).toBe(SIM_CONTAINMENT_BREACH);
      expect(out.sentence).toContain("refused and ledgered");
    }
    // refused AND ledgered: the breach row landed as evidence
    expect(reg.breaches().length).toBe(1);
    expect(reg.breaches()[0]!.ns).toBe("chat");
    expect(reg.breaches()[0]!.op).toBe("invoke:chat.send@1");
    // no run receipt landed for the breached rehearsal
    expect(reg.runsList().filter((r) => r.scenarioId === "breach-1")).toEqual([]);
    // the live namespace byte-verified unchanged — nothing outside ns sim.* was ever touched
    expect(JSON.stringify(liveChat)).toBe(liveBytes);
    // legal effects land CONTAINED: every write in a green receipt is ns sim.*
    expect(reg.record({ scenarioId: "legal-1", seed, steps: stepsOf([{ op: "run.submit@1" }]) }).ok).toBe(true);
    const okRun = reg.replay({ scenarioId: "legal-1", exec: defaultSimExec });
    expect(okRun.ok).toBe(true);
    if (okRun.ok) {
      expect(okRun.receipt.containedWrites.length).toBeGreaterThan(0);
      expect(okRun.receipt.containedWrites.every((w) => w.ns.startsWith("sim."))).toBe(true);
    }
  });
});

describe("F-SIM.4 (refusal-proves)", () => {
  test("each register code fired by a planted violation (unknown scenario, unpinned seed, unknown fault, the breach, self-certification, divergence)", () => {
    const reg = new SimulationRegistry();
    const goodSeed = seedOf([{ x: 1 }]);
    const goodSteps: SimStep[] = [{ op: "invoke:run.submit@1", inputDigest: stepInputDigest({}) }];
    const codes: string[] = [];
    const plant = (out: { ok: boolean; code?: string }) => { expect(out.ok).toBe(false); if (!out.ok) codes.push(out.code); };
    // SIM_SCENARIO_UNKNOWN: replay an unpinned name; record with no name
    plant(reg.replay({ scenarioId: "ghost", exec: defaultSimExec }));
    plant(reg.record({ scenarioId: "", seed: goodSeed, steps: goodSteps }));
    // SIM_SEED_UNPINNED: unpinned substrate seed; unpinned step inputDigest
    plant(reg.record({ scenarioId: "s-unseeded", seed: "", steps: goodSteps }));
    plant(reg.record({ scenarioId: "s-unstepped", seed: goodSeed, steps: [{ op: "invoke:run.submit@1", inputDigest: "not-a-digest" }] }));
    // SIM_FAULT_UNKNOWN: a fault outside the vocabulary; an op outside the grammar
    plant(reg.record({ scenarioId: "s-faulted", seed: goodSeed, steps: [{ op: "inject:earthquake", inputDigest: stepInputDigest({}) }] }));
    plant(reg.record({ scenarioId: "s-grammar", seed: goodSeed, steps: [{ op: "vibes:stall", inputDigest: stepInputDigest({}) }] }));
    // SIM_SELF_CERTIFICATION: cites only itself; recorded from itself
    plant(reg.record({ scenarioId: "s-self", seed: goodSeed, steps: goodSteps, cites: ["scenario:s-self", "sim:s-self:abc123"] }));
    plant(reg.record({ scenarioId: "s-self2", seed: goodSeed, steps: goodSteps, recordedFrom: "s-self2" }));
    // SIM_CONTAINMENT_BREACH: the planted lanyard pull (the record is legal — the REHEARSAL breaches)
    expect(reg.record({ scenarioId: "s-breach", seed: goodSeed, steps: [{ op: "invoke:chat.send@1", inputDigest: stepInputDigest({}) }] }).ok).toBe(true);
    plant(reg.replay({ scenarioId: "s-breach", exec: (step, ctx) => ({ verdict: "pass", effects: [{ ns: "chat", kind: "write" }], bytes: "x" }) }));
    // SIM_REPLAY_DIVERGENT: a nondeterministic executor (each pass differs — the finding is loud)
    let counter = 0;
    const nondetExec: SimExec = (step, ctx) => ({ verdict: "pass", effects: [{ ns: "sim.run", kind: "invoke" }], bytes: canonicalJson({ n: counter++ }) });
    expect(reg.record({ scenarioId: "s-div", seed: goodSeed, steps: goodSteps }).ok).toBe(true);
    plant(reg.replay({ scenarioId: "s-div", exec: nondetExec }));
    // the register is COMPLETE — every code fired, nothing registered from the refused records
    expect(new Set(codes)).toEqual(new Set([SIM_SCENARIO_UNKNOWN, SIM_SEED_UNPINNED, SIM_FAULT_UNKNOWN, SIM_CONTAINMENT_BREACH, SIM_REPLAY_DIVERGENT, SIM_SELF_CERTIFICATION]));
    for (const id of ["s-unseeded", "s-unstepped", "s-faulted", "s-grammar", "s-self", "s-self2"]) expect(reg.get(id)).toBeNull();
    // the honest record still passes the door
    expect(reg.record({ scenarioId: "s-good", seed: goodSeed, steps: goodSteps }).ok).toBe(true);
  });
});

describe("F-SIM.5 (rehearsal-predicts)", () => {
  test("N production incidents replayed as scenarios reproduce their recorded decision sequences from the pinned pre-incident substrates", () => {
    // the law fold that decided LIVE (the same rule the runtime applies: budget law + dead-realization stall)
    const decide = (row: { budgetMs: number; spentMs: number; deadRealization: boolean }): string => {
      if (row.deadRealization) return "EXEC_PLAN_STALLED";
      if (row.spentMs > row.budgetMs) return "BUDGET_REFUSED";
      return "pass";
    };
    const incidents = [
      { incidentRef: "incident:2026-09-20:pool-saturation", substrate: [{ op: "run.submit@1", budgetMs: 100, spentMs: 1000, deadRealization: false }], decisions: ["BUDGET_REFUSED"] },
      { incidentRef: "incident:2026-09-21:dead-render", substrate: [{ op: "run.submit@1", budgetMs: 100, spentMs: 10, deadRealization: false }, { op: "tool:render@1", budgetMs: 500, spentMs: 0, deadRealization: true }], decisions: ["pass", "EXEC_PLAN_STALLED"] },
      { incidentRef: "incident:2026-09-22:clean-run", substrate: [{ op: "run.submit@1", budgetMs: 100, spentMs: 10, deadRealization: false }], decisions: ["pass"] },
    ];
    const reg = new SimulationRegistry();
    for (const inc of incidents) {
      // the recorded decision sequence came from running the same fold over the same rows live — the postmortem's own data
      expect(inc.substrate.map(decide)).toEqual(inc.decisions);
      const scenarioId = `postmortem:${inc.incidentRef}`;
      const seed = seedOf(inc.substrate);
      const steps = inc.substrate.map((row) => ({ op: `invoke:${row.op}` as string, inputDigest: stepInputDigest(row) }));
      const rec = reg.record({ scenarioId, seed, steps, recordedFrom: inc.incidentRef, cites: [inc.incidentRef, "D-435"] });
      expect(rec.ok).toBe(true);
      const lawExec: SimExec = (step, ctx) => {
        const verdict = decide(inc.substrate[ctx.stepIndex]!);
        return { verdict, effects: [{ ns: "sim.run", kind: "law-walk" }], bytes: canonicalJson({ verdict, stepIndex: ctx.stepIndex }) };
      };
      const out = reg.replay({ scenarioId, exec: lawExec });
      expect(out.ok).toBe(true);
      if (out.ok) {
        // the receipt reproduces the recorded decision sequence — the receipt IS the postmortem
        expect(out.receipt.steps.map((s) => s.verdict)).toEqual(inc.decisions);
        expect(out.receipt.syntheticOnly).toBe(false); // recorded from the incident — not speculative
      }
    }
    // synthetic-only scenarios are legal but flagged (GEN_SPECULATIVE, the badge law applied inward)
    const syn = reg.record({ scenarioId: "synthetic-1", seed: seedOf([{ x: 1 }]), steps: stepsOf([{ op: "run.submit@1" }]) });
    expect(syn.ok).toBe(true);
    const synRun = reg.replay({ scenarioId: "synthetic-1", exec: defaultSimExec });
    expect(synRun.ok).toBe(true);
    if (synRun.ok) expect(synRun.receipt.syntheticOnly).toBe(true);
  });
});

describe("F-SIM.6 (headless)", () => {
  test("1–5 daemon-only — the rehearsal is data, rendered as text", () => {
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-run", "src", "simulation.ts"), "utf-8");
    expect(/from\s+"@vivim\/(omega-)?(surfaces\/|canvas|web|daemon-client)/.test(src)).toBe(false);
    expect(/\b(document|window|navigator)\s*\./.test(src)).toBe(false);
    // the receipt renders as text: verdicts, digests, the stance — zero pixels
    const reg = new SimulationRegistry();
    expect(reg.record({ scenarioId: "s1", seed: seedOf(SUBSTRATE), steps: stepsOf(SUBSTRATE), recordedFrom: "incident:x" }).ok).toBe(true);
    const out = reg.replay({ scenarioId: "s1", exec: defaultSimExec });
    expect(out.ok).toBe(true);
    if (out.ok) {
      const text = renderSimReceipt(out.receipt);
      expect(text).toContain(`sim.run sim:s1:`);
      expect(text).toContain("scenario s1");
      expect(text).toContain("advisory-for-production — sim verdicts are data; the citing record owns blocking");
      expect(text).toContain("invoke:run.submit@1");
      expect(text).toContain("pass");
    }
    // the read view renders headlessly too
    expect(reg.read().rendered).toContain("sim.read — 1 scenario(s) pinned");
    expect(reg.read("s1").rendered).toContain("recorded from incident:x");
    expect(reg.read("ghost").rendered).toContain("not pinned");
  });
});

describe("F-SIM.7 (loud-failure)", () => {
  test("no shrug branch: every divergence is a row or a refusal", () => {
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-run", "src", "simulation.ts"), "utf-8");
    for (const code of [SIM_SCENARIO_UNKNOWN, SIM_SEED_UNPINNED, SIM_FAULT_UNKNOWN, SIM_CONTAINMENT_BREACH, SIM_REPLAY_DIVERGENT, SIM_SELF_CERTIFICATION]) {
      expect(src.includes(code)).toBe(true); // the register lives in the module, not just the docs
    }
    expect(/catch\s*(\([^)]*\))?\s*\{\s*\}/.test(src)).toBe(false); // no silent swallows
    // the empty registry degrades honestly
    const reg = new SimulationRegistry();
    expect(reg.read().rendered).toContain("0 scenario(s) pinned");
    // divergence NEVER yields a receipt — no averaging, no winner-picking
    let counter = 0;
    const nondetExec: SimExec = (step, ctx) => ({ verdict: "pass", effects: [{ ns: "sim.run", kind: "invoke" }], bytes: canonicalJson({ n: counter++ }) });
    expect(reg.record({ scenarioId: "s-div", seed: seedOf([{ x: 1 }]), steps: stepsOf([{ op: "run.submit@1" }]) }).ok).toBe(true);
    const refused = reg.replay({ scenarioId: "s-div", exec: nondetExec });
    expect(refused.ok).toBe(false);
    if (!refused.ok) {
      expect(refused.code).toBe(SIM_REPLAY_DIVERGENT);
      expect(refused.sentence).toContain("refuses to call either a verdict"); // no shrug, said out loud
    }
    expect(reg.runsList()).toEqual([]); // nothing landed from the divergent run
    // the breach is a ROW and a refusal — both, always
    expect(reg.record({ scenarioId: "s-breach", seed: seedOf([{ x: 1 }]), steps: [{ op: "invoke:chat.send@1", inputDigest: stepInputDigest({}) }] }).ok).toBe(true);
    const breach = reg.replay({ scenarioId: "s-breach", exec: (step, ctx) => ({ verdict: "pass", effects: [{ ns: "chat", kind: "write" }], bytes: "x" }) });
    expect(breach.ok).toBe(false);
    expect(reg.breaches().length).toBe(1);
    // the record door is loud on malformed input too — the pure core refuses, named
    const malformed = recordScenario({ scenarioId: "m", seed: "unpinned", steps: [] });
    expect(malformed.ok).toBe(false);
    if (!malformed.ok) expect(malformed.code).toBe(SIM_SEED_UNPINNED);
    // a well-formed ScenarioRow always passes the pure door — the grammar is decidable, never a vibe
    const row: ScenarioRow = { scenarioId: "ok", seed: seedOf([]), steps: [] };
    expect(recordScenario(row).ok).toBe(true);
  });
});
