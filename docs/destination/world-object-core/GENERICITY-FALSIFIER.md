
# Genuinely New Object Falsifier

> Classification: EXPERIMENT-RESULT
> Method: local synthetic execution of the proposed semantic model; no browser, AI, network or production code.
> Repository runtime clone: NOT EXECUTED because the current container cannot resolve github.com. Repository evidence was inspected through the authenticated GitHub integration.

## Falsifier target

Introduce an object kind absent from the existing world model:

~~~text
kind = weather-pin
~~~

The object must survive:

CREATE -> IDENTIFY -> RELATE -> READ -> MODIFY -> VERSION -> DERIVE -> PROJECT -> REFERENCE -> EXPORT -> RESTORE -> ARCHIVE/DELETE -> RESTORE

without:
- a new storage table;
- a bespoke evidence model;
- a second relationship store;
- a special Work engine;
- a UI-as-truth dependency.

## Synthetic result

The local falsifier implemented:
- one generic object store keyed by (ns,id,rev);
- content ids via SHA-256 canonical serialization;
- relationship records stored as ordinary canonical rows;
- derived records referencing basis revisions;
- projection state independent from canonical object content;
- Work rows containing refs rather than object payload copies;
- export/restore preserving rows, revisions, CIDs and changelog;
- tombstone revision for delete;
- explicit restore as a new revision;
- source-alias records;
- identity collision preserved as contested rather than merged;
- source disappearance represented as a source-state change while the local object remained intact.

### Result: PASS for the semantic genericity criterion

The synthetic weather-pin object traversed the complete lifecycle without adding a type-specific storage mechanism.

## What this proves

It provides design evidence that:
- object kind can vary without changing physical storage;
- revision, relationship, Work and projection machinery can be generic;
- delete/restore can preserve identity and history;
- source disappearance need not destroy the local record.

## What it does not prove

It does not prove:
- production integration;
- current vault APIs expose every semantic operation without additions;
- large/binary file support;
- full-world export/import across namespaces;
- real external source refresh behavior;
- conflict UX;
- concurrency/merge semantics.

## Repository-runtime falsifiers still owed

1. Real vault implementation of a new object kind.
2. Real relationship records with conflicting assertions.
3. Real export/restore preserving all world identity mappings.
4. Real source disappearance / refresh.
5. Real file/content reference lifecycle.

Disposition: PROMOTION-CANDIDATE for contract implementation planning, not production implementation.
