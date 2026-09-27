# Central vs CFA Responsibility
## Development Acceleration Substrate — 2026-09-27

> Status: DESIGN / PROPOSED
> Purpose: prevent both under-centralization (ten duplicated toolchains) and over-centralization (Steward becomes a semantic owner).

## 1. Decision rule

A capability belongs in the central substrate when all of the following are true:

1. it is mechanically reusable across most/all CFAs;
2. its semantics can remain domain-neutral;
3. correctness can be expressed without deciding a CFA-owned meaning;
4. central ownership reduces repeated work materially;
5. it can expose extension points for domain-specific rules.

A capability requires CFA input before finalization when any of the following is true:

- it defines what a domain object means;
- it chooses canonical identity or ownership;
- it defines a domain-specific invariant;
- it determines what counts as a valid realization/effect;
- it decides authority/policy semantics;
- it chooses consequential product behavior;
- it depends on evidence the central Steward does not possess.

## 2. Build centrally now

| Capability | Central scope | Why central | CFA input needed before implementation? |
|---|---|---|---|
| Common claim/evidence envelope | schema, status vocabulary, source pointers, falsifier pointer | all CFAs need identical evidence mechanics | No, provided semantic fields remain extension points |
| Question/dependency graph | requests, supplying/consuming CFA, status, blockers, evidence refs | prevents ten dependency trackers | No for mechanics; yes for initial domain edges |
| Decision packet | generic decision/readiness structure | same decision discipline everywhere | No for shape; yes for domain acceptance criteria |
| Handoff envelope | generic source/target/request/evidence/result | existing Boundary Protocol already points here | No; reuse and adapt minimally |
| Context-pack compiler | retrieval/indexing/ranking/trace | strongest cross-CFA speed multiplier | Yes for authoritative source maps and domain relevance hints |
| Repository/architecture inspector | ownership/evidence/implementation/legacy distinction | repeated archaeology is shared cost | Yes for domain-specific interpretation of surfaced objects |
| Deterministic scaffold engine | template generation + no-clobber rules | removes boilerplate everywhere | No for generic kinds; yes for CFA-specific templates |
| Replay/proof runner | interface, execution bookkeeping, result classification | common loop; domain tests plug in | Yes for scenarios, invariants, environment boundaries |
| Falsifier scaffolding | stable ids, red stubs, coverage audit | directly reusable | Yes for actual falsifier clauses |
| Derived orchestration view | graph-to-ready/blocked/verify views | one planner, many consumers | No for mechanics; yes for dependency data |
| Session/bottleneck instrumentation | generic event stream + timing/reporting | directly measures speed | No for mechanics |
| Shared receipt generator | standard evidence/result rendering | eliminates repetitive prose | No |
| Speed metrics | timing/rework/wait metrics | lets owner optimize measured friction | No |
| Cross-CFA index views | derived navigation/indexes | stops duplicated navigation surfaces | No |
| Central design-simulation harness | mutation interface and receipts | lets ideas be tested before build | Yes for mutation models |

## 3. Build centrally, but only after CFA input

These are generic mechanisms whose useful configuration depends on domain material:

### Context relevance graph
Central engine can rank and traverse. CFA supplies:
- authoritative artifacts;
- critical peer sources;
- domain terms;
- freshness/priority hints.

### Contract schema compiler
Central engine can validate shape. CFA supplies:
- domain fields;
- allowed states;
- invariants;
- anti-invariants.

### Replay catalog
Central engine can index/execute. CFA supplies:
- canonical scenarios;
- fixtures;
- expected transitions;
- environmental constraints.

### Targeted verification planner
Central engine can choose the smallest test set by dependency graph. CFA supplies:
- test/falsifier mapping;
- cost classes;
- required proof levels.

## 4. CFA-owned inputs

These should not be invented centrally:

| Input | Why CFA must own the source position |
|---|---|
| Canonical domain vocabulary | meaning is domain responsibility |
| Anti-definitions | prevents accidental semantic capture by tooling |
| Canonical identity subject/semantics | cross-CFA identity must be reconciled, not guessed |
| Ownership boundaries | the CFA is accountable for its domain position |
| Minimum seam contract content | peers must declare what actually crosses |
| Domain invariants | central tooling can enforce, but should not author them |
| Falsifiers | only the domain owner can say what would disprove its claim |
| Authoritative artifact set | central engine can index, but cannot decide authority by convenience |
| Canonical fixtures/scenarios | fixtures encode domain meaning |
| External-realization semantics | especially provider/account/session/resource rules |
| Authority semantics | scope, consent, delegation, revocation, effect rules |
| Work semantics | plan/attempt/outcome meaning and continuity |
| Surface semantics | projection vs canonical state, interaction write-back |
| Change/compatibility semantics | survivor properties, migration and replacement meaning |
| K0/B1 runtime invariants | runtime owner decides irreducible constitutional guarantees |
| Live proof conditions | domain owner and owner-governed policy define what constitutes live proof |
| Human decision points | owner intervention boundaries cannot be automated by the Steward |

## 5. Shared co-design zone

The following should be **centrally drafted, CFA-refined, then ratified by the responsible owners**:

- seam envelope shape;
- shared vocabulary metadata;
- identity/reference pointer shape;
- evidence citation shape;
- dependency edge types;
- decision-readiness gates;
- replay metadata;
- proof-level taxonomy;
- extension mechanism.

Central draft is a starting point, not final semantics.

## 6. What Architecture Steward owns

The Steward may own:
- the central design artifacts;
- comparison/reconciliation views;
- derived cross-CFA indexes;
- request/dependency bookkeeping;
- coordination prompts;
- shared tooling contracts;
- mechanical tooling after the owners accept the schemas.

The Steward does not own:
- domain meaning;
- domain authority;
- product behavior;
- implementation decisions inside a CFA's boundary;
- the final owner decision where policy or architecture choice remains contested.

## 7. What a CFA receives in return

Each CFA should get:
- one commandable context packet;
- one shared dependency view;
- one evidence/claim envelope;
- deterministic scaffolding;
- targeted replay/proof;
- automatic receipt/handoff;
- measured session bottlenecks;
- a common way to discover exactly what peer input is still missing.

The bargain is simple:

**CFAs contribute domain intelligence once; the central substrate turns that intelligence into repeated development leverage.**

## 8. Central implementation stop conditions

The Steward should stop central implementation and route to CFA owners when:
- a generic schema requires choosing between conflicting domain meanings;
- a proposed generic field starts carrying hidden semantic authority;
- two CFAs disagree about subject identity;
- a replay needs product-specific side effects to be considered truthful;
- a proof level depends on a policy choice;
- a central tool would need to interpret an unresolved Ω law clause.

## 9. Anti-duplication rule

When an existing artifact already provides the needed role, extend/adapt or index it before creating another system.

Known candidates to reuse include:
- FSSP-1.3;
- Agent Commons;
- Boundary Protocol;
- existing receipt/task state;
- historical Ω genome;
- historical Ω falsifier loop;
- historical Ω orchestration;
- historical Ω session/development-memory patterns.

The old Ω implementation does not become authority merely because it exists.
