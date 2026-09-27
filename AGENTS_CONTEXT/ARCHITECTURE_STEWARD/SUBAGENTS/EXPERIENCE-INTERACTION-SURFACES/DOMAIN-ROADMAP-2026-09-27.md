# CFA-08 — Experience / Interaction / Surfaces
## Strategic Domain Roadmap — 2026-09-27

> Classification: DERIVED / PROPOSED strategic plan
> Freshness: CURRENT as first-pass independent Round-1 planning
> CFA: CFA-08
> agent_id: `experience-interaction-surfaces`
> Identity: RATIFIED — OWNER-ALIGNED
> Planning rule: independent first pass; this artifact does not consume or depend on new Round-1 roadmaps from peer CFAs.

## Strategic Objective

Make VIVIM's human-facing environment a coherent, replaceable projection and interaction substrate over canonical system meaning.

A successful realization makes it possible for a person to:

- arrive at a meaningful view of their World and current Work;
- see the same canonical subjects through different surfaces without identity duplication;
- navigate and directly manipulate those representations;
- inspect and edit semantic Intent before consequential action;
- see Work, authority, capability, composition, uncertainty and evidence without the surface redefining their meaning;
- leave and return without losing canonical continuity or requiring hidden UI state;
- move between Canvas, Workspace, Chat, panels and future surfaces while preserving one semantic interaction path.

The strategic objective is therefore not "build the frontend" and not "build a canvas." It is:

> **establish a surface contract in which representation, interaction, spatial organization, continuity and re-entry remain coherent while canonical meaning stays owned by the appropriate semantic domain.**

## Responsibility Frontier

CFA-08 covers the experience layer described by the ratified identity:

- Surface / View contracts;
- World / Context perception and navigation;
- Workspace / layout / Canvas realization;
- interaction grammar and direct manipulation;
- inspect/edit/confirm/reject presentation for Intent;
- Work / Authority / Capability / Composition presentation;
- focus / notification / delivery / re-entry presentation;
- surface-local configuration experience;
- typed semantic write-back initiation.

CFA-08 does not become the owner of:

- World / Space / Context semantics;
- canonical durable Data, persistence or record identity;
- semantic Intent / Plan meaning;
- live Authority / Consent;
- durable Work / Execution semantics;
- Capability / Provider / Realization / Routing;
- Composition / Plugin / Forge semantics;
- generic Evolution / Compatibility;
- K0/K1 enforcement;
- semantic Attention policy;
- any second ontology, canonical store, command system or evidence authority.

The persistent architectural invariants are:

`canonical semantic state != presentation state`

`gesture != semantic effect`

`presentation != authority`

`unknown != failure`

`confidence != proof`

## Current Evidence / Maturity

### OBSERVED — CURRENT

1. Destination responsibility rows R-094–R-097 explicitly cover Workspace/Space, Surface/View, Canvas/spatial layout and Direct Manipulation. Their current maturity is respectively PARTIAL, PARTIAL, PRODUCT FRONTIER and DESIGN-REQUIRED.
2. R-090 Attention is DESIGN-REQUIRED; R-091 Notification/Delivery is UNCHARACTERIZED; R-092 Background Continuity and R-093 Return/Re-entry are DESIGN-REQUIRED.
3. The destination World/Surface research lane already defines a coherent conceptual boundary: canonical World/Object state → projection → surface/view/layout/interaction state → semantic Intent → governed canonical change → evidence → projection refresh.
4. That same research explicitly says Canvas is not the reusable primitive; the reusable primitive is the governed projection and interaction path.
5. Ω D-383 is RATIFIED and establishes a pointer/default surface architecture: frontend surfaces are clients of Ω surfaces, not a second data platform; the current pointer shape is intended to be the stable shape through the earlier waves.
6. Ω D-436 is RATIFIED and establishes measurable surface parity through one shared derivation plus live probes, derivation stamps, reasoned N/A rows and a tamper gate.
7. `contracts/src/surface.ts` currently contains the shared `surfaceOpMeta` derivation of record. The MCP surface consumes it, and the web surface routes into the same host Gate → Resolve → Execute flow.
8. Existing destination research characterizes World ↔ Surface as technically strong but product-partial; product reconstruction and UX continuity remain incomplete.
9. Legacy VIVIM contains substantial behavioral evidence in CanvasEngine, CanvasMirror, LivingCanvas, workspace/preset/adaptive behavior, UnifiedEntry and related tests. This is historical evidence and harvest material, not destination authority.

### DERIVED — CURRENT

- A Surface must be treated as a reproducible projection boundary rather than a canonical container.
- A View is a representation choice over a subject/projection, not a new semantic identity.
- Layout and interaction state can be durable user state while remaining non-canonical.
- Direct manipulation should enter the same semantic system as language-driven interaction.
- The most important strategic risk is not insufficient UI functionality; it is accidental semantic duplication between surface-local state and canonical state.
- Reconstruction is a stronger architectural test than visual fidelity: if canonical state can survive projection/layout deletion and be re-presented, the surface boundary is healthy.
- Surface parity is a semantic concern as well as a UI concern because multiple surfaces must derive from the same governed vocabulary and capability shape.

### UNKNOWN / MATERIAL

