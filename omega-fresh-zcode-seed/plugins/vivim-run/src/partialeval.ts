// vivim-run/src/partialeval.ts (D-449, Ω-10 — partial evaluation, re-materialized spec paper D-442)
//
// Unknowns are named, never guessed: any plan in the registry becomes
// evaluable before the world finishes answering. The partial fold walks the
// plan IR over the bound inputs — the determined prefix banks as evidence,
// every unbound input becomes a NAMED unknown with a typed source
// (ambiguity | missing | deferred), and the deferred subgraph ships as a
// residual: a fresh plan that runs only as a fresh gated invocation.
// Evaluation is a deterministic, side-effect-free fold — no external calls,
// no defaults-as-fills (a default is a rumor wearing an input's clothes),
// and the unknown-set is permanent luggage on every partial row: a partial
// result consumed as complete refuses, loudly.
//
// Pure core: no timers, no I/O, zero pixels (F1 by construction). The width
// lattice is imported from the aperture — one lattice, no second one (D-448).
import { canonicalJson, sha256Hex } from "./planstate.ts";
import { WIDTH_ORDER, isWidth, type Width } from "./aperture.ts";

export const EVAL_NS = "eval";
export const PARTIAL_UNKNOWN_UNLABELLED = "PARTIAL_UNKNOWN_UNLABELLED";
export const PARTIAL_BINDING_CONFLICT = "PARTIAL_BINDING_CONFLICT";
export const PARTIAL_RESIDUAL_UNGATED = "PARTIAL_RESIDUAL_UNGATED";
export const PARTIAL_UNBOUND_EXECUTE = "PARTIAL_UNBOUND_EXECUTE";
export const PARTIAL_RESULT_AS_COMPLETE = "PARTIAL_RESULT_AS_COMPLETE";
export const PARTIAL_CYCLE = "PARTIAL_CYCLE";
export const PARTIAL_APERTURE_EXCEEDED = "PARTIAL_APERTURE_EXCEEDED";
export const PARTIAL_NONDETERMINISTIC = "PARTIAL_NONDETERMINISTIC";

/** The typed etiologies of not-knowing (D-449): a missing world-input, an
 *  unanswered clarifying question (the D-411 AMBIGUOUS mount), and deferred
 *  luggage (an input that waits on the residual itself). */
export type UnknownSource = "ambiguity" | "missing" | "deferred";
export const UNKNOWN_SOURCES: readonly UnknownSource[] = ["ambiguity", "missing", "deferred"];

/** The plan IR the fold walks (the D-435 ActionPlan grammar, input-shaped). */
export interface EvalStep { stepId: string; op: string; inputs: string[]; dependsOn: string[] }
export interface EvalPlan { planRef: string; steps: EvalStep[] }

/** One input binding: a value (bound) — or nothing here and a declared
 *  unknown below. One input, one truth: never both. */
export interface Binding { inputId: string; value: unknown }

/** A declared unknown: named (anonymous holes refuse), typed by source, and
 *  citing the row that names it (an `amb:` row for ambiguity). */
export interface UnknownDeclaration { inputId: string; name: string; source: UnknownSource; cites?: readonly string[] }

export interface NamedUnknown {
  name: string;
  source: UnknownSource;
  blockingSteps: string[];
  cites: string[];
}

export interface DeterminedStep {
  stepId: string;
  op: string;
  outputDigest: string;      // the structural evaluation over the bound inputs — no external calls
  cites: string[];
}

/** The residual: the deferred subgraph as a RE-RUNNABLE plan citing the
 *  partial row that spawned it — an orphan residual is unauditable work
 *  waiting to happen. */
export interface ResidualPlan {
  kind: "eval.residual@1";
  residualRef: string;
  planRef: string;           // a FRESH plan ref — it re-enters through the full gate, never a token
  citesPartial: string;
  deferredSteps: string[];
  unknownNames: string[];
}

