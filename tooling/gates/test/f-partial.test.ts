// tooling/gates/test/f-partial.test.ts — the F-PARTIAL falsifier (D-449, Ω-10).
// Generated as a RED stub by `omega:loop --stub D-449`, then implemented.
//  F-PARTIAL.1 determined-prefix — a three-step plan with one unknown blocking step 2 → step 1 determined, steps 2–3 deferred, unknowns[] naming the input and its blocking steps
//  F-PARTIAL.2 named-refusal — an anonymous hole → PARTIAL_UNKNOWN_UNLABELLED; a silent default fill → the row refuses to write unless the default is a declared unknown with source; a conflicting binding → PARTIAL_BINDING_CONFLICT
//  F-PARTIAL.3 residual-round-trip — bind the unknowns, run the residual through the gate citation → the run row cites the residual's planRef and the partial row; no gate citation → PARTIAL_RESIDUAL_UNGATED; unbound unknowns → PARTIAL_UNBOUND_EXECUTE
//  F-PARTIAL.4 ambiguity-as-unknown — an AMBIGUOUS intent row (D-411) feeding a plan → the prefix evaluates; the unknown's source reads ambiguity, citing the amb: row
//  F-PARTIAL.5 determinism — same plan + bindings + vault state, twice → digest-equal partial rows
//  F-PARTIAL.6 headless — 1–5 daemon-only, zero pixels; every answer CLI-reproducible
//  F-PARTIAL.7 loud-failure — zero silent paths — every deferral is a named unknown, every refusal a sentence, every complete-consumption of a partial a loud refusal (PARTIAL_RESULT_AS_COMPLETE)
import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  evaluatePartial, renderPartial, runResidual,
  PARTIAL_UNKNOWN_UNLABELLED, PARTIAL_BINDING_CONFLICT, PARTIAL_RESIDUAL_UNGATED,
  PARTIAL_UNBOUND_EXECUTE, PARTIAL_RESULT_AS_COMPLETE, PARTIAL_CYCLE,
  PARTIAL_APERTURE_EXCEEDED, PARTIAL_NONDETERMINISTIC,
  PartialEvalRegistry, type EvalPlan,
} from "../../../plugins/vivim-run/src/partialeval.ts";

const plan: EvalPlan = {
  planRef: "plan:daily-digest",
  steps: [
    { stepId: "s1", op: "vault.read", inputs: ["a"], dependsOn: [] },
    { stepId: "s2", op: "mail.send", inputs: ["a", "b"], dependsOn: ["s1"] },
    { stepId: "s3", op: "journal.write", inputs: ["c"], dependsOn: ["s2"] },
  ],
};

function prng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe("F-PARTIAL.1 (determined-prefix)", () => {
  test("one unknown blocking step 2 → step 1 determined, steps 2–3 deferred, unknowns[] naming the input and its blocking steps", () => {
    const out = evaluatePartial({
      plan,
      bindings: [
        { inputId: "a", value: "inbox:q3" },
        { inputId: "c", value: "journal:daily" },
      ],
      at: 100,
    });
    expect(out.ok).toBe(true);
    if (!out.ok) throw new Error(out.sentence);
    expect(out.row.determined.map((d) => d.stepId)).toEqual(["s1"]);   // the determined prefix banks
    expect(out.row.determined[0]!.cites.length).toBeGreaterThan(0);    // evidence-cited
    expect(out.row.residual.deferredSteps).toEqual(["s2", "s3"]);     // the rest defers
    expect(out.row.unknowns.length).toBe(1);                          // named, not guessed
    expect(out.row.unknowns[0]!.name).toBe("b");
    expect(out.row.unknowns[0]!.source).toBe("missing");
    expect(out.row.unknowns[0]!.blockingSteps).toEqual(["s2"]);        // the input's blocking steps
    expect(out.row.known["a"]).toBe("inbox:q3");
    expect(out.row.known["c"]).toBe("journal:daily");
    expect(out.row.width).toBe("body");                                // the Ω-9 posture partials default to
    expect(out.row.resultDigest.startsWith("sha256:")).toBe(true);
    // the residual is a FRESH plan citing the partial row
    expect(out.row.residual.citesPartial).toBe(out.row.partialRef);
    expect(out.row.residual.planRef).not.toBe(plan.planRef);
    expect(out.row.residual.unknownNames).toEqual(["b"]);
  });
});

