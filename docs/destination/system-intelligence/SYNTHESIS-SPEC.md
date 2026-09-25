# System Intelligence — Synthesis Specification

> **Classification: DERIVED — PROPOSED**

## Purpose

Turn investigator packages into a coherent, traceable system map without creating another authority system.

## Required outputs

### synthesis/SYSTEM-MAP.md
Major product/system atoms and relationships.

### synthesis/DEPENDENCY-MAP.md
Atomic dependencies, direct dependents, boundary edges, high-centrality atoms, critical-path candidates, and uncertainty.

### synthesis/RECONCILIATION.md
Legacy VIVIM ↔ standalone Ω ↔ BCP Ω, with destination impact.

### synthesis/PRODUCT-TRACE.md
destination outcome → journey → requirement → atom → implementation → evidence

and reverse source-to-product traces where useful.

### synthesis/CRITICAL-PATHS.md
What must be resolved or built before major V1 slices can progress.

### synthesis/OPEN-FRONTIER.md
Important areas genuinely missing, under-scoped, or unresolved.

### synthesis/RED-TEAM-REPORT.md
Falsification results, contradictions, and confidence limits.

### indexes/ATOMS.json
Normalized atomic records.

### indexes/EDGES.json
Normalized/deduplicated relationships.

### indexes/EVIDENCE.json
Normalized source/evidence references.

## Metrics

At minimum calculate:

- direct dependents;
- transitive dependents;
- destination journey reach;
- vertical-slice reach;
- workstream reach;
- proof dependency reach;
- external-reality flag;
- uncertainty;
- complexity using the existing destination score where applicable.

Do not create a composite importance score that hides the underlying dimensions.

## Descriptive criticality

Use:

- FOUNDATIONAL
- CROSS-CUTTING
- JOURNEY-CRITICAL
- BOUNDARY-CRITICAL
- PROOF-BLOCKING
- LOCAL
- UNKNOWN

These are analysis descriptors, not product rankings.

## Traceability requirement

Every high-impact synthesized item must link to existing:

- destination document/section;
- journey;
- vertical slice;
- keystone dependency where applicable;
- P1 workstream;
- delivery track;
- proof/evidence artifact;
- decision or open question where applicable.

Missing destination/program targets are marked UNSCOPED and placed in OPEN-FRONTIER.md.

## Promotion rule

Promote findings to their proper home:

- Ω law/decision → Ω decision machinery;
- product requirement/model → destination docs;
- program sequencing → PROGRAM-BOARD/workstream;
- migration disposition → P1-08 machinery;
- provider evidence → P1-07 evidence;
- implementation proof → tests/gates;
- transient research → remain here.

This directory never becomes authority by itself.
