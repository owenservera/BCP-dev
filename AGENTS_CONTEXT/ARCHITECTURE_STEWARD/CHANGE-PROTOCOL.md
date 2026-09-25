# Architecture Change Protocol

## Every canonical change records

- changeId;
- date/ref;
- affected entities;
- previous representation;
- new representation;
- reason;
- source/evidence refs;
- authority ref;
- affected dependencies;
- stale views;
- unresolved questions;
- required revalidation;
- disposition.

## Change classes

1. RECLASSIFICATION — same underlying meaning, different placement/status.
2. REFINEMENT — adds resolution without changing core meaning.
3. EXPANSION — adds a new responsibility/entity.
4. CONTRACTION — combines representations after proving they are semantically identical.
5. BOUNDARY CHANGE — changes ownership or interface.
6. DEPENDENCY CHANGE — adds/removes dependency.
7. MATURITY CHANGE — evidence changes implementation/proof status.
8. SUPERSESSION — a current view is replaced by a newer current view.
9. ARCHIVAL — current material becomes historical.
10. CONTRADICTION — evidence or authoritative source conflicts with current model.

## Impact discipline

A change to:
- responsibility → recheck owner/dependencies/views;
- boundary → recheck dependent contracts and plugins;
- dependency → recheck keystones/critical paths;
- authority → recheck derived views;
- evidence → recheck maturity/status;
- canonical identity → recheck all references and projections.

## No silent reclassification

If a material conclusion changes, record it as a change.

The old state may remain visible in history where useful.
