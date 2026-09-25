# CFA-02 Data Steward — Boundary Round 1 Declaration

> **Status:** CFA-02 current claim; not yet a shared architectural boundary.
>
> **Date:** 2026-09-26
>
> **Identity status:** PROVISIONAL / FOUNDATION-SEEDED / NOT FORMALLY RATIFIED
>
> **Round 1 assigned seams:** Data ↔ World; Data ↔ Capability; Data ↔ Work

## Identity

| Item | Current claim | Epistemic status | Freshness |
|---|---|---|---|
| CFA ID | CFA-02 | OBSERVED | CURRENT |
| Working/rationalized name | **Data Steward** | PROPOSED / FOUNDATION-SEEDED | CURRENT |
| Machine-safe slug | `data-model` | OBSERVED | CURRENT |
| Parent | Architecture Steward | OBSERVED | CURRENT |
| Identity status | Provisional; permanent Core Agent identity not claimed | OBSERVED | CURRENT |
| Continuously coherent responsibility | Steward durable data continuity across observation, transformation, representation, persistence, exchange, realization, lifecycle, recovery and architectural evolution | DERIVED from current CFA seed + boundary work | CURRENT |
| Core continuity question | What is the data, where did it come from, what identity/lineage does it carry, what transformation occurred, what is durable/derived/external, and can it still be faithfully reconstructed when the surrounding system changes? | DERIVED | CURRENT |

### Responsibility that must remain continuously coherent

My responsibility is not “own the database.”

It is:

> **Keep durable user information truthful, identifiable, traceable and reconstructable as it moves through the product's data-bearing corridors and as the systems on either side of those corridors change.**

This includes the data consequences of observation, parsing, alignment, normalization, reconciliation, persistence, revision, projection, export/restore and external realization.

### Explicit non-ownership

I do **not** own:

- World meaning, ontology semantics, or semantic correspondence decisions for CFA-01.
- Capability semantics, provider/browser realization mechanics, discovery/healing implementation, or account/session/provider domain semantics for CFA-06.
- Work/execution meaning, scheduling semantics, agent responsibility, or outcome semantics for CFA-05.
- Ω constitutional law or K0/runtime authority.
- Authorization, consent, delegation, or policy semantics.
- Surface/interaction semantics.
- Plugin/composition authority.
- The Architecture Steward's development graph as a second data store.
- Universal ontology, universal graph database, or universal data schema.

Where those domains emit or consume durable data, I **do** steward the continuity contract across the seam.

## Responsibility

The current CFA-02 responsibility is best expressed as six continuous obligations:

1. **Identity continuity** — preserve the distinction and mapping among semantic, canonical, source/provider, revision, event, evidence, representation, session/account and projection identities.
2. **Transformation continuity** — make consequential transformations explainable, versioned where necessary, provenance-bearing, and explicit about information loss.
3. **Durability/reconstruction continuity** — ensure durable user data can survive restart, replacement, export/restore, lifecycle transitions and implementation change.
4. **Reconciliation continuity** — distinguish repeated observations, normalization, canonicalization, deduplication, identity correspondence, revision, conflict and merge instead of collapsing them.
5. **Projection/write-back continuity** — keep canonical data distinct from derived projections and close external write paths with observation/reconciliation rather than treating a successful call as external truth.
6. **Boundary continuity** — make data ownership, authority, evidence, lifecycle and evolution assumptions explicit where information crosses CFA or external-system boundaries.

The role is therefore **cross-cutting but not ownership-absorbing**: it follows the information corridor, not every subsystem's internal semantics.

## OWNS / CONTRIBUTES / CONSULTS / OUT-OF-SCOPE

