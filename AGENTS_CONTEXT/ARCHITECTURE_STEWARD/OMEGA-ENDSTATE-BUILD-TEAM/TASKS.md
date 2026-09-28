# Ω End-State Build Team — Tasks

> Status: ACTIVE — runtime substrate proven; product frontier not yet started
> Owner: Ω End-State Build Team
> Branch: `work/omega-endstate/STEW-01/bootstrap-team`
> Canonical active task state: `omega-endstate-build/`
> Last reconciled: 2026-09-28

This file is a durable cross-session status pointer, not the working queue. Read paths, not prose,
and work from `roadmap/ROADMAP-V1.md` for sequencing.

## Seed bootstrap tasks

| ID | Task | State |
|---|---|---|
| OEB-0001 | Understand Ω and the end state | **DONE** — `state/REALITY-AUDIT-STEW-01.md`, `state/STEWARD-VIEW-STEW-01.md` |
| OEB-0002 | Design the team's development operating system | **IN PROGRESS** — see OEB-0005 |
| OEB-0003 | Form the complete-product roadmap | **DONE** — `roadmap/ROADMAP-V1.md` |
| OEB-0004 | Select the first end-state build frontier | **DONE** — F0, per `decisions/STEW-D-001-browser-live-parser-reconciliation.md` |

## Open — runtime substrate

### OEB-0005 — Stand up a proven parallel multi-agent runtime
Vendored and Windows-adapted the reference `opencode-swarm` core.
Typecheck clean; unit suite 50/50 (was 46/50, 3 `EBUSY`). Evidence and a
withdrawn false claim: `state/SWARM-CORE-VALIDATION-STEW-01.md`.

Remaining, in order:
1. Re-run `runtime/scripts/validate-swarm.ps1` to confirm the plugin actually
   loads and `swarm_*` tools are callable under `tools: {"*": false}`. The
   first run was invalid as a plugin test; this is the correction.
2. Confirm **turn-boundary message delivery** between two live agents. This is
   the central mechanism of the whole design and is still unverified.
3. Decide the `writeReport` defect: `Bun.write` is un-awaited before
   `process.exit()`, so reports land 0 bytes. Patch the vendored copy or make
   `--json` the authoritative record.
4. `opencode/space-bunny-free` reports zero cost, so `budgetUsd` can never trip.
   Any spend ceiling needs an outer guard (turn count, wall clock, or tokens
   from `agent-turn-done`).
5. Build the layer the core does not provide: evidence verdicts
   (`CONFIRMED | REFUTED | UNRESOLVED`) and committed receipts, per
   `runtime/DOCS/06-evidence.md`. First agents read-only.

### OEB-0006 — Retire superseded runtime work
`runtime/src/{db,bus,workspace}.ts` predate the decision to adopt the
reference core. `workspace.ts` (per-agent worktree isolation) is unused under
the one-directory decision and its premise — never share a checkout — is now
carried by policy: first agents are read-only. Reclaim or delete rather than
leave two competing stores. See `runtime/DOCS/11-bootstrap-reconciliation.md`.

## Open — product frontier

### OEB-0007 — Execute F0
Not started. `provider-browser/src/live.ts` declares `parseChatGptStream`
twice, so the browser module does not load and the composition's own M0
falsifier is red. Introduced by `4d34a611`; present on `origin/main`, so it is
**not** branch-local. The recorded 1418-green gate predates the break and is
stale. Execute `decisions/STEW-D-001-browser-live-parser-reconciliation.md`,
re-derive the real baseline, and add a guard against duplicate module-scope
bindings.

## Standing constraints

- **Never terminate by process image name.** It killed the owner's TUI sessions
  and a Steward session. Exact recorded PIDs only, and success is the observable
  end-state, not the kill command's exit code.
- **Never block the Steward session.** Detach, poll in short increments, set
  explicit timeouts, and write a completion marker.
- **Do not cite inherited metrics.** Re-derive the baseline on this tree.

## Rules

Unfinished work must not depend on chat history. The team may delete, split,
reorder, merge or replace these tasks once it understands the problem better.
No current P1/CFA queue is automatically imported.
