# CFA-02 — Continuity Corridor 1 Evidence Packet
## 2026-09-27

> Status: PROPOSED / EVIDENCE-BOUNDED
> CFA: CFA-02 — Data / Identity / Persistence
> Task: DATA-CONTINUITY-CORRIDOR-1-2026-09-27
> Purpose: test the smallest continuity contract candidate against two existing repository corridors without production implementation.
> Independence: no newly-produced Round-1 peer roadmap was used to shape this packet.

## 1. Result
The first-pass evidence supports a small continuity reference core rather than a universal object schema.

Both comparison corridors can be described with the same conceptual spine:

identity → revision / version → source or representation → transformation → evidence / provenance → projection → reconstruction

The evidence does not justify making all corridor-specific fields universal.

### Current M1 conclusion
SUPPORTED / CURRENT

A reusable continuity contract candidate can be centered on:
- identity references;
- revision/version references;
- source/representation references;
- transformation identity/version;
- provenance/evidence references;
- derivation/projection basis;
- epistemic/continuity status;
- explicit information-loss or unknown state;
- reconstruction references.

The contract should be relation-oriented and reference-based, with domain meaning remaining owned by the relevant CFA.

## 2. Contract Candidate
Conceptual shape only; not a production schema:

ContinuityRecord
  subjectRef
  subjectKind
  revisionRef?
  sourceRefs[]
  representationRefs[]
  transformationRefs[]
  evidenceRefs[]
  provenanceRefs[]
  derivationBasisRefs[]
  continuityState
  informationLoss?
  reconstructionRefs[]

### Field status
| Candidate element | Corridor support | Status | Constraint |
|---|---|---|---|
| subjectRef / identity relation | Provider chat + durable object | OBSERVED / CURRENT | Never infer semantic equivalence from record identity |
| revisionRef | Vault chat rev + generic object rev | OBSERVED / CURRENT | Revision identity remains distinct from semantic identity |
| sourceRefs | Provider/session/capture + object source identities | OBSERVED + PROPOSED | Source identity is provenance, not canonical identity |
| representationRefs | Capture rows + projection/materialization refs | OBSERVED + PROPOSED | Representation is not meaning |
| transformationRefs | Parser version/pin + migration/version plan | OBSERVED / CURRENT | Transform must be identifiable and version/basis aware |
| evidenceRefs | Capture integrity/provenance + vault refs/changelog/recovery evidence | OBSERVED / CURRENT | Evidence is not authority |
| provenanceRefs | realizationRef, captureRef, vault refs | OBSERVED / CURRENT | Preserve genealogy through transformations |
| derivationBasisRefs | Mind/world/projection basis + migration census/rollback basis | DERIVED / CURRENT | Derived views must point back to durable basis |
| continuityState | parse/recovery/unknown states across corridors | DERIVED / PROPOSED | Preserve UNKNOWN / CONFLICTED instead of guessing |
| informationLoss | Provider normalization uncertainty + lossy transform gap | PROPOSED / CURRENT | Must be explicit before equivalent-looking output is promoted |
| reconstructionRefs | vault export/import + revision/provenance references | OBSERVED / CURRENT | Reconstruction must be based on durable evidence, not process state |

## 3. Corridor A — Provider Conversation Acquisition
### Path
browser/provider observation → capture/session representation → parser / parser pin → chat conversation/message → provenance / realization references → history / mind / other derived projection → vault export / reconstruction

