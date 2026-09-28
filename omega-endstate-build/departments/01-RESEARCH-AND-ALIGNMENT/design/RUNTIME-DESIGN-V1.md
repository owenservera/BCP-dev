# Runtime Design V1 — VIVIM end-state team runtime

> **SUPERSEDED 2026-09-28 by `omega-endstate-build/runtime/DOCS/`.**
> Read that set instead. This document was written before the opencode API was verified, and
> three of its claims turned out to be wrong: that `session.prompt` is non-blocking (it blocks
> for the turn), that server config should be edited into `.opencode/opencode.json` (it must be
> injected per-spawn via `OPENCODE_CONFIG_CONTENT`), and that message delivery needs an external
> idle-detecting watcher (it is a bounded loop inside each agent's own turn sequence).
> Kept for lineage. The corrections are itemised in
> `runtime/DOCS/10-reference-findings.md`.


> Agent: STEW-01
> Date: 2026-09-28
> Status: APPROVED DIRECTION — build VIVIM's own, on the opencode-swarm architecture
> Reference studied: `github.com/ibraheem-111/opencode-swarm` (cloned, read, not depended on)
> Authority: branch-local design for `team/omega-endstate`

## 1. Why this exists

STEW-01 must run independent work units concurrently without ever blocking its own session.
The repository's own delegation prose (`OWNER-DELEGATION.md`) was written for a ChatGPT-webapp
operating model, not for opencode. It is evidence about *why* a standing delegation is needed,
not an implementation to copy.

`opencode-swarm` demonstrates the actual opencode-native mechanism. I am adopting that
architecture, and deliberately diverging where VIVIM's constraints demand it.

## 2. Adopted from the reference (and why it is right)

1. **opencode's official plugin system, not a fork.** Custom tools registered in-process.
   Survives upstream upgrades; no maintained fork.
2. **A standing `opencode serve` + `@opencode-ai/sdk` over HTTP.** Sessions are driven over
   the API, so boot cost is paid once rather than per agent.
3. **One session per agent, prompts run concurrently.** That is the parallelism.
4. **A SQLite bus for messages + shared memory + agent state**, WAL mode, safe for the
   in-process plugin and the external orchestrator.
5. **Push delivery between turns.** The orchestrator watches the bus and sends a *follow-up
   prompt* to the target's session. From the agent's view this is push.
6. **Least privilege via a per-agent `tools` map**, not per-agent config files.
7. **Bounded waiting as a primitive**, plus a ping-pong round guard and a concurrency cap.
8. **A failed agent is recorded, not fatal.** Transient errors retry with backoff; a terminal
   failure marks that agent failed and the run continues.

## 3. Divergences — what VIVIM requires and the reference does not provide

These are not "improvements". They are constraints from the owner and the audit.

### 3.1 An isolated git worktree per agent *(hard constraint)*

The reference spawns sessions in one working directory. That is unacceptable here: concurrent
autonomous agents in a shared checkout is the failure mode the whole workspace protocol exists
to prevent.

**Divergence:** the orchestrator allocates a worktree per agent through the existing
`New-AgentWorkspace.ps1`, on branch `work/omega-endstate/<AGENT-ID>/<TASK>`, based from the
**remote** `team/omega-endstate` tip, refuses to reuse an existing branch or path, and records
a manifest plus a registry entry. A session may only be created after its workspace exists.
Workspace allocation failure fails that agent, not the run.

### 3.2 Evidence discipline *(the team's highest-frequency failure)*

The first real failure in this project was believing a four-day-old generated artifact
(`status.json`, 1418 green) that a later commit had invalidated. See
`state/REALITY-AUDIT-STEW-01.md` §3.

**Divergence:** agents carry an explicit **evidence bar**, and the runtime records for each
result: the command run, toolchain version, git SHA, and a verdict from
`CONFIRMED | REFUTED | UNRESOLVED`. `UNRESOLVED` is a legitimate, recorded outcome.
A run is not "done" because a subagent said so; the Steward verifies against the repository.

### 3.3 Durable state in the repository, not only in SQLite

SQLite is runtime transport. It is gitignored and disposable. Anything a fresh Steward must
know has to be reconstructable from committed files.

**Divergence:** the runtime writes a **receipt** per agent into the repository
(`omega-endstate-build/runs/<runId>/RECEIPT-<agent>.md`) containing identity, workspace,
branch, base SHA, task, evidence, and verdict, plus a run-level `RUN.md`. A run whose receipts
are not committed is not a durable result.

### 3.4 Self-evolution as a first-class path

Agents must be able to propose changes to their own scope and to the team shape, and the
Steward must be able to accept or reject with reasons.

**Divergence:** every agent may write a `SELF-PROPOSAL.md` into its run directory proposing
(a) a tool it kept hand-rolling, (b) a scope drift it noticed, (c) a role that should be
split, merged, created, or retired. Accepted proposals mutate
`omega-endstate-build/team/AGENT-ROSTER.json` and `team/ROSTER-LEDGER.md` with a recorded
reason. An organisation that can only grow has stopped learning.

## 4. Non-negotiable operational constraints learned the hard way

These are enforced in code, not left to memory.

- **Never terminate by process image name.** A blanket `Get-Process -Name opencode | Stop-Process`
  destroys the owner's interactive sessions. Only ever stop PIDs the runtime itself recorded.
- **The launcher PID is not the listener PID.** `opencode serve` spawns a child that binds the
  port. Record the listener, and target that.
- **Never trust an exit code.** A documented opencode trap yields exit 0 with zero-byte stdout.
  Completion is judged by observed output, not the code.
- **`mode: subagent` cannot be a headless entry point.** `opencode run --agent <subagent>`
  silently falls back to `default_agent` — in this repository, the *mainline* Architecture
  Steward. Results produced that way ran under the wrong identity and are unusable.
- **Never block the Steward session.** Every wait is bounded. Long work is detached and polled.
- **stdout redirection is not a message bus.** Buffered output made me conclude a run was
  silent when it was merely unflushed. Comms go through the bus.

## 5. Architecture

```
omega-endstate-build/runtime/
  swarm.json              team declaration: agents, tasks, tools, evidence bars
  plugin/vivim-swarm.ts   opencode plugin: shared memory, send/inbox/roster tools
  src/db.ts               SQLite schema (WAL): memory, messages, agents, runs
  src/bus.ts              message bus: post, deliver, pending
  src/workspace.ts        worktree allocation + manifest (wraps New-AgentWorkspace.ps1)
  src/orchestrator.ts     spawn sessions over @opencode-ai/sdk; push bus messages
  src/receipt.ts          evidence + receipt writing
  src/cli.ts              run | status | logs | wait | send
  test/                   unit tests, no network
```

Data flow for one run:

```
Steward -> `vivim-swarm run swarm.json`
  -> allocate worktree per agent (isolated, owned branch)
  -> create one opencode session per agent, prompts concurrent
  -> agents work; may read/write shared memory; may message peers
  -> on turn end, pending messages for that agent are delivered as a follow-up prompt
  -> agent finishes -> receipt written with evidence + verdict
  -> run report: RUN.md + per-agent receipts + full message/memory log
  -> Steward verifies receipts against the repository before believing anything
```

## 6. Team declaration (initial)

Four agents, each justified by an observed bottleneck rather than an org chart. Per-agent
`tools` maps are least privilege.

| Agent | Scope | Tools | Why it earns its place |
|---|---|---|---|
| `stew-01` | route, evidence standards, integration, team evolution | full | the Steward |
| `base-01` | re-derive current truth; rule on stale artifacts | read, glob, grep, bash | the stale-metric failure needs a permanent counterweight |
| `arch-01` | mine legacy VIVIM + prior Steward branches for discarded designs | read, glob, grep, bash | that corpus is unread and contains dead ends with recorded causes |
| `ver-01` | independent falsification; may block a run | read, glob, grep | a Steward that verifies its own work is not verifying |
| `seam-01` | competing designs for the browser↔chat seam (F1) | read, glob, grep | the core product question; read-only by design |

`ver-01` is **not** the author of any claim it verifies, and forms its own conclusion before
reading the author's reasoning.

## 7. Self-evolution

- **Agent level:** `SELF-PROPOSAL.md` in the run dir; Steward accepts/rejects with a reason.
- **Steward level:** if a role recurs, a context keeps being reloaded, work parallelises
  safely, or a bottleneck appears, that is the *only* evidence that justifies a new role.
- **Roadmap level:** a change trigger in `roadmap/ROADMAP-V1.md` firing means the roadmap is
  rewritten, not defended.
- **Ledger:** `team/ROSTER-LEDGER.md` records every create/change/retire with its reason, so a
  later Steward can see how the organisation was shaped by evidence rather than inherited.

## 8. Explicit non-goals

- Not a fork of opencode. Not vector/semantic memory (substring + tags is enough at v1).
- Not cross-machine swarms. Not a TUI.
- Not a second task manager, ontology, or authority store — the repository already has those.
- Not a parallel document bureaucracy. A tool earns its place only by reducing repeated cost,
  raising evidence quality, or accelerating delivery.

## 9. Success criterion

A run where two or more agents work genuinely concurrently, each in its own isolated worktree,
communicating through the bus, each returning a receipt with an explicit verdict and evidence
that the Steward can independently re-verify — and the whole run reconstructable from committed
files by a fresh Steward.
