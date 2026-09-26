# CFA-04 Authority / Governance — Boundary Round 1 Declaration

> Date: 2026-09-26
> Classification: CFA-04 current claim; not a shared architectural boundary
> Basis: repository main as inspected for Round 1 on 2026-09-26
> Peer ownership statements are CFA-04 interpretations and do not imply peer agreement.

## Identity

| Field | Current claim |
|---|---|
| CFA ID | CFA-04 |
| Current working / rationalized name | Authority Governance Steward |
| Register / CFA label | Authority / Governance |
| Machine-safe seed | authority-governance |
| Identity status | PROPOSED — OWNER DIALOGUE REQUIRED; no permanent CORE-AGENT.md is ratified |
| Responsibility that must remain continuously coherent | The semantic model by which consequential effects become permitted or refused: who may act, for whom, on what effect, under what authority basis, scope, duration, consent/delegation/risk conditions, and revocation state |
| Explicit non-ownership | World ontology/existence; canonical identity/data persistence; Intent/Plan construction; Work lifecycle/execution; capability/provider/realization semantics; K0 mechanical enforcement; cryptographic/security substrate; general evidence/provenance infrastructure; surface/UI realization; Forge/composition mechanics; evolution/migration lifecycle; unilateral owner policy |

The smallest coherent CFA-04 responsibility is **authorization semantics and governance across domains**, not ownership of the vivim-law implementation.

Central question:

> For any consequential effect, can VIVIM explain who is acting, for whom, what effect is requested, what authority permits it, what scope/risk/time/delegation/consent conditions apply, whether that authority is still live, and where the rule is mechanically enforced — without deriving permission from capability, intent, identity, evidence, execution, or representation?

Current Ω evidence includes D-412 principal records, D-452 invocation frames with live authority re-resolution, D-453 bounded standing, D-454 vault-resolved attenuating delegation, and D-455 governed self-change. These are evidence of the current architecture, not proof that every Round-1 boundary question is resolved.

## Responsibility

CFA-04 currently claims responsibility for:

1. authority/permission semantics and authority-basis vocabulary;
2. principal/actor/behalf semantics at the authorization boundary, without owning canonical identity storage;
3. consent semantics for consequential actions;
4. bounded standing and auto-approval semantics;
5. delegation, attenuation and authority-chain semantics;
6. scope, duration, expiry and revocation semantics at the authorization layer;
7. authority-to-invocation binding and live gate-time re-resolution requirements;
8. authority-facing interpretation of effect risk, while capability/risk declaration remains outside CFA-04;
9. authorization conditions for consequential composition/evolution/self-change;
10. authority-specific refusal, escalation and invalidation semantics;
11. invariants preventing authority from being manufactured by intent, capability, identity, evidence, execution, communication or representation;
12. the semantic handoff to mechanical enforcement.

## OWNS / CONTRIBUTES / CONSULTS / OUT-OF-SCOPE