### Evidence mapping
| Continuity dimension | Repository evidence | Epistemic | Freshness | Finding |
|---|---|---|---|---|
| Identity | ChatConversation.id, ChatMessage.id, conversationId | OBSERVED | CURRENT | Durable record identity exists independently of provider identity |
| Revision | Vault readers return real rev; chat writers return message/conversation revision | OBSERVED | CURRENT | Revision is independently addressable |
| Source identity | ChatMessage.providerId; SessionRecord.providerId, sessionId, captureRef; live descriptor | OBSERVED | CURRENT | Provider/session/capture identity remains separate from canonical chat identity |
| Representation | CaptureRecord.redactedText, integrity hash; SessionRecord.captureRef | OBSERVED | CURRENT | Capture bytes are representation/evidence, not the canonical message |
| Transformation | parserVersion; governed parserPins; provider-browser checks pin coverage before send | OBSERVED | CURRENT | Parser/transform lineage is explicit and governed as data |
| Evidence / provenance | realizationRef, streamRef, captureRef, vault evidence-object pattern | OBSERVED | CURRENT | Provenance is carried instead of discarded |
| Projection | chat.history and existing mind/context/world projections | OBSERVED / DERIVED | CURRENT | Read/projection layers are not canonical message storage |
| Reconstruction | Vault append/revision substrate plus D-432 export/import | OBSERVED | CURRENT | Canonical records can be reconstructed from durable vault state; full installed-product reconstruction remains beyond this corridor |
| Semantic correspondence | Conversation/message meaning versus provider representation | UNKNOWN / DERIVED | CURRENT | Exact cross-provider equivalence remains outside current proof |
| Information loss | Parser normalization boundary is explicit; provider-specific discard inventory is incomplete | UNKNOWN / PROPOSED | CURRENT | Loss must be declared where normalization discards provider-specific data |

### Corridor A conclusion
The corridor already contains almost every element required by the candidate continuity spine.

The strongest actual invariant is:
provider/session/capture identity ≠ canonical conversation/message identity

The parser is a versioned transformation/provenance layer, not canonical truth.

The remaining gap is not another storage system; it is a bounded way to make transformation loss and correspondence state explicit enough for reconstruction.

## 4. Corridor B — Durable Object / Export-Recovery
### Path
canonical object → revisioned vault record → relationship / provenance references → derived world/projection → export → import / restore

### Evidence mapping
| Continuity dimension | Repository evidence | Epistemic | Freshness | Finding |
|---|---|---|---|---|
| Identity | Existing vault (ns,id,rev) model; world-object design candidate adds stable object identity | OBSERVED + PROPOSED | CURRENT | Physical record identity is generic; semantic envelope remains design-stage |
| Revision | Vault object revisions; migration/version rows | OBSERVED | CURRENT | Historical revisions survive independently of current projection |
| Source identity | World-object candidate includes source identities/aliases; provider source records remain distinct | PROPOSED + OBSERVED | CURRENT | Source mapping can be represented without replacing canonical identity |
| Representation | World/WorldModel/mind are derived projections; layout/cache can be rebuildable | DERIVED / CURRENT | CURRENT | Representation can disappear without requiring canonical rewrite |
| Transformation | Vault migrations carry versioned plan/rollback rows; object relationships and projection derivations are explicit candidates | OBSERVED + DERIVED | CURRENT | Transform basis can be preserved without a universal transform store |
| Evidence / provenance | Vault refs, append/changelog, Merkle chain, recovery evidence, badges/retention | OBSERVED | CURRENT | Durability and provenance have one existing substrate |
| Projection | World remains a projection over canonical vault data; weather-pin falsifier passed semantically without type-specific storage | DERIVED / EXPERIMENT-RESULT | CURRENT | Genericity is supported at design level, not yet production-proven |
| Reconstruction | D-432 F-DURABILITY.4 namespace export → wipe → import proves chain verification, seals and retention carry | OBSERVED / VERIFIED | CURRENT | Vault-level reconstruction is proven |
| Installed Product Instance reconstruction | Product Instance research says vault export/import alone is insufficient for full installed environment | OBSERVED / UNKNOWN | CURRENT | Instance identity/config/trust/presentation remain additional continuity work |
| Semantic merge/split | World decides meaning; Data records lineage | PROPOSED / UNKNOWN | CURRENT | No automatic merge/split inference is justified |

### Corridor B conclusion
The repository provides strong lower-level evidence for durable record identity, revision history, provenance refs, export/import, and crash/recovery accounting.

It does not yet provide complete proof for the higher-level Product Instance, activation/configuration, trust/key portability, and presentation reconstruction. Those remain a later M4 boundary.

