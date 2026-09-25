
# Revision and Lifecycle Semantics

> Classification: DERIVED — EVIDENCE-SUPPORTED + DESIGN-CANDIDATE

## 1. Existing identity substrate

Ω already distinguishes:
- logical object identity (ns,id);
- exact revision (ns,id,rev);
- content id cid;
- changelog entry identity.

This is the correct foundation for world objects.

## 2. Modify means append

A semantic mutation does not overwrite history.

~~~text
(ns,id,1)
(ns,id,2)
(ns,id,3)
...
~~~

The latest revision is the current canonical state.

Historical revisions remain addressable even when moved to cold storage.

## 3. Content deduplication is not object deduplication

Two objects may legitimately have the same CID.

Therefore:
~~~text
same cid != same object
~~~

Object identity merge requires explicit semantic evidence and authority.

## 4. Delete/archive

Archive creates a new current revision whose lifecycle is archived.

Delete creates a new current revision whose lifecycle is deleted and carries a tombstone reason/actor/time.

The tombstone is semantic, not physical.

## 5. Restore

Restore is not erase-the-tombstone.

It creates a new current revision restoring a previously valid semantic state, with provenance to the tombstone and selected prior revision.

This preserves the fact that deletion occurred.

## 6. Source-backed objects

Source availability is a distinct axis.

An external record may be available, changed, unavailable, or disappeared.

The local canonical record survives source disappearance, with source-state evidence updated separately.

## 7. Source refresh

A refresh is a new observation, not an in-place rewrite of history.

The import path preserves source identity, observed source state, import/provenance event, and resulting local revision.

## 8. Lifecycle axes

Do not use one generic status to represent all of:
- object lifecycle;
- provider realization health;
- epistemic status;
- source availability;
- Work state;
- authorization.

Core revision identity: EVIDENCE-SUPPORTED.
Tombstone/restore semantics: DESIGN-CANDIDATE.
Cross-source refresh policy: EXPERIMENT-REQUIRED.
