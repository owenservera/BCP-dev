---
description: Rank who needs attention right now, using the existing who-needs-attention CLI verb.
agent: architecture-steward
---

Run, from the repository root:

```
bun run AGENTS_CONTEXT/AGENT-COMMONS/runtime/src/cli.ts who-needs-attention --stale-hours 4
```

Use `--stale-hours 4` unless the owner or the current task envelope specifies a
different staleness window (the CLI also reads `COMMONS_HANDOFF_STALE_HOURS` if set).

Report the ranked result as-is. Do not:

- claim a Handoff on the caller's behalf as part of running this command;
- treat an empty ranking as "nothing to do" without also checking whether the
  underlying Commons projections are actually current (a stale or unsynced local
  view can look empty for the wrong reason — run `/commons-sync` first if there is
  any doubt);
- silently widen or narrow the staleness window between calls without saying so.

This command is a read. Claiming and executing the resulting work is a separate,
explicit next step.