## 5. Cross-Corridor Minimum Contract
| Requirement | A: Provider chat | B: Object/export | Decision |
|---|---|---|---|
| Explicit canonical subject/reference | YES | YES | INCLUDE |
| Stable revision reference | YES | YES | INCLUDE |
| Source/provenance identity | YES | YES | INCLUDE |
| Representation reference | YES | YES | INCLUDE |
| Transformation identity/version | YES | YES | INCLUDE |
| Evidence reference | YES | YES | INCLUDE |
| Derivation basis | PARTIAL | YES | INCLUDE, reference-based |
| Continuity/epistemic state | PARTIAL | PARTIAL | INCLUDE as explicit status; semantics remain local |
| Information-loss declaration | REQUIRED | REQUIRED for lossy transforms | INCLUDE |
| Reconstruction reference | YES | YES | INCLUDE |
| Universal semantic identity | NO | NO | EXCLUDE |
| Universal Event/State identity | NO | NO | EXCLUDE |
| Provider-specific fields in core | NO | NO | EXCLUDE |
| Second graph/store | NO | NO | EXCLUDE |

## 6. Design Decision
### D-CONT-01 — Reference Core, Not Universal Schema
Status: PROPOSED — CFA-02 local planning decision.

CFA-02 should pursue a small reference-oriented continuity core that links existing domain records, representations, transformations and evidence.

It should not become a second ontology, universal graph database, universal object table, authority store, second work system, or replacement for existing vault namespaces.

### Falsifier
Reconsider if two genuinely independent real corridors require incompatible core continuity primitives rather than merely different domain payloads.

## 7. Remaining Unknowns
1. Exact physical storage of continuity relations.
2. Exact common vocabulary for derives-from / represents / evidences / revises / reconstructs.
3. Minimum information-loss representation.
4. Exact AuthorityCitation join/storage.
5. Meaning-preserving versus identity-preserving merge/split semantics.
6. Full Product Instance export/restore envelope.
7. Real external provider replacement proof.
8. Work/effect/re-observation join for consequential write-back.
9. Whether continuity state should be a single field or typed relation set.
10. Whether a generic continuity lens is needed after corridor proof, versus simpler bounded validators.

## 8. M1 Completion Assessment
M1 — Data Continuity Contract and Evidence Model: CONDITIONALLY COMPLETE FOR DESIGN.

Supported:
- one common conceptual continuity spine across two distinct corridors;
- proposed core fields tied to evidence;
- explicit separation of canonical identity, source identity, representation and authority;
- export/reconstruction basis grounded in existing vault evidence;
- unknowns preserved.

Not supported yet:
- production contract implementation;
- live provider corridor;
- full Product Instance restore;
- generalized external write-back;
- automatic semantic correspondence.

Therefore this task is complete as an evidence/design exercise, not as implementation or product proof.

## 9. Next Required Task
`DATA-M2-PROVIDER-CONVERSATION-CORRIDOR-2026-09-27`

Objective: take the continuity core into one bounded provider conversation corridor using existing replay/fixture mechanisms first, then identify the exact minimum live-proof gap.

Stop before production implementation if fixture and live evidence show that the candidate contract would require provider-specific semantics in its core.

## Evidence Index
1. omega-baseline/omega-final/contracts/src/chat.ts
2. omega-baseline/omega-final/plugins/vivim-chat/src/index.ts
3. omega-baseline/omega-final/plugins/provider-browser/src/session.ts
4. omega-baseline/omega-final/plugins/vivim-vault/plugin.json
5. omega-baseline/omega-final/tooling/gates/test/f-durability.test.ts
6. omega-baseline/omega-final/docs/decisions/D-432-vault-durability.md
7. docs/destination/world-object-core/GENERICITY-FALSIFIER.md
8. docs/destination/world-object-core/STATE.md
9. docs/destination/product-instance-core/PRODUCT-INSTANCE-CORE-RESEARCH.md
10. docs/destination/system-intelligence/pass-3/DATA-WORLD-DESIGN.md
11. AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/DOMAIN-ROADMAP-2026-09-27.md
12. AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/CORE-AGENT.md

## Integrity Notes
- No production implementation was started.
- No Ω law was modified.
- No shared CFA boundary was activated.
- No newly-produced Round-1 peer roadmap was used to shape this packet.
- This evidence packet extends the CFA-local roadmap rather than creating a competing global data model.