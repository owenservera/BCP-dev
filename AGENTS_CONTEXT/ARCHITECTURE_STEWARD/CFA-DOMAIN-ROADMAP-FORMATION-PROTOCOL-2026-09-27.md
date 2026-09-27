# CFA Strategic Roadmap Round — Protocol
## 2026-09-27

> Status: ACTIVE
> Classification: derived operating protocol; not Ω law
> Purpose: run one independent parallel strategic-planning round across all ratified Core Function Areas before any shared execution frontier is selected.

## 1. Why this round exists

The ten CFAs are standing domain responsibility owners. Their job is not merely to execute work selected by the Architecture Steward.

The common home upgrade established cold-startable homes. The previous roadmap-formation design correctly added a planning stage, but it was still too task-centric.

This round goes one level higher.

Each CFA must independently answer:

> **What is the conceptual destination for my responsibility, what are the major milestones needed to get there, how will I know each milestone is successful, what dependencies and tools are required, and what specific intelligence/evidence must I obtain from each peer before making the strategic choices at each stage?**

The round deliberately happens in parallel so that the first-pass plans are not prematurely shaped by one another.

The intended transition is:

```
RATIFIED CFA
  ↓
HOME READY
  ↓
INDEPENDENT STRATEGIC ROADMAP ROUND
  ↓
LOCAL ROADMAP + LOCAL TASK QUEUE
  ↓
CENTRAL STEWARD RECONCILIATION
  ↓
CENTRAL CROSS-CFA ROADMAP
  ↓
SHARED DEPENDENCY / EVIDENCE PLAN
  ↓
BOUNDED EXECUTION FRONTIER
```

## 2. Artifact architecture

There are two layers by design.

### Local CFA roadmap — maintained by the CFA

Each CFA maintains:

`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/<CFA-HOME>/DOMAIN-ROADMAP-2026-09-27.md`

This is the **full internal working roadmap** for that CFA. It may contain more detail than the central set and may evolve independently as new evidence arrives.

It is the authoritative planning artifact **for the CFA's own planning state**, subject to owner decisions, Ω law and later cross-CFA reconciliation.

### Central Steward roadmap — maintained by the Steward

The Steward maintains:

`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/CFA-STRATEGIC-ROADMAP-CENTRAL-2026-09-27.md`

This is a **derived cross-CFA synthesis**, not a second planning authority.

It must reference the local CFA roadmaps rather than copy their contents unnecessarily.

Use the central artifact to capture:

- the comparable milestone structure across all CFAs;
- cross-CFA dependencies;
- peer intelligence requests;
- tooling/platform dependencies;
- strategic decision gates;
- contradictions and overlaps;
- central sequencing after reconciliation;
- the resulting bounded shared execution frontier.

Do not make the central document a lowest-common-denominator rewrite of the local plans.

## 3. "Do not reinvent" rule

Before creating a durable artifact, search the repository for an existing artifact with the same semantic purpose.

If an existing artifact already carries the needed information:

- use it;
- extend it only where necessary;
- link it from the roadmap;
- do not create a second competing representation.

Create a new artifact only when the lifecycle, ownership, audience or structure is genuinely different.

The distinction that justifies the central artifact is:

- local roadmap = CFA-owned strategic working plan;
- central roadmap = Steward-owned cross-CFA synthesis and reconciliation projection.

## 4. Independent round rule

All ten CFA roadmap sessions are launched in parallel.

During the first-pass planning round:

- do not wait for another CFA's new roadmap;
- do not copy another CFA's new conclusions;
- do not coordinate sequencing with peers;
- do not treat another CFA's absence of an answer as permission to guess.

Existing repository evidence from peers may be read. New peer outputs produced by this same round should be treated as separate results and not consulted merely to converge prematurely.

The purpose is to expose independent models before synthesis.

## 5. Required inputs

Each CFA must read:

1. current `main`;
2. FSSP-1.3;
3. its `SESSION-CONTEXT.md`;
4. its ratified `CORE-AGENT.md`;
5. its `STATE.md`;
6. its `TASKS.md`;
7. its `LESSONS.md` when present;
8. owner alignment/history;
9. strongest relevant Ω law/contracts/decisions;
10. strongest relevant destination contracts, journeys, reconciliations and evidence;
11. relevant implementation and historical/legacy evidence;
12. relevant peer artifacts necessary to understand boundaries and dependencies.

Classify claims as:

`OBSERVED | DERIVED | PROPOSED | UNKNOWN | CONFLICTED`

Keep freshness separate:

`CURRENT | STALE | UNRESOLVABLE`

## 6. Required strategic roadmap contents

Each CFA's local roadmap must contain the following.

### A. Strategic objective

