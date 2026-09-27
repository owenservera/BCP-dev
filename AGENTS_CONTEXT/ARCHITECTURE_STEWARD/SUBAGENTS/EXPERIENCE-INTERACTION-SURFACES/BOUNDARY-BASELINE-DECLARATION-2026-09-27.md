# CFA-08 — Boundary Baseline Declaration
## Identity

- **CFA:** CFA-08 — Experience / Interaction / Surfaces
- **agent_id:** `experience-interaction-surfaces`
- **Human-readable identity:** Experience / Interaction / Surfaces Steward
- **Identity status:** RATIFIED — OWNER-ALIGNED
- **Workspace:** `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/EXPERIENCE-INTERACTION-SURFACES/`
- **Identity version:** v1.0
- **Baseline date:** 2026-09-27
- **Classification:** DERIVED / CURRENT boundary baseline
- **Activation status:** RECONCILED / UNACTIVATED

This declaration is a Wave-1 independent baseline under the Architecture Steward Boundary Design System. It does not ratify a new identity, activate a shared boundary, amend Ω law, or authorize production implementation.

## Current Responsibility

CFA-08 stewards the coherent human-facing experience boundary through which VIVIM presents, navigates, inspects, manipulates and re-enters system meaning.

The responsibility includes:

- Surface / View representation contracts.
- Projection and presentation-state conventions.
- Workspace / layout / canvas realization.
- Navigation, focus, selection and re-entry experience.
- Direct-manipulation and other user interaction mechanics as experience inputs.
- Visual inspection/edit/confirm/reject interaction for domain-owned Intent.
- User-facing Work progress, result, approval/input and continuity presentation.
- User-facing Authority / Consent / Refusal presentation.
- User-facing Capability / Provider / Realization choice and status presentation.
- Composition / Plugin / Forge inspection and editing UX.
- Surface-owned configuration experience.
- Explicit initiation of typed semantic write-back into the owning canonical path.
- Preservation of freshness, uncertainty, conflict, refusal and provenance state in presentation.

CFA-08 is a presentation/interaction steward, not the semantic owner of the underlying domains.

## OWNS / CONTRIBUTES / CONSULTS / OUT-OF-SCOPE

### OWNS

- Surface / View presentation contracts.
- Projection-to-surface representation behavior.
- Workspace / layout / canvas presentation realization.
- Presentation-local state such as selection, focus, viewport, arrangement and transient interaction state.
- User-facing navigation, re-entry and surface transitions.
- Interaction affordances and direct-manipulation mechanics.
- Presentation of domain-owned semantic state.
- Surface-local configuration where no other semantic owner is crossed.
- Experience-side initiation of typed semantic handoffs.

### CONTRIBUTES

- World / Space / Context presentation and navigation to CFA-01.
- Intent representation and interaction handoff to CFA-03.
- Work status/control/result presentation to CFA-05.
- Authority/refusal/consent presentation to CFA-04.
- Capability/provider/realization choice presentation to CFA-06.
- Composition/Forge editing presentation to CFA-07.
- Persistence/reconstruction requirements for presentation continuity to CFA-02.
- Change/replacement/re-entry presentation implications to CFA-09.
- Runtime-status presentation constraints to CFA-10.
- Evidence/provenance visibility across relevant domain owners.

### CONSULTS

- CFA-01 for World / Thing / Relationship / Semantic Identity / Space / Context meaning.
- CFA-02 for durable record identity, revision, persistence, lineage and reconstruction.
- CFA-03 for grounding, semantic interpretation and canonical Intent / Plan meaning.
- CFA-04 for authority, consent, delegation, scope, expiry, revocation and refusal semantics.
- CFA-05 for Work, Attempt, Outcome, progress, recovery and execution continuity.
- CFA-06 for Capability, Provider, Account, Model, Realization, Session, Resource and Routing meaning.
- CFA-07 for Composition, Plugin, Manifest / Recipe and Forge semantics.
- CFA-09 for compatibility, replacement, migration and continuity implications.
- CFA-10 for runtime admission, lifecycle and non-bypassable enforcement constraints.
- Architecture Steward for unresolved cross-CFA ownership or activation decisions.

