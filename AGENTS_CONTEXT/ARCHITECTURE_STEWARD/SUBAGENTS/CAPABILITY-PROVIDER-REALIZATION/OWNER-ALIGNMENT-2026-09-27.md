# CFA-06 — Owner Alignment Record — 2026-09-27

> Status: RATIFIED — OWNER-ALIGNED
> CFA: CFA-06 — Capability / Provider / Realization
> agent_id: capability-provider-realization
> Human-readable identity: Capability & Provider Realization Steward
> Alignment basis: owner-directed CFA-06 Owner Alignment run of 2026-09-27.

## Alignment outcome

The owner directed this run to resolve the CFA-06 Owner Dialogue, confirm/redraw the Capability boundary, and settle the Capability / Provider / Realization / Account / Session / Routing seams against the ratified CFA-04 Authority and CFA-05 Work peers.

No explicit owner instruction requested a rename, split, merge, workspace move, or reassignment of the candidate identity. The proposed identity is therefore retained.

The aligned identity is Capability & Provider Realization Steward.

## 1. Capability boundary

ALIGNED.

CFA-06 owns the semantic capability-facing responsibility required to connect a named power/operation to valid implementations:

- semantic Capability meaning at the capability/realization boundary;
- capability/operation references used for realization selection;
- declared capability availability and realization eligibility as evidence-backed state;
- capability-to-realization compatibility requirements;
- capability effect/risk declarations supplied to the Authority seam.

CFA-06 does not own:
- semantic Intent/Plan meaning (CFA-03);
- authorization/permission (CFA-04);
- durable Work lifecycle/execution (CFA-05);
- composition/Forge mechanics (CFA-07);
- K0 capability-token/effective enforcement (CFA-10);
- canonical durable data storage/identity (CFA-02).

Capability availability or possession is never permission.

## 2. Capability vs Provider / Realization

ALIGNED — KEEP DISTINCT, KEEP IN ONE CFA FOR NOW.

The boundary remains:

CAPABILITY
  semantic power / operation
        ↓
REALIZATION
  attributable implementation of that capability
        ↓
PROVIDER
  external system/source involved in a realization

The following remain distinct and must not collapse:

- Capability ≠ Provider
- Capability ≠ Realization
- Provider ≠ Account
- Account ≠ Credential
- Realization ≠ Session
- Session ≠ Resource
- Routing ≠ Authorization

No separate permanent Capability CFA is created at this stage.

Future split remains possible if evidence shows capability semantics become independently coherent enough to justify a separate standing responsibility. That is deferred, not rejected forever.

## 3. Account / Session ownership with CFA-02

ALIGNED AS A PEER BOUNDARY; CFA-02 OWN IDENTITY REMAINS PROVISIONAL.

CFA-06 owns the semantic meaning and operational contract of:

- Account as the user's authenticated relationship with a Provider;
- Session as an active execution relationship for an Account/Realization;
- Browser/resource context as concrete realization substrate where applicable.

CFA-02 owns the durable-data side:

- canonical durable record identity;
- persistence;
- revisions;
- lineage;
- reconstruction;
- durable representation of Account/Session state.

Boundary:

CFA-06
semantic Account / Session / Resource relationship
        ↕
CFA-02
durable identity / persistence / revision / lineage / reconstruction

Session ID is not Account ID. Provider ID is not canonical user identity.

Peer-state qualification: CFA-02 has not yet completed its own owner-alignment/identity ratification on current main. This is therefore a bounded cross-peer settlement derived from CFA-02 working evidence, not a claim that CFA-02 is ratified by this record. No shared boundary is activated.

## 4. Live Authority boundary with CFA-04

ALIGNED.

CFA-04 remains the sole semantic owner of live authorization:
- consent;
- standing;
- delegation/attenuation;
- scope;
- duration;
- expiry;
- revocation;
- authority-to-invocation binding;
- authorization verdict.

CFA-06 supplies:
- capability/operation reference;
- declared effect/risk metadata within its scope;
- selected provider/account/model/realization/session references.

CFA-06 consumes the live authorization result but never caches, widens, or interprets it as capability meaning.

routing → selection
authority → permission

Routing cannot bypass the Authority gate.

## 5. Work / execution seam with CFA-05

ALIGNED.

CFA-05 remains the owner of:
- durable Work;
- executable Work basis;
- Attempts;
- retries/effect identity;
- scheduling/background continuity;
- recovery;
- Work-level external-effect reconciliation;
- verification;
- Outcome;
- execution attribution.

CFA-06 owns the realization-side facts needed by Work:
- capability/realization selection;
- provider/account/model/session/resource context;
- provider-specific external-effect observation requirements;
- realization-specific evidence needed to determine whether an external effect occurred;
- provider-specific result/reconciliation knowledge.

CFA-06 does not create a parallel Work lifecycle or decide whether Work should resume. CFA-05 decides Work-level resume/refuse/complete posture from available realization evidence.

## 6. Provider healing vs CFA-09 Evolution / Self-Maintenance

ALIGNED — SPLIT BY DOMAIN LEVEL.

CFA-06 owns provider-specific realization maintenance:
- provider discovery;
- provider observation and characterization;
- provider protocol/representation knowledge;
- parser/selector/op-map knowledge;
- realization health and proof state;
- provider drift detection;
- provider-specific rediscovery/repair;
- realization promotion/degradation/replacement candidate generation.

CFA-09 owns generic evolution/self-maintenance:
- cross-system compatibility;
- migration;
- rollback;
- broad replacement lifecycle;
- generic adaptation/self-maintenance policy;
- cross-domain change impact.

Boundary rule:

