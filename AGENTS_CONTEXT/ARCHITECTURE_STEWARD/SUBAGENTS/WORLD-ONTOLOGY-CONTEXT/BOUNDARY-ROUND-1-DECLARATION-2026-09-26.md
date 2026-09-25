# CFA-01 World / Ontology / Context — Boundary Round 1 Declaration

> Date: 2026-09-26  
> Classification: CFA-01 current claim; not a shared architectural boundary  
> Basis: repository `main` as inspected for Round 1 on 2026-09-26  
> Important: peer ownership statements below are CFA-01 interpretations of peer artifacts. They do not imply peer agreement.

## Identity

| Field | Current claim |
|---|---|
| CFA ID | `CFA-01` |
| Current working / rationalized name | **World & Context Steward** |
| Register / CFA label | **World / Ontology / Context** |
| Machine-safe seed | `world-ontology-context` |
| Identity status | **PROVISIONAL** — owner alignment is not formally recorded; no permanent `CORE-AGENT.md` is ratified |
| Responsibility that must remain continuously coherent | The semantic model of the user's world and the semantic contract by which bounded, purpose-specific context is derived from that world, while meaning remains distinct from storage, authority, execution, realization, evidence and representation |
| Explicit non-ownership | Canonical persistence mechanics; durable record implementation; command/Intent semantic continuity; authorization decisions; Work/execution; provider/browser realization; surface/UI realization; evolution/migration implementation; runtime constitutional enforcement; Architecture Steward graph stewardship; generic evidence/provenance infrastructure |

**Identity basis**

- **OBSERVED / CURRENT:** CFA-01 is listed in the Core Function Area Register as World / Ontology / Context and remains bootstrap-ready.
- **OBSERVED / CURRENT:** the CFA-01 home states that permanent identity is not yet ratified.
- **DERIVED / CURRENT:** the most useful current human-readable form is **World & Context Steward** because the enduring responsibility explicitly includes both World meaning and the World→Context semantic contract.
- **PROPOSED / CURRENT:** retain the register label for CFA identification while using **World & Context Steward** as the working name until owner alignment changes it.

## Responsibility

CFA-01 is responsible for keeping one semantic question coherent:

> **What is meaningfully present in the user's world, what are those subjects and relationships, how can they be identified and addressed without conflating identities, what does it mean to project that world, and how can a bounded purpose-specific slice become Context without becoming a second source of truth?**

This currently includes:

1. **World semantics** — what a Thing/Object, Relationship, Space and other world subject mean.
2. **Identity / correspondence meaning** — distinctions among semantic identity, canonical record identity, revision identity, source/external identity and correspondence assertions.
3. **Relationship semantics** — meaning of relationships independently of storage topology.
4. **Addressability / query semantics** — what it means to refer to or retrieve a World subject while preserving candidate-vs-authority and identity distinctions.
5. **World projection semantics** — what a derived World view is, what its basis/freshness means, and how it remains reconstructable.
6. **Context semantics** — what Context represents, why information is included/excluded, and how it remains bounded and tied to its basis.
7. **Semantic boundary contracts** — the World-facing contract with Data, Semantic Continuity and Authority, without absorbing their respective persistence, continuity or authorization responsibilities.
8. **Semantic reconciliation** only where needed to characterize World meaning; not unilateral settlement of peer-owned disputes.

A useful shorthand is:

`canonical objects + relationships → World meaning → scoped query / Space / address → Context semantics → D-443 assembly`

D-443 is treated as the existing deterministic context substrate. CFA-01 does **not** claim the D-443 runtime implementation as its property.

## OWNS / CONTRIBUTES / CONSULTS / OUT-OF-SCOPE

