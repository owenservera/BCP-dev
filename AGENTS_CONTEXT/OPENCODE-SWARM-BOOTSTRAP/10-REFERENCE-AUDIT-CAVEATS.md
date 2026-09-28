# Reference Audit — Missed Details and Exact Caveats

**Reference:** `ibraheem-111/opencode-swarm` main @ `9295b0fcd82550627cb691eb1e951a49efefd27b`

This document records details found on the second audit pass. These are **descriptive compatibility facts**, not requests to redesign the reference swarm core.

## 1. Existing-server attachment requires preconfigured plugin/runtime environment

The reference runner can receive `--server <url>`, but that only changes where the SDK client connects.

When the runner starts its own server, `runner.ts` injects the swarm plugin through `OPENCODE_CONFIG_CONTENT` and passes the swarm DB environment into that child process.

When connecting to an already-running server, the runner does **not** inject `plugin/swarm.ts` into that server and does **not** mutate the server process environment.

Therefore a persistent-server deployment must preconfigure the existing OpenCode server with:

- the swarm plugin;
- the correct `OPENCODE_SWARM_DB` value if the DB is outside the server's default project-relative location;
- any required notification/plugin configuration.

This is a deployment/bootstrap concern. Do not modify `runner.ts` to conceal it.

## 2. The implementation's message "push" is turn-boundary delivery

The dated design document describes a watcher, but the implementation does not contain a continuously running bus watcher.

Actual behavior:

1. an agent writes a durable message to SQLite;
2. after a recipient's current prompt returns, the orchestrator checks that recipient's inbox;
3. it issues a follow-up prompt containing the queued messages;
4. after all agents finish, a bounded final sweep handles late messages.

`swarm_inbox` can inspect pending messages during a turn.

The generic bootstrap must preserve this exact behavior and should describe it as **automatic delivery at turn boundaries plus final sweep**.

## 3. Notification documentation does not exactly match implementation

The implementation listens for:

- `session.idle`
- `session.error`
- `permission.updated`

The dated design text says `permission.asked`.

The implementation is the compatibility authority for this workstream; documentation should call out the discrepancy rather than silently selecting one.

## 4. Notification configuration is not actually wired through SwarmConfig

`SwarmConfig.notify` exists in `src/config.ts`, but the runner's notification helper uses environment variables:

- `OPENCODE_NOTIFY_DESKTOP`
- `OPENCODE_NOTIFY_NTFY_TOPIC`
- `OPENCODE_NOTIFY_NTFY_URL`

The generic layer MUST NOT invent new semantics for this. It should either preserve the reference behavior exactly or provide documentation/configuration outside the core.

## 5. Agent identity in the plugin comes from persisted session mapping

The dated design says the plugin resolves DB path and agent name using `OPENCODE_SWARM_DB` and `OPENCODE_SWARM_AGENT`.

The actual `plugin/swarm.ts` implementation resolves the current agent by looking up `ctx.sessionID` in persisted `agents.session_id`.

There is no runtime dependency on `OPENCODE_SWARM_AGENT` in that plugin implementation.

## 6. MCP background execution has process-local wait state

`src/mcp.ts` keeps active promises in an in-memory `Map`.

Therefore:

- `swarm_status` can inspect persisted state after an MCP server restart;
- `swarm_logs` can inspect persisted history after restart;
- `swarm_wait` can only await a live promise held by the current MCP process.

This is an important distinction for "persistent" operation: persistence covers swarm state/results, not an immortal in-process await handle.

## 7. Resume accepts a config file independently of the stored config

The CLI resume path reads the supplied JSON config and passes the swarm id to the orchestrator.

The orchestrator uses the stored agent state to skip completed agents by name, but there is no full config-version reconciliation.

Consequences of changing the config while resuming include possible differences in:

- agent roster;
- tasks;
- models;
- tool maps;
- max rounds;
- budgets.

Existing persisted agent rows are not explicitly deleted when absent from a new config.

This is existing behavior and must be preserved unless a future, separately authorized change addresses it.

## 8. Failure/retry semantics are deliberately simple

The orchestrator attempts each prompt up to three times with quadratic backoff.

The implementation does not have a typed transient-error classifier; it retries prompt failures broadly and finally marks the participant failed.

A failed participant does not automatically terminate other participant execution. The final swarm becomes `failed` when any participant is failed.

## 9. Budget semantics are soft and cost-report dependent

Budget enforcement uses accumulated provider-reported `cost`.

A provider reporting zero cost will not trip `budgetUsd`.

In-flight turns are allowed to finish.

The implementation emits one `budget-exceeded` event and prevents subsequent prompts once the observed spend has crossed the limit.

This is not a hard spend guarantee.

## 10. Turn/event numbering has an implementation-specific convention

Normal turns begin at round 0 and subsequent message-delivery rounds use positive integers.

The supplied sample fixture contains a `round: -1` event even though the current orchestrator code's final sweep does not emit that value.

Treat the executable implementation and current tests as authoritative; keep fixtures under review rather than designing new semantics around the stale sample.

## 11. Release packaging is Linux-specific

The supplied release script creates:

`opencode-swarm-<version>-linux-x64.tar.gz`

and uses Unix shell tooling.

The runtime source is TypeScript/Bun, but the repository's release artifact is not a Windows-native packaging solution.

A Windows plug-and-play distribution can be provided **around** the unchanged core through separate packaging/install documentation or platform-specific wrappers.

## 12. Server ownership is already explicit in the runner

The reference runner distinguishes:

- no `serverUrl` -> it starts a server and closes it when the run ends;
- `serverUrl` supplied -> it uses an existing server and does not own its lifecycle.

This distinction is essential to the user's long-lived `opencode serve` model and should be surfaced operationally rather than implemented by changing the runner.

## 13. The core has exactly one coordination-tool set

The orchestrator forces these tools back on even under restrictive agent tool maps:

```
swarm_memory_set
swarm_memory_get
swarm_memory_search
swarm_memory_list
swarm_send
swarm_inbox
swarm_agents
```

The bootstrap layer may select normal OpenCode tools for each participant, but must not redefine this coordination set.

## 14. The reference is intentionally single-machine

The original design explicitly excludes cross-machine swarms.

The generic bootstrap should therefore mean:

> generic team design for a single-machine swarm execution substrate

not distributed swarm infrastructure.

## 15. Plugin-loading location is part of the reference deployment model

The runner resolves the swarm plugin in this order:

1. `OPENCODE_SWARM_PLUGIN`;
2. source/package-relative `plugin/swarm.ts`;
3. `swarm-plugin.js` adjacent to the compiled executable.

The bootstrap implementation should not assume that plugin discovery is automatic in every deployment environment.

## Audit conclusion

The prior bootstrap corpus captured the major mechanics correctly, but these operational details needed to be explicit for a truly implementation-grade specification.

None of the findings above authorize changing the reference core.
