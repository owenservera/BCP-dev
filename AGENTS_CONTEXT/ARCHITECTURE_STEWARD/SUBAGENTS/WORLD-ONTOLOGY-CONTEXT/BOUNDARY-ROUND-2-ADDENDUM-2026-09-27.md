# CFA-01 World / Ontology / Context — Round-2 Reconciliation Addendum

> Date: 2026-09-27
> Classification: CFA-01 current reconciliation claim; not yet a shared ACTIVE boundary
> Basis: repository `main` as inspected for Round 2 on 2026-09-27
> Purpose: answer RP-01, RP-03 and RP-04 at the smallest useful World-side seam level without absorbing peer-owned semantics.
>
> Evidence labels used below: OBSERVED / DERIVED / PROPOSED / UNKNOWN / CONFLICTED.
> Freshness is stated as CURRENT / STALE / UNRESOLVABLE where material.

## Round-2 posture

**OBSERVED / CURRENT:** Round-1 reconciliation identified World ↔ Data, World ↔ Semantic Continuity and World ↔ Authority as live reconciliation seams, with shared boundaries still PROPOSED/UNACTIVATED.

**OBSERVED / CURRENT:** CFA-03 defines Semantic Continuity as cross-plane continuity while excluding canonical World ontology/data ownership.

**OBSERVED / CURRENT:** CFA-04 defines authorization/permission semantics while excluding World ontology/existence and canonical identity storage.

**OBSERVED / CURRENT:** CFA-02 defines durable identity, revision, lineage, reconciliation recording and reconstruction continuity while excluding World meaning.

**DERIVED / CURRENT:** The Round-2 World contract should therefore expose domain meaning, reference/identity correspondence, presence/projection state and evidence, while leaving semantic continuity, durable representation and authorization decisions to their owning peers.

---

## RP-01 — World ↔ CFA-03 Semantic Continuity

### Question

What exact World-side reference/result should be returned for resolved, ambiguous, stale, unresolvable and conflicted grounding?

### World-side result

**PROPOSED / CURRENT:** The minimum World-side grounding result should be a semantic reference result, not a command result and not an authorization result:

```text
WorldReferenceResult
  subjectRef(s)
  worldMeaning
  resolutionState
  correspondenceState
  evidenceRefs
  sourceRefs
  freshness
  unknowns
  conflicts
  basisRef
```

The fields are semantic seams, not a prescription for CFA-03's internal representation.

#### 1. subjectRef(s)

**PROPOSED / CURRENT:** Zero, one, or several references to World subjects/candidates.

- RESOLVED: one World subject reference may be supplied when the World-side evidence supports a unique referent.
- AMBIGUOUS: multiple candidate references may be supplied when more than one World subject remains plausible.
- STALE: a previously valid subject reference may be supplied together with the stale basis.
- UNRESOLVABLE: no asserted subject reference is required; the result should preserve the failed resolution state and why.
- CONFLICTED: one or more candidates may be supplied, but mutually incompatible World claims/correspondence assertions must remain explicit.

**DERIVED / CURRENT:** A subject reference is a World reference, not a grant of semantic certainty outside its stated resolution state.

#### 2. worldMeaning

**PROPOSED / CURRENT:** The World-side semantic characterization of the referenced subject or candidate(s): kind/type, relevant relationship meaning, identity distinctions, and any bounded World semantics necessary for the peer to interpret the reference.

**INVARIANT / DERIVED:** World meaning and grounding state must remain separate. A result can have a coherent World meaning while being ambiguous, stale or otherwise unresolved as a reference.

#### 3. resolutionState

**PROPOSED / CURRENT:** The minimum state vocabulary is:

| State | World-side meaning |
|---|---|
| RESOLVED | One referent is supported as the current World target under the stated basis. |
| AMBIGUOUS | Multiple candidate referents remain materially plausible. |
| STALE | A prior reference/basis existed, but current freshness is insufficient to treat it as current without qualification. |
| UNRESOLVABLE | The supplied reference cannot currently be mapped to a World subject under the available basis. |
| CONFLICTED | Available evidence/correspondence contains materially incompatible claims that cannot be collapsed safely. |

