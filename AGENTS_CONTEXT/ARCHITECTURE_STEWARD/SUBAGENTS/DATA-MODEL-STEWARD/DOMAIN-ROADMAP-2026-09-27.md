# CFA-02 — Strategic Domain Roadmap
## 2026-09-27 — Independent Strategic Roadmap Round 1

> Status: PROPOSED — CFA LOCAL WORKING ROADMAP
> CFA: CFA-02 — Data / Identity / Persistence
> Identity: Data Steward
> agent_id: data-model
> Planning authority: CFA-local strategic planning; subject to Ω law, owner alignment, and later Steward reconciliation.
> Independence: first-pass roadmap formed without consuming new Round-1 peer roadmaps.

## Strategic Objective

Make VIVIM's durable data plane capable of preserving user-owned meaning and reconstructing it across the full lifecycle of observation, transformation, representation, persistence, exchange, realization, failure, replacement and evolution.

A successful CFA-02 realization makes these properties demonstrable:

source / observation → captured representation → parsed / aligned / repaired representation → explicit identity correspondence → canonical durable record + revision → evidence / provenance → derived projections → external translation / write-back → re-observation / reconciliation

without silently collapsing:
- semantic identity into record identity;
- provider/source identity into canonical identity;
- persistence into authority;
- representation into meaning;
- projection into canonical data;
- confidence into proof;
- external write success into verified external truth;
- unknown into failure.

The strategic endpoint is continuity that can be traced, falsified, reconstructed and survived under change, not a universal schema or a second global data store.

## Responsibility Frontier

CFA-02 owns:
- durable canonical record identity and revision continuity;
- persistence and reconstruction;
- lineage and genealogy;
- canonical-vs-derived durability classification;
- data-bearing transformation contracts;
- source/provider ↔ canonical mappings;
- durable evidence/provenance references;
- continuity implications of Work, Authority, Capability, World, Experience and Evolution seams.

CFA-02 does not own:
- World meaning or semantic correspondence;
- Intent/Plan meaning;
- live authority decisions;
- Work semantics/lifecycle;
- provider/capability semantics;
- surface semantics;
- composition/Forge semantics;
- migration/compatibility policy;
- Ω runtime constitutional law.

Shared boundaries remain unactivated unless separately ratified.

## Current Evidence / Maturity

### Strong current evidence — OBSERVED / CURRENT
- Ω vault is the durable persistence spine; World/mind/context/search/layout are not justified as competing canonical stores.
- Product Instance is characterized as a durable identity/lifecycle boundary over one user-owned vault.
- World/Data Round-2 reconciliation keeps semantic meaning distinct from durable record identity and requires explicit lineage for merge/split decisions.
- Authority Round-2 reconciliation provides a minimum durable citation payload while keeping live authorization at the authority gate.
- Semantic Continuity Round-2 reconciliation accepts explicit semantic↔record/revision/evidence/representation relations rather than a universal identifier.
- Ω evidence includes vault round-trip, append durability, provider-browser fixtures and live-substrate design; owner-side live provider execution and full Product Instance proof remain incomplete.
- Legacy VIVIM contains useful source identity, conversation/message identity, import, parser, deduplication and provider-observation evidence, but those mechanisms are historical inputs, not destination authority.

### Strategic gaps — UNKNOWN / CURRENT
- Exact universal durable envelope across all object classes.
- Corridor-tested minimum continuity payload for consequential transformations.
- Exact physical storage/join for AuthorityCitation.
- Exact merge/split lineage vocabulary and temporal semantics.
- Durable relation vocabulary broad enough for real corridors without becoming a second ontology.
- Full export/restore of installed Product Instance, including trust/key portability.
- Provider replacement proof with a real external account and preserved canonical genealogy.
- Complete Intent → Work → Outcome → Evidence durable linkage.
- Whether any corridor justifies a universal Event/State primitive.

## Conceptual Roadmap

### M1 — Establish the Data Continuity Contract and Evidence Model

**Conceptual outcome**
A small, explicit continuity contract exists that can describe a datum as it crosses source, transformation, canonical, evidence, projection and external-realization boundaries without requiring a universal object schema.

**Why it matters**
Without a minimum contract, each corridor will invent its own identity/lineage vocabulary and Data will become either a storage-specific abstraction or a hidden second ontology.

**Evidence basis**
- CORE-AGENT.md identity ladder and continuity invariant.
- BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md RP-04/RP-05/RP-06.
- CORE-TOOL-DESIGN.md Continuity Dossier concept.
- docs/destination/system-intelligence/pass-3/DATA-WORLD-DESIGN.md object/relationship and restore candidates.
- Ω vault/evidence decisions and existing identity/revision substrate.

