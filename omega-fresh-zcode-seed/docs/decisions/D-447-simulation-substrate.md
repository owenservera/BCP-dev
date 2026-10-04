# D-447 — The simulation substrate: pinned scenarios, deterministic replay, contained rehearsals

## Status

RATIFIED

## Context

- The Ω-8 spec (paper `D-432`, re-materialized per
  `omega-upgrades/RE-MATERIALIZATION-NOTE.md` — the transcript original is
  not on disk; this tree record lands the re-materialized spec's mechanism)
  names the rehearsal engine: scenarios of typed steps and faults against a
  PINNED seed, replayed through the real machinery inside a contained
  namespace, with byte-reproducible receipts.
- The one invariant: **same scenario + same seeded substrate ⇒ same bytes.**
  Determinism is the receipt's evidentiary value (D-429's `inputHash` law,
  promoted from tooling to runtime); divergence refuses
  `SIM_REPLAY_DIVERGENT` — the engine never averages, never picks a winner,
  never calls either run a verdict; containment is absolute (a rehearsal
  that could touch production namespaces is a bomb with a lanyard); and a
  simulation citing only itself proves nothing.
- The stance is advisory-for-production: a sim verdict never blocks a
  production op by itself — verdicts are DATA, and the citing record (a
  falsifier, a promotion, a ratification) owns the blocking, explicitly.

Blocks: none

## Options

| Criterion | (a) pure replay core in vivim-run (pinned scenarios + deterministic fold + contained exec seam) | (b) synthetic mocks over shapes | (c) live dry-runs against production |
|---|---|---|---|
| Proves the system, not the mock | Yes — real-machinery executors bind through the seam | No — a mock proves the mock (D-321) | No — that is production, not rehearsal |
| The receipt is evidence | Yes — byte-identical ×100 | No — unpinned randomness is divination | No — unreproducible |
| Cannot hurt production | Yes — writes land only in ns `sim.*` | Yes | NO |
| Zero host LOC | Yes | Yes | Yes |

## Decision

**Decision:** (a) — `plugins/vivim-run/src/simulation.ts`, in substance:

- **Scenario rows** (ns `sim.scenario`): `{scenarioId, seed, steps: [{op,
  inputDigest}], recordedFrom?}` — the seed pins the substrate digest
  (replaying against a moving world is divination); steps pin the op and
  its input digest; `recordedFrom` names the incident/decision the scenario
  was recorded from (rehearsal-predicts' anchor).
- **The replay fold:** `state₀ = seed`, `stateᵢ₊₁ = sha256(stateᵢ ‖ op ‖
  inputDigest ‖ outcomeDigest)` — deterministic over the pinned pair; the
  receipt's `bytes` are canonical JSON, byte-identical across replays. The
  exec seam carries the machinery (verdict + declared effects + outcome
  bytes); real-machinery executors (the plan registry's stall sweep, law
  walks) bind here — the op layer's default is the contained fold.
- **Containment:** every declared effect must land in ns `sim.*` — anything
  else refuses `SIM_CONTAINMENT_BREACH`, refused AND ledgered (a breach row
  lands as evidence); the live namespace is byte-verified untouched.
- **Divergence:** replay runs the fold ≥2 passes; differing digests refuse
  `SIM_REPLAY_DIVERGENT` naming the step — nondeterminism is a finding,
  loudly.
- **Self-certification refused:** a scenario whose citations are only
  itself (its own id or its own run receipts) refuses
  `SIM_SELF_CERTIFICATION` — a simulation citing only itself proves
  nothing; the citing record owns the verdict.
- **Pinning doors:** `SIM_SEED_UNPINNED` (unpinned seed or input digest),
  `SIM_SCENARIO_UNKNOWN` (the engine rehearses named things only),
  `SIM_FAULT_UNKNOWN` (an unnamed fault is a surprise, and surprises are
  what rehearsals exist to prevent).

## Consequences

- Red-path rehearsal exists before the next layer build (the D-429 arc
  completed); §26's validation engine gains its runtime stage; receipts
  carry `advisoryForProduction` — blocking belongs to the citing record.
- As-built: sim.record@1 (MUTATION), sim.replay@1 (MUTATION — runs the
  fold, refuses on divergence), sim.read@1 (READ) land in vivim-run's lane;
  real-machinery executors bind through the pure core's exec seam (the
  falsifiers exercise the plan-stall executor against the REAL PlanRegistry
  machinery); the vault mirror rides port caps when present (ring-first).
  Zero host LOC; no new dependencies; existing tests stay green.

## Evidence

- Falsifiers, green in this record's tree BEFORE the flip per `D-364`
  (`omega:loop --stub D-447` generates the RED stub this list resolves to):
  - `F-SIM.1` (determinism) — the same pinned scenario + the same substrate digest, replayed 100 times → byte-identical receipts (D-429's inputHash law at runtime)
  - `F-SIM.2` (the-stall-injection) — a dead-realization stall injected into a registered plan fires EXEC_PLAN_STALLED in sim within the declared stall deadline, exactly as live (D-435's cross-reference honored — the REAL PlanRegistry machinery)
  - `F-SIM.3` (containment) — a scripted write to a live namespace refuses SIM_CONTAINMENT_BREACH, refused and ledgered; the live namespace byte-verified unchanged
  - `F-SIM.4` (refusal-proves) — each register code fired by a planted violation (unknown scenario, unpinned seed, unknown fault, the breach, self-certification, divergence)
  - `F-SIM.5` (rehearsal-predicts) — N production incidents replayed as scenarios reproduce their recorded decision sequences from the pinned pre-incident substrates — the receipt is the postmortem
  - `F-SIM.6` (headless) — 1–5 daemon-only
  - `F-SIM.7` (loud-failure) — no shrug branch: every divergence is a row or a refusal
- Files: `plugins/vivim-run/src/simulation.ts`, ops in `src/index.ts`,
  `tooling/gates/test/f-sim.test.ts`.
- Refusal register (exact): SIM_SCENARIO_UNKNOWN · SIM_SEED_UNPINNED ·
  SIM_FAULT_UNKNOWN · SIM_CONTAINMENT_BREACH · SIM_REPLAY_DIVERGENT ·
  SIM_SELF_CERTIFICATION.
- Precedents: the re-materialized Ω-8 spec (paper `D-432`); `D-429`
  (inputHash law, advisory stance); `D-435` (EXEC_PLAN_STALLED and the plan
  registry it fires from); `D-321` (never fake enforce); `D-364`.


- Ratified on greens (evidence-class, F-SIM.1-7 green in this record's tree BEFORE the flip per D-364): landing commit e2dff6f; full gate green 1362/0 ×2 on the PROPOSED tree (2026-09-21T06:37:56Z and 06:43Z; the prior tip's 1320 + 42 new); zero host LOC; anvil untouched.

## Index

summary: plugins/vivim-run/src/simulation.ts — the simulation substrate: pinned scenario rows (seeded, step-grammar-gated, recordedFrom-cited), the deterministic replay fold (same scenario + same seeded substrate ⇒ byte-identical receipts), the contained exec seam (writes only ns sim.* — SIM_CONTAINMENT_BREACH refused and ledgered), SIM_REPLAY_DIVERGENT on any divergence, SIM_SELF_CERTIFICATION for a simulation citing only itself, and the advisory-for-production stance (the citing record owns blocking)
rationale: The rehearsal before the show - an unpinned scenario is divination, a nondeterministic replay is a shrug wearing a lab coat, and a rehearsal that can touch production is a bomb with a lanyard (Omega-8, the simulation substrate, re-materialized spec)
class: evidence
