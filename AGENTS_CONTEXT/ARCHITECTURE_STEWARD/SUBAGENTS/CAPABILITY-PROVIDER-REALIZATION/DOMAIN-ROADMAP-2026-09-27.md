# CFA-06 — Strategic Domain Roadmap
## Strategic Objective
Make VIVIM's capability-to-external-realization boundary coherent, replaceable, evidence-backed, and routable without collapsing Capability, Provider, Account, Model, Session, Resource, Authority, Work, or Evidence.

## Responsibility Frontier
CFA-06 owns the semantic capability/realization interface; Provider, Account, Model, Session and Resource realization semantics; routing/selection; provider-specific discovery, protocol/parser/selector knowledge, drift and healing; and realization-side evidence. CFA-02 owns durable identity/persistence/revision/lineage/reconstruction. CFA-04 owns live Authority. CFA-05 owns Work/execution. CFA-09 owns generic evolution/compatibility/self-maintenance. CFA-10 owns runtime constitutional enforcement.

## Current Evidence / Maturity
- Capability / Provider / Realization distinction: DERIVED / CURRENT.
- ProviderRealization and provider-browser mechanisms exist in Ω: OBSERVED / CURRENT.
- D-418 establishes Chrome master/slave provider.browser as V1 substrate: OBSERVED / CURRENT.
- D-419 establishes attach-only CDP and live-vs-fixture falsification: OBSERVED / CURRENT.
- Routing selects and does not authorize: DERIVED / CURRENT.
- Account/Session durable join: UNKNOWN.
- Provider-specific healing to generic evolution handoff: UNKNOWN.
- Complete live provider/account/routing proof: UNKNOWN.
- Heterogeneous model-selection semantics: UNKNOWN.

## Conceptual Roadmap

### M1 — Capability-to-Realization Contract
Outcome: precise contract for capability identity, operation references, realization eligibility, effect/risk metadata, candidate validity, and semantic-versus-provider-specific state.
Success: a candidate can be characterized without UI selectors; unknown and invalid remain distinct; realization replacement does not silently change capability meaning.
Falsifiers: provider-specific implementation becomes required to define capability meaning, or routing must reinterpret capability semantics.
Prerequisites: current Ω contracts and CFA-02 identity evidence.

Peer Intelligence Gate: CFA-02 BLOCKING for identity/revision/lineage seam; CFA-04 BLOCKING for authority/effect metadata; CFA-03 HIGH-VALUE for continuity; CFA-01 HIGH-VALUE for canonical meaning; CFA-05 HIGH-VALUE for Work context; CFA-07 CONTEXTUAL for composition; CFA-08 CONTEXTUAL for surface exposure; CFA-09 HIGH-VALUE for replacement invariants; CFA-10 CONTEXTUAL for runtime constraints.

### M2 — Provider / Account / Session / Resource Model
Outcome: distinct semantic roles and lifecycle transitions with one durable seam to CFA-02.
Success: a concrete realization identifies provider, account, model, session and resource independently and can be reconstructed without a CFA-06 shadow store.
Falsifiers: account and session cannot be separated without losing meaning, or persistence requires a second canonical store.
Dependencies: CFA-02 durable identity; CFA-04 secret/authority boundary; CFA-05 execution context.
Peer Intelligence Gate: CFA-02 BLOCKING; CFA-04 BLOCKING; CFA-01 HIGH-VALUE; CFA-09 HIGH-VALUE; CFA-05 HIGH-VALUE.

### M3 — Routing and Authority-Compatible Candidate Selection
Outcome: user-owned routing selects among valid candidates while remaining strictly separate from Authority.
Success: routing produces an auditable candidate choice; never grants authority; never caches authority; preserves unknown versus unavailable.
Falsifier: routing must authorize or depends on hidden authority state.
Dependencies: CFA-04, CFA-05, CFA-03.
Peer Intelligence Gate: CFA-04 BLOCKING for authorization timing/revocation; CFA-05 BLOCKING for Work/Attempt seam; CFA-03 HIGH-VALUE for multi-step continuity; CFA-08 HIGH-VALUE for user policy surface; CFA-10 CONTEXTUAL for runtime invariants.

### M4 — Live Provider Realization Proof
Outcome: authenticated provider/browser realization is empirically distinguishable from fixture success.
Success: V1 provider.browser demonstrates candidate → attached account/session → concrete interaction → attributable external observation, with the live-vs-fixture substitution falsifier.
Falsifier: fixture substitution can pass as live realization, or external evidence cannot be attributed to the realization context.
Dependencies: M1-M3, Provider Lab, CFA-04, CFA-05, CFA-10.
Peer Intelligence Gate: CFA-05 BLOCKING for realization evidence linkage; CFA-04 BLOCKING for authorized effect boundary; CFA-10 HIGH-VALUE for observability; CFA-09 HIGH-VALUE for repair promotion; CFA-08 CONTEXTUAL for user-visible proof.

### M5 — Provider Discovery, Drift, Healing and Replacement
Outcome: provider-specific drift can be detected, diagnosed, repaired or quarantined, with evidence lineage and a clean handoff to CFA-09.
Success: repaired knowledge is attributable; provider repair remains distinct from generic migration/rollback; semantic capability continuity is testable.
Falsifier: repair requires hidden global authority or repaired selectors/protocols become canonical meaning without evidence.
Dependencies: M4, CFA-09, CFA-10, Provider Lab.
Peer Intelligence Gate: CFA-09 BLOCKING; CFA-10 HIGH-VALUE; CFA-02 HIGH-VALUE; CFA-04 HIGH-VALUE; CFA-05 HIGH-VALUE.

