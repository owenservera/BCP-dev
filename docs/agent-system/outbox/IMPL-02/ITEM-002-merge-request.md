---
item_id: ITEM-002
kind: MERGE_REQUEST
from: IMPL-02
to: COORD-01
workstream: WS-001
date: 2026-09-24
repository_tip: 43c4400
branch: impl-02/p1-01-dogfood
status: OPEN
links:
  handoff: HANDOFF-004
  packets: [PKT-001, PKT-002]
  decisions: []
  transcript: none-required
  directive: DIR-001
---

# ITEM-002 — Coordinator rulings owed (final MERGE_REQUEST, DIR-001 drill)

## Summary

Drill complete on branch `impl-02/p1-01-dogfood`. P1-01 PARTIALLY PROVEN
(7 GREEN / 2 PARTIAL / 1 NOT-PROVEN; closers named). Requesting: ROSTER flip,
CURRENT/WORKSTREAMS link restoration, SYSTEM amendment review, branch merge,
directive flip, and two follow-on launches.

## Detail — requested coordinator edits (files I must not touch in flight)

1. **ROSTER.md:** IMPL-02 RESERVED → ACTIVE (reported in, DIR-001 executed);
   IMPL-01 ACTIVE → CLOSED (HANDOFF-001 integrated, session shut).
2. **CURRENT.md:** restore packet/handoff backward links (PKT-001, PKT-002,
   HANDOFF-004) in ACTIVE WORK / next-reads area (D-DOG-01 link rule).
3. **WORKSTREAMS.md P1-01 row:** add linked packets (PKT-001, PKT-002),
   linked handoffs (HANDOFF-001, HANDOFF-004), launch folder (already rowed),
   next action (merge branch → second-agent + ChatGPT closers).
4. **SYSTEM.md §13 amendment (on branch, review asked):** tip-marker roll-at-
   integration rule + D-DOG-01 link-maintenance rule. Accept, amend, or revert
   — flagged, not smuggled.
5. **Merge** `impl-02/p1-01-dogfood` → `main` after review.
6. **Directive:** flip DIR-001 OPEN → DONE (owner act; ACCEPT signaled here).
7. **Follow-on launches (closers):** second agent continuing from HANDOFF-004
   alone (closes MULTI-AGENT independence); P1-01 ChatGPT conversation on
   CHATGPT-BOOT + CURRENT only (closes CROSS-CHATGPT). Either flips P1-01 to
   PROVEN if green.

## Requested action

Rule 1–7, merge, and record the P1-01 verdict (PARTIALLY PROVEN) in the
P1-01 row. Full evidence: HANDOFF-004 + TEST-01/DOC-01 items + PKT-002.

## Context budget

This item + HANDOFF-004 + PKT-002. Drill chain on demand.
