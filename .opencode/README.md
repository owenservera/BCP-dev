# `.opencode/` — Phase 1 harness pack

> Status: PARKED GREEN — 2026-09-27. Rebased onto `origin/main` 95bbfea3, suite
> 6/6 green after rebase. No further sandbox work until the resume conditions
> below hold; `main` is mid-flight (Stage-E L2 wave across CFAs) and this track
> must not compete with it.
>
> Resume when ALL of: (1) the strategic-roadmap round on `main` has reconciled
> (central synthesis DONE or explicitly parked); (2) two live hosts exist for
> genuine two-host v0/adapter evidence, or the roadmap yields concrete
> capability/tool requirements for Phase 3; (3) owner says go. Then: rebase,
> re-run suite, start Phase 3 (A2A-live adapter + presence loop + MCP mesh).

> Produced by `AUTONOMOUS-AGENTIC-TEAM-DESIGN-2026-09-27-v2.md` §14. Sandbox-only:
> place on `exp/local-theory-sandbox`, not `main`. No runtime, Ω law, or Commons
> semantic change is made by adding these files.

## What's here

- `opencode.json` — root wiring: default agent, cold-start instructions, three loop
  commands (`commons-sync`, `attention`, `receipt`) that call the *existing*
  `AGENTS_CONTEXT/AGENT-COMMONS/runtime/src/cli.ts` and the *existing*
  `SESSION-RESULT-CONTRACT.md` — no new mechanism.
- `agents/architecture-steward.md` — the Steward as the one primary/orchestrator.
- `agents/<agent_id>.md` × 10 — one per ratified CFA, named by its Commons `agent_id`
  (see `AGENTS_CONTEXT/AGENT-COMMONS/PEER-ROSTER.md`), `mode: subagent`, each a thin
  binding that points the session at its own `CORE-AGENT.md`/`STATE.md`/`TASKS.md`
  rather than duplicating identity content.
- `command/*.md` — the same three loop commands as standalone command files, for
  opencode versions/UIs that read `.opencode/command/` directly.

## Verification record (sandbox, 2026-09-27)

Proven against the actual installed toolchain — no longer open questions:

1. **Config-key and permission-schema fit — ANSWERED for the flat form.** `opencode
   agent list` shows all eleven agents (`architecture-steward` as primary, ten CFAs
   as subagents); `opencode debug config` resolves the CFA bindings with mode,
   permissions and prompt intact. The singular top-level `"agent"` key, the flat
   per-tool `permission` object, `mode`, `description` and `tools` are all accepted
   by installed opencode 1.18.4 (verified via `agent list` + `debug agent` +
   `debug config`, no model calls). The ordered `permissions`-array schema from v2
   docs was **not** needed and remains untested — it only becomes relevant if we
   ever want name-scoped spawn gating, which is future work.
2. **Spawn-direction enforcement — MECHANICAL (verified).** `debug agent`
   resolution shows the ten CFAs with `task` denied (`tools.task: false` honored)
   while the Steward resolves `task: true`. CFAs *cannot* spawn; only the Steward
   can. What remains procedural (not mechanical) is only the *name list* — nothing
   stops the Steward invoking the Task tool against a twelfth name. That residual
   is accepted: the delegation text + roster-reconciliation stop rule cover it.
3. **Commons runtime tests — GREEN (5 pass, 0 fail, `bun test`, bun 1.3.14).**
   Two test-only fixes were required, both on the sandbox: the roster duplicate
   test was missing a newline before its appended row (source detection was
   correct — the test never exercised it), and the two git-remote smoke tests
   needed explicit timeouts (60s/120s; the 5s default is too tight for Windows git
   spawns — the exchange test alone takes ~19s here). No runtime source change.
4. **Phase 2 v0 completion — GREEN (6 pass, 0 fail across 3 files, `bun test`,
   2026-09-27).** New `runtime/test/v0-completion.test.ts` proves all ten
   roadmap points with two independent runtimes (separate identities, homes,
   clones) through `GitBranchTransport` against a shared bare remote: stable
   identities, separate signed streams, Git sync, public-feed discovery, room
   creation, in-room exchange, deterministic DM id, replay equivalence, duplicate
   tolerance, raw-history preservation under derived inbox/context views. ~54s on
   Windows; explicit 180s timeout. No runtime source change — test-only addition.

## What was deliberately left out

- No `mcp` block: `mcp-machine`, `mcp-web`, `mcp-memory` are Phase 3 and no server of
  those names exists in the repository. An absent block is more honest than a stub
  pointing at nothing.
- No A2A adapter wiring: also Phase 3.
- No changes to any `CORE-AGENT.md`, `STATE.md`, or `TASKS.md` inside a CFA home —
  those remain each CFA's own, per `/AGENTS.md`.