These states describe grounding/reference status. They do not describe permission or execution outcome.

#### 4. correspondenceState

**PROPOSED / CURRENT:** World may expose whether a reference/candidate correspondence is:

`SUPPORTED | PARTIAL | DISPUTED | UNKNOWN`

**DERIVED / CURRENT:** Correspondence is a semantic claim about relation among identities; it is not proof merely because a matching source ID, label, path, or representation exists.

#### 5. evidenceRefs and sourceRefs

**OBSERVED / CURRENT:** Existing World/Data and Context designs distinguish evidence/provenance, source identity and canonical identity.

**PROPOSED / CURRENT:** A World result should carry references to the evidence/basis that supports the World-side claim and the source identities from which the claim was derived where material.

Evidence references constrain the claim; they do not authorize an action.

#### 6. freshness

**PROPOSED / CURRENT:** Where the result depends on an observation, projection, revision or external basis whose age materially changes interpretation, expose freshness as `CURRENT`, `STALE`, or `UNRESOLVABLE`.

Do not hide stale World knowledge by silently relabeling it current.

#### 7. unknowns / conflicts

**PROPOSED / CURRENT:** Unknowns and conflicts are first-class result information. They must survive the handoff rather than being coerced into a boolean success/failure.

### Minimum World → Semantic handoff

**PROPOSED / CURRENT:**

```text
subjectRef(s)
+ worldMeaning
+ resolutionState
+ correspondenceState
+ evidenceRefs
+ sourceRefs
+ freshness
+ unknowns/conflicts
+ basisRef
```

**DERIVED / CURRENT:** CFA-03 can use this to preserve semantic continuity without importing CFA-01's internal ontology/session machinery.

### What World does not decide

**OBSERVED / CURRENT:** CFA-03 owns continuity of meaning across grounding → interpretation → Intent/Plan → representation.

**PROPOSED / CURRENT:** CFA-01 therefore does not decide the final interpretation of the command, Intent semantics, Work semantics, or authorization.

### RP-01 status

**UNKNOWN / CURRENT:** The World-side contract is sufficiently specified as a peer handoff proposal, but CFA-03 has not yet supplied a Round-2 acceptance/reconciliation statement in the current evidence set. No shared boundary is therefore marked ACTIVE.

**Peer question:** Does CFA-03 accept the above as the minimum World-side semantic reference/result, especially the separation of `worldMeaning`, `resolutionState` and `correspondenceState`?

---

## RP-03 — World ↔ CFA-04 Authority

### Required distinction

The World-side vocabulary must separate what the World says about a subject from what Authority says about a principal's permission to act.

### Minimal crosswalk

| State | World can assert? | Owning dimension | Required basis / constraint |
|---|---|---|---|
| `existent` | **YES, conditionally** | World semantic existence/presence | Evidence/basis sufficient to support existence; absence of observation is not enough to negate existence. |
| `addressable` | **YES** | World addressability | A reference/query can identify or candidate-identify a World subject; addressability is not permission. |
| `visible` | **YES, as projection/view state** | World projection semantics | A subject is included/observable within a stated projection/viewpoint/basis. Omission does not prove nonexistence. |
| `accessible` | **YES, only as a scoped view/projection property** | World + boundary handoff | Means the subject is available within the stated view/read scope; must not be treated as authorization. |
| `authorized` | **NO** | Authority | Live permission/standing/consent/delegation semantics belong to CFA-04. |
| `nonexistent` | **YES, conditionally** | World semantic existence | Requires positive evidence/basis for nonexistence or a domain contract that supports that conclusion; lack of observation is insufficient. |
| `not observed` | **YES** | World epistemic/presence state | Means no supported observation under the stated basis; does not imply nonexistent, inaccessible, or unauthorized. |

### Core invariant

**DERIVED / CURRENT:**

```text
existent       != authorized
addressable    != authorized
visible        != authorized
accessible     != authorized
not_observed   != nonexistent
hidden/omitted != nonexistent
denied         != nonexistent
```

### World-side state model

