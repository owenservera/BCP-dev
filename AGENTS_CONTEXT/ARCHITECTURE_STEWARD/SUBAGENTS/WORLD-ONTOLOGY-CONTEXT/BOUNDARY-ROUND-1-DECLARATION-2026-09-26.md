# CFA-01 — Boundary Round 1 Declaration

> Date: 2026-09-26
> CFA: CFA-01 — World / Ontology / Context
> Current working identity: **World / Ontology / Context Steward**
> Identity status: **PROVISIONAL / owner alignment not yet formally recorded**
> Boundary status: **PROPOSED — this is CFA-01's current claim, not a shared architectural boundary**
> Basis: current repository main plus current CFA-01 and peer artifacts read for Round 1

## Identity

### CFA ID

**CFA-01 — World / Ontology / Context**

### Current working / rationalized name

**World / Ontology / Context Steward**

**Status:** PROVISIONAL. No permanent CFA-01 Core Agent Identity is ratified in the current state. The current bootstrap seed explicitly says the seed is not a ratified permanent identity.

### Responsibility that must remain continuously coherent

The responsibility that must remain coherent is:

> **The semantic meaning of the user's World — including Objects/Things, relationships, semantic identity/correspondence, Space, addressability/query meaning, World projection semantics, and Context semantics — across the boundaries where those meanings are grounded, persisted, governed, executed, realized, presented, and evolved.**

The continuity requirement is semantic rather than mechanical. CFA-01 must be able to say what a World subject means and how a bounded context relates to that meaning without silently becoming the owner of storage, authorization, execution, provider realization, surface presentation, runtime substrate, or another CFA's semantic continuity responsibilities.

### Explicit non-ownership

CFA-01 does **not** own:

- canonical persistence/storage mechanics or durable record implementation;
- general data continuity/reconstruction machinery;
- command grammar/interpreter or canonical Intent/Plan continuity;
- Ω law, authorization decisions, consent decisions, delegation validity, or risk-policy decisions;
- Work lifecycle, scheduling, execution, recovery, or external realization;
- provider/browser/account/session realization mechanics;
- general evidence/provenance infrastructure;
- UI/surface implementation or layout state;
- composition/plugin/Forge mechanics;
- architecture-wide graph stewardship;
- runtime constitutional enforcement;
- a second global ontology/graph/database.

**Evidence status:** OBSERVED for the explicit non-scope in the current CFA-01 seed/proposal and peer foundations. Freshness: CURRENT.

---

## Responsibility

CFA-01 currently treats its responsibility as a semantic contract rather than a universal data model.

### Current semantic center

~~~
CANONICAL OBJECTS + RELATIONSHIP RECORDS
                  |
                  v
           WORLD SEMANTICS
                  |
        +---------+---------+
        |         |         |
      SPACE     ADDRESS    QUERY
        |         |         |
        +---------+---------+
                  |
          CURRENT CONTEXT
                  |
                  v
          CONTEXT ASSEMBLY
              (D-443)
                  |
                  v
             INTENT / WORK
~~~

The current CFA-01 state explicitly treats World as a coherent derived view over canonical state, Context as purpose-scoped selection of World information, and D-443 as an existing context assembly substrate.

### Responsibility classification

