# VIVIM End-State Team Runtime — Implementation Documents

> Agent: STEW-01
> Date: 2026-09-28
> Status: design set for the runtime that will run parallel VIVIM end-state agents
> Supersedes: `omega-endstate-build/design/RUNTIME-DESIGN-V1.md` (built on unverified
> assumptions about the opencode API; see `10-reference-findings.md` for the corrections)

## What this is

A specification set for a small local runtime that runs several VIVIM end-state agents
**concurrently, each in its own isolated git worktree, able to message each other, and each
obliged to return evidence and an explicit verdict**.

It is built on opencode's real primitives rather than on an assumed API. Every behavioural claim
here about opencode was read out of a working reference implementation
(`github.com/ibraheem-111/opencode-swarm`, full source read 2026-09-28) or verified locally.

## Read in this order

| # | Document | Answers |
|---|---|---|
| 01 | [architecture.md](01-architecture.md) | What the pieces are and how data flows |
| 02 | [orchestration.md](02-orchestration.md) | The exact run algorithm, delivery semantics, limits |
| 03 | [data-model.md](03-data-model.md) | SQLite schema and why each column exists |
| 04 | [plugin-contract.md](04-plugin-contract.md) | The agent-facing tools and their rules |
| 05 | [workspace-isolation.md](05-workspace-isolation.md) | The hard constraint: one worktree per agent |
| 06 | [evidence.md](06-evidence.md) | Verdicts, receipts, and refusing to be lied to |
| 07 | [operations.md](07-operations.md) | CLI, MCP surface, events, bounded waits, server lifecycle |
| 08 | [testing.md](08-testing.md) | What must be proven, and how, without a model |
| 09 | [implementation-plan.md](09-implementation-plan.md) | Ordered build steps with exit criteria |
| 10 | [reference-findings.md](10-reference-findings.md) | What the reference taught us, including its own traps |

## The four things that make this VIVIM's and not a copy

1. **An isolated git worktree per agent, allocated before its session exists.** The reference
   spawns every session in one directory. That is the failure mode this whole repository's
   workspace protocol exists to prevent. See `05`.
2. **An explicit evidence bar and a `CONFIRMED | REFUTED | UNRESOLVED` verdict per agent.**
   `UNRESOLVED` is a first-class, recorded outcome. See `06`.
3. **Receipts committed to the repository.** The SQLite DB is runtime transport and is
   gitignored; the durable record is markdown a fresh Steward can read. See `06`.
4. **No multi-agent work may share a checkout, ever** — enforced by allocation, verified, and
   re-verified before a session is created. See `05`.

## Current state

Already built and verified (9/9 tests, plus a live allocation against the real repository):

- `runtime/src/db.ts` — SQLite store
- `runtime/src/bus.ts` — message bus with exactly-once delivery
- `runtime/src/workspace.ts` — worktree allocation, delegated to the repository's existing
  reviewed allocator, with isolation proof
- `runtime/test/runtime.test.ts`

Not yet built: the orchestrator, the plugin, the CLI, the team declaration. See `09`.

## Non-goals

Not a fork of opencode. No vector/semantic memory (substring + tags is enough at v1). No
cross-machine swarms. No TUI. No second task manager, ontology or authority store — the
repository already has those, and duplicating them is the documented "parallel bureaucracy"
failure. A tool earns its place only by reducing repeated cost, raising evidence quality, or
accelerating delivery.
