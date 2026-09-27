# CFA-09 M1 — Peer Reconciliation of Minimum Change Contract

> Status: DERIVED — PROPOSED / PARTIALLY RECONCILED
> Date: 2026-09-27
> Scope: M1 change semantic unit closure.
> This artifact is CFA-09 working state. It does not activate a shared boundary or amend Ω law.

## 1. Reconciliation result

The proposed Change Envelope can reuse the existing ecosystem's reference, revision, evidence, lifecycle and authority-separation patterns without creating a second identity or persistence authority.

The strongest current conclusion is:

    Change Envelope = cross-domain relation over peer-owned records/states

not:

    Change Envelope = new canonical record database

Several fields are sufficiently grounded to proceed as logical references. Exact peer-owned contracts remain open where their current state is provisional or acceptance has not yet been published.

## 2. Field-by-field reconciliation

| Change Envelope field | Current evidence | CFA-09 treatment | Status |
| --- | --- | --- | --- |
| changeId | D-315/D-326 use stable operation/run/realization identities; Change itself still lacks a single cross-domain ID | Keep as change-scoped identity distinct from subject identity | PROPOSED / CURRENT |
| subjectRefs | CFA-01/CFA-03 WorldReferenceResult work separates reference, resolution, correspondence, evidence and freshness; CFA-02 separates record/revision identity from semantic identity | Use opaque refs to peer-owned subjects; do not embed peer semantics | SUPPORTED / CURRENT |
| previousStateRefs | CFA-02 owns durable record/revision/history; D-326 uses supersedes; D-315 preserves prior behavior version | Use existing revision/state refs; do not define a universal State store | SUPPORTED / CURRENT |
| proposedStateRefs | D-315 staged/replacement behavior versions and D-326 healing/reverified realization states | Use refs to peer-owned proposed/staged state | SUPPORTED / CURRENT |
| requestedBy / causedBy | Existing Work/agent/evolution causation fields and execution ledgers provide attribution patterns | Reuse actor/cause refs; no universal actor store | SUPPORTED / CURRENT |
| reason | Existing evidence records carry run/change reasons in domain-specific forms | Keep as reason text/ref, with provenance | PROPOSED / CURRENT |
| changeClass | CFA-09 constitution already separates maintenance, evolution, constitutional evolution | Retain three-class split | SUPPORTED / CURRENT |
| semanticDelta | CFA-03 keeps semantic meaning distinct from record identity; exact change-delta acceptance is not yet a shared contract | Keep explicit for meaning-changing changes; do not hard-code peer semantics here | PROPOSED / OPEN |
| lifecycleState | D-315 and D-326 prove domain lifecycle states; CFA-10 owns runtime admission/activation | Common envelope may carry generic lifecycle state while domain states remain adapters/evidence | SUPPORTED PATTERN / OPEN SHAPE |
| impact | Central M1 requires explicit impact; no peer artifact yet supplies a universal impact representation | Preserve KNOWN / UNKNOWN / CONFLICTED and references | PROPOSED / OPEN |
| compatibility | Destination requires multidimensional compatibility, but no peer M1 artifact establishes the final evaluator | Use dimensioned assessments; do not reduce to a score/badge | PROPOSED / OPEN |
| authority | CFA-04 owns authority; current local evidence keeps the live corridor waiting on M1 closure | Carry authority status/reference only; never infer permission | SUPPORTED BOUNDARY / OPEN SHAPE |
| applicationEvidence | D-315 execution ledger and D-326 healing evidence already provide evidence-bearing application history | Reuse evidence refs | SUPPORTED / CURRENT |
| verificationEvidence | D-315 test/gate evidence and D-326 probe evidence are separate from mutation | Preserve separate verification refs | SUPPORTED / CURRENT |
| promotionState | D-315 behavior lifecycle and D-326 PROMOTED/TESTING states show lifecycle separation | Reference peer-owned promotion evidence; do not redefine domain states | SUPPORTED / CURRENT |
| rollbackReference | D-315 has reactivation/quarantine evidence; D-326 has superseding revisions but not generic rollback | Carry optional rollback/reconstruction ref | SUPPORTED PATTERN / OPEN GENERIC SEMANTICS |
| createdAt / updatedAt | Existing vault records and lifecycle records carry timestamps | Reuse standard temporal metadata | SUPPORTED / CURRENT |

## 3. Peer contract findings

### CFA-01 — World

OBSERVED / CURRENT: CFA-01's current Round-2 material defines a WorldReferenceResult that separates subject reference, world meaning, resolution state, correspondence, evidence/source basis, freshness, and unresolved/conflict detail.

DERIVED: Change subject references should be opaque/citable and must not collapse World meaning, correspondence, or freshness into the change ID itself.

STATUS: Compatible with the Change Envelope. No CFA-01 acceptance of the full Change Envelope is required at this stage because the envelope does not own World semantics.

### CFA-03 — Semantic Continuity

OBSERVED / CURRENT: CFA-03's Round-2 material distinguishes semantic meaning, reference, grounding, evidence, Intent and Authority. It explicitly rejects a universal identity store and supports explicit relations among semantic, record, revision, evidence and representation identities.

DERIVED: semanticDelta belongs in the Change Envelope as an expressed relation to semantic meaning, not as a new semantic authority.

STATUS: Compatible in principle; exact shared semantic-delta vocabulary remains open.

### CFA-02 — Data / Identity / Persistence