**PROPOSED / CURRENT:** Treat the states as dimensions rather than one mutually exclusive enum:

```text
World Presence:
  EXISTENT | NONEXISTENT | NOT_OBSERVED | UNKNOWN

Reference:
  ADDRESSABLE | UNRESOLVED | AMBIGUOUS

Projection:
  VISIBLE | OMITTED | VIEW_UNKNOWN

Scoped availability:
  ACCESSIBLE | INACCESSIBLE | SCOPE_UNKNOWN

Authority:
  NOT SET BY WORLD
  → live Authority result owned by CFA-04
```

**DERIVED / CURRENT:** This avoids forcing ontology, epistemic status, projection membership and authorization into one scalar status.

### Required handoff to Authority

**PROPOSED / CURRENT:** World should provide:

```text
worldSubjectRef(s)
+ worldMeaning
+ presenceState
+ addressabilityState
+ projection/view basis
+ accessibilityState (if material)
+ evidenceRefs
+ freshness
+ unresolved/conflicted distinctions
```

CFA-04 then adds its own authority-domain result separately:

```text
principal
+ authority basis
+ scope/time/standing/delegation/consent state
+ live authorization result
+ refusal/escalation/invalidation state
```

**INVARIANT / DERIVED:** The authority result must not rewrite World meaning. A denial must remain a denial; it must not mutate `existent` to `nonexistent`.

### RP-03 status

**UNKNOWN / CURRENT:** The distinction is now explicit enough for peer reconciliation, but CFA-04 has not yet supplied a Round-2 acceptance/reconciliation statement in the current evidence set. The key unresolved point is whether `accessible` is a World projection property, an Authority-derived property, or a composed seam state.

**Peer question:** Does CFA-04 agree that World may report existence, addressability and projection visibility while `authorized` remains exclusively an Authority result, and that `accessible` must never be an implicit synonym for `authorized`?

---

## RP-04 — World ↔ CFA-02 Data

### Dimensional crosswalk

| Subject | World responsibility | Data responsibility | Crossing artifact | Open issue |
|---|---|---|---|---|
| Semantic identity | **OWNS meaning and identity distinctions** | Preserve identity mappings without redefining meaning | semantic identity reference + mapping/lineage refs | Exact merge/split continuity remains unresolved with Data/Evolution. |
| Correspondence | **OWNS semantic correspondence claim** | Record/preserve correspondence evidence and status durably | correspondence assertion + evidence/lineage refs | When correspondence may become canonical durable identity remains unresolved. |
| Canonical record identity | **CONSUMES** | **OWNS canonical durable identity** | canonical record ref `(ns,id)` or peer-defined equivalent | Exact durable envelope for every World object class is not fully reconciled. |
| Revision | **INTERPRETS semantic effect of revision** | **OWNS durable revision/history mechanics** | record ref + revision ref + basis | Relationship among World freshness, data revision and external observation needs further characterization. |
| Relationship identity | **OWNS semantic relationship meaning** | Own durable relationship record identity/revision/lineage | semantic relationship ref + durable record ref | Final predicate vocabulary remains separately governed. |
| Merge | Decide whether World subjects semantically correspond/should be one World subject | Record durable merge event, lineage, predecessor/successor references and reconstructability | correspondence/merge decision + lineage record | Final merge authority across evolution remains unresolved. |
| Split | Decide semantic distinction/continuity of the World subjects | Record durable split lineage, revisions and reconstruction | split decision + lineage record | Temporal semantics and predecessor/successor identity remain unresolved. |
| Alias | Define what alternate address means semantically | Persist alias mapping and canonical target | alias ref → canonical ref | Alias lifecycle and collision rules are not fully reconciled. |
| Source identity | Distinguish external/source identity from World identity | Preserve source identity and source↔canonical mappings | source identity mapping + provenance | Exact source-identity envelope and multiplicity are open. |
| Event / State | Assign domain meaning where an Event/State is actually a World concept | Determine durable record representation, revision/lineage and reconstruction behavior | typed event/state reference + durable refs | No universal Event/State primitive is justified yet. |
| Canonical vs derived World fields | Define which World properties are semantically canonical vs derived | Persist canonical fields and preserve derivation basis for derived fields | field-role metadata + basis/projection refs | Final canonical-field inventory is incomplete. |

