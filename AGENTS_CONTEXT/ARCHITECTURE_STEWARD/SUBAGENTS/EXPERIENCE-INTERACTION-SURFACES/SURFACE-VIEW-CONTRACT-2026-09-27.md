# CFA-08 — Minimum Surface / View Contract
## Bounded Design — 2026-09-27

> Classification: DERIVED / PROPOSED
> Freshness: CURRENT
> CFA owner: CFA-08 — Experience / Interaction / Surfaces
> Scope: minimum reusable representation and interaction boundary between canonical system meaning and human-facing surfaces.
> This is not Ω law, not a production schema, and does not activate any shared CFA boundary.

## 1. Purpose

Define the smallest reusable contract that lets VIVIM represent canonical subjects through replaceable surfaces without allowing presentation state to become a second source of canonical meaning.

The contract answers six questions:

1. What canonical subject is being represented?
2. What projection was derived from it?
3. Which View is being used?
4. Which Layout and local Interaction State shape the experience?
5. Is the representation current, stale, unknown, invalid, or rebuilding?
6. How does a user action return to canonical semantics without a UI-owned mutation path?

## 2. Existing evidence adopted

OBSERVED / CURRENT:

- destination world-surface-core research defines canonical World/Object state → projection → Surface/View/Layout/Interaction State → canonical Intent → revision/evidence → projection refresh;
- the destination falsifier blueprint explicitly tests reconstruction, multiple surfaces, stale projection, surface mutation, layout corruption, Work projection and restore;
- D-383 establishes the surface pointer/default architecture and keeps the legacy frontend data layer outside Ω core;
- D-436 establishes measurable surface derivation/parity and tamper/drift detection;
- omega contracts/src/surface.ts is the current shared surface operation derivation of record;
- D-411 establishes the canonical Intent seam and allows semantic surface actions to carry intentRef and payloadHash into the authority path;
- CFA-01 owns World / Space / Context semantics;
- CFA-02 owns durable record identity, persistence, revision and reconstruction;
- CFA-03 owns semantic Intent / Plan meaning;
- CFA-04 owns authority;
- CFA-05 owns Work;
- CFA-06 owns capability/provider/routing;
- CFA-07 owns composition/Forge semantics.

This document narrows those existing conclusions into an owned CFA-08 representation contract. It does not supersede them.

## 3. Core model

The reusable model is:

Canonical Subject
  →
Projection
  →
View
  →
Layout
  +
Interaction State
  →
Surface

The semantic write corridor is:

User Action
  →
Surface Interaction
  →
Typed Semantic Request / Intent
  →
Owning CFA
  →
Authority / Capability / Work / Data path as applicable
  →
Canonical Revision / Evidence
  →
Projection Refresh

A Surface never becomes canonical because it is the user's point of interaction.

## 4. Vocabulary

### Surface

A concrete interaction boundary through which a person or external consumer experiences a projection.

Examples include:
- Canvas;
- Workspace;
- Chat;
- panel or inspector;
- Web;
- CLI;
- MCP-facing surface;
- future modalities.

A Surface may own surface configuration and local state. It does not own the identity of the Things it represents.

### Subject Reference

A reference from presentation state to one canonical semantic subject.

Rules:
- the reference resolves outward to the owning semantic contract;
- a surface-local instance identifier is not canonical identity;
- DOM identifiers, React keys, coordinates, labels, array indexes, selectors and component paths are never load-bearing semantic identity.

The exact semantic and durable record identifiers remain supplied by the owning CFAs.

### Projection

A disposable or cacheable derivation of canonical subjects for a Surface.

Minimum conceptual contents:

- projection reference;
- surface reference;
- subject references;
- canonical basis / revision references;
- projection kind;
- projection version;
- generation time;
- explicit freshness state;
- presentation payload.

Projection persistence is optional. Recomputability is the default architectural property.

### View

A representation mode over one or more projected subjects.

