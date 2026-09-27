# Remaining Setup Work — Autonomous Agentic Team

> Date: 2026-09-27 · Branch: `exp/local-theory-sandbox` (parked green)
> Companion: `SETUP-REQUIREMENTS-2026-09-27.md` (the exact bill of materials).
> Authority: derived plan; not Ω law, not a boundary activation.

## Where we stand

Done and proven (evidence in repo, all on sandbox unless noted):

| # | Work | Evidence | Status |
|---|---|---|---|
| 0 | Grounded design (v1 + v2, 9 corrections verified) | `docs/agent-system/AUTONOMOUS-AGENTIC-TEAM-DESIGN-2026-09-27*.md` | DONE |
| 1 | Phase 1 opencode pack: 11 agents, root config, 3 loop commands, spawn delegation | `opencode agent list` + `debug agent/config` on 1.18.4; `.opencode/README.md` verification record | DONE, PROVEN |
| 2 | Commons suite green single-host (5/5 → 6/6 with v0 test) | `bun test AGENTS_CONTEXT/AGENT-COMMONS/runtime`, 6 pass 0 fail | DONE, PROVEN |
| 3 | Parallel-spawn drill: 3 CFA waves, 3/3 reports verified vs repo | Session record 2026-09-27 (no repo change; read-only) | DONE, PROVEN |
| 4 | Sandbox rebased onto `origin/main` 95bbfea3, suite re-proven, parked | `.opencode/README.md` PARKED notice, commit `7ef8094b` | DONE |

`main` is mid-flight (Stage-E L2 adapter wave across CFAs; strategic-roadmap round
in progress). This track stays parked — no competition with the live P1.

## Remaining work, in order

### Phase 2b — Harden v0 (before any new mechanism)

1. **Two-host v0 evidence.** Re-run the 10-point completion with the two runtimes on
   two separate machines sharing one remote. Single-host two-clone proof exists;
   two-host proof is what the freeze language ("two independent agent runtimes")
   most strictly means. Owner: `runtime-constitution-core-substrate`.
2. **Rotation operation (unblocks the BLOCKED drill).** Design and implement the real
   key-rotation operation the `COMMONS-IDENTITY-DRILL` task waits on, then execute
   the drill: old-key retirement/rejection, new-key attribution, stream continuity.
   Owner: `authority-governance` (custodian). Gate: CFA-04 + CFA-09.
3. **Receipt-lag counters in the owner digest.** Automate the CFA-11 tripwires
   (>10 pending receipts, >5 contradictions, >7-day stale receipt) as computed
   counters so the Epistemic-Integrity decision becomes evidence-driven.
   Owner: `architecture-steward`.

### Phase 3 — Realtime + tools (the actual setup build)

4. **A2A-live transport adapter.** `A2ALiveTransport implements CommonsTransport`:
   per-agent AgentCards, `message/send` → durable append, `message/stream` (SSE) →
   `sync`/`readSince`, resubscribe over cursors, push webhooks → attention URGENT.
   Same envelope/hash-chain/validation; Git stays the fallback. Conformance: the
   same 10 points over SSE. Owner: `runtime-constitution-core-substrate`.
5. **Presence-loop daemon.** Re-emit the existing `presence(state, ttl)` before
   `expires_at` elapses; schedule `who-needs-attention`; no new semantics.
   Owner: `runtime-constitution-core-substrate` (deferred `commons-daemon` name
   registers here — roster row + home first).
6. **MCP tool mesh.** `mcp-commons` (wraps existing CLI), `mcp-machine` (bash/git/gh),
   `mcp-web` (fetch/search/browser), `mcp-memory` (TASKS/STATE/LESSONS). Each with a
   least-privilege manifest, per-call authorization, secret redaction at the
   transport boundary, tool-call idempotency keys, cost/latency budgets per Work
   item. Owner: CFA-10 operates; CFA-04 gates; CFA-06 advises on realization seams.
7. **Waiting-policy closure (the 8 gaps).** Default handoff TTLs + escalation,
   first-accept-wins contention rule, detach-on-wait convention, STATUS-progress
   format, human-door routing (until real UI: digest path), max-attempts/backoff/
   quarantine anti-runaway rule, derived team-view projection. Mostly policy +
   daemon behavior, not protocol. Owner: Steward drafts; CFA-04/CFA-09 ratify the
   safety-relevant parts.

### Phase 4 — Dogfood

8. **Self-rebase slice.** "Rebase yourselves" as a governed CFA-09 evolution slice:
   CFA-09 owns the change contract, CFA-04 gates authority, each CFA proposes its
   own home/tool diff, Steward reconciles, rollback path mandatory. First real
   task of the proven team. Owner: all; Steward orchestrates.

### Phase 5 — Operations + integration

9. **Operations wave.** Digest automation, receipt sweep, then re-evaluation of the
   SUPERSEDED Cycle 4 packet against the now-proven team.
10. **Integration toward `main`.** Coherent units per the Git protocol (pack →
    delegation → tests → adapters), never commons refs, only when the resume
    conditions in `.opencode/README.md` hold.

## Explicit non-goals (still)

No Ω law changes, no shared-boundary activation by this track alone, no second
registry/task-manager/ontology, no CFA-11 birth (counters first), no `main` writes
from the sandbox except through reviewed integration.
