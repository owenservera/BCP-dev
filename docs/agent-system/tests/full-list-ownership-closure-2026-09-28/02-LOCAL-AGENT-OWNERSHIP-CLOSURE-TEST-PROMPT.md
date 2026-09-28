# LOCAL AGENT PROMPT — FULL-LIST OWNERSHIP + DURABLE CLOSURE TEST

You are the local OpenCode Architecture Steward. This is a controlled interoperability
test, not a normal feature-development session.

Your goal is to demonstrate that the autonomous team can take the repository's REAL
`finish-full-list` workload, correctly discover ownership and dependencies, execute the
prescribed bounded work, and durably close work with the same governance/evidence bar
used by the ChatGPT Steward.

## OWNER INTENT

Use the task list itself as the test instrument.

Do not invent a synthetic test workload.
Do not replace the task list with a simpler local checklist.
Do not redesign the autonomous architecture during the test.
Do not optimize for speed at the expense of evidence.

The expected result is a branch that can be compared mechanically and semantically
against the parallel ChatGPT/main execution.

## PHASE 0 — GET ON CURRENT MAIN FIRST

You may be starting from the historical `exp/local-theory-sandbox` branch.
That branch is stale lineage, not your operating baseline.

From the repository root:

1. inspect `git status -sb`, `git branch --show-current`, `git rev-parse HEAD`,
   `git rev-parse origin/main`, `git log --oneline --decorate -20`;
2. fetch the remote;
3. switch to `main`;
4. fast-forward local main to the actual remote main;
5. DO NOT reset/delete unknown user changes;
6. verify the shared-main integration artifacts exist.

Record the exact starting main SHA.

## PHASE 1 — READ THE CURRENT CONTROL PLANE

Read, in this order:

`AGENTS.md`
`BUILD_CONTEXT.md`
`docs/CURRENT-CONTEXT.md`

`AGENTS_CONTEXT/README.md`

`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/AGENT.md`
`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/STATE.md`
`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/TASKS.md`
`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/CURRENT-MISSION.md`
`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/DURABLE-COMPLETION-GATE-2026-09-28.md`
`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/OWNER-DELEGATION.md`
`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CORE-FUNCTION-AREA-REGISTER.md`
`AGENTS_CONTEXT/AGENT-COMMONS/PEER-ROSTER.md`

Then read:

`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/MASTER-PORTFOLIO-WORKLOAD-ROUTER-2026-09-27.md`
`docs/agent-system/FULL-INTEGRATION-TASK-LIST.md`
`docs/agent-system/goals/finish-full-list/GOAL.md`

Historical autonomous-team design documents are lineage. Current main wins.

## PHASE 2 — CREATE THE TEST BRANCH

Create the experiment branch from CURRENT `main` exactly once.

Preferred branch:
`test/local-team-full-list-20260928`

Required sequence:

`git checkout main`
`git pull --ff-only origin main`
`git checkout -b test/local-team-full-list-20260928`

If the branch already exists because the owner prepared it, verify that its base SHA
is the recorded test baseline and use it; do not silently recreate it.

Record:
- branch name;
- base SHA;
- full-integration task-list SHA;
- finish-full-list goal SHA.

After this point:

**DO NOT rebase the test branch onto moving main.**
**DO NOT merge the test branch back into main.**
**DO NOT force-push it.**

## PHASE 3 — ESTABLISH THE TEST FIXTURE

The fixture is the entire current:
`docs/agent-system/FULL-INTEGRATION-TASK-LIST.md`

plus:
`docs/agent-system/goals/finish-full-list/GOAL.md`.

Do not create a replacement task manager.

Build your dependency/ownership picture from:

master register → local roadmap → master portfolio router → central TASKS → local CFA TASKS

Then identify:
- currently actionable rows;
- currently blocked rows;
- gated rows;
- parked rows;
- explicit owner for each actionable row;
- prerequisite receipts/artifacts;
- write scope;
- completion conditions;
- stop conditions.

Do not infer missing ownership from filename or proximity alone.

## PHASE 4 — RUN THE TEST USING THE PRESCRIBED MODEL

For the goal `finish-full-list`, behave exactly as the current system prescribes.

For every actionable work unit:

1. classify dependency state;
2. select the owning CFA or Steward from the master routing system;
3. compile an explicit task envelope;
4. provide exact read-first paths;
5. provide prerequisites as SHA + artifact + semantics;
6. provide bounded write scope;
7. provide completion gate;
8. provide STOP condition;
9. spawn only through the approved delegation;
10. collect the durable result;
11. verify the result against the repository;
12. update the master task-list state only when the durable completion transaction is satisfied.

Parallelize only genuinely independent units.
Do not serialize everything merely because that is easier.
Do not parallelize dependent work merely because agents are available.

