# CFA-02 Data Steward — Round-2 Reconciliation Addendum

> Date: 2026-09-27
> Classification: CFA-02 current reconciliation claim; identity remains PROVISIONAL / FOUNDATION-SEEDED
> Basis: repository main as inspected after CFA-01, CFA-03 and CFA-04 Round-2 addenda
> Evidence labels: OBSERVED / DERIVED / PROPOSED / UNKNOWN / CONFLICTED
> Freshness: CURRENT / STALE / UNRESOLVABLE where material.

This addendum reconciles seams only. It does not ratify CFA-02, define World ontology, define Authority semantics, define Semantic Continuity semantics, activate shared boundaries, or modify Ω law.

## Round-2 posture

**OBSERVED / CURRENT:** CFA-01 keeps World meaning, semantic identity/correspondence and relationship meaning distinct from durable canonical record identity, revision and persistence.

**OBSERVED / CURRENT:** CFA-03 keeps semantic continuity and semantic references distinct from durable record, revision, evidence and representation identities.

**OBSERVED / CURRENT:** CFA-04 defines a durable authority citation as historical reconstruction data while live authorization remains a gate-time Authority decision.

**DERIVED / CURRENT:** CFA-02 can close the data side of the three seams by preserving explicit mappings, lineage, revision and historical authority citations without turning Data into World, Semantic or Authority.

## RP-04 — CFA-02 Data ↔ CFA-01 World

### Dimensional crosswalk

**PROPOSED / CURRENT — AGREED WITH CFA-01:** The World/Data boundary is dimensional rather than a single ownership line.

| Subject | Data owns | World owns | Durable crossing | Unknown/conflict |
|---|---|---|---|---|
| Semantic identity | Persist mappings from semantic refs to durable records; never redefine semantic meaning | Define semantic identity and semantic sameness/difference | semanticRef ↔ recordRef with evidence/lineage | No universal semantic identity model is justified |
| Correspondence | Durably record status, basis and lineage | Decide semantic meaning of correspondence | correspondence assertion + evidence/lineage refs | Unknown/disputed status must remain explicit |
| Canonical record identity | Own durable record identity, revision and lifecycle | Consume durable record handle, not ontology | canonical record ref | Envelope varies by object class |
| Revision | Own durable revision history and reconstruction | Interpret semantic effect of revision | recordRef + revisionRef + basis | World freshness vs external timing remains corridor-specific |
| Relationship identity | Own durable relation record identity/revision/lineage | Own relationship predicate/meaning | semantic relation ref + durable relation ref | Predicate vocabulary remains separately governed |
| Merge | Record lineage after a semantic merge decision | Decide whether subjects semantically correspond/merge | merge relation + evidence + affected refs/revisions | Final merge authority/temporal policy remains open with Evolution |
| Split | Record successor genealogy and revisions after a semantic split decision | Decide semantic distinction/continuity requiring split | split relation + evidence + affected refs/revisions | Temporal identity semantics remain open with Evolution |
| Alias | Persist alternate-address → canonical-record mapping and lifecycle | Define what alias means | alias mapping record | Collision/retirement rules remain open |
| Source identity | Own durable source identity and source↔canonical mappings | Distinguish source identity from World identity | sourceIdentity mapping + provenance | Multiplicity/replacement policy varies by corridor |
| Event / State | Persist domain event/state records when chosen | Define domain meaning when Event/State is a World concept | typed semantic ref + durable record ref | No universal primitive is justified |
| Canonical vs derived World fields | Persist canonical fields and derivation basis for derived fields | Define which properties are semantically canonical/derived | field-role + basis/projection refs | Final field inventory is incomplete |

### Merge / split rule

**PROPOSED / CURRENT:** Data must never infer a semantic merge or split solely from matching records, fields, provider IDs, content IDs or transformation success.

For merge: semantic decision → durable merge lineage → surviving/derived record refs + prior history.

For split: semantic decision → durable split lineage → successor record refs + preserved prior history.

**INVARIANT / DERIVED:** Until a valid semantic decision exists, Data records correspondence as UNKNOWN or CONFLICTED rather than rewriting identity.

### Alias and source identity

