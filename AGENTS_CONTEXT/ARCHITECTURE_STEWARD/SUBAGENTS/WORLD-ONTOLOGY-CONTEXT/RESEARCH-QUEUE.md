# CFA-01 — Research Queue

> Status: BOOTSTRAP / BOUNDED
> Date: 2026-09-25
> This is a working queue, not a roadmap and not a project-management authority.

## 1. TODO-001 — Identity / Correspondence Seam

Case: CASE-001
Priority: HIGH

Question:

> Where does semantic correspondence end and durable identity/evolution begin?

Inspect:
- R-028 canonical object identity;
- R-032 identity reconciliation;
- R-033 relationship reconciliation;
- world-object research;
- CFA-02 data/identity boundary;
- CFA-09 evolution/compatibility boundary;
- source identity, alias and tombstone semantics.

Produce:
- semantic correspondence model;
- CFA-01 ↔ CFA-02 ↔ CFA-09 handoff;
- unresolved decisions;
- explicit falsifiers.

Do not:
- implement merge/split logic;
- create an identity database;
- decide authority outside the semantic boundary.

## 2. TODO-002 — Context Semantic Contract

Case: CASE-002
Priority: HIGH

Question:

> What makes something relevant to Context, independent of assembly mechanics?

Use:
- D-443;
- WorldModel / mind research;
- World / Space / Focus / Attention material;
- Intent / Work material;
- memory semantics;
- evidence/freshness constraints.

Produce:
- context semantic inputs;
- exclusions;
- scope rules;
- relationship to Space, Focus, Attention, Memory, Intent and Work;
- handoff into D-443 assembly.

Do not:
- replace context.assemble@1;
- create a second context store;
- make Context an authority.

## 3. TODO-003 — Event / State Characterization

Case: CASE-004
Priority: MEDIUM

Question:

> Are Event and/or State universal semantic primitives?

Test against:
- vault revisions/changelog;
- governed events;
- Work state;
- runtime state;
- provider observations;
- legacy AtomicChatUnit/event/state models.

Produce:
- evidence table;
- candidate semantics;
- counterexamples;
- decision or explicit UNKNOWN.

Do not:
- introduce universal Event/State abstractions merely for naming consistency.

## 4. TODO-004 — World Projection Contract

Case: CASE-003
Priority: MEDIUM

Question:

> What must every coherent World projection guarantee without becoming one giant snapshot?

Inspect:
- world-object convergence;
- vivim.mind;
- Destination Master Map;
- World/Workspace/Surface reconciliation;
- graph projection concepts.

Produce:
- world projection invariants;
- bounded-lens model;
- freshness/basis expectations;
- relationship to canonical object state.

Do not:
- create a World database;
- turn WorldModel into a warehouse.

## 5. TODO-005 — Semantic Boundary Crosswalk

Priority: MEDIUM

Question:

> What is the minimum durable representation of cross-CFA ownership?

Produce only after TODO-001 and TODO-002 expose recurring patterns:
- concept;
- semantic owner;
- data owner;
- runtime owner;
- authority owner;
- evidence owner;
- lifecycle owner;
- handoff contract;
- conflict rule.

Likely destination:
- a compact BOUNDARY-MAP.md or equivalent.

Do not create it early if STATE.md remains sufficient.

## Trigger rules

### Immediate trigger

Open a case when:
- the owner asks a World semantic question;
- another CFA hands off an identity/relationship/context problem;
- a source conflict affects world meaning;
- a runtime observation challenges a semantic assumption.

### Re-ground trigger

Re-read relevant graph/document basis when:
- the destination graph changes materially;
- an owning peer changes identity or boundary;
- a ratified decision affecting the case changes;
- the source commit moves beyond the recorded basis.

### Closure trigger

A case may close when:
- the semantic question has an evidence-backed answer;
- ownership is explicit;
- remaining uncertainty is named;
- downstream handoff is clear;
- no second authority/store is required.

Closure of a CFA-01 case does not imply implementation completion.

## Evidence standard

Every consequential result distinguishes:

OBSERVED
DERIVED
PROPOSED
UNKNOWN
CONFLICTED

Every durable conclusion identifies enough source/evidence lineage for another agent to reproduce the reasoning.

## Escalation

Escalate to owner alignment when:
- two CFA responsibilities cannot be cleanly separated by evidence;
- semantic meaning conflicts with an existing ratified architectural decision;
- a proposed boundary would materially change the CFA identity;
- multiple plausible destination models remain after evidence reconciliation.

## Current non-queue

Do not currently queue:
- canvas rendering;
- provider parser implementation;
- Chrome/browser mechanics;
- runtime K0 changes;
- generic task management;
- broad terminology cleanup;
- implementation of D-443;
- production code unrelated to a proven semantic seam.