**Current maturity**
DESIGN IS STRONG; corridor-tested minimum is not yet proven.

**Design choices still open**
1. Minimum continuity payload versus per-domain richer envelopes.
2. Typed relation vocabulary versus corridor-local links.
3. Where epistemic state, transformation version and information-loss declarations live.
4. How to expose reconstruction basis without making a universal graph/store.
5. Which parts are canonical durable data versus derived diagnostic output.

**Success criteria**
- Design: a minimal, domain-neutral continuity vocabulary can represent identity, revision, provenance/evidence, transformation, derivation basis, uncertainty/loss and reconstruction references without owning peer semantics.
- Implementation: none required for milestone completion.
- Integration: at least two distinct existing corridors can be mapped to the contract without adding a second canonical store.
- Live/external proof: not required yet; this milestone must explicitly mark live proof as deferred.
- Product proof: a reviewer can trace a representative object across representations and explain what survives a projection loss.

**Falsifiers / failure conditions**
- The contract requires provider-specific semantics.
- Every corridor requires a custom identity system.
- The contract implies stored data is automatically authoritative.
- A proposed field cannot be assigned a clear owner or evidence basis.
- A universal Event/State or ontology layer is required only to make the contract work.

**Prerequisites**
Current owner alignment, Ω vault/evidence law, Round-2 boundary agreements.

**Dependencies**
Primarily evidence and peer-contract dependencies; no implementation dependency should be assumed.

**Candidate implementation later**
data.continuity.trace@1 as a bounded, read-oriented lens; schema/round-trip validators only where a real corridor justifies them.

**Explicit unresolved**
AuthorityCitation physical join, full Event/State universality, complete merge/split semantics.

#### Peer Intelligence Gate — M1
| Peer CFA | Intelligence / evidence needed | Why the milestone depends on it | Exact decision it informs | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-01 World | Canonical semantic identity/correspondence rules and canonical-vs-derived World field distinctions | Prevent Data contract from absorbing World meaning | Which identity/relation fields are references versus Data-owned durable state | Current boundary contract + one concrete object/relationship example | HIGH-VALUE |
| CFA-03 Semantic Continuity | Required semantic↔record/revision/evidence/representation relation semantics and information-loss handling | Prevent identity ladder from collapsing semantic continuity into record identity | Current Round-2 accepted relation pattern + one falsifiable example | HIGH-VALUE |
| CFA-04 Authority | Minimum historical AuthorityCitation payload and live-vs-historical distinction | Data must preserve reconstructability without making authorization a data decision | Which authority references are mandatory for consequential mutation reconstruction | Current citation contract plus one gate/result reconstruction example | BLOCKING |
| CFA-09 Evolution | Rules for revision, replacement, migration and lineage preservation | Data continuity depends on future change semantics | What lineage must survive merge/split/migration/replacement | Current lifecycle/replacement boundary + one failure case | HIGH-VALUE |
| CFA-10 Runtime | What runtime durability/integrity guarantees can be trusted as substrate facts | Avoid encoding unproven runtime assumptions into durable contracts | Which durability/recovery facts may be treated as substrate guarantees | Existing tested vault invariants; no speculative runtime promise | CONTEXTUAL |

### M2 — Prove a Real Acquisition / Normalization Corridor

**Conceptual outcome**
One real provider conversation corridor demonstrates that observation can be transformed into canonical durable records while preserving provider identity, canonical identity, evidence and parser/translation lineage.

**Why it matters**
This is the first empirical test of whether the continuity model works on reality rather than documents.

**Evidence basis**
- Existing provider-browser fixtures and parser evidence.
- Legacy ChatGPT/Claude/Gemini conversation import evidence.
- Ω provider-browser and parser-pin decisions.
- Current Data priority target: provider observation → parser → canonical conversation/message → evidence → projections.

**Current maturity**
FIXTURE / CODE evidence is strong; authenticated owner-machine/live proof is incomplete.

**Design choices still open**
1. Conversation/message canonical envelope.
2. Stable source identity mapping and repeated-observation/deduplication behavior.
3. Parser version/pin and information-loss representation.
4. Exact evidence granularity for imported messages and stream observations.
5. Whether provider-specific fields become durable extensions or remain source evidence.

