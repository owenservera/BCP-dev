# CFA-06 — Peer Intelligence Request — 2026-09-27

> Status: READY FOR CROSS-CFA RECONCILIATION
> Scope: M1 Capability-to-Realization + M2 Provider/Account/Session/Resource
> Source: CFA-06 M1/M2 evidence package
> Independence rule: this artifact is derived only from current repository evidence and CFA-06's independent roadmap. It intentionally does not consume new Round-1 peer outputs.

## Purpose

Before CFA-06 changes the capability/realization contracts or introduces any Account/Session/Resource join, four peer seams need explicit evidence.

The requests below are **information gates**, not scope assignments. A peer response should state the smallest existing contract/artifact that answers the question; it should not create a parallel model merely to answer the request.

## Blocking requests

### PI-02 — CFA-02 / Durable identity, revision, lineage, reconstruction

**Why blocking**

The current Ω ProviderRealization is a vault-backed current-state record with revision attached on read, while browser SessionRecord is also stored in the `providers` namespace. CFA-06 needs to know how Account, Session and any future Model/Resource references should resolve through the one canonical durability seam.

**Questions**

1. What is the canonical durable reference shape CFA-02 expects for an Account, Session, Realization, Model and Resource record?
2. Which of those are expected to be first-class durable records versus projections over other records?
3. How should revision, supersession and lineage be represented when a realization changes account/session/resource while semantic Capability remains unchanged?
4. Can CFA-06 use reference-only joins between existing records without creating a domain-specific identity table?
5. What reconstruction guarantees must hold if a Session row is recreated while the Account remains the same?
6. How should legacy/unknown records that lack an Account/Model/Resource reference be represented during migration?

**Required evidence**

A pointer to the current CFA-02 identity/persistence/revision contract or an explicit statement that the requested concept is not yet specified.

**Falsifier**

A valid M2 design cannot be expressed through the existing canonical identity/revision/persistence seam without a second canonical store or a new shared identity authority.

**Priority:** BLOCKING for G2.

---

### PI-04 — CFA-04 / Authority around Account, Session, Resource and external effects

**Why blocking**

CFA-06 routing selects a candidate but must never authorize it. The current provider-browser path also contains consent-gated external mutation and a live session descriptor.

**Questions**

1. What authority facts may be attached to a selected Account/Session/Resource reference without becoming an authorization cache?
2. Which authority decision is re-resolved at execution time when routing selects a realization or session?
3. How should expiration, revocation, reauthentication or scope reduction affect Account/Session state versus the Authority result?
4. Can the same Account/Session reference be reused across distinct Work attempts when Authority is independently re-evaluated?
5. Which effect/risk attributes belong to the capability/operation contract versus the concrete realization/session?
6. What evidence must CFA-06 expose to CFA-04 before an external mutation can pass the live authority gate?

**Required evidence**

The current Authority contract for external effects, consent, scope, revocation and re-resolution, or the minimum existing contract that governs these cases.

**Falsifier**

Safe routing requires CFA-06 to store or interpret a durable permission verdict, or Account/Session lifecycle cannot remain semantically distinct from Authority lifecycle.

**Priority:** BLOCKING for G1/G2/G3/G4.

---

### PI-05 — CFA-05 / Work and Attempt attachment

**Why blocking**

The intended CFA-06 flow ends in Work/Attempt execution, but the current browser session substrate can demonstrate a session without proving the canonical Work attachment seam.

**Questions**

1. What exact Work/Attempt reference should identify the selected realization/session at execution time?
2. Is the realization selection captured on Work, on Attempt, or by evidence referenced by them?
3. How should session replacement/reconnect affect a running Work or a retrying Attempt?
4. What provider-side observation is sufficient input to Work reconciliation when an external effect is unknown?
5. Which parts of a concrete execution tuple (capability, realization, provider, account, model, session, resource) must be persisted on Work/Attempt versus referenced?
6. How should a provider/session change during a retry preserve semantic Work identity while making the concrete realization change auditable?

**Required evidence**

