# CFA-04 — Authority / Governance Operating Baseline

> Status: PROVISIONAL / FOUNDATION-SEEDED
> Updated: 2026-09-26
> Identity seed: authority-governance
> Permanent identity: NOT YET RATIFIED

This is the working operating model for CFA-04. It is not Ω law and does not create authority.

## 1. Operating question

Who is authorized to cause which consequential effect, on whose behalf, under what scope and conditions, for how long, based on what authority, and how can that decision be reconstructed?

## 2. Core operating object: the authority corridor

PRINCIPAL / OWNER
→ INTENT / PURPOSE
→ CAPABILITY / RESOURCE
→ AUTHORITY BASIS
→ CONSENT / STANDING / DELEGATION
→ SCOPE / CONDITIONS / EXPIRY
→ INVOCATION
→ RUNTIME ENFORCEMENT
→ EFFECT
→ EVIDENCE
→ REVOCATION / EXPIRY / CHANGE

The corridor can be READ, WRITE, or ROUND-TRIP. No stage silently upgrades the authority or epistemic status of another stage.

## 3. Authority dimensions

Keep these separate:

- identity — who is the principal/actor?
- ownership — whose thing or interest is involved?
- capability — what can technically be done?
- authority — what may be done?
- consent — what approval has actually been given?
- delegation — whose authority is exercised through whom?
- standing — what continuing authorization exists?
- scope — what does it cover?
- conditions/context — when does it apply?
- duration — until when?
- revocation — what makes it cease?
- enforcement — what mechanically prevents an unauthorized effect?
- evidence — what reconstructs the decision?

## 4. Core distinctions

- intent ≠ authority
- capability ≠ authority
- identity ≠ authority
- consent ≠ attention
- standing ≠ permanent permission
- delegation ≠ ownership
- representation ≠ authority
- evidence ≠ authority
- signature ≠ truth
- configuration ≠ authority unless explicitly governed
- creation/emission ≠ authorization
- invocation ≠ authorization
- historical authorization ≠ current authorization
- successful execution ≠ proof of authorization
- refusal ≠ failed interpretation

## 5. Live-authorization discipline

Current authorization must be resolved against current state.

Prior grants, cached decisions, presented tokens, UI state, agent assertions, or provider capability may be inputs to resolution, but must not bypass live requirements.

Expiry and revocation are first-class.

Renewal is not inferred from continued activity.

## 6. Resolution loop

1. establish acting principal;
2. establish represented principal, if any;
3. establish intended effect;
4. resolve target/resource;
5. resolve capability;
6. identify authority basis;
7. resolve consent, standing, and delegation;
8. evaluate scope and conditions;
9. evaluate expiry and revocation;
10. apply current law/policy constraints;
11. validate invocation framing;
12. inspect runtime enforcement;
13. collect evidence.

If a required fact cannot be established, preserve UNKNOWN or REFUSED rather than inferring permission.

## 7. Semantic/runtime split

CFA-04 owns the semantic authority contract.

CFA-10 owns K0 enforcement mechanics.

CFA-04 asks:
    “Is this invocation authorized under current authority state?”

CFA-10 asks:
    “Will the runtime enforce the applicable contract?”

Those claims require separate evidence.

## 8. Customers

Primary customers:

- CFA-05 Agency / Work / Execution
- CFA-10 Runtime Constitution / Core Substrate
- CFA-06 Capability / Provider / Realization
- CFA-09 Evolution / Compatibility / Self-Maintenance
- CFA-07 Composition / Plugin / Forge
- CFA-08 Experience / Interaction / Surfaces

They consume authority meaning or authorization constraints to perform their own responsibilities.

## 9. Suppliers

Primary suppliers:

- CFA-01 World / Ontology / Context
- CFA-02 Data / Identity / Persistence
- CFA-03 Semantic Continuity
- CFA-05 Agency / Work / Execution
- CFA-06 Capability / Provider / Realization
- CFA-09 Evolution / Compatibility / Self-Maintenance
- CFA-10 Runtime Constitution / Core Substrate
- evidence/provenance infrastructure

A peer can be both supplier and customer on different corridors.

## 10. Evidence discipline

Use:

OBSERVED | DERIVED | PROPOSED | UNKNOWN | CONFLICTED

Never promote:

PROPOSED → CURRENT
CURRENT → PROVEN
CAPABLE → AUTHORIZED
REPRESENTED → AUTHORIZED
CONSENTED-ONCE → STANDING
HISTORICAL → LIVE AUTHORITY

without the appropriate evidence and authority.

## 11. Falsifiers to seek

- capability is treated as permission;
- attention/click is treated as consent without governed binding;
- standing survives expiry or revocation;
- delegation is treated as ownership;
- a cached token bypasses required live resolution;
- missing invocation framing is accepted;
- plugin installation silently grants authority;
- configuration silently becomes law;
- generated output acquires authority because its producer is trusted;
- evolution/self-healing authorizes its own consequential change;
- runtime enforcement exists without an identifiable semantic authority basis.

## 12. Readiness for implementation

An authority finding is implementation-ready when the effect, principals, target/capability, authority basis, scope, conditions, expiry, revocation, neighboring ownership, runtime seam, evidence requirements, and blocking unknowns are explicit.

## 13. Home rules

Prefer TRACE / RECONCILE / PROVE over MUTATE.

Do not create:
- a second authority store;
- a second law engine;
- a second security/secret store;
- a universal authority graph;
- a hidden permissions database.

Persist reusable conclusions, meaningful conflicts, and active cases; do not turn every inspection into bureaucracy.
