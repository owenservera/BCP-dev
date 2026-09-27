# CFA Domain Roadmap Formation Protocol
## 2026-09-27

> Status: ACTIVE
> Classification: derived operating protocol; not Ω law
> Purpose: transition ratified CFA homes from context/bootstrap readiness into CFA-owned domain planning without letting the Architecture Steward or an inherited program plan pre-select the work.

## 1. Why this stage exists

A ratified CFA home is not a completed work program.

The home-upgrade stage establishes:

- durable identity;
- current state;
- lessons;
- boundaries;
- persistent task machinery;
- fresh-session operability.

It does **not** determine the CFA's substantive domain roadmap.

After home setup, each CFA must be allowed to inspect the repository from its own responsibility and decide what work is actually warranted inside that responsibility. The Architecture Steward then reconciles those domain roadmaps into the cross-CFA architecture and dependency picture.

The intended transition is:

```
RATIFIED CFA
  ↓
HOME / CONTEXT READY
  ↓
CFA-OWNED DOMAIN ROADMAP
  ↓
CFA PERSISTENT TASK QUEUE
  ↓
CROSS-CFA RECONCILIATION
  ↓
BOUNDED SHARED FRONTIER
  ↓
EXECUTION
```

The missing middle stage must not be skipped.

## 2. Planning ownership

The planning authority for a CFA's internal work is ordered as follows:

1. explicit owner decisions and applicable Ω law;
2. the ratified CFA identity, responsibility and non-scope;
3. verified current repository evidence and existing authoritative destination contracts;
4. the CFA's own evidence-backed domain roadmap;
5. cross-CFA reconciliation and dependency analysis by the Architecture Steward;
6. inherited program plans, delivery cycles, historical launch queues and prior recommendations as candidate inputs.

A destination program plan can identify useful work. It does **not** automatically become a CFA task.

A pre-existing "current cycle" is a hypothesis about sequencing, not proof that the CFA has completed the domain planning needed to enter that cycle.

## 3. Mission

The roadmap-formation session answers:

> **Given what this CFA now owns, what is the smallest evidence-backed body of work that should happen next, in what dependency order, and what should remain unknown or deferred?**

This is a planning and characterization task.

It is not permission to implement the resulting tasks.

## 4. Required inputs

The session must read, at minimum:

1. current `main`;
2. repository-wide operating agreements;
3. the CFA's `SESSION-CONTEXT.md`;
4. the ratified durable identity;
5. the CFA's `STATE.md`;
6. the CFA's `TASKS.md`;
7. the CFA's `LESSONS.md` when present;
8. owner-alignment/history artifacts;
9. the strongest relevant Ω and destination evidence for the CFA;
10. relevant peer artifacts only where needed to test boundaries or dependencies.

The session must distinguish:

- settled authority;
- observed evidence;
- derived interpretation;
- proposal;
- unknown;
- contradiction.

## 5. Roadmap work

The CFA must independently:

### A. Reconstruct the real domain frontier

Identify:

- what is already established;
- what remains unknown;
- what is under-characterized;
- what is contradicted;
- what is already implemented/proven;
- what is merely described;
- what could materially change the domain boundary.

Do not optimize for the largest backlog.

### B. Generate a bounded roadmap

Produce a small ordered or conditionally ordered set of domain work items. Prefer the minimum set needed to make the responsibility coherent and testable.

For each proposed item record:

- task ID;
- concise objective;
- classification;
- evidence basis;
- semantic/authority/read/write/verification dependencies;
- write scope;
- next action;
- completion condition;
- stop/escalation condition;
- important peer inputs;
- whether it is research, reconciliation, proof, design, or later implementation candidate.

### C. Populate the persistent queue

Add the selected domain tasks to the CFA's `TASKS.md`.

Every durable task must state:

- STATUS;
- PRIORITY;
- DEPENDENCIES;
- WRITE SCOPE;
- NEXT ACTION;
- COMPLETION CONDITION;
- STOP CONDITION where useful.

The task queue is the CFA's durable work frontier.

Do not move a task to `IN_PROGRESS` merely because it was discussed.

### D. Identify what should not become work

Explicitly record:

- tempting but unnecessary work;
- duplicate architecture;
- implementation already adequately represented by existing mechanisms;
- issues belonging to neighboring CFAs;
- questions requiring owner decisions;
- evidence that is insufficient to justify a task.

## 6. Required durable output

Create exactly:

`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/<CFA-HOME>/DOMAIN-ROADMAP-2026-09-27.md`

Use:

```
# <CFA> — Domain Roadmap

## Planning Basis
## Responsibility Frontier
## Current Evidence
## Roadmap
### Task 1
### Task 2
...
## Dependencies / Peer Inputs
## Deferred / Do Not Do
## Owner Decisions Required
## Falsifiers / Stop Conditions
## Relationship to Existing Program Plans
## Evidence Index
```

The section **Relationship to Existing Program Plans** is mandatory. It must classify existing destination cycles, P1 workstreams, Build-and-Harvest phases and historical queues as:

- adopted as a domain task;
- useful input but not adopted;
- superseded;
- blocked;
- outside CFA scope;
- or unresolved.

Do not silently inherit them.

## 7. Roadmap-to-task integrity

The durable roadmap and `TASKS.md` must agree.

A task may only be promoted from roadmap candidate to persistent READY work when the CFA can state why it belongs to the CFA and what completion means.

The existence of a task in a destination-wide plan is not sufficient.

## 8. Cross-CFA discipline

Roadmap formation is local planning first.

Do not:

- redefine another CFA's responsibility;
- activate shared CFA boundaries;
- create a universal task manager;
- create a competing ontology, authority, evidence or data store;
- settle unresolved peer semantics unilaterally;
- begin production implementation.

When a roadmap item depends on another CFA, record the dependency and the question/hand-off required. Do not manufacture peer agreement.

## 9. Architecture Steward role after the wave

The Architecture Steward does **not** choose a destination cycle first and ask CFAs to fit themselves into it.

After the CFA roadmap wave, the Steward must:

```
VERIFY EACH ROADMAP
→ COMPARE OVERLAPS
→ RECONCILE DEPENDENCIES
→ IDENTIFY CROSS-CFA QUESTIONS
→ MAP TO DESTINATION / P1
→ CLASSIFY SHARED FRONTIER
→ ONLY THEN SELECT / COMPILE NEXT OWNER ACTIONS
```

The Steward may propose cross-CFA sequencing after reconciliation. It must not erase or replace CFA-owned roadmaps.

A downstream product program may still be selected first when current CFA roadmaps independently converge on it. That convergence must be evidenced, not assumed.

## 10. Completion gate

The roadmap session is complete only when:

1. the roadmap artifact exists;
2. `TASKS.md` contains the durable domain work frontier;
3. existing program plans were explicitly classified;
4. unknowns and peer dependencies are preserved;
5. no unrelated implementation was started;
6. the standard FSSP receipt is persisted and verified;
7. the session stops.

## 11. Key invariant

> **A CFA is not merely an execution endpoint for Steward-selected work. It is a standing domain responsibility owner that must first characterize and maintain its own work frontier.**

The Architecture Steward owns cross-domain coherence and synthesis. It does not preempt the CFA planning function.
