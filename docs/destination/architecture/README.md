# VIVIM Architecture Map

> Classification: DERIVED — CURRENT ARCHITECTURE INDEX
> Steward: `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/`

This is the navigation home for the repository-wide architectural map.

## Canonical principle

The architecture is represented as a connected model, not as one giant document.

```
ARTIFACT
  ↓
CLAIM / EVIDENCE
  ↓
RESPONSIBILITY
  ↓
BOUNDARY / CONTRACT
  ↓
IMPLEMENTATION / REALIZATION
  ↓
DEPENDENCY
  ↓
INTEGRATION / JOURNEY
  ↓
PRODUCT / LIFECYCLE
```

Human-readable views may be specialized. The Steward is responsible for keeping their semantic references coherent.

## Current map sources

| View | Location | Purpose |
|---|---|---|
| Destination master map | `docs/destination/DESTINATION-MASTER-MAP.md` | broad destination structure |
| Responsibility universe | `docs/destination/core-vs-plugin-boundary/DESTINATION-RESPONSIBILITY-MATRIX.md` | 125 responsibility baseline |
| Core boundary | `docs/destination/core-vs-plugin-boundary/` | K0/K1/plugin boundary |
| Keystone graph | `docs/destination/DEPENDENCY-GRAPHS-AND-KEYSTONE-SCORECARD.md` | current high-centrality dependency view |
| System Intelligence graph | `docs/destination/system-intelligence/synthesis/DEPENDENCY-MAP.md` | atomic research dependency view |
| Requirements/evidence | `docs/destination/REQUIREMENT-EVIDENCE-TRACEABILITY.md` | requirement proof linkage |
| Vertical slices | `docs/destination/VERTICAL-SLICE-REGISTRY.md` | end-to-end product proof structure |
| Evolution | `docs/destination/EVOLUTION-RECONCILIATION.md` | change/compatibility/impact overlay |

## Steward-owned future map

The Steward will progressively establish:

1. canonical architecture node registry;
2. canonical architecture edge registry;
3. responsibility-to-implementation map;
4. responsibility-to-evidence map;
5. dependency/impact graph;
6. journey-to-dependency graph;
7. authority/ownership graph;
8. frontier/dependency graph;
9. architecture-depth registry;
10. generated/derived views.

Until those registries are proven and maintained, existing documents remain the authoritative views for their respective scopes.

## Important distinction

The full graph is not merely a module-import graph.

It must distinguish semantic, runtime, data, authority, lifecycle, evidence, and product dependencies.

Code imports are evidence for implementation coupling, not automatically proof of architectural dependency.

## Steward rule

A new architectural artifact does not need to be written in this format.

It does need to become discoverable through this map when it contains durable architectural meaning.