| Responsibility | CFA-02 position | Epistemic status | Freshness | Current boundary statement |
|---|---|---|---|---|
| Durable canonical-data continuity | **OWNS** | DERIVED from CFA-02 seed + repository evidence | CURRENT | Steward identity, revision, lineage, durability and reconstructability of canonical user data. |
| Cross-boundary identity mapping | **OWNS** | DERIVED | CURRENT | Own the continuity contract among semantic/canonical/source/revision/evidence/representation identities; peer owns semantic meaning. |
| Data-bearing transformation contracts | **OWNS** | DERIVED | CURRENT | Own the data contract for capture, parse/align, normalize, reconcile, persist, project, export and write-back when durable data can change. |
| Provenance / lineage preservation at data boundaries | **OWNS** | DERIVED | CURRENT | Own requirement that lineage and provenance survive relevant transformations; evidence producer owns evidentiary semantics. |
| Reconciliation and correspondence recording | **OWNS** | PROPOSED | CURRENT | Own data-plane recording/classification of equivalent, revised, partial, conflicting, lossy and unknown mappings; do not decide peer semantic equivalence. |
| Derived projection/data consistency | **OWNS** | DERIVED / PROPOSED | CURRENT | Own continuity contract for basis, freshness, rebuildability and divergence of indexes/projections; projection consumer owns view semantics. |
| Retention/restore/reconstruction consequences | **OWNS** | DERIVED | CURRENT | Own data continuity consequences; lifecycle/evolution owner may own policy/process decisions. |
| Parser/adaptor **data-output contract** | **OWNS** | DERIVED | CURRENT | Own provenance, identity, transformation, loss and reconciliation conditions for parser output that feeds durable data. |
| Parser/adaptor implementation | **CONTRIBUTES / CONSULTS** | DERIVED | CURRENT | Implementation belongs with provider/realization mechanisms unless evidence later establishes otherwise. |
| Provider/browser observation mechanics | **CONSULTS** | OBSERVED/DERIVED | CURRENT | Require accurate observation identity/provenance from provider owner; do not implement or define browser mechanics here. |
| World semantic object meaning | **CONSULTS** | DERIVED from CFA-01 state | CURRENT | CFA-01 appears to own world meaning; CFA-02 needs that meaning to make durable representation coherent. |
| Semantic equivalence/correspondence meaning | **CONSULTS** | UNKNOWN / CONFLICT-RISK | CURRENT | Do not declare two things semantically identical merely because data reconciliation is technically possible. |
| Capability semantics / valid realization | **CONSULTS** | DERIVED / UNKNOWN peer agreement | CURRENT | CFA-06 is expected to own capability and realization semantics; CFA-02 owns the data crossing. |
| Work/execution semantics | **CONSULTS** | DERIVED / UNKNOWN peer agreement | CURRENT | CFA-05 is expected to own Work/execution semantics; CFA-02 owns durable state continuity and reconstruction across the corridor. |
| Authority / consent semantics | **CONSULTS** | DERIVED | CURRENT | CFA-04 decides authorization; CFA-02 preserves the authoritative references and mutation/result lineage required for reconstruction. |
| Runtime/K0 guarantees | **OUT-OF-SCOPE** | OBSERVED from Steward model | CURRENT | Consume substrate guarantees; do not redefine runtime constitution from data needs. |
| Surface/UI semantics | **OUT-OF-SCOPE** | DERIVED | CURRENT | Surface can write/read canonical data, but surface semantics remain elsewhere. |
| Universal schema / universal database | **OUT-OF-SCOPE** | DERIVED | CURRENT | No universal schema is justified by this boundary exercise. |
| Architecture graph authority | **OUT-OF-SCOPE** | OBSERVED | CURRENT | Supply evidence-backed data facts to Architecture Steward; do not own the graph. |

## Assigned Seams

### Seam 1 — Data ↔ World

#### 1. What is the seam's subject?

The seam is the boundary between **World meaning / semantic objects and relationships** and their **durable canonical data representation, identity, revision and reconstruction**.

Core corridor:

```text
WORLD MEANING
    ↕
CANONICAL OBJECT / RELATIONSHIP
    ↕
SOURCE IDENTITY / CONTENT IDENTITY / REVISION
    ↕
PROVENANCE / EVIDENCE / PROJECTION
```

The critical question is not “who owns objects?” It is:

> **How does a semantically meaningful World thing remain durably identifiable and reconstructable without allowing storage identity, provider identity, or representation to silently become semantic identity?**

#### 2. What does my CFA own?

**Current claim:**

CFA-02 owns the durable data-plane consequences of World semantics:

- canonical record identity and revision continuity;
- source/provider identity mappings;
- content identity where relevant;
- relationship record continuity;
- provenance/evidence references attached to durable records;
- lifecycle/reconstruction behavior;
- preservation of these mappings through migration/export/restore/replacement.

**Status:** DERIVED from CFA-02 seed and repository evidence.  
**Freshness:** CURRENT.

#### 3. What do I believe the peer owns?

**Current belief, not peer agreement:**

CFA-01 appears to own:

- what a World object/Thing means;
- what semantic relationships mean;
- semantic identity/correspondence semantics;
- World projection and Context semantics.

This is supported by CFA-01 STATE.md and the Round-1 routing matrix, but **CFA-01's boundary is itself provisional and not a ratified shared seam**.

**Status:** DERIVED / PROVISIONAL.  
**Freshness:** CURRENT.

#### 4. What crosses the boundary?

- semantic object/relationship definitions;
- canonical object identifiers;
- references to source identity;
- revision identifiers;
- relationship assertions;
- provenance/evidence references;
- content references;
- lifecycle state needed to represent semantic absence/archive/tombstone where applicable;
- data-quality/reconciliation results;
- explicit uncertainty/conflict states.

A particularly important crossing is:

```
semantic meaning
→ canonical representation
→ identity / lineage
→ evidence / provenance
→ revision history
```

#### 5. What must NOT cross?

The following must not silently cross as semantic authority:

- provider IDs becoming World identity;
- database primary keys becoming semantic identity;
- surface node IDs becoming World identity;
- parser output being treated as semantic truth;
- provenance refs being treated as semantic relationships;
- a projection/cache becoming canonical merely because it is convenient;
- retrieval success/failure being interpreted as World existence/non-existence without an explicit semantic rule;
- storage shape being used as the definition of World meaning.

