# CFA-04 — Authority Model

> Status: PROVISIONAL WORKING MODEL
> Updated: 2026-09-26
> This is a semantic working artifact. It is not Ω law and does not replace the governing law/runtime implementation.

## 1. Central model

Authority answers:

MAY THIS PRINCIPAL / ACTOR CAUSE THIS CONSEQUENTIAL EFFECT NOW?

The answer is conditioned by:

- principal and represented principal;
- intended effect;
- capability;
- target/resource;
- authority basis;
- consent;
- standing;
- delegation;
- scope;
- conditions/context;
- duration;
- revocation/invalidation;
- current law/policy constraints;
- invocation binding.

## 2. Authority object

A useful conceptual authority relation is:

principal
+ actor / behalf
+ effect
+ target/resource
+ authority basis
+ scope
+ conditions
+ validity interval
+ revocation state
+ evidence
+ provenance

Do not assume every field must live in one record. The canonical data boundary remains a separate design question.

## 3. Authority basis

An authority basis can arise from distinct governed mechanisms, including:

- explicit consent;
- bounded standing;
- delegated authority;
- ownership-derived authority where law recognizes it;
- other explicitly governed grants.

Do not infer an authority basis from capability, possession, identity, attention, prior success, or message provenance.

## 4. Consent

Consent is an authorization act whose semantic scope must be explicit.

The semantic contract should make clear:

- principal giving consent;
- actor or grantee receiving it;
- effect(s);
- target/resource;
- scope;
- conditions;
- duration;
- invalidation;
- evidence required for reconstruction.

A presentation event is not automatically consent.

## 5. Standing

Standing is continuing but bounded authority.

It must remain:

- scoped;
- time-bounded;
- revocable;
- inspectable;
- applicable to a defined effect/context;
- subject to fresh evaluation when governing rules require it.

Standing does not mean permanent permission.

## 6. Delegation

Delegation represents authority being exercised through another principal/actor.

Every meaningful hop needs:

- grantor;
- grantee;
- attenuation/scope;
- expiry;
- revocation;
- evidence.

Delegation must not widen authority merely by adding another hop.

A carried delegation claim is not itself the final authority decision when live re-resolution is required.

## 7. Scope

Scope is the boundary of what the authority covers.

Scope can constrain:

- resource/object;
- operation/effect;
- namespace/domain;
- time;
- actor/grantee;
- contextual conditions;
- risk class;
- provider/realization where explicitly semantically relevant.

Scope matching is a semantic question. Runtime enforcement is a separate mechanism.

## 8. Duration and liveness

Authority has a temporal state.

Distinguish:

- not yet valid;
- live;
- expired;
- revoked;
- otherwise invalid;
- historical.

Historical validity must not be presented as current permission.

## 9. Revocation

Revocation is a state transition that invalidates previously valid authority according to the governing contract.

Authority-facing design must state:

- what is revocable;
- who can revoke;
- when revocation takes effect;
- how descendants/related authority are affected;
- how enforcement observes it;
- what evidence proves the transition.

## 10. Invocation binding

A consequential invocation should carry enough semantic information to bind:

caller
+ behalf
+ operation
+ scope
+ authority
+ intent/causation reference where required

The invocation is the execution-side expression of authority; it is not itself the authority source.

## 11. Law/policy relationship

Law/policy constrains what can be authorized.

CFA-04 may characterize how a law/policy outcome affects the authorization corridor.

CFA-04 does not unilaterally author or amend Ω law.

## 12. Capability relationship

Capability answers what can technically be done.

Authority answers whether it may be done by this actor, for this principal, against this target, under current conditions.

CAPABILITY ≠ AUTHORITY

A provider or account being able to perform an operation does not confer permission.

## 13. Identity relationship

Identity answers who or what something is.

Authority answers what an identified principal is authorized to cause.

IDENTITY ≠ AUTHORITY

CFA-02 remains the canonical identity/data owner.

## 14. Intent relationship

Intent describes what is requested or meant.

Intent does not grant permission.

INTENT ≠ AUTHORITY

CFA-03 remains the semantic owner of command/Intent meaning.

## 15. Work relationship

Work records entrusted execution and its lifecycle.

Work may carry authority references and must invoke governed authorization checks, but Work itself does not become the authority source.

WORK ≠ AUTHORITY

CFA-05 remains the Work/execution owner.

## 16. Evidence relationship

Evidence supports a claim about authority or enforcement.

Evidence does not create authority.

EVIDENCE ≠ AUTHORITY

A signed record can prove authorship/integrity according to its contract without automatically proving present authorization.

## 17. Runtime relationship

CFA-04 supplies semantic authority requirements.

CFA-10 supplies mechanical runtime enforcement.

If the semantic answer is AUTHORIZED but runtime enforcement was not observed, the combined claim is not proven.

If runtime refuses, the refusal must be distinguishable from semantic ambiguity or missing evidence.

## 18. Required state vocabulary

For authority investigations use:

OBSERVED
DERIVED
PROPOSED
UNKNOWN
CONFLICTED

For current authorization state use factual dimensions such as:

AUTHORIZED
REFUSED
UNRESOLVED
EXPIRED
REVOKED
OUT_OF_SCOPE

Avoid numeric authority/confidence scores that obscure the basis.

## 19. Re-resolution triggers

Assume fresh authority evaluation may be required when any of these changes:

- principal identity/standing;
- delegation chain;
- consent;
- scope;
- target/resource;
- capability/effect;
- relevant risk;
- law/policy;
- expiry;
- revocation;
- provider/realization where effect meaning changes;
- consequential system adaptation;
- execution context required by the authority contract.

The exact trigger set is contract-specific and must be evidenced.

## 20. Authority lifecycle

DISCOVER
→ DEFINE
→ GRANT / ESTABLISH
→ BIND
→ CHECK LIVE
→ INVOKE
→ ENFORCE
→ EFFECT
→ EVIDENCE
→ EXPIRE / REVOKE / REPLACE
→ RECONSIDER

This lifecycle is a working model, not an implementation prescription.

## 21. Anti-confusion test

Whenever an artifact claims permission, ask:

1. Who is the principal?
2. Who is the actor?
3. What is the effect?
4. What is the target?
5. What capability is involved?
6. What is the authority basis?
7. What scope/condition applies?
8. When does it expire?
9. What can revoke it?
10. What evidence supports the claim?
11. Where is it mechanically enforced?
12. What would make this claim stale?
