# Autonomous Agentic Team — Design

> Date: 2026-09-27
> Branch: `exp/local-theory-sandbox` (theory only — no `main` writes)
> Status: APPROVED DIRECTION / DESIGN FOR REVIEW
> Authority: derived design; not Ω law, not Commons semantic authority, not a CFA boundary activation.

## 1. Intent

Transform the current agent team — Architecture Steward + 10 ratified Core Function
Areas + Agent Commons v0 — from human-pumped ChatGPT fresh sessions into a fully
autonomous, collaborative, tool-rich team running in opencode, with full machine and
web authority, realtime collaboration over the current (or better) communication
system, integrating best-in-class tools (A2A protocol, MCP tool mesh, opencode
subagents).

Sandbox rule: everything here is theory on `exp/local-theory-sandbox` until the
Commons v0 operational completion test is evidence-backed green. No `main` writes,
no Ω law changes, no shared-boundary activation from this design alone.

## 2. Starting point (evidence, not claims)

- Team: Steward + CFA-01…CFA-10, all `RATIFIED — OWNER-ALIGNED`, each with
  `CORE-AGENT.md / STATE.md / TASKS.md / SESSION-CONTEXT.md / commons/` seed.
  Register: `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CORE-FUNCTION-AREA-REGISTER.md`.
- Communication: Agent Commons v0 protocol frozen
  (`AGENTS_CONTEXT/AGENT-COMMONS/`, `RUNTIME-PLATFORM-WORKSTREAM-2026-09-27.md`).
  Reference runtime: `AGENTS_CONTEXT/AGENT-COMMONS/runtime/` (`@vivim/agent-commons-runtime`
  0.1.0) with `GitBranchTransport`, `GitHubApiTransport`, `Memory` transport.
- Execution today: human-launched ChatGPT fresh sessions (FSSP-1.3,
  `CHATGPT-AGENT-OPERATING-MODEL.md`). Steward compiles task envelopes; the owner
  launches. No daemon, no scheduler, no auto-loop.
- Known gaps (from repo evidence):
  - `VALIDATION-STATUS.md`: Commons tests authored, not independently reported passing.
  - `ARCHITECTURE_STEWARD/TASKS.md`: key-rotation drill `BLOCKED` (no rotation op exists).
  - `STATE.md` (Steward, 2026-09-27): CFA-05 home-upgrade receipt missing; Cycle 4
    (Live Chrome / Accounts) requires owner-machine execution — webapp-only sessions
    must not claim live proof.
  - `BCP-dev` root has no `.opencode/` wiring; the rich `opencode.json` (agents, MCP,
    skills) lives only in `vivim-original-baseline/`.
- Local setup (verified 2026-09-27): node v24.11.1, bun 1.3.14, git 2.51.2,
  gh 2.83.2, opencode 1.18.4.

## 3. Team assessment — do we have the right team?

Yes for responsibility coverage; no for runnable operation. Keep the 10 CFAs, attach
three explicit *duties* instead of birthing new CFAs (freeze compliance):

| Duty | Owner | Why |
|---|---|---|
| Tool & transport operation (MCP servers, browser/machine bindings, permission manifests, redaction) | CFA-10 (delegated runtime duty) | Nobody owns "the team's hands" today; CFA-06 owns realization semantics, CFA-10 owns enforcement — the operator sits between them. |
| Identity operations (key custody drills, rotation op, recovery ceremony) | CFA-04 (custodian, already assigned) | Rotation op is the BLOCKED item; autonomous agents that cannot rotate keys cannot survive. |
| Liveness & evals (presence heartbeat, attention tuning, replay/chaos harness) | commons-daemon under CFA-10 | Implied by runtime schemas (`PresenceUpdated`) but owned by nobody. |

- Do NOT birth CFA-11 (Epistemic Integrity) yet. Wire the register's quantitative
  triggers (>10 pending receipts, >5 open contradictions, >7-day stale receipt) into
  the owner-digest as automatic counters so the decision becomes evidence-driven.
- Steward remains coherence-owner and envelope-compiler, never central scheduler.

## 4. Sequencing — wait or let them rebase themselves?

Three phases. Self-rebase is the first *real* task, not the first *activity*:

1. **Harness (now, sandbox):** spec (this file) + transport/tool adapters + v0 test
   green across two runtimes (Memory + GitBranch, here in opencode). No home rewrites.
