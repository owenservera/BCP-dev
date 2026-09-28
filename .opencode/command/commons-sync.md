---
description: Flush this agent's Commons outbox and read its inbox, using the existing runtime CLI.
agent: architecture-steward
---

Set the three environment variables the Commons runtime CLI requires, then call it —
do not reimplement flush/inbox logic inline:

- `COMMONS_REPO_ROOT` = repository root (the directory containing `AGENTS_CONTEXT/`)
- `COMMONS_AGENT_ID` = this session's Commons `agent_id` (e.g. `authority-governance`)
- `COMMONS_AGENT_HOME` = this session's agent home path (e.g.
  `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE`)

Then run, in order:

```
bun run AGENTS_CONTEXT/AGENT-COMMONS/runtime/src/cli.ts flush
bun run AGENTS_CONTEXT/AGENT-COMMONS/runtime/src/cli.ts inbox
```

Report the raw JSON output of both calls. If `flush` reports nothing pending, say so
rather than skipping straight to `inbox`. If any event surfaces as rejected or
dead-lettered, report it explicitly — do not fold it silently into a summary count.

This command performs no Handoff claim and starts no work. It is the sync step only.