**Success criteria**
- Design: provider identity and canonical identity are explicitly distinct.
- Implementation: existing mechanisms can carry the required lineage or clearly expose the missing seam; no production refactor is inferred from fixture success alone.
- Integration: observation → parser → canonical record → evidence → derived projection can be traced end to end.
- Live/external proof: one owner-machine authenticated provider run captures a real conversation and preserves reconstructable lineage.
- Product proof: imported conversation survives a projection/cache loss and remains inspectable without the provider UI.

**Falsifiers**
- Same provider/source ID is required to recover canonical identity after provider replacement.
- Parser output cannot retain enough evidence to explain information loss.
- Duplicate/repeated observations cause silent identity fork or silent overwrite.
- Projection loss destroys canonical conversational history.

**Prerequisites**
M1 decision set sufficient for the corridor; current provider lab fixtures remain usable.

**Dependencies**
CFA-06 provider/account/realization facts are required for source identity and session scope; CFA-03 for semantic continuity; CFA-09 for replacement/retention implications.

**Candidate implementation later**
A bounded continuity trace mode over the existing vault/parser/evidence facilities, followed only if the corridor proves the need.

**Explicit unresolved**
Cross-provider conversation equivalence, all provider-specific extensions, complete account reconnect semantics.

#### Peer Intelligence Gate — M2
| Peer CFA | Intelligence / evidence needed | Why the milestone depends on it | Exact decision it informs | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-06 Capability/Provider | Provider/account/session/resource identity and live observation facts for the selected provider | Data must scope source identity correctly | Source identity key and observation boundary; what is stable vs session-local | Provider Lab observation with explicit account/session scope | BLOCKING |
| CFA-01 World | Conversation/message semantic object and relationship meaning | Data cannot decide what makes a conversation/message the same semantically | Canonical object references and relation boundary | Current World contract plus one message/conversation case | HIGH-VALUE |
| CFA-03 Semantic Continuity | Semantic continuity expectations for imported conversational meaning and parser loss | Defines what must survive transformation | Minimum semantic provenance and loss declarations | One parse/representation continuity example | HIGH-VALUE |
| CFA-07 Composition/Forge | Parser admission/pinning and replacement expectations | Parser is a realization/data transformation, not an authority | Whether parser identity/version is durable basis and where it is admitted | Current Ω parser-pin rules + one replayable fixture | CONTEXTUAL |
| CFA-09 Evolution | Provider replacement and parser evolution lineage expectations | Prevent parser/provider change from rewriting genealogy | What prior parser/source lineage must remain after replacement | One replacement/upgrade scenario | HIGH-VALUE |

### M3 — Establish Cross-Domain Object, Work, Evidence and Write-Back Continuity

**Conceptual outcome**
A consequential object can participate in World, Work, Evidence and external write-back flows while preserving one canonical genealogy and explicit state transitions between local canonical data and external observations.

**Why it matters**
Provider conversation ingestion proves acquisition. VIVIM also needs trustworthy transformation in the other direction: canonical state can be acted upon without turning external realization into canonical authority.

**Evidence basis**
- DATA-WORLD-DESIGN.md canonical object/relationship and Work ref pattern.
- CFA-05 durable Work lifecycle contract.
- CFA-04 AuthorityCitation contract.
- Ω D-411 intent persistence, D-432 durability, invocation/standing/delegation lineage.
- Destination INTERACTION-INTENT-WORK-RECONCILIATION / AGENCY-BACKGROUND-ATTENTION-RECONCILIATION evidence family.

**Current maturity**
DESIGN / partial implementation exists; integrated product proof is not established.

**Design choices still open**
1. Canonical object ↔ Work linkage granularity.
2. Mutation → external effect → re-observation reconciliation record shape.
3. Handling of partial external effects.
4. Evidence linkage between attempted, observed and reconciled state.
5. Boundary between durable canonical object state and Work state.

**Success criteria**
- Design: object, Work, authority citation and evidence identities remain separately addressable.
- Implementation: existing vault/work/authority mechanisms can represent the linkage without duplication.
- Integration: a mutation path can be traced from canonical target through Work and authority to an external effect and subsequent observation.
- Live/external proof: one real external write-back corridor demonstrates that write success alone does not establish external truth.
- Product proof: user can inspect what VIVIM believed, what it attempted, what the external system reported, and what remains unknown.

**Falsifiers**
- Work rows become a duplicate object store.
- External success is treated as canonical confirmation without observation.
- Authority citation is reinterpreted as live permission.
- Failed/partial external effects cannot be distinguished from successful reconciliation.

**Prerequisites**
M1 continuity vocabulary and M2 source identity evidence.

**Dependencies**
CFA-05 Work semantics; CFA-04 authority gate semantics; CFA-06 provider/realization facts; CFA-03 Intent/Plan references.