### Explicit anti-collapse rules

**DERIVED / CURRENT:**

- Semantic identity `≠` canonical record identity.
- Semantic correspondence `≠` durable mapping mechanics.
- Revision identity `≠` World semantic identity.
- Source identity `≠` local canonical identity.
- Alias/address `≠` object identity.
- Relationship meaning `≠` relationship row identity.
- A successful data transformation `≠` proof of semantic equivalence.
- A derived World field `≠` canonical durable fact unless its basis is explicitly designated as canonical.
- Event/State naming alone `≠` proof of a universal primitive.

### Minimum World ↔ Data handoff

**PROPOSED / CURRENT:**

```text
worldSubjectMeaning
+ semanticIdentity/correspondence state
+ relationshipMeaning
+ canonical-vs-derived field role
+ lifecycle/merge/split semantic meaning
+ required reconstruction semantics
+ evidence/source refs
```

CFA-02 may then supply:

```text
canonicalRecordRef
+ revisionRef
+ sourceIdentityMappings
+ lineage/reconciliation state
+ durability/reconstruction basis
```

The two packages are joined by explicit references; neither package becomes the other's authority.

### RP-04 status

**UNKNOWN / CURRENT:** The dimensional crosswalk is sufficient as a World-side reconciliation proposal, but exact acceptance of merge/split, Event/State and canonical-vs-derived decisions still requires CFA-02 reconciliation.

**Peer question:** For merge/split and canonical-vs-derived World fields, which minimum durable mapping/revision/lineage artifact can CFA-02 guarantee without taking ownership of World semantic correspondence or ontology?

---

## Evidence basis

### OBSERVED / CURRENT

- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/BOUNDARY-ROUND-1-DECLARATION-2026-09-26.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/ROUND-1-RECONCILIATION-2026-09-27.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/BOUNDARY-ROUND-1-DECLARATION-2026-09-26.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/BOUNDARY-ROUND-1-DECLARATION-2026-09-26.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/BOUNDARY-ROUND-1-DECLARATION-2026-09-26.md`
- `docs/destination/world-object-core/OBJECT-TAXONOMY.md`
- `docs/destination/world-object-core/WORLD-PROJECTION.md`
- `omega-baseline/omega-final/docs/decisions/D-443-context-substrate.md`
- `omega-baseline/omega-final/plugins/vivim-run/src/context.ts`

### DERIVED / CURRENT

The peer declarations are mutually compatible enough to support narrow seam contracts, but they do not yet constitute a shared ACTIVE boundary. The correct Round-2 output is therefore an explicit handoff proposal plus preserved unknowns, not a unilateral ownership declaration.

### UNKNOWN / CURRENT

- Whether World is fundamentally principal-scoped or whether principal scope applies only at projection/query/context/authority layers.
- Exact peer-accepted representation of a resolved/ambiguous/stale/unresolvable/conflicted World reference.
- Exact durable merge/split and Event/State contract.
- Exact interpretation of `accessible` at the World ↔ Authority seam.
- Final canonical-vs-derived World field inventory.

## Unresolved items

1. **UNKNOWN / CURRENT:** World principal-scope model remains the highest-leverage unresolved issue.
2. **UNKNOWN / CURRENT:** Merge/split continuity requires joint World/Data/Evolution reconciliation.
3. **UNKNOWN / CURRENT:** `accessible` must be kept distinct from authorization but its composite ownership is not yet settled.
4. **UNKNOWN / CURRENT:** Event/State should not be elevated to a universal primitive without stronger evidence.
5. **UNKNOWN / CURRENT:** Canonical-vs-derived field classification needs a bounded inventory before durable schema commitments.

## Peer questions carried into Round 2

- **CFA-03:** Accept or amend the minimum WorldReferenceResult and its state/correspondence separation.
- **CFA-04:** Accept or amend the World/Authority state crosswalk and define the seam treatment of `accessible`.
- **CFA-02:** Accept or amend the semantic/durable crosswalk, especially merge/split, relationship identity, Event/State and canonical-vs-derived fields.

## Human-owner intervention

**NOT REQUIRED YET / DERIVED:** No current evidence requires an Ω-law change, unilateral responsibility transfer, or an irreducible product-policy decision. Human-owner escalation becomes appropriate only if peer reconciliation produces a true ownership conflict, an Ω-law collision, or an unresolved semantic policy choice that cannot be reduced to a seam contract.

## Completion classification

| RP | Status | Rationale |
|---|---|---|
| RP-01 | UNKNOWN | Minimum World-side proposal is defined; peer acceptance is not yet evidenced. |
| RP-03 | UNKNOWN | State dimensions are separated; ownership of `accessible` remains open. |
| RP-04 | UNKNOWN | Dimensional crosswalk is defined; peer acceptance of merge/split and canonical-vs-derived implications remains open. |

## Completion note

This addendum does not activate any shared boundary, redefine Ω law, create a universal identity model, or prescribe CFA-02/CFA-03/CFA-04 internal representations.


---

## M1 Peer Evidence Closure — 2026-09-27

> Classification: DERIVED / CURRENT CFA-01 reconciliation result.
> This section records peer evidence that landed after the original addendum was authored. It does not erase the original proposal history and does not activate a shared boundary.

### RP-01 — World ↔ CFA-03 Semantic Continuity

**AGREED / CURRENT.**

CFA-03 explicitly accepts the minimum World-side WorldReferenceInput shape and the distinction among:
- reference identity;
- World meaning;
- RESOLVED / AMBIGUOUS / STALE / UNRESOLVABLE / CONFLICTED;
- correspondence state;
- evidence/source basis;
- freshness;
- unresolved/conflict detail.

CFA-03's acceptance is bounded: it consumes the seam contract without dictating CFA-01 internal representation.

Evidence:
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/RESULTS/CFA03-20260927-M1-SEMANTIC-BASELINE-TRACE.md

### RP-03 — World ↔ CFA-04 Authority

**AGREED / CURRENT.**

CFA-04 accepts that:
- World may report existence, addressability and projection/view state;
- authorized remains Authority-owned;
- authorization outcomes must not rewrite World ontology;
- accessible is a **composed seam property**, not an Authority synonym and not an unqualified World ontology primitive.

The remaining work is jointly to define the representation of the composed accessible result; this does not block the core non-collapse invariant.

Evidence:
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/AUTHORITY-CORRIDOR-EVIDENCE-PACK-2026-09-27.md

### RP-04 — World ↔ CFA-02 Data

**AGREED / CURRENT.**

CFA-02 accepts the dimensional World/Data crosswalk and anti-collapse rules:
- World owns semantic identity/correspondence and relationship meaning;
- Data owns durable record identity, revision, lineage, persistence and reconstruction;
- merge/split are semantic decisions whose durable genealogy is recorded by Data;
- alias is address mapping, not a new semantic identity;
- source identity stays distinct from canonical identity;
- Event/State remains non-universal;
- canonical-vs-derived classification remains semantic rather than schema-inferred.

Evidence:
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/CONTINUITY-CORRIDOR-1-EVIDENCE-2026-09-27.md

### Reconciliation outcome

All three dependencies required to advance CFA-01 from local M1 evidence into M2 are now peer-evidenced:

| Seam | Status | Remaining qualification |
|---|---|---|
| World ↔ CFA-03 | **AGREED** | seam contract only; no boundary activation |
| World ↔ CFA-04 | **AGREED** | accessible composite representation remains open |
| World ↔ CFA-02 | **AGREED** | merge/split temporal semantics remain future work |

**Derived conclusion:** CFA-01 may advance to M2 reference/correspondence evidence work without waiting for another broad roadmap round. The unresolved qualifications remain explicitly bounded rather than being treated as blockers to the entire program.

**Boundaries:** UNACTIVATED  
**Ω law:** UNCHANGED  
**Production implementation:** NOT STARTED  
**Human-owner intervention:** NOT REQUIRED for this reconciliation.
