# D-450 — Liveness: asleep is still alive, and awake is budgeted

## Status

RATIFIED

## Context

- The Ω-14 spec (paper `D-446`, re-materialized per
  `omega-upgrades/RE-MATERIALIZATION-NOTE.md` — the transcript original is
  not on disk; this tree record lands the re-materialized spec's mechanism)
  names the liveness boundary: every live object wears a governed state —
  ghost, dormant, hydrated, suspended — with wake/sleep/suspend as
  ceremonies, dormancy proven by cheap signed proofs against the vault
  watch, and any gap between a claimed state and the evidence a named,
  loud refusal.
- The one invariant: **transitions are ceremonies, never spontaneous.**
  Ghosts watch, they never write (a shed realization has no composition
  running — queuing its write would be a hidden path); wake is
  budget-check-first (an undeclared budget refuses; hydration the profile
  cannot afford refuses with the trade named — the machine is sovereign
  territory too); suspend is never a quiet freeze (typed reason
  battery|pressure|law, the badge sentence on the row); a dormancy proof
  whose watched revision is older than the declared watch window means the
  watch died, and the nap is now a death.

Blocks: none

## Options

| Criterion | (a) governed state machine in vivim-run (state rows + ceremonies + proofs) | (b) watchdog-internal states | (c) realization self-reporting |
|---|---|---|---|
| Plugins cannot self-declare life | Yes — the kernel holds the rows against them | Partly — process tier only | No |
| The unmetered wake is refused | Yes — budget-check-first, trade named | No | No |
| Sleep vs death is provable | Yes — signed dormancy proofs vs the watch | No | No |
| Zero host LOC | Yes | Yes | Yes |

## Decision

**Decision:** (a) — `plugins/vivim-run/src/liveness.ts`, in substance:

- **Liveness-state rows** (ns `liveness`): `{tileId, state:
  ghost|dormant|hydrated|suspended, since, budgetRef?, wakeProof?}` — the
  §18 lifecycle as latest-wins rows with append-only history; the machine
  admits only its lawful edges (an unlawful or no-op transition refuses
  `LIVENESS_STATE_INVALID`; a `from` that disagrees with the row refuses
  `LIVENESS_STATE_DRIFT`); suspend carries a typed reason
  battery|pressure|law and the §18 badge sentence on the row.
- **The wake ceremony** (`liveness.wake@1`): budget check FIRST — a wake
  without a declared budgetRef refuses `LIVENESS_WAKE_BUDGET_UNDECLARED`,
  and a hydration the declared capacity cannot afford refuses
  `LIVENESS_BUDGET_REFUSED` naming the trade (shed or suspend first);
  then the frame citation (an ungated wake refuses
  `LIVENESS_WAKE_UNGATED` — turning things on is doing, and doing pays
  the gate); then hydration, then the row, always with `wakeProof`.
- **Ghosts never write:** a mutation attempt by a ghost refuses
  `LIVENESS_GHOST_WRITE` — no queued write exists anywhere in the tree;
  **dormancy proofs:** `{watchedRev, signedBy, at}` — cheap, frequent,
  regenerable; a proof whose watched revision lags the declared watch
  window, or whose bytes the fold cannot re-derive, refuses
  `LIVENESS_PROOF_STALE`; the stethoscope answers D-435's
  `blockedOn: liveness` from the state rows (the two-sided handshake).

## Consequences

- Thousand-object workspaces get the §18 physics as law; the F8 governor
  endstate gains its badge discipline; D-435's plan registry can cite
  state rows on both sides of a stall; sleep/wake becomes scriptable
  chaos for rehearsals.
- As-built: liveness.set@1 (MUTATION — the ceremony door for
  sleep/suspend/placement), liveness.wake@1 (MUTATION — budget-first,
  framed, proofed), liveness.read@1 (READ — states, history, proofs, and
  the badge sentences rendered headlessly) land in vivim-run's lane; the
  vault mirror rides port caps when present (ring-first). Zero host LOC;
  existing tests stay green.

## Evidence

- Falsifiers, green in this record's tree BEFORE the flip per `D-364`
  (`omega:loop --stub D-450` generates the RED stub this list resolves to):
  - `F-LIVENESS.1` (two-sided-stall) — a plan needing a dormant realization reads blockedOn: liveness citing the state row; wake it through the ceremony → the plan proceeds — the D-435 handshake green on both sides
  - `F-LIVENESS.2` (budgeted-wake) — hydration over profile → LIVENESS_WAKE_BUDGET_UNDECLARED without a budget, LIVENESS_BUDGET_REFUSED naming the trade with one; shed one tile → the wake succeeds, with rows on both sides
  - `F-LIVENESS.3` (honest-suspend) — governor suspends → the typed reason and the §18 badge sentence land on the state row; an untyped reason refuses LIVENESS_STATE_INVALID; never a quiet freeze
  - `F-LIVENESS.4` (dormancy-proof) — a dormant object's probe returns a signed proof citing the current watched revision; kill the watch → the probe refuses LIVENESS_PROOF_STALE
  - `F-LIVENESS.5` (ghost-refusal) — a ghost's mutation attempt → LIVENESS_GHOST_WRITE; no queued write exists anywhere in the tree
  - `F-LIVENESS.6` (headless) — 1–5 daemon-only; liveness.read answers every question the badge could render
  - `F-LIVENESS.7` (loud-failure) — zero quiet freezes — every suspend, drift, and stale proof is a row or a refusal with a sentence
- Files: `plugins/vivim-run/src/liveness.ts`, ops in `src/index.ts`,
  `tooling/gates/test/f-liveness.test.ts`.
- Refusal register (exact): LIVENESS_STATE_INVALID ·
  LIVENESS_PROOF_STALE · LIVENESS_GHOST_WRITE ·
  LIVENESS_WAKE_BUDGET_UNDECLARED · LIVENESS_BUDGET_REFUSED ·
  LIVENESS_WAKE_UNGATED · LIVENESS_STATE_DRIFT.
- Precedents: the re-materialized Ω-14 spec (paper `D-446`); `D-435`
  (blockedOn: liveness, the handshake); `D-360`/`D-397` (the watchdog and
  supervisor this boundary governs above); `D-440` (the watch substrate
  the proofs cite); `D-364`.


- Ratified on greens (evidence-class, F-LIVENESS.1-7 green in this record's tree BEFORE the flip per D-364): landing commit f9b8841; full gate green 1418/0 ×2 on the PROPOSED tree (2026-09-21T07:20:03Z and 07:25Z; the prior tip's 1362 + 56 new); zero host LOC; anvil untouched.

## Index

summary: plugins/vivim-run/src/liveness.ts — the liveness state machine: ghost, dormant, hydrated, suspended as governed rows, wake as the budget-check-first framed ceremony (the trade named on refusal), suspend with typed reasons and the badge sentence, ghosts refused on write, signed dormancy proofs against the watch, and the D-435 stethoscope
rationale: Asleep is still alive and awake is budgeted - a quiet freeze is a lie of omission, an unmetered wake melts the laptop, and a ghost that writes is a hidden path wearing a badge (Omega-14, liveness, re-materialized spec)
class: evidence
