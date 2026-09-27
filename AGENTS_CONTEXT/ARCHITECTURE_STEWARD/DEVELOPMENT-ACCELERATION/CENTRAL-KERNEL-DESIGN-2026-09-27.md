# Central Kernel Design — Development Acceleration
## 2026-09-27

> Status: **RESTORED / DESIGN BASELINE**
> Owner: Architecture Steward for generic mechanics only
> Authority: derived from already-persisted Development Acceleration design, Central-vs-CFA Responsibility, CFA Adapter Contract and Central Kernel Implementation Packet; not Ω law and not CFA semantic authority.
> Purpose: restore the exact design dependency named by the central implementation task without introducing new domain semantics.

## 1. Design boundary

The central kernel is a Layer-1 development substrate for the loop:

`context → inspect → scaffold → targeted prove/replay → evidence → receipt → handoff → next question`

It carries, validates, indexes, retrieves and reports generic development state. CFA adapters remain the source of domain meaning.

The kernel must not become:
- a second ontology;
- a second authority or permission system;
- a second task authority;
- a second communication protocol;
- a semantic database;
- a product behavior engine;
- a live-proof authority.

## 2. Existing foundations to reuse

Build on, not beside:
- FSSP-1.3;
- Agent Commons;
- Boundary Protocol;
- Session Result Contract v1.1;
- existing CFA TASKS/RESULTS state;
- existing architecture graph/documentation indexes.

Historical Ω mechanisms may be reused only as implementation precedent where current contracts support them.

## 3. Central generic capabilities

### Reference/evidence mechanics
- opaque reference indexing;
- claim/evidence envelopes;
- source, owner, revision and provenance pointers;
- deterministic serialization;
- stale/unresolvable visibility;
- contradiction preservation.

### Dependency/question mechanics
- question records;
- REQUEST vs CONFIRMED_DEPENDENCY distinction;
- supplying/consuming owner metadata;
- blocker and closure state;
- dependency/reference indexes.

### Context and inspection
`context` emits the smallest bounded context packet from task, CFA, subject and current main.
`inspect` surfaces ownership, boundaries, dependencies, evidence, implementation-vs-history, fixtures/replays and unresolved questions.

### Deterministic scaffolding
`scaffold` creates generic artifacts such as design, experiment, falsifier, fixture, test, handoff and receipt.
Scaffolding is deterministic, stable-ID, lineage-preserving and no-clobber.

### Proof/replay bookkeeping
`replay` and `prove` provide generic execution/bookkeeping interfaces.
They record only the proof level actually executed:
- structural;
- targeted;
- integration;
- live/external.

They cannot upgrade a targeted result into live/product proof.

### Receipt/handoff mechanics
`receipt` emits the existing Session Result Contract-compatible evidence/result structure.
`orchestrate` derives READY / IN_FLIGHT / VERIFY_ONLY / BLOCKED / AWAITING_PEER_INPUT / AWAITING_OWNER_DECISION / RECONCILE views.
Neither command becomes an agent scheduler or authority mechanism.

### Speed telemetry
Measure generic friction:
- context-load time;
- repeated archaeology;
- time to first runnable experiment;
- targeted verification duration;
- rework;
- peer wait;
- unresolved-dependency time;
- receipt/handoff preparation;
- tooling-caught defects.

## 4. CFA adapter boundary

The central kernel accepts a domain adapter carrying:

`cfaId + version + vocabulary + subjects + seams + evidenceSources + falsifiers + replayScenarios + proofRequirements + decisionGates`

Each adapter definition carries lineage.

The kernel validates structure, IDs, lineage, reference shape, enum compatibility, deterministic serialization and no-clobber rules.

The kernel does not author or decide:
- canonical domain vocabulary;
- domain identity meaning;
- ownership;
- domain invariants/falsifiers;
- authority semantics;
- Work semantics;
- realization semantics;
- surface semantics;
- Change/compatibility semantics;
- K0/B1 constitutional meaning.

## 5. Context compiler boundary

The context compiler ranks by authority/relevance/freshness supplied by declared sources. It must prefer explicit/generated pointers over broad dumping and preserve intentional expansion paths.

Inputs:
`task + CFA + subject + current main`

Outputs:
1. task/acceptance target;
2. owner/boundary facts;
3. shared vocabulary;
4. peer claims;
5. dependency/request status;
6. authoritative evidence;
7. implementation evidence;
8. fixtures/replays;
9. falsifiers;
10. unresolved questions;
11. next inspection paths.

The compiler may rank and retrieve; it may not infer semantic authority from filenames, imports, call topology or textual proximity.

## 6. Generic state and evidence rules

Required epistemic vocabulary remains:
`OBSERVED | DERIVED | PROPOSED | UNKNOWN | CONFLICTED`

Freshness, where material, remains orthogonal:
`CURRENT | STALE | UNRESOLVABLE`

Requests stay requests until dependency is evidenced.
UNKNOWN remains a valid result.
Contradictory claims remain visible rather than being silently collapsed.

## 7. Try-before-build

The central substrate may provide advisory contract/design simulation:
- mutate proposed generic metadata in memory;
- invoke existing validators;
- record caught/uncaught mutations;
- emit a receipt.

Simulation is advisory and never becomes semantic authority.

## 8. Implementation order

Phase A — generic schema package + machine validation + valid/invalid fixtures.

Phase B — reference, claim/evidence and dependency indexes.

Phase C — bounded context compiler + inspection.

Phase D — deterministic scaffolds + receipt integration.

Phase E — proof/replay interfaces + result classification.

Phase F — telemetry + orchestration projections.

Phase G — CFA adapters.

Phase H — one bounded end-to-end development loop after truthful seam reconciliation.

## 9. Acceptance boundary

A domain-neutral synthetic acceptance must be able to:

1. register opaque subject/reference kinds;
2. record a claim with evidence;
3. record a peer request;
4. scaffold one deterministic artifact;
5. produce one bounded proof/replay result;
6. emit a Session Result Contract-compatible receipt;
7. derive the next unresolved dependency;

without the central kernel deciding any CFA semantic.

## 10. Stop conditions

Stop central implementation and route to the responsible owner when:
- a field requires a domain meaning;
- a generic validator needs a domain invariant;
- identity equivalence must be chosen;
- authority must be inferred;
- a replay needs product-specific side effects for truth;
- proof level becomes a policy decision;
- runtime containment requires an Ω-law decision.

## 11. Integrity

This restoration does not change the frozen design direction. It repairs the missing design file referenced by the already-READY implementation task so implementation can be audited against an explicit, durable design baseline.

No production implementation is included in this change.
No Ω-law change.
No shared semantic-boundary activation.
No second graph, task authority or identity store.
