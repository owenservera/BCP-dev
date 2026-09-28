# Core Preservation Contract

## Normative rule

The reference `opencode-swarm` implementation is the implementation baseline for the execution core.

The new system is a **fresh bootstrap around that core**, not a rewrite of it.

## Immutable core boundary

The following are treated as frozen for this workstream:

```
swarm.json semantics
       |
       v
runSwarm(...)
       |
       v
Orchestrator
       |
       +--> OpenCode SDK
       |
       +--> plugin/swarm.ts
       |
       +--> SQLite state
       |
       +--> memory
       |
       +--> message bus
       |
       +--> reports / events / notifications
       |
       v
MCP + CLI control surfaces
```

The bootstrap implementation may create or select the configuration passed into this boundary, but may not change the meaning of that configuration.

## Exact compatibility requirement

A configuration produced by the bootstrap layer MUST be valid input to the unmodified reference `validateConfig()` and MUST run through the unmodified reference `runSwarm()`.

That gives a clean compatibility test:

```
bootstrap(objective)
       |
       v
SwarmConfig
       |
       +--> reference validateConfig() == accepted
       |
       +--> reference runSwarm() == normal swarm
```

## Persistent server use

The reference core already supports attachment to an externally running OpenCode server via its `serverUrl`/CLI `--server` path.

Therefore the bootstrap layer may target:

```
opencode serve
      |
      +--> opencode TUI
      |
      +--> swarm run --server <url>
```

without modifying the swarm runner.

The bootstrap layer does not own that server unless explicitly invoking the reference runner's owned-server path.

## No hidden substitutions

A bootstrap implementation is non-conforming if it:

- silently changes the message delivery semantics;
- changes participant lifecycle semantics;
- changes the SQLite schema;
- silently creates a second DB;
- changes the coordination tool names;
- replaces OpenCode SDK calls with raw terminal scraping;
- requires a fixed team roster;
- requires a particular model/provider;
- embeds VIVIM/Omega roles into the generic core.

## Safe extension point

The sole architectural extension point in this workstream is:

```
BootstrapInput
      |
      v
BootstrapEngine
      |
      v
TeamDefinition / SwarmConfig
      |
      v
EXISTING CORE
```

Everything below `SwarmConfig` remains reference behavior.