A View can change:
- visible fields;
- arrangement;
- grouping;
- navigation;
- affordances;
- presentation semantics.

A View does not create a new canonical subject.

### Layout

Surface-local spatial and presentation organization.

Typical content:
- position;
- size;
- z-order;
- docking;
- viewport;
- grouping;
- panel geometry.

Layout may become durable user preference. It must not become the only place where canonical identity, relationships, revision history, authority state, or Work identity can be reconstructed.

### Interaction State

Local state of the user interaction or presentation session.

Examples:
- selection;
- focus;
- hover;
- expanded/collapsed state;
- drag/resize state;
- active local tool/mode;
- draft input;
- temporary filter;
- pending optimistic change.

Default: ephemeral.

Selective persistence is allowed later, but persistence does not make the state canonical.

### Surface Binding

The governed description of operations/capabilities exposed by a Surface.

It answers what the surface may present or request. It does not decide authority, canonical meaning, provider choice, or Work outcome.

Existing surfaceOpMeta remains the shared Ω derivation precedent; CFA-08 does not create a second operation vocabulary source.

### Presentation Status

The trust/freshness condition of a representation.

Minimum values:

- CURRENT — relevant basis is verified current.
- STALE — canonical basis advanced after generation.
- UNKNOWN — current basis cannot presently be verified.
- INVALID — representation contract/version cannot be interpreted.
- REBUILDING — projection is being regenerated.

These are presentation conditions, not semantic outcomes.

## 5. Ownership matrix

| Concern | CFA-08 role | Canonical owner |
|---|---|---|
| Subject identity | reference/presentation | owning semantic CFA; durable continuity via CFA-02 |
| World meaning | project/present | CFA-01 |
| Space meaning | project/present | CFA-01 |
| Context semantics | present derived context | CFA-01 |
| Projection | define presentation contract | CFA-08 |
| View choice/configuration | own presentation choice | CFA-08 unless another semantic boundary is crossed |
| Layout | own surface organization | CFA-08; durability support from CFA-02 |
| Selection/focus | own local interaction state | CFA-08 presentation |
| Intent representation | inspect/edit/confirm/reject presentation | CFA-03 |
| Intent meaning | display only | CFA-03 |
| Authority presentation | display and interaction affordance | CFA-04 |
| Work projection | display/control affordance | CFA-05 |
| Capability/provider choice | present choices/status | CFA-06 |
| Composition editing | present/edit affordance | CFA-07 |
| Evidence presentation | expose supporting references/status | cross-cutting evidence owners |
| Durable persistence | consume/request durable continuity | CFA-02 |
| Runtime enforcement | present relevant state | CFA-10 |
| Semantic Attention | present attention results | outside CFA-08 until resolved |

## 6. Durable versus ephemeral state

| State | Default | May persist? | Canonical? | Must reconstruct without it? |
|---|---|---:|---:|---:|
| subject reference | reference | yes | no | yes, by resolving owner |
| projection payload | disposable/cache | yes | no | yes |
| projection basis/freshness | derived metadata | yes | no | yes |
| View kind/config | user preference | yes | no | default must exist |
| Layout | user preference | yes | no | World recovery must not depend on it |
| selection/focus | session-local | selectively | no | yes |
| hover/drag/tool state | ephemeral | normally no | no | yes |
| draft input | session-local | selectively | no | yes |
| optimistic mutation state | provisional | normally no | no | yes |
| Work projection | derived | yes | no | reconstruct from Work |
| Attention projection | derived | yes | no | reconstruct from semantic inputs |
| authority presentation | derived | yes | no | re-resolve authority |
| evidence display | derived | yes | no | reconstruct from evidence references |

Rule: persistence is not canonicalization.

## 7. Identity rules

Every usable Surface representation must make it possible to answer:

- which canonical subjects are represented;
- which projection generated the representation;
- which canonical basis was used;
- which View is active;
- which Layout/configuration applies;
- which Interaction State is local;
- what freshness status applies.

