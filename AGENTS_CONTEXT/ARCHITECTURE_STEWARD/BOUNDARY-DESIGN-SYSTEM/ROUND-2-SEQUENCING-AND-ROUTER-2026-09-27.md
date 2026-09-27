# CFA-01–04 Round 2 — Sequencing and Router Prompt

> Date: 2026-09-27
> Coordinator: Architecture Steward
> Scope: CFA-01 through CFA-04 only
> Purpose: serialize the existing Round-2 seam tasks so peer evidence accumulates without redesigning the process.

## Current rule

Stay on CFA-01–04.

Do NOT introduce the one-shot CFA-05–10 bootstrap protocol yet.
Do NOT rewrite the current CFA bootstrap template.
Do NOT retrofit self-ratification, owner queues, or new checkpoint machinery into CFA-01–04 during this step.

The current Round-2 task files remain authoritative for each CFA's actual seam work.

This file only controls sequencing and peer-context routing.

## Execution order

Run the four CFA tasks in this order, one CFA at a time, with each completed commit visible on `main` before starting the next CFA:

1. CFA-01 — World & Context
2. CFA-03 — Semantic Continuity
3. CFA-04 — Authority Governance
4. CFA-02 — Data Steward

### Why this order

CFA-01 establishes the World-side distinctions used by RP-01, RP-03 and RP-04.

CFA-03 then consumes the World-side reconciliation while resolving RP-01 and RP-02, without owning World or Authority semantics.

CFA-04 then consumes the clarified World/Semantic seams while resolving the Authority-side contracts in RP-02, RP-03 and RP-05.

CFA-02 runs last so its RP-04/RP-05/RP-06 crosswalk can incorporate the latest peer positions rather than guessing around them.

This is sequencing for evidence accumulation, not authority ordering.

## Before each CFA starts

The human router should:

1. verify that the previous CFA's commit is on `main`;
2. relay the previous CFA's completion report unchanged or minimally paraphrased;
3. require the next CFA to read the relevant completed Round-2 addendum(s);
4. remind the CFA that peer claims remain peer claims until reconciled.

Do not ask an agent to restart its bootstrap.

## CFA-01 start

Send the existing:

`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/BOUNDARY-ROUND-2-TASK-2026-09-27.md`

No predecessor Round-2 addendum is required.

Completion gate:
- addendum persisted;
- exact commit SHA reported;
- RP-01/RP-03/RP-04 each classified;
- no boundary activation;
- stop.

## CFA-03 start

First relay/read CFA-01's completed Round-2 addendum.

Then send the existing:

`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/BOUNDARY-ROUND-2-TASK-2026-09-27.md`

CFA-03 should treat CFA-01's claims as peer evidence to reconcile, not inherited truth.

Completion gate:
- addendum persisted;
- exact commit SHA reported;
- RP-01/RP-02/RP-06 each classified;
- no boundary activation;
- stop.

## CFA-04 start

First relay/read:
- CFA-01's completed Round-2 addendum;
- CFA-03's completed Round-2 addendum.

Then send the existing:

`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/BOUNDARY-ROUND-2-TASK-2026-09-27.md`

CFA-04's identity remains PROPOSED / OWNER DIALOGUE REQUIRED unless an explicit owner artifact has changed it.

Completion gate:
- addendum persisted;
- exact commit SHA reported;
- RP-02/RP-03/RP-05 each classified;
- no boundary activation;
- stop.

## CFA-02 start

First relay/read:
- CFA-01's completed Round-2 addendum;
- CFA-03's completed Round-2 addendum;
- CFA-04's completed Round-2 addendum.

Then send the existing:

`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/BOUNDARY-ROUND-2-TASK-2026-09-27.md`

CFA-02 should distinguish durable record continuity from World meaning, semantic continuity, and live authority resolution.

Completion gate:
- addendum persisted;
- exact commit SHA reported;
- RP-04/RP-05/RP-06 each classified;
- no boundary activation;
- stop.

## Router discipline

Use the existing Round-2 queue:

`ROUND-2-PEER-RECONCILIATION-QUEUE-2026-09-27.md`

Preserve these distinctions in every relay:

- CFA claim != peer claim;
- peer claim != Steward reconciliation;
- Steward reconciliation != human-owner decision;
- durable authority reference != live authority decision;
- World meaning != grounding state;
- grounding != authorization;
- record identity != semantic identity;
- evidence != representation != authority.

Do not translate an unresolved issue into agreement merely because two agents used similar terminology.

## What happens after all four

Do NOT immediately start CFA-05–10.

Run:

`ROUND-2-COMPLETION-AUDIT-2026-09-27.md`

The audit is the only next step after CFA-02.

## End condition

Round 2 is complete for CFA-01–04 only when the Architecture Steward has persisted the completion audit and explicitly classified every Round-2 request as:

- RECONCILED;
- UNKNOWN;
- CONFLICTED;
- DEFERRED;

with evidence and any human-owner decision need recorded.

Only after that audit should the Steward derive the reusable parts of the one-shot bootstrap protocol for CFA-05–10.