State, in conceptual terms, what a successful realization of this CFA would make true for VIVIM.

Do not write a product backlog here.

### B. Conceptual roadmap

Create a small number of major milestones, normally 3–7 unless evidence genuinely requires more.

For every milestone record:

- milestone ID;
- conceptual outcome;
- why it matters;
- evidence basis;
- current maturity/state;
- design choices that must be made at this stage;
- success criteria;
- falsifiers / failure conditions;
- prerequisites;
- dependencies;
- candidate implementation later, if any;
- what must remain explicitly unresolved.

Milestones should describe meaningful architectural/product capability states, not individual tickets.

### C. Success criteria

Every milestone needs observable success criteria.

Prefer criteria that can eventually be demonstrated, reconstructed, or falsified.

Separate:

- design validity;
- implementation validity;
- integration;
- live/external proof;
- user/product proof;

when they differ.

Do not claim a design milestone is implemented because its design is coherent.

### D. Dependency model

For each major dependency identify:

- source CFA / external dependency;
- subject;
- dependency kind:
  - semantic;
  - data;
  - authority;
  - execution;
  - realization/provider;
  - surface/UX;
  - lifecycle/evolution;
  - runtime/platform;
  - evidence/proof;
- current or target;
- direct or transitive;
- required or preferred;
- known vs inferred;
- what evidence would confirm or falsify it.

Do not invent dependencies simply because two milestones touch the same concept.

### E. Tooling / substrate needed

For each milestone identify tooling that is actually needed to make the strategic decision or prove the milestone.

Examples:

- repository/query/graph tooling;
- deterministic analyzers;
- trace/lens tools;
- fixture/replay tooling;
- live browser/provider lab;
- runtime diagnostics;
- evidence capture;
- schema/round-trip tooling;
- surface/prototype tooling;
- falsification/chaos harnesses.

Distinguish:

`ALREADY EXISTS | NEEDS SMALL EXTENSION | NEW TOOL JUSTIFIED | NOT YET NEEDED`

Do not create tooling just because it would be convenient.

### F. Peer intelligence required at each stage

This is mandatory.

For every milestone, create a **Peer Intelligence Gate** table with:

| Peer CFA | Intelligence / evidence needed | Why the milestone depends on it | Exact decision it informs | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|

The CFA must identify what it needs to know from each relevant peer before making its strategic design choice.

Examples of useful peer intelligence:

- boundary contract;
- canonical data identity/revision rules;
- authority/revocation semantics;
- Work lifecycle;
- provider/realization facts;
- composition/admission rules;
- surface constraints;
- evolution/replacement semantics;
- runtime invariants;
- proof/evidence requirements.

Do not merely say "coordinate with CFA-05." State exactly what information is needed and what decision it unlocks.

Classify each requested peer input:

- **BLOCKING** — cannot make the decision responsibly without it;
- **HIGH-VALUE** — decision can start, but should not be finalized without it;
- **CONTEXTUAL** — useful evidence but not a decision gate.

### G. Decision gates

For each milestone identify:

- decision to make;
- alternatives still open;
- evidence required;
- owner of the decision;
- whether owner intent is required;
- what would falsify the preferred direction.

A roadmap is not complete merely because it recommends something.

### H. Product / strategic consequences

State what the milestone would enable or constrain for VIVIM.

This should connect domain work to journeys and product experience without turning the CFA into the product owner for the whole system.

### I. Deferred / do not do

Explicitly list tempting work that is:

- duplicate;
- premature;
- another CFA's responsibility;
- better deferred until a peer decision;
- implementation detail that should not be settled yet;
- unsupported by current evidence.

## 7. Local task queue

After forming the conceptual roadmap, the CFA updates its own `TASKS.md`.

Create READY tasks only for the **first bounded body of work** that is genuinely actionable from current evidence.

For each task include:

- objective;
- milestone it advances;
- dependencies;
- peer inputs required;
- tooling required;
- write scope;
- next action;
- completion condition;
- stop condition.

Do not convert every conceptual milestone into a READY task.

A milestone can remain a future planning state with no immediate task when evidence says it is not yet actionable.

## 8. Peer requests are requests, not invented dependencies

The Peer Intelligence Gates identify what the CFA needs to learn from other CFAs.

They do not create an architectural dependency automatically.

A request becomes a real dependency only after:

- the consuming CFA shows the decision it affects;
- the supplying CFA owns the requested subject;
- the evidence need is specific;
- the dependency is confirmed by reconciliation or direct evidence.

This preserves flexibility and prevents dependency inflation.

## 9. Completion artifact

Each CFA must produce/update exactly:

`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/<CFA-HOME>/DOMAIN-ROADMAP-2026-09-27.md`