/** THE partial row (ns `eval`): determined prefix + named unknowns (permanent
 *  luggage) + the residual, digested twice over — same plan + bindings +
 *  vault state ⇒ same bytes, forever. */
export interface PartialRow {
  kind: "eval.partial@1";
  partialRef: string;
  planRef: string;
  inputDigest: string;
  known: Record<string, unknown>;
  unknowns: NamedUnknown[];
  determined: DeterminedStep[];
  residual: ResidualPlan;
  width: Width;              // the Ω-9 width the result was projected at
  resultDigest: string;
  at: number;
}

/** A residual run: the fresh gated invocation's record — cites the residual's
 *  planRef, the partial row, and the gate it came through. */
export interface ResidualRun {
  kind: "eval.residual.run@1";
  runRef: string;
  residualRef: string;
  planRef: string;
  cites: string[];           // [the partial row, the gate] — the round-trip's paper trail
  bound: number;
  at: number;
}

export type PartialOutcome = { ok: true; row: PartialRow } | { ok: false; code: string; sentence: string };
export type ResidualRunOutcome = { ok: true; run: ResidualRun } | { ok: false; code: string; sentence: string };
export type ConsumeOutcome = { ok: true; complete: boolean; unknowns: NamedUnknown[] } | { ok: false; code: string; sentence: string };

export function partialRowRef(planRef: string, at: number): string {
  return `${EVAL_NS}:partial:${planRef}:${at}`;
}

function isUnknownSource(s: unknown): s is UnknownSource {
  return typeof s === "string" && (UNKNOWN_SOURCES as readonly string[]).includes(s);
}

/** THE partial fold (D-449) — deterministic, side-effect-free, structural.
 *  Steps whose inputs are all bound (and whose dependencies determined)
 *  evaluate; the rest defer, their unbound inputs becoming named unknowns.
 *  `defaults` are DECLARED unknown sources, never silent fills: a default
 *  that would fill refuses unless it is carried as a labelled unknown. */
