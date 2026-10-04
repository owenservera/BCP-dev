# D-438 — Perf: the fixture discipline, ledgered results, and the budget assertion

## Status

RATIFIED

## Context

- The Ω-6.5 spec (paper `D-440`, the delivered upgrade doc
  `omega-upgrades/OMEGA-6.5-PERF-PROFILING-BENCHMARKS.md`) names builder gap
  #9: performance is a claim, not a discipline. Nothing pins a workload, a
  seed, a budget, or a variance; regressions are noticed by feel.
- The one invariant: **budgets become evidence.** A fixture is a pinned
  workload with a declared budget and variance; results are rows (metrics ×
  budgets × environment pin × badge — machine-dependent metrics wear
  GEN_ENVIRONMENT and never compare cross-machine as absolutes); a budget
  breach fails the verdict with the last-green diff; per-stage profiling
  attributes a regression to the stage that owns it.

Blocks: none

## Options

| Criterion | (a) fixture registry + result rows + assertion folds + real fixtures | (b) extend tooling/bench only | (c) ad-hoc timing scripts |
|---|---|---|---|
| Budgets declared and asserted | Yes — PERF_BUDGET_UNDECLARED / PERF_VARIANCE_BREACHED / PERF_REGRESSION_RED with the diff | No — bench prints numbers | No |
| Reproducible workloads | Yes — pinned seeds, declared op-mixes; PERF_SEED_UNPINNED refuses | Partially | No |
| Cross-machine honesty | Yes — PERF_BASELINE_CROSSMACHINE refuses absolute compares across environment pins | No | No |
| Regression attribution | Yes — per-stage profiles name the stage | No | No |

## Decision

**Decision:** (a) — `tooling/gates/perfreg.ts`, in substance:

- **The fixture discipline.** `perf.fixture` rows: `{fixtureId, workload:
  {seed, opMix, thinkTimeMs}, budget, variance, badge}` — a fixture without
  a declared budget refuses `PERF_BUDGET_UNDECLARED`; a workload without a
  pinned seed refuses `PERF_SEED_UNPINNED`; machine-dependent fixtures wear
  `GEN_ENVIRONMENT` (never compared cross-machine as absolutes).
- **Result rows (`perf.result@1`).** `{fixtureId, metrics, environment:
  {os, arch, bun, node}, badge, at}` — ledgered evidence, environment-pinned.
- **The assertion folds (pure).** `assertBudget`: a result within declared
  variance passes; a breach is `PERF_VARIANCE_BREACHED`, and against a
  last-green baseline it is `PERF_REGRESSION_RED` carrying the diff (which
  metric, by how much, vs which baseline); `assertSameEnvironment`:
  `PERF_BASELINE_CROSSMACHINE` on environment-pin mismatch.
- **The leak detector (`soakHonesty`).** A monotone-growth fold over a
  measurement series: growth beyond variance across the run is the leak
  flag; a flat series within variance is clean.
- **The stage profiler (`profileStages`).** Per-stage timings → the owning
  stage of a breach, named alone (a planted 200ms sleep in one stage flags
  that stage, not the neighbors).
- **Real fixtures landing now:** `chain-latency` (the vault spine's
  append→verify→compact timing under a pinned seed — measured in the
  falsifier, budgeted honestly) and `vault-throughput` (the append storm —
  ops/sec within declared variance). The soak and canvas-1000-ghosts
  fixtures are REGISTERED with their shapes and deferred to the waves that
  own their runtimes (as-built note — the canvas runtime does not exist
  yet; a soak harness without the real host would measure the harness).

## Consequences

- Performance claims become rows with budgets, seeds, and environment pins;
  a regression is a named diff against the last green, not a feeling.
- As-built honesty: (1) the two deferred fixtures are declared in the
  registry with `deferredTo` notes — registered-and-honest beats
  absent; (2) `tooling/bench` stays (the seed the spec names); perfreg is
  the discipline layer over it, not its replacement; (3) results persist
  as JSON rows under `build/perf/` (regenerable evidence — the ns
  `perf.result` retention law rides the vault integration when the perf
  op layer lands).
- Zero host LOC; no new dependencies; existing tests stay green.

## Evidence

- Falsifiers, green in this record's tree BEFORE the flip per `D-364`
  (`omega:loop --stub D-438` generates the RED stub this list resolves to):
  - `F-PERF.1` (soak-honesty) — an injected 4-bytes-per-turn leak is flagged by the monotone-growth fold; a clean series is green within variance
  - `F-PERF.2` (throughput-reproducibility) — 10 runs within declared variance pass; an op-mix change breaches with PERF_REGRESSION_RED carrying the diff
  - `F-PERF.3` (chain-attribution) — a planted 200ms sleep in one stage flags that stage only
  - `F-PERF.4` (render-budget) — a starved kernel feed vs a slow renderer are named separately (the attribution fold)
  - `F-PERF.5` (cross-machine-refusal) — x64 vs arm64 absolute comparison refuses PERF_BASELINE_CROSSMACHINE
  - `F-PERF.6` (no-budget-refusal) — a fixture without a budget refuses PERF_BUDGET_UNDECLARED; a workload without a seed refuses PERF_SEED_UNPINNED
  - `F-PERF.7` (headless-and-real) — the chain-latency fixture RUNS: a real vault append→verify→compact cycle measured under a pinned seed, green within its declared budget
- Files: `tooling/gates/perfreg.ts` (the pure core: fixture/result shapes,
  assertBudget, assertSameEnvironment, soakHonesty, profileStages, the
  registry), `build/perf/fixtures.json` (the registry: two live, two
  declared-deferred), `tooling/gates/test/f-perf.test.ts`.
- Refusal register (exact): PERF_BUDGET_UNDECLARED · PERF_SEED_UNPINNED ·
  PERF_VARIANCE_BREACHED · PERF_BASELINE_CROSSMACHINE · PERF_REGRESSION_RED.
- Precedents: spec `D-440` (Ω-6.5); `tooling/bench` (the seed); `D-432`
  (the two-phase append the throughput fixture exercises); `D-364`.


- Ratified on greens (evidence-class, F-PERF.1-7 green in this record's tree BEFORE the flip per D-364): landing commit 92d8657; full gate green 1306/0 ×2 on the PROPOSED tree (2026-09-21T04:56:32Z and 05:01Z; the prior tip's 1278 + 28 new); zero host LOC; anvil untouched.

## Index

summary: tooling/gates/perfreg.ts — the perf discipline: fixture rows with pinned seeds, declared budgets and variance, environment-pinned result rows, the budget assertion with last-green diffs (PERF_REGRESSION_RED), the monotone-growth leak detector, and per-stage attribution; chain-latency and vault-throughput fixtures live, soak and canvas-ghosts registered-deferred
rationale: Budgets become evidence - a performance claim without a pinned workload, a declared budget, and an environment pin is a feeling, and feelings do not catch regressions until users feel them too (Omega-6.5, the perf profiling spec)
class: evidence
