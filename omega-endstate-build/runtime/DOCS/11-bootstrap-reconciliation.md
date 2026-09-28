# 11 — Reconciling the "Generic OpenCode Swarm Bootstrap" proposal

> Source: `origin/work/generic-opencode-swarm-bootstrap` @
> `AGENTS_CONTEXT/OPENCODE-SWARM-BOOTSTRAP/` (14 documents).
> Read 2026-09-28. This document records what we take, what we decline, and why.

## What that workstream proposes

Its prime directive is the **opposite** of ours:

> **Do not redesign the reference swarm core.**

It freezes the whole reference implementation and adds exactly one thing: a **generic bootstrap
layer** that takes an objective plus constraints and *designs the team*, then projects the result
into a stock `swarm.json` that the unmodified reference `validateConfig()` / `runSwarm()` accept.

```
objective + constraints + context
        -> bootstrap designer -> propose team -> inspect/refine -> bounded iteration
        -> concrete swarm.json -> EXISTING swarm core
```

Its explicit no-go list is disciplined: no new execution semantics, no second database, no new
transport, no recursive swarm hierarchy, no fixed role taxonomy, no truth authority, no provider
lock-in.

Its `10-REFERENCE-AUDIT-CAVEATS.md` is a genuinely excellent second-pass audit of the reference —
15 findings, several of which independently confirm corrections I had to make the hard way, and
seven of which are new to me. See `10-reference-findings.md` for the merge.

## Where we agree completely

Their audit independently confirms the three corrections that invalidated my first design:

- **"Push" is turn-boundary delivery, not a watcher.** Their words: *"The implementation does not
  contain a continuously running bus watcher… automatic delivery at turn boundaries plus final
  sweep."* Identical to my conclusion from reading `orchestrator.ts`.
- **Agent identity comes from the persisted `session_id` lookup, not `OPENCODE_SWARM_AGENT`.** The
  dated design doc claims the env var; the implementation does the session lookup. I chose the
  session lookup from the code; they caught that the *documentation* disagrees.
- **The `round: -1` fixture is stale.** Their instruction: *"Treat the executable implementation
  and current tests as authoritative; keep fixtures under review rather than designing new
  semantics around the stale sample."* Exactly the conclusion I reached, reached independently.

Their audit also confirms the `permission.updated` (not `permission.asked`) event name, the single
seven-tool coordination set, the single-machine scope, and the soft nature of `budgetUsd`.

## What we take from them

1. **The bootstrap-layer idea, at the right altitude.** A generic engine that derives a team from
   an objective rather than a hand-written roster is a real contribution and something we do not
   have. It also matches the owner's instruction that team topology should "emerge from actual
   workload" — a bootstrap layer *is* that mechanism, made repeatable.

   Adopted in a narrowed form: our `swarm.json` is generated from a documented rationale, and the
   quality questions in their `02` (what work must exist, what is genuinely parallel, what
   requires distinct contexts, what must flow between participants, is the team larger than
   necessary, is anything missing) become our team-design rubric in `09`.

2. **The seven new audit facts.** Merged into `10-reference-findings.md`.

3. **The Windows operating model**, which corrects a real error in my plan. See below.

## Where we diverge, and why

Their core is frozen, which means three of our four divergences are *out of scope by their own
rules*:

| Our divergence | Why it is impossible under their directive |
|---|---|
| Isolated git worktree per agent | Needs to change the run loop, and `09` forbids new transport. Their layer only designs teams; it never touches where sessions run. |
| Evidence bar + `CONFIRMED/REFUTED/UNRESOLVED` | Needs `plugin/swarm.ts` to grow a `receipt` tool and the agents schema to grow a verdict column. Both frozen. |
| Receipts committed to the repository | Needs the runner to write markdown into the tree. Frozen. |
| Self-evolution proposals | Needs a tool and a ledger write path. Frozen. |

That is the crux, and it should be stated plainly rather than glossed:

> **Their workstream does not satisfy the owner's hard constraint.** The owner made it
> non-negotiable that concurrent autonomous agents never share a checkout. Every agent in a
> reference-core swarm runs in one project directory. A bootstrap layer that picks a nicer roster
> for a team that all share one directory is a better-organised data race.

So we keep our divergences. The trade is real and we should not pretend otherwise: by not freezing
the core we take on the maintenance cost of an owned fork of the execution semantics, and we must
keep proving equivalence with the reference or the divergence will silently rot.