**Candidate implementation later**
Extend the Data Continuity Lens with Work/effect/reconciliation traversal; validate against one consequential corridor before any broad write-back subsystem.

**Explicit unresolved**
General external reconciliation semantics across arbitrary providers; final Work↔Data storage shape.

#### Peer Intelligence Gate — M3
| Peer CFA | Intelligence / evidence needed | Why the milestone depends on it | Exact decision it informs | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-05 Work | Durable Work/Attempt/Outcome lifecycle and checkpoint/reconciliation semantics | Data must persist linkage without owning Work meaning | Which Work references must be durable and when | Current Work contract + one end-to-end lifecycle | BLOCKING |
| CFA-04 Authority | Gate result, delegation/standing and historical citation semantics | Consequential mutations need reconstructable authority context | Minimum authority refs attached to the mutation/effect lineage | Current Ω authority artifacts + one replayable decision path | BLOCKING |
| CFA-06 Capability/Provider | External effect identity and re-observation coverage | Determines what counts as an external observation | Effect identity and observation/reconciliation join | Provider-side evidence for one write and one observation | BLOCKING |
| CFA-03 Semantic Continuity | Intent/Plan semantic reference and continuity across revisions | Work should point to semantic meaning without absorbing it | Which intent revision/meaning refs are retained | Current Intent contract + revision case | HIGH-VALUE |
| CFA-08 Experience/Surfaces | Which user-visible data/state must remain reconstructable and which is derived | Data design should preserve product-important state without making UI canonical | Durable presentation versus projection boundary | Current surface journey with one restore/rebuild expectation | CONTEXTUAL |

### M4 — Prove Export, Restore, Restart and Executable Replacement Continuity

**Conceptual outcome**
The durable environment survives persistence failure, restart, export/restore and executable replacement with stable logical identity, preserved genealogy and explicitly reconstructed derived state.

**Why it matters**
Sovereign local-first architecture is not proven by local storage alone; it is proven when the user can leave, recover and replace implementation without silently losing meaning.

**Evidence basis**
- Product Instance research: durable identity/lifecycle boundary over vault.
- Current Ω vault export/import and durability decisions.
- Destination Product Instance failure matrix.
- DATA-WORLD-DESIGN.md export/restore sequence.
- Destination J8 and VS8 expectations.

**Current maturity**
VAULT-LEVEL evidence strong; full installed-environment recovery is not proven.

**Design choices still open**
1. Product Instance export wrapper versus raw vault archive.
2. Identity-preserving restore versus explicit restore ceremony.
3. Trust-key portability/rebinding and key-management boundary.
4. Durable presentation restore semantics.
5. Compatibility gates between instance, vault, composition and executable.
6. Which runtime materializations are disposable.

**Success criteria**
- Design: canonical data, durable instance metadata and regenerable projections are clearly separated.
- Implementation: existing vault round-trip remains the lower-level mechanism; no second persistence engine is required.
- Integration: Product Instance metadata, canonical data, activation/configuration references and projection invalidation form one recoverable journey.
- Live/external proof: owner-machine kill/restart, export/wipe/restore and executable replacement tests preserve logical instance and canonical lineage.
- Product proof: the user can recover the same logical environment without depending on the original process or UI projection.

**Falsifiers**
- Restore requires copied runtime/process state.
- Projection corruption forces canonical data mutation.
- Executable replacement creates a new instance identity.
- A valid signed composition can silently activate when incompatible with the existing instance.
- Export omits information needed to reconstruct canonical relationships or durable configuration.

**Prerequisites**
M1–M3 continuity and object lineage evidence.

**Dependencies**
CFA-09 compatibility/change semantics; CFA-10 runtime durability; CFA-07 composition compatibility; CFA-08 durable presentation boundary; owner decisions for trust/key portability where required.

**Candidate implementation later**
Product Instance continuity checks plus an extended Continuity Lens export/recovery mode, after evidence validates the exact wrapper shape.

**Explicit unresolved**
Cryptographic key portability/rebinding, exact installed-product export package, multi-device synchronization/merge.