and its `TASKS.md`.

The roadmap should use:

```
# <CFA> — Strategic Domain Roadmap
## Strategic Objective
## Responsibility Frontier
## Current Evidence / Maturity
## Conceptual Roadmap
### M1 ...
### M2 ...
## Dependency Model
## Tooling / Substrate
## Peer Intelligence Gates
## Strategic Decision Gates
## Product / Strategic Consequences
## Deferred / Do Not Do
## Relationship to Existing Program Plans
## Evidence Index
```

The existing `DOMAIN-ROADMAP-2026-09-27.md` path is retained specifically to avoid creating another per-CFA roadmap family.

## 10. Relationship to existing plans

Each CFA must explicitly classify relevant existing material, including:

- Build-and-Harvest;
- P1 workstreams;
- destination reconciliation cycles;
- vertical slices;
- provider-lab work;
- prior Steward recommendations;
- historical bootstrap/implementation plans.

Possible classifications:

- ADOPTED;
- ADOPTED WITH MODIFICATION;
- USEFUL INPUT / NOT ADOPTED;
- DEFERRED;
- BLOCKED;
- OUTSIDE CFA SCOPE;
- SUPERSEDED;
- UNRESOLVED.

A plan marked CURRENT or READY elsewhere is not enough to make it a CFA task.

## 11. Central synthesis after the parallel round

Only after all ten roadmaps have landed does the Architecture Steward produce the central synthesis.

The Steward must:

```
VERIFY LOCAL ROADMAPS
→ COMPARE CONCEPTUAL MILESTONES
→ BUILD CROSS-CFA DEPENDENCY MAP
→ CONSOLIDATE PEER INTELLIGENCE REQUESTS
→ IDENTIFY OVERLAPS / GAPS / CONTRADICTIONS
→ TEST SEQUENCING AGAINST EVIDENCE
→ MAP TO DESTINATION / P1 / PRODUCT
→ FORM CENTRAL ROADMAP
→ SELECT SHARED EXECUTION FRONTIER
```

The central synthesis should preserve divergence where the evidence does not justify convergence.

It must not average competing plans into a vague compromise.

## 12. Central roadmap contents

Populate:

`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/CFA-STRATEGIC-ROADMAP-CENTRAL-2026-09-27.md`

with:

1. Executive strategic synthesis.
2. One compact milestone view for each CFA.
3. Cross-CFA dependency matrix.
4. Consolidated peer-intelligence matrix.
5. Shared tooling/substrate requirements.
6. Cross-cutting strategic decision gates.
7. Contradictions / unresolved alternatives.
8. Adopted / deferred / rejected inherited plans.
9. Proposed central sequencing.
10. First bounded execution frontier.
11. Source links to all ten local roadmaps.
12. Explicit divergence notes where local plans remain intentionally different.

The central artifact must link to local source sections whenever more detail is needed instead of copying them wholesale.

## 13. Architecture Steward responsibility

The Steward is responsible for:

- running the round;
- preserving independence;
- validating evidence/lineage;
- reconciling peer boundaries;
- synthesizing the central plan;
- identifying true dependencies;
- selecting the shared frontier only after the round.

The Steward is **not** responsible for deciding each CFA's internal conceptual roadmap before the round.

## 14. Completion gate

The strategic round is complete when:

1. all ten CFA roadmap sessions have returned a durable roadmap or an honest BLOCKED/UNKNOWN result;
2. each `TASKS.md` contains the first bounded actionable work or explicitly records why none is yet actionable;
3. each roadmap contains milestone success criteria;
4. each roadmap contains dependencies;
5. each roadmap contains tooling/substrate assessment;
6. each roadmap contains peer-intelligence gates for relevant peers at each milestone;
7. each roadmap classifies inherited program plans;
8. all receipts are durable and verified;
9. the Steward has produced the central synthesis;
10. the central synthesis preserves meaningful divergence and names the first shared frontier.

## 15. Hard boundaries

Do not:

- start production implementation during the planning round;
- activate shared CFA boundaries;
- rewrite Ω law;
- create a second ontology/data/authority/provenance store;
- create a second global task manager;
- turn peer requests into unverified dependencies;
- force every CFA into one milestone shape merely for symmetry;
- discard local roadmap detail in favor of the central summary.

Symmetry is required in **questions asked and evidence quality**, not necessarily in the resulting architecture.

## 16. Strategic stopping rule

When the local conceptual roadmap is clear enough, stop expanding it.

Do not turn a strategic roadmap into a disguised complete backlog.

The point of this round is to discover:

- the shape of the work;
- the sequence of decisions;
- the evidence needed;
- the dependencies and tools required;
- the boundaries that still matter.

Execution comes after reconciliation.
