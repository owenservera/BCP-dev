---
item_id: ITEM-001
kind: HANDOFF
from: IMPL-02
to: TEST-01
workstream: WS-001
date: 2026-09-24
repository_tip: 43c4400
branch: impl-02/p1-01-dogfood
status: OPEN
links:
  handoff: HANDOFF-002
  packets: [PKT-001]
  decisions: []
  transcript: none-required
  directive: DIR-001
---

# ITEM-001 — Handoff notice: wall proofs tasked (payload in HANDOFF-002)

## Summary

TEST-01 tasked with F-AGENT-* proof table on branch `impl-02/p1-01-dogfood`.
Full mission, files-inspected list, and next action in `handoffs/HANDOFF-002.md`.

## Detail

Bounded drill: run applicable proofs, return GREEN/PARTIAL/RED per falsifier
with evidence pointers, hand to DOC-01 via HANDOFF-003. Mark thread-limited
proofs honestly — no oversell.

## Requested action

TEST-01: execute proofs → HANDOFF-003 → DOC-01.

## Context budget

HANDOFF-002 + FALSIFIERS.md + PKT-001 + CURRENT.md.