#### 6. What inputs do I require?

I require from the World side:

- semantic meaning of the target object/relationship;
- rules for semantic identity and correspondence;
- meaning of merge/split/archive/delete where those affect durable records;
- relationship semantics;
- any distinction between source identity and semantic identity;
- indication of which World properties are canonical versus derived.

#### 7. What outputs do I provide?

I provide:

- durable canonical identity/revision requirements;
- source↔canonical identity mappings;
- lineage/provenance references;
- data transformation records;
- reconstruction requirements;
- lifecycle/data-state classifications;
- reconciliation/conflict records;
- projection basis/freshness requirements;
- continuity impact findings for migration/export/restore.

#### 8. What invariants must hold?

1. **Semantic identity ≠ source identity ≠ content identity ≠ storage identity.**
2. World meaning must not depend on a replaceable storage mechanism.
3. Relationship assertions must remain distinguishable from structural provenance.
4. Canonical revision history must remain inspectable after implementation/storage change.
5. A derived World projection must be rebuildable without silently becoming a second source of truth.
6. Correspondence must be evidence-bearing and may remain UNKNOWN or CONFLICTED.
7. Merge/split must preserve genealogy and may not silently destroy prior identity.

#### 9. What evidence supports my claim?

- CFA-01 STATE.md: World is a derived coherent view, canonical objects use durable vault identity, relationship records are semantic assertions, source identity is not local identity, correspondence is not proof.
- CFA-02 CORE-AGENT-SEED.md: explicit identity/data/lineage boundary and non-ownership of World meaning.
- `docs/destination/DATA-MEMORY-CONTEXT-RECONCILIATION.md`: source → canonical record → relationship/representation → memory/context path.
- `docs/destination/world-object-core/CONTENT-STORAGE.md`: object identity, source identity and content identity are distinct.
- `docs/destination/world-object-core/EXPORT-RESTORE.md`: fresh restore preserves canonical refs; relationships, source identities and tombstones are durable archive concerns.
- Architecture Steward CANONICAL-MODEL.md: semantic owner, canonical data owner and evidence owner are separate ownership dimensions.

#### 10. What would falsify it?

This boundary claim would be falsified if repository/runtime evidence demonstrates that:

- World semantics require ownership of the physical persistence mechanism rather than only the semantic contract;
- semantic object identity is intentionally defined by a specific external/storage identity with durable architectural necessity;
- relationship records are actually intended only as provenance and have no semantic authority;
- canonical objects are not the durable source for World reconstruction;
- a current ratified architecture document assigns these exact data-continuity responsibilities elsewhere.

#### 11. What is unknown?

- Exact ratified boundary between CFA-01 semantic identity/correspondence and CFA-02 durable identity.
- Whether Event/State should be universal durable primitives or remain domain-specific.
- Minimum persistence payload required for every World object/relationship type.
- Exact semantics for merge/split across canonical World objects.
- Which World properties are permanently canonical versus derivable.
- Exact Product Instance/device/session relationship to World object identity.

#### 12. What appears duplicated or overlapping?

- **Identity:** CFA-01 owns semantic identity; CFA-02 owns canonical/storage continuity. “Identity” language can easily collide.
- **Correspondence:** CFA-01 may define semantic correspondence; CFA-02 must record and preserve data-plane correspondence evidence.
- **Projection:** CFA-01 owns World projection semantics; CFA-02 owns projection continuity/rebuildability.
- **Event/State:** current repositories contain multiple meanings and possible owners; no unified owner is established.
- **Content:** World object research covers content semantics while CFA-02 must cover content durability; the seam is not yet fully explicit.

These are overlaps to reconcile, not decisions I am making for CFA-01.

#### 13. What question must the peer answer before this seam can be considered aligned?

> **Which exact semantic identity/correspondence decisions does CFA-01 own, and which data continuity decisions does CFA-02 own, especially for canonical object identity, merge/split, relationship identity, Event/State, and source↔canonical correspondence?**

A second required peer question:

> **Which World fields/relationships are canonical durable facts versus derived World projection state?**

---

### Seam 2 — Data ↔ Capability

#### 1. What is the seam's subject?

The seam is the boundary between **capability/provider/realization behavior** and the **durable data produced, consumed or changed by that behavior**.

Primary read corridor:

```text
EXTERNAL PROVIDER OBSERVATION
→ CAPTURE
→ PARSE / ALIGN / REPAIR
→ NORMALIZE
→ IDENTIFY / RECONCILE
→ CANONICAL DATA / REVISION
```

Primary write/round-trip corridor:

```text
CANONICAL DATA
→ AUTHORIZED TRANSLATION
→ PROVIDER REPRESENTATION
→ REALIZATION
→ EXTERNAL EFFECT
→ OBSERVATION
→ RECONCILIATION
→ CANONICAL REVISION / EVIDENCE
```

#### 2. What does my CFA own?

CFA-02 owns:

- canonical/source identity mapping;
- data transformation contract around provider observations;
- parser/adaptor provenance when it affects durable data;
- normalization/canonicalization/reconciliation requirements;
- durable capture/representation lineage;
- external write-back data continuity;
- distinction between external state and local canonical state;
- reconstruction behavior when provider/implementation changes.

**Status:** DERIVED from CFA-02 seed, provider migration evidence and Round-1 routing.  
**Freshness:** CURRENT.

#### 3. What do I believe the peer owns?

**Current belief, not peer agreement:**

CFA-06 appears to own:

- capability semantics;
- provider identity;
- Account/Session/External Resource distinctions;
- routing;
- provider knowledge;
- discovery/healing;
- browser realization;
- the implementation mechanics of provider parsers/adapters/realizations where they belong to provider realization.

This is consistent with the CFA-06 bootstrap prompt/README and existing migration/provider documentation, but **CFA-06 has not yet provided a ratified boundary declaration**.

**Status:** DERIVED / PROVISIONAL.  
**Freshness:** CURRENT.

#### 4. What crosses the boundary?

Read side:

- provider/source identity;
- observation/capture identity;
- provider representation;
- parser/adaptor identifier/version when consequential;
- normalized content;
- identity candidates;
- provenance/evidence;
- reconciliation result;
- resulting canonical object/message/revision.

Write side:

- canonical object/message/revision;
- authorized mutation reference;
- translation target;
- realization reference;
- external effect identifier where available;
- post-write observation;
- reconciliation result;
- canonical revision/evidence.

#### 5. What must NOT cross?

- provider IDs silently becoming canonical identity;
- selector strings becoming semantic object identity;
- browser/session state becoming canonical user data merely because it is available;
- parser implementation structure becoming a destination data schema without evidence;
- a successful provider API/DOM action being treated as proof of external final state without observation;
- provider/browser capability semantics being redefined by data storage requirements;
- canonical user data being made unreadable because a replaceable provider plugin is gone.

#### 6. What inputs do I require?

From CFA-06 I require:

- external/provider identity;
- observation basis and timestamp/sequence where relevant;
- provider/account/session/realization identity distinctions;
- parser/adaptor identity and version when durable output depends on it;
- capture/source references;
- indication of whether a result is observed, inferred or unknown;
- realization details needed to explain the data path;
- post-write observation where available.

#### 7. What outputs do I provide?

I provide:

- stable canonical identity target;
- source↔canonical mapping requirements;
- revision-aware persistence requirements;
- reconciliation state;
- provenance/lineage expectations;
- durable write-back status;
- information-loss declarations;
- replacement/upgrade continuity constraints;
- evidence needed to reconstruct the provider-to-canonical path.

#### 8. What invariants must hold?

1. **Provider identity is not canonical identity.**
2. **Account identity, Session identity and Realization identity remain distinct.**
3. Parser completion does not equal semantic correctness.
4. External write success does not equal observed external truth.
5. Any durable parser output must retain enough provenance to explain how it was produced.
6. Provider implementation replacement must not destroy canonical user-data identity or genealogy.
7. Unobserved external state remains UNKNOWN rather than being silently coerced into success/failure.
8. Round-trip transformations must disclose information loss where applicable.

#### 9. What evidence supports my claim?

- `docs/migration/PROVIDER_DATA_MODEL.md`: explicit separation of provider realization, account, execution, stream, conversation and evidence layers; stream bytes→meaning; fallback parser chain; canonical conversation/message flow.
- `docs/migration/VIVIM_TO_OMEGA_MAPPING.md`: ProviderDefinition→ProviderRealization, ProviderAccount→vault session/fence principal, ProviderParser→pinned parser contribution, ChromeGovernor→provider-browser adapter, Conversation→vault records.
- CFA-02 CORE-AGENT-SEED.md: provider/productivity integrations treated as data corridors; successful external write is not proof.
- `docs/destination/system-intelligence/STATE.md`: live provider-browser proof remains an open frontier; Account/routing/session remains high uncertainty.
- `docs/destination/world-object-core/EXPORT-RESTORE.md`: source identities and canonical refs must survive restore; external reconnect follows canonical reconstruction.
- Ω D-432 durability evidence (current destination evidence): append/recovery/export/import preserve durable vault history and refuse silent reconstruction paths.

#### 10. What would falsify it?

This claim would be falsified if evidence shows that:

- provider identity is intentionally the canonical user-data identity by ratified design;
- provider realization owns canonical user-data lifecycle rather than merely realizing/observing it;
- durable data can be faithfully reconstructed after losing provider/parser provenance;
- external write state is architecturally defined by local command completion rather than observation;
- a ratified CFA-06 declaration explicitly places canonical data continuity inside its own responsibility.

#### 11. What is unknown?

- Exact CFA-06 ownership of parser semantics versus parser implementation.
- Canonical Account / Session / Resource model and its persistence owner.
- Exact minimum observation/provenance packet for every provider corridor.
- Live proof of current provider-browser behavior.
- Canonical AI conversation translation contract across providers.
- What provider-specific information may be safely discarded during normalization.
- How provider-side deletion/disappearance should reconcile with already-canonical local data.

