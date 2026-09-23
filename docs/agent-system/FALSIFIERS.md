# FALSIFIERS.md — F-AGENT-* Wall Tests

> **Classification: DERIVED — CURRENT** · **Updated:** 2026-09-23
> Shape follows D-426 falsifier-first discipline (named clauses, RED before
> green); these falsifiers govern the *coordination protocol*, not Ω boot
> security, so they live here rather than in `tooling/gates/test/`.

## F-AGENT-COLD-START

A fresh agent given only CHATGPT-BOOT + CURRENT + one handoff + one packet +
the repo orients without historical reconstruction. **RED:** agent asks for
old chats or rebuilds settled context. **GREEN:** it names the workstream,
mission, authority chain, and next action with citations.

## F-AGENT-HANDOFF

Agent B continues Agent A's task from the handoff alone (+ linked reads).
**RED:** B re-inspects A's reasoning chain or redoes settled work. **GREEN:**
B's first action matches the handoff's NEXT ACTION with cited deltas.

## F-AGENT-TRANSCRIPT-INGEST

A full external transcript becomes queryable context without becoming law.
**RED:** transcript quoted as authority, or its claims land in CURRENT
unlinked. **GREEN:** packet exists with source ranges + per-claim provenance
and FRESHNESS; CURRENT cites the packet, never the raw chat.

## F-AGENT-CONTEXT-COMPACTION

A large transcript corpus compacts into bounded CURRENT while preserving
expansion references. **RED:** CURRENT grows past its budget or drops
pointers. **GREEN:** CURRENT stays ≤ budget with stable backward links at
every layer (transcript → packet → digest → CURRENT).

## F-AGENT-CONFLICT

Two contradictory packets are represented honestly; the authoritative source
wins without deleting history. **RED:** silent merge or history deletion.
**GREEN:** CLAIM A vs CLAIM B record with sources, statuses, and governing
resolution retained.

## F-AGENT-PROVENANCE

Every extracted claim is traceable (claim, source kind, source id, source
location, hash where practical, extraction session, derived packet, current
status). **RED:** any claim without a resolvable source. **GREEN:** doctruth-
compatible audit passes over the packet set.

## F-AGENT-FRESHNESS

Stale/superseded/conflicted content is marked, never silently rewritten.
**RED:** in-place rewrite of a packet, or two CURRENT versions disagreeing
without a version chain. **GREEN:** `-v2` succession with SUPERSEDED banners
and forward links.

## F-AGENT-MULTI-AGENT

Three agents with distinct ids exchange work solely through inbox/outbox +
handoffs for a bounded task with no direct conversation. **RED:** coordination
happens off-repo or two agents edit one canonical file concurrently.
**GREEN:** branches/handoffs/envelopes chain cleanly to coordinator integration.

## F-AGENT-CROSS-CHATGPT

ChatGPT session 2, starting fresh with only CHATGPT-BOOT + CURRENT (+ packets),
continues session 1's workstream without session 1's chat pasted in.
**RED:** session 2 needs the old transcript in-context or misstates settled
law. **GREEN:** session 2 acts correctly citing packets/CURRENT, opening the
raw transcript only for a named section.

## F-AGENT-CURRENT-TRUTH

A fresh agent distinguishes current law from historical conversation material.
**RED:** it cites a transcript, packet, or archived doc as governing over a
ratified decision / CURRENT-INVARIANTS / gate-green code. **GREEN:** it ranks
sources per SYSTEM.md §6 and names the governing authority when challenged.

## Running them (Phase 2–4, owner of record: TEST-01)

1. Cold-start + handoff + current-truth: fresh-agent drill, report in
   `sessions/` + outbox.
2. Ingest + compaction + provenance + freshness + conflict: run against
   PKT-001 and any deliberately conflicting packet; report deltas.
3. Multi-agent: bounded 3-agent task through envelopes only.
4. Cross-ChatGPT: ingest a real external chat, start the next session from
   packets only, verify architectural state survives.