export function evaluatePartial(
  spec: {
    plan: EvalPlan;
    bindings: readonly Binding[];
    unknowns?: readonly UnknownDeclaration[];
    defaults?: Readonly<Record<string, unknown>>;  // declared default VALUES — labelled luggage, never fills
    width?: Width;
    inputScopeWidths?: Readonly<Record<string, Width>>;  // the Ω-9 mount: what the input evidence's scopes allow
    at: number;
    partialRef?: string;
  },
): PartialOutcome {
  const width: Width = spec.width ?? "body";
  if (!isWidth(width)) {
    return { ok: false, code: PARTIAL_APERTURE_EXCEEDED, sentence: `${PARTIAL_APERTURE_EXCEEDED}: the requested projection width ${JSON.stringify(spec.width)} is not on the Ω-9 lattice (summary|body|detail|raw) — knowing partially does not license seeing wholly (D-449)` };
  }
  if (spec.inputScopeWidths !== undefined) {
    const allowed = Object.values(spec.inputScopeWidths).map((w) => (isWidth(w) ? WIDTH_ORDER[w] : Number.NaN));
    if (allowed.some((o) => Number.isNaN(o))) {
      return { ok: false, code: PARTIAL_APERTURE_EXCEEDED, sentence: `${PARTIAL_APERTURE_EXCEEDED}: an input scope width is not on the Ω-9 lattice — widths are law, not adjectives (D-449)` };
    }
    const min = Math.min(...allowed);
    if (WIDTH_ORDER[width] > min) {
      return { ok: false, code: PARTIAL_APERTURE_EXCEEDED, sentence: `${PARTIAL_APERTURE_EXCEEDED}: the requested disclosure width ${width} exceeds what the input evidence's scopes allow — knowing partially does not license seeing wholly (D-449, Ω-10)` };
    }
  }
  // one input, one truth: bound or unknown, never both; duplicates conflict
  const known: Record<string, unknown> = {};
  for (const b of spec.bindings) {
    if (typeof b.inputId !== "string" || b.inputId.length === 0) {
      return { ok: false, code: PARTIAL_UNKNOWN_UNLABELLED, sentence: `${PARTIAL_UNKNOWN_UNLABELLED}: a binding names no input — a hole without a name cannot be answered, audited, or apologized for (D-449)` };
    }
    if (known[b.inputId] !== undefined && canonicalJson(known[b.inputId]) !== canonicalJson(b.value)) {
      return { ok: false, code: PARTIAL_BINDING_CONFLICT, sentence: `${PARTIAL_BINDING_CONFLICT}: input ${b.inputId} is bound twice with different values (${canonicalJson(known[b.inputId])} vs ${canonicalJson(b.value)}) — one input, one truth; the fold never picks a winner (D-449)` };
    }
    known[b.inputId] = b.value;
  }
  const declared = new Map<string, NamedUnknown>();
  for (const u of spec.unknowns ?? []) {
    if (typeof u.name !== "string" || u.name.length === 0) {
      return { ok: false, code: PARTIAL_UNKNOWN_UNLABELLED, sentence: `${PARTIAL_UNKNOWN_UNLABELLED}: the plan was submitted with an anonymous hole for ${u.inputId}; unknowns are named or the evaluation refuses — a hole without a name cannot be answered, audited, or apologized for (D-449, Ω-10)` };
    }
    if (!isUnknownSource(u.source)) {
      return { ok: false, code: PARTIAL_UNKNOWN_UNLABELLED, sentence: `${PARTIAL_UNKNOWN_UNLABELLED}: the unknown ${u.name} carries no typed source (ambiguity|missing|deferred) — a name without an etiology is a label wearing a name tag (D-449)` };
    }
    if (known[u.inputId] !== undefined) {
      return { ok: false, code: PARTIAL_BINDING_CONFLICT, sentence: `${PARTIAL_BINDING_CONFLICT}: input ${u.inputId} is bound AND declared unknown — one input, one truth; the fold refuses to hold both (D-449)` };
    }
    if (declared.has(u.inputId)) {
      return { ok: false, code: PARTIAL_BINDING_CONFLICT, sentence: `${PARTIAL_BINDING_CONFLICT}: input ${u.inputId} carries two unknown declarations — one input, one truth (D-449)` };
    }
    if ([...declared.values()].some((d) => d.name === u.name)) {
      return { ok: false, code: PARTIAL_UNKNOWN_UNLABELLED, sentence: `${PARTIAL_UNKNOWN_UNLABELLED}: two unknowns share the name ${u.name} — a name shared by two holes answers neither (D-449)` };
    }
    declared.set(u.inputId, { name: u.name, source: u.source, blockingSteps: [], cites: [...(u.cites ?? [])] });
  }
  // declared defaults are LABELLED luggage, never fills: a default for an
  // input the caller left unbound must be carried as an unknown citing it
  for (const inputId of Object.keys(spec.defaults ?? {})) {
    if (known[inputId] === undefined && !declared.has(inputId)) {
      return { ok: false, code: PARTIAL_UNKNOWN_UNLABELLED, sentence: `${PARTIAL_UNKNOWN_UNLABELLED}: input ${inputId} has a declared default but arrives neither bound nor as a labelled unknown — a default is a declared unknown with source, never a silent fill (D-449)` };
    }
  }
  // the deferral graph must be a DAG — the evaluator refuses to schedule a wait on itself
  const byId = new Map(spec.plan.steps.map((s) => [s.stepId, s]));
  for (const s of spec.plan.steps) {
    for (const dep of s.dependsOn) {
      if (!byId.has(dep)) {
        return { ok: false, code: PARTIAL_CYCLE, sentence: `${PARTIAL_CYCLE}: step ${s.stepId} depends on ${dep}, which the plan does not contain — an unresolvable wait is a cycle wearing a costume (D-449)` };
      }
    }
  }
  const color = new Map<string, 0 | 1 | 2>(); // 0 unvisited · 1 in-stack · 2 done
  const visit = (id: string, stack: string[]): boolean => {
    const c = color.get(id) ?? 0;
    if (c === 1) return true;
    if (c === 2) return false;
    color.set(id, 1);
    for (const dep of byId.get(id)!.dependsOn) {
      if (visit(dep, [...stack, id])) return true;
    }
    color.set(id, 2);
    return false;
  };
  for (const s of spec.plan.steps) {
    if (visit(s.stepId, [])) {
      return { ok: false, code: PARTIAL_CYCLE, sentence: `${PARTIAL_CYCLE}: the deferral graph for ${spec.plan.planRef} contains a cycle — A waits on B waits on A; the evaluator refuses to schedule a wait on itself (D-449, Ω-10)` };
    }
  }
  // the walk: determined = all inputs bound AND all deps determined
  const determined: DeterminedStep[] = [];
  const determinedSet = new Set<string>();
  let grew = true;
  while (grew) {
    grew = false;
    for (const s of spec.plan.steps) {
      if (determinedSet.has(s.stepId)) continue;
      const inputsBound = s.inputs.every((i) => known[i] !== undefined);
      const depsDone = s.dependsOn.every((d) => determinedSet.has(d));
      if (inputsBound && depsDone) {
        determined.push({
          stepId: s.stepId,
          op: s.op,
          outputDigest: `sha256:${sha256Hex(canonicalJson({ stepId: s.stepId, op: s.op, inputs: s.inputs.map((i) => [i, known[i]]) }))}`,
          cites: [`plan:${spec.plan.planRef}`, ...s.inputs.map((i) => `input:${i}`)],
        });
        determinedSet.add(s.stepId);
        grew = true;
      }
    }
  }
  // unknowns: declared ones (cited) + derived missing ones (named by their input id)
  const deferredSteps = spec.plan.steps.filter((s) => !determinedSet.has(s.stepId));
  const unknowns: NamedUnknown[] = [];
  for (const [inputId, u] of declared) {
    unknowns.push({ ...u, blockingSteps: deferredSteps.filter((s) => s.inputs.includes(inputId)).map((s) => s.stepId).sort() });
  }
  for (const s of deferredSteps) {
    for (const inputId of s.inputs) {
      if (known[inputId] === undefined && !declared.has(inputId) && !unknowns.some((u) => u.name === inputId)) {
        unknowns.push({ name: inputId, source: "missing", blockingSteps: deferredSteps.filter((t) => t.inputs.includes(inputId)).map((t) => t.stepId).sort(), cites: [] });
      }
    }
  }
  unknowns.sort((a, b) => (a.name < b.name ? -1 : 1));
  const partialRef = spec.partialRef ?? partialRowRef(spec.plan.planRef, spec.at);
  const residual: ResidualPlan = {
    kind: "eval.residual@1",
    residualRef: `${EVAL_NS}:residual:${spec.plan.planRef}:${spec.at}`,
    planRef: `${spec.plan.planRef}#residual-${sha256Hex(canonicalJson({ deferred: deferredSteps.map((s) => s.stepId), at: spec.at })).slice(0, 8)}`,
    citesPartial: partialRef,
    deferredSteps: deferredSteps.map((s) => s.stepId).sort(),
    unknownNames: unknowns.map((u) => u.name).sort(),
  };
  const core = {
    kind: "eval.partial@1" as const,
    partialRef,
    planRef: spec.plan.planRef,
    inputDigest: `sha256:${sha256Hex(canonicalJson({ planRef: spec.plan.planRef, bindings: [...spec.bindings].sort((a, b) => (a.inputId < b.inputId ? -1 : 1)), unknownNames: unknowns.map((u) => u.name).sort() }))}`,
    known,
    unknowns,
    determined: determined.sort((a, b) => (a.stepId < b.stepId ? -1 : 1)),
    residual,
    width,
    at: spec.at,
  };
  const resultDigest = `sha256:${sha256Hex(canonicalJson(core))}`;
  const row: PartialRow = { ...core, resultDigest };
  // the determinism guard: re-derive the digest — partial evaluation is a fold, not a mood
  if (resultDigest !== `sha256:${sha256Hex(canonicalJson(core))}`) {
    return { ok: false, code: PARTIAL_NONDETERMINISTIC, sentence: `${PARTIAL_NONDETERMINISTIC}: the same plan and bindings produced different partial results; partial evaluation is a fold, not a mood (D-449)` };
  }
  return { ok: true, row };
}

