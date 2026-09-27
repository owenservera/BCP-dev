# CFA-05–10 Current Wave Router — 2026-09-27

> **CURRENT ROUTING AUTHORITY**
> 
> This file is the authoritative human-agent execution router for the CFA-05–10 boundary program.
> Local `TASKS.md` routers must be consistent with this file.
> If a local TASKS router conflicts with this file, **this file wins** after the agent verifies current `main`.

## Current phase

**WAVE 3 — SEQUENTIAL PEER RECONCILIATION**

Wave 1: **DONE — 6/6 boundary baselines present.**  
Wave 2: **DONE — Steward reconciliation + peer queue persisted.**  
Wave 4 / Graph Gate: **CLOSED.**

## Current turn

**CFA-06 is ACTIVE NOW.**

CFA-05: **DONE** — Wave-3 addendum persisted at commit `a4684afb2b7cb982ba2fc4de903319345ee1506e`.

CFA-06: **EXECUTE NOW**.

CFA-07: WAIT FOR CFA-06.  
CFA-08: WAIT FOR CFA-07.  
CFA-09: WAIT FOR CFA-08.  
CFA-10: WAIT FOR CFA-09.

## Bare “Next” contract

When the human owner sends **Next** to a CFA:

1. Verify current `main`.
2. Read this router.
3. If the CFA is **ACTIVE NOW**, execute only its Wave-3 row from:
   `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/WAVE-2-PEER-RECONCILIATION-QUEUE-2026-09-27.md`
4. If the CFA is not active, report its exact waiting state and STOP.
5. A completed predecessor does not require Steward intervention between sequential CFA turns; the human router advances to the next CFA after the predecessor reports its exact commit SHA.
6. Commit the result, report the exact SHA, and STOP.

## Required Wave-3 sequence

**CFA-05 → CFA-06 → CFA-07 → CFA-08 → CFA-09 → CFA-10**

## Current CFA-06 instruction

Execute only:

- Q06-05 — Work attribution / external-effect evidence;
- Q06-02 — durable Account/Session/Realization/Resource joins;
- Q06-04 — routing/Authority boundary;
- Q06-07 — Capability/Composition membership and replacement;
- Q06-09 — provider healing / generic Evolution;
- Q06-10 — structural capability/token facts crossing into K0.

Required result:
- one Wave-3 addendum;
- each seam classified `RECONCILED | UNKNOWN | CONFLICTED | DEFERRED`;
- explicit peer evidence;
- exact handoff proposals;
- falsifiers;
- routing != authorization preserved.

Hard stop:
- no provider-registry rebuild;
- no second data store;
- no runtime implementation;
- no shared-boundary activation;
- no Ω-law change;
- no Graph attachment.

## Completion advancement

When CFA-06 completes, the human router sends **Next → CFA-07**.

The same pattern continues sequentially through CFA-10.

After CFA-10 completes, send **Next → Architecture Steward** for Wave 4 final audit.

## Lineage protection

An agent must not infer current phase from an older local `TASKS.md`, stale session text, or a predecessor commit that predates this router.

The agent must use **current main + this file** as the phase gate.

A stale router is evidence of lineage drift and must be corrected, not obeyed.

## Global hard stops

Until Wave 4 explicitly opens the Graph Gate:

- no Graph Kernel / Source-Code Graph attachment;
- no shared-boundary activation;
- no Ω-law amendment;
- no production implementation justified solely by this reconciliation;
- no semantic ownership transfer.
