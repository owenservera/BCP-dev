# WS-010 — V0 Design Decisions

> **Classification: DERIVED — PROPOSED V0**
> **Purpose:** explicit governor-led design choices
> **Base tip:** fbef973c443b125c442fd674ae9a9f4f5f532207

| ID | Decision | Rationale | Status |
|---|---|---|---|
| OBS-001 | Observatory is read-only | Prevents a second task/authority/control system | PROPOSED V0 |
| OBS-002 | Infinite canvas is the spatial model | Structural exploration beats flat lists | PROPOSED V0 |
| OBS-003 | Canvas starts with VIVIM MINE, BCP/FORGE, Ω DESTINATION | Matches actual program structure | PROPOSED V0 |
| OBS-004 | P1 workstreams float across/within territories | Workstreams are cross-cutting missions | PROPOSED V0 |
| OBS-005 | Everything meaningful is an entity | Avoids premature task-only modeling | PROPOSED V0 |
| OBS-006 | Multiple views project one model | Prevents competing dashboards/databases | PROPOSED V0 |
| OBS-007 | Experience combines architecture + mission control | Structure and live state are both first-class | PROPOSED V0 |
| OBS-008 | State is visually strong | Program state should be scannable | PROPOSED V0 |
| OBS-009 | Attention is persistent + contextual | Conditions remain discoverable without dominating | PROPOSED V0 |
| OBS-010 | Zoom is hybrid spatial + semantic | Preserves geography while increasing detail | PROPOSED V0 |
| OBS-011 | Relationships are data; position is presentation | Prevents hidden state in canvas placement | PROPOSED V0 |
| OBS-012 | Human-readable context is primary | IDs are references, not meaning | PROPOSED V0 |
| OBS-013 | Identifiers are references; language carries meaning | Prevents the index-as-label failure mode | PROPOSED V0 |
| OBS-014 | Unknown is visible and preferred to guessing | Preserves epistemic discipline | PROPOSED V0 |
| OBS-015 | Evidence/provenance is visible at meaningful levels | Prevents unauditable visualization | PROPOSED V0 |
| OBS-016 | Existing authority systems are consumed, not replaced | Avoids a universal truth database | PROPOSED V0 |
| OBS-017 | No autonomous prioritization | Reflection must not become project management | PROPOSED V0 |
| OBS-018 | No implementation before research falsifiers | Prevents attractive but semantically wrong build | PROPOSED V0 |

## Rejected directions

### R-001 — Conventional Kanban as primary model

Rejected for V0 because it collapses architecture, evidence and relationships into
task columns.

### R-002 — Repository tree as primary model

Rejected because a tree describes storage, not program semantics.

### R-003 — Identifier-first graph

Rejected because a graph full of P1/WS/PR/agent IDs is an index, not understanding.

### R-004 — One giant truth database

Rejected because authority is federated and existing mechanisms must remain owners.

### R-005 — Editable dashboard

Rejected for V0. Feedback and state changes remain in source systems.

### R-006 — LLM as truth resolver

Rejected. Generated language may assist interpretation later but cannot silently
become authority.

### R-007 — Autonomous project manager

Rejected. No invented prioritization, assignment or decisions.

## Open design questions

- exact rendering technology;
- local vs browser shell;
- graph storage vs derived in-memory model;
- update frequency;
- exact accessible visual treatment;
- how much source text is embedded vs linked;
- whether local agent telemetry can be read safely;
- whether Time/Evolution belongs in V0 or V0+.
