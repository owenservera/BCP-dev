# Source Forensics

## Reference revision

```
repository: ibraheem-111/opencode-swarm
branch: main
commit/tree: 9295b0fcd82550627cb691eb1e951a49efefd27b
version in package.json: 0.2.2
```

The complete repository tree was inspected through connected GitHub access. All TypeScript implementation files, plugins, tests, fixture data, scripts, examples, package metadata, and the dated design specification were reviewed.

## Exact implementation inventory

### Core runtime

| Path | Behavior that must remain intact |
|---|---|
| `src/db.ts` | SQLite schema; WAL; busy timeout; default `.swarm/swarm.db`; environment override; migration of `cost_usd`. |
| `src/memory.ts` | Per-swarm key/value shared memory; tags; updated-by metadata; substring search across key/value/tags; list/get/set semantics. |
| `src/bus.ts` | Durable messages; direct send; broadcast expansion; pending inbox; full history; explicit delivered timestamp. |
| `src/state.ts` | Swarm records; agent records; session lookup; status updates; persisted results; accumulated cost; total cost. |
| `src/config.ts` | `SwarmConfig`, `AgentSpec`, provider/model parsing, validation, duplicate-name rejection, reserved `*`. |
| `src/orchestrator.ts` | Parallel participant execution; session creation; prompts; coordination tools forcibly preserved; retries; cost accounting; soft budget; max concurrency; message follow-ups; final sweep; resume; settlement; final result. |
| `src/runner.ts` | Optional spawning of `opencode serve`; optional attachment to an existing server via `serverUrl`; environment-based plugin injection; report creation; notification; cleanup of servers started by the runner. |
| `src/cli.ts` | `init`, `run`, `status`, `logs`, `send`, `mcp`, version/help; `--resume`, `--server`, `--dir`, `--db`, `--events`, `--json`. |
| `src/mcp.ts` | stdio MCP control plane; background `swarm_run`; `status`, `wait`, `send`, memory search, logs. |
| `src/notify.ts` | Desktop notification plus optional ntfy; timeout-capped failure-isolated notification. |

### Plugins

| Path | Behavior |
|---|---|
| `plugin/swarm.ts` | Registers `swarm_memory_set/get/search/list`, `swarm_send`, `swarm_inbox`, `swarm_agents`; resolves agent identity by OpenCode session id. |
| `plugin/notify.ts` | Emits notifications from `session.idle`, `session.error`, and permission events. |

### Tests/scripts

All reference tests were inspected, including DB/memory/bus/state/orchestrator/CLI/config/cost-budget/MCP/notification/E2E behavior. The smoke test proves real `opencode serve` + SDK + provider operation. The release script bundles the plugins and CLI.

## Essential core semantics to preserve

1. One OpenCode session per configured swarm agent.
2. Shared local SQLite state.
3. Shared key/value memory.
4. Durable point-to-point and broadcast messaging.
5. Delivery by follow-up prompt between turns, plus final late-message sweep.
6. Session identity recorded against the swarm agent.
7. Coordination tools always remain available even when an agent tool map is restrictive.
8. Parallel execution with optional `maxConcurrent`.
9. Retry of prompt failures with backoff.
10. Soft swarm-wide budget brake.
11. Persisted cost and token observations.
12. Resumable swarms keyed by `swarmId`.
13. Machine-readable event stream.
14. Final per-agent settlement and swarm settlement.
15. Optional desktop/ntfy notifications.
16. CLI and MCP control surfaces.
17. Ability to attach the runner to an externally running OpenCode server with `--server`.

## Core behavior deliberately NOT generalized

The bootstrap layer must not turn the above mechanisms into a new architecture.

For example:

- Do not replace SQLite with another state model in this workstream.
- Do not replace `swarm_*\` tools with a new messaging abstraction.
- Do not invent a new delivery protocol.
- Do not replace the orchestrator with an independent scheduler.
- Do not redefine a participant as a Commons agent identity.
- Do not introduce a second persistent swarm database.
- Do not add a new distributed control plane.

Genericity belongs at **team definition and bootstrapping**, not at the core execution mechanisms.
