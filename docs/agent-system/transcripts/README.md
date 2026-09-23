# transcripts/ — Immutable External Conversation Store

> **Classification: DERIVED — CURRENT** (convention; individual transcripts are TRANSCRIPT/HISTORICAL)

Layout: `transcripts/YYYY-MM-DD/CHAT-<timestamp>-<slug>.md`. Never rewrite or
delete a stored transcript. Status changes = new annotations, not edits.

## Mandatory front-matter

```yaml
session_id: CHAT-2026-09-23-cooperative-agent-context
source: chatgpt | local-agent | human
date: 2026-09-23
workstreams: [WS-001]
repository_tip: becb920
participants: [owner, chatgpt]
status: ingested | superseded | historical
```

Body preserves the conversation faithfully (full text or faithful excerpt with
explicit gaps marked). Extraction lives in `packets/`, never here.
