// vivim-run/src/simulation.ts (D-447, Ω-8 — the simulation substrate, re-materialized spec paper D-432)
//
// The rehearsal before the show: a scenario is a PINNED script of typed steps
// ({op, inputDigest}) against a PINNED seed; the replay fold is deterministic
// (same scenario + same seeded substrate ⇒ byte-identical receipts — D-429's
// inputHash law promoted from tooling to runtime); divergence refuses
// SIM_REPLAY_DIVERGENT (the engine never averages, never picks a winner);
// containment is absolute (writes land only in ns sim.* — anything else
// refuses SIM_CONTAINMENT_BREACH, refused AND ledgered); a simulation citing
// only itself proves nothing (SIM_SELF_CERTIFICATION); and the stance is
// advisory-for-production — sim verdicts are DATA, the citing record owns
// blocking.
//
// Pure core: the exec seam carries the machinery (the falsifiers bind the
// REAL PlanRegistry stall sweep through it); no timers, no I/O, no ML.
import { canonicalJson, sha256Hex } from "./planstate.ts";

export const SIM_SCENARIO_NS = "sim.scenario";
export const SIM_RUN_NS = "sim.run";
export const SIM_SCENARIO_UNKNOWN = "SIM_SCENARIO_UNKNOWN";
export const SIM_SEED_UNPINNED = "SIM_SEED_UNPINNED";
export const SIM_FAULT_UNKNOWN = "SIM_FAULT_UNKNOWN";
export const SIM_CONTAINMENT_BREACH = "SIM_CONTAINMENT_BREACH";
export const SIM_REPLAY_DIVERGENT = "SIM_REPLAY_DIVERGENT";
export const SIM_SELF_CERTIFICATION = "SIM_SELF_CERTIFICATION";

/** The fault vocabulary (the spec's grammar): an unnamed fault is a surprise,
 *  and surprises are what rehearsals exist to prevent. */
export const FAULTS = ["stall", "kill", "budget-exhaust", "drift", "refusal-forge", "load"] as const;
export type Fault = (typeof FAULTS)[number];

const DIGEST_RE = /^sha256:[0-9a-f]{64}$/;
const STEP_GRAMMAR_RE = /^(invoke|inject):(.+)$/;

export interface SimStep {
  op: string;            // "invoke:<op>" | "inject:<fault>"
  inputDigest: string;   // sha256 of the step's pinned input bytes
}

export interface ScenarioRow {
  scenarioId: string;
  seed: string;          // the PINNED substrate digest — replaying against a moving world is divination
  steps: SimStep[];
  recordedFrom?: string; // the incident/decision this scenario was recorded from (the postmortem ref)
}

export interface SimEffect { ns: string; kind: string }

export interface SimStepOutcome {
  verdict: string;       // "pass" | "EXEC_PLAN_STALLED" | a refusal code | … — DATA, never a gate
  effects: SimEffect[];  // the writes the step intends — containment-checked by the fold
  bytes: string;         // the canonical outcome bytes — the digest input
}

export type SimExec = (step: SimStep, ctx: { seed: string; stepIndex: number; now: number }) => SimStepOutcome;

export interface SimReceipt {
  kind: "sim.run@1";
  runRef: string;            // derived from the replay digest — deterministic, never a clock
  scenarioId: string;
  seed: string;              // the pinned substrate the replay ran against (startedFrom)
  steps: Array<{ op: string; inputDigest: string; outcomeDigest: string; verdict: string }>;
  containedWrites: SimEffect[]; // the effects that landed — ns sim.* only, by construction
  replayDigest: string;      // byte-identical across replays of the same pinned pair
  bytes: string;             // the canonical receipt bytes
  syntheticOnly: boolean;    // no recordedFrom — GEN_SPECULATIVE, the badge law applied inward
  advisoryForProduction: true; // sim verdicts are data; the citing record owns blocking
}