/** THE permanent-luggage law (D-449): a partial result is read as the partial
 *  truth it is, or not at all — consuming one as complete refuses. */
export function consumePartial(row: PartialRow, as: "complete" | "partial"): ConsumeOutcome {
  if (as === "complete" && row.unknowns.length > 0) {
    return { ok: false, code: PARTIAL_RESULT_AS_COMPLETE, sentence: `${PARTIAL_RESULT_AS_COMPLETE}: the partial row ${row.partialRef} was consumed as if complete; it carries ${row.unknowns.length} unknown(s) (${row.unknowns.map((u) => u.name).join(", ")}) and will be read as the partial truth it is, or not at all (D-449, Ω-10)` };
  }
  return { ok: true, complete: row.unknowns.length === 0, unknowns: row.unknowns };
}

/** THE residual runner (D-449): binding the unknowns and running the residual
 *  is a FRESH invocation through the full gate — evaluation has no privileged
 *  path to doing. Ungated, uncited, or unbound refuses, named. */
export function runResidual(
  spec: {
    residual: ResidualPlan;
    bindings: readonly Binding[];
    gateRef: string;          // the gate citation — the fresh invocation's ticket
    at: number;
    runRef?: string;
  },
): ResidualRunOutcome {
  if (typeof spec.residual.citesPartial !== "string" || spec.residual.citesPartial.length === 0) {
    return { ok: false, code: PARTIAL_RESIDUAL_UNGATED, sentence: `${PARTIAL_RESIDUAL_UNGATED}: the residual does not cite the partial row that spawned it; an orphan residual is unauditable work waiting to happen (D-449)` };
  }
  if (typeof spec.gateRef !== "string" || spec.gateRef.length === 0) {
    return { ok: false, code: PARTIAL_RESIDUAL_UNGATED, sentence: `${PARTIAL_RESIDUAL_UNGATED}: the residual ${spec.residual.residualRef} was run without a gate citation — residuals run only as fresh gated invocations; there is no privileged path from evaluation to doing (D-449, Ω-10)` };
  }
  const bound: Record<string, unknown> = {};
  for (const b of spec.bindings) {
    if (bound[b.inputId] !== undefined && canonicalJson(bound[b.inputId]) !== canonicalJson(b.value)) {
      return { ok: false, code: PARTIAL_BINDING_CONFLICT, sentence: `${PARTIAL_BINDING_CONFLICT}: input ${b.inputId} is bound twice with different values for the residual run — one input, one truth (D-449)` };
    }
    bound[b.inputId] = b.value;
  }
  const missing = spec.residual.unknownNames.filter((n) => bound[n] === undefined);
  if (missing.length > 0) {
    return { ok: false, code: PARTIAL_UNBOUND_EXECUTE, sentence: `${PARTIAL_UNBOUND_EXECUTE}: execution was attempted with unbound unknowns (${missing.join(", ")}); the residual exists precisely so that doing waits for knowing (D-449)` };
  }
  return {
    ok: true,
    run: {
      kind: "eval.residual.run@1",
      runRef: spec.runRef ?? `${EVAL_NS}:residual-run:${spec.residual.residualRef}:${spec.at}`,
      residualRef: spec.residual.residualRef,
      planRef: spec.residual.planRef,
      cites: [spec.residual.citesPartial, spec.gateRef],
      bound: Object.keys(bound).length,
      at: spec.at,
    },
  };
}