| Responsibility | Position | State | Freshness | Boundary note |
|---|---|---|---|---|
| Meaning of authorization / permission | OWNS | DERIVED | CURRENT | Semantic authority, not implementation |
| Authority basis, scope, duration, revocation | OWNS | DERIVED | CURRENT | D-452/D-453 |
| Consent semantics | OWNS | DERIVED | CURRENT | Meaning/invalidation of owner consent |
| Standing semantics | OWNS | DERIVED | CURRENT | Expiring, scoped, revocable grants |
| Delegation attenuation | OWNS | DERIVED | CURRENT | Authority narrows every hop |
| Authority ↔ invocation contract | OWNS | DERIVED | CURRENT | Live authority resolution |
| Governance of consequential change | OWNS | PROPOSED | CURRENT | CFA-09 retains change lifecycle |
| Authority-facing risk interpretation | OWNS | PROPOSED | CURRENT | CFA-06 retains capability risk declaration |
| Principal/actor semantics at auth boundary | CONTRIBUTES | DERIVED | CURRENT | CFA-02 retains canonical identity |
| World visibility/viewpoint constraints | CONTRIBUTES | PROPOSED | CURRENT | CFA-01 retains World meaning/existence |
| Intent → authority boundary | OWNS / shared seam | DERIVED | CURRENT | Intent never implies permission |
| Work authorization requirements | OWNS / shared seam | DERIVED | CURRENT | CFA-05 owns Work/execution |
| Capability-effect authorization | OWNS / shared seam | DERIVED | CURRENT | CFA-06 owns capability/realization |
| K0 admission/enforcement | CONSULTS | DERIVED | CURRENT | Runtime enforces; CFA-04 supplies semantic contract |
| Canonical identity/data persistence | OUT-OF-SCOPE | OBSERVED | CURRENT | CFA-02 |
| World ontology/existence | OUT-OF-SCOPE | OBSERVED | CURRENT | CFA-01 |
| Intent/Plan construction | OUT-OF-SCOPE | OBSERVED | CURRENT | CFA-03 |
| Work lifecycle/scheduling/recovery | OUT-OF-SCOPE | DERIVED | CURRENT | CFA-05 |
| Capability/provider/account/routing | OUT-OF-SCOPE | DERIVED | CURRENT | CFA-06 |
| Composition/Forge mechanics | OUT-OF-SCOPE | DERIVED | CURRENT | CFA-07 |
| Surface/UI realization | OUT-OF-SCOPE | DERIVED | CURRENT | CFA-08 |
| Evolution/migration lifecycle | OUT-OF-SCOPE | DERIVED | CURRENT | CFA-09 |
| Runtime constitutional implementation | OUT-OF-SCOPE | DERIVED | CURRENT | CFA-10 |
| General evidence/provenance model | OUT-OF-SCOPE | DERIVED | CURRENT | Cross-cutting concern |

Ownership is multidimensional: a shared subject can have separate semantic, durable-representation, enforcement, execution, realization, evidence and lifecycle owners.

## Assigned Seams

### Seam 1 — Authority ↔ World

#### 1. What is the seam's subject?

The crossing between what exists/is addressable in World and what a principal is permitted to access, disclose, mutate or cause to change within that World.

CFA-01 explicitly identifies a missing principal/viewpoint/visibility contract and asks CFA-04 to define the distinction between accessible and existent.

#### 2. What do I believe my CFA owns?

DERIVED/CURRENT: permission semantics, authorization scope, principal-based access constraints and authority status for a requested World effect.

CFA-04 does not decide whether a World subject exists, what it means, or whether two World subjects correspond.

#### 3. What do I believe the peer owns?

OBSERVED/CURRENT from CFA-01: World meaning, identity/correspondence meaning, relationship semantics, projection and Context semantics.

#### 4. What crosses the boundary?

- principal / actor / behalf references;
- World subject/effect target references;
- viewpoint / visibility / scope constraints;
- authorized versus merely addressable states;
- consent/delegation/standing references;
- refusal/escalation states relevant to the World operation.

#### 5. What must not cross?

- Accessibility must not imply existence.
- Existence must not imply permission.
- World projection must not silently become an authority evaluator.
- Authority must not redefine World ontology or correspondence.
- A denied/hidden subject must not be silently represented as nonexistent.

#### 6. What inputs do I require?

World semantic target references, object/relationship meaning, addressability/correspondence state, unresolved/ambiguous states, and viewpoint/context semantics.

#### 7. What outputs do I provide?

Authorization result, principal/behalf/scope constraints, relevant consent/delegation/standing references, and explicit distinction between not-visible/not-authorized and non-existent.

#### 8. What invariants must hold?

1. Accessible ≠ existent.
2. Addressable ≠ authorized.
3. World meaning ≠ authority meaning.
4. Authority cannot create World truth by referencing it.
5. Refusal of access/action does not assert nonexistence.
6. Viewpoint constraints do not alter ontology.

#### 9. Evidence

- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/BOUNDARY-ROUND-1-DECLARATION-2026-09-26.md
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/STATE.md
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/WORLD-OPERATIONAL-CONTEXT.json
- docs/destination/world-object-core/WORLD-PROJECTION.md
- docs/destination/core-vs-plugin-boundary/DESTINATION-RESPONSIBILITY-MATRIX.md

All currently treated as CURRENT repository evidence as inspected on main, except peer claims which remain peer-owned claims.

#### 10. Falsifier

A ratified contract assigns World ontology/existence to CFA-04; or a real path requires CFA-04 to determine object meaning rather than permission; or authority records become canonical World state.

#### 11. Unknown

Exact principal × viewpoint × visibility representation; absence/non-observation/non-permission semantics; multi-principal projections; privacy/correspondence interaction.

#### 12. Duplication / overlap

Identity, visibility and scope appear on both sides. These are not yet proven duplicate responsibilities.

#### 13. Conflicts

No material peer-claim conflict is currently identified at this seam. The overlap questions remain open rather than treated as reconciled.

#### 14. Peer question

**What exact World-side state should be returned when a subject is semantically addressable but not authorized/visible, and which portion belongs to World projection versus Authority policy?**

### Seam 2 — Authority ↔ Work

#### 1. What is the seam's subject?

The crossing from durable Work and execution attempts to the live authority under which the actor may cause the requested effect.

#### 2. What do I believe my CFA owns?

DERIVED/CURRENT: the authorization contract a consequential Work execution must satisfy, including principal/actor, authority basis, scope/time and required consent/standing/delegation.

CFA-04 does not own Work lifecycle, scheduling, recovery or outcome semantics.

#### 3. What do I believe the peer owns?

DERIVED from CFA-05's role and destination mapping: durable Work, execution lifecycle, recovery and outcomes.

#### 4. What crosses the boundary?

caller/actor/behalf, requested operation/effect, capability reference, intent/causation reference where required, authority basis, standing/delegation/consent references, scope/time/risk inputs, and live allow/refuse/escalate results.

#### 5. What must not cross?

- Work existence/status must not imply authorization.
- Intent/Plan inside Work must not itself grant permission.
- Execution success is not proof of semantic authorization.
- Work must not become an authority cache.
- Authority semantics must not become Work lifecycle semantics.
- A retry must re-resolve live authority.

#### 6. What inputs do I require?

Current Work effect, actor/behalf, capability/operation, relevant context/scope, attempt/retry semantics, and prior authority/refusal citations for reconstruction.

#### 7. What outputs do I provide?

Live authorization verdict, authority reference/citation, consent/standing/delegation requirements, scope/time/risk constraints, refusal/escalation state, and re-check requirements for retries/resume.

#### 8. What invariants must hold?

1. Intent does not imply permission.
2. Work existence does not imply permission.
3. Capability possession does not imply permission.
4. Authority is resolved at the execution gate.
5. Revocation affects the next authorization check.
6. A refusal cannot silently advance Work.
7. Work may carry authority references without becoming the authority source.

#### 9. Evidence

- omega-baseline/omega-final/docs/decisions/D-452-invocation.md — ratified invocation frame and live resolution.
- omega-baseline/omega-final/docs/decisions/D-453-standing.md — bounded/revocable standing.
- docs/destination/agentic-core/WORLD-WORK-ATTENTION-INTEGRATION.md — Work acts through a governed Capability and has its own lifecycle/authority.
- docs/destination/INTERACTION-INTENT-WORK-RECONCILIATION.md
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CORE-FUNCTION-AREA-REGISTER.md

#### 10. Falsifier

A ratified Work contract makes Work itself the semantic authority for permission; or a consequential Work path can execute without live authority; or a retry continues after revocation without fresh resolution.

#### 11. Unknown

Minimum durable authority reference carried by Work; multi-step/batched authorization; scope-changing Work; renewal behavior after expiry.

#### 12. Duplication / overlap

Scope, actor, evidence and risk appear in both Work and Authority for different purposes.

