# Task List Snapshot + ChatGPT Execution Path
## 2026-09-28

## 1. What we are testing

The real task fixture is:
`docs/agent-system/FULL-INTEGRATION-TASK-LIST.md`

The active goal is:
`docs/agent-system/goals/finish-full-list/GOAL.md`

At snapshot time the list explicitly says it is the durable master list, with
session-local todo mirrors disposable and the master list winning.

The goal explicitly requires every row to end in DONE, BLOCKED with reason/unblock
path, or PARKED/SUPERSEDED with justification, verified against the repository.

## 2. Snapshot of the list

### G0 — Shared baseline

All DONE:
- G0.1 Sandbox → main integration;
- G0.2 Gate B local readiness;
- G0.3 consolidated architecture document;
- G0.4 gaps + preparation docs.

### P1 — Worker tier

All DONE:
- P1.1 five worker bindings;
- P1.2 worker catalog;
- P1.3 CFA task:false→true plus work-only rule;
- P1.4 delegation amendment;
- P1.5 subagent depth 2;
- P1.6 name-scope impossibility proof on OpenCode 1.18.4.

### P2 — Live spawn proof

- P2.1 DOING: Steward→CFA→worker run with --auto; current notes contain a real
  headless-agent addressing/fallback issue and xhigh validation observation;
- P2.2 TODO: verify chain evidence + record;
- P2.3 TODO: validate --variant xhigh on contributor-free execution.

### S — Parallel OpenCode sessions

- S.1 DONE: topology rules;
- S.2 DONE/being durably reconciled at the branch's current execution point: two-process procedure;
- S.3 TODO: two-process 10-point exchange run;
- S.4 TODO: multi-session standing practice.

### N — Setup-needs identification

- N.1 DONE;
- N.2 DONE;
- N.3 DONE: mine roadmaps/M1 packets for Phase-3 inputs;
- N.4 TODO: re-identify needs after each phase.

### H — Phase 2b hardening

- H.1 BLOCKED: no second machine;
- H.2 BLOCKED: real key-rotation operation absent;
- H.3 DONE: CFA-11 counters automated, with counter-2 registry designation still an owner question.

### Phase 3

All listed realtime/tool mechanisms are TODO and explicitly gated behind P2/S.3
and owner authorization.

### Phase 4–5

Self-rebase, digest/receipt operations, Cycle-4 re-evaluation, and future integration
remain PARKED behind Phase 3.

## 3. Active goal acceptance contract

The finish-full-list goal requires:

1. P2.1 full-chain Steward→CFA→worker evidence, with P2.2 recorded and P2.3
   validated or explicitly recorded as fallback/unknown;
2. S.2 procedure, S.3 exchange run, S.4 standing practice — or each explicitly
   BLOCKED with evidence;
3. N.3 mining and N.4 standing-rule confirmation;
4. H.3 counter automation or explicit BLOCKED evidence;
5. Phase 3 remains gated unless P2/S.3 are green AND the owner says go;
6. master list §9 log updated every turn;
7. Steward TASKS closed;
8. durable goal receipt left per SESSION-RESULT-CONTRACT.

## 4. How the ChatGPT path was / would be executed

### Step A — establish current truth

ChatGPT first reads:
- current main;
- AGENTS.md / BUILD_CONTEXT / CURRENT-CONTEXT;
- Steward control plane;
- master portfolio router;
- durable completion gate;
- full integration task list;
- finish-full-list goal;
- relevant CFA TASKS.md files.

Historical sandbox state is treated as lineage only.

### Step B — compile the dependency graph

From the current list, classify work:
- P2.1 is independently executable now;
- S.2, N.3, H.3 can be treated as independent bounded units where their current
  evidence prerequisites are satisfied;
- P2.2/P2.3 follow P2.1;
- S.3 follows S.2;
- S.4 follows S.3;
- H.1 remains blocked on a second machine;
- H.2 remains blocked until real rotation exists;
- Phase 3 stays gated until its stated prerequisites and owner authorization exist;
- Phase 4–5 remain parked.

### Step C — spawn a bounded wave

The prescribed local-CFA path is:

- one task envelope per unit;
- explicit identity;
- current prerequisites as SHA/artifact/semantics;
- read-first paths;
- completion condition;
- stop condition;
- write scope;
- no peer-home editing;
- no stale router resurrection.

Example Wave 1 in the current record:

- CFA-10 → S.2;
- CFA-06 → N.3;
- CFA-09 → H.3;
- Steward → P2.1 probe.

The important test property is not the exact parallel grouping; it is whether the
Steward reaches the same dependency classification and sends work to the correct owner.

### Step D — verify receipts rather than trusting reports

For every returned unit:

- inspect the actual artifact;
- inspect the actual receipt;
- inspect the task-state transition;
- verify the claimed commit/ref;
- confirm the work stayed inside the declared write scope;
- preserve PARTIAL/BLOCKED/UNKNOWN where warranted.

Chat completion is never enough.

### Step E — close only after durable completion

The ChatGPT Steward then performs the completion transaction:

1. durable artifact exists;
2. receipt exists;
3. task/list state is updated;
4. exact commit/ref exists;
5. current repository is re-read;
6. receipt and closure are verified on the delivery ref;
7. only then may the state become DONE.

### Step F — continue according to the list, not momentum

After one bounded turn, recompute from current main and the master list.

Do not repeat completed substantive work.
Do not start downstream gated work early.
Do not interpret 'many tasks completed' as permission to skip unresolved gates.

## 5. What the local test must demonstrate

The local run should independently rediscover the same model:

master register → local roadmap → master portfolio router → central task state → local TASKS projection

and then:

owner goal → Steward dependency graph → CFA ownership → bounded envelope → execution
→ receipt → verification → list closure → next routing.

That chain is the actual object under test.