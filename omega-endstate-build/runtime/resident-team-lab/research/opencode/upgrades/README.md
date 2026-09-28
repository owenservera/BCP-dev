# OpenCode Upgrade-Wave Research

> Purpose: keep OpenCode substrate research aligned with the resident-team upgrade sequence.

Each upgrade wave gets its own research lane so that:

- version-specific evidence is preserved;
- experiments are not mixed with end-state design;
- a later wave can reuse earlier evidence without silently changing its meaning;
- current OpenCode drift can be isolated from Ω decisions.

## Wave template

Each wave should contain:

1. `README.md` — scope, goal, boundaries, source map.
2. `RESEARCH-BASIS.md` — exact substrate findings and version scope.
3. `EVIDENCE-MATRIX.md` — checkpoint/claim/evidence state.
4. `EXPERIMENT-QUEUE.md` — ordered experiments and blockers.
5. optional source-specific annexes when a wave becomes large.

## Current waves

| Wave | Purpose | Status |
|---|---|---|
| U1 | Governed native Task delegation | Active |
| U2 | Resident-owned bounded worker pool | Future |
| U3 | Durable lineage/evidence | Future |
| U4 | Direct resident-to-resident Commons | Future |
| U5 | Multi-resident lifecycle/recovery | Future |
| U6 | Ten-resident admission | Future |
| U7 | Ω-native governance | Future |

The wave list mirrors the resident-team lab design sequence; the OpenCode-specific documents explain only the substrate aspects.

## Promotion rule

A wave can consume evidence from an earlier wave only when the earlier wave records:

- exact OpenCode version;
- launch surface;
- relevant source/docs;
- observable evidence;
- failure/unknown conditions.

Do not promote by naming a feature "supported".
