# Steward Context Planning Inversion Audit
## 2026-09-27

> Status: COMPLETE / DURABLE OPERATING LESSON
> Classification: derived control-plane audit; not Ω law
> Purpose: preserve the root cause and regression defenses for the context mismatch discovered after CFA home setup.

## Executive finding

The Steward made an invalid phase transition:

`CFA HOMES READY → DOWNSTREAM PRODUCT CYCLE`

The intended transition is:

`CFA HOMES READY → CFA-OWNED DOMAIN ROADMAP → CFA TASK QUEUE → CROSS-CFA RECONCILIATION → SHARED FRONTIER → EXECUTION`

The repository had durable CFA identities, state and task machinery, but it had never encoded the missing **domain-roadmap formation stage**. Because that stage was absent, the Steward treated an existing destination-wide plan as if it were the next owner-assigned task.

## Root cause

### 1. Lifecycle gap

The bootstrap/home lifecycle ended with:

`FULL CONTEXT → SELF-DESIGN → OWNER ALIGNMENT → IDENTITY → HOME MAINTENANCE`

There was no explicit post-ratification transition defining how a standing CFA becomes the owner of its substantive roadmap.

### 2. Authority gap

The Steward had a rule for **where to reconcile work after agents produced it**, but not a strong rule for **who selects domain work before reconciliation**.

This allowed a delivery-plan label such as `Cycle 4 — CURRENT` to outrank an unformed CFA roadmap by accident.

### 3. Context bleed

The Steward's own `CURRENT-MISSION.md`, `STATE.md`, `OWNER-DIGEST.md` and `TASKS.md` were updated to a Cycle 4 proof task immediately after the home-upgrade wave. That made the wrong downstream slice look like current truth to later sessions.

### 4. Historical prompt leakage

Several older artifacts remained current-looking:

- home-upgrade launch queue;
- Steward legacy launch prompt;
- coding-start takeover/convergence prompts;
- prior coding-readiness result ending in `CODING STATUS: GO`;
- Build-and-Harvest plan with Cycle 4 labeled CURRENT;
- stale CFA birth sequence.

These did not create the root cause individually, but they increased the probability that a fresh session would select an inherited program stage instead of asking whether the CFA planning stage had happened.

## What was missing from the control plane

The system lacked an explicit invariant:

> **A standing CFA owns its domain responsibility and must first characterize and persist its own work frontier before the Steward selects a cross-CFA execution frontier.**

It also lacked a machine-discoverable artifact answering:

> What does this CFA believe it should work on now, and which existing program plans has it actually adopted?

## Repairs applied

1. Added `CFA-DOMAIN-ROADMAP-FORMATION-PROTOCOL-2026-09-27.md`.
2. Added `CFA-DOMAIN-ROADMAP-LAUNCH-QUEUE-2026-09-27.md`.
3. Routed the Steward current mission/state/owner digest/task queue through that stage.
4. Added the roadmap-formation task to all ten CFA `TASKS.md` files.
5. Explicitly made destination/P1/cycle plans candidate inputs until a CFA adopts them.
6. Retired the home-upgrade launch queue as an active selector.
7. Closed the stale CFA birth sequence as historical.
8. Quarantined the old full-stack implementation and coding-start launch surfaces as historical.
9. Paused Cycle 4 as a candidate rather than a current mandate.
10. Qualified the prior Coding Start Readiness `GO` as historical preparation evidence rather than current authorization.
11. Added the planning rule to the shared FSSP.
12. Added durable Steward lessons for home-readiness vs domain-readiness and CFA planning ownership.

## Regression defenses

A fresh Steward session must now fail its own reasoning test if it does any of the following:

- selects Cycle 4/5 directly from a destination plan while CFA roadmaps are absent;
- treats a `CURRENT` or `READY` label as a CFA mandate;
- launches implementation before CFA-owned roadmap formation and cross-CFA reconciliation;
- relaunches CFA birth/self-design after ratified identities exist;
- treats a completed home-upgrade receipt as proof of substantive domain planning;
- lets a prior `CODING STATUS: GO` substitute for current work selection.

The expected control flow is:

`READ CURRENT MAIN → READ CURRENT MISSION → CHECK CFA ROADMAP STAGE → FORM CFA ROADMAPS → VERIFY/COMPARE → RECONCILE → SELECT SHARED FRONTIER`

## Residual conditions

- CFA-05 still has the previously observed home-upgrade task/receipt mismatch; it is preserved and does not block independent roadmap formation.
- The ten new roadmaps do not yet exist; that is the current owner-launched task.
- Cycle 4 / Live Chrome remains valuable candidate work but cannot be promoted until the CFA roadmaps justify it.
- No Ω law, shared boundary or production implementation was changed by this repair.

## Evidence

Primary repository evidence and changes are recorded in:
- `CFA-DOMAIN-ROADMAP-FORMATION-PROTOCOL-2026-09-27.md`
- `CFA-DOMAIN-ROADMAP-LAUNCH-QUEUE-2026-09-27.md`
- `CURRENT-MISSION.md`
- `STATE.md`
- `TASKS.md`
- `CHATGPT-FRESH-SESSION-PROTOCOL.md`
- `LESSONS.md`
- all ten CFA `TASKS.md` files
- `RESULTS/STEWARD-20260927-CFA-PLANNING-CONTEXT-FIX.md`
