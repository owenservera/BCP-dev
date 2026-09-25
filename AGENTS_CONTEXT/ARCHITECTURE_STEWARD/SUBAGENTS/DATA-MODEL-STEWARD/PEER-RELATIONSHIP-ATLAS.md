# CFA-02 Data Steward — Peer Distance & Relationship Atlas

> Status: PROVISIONAL / FOUNDATION-SEEDED
> Date: 2026-09-25
> Scope: CFA-01 through CFA-10 + Architecture Steward

## 0. Purpose

This is my own working map of how CFA-02 relates to the Architecture Steward constellation.

It is not another ownership matrix.

A responsibility matrix asks: who owns what?

This atlas asks: how close are we operationally, what crosses between us, what do I need from them, what will they need from me, where can boundaries become confused, and what kind of relationship should we cultivate?

The scoring system is a navigation instrument. It is not authority, maturity, importance, or a permanent architectural verdict.

---

# 1. Relationship taxonomy

| Code | Relationship class | Meaning |
|---|---|---|
| CP | Continuity Partner | Both areas must preserve a property across a transformation or lifecycle boundary. |
| SM | Semantic-to-Model Neighbor | The peer defines or owns meaning; CFA-02 gives that meaning durable identity and representation. |
| PR | Producer / Receiver | One side routinely produces information that the other must persist, normalize, reconcile, or consume. |
| RG | Runtime / Grounding Neighbor | The peer observes or acts on runtime or external state that must be tied back to durable data. |
| PV | Projection Consumer | The peer primarily consumes durable data through derived graph, memory, context, search, or surface views. |
| EV | Evolution Partner | Replacement, migration, compatibility, or recovery creates shared continuity pressure. |
| GT | Governance / Trust Boundary | The peer constrains what may be represented, changed, exposed, or retained. |
| MC | Meta-Coordinator | The peer coordinates, maps, reconciles, or arbitrates relationships among owners rather than owning the underlying data semantics. |

A peer can carry several classes at once.

---

# 2. Distance scoring system

I use an eight-dimensional relationship vector, each dimension scored 0–5.

| Dimension | Symbol | 0 | 3 | 5 |
|---|---:|---|---|---|
| Data-plane overlap | D | unrelated | occasional shared data | continuous information sharing |
| Identity / lineage coupling | I | independent | some shared references | identity mapping is central |
| Transformation coupling | T | none | recurring translation | both sides participate in the same transform chain |
| Lifecycle / revision coupling | L | unrelated | some shared state changes | revision, recovery, replacement are inseparable |
| Read/write exchange | W | almost none | one important interface | sustained bidirectional exchange |
| Runtime / external-state coupling | R | none | indirect | direct observation or realization boundary |
| Governance / authority coupling | G | low | policy-sensitive | consequential mutations depend on this seam |
| Evolution / replacement coupling | E | independent | occasional impact | replacement/migration continuously depends on the seam |

### Proximity

I weight the dimensions as:

D 20% + I 18% + T 15% + L 12% + W 10% + R 10% + G 7% + E 8%.

Proximity is therefore a value from 0 to 5.

Distance is:

5 minus Proximity.

| Distance | Interpretation |
|---:|---|
| 0.0–0.9 | extremely close / standing paired boundary |
| 1.0–1.9 | very close / frequent cross-functional seam |
| 2.0–2.9 | adjacent / recurring but bounded interface |
| 3.0–3.9 | related / episodic dependency |
| 4.0–5.0 | distant / usually mediated by other areas |

### Two companion measures

Dependency Pressure (DP): how difficult it is for CFA-02 to perform its job correctly without the peer.

Peer Demand (PD): how strongly I expect the peer to need CFA-02 in return.

DP and PD are also 0–5. They are relationship-pressure indicators, not rankings.

---

# 3. Constellation matrix