| Responsibility | Position | Claim state | Freshness | Boundary note |
|---|---|---|---|---|
| Meaning of World, Thing/Object and core World subjects | **OWNS** | DERIVED | CURRENT | Semantic accountability, not storage ownership |
| Meaning of semantic relationships / topology | **OWNS** | DERIVED | CURRENT | Relationship record mechanics remain with Data |
| Semantic identity / correspondence meaning | **OWNS** | DERIVED | CURRENT | Canonical record identity mechanics remain with Data; temporal merge/split remains unresolved with Data/Evolution |
| Space semantics | **OWNS** | DERIVED | CURRENT | Workspace/layout realization remains with Experience; persistence mechanics remain with Data |
| World projection semantics | **OWNS** | DERIVED | CURRENT | Projection is derived and reconstructable; not a second database |
| Context semantic contract | **OWNS** | DERIVED | CURRENT | Relevance semantics remain distinct from D-443 assembly mechanics |
| World-facing addressability/query semantics | **OWNS** | DERIVED | CURRENT | Search/index mechanisms may belong elsewhere; retrieval is not authority |
| Semantic requirements for durable World data | **CONTRIBUTES** | DERIVED | CURRENT | Data decides durable representation/mechanics |
| Cross-plane meaning/crosswalk continuity | **CONTRIBUTES** | DERIVED | CURRENT | CFA-03 owns semantic continuity across language/grounding/Intent/Plan/evidence/representation |
| Authority-facing World/context constraints | **CONTRIBUTES** | PROPOSED | CURRENT | CFA-04 owns authority semantics; principal/viewpoint scope is not yet aligned |
| External observation interpretation at World boundary | **CONTRIBUTES** | PROPOSED | CURRENT | CFA-06 owns provider/realization mechanics; World interprets resulting domain meaning |
| World-related Work context inputs | **CONSULTS** | PROPOSED | CURRENT | CFA-05 owns Work lifecycle/execution semantics |
| Space/Workspace/surface interaction consequences | **CONSULTS** | DERIVED | CURRENT | CFA-08 owns representation and interaction realization |
| Identity evolution / migration consequences | **CONSULTS** | PROPOSED | CURRENT | CFA-09 owns migration/evolution implementation |
| Runtime context assembly implementation (D-443) | **CONSULTS** | OBSERVED | CURRENT | Existing ratified substrate; CFA-01 supplies semantic inputs/constraints |
| Canonical object persistence, revision storage and recovery mechanics | **OUT-OF-SCOPE** | OBSERVED / DERIVED | CURRENT | CFA-02 |
| Command/Intent/Plan semantic continuity ownership | **OUT-OF-SCOPE** | OBSERVED | CURRENT | CFA-03 |
| Authorization / consent / delegation decision semantics | **OUT-OF-SCOPE** | OBSERVED | CURRENT | CFA-04 |
| Work lifecycle, scheduling, execution and recovery | **OUT-OF-SCOPE** | DERIVED | CURRENT | CFA-05 |
| Provider/account/session/browser realization mechanics | **OUT-OF-SCOPE** | DERIVED | CURRENT | CFA-06 |
| Composition / Forge mechanics | **OUT-OF-SCOPE** | DERIVED | CURRENT | CFA-07 |
| Surface/UI/layout realization | **OUT-OF-SCOPE** | OBSERVED / DERIVED | CURRENT | CFA-08 |
| Evolution/migration implementation | **OUT-OF-SCOPE** | OBSERVED / DERIVED | CURRENT | CFA-09 |
| K0/runtime constitutional enforcement | **OUT-OF-SCOPE** | DERIVED | CURRENT | CFA-10 |
| Architecture Steward graph as canonical World ontology | **OUT-OF-SCOPE** | OBSERVED | CURRENT | Steward graph is a derived development view |

**Epistemic rule:** the same subject may have multiple ownership dimensions. CFA-01 owning meaning does not imply owning durability, authority, execution, realization, evidence or lifecycle.

## Assigned Seams

### Seam 1 — World ↔ Data

#### 1. What is the seam's subject?

The crossing between **semantic World meaning** and the **durable data plane that records, versions, preserves, reconstructs and exchanges the corresponding data**.

The critical subjects are:
- Thing/Object meaning;
- Relationship meaning;
- semantic identity/correspondence;
- canonical object identity and revisions;
- source identity;
- lifecycle/tombstone/alias state;
- derived World and Context projections.

#### 2. What does my CFA own?

**DERIVED / CURRENT:** CFA-01 owns the semantic meaning of World subjects, relationships, correspondence assertions, World projection semantics and Context semantics.

CFA-01 also owns the semantic requirements that Data must preserve for those meanings to remain intelligible.

CFA-01 does **not** own the canonical storage representation, revision mechanism, persistence engine or reconstruction implementation.

#### 3. What do I believe the peer owns?

**OBSERVED from CFA-02 artifacts; not peer-confirmed:** CFA-02 owns the durable data plane: canonical record representation, revisions, lineage, persistence, retention, recovery, reconstructability, data-bearing transformations and cross-layer identity mapping.

CFA-02 explicitly states that it does not own domain ontology/world meaning.

#### 4. What crosses the boundary?

At minimum:

- semantic object/type meaning → canonical data requirements;
- semantic identity/correspondence assertions ↔ canonical/source/revision identity mappings;
- relationship semantics ↔ relationship records;
- lifecycle meaning ↔ durable lifecycle representation;
- World projection basis ↔ data revision/lineage references;
- Context semantic selection ↔ durable candidate/source references;
- information-loss and reconstructability constraints;
- evidence/provenance references needed to explain how a World claim was derived.

#### 5. What must NOT cross?