The current Work/Attempt execution and reconciliation vocabulary that describes realization/session attachment.

**Falsifier**

M2 requires CFA-06 to own Work lifecycle or to duplicate Attempt state outside CFA-05.

**Priority:** BLOCKING for G4 and HIGH-VALUE for G2/M3.

---

## High-value requests

### PI-03 — CFA-03 / Semantic continuity

**Questions**

1. Is `archetypeSlug` sufficient as the stable semantic capability identity across operation revisions, aliases and realization replacement?
2. What continuity proof is required when provider/account/session/model changes but the requested capability remains semantically identical?
3. Which differences between providers must remain visible rather than normalized away?
4. How should an unavailable realization versus an unavailable capability be represented semantically?

**Priority:** HIGH-VALUE for G1/G2/M6.

---

### PI-01 — CFA-01 / World identity and resource meaning

**Questions**

1. When a provider-backed operation targets an external object/resource, what canonical World identity must be carried into the realization seam?
2. Is Resource a World object, an execution substrate, or potentially either depending on operation class?
3. What source-identity/evidence requirements apply when a provider exposes an external resource identifier?
4. How should provider/account changes affect identity continuity for the same external-world object?

**Priority:** HIGH-VALUE for M2/M6.

---

### PI-09 — CFA-09 / Provider repair versus generic evolution

**Questions**

1. What minimum evidence package must CFA-06 provide when a provider-specific repair becomes a compatibility or migration event?
2. Which realization changes are local repairs versus generic evolution requiring CFA-09 lifecycle handling?
3. How should supersession and rollback preserve capability semantics while changing concrete provider realization?
4. What evidence threshold is required before repaired provider knowledge can be promoted back to routing eligibility?

**Priority:** HIGH-VALUE for M5/M6.

---

## Contextual requests

### PI-07 — CFA-07 / Composition and admission

Confirm whether a provider/account/session/resource reference introduces any composition admission requirement beyond the existing signed-manifest/Recipe model.

**Priority:** CONTEXTUAL for M1/M2/M6.

### PI-08 — CFA-08 / Surface and user policy

Confirm what semantic fields must remain editable/inspectable at the surface when a user changes provider, account, model or routing policy.

**Priority:** CONTEXTUAL for M3/M6.

### PI-10 — CFA-10 / Runtime containment and observability

Confirm what runtime-level evidence must be exposed for live realization proof without moving authorization, persistence or provider semantics into the µhost.

**Priority:** CONTEXTUAL for M2; HIGH-VALUE for M4/M6.

## Exact evidence package CFA-06 needs before gates

| Gate | Required external evidence |
| --- | --- |
| G1 Capability candidate validity | CFA-02 identity/revision + CFA-04 effect/authority semantics |
| G2 Account/Session data seam | CFA-02 persistence/reconstruction + CFA-04 lifecycle/reauth + CFA-05 execution attachment |
| G3 Routing/Authority seam | CFA-04 re-resolution/revocation + CFA-05 selected-route attachment |
| G4 Live realization proof | CFA-05 external-effect evidence + CFA-04 authorized-effect boundary + CFA-10 observability |
| G5 Healing/evolution boundary | CFA-09 repair/evolution handoff |
| G6 Portability/continuity | CFA-01 world identity + CFA-03 semantic continuity + CFA-09 replacement rules, with CFA-05 execution continuity |

## Non-actions

This request does **not**:
- create a new Account/Session/Resource store;
- add Account/Resource fields to `SessionRecord`;
- change ProviderRealization semantics;
- make routing authoritative;
- change Ω law;
- ratify any peer ownership beyond existing alignment;
- require peers to copy this document into their own homes.

## Acceptance condition

A peer response is sufficient when it identifies:
1. the current authoritative contract/artifact;
2. the relevant existing fields/relationships;
3. any unresolved UNKNOWN or CONFLICTED item;
4. whether the requested seam can be expressed without a new canonical store;
5. any owner decision required.

Until those responses exist, M2 contract implementation remains deferred.
