# Collaboration + Development Acceleration Substrate
## Central Design — 2026-09-27

> Status: DESIGN COMPLETE / PROPOSED
> Owner: Architecture Steward for coordination only
> Scope: shared CFA development infrastructure and collaboration mechanics
> Non-authority: does not redefine Ω law or any CFA's domain semantics.

## 1. Problem

The ten CFAs now have durable identities, local roadmaps, boundary declarations and M1 evidence tasks. The limiting factor for the next stage is not more planning volume.

The team lacks a **shared, executable development operating layer** that makes the path from architectural question to trustworthy implementation cheap and repeatable.

Without that layer, every CFA independently pays for:
- context reconstruction;
- repository archaeology;
- locating authoritative evidence;
- restating dependencies;
- scaffolding artifacts;
- inventing fixture/test shapes;
- re-running broad verification;
- producing handoff/receipt prose;
- relearning bottlenecks between sessions.

The desired result is not more ceremony. It is fewer manual steps with stronger mechanical evidence.

## 2. North-star loop

Every substantive CFA task should be able to use this loop:

```
TASK / QUESTION
      |
      v
1. LOAD CONTEXT
      |
      v
2. IDENTIFY SUBJECT + OWNER + DEPENDENCIES
      |
      v
3. FORM HYPOTHESIS / DESIGN CLAIM
      |
      v
4. SCAFFOLD EXPERIMENT / ARTIFACT
      |
      v
5. MAKE SMALLEST CHANGE
      |
      v
6. TARGETED VERIFY / REPLAY
      |
      v
7. CAPTURE EVIDENCE
      |
      v
8. WRITE RECEIPT / RESULT
      |
      v
9. HANDOFF / RECONCILE
      |
      +-------> next question
```

The loop has two boundaries:

**Architecture boundary:** evidence and ownership must be explicit.

**Development boundary:** the inner loop must be fast enough that an agent can repeatedly experiment without paying the cost of a full program-wide ceremony.

## 3. Shared substrate architecture

### 3.1 Collaboration State Plane

This is the smallest common model all CFAs can rely on.

#### A. Shared vocabulary registry

A compact registry of terms needed at seams, each with:
- term;
- definition;
- anti-definition / explicitly-not-this;
- owner CFA;
- consumers;
- epistemic status;
- freshness;
- evidence pointers;
- unresolved alternatives.

The registry does not attempt to become the complete Ω ontology. It is a seam vocabulary/index.

#### B. Claim + evidence envelope

A common shape for claims:

```text
claim
subject
claimType
epistemicState
freshness
owner
sources[]
falsifier
dependentDecisions[]
supersedes?
status
```

Required epistemic states remain:
`OBSERVED | DERIVED | PROPOSED | UNKNOWN | CONFLICTED`

Freshness remains orthogonal:
`CURRENT | STALE | UNRESOLVABLE`

This envelope is evidence bookkeeping, not authority.

#### C. Question / dependency graph

Represent:
- question;
- consuming decision;
- requested peer input;
- supplying CFA;
- evidence requested;
- current answer state;
- whether the relation is only a request or a confirmed dependency;
- blocking impact;
- falsifier / closure condition.

A request is never promoted to a dependency merely by repetition.

#### D. Decision packet

A decision packet should standardize the minimum information required to make a consequential architectural choice:

```
question
subject
current evidence
unknowns/conflicts
options
criteria
peer inputs
dependencies
falsifiers
decision owner
readiness
```

The packet separates:
- evidence;
- analysis;
- proposal;
- owner decision.

#### E. Handoff

Reuse the existing Boundary Protocol concepts rather than inventing a second communication grammar.

Minimum:
source CFA; target CFA; subject; reason; request; supplied artifacts; evidence; expected response; unresolved questions; status.

#### F. Reconciliation lifecycle

Use one generic state progression:

`DISCOVERED
-> CLAIMED
-> EVIDENCE-GATHERING
-> PROPOSED
-> PEER-REVIEW
-> RECONCILED
-> OWNER-DECISION
-> RATIFIED
-> IMPLEMENTED
-> VERIFIED
-> LIVE-PROVEN
-> SUPERSEDED`

