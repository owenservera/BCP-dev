---
item_id: ITEM-001
kind: EVIDENCE
from: TEST-01
to: COORD-01
workstream: WS-001
date: 2026-09-24
repository_tip: 43c4400
branch: impl-02/p1-01-dogfood
status: OPEN
links:
  handoff: HANDOFF-003
  packets: [PKT-001]
  decisions: []
  transcript: none-required
  directive: DIR-001
---

# ITEM-001 — F-AGENT-* proof table (evidence, drill identity TEST-01)

## Summary

7 GREEN, 2 PARTIAL, 1 NOT-PROVEN across the 10 falsifiers. Every result below
names its mechanical evidence. Thread-limitation caveats explicit; nothing oversold.

## Detail — results

- **F-AGENT-COLD-START — GREEN.** Post-pull orientation (new portfolio +
  rewritten CURRENT/WORKSTREAMS + directive channel) completed via boot path
  alone: all 8 boot files resolve (`Test-Path` 8/8 True), CURRENT 92 lines
  (budget holds). No historical reconstruction needed.
- **F-AGENT-HANDOFF — GREEN (artifact-complete).** HANDOFF-002 carried mission,
  files-inspected, facts, next action; continuation required zero hidden
  context — every cited file resolved. Independence caveat folded into
  MULTI-AGENT below, not double-counted.
- **F-AGENT-TRANSCRIPT-INGEST — GREEN.** Rewritten CURRENT cites no raw
  transcript (grep: only the word in "conventions" + "≠ law" lines); charter
  queryable via PKT-001 with source ranges. Transcript never became CURRENT.
- **F-AGENT-PROVENANCE — GREEN with pin-gap closed.** PKT-001 F1–F8 rows all
  carry source kind/id/location; all spot-checked paths resolve
  (`CURRENT-INVARIANTS.md`, `BUILD-DECISIONS.md`, `taxonomy.yaml`,
  `session.ts`, `devvault.ts`, `doctruth.ts`, `genome.ts`, `contracts/src/agent.ts`
  — 6/6 True). Gap: no content hashes recorded ("where practical"). Closed by
  pins in PKT-002: transcript `72E41969…477C7`, PKT-001 `6D9F2F65…A1528`,
  DIR-001 `5E22E44F…9AA` (SHA256, taken 2026-09-24 on branch).
- **F-AGENT-FRESHNESS — GREEN.** `git log --follow`: PKT-001 and charter
  transcript each have exactly one commit (creation) — never rewritten.
  Owner's CURRENT/WORKSTREAMS rewrite is coordinator prerogative on canonical
  files, not a silent packet edit.
- **F-AGENT-CONFLICT — GREEN (two real cases).** C1: charter "first agent,
  Phase 1 unbuilt" vs landed Phase 1 → LAUNCH-IMPL-02 starting-line correction
  retains both (verified in-file). C2: WS-002 `vivim.self` vs WS-004 fold →
  CURRENT lines 50–51 + WORKSTREAMS P1-04 lineage line 42 retain both.
- **F-AGENT-CONTEXT-COMPACTION — PARTIAL.** CURRENT 92 lines with forward
  links; chain transcript→PKT-001 intact. But the owner rewrite dropped the
  packet/handoff backward links: neither CURRENT nor WORKSTREAMS P1-01 row
  names PKT-001/HANDOFF-001, and the WS-001 card has no evidence-chain
  section — chain reachable only by directory listing. Defect D-DOG-01 with
  fix below; GREEN once MERGE_REQUEST accepted.
- **F-AGENT-MULTI-AGENT — PARTIAL (artifact-complete, independence unproven).**
  Three identities exchanged solely via HANDOFF-002/003, inbox/outbox
  envelopes, packets — zero direct-conversation coordination, chain verified
  file-by-file. But all three ran on one execution thread: genuine
  independence needs ≥2 threads. What would close it: owner launches a second
  agent that continues from HANDOFF-004 alone.
- **F-AGENT-CROSS-CHATGPT — NOT PROVEN (exact failure).** Requires an
  independent ChatGPT session starting from CHATGPT-BOOT + CURRENT only. A
  local single thread cannot simulate ChatGPT-independence — attempting it
  would be theater, so it was not attempted. Closest proxy (cold-start drill)
  proves only the local half. Closer: open the P1-01 ChatGPT conversation
  (portfolio §14) with boot + CURRENT and verify orientation without pasting
  the old chat.
- **F-AGENT-CURRENT-TRUTH — GREEN (6-claim drill).** Host ≤1500 LOC →
  AUTHORITATIVE (B5+gate); Chrome-only v1 → AUTHORITATIVE (D-418/D-456);
  "WS-002 is next" → SUPERSEDED proposal (folded to WS-004); "zero active
  leases" → CURRENT (tool-verified state); "Ollama v1 substrate" →
  HISTORICAL-rejected (D-418/D-456); "PKT-001 F4" → DERIVED-CURRENT. All six
  ranked per SYSTEM §6 with governing authority named.

## Requested action

DOC-01: packet QA (PKT-001 vs rewritten CURRENT/WORKSTREAMS/portfolio) →
HANDOFF-004 → COORD-01. Proof table above is TEST-01's signed result; do not
re-run without cause, cite it.

## Context budget

This item + HANDOFF-003. PKT-002 (forthcoming) synthesizes.