| Responsibility | Position | Epistemic status | Freshness | Current claim |
|---|---|---|---|---|
| World / Object / Thing semantic meaning | **OWNS** | DERIVED | CURRENT | CFA-01 is the semantic steward of what a World subject means. |
| Relationship meaning / topology | **OWNS** | DERIVED | CURRENT | CFA-01 characterizes domain relationship semantics; structural links are not automatically semantic relationships. |
| Semantic identity / correspondence meaning | **OWNS** | DERIVED | CURRENT | CFA-01 defines the semantic question of sameness/correspondence while CFA-02 owns durable identity/data mechanics. |
| Space semantics | **OWNS** | DERIVED | CURRENT | CFA-01 owns the semantic distinction of Space; Workspace/layout remains outside this responsibility. |
| Addressability / query meaning | **OWNS** | DERIVED | CURRENT | CFA-01 owns what it means to refer to/query a World subject; implementation of indexing/retrieval may live elsewhere. |
| World projection semantics | **OWNS** | DERIVED | CURRENT | CFA-01 defines what a projection means relative to World semantics; it does not own projection implementation. |
| Context semantic contract | **OWNS** | DERIVED | CURRENT | CFA-01 defines what Context means and its semantic boundary; D-443 assembly mechanics remain external. |
| Context assembly mechanics | **CONTRIBUTES / CONSULTS** | OBSERVED | CURRENT | D-443 already exists; CFA-01 should provide semantic inclusion/boundary requirements rather than recreate assembly. |
| Durable object/relationship records | **CONSULTS** | OBSERVED | CURRENT | CFA-02 stewards durable data representation and continuity. |
| Cross-plane terminology / semantic continuity | **CONTRIBUTES / CONSULTS** | OBSERVED | CURRENT | CFA-03 owns continuity across grounding/command/Intent/Plan/execution meaning/representation; CFA-01 supplies World meaning. |
| Authority-facing World constraints | **CONTRIBUTES / CONSULTS** | DERIVED | CURRENT | CFA-01 describes targets, actors, relationships and relevant World/context facts; CFA-04 decides authorization semantics. |
| Evidence / provenance constraints | **CONSULTS** | DERIVED | CURRENT | CFA-01 consumes evidence/provenance constraints but does not own the general evidence system. |
| Canonical ontology implementation / universal ontology engine | **OUT-OF-SCOPE** | PROPOSED | CURRENT | No evidence justifies creating such a mechanism. |
| Architecture Graph stewardship | **OUT-OF-SCOPE** | OBSERVED | CURRENT | Architecture Steward owns the shared architecture graph; CFA-01 supplies semantic findings/evidence. |

### Standing semantic invariants

These are CFA-01 boundary claims, not Ω law:

- World meaning must remain distinct from storage representation.
- World meaning must remain distinct from authority.
- World meaning must remain distinct from execution.
- World meaning must remain distinct from provider realization.
- World meaning must remain distinct from presentation.
- Evidence constrains a claim but does not itself become ontology or authority.
- Source identity does not silently replace canonical identity.
- Correspondence is not equivalence merely because fields match.
- Context is a bounded semantic selection, not a second database.
- Context is not Memory, Attention, Intent, Work, or a prompt.
- Unknown, stale, ambiguous, and conflicted are valid semantic states.

**Status:** DERIVED. **Freshness:** CURRENT.

---

# Assigned Seams

## Seam 1 — CFA-01 World ↔ CFA-02 Data / Identity / Persistence

### 1. What is the seam's subject?

The subject is the boundary between **semantic World meaning** and **durable data representation / identity continuity**.

The concrete concern is:

> How can a canonical object, relationship, identity/correspondence claim, revision, or reconciliation remain faithfully interpretable across storage and data transformations without storage mechanics becoming the definition of what the World subject means?

### 2. What does my CFA own?

CFA-01 claims ownership of:

- semantic meaning of the World subject;
- semantic meaning of World relationships;
- semantic identity/correspondence as a semantic question;
- which distinctions matter for interpreting the World;
- semantic requirements for preserving identity/meaning across a data boundary.

**Status:** DERIVED from CFA-01 scope plus the CFA-02 non-ownership statement. **Freshness:** CURRENT.

### 3. What do I believe the peer owns?

CFA-02 appears to own/steward:

- durable record representation;
- record/revision identity mechanics;
- persistence/reconstruction;
- data-bearing transformations;
- lineage and continuity mechanics;
- canonical data boundary contracts;
- data reconciliation mechanics insofar as they preserve durable continuity.

This is a **peer claim**, not a CFA-01 decision.

**Evidence status:** OBSERVED / DERIVED. **Freshness:** CURRENT. CFA-02 remains PROVISIONAL / FOUNDATION-SEEDED.

### 4. What crosses the boundary?

- canonical object/relationship references;
- semantic identity requirements;
- correspondence assertions and their status;
- data/revision metadata needed to interpret semantic continuity;
- provenance/lineage references;
- semantic impact of merges, splits, replacements, migrations and lossy transformations;
- explicit distinction between semantic identity and record/revision/source identity;
- World-facing interpretation of data reconciliation outcomes.

### 5. What must NOT cross?

- storage schema becoming the World ontology;
- canonical record IDs being treated as the sole semantic identity;
- persistence mechanics silently deciding domain meaning;
- a data-layer reconciliation outcome being treated as semantic truth without the semantic interpretation remaining explicit;
- derived projections, indexes, caches or representations becoming canonical because they are convenient.

