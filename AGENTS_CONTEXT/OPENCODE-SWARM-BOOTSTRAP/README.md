# Generic OpenCode Swarm Bootstrap

**Status:** PROPOSED — design/implementation handoff  
**Reference:** `ibraheem-111/opencode-swarm` main @ `9295b0fcd82550627cb691eb1e951a49efefd27b`

## Prime directive

**Do not redesign the reference swarm core.**

This workstream preserves the reference implementation's core design and operational semantics. The only intended new behavior is a generic, plug-and-play **bootstrap layer that determines the team definition for a given objective** and then feeds the resulting team definition into the existing swarm core.

The reference swarm remains the execution substrate.

The bootstrap layer must not replace, fork, reinterpret, or duplicate:

- `src/db.ts`
- `src/memory.ts`
- `src/bus.ts`
- `src/state.ts`
- `src/config.ts`'s resulting swarm configuration semantics
- `src/orchestrator.ts`
- `src/runner.ts`
- `src/mcp.ts`
- `src/cli.ts`
- `plugin/swarm.ts`
- `plugin/notify.ts`

Any implementation that changes those mechanics is outside this workstream.

## What is being added

A generic bootstrap process:

```
objective + constraints + available context
                |
                v
        bootstrap designer
                |
        propose team structure
                |
          inspect/refine
                |
          bounded iteration
                |
                v
        concrete swarm.json
                |
                v
        EXISTING swarm core
```

The team is intentionally not predeclared as researcher/coder/reviewer. The bootstrap process creates whatever participant set is justified by the supplied objective and constraints.

## Design principle

The bootstrap layer answers:

> "What team definition should this particular swarm run use?"

The existing swarm core answers:

> "How do these already-defined agents execute, communicate, persist state, resume, report, and finish?"

Those questions remain separate.

## Folder map

- `00-SOURCE-FORENSICS.md` — exact reference implementation inventory.
- `01-CORE-PRESERVATION.md` — immutable core contract for this workstream.
- `02-BOOTSTRAP-CONTRACT.md` — generic bootstrap inputs/outputs.
- `03-BOOTSTRAP-PROTOCOL.md` — bounded iterative team-design algorithm.
- `04-CONFIG-PROJECTION.md` — how the bootstrap result maps to the existing `swarm.json`.
- `05-OPERATIONS-MAP.md` — exact retained operational surface.
- `06-IMPLEMENTATION-SHAPE.md` — plug-in implementation boundaries without touching the core.
- `07-CONFORMANCE.md` — tests proving both preservation and bootstrap correctness.
- `08-IMPLEMENTATION-ROADMAP.md` — implementation sequence.
- `09-NON-DECISIONS.md` — explicit things this workstream must not invent.
- `10-REFERENCE-AUDIT-CAVEATS.md` — second-pass implementation facts and deployment caveats that must be preserved without redesigning the core.

## Authority

This folder is a design proposal. It is not Ω law, Agent Commons law, or a replacement for current repository authority. It must be reconciled with repository authority before code is integrated.

- `12-WINDOWS-OPERATIONS-GUIDE.md` — Windows-native and WSL deployment/operations guide for the unchanged reference core.