/** The containment breach, refused AND ledgered (evidence, not silence). */
export interface SimBreachRow {
  kind: "sim.breach@1";
  scenarioId: string;
  stepIndex: number;
  op: string;
  ns: string;               // the live namespace the rehearsal attempted to touch
  at: number;               // the fold's deterministic step clock, not a wall clock
  sentence: string;
}

export type RecordOutcome = { ok: true; row: ScenarioRow } | { ok: false; code: string; sentence: string };
export type ReplayOutcome = { ok: true; receipt: SimReceipt } | { ok: false; code: string; sentence: string };

/** Pin a substrate slice: the digest scenarios run against. */
export function substrateDigest(rows: readonly unknown[]): string {
  return `sha256:${sha256Hex(canonicalJson(rows))}`;
}

/** Pin a step's input bytes. */
export function stepInputDigest(input: unknown): string {
  return `sha256:${sha256Hex(canonicalJson(input))}`;
}

/** The fold's deterministic clock: derived from the PINNED seed, never the
 *  wall — the whole replay is a pure function of (scenario, seed, exec). */
export function seedClock(seed: string): number {
  const hex = seed.replace(/^sha256:/, "").slice(0, 12);
  return parseInt(hex, 16) || 0;
}

export const SIM_STEP_MS = 1_000; // the per-step clock stride inside a rehearsal

function isSelfReference(scenarioId: string, ref: string): boolean {
  return ref === scenarioId || ref === `scenario:${scenarioId}` || ref.startsWith(`sim:${scenarioId}`) || ref.startsWith(`sim.run:${scenarioId}`);
}

/** THE record door (D-447): pin a scenario — named, seeded, grammar-gated,
 *  self-certification refused. Synthetic-only scenarios (no recordedFrom, no
 *  cites) are legal but their receipts carry the speculative flag. */
export function recordScenario(spec: { scenarioId: string; seed: string; steps: SimStep[]; recordedFrom?: string; cites?: string[] }): RecordOutcome {
  if (typeof spec.scenarioId !== "string" || spec.scenarioId.length === 0) {
    return { ok: false, code: SIM_SCENARIO_UNKNOWN, sentence: `${SIM_SCENARIO_UNKNOWN}: no scenario id — the engine rehearses named things only (D-447, Ω-8)` };
  }
  if (typeof spec.seed !== "string" || !DIGEST_RE.test(spec.seed)) {
    return { ok: false, code: SIM_SEED_UNPINNED, sentence: `${SIM_SEED_UNPINNED}: scenario ${spec.scenarioId}'s substrate seed is unpinned (${JSON.stringify(spec.seed)}) — replaying against a moving world is divination, not rehearsal (D-447)` };
  }
  if (!Array.isArray(spec.steps)) {
    return { ok: false, code: SIM_FAULT_UNKNOWN, sentence: `${SIM_FAULT_UNKNOWN}: scenario ${spec.scenarioId} has no step list — a script is a list of steps, named and pinned (D-447)` };
  }
  for (const step of spec.steps) {
    const m = STEP_GRAMMAR_RE.exec(step?.op ?? "");
    if (m === null) {
      return { ok: false, code: SIM_FAULT_UNKNOWN, sentence: `${SIM_FAULT_UNKNOWN}: step op ${JSON.stringify(step?.op)} is not in the step grammar (invoke:<op> | inject:<fault>) — an unnamed step is a surprise, and surprises are what rehearsals exist to prevent (D-447)` };
    }
    if (m[1] === "inject" && !(FAULTS as readonly string[]).includes(m[2]!)) {
      return { ok: false, code: SIM_FAULT_UNKNOWN, sentence: `${SIM_FAULT_UNKNOWN}: inject '${m[2]}' is not in the fault vocabulary (${FAULTS.join("|")}) — an unnamed fault is a surprise, and surprises are what rehearsals exist to prevent (D-447)` };
    }
    if (typeof step?.inputDigest !== "string" || !DIGEST_RE.test(step.inputDigest)) {
      return { ok: false, code: SIM_SEED_UNPINNED, sentence: `${SIM_SEED_UNPINNED}: step ${step.op} of ${spec.scenarioId} carries an unpinned inputDigest — unpinned inputs make the replay a moving target (D-447)` };
    }
  }
  // self-certification: a simulation citing only itself proves nothing
  if (spec.recordedFrom !== undefined && isSelfReference(spec.scenarioId, spec.recordedFrom)) {
    return { ok: false, code: SIM_SELF_CERTIFICATION, sentence: `${SIM_SELF_CERTIFICATION}: scenario ${spec.scenarioId} is recorded from itself — a simulation citing only itself proves nothing; the citing record owns the verdict (D-447, Ω-8)` };
  }
  if (spec.cites !== undefined && spec.cites.length > 0 && spec.cites.every((c) => isSelfReference(spec.scenarioId, c))) {
    return { ok: false, code: SIM_SELF_CERTIFICATION, sentence: `${SIM_SELF_CERTIFICATION}: scenario ${spec.scenarioId} cites only itself (${spec.cites.join(", ")}) — a simulation citing only itself proves nothing; the citing record owns the verdict (D-447, Ω-8)` };
  }
  return {
    ok: true,
    row: {
      scenarioId: spec.scenarioId,
      seed: spec.seed,
      steps: spec.steps.map((s) => ({ op: s.op, inputDigest: s.inputDigest })),
      ...(spec.recordedFrom !== undefined && spec.recordedFrom.length > 0 ? { recordedFrom: spec.recordedFrom } : {}),
    },
  };
}

