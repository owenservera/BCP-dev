# Drift and Re-Pull Protocol

## Principle

Agents are allowed to create local complexity.

The repository's architecture must not permanently remain in that local form.

## Drift classes

### D1 Path drift

Useful artifact exists but is stored where a fresh agent will not find it.

### D2 Vocabulary drift

Same concept is named differently without explicit mapping.

### D3 Status drift

Document maturity/status conflicts with current evidence.

### D4 Dependency drift

Canonical graph misses a newly introduced or removed dependency.

### D5 Ownership drift

The documented owner no longer matches responsibility or code reality.

### D6 Authority drift

A derived/proposed document is being treated as law.

### D7 Freshness drift

A derived view no longer reflects its source basis.

### D8 Boundary drift

A responsibility has leaked across an architectural boundary.

### D9 Depth drift

A concept is described at an inappropriate resolution or a new recurring resolution is emerging.

## Repull procedure

When drift is found:

1. retain source;
2. locate canonical subject;
3. compare source with current canonical view;
4. extract changed claims/edges;
5. classify each change;
6. update canonical model;
7. refresh affected views;
8. record contradiction if unresolved;
9. record changed dependencies;
10. note what downstream work must be revalidated.

## Repull is not overwrite

“Pull back into canonical” means:

SOURCE → NORMALIZE → MAP → RECONCILE → VIEW

It does not mean copying the canonical document into the source artifact.

## Drift closure

A drift issue is closed only when:
- the useful information is represented canonically;
- source lineage is preserved;
- stale views are refreshed;
- unresolved contradictions are explicit;
- no parallel semantic owner was accidentally created.