#### 13. Conflicts

No material peer-claim conflict is currently identified at this seam. The overlap questions remain open rather than treated as reconciled.

#### 14. Peer question

**What minimum authority reference must Work/Attempt retain so execution can re-check live permission without Work becoming an authority store, and how should retries behave after expiry or revocation?**

### Seam 3 — Authority ↔ Capability

#### 1. What is the seam's subject?

The crossing from what VIVIM can do and through which realization it can do it to whether a particular actor is allowed to cause a particular effect through that capability.

#### 2. What do I believe my CFA owns?

DERIVED/CURRENT: authorization policy over the requested effect under the relevant principal, scope, time, consent/delegation/standing and risk conditions.

CFA-04 does not own capability meaning, provider/account/session semantics, routing or realization mechanics.

#### 3. What do I believe the peer owns?

OBSERVED/CURRENT from CFA-06 bootstrap context: capability semantics, realization identity, provider/account/session/resource distinctions and routing/selection. CFA-06 explicitly excludes user law, K0 admission and World ontology.

#### 4. What crosses the boundary?

Capability/effect identity, operation/effect grammar, target/resource reference, risk classification/declaration, realization/provider/account/session context, routing constraints, and authority verdict/requirements.

#### 5. What must not cross?

- Capability availability must not imply permission.
- Provider/account/session possession must not imply permission.
- Realization changes must not silently widen authority.
- Capability risk metadata is not permission.
- Authority must not redefine capability semantics.
- Provider routing must not bypass the authority boundary.

#### 6. What inputs do I require?

Capability/effect semantics, operation identifiers, target requirements, risk metadata, realization/provider/account/session context, routing facts, and provider constraints that change the actual effect.

#### 7. What outputs do I provide?

Authorization constraints, required authority basis/citation shape, consent/standing/delegation requirements, live verdict, and invariants binding alternative realizations to the same semantic authorization contract.

#### 8. What invariants must hold?

1. Capability ≠ authorization.
2. Realization ≠ authorization.
3. Availability ≠ permission.
4. Changing provider/realization cannot grant new semantic authority.
5. Risk informs authorization but does not grant it.
6. K0 enforces a constraint; it does not define permission.
7. Provider/account/session identity does not substitute for authority.

#### 9. Evidence

- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CAPABILITY-PROVIDER-REALIZATION/LAUNCH-PROMPT.md
- docs/destination/core-vs-plugin-boundary/DESTINATION-RESPONSIBILITY-MATRIX.md
- docs/destination/architecture/research/JOURNEY-ARCHITECTURE-MAPPING.md
- omega-baseline/omega-final/docs/decisions/D-452-invocation.md
- omega-baseline/omega-final/docs/decisions/D-453-standing.md

#### 10. Falsifier

A ratified capability contract makes possession/selection sufficient for permission; or a provider realization bypasses the authority contract; or the same capability gains permissions merely by changing realization.

#### 11. Unknown

Canonical effect/risk vocabulary; precise ownership of risk classification versus policy interpretation; routing/authority coupling; provider-specific irreversible/destructive effects.

#### 12. Duplication / overlap

Risk, scope, operation and target/resource occur on both sides as crosswalk subjects, not proven duplicate ownership.

#### 13. Conflicts

No material peer-claim conflict is currently identified at this seam. The overlap questions remain open rather than treated as reconciled.

#### 14. Peer question

**What canonical effect/risk descriptor must every Capability expose so Authority can decide permission without importing capability semantics, and how does a realization change preserve that contract?**

## Handoff Proposals