- Exact final persistent envelope for Surface/View/Layout/Interaction state.
- Exact semantic-to-record join for durable presentation state while CFA-02 remains provisional.
- Exact World-vs-Intent distinction for different direct-manipulation gestures.
- Exact minimum evidence/provenance affordance for consequential user-visible claims.
- Final owner and policy model for semantic Attention.
- Cross-device continuity semantics for layout/focus/re-entry.
- Exact future boundary between View configuration and user-authored Composition.
- Final product-shell / OS boundary for persistent experience state.

### Strategic maturity read

CFA-08 is **conceptually well characterized but product-integration incomplete**.

The destination semantics and falsifiers are stronger than the finished product experience. The roadmap should therefore prioritize contract precision and reconstruction/integration proof before broad surface implementation.

---

## Conceptual Roadmap

### M1 — Surface / Projection Contract

**Conceptual outcome**

A stable, implementation-neutral contract distinguishes:

`canonical subject` → `projection` → `view` → `layout` → `interaction state`

and defines how each is referenced, refreshed, invalidated and discarded.

**Why it matters**

Without this separation, Canvas, Chat, panels and future surfaces can independently invent state that gradually becomes a second ontology or persistence layer.

**Evidence basis**

- R-095 Surface / View model — PARTIAL.
- world-surface-core Research Results and Falsifier Blueprint.
- D-383 pointer/default surface architecture.
- D-436 shared derivation/parity model.
- destination World/Workspace/Canvas reconciliation.

**Current maturity/state**

Semantic boundary is already well characterized in research. The specific contract remains design work.

**Design choices required at this stage**

- minimum projection envelope;
- canonical subject references;
- revision/freshness references;
- View identity/configuration;
- layout representation;
- interaction-state classification;
- durable-vs-ephemeral rules;
- projection invalidation/rebuild semantics;
- whether projections are persisted, cached or recomputed by default.

**Success criteria**

1. The contract can represent the same canonical subject on multiple surfaces without generating a new semantic identity.
2. A projection can become stale without changing canonical meaning.
3. Layout and interaction state can be removed without deleting canonical World state.
4. A view can change without changing subject identity.
5. Every consequential mutation has an explicit semantic owner and typed handoff.
6. The contract does not require a particular UI framework, database or browser.
7. A deterministic fixture can be described entirely from canonical subject references plus declared surface configuration.

**Falsifiers / failure conditions**

- UI-local identifiers are required to recover canonical object identity.
- Deleting projection/layout records destroys canonical meaning.
- Two surfaces require incompatible semantic copies of the same object.
- A stale projection can be accepted as current without re-resolution.
- The contract encodes framework-specific component trees as semantic state.

**Prerequisites**

- Ratified CFA-08 identity.
- Existing world-surface research.
- Current peer ownership baseline.

**Dependencies**

- CFA-01 for semantic World/Space/Context meaning.
- CFA-02 for durable record identity and persistence when the final persistence envelope is chosen.
- CFA-03 for semantic Intent handoff.
- CFA-04 for authority presentation and consequential mutation boundaries.
- CFA-10 for any runtime surface constraints.

**Candidate implementation later**

- Pure contract package / typed envelope;
- deterministic fixture model;
- projection/reconstruction test harness.

**Remain unresolved**

Exact storage location, cross-device synchronization and UI-specific realization remain open.

### Peer Intelligence Gate — M1

| Peer CFA | Intelligence / evidence needed | Why the milestone depends on it | Exact decision it informs | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-01 World & Context | Final semantic meaning of World/Space/Context references and projection inputs | Surface references must point at semantic subjects rather than create replacements | Projection subject-reference shape and Space/Workspace seam | Ratified/current World boundary plus explicit examples of owned semantic references | **BLOCKING** before final contract |
| CFA-02 Data / Identity / Persistence | Record identity, revision, persistence and reconstruction constraints | Durable presentation state must not accidentally claim canonical record ownership | Persistent surface-state envelope and reference strategy | Explicit current Data boundary plus provisional/unknown flags where unresolved | **HIGH-VALUE** |
| CFA-03 Semantic Continuity | Canonical Intent / Plan handoff shape and interpretation-preview requirements | Projection and interaction must converge on existing semantics | Interaction/mutation handoff envelope | Existing Intent contract plus explicit submit/resolve expectations | **HIGH-VALUE** |
| CFA-04 Authority | Presentation-safe authority/refusal/consent semantics | Surface cannot infer permission from appearance or stale state | How authority state is represented vs acted upon | Current authority contract and refusal payload requirements | **HIGH-VALUE** |
| CFA-10 Runtime | Runtime constraints on surface adapters and non-bypassable paths | Surface contracts must not imply privileged runtime behavior | Surface/runtime adapter limits | Current K0/K1 surface-relevant rules | **CONTEXTUAL** |

---

### M2 — Reconstructable Space / Workspace / Canvas

**Conceptual outcome**

A person can enter a Space and receive a coherent Workspace/Surface arrangement that can be saved, corrupted, replaced or deleted independently of canonical World identity.

**Why it matters**

VIVIM's spatial experience is central to the destination, but spatial state must remain a replaceable organization layer rather than a hidden database.

**Evidence basis**

