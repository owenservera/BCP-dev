# CFA-04 — Implementation Queue

> Status: PROVISIONAL / EVIDENCE-GATED
> Updated: 2026-09-26

This queue records implementation work only when the semantic boundary is sufficiently understood. A queue entry is not an authorization to implement.

## Gate

A candidate may enter the queue only when:

- semantic effect is explicit;
- ownership boundaries are explicit enough;
- authority basis is understood;
- current implementation seam is identified;
- runtime contract is identified;
- evidence/falsifier plan exists;
- blocking unknowns are visible.

## Current queue

### I-04-001 — Prove Authority Trace read corridor

State: RESEARCH-FIRST
Priority: HIGH

Target corridor:
principal
→ consent / standing / delegation
→ capability
→ invocation
→ runtime enforcement
→ evidence

Required:
- use existing read surfaces;
- no new authority database;
- no mutation;
- capture unknowns and conflicts;
- verify one positive and one negative case.

Exit evidence:
- one reconstructable authorized trace;
- one reconstructable refusal trace;
- separate semantic-resolution and runtime-enforcement evidence.

### I-04-002 — Define minimum Work authority reference

State: BLOCKED ON PEER DIALOGUE
Peer: CFA-05

Question:
What minimum reference must Work/Attempt carry so a consequential retry/resume can re-check live authority without turning Work into an authority store?

### I-04-003 — Define Capability → Authority effect contract

State: BLOCKED ON PEER DIALOGUE
Peer: CFA-06

Question:
What stable effect/risk information must Capability provide so Authority can evaluate permission without owning capability semantics?

### I-04-004 — Define authority/change handoff

State: BLOCKED ON PEER DIALOGUE
Peer: CFA-09

Question:
Which consequential changes require explicit authorization, what evidence must cite that authorization, and what remains owned by the Evolution lifecycle?

## Deferred until evidence exists

- generalized authorization engine;
- new authority database;
- runtime authority cache;
- automated policy authoring;
- autonomous law amendment;
- automatic authority inference from LLM output;
- broad authority ontology generation;
- provider-specific permission abstractions.

## Queue discipline

Complete one real corridor before generalizing.

A successful implementation experiment does not by itself ratify the semantic boundary.