describe("F-PARTIAL.2 (named-refusal)", () => {
  test("anonymous holes, untyped sources, silent default fills, and conflicting bindings all refuse, named", () => {
    // the anonymous hole
    const anon = evaluatePartial({ plan, bindings: [{ inputId: "a", value: 1 }], unknowns: [{ inputId: "b", name: "", source: "missing" }], at: 1 });
    expect(anon.ok).toBe(false);
    if (!anon.ok) { expect(anon.code).toBe(PARTIAL_UNKNOWN_UNLABELLED); expect(anon.sentence).toContain("anonymous hole"); }
    // the untyped source — a name without an etiology
    const untyped = evaluatePartial({ plan, bindings: [{ inputId: "a", value: 1 }], unknowns: [{ inputId: "b", name: "which", source: "vibes" as never }], at: 1 });
    expect(untyped.ok).toBe(false);
    if (!untyped.ok) expect(untyped.code).toBe(PARTIAL_UNKNOWN_UNLABELLED);
    // the silent default fill — a default is a declared unknown with source, never a fill
    const silent = evaluatePartial({ plan, bindings: [{ inputId: "a", value: 1 }], defaults: { b: "fallback@x" }, at: 1 });
    expect(silent.ok).toBe(false);
    if (!silent.ok) { expect(silent.code).toBe(PARTIAL_UNKNOWN_UNLABELLED); expect(silent.sentence).toContain("never a silent fill"); }
    // the declared default: b carried as a labelled unknown citing the default row → the row writes
    const labelled = evaluatePartial({
      plan,
      bindings: [{ inputId: "a", value: 1 }, { inputId: "c", value: 2 }],
      unknowns: [{ inputId: "b", name: "b", source: "missing", cites: ["default:b"] }],
      defaults: { b: "fallback@x" },
      at: 1,
    });
    expect(labelled.ok).toBe(true);
    if (labelled.ok) expect(labelled.row.unknowns[0]!.cites).toEqual(["default:b"]);
    // two truths for one input: duplicate values
    const dup = evaluatePartial({ plan, bindings: [{ inputId: "a", value: 1 }, { inputId: "a", value: 2 }], at: 1 });
    expect(dup.ok).toBe(false);
    if (!dup.ok) { expect(dup.code).toBe(PARTIAL_BINDING_CONFLICT); expect(dup.sentence).toContain("one input, one truth"); }
    // bound AND unknown
    const both = evaluatePartial({ plan, bindings: [{ inputId: "a", value: 1 }], unknowns: [{ inputId: "a", name: "why", source: "missing" }], at: 1 });
    expect(both.ok).toBe(false);
    if (!both.ok) expect(both.code).toBe(PARTIAL_BINDING_CONFLICT);
  });
});