#### 12. What appears duplicated or overlapping?

- **Parser responsibility:** CFA-06 may own parser implementation and provider meaning; CFA-02 owns its durable data consequences. The boundary needs explicit wording.
- **Account/session:** CFA-06 likely owns semantics; CFA-02 persists continuity, but Product Instance/runtime may also need references.
- **Evidence:** CFA-06 can produce observation evidence while CFA-02 preserves lineage; CFA-05 may also produce execution evidence.
- **Routing:** CFA-06 may select realizations; CFA-04 may constrain authorization; CFA-02 only records the resulting data path.

#### 13. What question must the peer answer before this seam can be considered aligned?

> **For provider-specific parsing and observation, what does CFA-06 consider its semantic/implementation responsibility, and what exact data contract does it expect CFA-02 to steward for durable output, provenance, identity and reconciliation?**

And:

> **After a canonical write reaches a provider, what does CFA-06 consider an authoritative observation of the external result, and which states remain UNKNOWN?**

---

### Seam 3 — Data ↔ Work

#### 1. What is the seam's subject?

The seam is the boundary between **durable Work / execution / outcomes** and the **durable data state that Work reads, changes, produces, or must reconstruct after interruption**.

Critical corridor:

```text
INTENT
→ WORK
→ ATTEMPT
→ EXTERNAL EFFECT
→ OBSERVATION
→ OUTCOME
→ EVIDENCE
→ CANONICAL DATA REVISION
```

The important question is:

> **Can Work reconstruct what data was intended to change, what actually changed, what remained unknown, and what durable state now exists—even after a crash or external-side ambiguity?**

#### 2. What does my CFA own?

CFA-02 owns:

- durable data identity and revisions touched by Work;
- durable state continuity of inputs/outputs;
- causation and linkage requirements where needed to reconstruct mutation history;
- canonical data mutation and reconciliation records;
- reconstruction of data consequences after restart/retry;
- distinction between durable data state and ephemeral execution state;
- continuity of evidence references connecting Work effects to canonical revisions.

**Status:** DERIVED.  
**Freshness:** CURRENT.

#### 3. What do I believe the peer owns?

**Current belief, not peer agreement:**

CFA-05 appears intended to own:

- Work semantics;
- execution attempts;
- worker/agent responsibility;
- scheduling/background execution;
- recovery semantics;
- outcome semantics.

This is based on the CFA-05 launch prompt and Round-1 routing matrix, but there is no ratified CFA-05 identity/boundary declaration yet.

**Status:** DERIVED / PROVISIONAL.  
**Freshness:** CURRENT.

#### 4. What crosses the boundary?

From Work to Data:

- work identity/reference;
- attempt identity;
- causation/reference chain;
- requested mutation or target canonical data identity;
- execution result/evidence;
- outcome classification;
- external effect observation;
- reconciliation result.

From Data to Work:

- canonical target identity;
- current revision/basis;
- data required for execution;
- mutation preconditions;
- resulting canonical revision;
- conflict/unknown state;
- reconstruction information after restart.

#### 5. What must NOT cross?

- runtime worker/session IDs silently becoming canonical data identity;
- “job completed” becoming proof that durable state changed;
- execution trace implementation being mistaken for the canonical data history;
- ephemeral scheduler state being persisted as user data without continuity rationale;
- Work semantics being redefined merely to fit storage representation;
- a canonical data revision being treated as proof of external execution success without appropriate evidence.

#### 6. What inputs do I require?

From CFA-05 I require:

- stable Work identity;
- attempt identity where relevant;
- explicit mutation target(s);
- causation / correlation linkage;
- execution/outcome state;
- external-effect state;
- retry/idempotency expectations;
- recovery boundary;
- indication of what the worker believes happened versus what was observed.

#### 7. What outputs do I provide?

I provide:

- canonical data identity and revision references;
- mutation scope and data continuity requirements;
- durable before/after or supersession references where appropriate;
- reconciliation/conflict/unknown state;
- evidence links connecting external observation to canonical revision;
- reconstruction information for restart/retry;
- projection invalidation/rebuild implications where derived data is affected.

#### 8. What invariants must hold?

1. A Work attempt that changes durable data must be linkable to the affected canonical data revisions.
2. A Work completion signal is not by itself proof of external state.
3. Unknown external effects remain representable and recoverable.
4. Retries must not silently duplicate durable mutations when the operation is intended to be idempotent.
5. Data history must remain inspectable after Work retry, crash or worker replacement.
6. Runtime Work state is not automatically canonical user data.
7. Evidence for execution and evidence for data truth remain distinguishable.
8. Derived projections affected by a canonical mutation must be either updated coherently or explicitly marked stale/rebuildable.

#### 9. What evidence supports my claim?