/** THE replay fold (D-447): state₀ = seed; each step chains
 *  sha256(state ‖ op ‖ inputDigest ‖ outcomeDigest). Containment is checked
 *  per effect BEFORE anything lands — a rehearsal never writes truth it would
 *  then have to unrehearse. Pure over (scenario, seed, exec). */
export function replayFold(
  scenario: ScenarioRow,
  opts: { exec: SimExec; baseNow?: number },
): { ok: true; steps: SimReceipt["steps"]; containedWrites: SimEffect[]; replayDigest: string; bytes: string }
  | { ok: false; code: typeof SIM_CONTAINMENT_BREACH; breach: SimBreachRow } {
  const base = opts.baseNow ?? seedClock(scenario.seed);
  let state = `sha256:${sha256Hex(scenario.seed + "|" + scenario.scenarioId)}`;
  const steps: SimReceipt["steps"] = [];
  const containedWrites: SimEffect[] = [];
  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i]!;
    const outcome = opts.exec(step, { seed: scenario.seed, stepIndex: i, now: base + i * SIM_STEP_MS });
    for (const eff of outcome.effects) {
      if (!eff.ns.startsWith("sim.")) {
        const sentence = `${SIM_CONTAINMENT_BREACH}: step ${i} (${step.op}) attempted a write to ns ${eff.ns} — a bomb with a lanyard is still a bomb, and the attempt is refused and ledgered (D-447, Ω-8)`;
        return {
          ok: false,
          code: SIM_CONTAINMENT_BREACH,
          breach: { kind: "sim.breach@1", scenarioId: scenario.scenarioId, stepIndex: i, op: step.op, ns: eff.ns, at: base + i * SIM_STEP_MS, sentence },
        };
      }
      containedWrites.push(eff);
    }
    const outcomeDigest = `sha256:${sha256Hex(outcome.bytes)}`;
    state = `sha256:${sha256Hex(`${state}|${step.op}|${step.inputDigest}|${outcomeDigest}`)}`;
    steps.push({ op: step.op, inputDigest: step.inputDigest, outcomeDigest, verdict: outcome.verdict });
  }
  const receiptFrame = { scenarioId: scenario.scenarioId, seed: scenario.seed, steps, replayDigest: state };
  return { ok: true, steps, containedWrites, replayDigest: state, bytes: canonicalJson(receiptFrame) };
}