- R-094 Workspace / Space — PARTIAL.
- R-096 Canvas / spatial layout — PRODUCT FRONTIER.
- WORLD-WORKSPACE-CANVAS-RECONCILIATION.
- world-surface-core research.
- legacy CanvasEngine, LivingCanvas, AdaptiveWorkspace and workspace presets.

**Current maturity/state**

Conceptual distinction is strong. Concrete persistence and reconstruction boundaries are not fully resolved.

**Design choices required**

- Space vs Workspace semantics;
- default workspace derivation;
- layout persistence granularity;
- multi-view and multi-surface membership;
- selection/focus lifecycle;
- workspace corruption recovery;
- cross-device continuity posture;
- whether user-created workspace templates become Composition inputs.

**Success criteria**

1. A default workspace can be generated from canonical World/Context plus declared configuration.
2. Workspace deletion does not delete canonical Things.
3. Layout corruption does not corrupt canonical state.
4. Restart reconstructs a valid surface from canonical state and explicitly durable workspace configuration.
5. Selection/focus survives only where intentionally durable and never grants authority.
6. The same Space can be expressed by more than one Workspace without semantic duplication.
7. A project-level experience can present people, conversations, files, Work and provider/account references through one coherent projection.

**Falsifiers**

- workspace records are required to restore canonical objects;
- canvas coordinates are the only recoverable identity;
- Space and Workspace become indistinguishable storage silos;
- adaptive mode changes semantic object identity;
- restoration silently resurrects stale canonical state.

**Prerequisites**

M1 contract.

**Dependencies**

- CFA-01 for Space semantics;
- CFA-02 for durable layout/workspace persistence;
- CFA-07 if workspace presets/templates cross into Composition;
- CFA-09 for replacement/migration semantics;
- CFA-10 for product/runtime constraints.

**Candidate implementation later**

Thin reconstruction harness, then bounded Workspace/Canvas realization.

**Remain unresolved**

Cross-device behavior and user-authored workspace/template semantics.

### Peer Intelligence Gate — M2

| Peer CFA | Intelligence / evidence needed | Why the milestone depends on it | Exact decision it informs | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-01 | Space semantic contract and membership/context meaning | Workspace cannot invent Space semantics | Space→Workspace boundary | Current ratified/proposed boundary with falsifiers | **BLOCKING** |
| CFA-02 | Persistence/revision/reconstruction semantics for surface-owned state | Determines what can safely survive restart | Layout/workspace durability envelope | Explicit persistence/revision boundary, even if provisional | **BLOCKING** for persistence decision |
| CFA-07 | Composition/template semantics if workspace presets become reusable authored artifacts | Prevents configuration and Composition from collapsing | Template vs Composition boundary | Current Composition identity/membership rules | **HIGH-VALUE** |
| CFA-09 | Replacement and compatibility expectations for persisted layout state | Avoids creating a state format that cannot evolve | Layout migration/versioning strategy | Current evolution/replacement policy and falsifiers | **HIGH-VALUE** |
| CFA-10 | Runtime surface restart/boot constraints | Reconstruction must fit actual runtime substrate | Restart/bootstrap realization constraints | Current relevant runtime contract | **CONTEXTUAL** |

---

### M3 — Interaction Convergence / Direct Manipulation

**Conceptual outcome**

Mouse, keyboard, touch, canvas gestures, panel actions and other direct-manipulation inputs all become typed experience actions that converge on the owning semantic system.

**Why it matters**

A visually rich surface becomes dangerous when a drag, resize, connect or button can mutate semantics through a private UI path that language or other surfaces do not share.

**Evidence basis**

- R-097 Direct manipulation — DESIGN-REQUIRED.
- canonical interaction spine: Address → Intent → Context → Capability → Routing → Authority → Work → Execution → Evidence → World/Memory.
- D-411-era intent seam evidence in current Ω web surface.
- legacy CanvasMirror, mutation-caps, UnifiedEntry and shared dispatch behavior.

**Current maturity/state**

The semantic convergence rule is established; direct-manipulation mapping by interaction class is not yet fully characterized.

**Design choices required**

- interaction event taxonomy;
- selection/focus semantics;
- semantic vs non-semantic gestures;
- mutation initiation envelope;
- preview/confirmation behavior;
- stale projection handling during manipulation;
- optimistic UI posture;
- cancellation/revert semantics.

**Success criteria**

1. Every consequential direct manipulation maps to a typed semantic action.
2. Non-semantic layout changes remain surface-local unless an explicit owner says otherwise.
3. Language interaction and direct manipulation can target the same canonical subject.
4. Optimistic state is explicitly provisional and reconciles/reverts on failure.
5. Stale projections re-resolve before consequential mutation.
6. Authority/refusal state is surfaced without being rewritten by the surface.
7. No second command or Intent authority is introduced.

**Falsifiers**

- drag/update can write canonical state directly;
- the UI invents a mutation type unknown to the owning semantic CFA;
- optimistic state is later treated as evidence without confirmation;
- a stale selected object mutates a new canonical subject after identity/revision changes;
- direct manipulation and language interaction produce incompatible canonical meanings for the same action.

**Prerequisites**

M1; M2 sufficiently defined to identify spatial events.

**Dependencies**

