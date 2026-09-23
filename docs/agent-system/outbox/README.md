# outbox/ — Per-Agent Outgoing Coordination Signals

> **Classification: convention (DERIVED — CURRENT)** · Envelope spec: `../ENVELOPE.md`

Dirs `outbox/<agent-id>/` are created on registration. Agents propose
(CURRENT edits, routing requests, reviews) via MERGE_REQUEST items here; the
coordinator applies. Never edit canonical CURRENT/WORKSTREAMS/ROSTER directly
in concurrent flight.
