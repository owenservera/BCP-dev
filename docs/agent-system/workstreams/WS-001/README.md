# WS-001 launch folder — Cooperative agent-context substrate

> **Classification: DERIVED — CURRENT** · Workstream WS-001 (ACTIVE) · Base tip `becb920`

## Mission (one line)

Repository-resident cooperative memory protocol so many agents/sessions/
conversations share one durable context without anyone loading all history.
(→ `../../WORKSTREAMS.md` WS-001 row — the registry, this folder is the launch surface.)

## Agents routed to this workstream

| agent | setup prompt | launch bootstrap | status |
|---|---|---|---|
| IMPL-01 | charter brief = transcript `../../transcripts/2026-09-23/CHAT-2026-09-23-cooperative-agent-context.md` (Phase 1 builder, completed) | HANDOFF-001 (closed) | RETIRED — Phase 1 delivered |
| IMPL-02 | `SETUP-PROMPT-IMPL-02.md` (saved verbatim from owner, 2026-09-23) | `LAUNCH-IMPL-02.md` (read this second) | ACTIVE — DIR-001 complete; P1-01 remains PARTIALLY PROVEN on two independent-continuity closers |
| TEST-01 | — | HANDOFF-002 from IMPL-02 drill | STANDBY — proof table delivered |
| DOC-01 | — | HANDOFF-003 from IMPL-02 drill | STANDBY — packet QA delivered |

## Evidence chain (backward links — keep current, see D-DOG-01)

- Charter transcript: `../../transcripts/2026-09-23/CHAT-2026-09-23-cooperative-agent-context.md`
- Packets: `../../packets/PKT-001-cooperative-substrate-charter.md` (charter extraction, STANDS) → `../../packets/PKT-002-p1-01-dogfood-findings.md` (dogfood findings, pins, PKT-001 reader mapping)
- Handoffs: `../../handoffs/HANDOFF-001.md` (Phase 1 close) → `../../handoffs/HANDOFF-002.md` (→TEST-01) → `../../handoffs/HANDOFF-003.md` (→DOC-01) → `../../handoffs/HANDOFF-004.md` (→COORD-01, verdict inputs)
- Proof evidence: `../../outbox/TEST-01/ITEM-001-proof-table.md` + `../../outbox/DOC-01/ITEM-001-packet-qa.md`
- DIR-002 closer apparatus: `../../packets/PKT-003-p1-01-closer-apparatus.md` + `../../handoffs/HANDOFF-005.md` + `CROSS-CHATGPT-CLOSER.md` + `../../handoffs/HANDOFF-006.md`
- Coordinator integration: `../../outbox/IMPL-02/ITEM-002-merge-request.md` + `../../outbox/IMPL-02/ITEM-003-merge-request.md`
- Directive: `../../directives/IMPL-02/DIRECTIVE-001-finish-p1-01.md` (DONE) + `../../directives/IMPL-02/DIRECTIVE-002-close-p1-01-proof-gaps.md` (DONE)

## What is already done (do not redo)

- Phase 0 audit + Phase 1 minimal substrate landed: SYSTEM, ROSTER,
  WORKSTREAMS, CURRENT, CONTEXT-INDEX, CHATGPT-BOOT, ENVELOPE, FALSIFIERS,
  conventions, transcript + PKT-001, HANDOFF-001. (→ `../../CURRENT.md`)
- DIR-001 dogfood/wall-test drill is complete and merged. The durable artifact
  chain proved seven falsifiers GREEN, left two PARTIAL, and one NOT-PROVEN.
- D-DOG-01 was exposed and fixed at coordinator integration: canonical files
  must preserve/refresh packet and handoff backward links.
- A launched agent continues from the proven substrate; it does not restart
  Phase 1. Mission particulars remain in the setup prompt, while CURRENT +
  handoffs govern the actual starting position.

## Remaining proof closers

1. **MULTI-AGENT independence:** a genuinely independent second agent/thread must continue from HANDOFF-004 alone.
2. **CROSS-CHATGPT continuity:** a fresh P1-01 ChatGPT conversation must boot from `CHATGPT-BOOT.md` + `CURRENT.md` only.

Until both are proven, P1-01 remains PARTIALLY PROVEN.

## Current launch instructions

- **MULTI-AGENT:** reserved `IMPL-03`; launch with `HANDOFF-005.md` + repository only, exactly as its seal specifies.
- **CROSS-CHATGPT:** owner opens a genuinely fresh ChatGPT conversation and follows `CROSS-CHATGPT-CLOSER.md` §§0–2 exactly.

## Output paths for agents on this workstream

- Transcripts → `../../transcripts/YYYY-MM-DD/` · packets → `../../packets/`
- Handoffs → `../../handoffs/` · session pointer → `../../sessions/`
- Scratch/drafts → `work/` (this folder; graduate via handoff, don't park law here)
- Coordination signals → `../../outbox/<agent-id>/`