2. **Dogfood (first real task after v0 green):** "Rebase yourselves" as a governed
   CFA-09 evolution slice — CFA-09 owns the change contract, CFA-04 gates authority,
   each CFA proposes its own home/tool diff, Steward reconciles, rollback path
   mandatory. Exercises identity, lineage, promotion, quarantine end-to-end.
3. **Operations wave:** Cycle 4 live-Chrome proof, owner-digest automation, receipt
   sweep — with the now-proven team.

Rationale: self-modification before two runtimes provably share history risks forked
identity and lost lineage (exactly what CFA-09's safe envelope forbids). Waiting for a
"full system" waits forever — the freeze scope is deliberately thin.

## 5. Best-practice gaps (A2A / MCP / opencode, researched 2026-09-27)

Sources: A2A Protocol v0.3.0 (`a2a-protocol.org/v0.3.0/specification/`),
MCP Specification 2026-07-28 (`modelcontextprotocol.io/specification/2026-07-28`),
opencode agents docs (`opencode.ai/docs/agents`, `opencode.ai/v2/docs/agents`).

- **A2A as live adapter, never second protocol.** AgentCard per CFA at
  `/.well-known/agent.json` (name, description, version, url, preferredTransport,
  capabilities.streaming + pushNotifications, skills, security_schemes). Task states
  (submitted/working/input-required/completed/canceled/failed/rejected/auth-required)
  map onto the existing Handoff states (OFFERED/ACCEPTED/IN_PROGRESS/REPORTED/CLOSED).
  `message/send` → durable append; `message/stream` (SSE) → `sync()/readSince()`;
  push webhooks → attention URGENT. Same signed envelope, same hash chain, same
  validation — transport underneath, semantics unchanged. Official guidance agrees:
  MCP for tools, A2A for agents.
- **MCP discipline.** Tools as versioned servers with least-privilege manifests;
  capability discovery via the existing `SessionCapabilityProfile`
  (LOCAL_RUNTIME vs WEBAPP vs HYBRID); progressive discovery (1–5% context threshold
  before switching from eager tool loading to search); per-call authorization surviving
  sandboxing (approving a script never blanket-approves its calls); tool annotations
  treated as untrusted; explicit state handles (UUIDv4, server-bound, expiring) since
  the protocol core is stateless; `ttlMs`/`cacheScope` honored; W3C trace context
  propagated on `causation_id`/`correlation_id`.
- **Opencode mapping.** 11 Markdown agents in `.opencode/agents/` (10 CFAs + steward),
  `mode: subagent`, least-privilege `permissions` (action/resource/effect, last match
  wins), `description` fields so primaries can delegate programmatically via the Task
  tool; one thin primary (orchestrator/loop-operator) with `task`-scoped permissions;
  commands for the loop (`commons-sync`, `attention`, `receipt`). Cheap-vs-frontier
  model routing (triage/attention on fast models, reasoning on capable ones).
- **Missing practices to add:** live presence heartbeat with expiry (schema exists,
  no sender — the A2A-live adapter carries it); secret redaction at the transport
  boundary; cost/latency budgets per Work item; tool-call idempotency keys (extend the
  existing message idempotency); OTel span per causation chain; receipt-lag metrics
  feeding the CFA-11 counters; kill-switch per agent (revoke key + K0 fence);
  blast-radius labels on work branches; chaos test (SIGKILL mid-attempt → recover from
  durable Work state, never worker memory — CFA-05 already demands this).

## 6. Target architecture

```
CFA agents (.opencode/agents/cfa-*.md — 10 + steward, 1:1 with CORE-AGENT.md)
  │  Commons API (unchanged schema/versioning — freeze respected)
  ▼
Transport router: Memory (tests) │ GitBranch (durable truth) │ A2A-live (realtime adapter, NEW)
  │  Tool mesh (MCP): mcp-commons │ mcp-machine │ mcp-web │ mcp-memory
  ▼
Capability profiler (LOCAL_RUNTIME/HYBRID gate for machine+web authority)
  │  Autonomous loop: watcher → attention.rank → claim → execute → receipt → fold
  ▼
Authority gate (CFA-04) + safe envelope (CFA-09) on every consequential step
```

- Commons v0 stays the durable truth layer. A2A-live and MCP are *implementations*
  under existing contracts, not new semantics: no new message kinds, no scheduler as
  authority, no second registry, no second task manager (freeze rule honored).
- Human owner becomes policy/override, not pump. Daemon watches
  `commons/*/outbox`, ranks via existing `attention.ts`, claims via Handoff
  lifecycle, writes `RESULTS/<SESSION>.md` receipts per `SESSION-RESULT-CONTRACT.md`.
- Branch discipline unchanged: `commons/<AGENT_ID>` for communication (never merged),
  `work/<AGENT_ID>/<TASK>` for implementation, `main` as sync point.

## 7. Data flow (one loop iteration)

1. Intent/observation → agent outbox (signed, stable id).
2. Router ships via A2A-live if peer online, else GitBranch (fallback mandatory).
3. Append → validate (sig, hash chain, schema) → accepted or dead-letter (observable).
4. Fold into projections (inbox, room, DM, attention, handoff, presence).
5. Daemon ranks attention; eligible agent claims via Handoff state transition.
6. Execution through tool mesh; consequential calls gated by CFA-04, enveloped by CFA-09.
7. Outcome + evidence linkage (CFA-05 separation: executor success ≠ verification ≠
   Outcome ≠ Evidence) → receipt persisted → cursors advanced.
8. Promotion of communication into evidence/docs only by owning systems with lineage
   preserved (Constitution §9).

## 8. Error handling

- Diverged commons branch → `COMMONS_LOCAL_BRANCH_DIVERGED`, additive repair event;
  never force-push `main` or any published commons branch.
- Bad signature / schema → dead-letter record, visible, no silent drop.
- Duplicate delivery → dedupe on stable event/message id (at-least-once preserved).
- Tool failure → Work UNKNOWN + CFA-05 reconciliation path; no unsafe retry.
- Authority deny/expired → refuse + receipt; historical citation never treated as live
  permission.
- SSE break mid-task → `tasks/resubscribe` semantics over `readSince` cursors.
- Missing capability (webapp-only, no key) → READ_ONLY posture; never silent keygen
  (no identity fork).

## 9. Testing

1. Existing 10-point v0 completion test, two independent runtimes (Memory + GitBranch
   in opencode) — must go green first; unblocks everything.
2. A2A adapter conformance: same 10 points over SSE + resubscribe + push webhook.
3. Tool-gate tests: CFA-04 deny/quarantine paths, redaction, budget exceeded.
4. Recovery: SIGKILL mid-attempt → reconstruct from durable Work state.
5. Replay: recorded event log → fresh runtime → projection equivalence (meaning-drift
   regression suite).
6. Rotation drill (unblocks the BLOCKED item): old-key retirement/rejection, new-key
   attribution, stream continuity.

## 10. Implementation path (sandbox-first)

- Phase 0: this spec reviewed + committed on `exp/local-theory-sandbox`.
- Phase 1: `.opencode/agents/` pack (11 files) + loop commands; no runtime changes.
  Config key (`agent` vs `agents`) verified against installed opencode 1.18.4 first —
  the legacy baseline uses singular `agent`; v2 docs use `agents`.
- Phase 2: v0 green (Memory + GitBranch) with evidence.
- Phase 3: A2A-live adapter + heartbeat + MCP mesh (gated, least-privilege).
- Phase 4: dogfood self-rebase slice (CFA-09 contract, CFA-04 gate, rollback).
- Phase 5: operations wave (Cycle 4 proof, digest automation, rotation drill).
- Integration to `main` only as coherent units per the Git protocol; commons refs never
  merged.

## 11. Risks & falsifiers

- Realtime adapter tempts semantic drift (second schema) → falsifier: any event that
  validates over one transport and not another fails the build.
- Autonomy tempts authority bypass → falsifier: any consequential effect without a
  gate-time Authority result and receipt is a defect, not a speedup.
- Tool richness tempts secret spread → falsifier: any credential bytes in a Commons
  event invalidates the slice.
- Self-rebase tempts history rewrite → falsifier: any lineage break without additive
  repair record blocks integration.

## 12. Evidence & lineage

- Basis: `AGENTS_CONTEXT/` (368 files, read 2026-09-27), Ω/destination authority
  unchanged, local setup verified (node 24.11.1 / bun 1.3.14 / opencode 1.18.4).
- Research: A2A v0.3.0, MCP 2026-07-28, opencode agents v2 (URLs in §5).
- Next evidence: v0 test results, adapter conformance logs, drill records — each with
  exact commit/ref before any claim of completion.
