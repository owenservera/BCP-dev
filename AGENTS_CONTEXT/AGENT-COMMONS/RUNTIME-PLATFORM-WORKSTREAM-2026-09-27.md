# Agent Commons — Runtime / Platform Workstream
## 2026-09-27

> Status: ACTIVE / OWNER-ASSIGNED
> Accountable execution agent: runtime-constitution-core-substrate
> Nature: implementation workstream, not a new Core Function Area
> Authority: operational assignment only; not Ω law and not Commons semantic authority.

## Objective

Make the already-defined Agent Commons runtime operationally testable end-to-end at v0.

The accountable implementation surface is the current Commons runtime and its tests. The target is the existing 10-point operational completion test in IMPLEMENTATION-ROADMAP.md, not a new protocol design.

## Scope

Drive the existing roadmap through its current implementation boundary, especially:

1. trusted event fabric: identity loading, signatures, hash chains, schema validation, accepted/rejected flow, replay/fold;
2. local agent-home state required by the runtime;
3. Git transport: append, sync, read-since, outbox, retries, acknowledgement, cursors, dead letters;
4. the existing CLI/library gap only where a first-class operation is required to prove an already-defined v0 completion-test item;
5. deterministic tests and evidence for concurrency, idempotency, replay, authority/epistemic preservation, and transport behavior.

## Design-freeze rule

Until the v0 operational completion test is green across two independent runtimes:

- do not add new Commons message semantics;
- do not create a scheduler, metrics agent, human UI, second registry, second task manager, or second authority layer;
- do not expand the Core Function Area constellation;
- change shared protocol/design only for correctness, security/integrity, or explicit testability of already-defined invariants.

Discovered future capabilities remain recorded as deferred work rather than silently entering the frozen scope.

## Boundary

CFA-10 owns the operational implementation accountability for the runtime substrate. CFA-10 does not thereby own Commons semantic meaning, identity policy, Authority semantics, canonical Data meaning, or Ω law.

CFA-04 remains the operational custodian for cross-cutting identity/security ceremonies.

## Evidence and completion

Every implementation increment must carry executable tests/evidence and an exact commit/ref.

The workstream is complete when the existing ten-point Commons v0 operational completion test is evidence-backed green for two independent agent runtimes. At that point, stop and return control to the owner for an explicit post-v0 design decision.

## Non-goals

- redesigning the Commons constitution;
- creating another coordinator;
- inventing a new human workflow;
- modifying Ω law;
- activating shared CFA boundaries;
- treating the workstream assignment as semantic authority.