### M6 — Portability, Continuity and Heterogeneous Providers
Outcome: provider addition/replacement preserves semantic capability continuity where justified while exposing meaningful provider differences.
Success: replacement preserves capability identity when evidence supports equivalence, records differences explicitly, and leaves routing/authority semantics intact.
Falsifier: provider replacement changes canonical meaning or requires a hidden universal provider abstraction.
Peer Intelligence Gate: CFA-01 BLOCKING; CFA-05 BLOCKING; CFA-09 BLOCKING; CFA-03 HIGH-VALUE; CFA-04 HIGH-VALUE; CFA-07 HIGH-VALUE; CFA-08 CONTEXTUAL; CFA-10 HIGH-VALUE.

## Dependency Model
| Dependency | Kind | CFA | Status | Confirmation |
|---|---|---|---|---|
| Durable identity/revision seam | data | CFA-02 | required | explicit Account/Session/Realization persistence envelope |
| Live authorization | authority | CFA-04 | required | executable authority boundary |
| Work/Attempt lifecycle | execution | CFA-05 | required | routing and recovery evidence |
| Semantic continuity | semantic | CFA-03 | high-value | multi-step/replacement cases |
| World identity | semantic | CFA-01 | high-value | canonical continuity rules |
| Composition admission | semantic/execution | CFA-07 | preferred | capability admission cases |
| Surface constraints | surface/UX | CFA-08 | contextual | routing/provider-switch journeys |
| Generic evolution handoff | lifecycle/evolution | CFA-09 | required | provider-healing contract |
| Runtime containment/observability | runtime/platform | CFA-10 | required for live proof | evidence/rollback invariants |
| Provider Lab | realization/provider | external substrate | required M4+ | live authenticated proof |

These are planning dependencies, not declarations that a peer has accepted new scope.

## Tooling / Substrate
- Repository search, Ω contract inspection and graph/lens inspection: ALREADY EXISTS.
- Deterministic contract/round-trip tests: NEEDS SMALL EXTENSION.
- Provider Lab, Chrome extension/profile substrate and attach-only CDP: ALREADY EXISTS / NEEDS SMALL EXTENSION.
- Live-vs-fixture falsification and evidence capture: ALREADY EXISTS / NEEDS SMALL EXTENSION.
- New autonomous healing platform: NOT YET JUSTIFIED.

## Strategic Decision Gates
1. G1 Capability candidate validity — CFA-06 with CFA-02/CFA-04 evidence.
2. G2 Account/Session data seam — CFA-06 + CFA-02.
3. G3 Routing/Authority seam — CFA-06 + CFA-04.
4. G4 Live realization proof — CFA-06 + CFA-04/CFA-05/CFA-10.
5. G5 Healing/evolution boundary — CFA-06 + CFA-09.
6. G6 Portability/continuity — cross-CFA reconciliation.
Owner intent is required when a gate would alter an aligned boundary, Ω law, or canonical authority/data store.

## Product / Strategic Consequences
- Provider independence without pretending providers are identical.
- User-owned routing remains separate from authorization.
- Provider/browser evolution does not rewrite canonical semantic meaning.
- Drift and provider failure become explicit evidence states.
- Provider replacement becomes a continuity test rather than an implementation-specific migration.

## Deferred / Do Not Do
- Do not build a universal provider abstraction before evidence requires it.
- Do not make routing an authorization cache.
- Do not create a second Account/Session data store.
- Do not turn Provider Lab artifacts into Ω law.
- Do not build broad autonomous healing before the provider-healing/evolution boundary is proven.
- Do not create a separate Capability standing agent without evidence.
- Do not convert every conceptual milestone into immediate implementation backlog.

## Relationship to Existing Program Plans
| Existing material | Classification |
|---|---|
| Ω ProviderRealization/provider-browser contracts | ADOPTED WITH MODIFICATION |
| D-418 Chrome master/slave V1 substrate | ADOPTED |
| D-419 attach-only CDP + live-vs-fixture falsifier | ADOPTED |
| Provider Laboratory | ADOPTED WITH MODIFICATION |
| Legacy ProviderDefinition/ProviderAccount/ProviderMux/profile/healing | USEFUL INPUT / NOT ADOPTED |
| Prior P1/provider workstreams | USEFUL INPUT / NOT ADOPTED until mapped |
| Build-and-Harvest | ADOPTED WITH MODIFICATION as evidence archaeology |
| Destination reconciliation cycles | ADOPTED |
| Bootstrap artifacts | ADOPTED as identity/boundary lineage |

## First Bounded Execution Frontier
Not implementation yet. The first actionable body of work is an M1 + M2 evidence package: inventory the current Ω Capability/ProviderRealization contract; inventory Account/Session/Resource representations and durable seams; identify contradictions against the CFA-02 boundary; formulate the minimum candidate-validity and Account/Session join proof; stop and escalate if the work would require changing an owner-aligned boundary or Ω law.

## Evidence Index
- CFA-06 CORE-AGENT.md, OWNER-ALIGNMENT-2026-09-27.md, STATE.md, TASKS.md.
- D-418 and D-419 as referenced by current CFA state.
- Current ProviderRealization/provider-browser and destination reconciliation evidence.
- Provider Laboratory and legacy provider/account/session/discovery/healing evidence.
- CFA Strategic Roadmap Formation Protocol 2026-09-27.

## Roadmap Status
FIRST-PASS INDEPENDENT ROADMAP — CFA-06. This roadmap does not consume new Round-1 outputs from other CFAs; peer gates are requests for later reconciliation.