- `docs/destination/DATA-MEMORY-CONTEXT-RECONCILIATION.md`: canonical data flows into Work/Interaction and then new evidence closes the loop.
- CFA-02 STATE.md: current priority investigation includes Intent → Work → Outcome → Evidence; write success is not observed external truth.
- CFA-05 launch prompt: intended durable Work, attempts, execution attribution, scheduler/triggers, background continuity, recovery and Outcome semantics.
- `omega-baseline/omega-final/docs/VAULT-NAMESPACES.md`: `work` durable records/plan snapshots/attempts and revisions are retained.
- `omega-baseline/omega-final/docs/decisions/D-378-vault-index-probe.md`: durable chat mutation and index are separate but coupled writes, with an explicit crash window and later repair requirement.
- Ω durability evidence (D-432): crash recovery, journaling, recovery rows and explicit refusal states demonstrate that partial mutation/recovery is a first-class concern.
- Architecture Steward CANONICAL-MODEL.md: WORK, OBJECT, EVIDENCE and CHANGE are separate canonical entity classes with typed relationships.

#### 10. What would falsify it?

This boundary would be falsified if:

- Work is intentionally non-durable and a different authority owns all durable execution causation;
- canonical data history is not expected to preserve Work causation or outcome linkage;
- a ratified CFA-05 declaration assigns data mutation/reconstruction semantics directly to Work ownership;
- runtime execution state is intentionally canonical user data under a ratified rule;
- the current Ω Work model proves that all required data continuity is already fully encapsulated elsewhere.

#### 11. What is unknown?

- Exact Intent→Work semantic boundary.
- Whether Outcome is a Work record, separate canonical entity, Evidence projection, or some combination.
- Exact canonical mutation transaction boundary between Work and Data.
- Required causation/idempotency model for each mutation class.
- How unknown external effects become durable state and later reconcile.
- Scheduler/background state that must survive restart.
- Whether Work attempts and canonical mutations share one transaction or use explicit eventual reconciliation.

#### 12. What appears duplicated or overlapping?

- **Outcome:** CFA-05 likely owns Work/outcome semantics; CFA-02 owns the durable data consequences. Current architecture has multiple possible evidence/result representations.
- **Evidence:** CFA-05 may own execution evidence; CFA-02 owns data lineage that references evidence. CFA-06 can also produce provider observation evidence.
- **Recovery:** CFA-05 owns execution recovery semantics; CFA-02 owns data reconstruction consequences. These may currently be mixed in the same implementation paths.
- **Atomicity:** Work may define what constitutes one execution unit while Data must define what data mutation must remain atomic. Neither side should silently absorb the other.
- **Event/State:** both Work and Data have reasons to use these terms; universal semantics remain unresolved.

#### 13. What question must the peer answer before this seam can be considered aligned?

> **What exact durable Work/Attempt/Outcome semantics does CFA-05 own, and what does it expect CFA-02 to guarantee about the data state before, during and after an execution attempt?**

And:

> **For an external effect with unknown final state, what durable Work state should exist, what evidence must be attached, and what event closes the loop into a canonical data revision?**

## Handoff Proposals

A handoff is a transfer of information/work across a boundary, **not** a transfer of authority.

### H1 — World → Data: Semantic-to-Canonical Data Contract

**Source:** CFA-01  
**Target:** CFA-02  
**Subject:** semantic object/relationship definition plus identity correspondence rules  
**Reason:** allow durable representation without making storage identity into semantics  
**Requested input:** canonical semantic identity rules; relationship identity; merge/split/archive/delete meaning; canonical-vs-derived fields  
**CFA-02 supplied artifact:** canonical/source/revision identity map; persistence/reconstruction requirements; lineage requirements  
**Expected response:** explicit World-side semantic boundary  
**Status:** PROPOSED

### H2 — Capability → Data: Provider Observation Packet

**Source:** CFA-06  
**Target:** CFA-02  
**Subject:** provider observation and transformation metadata for any observation entering durable data  
**Reason:** preserve provider/source identity, parser/adaptor basis, provenance, epistemic state and reconciliation inputs  
**Requested input:** provider/account/session/realization identity, source observation, parser/adaptor version, raw/source reference where required, observed-vs-inferred status  
**CFA-02 supplied artifact:** canonical target identity, revision decision, reconciliation status, data-loss declaration and durable lineage  
**Expected response:** a defined provider→canonical continuity contract  
**Status:** PROPOSED

### H3 — Data → Capability: Canonical-to-External Realization Contract

**Source:** CFA-02  
**Target:** CFA-06  
**Subject:** canonical mutation translated for external realization  
**Reason:** preserve canonical identity, authorization linkage, expected revision basis and post-write reconciliation requirements  
**Requested input:** realization identity, accepted external representation, returned external effect identity, post-write observation capability  
**CFA-02 supplied artifact:** canonical mutation identity/revision + provenance/reconciliation requirements  
**Expected response:** realization-side rules for observed, stale, failed and unknown external results  
**Status:** PROPOSED

### H4 — Work → Data: Mutation Intent Packet

