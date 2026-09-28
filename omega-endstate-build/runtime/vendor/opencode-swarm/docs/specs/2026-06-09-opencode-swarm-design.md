# opencode-swarm — Design

**Date:** 2026-06-09
**Status:** Approved (direction A chosen by Ibraheem; autonomous build authorized)

## Problem

opencode (the open-source agentic coding CLI) is the preferred harness because it is
open, hackable, and natively supports OpenRouter. Four gaps block the desired workflow:

1. **Skip-all-permissions mode** — actually exists upstream
   (`--dangerously-skip-permissions`, `"permission": "allow"`); needs packaging/docs, not code.
2. **Completion notifications** — no built-in; solvable with a `session.idle` plugin.
3. **MCP-style push messages into a running session** — opencode's MCP client is
   client-initiated only; needs an injection mechanism.
4. **Agent swarms** — opencode has parallel sessions via `opencode serve` +
   `@opencode-ai/sdk`, but no shared memory, no persistent swarm state, and no
   inter-agent messaging.

This repo fills those gaps **without forking opencode**: everything is plugins plus an
external orchestrator built on the official SDK, so it survives upstream upgrades.

## Architecture

```
┌─────────────────────────── opencode serve (HTTP API) ───────────────────────────┐
│  session A (agent "researcher")   session B (agent "coder")   session C (...)   │
│       │  swarm plugin tools             │                          │             │
└───────┼──────────────────────────────────┼──────────────────────────┼────────────┘
        │ swarm_* custom tools (in-proc)   │                          │
        ▼                                  ▼                          ▼
   ┌────────────────────────── SQLite (.swarm/swarm.db) ──────────────────────────┐
   │   memory (shared KV + search)   messages (bus)   swarms/agents (state)       │
   └──────────────────────────────────────────────────────────────────────────────┘
        ▲
        │ @opencode-ai/sdk (HTTP)
   ┌────┴──────────────┐
   │ swarm orchestrator │  spawns N sessions, watches bus, injects messages,
   │ (CLI: `swarm`)     │  persists/resumes state, fires notifications
   └───────────────────┘
```

### Components

1. **`plugin/swarm.ts` — swarm plugin** (installed into `.opencode/plugins/` or
   referenced from `opencode.json`). Provides custom tools available to every agent:
   - `swarm_memory_set(key, value, tags?)` / `swarm_memory_get(key)` /
     `swarm_memory_search(query)` — shared KV memory with substring/tag search.
   - `swarm_send(to, message)` — post a message to another agent (or `*` broadcast).
   - `swarm_inbox()` — read pending messages addressed to me.
   - Tools resolve the DB path from `OPENCODE_SWARM_DB` (set by the orchestrator per
     session) and the agent name from `OPENCODE_SWARM_AGENT`.

2. **`plugin/notify.ts` — notification plugin.** On `session.idle` → desktop
   notification via `notify-send`; optional push via ntfy.sh topic
   (`OPENCODE_NOTIFY_NTFY_TOPIC`). On `permission.asked` → notification too (the
   "blocked waiting on you" case).

3. **Orchestrator library (`src/`)** — TypeScript on Bun:
   - `db.ts` — SQLite schema + migrations (bun:sqlite): `memory`, `messages`,
     `swarms`, `agents` tables.
   - `memory.ts`, `bus.ts`, `state.ts` — typed accessors over the DB.
   - `orchestrator.ts` — drives `opencode serve` via `@opencode-ai/sdk`:
     - `runSwarm(config)`: create/resume a swarm; spawn one session per agent with
       its own system prompt + task; run prompts concurrently.
     - **Message push (gap 3):** a watcher polls the bus; messages for an agent are
       delivered by sending a follow-up prompt to that agent's session
       ("Message from X: ..."). Since session prompts are serialized per session,
       delivery lands between turns — true push semantics from the agent's view.
     - On agent/swarm completion: notification + final report written to
       `.swarm/reports/`.
   - `config.ts` — `swarm.json` schema: agents (name, model, prompt, task),
     server settings, notify settings.

4. **CLI (`src/cli.ts`)** — `swarm run <config>`, `swarm status`, `swarm resume <id>`,
   `swarm logs <id>`. Plus `swarm init` to scaffold a `swarm.json` +
   recommended `opencode.json` (permission allow-all variant documented).

### Data model (SQLite)

- `memory(swarm_id, key, value, tags, updated_by, updated_at)` — PK (swarm_id, key)
- `messages(id, swarm_id, from_agent, to_agent, body, created_at, delivered_at)`
- `swarms(id, name, config_json, status, created_at, updated_at)`
- `agents(swarm_id, name, session_id, status, result, updated_at)`

WAL mode; safe for concurrent access from plugin tool calls (in opencode's process)
and the orchestrator (separate process).

### Error handling

- Orchestrator retries transient SDK/HTTP errors (3x, backoff); an agent that fails
  terminally is marked `failed` in state without killing the swarm.
- `swarm resume` re-attaches to existing sessions by stored `session_id`; sessions
  that no longer exist are respawned with their original prompt + a note.
- Plugins never throw into opencode: all tool errors return structured error strings.

### Testing

- **Unit (bun:test):** db/memory/bus/state — no network.
- **Integration:** spawn a real `opencode serve`, create sessions, verify the plugin
  tools work end-to-end with a cheap OpenRouter model (auth already configured on
  this machine). Tests requiring a model are skipped gracefully when no OpenRouter
  auth is present (CI).
- **CI (GitHub Actions):** bun install + unit tests + typecheck on push.

## Out of scope (YAGNI)

- Vector/semantic memory search (substring + tags only, v1).
- Cross-machine swarms (single server, v1).
- Forked opencode features (native MCP sampling) — tracked upstream instead.
- TUI; the orchestrator is CLI + reports.

## Decisions

- **Bun** runtime (opencode plugins are bun-loaded TS; bun:sqlite is built-in).
- **SQLite over Redis** — zero-dependency, file-based, fits single-machine v1.
- **Plugin custom tools over a separate MCP server** — in-process, no extra daemon,
  direct DB access.
- Repo: public, `github.com/ibraheem-111/opencode-swarm`, MIT license.