#### Peer Intelligence Gate — M4
| Peer CFA | Intelligence / evidence needed | Why the milestone depends on it | Exact decision it informs | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-09 Evolution | Compatibility, migration, rollback and replacement rules | Recovery must distinguish compatible replacement from incompatible change | Pre-activation compatibility gate and lineage retention | One migration/replacement falsifier plus lifecycle contract | BLOCKING |
| CFA-10 Runtime | Proven recovery/durability guarantees and runtime restart boundaries | Data must not promise stronger persistence than runtime provides | Which runtime state is durable versus ephemeral | Existing vault/recovery tests and runtime constitution | HIGH-VALUE |
| CFA-07 Composition/Forge | Composition verification/activation and replacement compatibility boundaries | Active configuration references must be recoverable without making Compose/Data one authority | What composition refs/digests are durable instance state | Current Ω recipe/activation proof | HIGH-VALUE |
| CFA-08 Experience/Surfaces | User-authored durable presentation state versus disposable projection | Restore must preserve intended user-facing continuity without canonizing UI | Which presentation artifacts are durable and how they recover | Current surface/lifecycle contract + restore expectation | CONTEXTUAL |
| CFA-04 Authority | Trust/rebinding implications for historical authority evidence | Restore must preserve history without fabricating current authority | Which authority refs survive restore and what remains historical | Existing durable authority artifacts + restore scenario | CONTEXTUAL |

### M5 — Make Continuity Adaptive Under Provider, Schema and Implementation Evolution

**Conceptual outcome**
CFA-02 can detect and preserve continuity through source/provider replacement, schema evolution, parser replacement, projection rebuild and bounded migration without rewriting history or confusing compatibility with identity.

**Why it matters**
The Data Steward's central invariant is about change. The destination must continue to work when providers, implementations, representations and architecture evolve.

**Evidence basis**
- CFA-09 change/compatibility role.
- Product Instance executable replacement and interrupted migration failure matrix.
- Ω migration/recipe evolution and provenance linkage.
- Legacy provider/parser replacement evidence.
- Current Data failure signals around migration, projection, lineage and replacement.

**Current maturity**
CONCEPTUAL; corridor-level evidence is insufficient.

**Design choices still open**
1. Identity-preserving source replacement versus explicit remapping.
2. Migration lineage representation and rollback boundaries.
3. Lossy transformation declarations.
4. How stale/unknown/conflicted continuity states propagate.
5. Whether continuity checks run at ingest, migration, restore, or all of them.

**Success criteria**
- Design: change classes (provider, parser, schema, runtime, projection) have distinct continuity tests.
- Implementation: only bounded mechanisms supported by prior corridors are added.
- Integration: at least one source replacement and one migration can be replayed with history preserved.
- Live/external proof: real provider/implementation replacement retains canonical genealogy and exposes unknowns where correspondence cannot be proven.
- Product proof: users can see that their history survived a system change and which parts require reconnection/recovery rather than silent conversion.

**Falsifiers**
- Replacement forces new canonical identity when continuity is actually preservable.
- Migration drops old revisions or provenance.
- Lossy transforms present outputs as equivalent.
- Stale projections rewrite canonical data.
- A change is marked compatible only because it boots.

**Prerequisites**
M1 continuity contract, M2 real acquisition, M3 mutation/effect tracing, M4 recovery proof.

**Dependencies**
CFA-09 is primary; CFA-06 provider realization replacement facts; CFA-07 composition update semantics; CFA-10 runtime compatibility; CFA-01/CFA-03 semantic continuity for meaning-level preservation.

**Candidate implementation later**
Evolution-aware Continuity Lens impact/reconstruction modes and migration round-trip validators.

**Explicit unresolved**
Full multi-device synchronization/merge, universal semantic equivalence, automatic correspondence promotion without proof.

#### Peer Intelligence Gate — M5
| Peer CFA | Intelligence / evidence needed | Why the milestone depends on it | Exact decision it informs | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-09 Evolution | Change classes, compatibility gates, migration/rollback semantics and replacement policy | Data continuity under change cannot be defined unilaterally | Which changes preserve identity vs require remap/migration | Current evolution contract + representative replacement/migration tests | BLOCKING |
| CFA-06 Capability/Provider | Provider replacement/re-discovery and external identity behavior | Source identity must survive provider implementation changes where semantically valid | Source↔canonical remapping versus preserved mapping | Live provider replacement evidence | BLOCKING for provider replacement |
| CFA-07 Composition/Forge | Plugin/recipe replacement and pin/activation lineage | Data needs to know when implementation replacement is safe | Which composition references are part of continuity evidence | Composition replacement replay | HIGH-VALUE |
| CFA-10 Runtime | Runtime protocol compatibility and durable-state limits | Prevent compatibility claims from outrunning runtime guarantees | What runtime changes can be transparent to data | Runtime compatibility evidence | HIGH-VALUE |
| CFA-01 World | Meaning-preserving merge/split/correspondence outcomes | Data records lineage but cannot decide semantic sameness | When mapping may be preserved versus a new canonical subject required | One semantic merge/split case with explicit decision | HIGH-VALUE |
| CFA-03 Semantic Continuity | Meaning continuity under representation change and loss | Determines whether record continuity preserves enough semantics | Whether a transformed representation remains semantically reconstructable | One lossy and one lossless continuity case | HIGH-VALUE |

