# opencode-swarm

Multi-agent swarms for [opencode](https://opencode.ai) — parallel agents with **shared memory**, **persistent state**, **inter-agent messaging**, and **completion notifications**. No fork: everything is built on opencode's official plugin system and `@opencode-ai/sdk`, so it survives upstream upgrades.

```
┌────────────────────── opencode serve ──────────────────────┐
│   agent "researcher"     agent "coder"     agent "reviewer" │
│        │ swarm_* tools        │                  │          │
└────────┼──────────────────────┼──────────────────┼──────────┘
         ▼                      ▼                  ▼
   ┌──────────── SQLite (.swarm/swarm.db) ────────────┐
   │  shared memory   ·   message bus   ·   state     │
   └───────────────────────────────────────────────────┘
         ▲
   ┌─────┴─────┐   spawns sessions, push-delivers messages,
   │   swarm   │   persists/resumes state, notifies you when done
   └───────────┘
```

## Requirements

- [Bun](https://bun.sh) ≥ 1.1
- [opencode](https://opencode.ai) ≥ 1.16 with at least one provider authenticated (e.g. `opencode auth login` with an [OpenRouter](https://openrouter.ai) key)
- Linux desktop notifications use `notify-send` (optional); phone push uses [ntfy.sh](https://ntfy.sh) (optional)

## Install

```sh
# from npm (published as @ibraheem-111/opencode-swarm — the bare name is an unrelated package)
bun add @ibraheem-111/opencode-swarm

# or from source (needs bun)
git clone https://github.com/ibraheem-111/opencode-swarm
cd opencode-swarm && bun install
bun link        # makes the `swarm` command available globally
```

or grab the self-contained binary release (no bun required) from
[Releases](https://github.com/ibraheem-111/opencode-swarm/releases) — the tarball ships
`swarm`, `swarm-plugin.js`, and `notify-plugin.js`; keep the plugin next to the binary
or point `OPENCODE_SWARM_PLUGIN` at it (containers).

## Quickstart

```sh
cd your-project
swarm init      # writes swarm.json
swarm run swarm.json
```

`swarm.json` defines the agents:

```jsonc
{
  "name": "feature-swarm",
  "model": "openrouter/openai/gpt-4o-mini",     // default "provider/model"
  "agents": [
    {
      "name": "researcher",
      "task": "Survey the codebase, store findings in shared memory under 'architecture', then tell coder.",
      "tools": { "*": false, "read": true, "glob": true, "grep": true }
    },
    {
      "name": "coder",
      "task": "Wait for researcher's findings, then write the plan into shared memory under 'plan'.",
      "model": "openrouter/anthropic/claude-sonnet-4-6",   // per-agent override
      "tools": { "*": false, "read": true, "edit": true, "write": true, "bash": true }
    }
  ],
  "maxRounds": 5,                                // message ping-pong guard
  "notify": { "desktop": true, "ntfyTopic": "my-swarms" }
}
```

The orchestrator spawns one opencode session per agent (all in parallel), injects a swarm preamble into each agent's system prompt, and gives every agent these tools:

| Tool | Purpose |
|------|---------|
| `swarm_memory_set` / `get` / `search` / `list` | Shared key-value memory all agents can read and write |
| `swarm_send` | Message another agent by name, or `"*"` to broadcast |
| `swarm_inbox` | Pull pending messages mid-turn |
| `swarm_agents` | See the roster and everyone's status |

Messages are **push-delivered**: when an agent finishes a turn, anything sent to it arrives as a new prompt ("From researcher: …"), so agents genuinely react to each other instead of polling.

Everything (memory, messages, agent state) persists in `.swarm/swarm.db`, so:

```sh
swarm status                 # list swarms + agents (+ per-agent cost)
swarm logs sw_abc123         # full message + memory history
swarm run swarm.json --resume sw_abc123   # resume an interrupted swarm; finished agents are skipped
swarm send sw_abc123 coder "stop using lodash"   # inject a message from outside while it runs
```

For machines instead of humans:

```sh
swarm run swarm.json --json --events run.jsonl --db /data/run42/swarm.db
#                     │      │                  └ swarm DB location (or OPENCODE_SWARM_DB)
#                     │      └ timestamped JSONL event stream (see tests/fixtures/events.sample.jsonl)
#                     └ result JSON on stdout, progress on stderr
swarm status --json
```

Events carry per-turn **cost, model id, and token counts** (`agent-turn-done`), a final
per-agent settlement after late message deliveries (`agent-settled`), and a one-shot
`budget-exceeded` when the `budgetUsd` soft brake trips. `maxConcurrent` caps how many
agents run turns simultaneously. The budget brake stops new turns once reported spend
crosses the ceiling (status `stopped`); in-flight turns finish, and providers that
report zero cost never trip it — keep an outer guard if you need a hard ceiling.

A markdown report (agent results, shared memory, message log) lands in `.swarm/reports/<swarmId>.md` after every run, and you get a desktop/ntfy notification when the swarm finishes.

## MCP server

`swarm mcp` runs a stdio MCP server, so any MCP client (Claude Code, opencode, Cursor)
can drive swarms:

```jsonc
// .mcp.json (Claude Code) — or the equivalent mcp block in opencode.json
{ "mcpServers": { "swarm": { "command": "swarm", "args": ["mcp"] } } }
```

Tools: `swarm_run` (fire-and-forget — returns the swarmId immediately, the swarm runs in
the background), `swarm_status`, `swarm_wait` (bounded), `swarm_send`,
`swarm_memory_search`, `swarm_logs`. Results persist in the project's `.swarm/swarm.db`,
so a different process (or a later session) can pick them up.

## Notifications for normal (non-swarm) opencode use

The standalone notify plugin fires on `session.idle` (agent finished), `session.error`, and permission prompts:

```jsonc
// opencode.json — npm package form, or a local path to plugin/notify.ts
{ "plugin": ["@ibraheem-111/opencode-swarm/plugin/notify"] }
```

```sh
export OPENCODE_NOTIFY_NTFY_TOPIC=my-topic   # optional: push to your phone via ntfy.sh
export OPENCODE_NOTIFY_DESKTOP=0             # optional: disable notify-send
```

## Skip-all-permissions mode (upstream, documented here because everyone asks)

opencode already supports this — no fork needed:

```sh
opencode run --dangerously-skip-permissions "do the thing"
```

or permanently in `opencode.json` (see [`examples/opencode-yolo.json`](examples/opencode-yolo.json)):

```jsonc
{
  "permission": { "*": "allow", "bash": { "*": "allow", "rm -rf *": "deny" } }
}
```

Swarm agents run headless and never block on permission prompts for the tools you enable in their `tools` map.

## How it works (and what it doesn't do)

- The **swarm plugin** (`plugin/swarm.ts`) registers the `swarm_*` tools inside opencode. Tool calls resolve which agent is calling via the session ID the orchestrator recorded at spawn time.
- The **orchestrator** (`swarm run`) drives sessions over the SDK's HTTP API. Per-agent prompts retry transient/model errors 3× with backoff; a terminally failed agent doesn't kill the swarm.
- Message delivery happens **between turns** — opencode has no MCP server-push (sampling/elicitation) yet, so a busy agent sees new messages when its current turn ends, or mid-turn via `swarm_inbox`.
- Tip: models behind OpenAI's API reject requests with >128 tools. If your global opencode config loads many MCP servers, give swarm agents an explicit `tools` map (as the examples do).

## Development

```sh
bun test                 # unit tests (fast, no network)
bun test tests/e2e.test.ts --timeout 240000   # full e2e — needs opencode + provider auth
bun run typecheck
```

Design doc: [`docs/specs/2026-06-09-opencode-swarm-design.md`](docs/specs/2026-06-09-opencode-swarm-design.md)

MIT © Ibraheem