- CFA-03 Intent semantics;
- CFA-01 World semantics;
- CFA-04 authority;
- CFA-05 Work control semantics where manipulation controls Work;
- CFA-06 capability selection where interaction changes realization choice;
- CFA-07 composition edits.

**Candidate implementation later**

Deterministic interaction adapter and mutation-handoff harness.

**Remain unresolved**

Exact gesture-to-semantics mapping is intentionally postponed until peer contracts are explicit.

### Peer Intelligence Gate — M3

| Peer CFA | Intelligence / evidence needed | Why the milestone depends on it | Exact decision it informs | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-03 | Canonical Intent creation/submit/resolve contract | Direct manipulation must converge on canonical meaning | Which experience actions become Intent and how | Current Intent contract + resolution semantics | **BLOCKING** |
| CFA-01 | World addressability and mutation target semantics | Gestures need stable semantic targets | Object/reference resolution for spatial actions | Current World-side addressability and semantic identity contract | **BLOCKING** |
| CFA-04 | Authority/refusal/consent presentation and handoff | Consequential actions need governed UX | Preview/confirm/refuse flow | Current authority outputs + live gate semantics | **HIGH-VALUE** |
| CFA-05 | Work control semantics | Start/pause/cancel/approve interactions may target Work rather than World | Work-specific interaction mapping | Current Work lifecycle/command boundaries | **HIGH-VALUE** |
| CFA-06 | Capability/routing choice semantics | Some surface choices change routing, not World meaning | Selection-control semantics | Current Capability/Provider/Route boundary | **CONTEXTUAL** |
| CFA-07 | Composition editing and Forge handoff | Editing a composition must not bypass semantic admission | Composition editing action envelope | Current Composition identity/membership semantics | **CONTEXTUAL** |

---

### M4 — Truthful Continuity: Freshness, Evidence, Work, Attention and Re-entry

**Conceptual outcome**

The user can understand what a surface knows, what changed, what is still uncertain, what Work is active, what requires attention, and what happened while they were away.

**Why it matters**

A surface is not trustworthy if it looks current while its underlying projection is stale, its Work is unknown, or its attention signal is indistinguishable from authority.

**Evidence basis**

- R-090 Attention — DESIGN-REQUIRED.
- R-091 Notification/Delivery — UNCHARACTERIZED.
- R-092 Background Continuity — DESIGN-REQUIRED.
- R-093 Return/Re-entry — DESIGN-REQUIRED.
- world-surface-core freshness/staleness model.
- Work & Execution and destination continuity material.
- D-436 parity/derivation measurement discipline.

**Current maturity/state**

Core distinctions exist; product-grade truth presentation and re-entry behavior remain under-characterized.

**Design choices required**

- freshness vocabulary and presentation;
- evidence/provenance affordance;
- Work projection envelope;
- attention vs notification distinction;
- return/re-entry synthesis;
- pending decision representation;
- how background changes invalidate or refresh open surfaces.

**Success criteria**

1. Users can distinguish CURRENT, STALE, UNKNOWN, INVALID and REBUILDING projection states where relevant.
2. Consequential interactions never treat stale projections as authoritative.
3. Work state is shown as a projection of canonical Work rather than a UI task list.
4. Attention presentation does not grant authority or imply execution.
5. Return/re-entry can summarize changes, failures, pending user actions and next state.
6. Evidence/provenance for consequential claims is inspectable at an appropriate level.
7. A user can leave and return without semantic reconstruction being hidden inside UI storage.

**Falsifiers**

- UI badges imply authority not present in canonical state;
- stale data is presented as current without qualification;
- notification acknowledgement changes Work/Authority semantics by itself;
- return summaries omit a material refusal/failure or silently flatten uncertainty;
- attention state becomes a second task/work database.

**Prerequisites**

M1; initial M2 reconstruction shape.

**Dependencies**

- CFA-05 Work;
- CFA-04 Authority;
- CFA-01 World/Context;
- CFA-09 change/continuity semantics;
- CFA-02 for durable return-state persistence where necessary.

**Candidate implementation later**

Thin continuity projection and re-entry harness.

**Remain unresolved**

Final semantic Attention owner and detailed multi-device continuity remain outside this first roadmap pass.

### Peer Intelligence Gate — M4

| Peer CFA | Intelligence / evidence needed | Why the milestone depends on it | Exact decision it informs | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-05 | Canonical Work lifecycle, Attempt/Outcome and recovery semantics | Surface must present durable Work truth correctly | Work projection and re-entry fields | Current Work state/Outcome contract | **BLOCKING** |
| CFA-04 | Authority decision/refusal/consent semantics | Surface must display permission state without becoming authority | Refusal/approval UI semantics | Current authority outputs and invalidation rules | **BLOCKING** |
| CFA-01 | World/Context freshness and projection meaning | Return surfaces depend on what changed in World | Change/freshness presentation | Current World observation/projection semantics | **HIGH-VALUE** |
| CFA-09 | Change/replacement/compatibility impact semantics | Re-entry may need to explain changed or replaced surfaces | Continuity and replacement messaging | Current change-impact/replacement boundary | **HIGH-VALUE** |
| CFA-02 | Durable record/reconstruction constraints for return state | Determines whether continuity survives process/device loss | Persistent return-state envelope | Current persistence/reconstruction contract | **CONTEXTUAL** |

