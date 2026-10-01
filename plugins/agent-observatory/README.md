# agent-observatory

Realtime observatory over runtime agents. A global ZCode plugin exposing an MCP
server that answers tool calls about live agent sessions: their models, token
spend, lifecycle state, event stream, and permission rules.

Reads the local runtime store **read-only** (SQLite, WAL mode) — the plugin
never writes runtime state and holds no secrets.

## Design intent

Permanent global tool, seeded with agent observability and meant to evolve:
new capabilities slot into the `TOOLS` registry in `mcp/server.mjs` (name +
description + JSON schema + handler) and are picked up by `tools/list`
automatically. Bump the version in `.zcode-plugin/plugin.json` when adding
tools.

## Seeded tools (v0.1.0)

| Tool | What it answers |
|---|---|
| `agents_live` | Snapshot of all runtime agent sessions: agent, model (provider/id/variant), tokens by type, cost, status (active/idle/archived), subagent parent linkage, directory. Params: `scope` (`all`\|`roots`\|`subagents`\|`active`), `active_window_ms`, `directory`, `limit`. |
| `agents_events` | Newest-first tail of the runtime event stream (session created/updated, message updated/part updated, model/agent switched). Params: `limit`, `type`. |
| `agents_tokens` | Token/cost aggregation over a time window grouped by model, agent, or directory. Params: `window_hours`, `group_by`. |
| `agents_rules` | Permission rules (allow/deny patterns per action) attached to agent sessions. Params: `session_id` (session + its subagents), `limit`. |

## Runtime store resolution

The server looks for the SQLite store at, in order:

1. `AGENT_OBSERVATORY_DB` (override)
2. `<XDG_DATA_HOME or ~/.local/share>/opencode/opencode.db` then `zcode.db`
3. `%LOCALAPPDATA%/{opencode,zcode}/{opencode,zcode}.db` (Windows fallback)

If no store is found, every tool returns an error listing the candidates probed.

## Requirements

- Node.js >= 22.5 (`node:sqlite`); zero npm dependencies.

## Trial prompt

> Use the agent-observatory MCP tools to show me every agent running or
> active right now, with its model, token spend, and permission rules.