| Peer | Classes | D | I | T | L | W | R | G | E | Proximity | Distance | DP | PD |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| CFA-01 World / Ontology / Context | SM/CP/PV | 5 | 5 | 4 | 5 | 5 | 3 | 2 | 4 | 4.45 | 0.55 | 5 | 5 |
| CFA-03 Semantic Continuity | SM/CP/PV | 5 | 5 | 5 | 4 | 5 | 3 | 2 | 4 | 4.60 | 0.40 | 5 | 5 |
| CFA-04 Authority / Governance | GT/CP/RG | 4 | 5 | 4 | 4 | 5 | 4 | 5 | 5 | 4.50 | 0.50 | 5 | 5 |
| CFA-05 Agency / Work / Execution | PR/CP/EV/RG | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 5 | 4.80 | 0.20 | 5 | 5 |
| CFA-06 Capability / Provider / Realization | RG/PR/CP/EV | 5 | 5 | 5 | 4 | 5 | 5 | 4 | 5 | 4.75 | 0.25 | 5 | 5 |
| CFA-07 Composition / Plugin / Forge | PR/EV/CP | 4 | 4 | 4 | 4 | 4 | 3 | 4 | 5 | 4.00 | 1.00 | 4 | 5 |
| CFA-08 Experience / Interaction / Surfaces | PV/SM/PR | 4 | 4 | 4 | 3 | 5 | 2 | 3 | 4 | 3.75 | 1.25 | 4 | 5 |
| CFA-09 Evolution / Compatibility / Self-Maintenance | EV/CP/MC | 5 | 5 | 5 | 5 | 5 | 4 | 3 | 5 | 4.70 | 0.30 | 5 | 5 |
| CFA-10 Runtime Constitution / Core Substrate | RG/GT/CP | 3 | 4 | 3 | 5 | 4 | 5 | 5 | 5 | 3.95 | 1.05 | 4 | 5 |
| Architecture Steward | MC/EV/PV | 5 | 5 | 5 | 5 | 5 | 4 | 5 | 5 | 4.95 | 0.05 | 5 | 5 |

The important nuance is that proximity does not equal importance. CFA-10 is less semantically close than CFA-05, but a false substrate assumption can invalidate a data contract anyway.

---

# 4. CFA-01 — World / Ontology / Context

## Relationship

SM + CP + PV

Distance: 0.55 — extremely close.

## They own

- semantic world meaning;
- meaningful objects and relationships;
- world projection semantics;
- Context semantics;
- addressability and correspondence meaning.

## I need from them

- meaning of the thing being represented;
- meaning of semantic relationships;
- distinctions between semantic identity and source/storage identity;
- semantics of merge, split, archive, delete, correspondence;
- world/context distinctions that classify durable versus derived information.

## They need from me

- durable object identity;
- revision/history;
- source identity mappings;
- persistence/reconstruction constraints;
- evidence and provenance linkage;
- stable references independent of storage technology.

## Critical seam

WORLD MEANING ↔ CANONICAL OBJECT ↔ SOURCE IDENTITY ↔ CORRESPONDENCE

CFA-01 decides what semantic correspondence means.

CFA-02 ensures the correspondence can be durably represented, traced and revised without losing genealogy.

## Main boundary failure

World begins using a storage or provider identifier as semantic identity, or Data begins using storage shape as a substitute for meaning.

## Relationship posture

Standing peer. Frequent direct exchange.

---

# 5. CFA-03 — Semantic Continuity Steward

## Relationship

SM + CP + PV

Distance: 0.40 — closest specialist peer.

## They own

- semantic continuity across representations;
- grounding;
- command language;
- Intent / Plan meaning;
- representation semantics;
- bounded terminology and semantic crosswalks.

## I need from them

- identification of meaning-bearing transformations;
- distinction between representation change and meaning change;
- terminology where a data field is semantically ambiguous;
- identification of genuine semantic migrations.

## They need from me

- durable identities for Intent, Plan, Work, Evidence and related records;
- revision history;
- provenance paths;
- reconstructability across representation changes.

## Critical seam

SEMANTIC MEANING → REPRESENTATION → DURABLE STATE → REPRESENTATION AGAIN

CFA-03 protects meaning.

CFA-02 protects the durable lineage of representations carrying that meaning.

## Main boundary failure

A semantic equivalence is asserted but the evidence or history needed to reconstruct it has been lost.

The inverse failure is also possible: Data preserves every byte while the semantic owner says the meaning changed.

## Relationship posture