---

### M5 — Replaceable Multi-Surface Experience and Measured Parity

**Conceptual outcome**

Canvas, Web, Chat, panels, CLI/MCP-connected experiences and future surfaces behave as distinct realizations of one governed interaction/projection vocabulary.

**Why it matters**

VIVIM's experience should be able to evolve surface by surface without silently creating divergent semantics. Ω already provides an important technical precedent: one surface derivation feeding multiple consumers.

**Evidence basis**

- D-383 pointer/default architecture.
- D-436 measured parity.
- `contracts/src/surface.ts` shared derivation.
- current CLI/MCP/Web implementations.
- destination universal interaction and World/Surface research.
- legacy multiple-surface evidence.

**Current maturity/state**

Technical parity/derivation machinery exists in Ω. Finished product-level multi-surface UX parity remains incomplete.

**Design choices required**

- which experience concerns are universal versus surface-specific;
- surface capability vocabulary;
- derivation versus local specialization;
- parity test boundaries;
- how a new surface is admitted without creating a new command system;
- how surface versioning interacts with canonical semantics.

**Success criteria**

1. Multiple surfaces can represent the same canonical subject and operation vocabulary.
2. Shared derivation remains the single source for surface operation metadata where applicable.
3. Surface-specific affordances do not create alternative semantic authority.
4. Surface drift can be detected mechanically where the parity contract applies.
5. A new surface can be added without creating a second canonical data or command system.
6. Surface replacement does not require changing canonical World/Intent/Work identity.
7. The experience layer remains able to support new visual forms without rewriting semantic contracts.

**Falsifiers**

- new surface requires duplicated semantic routing logic;
- surface-specific labels become canonical operation identity;
- drift is discovered only by manual review where a mechanical parity contract exists;
- surface replacement forces canonical identity migration without a semantic reason;
- shared derivation cannot reproduce the same operation vocabulary deterministically.

**Prerequisites**

M1–M4.

**Dependencies**

- CFA-03 canonical interaction semantics;
- CFA-06 capability/routing semantics;
- CFA-07 composition semantics;
- CFA-09 evolution/versioning;
- CFA-10 runtime surface boundary;
- CFA-02 persistence of durable surface registrations if needed.

**Candidate implementation later**

Surface parity probe extensions, surface adapter contract tests and product-level cross-surface fixtures.

**Remain unresolved**

The precise product-shell implementation and future 3D/multi-device realization remain later concerns.

### Peer Intelligence Gate — M5

| Peer CFA | Intelligence / evidence needed | Why the milestone depends on it | Exact decision it informs | Minimum acceptable evidence | Timing |
|---|---|---|---|---|---|
| CFA-03 | Stable semantic interaction/Intent vocabulary across surfaces | Ensures universal interaction remains one semantic system | Universal vs surface-specific action boundary | Canonical command/Intent contract and known allowed specializations | **BLOCKING** |
| CFA-06 | Capability/routing derivation and surface choice constraints | Surface parity must not imply identical provider behavior | Surface-visible capability/choice boundary | Current routing/capability contract plus explicit realization constraints | **HIGH-VALUE** |
| CFA-07 | Composition contribution and surface generation implications | New compositions may contribute surfaces or affordances | Surface contribution/admission boundary | Current composition/Forge contribution semantics | **HIGH-VALUE** |
| CFA-09 | Versioning, replacement and compatibility rules | Surface evolution must not silently fork semantic identity | Surface version/replacement strategy | Current evolution contract and replacement falsifiers | **HIGH-VALUE** |
| CFA-10 | Runtime admission and enforcement constraints for surface adapters | New surfaces must fit the governed substrate | Runtime/surface integration boundary | Current K0/K1 contract where applicable | **CONTEXTUAL** |
| CFA-02 | Durable registration/persistence requirements if surface identity/config becomes persisted | Avoid duplicate persistence ownership | Surface registration/state persistence join | Current data boundary, even if provisional | **CONTEXTUAL** |

---

## Dependency Model

The following are **candidate dependencies**, not automatically activated shared boundaries. A dependency becomes architectural only when the supplying CFA confirms ownership and the consuming decision demonstrates that the evidence is required.

| Source CFA | Subject | Dependency kind | Current / target | Direct / transitive | Required / preferred | Known / inferred | Confirmation / falsifier |
|---|---|---|---|---|---|---|---|
| CFA-01 | World / Space / Context semantic references | semantic | Current | Direct | Required | Known | Contract cannot identify subjects independently of semantic owner |
| CFA-02 | Durable record/revision/reconstruction envelope | data | Target | Direct | Required for durable state decisions | Known boundary, exact join unresolved | Surface persistence would otherwise duplicate canonical Data |
| CFA-03 | Intent / Plan semantic handoff | semantic | Current / target | Direct | Required for consequential interaction | Known | Any direct manipulation lacking an owning Intent/semantic path is a fail |
| CFA-04 | Authority / Consent / Refusal | authority | Current | Direct | Required for consequential mutation presentation | Known | UI must never infer permission from presentation state |
| CFA-05 | Work / Attempt / Outcome projections | execution | Target | Direct | Required for Work-facing surfaces | Known boundary, detailed projection unresolved | Work projection must survive surface deletion |
| CFA-06 | Capability / Provider / Routing choices | realization/provider | Target | Direct | Required where experience exposes choice | Known | Surface choice must not redefine routing or authority |
| CFA-07 | Composition / Forge editing semantics | semantic | Target | Direct | Required for composition editing surfaces | Known | Surface cannot bypass composition admission/evolution |
| CFA-09 | replacement/version/compatibility | lifecycle/evolution | Target | Mostly transitive | High-value | Inferred for persisted surface formats | Replacement must preserve semantic identity |
| CFA-10 | runtime surface constraints | runtime/platform | Current / target | Direct | Preferred except for constrained runtime seams | Known K0/K1 boundary | Surface realization must not create bypass paths |

