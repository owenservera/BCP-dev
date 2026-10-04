# D-449 — Partial evaluation: unknowns are named, never guessed

## Status

RATIFIED

## Context

- The Ω-10 spec (paper `D-442`, re-materialized per
  `omega-upgrades/RE-MATERIALIZATION-NOTE.md` — the transcript original is
  not on disk; this tree record lands the re-materialized spec's mechanism)
  names the partial-evaluation boundary: any plan becomes evaluable before
  the world finishes answering — the determined prefix banks, the unknown
  set names what blocks the rest, and the residual is a re-runnable plan.
- The one invariant: **a guess never gets to impersonate an answer.**
  Unknowns are named (an anonymous hole refuses); the unknown-set is
  permanent luggage on every partial row (consuming a partial as complete
  refuses); evaluation is a deterministic side-effect-free fold over the
  plan IR — no external calls; and the residual runs only as a fresh gated
  invocation — partial evaluation has no privileged path to doing.

Blocks: none

## Options

| Criterion | (a) pure evaluator core in vivim-run (named unknowns + the partial fold + gated residuals) | (b) execute with declared defaults | (c) off-ledger dry-run simulation |
|---|---|---|---|
| A guess never impersonates an answer | Yes — unbound inputs are named unknowns | No — a default is a rumor in input's clothes | No — no evidence at all |
| The determined prefix banks | Yes — bound steps evaluate, cited | No — late failure discards upstream truth | Partly |
| Doing waits for knowing | Yes — residuals re-enter through the full gate | No — defaults act | No — side effects or nothing |
| Zero host LOC | Yes | Yes | Yes |

## Decision

**Decision:** (a) — `plugins/vivim-run/src/partialeval.ts`, in substance:

- **Named unknowns:** an input binding is a value or
  `{name, source: ambiguity|missing|deferred}` — anonymous holes refuse
  `PARTIAL_UNKNOWN_UNLABELLED`; two truths for one input (duplicate
  values, or bound AND unknown) refuse `PARTIAL_BINDING_CONFLICT`; a
  declared default is an unknown with a cited default source, never a
  silent fill.
- **The partial fold** (`partial.evaluate@1`): a deterministic walk of the
  plan IR — steps whose inputs are bound evaluate structurally over rows
  (no external calls) into `determined[]`; steps touched by an unknown
  defer, each unknown carrying its blocking steps; the deferral graph
  cycles refuse `PARTIAL_CYCLE`; the row carries `{inputDigest, known,
  unknowns, resultDigest, width}` — the Ω-9 width the result was projected
  at, refusing `PARTIAL_APERTURE_EXCEEDED` when the requested width
  exceeds what the input evidence's scopes allow; a fold that cannot
  reproduce its own digest refuses `PARTIAL_NONDETERMINISTIC`.
- **Residuals as fresh plans:** the deferred subgraph is emitted citing
  the partial row that spawned it; running it demands a gate citation —
  an uncited or ungated residual refuses `PARTIAL_RESIDUAL_UNGATED`, and
  executing with unbound unknowns refuses `PARTIAL_UNBOUND_EXECUTE`;
  consuming a partial as complete refuses `PARTIAL_RESULT_AS_COMPLETE`
  (the permanent-luggage law).

## Consequences

- "What would this do" becomes a lawful query (the dry-run that isn't a
  lie); AMBIGUOUS intents become computationally useful; D-435's
  `blockedOn` can cite the unknown-set; Ω-11's boundary chain proceeds
  over partial disclosures.
- As-built: partial.evaluate@1 (READ), partial.read@1 (READ — the row and
  its unknowns rendered headlessly, the luggage visible forever) land in
  vivim-run's lane; the residual runner stays in the pure core (the gate
  owns the doing); the vault mirror rides port caps when present
  (ring-first). Zero host LOC; existing tests stay green.

## Evidence

- Falsifiers, green in this record's tree BEFORE the flip per `D-364`
  (`omega:loop --stub D-449` generates the RED stub this list resolves to):
  - `F-PARTIAL.1` (determined-prefix) — a three-step plan with one unknown blocking step 2 → step 1 determined, steps 2–3 deferred, unknowns[] naming the input and its blocking steps
  - `F-PARTIAL.2` (named-refusal) — an anonymous hole → PARTIAL_UNKNOWN_UNLABELLED; a silent default fill → the row refuses to write unless the default is a declared unknown with source; a conflicting binding → PARTIAL_BINDING_CONFLICT
  - `F-PARTIAL.3` (residual-round-trip) — bind the unknowns, run the residual through the gate citation → the run row cites the residual's planRef and the partial row; no gate citation → PARTIAL_RESIDUAL_UNGATED; unbound unknowns → PARTIAL_UNBOUND_EXECUTE
  - `F-PARTIAL.4` (ambiguity-as-unknown) — an AMBIGUOUS intent row (D-411) feeding a plan → the prefix evaluates; the unknown's source reads ambiguity, citing the amb: row
  - `F-PARTIAL.5` (determinism) — same plan + bindings + vault state, twice → digest-equal partial rows
  - `F-PARTIAL.6` (headless) — 1–5 daemon-only, zero pixels; every answer CLI-reproducible
  - `F-PARTIAL.7` (loud-failure) — zero silent paths — every deferral is a named unknown, every refusal a sentence, every complete-consumption of a partial a loud refusal (PARTIAL_RESULT_AS_COMPLETE)
- Files: `plugins/vivim-run/src/partialeval.ts`, ops in `src/index.ts`,
  `tooling/gates/test/f-partial.test.ts`.
- Refusal register (exact): PARTIAL_UNKNOWN_UNLABELLED ·
  PARTIAL_BINDING_CONFLICT · PARTIAL_RESIDUAL_UNGATED ·
  PARTIAL_UNBOUND_EXECUTE · PARTIAL_RESULT_AS_COMPLETE · PARTIAL_CYCLE ·
  PARTIAL_APERTURE_EXCEEDED · PARTIAL_NONDETERMINISTIC.
- Precedents: the re-materialized Ω-10 spec (paper `D-442`); `D-435` (the
  plan IR and `blockedOn`); `D-411` (the AMBIGUOUS four-state rows);
  `D-448` (the width lattice the result projects at); `D-364`.


- Ratified on greens (evidence-class, F-PARTIAL.1-7 green in this record's tree BEFORE the flip per D-364): landing commit f9b8841; full gate green 1418/0 ×2 on the PROPOSED tree (2026-09-21T07:20:03Z and 07:25Z; the prior tip's 1362 + 56 new); zero host LOC; anvil untouched.

## Index

summary: plugins/vivim-run/src/partialeval.ts — partial evaluation: named unknowns (ambiguity, missing, deferred) over the plan IR, the deterministic partial fold banking the determined prefix, unknowns as permanent luggage on every row, residuals as fresh plans that run only through the gate citation, and width-limited projections
rationale: Unknowns are named, never guessed - a default is a rumor wearing an input's clothes, a partial result consumed as complete is a lie with a badge, and evaluation that could do would not be evaluation (Omega-10, partial evaluation, re-materialized spec)
class: evidence
