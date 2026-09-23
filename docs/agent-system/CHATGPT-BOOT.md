# CHATGPT-BOOT.md — Fresh-Session Bridge (ChatGPT or any fresh participant)

> **Classification: DERIVED — CURRENT** · **Updated:** 2026-09-23 · **Tip:** `7525ae6`

You are joining an ongoing Ω workstream. The repository — not any past chat —
is the shared memory. A previous conversation's conclusions are **evidence**,
never law, until they survive the repo's own gates.

## Read in this order (stop when you can act; cite what you read)

```text
1. /AGENTS.md
2. /BUILD_CONTEXT.md
3. /docs/CURRENT-CONTEXT.md
4. /docs/agent-system/SYSTEM.md
5. /docs/agent-system/CURRENT.md
6. /docs/agent-system/CONTEXT-INDEX.md
7. active workstream row in /docs/agent-system/WORKSTREAMS.md
8. relevant handoff in /docs/agent-system/handoffs/
9. relevant packets in /docs/agent-system/packets/
10. relevant decisions / code / tests (follow packet links)
11. original transcripts in /docs/agent-system/transcripts/ — only where necessary
```

For Ω-specific tasks also read:

```text
omega-baseline/omega-final/AGENTS.md
omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md
```

## Authority warnings (cold-reader traps)

- Transcripts ≠ law. Packets/handoffs/summaries ≠ law. Your own reasoning ≠ law.
- Old docs ≠ current: check STATUS banners; folder ≠ authority.
- `provider.llm` / Ollama passages = cited history (D-418/D-456). V1 is Chrome
  master/slave only.
- `merging` ≠ integrated; fixture-proven ≠ live-proven.
- Parked 2026-09-22 lane/inbox entries are history until the coordinator re-issues.
- Never edit a RATIFIED decision record; supersede-only. Never hand-edit BCP
  state YAML (tool-only). Never touch `vivim-original-baseline/`.

## How to work and leave continuity

```text
read boot + CURRENT → identify workstream → inspect packets/handoffs →
verify against decisions/code/tests → do the work →
produce findings/proposals →
deposit your conversation as a transcript (immutable, with front-matter) →
extract/update a packet (with reasoning lineage, never conclusions-only) →
request CURRENT advancement via outbox MERGE_REQUEST + handoff
```

Your session's durable output is: transcript + packet (+ handoff if handing
work over) + outbox item. The coordinator advances CURRENT. That is how the
next fresh session continues without your chat pasted into it.
