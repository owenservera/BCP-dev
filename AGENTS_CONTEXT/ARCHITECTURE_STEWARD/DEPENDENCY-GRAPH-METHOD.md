# Dependency Graph Method

## Purpose

Build the full architectural dependency graph over time without pretending the graph is complete before it is.

## Edge classes

### Structural

CONTAINS, PART_OF, LOCATED_IN, IMPLEMENTS, REALIZES

### Semantic

OWNS_MEANING, OWNS_DATA, ENFORCES, DEFINES

### Runtime

REQUIRES, DEPENDS_ON, CONSUMES, PRODUCES

### Lifecycle

EVOLVES, REPLACES, SUPERSEDES, RECOVERS

### Evidence

EVIDENCES, PROVES, DERIVES_FROM, CONTRADICTS

### Product

ENABLES, BLOCKS, PROJECTS, SERVES

## Dependency extraction

For each responsibility ask:

1. What must exist before it can operate?
2. What does it materially enable?
3. What canonical state does it consume?
4. What canonical state does it produce?
5. What authority must govern it?
6. What evidence proves it?
7. What product journeys depend on it?
8. What changes if it is replaced or unavailable?

## Graph quality rules

- A dependency edge needs a reason or evidence reference when consequential.
- Do not infer hard dependencies from mere conceptual proximity.
- Distinguish direct from transitive dependency.
- Distinguish runtime requirement from design preference.
- Distinguish current dependency from target dependency.
- Mark unknown edges rather than inventing them.
- Preserve negative findings: “not a dependency” can be valuable.
- Recalculate affected centrality when canonical edges materially change.

## Full-map construction order

Start from:
1. canonical entities;
2. major responsibilities;
3. cross-system boundaries;
4. direct runtime/data/authority dependencies;
5. product journeys;
6. evidence and implementation links;
7. transitive/keystone analysis;
8. frontier dependencies;
9. change/evolution overlays.

The existing keystone scorecard is a projection of this larger graph, not the graph itself.

## Desired eventual views

- complete node registry;
- complete edge registry;
- dependency graph;
- responsibility graph;
- authority graph;
- evidence graph;
- journey-to-dependency graph;
- change-impact graph;
- frontier graph.