### 6. What inputs do I require?

- canonical object and relationship records;
- record/revision identity and lineage behavior;
- transformation history;
- source identity/correspondence information;
- durability/reconstruction guarantees;
- known information loss;
- reconciliation outcomes and unresolved ambiguities.

### 7. What outputs do I provide?

- semantic interpretation of what the data represents;
- semantic identity/correspondence requirements;
- relationship meaning;
- semantic continuity constraints that Data must preserve;
- classifications of merge/split/replacement/ambiguity as World-semantic phenomena;
- World-side meaning of reconciliation states.

### 8. What invariants must hold?

1. **Meaning ≠ storage representation.**
2. **Semantic identity ≠ record identity.**
3. **Source/provider identity ≠ canonical identity.**
4. Data transformations must preserve enough lineage to explain semantic continuity where continuity is claimed.
5. Lossy or ambiguous transformations must remain explicitly lossy or ambiguous.
6. A successful data pipeline must not imply semantic equivalence automatically.
7. A projection/index/cache must remain regenerable unless explicitly promoted by an authoritative contract.

### 9. What evidence supports my claim?

- CFA-01 BOOTSTRAP-SEED.md: World semantic scope and explicit CFA-02 non-scope.
- CFA-01 STATE.md: World derived/coherent view, identity layers, relationship semantics.
- CFA-01 SELF-DESIGN-PROPOSAL.md: explicit interface between World meaning/correspondence and canonical records/revisions/storage.
- CFA-02 CORE-AGENT-SEED.md: CFA-02 ownership of data continuity, canonical persistence and cross-boundary identity; explicit non-ownership of domain ontology/world meaning.
- CFA-02 BOUNDARY-DESIGN.md: multidimensional boundary, identity ladder, transformation contract and explicit question of what data means.
- Architecture Steward CORE-FUNCTION-AREA-REGISTER.md: CFA-01/CFA-02 separation.

### 10. What would falsify it?

The current boundary claim would be weakened or falsified by evidence showing that:

- CFA-02 is the ratified semantic owner of World/Object meaning itself;
- canonical World meaning is intentionally defined by a durable data schema rather than by a separate semantic contract;
- a World subject cannot be interpreted independently of its persistence representation;
- the product's governing model explicitly assigns semantic ontology authority to Data.

### 11. What is unknown?

- Exact final ownership of **identity reconciliation** when semantic correspondence, durable record identity, merge/split, and evolutionary change all participate.
- Whether some canonical data contracts are themselves semantic enough to require joint ownership.
- Exact division between semantic reconciliation and data reconciliation.
- Exact temporal semantics for identity continuity across merge/split and replacement.

### 12. What appears duplicated or overlapping?

Potential overlap exists around:

- identity — semantic identity, canonical record identity, revision identity, source identity and evidence identity;
- reconciliation — World-side semantic correspondence versus Data-side durable reconciliation;
- canonical — canonical meaning versus canonical record;
- relationship definitions where data needs enough structure to persist them.

This is **KNOWN OVERLAP**, not an adjudicated conflict.

### 13. What question must the peer answer before this seam can be considered aligned?

> **Where does CFA-02 draw the exact line between durable identity/correspondence mechanics and semantic determination of what constitutes the same World subject, especially for merge, split, replacement, and temporal identity changes?**

---

## Seam 2 — CFA-01 World ↔ CFA-03 Semantic Continuity

### 1. What is the seam's subject?

The subject is the boundary between **World semantic meaning** and **continuity of meaning across self-knowledge, grounding, command interpretation, Intent/Plan, execution meaning, evidence, and representation**.

A particularly sensitive sub-seam is **Address**: a World subject must be semantically addressable, while commands and other representations must remain grounded to that subject without changing its meaning.

### 2. What does my CFA own?

CFA-01 claims ownership of:

- meaning of World targets/subjects;
- World semantic identity and relationships;
- World-facing Address semantics;
- semantic meaning of Context and World projection;
- semantic requirements for grounding a command to a World subject.

**Status:** DERIVED. **Freshness:** CURRENT.

### 3. What do I believe the peer owns?

CFA-03 is ratified as **Semantic Continuity Steward** and appears to own:

- continuity of meaning across self-knowledge → grounding → command language → interpretation → canonical Intent/Plan → execution meaning → evidence/provenance → representation;
- bounded terminology/CANON for that continuity seam;
- cross-plane semantic crosswalks;
- challenging semantic divergence and representation overclaim.

This is a **peer claim supported by ratified identity**.

### 4. What crosses the boundary?

- semantic references to World subjects;
- grounding mappings from language/command representations to World targets;
- World Address and query results consumed by command/Intent flows;
- semantic context supplied for interpretation;
- terminology/crosswalk references;
- provenance and epistemic status of grounding;
- feedback when an interpretation does not correspond cleanly to World meaning.

### 5. What must NOT cross?

- command grammar becoming the definition of World ontology;
- CANON terminology becoming a second World ontology authority;
- a natural-language interpretation becoming canonical World meaning merely because it parsed;
- Intent/Plan semantics being redefined as World semantics;
- representation continuity being mistaken for World identity;
- grounding being treated as authorization.

### 6. What inputs do I require?

- grounding/interpretation requirements;
- semantic terminology/crosswalks owned by CFA-03;
- canonical Intent/Plan reference semantics;
- examples of address resolution from commands;
- representation and interpretation failures;
- semantic continuity falsifiers.

### 7. What outputs do I provide?

- stable semantic meaning of World targets;
- World object/relationship/address references;
- context contracts grounded in World semantics;
- clarification when a representation fails to correspond to a World subject;
- World-side interpretation of ambiguity, conflict, or unknown target identity.

### 8. What invariants must hold?

1. **One World meaning, many representations.**
2. A command representation cannot redefine the World subject it intends to address.
3. Grounding is not authorization.
4. Semantic continuity must preserve the distinction between interpretation and canonical World meaning.
5. Addressing a subject must not require coupling semantic identity to a UI selector, storage path, or language token.
6. Unknown/ambiguous grounding remains explicit.

### 9. What evidence supports my claim?

- CFA-03 CORE-AGENT-IDENTITY.md: ratified responsibility for semantic continuity across grounding/command/Intent/Plan/execution/evidence/representation; explicit non-ownership of canonical World/Data.
- CFA-03 STATE.md: current grounding boundary remains partly unresolved; world grounding is a standing concern.
- CFA-03 CANON-DICTIONARY.md: bounded terminology/CANON role.
- CFA-01 BOOTSTRAP-SEED.md and STATE.md: World target meaning, Addressability, Context semantics, and DEC-010 that CFA-03 owns bounded terminology/semantic continuity.
- CFA-01 SELF-DESIGN-PROPOSAL.md: explicit World ↔ Semantic Continuity interface.
- Architecture Steward CORE-FUNCTION-AREA-REGISTER.md: CFA-03 ratified separately.

### 10. What would falsify it?

The current boundary would be falsified or materially changed if evidence showed that:

- CFA-03 is the authoritative semantic owner of World/Object meaning itself;
- World subject identity is defined primarily by language/grounding rather than by World semantics;
- Address is exclusively a command-language construct with no World-facing semantic responsibility;
- CFA-01 is expected to own the full command/Intent semantic chain.

### 11. What is unknown?

- Exact division of **Address** semantics between World and Semantic Continuity.
- Whether semantic identity is sufficiently distinct from semantic continuity to avoid duplicate ownership.
- Where grounding ends and World correspondence begins for ambiguous natural-language references.
- How visual/direct-manipulation representations participate in the same continuity seam.

### 12. What appears duplicated or overlapping?

Potential overlap exists around:

- semantic continuity versus World semantic coherence;
- Address versus grounding target resolution;
- terminology/crosswalks that describe World concepts;
- representation semantics;
- evidence attached to grounding claims versus World observations.

This is currently **BOUNDARY PRESSURE / NOT RESOLVED** rather than a declared conflict.

### 13. What question must the peer answer before this seam can be considered aligned?

> **What exact portion of Address/grounding does CFA-03 consider its semantic continuity responsibility, and where does it explicitly defer to CFA-01 as the owner of the meaning and identity of the World target being grounded?**

---

## Seam 3 — CFA-01 World ↔ CFA-04 Authority / Governance

### 1. What is the seam's subject?

The subject is the boundary between **describing the World — actors, objects, relationships, effects, scope-relevant facts and context — and deciding whether a consequential action is authorized**.