### OUT-OF-SCOPE

CFA-08 does not own:

- World ontology or semantic object meaning.
- Semantic Space meaning.
- Canonical semantic identity/correspondence.
- Durable record identity, persistence authority or general Data storage.
- Language semantics, grounding semantics or canonical Intent / Plan meaning.
- Live Authority / Permission / Consent semantics.
- Work lifecycle or execution semantics.
- Capability / Provider / Realization / Routing semantics.
- Composition / Plugin / Forge semantics.
- Generic compatibility, migration or evolution policy.
- K0/K1 runtime constitutional enforcement.
- A second ontology, canonical store, identity registry, command system or authority system.
- Any claim that presentation state itself is canonical truth.

## Primary Seams

| Seam | CFA-08 side | Peer side | Current classification |
|---|---|---|---|
| World ↔ Surface | perception, navigation, projection and presentation | CFA-01 semantic World / Space / Context | RECONCILED / UNACTIVATED |
| Semantic / Intent ↔ Interaction | visual interaction and Intent representation/handoff | CFA-03 semantic Intent / Plan meaning and continuity | RECONCILED / UNACTIVATED |
| Work ↔ Surface | progress, control, result, approval and re-entry presentation | CFA-05 Work / execution semantics | PROVISIONAL FOR LATER WAVE; peer seam not yet part of CFA-01–04 audit |
| Composition ↔ Surface | inspection/editing/Forge UX | CFA-07 composition/plugin/Forge semantics | PROVISIONAL FOR LATER WAVE |
| Capability / Provider ↔ Surface | choice, status and realization presentation | CFA-06 capability/provider/realization semantics | PROVISIONAL FOR LATER WAVE |
| Canonical ↔ Presentation | projection, View, Layout and Interaction State | canonical semantic/data owners | RECONCILED PRINCIPLE / UNACTIVATED |
| Persistence ↔ Re-entry | presentation continuity requirements and durable-state needs | CFA-02 persistence / revision / reconstruction | RECONCILED PRINCIPLE / physical join UNKNOWN |
| Write-back | initiate typed semantic request; never canonical write directly | owning semantic / authority / work / data paths | RECONCILED PRINCIPLE / UNACTIVATED |

The authoritative CFA-01–04 audit classifies its six bounded seams as RECONCILED / UNACTIVATED. CFA-08 therefore adopts those reconciled findings without interpreting them as activation.

## Crosses the Boundary

CFA-08 crosses from presentation into another semantic boundary only through explicit, typed handoff.

### World / Space

Allowed:

`World / Space semantics → projection → Surface / View → navigation / interaction`

When a user action intends to change canonical World meaning:

`surface action → typed semantic request → CFA-01-owned semantic path`

CFA-08 does not reinterpret World existence, identity, correspondence or Space meaning.

### Semantic / Intent

Allowed:

`interaction → visual/inspectable Intent representation → explicit semantic handoff`

Canonical Intent / Plan meaning remains CFA-03-owned.

D-411 provides an Ω implementation precedent in which interpretation is persisted as canonical Intent before governed execution; the surface can initiate that path but does not become the Intent authority.

### Work

Allowed:

`Work state → surface projection → progress/control/result/re-entry experience`

A Work control must return through CFA-05's owning semantic path.

UI progress is not Work truth merely because it is visible.

### Composition

Allowed:

`Composition state → inspection/editing experience → governed composition handoff`

Surface editing cannot bypass Composition semantics, authority, Forge admission or Evolution requirements.

### Capability / Provider

Allowed:

`Capability / Provider state → choice/status presentation → typed selection/request`

Surface choices do not redefine routing, realization truth or permission.

### Persistence / Re-entry

Presentation state may be durable where explicitly designated as surface-owned preference or continuity state. Durability does not turn it into canonical meaning.

Re-entry must be reconstructable from canonical state plus whatever presentation state is explicitly durable.