**Source:** CFA-05  
**Target:** CFA-02  
**Subject:** durable mutation requested by Work  
**Reason:** make the affected canonical records, causation and retry semantics explicit  
**Requested input:** Work ID, Attempt ID, mutation target(s), expected revision/basis, idempotency/correlation key, external-effect state  
**CFA-02 supplied artifact:** canonical revision/mutation result, conflict or unknown state, projection impact  
**Expected response:** defined Work↔Data mutation closure  
**Status:** PROPOSED

### H5 — Data → Work: Durable Mutation Result

**Source:** CFA-02  
**Target:** CFA-05  
**Subject:** canonical result of a Work-triggered mutation  
**Reason:** let Work distinguish committed canonical change from external uncertainty, projection staleness, conflict or rejection  
**CFA-02 supplied artifact:** affected canonical refs/revisions, causation linkage, reconciliation status, evidence refs, rebuild/stale signals  
**Expected response:** Work-side continuation/recovery behavior  
**Status:** PROPOSED

## Boundary Hazards

| Hazard | Current assessment | Epistemic status | Freshness |
|---|---|---|---|
| Data becomes “the database owner” rather than continuity steward | High | DERIVED risk | CURRENT |
| Semantic identity and canonical identity collapse | High | DERIVED risk | CURRENT |
| Provider ID becomes canonical identity | High | OBSERVED historical risk + DERIVED | CURRENT |
| Parser output becomes semantic truth without evidence | High | DERIVED risk | CURRENT |
| Successful external write becomes external truth | High | OBSERVED/DERIVED | CURRENT |
| Work completion becomes proof of durable/external mutation | High | DERIVED risk | CURRENT |
| Evidence and representation are conflated | High | DERIVED | CURRENT |
| Projection/index becomes canonical | Medium-High | DERIVED | CURRENT |
| Runtime/process/session state leaks into durable user data | Medium-High | DERIVED | CURRENT |
| World and Data both claim “identity” without dimensional distinction | High | OBSERVED terminology collision | CURRENT |
| Capability and Data both claim parser responsibility without splitting semantics vs implementation | High | DERIVED / UNKNOWN | CURRENT |
| Work and Data both claim mutation atomicity without defining scopes | High | DERIVED / UNKNOWN | CURRENT |
| Event/State vocabulary becomes an accidental universal schema | Medium-High | UNKNOWN | CURRENT |
| Stale repository state mistaken for current architecture | Medium-High | OBSERVED repository pattern | CURRENT |
| Provider/source disappearance inferred as local deletion | High | DERIVED risk | CURRENT |
| External observation missing after write-back | High | DERIVED frontier | CURRENT |
| Future multi-device/cross-vault merge semantics are left implicit | High | OBSERVED unresolved research area | CURRENT |
| Data continuity requirements leak into K0/runtime constitution | Medium | DERIVED risk | CURRENT |

### Missing responsibility signals

The Round-1 work still suggests unresolved responsibility around:

- exact canonical Account/Session/External Resource persistence;
- Product Instance/device/session continuity;
- cross-vault collision/remapping;
- multi-device merge;
- data disclosure trace;
- large/binary content lifecycle;
- correction semantics;
- projection consistency;
- retention/deletion semantics.

These should not be assigned here merely because they touch data. Their semantic/process ownership remains to be reconciled.

### Evidence/representation confusion to guard

The following are not interchangeable:

```
OBSERVATION
≠ REPRESENTATION
≠ STORED RECORD
≠ PROVENANCE
≠ AUTHORITY
≠ SEMANTIC TRUTH
≠ EXTERNAL TRUTH
```

## Unresolved Questions for Peers

### CFA-01 — World

1. What exact semantic identity/correspondence decisions are yours, and what exact canonical identity/data decisions do you expect CFA-02 to own?
2. Which World object/relationship properties are canonical durable facts versus derived World projection?
3. What constitutes semantic merge, split, archive and deletion?
4. Is Event/State a World semantic primitive, a shared cross-CFA vocabulary, or intentionally unresolved?
5. What evidence is sufficient to treat source↔canonical correspondence as semantically valid?
6. Where should conflicts in correspondence remain visible rather than being collapsed?

### CFA-06 — Capability

1. What part of provider-specific parsing is semantic/provider responsibility, and what part must be a Data continuity contract?
2. Which provider/account/session/realization identities must be persisted, and who defines their semantics?
3. What observation closes a write-back loop?
4. Which provider fields may be normalized or discarded without losing durable meaning?
5. How should source disappearance, permission loss and provider-side deletion map into canonical local data?
6. What is the minimum observation/provenance packet required for a durable import or mutation?

### CFA-05 — Work

1. What exact Work/Attempt/Outcome records are durable?
2. What is the transaction boundary between Work and canonical data mutation?
3. What causation/idempotency information is required for retries?
4. How should unknown external effects persist and later reconcile?
5. Which evidence belongs to Work execution versus canonical data truth?
6. What runtime execution state must survive restart because it changes user-data reconstruction?

## Non-Authority Statement