Paired design relationship. Likely recurring joint crosswalks and round-trip proofs.

---

# 6. CFA-04 — Authority / Governance

## Relationship

GT + CP + RG

Distance: 0.50 — extremely close.

## They own

- who may cause an effect;
- consent;
- standing;
- delegation;
- scope;
- duration;
- revocation;
- authority-facing governance semantics.

## I need from them

- which authority references are consequential;
- which identities must bind mutations;
- which data exposures are governed;
- what authority state needs historical retention.

## They need from me

- durable identity references;
- mutation history;
- authority-to-result linkage;
- reconstruction of governed state;
- durable relationships connecting actor, mutation and evidence.

## Critical seam

AUTHORITY MEANING → AUTHORIZED MUTATION → DATA REVISION → EVIDENCE

CFA-04 says whether a mutation is authorized.

CFA-02 makes the resulting state and lineage durable.

## Main boundary failure

An authority decision cannot be tied to the resulting state, or a state mutation survives with no reconstructable authority basis.

## Relationship posture

Standing gate relationship. Consequential writes need an explicit boundary.

---

# 7. CFA-05 — Agency / Work / Execution

## Relationship

PR + CP + EV + RG

Distance: 0.20 — effectively paired.

## They own

- durable Work;
- execution attempts;
- worker/agent responsibility;
- scheduling and background continuity;
- recovery;
- outcomes;
- execution meaning.

## I need from them

- durable Work versus runtime execution-state distinction;
- attempt/outcome identity semantics;
- incomplete and unknown external-effect semantics;
- evidence that must survive recovery.

## They need from me

- stable Work identity;
- revision history;
- durable outcome/result data;
- canonical state access;
- restart/recovery reconstruction.

## Critical corridor

Intent → Work → Attempt → External Effect → Observation → Outcome → Evidence → Canonical Revision

This is one of the most important shared corridors.

## Main boundary failure

Work says completed but no durable state explains what changed, or an external effect happened but Work cannot reconstruct it after restart.

## Relationship posture

Joint design partner and one of the first implementation relationships.

---

# 8. CFA-06 — Capability / Provider / Realization

## Relationship

RG + PR + CP + EV

Distance: 0.25 — effectively paired.

## They own

- capability semantics;
- provider identity;
- account/session/resource distinctions;
- routing;
- external realization;
- provider knowledge;
- discovery and healing;
- browser realization.

## I need from them

- external/source identity;
- observation provenance;
- provider realization identity;
- parser or adapter version when it affects durable data;
- explicit account/session/realization distinctions;
- observation after write-back.

## They need from me

- canonical target identity;
- source mapping;
- revision-aware storage;
- reconciliation state;
- local history independent of provider implementation.

## Critical corridor

PROVIDER OBSERVATION → CAPTURE → PARSER / ALIGNMENT → RECONCILIATION → CANONICAL OBJECT / REVISION

Reverse:

CANONICAL STATE → AUTHORIZED TRANSLATION → EXTERNAL REALIZATION → OBSERVATION → RECONCILIATION → REVISION

## Current evidence that matters

The repository distinguishes latest ProviderRealization state from append-only discovery history, and parser pins can identify the parser contribution used in a realization. This is precisely the type of split-state boundary the Data Continuity Lens is intended to expose.

## Main boundary failures

- provider ID becomes canonical identity;
- parser output becomes unquestioned truth;
- write success becomes assumed truth;
- provider replacement destroys genealogy.

## Relationship posture

Highest-frequency external data partner.

---

# 9. CFA-07 — Composition / Plugin / Forge

## Relationship

PR + EV + CP

Distance: 1.00 — very close but more mediated.

## They own

- composition semantics;
- plugin contributions;
- manifests;
- composition dependencies;
- Forge proposal/promotion;
- replaceability of assembled capabilities.

## I need from them

- composition identity/version;
- plugin ownership of data semantics;
- replacement semantics;
- plugin versus product data distinction;
- whether a plugin change changes interpretation of persisted data.

## They need from me

- implementation-independent user data;
- durable object and relationship identity;
- migration/reconstruction support;
- compatibility evidence;
- provenance when a composition created a consequential representation.

## Critical corridor

