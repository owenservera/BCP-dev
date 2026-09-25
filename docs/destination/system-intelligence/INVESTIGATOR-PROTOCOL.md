# System Intelligence — Investigator Protocol

> **Classification: DERIVED — PROPOSED · Read-only archaeology protocol**

## Operating rule

Investigators gather evidence; they do not settle architecture.

Work read-only against the repository except for running existing commands or tests needed to establish evidence.

No production implementation, migration, cleanup, or architecture-law edits.

## Common bootstrap

Read only enough to orient:

1. /AGENTS.md
2. /BUILD_CONTEXT.md
3. /docs/CURRENT-CONTEXT.md
4. /docs/destination/system-intelligence/RESEARCH-CHARTER.md
5. /docs/destination/system-intelligence/ATOM-SCHEMA.md
6. relevant destination documents from README.md
7. relevant P1/program material
8. relevant Ω authority material
9. assigned source tree

Do not blindly load the entire repository.

## Investigation passes

### Inventory
Identify candidate atoms, boundaries, lineage, implementations, tests/fixtures, product links, dependencies, and unknowns.

### Deep
For high-impact atoms trace prerequisites, consumers, lifecycle/state, persistence, authority/proof, external dependencies, alternatives, failure and recovery.

### Boundary
Determine what each side of a seam assumes about the other.

### Reconciliation
Map findings to existing destination/program structures.

### Red team
Look for conflated concepts, false canonicalization, hidden dependencies, undocumented assumptions, stale evidence, implementation/proof mismatch, and product gaps hidden behind subsystem completeness.

## Per-investigator output

Work only in:

docs/destination/system-intelligence/findings/<ROLE>/

Produce:

1. SUMMARY.md
2. ATOMS.jsonl
3. EDGES.jsonl
4. EVIDENCE.md
5. CONTRADICTIONS.md
6. GAPS.md
7. PRODUCT-LINKS.md

The machine-readable records and exact evidence references are the primary deliverable. Narrative is secondary.

## Escalation

Recommend deeper investigation when an atom:

- has high downstream fan-out;
- affects multiple destination journeys;
- crosses a major boundary;
- involves external reality;
- has contradictory evidence;
- is a likely keystone;
- blocks several other capabilities.

Do not self-spawn or self-reprioritize unless instructed.

## Completion test

The assigned area's consequential atoms must be traceable from source evidence to destination impact, with remaining uncertainty explicit.