| ID | Source | Target | Subject | Proposed handoff | Status |
|---|---|---|---|---|---|
| H-04-01 | CFA-01 | CFA-04 | World target + viewpoint | Target reference plus explicit viewpoint/visibility basis; preserve inaccessible vs nonexistent | PROPOSED |
| H-04-02 | CFA-04 | CFA-01 | Authorization result | Allow/refuse/escalate plus scope/visibility constraints without asserting World truth | PROPOSED |
| H-04-03 | CFA-05 | CFA-04 | Work authorization request | Effect + actor/behalf + capability + context presented for live authorization | PROPOSED |
| H-04-04 | CFA-04 | CFA-05 | Execution gate | Fresh resolution after expiry/revocation; authority remains a prerequisite | PROPOSED |
| H-04-05 | CFA-06 | CFA-04 | Capability effect/risk | Stable effect identity, target requirements and risk metadata | PROPOSED |
| H-04-06 | CFA-04 | CFA-06 | Authorization result | Semantic authorization independent of provider/realization selection | PROPOSED |

A handoff transfers information/work across the seam; it does not transfer authority.

## Boundary Hazards

### Responsibility overlap

- Principal/identity overlaps CFA-02 and CFA-04.
- Visibility can appear as World projection, privacy, or authorization.
- Risk is shared between capability declaration and authorization interpretation.
- Scope is used in World context, capability grammar, routing constraints and authority.
- Authority needs traceability but does not own general evidence/provenance.

### Missing responsibility

- Explicit principal × viewpoint × visibility contract.
- Minimum durable authority citation for Work.
- Shared effect/risk vocabulary between Capability and Authority.
- Fully explicit distinction between law/policy records and authority records.

### Authority confusion

- vivim-law implementation may be mistaken for permanent semantic ownership.
- K0 enforcement may be mistaken for authority semantics.
- A signed/cited record may be mistaken for live permission.
- Commons communication, identity or evidence may be mistaken for authorization.

### Evidence / representation confusion

- A standing/delegation record represents authority state; representation alone is not live permission.
- Work containing an authority reference is not itself an authority source.
- A World projection that omits a subject is not proof of nonexistence.
- Capability risk metadata is an input to policy, not a grant.

### Implementation leakage

D-452/D-453/D-454 behavior, existing vivim-law structure, provider/account fields and Work retry logic can all accidentally become treated as semantic authority simply because they already implement part of the behavior.

### Stale assumptions

Legacy auth/security behavior and historical browser enforcement are evidence, not destination authority.

### Terminology collisions

High-risk terms: principal, actor, identity, scope, visibility, access, risk, operation, effect, standing, delegation, authorization, permission, evidence, grant.

### Likely future drift

Provider effects, long-lived delegated Work, self-change, cross-instance sharing and richer consent/explanation surfaces will increase seam pressure.

## Unresolved Questions for Peers

### CFA-01

1. What is the canonical distinction among existent, addressable, visible, accessible and authorized-to-act-on?
2. What World-side information must Authority receive to decide permission without making World an authority evaluator?
3. How are hidden/not-permitted subjects distinguished from absent/nonexistent subjects?

### CFA-05

1. What minimum authority reference belongs on Work/Attempt?
2. Must every resumed/retried consequential Attempt re-resolve authority?
3. Which Work fields are execution state versus authority references/citations?

### CFA-06

1. What effect/risk descriptor is guaranteed for every Capability?
2. Which risk facts are capability declarations and which are authority policy interpretations?
3. How is the same authorization contract preserved across provider/realization changes?

### Cross-CFA

1. What is the smallest stable vocabulary for effect, operation, scope, risk, principal, behalf and authorityRef?
2. Which references must be canonicalized and which must be live-resolved?
3. Which changes require owner/rule ratification rather than CFA-local contract revision?

## Non-Authority Statement

CFA-04 does not decide:

- what the owner personally permits or prefers;
- whether Ω law should change outside the existing ratification path;
- what constitutes a World object or canonical identity;
- how Intent/Plan meaning is constructed;
- what Work lifecycle or execution means;
- what a Capability/provider/realization is;
- how K0 enforcement is implemented;
- what the general evidence/provenance architecture is;
- whether another CFA should lose semantic ownership for architectural convenience.

CFA-04 may challenge claims that permission is being inferred from intent, capability, identity, evidence, execution, representation, communication or possession. It may propose authority-facing contracts and falsifiers, but it does not manufacture constitutional law.

