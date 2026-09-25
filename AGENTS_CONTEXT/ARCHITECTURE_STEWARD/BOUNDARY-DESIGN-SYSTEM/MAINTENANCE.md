# Boundary Design System — Maintenance

## Steward maintenance responsibilities

### Continuous

- Reconcile incoming CFA boundary declarations.
- Preserve source wording and lineage before normalization.
- Keep the live register and index synchronized.
- Mark records STALE when their basis has materially drifted.
- Create challenges for duplicated, contradictory, or unowned responsibility.
- Project boundary relationships into the architecture graph.
- Never silently convert proposals into settled architecture.

### Triggered review

Re-open a boundary when:
- a CFA changes its responsibility statement;
- canonical identity/meaning changes;
- authority semantics change;
- a durable data model changes at the seam;
- execution/capability realization changes;
- a major provider observation changes the assumed contract;
- an evolution/migration changes compatibility assumptions;
- runtime enforcement falsifies a documented invariant;
- a peer explicitly challenges the seam.

### Review cadence

Do not impose a calendar-based ritual initially.

Use **change-triggered review**, plus the Steward's existing housekeeping/drift passes.

### Versioning

v0 is a coordination protocol. Schema changes must:
1. preserve the ability to read existing records;
2. explain the semantic reason for the change;
3. keep old records distinguishable from current ones;
4. never erase prior conflicts/evidence.

### Anti-patterns

Do not create:
- a Boundary DB;
- a second canonical ontology;
- a boundary confidence score;
- a single owner field replacing multidimensional responsibility;
- an automatic authority decision from graph topology;
- an agent ranking based on boundary distance.

### Desired future automation

Only after Round 1/2 proves the protocol useful:
- boundary linting;
- stale detection from changed paths;
- graph projection;
- impact queries;
- challenge generation;
- common read-only architecture.boundary tooling.