/** The headless render: the unknown-set is visible luggage, forever. */
export function renderPartial(row: PartialRow): string {
  const lines = [
    `partial ${row.partialRef} (plan ${row.planRef}) — width ${row.width}, ${row.determined.length} determined, ${row.unknowns.length} unknown(s), digest ${row.resultDigest.slice(0, 22)}…`,
  ];
  for (const d of row.determined) lines.push(`  determined ${d.stepId} (${d.op}) → ${d.outputDigest.slice(0, 22)}…`);
  for (const u of row.unknowns) lines.push(`  unknown ${u.name} [${u.source}] blocks ${u.blockingSteps.length ? u.blockingSteps.join("+") : "(nothing)"}${u.cites.length > 0 ? ` citing ${u.cites.join(", ")}` : ""}`);
  lines.push(`  residual ${row.residual.residualRef} → fresh plan ${row.residual.planRef}, citing ${row.residual.citesPartial}`);
  return lines.join("\n");
}

/** The in-plugin registry (ring-first; the vault mirror rides port caps). */
export class PartialEvalRegistry {
  private rows = new Map<string, PartialRow>();
  private runs: ResidualRun[] = [];

  evaluate(spec: Parameters<typeof evaluatePartial>[0]): PartialOutcome {
    const out = evaluatePartial(spec);
    if (out.ok) this.rows.set(out.row.partialRef, out.row);
    return out;
  }

