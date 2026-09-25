
# Canonical Relationship Model

> Classification: DERIVED — DESIGN-CANDIDATE
> Status: semantic relationship is distinct from vault provenance.

## 1. Why a dedicated semantic relationship record is necessary

The existing vault refs field is a structural provenance mechanism used by compaction and evidence linkage. It does not answer which project contains a document, which message belongs to a conversation, or which relationship is disputed.

Semantic relationships must therefore be explicit.

## 2. Relationship record

Candidate shape:

~~~text
Relationship
  ref
  subjectRef
  predicate
  objectRef
  scope?
  assertionState = asserted | retracted | contested
  assertedBy?
  sourceIdentity?
  validFrom?
  validTo?
  provenanceRefs[]
  evidenceRefs[]
  createdAt
  updatedAt
~~~

For revision-sensitive claims, subject/object can additionally identify exact revisions.

## 3. Authority

A relationship record is an assertion. Its existence is not itself authority.

Authority remains governed by existing law, consent and actor mechanisms.

The record preserves who asserted it, what evidence supports it, where it came from, and its state.

## 4. Conflict

Conflicting relationships must coexist.

Example:
~~~text
A --[works-with]--> B
A --[does-not-work-with]--> B
~~~

The system does not silently overwrite one because another arrived later.

A conflict may be explicitly marked contested, resolved by a domain rule, superseded by a newer authoritative assertion, or left unresolved.

## 5. Relation identity

A relationship needs stable local identity because it has history, may be retracted, carries provenance and may conflict with another assertion.

A deterministic fingerprint may suppress exact duplicates, but fingerprint equality must not replace durable relation identity.

## 6. Provenance vs relationship

Relationship:
~~~text
"Project X contains Document Y"
~~~

Provenance:
~~~text
"This relationship was derived from imported row Z"
~~~

One can cite the other without collapsing them.

## Status

PROMOTION-CANDIDATE for contract design, with predicate vocabulary and conflict-resolution experiments outstanding.