The final physical persistence/join for Surface/View/Layout remains an unresolved CFA-02 seam.

## Must Not Cross

CFA-08 must not:

- write canonical World/Intent/Work/Authority/Capability/Composition meaning directly from UI state;
- use DOM IDs, coordinates, component keys, labels, provider selectors or layout records as canonical identity;
- infer authority from a rendered button, selection, View, cached decision or visual state;
- treat a stale projection as current canonical truth;
- convert UNKNOWN into failure merely for presentation convenience;
- treat optimistic UI state as evidence of canonical success;
- invent a second command/Intent system for direct manipulation;
- create a second persistent ontology or hidden UI database required for semantic reconstruction;
- silently convert View or Workspace configuration into Composition semantics;
- infer nonexistence from absence in a presentation projection;
- interpret provider choice as provider authorization;
- treat surface acknowledgement as proof of external effect;
- activate a peer boundary merely because the presentation contract depends on it.

## Inputs Required

### Current semantic inputs

- Canonical World / Space / Context references and projection basis from CFA-01.
- Semantic Intent / Plan representations and interpretation state from CFA-03.
- Work state/result/approval/recovery state from CFA-05.
- Authority/Consent/Refusal decisions from CFA-04.
- Capability / Provider / Realization status from CFA-06.
- Composition / Plugin / Forge state from CFA-07.
- Evolution / replacement impact from CFA-09.
- Runtime-admission/status constraints from CFA-10.
- Durable identity/revision/reconstruction constraints from CFA-02.
- Evidence/provenance references from relevant owners.

### Presentation-local inputs

- View configuration;
- layout;
- viewport;
- selection/focus;
- interaction state;
- surface capability/binding;
- local user preferences.

These must remain distinguishable from canonical domain inputs.

## Outputs Provided

- human-facing Surface / View projections;
- navigation and spatial organization;
- inspectable semantic representations;
- user interaction actions;
- typed semantic handoff requests;
- presentation of Work / Authority / Capability / Composition state;
- freshness / uncertainty / conflict / refusal / provenance presentation;
- re-entry and continuity presentation;
- surface-local configuration changes;
- evidence-oriented affordances that point back to owning sources rather than replacing them.

## Invariants

1. **canonical semantic state != presentation state**
2. **surface != canonical truth**
3. **gesture != semantic effect**
4. **interaction != authority**
5. **selection != authorization**
6. **presentation != evidence**
7. **evidence != authority**
8. **confidence != proof**
9. **unknown != failure**
10. **stale != false**
11. **optimistic != confirmed**
12. **durable presentation state != canonical semantic identity**
13. **surface-local reference != universal semantic identity**
14. **write-back must return through the owning typed semantic path**
15. **View change must preserve canonical subject identity and revision**
16. **projection deletion must not delete canonical meaning**
17. **surface replacement must not require semantic identity replacement**
18. **no peer boundary becomes ACTIVE from CFA-08 declaration alone**

## Evidence and Freshness

### Epistemic state

CFA-08 preserves, at minimum:

- OBSERVED;
- DERIVED;
- PROPOSED;
- UNKNOWN;
- CONFLICTED.

### Freshness state

CFA-08 preserves, at minimum:

- CURRENT;
- STALE;
- UNRESOLVABLE / UNKNOWN.

Where the underlying contract supports more detail, presentation may distinguish:

- INVALID;
- REBUILDING.

Epistemic state and freshness are orthogonal.

### Evidence rule

A presentation may expose evidence references, source basis, revision basis and provenance.

A visible source label, citation, status badge or confidence value does not itself become canonical authority.

### Current Round-2 evidence imported

The Architecture Steward CFA-01–04 Round-2 Completion Audit records:

- World ↔ Semantic Continuity: RECONCILED / CURRENT;
- Semantic Continuity ↔ Authority: RECONCILED / CURRENT;
- World ↔ Authority: RECONCILED / CURRENT;
- World ↔ Data: RECONCILED / CURRENT;
- Data ↔ Authority: RECONCILED / CURRENT;
- Data ↔ Semantic Continuity: RECONCILED / CURRENT;
- cross-cutting identity, context/scope, existence/permission and evidence distinctions are preserved;
- remaining issues are explicitly UNKNOWN or DEFERRED;
- no shared seam is ACTIVE.