`CONFLICTED` may interrupt the flow whenever material contradiction remains.

This is a development-state model, not an Ω semantic ontology.

### 3.2 Development Acceleration Plane

The same substrate exposes a small tool contract.

#### `context`

Produces the smallest relevant context packet from:
- current task;
- CFA identity;
- relevant owned artifacts;
- peer inputs;
- evidence;
- implementation references;
- unresolved questions.

It must prefer generated/indexed pointers over broad file dumping.

#### `inspect`

Shows:
- owner(s);
- boundaries;
- dependencies;
- current claims;
- evidence;
- implementation/legacy distinction;
- fixtures/replays;
- pending questions.

#### `scaffold`

Generates the boring structure for:
- design packet;
- experiment;
- falsifier;
- fixture;
- test;
- handoff;
- result receipt.

Generation must be deterministic and refuse to clobber implemented evidence.

#### `replay`

Runs a bounded, deterministic scenario against the relevant seam.

Replay inputs must identify:
- scenario;
- fixture/version;
- expected invariants;
- current implementation target.

#### `prove`

Runs the smallest appropriate verification set first, then escalates only when needed.

It must distinguish:
- structural check;
- targeted test;
- integration proof;
- live/external proof.

A targeted green must never be presented as a full-system green.

#### `receipt`

Emits the standard evidence/result receipt, linking:
task -> change -> verification -> evidence -> known limits.

#### `orchestrate`

Derives what is:
- ready;
- in flight;
- verify-only;
- blocked;
- awaiting peer input;
- awaiting owner decision.

It is a derived planning view, not an agent scheduler or authority system.

### 3.3 Development memory / speed telemetry

Reuse the historical Ω session-ledger idea conceptually:
- environment-local session stream;
- timestamps;
- explicit operation durations;
- bottleneck report;
- structured lessons;
- promotion to durable knowledge only through the existing governed mechanism.

The key measurement is **developer/agent friction**, not self-reported confidence.

Useful metrics:
- context-load time;
- time from question to first runnable experiment;
- repeated archaeology operations;
- targeted verification time;
- rework count;
- peer-wait time;
- unresolved-dependency time;
- handoff preparation time;
- defect/rejection caught by tooling before integration.

## 4. Reference end-to-end collaboration loop

The shared collaboration model should be able to trace one consequential outcome:

```
human intent
  -> semantic meaning
  -> authority
  -> Work / Attempt
  -> capability
  -> realization
  -> runtime enforcement
  -> external / runtime effect
  -> observation
  -> evidence
  -> durable continuity
  -> surface projection
  -> next human action
```

Each node belongs to its CFA/domain owner. The central substrate supplies the **trace**, not the semantics.

This loop is the integration target for M1 seam design.

## 5. Development layers and ownership

### Layer 0 — existing foundations

Reuse:
- FSSP-1.3;
- Agent Commons;
- Boundary Protocol;
- existing receipts/tasks/home state.

No duplicate protocol.

### Layer 1 — central collaboration substrate

Build centrally:
- generic schemas;
- indexing;
- state machine mechanics;
- dependency/request graph;
- context packet compiler;
- generic decision/handoff/receipt templates;
- generic scaffolding contracts;
- common replay/proof interfaces;
- derived orchestration views;
- speed telemetry/reporting.

### Layer 2 — CFA domain adapters

Each CFA supplies:
- authoritative terms;
- semantic subject types;
- domain invariants;
- domain-specific falsifiers;
- canonical artifacts;
- allowed transformations;
- domain fixtures/scenarios;
- escalation/owner gates.

### Layer 3 — domain implementation

CFA-owned implementation uses the shared substrate. No CFA should have to rebuild the Layer-1 machinery.

### Layer 4 — governed end-to-end corridor

One real consequential path exercises all relevant CFAs using the same trace.

## 6. Context compiler design

The context compiler is the most important speed multiplier.