## What we adopt from their Windows work — and it fixes a real error

Their `12-WINDOWS-OPERATIONS-GUIDE.md` §10 asserts, and I verified the source:

```ts
// opencode-swarm/src/runner.ts
detached: true,
proc.unref(),
process.kill(-proc.pid, "SIGTERM"),   // POSIX process-group signalling
process.kill(-proc.pid, "SIGKILL"),
```

`process.kill(-pid)` is POSIX process-group signalling. **Windows has no POSIX process group** and
Bun/Node do not give negative-PID semantics there. The reference's owned-server teardown is
therefore not Windows-safe, and our own earlier Windows experience is consistent with that: the
launcher PID is not the listener PID, and killing the launcher left a live server holding the
port.

**This changes our plan.** My orchestrator was going to spawn its own server and tear it down.
On Windows it must instead use the reference's *external server* path:

```
opencode serve --hostname 127.0.0.1 --port 4096     # started explicitly, long-lived
swarm run swarm.json --server http://127.0.0.1:4096 # does not own it, does not kill it
```

Three operational consequences we must build for, all from their guide:

1. **A long-lived server must be preconfigured with the plugin.** `--server` only changes where
   the SDK client connects; it does **not** inject the plugin or the DB env into that server. So
   `VIVIM_SWARM_DB` must be set on the *server* process, and the plugin must already be loaded
   there. (Their §5, §6.) This is precisely the mistake I made earlier: I edited
   `.opencode/opencode.json` chasing plugin loading. With a long-lived server, that config is
   read **once at boot**, which is why my "restart and it still shows the old config" observation
   happened.

2. **`swarm_wait` is process-local.** Their §6: the MCP server keeps active run promises in an
   in-memory `Map`. `swarm_status` and `swarm_logs` read persisted state and survive a restart;
   `swarm_wait` can only await a promise held by the *current* process. Persistence covers state
   and results, not an immortal in-process await handle. Our bounded-wait design must not assume
   otherwise.

3. **A Windows upstream caveat that plausibly explains our own server death.** Their §11: an
   attached TUI can cause a Windows `opencode serve` to terminate with `STATUS_CONTROL_C_EXIT` on
   certain interrupt/exit paths (reported on 1.18.16; we run **1.18.4**). Escape and Ctrl+C are
   implicated; Ctrl+X / Q is the workaround. So after any TUI interrupt, check
   `curl http://127.0.0.1:4096/global/health` before trusting the server. We have not verified
   whether 1.18.4 is affected — treat it as unverified and check the health endpoint.

Also adopted: `OPENCODE_SERVER_PASSWORD` when binding beyond loopback (we bind `127.0.0.1`, so we
do not need it, but it belongs in the guide); forward slashes in JSON paths on Windows; WSL
translation rules; and the fact that the reference's release packaging is Linux-only
(`opencode-swarm-<version>-linux-x64.tar.gz` with Unix shell tooling), so a Windows install is
`bun install && bun link` from a checkout, not a binary drop.

## One more thing they caught that we had wrong

Their §7: **resume takes a config file independently of the stored config, with no version
reconciliation.** The orchestrator skips agents already `done` *by name*, but a changed config can
alter the roster, tasks, models, tool maps, rounds and budgets — and persisted agent rows absent
from the new config are never deleted. So a resume after an edit silently runs a different swarm
than the one recorded.

Our receipts record the config per run, which makes this detectable. But the runtime must also
*refuse* a resume whose config differs from the stored one unless explicitly acknowledged, or
"resume" becomes a way to quietly change the meaning of a run. That is now a design requirement,
not a nicety.

## Net position

| | Their workstream | Ours |
|---|---|---|
| Team design | generic bootstrap from an objective | hand-declared per frontier, with their rubric adopted |
| Execution core | frozen reference | owned, with divergence justified per item |
| Workspace isolation | not addressed | enforced, verified, non-negotiable |
| Evidence discipline | not addressed | verdict + committed receipts |
| Windows | solved, carefully, and it corrected us | adopting their model |

We are not competitors. Their bootstrap layer is the better answer to "who should be on the team",
and our runtime is the better answer to "where do they work and what must they prove". The owner
needs both, and the honest ordering is: **isolation and evidence first, generic team design once
there is real workload to generalise from** — a bootstrap layer designed against a four-agent
roster would generalise from a sample of one.