For CFA-08 this establishes a stable current basis for presentation-side boundary classification, not a transfer of semantic ownership.

## Falsifiers

### F-08-01 — Presentation canonicalization

Remove surface-specific layout / projection state.

**Pass:** canonical World/Intent/Work meaning remains reconstructable from owning sources.

**Fail:** the surface contains required semantic truth.

### F-08-02 — Surface identity split

Represent one canonical subject on two surfaces.

**Pass:** both resolve to one semantic subject reference.

**Fail:** the surface creates a second semantic identity.

### F-08-03 — Stale projection action

Advance canonical revision after projection creation, then perform a consequential action.

**Pass:** surface indicates stale/unknown and re-resolves before mutation.

**Fail:** stale presentation is accepted as current truth.

### F-08-04 — Selection authority

Select an object with no authority to mutate it.

**Pass:** selection changes presentation/context only.

**Fail:** selection grants or implies authority.

### F-08-05 — Optimistic failure

Show a successful-looking optimistic mutation, then cause canonical refusal/failure.

**Pass:** surface reverts or visibly reports divergence.

**Fail:** surface remains confirmed without canonical acknowledgement.

### F-08-06 — Direct-write bypass

Attempt a surface-to-canonical-storage write without the owning semantic path.

**Pass:** architecture rejects the path.

**Fail:** presentation code can author canonical truth directly.

### F-08-07 — View replacement

Replace View A with View B.

**Pass:** subject identity, canonical revision and semantic meaning remain unchanged.

**Fail:** View identity substitutes for canonical identity.

### F-08-08 — Projection deletion

Delete all rebuildable presentation projections.

**Pass:** canonical state remains and presentation can be regenerated.

**Fail:** projection persistence is required to recover semantic meaning.

### F-08-09 — Unknown handling

Make current basis unavailable.

**Pass:** presentation shows UNKNOWN / UNRESOLVABLE.

**Fail:** the surface manufactures CURRENT or collapses UNKNOWN into failure without evidence.

### F-08-10 — Write-back convergence

Perform an action through direct manipulation and the semantic interaction path for the same intended effect.

**Pass:** both converge on one owning canonical path.

**Fail:** surfaces create incompatible command/semantic systems.

### F-08-11 — Re-entry reconstruction

Close and reopen a Surface with only canonical state plus explicitly durable presentation preferences.

**Pass:** valid representation returns without hidden UI records.

**Fail:** lost UI state is required to restore canonical meaning.

### F-08-12 — Peer-activation leakage

Treat this declaration as evidence that a peer seam is ACTIVE.

**Pass:** shared lifecycle remains RECONCILED / UNACTIVATED.

**Fail:** declaration is used as unilateral activation authority.

## UNKNOWN / CONFLICTED / DEFERRED

### UNKNOWN

1. Exact persisted Surface/View/Layout/Interaction record envelope.
2. Exact physical persistence/join between CFA-08 presentation state and CFA-02 durable continuity.
3. Exact composed representation of principal-scoped visibility/accessibility in the surface.
4. Exact final World/Surface write-back mapping by interaction class.
5. Exact minimum provenance/evidence presentation depth.
6. Exact semantic Attention model and final owner.
7. Cross-device workspace/layout/focus continuity.
8. Exact View configuration versus user-authored Composition boundary.
9. Exact durable Work projection fields and retry/re-entry semantics.
10. Exact capability/provider/account presentation contract.
11. Runtime-specific surface-adapter constraints.
12. Exact surface versioning and compatibility contract.

### CONFLICTED

- **None identified** in the current audited evidence.

### DEFERRED

- activation of shared CFA boundaries;
- production implementation;
- final durable schema;
- semantic Attention ownership;
- multi-step/batched Work authorization implications;
- Evolution/compatibility policy for persisted surface state;
- any Ω-law amendment.