/** The receipt a green replay lands (deterministic runRef — derived from the
 *  digest, never a clock). */
export function buildReceipt(scenario: ScenarioRow, fold: { steps: SimReceipt["steps"]; containedWrites: SimEffect[]; replayDigest: string; bytes: string }): SimReceipt {
  return {
    kind: "sim.run@1",
    runRef: `sim:${scenario.scenarioId}:${fold.replayDigest.slice(7, 19)}`,
    scenarioId: scenario.scenarioId,
    seed: scenario.seed,
    steps: fold.steps,
    containedWrites: fold.containedWrites,
    replayDigest: fold.replayDigest,
    bytes: fold.bytes,
    syntheticOnly: scenario.recordedFrom === undefined,
    advisoryForProduction: true,
  };
}

/** The contained deterministic executor: the op layer's default. Real-machinery
 *  executors (the plan-stall sweep, law walks) bind through the same seam —
 *  the falsifiers exercise those against the REAL PlanRegistry. */
export function defaultSimExec(step: SimStep, ctx: { seed: string; stepIndex: number; now: number }): SimStepOutcome {
  if (step.op.startsWith("inject:")) {
    const fault = step.op.slice("inject:".length);
    return {
      verdict: `SIM_INJECTED_${fault.toUpperCase().replace(/-/g, "_")}`,
      effects: [{ ns: SIM_RUN_NS, kind: `inject:${fault}` }],
      bytes: canonicalJson({ fault, stepIndex: ctx.stepIndex, inputDigest: step.inputDigest }),
    };
  }
  return {
    verdict: "pass",
    effects: [{ ns: SIM_RUN_NS, kind: "invoke" }],
    bytes: canonicalJson({ op: step.op, stepIndex: ctx.stepIndex, inputDigest: step.inputDigest }),
  };
}

/** The headless receipt render: text, verdicts as data, the stance stated. */
export function renderSimReceipt(receipt: SimReceipt): string {
  const lines = [
    `sim.run ${receipt.runRef} — scenario ${receipt.scenarioId} (seed ${receipt.seed.slice(0, 22)}…) · ${receipt.steps.length} step(s) · replayDigest ${receipt.replayDigest.slice(0, 22)}…`,
    `  stance: advisory-for-production — sim verdicts are data; the citing record owns blocking${receipt.syntheticOnly ? " · GEN_SPECULATIVE (synthetic-only: nothing recorded from)" : ""}`,
  ];
  for (const s of receipt.steps) lines.push(`  ${s.verdict.padEnd(20)} ${s.op} (${s.inputDigest.slice(7, 17)}…)`);
  return lines.join("\n");
}

/** The in-plugin registry (ring-first; the vault mirror rides port caps). */
export class SimulationRegistry {
  private scenarios = new Map<string, ScenarioRow>();
  private runs = new Map<string, SimReceipt>();   // ns sim.run — keyed by deterministic runRef
  private breachLedger: SimBreachRow[] = [];

  record(spec: Parameters<typeof recordScenario>[0]): RecordOutcome {
    if (this.scenarios.has(spec.scenarioId)) {
      return { ok: false, code: SIM_SCENARIO_UNKNOWN, sentence: `scenario ${spec.scenarioId} is already pinned — pin a successor id, never re-pin a name (D-447)` };
    }
    const out = recordScenario(spec);
    if (out.ok) this.scenarios.set(out.row.scenarioId, out.row);
    return out;
  }

