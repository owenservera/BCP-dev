# Central Kernel Implementation Packet — Development Acceleration
## 2026-09-27

> Status: READY — GENERIC MECHANICS ONLY
> Authority: derived from Cross-CFA M1 Reconciliation; not Ω law.

## 1. Objective

Implement the minimum reusable Layer-1 development substrate for the loop:

context -> inspect -> scaffold -> targeted prove/replay -> evidence -> receipt -> handoff -> next question

The substrate must reduce repeated manual work without becoming a semantic owner.

## 2. Reuse before build

Index/adapt, in order:

- FSSP-1.3 fresh-session protocol
- Agent Commons event/transport/recovery substrate
- Boundary Protocol v0
- Session Result Contract v1.1
- existing CFA TASKS.md and RESULTS artifacts
- existing architecture graph/documentation indexes
- historical Ω mechanisms only where current contracts support the behavior

Do not create a second communication protocol, event-history system, authority registry, semantic database, task authority, or receipt schema.

## 3. Mechanical components

### M1 Reference index
Index opaque references, revision/source/evidence pointers, owner metadata, and dangling/stale/unresolvable status.

### M2 Claim/evidence index
Validate common shape, index evidence and falsifiers, preserve contradictory claims, expose freshness.

### M3 Question/dependency graph
Keep REQUEST distinct from CONFIRMED_DEPENDENCY and derive READY / BLOCKED / AWAITING_INPUT views.

### M4 Context compiler shell
Accept task + CFA + subject + current-main, rank declared sources by authority/relevance/freshness, emit bounded context plus explicit expansion pointers.

### M5 Inspection
Show ownership, boundaries, claims, evidence, implementation vs historical distinction, fixtures/replays, dependencies and unresolved questions.

### M6 Deterministic scaffolding
Initial generic artifact kinds: design, experiment, falsifier, fixture, test, handoff, result receipt. Deterministic, stable IDs, no-clobber, lineage metadata.

### M7 Proof/replay bookkeeping
Expose generic prove/replay interfaces. CFA adapters provide scenarios and invariants. Central tooling records only the proof level actually executed.

### M8 Receipt generation
Generate the existing Session Result Contract v1.1 fields from collected evidence. Never fabricate IDs, commits, attribution, owner decisions, or verification.

### M9 Orchestration projection
Derived statuses only: READY, IN_FLIGHT, VERIFY_ONLY, BLOCKED, AWAITING_PEER_INPUT, AWAITING_OWNER_DECISION, RECONCILE. No scheduler or authority semantics.

### M10 Speed telemetry
Measure context-load time, archaeology repetition, time to first runnable experiment, targeted verification duration, rework, peer wait, unresolved-dependency time, receipt preparation and tooling-caught defects.

## 4. CFA adapter shape

Conceptual interface:

CfaAdapter {
  cfaId
  version
  vocabulary[]
  subjects[]
  seams[]
  evidenceSources[]
  falsifiers[]
  replayScenarios[]
  proofRequirements[]
  decisionGates[]
}

Each definition carries lineage:

Lineage {
  epistemicState
  freshness
  ownerCfa
  sourceRefs[]
  revisionRef?
  supersedesRef?
}

Central validation checks structure and lineage only.

## 5. Stable mechanical commands

context
inspect
scaffold
replay
prove
receipt
orchestrate

These are intentionally mechanical verbs, not domain ontology.

## 6. Implementation order

Phase A: generic schema package + machine validation + valid/invalid fixtures.

Phase B: reference, claim/evidence and dependency indexes.

Phase C: bounded context compiler + inspection.

Phase D: deterministic scaffolds + receipt integration.

Phase E: proof/replay interfaces + result classification.

Phase F: telemetry + orchestration projections.

Phase G: CFA adapters.

Phase H: one bounded end-to-end corridor after truthful seam reconciliation.

## 7. Central stop conditions

Stop and route to the responsible CFA/owner when a generic field requires a semantic decision, a reference requires equivalence resolution, a validator needs an unsupplied domain invariant, a proof level becomes policy, authority must be inferred, or runtime containment requires an Ω-law decision.

## 8. Acceptance test

The central kernel is accepted when a synthetic test can:

1. register opaque subject/reference kinds;
2. record one claim with evidence;
3. record one peer request;
4. scaffold one deterministic artifact;
5. produce one bounded proof result;
6. emit a Session Result Contract-compatible receipt;
7. derive the next unresolved dependency;

without any semantic plugin logic in the central kernel.