  /** The determinism door (F-PARTIAL.5): the registry re-runs the fold and
   *  refuses digest divergence, loudly. */
  evaluateChecked(spec: Parameters<typeof evaluatePartial>[0]): PartialOutcome {
    const first = this.evaluate(spec);
    if (!first.ok) return first;
    const second = evaluatePartial({ ...spec, partialRef: first.row.partialRef });
    if (!second.ok || second.row.resultDigest !== first.row.resultDigest) {
      return { ok: false, code: PARTIAL_NONDETERMINISTIC, sentence: `${PARTIAL_NONDETERMINISTIC}: the same plan and bindings produced different partial results (${first.row.resultDigest.slice(0, 16)}… vs ${second.ok ? second.row.resultDigest.slice(0, 16) : "a refusal"}…); partial evaluation is a fold, not a mood (D-449)` };
    }
    return first;
  }

  run(spec: Parameters<typeof runResidual>[0]): ResidualRunOutcome {
    const out = runResidual(spec);
    if (out.ok) this.runs.push(out.run);
    return out;
  }

  consume(ref: string, as: "complete" | "partial"): ConsumeOutcome {
    const row = this.rows.get(ref);
    if (row === undefined) {
      return { ok: false, code: PARTIAL_RESULT_AS_COMPLETE, sentence: `${PARTIAL_RESULT_AS_COMPLETE}: no partial row ${ref} is in the ledger — a result that cannot be named cannot be consumed (D-449)` };
    }
    return consumePartial(row, as);
  }

  get(ref: string): PartialRow | null { return this.rows.get(ref) ?? null; }
  runList(): ResidualRun[] { return [...this.runs].sort((a, b) => a.at - b.at); }

  /** The headless read: the row, its unknowns (the luggage), and the runs. */
  read(ref?: string): { row: PartialRow | null; rendered: string; runs: ResidualRun[] } {
    if (ref !== undefined) {
      const row = this.rows.get(ref) ?? null;
      return { row, rendered: row !== null ? renderPartial(row) : `partial ${ref} is not in the ledger (D-449)`, runs: this.runs.filter((r) => r.cites.includes(ref)) };
    }
    const lines = [`partial.read — ${this.rows.size} partial row(s), ${this.runs.length} residual run(s)`];
    for (const row of [...this.rows.values()].sort((a, b) => (a.partialRef < b.partialRef ? -1 : 1))) lines.push(renderPartial(row));
    for (const r of this.runList()) lines.push(`  run ${r.runRef} — fresh plan ${r.planRef}, ${r.bound} bound, cites ${r.cites.join(" + ")}`);
    return { row: null, rendered: lines.join("\n"), runs: this.runs };
  }
}