### 2. What does my CFA own?

CFA-01 claims ownership of:

- semantic meaning of actors/principals/delegates as World subjects where they are part of the World model;
- semantic meaning of objects and relationships that an authority decision refers to;
- World-side descriptions of requested effects/targets;
- contextual World facts relevant to an authority check;
- semantic distinction between a World relationship and the authorization decision that may be evaluated against it.

**Status:** DERIVED. **Freshness:** CURRENT.

### 3. What do I believe the peer owns?

CFA-04's current proposal assigns it:

- authority-basis vocabulary;
- principal/actor/deputy relationships at the authority boundary;
- consent;
- standing approvals;
- delegation/attenuation;
- scope/duration/revocation semantics as authority constraints;
- invocation authority binding;
- governance of consequential changes;
- authority/risk policy boundaries;
- authority decision records and invariants.

CFA-04 remains **PROPOSED — owner dialogue required**, so these are peer hypotheses, not ratified shared facts.

### 4. What crosses the boundary?

- references to World subjects affected by an authorization decision;
- actor/principal identity references;
- relationships that may be relevant to authority evaluation;
- scope/visibility context;
- requested effect descriptions;
- authority basis references;
- context sufficient to understand the governed action;
- evidence references relevant to the authority decision, without making evidence itself authority.

### 5. What must NOT cross?

- existence of a World object implying permission to act on it;
- relationship existence implying authorization;
- Intent implying authorization;
- capability possession implying authorization;
- evidence/confidence implying authorization;
- Context inclusion implying authorization;
- a surface representation implying consent or approval;
- World semantics deciding whether an effect is legally/operationally permitted.

### 6. What inputs do I require?

- explicit authority constraints and terminology;
- current authority scope/delegation/consent status when a World-aware interpretation depends on them;
- principal/actor references and the basis under which Authority resolves them;
- authority-facing effect semantics;
- revocation/expiry state where it changes interpretation.

### 7. What outputs do I provide?

- stable references and semantic descriptions of governed World targets;
- World relationships relevant to authority analysis;
- semantic context needed to interpret the effect;
- warnings when a representation or relationship is being misread as authorization;
- World-side conflict/unknown state that Authority must not silently collapse.

### 8. What invariants must hold?

1. **World fact ≠ authority decision.**
2. **Intent ≠ permission.**
3. **Capability ≠ permission.**
4. **Evidence ≠ permission.**
5. **Identity ≠ authorization.**
6. **Relationship ≠ authorization unless CFA-04's authority semantics explicitly say so.**
7. Authority constraints may filter or govern access to World information without changing the underlying semantic meaning.
8. A World projection must never silently claim that an action is authorized.

### 9. What evidence supports my claim?

- CFA-04 BOOTSTRAP-DESIGN-PROPOSAL.md: explicit authority scope and non-scope; authority separated from capability, identity, intent, evidence, execution, and mechanical enforcement.
- CFA-01 STATE.md: explicit boundary entry “describing actors/relationships vs authorizing effects.”
- CFA-01 BOOTSTRAP-SEED.md: Authority owns law/consent/delegation/authorization constraints; CFA-01 owns World semantic meaning.
- CFA-01 WORLD-LENS-ONE-TOOL-DESIGN.md: Authorization routed to CFA-04 / Authority.
- CFA-01 WORLD-PEER-DISTANCE-MATRIX.json: explicit boundary-risk statement that CFA-04 owns authorization semantics and CFA-01 must never infer permission.
- Architecture Steward CORE-FUNCTION-AREA-REGISTER.md: CFA-04 is a distinct enduring responsibility.

### 10. What would falsify it?

The boundary would be materially falsified if evidence established that:

- World relationship semantics themselves encode authorization as their canonical meaning;
- CFA-01 owns consent/delegation/authorization semantics rather than only the World facts referenced by them;
- authority decisions are defined as ordinary World facts rather than a distinct governed dimension;
- another ratified authority says that World projections may directly decide permission.

### 11. What is unknown?

- Exact boundary between **principal identity as a World object** and principal identity as an authority-semantic subject.
- Whether some relationship types are intrinsically authority-bearing or merely evidence consumed by Authority.
- Exact representation of visibility/scope when a restricted World projection is produced.
- How World Context should carry authority constraints without making Context authoritative.
- Whether risk-related meaning is split cleanly enough between CFA-04 and CFA-06.