PLUGIN IMPLEMENTATION → DATA CONTRACT → CANONICAL USER DATA ← REPLACEMENT IMPLEMENTATION

## Main boundary failure

A plugin writes product data using an implementation-specific identity and becomes effectively irreplaceable because only the old plugin can interpret its records.

## Relationship posture

High-value replacement partner.

---

# 10. CFA-08 — Experience / Interaction / Surfaces

## Relationship

PV + SM + PR

Distance: 1.25 — adjacent with heavy traffic.

## They own

- perception;
- navigation;
- manipulation;
- interaction;
- surface semantics;
- workspace/canvas presentation;
- user-facing write-back.

## I need from them

- which user changes are semantic versus presentation-only;
- write-back intent;
- durable surface state that is genuinely user-owned;
- which representations are disposable.

## They need from me

- canonical object identity;
- revision-aware read/write;
- safe write-back contracts;
- durable relationship identity;
- recoverable presentation state where required.

## Critical corridor

CANONICAL MEANING → SURFACE REPRESENTATION → USER EDIT → SEMANTIC CHANGE OR PRESENTATION CHANGE? → CANONICAL REVISION

## Main boundary failure

A visual node ID becomes canonical identity, or canvas arrangement silently becomes semantic relationship.

## Relationship posture

Strong consumer/producer. Direct collaboration whenever presentation crosses into durable mutation.

---

# 11. CFA-09 — Evolution / Compatibility / Self-Maintenance

## Relationship

EV + CP + MC

Distance: 0.30 — effectively paired.

## They own

- change lifecycle;
- migration;
- compatibility;
- replacement;
- repair;
- self-maintenance;
- rollback and impact management.

## I need from them

- change classification;
- migration intent;
- compatibility dimensions;
- replacement scope;
- rollback assumptions;
- rules for old data readability.

## They need from me

- identity/revision preservation;
- source genealogy;
- information-loss declarations;
- export/import/reconstruction evidence;
- continuity constraints.

## Critical corridor

PROPOSED CHANGE → WHAT DATA CHANGES? → WHAT IDENTITY SURVIVES? → WHAT HISTORY SURVIVES? → CAN OLD DATA STILL BE RECONSTRUCTED?

## Main boundary failure

A migration is declared successful because the new schema loads, while canonical identity or source lineage is no longer reconstructable.

## Relationship posture

Permanent paired relationship for consequential change.

---

# 12. CFA-10 — Runtime Constitution / Core Substrate

## Relationship

RG + GT + CP

Distance: 1.05 — close mechanically, farther semantically.

## They own

- irreducible runtime guarantees;
- admission;
- isolation;
- transport;
- revocation/fencing;
- activation/recovery;
- minimal platform substrate;
- K0 enforcement.

## I need from them

- real durability and atomicity guarantees;
- process-boundary identity semantics;
- lifecycle events;
- recovery boundaries;
- distinction between runtime observation and runtime authority.

## They need from me

- data requirements without product semantics leaking into K0;
- durable versus runtime-state classifications;
- reconstruction requirements;
- data references that remain implementation-neutral.

## Main boundary pressure

Product data requirements can leak into K0 because they are important.

The Data Steward must instead say exactly which guarantees are mechanical and which are product semantics.

## Current evidence seam

The host exposes graph/audit snapshots while vault, world and product semantics remain outside the narrow host substrate. This is an important boundary to preserve.

## Relationship posture

Constitutional substrate partner. High consequence, lower everyday semantic traffic.

---

# 13. Architecture Steward

## Relationship

MC + EV + PV

Distance: 0.05 — effectively the parent/meta boundary.

The Architecture Steward is unusual because it does not own the same data semantics.

It owns the coherence layer:

- architectural mapping;
- documentation integrity;
- research lineage;
- dependency/impact representation;
- graph stewardship;
- reconciliation across owners;
- architectural cold-start context.

## I need from the Steward

- ownership arbitration;
- graph placement for data-boundary findings;
- connection from data continuity to requirements, journeys, responsibilities and implementations;
- help when two semantic owners disagree.

## The Steward needs from me

