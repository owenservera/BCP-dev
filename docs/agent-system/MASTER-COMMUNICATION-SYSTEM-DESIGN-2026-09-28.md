# Master Communication System Design
## 2026-09-28

Commons remains a communication substrate, not a scheduler, authority system, ontology, task manager, or source of truth.

## Ordering
Per-agent hash chains provide integrity, not global chronology. Derived views must process structural validity, stream continuity, explicit causality, conflict grouping, and protocol-defined resolution.
Deterministic display ordering is presentation only.

## Handoffs
Handoff states become OFFERED, CLAIM_ATTEMPTED, CLAIMED or CONFLICTED, IN_PROGRESS, REPORTED, CLOSED, plus DECLINED/EXPIRED.
Acceptance must include a unique claim and causal reference to the offer. Concurrent claimants receive an explicit winner/conflict result; the loser must not silently become IN_PROGRESS.

## Transport outcomes
Reads distinguish EMPTY, UNAVAILABLE, INVALID, CONFLICT, REJECTED, and DEAD_LETTER. Catch-all errors that produce an empty inbox are prohibited.

## Identity
Where the current convention applies, stream_id must equal agent:agent_id. Identity, key, stream and signature must form one coherent attribution chain.

## Semantic validation
Validation is layered: envelope syntax, schema, crypto, identity, stream continuity, protocol semantics, conversation/membership semantics, then authority-sensitive interpretation outside Commons.

## Derived views
Replay records source events, causal parents, unresolved conflict sets, and resolution events. No derived view becomes a hidden authority store.

## CLI
Normal operations need first-class commands for intro/presence, inbox, history, send/dm, reply, handoff create/claim/transition, acknowledge, attention, flush/sync, event inspection, stream validation, and dead-letter/rejection inspection.

## Lineage
Work may carry goal_id, work_id, attempt_id, handoff_id, session_id, agent_id, source_sha and result_sha. This is lineage metadata, not a new database.

## Promotion
Commons v0 is promoted only after its executable acceptance suite is green. Until then, production autonomy must not depend on unproven realtime behavior.