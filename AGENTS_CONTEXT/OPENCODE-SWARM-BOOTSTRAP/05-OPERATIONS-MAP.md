# Retained Operations Map

This document defines the operations the generic version MUST retain from the reference implementation without changing their semantics.

## Agent-facing operations

### Shared memory

- `swarm_memory_set`
- `swarm_memory_get`
- `swarm_memory_search`
- `swarm_memory_list`

Semantics remain those of `plugin/swarm.ts` + `src/memory.ts`.

### Communication

- `swarm_send`
- `swarm_inbox`

Direct messaging and `*` broadcast remain unchanged.

### Roster visibility

- `swarm_agents`

Status comes from the same persisted state records.

## Controller operations

The generic layer must preserve access to:

- swarm creation;
- swarm execution;
- resume;
- existing-server attachment;
- status;
- wait;
- external message injection;
- logs;
- machine-readable JSON;
- JSONL event output;
- report generation;
- notification;
- MCP control;
- cost accounting;
- soft budget;
- max concurrency.

## Exact CLI compatibility target

The reference commands remain recognizable:

```
swarm init
swarm run <config.json>
swarm status
swarm logs <swarmId>
swarm send <swarmId> <agent|*> <message>
swarm mcp
```

Reference run flags remain:

```
--resume <id>
--server <url>
--dir <path>
--db <path>
--events <file>
--json
```

The bootstrap feature should be additive, for example through a separate bootstrap command or wrapper, rather than mutating the meaning of `swarm run`.

## Persistent OpenCode server use

For the desired long-lived server pattern:

```
opencode serve
     |
     +--> TUI / attached operator
     |
     +--> bootstrap wrapper
     |
     +--> reference swarm run --server <url>
```

The server remains the external runtime host. The reference swarm runner attaches to it.

No swarm-core change is required.

## MCP

The existing MCP control surface remains usable. A future bootstrap MCP tool may be added only as an adapter that produces a normal `SwarmConfig`; it must not duplicate the reference swarm execution tools.