- evidence-backed data-boundary findings;
- identity and lineage maps;
- migration/replacement impact evidence;
- contradictions and unknowns;
- proof that architecture-graph edges correspond to actual data dependencies.

## Critical seam

DATA CORRIDOR FINDING → DATA STEWARD CLASSIFICATION → ARCHITECTURE RECONCILIATION → GRAPH / CANONICAL VIEW

The Steward can ask:

> What architectural dependency does this data corridor create?

I can answer:

> What durable data facts support that dependency?

## Main boundary failure

CFA-02 starts maintaining a competing architecture graph, or the Architecture Steward starts becoming canonical data authority because it needs to represent data relationships.

## Relationship posture

Always-on meta-partner.

---

# 14. Identity dependency matrix

Identity is a major source of false overlap because several agents use the word identity differently.

| Identity layer | CFA-01 | CFA-02 | CFA-03 | CFA-04 | CFA-05 | CFA-06 | CFA-07 | CFA-08 | CFA-09 | CFA-10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Semantic identity | owner | continuity link | semantic steward | use | use | use | use | use | preserve | observe |
| Canonical record identity | use | **steward** | use | use | use | map | preserve | use | preserve | transport |
| Revision identity | use | **steward** | use | use | need | need | need | need | preserve | observe |
| Event / causation identity | use | **steward** | use | use | need | need | need | need | preserve | mechanical |
| Evidence identity | consume | **steward** | consume | consume | produce/consume | produce | produce | consume | preserve | transport |
| External/provider identity | meaning | **map/steward** | represent | use | use | owner | use | represent | preserve | transport |
| Surface identity | meaning | persist if durable | represent | use | use | use | use | owner | preserve | transport |

Legend: owner means semantic owner; steward means continuity/persistence steward; map/steward means CFA-02 maintains the durable mapping without owning semantic meaning; preserve means evolution must not destroy it.

---

# 15. Transformation matrix

| Transformation | Primary peer | CFA-02 role | Main risk | Secondary peer |
|---|---|---|---|---|
| source → canonical | CFA-06 | identity, lineage, revision | parser drift / false correspondence | CFA-01, CFA-09 |
| canonical → Intent/Plan representation | CFA-03 | preserve durable source identity | representation mistaken for truth | CFA-01 |
| Intent/Plan → Work | CFA-05 | identity continuity | semantic genealogy lost | CFA-03 |
| Work → external effect | CFA-05 + CFA-06 | causation/result linkage | effect cannot be reconstructed | CFA-04 |
| external effect → observed result | CFA-06 | reconcile to canonical revision | successful call mistaken for truth | CFA-05, CFA-09 |
| canonical → surface | CFA-08 | protect canonical identity | UI state becomes semantic truth | CFA-01 |
| surface → canonical mutation | CFA-08 | revision/provenance | presentation accidentally mutates meaning | CFA-03, CFA-04 |
| plugin → plugin data contract | CFA-07 | durable compatibility | implementation coupling | CFA-09 |
| old schema → new schema | CFA-09 | reconstructability/lineage | migration erases history | CFA-01 |
| vault → architecture graph | Architecture Steward | basis/ref traceability | graph becomes source of truth | CFA-01, CFA-03 |
| vault → memory/context | CFA-01/CFA-03/product mechanisms | source lineage | derivative becomes canonical | CFA-03 |
| runtime state → durable state | CFA-10/CFA-05 | classify persistence | accidental persistence/data loss | CFA-09 |

---

# 16. What each peer should be able to ask the Data Steward

## CFA-01

- What canonical object does this world subject map to?
- What is its source genealogy?
- Which revision does this relationship describe?
- Is this a semantic relationship or merely provenance?

## CFA-03

- Did this transformation change representation or meaning?
- What durable evidence reconstructs the input?
- Can the semantic round trip be proven?

## CFA-04

- Which durable state resulted from this authorized action?
- Can the authority basis be traced to the resulting revision?

## CFA-05

- Which Work or attempt caused this change?
- What survives restart?
- What happened when the external outcome was uncertain?

## CFA-06

- Which observation produced this canonical revision?
- Which parser/adapter/realization version was used?
- Which provider/account/session was involved?

## CFA-07

- Can this plugin be removed or replaced without losing user data?
- Which data contract is implementation-independent?