## Dependency Model

### Confirmed / structurally required candidates
| Dependency | Kind | Status | Why it exists | Evidence to confirm/falsify |
|---|---|---|---|---|
| CFA-04 Authority → Data | authority/data/evidence | CURRENT | Data must preserve historical authority citation for consequential mutations | Authority citation reconstruction succeeds without Data evaluating permission |
| CFA-05 Work → Data | execution/data | CURRENT | Work semantics live elsewhere; durable linkage lives in Data | Work lifecycle can be traced via durable references |
| CFA-06 Provider → Data | realization/data | CURRENT | Source/provider/account/session scope affects identity mapping | One live acquisition corridor with stable scope |
| CFA-09 Evolution → Data | lifecycle/data | CURRENT | Migration/replacement semantics determine continuity constraints | Replacement/migration falsifier preserves history |
| CFA-01 World → Data | semantic/data | CURRENT | World decides meaning; Data persists mappings and revisions | Concrete semantic object/relationship cases |
| CFA-03 Semantic Continuity → Data | semantic-continuity/data | CURRENT | Meaning continuity needs durable references to survive representation change | Lossless/lossy continuity examples |
| Ω Vault → Data | runtime/platform/data | CURRENT | Durable persistence substrate already exists | Vault round-trip/recovery evidence |
| CFA-10 Runtime → Data | runtime/platform | TARGETED | Data contracts must align with proven durability/recovery guarantees | Runtime/recovery tests |

### Preferred but not yet confirmed
- CFA-07 composition replacement references within Product Instance state.
- CFA-08 durable presentation-state classification.
- Cross-CFA shared continuity lens output schema.

Peer requests in this roadmap do not automatically create new architectural dependencies; they become confirmed only through reconciliation or direct evidence.

## Tooling / Substrate
| Strategic need | Tool/substrate | Status | Purpose |
|---|---|---|---|
| Trace identity/lineage/reconstruction | Data Continuity Lens data.continuity.trace@1 | PROPOSED; needs small bounded realization after M1 | One read-oriented instrument instead of a fleet of data-specific subsystems |
| Corridor replay | Existing fixtures/replay plus provider lab | ALREADY EXISTS / EXTEND AS NEEDED | Reproduce acquisition/transform/effect cases |
| Vault integrity/round-trip | Ω vault + existing verification/export/import | ALREADY EXISTS | Prove durable storage and reconstruction lower layer |
| Deterministic continuity validation | Small validators/round-trip checks | NEEDS SMALL EXTENSION | Detect identity/lineage loss and lossy transformations |
| Evidence capture | Existing Ω evidence/vault journaling | ALREADY EXISTS | Preserve basis and reconstruction references |
| Graph impact inspection | Architecture graph + derived indexes | ALREADY EXISTS | Diagnose dependency/projection impact; not a second data store |
| Live provider proof | Provider Laboratory / authenticated Chrome substrate | ALREADY EXISTS / LIVE EXECUTION INCOMPLETE | Validate source identity and external observations |
| Migration/chaos testing | Targeted kill-point/recovery harnesses | NEW TOOL JUSTIFIED ONLY AFTER M4 DESIGN | Falsify continuity under interrupted migration/restart |
| Multi-device sync substrate | None yet | NOT YET NEEDED | Do not prebuild before restore/replacement evidence establishes need |

## Peer Intelligence Gates — Cross-Milestone Consolidation
The recurring information requests are deliberately staged:
1. Meaning and semantic identity: CFA-01 and CFA-03 provide meaning-level rules; Data persists the relations.
2. Authority reconstruction: CFA-04 supplies durable citation semantics; Data never becomes the permission engine.
3. Work continuity: CFA-05 supplies Work lifecycle semantics; Data supplies durable linkage.
4. Realization/source identity: CFA-06 supplies provider/account/session/effect facts.
5. Change/replacement: CFA-09 supplies compatibility/migration semantics.
6. Runtime guarantees: CFA-10 defines the substrate claims Data may safely rely on.
7. Composition state: CFA-07 clarifies durable activation/replacement references.
8. User-facing durability: CFA-08 identifies durable presentation state versus disposable projection.