## Handoff Proposals

These are **proposals**, not activated shared boundaries.

### HP-08-01 — World / Surface

CFA-01 provides semantic subject/Space references and their resolution/freshness basis.

CFA-08 provides projection, navigation, workspace and presentation realization.

Any semantic mutation returns to the CFA-01-owned path.

### HP-08-02 — Semantic / Interaction

CFA-03 provides canonical Intent/Plan meaning and interpretation semantics.

CFA-08 provides visual representation, editing, confirmation and interaction routing.

Direct manipulation follows the same semantic handoff rather than a parallel UI command system.

### HP-08-03 — Data / Presentation Persistence

CFA-02 provides durable identity/revision/reconstruction constraints.

CFA-08 declares which presentation state is intended as durable preference/continuity versus ephemeral interaction.

The physical storage/join is a separate reconciliation decision.

### HP-08-04 — Work / Surface

CFA-05 owns Work meaning and lifecycle.

CFA-08 renders Work state and initiates typed controls.

Any action that changes Work returns through CFA-05's semantic path.

### HP-08-05 — Authority / Surface

CFA-04 owns authority/consent/refusal meaning.

CFA-08 renders decisions and valid interaction affordances.

Surface presentation never caches authority as permanent permission.

### HP-08-06 — Capability / Surface

CFA-06 owns capability/provider/realization/routing semantics.

CFA-08 presents choices and statuses.

User selection becomes an explicit typed request rather than a hidden routing mutation.

### HP-08-07 — Composition / Surface

CFA-07 owns composition/plugin/Forge meaning.

CFA-08 owns inspection/editing UX.

Editing crosses the governed composition path and does not bypass admission or authority.

## Non-Authority Statement

This declaration is not:

- Ω law;
- a shared boundary activation;
- a universal identity schema;
- a canonical data model;
- an authorization system;
- a runtime enforcement rule;
- a production implementation specification;
- a replacement for any peer CFA's semantic responsibility.

This declaration records CFA-08's present boundary understanding so the Architecture Steward can compare it with the other Wave-1 declarations.

No presentation artifact created in this home becomes authority merely by existing.

## Evidence Index

### Architecture Steward boundary system

- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/CFA-05-10-BOUNDARY-BASELINE-AND-RECONCILIATION-2026-09-27.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/ROUND-2-COMPLETION-AUDIT-2026-09-27.md`

### CFA-08

- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/EXPERIENCE-INTERACTION-SURFACES/CORE-AGENT.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/EXPERIENCE-INTERACTION-SURFACES/OWNER-ALIGNMENT-2026-09-27.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/EXPERIENCE-INTERACTION-SURFACES/STATE.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/EXPERIENCE-INTERACTION-SURFACES/TASKS.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/EXPERIENCE-INTERACTION-SURFACES/DOMAIN-ROADMAP-2026-09-27.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/EXPERIENCE-INTERACTION-SURFACES/SURFACE-VIEW-CONTRACT-2026-09-27.md`

### CFA-01 World

- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/STATE.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md`
- current owner-alignment record and semantic World / Space responsibility artifacts.

### CFA-02 Data

- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/CORE-AGENT.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/STATE.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md`

### CFA-03 Semantic Continuity

- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/STATE.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md`
- `omega-baseline/omega-final/contracts/src/intent.ts`
- `omega-baseline/omega-final/docs/decisions/D-411-intent-seam.md`

### CFA-04 Authority

- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/CORE-AGENT.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/STATE.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md`

### Destination / Ω surface evidence

- `docs/destination/world-surface-core/RESEARCH-RESULTS.md`
- `docs/destination/world-surface-core/FALSIFIER-BLUEPRINT.md`
- `docs/destination/WORLD-WORKSPACE-CANVAS-RECONCILIATION.md`
- `omega-baseline/omega-final/docs/decisions/D-383-surface-pointer.md`
- `omega-baseline/omega-final/docs/decisions/D-436-surface-sync.md`
- `omega-baseline/omega-final/contracts/src/surface.ts`