### 12. What appears duplicated or overlapping?

Potential overlap exists around:

- principal / actor / deputy identity;
- scope;
- delegation relationships;
- authority-relevant relationships versus ordinary World relationships;
- visibility versus authorization;
- evidence supporting an authority claim.

This is **KNOWN BOUNDARY PRESSURE**, heightened because CFA-04 is not yet ratified.

### 13. What question must the peer answer before this seam can be considered aligned?

> **Which actor/principal/delegation/relationship facts does CFA-04 regard as World-semantic inputs, and which parts become Authority-owned semantics only after Authority evaluates them?**

---

# Handoff Proposals

A handoff is an information/work transfer, not a transfer of authority.

## H-01 — World ↔ Data identity/correspondence packet

**Source:** CFA-01  
**Target:** CFA-02  
**Subject:** semantic identity/correspondence requirements.

Provide:

- World subject reference;
- semantic identity statement;
- source identities;
- correspondence status;
- relationship semantics;
- unresolved ambiguity;
- temporal scope where known;
- expected continuity invariant.

Request from CFA-02:

- durable record/revision mapping;
- reconstruction/lineage status;
- information-loss classification;
- data-side reconciliation state.

**Acceptance condition:** each side can state which part is semantic meaning and which part is durable continuity mechanics without using “identity” ambiguously.

## H-02 — World ↔ Semantic Continuity grounding packet

**Source:** CFA-01  
**Target:** CFA-03  
**Subject:** World target grounding.

Provide:

- semantic World target;
- admissible semantic names/types;
- canonical identity/reference;
- relevant World relationships;
- ambiguity/unknown state;
- candidate Context required for interpretation.

Request from CFA-03:

- grounding interpretation;
- terminology/crosswalk requirements;
- semantic continuity constraints;
- unresolved command/reference ambiguity.

**Acceptance condition:** language/representation may identify a target but cannot redefine its World meaning.

## H-03 — World ↔ Authority governed-target packet

**Source:** CFA-01  
**Target:** CFA-04  
**Subject:** World-side target/effect context for authorization.

Provide:

- World target references;
- World relationship descriptions;
- requested effect semantics at the World boundary;
- relevant scope/visibility facts where legitimately exposed;
- current uncertainty/conflict status.

Request from CFA-04:

- authority requirements;
- required principal/effect references;
- constraints that must be represented in Context;
- unresolved authority-specific questions.

**Acceptance condition:** the packet enables Authority to decide within its own semantics without CFA-01 pre-deciding permission.

## H-04 — Cross-seam challenge packet when ambiguity repeats

When any of these terms remains overloaded across two CFAs:

- identity;
- correspondence;
- address;
- principal;
- scope;
- relationship;
- canonical;

CFA-01 should send a bounded challenge containing:

1. the exact term;
2. competing definitions;
3. source evidence;
4. consequence of each interpretation;
5. falsifier;
6. requested peer answer.

The challenge should go to the Architecture Steward when peer reconciliation is required, without unilaterally choosing a shared definition.

---

# Boundary Hazards

## Responsibility overlap

**HAZ-01 — Identity overload.** “Identity” can mean semantic identity, durable record identity, revision identity, source identity, evidence identity, or authority principal identity.

**HAZ-02 — Reconciliation overload.** World correspondence and Data reconciliation may describe the same corridor from different dimensions.

**HAZ-03 — Semantic continuity overlap.** CFA-03's broad cross-plane continuity touches World meaning; the intended distinction is continuity-of-meaning versus ownership-of-the-world-meaning.

**HAZ-04 — Authority relationship overlap.** CFA-04's principal/delegation relationships may look like ordinary World relationships but carry additional governed meaning.

## Missing responsibility

**HAZ-05 — Temporal World semantics.** Current artifacts identify time as an important gap, but no single seam contract yet explains valid-time, observation-time, event/state semantics, or “current” under disagreement.

**HAZ-06 — Observation → canonical reconciliation.** Provider/source observations, World assertions, evidence, and canonical state do not yet have one fully characterized cross-CFA contract.

**HAZ-07 — Negative-space semantics.** Not observed, inaccessible, absent, deleted, archived, filtered and error remain incompletely characterized.

## Authority confusion