## Strategic Decision Gates
### Gate G1 — Is the continuity vocabulary small enough?
Decision: whether a minimal continuity contract can cover multiple corridors without becoming a universal ontology.
Open alternatives: small typed relation envelope; corridor-specific contracts with a common reference core; broader universal object envelope.
Owner of decision: CFA-02, informed by World/Semantic/Authority/Evolution evidence and later Steward reconciliation.
Owner intent required: YES if choosing a scope that changes shared architectural boundaries.
Falsifier: two independent real corridors require incompatible core identity/lineage primitives.

### Gate G2 — What is canonical?
Decision: for each corridor, which records are canonical, which are evidence/representations, and which are derived.
Owner: domain semantic owner for meaning; CFA-02 for durable classification/continuity representation.
Owner intent: YES when ambiguity changes canonical data ownership.
Falsifier: the same datum is simultaneously required to be canonical by two unrelated authorities.

### Gate G3 — What must survive transformation?
Decision: minimum identity/lineage/provenance/derivation payload for each consequential transform.
Owner: CFA-02 at the data seam, with peer inputs.
Owner intent: YES if retention/storage cost or durable history policy changes materially.
Falsifier: reconstruction fails even though the declared minimum payload was preserved.

### Gate G4 — When is external state considered reconciled?
Decision: how a local canonical mutation relates to external effect observation.
Owner: CFA-05/CFA-06/CFA-04 at their respective seams; CFA-02 records the linkage.
Owner intent: YES where user-visible claims about external truth are affected.
Falsifier: a write path can report a successful external outcome without a truthful observation boundary or explicit UNKNOWN.

### Gate G5 — Can a change preserve identity?
Decision: whether provider/parser/schema/runtime replacement preserves canonical identity or requires remapping/migration.
Owner: CFA-09 for change semantics; CFA-01/CFA-03 for meaning; CFA-02 for durable lineage.
Owner intent: YES when a replacement could change user-visible identity/history.
Falsifier: a supposedly compatible change cannot reconstruct prior genealogy.

## Product / Strategic Consequences
- Users can bring external data into VIVIM without provider identity becoming permanent product identity.
- Imported AI conversations can remain useful even when parsers, provider UIs or projection layers change.
- The world/canvas can remain disposable as a representation while durable data survives.
- Work and external write-back can become inspectable rather than opaque; VIVIM can distinguish attempted, observed, reconciled and unknown states.
- Export/restore can become a genuine sovereignty property rather than a database backup story.
- Provider replacement can preserve user history rather than forcing re-import as a new identity.
- Product Instance lifecycle can be backed by durable records without creating a second world database.
- Architecture Steward graph/context can remain derived while pointing back to durable canonical identities and revisions.

These consequences do not make CFA-02 the product owner; they describe what data continuity enables at the product boundary.

## Deferred / Do Not Do
- Do not build a universal runtime graph database.
- Do not introduce a universal Event/State identity model without corridor evidence.
- Do not turn provider IDs into canonical IDs.
- Do not make parser output self-authorizing or unquestioned.
- Do not promote projections/caches/search indexes to canonical data.
- Do not build multi-device sync before export/restore and replacement proofs.
- Do not redesign Work, Authority, World, Capability, Experience, Evolution or Runtime responsibilities.
- Do not create a second authority/ontology/identity registry.
- Do not convert this roadmap into a complete implementation backlog.
- Do not treat Cycle 4 Live Chrome / Accounts as a current Data mandate.