Input:
`task + CFA + subject + current main`

Output:
a bounded context packet containing:
1. task and acceptance target;
2. owner/boundary facts;
3. relevant shared vocabulary;
4. peer claims;
5. dependency/request status;
6. authoritative evidence;
7. current implementation evidence;
8. fixtures/replays;
9. falsifiers;
10. unresolved questions;
11. recommended next inspection paths.

The compiler should rank by authority/relevance/freshness rather than simply by textual similarity.

It should also retain explicit pointers to omitted material so the agent can expand context intentionally.

## 7. Falsifier-first development

Every new shared/domain design should be able to declare falsifiers before implementation.

The shared tooling should:
- create a red stub;
- preserve its stable identity;
- refuse accidental overwrite;
- map falsifier -> executable check;
- report unresolved coverage.

This directly reuses the proven historical Ω pattern while keeping the BCP implementation decision open until CFA inputs define the domain-specific clauses.

## 8. Try-before-build

The substrate should support advisory design simulation:
- mutate a proposed contract/registry entry in memory;
- ask existing validators what breaks;
- emit a receipt of caught/uncaught mutations.

Simulation remains advisory unless a CFA-owned contract explicitly promotes a check to a gate.

No simulation result is authority.

## 9. Speed rule: targeted before global

The default inner loop should be:

`inspect -> targeted change -> targeted prove -> replay -> receipt`

The full gate remains the integration/ratiﬁcation proof.

The system should therefore optimize the **path to useful local feedback**, not weaken the final gate.

Gate-tiering is not a current requirement; the historical Ω measurement indicates it should remain deferred until actual test growth justifies it.

## 10. Design principles

1. **One shared mechanism, many domain adapters.**
2. **Generated state beats hand-maintained duplication.**
3. **Evidence is carried with the change, not reconstructed afterwards.**
4. **Requests stay requests until dependency is demonstrated.**
5. **Unknown is a valid result.**
6. **Targeted proof accelerates; full proof ratifies.**
7. **Historical implementation is evidence, not automatic authority.**
8. **No duplicate ontology/protocol where an existing artifact already serves the role.**
9. **Every new mandatory step must remove more manual work than it adds.**
10. **Owner decisions remain owner decisions.**

## 11. M0 success criteria

The design is successful when a CFA can take one real M1 task and, with shared tooling:

- load a bounded authoritative context without broad archaeology;
- see its actual peer requests/dependencies;
- create a deterministic design/experiment scaffold;
- run at least one targeted proof/replay;
- capture evidence and uncertainty automatically;
- emit a standard receipt/handoff;
- identify the next blocking question;
- do all of the above without recreating another CFA's domain semantics.

The important metric is not document count.

It is **time and cognitive steps from question to trustworthy feedback**.

## 12. Non-goals

Do not use this substrate to:
- create an eleventh permanent architecture owner;
- centralize semantic authority;
- turn the Steward into a product architect of every domain;
- schedule agents autonomously;
- replace CFA-local methodologies;
- make live provider work the first milestone;
- collapse evidence, representation, description and authority;
- treat historical Ω code as automatically canonical.

## 13. Implementation staging

### Stage A — design + CFA input
This document and the input register.

### Stage B — central kernel
Implement only generic collaboration/development mechanics whose schemas do not depend on unresolved CFA semantics.

### Stage C — CFA adapters
Each CFA contributes its domain extension set.

### Stage D — one cross-CFA M0/M1 development loop
Prove the toolchain on a bounded seam before broad rollout.

### Stage E — governed corridor
Use the shared loop to select and prove the first consequential corridor.

### Stage F — scale
Add automation only where measured friction justifies it.

## 14. Historical evidence reused

Relevant prior Ω mechanisms already present in the repository include:
- genome/context folding;
- falsifier-first stub generation;
- orchestration/DAG derivation;
- design simulation;
- development-vault;
- timestamped session ledger;
- program-acceleration review.

These should be treated as implementation precedent and measured experience, not as unreviewed BCP law.