The following are explicitly non-canonical:
- DOM nodes;
- UI component trees;
- generated labels;
- pixels;
- coordinates;
- provider selectors;
- transient runtime object identities.

## 8. Freshness rules

A projection is CURRENT only when its relevant canonical basis is verified current.

Conceptually:

basis verified current → CURRENT
basis older than canonical revision → STALE
basis cannot be verified → UNKNOWN
projection cannot be interpreted → INVALID
rebuild running → REBUILDING

Freshness is independent from confidence.

The Surface must never infer canonical truth from:
- visual prominence;
- selection;
- recency;
- optimistic rendering;
- absence of an error indicator.

Consequential action against STALE or UNKNOWN presentation must re-resolve the canonical target and relevant basis before mutation.

## 9. Mutation rules

CFA-08 may originate typed semantic requests.

CFA-08 may not directly commit canonical meaning.

Required path:

Surface gesture
→ semantic experience action
→ typed request / canonical Intent where applicable
→ owning semantic path
→ governance / capability / Work / data processing
→ canonical revision and evidence
→ projection invalidation or refresh

Forbidden path:

Surface gesture
→ direct canonical database/store mutation

Optimistic UI is permitted only when explicitly provisional.

A failed or refused optimistic mutation must:
- revert, or
- remain visibly divergent with an explicit non-confirmed state.

It must never remain presented as confirmed canonical truth.

## 10. View change rules

View A → View B must preserve:
- canonical subject identity;
- canonical revision identity;
- canonical relationships;
- authority semantics;
- Work identity.

A View change may alter the representation without changing what the subject is.

## 11. Surface lifecycle

Minimum lifecycle:

DISCOVER / DECLARE
→ BIND
→ PROJECT
→ PRESENT
→ INTERACT
→ REFRESH / INVALIDATE
→ REBUILD / RE-ENTER

A Surface may disappear at any point.

Re-entry must rely on:
- canonical subject state;
- current authoritative basis;
- explicitly durable presentation configuration where available.

Hidden UI records must not be required to recover canonical meaning.

## 12. Multiple surfaces

One canonical subject may appear simultaneously on multiple surfaces:

Thing:Project-X
  → Canvas tile
  → Project View
  → Search result
  → Chat reference
  → Work attachment

Each may have a separate surface-local instance reference.

All must resolve to the same canonical subject.

The invariant is:

surface instance reference → canonical subject reference

not:

surface instance reference → independent semantic object.

## 13. Space / Workspace seam

Working definition:

- Space is semantic environment/context and remains CFA-01 owned.
- Workspace is a configured experience arrangement of a Space and is represented by CFA-08.

A Workspace may carry:
- chosen Views;
- layout;
- surface ordering;
- panel arrangement;
- preferred interaction configuration.

A Workspace is not a hidden semantic database.

The final durable join between workspace state and CFA-02 remains unresolved.

## 14. Selection and focus

Selection/focus may:
- seed Context;
- narrow presentation;
- identify a subject for inspection;
- choose an interaction target.

Selection/focus may not:
- grant authority;
- imply consent;
- prove existence;
- prove currentness;
- bypass semantic resolution.

If a selected target changed since the projection was generated, consequential action must re-resolve it.

## 15. Evidence and provenance presentation

A Surface may present evidence/provenance references.

Minimum presentation property:

claim/result
↕
supporting evidence reference

The Surface must not turn:
- evidence into authority;
- confidence into proof;
- source labels into canonical truth;
- presentation genealogy into canonical data lineage.

For consequential claims, the user should be able to distinguish:
- what is being shown;
- freshness status;
- supporting evidence reference;
- proposed vs executed vs refused state where applicable.

Exact visual treatment remains product policy.

## 16. Work / Authority / Capability rules

### Work

Render:
- state;
- progress;
- waiting;
- result;
- failure/refusal;
- evidence;
- next required user action.