### Dependency principles

- Peer intelligence requests remain requests until confirmed by reconciliation.
- CFA-08 can continue conceptual work with unresolved peers by explicitly preserving uncertainty.
- Durable-state design is the main place where CFA-02 can become a blocking dependency.
- Semantic mutation design is the main place where CFA-01/CFA-03/CFA-04 become blocking.
- Product continuity design becomes materially dependent on CFA-05 once the surface claims to represent durable Work.

---

## Tooling / Substrate

| Milestone | Tool / substrate | Status | Purpose |
|---|---|---|---|
| M1 | Existing world-surface-core falsifier model | **ALREADY EXISTS** | Establish contract invariants without implementation coupling |
| M1 | Typed pure projection fixture / serializer | **NEEDS SMALL EXTENSION** | Make the projection envelope mechanically testable |
| M1 | Repository semantic search / graph inspection | **ALREADY EXISTS** | Trace ownership and existing contracts |
| M2 | Thin deterministic reconstruction harness | **ALREADY EXISTS conceptually; NEEDS SMALL EXTENSION** | Prove restart/delete/rebuild invariants |
| M2 | Legacy CanvasMirror / workspace tests | **ALREADY EXISTS as historical evidence** | Harvest interaction behavior; not authority |
| M2 | Cross-device prototype tooling | **NOT YET NEEDED** | Wait until local persistence envelope is understood |
| M3 | Interaction-to-semantic falsifier harness | **NEEDS SMALL EXTENSION** | Prove gesture → typed handoff → canonical path |
| M3 | Live browser/desktop automation | **NOT YET NEEDED** | Semantic mapping should be falsified with pure fixtures first |
| M4 | Continuity/re-entry projection fixture | **NEEDS SMALL EXTENSION** | Test stale/unknown/refused/work-return states |
| M4 | Evidence/provenance display fixture | **NEW TOOL JUSTIFIED** only when minimum evidence contract is defined | Validate visible uncertainty without coupling to a UI framework |
| M5 | Existing `surfaceOpMeta` derivation | **ALREADY EXISTS** | Shared surface vocabulary |
| M5 | Existing surfacesync parity gate | **ALREADY EXISTS** | Mechanical drift detection |
| M5 | Surface parity cross-surface fixture suite | **NEEDS SMALL EXTENSION** | Verify common subject/action behavior |
| All | Visual prototype / full frontend stack | **NOT YET NEEDED for strategic decisions** | Visual polish should follow contract/falsifier closure |

### Tooling principle

The thin deterministic harness is the preferred first proof instrument because the strategic failures being tested are semantic and reconstructive, not framework-specific.

---

## Strategic Decision Gates

### SG-1 — What is the minimal Surface/View contract?

- **Decision:** finalize the representation envelope and its state classifications.
- **Alternatives still open:** persisted projection vs recomputed projection; exact View/config shape; layout linkage.
- **Evidence required:** M1 peer gates and existing world-surface research/falsifiers.
- **Decision owner:** CFA-08 within delegated experience scope, with peer semantic owners for their own meanings.
- **Owner intent required:** only if the choice materially changes product-level persistence/experience policy.
- **Falsifier:** contract forces UI state to become canonical meaning or cannot reconstruct a surface without hidden UI data.

### SG-2 — Which surface state is durable?

- **Decision:** classify layout, View configuration, focus and interaction state as durable preference, reconstructable derived state or ephemeral state.
- **Alternatives:** all-session persistence; selective persistence; reconstruction-first with minimal persistence.
- **Evidence required:** CFA-02 persistence/reconstruction evidence + CFA-01 Space semantics.
- **Decision owner:** shared/owner-aligned where durable data ownership is affected.
- **Owner intent required:** likely for cross-device/product persistence policy.
- **Falsifier:** persisted surface state becomes required to restore canonical World meaning.

### SG-3 — What direct manipulations are semantic mutations?

- **Decision:** classify gesture/action families and determine their owning semantic handoff.
- **Alternatives:** World mutation; Intent edit; Work control; composition edit; surface-local organization.
- **Evidence required:** CFA-01/CFA-03/CFA-04/CFA-05/CFA-07 peer contracts.
- **Decision owner:** CFA-08 decides experience mechanics; semantic owner decides meaning.
- **Owner intent required:** where product policy determines a consequential user-facing interaction.
- **Falsifier:** same gesture cannot be mapped unambiguously to an owning semantic path without a second command system.

### SG-4 — What must the user see about epistemic state?

