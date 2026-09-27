# CFA-05–10 Current Wave Router — 2026-09-27

> **CURRENT ROUTING AUTHORITY — DETERMINISTIC / RECEIPT-DRIVEN**
>
> This file is the authoritative human-agent execution router for the CFA-05–10 boundary program.
> It intentionally does **not** cache a mutable “ACTIVE/WAITING” state per CFA.
> The current turn is derived from committed Wave-3 completion receipts on current `main`.
> If any local `TASKS.md` disagrees with this file or with current `main`, current `main` plus this file wins.

## Current phase

**WAVE 3 — SEQUENTIAL PEER RECONCILIATION**

Wave 1: **DONE — 6/6 boundary baselines present.**  
Wave 2: **DONE — Steward reconciliation + Wave-3 queue persisted.**  
Wave 4 / Graph Gate: **CLOSED.**

## Deterministic turn rule

Required order:

**CFA-05 → CFA-06 → CFA-07 → CFA-08 → CFA-09 → CFA-10**

For each CFA, define its Wave-3 completion receipt as the exact home artifact:

- CFA-05: `SUBAGENTS/AGENCY-WORK-EXECUTION/WAVE-3-PEER-RECONCILIATION-ADDENDUM-2026-09-27.md`
- CFA-06: `SUBAGENTS/CAPABILITY-PROVIDER-REALIZATION/WAVE-3-PEER-RECONCILIATION-ADDENDUM-2026-09-27.md`
- CFA-07: `SUBAGENTS/COMPOSITION-PLUGIN-FORGE/WAVE-3-PEER-RECONCILIATION-ADDENDUM-2026-09-27.md`
- CFA-08: `SUBAGENTS/EXPERIENCE-INTERACTION-SURFACES/WAVE-3-PEER-RECONCILIATION-ADDENDUM-2026-09-27.md`
- CFA-09: `SUBAGENTS/EVOLUTION-COMPATIBILITY-SELF-MAINTENANCE/WAVE-3-PEER-RECONCILIATION-ADDENDUM-2026-09-27.md`
- CFA-10: `SUBAGENTS/RUNTIME-CONSTITUTION-CORE-SUBSTRATE/WAVE-3-PEER-RECONCILIATION-ADDENDUM-2026-09-27.md`

**Current turn = the first CFA in that order whose required Wave-3 receipt is absent from current `main`.**

Therefore:
- if a CFA's own receipt exists, its Wave-3 turn is **DONE**;
- if its own receipt is absent and every predecessor receipt exists, it is **EXECUTE NOW**;
- if a predecessor receipt is absent, it is **WAITING FOR PREDECESSOR**;
- no cached ACTIVE/WAITING text may override this calculation.

## Bare “Next” contract

When the human owner sends **one** `Next` to a CFA:

1. Verify current `main`.
2. Read this router.
3. Recompute the current turn from the six receipt paths above.
4. If this CFA is the first missing receipt, **EXECUTE ITS WAVE-3 ROW NOW**.
5. If its own receipt already exists, report **DONE** and do not redo work.
6. If a predecessor receipt is missing, report **WAITING FOR <predecessor>** and stop.
7. Never resume an older M1/M2/FUTURE task merely because it is still marked READY.
8. Never require a second `Next` merely because routing text was stale.

## Wave-3 execution source

Use only:

`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/WAVE-2-PEER-RECONCILIATION-QUEUE-2026-09-27.md`

The CFA executes only its own row, then:
- writes its own Wave-3 addendum;
- commits it;
- reports exact commit SHA;
- stops.

The completion receipt itself advances eligibility for the next CFA. No Steward re-routing commit is required between CFA turns.

## Important distinction

This protocol makes **eligibility receipt-driven**, not time-driven and not message-driven.

A stale local task state can never block an otherwise eligible CFA after it verifies current `main`.

A peer completion receipt is evidence of completed work, not a grant of semantic authority and not activation of a shared boundary.

## Global hard stops

Until Wave 4 explicitly opens the Graph Gate:

- no Graph Kernel / Source-Code Graph attachment;
- no shared-boundary activation;
- no Ω-law amendment;
- no production implementation justified solely by this reconciliation;
- no semantic ownership transfer.
