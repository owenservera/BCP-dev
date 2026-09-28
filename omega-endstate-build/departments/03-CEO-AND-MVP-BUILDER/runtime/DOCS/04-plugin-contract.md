# 04 — Plugin Contract

The plugin is an opencode plugin: `runtime/plugin/vivim-swarm.ts`.

## Hard rule: export the plugin and nothing else

> opencode treats **every export of a plugin module as a plugin**, so this file must export
> nothing but the plugin itself.

Helpers live in `src/` and are imported. Re-exporting anything else from the plugin file
registers a second, malformed plugin. This bit me once already; it is written here so it does not
bite again.

## Wiring

Never edit the owner's `opencode.json`. The orchestrator passes config at spawn time:

```ts
spawn("opencode", ["serve", "--hostname=127.0.0.1", `--port=${port}`], {
  env: { ...process.env,
         VIVIM_SWARM_DB: dbPath,
         OPENCODE_CONFIG_CONTENT: JSON.stringify({ plugin: [pluginPath] }) },
  detached: true, stdio: ["ignore", "pipe", "pipe"],
})
```

`OPENCODE_CONFIG_CONTENT` is the supported mechanism and it is why relative plugin paths never
need to be resolved against a tracked config file. (opencode resolves relative `plugin` paths
against the config directory and *strips* leading `../`, so a plugin outside `.opencode/` cannot
be referenced relatively at all — verified, and the failure is silent.)

`VIVIM_SWARM_DB` is an env var, not a parameter, for one reason: **the plugin executes inside the
server process**, so the DB path must be on the server's environment.

## Signature

```ts
import type { Plugin } from "@opencode-ai/plugin"
import { tool } from "@opencode-ai/plugin"

const z = tool.schema

export const VivimSwarmPlugin: Plugin = async ({ directory }) => ({ tool: { ... } })
```

The plugin receives the project `directory`, so the DB path can also be derived per project.

**Lazy DB.** Do not create the database in projects that never use these tools:

```ts
const getDb = () => {
  if (process.env.VIVIM_SWARM_DB === undefined && !existsSync(dbPath)) return null
  return (db ??= openDb(dbPath))
}
```

## Identity

Every tool resolves the caller from `ctx.sessionID` via an indexed lookup:

```
ctx.sessionID -> agents.session_id -> { runId, name }
```

This is the only identity mechanism, and it is what prevents an agent impersonating a peer. If
the lookup fails, return a friendly message and **do not write anything**:

```
"Error: this session is not part of a swarm. These tools only work for agents
 spawned by `vivim-swarm run`."
```

Non-swarm sessions (the owner's own interactive work) get that message, not an exception.

## Tools

| Tool | Args | Behaviour |
|---|---|---|
| `vivim_swarm_memory_set` | `key`, `value`, `tags?` | Upsert into `memory`, stamping `updated_by` with the resolved agent. Stable namespaced keys (`architecture/browser-seam`). |
| `vivim_swarm_memory_get` | `key` | Exact key. Returns value + who last wrote it, or a clear miss. |
| `vivim_swarm_memory_search` | `query` | Substring across key, value, tags. Returns `## key (by agent)` blocks. |
| `vivim_swarm_memory_list` | — | All keys with authors. |
| `vivim_swarm_send` | `to`, `message` | `to` is a name or `"*"`. **Validate against the roster first**; an unknown name returns the roster so the agent can correct itself. Broadcast expands to concrete rows on write. |
| `vivim_swarm_inbox` | — | **Read-only.** Lists pending messages; does *not* mark delivered. The orchestrator owns delivery. |
| `vivim_swarm_roster` | — | Roster with status and verdict; marks which one is you. |
| `vivim_swarm_receipt` | `verdict`, `evidence` | **VIVIM addition.** See below. |

### `vivim_swarm_receipt` — the VIVIM-specific tool

```ts
verdict: "CONFIRMED" | "REFUTED" | "UNRESOLVED"
evidence: string   // commands run and what they showed; < 10 chars is rejected
```

Rules:

- A verdict outside the three values is rejected.
- Evidence shorter than a threshold is rejected: *a verdict without evidence is not recorded*.
- On success, the agent's status becomes `done` and its verdict is persisted, and a copy is
  written to shared memory under `receipt/<agent>`.

An agent that never calls this is recorded as `UNRESOLVED` by the orchestrator, so the failure
mode is "no evidence" rather than "looks finished". That is the entire point: the most dangerous
outcome in this system is a fluent unverified answer being recorded as a result, and this design
makes that outcome require a deliberate, checkable act.

## Rules for every tool implementation

1. **Never throw into opencode.** Return a structured error string. An exception surfaces as an
   opaque session error and destroys the agent's actual work.
2. **Never trust the name the agent passed.** Resolve identity from `ctx.sessionID`.
3. **Validate the recipient** against the roster; return the roster on failure.
4. **Do not mark messages delivered** from `vivim_swarm_inbox`.
5. **Keep the `tools` map honest.** The orchestrator force-enables these tools over any
   per-agent map, so a `{"*": false}` agent is not mute — but the rest of that map is the
   least-privilege boundary and must be set deliberately per agent.

## Dependencies

```
@opencode-ai/plugin   ^1.16.2   (Plugin type, tool(), tool.schema)
zod                   ^4.4.3
bun:sqlite                     (built in; do not add better-sqlite3)
```
