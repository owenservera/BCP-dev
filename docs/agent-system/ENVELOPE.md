# ENVELOPE.md — Inbox/Outbox Machine-Readable Envelope v1

> **Classification: DERIVED — CURRENT** · **Updated:** 2026-09-23

Per-agent dirs: `inbox/<agent-id>/` and `outbox/<agent-id>/` (created on
demand; coordinator registers the id in ROSTER.md first). File convention:
`ITEM-<nnn>-<kind-lower>-<slug>.md` (e.g. `outbox/IMPL-01/ITEM-001-merge_request-current-advance.md`).

## Envelope (YAML front-matter, mandatory)

```yaml
item_id: ITEM-001
kind: REQUEST | QUESTION | HANDOFF | EVIDENCE | CONFLICT | REVIEW | MERGE_REQUEST
from: IMPL-01
to: COORD-01
workstream: WS-001
date: 2026-09-23
repository_tip: becb920
status: OPEN | ACCEPTED | DECLINED | SUPERSEDED
links:
  handoff: HANDOFF-001
  packets: [PKT-001]
  decisions: [D-430]
  transcript: CHAT-2026-09-23-cooperative-agent-context
```

Body sections: `## Summary` (≤10 lines), `## Detail`, `## Requested action`,
`## Context budget` (what the reader must load to act).

## Kind notes

- HANDOFF items duplicate only the handoff's header + link; the handoff file
  is the payload.
- CONFLICT items must present CLAIM A vs CLAIM B with sources + statuses and
  name the governing source without deleting history.
- MERGE_REQUEST items propose exact CURRENT/WORKSTREAMS/ROSTER edits; only the
  coordinator applies them.
- Items are never edited after ACCEPTED/DECLINED — follow-ups are new items
  linking back.
