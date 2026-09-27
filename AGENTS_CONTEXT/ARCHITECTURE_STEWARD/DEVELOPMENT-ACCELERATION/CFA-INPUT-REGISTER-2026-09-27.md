# CFA Input Register
## Development Acceleration Substrate — 2026-09-27

> Purpose: request the minimum domain intelligence required before central tooling becomes semantically opinionated.
> Status: ROUTING / INPUT REQUIRED
> Owner: Architecture Steward coordinates; each CFA remains authoritative for its own domain claims.

## 1. Common response contract

Each CFA should answer only from its own domain position and label every substantive response:

- epistemic state: OBSERVED / DERIVED / PROPOSED / UNKNOWN / CONFLICTED;
- freshness: CURRENT / STALE / UNRESOLVABLE where material;
- evidence pointer(s);
- unresolved peer questions;
- whether human-owner intervention is required.

Do not redesign the shared tooling in isolation. Provide the domain information the tooling must carry.

## 2. Required input set for every CFA

Each CFA should provide:

### A. Domain kernel
- 5–15 canonical terms needed by peers;
- definition;
- anti-definition;
- owner;
- current evidence.

### B. Minimum responsibility
- what must remain continuously coherent;
- what the CFA owns;
- what it contributes;
- what it needs from peers;
- what it explicitly does not own.

### C. Critical seam contracts
For the top 3 seams:
- subject;
- inputs;
- outputs;
- prohibited crossings;
- invariants;
- falsifiers;
- unresolved questions.

### D. Authoritative evidence map
Name the strongest current artifacts:
- domain source documents;
- current implementation evidence;
- fixtures/replays;
- prior decisions;
- historical implementation only where useful.

Classify each as:
- architecture source;
- implementation evidence;
- experiment evidence;
- historical context.

### E. Development speed requirements
Identify:
- 3 most expensive recurring investigation steps;
- 3 most repetitive authoring steps;
- 3 proof/replay operations that should be one command;
- highest-value local fixture;
- fastest useful feedback check;
- operation where a false green would be dangerous.

### F. Automation boundary
State:
- what may be generated automatically;
- what may be auto-validated;
- what may be auto-reconciled;
- what must remain a human/CFA decision.

### G. Scale constraints
State any known:
- data volume;
- runtime latency;
- provider/external dependency;
- platform constraint;
- concurrency constraint;
- determinism constraint.

## 3. CFA-specific first-pass requests

| CFA | Most important intelligence needed now | Why it matters to central design |
|---|---|---|
| CFA-01 World / Ontology / Context | canonical world/reference primitives; resolution states; identity/correspondence cases; world projection boundaries | prevents the context compiler/data graph from becoming a hidden ontology |
| CFA-02 Data / Identity / Persistence | minimum continuity envelope; identity/revision/lineage rules; reconstruction requirements; source-vs-canonical boundaries | determines generic pointer/continuity mechanics without turning persistence into second authority |
| CFA-03 Semantic Continuity | canonical semantic/intent/plan handoff; grounding envelope; semantic identity vs representation | determines what context/scaffold/proof tooling is allowed to treat as semantic |
| CFA-04 Authority / Governance | authority citation shape; scope/effect/revocation dimensions; live re-resolution; refusal requirements | prevents tooling from confusing evidence of authority with authority itself |
| CFA-05 Agency / Work / Execution | Work identity; Plan snapshot; Attempt/effect identity; Outcome truth conditions; resume/recovery states | enables reusable task/replay/receipt mechanics around durable work |
| CFA-06 Capability / Provider / Realization | capability/provider/account/session/resource distinctions; candidate vs realization; live-proof boundary | prevents context and orchestration tooling from treating candidates as realized authority |
| CFA-07 Composition / Plugin / Forge | composition identity; candidate/admitted/active states; replacement survivors; admission handoff | determines what scaffolding/activation/replay can safely model |
| CFA-08 Experience / Interaction / Surfaces | projection envelope; durable vs ephemeral surface state; interaction write-back; truth/evidence presentation | prevents surface tooling from becoming a second canonical model |
| CFA-09 Evolution / Compatibility / Self-Maintenance | minimum Change contract; compatibility dimensions; replacement/rollback survivors; verification/promotion states | enables generic change-impact and targeted verification planning |
| CFA-10 Runtime Constitution / Core Substrate | irreducible K0/B1 invariants; entry/egress boundary; activation/recovery guarantees; runtime proof levels | keeps central tooling from smuggling product semantics into the constitutional substrate |

## 4. Stage timing

### Input round 1 — before central semantic implementation
Each CFA supplies sections A–D.

### Input round 2 — before CFA adapters
Each CFA supplies sections E–G plus domain-specific scaffold/replay/proof requirements.

### Input round 3 — before governed corridor selection
Relevant CFAs refine:
- corridor scenario;
- exact handoffs;
- live proof conditions;
- failure/refusal corpus;
- owner decision points.

## 5. Minimum acceptance for a CFA input

A CFA input is sufficient for central design when:
- key terms are defined or explicitly unknown;
- top seams have identified owners;
- inputs/outputs are explicit;
- at least one falsifier exists for each critical claim;
- authoritative sources are named;
- automation boundaries are explicit.

A missing answer does not block all progress. It blocks only the central behavior that would require that answer.

## 6. What the Steward can do while inputs are arriving

Proceed centrally on:
- generic schemas;
- validators for existing shared protocol shapes;
- index/graph machinery;
- context compiler shell and extension points;
- receipt/scaffold mechanics;
- measurement instrumentation;
- documentation/navigation.

Wait for CFA input before:
- encoding domain semantics;
- selecting canonical object fields;
- resolving contested ownership;
- writing domain-specific falsifiers;
- declaring live proof;
- modifying Ω law.

## 7. Routing rule

The requested information is an input to central tooling, not a request to the CFA to implement the tooling.

Each CFA continues its own roadmap and M1 work unless the CFA chooses to produce a compatible shared artifact.

## 8. Proposed first handoff

When each CFA answers sections A–D, the Steward should produce one derived cross-CFA packet:

`shared term candidates -> seam contracts -> dependency graph -> unresolved questions -> central extension points`

That packet becomes the design baseline for central implementation.

## 9. No forced convergence

Where CFAs disagree:
- preserve both claims;
- cite evidence for each;
- mark CONFLICTED;
- isolate the central mechanism behind an extension point;
- route only the specific owner decision needed.

The goal is to avoid stopping the entire development engine because one domain semantic is unresolved.