## Evidence Index

| Source | Use | State / freshness |
|---|---|---|
| AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/ROUND-1-BOUNDARY-BOOTSTRAP.md | Round-1 task/output contract | OBSERVED / CURRENT |
| AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/BOUNDARY-PROTOCOL.md | Epistemic states, ownership dimensions, handoffs, challenges | OBSERVED / CURRENT |
| AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/ROUND-1-CFA-MATRIX.md | CFA-04 assigned seams | OBSERVED / CURRENT |
| AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CORE-FUNCTION-AREA-REGISTER.md | CFA constellation and responsibility seeds | OBSERVED / CURRENT |
| AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/BOOTSTRAP-DESIGN-PROPOSAL.md | Existing CFA-04 candidate design | PROPOSED / CURRENT |
| AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/BOUNDARY-ROUND-1-DECLARATION-2026-09-26.md | Peer World boundary and explicit Authority questions | CFA-01 claim / CURRENT |
| AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/STATE.md | World ↔ Authority seam and viewpoint gap | OBSERVED / CURRENT |
| AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/WORLD-OPERATIONAL-CONTEXT.json | Principal/viewpoint/visibility peer need | OBSERVED / CURRENT |
| AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CAPABILITY-PROVIDER-REALIZATION/LAUNCH-PROMPT.md | CFA-06 scope/non-scope | OBSERVED / CURRENT |
| AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AGENCY-WORK-EXECUTION/LAUNCH-PROMPT.md | CFA-05 role and work/execution boundary | OBSERVED / CURRENT |
| docs/destination/core-vs-plugin-boundary/DESTINATION-RESPONSIBILITY-MATRIX.md | R-064/R-065/R-066/R-067/R-068/R-069 responsibility separation | OBSERVED / CURRENT |
| docs/destination/architecture/research/JOURNEY-ARCHITECTURE-MAPPING.md | Capability → Authority → Work mapping | OBSERVED / CURRENT |
| docs/destination/agentic-core/WORLD-WORK-ATTENTION-INTEGRATION.md | Governed Capability → World mutation relation | OBSERVED / CURRENT |
| omega-baseline/omega-final/docs/decisions/D-412-principal-seam.md | Principal identity/non-reuse seam | RATIFIED / Ω CURRENT |
| omega-baseline/omega-final/docs/decisions/D-452-invocation.md | Invocation frame and live authorization resolution | RATIFIED / Ω CURRENT |
| omega-baseline/omega-final/docs/decisions/D-453-standing.md | Expiring/scoped/revocable standing | RATIFIED / Ω CURRENT |
| omega-baseline/omega-final/docs/decisions/D-454-delegation.md | Attenuating delegation and revocation cascade | RATIFIED / Ω CURRENT |
| omega-baseline/omega-final/docs/decisions/D-455-adaptation-governance.md | Governance of consequential self-change | RATIFIED / Ω CURRENT |
| omega-baseline/omega-final/docs/VAULT-NAMESPACES.md | Authority-related namespaces and retention | OBSERVED / Ω CURRENT |
| omega-baseline/omega-final/docs/BUILD-DECISIONS.md | Consolidated D-452–D-455 architectural evidence | OBSERVED / Ω CURRENT |

## Current Boundary Summary

CFA-04's Round-1 claim is:

> **Authority is the semantic answer to "may this effect be caused under this principal/actor relationship right now?"**

It does not answer:
- what exists — World;
- how it is durably represented — Data;
- what a command means — Semantic Continuity;
- what work is being performed — Work;
- what can be done/how — Capability/Provider/Realization;
- how a constraint is mechanically enforced — Runtime/K0.

Current boundary picture:

WORLD meaning/target
        ↓
CAPABILITY effect/realization
        ↓
AUTHORITY decision
        ↓
WORK execution
        ↓
RUNTIME enforcement

No arrow creates authority. Authority must be resolved from its own semantic basis and current state.