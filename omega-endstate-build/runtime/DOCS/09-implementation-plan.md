# 09 — Implementation Plan

Ordered. Each step has an exit criterion that is **observable**, and no step begins until the
previous one is demonstrated rather than asserted.

Steps 0 is done. Steps 1–2 are corrections to existing code found while writing these docs.
Steps 3–7 are the build.

---

## Step 0 — Evidence, design, isolation primitives · **DONE**

- Reality audit of Ω and the seed corpus; the `provider-browser` duplicate-binding defect; the
  stale-gate finding; the browser↔chat seam. (`state/REALITY-AUDIT-STEW-01.md`)
- Evidence-based roadmap. (`roadmap/ROADMAP-V1.md`)
- Runtime architecture. (`design/RUNTIME-DESIGN-V1.md`, superseded by `runtime/DOCS/`)
- `db.ts`, `bus.ts`, `workspace.ts` + 9 passing unit tests.
- Worktree allocation verified live against the real repository, then retired cleanly.

**Exit:** met. 9/9 tests; live allocation proven.

---

## Step 1 — Fix `db.ts` against the reference findings

Two concrete defects, both found by reading a working implementation:

1. **Missing `PRAGMA busy_timeout = 5000`.** The DB is written by the in-process plugin *and* the
   external orchestrator. Without it, concurrent writers get `SQLITE_BUSY`.
2. **`upsertAgent` clobbers omitted fields.** It overwrites every column with whatever the caller
   passed, so a partial update erases fields the caller did not mention. Correct form is
   `COALESCE(?, <existing col>)` bound to the **raw parameter**, not `excluded.col` — because on
   insert the default status is `'created'` and `excluded.status` would carry that default into
   the conflict branch and reset a running agent.

Also add additive `migrate()` on open.

**Exit:** a test proves a partial `upsertAgent({status})` preserves `sessionId` and `workspace`.

---

## Step 2 — Add `runtime/swarm.json` and the two missing accessors

- `swarm.json` declaring the four real agents with their real F0/F1 tasks, tool maps and evidence
  bars (content already drafted; re-derive from the roadmap).
- `Store.findAgentBySession(sessionId)` — indexed; the plugin's identity lookup. Without it an
  agent cannot be identified, and without identification an agent could impersonate a peer.
- `Store.memoryList(runId)`.

**Exit:** a test proves session→agent resolution is unambiguous and that a non-swarm session id
resolves to nothing.

---

## Step 3 — The plugin

`runtime/plugin/vivim-swarm.ts`, per `04-plugin-contract.md`. Tools: `memory_set/get/search/list`,
`send`, `inbox` (read-only), `roster`, `receipt`.

Hard constraints to honour: export the plugin and nothing else; never throw into opencode; resolve
identity from `ctx.sessionID`; validate recipients; lazy DB.

**Exit:** `bun build` succeeds; a unit test of each tool's pure logic (validation branches)
passes; the module's export list is asserted to be exactly one export.

---

## Step 4 — The orchestrator

`runtime/src/orchestrator.ts`, per `02-orchestration.md`. `SessionClient` as a structural type.
Sequential allocation → sequential session creation → **concurrent** blocking prompts, limited by
`maxConcurrent`. In-loop delivery, final sweep, ping-pong guard, 3× quadratic retry, wall-clock
budget, containment, resume.

**Exit:** the 9 unit tests in `08-testing.md` pass with the fake client and no network. This is
the step that proves the runtime works; do not proceed to a live run before it does.

---

## Step 5 — Evidence layer

`runtime/src/evidence.ts`: verdict parsing and validation, per-agent receipt writing, run report,
`UNRESOLVED` defaults for a missing verdict or an expired budget.

**Exit:** a run with a deliberately mute agent produces a receipt with `UNRESOLVED` and a stated
reason, not a pass.

---

## Step 6 — CLI and events

`runtime/src/cli.ts`, per `07-operations.md`. `run|status|logs|send`, JSONL events with the
`cli-exit` sentinel, result JSON on stdout, exit 0 only when every agent completed,
`process.exit` backstop.

**Exit:** `status` and `logs` work against a completed run; the events file ends with `cli-exit`;
a partial run exits 1.

---

## Step 7 — The first real run

The actual point of the runtime: run the four F0/F1 agents concurrently, each in its own
worktree, and produce committed receipts.

Preconditions: steps 1–6 green; **a long-lived `opencode serve` already running and
preconfigured with the plugin and `VIVIM_SWARM_DB`** (we do not use the reference's owned-server
path — its `process.kill(-pid)` teardown is not Windows-safe, see `07`); the plugin confirmed
loaded in that server; port free of stale servers; model available and free-tier.

Sequence:
1. Dry-run allocation only — no sessions — and inspect the four worktrees.
2. Run with `maxConcurrent: 2` first. Two agents proves the mechanism at half the blast radius.
3. Then all four.
4. **The Steward then independently re-verifies each `CONFIRMED` before believing it.** Any
   `CONFIRMED` that cannot be re-derived is operationally `UNRESOLVED`.
5. Commit receipts, the run report, and any `SELF-PROPOSAL.md` the agents produced.
6. Retire the worktrees after review.

**Exit:** four receipts committed, verdicts recorded, and at least one agent's work independently
re-derived by the Steward. If no agent returns evidence, the runtime is not doing its job and
that is the finding.

---

## Explicitly deferred

- `runtime/src/mcp.ts` (MCP surface) — valuable for driving swarms from the Steward, but not
  needed for step 7. Build it when the Steward needs to launch a run without blocking.
- The allocator nesting fix (`05`) — a change to a shared reviewed script; own commit, own review.
- Cross-run memory, vector search, a TUI, automatic worktree retirement.
- Anything that presumes self-healing. Roadmap F2 forbids designing that before real drift is
  observed.

## Risks

| Risk | Mitigation |
|---|---|
| Free model flakiness / provider 500s | 3× retry; a failed agent is contained, not fatal. |
| The plugin fails to load and agents cannot coordinate | Symptom: run completes but no messages. Check: does `swarm_agents` work? The e2e test is designed to catch exactly this. |
| Four agents on a free local model saturate the machine | `maxConcurrent: 2` first. |
| An agent commits to the wrong branch | Isolation is allocation-enforced and the branch is in the receipt; the Steward reviews before integrating. |
| Wall-clock budget too tight for slow agents | Deliberately too strict, then extend. Never unbounded. |
| Long-lived server lacks the plugin | Symptom is a run that completes with no messages and no memory hits. Assert the tools are present, not that the run succeeded. |
| Stale server answers after a "restart" | Config is read at boot only. Confirm the port is free, restart, then read back the resolved config. |
| We ship a runtime whose own metrics are stale | The same discipline applies to the runtime: re-derive, record the date, never cite an inherited number. |
| Core divergence silently rots | We own the execution semantics, so equivalence with the reference must be *tested*, not assumed. See `11`. |