## CFA-08

- Is this canonical data or presentation state?
- What revision will this interaction create?

## CFA-09

- What identity and lineage must survive this change?
- What old records must remain reconstructable?

## CFA-10

- Which substrate guarantees actually exist?
- Which requested guarantee is product semantics and therefore must remain outside K0?

## Architecture Steward

- What architectural dependency does this corridor actually create?
- What evidence supports the edge?
- Which responsibility owns each side?

---

# 17. What I should proactively give peers

I should communicate without waiting for requests when I find:

1. a new consequential data corridor;
2. identity conflation;
3. a lineage break;
4. reconstruction failure;
5. a derived-data leak into canonical truth;
6. write-back without observed reconciliation;
7. migration/evolution that can make old data unreadable;
8. an ownership collision;
9. graph relationships supported or falsified by data evidence;
10. stale graph/memory/context derivations.

These are relationship-relevant findings, not status spam.

---

# 18. What I should not demand from peers

The discipline is important.

I do not need:

- CFA-01 to give me its entire ontology;
- CFA-03 to design storage;
- CFA-04 to implement persistence;
- CFA-05 to turn runtime state into schema;
- CFA-06 to expose every provider internal;
- CFA-07 to make every plugin contract globally data-aware;
- CFA-08 to make every visual state durable;
- CFA-09 to own every migration operation;
- CFA-10 to admit product semantics into K0;
- Architecture Steward to arbitrate ordinary local implementation choices.

This restraint is part of the role.

---

# 19. Four closest corridors

## A. CFA-06 ↔ CFA-02

External world ↔ canonical world.

This is the primary Data Continuity Lens proving ground.

## B. CFA-05 ↔ CFA-02

Work ↔ durable state.

This tests restart, retry, unknown external effect and outcome reconstruction.

## C. CFA-09 ↔ CFA-02

Change ↔ continuity.

This tests whether representation can change while identity, lineage and history survive.

## D. CFA-01 ↔ CFA-02

Meaning ↔ durable object.

This prevents semantic identity and storage identity from collapsing into one concept.

---

# 20. Three operational rings

## Ring 1 — paired boundaries

- Architecture Steward
- CFA-03 Semantic Continuity
- CFA-05 Agency / Work
- CFA-06 Capability / Provider
- CFA-09 Evolution
- CFA-01 World
- CFA-04 Authority

These need explicit recurring contracts.

## Ring 2 — strong adjacent

- CFA-07 Composition / Forge
- CFA-08 Experience / Surfaces
- CFA-10 Runtime Constitution

These need active collaboration but normally through narrower boundaries.

## Ring 3 — mediated

Specialized research agents, Provider Lab experiments, implementation agents, coding-readiness work, product archaeology and one-off investigations should normally reach CFA-02 through the responsible CFA rather than bypassing the architecture boundary.

---

# 21. Boundary pressure map

| Boundary | Pressure | What could go wrong | Guardrail |
|---|---|---|---|
| CFA-01 ↔ CFA-02 | semantic ownership | storage becomes ontology | meaning stays with World |
| CFA-02 ↔ CFA-03 | interpretation | representation becomes meaning | representation is not authority |
| CFA-02 ↔ CFA-04 | authority | stored state implies authorization | authority remains explicit |
| CFA-02 ↔ CFA-05 | runtime durability | ephemeral state becomes canon or durable Work disappears | classify runtime vs durable |
| CFA-02 ↔ CFA-06 | external truth | provider state becomes canonical truth | observe + reconcile |
| CFA-02 ↔ CFA-07 | implementation coupling | plugin becomes required to interpret data | implementation-independent contracts |
| CFA-02 ↔ CFA-08 | presentation | visual state becomes semantic data | canonical vs presentation classification |
| CFA-02 ↔ CFA-09 | migration | new representation destroys genealogy | identity/lineage/reconstruction proof |
| CFA-02 ↔ CFA-10 | substrate | product semantics leak into K0 | mechanism/data separation |
| CFA-02 ↔ Architecture Steward | meta-authority | graph becomes data authority | graph remains projection/map |

---

# 22. Communication priority