**DERIVED / CURRENT:** An alias is an address mapping, not a new semantic identity. Data stores the mapping and lifecycle; World defines its meaning.

**INVARIANT / DERIVED:** Provider/source identity may be replaced, duplicated or remapped without silently replacing canonical World subject identity.

### Event / State

**UNKNOWN / CURRENT:** No evidence justifies a universal Event/State identity layer.

**PROPOSED / CURRENT:** When a domain requires durable Event/State records, Data preserves record identity/revision/lineage while the semantic owner defines meaning.

### Canonical versus derived fields

**PROPOSED / CURRENT:** A durable World field must be classifiable as canonical semantic data or derived data with an explicit derivation basis/revision/projection path. Persisting a projection for performance does not make it canonical.

### Minimum World/Data crossing

```text
World semantic reference + correspondence state + relationship meaning
+ canonical-vs-derived role + lifecycle/merge/split semantic decision
+ source/provenance basis
        ↕
canonical record ref + revision ref + source mappings
+ lineage/reconciliation record + reconstruction basis
```

### RP-04 status

**AGREED / CURRENT — CFA-02 SIDE:** CFA-02 accepts the World-side dimensional crosswalk and anti-collapse rules. Merge/split remain semantic decisions with durable lineage recording; Event/State remains non-universal; canonical-vs-derived classification remains a bounded inventory task.

## RP-05 — CFA-02 Data ↔ CFA-04 Authority

### Minimum durable authority citation

**AGREED / CURRENT — CFA-02 SIDE:** The minimum durable information attached to a consequential data mutation is:

```text
AuthorityCitation
  causationRef
  actorRef
  behalfRef?
  targetRef
  operationRef
  effectRef? / intentRef?
  authorityRef
  scopeRef / scopeDigest
  checkedAt
  authorizationState
  expiryRef? / revocationRef?
  delegationChainRef? / authorityChainDigest?
  evidenceRefs
  resultRef / mutationRef
```

This is a continuity requirement, not a mandate that all values live in one Data record.

### Data versus Authority

**DERIVED / CURRENT:** Data persists enough history to reconstruct who acted, for whom, target, operation/effect, semantic Intent/Plan ref where present, cited authority, scope/time, gate result, mutation/result and evidence linkage.

**OBSERVED / CURRENT:** CFA-04 owns live interpretation of permission, standing, delegation, consent, scope, expiry, revocation and authorization state.

**INVARIANT / DERIVED:** A stored historical AUTHORIZED result is not current permission. Data does not re-evaluate authority semantics to determine whether a new operation is permitted.

### Expiry, revocation and reconstruction

**DERIVED / CURRENT:** Authority grants, standings and delegation chains may expire or be revoked; durable citation history remains so past mutations can be explained.

**PROPOSED / CURRENT:** A reconstructed consequential mutation must answer who acted, for whom, against which target, what operation/effect, under which authority reference and scope/time, what the live gate returned, what mutation/result followed, and what evidence connects them.

### Existing Ω continuity

**OBSERVED / CURRENT:** D-452 provides caller/behalf/op/scope/authority/intent reference and gate-time re-resolution; D-453 provides expiring/revocable standing; D-454 provides vault-recomputed delegation chains and authority-chain digest.

**DERIVED / CURRENT:** Data should reference and preserve those existing authority artifacts rather than establish a parallel authority source.

### RP-05 status

**AGREED / CURRENT — CFA-02 SIDE:** CFA-02 accepts CFA-04’s durable citation contract as the minimum payload for reconstruction. Exact physical storage/join remains an implementation question.

## RP-06 — CFA-02 Data ↔ CFA-03 Semantic Continuity

### Identity / provenance crosswalk

**AGREED / CURRENT — CFA-02 SIDE:** Semantic continuity and durable data continuity should refer to one another through explicit typed relations, never one universal identifier.