  /** THE rehearsal: run the fold ≥2 passes; identical digests land the receipt
   *  (a sim.run row — MUTATION), any divergence refuses SIM_REPLAY_DIVERGENT
   *  naming the step; a containment breach is refused AND ledgered. */
  replay(spec: { scenarioId: string; exec: SimExec; passes?: number }): ReplayOutcome {
    const row = this.scenarios.get(spec.scenarioId);
    if (row === undefined) {
      return { ok: false, code: SIM_SCENARIO_UNKNOWN, sentence: `${SIM_SCENARIO_UNKNOWN}: no scenario '${spec.scenarioId}' is pinned — the engine rehearses named things only (D-447, Ω-8)` };
    }
    if (typeof row.seed !== "string" || !DIGEST_RE.test(row.seed)) {
      return { ok: false, code: SIM_SEED_UNPINNED, sentence: `${SIM_SEED_UNPINNED}: scenario ${row.scenarioId}'s seed is unpinned — replaying against a moving world is divination, not rehearsal (D-447)` };
    }
    const passes = Math.max(2, spec.passes ?? 2);
    const folds: Array<ReturnType<typeof replayFold>> = [];
    for (let p = 0; p < passes; p++) {
      const fold = replayFold(row, { exec: spec.exec });
      if (!fold.ok) {
        this.breachLedger.push(fold.breach); // refused AND ledgered
        return { ok: false, code: fold.code, sentence: fold.breach.sentence };
      }
      folds.push(fold);
    }
    const first = folds[0]!;
    for (let p = 1; p < folds.length; p++) {
      if (folds[p]!.replayDigest !== first.replayDigest) {
        const split = first.steps.findIndex((s, i) => folds[p]!.steps[i]!.outcomeDigest !== s.outcomeDigest);
        return {
          ok: false,
          code: SIM_REPLAY_DIVERGENT,
          sentence: `${SIM_REPLAY_DIVERGENT}: two passes of the same pinned scenario ${row.scenarioId} diverged${split >= 0 ? ` at step ${split} (${first.steps[split]!.op})` : ""} (digests ${first.replayDigest.slice(0, 22)}… vs ${folds[p]!.replayDigest.slice(0, 22)}…) — the engine refuses to call either a verdict; nondeterminism is a finding, loudly (D-447, Ω-8)`,
        };
      }
    }
    const receipt = buildReceipt(row, first);
    this.runs.set(receipt.runRef, receipt);
    return { ok: true, receipt };
  }

  get(scenarioId: string): ScenarioRow | null { return this.scenarios.get(scenarioId) ?? null; }
  breaches(): readonly SimBreachRow[] { return this.breachLedger; }
  runsList(): SimReceipt[] { return [...this.runs.values()].sort((a, b) => (a.runRef < b.runRef ? -1 : 1)); }

  /** The headless read view. */
  read(scenarioId?: string): { row: ScenarioRow | null; rendered: string } {
    if (scenarioId !== undefined) {
      const row = this.scenarios.get(scenarioId) ?? null;
      const runs = this.runsList().filter((r) => r.scenarioId === scenarioId);
      const lines = [
        row === null
          ? `scenario ${scenarioId} is not pinned — the engine rehearses named things only (D-447)`
          : `scenario ${row.scenarioId} — seed ${row.seed.slice(0, 22)}… · ${row.steps.length} step(s)${row.recordedFrom !== undefined ? ` · recorded from ${row.recordedFrom}` : " · synthetic-only (GEN_SPECULATIVE)"}`,
      ];
      for (const r of runs) lines.push(renderSimReceipt(r));
      return { row, rendered: lines.join("\n") };
    }
    const lines = [`sim.read — ${this.scenarios.size} scenario(s) pinned, ${this.runs.size} run receipt(s), ${this.breachLedger.length} containment breach(es)`];
    for (const r of this.runsList()) lines.push(renderSimReceipt(r));
    for (const b of this.breachLedger) lines.push(`  ${b.kind} ${b.scenarioId} step ${b.stepIndex} (${b.op}) → ns ${b.ns} — refused and ledgered`);
    return { row: null, rendered: lines.join("\n") };
  }
}
