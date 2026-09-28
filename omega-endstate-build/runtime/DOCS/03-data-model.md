# 03 — Data Model

SQLite via `bun:sqlite`, one file at `omega-endstate-build/runs/swarm.db`, gitignored. WAL so the
in-process plugin and the external orchestrator can both write. `busy_timeout = 5000` so a
concurrent write waits instead of throwing `SQLITE_BUSY`.

The DB is **runtime transport, not the record**. The durable record is the committed receipts
and run report (`06-evidence.md`). If the DB is lost, no knowledge is lost — only the ability to
resume mid-run.

## Schema

```sql
CREATE TABLE runs (
  id           TEXT PRIMARY KEY,        -- sw_<16 hex>
  name         TEXT NOT NULL,
  config_json  TEXT NOT NULL,           -- the swarm.json as given, for audit
  status       TEXT NOT NULL,           -- created | running | completed | failed | stopped
  repo_root    TEXT NOT NULL,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL
);

CREATE TABLE agents (
  run_id        TEXT NOT NULL,
  name          TEXT NOT NULL,
  session_id    TEXT,                   -- opencode session; the identity key for tools
  workspace     TEXT,                   -- VIVIM: absolute worktree path
  branch        TEXT,                   -- VIVIM: owned branch
  base_sha      TEXT,                   -- VIVIM: base commit it was cut from
  task          TEXT NOT NULL,
  evidence_bar  TEXT NOT NULL,
  tools         TEXT NOT NULL,          -- JSON
  status        TEXT NOT NULL,          -- allocated|running|done|failed|blocked
  verdict       TEXT,                   -- VIVIM: CONFIRMED | REFUTED | UNRESOLVED
  receipt       TEXT,                   -- VIVIM: repo-relative path to the receipt
  error         TEXT,
  updated_at    TEXT NOT NULL,
  PRIMARY KEY (run_id, name)
);

CREATE TABLE messages (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id       TEXT NOT NULL,
  from_agent   TEXT NOT NULL,
  to_agent     TEXT NOT NULL,           -- an agent name, never '*' (expanded on write)
  body         TEXT NOT NULL,
  created_at   TEXT NOT NULL,
  delivered_at TEXT                     -- NULL = pending
);

CREATE INDEX idx_messages_pending ON messages (run_id, to_agent, delivered_at);
CREATE INDEX idx_agents_session   ON agents (session_id);   -- tool identity lookup

CREATE TABLE memory (
  run_id     TEXT NOT NULL,
  key        TEXT NOT NULL,
  value      TEXT NOT NULL,
  tags       TEXT,                      -- comma-separated
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (run_id, key)
);
```

## The VIVIM columns, and why they exist

`workspace`, `branch`, `base_sha` — the isolation record. Without them a run cannot prove that
agents were separated, and a future Steward cannot reconstruct where an agent's work lives.
Asserted non-null in practice for any agent that reached `running`.

`verdict` — the single most important column in the schema. It is what stops a fluent,
confident, unverified paragraph from being recorded as a result. `NULL` means "no verdict was
recorded", which the orchestrator must treat as `UNRESOLVED`, never as success.

`evidence_bar` — stored per agent so a receipt can show what it was actually held to, even if the
config later changes.

`receipt` — repo-relative path to committed markdown. Lets `status` and a human both find the
durable evidence without knowing the DB layout.

`repo_root` on the run — the run is only meaningful relative to the repository it ran in.

## Invariants the accessors enforce

- **Broadcast expands on write.** `to_agent` is always a concrete name. A `'*'` row would be
  ambiguous to deliver and would leak across resumes.
- **Claim marks delivered.** Read and mark are one operation from the caller's perspective, so a
  message cannot be delivered twice. History is never deleted.
- **Agents are upserted, never duplicated.** `(run_id, name)` is the key.
- **Partial updates must not clobber.** `upsertAgent` uses
  `COALESCE(?, <existing col>)` with the **raw parameter**, not `excluded.col`. On insert the
  default status is `'created'`, so `excluded.status` would carry that default into the conflict
  branch and reset a running agent to `created` on any partial update. This is a real bug the
  reference implementation documents explicitly; a naive full-overwrite upsert has the mirror
  bug and silently erases fields the caller did not mention.
- **Memory is per-run.** Two runs never see each other's memory, even with identical keys.
- **A session id maps to at most one agent.** Indexed, because the plugin hits it on every tool
  call.

## Migration

Additive only, applied on open:

```
PRAGMA table_info(agents) -> if no cost_usd: ALTER TABLE agents ADD COLUMN cost_usd ...
```

No destructive migrations. If a future change cannot be additive, that is a signal the schema
was designed wrong, and it should be fixed by adding a column rather than by rewriting rows.

## What is deliberately absent

- No cost/token columns beyond `cost_usd` on the agent row; per-turn cost lives in the events
  stream, which is a log, not a table.
- No vector/embedding table. Substring + tag search is sufficient at this scale, and semantic
  memory is explicitly deferred.
- No cross-run queries in the hot path. A run is a closed world.
