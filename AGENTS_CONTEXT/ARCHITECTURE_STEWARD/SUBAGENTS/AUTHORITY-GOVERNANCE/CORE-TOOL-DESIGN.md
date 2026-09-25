# CFA-04 — Core Tool Design

> Status: PROPOSED / FOUNDATION TOOL
> Updated: 2026-09-26
> Tool: Authority Trace
> Contract seed: authority.trace@1

## Executive idea

If CFA-04 gets one operational tool, it should be an Authority Trace.

Question:

For a proposed or observed consequential action, what is the current authorization basis, what facts does it depend on, what scope/conditions/liveness apply, where is enforcement, and what remains unknown or conflicted?

The tool is read-oriented. It does not grant authority and does not become a second law engine.

## 1. Trace path

PRINCIPAL
→ BEHALF / DELEGATION
→ INTENT
→ CAPABILITY
→ TARGET / RESOURCE
→ AUTHORITY BASIS
→ CONSENT / STANDING / DELEGATION
→ SCOPE / CONDITIONS / EXPIRY
→ REVOCATION
→ INVOCATION
→ K0 ENFORCEMENT
→ EFFECT / OBSERVATION
→ EVIDENCE

## 2. Input

Normal invocation should accept a target or question.

Useful fields:

- principal
- behalfOf
- intentRef
- capabilityRef
- targetRef
- invocationRef
- authorityRef
- query
- context
- bounded traversal limits
- trace basis/ref

Ambiguous queries must return ambiguity rather than fabricate a resolution.

## 3. Output: Authorization Dossier

Return:

- principal
- represented principal
- intent
- capability
- target
- authority basis
- consent
- standing
- delegation chain
- scope
- conditions
- expiry
- revocation
- invocation
- current law/policy constraints
- runtime enforcement observation
- evidence/provenance
- current status
- unknowns
- conflicts
- falsifiers
- basis/source references

The dossier is a derived view, not canonical authority state.

## 4. Status vocabulary

identity: RESOLVED | UNKNOWN | CONFLICTED
capability: RESOLVED | UNKNOWN | CONFLICTED
target: RESOLVED | UNKNOWN | CONFLICTED
authorityBasis: PRESENT | ABSENT | UNKNOWN | CONFLICTED
consent: PRESENT | NOT_REQUIRED | ABSENT | EXPIRED | REVOKED | UNKNOWN
standing: ACTIVE | ABSENT | EXPIRED | REVOKED | UNKNOWN
delegation: VALID | ABSENT | EXPIRED | REVOKED | ATTENUATED | CONFLICTED | UNKNOWN
scope: SATISFIED | OUTSIDE | UNKNOWN | CONFLICTED
conditions: SATISFIED | UNSATISFIED | UNKNOWN
liveness: LIVE | EXPIRED | REVOKED | UNKNOWN
runtime: ENFORCED | REFUSED | NOT_OBSERVED | UNKNOWN
overall: AUTHORIZED | REFUSED | UNRESOLVED

The tool reports the result of governed authority resolution; it does not manufacture the result.

## 5. Modes

ORIENT
- principal, target, capability, current status, highest-value missing fact.

TRACE
- complete authority corridor with source/basis refs.

CHECK
- read-only validation of supplied invocation/proposed action.

IMPACT
- authority consequences of resource, capability, provider, principal, law, delegation, or evolution changes.

EVIDENCE
- evidence supporting each authority-relevant claim.

CHANGE
- authority state across revisions/time and re-resolution triggers.

These are views of one tool.

## 6. Delegation

For delegated action, show every hop, including:

- grantor;
- grantee;
- scope;
- attenuation;
- expiry;
- revocation;
- evidence.

Never collapse the chain into “trusted agent.”

## 7. Invocation

Expose the invocation seam:

caller
behalfOf
operation
scope
authority reference
intent reference

Flag missing frames, principal mismatches, stale authority, out-of-scope operations, and authority/reference disagreement.

Do not replace K0 enforcement.

## 8. Law boundary

The tool may inspect and explain law/policy outcomes.

It must not:
- author law;
- amend law;
- promote law;
- treat its own output as law.

A law refusal remains a governing-law result.

## 9. No mutation in V1

No grant.
No revoke.
No consent issuance.
No standing creation.
No law amendment.
No policy mutation.

## 10. Evidence split

Keep these separate:

authority claim
evidence of authority
evidence of runtime enforcement
evidence of observed effect

One must not be substituted for another.

## 11. Boundedness

Every trace has limits for:
- authority hops;
- history window;
- evidence;
- traversal depth;
- context fan-out.

Default to local inspection. Wide impact analysis requires explicit expansion.

## 12. First proof corridor

Do not build a generic authorization engine first.

Prove one real corridor:

principal
→ standing / consent / delegation
→ capability
→ invocation
→ runtime enforcement
→ evidence

Then prove one negative corridor:

same action
→ expired / revoked / out-of-scope
→ deterministic refusal
→ reconstructable evidence

Use those experiments to discover the smallest missing contracts.

## 13. Falsifiers

The tool design is wrong if:
- active standing remains effective after expiry;
- ancestor revocation fails to affect delegated descendants;
- capability match alone produces authorization;
- principal mismatch is accepted;
- missing invocation context is accepted as valid;
- UI state changes authority without a governed semantic event;
- law refusal can be bypassed by provider or runtime routing.

## 14. Success condition

An agent can inspect an unfamiliar consequential action and answer:

Who is acting?
On whose behalf?
What is being attempted?
What capability is involved?
What authority basis applies?
What scope and conditions apply?
Is it live?
What revoked or expired it?
What delegation/standing chain exists?
What will K0 enforce?
What evidence supports the answer?
What remains unknown?
What would trigger re-resolution?

without creating a second authority system.
