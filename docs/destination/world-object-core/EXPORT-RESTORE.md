# World/Object Export and Restore

> Classification: DERIVED — EVIDENCE-SUPPORTED + DESIGN-CANDIDATE

## Existing storage proof

The Ω vault already provides namespace-scoped export, self-hashing archives, Merkle verification, CAS carriage, hot/cold revisions, recovery evidence, fresh-vault import and roundtrip checking.

## Product world export

A world archive must preserve:
- canonical object revisions;
- relationship records;
- source identities;
- alias mappings;
- tombstone revisions;
- provenance/evidence refs;
- content references;
- optional Space state;
- selected workspace/projection configuration.

Projection caches need not be authoritative if they are rebuildable.

## Restore order

~~~text
verify archive
  -> canonical objects/revisions/content
  -> relationships
  -> aliases/source mappings
  -> spaces/configuration
  -> world projections
  -> external reconnect
  -> unresolved resource markers
~~~

## Identity

A fresh restore preserves canonical refs unchanged.

Current Ω import intentionally refuses cross-vault merging into non-empty targets. Existing-world merge therefore needs a distinct collision/remapping protocol.

## Secrets

Carry reconnect metadata rather than raw secrets unless a later governed security mechanism explicitly permits encrypted portability.

Status:
- vault mechanics: EVIDENCE-SUPPORTED;
- whole-world archive composition: DESIGN-CANDIDATE;
- existing-world merge/restore: UNRESOLVED / EXPERIMENT-REQUIRED.