- Storage schema should not silently become ontology authority.
- A canonical `(ns,id)` should not silently become semantic identity.
- A provider/source ID should not become local semantic identity.
- A revision ID should not become an ontology identity.
- A derived World/Context projection should not become a second canonical store.
- Data existence should not be mistaken for semantic authority or truth.
- A data transformation's completion should not be taken as proof that its semantic correspondence is correct.

#### 6. What inputs do I require?

From CFA-02:

- canonical object / relationship representation;
- durable identity and revision guarantees;
- source-identity mapping rules;
- reconstruction/export/import guarantees;
- lineage and provenance retention constraints;
- reconciliation outcomes and unknown/conflict states;
- data-layer falsifiers for identity continuity.

From the shared architecture:

- current destination World/Object definitions;
- projection and context requirements;
- evidence that identifies where a semantic claim originated.

#### 7. What outputs do I provide?

To CFA-02:

- semantic meaning/type requirements;
- relationship predicate semantics or unresolved predicate questions;
- semantic identity/correspondence distinctions;
- required lifecycle meanings;
- World projection reconstructability expectations;
- Context reference/basis semantics;
- falsifiers for semantic/data conflation.

#### 8. What invariants must hold?

1. **Canonical data is not semantic ownership.**
2. **Source identity ≠ canonical identity ≠ semantic identity.**
3. **Correspondence must be explicit; matching fields do not prove sameness.**
4. **Derived World/Context views must remain reconstructable from durable basis.**
5. **Conflicting relationship assertions remain representable; they are not silently overwritten.**
6. **Information loss at a transformation boundary is explicit.**
7. **Historical continuity remains inspectable across representation/storage changes.**

#### 9. What evidence supports my claim?