Do not own Work transitions.

### Authority

Render:
- decision state;
- consent affordance;
- scope/expiry/revocation cues when supplied.

Do not manufacture or cache permanent authority.

### Capability / Provider

Render:
- valid choices;
- availability;
- provider/account/session state where supplied;
- routing explanation where supplied.

Do not redefine capability or authorize execution.

## 17. Error and refusal semantics

Do not collapse distinct conditions when the distinction affects user choice.

Preserve the difference between:
- surface unavailable;
- projection stale;
- projection unknown;
- projection invalid;
- authority refusal;
- semantic rejection;
- execution failure;
- uncertain external effect;
- successful execution.

The surface may simplify language, but not erase decision-relevant semantics.

## 18. Cross-surface rules

Where several surfaces expose the same operation family:

- semantic meaning comes from the shared semantic contract;
- surface affordances may differ;
- surface-specific presentation may differ;
- semantic execution still converges on the same owning path.

Reuse existing surfaceOpMeta and D-436 parity machinery where applicable.

Do not create a second surface derivation registry.

## 19. Reconstruction requirement

The strongest invariant is:

Delete disposable projection, layout and interaction state.
Keep canonical state and explicitly durable presentation configuration.
Reconstruct the Surface.

Expected result:
- canonical subjects unchanged;
- relationships unchanged;
- revisions unchanged;
- a valid View can be produced;
- loss limited to intentionally disposable local state.

If this fails, the boundary has hidden canonical responsibility.

## 20. Minimum proof fixture

Use a deterministic fixture containing:
- one project;
- one person;
- one conversation;
- one document;
- one Work item;
- one provider/account reference.

Prove:
1. distinct canonical subjects remain distinct;
2. relations are owner-defined references;
3. a View can be produced;
4. a second View can use the same subjects;
5. Layout changes do not alter identity;
6. projection deletion permits reconstruction;
7. revision advancement produces STALE/refresh behavior;
8. consequential surface action becomes a typed semantic request rather than a direct canonical write.

No browser, React, Next.js, Prisma or network dependency is required for the semantic proof.

## 21. Falsifiers

F-SV.1 — Projection deletion
Delete projection records.
Pass: canonical state survives and the Surface reconstructs.
Fail: UI records are required for canonical meaning.

F-SV.2 — Two surfaces / one identity
Project one subject into two surfaces.
Pass: both resolve to one canonical subject.
Fail: a second semantic identity is created.

F-SV.3 — Stale mutation
Advance the canonical revision under an open old projection.
Pass: stale state is explicit and consequential mutation re-resolves.
Fail: old UI state is accepted as current truth.

F-SV.4 — Layout corruption
Corrupt Layout state.
Pass: canonical state remains intact and a valid default surface can be rebuilt.
Fail: layout corruption damages canonical meaning.

F-SV.5 — View swap
Change View A to View B.
Pass: canonical identity/revision remains unchanged.
Fail: the view transition changes semantic identity.

F-SV.6 — Optimistic divergence
Force a canonical refusal after optimistic UI.
Pass: revert or explicitly show divergence.
Fail: provisional UI remains confirmed.

F-SV.7 — Direct-write bypass
Attempt to route a consequential surface action directly to canonical storage.
Pass: no permitted architectural path exists.
Fail: Surface can bypass the owning semantic contract.

F-SV.8 — Selection authority
Select a subject without authority.
Pass: selection changes presentation/context only.
Fail: selection grants or implies authority.

F-SV.9 — Fresh first load
Start with canonical state but no prior UI state.
Pass: valid default Surface/View is generated.
Fail: hidden UI persistence is mandatory.

F-SV.10 — Surface parity drift
Create divergence where the existing parity contract applies.
Pass: D-436-style derivation/parity machinery detects it.
Fail: drift remains invisible to a required mechanical check.

## 22. Peer decision gates