describe("F-PARTIAL.3 (residual-round-trip)", () => {
  test("the residual runs only as a fresh gated invocation citing the partial row; ungated, uncited, and unbound all refuse", () => {
    const reg = new PartialEvalRegistry();
    const out = reg.evaluate({ plan, bindings: [{ inputId: "a", value: 1 }, { inputId: "c", value: 2 }], at: 100 });
    expect(out.ok).toBe(true);
    if (!out.ok) throw new Error(out.sentence);
    const residual = out.row.residual;
    // no gate citation → no privileged path from evaluation to doing
    const ungated = runResidual({ residual, bindings: [{ inputId: "b", value: "work" }], gateRef: "", at: 200 });
    expect(ungated.ok).toBe(false);
    if (!ungated.ok) { expect(ungated.code).toBe(PARTIAL_RESIDUAL_UNGATED); expect(ungated.sentence).toContain("no privileged path"); }
    // an orphan residual — no citation of the partial row that spawned it
    const orphan = runResidual({ residual: { ...residual, citesPartial: "" }, bindings: [{ inputId: "b", value: "work" }], gateRef: "gate:run-17", at: 200 });
    expect(orphan.ok).toBe(false);
    if (!orphan.ok) { expect(orphan.code).toBe(PARTIAL_RESIDUAL_UNGATED); expect(orphan.sentence).toContain("orphan residual"); }
    // execution with unbound unknowns — doing waits for knowing
    const unbound = runResidual({ residual, bindings: [], gateRef: "gate:run-17", at: 200 });
    expect(unbound.ok).toBe(false);
    if (!unbound.ok) { expect(unbound.code).toBe(PARTIAL_UNBOUND_EXECUTE); expect(unbound.sentence).toContain("b"); }
    // bind the unknowns, run through the gate → the run cites the residual's planRef and the partial row
    const run = reg.run({ residual, bindings: [{ inputId: "a", value: 1 }, { inputId: "b", value: "work" }, { inputId: "c", value: 2 }], gateRef: "gate:run-17", at: 300 });
    expect(run.ok).toBe(true);
    if (!run.ok) throw new Error(run.sentence);
    expect(run.run.planRef).toBe(residual.planRef);
    expect(run.run.cites).toContain(out.row.partialRef);
    expect(run.run.cites).toContain("gate:run-17");
    expect(reg.read().rendered).toContain(out.row.partialRef);
    expect(reg.read().rendered).toContain("gate:run-17");
    // the permanent luggage: consuming the partial as complete refuses, loudly
    const asComplete = reg.consume(out.row.partialRef, "complete");
    expect(asComplete.ok).toBe(false);
    if (!asComplete.ok) { expect(asComplete.code).toBe(PARTIAL_RESULT_AS_COMPLETE); expect(asComplete.sentence).toContain("b"); }
    const asPartial = reg.consume(out.row.partialRef, "partial");
    expect(asPartial.ok).toBe(true);
  });
});

describe("F-PARTIAL.4 (ambiguity-as-unknown)", () => {
  test("an AMBIGUOUS intent row feeding a plan → the prefix evaluates; the unknown's source reads ambiguity, citing the amb: row", () => {
    const ambPlan: EvalPlan = {
      planRef: "plan:send-mail",
      steps: [
        { stepId: "p1", op: "context.fold", inputs: ["x"], dependsOn: [] },
        { stepId: "p2", op: "mail.send", inputs: ["x", "q"], dependsOn: ["p1"] },
      ],
    };
    const out = evaluatePartial({
      plan: ambPlan,
      bindings: [{ inputId: "x", value: "draft:7" }],
      unknowns: [{ inputId: "q", name: "which mailbox: work or personal", source: "ambiguity", cites: ["amb:deadbeef:res"] }],
      at: 5,
    });
    expect(out.ok).toBe(true);
    if (!out.ok) throw new Error(out.sentence);
    expect(out.row.determined.map((d) => d.stepId)).toEqual(["p1"]);       // the unambiguous prefix evaluates
    expect(out.row.unknowns[0]!.source).toBe("ambiguity");                 // the clarifying question IS the unknown's name
    expect(out.row.unknowns[0]!.name).toBe("which mailbox: work or personal");
    expect(out.row.unknowns[0]!.cites).toEqual(["amb:deadbeef:res"]);      // citing the amb: row (D-411)
    expect(out.row.unknowns[0]!.blockingSteps).toEqual(["p2"]);
  });
});

describe("F-PARTIAL.5 (determinism)", () => {
  test("same plan + bindings + vault state, twice → digest-equal partial rows, whatever the binding order", () => {
    const reg = new PartialEvalRegistry();
    const spec = { plan, bindings: [{ inputId: "a", value: 1 }, { inputId: "b", value: 2 }, { inputId: "c", value: 3 }], at: 42 };
    const first = reg.evaluateChecked(spec);   // the registry re-runs the fold and refuses divergence
    expect(first.ok).toBe(true);
    if (!first.ok) throw new Error(first.sentence);
    expect(first.row.unknowns).toEqual([]);    // fully bound → complete
    const again = evaluatePartial(spec);
    expect(again.ok).toBe(true);
    if (again.ok) expect(again.row.resultDigest).toBe(first.row.resultDigest);
    // 100 shuffles of the binding order: the fold is order-independent
    const rand = prng(20260922);
    for (let i = 0; i < 100; i++) {
      const shuffled = [...spec.bindings];
      for (let k = shuffled.length - 1; k > 0; k--) {
        const j = Math.floor(rand() * (k + 1));
        [shuffled[k], shuffled[j]] = [shuffled[j]!, shuffled[k]!];
      }
      const out = evaluatePartial({ ...spec, bindings: shuffled });
      expect(out.ok).toBe(true);
      if (out.ok) expect(out.row.resultDigest).toBe(first.row.resultDigest);
    }
  });
});