## Relationship to Existing Program Plans
| Existing plan / evidence family | Classification | CFA-02 interpretation |
|---|---|---|
| Destination Build-and-Harvest Plan | ADOPTED WITH MODIFICATION | Use as historical/evidence input; adopt only data-continuity-relevant mechanisms after corridor proof. Harvest is not automatic architectural authority. |
| P1-02 Repository Truth / cleanup | USEFUL INPUT / NOT ADOPTED | Repository truth is necessary evidence hygiene, but CFA-02 does not become its owner or let P1-02 predefine the domain roadmap. |
| P1-03/P1-04/P1-05 data/vault-related work | USEFUL INPUT / NOT ADOPTED | Preserve as evidence and destination linkage; do not inherit as the immediate CFA roadmap sequence without fresh evidence. |
| P1-07/P1-08 provider-browser/live Chrome | ADOPTED WITH MODIFICATION | Use the Provider Lab as empirical source evidence for M2/M5; do not turn provider-browser implementation into the Data abstraction. |
| Destination World Object Core | ADOPTED WITH MODIFICATION | Adopt the semantic/data dimensional split, canonical object/relationship candidates and export/restore principles; keep exact envelope and relation vocabulary corridor-tested. |
| Destination Product Instance Core | ADOPTED WITH MODIFICATION | Treat Product Instance as a durable persistence/lifecycle boundary and M4 proof target; do not create a second world database. |
| Destination Data/Memory/Context Reconciliation | ADOPTED | Use the canonical-data / derived-memory/context distinction and restore/replace continuity direction. |
| Vertical Slice Registry (VS1/VS2/VS5/VS8) | USEFUL INPUT / NOT ADOPTED AS SEQUENCE | Use slices as proof surfaces for arrival, AI history, continuity and exit; they do not become CFA task order automatically. |
| Prior Steward-selected Cycle 4 / Live Chrome-Accounts | DEFERRED | Candidate downstream evidence corridor only; not a current strategic mandate. |
| Core Tool Design — Data Continuity Lens | ADOPTED WITH MODIFICATION | Adopt as the preferred single continuity instrument; exact modes/output fields remain subject to M1/M2 evidence. |
| Legacy VIVIM data/parser/import mechanisms | USEFUL INPUT / NOT ADOPTED AS DESTINATION IMPLEMENTATION | Mine identity, deduplication, parser and source-observation behavior as evidence; reject schema/ORM proliferation as the destination architecture. |

## First Bounded Actionable Task
### DATA-CONTINUITY-CORRIDOR-1 — Evidence-Bound Continuity Contract
**Objective**
Prepare the smallest evidence packet needed to turn M1 from conceptual design into a corridor-testable contract, using one provider conversation acquisition path and one durable object/export path as comparison cases.
**Advances**
M1, with direct feed into M2.
**Dependencies**
- Current Ω vault/evidence artifacts.
- Existing provider conversation/parser fixtures.
- Current Product Instance/object-core evidence.
- M1 peer intelligence is HIGH-VALUE/BLOCKING where already available from ratified repository artifacts; no need to wait for new Round-1 peer roadmaps.
**Peer inputs required**
Use current repository evidence from CFA-01, CFA-03, CFA-04, CFA-06 and CFA-09. New Round-1 peer roadmaps are excluded from first-pass shaping.
**Tooling required**
Repository search/read, existing fixtures/replay, current vault round-trip evidence; no production implementation.
**Write scope**
CFA-02 home only: DOMAIN-ROADMAP-2026-09-27.md, TASKS.md, and future bounded evidence notes only if no existing artifact carries the same semantic purpose.
**Next action**
Map the two comparison corridors into a compact continuity matrix: identity → revision → source/representation → transformation → evidence → projection → reconstruction, labeling each cell OBSERVED / DERIVED / PROPOSED / UNKNOWN and CURRENT / STALE / UNRESOLVABLE.
**Completion condition**
A reusable evidence-backed M1 contract candidate exists, with every proposed field tied to at least one corridor and every unresolved field explicitly preserved.
**Stop condition**
Stop before implementation if the evidence shows a semantic ownership conflict, an Ω-law collision, or that the common contract requires a universal ontology/identity system.

## Evidence Index
1. AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/CORE-AGENT.md
2. AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/STATE.md
3. AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/BOUNDARY-DESIGN.md
4. AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md
5. AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/CORE-TOOL-DESIGN.md
6. omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md
7. omega-baseline/omega-final/docs/BUILD-DECISIONS.md
8. docs/destination/system-intelligence/pass-3/DATA-WORLD-DESIGN.md
9. docs/destination/product-instance-core/PRODUCT-INSTANCE-CORE-RESEARCH.md
10. docs/destination/product-instance-core/STATE.md
11. docs/destination/product-instance-core/INSIGHTS.md
12. docs/destination/world-object-core/OBJECT-TAXONOMY.md
13. docs/destination/world-object-core/STATE.md
14. docs/destination/DATA-MEMORY-CONTEXT-RECONCILIATION.md
15. docs/destination/BUILD-AND-HARVEST-PLAN.md
16. docs/destination/VERTICAL-SLICE-REGISTRY.md
17. docs/destination/RECONCILIATION-MAP.md
18. Relevant CFA-01, CFA-03, CFA-04, CFA-05, CFA-06, CFA-07, CFA-08, CFA-09 and CFA-10 ratified/boundary artifacts, read only for current seam evidence.

## Roadmap Integrity Notes
- This is the CFA-02 first-pass strategic model, not central Steward synthesis.
- New Round-1 peer roadmaps were not consulted.
- Existing peer boundary records are used only as current repository evidence.
- Peer requests are not treated as automatic dependencies.
- No production implementation is authorized by this document.
- Ω law is unchanged.