| Level | Meaning | Default action |
|---|---|---|
| P0 | continuity threat | alert affected peer + Architecture Steward |
| P1 | cross-CFA ambiguity | direct peer + durable boundary note |
| P2 | useful discovery | normal Commons communication or artifact |
| P3 | local implementation detail | keep local unless a contract changes |

P0 examples include identity collisions, unreconstructable migrations, canonicalization from stale projections, provider replacement that destroys genealogy, or mutation results that cannot be linked to the action that caused them.

---

# 23. Reusable relationship artifact

I do not want a permanent custom document for every peer.

The reusable unit should be a CFA-02 Boundary Card:

- boundaryId
- fromCFA
- toCFA
- direction
- semanticOwner
- dataSteward
- authorityOwner
- realizationOwner
- inputRepresentation
- outputRepresentation
- identityMapping
- revisionBehavior
- transformation
- transformationVersion
- provenanceRequirements
- evidenceRequirements
- freshnessRequirements
- durabilityRequirements
- reconstructionRequirements
- informationLoss
- unknownStates
- conflictStates
- replacementImpact
- migrationImpact
- falsifiers
- status
- sourceRefs

It is a small contract, not a universal schema.

---

# 24. What the constellation reveals

## Data is not a horizontal layer

It is tempting to imagine ten vertical domains with Data underneath them.

I think that is the wrong picture.

Data is better understood as a network of continuity corridors between domains.

World ↔ Data ↔ Semantic Continuity ↔ Intent ↔ Work ↔ Provider

with Authority, Surface, Composition, Evolution and Runtime intersecting those corridors at particular points.

The fact that many domains cross Data does not make Data their semantic owner.

## A major part of my job is preserving distinctions

The Data Steward is often most useful when it says:

> These things look similar, but they are not the same data object.

Examples:

- provider ≠ account ≠ session ≠ realization;
- semantic identity ≠ canonical record ID;
- revision ≠ event;
- evidence ≠ authority;
- relationship ≠ provenance;
- projection ≠ source;
- memory ≠ context;
- runtime state ≠ durable state;
- write success ≠ external truth.

These distinctions are continuity infrastructure.

## The Intelligence Graph should expose the same seams

The valuable future graph question is not only:

> What is connected to X?

It is:

> Why is X connected to Y, what durable information supports that connection, what transformation created it, which authority owns its meaning, what evidence supports it, and what breaks if the implementation changes?

The Data Steward is therefore an important explanation layer beneath graph intelligence.

---

# 25. Relationship lifecycle

Every meaningful peer relationship should mature through:

RECOGNIZE
→ TRACE
→ CONTRACT
→ PROVE
→ MONITOR

Do not jump from recognition directly to a universal schema.

---

# 26. Immediate peer strategy

## First wave

CFA-06 + CFA-05 + CFA-01 + CFA-09

These test:

- source ↔ canonical;
- execution ↔ durable state;
- meaning ↔ identity;
- change ↔ continuity.

## Second wave

CFA-03 + CFA-04

Validate semantic and authority boundaries against actual corridors.

## Third wave

CFA-07 + CFA-08 + CFA-10

Lock down implementation replacement, user-facing write-back, and substrate assumptions.

## Always

Architecture Steward remains the meta-reconciliation partner.

---

# 27. Final model

I do not think of CFA-02 as “below” everyone.

I think of it as the continuity fabric that many otherwise independent responsibilities cross.

CFA-01 asks:

> What does this mean in the world?

CFA-03 asks:

> Does that meaning survive interpretation and representation?

CFA-04 asks:

> Who may cause the change?

CFA-05 asks:

> What Work performs it?

CFA-06 asks:

> Through what external realization?

CFA-07 asks:

> How is it assembled and replaced?

CFA-08 asks:

> How is it experienced and edited?

CFA-09 asks:

> How does it evolve without losing continuity?

CFA-10 asks:

> What can the runtime substrate guarantee?

CFA-02 asks:

> **What durable data carries all of that, how did it get here, what identity and lineage does it have, what can be reconstructed, and what survives when everything around it changes?**

Architecture Steward asks:

> How do all of these responsibilities fit together coherently?

That is the relationship model I want to use going forward.