CFA-02 does **not** have authority to decide for other CFAs:

- what a World object or relationship means;
- what semantic equivalence or correspondence means;
- what a capability or provider realization means;
- what account/session/provider semantics mean;
- what Work, Attempt or Outcome means;
- whether an action is authorized;
- how the UI/surface should represent a thing;
- what Ω law should say;
- how the Architecture Steward graph should represent the architecture;
- whether a new CFA should exist;
- whether a cross-CFA conflict is resolved.

CFA-02 may **investigate, characterize, recommend, challenge, record and escalate** data-boundary consequences.

When a peer-side semantic decision is required, CFA-02 records the dependency and routes the question rather than silently deciding it.

## Evidence Index

| Source | Relevant evidence | Use in this declaration |
|---|---|---|
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/ROUND-1-BOUNDARY-BOOTSTRAP.md` | Round-1 objective and required declaration structure | Governing procedure for this artifact |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/ROUND-1-CFA-MATRIX.md` | CFA-02 assigned seams: World, Capability, Work | Scope limiter for this round |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/BOUNDARY-PROTOCOL.md` | Epistemic states, ownership dimensions, handoff/challenge rules | Classification and boundary discipline |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/README.md` | Steward mission and non-responsibilities | Parent relationship / non-authority basis |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/OWNERSHIP-MAP.md` | Steward owns coherence layer, not underlying technical truth | Prevents graph/architecture ownership leakage |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/CANONICAL-MODEL.md` | OBJECT, WORK, EVIDENCE, CAPABILITY, REALIZATION; multidimensional ownership | Shared vocabulary for seam mapping |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/CORE-AGENT-SEED.md` | Current CFA-02 identity, essence, central invariant and non-ownership | Primary identity evidence |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/README.md` | Data Steward working name, provisional status, mission | Current-state identity |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/STATE.md` | Current state, mission, invariants, open questions, priority corridors | Current CFA-02 operating baseline |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/BOUNDARY-DESIGN.md` | Data corridor model and multidimensional boundary card | Local boundary methodology |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/BOOTSTRAP-GAP-AUDIT.md` | Atomicity, binary content, lifecycle, distribution, reconciliation, projection, disclosure and Product Instance gaps | Current continuity blind spots |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/OPERATING-BASELINE.md` | Read/write/round-trip disciplines and identity/transformation rules | Operating constraints |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/PEER-RELATIONSHIP-ATLAS.md` | Prior CFA-02 peer seam model | Existing peer hypothesis, not agreement |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/EXIT-INTERVIEW-EXTRACTION.json` | Refined Data Steward remit and anti-bloat posture | Bootstrap closure context |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/STATE.md` | CFA-01 provisional World boundary, identity/correspondence distinctions, current open seam | Peer-side evidence |
| `docs/destination/DATA-MEMORY-CONTEXT-RECONCILIATION.md` | Source→canonical→relationship/representation→memory→context→Work loop | Product data lifecycle evidence |
| `docs/destination/world-object-core/CONTENT-STORAGE.md` | Object/source/content identity separation | World↔Data identity seam |
| `docs/destination/world-object-core/EXPORT-RESTORE.md` | Canonical refs, relationships, source identities, tombstones, restore order | Reconstruction continuity |
| `docs/migration/PROVIDER_DATA_MODEL.md` | Provider realization/account/stream/conversation/evidence layers | Capability↔Data seam |
| `docs/migration/VIVIM_TO_OMEGA_MAPPING.md` | Provider→Ω mappings and adapter requirements | Provider/data transformation evidence |
| `docs/destination/system-intelligence/STATE.md` | Current account/session, provider-browser proof, Work and world frontiers | Current uncertainty map |
| `omega-baseline/omega-final/docs/decisions/D-378-vault-index-probe.md` | Message/index critical section, crash window, retention/index behavior | Atomic mutation and projection evidence |
| `omega-baseline/omega-final/docs/decisions/D-432-vault-durability.md` | Journaling, crash recovery, migration, compaction, export/import and explicit refusal states | Durable data continuity evidence |
| `omega-baseline/omega-final/docs/VAULT-NAMESPACES.md` | Namespace owner/writer/revision/retention model, durable Work and chat records | Canonical persistence/lifecycle evidence |
| CFA-05 bootstrap `LAUNCH-PROMPT.md` | Intended Work, attempts, recovery, outcomes and background continuity scope | Peer-side Work evidence |
| CFA-06 bootstrap `LAUNCH-PROMPT.md` / README | Intended capability/provider/realization scope | Peer-side Capability evidence |

## Closing position

This declaration is **CFA-02's current claim only**.

It establishes where I believe the data continuity boundary sits for Round 1:

> **World owns meaning; Capability owns capability/provider realization; Work owns execution semantics; Data Steward owns the continuity of durable information as it passes through all three.**

That statement is intentionally one-sided until the peer declarations are compared. Any apparent agreement above must therefore be treated as **PROVISIONAL** until the Architecture Steward performs the cross-CFA reconciliation.