- **Decision:** minimum visible freshness, refusal, uncertainty, provenance and result status.
- **Alternatives:** minimal badge; contextual explanation; inspectable evidence affordance.
- **Evidence required:** source/evidence contract from owning peers and concrete consequential journeys.
- **Decision owner:** CFA-08 for presentation; evidence/semantic owners for claim meaning.
- **Owner intent required:** when UX tradeoffs determine what is shown by default.
- **Falsifier:** users cannot distinguish stale/refused/unknown states where that distinction changes a consequential choice.

### SG-5 — What must be common across surfaces?

- **Decision:** universal interaction vocabulary vs surface-specific affordances.
- **Alternatives:** strict parity; shared semantic core + surface specialization; independent surfaces.
- **Evidence required:** D-383/D-436 machinery plus peer semantic vocabularies.
- **Decision owner:** CFA-08 for experience contract; affected semantic owners for meaning.
- **Owner intent required:** only if the product deliberately accepts a semantic difference between surfaces.
- **Falsifier:** a new surface needs a second semantic command/operation derivation.

---

## Product / Strategic Consequences

### Positive capabilities enabled

- VIVIM can present one World through Canvas, Workspace, Chat and specialized panels without duplicating semantic identity.
- The user can reorganize their environment without becoming a database administrator.
- A surface can be replaced or rebuilt without destroying canonical meaning.
- Direct manipulation can feel native while remaining inside governed semantic pathways.
- Work and background continuity can become legible without turning the UI into a second task engine.
- Provider/account/capability choice can be user-facing without transferring routing authority into the UI.
- New surfaces can be added through the same governed vocabulary rather than multiplying command systems.
- Future visual modalities can evolve while canonical semantics remain stable.

### Strategic constraints

- Broad frontend implementation before contract/falsifier work risks recreating the legacy data-layer coupling that D-383 explicitly avoids.
- Cross-device continuity should not be treated as a UI feature before durable presentation-state ownership is understood.
- Visual richness does not justify making the surface canonical.
- "Adaptive" behavior should change presentation, not semantic identity.
- Product customization should not silently become Composition semantics without a deliberate seam decision.

### Product proof implications

The strongest product proofs are expected to be:

1. open a meaningful project/world space;
2. show one canonical subject through multiple views;
3. directly manipulate it;
4. observe semantic/gated consequences;
5. leave and return;
6. reconstruct after surface-state loss;
7. show truthful Work/Attention/uncertainty status;
8. repeat through another surface.

---

## Deferred / Do Not Do

- Do not build a full frontend as the first architectural proof.
- Do not create a parallel surface database or ontology.
- Do not port the legacy Prisma/router layer into Ω merely to accelerate UI work.
- Do not make Canvas coordinates or DOM nodes canonical identity.
- Do not create a separate "UI Intent" or "UI command" system.
- Do not treat optimistic UI state as evidence or authority.
- Do not make notification acknowledgement mutate Work/Authority unless an owning semantic contract explicitly says so.
- Do not settle cross-device persistence before local reconstruction semantics are clear.
- Do not create a new parity/derivation system while `surfaceOpMeta` and D-436 already supply the relevant Ω mechanism.
- Do not promote legacy UX behavior into destination law without independent evidence.
- Do not turn all five milestones into immediate implementation tickets.
- Do not activate shared CFA boundaries during this strategic planning round.
- Do not alter Ω law.

---

## Relationship to Existing Program Plans

| Existing material | Classification | Reason |
|---|---|---|
| world-surface-core Research Results | **ADOPTED** | It already defines the strongest available surface/projection boundary and falsifiers. |
| world-surface-core Falsifier Blueprint | **ADOPTED** | Provides the correct first proof model; should be extended rather than replaced. |
| WORLD-WORKSPACE-CANVAS-RECONCILIATION / D2 | **ADOPTED WITH MODIFICATION** | Adopt world→space→workspace→surface direction, but use the new Surface/View contract as the tighter first design gate. |
| Ω D-383 surface-pointer decision | **ADOPTED** | Establishes the architectural pointer/default posture and avoids frontend data-layer duplication. |
| Ω D-436 surface-sync | **ADOPTED** | Existing parity/drift machinery is the basis for measured multi-surface consistency. |
| `surfaceOpMeta` shared derivation | **ADOPTED** | Reuse existing shared derivation; do not invent a second surface vocabulary source. |
| Legacy CanvasEngine / CanvasMirror / LivingCanvas | **USEFUL INPUT / NOT ADOPTED AS ARCHITECTURE** | Valuable behavioral evidence and harvest candidates; historical, not authoritative. |
| Legacy UnifiedEntry | **USEFUL INPUT / NOT ADOPTED AS ARCHITECTURE** | Useful interaction pattern; semantic behavior must follow current Intent/owner paths. |
| Legacy AdaptiveWorkspaceEngine / presets | **USEFUL INPUT / NOT ADOPTED AS ARCHITECTURE** | Useful adaptive-presentation evidence; storage and mode semantics require destination treatment. |
| P1-03 / ontology-related work | **USEFUL INPUT / NOT OWNED** | Needed for subject references and Space meaning; CFA-08 does not absorb World semantics. |
| P1-04 / self-knowledge-context | **USEFUL INPUT / NOT OWNED** | Context presentation is relevant; semantic context/grounding remains owned elsewhere. |
| P1-05 / runtime/surface work | **ADOPTED WITH MODIFICATION** | Consume the runtime surface boundary and technical substrate, but do not let runtime mechanics dictate product experience semantics. |
| P1-09 / integrated proof | **DEFERRED** | Useful later as a cross-CFA proof destination; not a local roadmap prerequisite for first design stages. |
| Provider Lab work | **OUTSIDE CFA SCOPE / USEFUL INPUT** | Browser/provider behavior informs capability-facing presentation, but provider realization semantics remain CFA-06. |
| Historical frontend reconstruction plans | **DEFERRED / SUPERSEDED WHERE IN CONFLICT** | Keep behavioral evidence; do not resurrect old architecture or data-layer coupling. |

