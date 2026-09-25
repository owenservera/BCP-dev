# System Intelligence Archaeology — Launch Prompt

> **Classification: DERIVED — PROPOSED · Operator handoff**

You are participating in System Intelligence / Atomic Product-System Reconstruction for VIVIM.

This is research only. Do not implement product changes.

Repository:

https://github.com/owenservera/BCP-dev

## Read

1. /AGENTS.md
2. /BUILD_CONTEXT.md
3. /docs/CURRENT-CONTEXT.md
4. /docs/destination/system-intelligence/RESEARCH-CHARTER.md
5. /docs/destination/system-intelligence/INVESTIGATOR-PROTOCOL.md
6. /docs/destination/system-intelligence/ATOM-SCHEMA.md
7. /docs/destination/system-intelligence/ROLE-BRIEFS.md
8. relevant destination documents
9. relevant P1/program documents
10. the source tree assigned to your role


## Orchestration

The first run is six parallel investigators, not six copies of the same task.

Parent coordinator:
- SI-COORD — dispatches SI-01..SI-06, checks completeness, then launches synthesis.

Children:
- SI-01 → findings/SI-01-omega-runtime/
- SI-02 → findings/SI-02-legacy-vivim/
- SI-03 → findings/SI-03-omega-lineage/
- SI-04 → findings/SI-04-product-surface/
- SI-05 → findings/SI-05-boundaries/
- SI-06 → findings/SI-06-red-team/

Do not start specialized deep dives during Wave 1 unless a safety/integrity issue requires immediate clarification. First collect the broad evidence set, then synthesize and calculate centrality/uncertainty. Only then dispatch additional deep-dive agents.

The parent coordinator must not merge partial conclusions into product architecture during Wave 1. Its first synthesis job is normalization and contradiction preservation.

## Mission

Reconstruct the assigned area at atomic resolution and connect findings to the existing VIVIM product/program model.

Do not create a new product ontology.

Do not treat Legacy VIVIM, standalone Ω, and current BCP Ω as interchangeable authorities.

## Required output

Work only in:

docs/destination/system-intelligence/findings/<ROLE>/

Produce:

- SUMMARY.md
- ATOMS.jsonl
- EDGES.jsonl
- EVIDENCE.md
- CONTRADICTIONS.md
- GAPS.md
- PRODUCT-LINKS.md

Use ATOM-SCHEMA.md.

## First pass

Start broad enough to identify the landscape, but stop shallow investigation where there is little downstream impact.

For every important candidate atom record:

- what it is;
- where it exists;
- lineage;
- evidence;
- status;
- dependencies;
- downstream relationships;
- destination/program links;
- uncertainty.

## Deep pass

Go deeper when an atom:

- has high fan-out;
- crosses a major boundary;
- affects multiple journeys;
- affects multiple workstreams;
- involves external reality;
- contains contradictory evidence;
- appears to be a keystone;
- could change V1 build order.

## Critical discipline

Observed fact is not architectural truth.

Historical Ω intent is not current BCP reality.

Legacy behavior is not destination law.

A fixture is not the same as live external proof.

Unknown is a valid result.

## Completion

Do not declare complete because many files were read.

Declare complete when the assigned area's consequential atoms are traceable from source evidence to destination impact and remaining uncertainty is explicit.

Recommend follow-on deep dives instead of filling gaps by assumption.