**OBSERVED / CURRENT:**
- `docs/destination/world-object-core/OBJECT-TAXONOMY.md` — World is non-canonical; Object/Thing and Relationship are canonical concepts; Source Identity and Projection are distinct roles.
- `docs/destination/world-object-core/WORLD-PROJECTION.md` — World is a derived user-facing model of accessible canonical reality and must be reconstructable from canonical state.
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/CORE-AGENT-SEED.md` — CFA-02 distinguishes semantic owner from canonical/data steward and explicitly declines domain ontology/world meaning.
- `.../DATA-MODEL-STEWARD/BOUNDARY-DESIGN.md` — CFA-02's boundary dimensions include meaning, representation, identity, lineage, revision, durability, authority, projection and reconciliation.

#### 10. What would falsify it?

Any of the following would materially falsify the current boundary:

- repository authority explicitly assigns World semantic meaning to CFA-02;
- a ratified data contract makes Data the semantic authority for World subjects independent of World/CFA-01;
- empirical reconstructability requires a data structure to carry semantic rules that cannot be owned or interpreted outside CFA-02;
- peer dialogue establishes that CFA-02's enduring responsibility includes semantic World ownership rather than data continuity;
- a real boundary case shows the split between semantic and data ownership is operationally unworkable and cannot be repaired with an explicit contract.

#### 11. What is unknown?

- exact canonical envelope for all World object classes;
- final merge/split identity rules across semantic identity, canonical IDs, source identities and evolution;
- exact durable representation of World projection basis;
- complete context-to-canonical lineage contract;
- which relationship predicates, if any, require a separately governed vocabulary.

#### 12. What appears duplicated or overlapping?

- “identity” appears in both CFA-01 and CFA-02 because its **semantic meaning** and **durable representation/mapping** are different dimensions.
- “relationship” can mean semantic assertion in CFA-01 versus relationship record mechanics in CFA-02.
- “projection” appears in World semantics and Data derived-data boundaries.
- “reconciliation” appears in World correspondence and Data continuity/reconciliation.

These are **overlaps of subject matter, not yet proven responsibility duplicates**.

#### 13. What question must the peer answer before this seam can be considered aligned?

> **For a contested correspondence or merge/split case, exactly which decisions are semantic World decisions, which are durable identity/data decisions, and what minimum handoff artifact lets each side act without silently becoming the other's authority?**

---

### Seam 2 — World ↔ Semantic Continuity

#### 1. What is the seam's subject?

The crossing between **what a World subject means** and **how that meaning remains continuous across self-knowledge, grounding, command interpretation, Intent/Plan, execution meaning, evidence/provenance and representation**.

#### 2. What does my CFA own?

**DERIVED / CURRENT:** CFA-01 owns the semantic meaning of World targets, World objects, relationships, Space, World projection and Context.

CFA-01 owns the World side of the language→world boundary: what entity/concept a grounded reference denotes in the World, subject to evidence and unresolved ambiguity.

#### 3. What do I believe the peer owns?

**OBSERVED from ratified CFA-03 identity:** CFA-03 owns semantic continuity across self-knowledge, grounding, command language, interpretation, canonical Intent/Plan meaning, execution meaning, evidence/provenance and representation.

CFA-03 explicitly states it does not own the canonical World/data model.

This is an important distinction: **CFA-01 owns World-domain meaning; CFA-03 owns continuity of meaning across transformations/planes.**

#### 4. What crosses the boundary?

- grounded references to World subjects;
- terminology/crosswalks that map language to World concepts;
- context references used in interpretation;
- semantic identity and provenance references that allow a command to be tied to the intended World subject;
- unresolved ambiguity/conflict states;
- semantic changes that affect Intent/Plan interpretation;
- representation mappings back to World concepts.

#### 5. What must NOT cross?

- A command grammar should not become the ontology of the World.
- CANON terminology should not silently become universal World ontology.
- A grounded mention should not automatically become a new World object or canonical fact.
- A representation's label should not redefine World meaning.
- CFA-01 should not decide what an Intent means beyond the World-domain meaning of referenced subjects.
- CFA-03 should not decide World ontology solely because a language representation names it.

#### 6. What inputs do I require?

From CFA-03:

- canonical terminology/crosswalk status;
- grounding semantics and target-resolution results;
- Intent/Plan references that identify intended World subjects;
- representation continuity rules;
- falsifiers for semantic divergence;
- explicit handling of ambiguity, stale grounding and unresolved targets.

From CFA-01:

- World subject definitions;
- addressability and correspondence semantics;
- World/context scope and identity rules;
- evidence for candidate references.

#### 7. What outputs do I provide?

To CFA-03:

- authoritative World-side meaning descriptions where CFA-01 is semantically accountable;
- World identity/address references;
- relationship/context semantics required to interpret a command target;
- ambiguity and correspondence status;
- World-side falsifiers for grounding errors.

#### 8. What invariants must hold?

1. **World meaning and cross-plane semantic continuity are complementary, not interchangeable.**
2. **Grounding identifies or proposes a World target; it does not by itself create authority or durable World truth.**
3. **A language token, command term or representation label is not automatically a canonical World type.**
4. **Canonical Intent semantics must remain distinguishable from World object meaning.**
5. **Unknown/ambiguous/conflicted target resolution remains explicit.**
6. **Evidence/provenance constrains semantic claims but does not make them authoritative merely by being cited.**

#### 9. What evidence supports my claim?

**OBSERVED / CURRENT:**
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/CORE-AGENT-IDENTITY.md` — CFA-03 is ratified as Semantic Continuity Steward and explicitly excludes the canonical World/data model.
- `.../SELF-KNOWLEDGE-COMMAND-COMPILER/STATE.md` — CFA-03's current work includes semantic continuity, grounding, terminology/CANON and identity/provenance mapping.
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/BOOTSTRAP-SEED.md` — CFA-01 scope includes World meaning, identity/correspondence and Context semantics while consuming grounding from CFA-03.

#### 10. What would falsify it?

- ratified architecture explicitly assigns World-domain ontology to CFA-03;
- real command cases show that the World cannot remain semantically coherent without CFA-03 owning the World model itself;
- owner alignment changes the CFA-03 mission to include canonical World meaning;
- a repeated boundary case demonstrates that “continuity across planes” and “World semantic ownership” are actually one indivisible responsibility and cannot be operationalized separately.

#### 11. What is unknown?

- exact contract for a grounded language reference becoming a World address;
- whether every addressable World concept participates in CANON or only selected terms;
- complete multi-step Intent/Plan target semantics;
- exact handling of semantic renames and target continuity across evolution;
- ownership of future visual write-back semantics at the World↔representation seam.

#### 12. What appears duplicated or overlapping?

- **Meaning** is central to both CFA-01 and CFA-03.
- **Identity** appears both as World semantic correspondence and semantic/provenance continuity across planes.
- **Terminology** may overlap where a term names a World concept.
- **Context** may be described by both the World domain and language/grounding layers.

The current evidence suggests the overlap is **cross-plane coupling**, not duplicate ownership, but this remains a seam requiring peer confirmation.

#### 13. What question must the peer answer before this seam can be considered aligned?

> **When a command term is grounded to a World subject, which side is authoritative for the subject's meaning, which side is authoritative for the command's intended meaning, and what exact handoff distinguishes the two without either side absorbing the other?**

---

### Seam 3 — World ↔ Authority

#### 1. What is the seam's subject?

The crossing between **what exists/is addressable in the World** and **what a principal/actor is permitted to do with or within that World under authority, scope, consent, delegation, duration, risk and revocation semantics**.

The highest-risk issue is whether “World” means total known local reality, accessible reality, or a principal-scoped projection.

#### 2. What does my CFA own?

**DERIVED / CURRENT:** CFA-01 owns:

- semantic World meaning;
- object/relationship identity and addressability meaning;
- Context semantic selection;
- World projection semantics;
- the World-side description of visibility/accessibility as a semantic property **when it can be defined without deciding authorization**.

CFA-01 does **not** decide whether an actor is authorized.

#### 3. What do I believe the peer owns?

**OBSERVED / PROPOSED from CFA-04 bootstrap:** CFA-04 owns authority semantics: principal/actor relationships at the authority boundary, consent, standing, delegation, scope/duration, revocation, invocation authority and governance of consequential change.

CFA-04's proposal explicitly says it does not own canonical identity storage, capability realization, execution or general evidence infrastructure.

#### 4. What crosses the boundary?

- principal / actor references needed to define a World view;
- authority-provided visibility/scope constraints;
- distinction between “exists” and “is accessible to this principal”;
- authority references attached to governed World/Context operations;
- Context selection constrained by policy;
- user/owner standing that limits what information may enter a context;
- evidence needed to explain that a view was filtered by scope rather than because a subject does not exist.

#### 5. What must NOT cross?

- World existence must not imply permission.
- A relationship must not imply authority.
- Context relevance must not imply authorization.
- A retrieved object must not be interpreted as permitted for every principal.
- Evidence must not grant authority merely because it proves a fact.
- CFA-01 must not decide whether an actor may mutate a World subject.
- CFA-04 should not redefine what a World object means simply because authorization needs to reference it.
- “Inaccessible” must not be collapsed into “does not exist.”

#### 6. What inputs do I require?

From CFA-04:

- principal/viewpoint semantics;
- authority scope and visibility constraints;
- authorization status and revocation semantics;
- consent/standing/delegation constraints where they affect World/Context exposure;
- explicit distinction between permission and visibility;
- authority references that can be carried into Context assembly without importing the authority decision into World ontology.

From CFA-01:

- World object/relationship semantics;
- World projection and Context concepts;
- object addressability;
- presence/absence semantics.

From D-443:

- principal-scoped context assembly behavior;
- no-cross-principal read behavior;
- cited source/revision constraints.

#### 7. What outputs do I provide?

To CFA-04:

- semantic description of the World target/effect domain;
- object/relationship references;
- World-side existence/presence semantics;
- Context candidate sets with explicit semantic basis;
- distinctions among present, not-observed, inaccessible, retired and unknown where supported;
- warnings where a World observation cannot support a permission conclusion.

#### 8. What invariants must hold?

1. **Existence ≠ permission.**
2. **Relationship ≠ permission.**
3. **Intent ≠ permission.**
4. **Evidence ≠ permission.**
5. **Capability ≠ permission.**
6. **Inaccessibility must not be represented as non-existence.**
7. **A principal-scoped projection must retain enough basis to explain why a subject is visible, omitted or unresolved.**
8. **World projection must never grant authority as a side effect.**
9. **D-443 principal scoping is enforcement/substrate behavior; the semantic definition of why a World item belongs or does not belong in a Context remains separate.**

#### 9. What evidence supports my claim?

**OBSERVED / CURRENT:**
- `docs/destination/world-object-core/WORLD-PROJECTION.md` — World is described as a derived user-facing model of accessible canonical reality, with scope/authority participating in projection; Workspace is not World authority.
- `omega-baseline/omega-final/docs/decisions/D-443-context-substrate.md` — ratified Context substrate includes principal-scoped assemblies, cited revisions, deterministic digesting and fail-closed behavior.
- `omega-baseline/omega-final/plugins/vivim-run/src/context.ts` — the implementation scopes context reads by principal and refuses unresolved/tampered/unlabelled/unmetered assemblies.
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/BOOTSTRAP-DESIGN-PROPOSAL.md` — CFA-04 defines authority as separate from identity, evidence, capability, intent, execution and implementation; its current scope includes authority-facing scope and principal semantics.
- CFA-01 bootstrap/gap audit identifies principal/viewpoint scope as an unresolved World boundary.