OBSERVED / CURRENT: CFA-02 remains provisional. Its current boundary model separates meaning, representation, identity, lineage, provenance, revision, durability, authority, epistemic state and transformation. It explicitly places canonical record identity, revision, lineage, persistence and reconstruction under the Data responsibility.

DERIVED: previousStateRefs/proposedStateRefs should reference existing durable record/revision/state evidence, while migration semantics remain CFA-09 and persistence mechanics remain CFA-02.

STATUS: Compatible boundary, but exact mapping and minimum continuity payload remain UNKNOWN until CFA-02 supplies a stronger accepted contract.

### CFA-04 — Authority / Governance

OBSERVED / CURRENT: CFA-04 owns authority semantics and has explicitly kept its live corridor waiting while the shared M1 contract/evidence frontier closes.

DERIVED: Change Envelope may state authority status/reference and reauthorization requirement, but must not cache or decide live permission.

STATUS: Boundary compatible; exact AuthorityCitation/reference form remains UNKNOWN.

### CFA-10 — Runtime / K0

OBSERVED / CURRENT: CFA-10's current roadmap keeps K0/B1 evidence closure focused on executable-entry confinement and identifies CFA-09 as owning compatibility, migration, impact, rollback/change governance while CFA-10 owns admission/fencing/activation.

DERIVED: Change Envelope may carry activation/admission evidence references, but runtime enforcement remains peer-owned.

STATUS: Boundary compatible; exact activation-state reference shape remains OPEN.

## 4. Consequences for the M1 contract

1. The envelope should remain a logical interoperability contract, not a new storage object that competes with Data.
2. Subject identity, semantic identity, record identity, revision identity, evidence identity, execution identity and runtime identity remain distinct and related explicitly.
3. Generic lifecycle state should be a cross-domain projection/coordination vocabulary; domain mechanisms may retain richer local state.
4. Compatibility and impact are intentionally the least mature portions of the contract. They remain proposed until bounded evaluators/falsifiers are demonstrated.
5. Authority is a reference/result seam, never an Evolution-owned permission engine.
6. Runtime activation/admission is evidence carried across the seam, never an Evolution-owned enforcement primitive.
7. Any field that cannot be grounded in an existing peer-owned identity/reference should stay UNKNOWN rather than causing a new universal identity primitive to be invented.

## 5. Remaining blockers to M1 shared closure

| Topic | State | Why not closed locally |
| --- | --- | --- |
| Data revision/state reference shape | UNKNOWN | CFA-02 remains provisional and exact accepted continuity payload is not published |
| Semantic-delta shared vocabulary | OPEN | CFA-03 separates semantic continuity correctly, but a shared evolution-specific delta vocabulary is not accepted yet |
| AuthorityCitation / live re-resolution reference | OPEN | CFA-04 has not published the final shared citation shape in the current wait state |
| Runtime activation/admission reference | OPEN | CFA-10 M1 evidence closure is still a separate frontier |
| Generic impact representation | OPEN | Requires the next bounded impact work; no universal impact store should be introduced |
| Generic multidimensional compatibility evaluator | OPEN | Requires the next bounded compatibility work and falsifiers |

## 6. Falsifiers

### F-01 — Peer reference incompatibility
A current peer contract requires Change Envelope to manufacture a new identity or duplicate canonical meaning.
Expected response: narrow/remove the envelope field rather than create a duplicate authority.

### F-02 — Cross-domain lifecycle collision
D-315/D-326-style lifecycle states cannot be related to a generic lifecycle without semantic ambiguity.
Expected response: keep domain lifecycle local and carry explicit lifecycle evidence/adapters.

### F-03 — Authority leakage
An implementation of the envelope permits compatibility/lifecycle status to be treated as live authorization.
Expected response: add an explicit authority-reference boundary and refuse the transition.

### F-04 — Runtime leakage
An Evolution component must implement admission/fencing to make the envelope meaningful.
Expected response: move that requirement to the Runtime seam.

### F-05 — Data-store duplication
Persisting the envelope requires a second canonical revision/history store.
Expected response: retain logical envelope semantics and reuse Data-owned durable records.

## 7. Local conclusion

**M1-02 local reconciliation: COMPLETE WITH OPEN PEER ACCEPTANCES.**

The proposed Change Envelope is bounded enough to proceed to the next CFA-09 design stage without changing peer ownership. The open items are named and have clear owners; none justifies silently activating a shared boundary.

The central Steward may now use this CFA-09 result as evidence when reconciling the shared M1 frontier.

## Evidence index

- AGENTS_CONTEXT/EVOLUTION/CANONICAL-MODEL.md
- AGENTS_CONTEXT/EVOLUTION/CONSTITUTION.md
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/CFA-STRATEGIC-ROADMAP-CENTRAL-2026-09-27.md
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/BOUNDARY-DESIGN.md
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/STATE.md
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/RESULTS/AUTHORITY-CORRIDOR-M1-WAIT-20260927.md
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/RUNTIME-CONSTITUTION-CORE-SUBSTRATE/DOMAIN-ROADMAP-2026-09-27.md
- omega-baseline/omega-final/docs/decisions/D-315-quarantine-semantics.md
- omega-baseline/omega-final/docs/decisions/D-326-healing-writes.md
- omega-baseline/omega-final/docs/decisions/D-333-migration-substrate.md
- omega-baseline/omega-final/docs/decisions/D-418-v1-substrate-chrome-first.md