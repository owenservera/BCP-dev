# Full-List Ownership + Closure Test
## 2026-09-28

> Purpose: use the real current autonomous-team task list as a black-box test of
> whether the local OpenCode team correctly discovers ownership, resolves routing,
> executes the prescribed bounded work, produces durable receipts, and closes the
> same work without relying on the ChatGPT Steward session.

## Test thesis

This is not a toy workload and not a second architecture design.

The fixture is the repository's own live workload:
- docs/agent-system/FULL-INTEGRATION-TASK-LIST.md
- docs/agent-system/goals/finish-full-list/GOAL.md
- the Architecture Steward master router and the ten CFA TASKS.md projections.

ChatGPT continues the same workload on main in parallel. The local team runs the
same goal on an isolated test branch. At the end, we compare the two executions
for ownership discovery, dependency reasoning, evidence discipline, branch hygiene,
receipt quality, state transitions, and completion correctness.

## Frozen test input

At test creation:
- repository: owenservera/BCP-dev
- known main / test-branch base: c4c369461fa5a2d77428d13279eb212b5a7301df
- master task list blob SHA: 1124b0c7fe8bd0b70b9a7ed9c0bc8ad393289736
- goal blob SHA: 341b7037e5e8df76b1f23b79f25422f4490bc1f6
- goal: finish-full-list

The local test branch MUST be created from the current main at the moment the
local agent starts. It must record its exact starting SHA. Once created, it becomes
an isolated experiment; it must not be rebased onto moving main during the run.

## Success question

Can the local autonomous team take the same durable work queue and independently
arrive at materially equivalent ownership, dependency, evidence, and closure decisions
while preserving the repository's one-writer/authority/receipt rules?

## Explicit comparison rule

Equivalent does not mean byte-for-byte identical.

Compare:
- task identity and intended owner;
- dependency classification and ordering;
- bounded scope and stop conditions;
- artifacts actually produced;
- receipt attribution and evidence;
- TASKS/list state transition;
- exact delivery SHA/ref;
- unresolved UNKNOWN/BLOCKED states;
- forbidden side effects.

A branch may legitimately discover a different implementation detail. It may not
legitimately invent authority, collapse UNKNOWN into DONE, write another agent's home,
or bypass the Durable Completion Gate.

## Branch

Recommended exact branch:
`test/local-team-full-list-20260928`

Branch rules:
- based on current main once, before the local run;
- no force-push;
- no merge into main during the experiment;
- no rewrite of the branch after an autonomous run;
- all local work remains attributable to this branch;
- final comparison occurs before any possible promotion.

## Test outputs

The local run should leave:
- the normal work artifacts it legitimately produces;
- normal CFA/Steward receipts;
- a test-run receipt describing the autonomous execution;
- a comparison-ready state report;
- exact branch start/end SHAs.

The test branch is experimental. A successful test does not automatically promote
its implementation into main.

## Current known fixture shape

At the frozen input, the list is structured as:
- G0 shared baseline — DONE;
- P1 worker tier — DONE;
- P2 live spawn proof — P2.1 DOING, P2.2/P2.3 TODO;
- S parallel OpenCode sessions — S.1/S.2 DONE, S.3/S.4 TODO;
- N setup-needs identification — N.1/N.2/N.3 DONE, N.4 TODO;
- H Phase 2b hardening — H.1/H.2 BLOCKED, H.3 DONE;
- Phase 3 realtime/tools — gated TODO;
- Phase 4–5 dogfood/operations — PARKED;
- an append-only turn log recording prior execution.

The active goal's acceptance criteria require P2.1/P2.2/P2.3 handling, S.2→S.3→S.4
handling, N.3→N.4 handling, H.3 handling, explicit gating before Phase 3, and
Durable Completion Gate compliance.

## Known current owners in the fixture

- S.2 procedure: CFA-10 / runtime-constitution-core-substrate;
- N.3 Phase-3 input mining: CFA-06 / capability-provider-realization;
- H.3 counter automation: CFA-09 / evolution-compatibility-self-maintenance;
- P2.1 CLI probe: Architecture Steward / central orchestration;
- P2.2/P2.3: resolve from the master routing + goal acceptance criteria; do not invent
  a CFA owner merely to fill a field;
- later rows: follow the master portfolio router and goal dependencies, not stale
  local labels.

## Safety boundary

This test must not:
- modify Ω law;
- create CFA-11;
- create a second task manager, ontology, identity store, or Architecture Graph;
- treat a test-branch result as mainline proof;
- begin Phase 3 merely because the local team can spawn agents;
- treat historical sandbox results as current proof.