#### 10. What would falsify it?

- a ratified authority contract explicitly makes CFA-04 the semantic owner of World subject meaning;
- a concrete case shows “World existence” cannot be defined independently of authorization semantics;
- owner direction establishes that World is intrinsically principal-relative rather than a broader reality model;
- empirical runtime behavior demonstrates that principal filtering is inseparable from the ontology and cannot be represented as a projection/view constraint;
- a peer-authoritative contract establishes a different non-overlapping interpretation of accessibility.

#### 11. What is unknown?

- **Critical:** Is World itself principal-scoped, or is principal scope applied only when projecting/querying/contextualizing World?
- what “accessible canonical reality” means when a subject exists locally but is outside a principal's authority;
- whether visibility is an authority concept, a World presence state, a projection property, or a composed contract;
- exact relationship between World scope, Context scope and D-443 principal scope;
- whether shared/cross-provider data needs a World-level access semantic distinct from authority evaluation.

#### 12. What appears duplicated or overlapping?

- **Scope** is present in both World projection/context semantics and Authority authorization semantics.
- **Principal** is referenced by both CFA-01 and CFA-04, but likely for different dimensions: World view versus authority.
- **Visibility/accessibility** can sound ontological, data, representation or authorization-related.
- **Context filtering** can be interpreted as relevance, privacy, or authority filtering.

