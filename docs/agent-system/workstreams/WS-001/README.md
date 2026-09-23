# WS-001 launch folder — Cooperative agent-context substrate

> **Classification: DERIVED — CURRENT** · Workstream WS-001 (ACTIVE) · Base tip `becb920`

## Mission (one line)

Repository-resident cooperative memory protocol so many agents/sessions/
conversations share one durable context without anyone loading all history.
(→ `../../WORKSTREAMS.md` WS-001 row — the registry, this folder is the launch surface.)

## Agents routed to this workstream

| agent | setup prompt | launch bootstrap | status |
|---|---|---|---|
| IMPL-01 | charter brief = transcript `../../transcripts/2026-09-23/CHAT-2026-09-23-cooperative-agent-context.md` (Phase 1 builder, this session — done) | HANDOFF-001 (closed) | ACTIVE → closing |
| IMPL-02 | `SETUP-PROMPT-IMPL-02.md` (saved verbatim from owner, 2026-09-23) | `LAUNCH-IMPL-02.md` (read this second) | ACTIVE — DIR-001 drill in flight on branch `impl-02/p1-01-dogfood` |

## Evidence chain (backward links — keep current, see D-DOG-01)

- Charter transcript: `../../transcripts/2026-09-23/CHAT-2026-09-23-cooperative-agent-context.md`
- Packets: `../../packets/PKT-001-cooperative-substrate-charter.md` (charter extraction, STANDS) → `../../packets/PKT-002-p1-01-dogfood-findings.md` (dogfood findings, pins, PKT-001 reader mapping)
- Handoffs: `../../handoffs/HANDOFF-001.md` (Phase 1 close) → `HANDOFF-002.md` (→TEST-01) → `HANDOFF-003.md` (→DOC-01) → `HANDOFF-004.md` (→COORD-01, verdict inputs)
- Directive: `../../directives/IMPL-02/DIRECTIVE-001-finish-p1-01.md` (OPEN → ACCEPTED via outbox ITEM-001)

## What is already done (do not redo)

- Phase 0 audit + Phase 1 minimal substrate landed: SYSTEM, ROSTER,
  WORKSTREAMS, CURRENT, CONTEXT-INDEX, CHATGPT-BOOT, ENVELOPE, FALSIFIERS,
  conventions, transcript + PKT-001, HANDOFF-001. (→ `../../CURRENT.md`)
- A launched agent continues at **Phase 2 (dogfood)** per HANDOFF-001 NEXT
  ACTION — it does not restart Phase 1. The setup prompt says "first
  implementation agent" because it was written before Phase 1 existed; the
  LAUNCH file corrects the starting line. Prompt particulars govern the
  *mission*; CURRENT + handoff govern the *starting position*.

## To launch (owner checklist)

1. Point the agent at `SETUP-PROMPT-IMPL-02.md` (mission particulars).
2. Point it at this folder `docs/agent-system/workstreams/WS-001/` (fresh context).
3. Tell it its id is `IMPL-02` and its bootstrap is `LAUNCH-IMPL-02.md`.
4. On first report, coordinator flips IMPL-02 RESERVED → ACTIVE.

## Output paths for agents on this workstream

- Transcripts → `../../transcripts/YYYY-MM-DD/` · packets → `../../packets/`
- Handoffs → `../../handoffs/` · session pointer → `../../sessions/`
- Scratch/drafts → `work/` (this folder; graduate via handoff, don't park law here)
- Coordination signals → `../../outbox/IMPL-02/` (inbox created on first incoming item)