| Identity / meaning | Data role | Semantic Continuity role | Crossing relation | Do not collapse into |
|---|---|---|---|---|
| Semantic identity | Preserve durable mappings without redefining meaning | Preserve semantic continuity of meaning/reference | semanticRef ↔ recordRef | record identity |
| Record identity | Own canonical durable record identity | Consume stable record reference | recordRef | semantic identity |
| Intent identity | Persist canonical Intent record/revision where durable | Preserve Intent meaning/continuity | intentSemanticRef ↔ intentRecordRef/revisionRef | authority |
| Revision identity | Own durable revision/history | Interpret continuity across revision change | revisionRef ↔ semanticRef/context | semantic identity |
| Evidence identity | Persist evidence refs/lineage needed for reconstruction | Preserve provenance continuity | evidenceRef ↔ semantic artifact ref | authority |
| Representation identity | Persist durable representation refs when applicable | Track meaning↔representation continuity | semanticRef ↔ representationRef | canonical meaning |
| Event identity | Persist domain event record identity when required | Preserve semantic event meaning across representations | semanticEventRef ↔ eventRecordRef | universal event ID |
| State identity | Persist durable state identity when required | Preserve semantic state meaning | semanticStateRef ↔ stateRecordRef | authorization state |

### Required relation pattern

```text
semanticMeaningRef
   ↕ derives-from / records / represents / evidences / revises
   ↕
recordRef
   ↕
revisionRef
   ↕
evidenceRef
   ↕
representationRef
```

**INVARIANT / DERIVED:** Two artifacts may refer to the same underlying meaning while legitimately carrying different identities because they occupy different planes.

### Event / meaning continuity

**DERIVED / CURRENT:** “Same event” may mean the same semantic event meaning, durable event record, execution attempt, evidence item or representation. Data preserves explicit mappings where durable continuity matters rather than collapsing them.

### Information loss

**PROPOSED / CURRENT:** When a transformation loses information required to reconstruct semantic continuity, Data records the loss/boundary condition rather than silently presenting the output as equivalent.

### RP-06 status

**AGREED / CURRENT — CFA-02 SIDE:** CFA-02 accepts the explicit relation pattern proposed by CFA-03. Exact reusable relation vocabulary and minimum lineage retention are implementation details to validate against actual corridors.

## Evidence basis

### OBSERVED / CURRENT

- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/BOUNDARY-ROUND-1-DECLARATION-2026-09-26.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/BOUNDARY-DESIGN.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/CORE-AGENT-SEED.md`
- `omega-baseline/omega-final/docs/decisions/D-452-invocation.md`
- `omega-baseline/omega-final/docs/decisions/D-453-standing.md`
- `omega-baseline/omega-final/docs/decisions/D-454-delegation.md`

### DERIVED / CURRENT

The three Round-2 seams support one consistent data-continuity posture:

```text
World meaning                != durable record identity
semantic continuity          != durable record identity
live authority decision      != durable authority citation
```

Data keeps the relationships and history reconstructable; it does not absorb endpoint semantics.

### UNKNOWN / CURRENT

- Exact canonical storage envelope for all World object classes.
- Exact merge/split lineage relation vocabulary.
- Exact physical storage/join for AuthorityCitation.
- Exact universal relation vocabulary for semantic↔data continuity.
- Whether any corridor will justify a durable Event/State primitive.

## Unresolved items

1. **UNKNOWN / CURRENT:** Merge/split semantics need later World ↔ Data ↔ Evolution reconciliation before durable mutation rules become implementation commitments.
2. **UNKNOWN / CURRENT:** Event/State remains deliberately non-universal.
3. **UNKNOWN / CURRENT:** AuthorityCitation storage/join shape is not yet fixed.
4. **UNKNOWN / CURRENT:** Canonical-vs-derived World field inventory is not complete.
5. **UNKNOWN / CURRENT:** A corridor-tested relation vocabulary may refine the proposed identity/provenance relations.

## Completion classification

| RP | Status | Rationale |
|---|---|---|
| RP-04 | AGREED | CFA-02 accepts the World-side dimensional crosswalk and anti-collapse rules. |
| RP-05 | AGREED | CFA-02 accepts the minimum durable authority citation and the live-vs-historical distinction. |
| RP-06 | AGREED | CFA-02 accepts the explicit semantic↔record/revision/evidence/representation relation pattern. |

## Human-owner intervention

**NO / DERIVED:** No current evidence requires human-owner intervention for Round-2 completion.

## Completion note

This addendum does not ratify CFA-02, activate shared boundaries, define a universal identity system, define World/Authority/Semantic semantics, or modify Ω law.