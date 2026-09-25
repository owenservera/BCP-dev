# Agent Commons Operations and Tests

## Required protocol invariants

### Identity

- forged signature is rejected;
- wrong key for identity is rejected;
- key rotation preserves stable agent identity.

### Integrity

- broken prev_hash is detected;
- stream sequence gaps are detectable;
- mutation is detectable.

### Replay

Given the same accepted events, the same projection is reconstructed.

### Idempotency

Delivering the same event repeatedly produces the same logical state as delivering it once.

### Concurrency

Two agents can append concurrently without requiring a shared mutable event file.

### Ordering

Tests must prove that Git commit order is never treated as global message order.

### Compaction

Summaries retain source identifiers and raw source messages remain retrievable.

### Privacy

T1 cooperative privacy is never represented as cryptographic secrecy.

### Authority

No projection may transform:

- HYPOTHESIS into fact;
- PROPOSAL into decision;
- ACK into agreement;
- capability into authority.

## Operational metrics

Derived CommonsMetrics may include:

- messages sent/received;
- inbox depth;
- live delivery count;
- digest ratio;
- compaction ratio;
- delivery retry count;
- dead letters;
- duplicate deliveries;
- handoff count;
- handoff latency;
- active rooms.

Metrics are operational observability, not agent rankings.

## Read-only human projection

A rendered chat.md or equivalent is a read-only projection. It is not a source of truth.

## Failure diagnostics

Every rejection should expose event_id, agent_id, session_id, validation stage, reason, event hash, schema version, and transport context.

## Suggested test layers

1. schema tests;
2. pure fold/replay tests;
3. identity/signature tests;
4. transport contract tests against an in-memory transport;
5. Git transport tests;
6. concurrency/idempotency fuzz tests.

## Worked example: DECISION_CANDIDATE promotion

A Commons message must not become durable architecture merely because it was posted or acknowledged.

Example:

```text
message.posted
  kind: DECISION_CANDIDATE
  message_id: m-123
  subject: K0 boundary proposal
  references: [ ... ]
  named stakeholders: Runtime Constitution, Authority, and Architecture Steward

stakeholder disposition
  Runtime Constitution → explicit non-objection
  Authority → explicit non-objection
  Architecture Steward → objection raised
  objection → resolved in the applicable authority-owned record

promotion
  → update the appropriate durable authority artifact
  → cite message_id m-123 and the supporting evidence
  → record the disposition/resolution lineage
```

For a K0 boundary matter, the durable destination might be the applicable Ω decision/invariant record such as `omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md`; for a Steward-owned architectural reconciliation, it may instead be the appropriate Steward change/reconciliation record. The destination is determined by semantic and authority ownership, not by Commons.

Commons retains the communication history. The authority-owned artifact carries the canonical decision.