describe("F-PARTIAL.6 (headless)", () => {
  test("1–5 daemon-only, zero pixels; every answer CLI-reproducible", () => {
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-run", "src", "partialeval.ts"), "utf-8");
    expect(/from\s+"@vivim\/(omega-)?(surfaces\/|canvas|web|daemon-client)/.test(src)).toBe(false);
    expect(/\b(document|window|navigator)\s*\./.test(src)).toBe(false);
    const out = evaluatePartial({ plan, bindings: [{ inputId: "a", value: 1 }], at: 9 });
    expect(out.ok).toBe(true);
    if (!out.ok) throw new Error(out.sentence);
    const text = renderPartial(out.row);
    expect(text).toContain("unknown b [missing] blocks s2");
    expect(text).toContain("residual");
    const reg = new PartialEvalRegistry();
    reg.evaluate({ plan, bindings: [{ inputId: "a", value: 1 }], at: 9 });
    expect(reg.read().rendered).toContain("partial.read — 1 partial row(s)");
  });
});

describe("F-PARTIAL.7 (loud-failure)", () => {
  test("zero silent paths — cycles, aperture excess, and complete-consumption refuse with sentences; every code present", () => {
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-run", "src", "partialeval.ts"), "utf-8");
    for (const code of [PARTIAL_UNKNOWN_UNLABELLED, PARTIAL_BINDING_CONFLICT, PARTIAL_RESIDUAL_UNGATED, PARTIAL_UNBOUND_EXECUTE, PARTIAL_RESULT_AS_COMPLETE, PARTIAL_CYCLE, PARTIAL_APERTURE_EXCEEDED, PARTIAL_NONDETERMINISTIC]) {
      expect(src.includes(code)).toBe(true);
    }
    expect(/catch\s*(\([^)]*\))?\s*\{\s*\}/.test(src)).toBe(false); // no silent swallows
    // the cycle: A waits on B waits on A
    const cyclic = evaluatePartial({
      plan: { planRef: "p", steps: [
        { stepId: "A", op: "x", inputs: ["i"], dependsOn: ["B"] },
        { stepId: "B", op: "y", inputs: ["i"], dependsOn: ["A"] },
      ] },
      bindings: [{ inputId: "i", value: 1 }],
      at: 1,
    });
    expect(cyclic.ok).toBe(false);
    if (!cyclic.ok) { expect(cyclic.code).toBe(PARTIAL_CYCLE); expect(cyclic.sentence).toContain("cycle"); }
    // the aperture mount: a wider partial than the inputs' scopes allow
    const exceeded = evaluatePartial({ plan, bindings: [{ inputId: "a", value: 1 }], width: "detail", inputScopeWidths: { a: "summary", b: "body" }, at: 1 });
    expect(exceeded.ok).toBe(false);
    if (!exceeded.ok) { expect(exceeded.code).toBe(PARTIAL_APERTURE_EXCEEDED); expect(exceeded.sentence).toContain("knowing partially"); }
    // an off-lattice width is not a width at all
    const offLattice = evaluatePartial({ plan, bindings: [{ inputId: "a", value: 1 }], width: "everything" as never, at: 1 });
    expect(offLattice.ok).toBe(false);
    if (!offLattice.ok) expect(offLattice.code).toBe(PARTIAL_APERTURE_EXCEEDED);
    // the registry degrades honestly
    const empty = new PartialEvalRegistry().read();
    expect(empty.rendered).toContain("0 partial row(s), 0 residual run(s)");
  });
});
