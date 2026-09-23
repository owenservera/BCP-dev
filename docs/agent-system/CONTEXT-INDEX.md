# CONTEXT-INDEX.md — Map Into Deeper Material

> **Classification: DERIVED — CURRENT** · **Updated:** 2026-09-23 · **Tip:** `7525ae6`

| Question | Answer (read-first link) |
|---|---|
| Where is the architecture context? | `omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md` (law synthesis) → `docs/BUILD-DECISIONS.md` (audit trail) → `/BUILD_CONTEXT.md` (forge map) |
| Where are the recent conversations? | `docs/agent-system/transcripts/` (immutable, by date) — start with `2026-09-23/CHAT-2026-09-23-cooperative-agent-context.md` |
| Where is the current ontology? | Genome `omega-…/genome/layers.json` → `build/genome.md` (D-425); BCP `bcp-speed/bcp/state/taxonomy.yaml`. No second ontology lives here |
| Where are the unresolved contradictions? | `CURRENT.md` §KNOWN CONTRADICTIONS → workstream rows in `WORKSTREAMS.md` → Ω `docs/decisions/OPEN-QUESTIONS.md` (generated board) |
| Where is the current implementation work? | `WORKSTREAMS.md` (WS-001 active) → `ROSTER.md` (who/where) → `handoffs/` (latest HANDOFF-*) |
| Where are the relevant decisions? | Per-packet `recommended reads` + `WORKSTREAMS.md` linked decisions + Ω `docs/decisions/D-NNN-*.md` (never edit RATIFIED) |
| Where are the latest handoffs? | `docs/agent-system/handoffs/` — newest HANDOFF-* first; each names its successor action |
| Where are recent lessons? | Ω session ledger bundles + dev-vault (environment-local, D-428/D-430) via `sessions/SESSION-*.md` pointers; never committed raw |
| Where is the migration/forge state? | `docs/CURRENT-CONTEXT.md` tables → `bcp-speed/bcp/migration/index.json` → live state via `python bcp_tool.py show` (read-only here) |
| Where are the proofs this system works? | `FALSIFIERS.md` (F-AGENT-* definitions) + TEST-01 reports in `sessions/` + outbox |
| Where do I talk to another agent? | `ENVELOPE.md` + `inbox/<agent-id>/` / `outbox/<agent-id>/` (structured items, not DMs) |
| What must I never treat as authority? | `docs/archive/`, `setupdocs/`, Ω `docs/forge/annex/` (working material, never law), parked 2026-09-22 inbox/lane entries, any TRANSCRIPT or packet standing alone |

## Cold-start shortcut

`CHATGPT-BOOT.md` → `CURRENT.md` → this file → active workstream → handoff →
packets → decisions/code/tests → transcripts only if needed.