**HAZ-08 — Context-as-permission.** A context may contain authority constraints but must not itself grant permission.

**HAZ-09 — Evidence-as-authority.** Strong evidence about an object or actor must not become an authorization decision.

**HAZ-10 — Graph-as-authority.** Architecture or World graph projections are not permission systems.

## Evidence / representation confusion

**HAZ-11 — Provider representation becoming World truth.**

**HAZ-12 — Surface representation becoming semantic relationship.**

**HAZ-13 — Data record shape becoming ontology because it is persisted.**

**HAZ-14 — Language representation becoming World meaning because interpretation succeeded.**

## Implementation leakage

**HAZ-15 — D-443 assembly mechanics becoming Context semantics.** CFA-01 must not recreate or redefine the assembly engine simply because it stewards the semantic contract.

**HAZ-16 — Index/query implementation becoming Address semantics.** A search index, graph query, or selector is an implementation mechanism, not automatically the semantic address.

**HAZ-17 — Runtime enforcement becoming World semantics.** K0/K1 mechanisms can constrain operation without defining the World model.

## Stale assumptions

**HAZ-18 — Legacy Ω/VIVIM structures treated as current architecture.** Historical ACU/DCB and other artifacts are evidence, not automatic authority.

**HAZ-19 — Peer bootstrap proposals treated as ratified.** CFA-02 is foundation-seeded; CFA-04 is proposed/owner-dialogue-required; CFA-03 is ratified. Their statuses must remain distinct.

## Terminology collisions

High-risk terms:

- identity;
- canonical;
- correspondence;
- address;
- context;
- relationship;
- principal;
- scope;
- event;
- state;
- projection;
- evidence.

Each should carry a qualified meaning before being used in a shared contract.

## Likely future drift

- World becomes a second data store.
- Context becomes Memory/Attention/Intent/Work by accumulation.
- Authority scope is mistaken for World scope.
- Address becomes a selector/URL grammar.
- Semantic continuity becomes a second ontology.
- Architecture Graph becomes a substitute for World graph.
- Provider observation becomes canonical without reconciliation.
- Evolution changes meaning silently through migration mechanics.

---

# Unresolved Questions for Peers

## To CFA-02 Data / Identity / Persistence

1. What exact semantic question does CFA-02 consider outside its ownership when resolving “same object” correspondence?
2. Where does durable canonical record identity end and World semantic identity begin?
3. Who classifies a merge/split as a semantic identity event versus a data transformation?
4. How should temporal identity changes be represented without collapsing semantic and record identities?
5. Which data reconciliation states must remain visible to CFA-01 as World unknown/conflict states?

## To CFA-03 Semantic Continuity

1. What exact portion of Address belongs to CFA-03 versus CFA-01?
2. When grounding an ambiguous command, who owns the semantic identity of candidate World targets?
3. Does bounded CANON contain World semantic terms as authoritative vocabulary, or only cross-plane continuity mappings?
4. Where does grounding stop and World correspondence begin?
5. How should a representation be marked when it is semantically valid but not authoritative?

## To CFA-04 Authority / Governance

1. Which principal/actor/deputy relationships are ordinary World semantics, and which become Authority-owned semantics?
2. Which authority-relevant relationships should ever be represented in the World relationship model, and with what explicit distinction from permission?
3. How should scope/visibility be represented so that restricted projection does not mutate underlying World meaning?
4. How should Context carry authority constraints without becoming an authorization mechanism?
5. Which authority claims require owner-level resolution if they conflict with World or Data identity semantics?

---

# Non-Authority Statement

CFA-01 does **not** have authority to decide for another CFA:

- what another CFA's semantic or data responsibility “should” be without evidence and alignment;
- the canonical data schema owned by CFA-02;
- the semantic continuity contract or CANON owned by ratified CFA-03;
- any authorization, consent, delegation, standing, revocation, risk-policy, or governance decision belonging to CFA-04;
- Ω law or constitutional runtime rules;
- execution or provider realization semantics;
- surface implementation or composition mechanics;
- architecture-wide graph ownership.

CFA-01 may **characterize, challenge, propose, request evidence, and expose contradictions** at these seams. It may not silently settle a cross-CFA dispute.

The Architecture Steward may compare this declaration with the corresponding peer declarations and initiate reconciliation. Human-owner intervention remains appropriate where reconciliation would materially change enduring responsibility or ratify an unresolved authority boundary.

