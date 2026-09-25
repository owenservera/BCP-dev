
# World/Object Core Red Team

> Classification: DERIVED — ADVERSARIAL REVIEW

## Attack 1 — Universal object becomes universal ontology
Risk: every domain field gets promoted into the common envelope.

Disposition: REJECTED.

Keep the envelope small: identity, lifecycle, origin, source identity, content reference and timestamps. Domain meaning stays in typed payloads.

## Attack 2 — Relationship refs become provenance refs
Risk: the existing refs array is overloaded as a graph edge store.

Disposition: REJECTED.

Semantic relationships require explicit relationship records. Vault refs remain structural provenance.

## Attack 3 — Last-write-wins relationship truth
Risk: a later contradictory relation silently erases earlier truth.

Disposition: REJECTED.

Competing assertions remain inspectable.

## Attack 4 — Source ID becomes global identity
Risk: two provider records with identical external ids collapse.

Disposition: REJECTED.

Source identity is namespaced by source authority/realm/account scope and is evidence-backed mapping only.

## Attack 5 — Tombstone becomes physical delete
Risk: delete destroys replay/export/history.

Disposition: REJECTED.

Delete is semantic state. Storage retention is separate.

## Attack 6 — World becomes a warehouse
Risk: a materialized world table becomes a second canonical store.

Disposition: REJECTED.

World is derived from canonical state.

## Attack 7 — Workspace becomes semantic containment
Risk: removing a workspace deletes what the user owns.

Disposition: REJECTED.

Workspace is presentation/configuration. Semantic containment is a relationship.

## Attack 8 — Artifact duplicates result
Risk: every Work result is copied into an artifact store.

Disposition: REJECTED.

Artifact is a role over a canonical produced object.

## Attack 9 — CID equality causes merge
Risk: identical content gets treated as one object.

Disposition: REJECTED.

Content identity and object identity are distinct.

## Attack 10 — Imported source disappearing deletes local data
Risk: external service becomes sovereign authority over local world.

Disposition: REJECTED.

Local canonical data survives source disappearance.

## Attack 11 — Export restores only visible projections
Risk: UI looks right while semantic world is lost.

Disposition: REJECTED.

Canonical objects, relationships and identity mappings are the restore unit; projections rebuild afterward.

## Attack 12 — New object needs one special case
Risk: abstraction looks generic until a new kind arrives.

Disposition: EXPERIMENT-REQUIRED.

The synthetic weather-pin test passed the design criterion; real-vault proof remains required.