Provider-specific knowledge stays with CFA-06; generic change/compatibility mechanics stay with CFA-09.

When provider repair becomes a system-wide compatibility/evolution concern, CFA-06 supplies realization evidence and hands the broader change to CFA-09.

## 7. Routing-policy ownership

ALIGNED.

CFA-06 owns routing/selection semantics for provider/account/model/realization choice.

Routing is user-owned policy data, not a hidden authority layer.

Bounded precedence:

hard forbidden constraints
→ explicit one-shot user instruction
→ scoped user policy
→ global user policy
→ explicitly permitted fallback
→ learned ranking
→ unresolved / ask

Rules:
- discovery establishes candidate validity; routing does not invent candidates;
- routing may only select among candidates valid/eligible under current evidence;
- learned ranking cannot override explicit user constraints;
- fallback must be policy-permitted;
- unresolved routing remains unresolved rather than guessing;
- routing produces a selection decision but does not execute the effect;
- Authority re-resolves separately at the consequential invocation gate.

CFA-08 owns presentation/editing of routing choices. Owner/product policy supplies user defaults and release choices; those are not silently converted into constitutional architecture.

## 8. Provider / Account / Realization / Session lifecycle

ALIGNED AS THE CFA-06 SEMANTIC LIFECYCLE MODEL.

These states are CFA semantics/characterization labels, not new Ω-global lifecycle enums unless separately ratified.

Provider:
DISCOVERED → AVAILABLE ↔ DEGRADED / UNAVAILABLE → RETIRED

Account:
DISCOVERED
→ AUTHENTICATED
→ ACTIVE
→ DEGRADED
→ REAUTH_REQUIRED / EXPIRED
→ DISCONNECTED
→ RETIRED

Realization:
DRAFT
→ TESTING
→ PROMOTED
→ DEGRADED / REQUIRES_REDISCOVERY
→ RETIRED

Session:
NEW
→ ATTACHING
→ READY
→ IN_USE
→ STALE / AUTH_EXPIRED
→ RECONNECTING
→ RELEASED / FAILED

Concrete browser/resource context where applicable:
ALLOCATED
→ ATTACHING
→ READY
→ BUSY / IDLE
→ STALE
→ RESTARTING
→ RELEASED / QUARANTINED

## 9. Identity and replacement boundary

ALIGNED.

A realization can be replaced without changing semantic Capability identity.

The replacement chain preserves:

Capability identity
      ↓
selection history
      ↓
old realization
      ↓
new realization
      ↓
same Account / canonical data where applicable
      ↓
continuous evidence / lineage

Changing Provider, Realization, Session, parser, selector, or browser process does not by itself create a new semantic capability.

## 10. Evidence / epistemic posture

- OBSERVED: current Ω has ProviderRealization and provider-browser mechanisms.
- OBSERVED: D-418 establishes Chrome master/slave (provider.browser) as the shippable V1 substrate and excludes an AI-API realization from V1.
- OBSERVED: D-419 establishes the attach-only CDP/provider-browser lane and live-vs-fixture substitution falsifier.
- DERIVED: Provider, Account, Realization, Session and Routing answer different architectural questions and remain separate.
- DERIVED: routing is policy over valid candidates, not authorization.
- UNKNOWN / DEFERRED: complete live provider/account/routing proof.
- UNKNOWN / DEFERRED: exact durable Account/Session join shape with CFA-02.
- UNKNOWN / DEFERRED: precise cross-provider healing handoff point into generic CFA-09 lifecycle.
- UNKNOWN / DEFERRED: whether future evidence warrants splitting Capability from Provider/Realization.
- CONFLICTED: none currently identified that requires this identity to remain blocked.

## 11. Shared-boundary / Ω-law posture

This alignment:
- does not activate shared CFA boundaries;
- does not modify Ω law;
- does not create a second provider database;
- does not create a second routing authority;
- does not create a second identity/data store;
- does not change the Architecture Steward graph;
- does not authorize production implementation.

## 12. Identity decision

RATIFIED / OWNER-ALIGNED

- Core Function Area: CFA-06 — Capability / Provider / Realization
- agent_id: capability-provider-realization
- Human-readable identity: Capability & Provider Realization Steward
- Workspace: AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CAPABILITY-PROVIDER-REALIZATION/
- Identity version: v1.0 — 2026-09-27

This record supersedes the proposal's OWNER DIALOGUE REQUIRED state for the identity/boundary described here. Historical bootstrap artifacts remain preserved.

## Lineage

Primary aligned peer context:
- CFA-04 Owner Alignment + CORE-AGENT
- CFA-05 Owner Alignment + CORE-AGENT + STATE

CFA-02 is used as current working peer evidence only; it is explicitly not treated as ratified by this record.

Primary destination/Ω evidence:
- docs/destination/CONCEPTUAL-MODEL.md
- docs/destination/DESTINATION-MASTER-MAP.md
- docs/destination/PROVIDER-ACCOUNT-ROUTING-RECONCILIATION.md
- docs/destination/system-intelligence/pass-3/PROVIDER-SYSTEM-DESIGN.md
- docs/destination/system-intelligence/synthesis/DEPENDENCY-MAP.md
- docs/migration/CHROME_GOVERNOR_CONTRACT.md
- omega-baseline/omega-final/docs/decisions/D-418-v1-substrate-chrome-first.md
- omega-baseline/omega-final/docs/decisions/D-419-cdp-substrate-lane.md

## Final alignment state

Identity: RATIFIED

Boundary: ALIGNED

Shared boundary activation: NO

Ω law changes: NONE

Production implementation authorization: NONE

Next lifecycle step: Commons birth test, then durable state/reporting.