---

# Evidence Index

| Source | Relevant basis | Epistemic status / freshness |
|---|---|---|
| AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/ROUND-1-BOUNDARY-BOOTSTRAP.md | Required Round 1 procedure and declaration contract | OBSERVED / CURRENT |
| AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/ROUND-1-CFA-MATRIX.md | Assigns CFA-01 exactly World ↔ Data, World ↔ Semantic, World ↔ Authority | OBSERVED / CURRENT |
| AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/BOUNDARY-PROTOCOL.md | Epistemic/freshness vocabulary; multidimensional ownership; handoff/challenge rules | OBSERVED / CURRENT |
| AGENTS_CONTEXT/ARCHITECTURE_STEWARD/README.md | Architecture Steward scope and non-scope; graph responsibility | OBSERVED / CURRENT |
| AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CORE-FUNCTION-AREA-REGISTER.md | CFA constellation; CFA-03 ratification and CFA-01/02/04 separation | OBSERVED / CURRENT |
| AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/BOOTSTRAP-SEED.md | CFA-01 current role, semantic spine, identity layers, non-ownership, peer inputs | OBSERVED / CURRENT |
| AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/STATE.md | Current CFA-01 position, decisions, concepts, issues, cases and monitored boundaries | OBSERVED / CURRENT |
| AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/SELF-DESIGN-PROPOSAL.md | Detailed provisional responsibility and explicit neighboring interfaces | PROPOSED / CURRENT |
| AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/WORLD-LENS-ONE-TOOL-DESIGN.md | World Lens routing and boundary distinctions | DERIVED / CURRENT |
| AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/WORLD-PEER-DISTANCE-MATRIX.json | Explicit CFA-01 peer boundary/risk statements | DERIVED / CURRENT |
| AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/CORE-AGENT-SEED.md | CFA-02 current role, data continuity ownership, explicit non-ownership of World meaning | PROVISIONAL / CURRENT |
| AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/BOUNDARY-DESIGN.md | Data corridor, identity ladder, transformation and reconciliation contracts | PROVISIONAL / CURRENT |
| AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/CORE-AGENT-IDENTITY.md | CFA-03 ratified role and authority boundary | RATIFIED / CURRENT |
| AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/STATE.md | CFA-03 active state and unresolved grounding boundaries | RATIFIED / CURRENT |
| AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/CANON-DICTIONARY.md | Bounded terminology/CANON seam | FOUNDATION / CURRENT |
| AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/BOOTSTRAP-DESIGN-PROPOSAL.md | CFA-04 candidate authority scope, non-scope and World-facing interface | PROPOSED / CURRENT |
| AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/README.md | CFA-04 bootstrap status and owner-alignment requirement | OBSERVED / CURRENT |
| docs/destination/world-object-core/WORLD-PROJECTION.md | World/object/projection and Space semantics | OBSERVED / CURRENT repository evidence |
| docs/destination/world-object-core/RELATIONSHIP-MODEL.md | Relationship assertion structure, validity, provenance separation and conflicts | OBSERVED / CURRENT repository evidence |
| docs/destination/world-object-core/OBJECT-TAXONOMY.md | Destination object semantics | OBSERVED / CURRENT repository evidence |
| docs/destination/CONCEPTUAL-MODEL.md | Attention/World conceptual relationships | OBSERVED / CURRENT repository evidence |
| docs/destination/DATA-MEMORY-CONTEXT-RECONCILIATION.md | Data/World/context reconciliation pressure | OBSERVED / CURRENT repository evidence |
| docs/destination/AGENCY-BACKGROUND-ATTENTION-RECONCILIATION.md | Attention/current context seam | OBSERVED / CURRENT repository evidence |
| plugins/vivim-run/src/context.ts via D-443 | Existing Context assembly realization | OBSERVED / CURRENT repository evidence |
| Historical VIVIM ACU/DCB material | Prior implementation evidence for content/context units | HISTORICAL / STALE unless reconfirmed |

---

## Declaration status

This declaration is **CFA-01's current claim for Round 1**.

It is intentionally not presented as shared truth.

The next authority-bearing step is the Architecture Steward's comparison against the other side(s) of each seam, followed by explicit challenges/reconciliation where claims differ.
