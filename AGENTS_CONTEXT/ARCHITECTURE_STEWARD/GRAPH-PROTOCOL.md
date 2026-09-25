# Architecture Graph Protocol

## Purpose

Maintain one destination-anchored graph that connects the documented VIVIM end state to architecture, evidence, current reality and later implementation.

## Authority order

1. VIVIM North Star / end vision.
2. Destination model and human experience.
3. Destination responsibilities, requirements and journeys.
4. Ratified architecture boundaries and contracts.
5. Evidence / System Intelligence.
6. Current implementation.
7. Integration, live and product proof.

The graph records this order; it does not replace it.

## Construction rule

Every consequential node/edge must be traceable to a source document or evidence record.

```
SOURCE
  ↓
NODE / EDGE
  ↓
VIEW
```

No hard dependency may be created solely because two items are mentioned together, live in nearby paths, or are owned by the same team.

## Epistemic rule

Preserve:

```
VISION ≠ DESIGN ≠ IMPLEMENTATION ≠ INTEGRATION ≠ PROOF ≠ PRODUCTIZATION
```

Research status is not authority.

Evidence is not authorization.

A graph node never upgrades maturity.

## Relation rule

Use descriptive relations for conceptual framing.

Use dependency relations only when the source supports an actual dependency.

Distinguish:

- direct vs transitive;
- current vs target;
- runtime vs semantic vs data vs authority vs lifecycle;
- required vs preferred;
- evidence-backed vs inferred.

Unknown edges stay unknown.

Negative findings may be represented explicitly.

## Evolution rule

Replacement is a first-class architectural relationship.

Any replacement analysis must inspect:

- canonical identity;
- Work;
- Evidence;
- provenance;
- authority;
- user-visible meaning.

## Build rule

The graph should support these questions:

- What destination requirement does this implementation advance?
- What journey does it exercise?
- What must already exist?
- Which authority governs the effect?
- What evidence proves the relationship?
- What downstream nodes are affected?
- Can this realization be replaced?
- Which destination responsibilities have no implementation or proof?
- Which implementation nodes are orphaned?
- Which source documents disagree with the graph?

## Steward rule

When the source truth changes:

```
OBSERVE
→ EVIDENCE
→ CLASSIFY
→ RECONCILE
→ UPDATE GRAPH
→ RECORD CHANGE
```

Do not “complete” the graph by guessing.

## Current graph boundary

This initial graph is deliberately **documentation-first**. Code nodes are deferred until the graph's destination and evidence relationships are stable enough to attach them without making repository structure the accidental source of truth.
