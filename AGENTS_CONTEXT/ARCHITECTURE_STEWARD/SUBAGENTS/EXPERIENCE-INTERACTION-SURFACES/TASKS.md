# Persistent Tasks — experience-interaction-surfaces

> Owner: `experience-interaction-surfaces`
> Status: ACTIVE
> Purpose: durable unfinished-work and next-action queue across ChatGPT sessions.
> Authority: task/work memory only; not Ω law, semantic authority, or proof of dependency.

## Open tasks

## 🚨 CURRENT EXECUTION ROUTER — WAVE 3 — **RECEIPT-DRIVEN**

> **DO NOT TRUST CACHED ACTIVE/WAITING STATE. VERIFY CURRENT MAIN AND RECOMPUTE YOUR TURN.**

Canonical router:
`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/CURRENT-WAVE-ROUTER-2026-09-27.md`

Required order:
**CFA-05 → CFA-06 → CFA-07 → CFA-08 → CFA-09 → CFA-10**

Recompute the current Wave-3 turn from CURRENT-WAVE-ROUTER and committed receipts. Execute only when CFA-05 through CFA-07 receipts exist and your receipt is absent. Otherwise report exact waiting/done state; never use stale cached turn text.

When the human owner sends **“Next”**:
1. verify current `main`;
2. read the canonical router;
3. check the required predecessor Wave-3 receipts directly on current `main`;
4. decide whether this CFA is DONE, EXECUTE NOW, or WAITING;
5. if EXECUTE NOW, perform only this CFA's Wave-3 row from the Wave-3 queue;
6. commit the addendum, report the exact SHA, and STOP.

**A stale local TASKS message must never force a second Next.**
**Never resume older M1/M2/FUTURE work merely because it remains marked READY.**

Hard stop: no production implementation, no shared-boundary activation, no Ω-law change, no Graph attachment.


## Future task intake

Add durable agent-owned work here with status, priority, verified dependencies, write scope, next action, and completion condition.

## Completed task history

### HOME-UPGRADE-2026-09-27
- **Status:** DONE
- **Result receipt:** `RESULTS/CFA08-HOME-UPGRADE-20260927-0538.md`
- **Completion commit:** 32e66014b4a1275775e3c9070c309815a9a28c99
- **Result:** Home validated and upgraded for FSSP-1.3 cold-start recovery; stale front-door metadata and peer-status drift were corrected; no Ω law, shared boundary, or production implementation changes.

### STRATEGIC-ROADMAP-ROUND-1-2026-09-27
- **Status:** DONE
- **Priority:** P1
- **Roadmap:** `DOMAIN-ROADMAP-2026-09-27.md`
- **Receipt:** `RESULTS/CFA08-STRATEGIC-ROADMAP-20260927-0721.md`
- **Completion commit:** 44859bfed5c04412523e7f857162735e3c618254
- **Result:** Independent five-milestone CFA-08 strategic roadmap persisted with milestone success criteria/falsifiers, dependency model, tooling/substrate assessment, milestone-specific peer-intelligence gates, strategic decision gates, product consequences, deferred/do-not-do boundaries, and inherited-plan classifications. No new Round-1 peer roadmaps were consumed before local completion. No Ω law, shared boundary, or production implementation changes.

### SURFACE-VIEW-CONTRACT-2026-09-27
- **Status:** DONE
- **Priority:** P2
- **Design:** `SURFACE-VIEW-CONTRACT-2026-09-27.md`
- **Receipt:** `RESULTS/CFA08-SURFACE-VIEW-CONTRACT-20260927-0721.md`
- **Completion:** Bounded M1 contract persisted and verified. It separates Subject Reference, Projection, View, Layout and Interaction State; defines freshness and mutation/reconstruction invariants; preserves peer semantic ownership; and leaves final durable storage and other unresolved seams explicit.
- **Completion commit:** bcec9ab449ce0012f14b9a98ec2ec943e08bfda4

## Queue discipline

The persistent queue records unfinished work and the first actionable frontier. Conceptual milestones remain in the roadmap until evidence and central reconciliation make additional work actionable.