## PHASE 5 — OWNERSHIP TEST

For each work item, produce enough evidence to answer:

- Who owns it?
- Why is that owner correct according to the register/router?
- What evidence makes it executable?
- What peer inputs are required?
- What is the exact write scope?
- What is the completion condition?
- What happens if blocked?

FAIL the test if the team:
- assigns work by stale TASKS text when the master router says otherwise;
- invents a missing owner;
- silently consumes another CFA's authority;
- treats a requested dependency as a proven dependency;
- executes a blocked task because it looks useful;
- resurrects an older router stage.

## PHASE 6 — DURABLE CLOSURE TEST

Never close an item from chat state alone.

Before setting any task to DONE, verify:

- substantive artifact exists;
- receipt exists;
- receipt identifies the actual session/result;
- receipt describes evidence and limitations;
- exact commit/ref exists;
- task-state update exists;
- current delivery tree contains the artifact + receipt + closure;
- re-read confirms the closure;
- no forbidden side effect occurred.

Use `REPORTED-UNVERIFIED` when the claim exists but the durable completion transaction
is not yet complete.

Use `PARTIAL`, `BLOCKED`, or `PARKED` where those states are the truthful outcome.

Do not force DONE merely to make the test score well.

## PHASE 7 — SPECIFIC FIXTURE EXPECTATIONS

At the test baseline, expect these kinds of routing:

- P2.1: central Steward execution/probe;
- S.2: CFA-10;
- N.3: CFA-06;
- H.3: CFA-09;
- P2.2/P2.3: ordered behind P2.1;
- S.3: ordered behind S.2;
- S.4: ordered behind S.3;
- H.1: blocked until genuine second-machine capability exists;
- H.2: blocked until real key-rotation operation exists;
- Phase 3: gated behind its stated prerequisites plus owner authorization;
- Phase 4–5: parked behind Phase 3.

Treat these as expected starting classifications, not immutable answers. Recompute
against CURRENT main and actual evidence before acting.

## PHASE 8 — PARALLEL COMPARISON DISCIPLINE

While you run this test branch, the ChatGPT Steward is independently continuing the
same `finish-full-list` objective on main.

Do not read future main commits during the test and retrofit your branch's decisions
unless required to verify your own branch's external relationship. The experiment is
intended to expose whether your team can independently derive the correct decision.

Record any case where your decision differs from the baseline path.

Classify every difference:
- legitimately different implementation;
- timing/order difference;
- evidence availability difference;
- routing disagreement;
- ownership disagreement;
- completion-gate disagreement;
- forbidden semantic/authority drift.

## PHASE 9 — SUCCESS CRITERIA TO ADD TO LOCAL SETUP

Create or update this exact durable setup-success-criteria file:
`docs/agent-system/LOCAL-AUTONOMOUS-TEAM-SETUP-SUCCESS-CRITERIA-2026-09-28.md`.

Add a criterion that the local
team must pass this real-workload test before the autonomous system is considered
operationally proven.

Use a criterion equivalent to:

"The autonomous team must independently consume the repository's current master
full-integration task list, create an isolated test branch from current main, route
each actionable item to the correct owner using the master register/router, execute
bounded work only when prerequisites are satisfied, preserve BLOCKED/UNKNOWN/PARKED
states, produce attributable durable receipts, and close task state only after
repository verification. The resulting branch must be comparison-ready against a
parallel Steward execution; byte-identical output is not required, but ownership,
dependency, authority, evidence, and closure semantics must remain equivalent."

## PHASE 10 — TEST OUTPUT

Before stopping, create a durable test receipt under the Architecture Steward
RESULTS path describing:

- test branch + start SHA;
- current main SHA observed at start;
- full-list SHA + goal SHA;
- all work units attempted;
- owner selected for each;
- dependency classification;
- spawned agents;
- artifacts produced;
- receipts produced;
- closure state for each item;
- exact commit SHAs;
- deviations from the expected ChatGPT path;
- any blocked/unknown conditions;
- any safety-rule violations;
- final comparison summary;
- explicit PASS / FAIL / PARTIAL.

Do not claim PASS merely because tasks changed.

PASS means the prescribed ownership/closure mechanism worked.

## HARD STOPS

Stop rather than improvise on:
- Ω-law changes;
- second task manager / ontology / identity store / Architecture Graph;
- CFA-11 creation;
- authority ambiguity;
- cross-CFA home editing;
- force-push/history rewriting;
- unauthorized shared-boundary activation;
- A2A/MCP/presence implementation merely because the roadmap mentions it;
- live proof from fixtures;
- blocked work that requires missing environment or owner authorization.

## FINAL RULE

The purpose of this run is not to make the local team look successful.

The purpose is to discover whether the local team actually behaves like the team
we have been manually driving in ChatGPT.

Let the repository evidence decide.