This is the seam with the strongest current risk of terminology collision.

#### 13. What question must the peer answer before this seam can be considered aligned?

> **Does CFA-04 define the semantic meaning of principal/authority scope itself, or only whether a principal is authorized under that scope; and should CFA-01 model “accessible World” as an intrinsically principal-scoped World or as a projection of a broader World?**

## Handoff Proposals

A handoff transfers information or work across the seam; it does **not** transfer authority.

| Handoff | From | To | Required payload | Expected response |
|---|---|---|---|---|
| H-01 World/Data Object Meaning | CFA-01 | CFA-02 | object kind, semantic meaning, relationship role, semantic identity/correspondence constraints, lifecycle meaning, falsifiers | durable-record shape, identity/revision implications, reconstruction constraints |
| H-02 Data/Identity Case | CFA-02 | CFA-01 | canonical/source/revision identities, lineage, reconciliation status, information loss, conflicts | semantic correspondence interpretation and World projection implications |
| H-03 Grounded World Target | CFA-03 | CFA-01 | grounded term/reference, target candidates, terminology state, ambiguity/conflict, provenance | World-side semantic characterization, addressability and correspondence status |
| H-04 World Target Meaning | CFA-01 | CFA-03 | World subject ref, meaning, relationship neighborhood, scope, unresolved distinctions | interpretation/cross-plane continuity result and downstream semantic impact |
| H-05 World Scope Question | CFA-04 | CFA-01 | principal, scope/visibility policy, authority status, revocation/expiry state, expected view constraints | World-side presence/accessibility interpretation without permission inference |
| H-06 World View Basis | CFA-01 | CFA-04 | target refs, World meaning, relevant relationships, context candidate set, unknown/inaccessible distinctions | authority interpretation of allowed scope and any required policy/consent gate |
| H-07 Context Semantic Contract | CFA-01 | D-443/runtime owner | purpose, selection rationale, semantic scope, principal, source refs, inclusion/exclusion reasons | deterministic assembly behavior and refusal/result mapping; no semantic policy invention |
| H-08 Boundary Challenge | Either peer | Steward / router | competing ownership claims, evidence, falsifier, impacted responsibilities | independent reconciliation / challenge record; no unilateral reassignment |

### Minimum handoff shape proposed

A World-facing handoff should carry, at minimum:

`subjectRef(s) + meaning + scope + identity/correspondence state + epistemic state + evidenceRefs + sourceRefs + freshness + unresolvedQuestions + requestedResponse`

It should **not** require the peer to import CFA-01 internal Case/Concept/SessionState machinery.

## Boundary Hazards

### Responsibility overlap

- **World ↔ Data:** “identity”, “relationship”, “projection” and “reconciliation” appear in both vocabularies.
- **World ↔ Semantic:** “meaning”, “identity”, “grounding”, “context” and “terminology” appear in both vocabularies.
- **World ↔ Authority:** “scope”, “principal”, “visibility”, “accessibility”, “context” and “permission” are adjacent and easily conflated.

### Missing responsibility

**UNKNOWN / CURRENT:** There is no fully ratified explicit contract yet for:
- observation → World presence classification;
- identity merge/split continuity;
- principal-scoped World semantics;
- explainable Context relevance;
- temporal interaction among World state, revision, Work state and external observation.

The bootstrap gap audit records these as open cases rather than evidence that a new permanent CFA is needed.

### Authority confusion

Highest-risk confusion:

> “This object is in the World/context I can see, therefore I may act on it.”

The current boundary rejects that inference. World existence, Context inclusion, evidence and relationship do not create authorization.

### Evidence / representation confusion

- provider/browser representation can be evidence about external state without becoming World truth;
- a parser output can be a derivation without becoming authority;
- a projection can be useful without becoming canonical;
- a surface can represent a World subject without owning its meaning.

