# WS-010 — External / Local Agent Pair Contract

> **Classification: DERIVED — PROPOSED V0**

## Purpose

This workstream uses one external ChatGPT research participant and one local
OpenCode research/build participant.

The pair does not form two authorities. The repository is their durable shared
memory.

## External ChatGPT agent

Primary responsibility:

- architecture and UX research;
- semantic model critique;
- human-readable contextualization;
- cross-view design;
- epistemic/provenance design;
- falsifier design;
- boundary checking against neighboring workstreams;
- review of local findings.

Core question:

> What should the observatory mean, and what would make it semantically
> trustworthy and genuinely useful to a human?

## Local OpenCode agent

Primary responsibility:

- repository archaeology;
- source inventory;
- feasibility analysis;
- deterministic extraction experiments;
- bounded prototypes;
- source-to-entity mapping;
- reproducibility;
- implementation experiments after a research gate.

Core question:

> What can actually be derived from the current repository, and what is the
> smallest implementation that can falsify the design?

## Shared operating loop

    EXTERNAL RESEARCH
            |
            v
    hypotheses / falsifiers
            |
            v
    LOCAL REPOSITORY RESEARCH
            |
            v
    evidence / prototype / counterexample
            |
            v
    EXTERNAL RECONCILIATION
            |
            v
    owner/governor gate
            |
            v
    bounded implementation
            |
            v
    proof

## Separation of responsibilities

| Concern | External | Local |
|---|---:|---:|
| Program mental model | primary | evidence |
| UX / visual semantics | primary | feasibility |
| Repository truth | consume | primary evidence |
| Source extraction | review | primary |
| Falsifiers | primary | execute |
| Prototype | review | primary |
| Architecture proposal | primary | evidence |
| Ω/BCP authority changes | neither | neither |
| Final owner decision | owner | owner |

## Required durable outputs

Each material round should leave research findings, evidence references,
falsifiers/results, unresolved questions, proposed changes and next gate.

## No independent promotion

Neither agent may declare Ω law, BCP state, workstream PROVEN, a source
authoritative, or a task assigned to another agent unless an existing governing
mechanism explicitly permits it.

## First implementation rule

If implementation is authorized, start with a read-only Program Map thin slice,
not a complete product.
