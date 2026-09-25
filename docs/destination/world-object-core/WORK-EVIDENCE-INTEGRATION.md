
# Work, Evidence and Canonical Objects

> Classification: DERIVED — DESIGN-CANDIDATE

## 1. Work is not an object shadow store

Work represents an entrusted outcome.

It may reference:
- input objects;
- selected context;
- plans;
- execution/session state;
- produced objects;
- evidence;
- outcomes.

It should not copy complete canonical object payloads merely for convenience.

## 2. Canonical output boundary

~~~text
Work
  v
produces
  v
canonical object revision
  v
relationship + provenance
~~~

The resulting object enters the same world/object substrate.

## 3. Evidence

Evidence remains governed by existing Ω ontology/provenance semantics.

The object core therefore consumes evidence references; it does not invent a replacement evidence authority.

A canonical object may cite:
- source observations;
- import records;
- work receipts;
- provider realization records;
- user assertions;
- other evidence.

## 4. Artifact result

Artifact is useful as a product role for an object produced by Work.

The role can be represented through:
- a produced-by relationship;
- an origin/provenance marker;
- optional artifact-specific payload fields.

No second artifact store is required.

## 5. Example

~~~text
Work: work_123
  input -> Project X
  input -> source documents
  output -> Report object
  evidence -> execution receipt
  relationship -> Report produced-by Work
~~~

A surface may show Report under Artifacts without duplicating the report.

Status:
- generic Work/object reference rule: PROMOTION-CANDIDATE;
- exact Work checkpoint/effect semantics remain owned by the Work stream.