### Implementation leakage

- D-443's deterministic context assembly is real implementation evidence, but its existence must not dictate the entire semantic definition of Context.
- Data table/record shapes must not silently become the World ontology.
- `vivim.mind` is a read-only derivation lens, not proof that its current view is the canonical World.
- selectors, storage paths and UI references cannot become World semantic identity.

### Stale assumptions

- CFA-01 bootstrap artifacts are dated 2026-09-25; they remain the current basis only because the inspected `main` still contains them and no later owner alignment was found.
- Peer CFA-02 remains provisional.
- Peer CFA-04 remains proposed / owner-dialogue-required.
- CFA-03 is ratified and therefore has a different identity status from CFA-01/02/04.
- The World scope question is especially vulnerable to stale assumptions as Authority evolves.

### Terminology collisions

Terms needing explicit crosswalk discipline:

`identity`, `scope`, `principal`, `visibility`, `accessible`, `context`, `relationship`, `projection`, `grounding`, `authority`, `source`, `evidence`, `canonical`, `representation`.

### Likely future drift

- a new runtime projection becomes treated as canonical;
- a new provider integration reuses external IDs as local identity;
- a search system silently becomes relevance/authority;
- principal filtering is added at one layer while another layer assumes global World visibility;
- Context selection logic grows in a runtime component without a semantic contract;
- evolution renames or splits World concepts without preserving correspondence history;
- peer agents infer ownership from implementation location rather than responsibility.

## Unresolved Questions for Peers

### CFA-02 — Data / Identity / Persistence

1. In merge/split/correspondence cases, what exact decisions does CFA-02 consider data-continuity decisions versus semantic identity decisions?
2. What durable identity guarantees does CFA-02 require from World semantics before a correspondence assertion can be persisted?
3. What is the minimum canonical-data payload needed to reconstruct a World object's semantic continuity after storage/implementation change?
4. How should a data-layer reconciliation conflict be handed back to CFA-01 without implying that the data layer resolved World meaning?

### CFA-03 — Semantic Continuity

1. When a language term grounds to a World subject, where does authoritative World meaning end and command/Intent meaning begin?
2. What is the minimum grounded-target handoff CFA-03 expects from CFA-01?
3. Should CANON entries that name World concepts be cross-owned, World-owned with terminology assistance, or handled another way?
4. How should stale/ambiguous grounding be represented so that CFA-01 does not mistake it for a World identity decision?

### CFA-04 — Authority / Governance

1. Is World intrinsically principal-scoped, or is principal scope applied only when projecting/querying/contextualizing World?
2. Who owns the semantic meaning of “accessible” and “visible” when a thing exists but the current principal is not permitted to act on or inspect it?
3. What authority reference, if any, must travel with a World/Context view to explain why an item was filtered?
4. Does CFA-04 own the semantic definition of principal/authority scope, with CFA-01 only applying that scope to World projections, or is there a shared contract with distinct dimensions?
5. How should revocation/expiry affect already-derived World/Context projections?

### Shared routing question

> **For each seam, can the peer state one sentence describing its semantic responsibility, one sentence describing what it explicitly does not own, and one minimum handoff artifact it expects from CFA-01?**

## Non-Authority Statement

CFA-01 does **not** have authority to decide for another CFA:

- canonical data schema, storage, identity-persistence mechanics or reconstruction implementation;
- command language, Intent/Plan semantics or semantic continuity owned by CFA-03;
- authorization, consent, delegation, standing, risk policy, revocation or permission decisions owned by CFA-04;
- Work/execution semantics or lifecycle;
- provider/browser/account/session realization;
- composition/Forge mechanics;
- surface/interaction/UI semantics or implementation;
- evolution/migration/compatibility mechanics;
- K0/runtime constitutional law or enforcement;
- Architecture Steward graph authority or cross-CFA boundary reconciliation.

CFA-01 may **challenge, characterize, request evidence, propose a handoff, and state World-side semantic implications**. It may not convert those activities into unilateral peer ownership decisions.

In particular, CFA-01 does not decide the open **World ↔ Authority** question about whether World is intrinsically principal-scoped. That remains an explicit peer/human-owner routing question.

## Evidence Index