---

## First Bounded Actionable Work

The first actionable body of work is:

### SURFACE-VIEW-CONTRACT-2026-09-27

**Objective**

Define the minimum implementation-neutral Surface/View representation contract and the durable-vs-ephemeral presentation-state envelope.

**Advances**

M1 — Surface / Projection Contract.

**Dependencies**

- CFA-01 semantic World/Space/Context boundary.
- CFA-02 durable-data boundary when deciding persistence.
- CFA-03 Intent handoff shape for consequential interaction.

These are peer-intelligence requests initially; they become hard dependencies only when the evidence confirms the decision cannot be made safely without them.

**Peer inputs required**

See M1 Peer Intelligence Gate. In the first pass, gather current artifacts and preserve unresolved joins rather than creating new shared-boundary commitments.

**Tooling required**

Existing world-surface falsifiers plus a small typed pure projection fixture extension. No browser/frontend implementation is required yet.

**Write scope**

Own CFA-08 home and bounded Surface/View research artifacts.

**Next action**

Produce the evidence-backed Surface/View contract, explicitly classifying canonical subject refs, projection state, View configuration, layout, selection/focus, interaction state, freshness and durable persistence.

**Completion condition**

A bounded contract exists that:
- identifies semantic ownership;
- separates canonical and presentation state;
- specifies mutation handoff;
- specifies freshness/epistemic-state handling;
- survives projection deletion/reconstruction reasoning;
- names remaining unknowns and falsifiers.

**Stop condition**

Stop on owner policy ambiguity, peer semantic ownership conflict, or Ω-law collision. Do not begin production implementation.

---

## Evidence Index

### Ω authority / contracts

- `omega-baseline/omega-final/docs/decisions/D-383-surface-pointer.md` — RATIFIED surface pointer/default architecture.
- `omega-baseline/omega-final/docs/decisions/D-436-surface-sync.md` — RATIFIED surface parity/derivation/tamper discipline.
- `omega-baseline/omega-final/contracts/src/surface.ts` — current shared surface operation derivation.

### Destination architecture

- `docs/destination/core-vs-plugin-boundary/DESTINATION-RESPONSIBILITY-MATRIX.md` — R-090–R-097 responsibility baseline and maturity.
- `docs/destination/WORLD-WORKSPACE-CANVAS-RECONCILIATION.md` — World/Space/Workspace/Surface/Canvas reconciliation.
- `docs/destination/world-surface-core/README.md`
- `docs/destination/world-surface-core/RESEARCH-CHARTER.md`
- `docs/destination/world-surface-core/RESEARCH-RESULTS.md`
- `docs/destination/world-surface-core/STATE.md`
- `docs/destination/world-surface-core/FALSIFIER-BLUEPRINT.md`
- `docs/destination/DESTINATION-MASTER-MAP.md`
- `docs/destination/RECONCILIATION-MAP.md`
- `docs/destination/architecture/research/JOURNEY-ARCHITECTURE-MAPPING.md`
- `docs/destination/system-intelligence/synthesis/DEPENDENCY-MAP.md`
- `docs/destination/system-intelligence/synthesis/PRODUCT-TRACE.md`

### Historical evidence

- `vivim-original-baseline/vivim-final-enhanced/src/canvas/canvas-engine.ts`
- `vivim-original-baseline/vivim-final-enhanced/src/canvas/canvas-mirror.ts`
- `vivim-original-baseline/vivim-final-enhanced/src/canvas/mutation-caps.ts`
- `vivim-original-baseline/vivim-final-enhanced/src/engines/adaptive-workspace.ts`
- `vivim-original-baseline/vivim-final-enhanced/frontend/src/components/canvas/UnifiedEntry.tsx`
- associated tests and source-atlas entries.

### CFA-08 authority / planning context

- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/EXPERIENCE-INTERACTION-SURFACES/CORE-AGENT.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/EXPERIENCE-INTERACTION-SURFACES/OWNER-ALIGNMENT-2026-09-27.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/EXPERIENCE-INTERACTION-SURFACES/STATE.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/EXPERIENCE-INTERACTION-SURFACES/TASKS.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/CFA-DOMAIN-ROADMAP-FORMATION-PROTOCOL-2026-09-27.md`

## First-pass planning status

This roadmap is an independent CFA-08 planning model produced before consuming new Round-1 peer roadmaps. It is intentionally detailed locally; the later central Steward synthesis should reference it rather than flattening it into a generic plan.

It is not Ω law, does not activate shared boundaries, and does not authorize production implementation.
