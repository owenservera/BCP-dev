# Full-System Test — Gaps and Prep

> Date: 2026-09-28 · Baseline: `main` @ 9348c2ec (Gate B passed)
> Companion: `AUTONOMOUS-TEAM-ARCHITECTURE-2026-09-28.md` (the design under test).
> Purpose: everything missing before the full system — team + workers + sessions +
> transports + tools — can be exercised end to end, and the exact prep for each.

## Proven already (do not re-prove)

- 11/11 agents load on opencode 1.18.4; Steward primary/`task:true`, CFAs
  subagent/`task:false`. (`agent list`, `debug agent`, `debug config`.)
- Commons suite 6/6 incl. 10-point v0 across two runtimes, Git transport.
- 3-agent parallel-spawn drill, 3/3 reports verified vs repo.
- Name-scoped spawn gating: TESTED 2026-09-28 — object-valued `task` permission
  (`{work-*: allow, *: deny}`) resolves to `task:false` on 1.18.4. Per-name
  scoping is unavailable; spawn control is on/off per agent, work-scope stays
  prompt-level. (Transient probe file used and deleted; tree clean.)

## Gaps (each blocks a named test)

1. **Worker catalog files don't exist.** Five `work-*` bindings + catalog register
   are designed (§5 of companion) but unwritten. Blocks: any 3-tier test.
2. **CFA spawn flip unverified.** Delegation amendment (CFAs may spawn `work-*`
   leaves) needs the `tools.task:false` → allowed change plus a live spawn proof:
   one CFA spawning one `work-scout` and consuming its output. Until then the
   amendment is text, and the current `task:false` remains the enforced truth.
3. **Two-process proof missing.** Two shells × full teams × shared remote exchange
   (rooms, DMs, handoffs across a process boundary) not yet run. Blocks: honest
   realtime/multi-session claims.
4. **Two-host proof missing.** Same as (3) across machines. Blocks: partition,
   clock, loss-recovery, and key-custody realism claims. No second machine is
   available; stays gated.
5. **Rotation operation missing.** Drill stays BLOCKED (CFA-04). Blocks: custody
   part of full-system proof.
6. **Daemon missing.** No roster row, home, or loop. Blocks: presence continuity,
   attention scheduling, A2A-live heartbeat carrier.
7. **A2A-live + MCP mesh missing.** Adapter, cards, SSE conformance, four servers
   with manifests/redaction/budgets. Blocks: tool-rich + realtime proof.
8. **Waiting policy missing.** TTLs, contention rule, detach convention,
   STATUS-progress, human door, runaway bounds, team view. Blocks: multi-wave
   autonomy beyond single-goal demos.
9. **CFA-11 counters manual.** Tripwires not computed. Blocks: evidence-driven
   integrity decision (not urgent).

## Prep (in dependency order — each is one bounded task)

- **P1. Write worker catalog** (owner: Steward; verify: `agent list` shows 5
  `work-*` subagents with no spawn rights; accept: leaf files resolve
  `task:false`, catalog registered, delegation amended for CFA→leaf spawning).
- **P2. CFA spawn proof** (owner: Steward + one CFA; verify: CFA session spawns
  `work-scout`, consumes output, receipt cites it; accept: output verified by
  CFA against repo before promotion).
- **P3. Two-process exchange script + run** (owner: CFA-10; verify: 10-point
  exchange across two shells/same machine; accept: same bar as v0 test plus
  cross-process attention/handoff visible in both inboxes).
- **P4. Rotation op + drill** (owner: CFA-04; accept per SETUP-REQUIREMENTS item 2).
- **P5. Waiting policy file + scenario tests** (owner: Steward draft, CFA-04/09
  ratify; accept per SETUP-REQUIREMENTS item 7).
- **P6. Daemon registration + loop** (owner: CFA-10; accept per item 5: kill-daemon
  test proves correctness never depended on presence).
- **P7. A2A-live + MCP mesh** (owner: CFA-10/CFA-04; accept per items 4+6, incl.
  mid-test channel-kill fallback proof).
- **P8. Counters automation** (owner: Steward; accept: second session reproduces
  counts from digest alone).

## Full-system acceptance bar

The system is fully tested when: P1–P3 + P5 green on one machine (proves team,
workers, sessions, waiting), P4 green (proves custody ops), P6–P7 green incl.
fallback legs (proves realtime+tools without depending on them), every falsifier
in the architecture doc holds, and the only remaining open item is P-gated
two-host proof. Report DONE only via the Durable Completion Gate; anything less
is PARTIAL with the missing prep item named.