CFA-01 — BLOCKING for final SubjectRef and Space semantics.
Needed: current World/Space reference semantics, membership and addressability.
Decision: exact projection subject and Space/Workspace seam.

CFA-02 — HIGH-VALUE; BLOCKING for final durable-state ownership.
Needed: record identity, revision, reconstruction and canonical-vs-derived persistence rules.
Decision: what Surface/View/Layout state can persist and how it joins durable records.

CFA-03 — HIGH-VALUE; BLOCKING for consequential interaction contract.
Needed: current Intent creation, submit, resolve and interpretation-preview expectations.
Decision: mutation request envelope and visual Intent boundary.

CFA-04 — HIGH-VALUE.
Needed: authority/refusal/consent result semantics and live re-resolution.
Decision: how authority state is presented and confirmed.

CFA-05 — HIGH-VALUE where Surface controls Work.
Needed: Work lifecycle and control semantics.
Decision: Work-specific interaction mapping.

CFA-06 — CONTEXTUAL initially.
Needed: capability/routing choice semantics.
Decision: user-facing provider/capability choice controls.

CFA-07 — CONTEXTUAL initially.
Needed: composition editing and View/Composition boundary.
Decision: whether authored View configuration remains presentation state or enters Composition semantics.

CFA-09 — HIGH-VALUE for persisted presentation evolution.
Needed: replacement/versioning/migration expectations.
Decision: presentation-state evolution strategy.

CFA-10 — CONTEXTUAL.
Needed: runtime constraints on surface adapters.
Decision: deployment/runtime boundary for Surface realization.

## 23. Design gates

DG-1 — Minimum envelope
Accept only when SubjectRef, Projection, View, Layout, Interaction State and freshness are distinct.

DG-2 — No canonical shadow
Reject designs requiring UI state to recover canonical identity or meaning.

DG-3 — Semantic write-back
Reject consequential surface actions that bypass the owning semantic path.

DG-4 — Epistemic honesty
Reject designs that make stale appear current, unknown appear failed, proposed appear executed, or confidence appear proof.

DG-5 — Replaceability
A Surface implementation can be replaced or rebuilt without changing canonical subject identity or semantic contracts.

## 24. Explicit non-decisions

This contract does not decide:
- final database/schema;
- final Surface/View persistence namespace;
- exact Space/Workspace data model;
- semantic Attention ownership;
- UI framework;
- product shell;
- cross-device synchronization;
- collaborative multi-principal behavior;
- final View/Composition boundary;
- Ω law amendments.

## 25. Relationship to existing artifacts

ADOPT:
- destination world-surface-core research;
- destination world-surface falsifier blueprint;
- Ω D-383;
- Ω D-436;
- Ω D-411;
- shared surfaceOpMeta derivation.

ADOPT WITH NARROWING:
- WORLD-WORKSPACE-CANVAS-RECONCILIATION: use the semantic World→Space→Workspace→Surface direction while leaving durable storage details open.

HARVEST AS BEHAVIORAL EVIDENCE:
- Legacy CanvasEngine;
- CanvasMirror;
- LivingCanvas;
- AdaptiveWorkspaceEngine;
- workspace presets;
- UnifiedEntry;
- related tests.

DO NOT ADOPT AS DESTINATION AUTHORITY:
- legacy UI stores;
- DOM structure;
- component identity;
- canvas coordinates;
- frontend Prisma/router coupling.

## 26. Conclusion

The smallest defensible CFA-08 contract is:

Canonical Subject → Projection → View → Layout / Interaction State → Surface

with the return path:

Surface Interaction → Typed Semantic Request → Owning Canonical Path → Revision / Evidence → Projection Refresh

The strategic property is replaceability:

A surface may be replaced, deleted, corrupted, restyled or rebuilt without changing canonical meaning.

This is the bounded M1 contract from which the later Workspace/Canvas, Direct Manipulation, Truthful Continuity and Multi-Surface milestones can proceed.
