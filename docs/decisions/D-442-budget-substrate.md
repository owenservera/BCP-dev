# D-442 — The budget substrate: declared budgets, attributable sampled burn, loud exhaustion

## Status

RATIFIED

## Context

- The Ω-2 spec (paper `D-426` — THIS tree's D-426 is Ω-DEV.2; the collision
  is recorded in the genome lineage note, not hidden; re-materialized per
  `omega-upgrades/RE-MATERIALIZATION-NOTE.md`) names the governance layer:
  every metered thing — task, plan, watch, context, realization — declares
  its budget before it runs, burns against it attributable to a principal,
  and degrades through visible states when physics intervenes (§18).
- The one invariant: **no resource without a budget.** Consumption with no
  declaration refuses GOV_BUDGET_UNDECLARED; burn accrues to the declaring
  principal; exhaustion is a visible state and over-consumption a named
  refusal — never a quiet freeze; the fold over declaration + burn rows is
  the only truth, no stored summary exists to disagree.

Blocks: none

## Options

| Criterion | (a) pure budget core in vivim-run (declarations + sampled burn + the assert fold) | (b) per-subsystem ad-hoc limits | (c) the pool deadline only |
|---|---|---|---|
| Declared before run | Yes — undeclared consumption refuses, named | No — each caller self-limits | Partially — tasks only |
| Burn is attributable | Yes — samples carry the consumer; the principal owns the total | No — spend accrues to nobody | No |
| Exhaustion is loud | Yes — EXHAUSTED renders; over refuses GOV_BUDGET_EXCEEDED | No — silent degradation | No |
| Zero host LOC | Yes | Yes | Yes |

## Decision

**Decision:** (a) — `plugins/vivim-run/src/budget.ts`, in substance:

- **Declarations** (ns `gov.budget`, append-only): `{budgetId, principal,
  scope: task|plan|watch|context|realization, limits: {cpuMs, memMB,
  opsCount?}, window: {burnIntervalMs}, basis, supersedes?}` — validated at
  the door (GOV_BUDGET_SCOPE_INVALID on a scope that names nothing
  meterable; GOV_BUDGET_AMENDMENT_UNCITED when a re-declaration amends
  without citing its basis — budgets move by evidence, never by vibes).
- **Burn samples** (ns `gov.burn`): `{budgetId, consumer, at, from, spent,
  refs}` — SAMPLED at the declared cadence, not per-op (measuring the meter
  is the failure mode; the cadence is itself a declared limit field);
  enforcement stays exact — the fold counts every unit, sampled or pending.
- **The fold** (`assertBudget`): declaration + samples + accrued unsampled
  spend → OK | EXHAUSTED (consumed = limits — a visible state, the work ran)
  | refusals (GOV_BUDGET_UNDECLARED; GOV_BUDGET_EXCEEDED naming the budget
  AND the consumer). No stored mutable summary — the fold is the truth.
- `budget.read@1` derives the burn-vs-declared view (consumed, remaining,
  freshness CURRENT|LAGGING|STALE, predicted exhaustion) and renders
  headless text.

## Consequences

- The deadline discipline the tree already proved (run.submit's clamp, the
  plan budgetTrace seam D-435) gets the ledger above it: spend accrues to
  principals, and "who melted the laptop" answers with rows.
- As-built honesty: this landing is the LEDGER half of Ω-2 — declare,
  consume (refuses when exceeded), read, with sampled burn and loud
  exhaustion states. The governor's realization state machine
  (ghost/dormant/hydrated/suspended, gov.suspend/resume, F8's unplug
  choreography) stays scoped to its plugin-side lane per `D-421` and is NOT
  claimed here. The spec's op names budget.burn/state land as
  budget.consume/read (burn that a refusal blocks is never recorded).
- Zero host LOC; no new dependencies; existing tests stay green.

## Evidence

- Falsifiers, green in this record's tree BEFORE the flip per `D-364`
  (`omega:loop --stub D-442` generates the RED stub this list resolves to):
  - `F-GOV.1` (declared-before-run) — consume with no declaration refuses GOV_BUDGET_UNDECLARED; declare; consume; green — the refusal proves the gate
  - `F-GOV.2` (deterministic-replay) — the assert fold over the same declaration + burn rows replays byte-identically ×100; no stored summary exists to disagree
  - `F-GOV.3` (attributable-burn) — samples carry the consumer, the declaration carries the principal; budget.read answers "who spent what" with rows
  - `F-GOV.4` (exhaustion-is-loud) — consumed = limits lands the visible EXHAUSTED state; one unit over refuses GOV_BUDGET_EXCEEDED naming budget + consumer — never a quiet freeze
  - `F-GOV.5` (refusal-proves) — bad scope, undeclared consume, uncited amendment, over-consumption: each register code fired by a planted violation, the sentence naming the budget and the scope
  - `F-GOV.6` (sampled-burn) — burns sample at the declared burnIntervalMs cadence (10 consumes, one row, the spend exact); the cadence is itself a declared field
  - `F-GOV.7` (headless-loud-failure) — the ceremony is daemon/CLI-only, budget.read renders text, and zero quiet paths: every degradation branch refuses named or renders visibly
- Files: `plugins/vivim-run/src/budget.ts` (the pure core), wiring in
  `plugins/vivim-run/src/index.ts`, `tooling/gates/test/f-gov-budget.test.ts`.
- Refusal register (exact): GOV_BUDGET_UNDECLARED · GOV_BUDGET_SCOPE_INVALID ·
  GOV_BUDGET_AMENDMENT_UNCITED · GOV_BUDGET_EXHAUSTED · GOV_BUDGET_EXCEEDED.
- Precedents: the re-materialized Ω-2 spec (paper `D-426`); `D-421` (the
  governor's plugin-side scoping); `D-435` (the budgetTrace seam);
  `D-388`/`D-392` (the manifest runtime.budget vocabulary); `D-364`.


- Ratified on greens (evidence-class, F-GOV.1-7 green in this record's tree BEFORE the flip per D-364): landing commit e2dff6f; full gate green 1362/0 ×2 on the PROPOSED tree (2026-09-21T06:37:56Z and 06:43Z; the prior tip's 1320 + 42 new); zero host LOC; anvil untouched.

## Index

summary: plugins/vivim-run/src/budget.ts — the budget substrate: append-only declarations over five metered scopes (limits plus the declared burn-sample cadence), attributable sampled burn rows with exact enforcement, the assertBudget fold as the only truth (exhaustion a visible state, over-consumption a named refusal naming budget and consumer), and the headless burn-vs-declared view with freshness and predicted exhaustion
rationale: No resource without a budget - spend that is undeclared, unattributable, or quietly exhausted is exactly the invisible failure §18 names, and a ledger nobody can replay is a rumor with numbers on it (Omega-2, the governance substrate, re-materialized spec)
class: evidence