| Source | State / freshness | Why it supports this declaration |
|---|---|---|
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/ROUND-1-BOUNDARY-BOOTSTRAP.md` | OBSERVED / CURRENT | Defines the Round 1 task, declaration structure, epistemic states, and non-resolution rule |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/ROUND-1-CFA-MATRIX.md` | OBSERVED / CURRENT | Assigns CFA-01 exactly three priority seams |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/BOUNDARY-PROTOCOL.md` | OBSERVED / CURRENT | Defines multi-dimensional ownership, handoffs, challenges and evidence discipline |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/README.md` | OBSERVED / CURRENT | Confirms provisional CFA-01 status and current working posture |
| `.../WORLD-ONTOLOGY-CONTEXT/BOOTSTRAP-SEED.md` | OBSERVED / CURRENT | Core CFA-01 responsibility hypothesis and explicit non-scope |
| `.../WORLD-ONTOLOGY-CONTEXT/SELF-DESIGN-PROPOSAL.md` | OBSERVED / CURRENT | Candidate identity, scope, interfaces and boundary hypotheses |
| `.../WORLD-ONTOLOGY-CONTEXT/STATE.md` | OBSERVED / CURRENT | Bootstrap state, current decisions, unresolved gaps and owner-alignment status |
| `.../WORLD-ONTOLOGY-CONTEXT/WORLD-OPERATIONAL-CONTEXT.json` | OBSERVED / CURRENT | Compact mission, stable distinctions, peer inputs, invariants and re-ground triggers |
| `.../WORLD-ONTOLOGY-CONTEXT/WORLD-BOOTSTRAP-GAP-AUDIT.json` | OBSERVED / CURRENT | Identifies identity, observation, context, principal scope and temporal concerns as unresolved cases |
| `.../WORLD-ONTOLOGY-CONTEXT/PEER-RELATIONSHIP-DISTANCE-MAP.json` | OBSERVED / CURRENT | CFA-01 perspective on peer proximity, overlap and expected peer inputs; peer-need fields remain heuristic until confirmed |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/README.md` | OBSERVED / CURRENT | Defines Steward as documentation/coherence owner, not semantic authority |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CORE-FUNCTION-AREA-REGISTER.md` | OBSERVED / CURRENT | Defines the ten provisional CFA responsibilities and evolution rule |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/CORE-AGENT-SEED.md` | OBSERVED / CURRENT | CFA-02's current scope, explicit non-ownership of World meaning, and data continuity responsibilities |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/BOUNDARY-DESIGN.md` | OBSERVED / CURRENT | Data corridor dimensions, identity ladder, continuity and peer-seam model |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/CORE-AGENT-IDENTITY.md` | OBSERVED / CURRENT | Ratified CFA-03 responsibility and explicit non-ownership of canonical World/data model |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/STATE.md` | OBSERVED / CURRENT | CFA-03 ratification and current semantic continuity scope |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/BOOTSTRAP-DESIGN-PROPOSAL.md` | OBSERVED / CURRENT | Current provisional CFA-04 authority boundary and explicit non-ownership of identity/data/world mechanics |
| `docs/destination/world-object-core/OBJECT-TAXONOMY.md` | DERIVED / CURRENT | Distinguishes World, Object, Relationship, Source Identity and Projection |
| `docs/destination/world-object-core/WORLD-PROJECTION.md` | DERIVED / CURRENT | World/projection/scope/workspace distinctions; reconstructability requirement |
| `docs/destination/DATA-MEMORY-CONTEXT-RECONCILIATION.md` | DERIVED / CURRENT | Source→canonical→relationship→memory→context→work→evidence path and Context/Memory distinctions |
| `omega-baseline/omega-final/docs/decisions/D-443-context-substrate.md` | RATIFIED evidence / CURRENT | Deterministic Context substrate, principal scoping, citations, digest and fail-closed rules |
| `omega-baseline/omega-final/plugins/vivim-run/src/context.ts` | IMPLEMENTATION evidence / CURRENT | Actual D-443 context assembly/refusal/principal behavior |
| `omega-baseline/omega-final/docs/decisions/D-455-adaptation-governance.md` | RATIFIED evidence / CURRENT | Demonstrates that authority/governance of consequential change is a distinct contract from implementation/evolution mechanics |

### Evidence limitations

- CFA-02 is still provisional; its statements are evidence of its current claim, not ratified peer agreement.
- CFA-04's bootstrap is proposed and explicitly requires owner dialogue; its boundary statements are likewise not final.
- The current repository corpus still lacks a fully executable shared boundary contract for identity merge/split, observation reconciliation, Context relevance, and principal-scoped World semantics.
- No claim in this declaration is promoted to Ω law, permanent CFA identity or shared boundary merely by appearing here.

## Declaration status

**Current state: PROVISIONAL / ACTIVE / SELF-DECLARED**

This declaration is CFA-01's boundary claim for Round 1. It is intentionally incomplete where evidence or peer answers are incomplete.

The required next step is not unilateral reconciliation. It is peer comparison by the Architecture Steward, followed by the smallest set of routed questions/cases necessary to turn material disagreements into explicit BoundaryChallenges or aligned boundary records.

