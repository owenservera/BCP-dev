# Autonomous Agentic Team — Design (v2, grounded)

> Date: 2026-09-27
> Supersedes: `AUTONOMOUS-AGENTIC-TEAM-DESIGN-2026-09-27.md` (v1, same date) — v1 is kept for lineage, not overwritten.
> Branch: `exp/local-theory-sandbox` (theory only — no `main` writes)
> Status: REVISED / GROUNDED AGAINST REPOSITORY EVIDENCE — FOR REVIEW
> Authority: derived design; not Ω law, not Commons semantic authority, not a CFA boundary activation.

## 0. What changed from v1, and why

v1 was reviewed against the actual `owenservera/BCP-dev` repository (cloned and read directly, not inferred). The
direction in v1 holds. Nine corrections were needed before treating it as accurate enough to execute against:

| # | v1 claim | Repository evidence (2026-09-27) | Correction |
|---|---|---|---|
| 1 | CFA duties referenced only as "CFA-04", "CFA-10" | `AGENTS_CONTEXT/AGENT-COMMONS/PEER-ROSTER.md` gives exact `agent_id`s and home paths | §2 now carries the real table; used everywhere below instead of bare CFA numbers |
| 2 | "Liveness... presence heartbeat... implied by runtime schemas, no sender" | `runtime/src/commons.ts` **does** implement `presence(state, ttl)`, wired to the CLI's `presence` command and emitting `presence.updated` | Narrowed: a manual, one-shot emitter exists; what's missing is an autonomous loop that re-emits it before `expires_at` elapses. See §5. |
| 3 | "commons-daemon under CFA-10" proposed as new | Steward `TASKS.md` already lists `COMMONS-V0-RUNTIME-2026-09-27` (READY/BACKGROUND) with **operational owner: `runtime-constitution-core-substrate`** | Not a new assignment — this design's CFA-10 duty is corroborated by an existing task record, not novel. Cited as evidence, §3. |
| 4 | Key-rotation drill "BLOCKED" | Steward `TASKS.md`: `COMMONS-IDENTITY-DRILL-2026-09-27` status `BLOCKED / BACKGROUND`, same reason | Confirmed verbatim; no change needed, now cited directly. |
| 5 | Sequencing (§4) treated the harness phase as the only live Steward priority | Steward `TASKS.md` shows `CFA-DOMAIN-ROADMAP-WAVE-2026-09-27` as the **current READY P1** task, independent of this design | §4 now states explicitly that Phase 1 (sandbox-only, no runtime change) must not compete with or substitute for that wave. |
| 6 | Phase 5 named "Cycle 4 live-Chrome proof" as a queued target | Steward `TASKS.md`: `CYCLE-4-LIVE-CHROME-ACCOUNTS-2026-09-27` is now **SUPERSEDED** — "the Steward selected this downstream product slice before the CFA-owned domain-roadmap stage had been completed... re-evaluate only after CFA roadmap reconciliation" | §10 Phase 5 now says re-evaluate Cycle 4's status at that time rather than assuming it is still the target. |
| 7 | `.opencode/agents/cfa-*.md` naming | Commons identity is the `agent_id` (e.g. `authority-governance`), not a CFA ordinal; opencode's agent filename **is** the Task-tool delegation name | §5/§6/§12: the opencode agent pack is named by `agent_id`, 1:1 with `PEER-ROSTER.md`, not by `cfa-NN`. A CFA number is a register index, not an identity. |
| 8 | Config-key caution ("agent" vs "agents") | Confirmed real: `vivim-original-baseline/opencode.json` uses singular `agent`; current opencode v2 docs (`opencode.ai/v2/docs/agents`) document `agents` as an ordered-`permissions`-array schema | Kept, and **extended**: the `permission` (v1, per-tool object) vs `permissions` (v2, ordered array, last-match-wins) schema choice needs the same installed-version check before Phase 1 is treated as executable, not just the key name. See §5/§10. |
| 9 | MCP mesh (`mcp-machine`, `mcp-web`) drawn in §6 architecture without a phase gate marker | No MCP servers of these names exist in the repository yet | §6 diagram now marks `mcp-machine` / `mcp-web` as **Phase 3, not-yet-implemented**, so nothing in Phase 1 may reference them as live. |

Nothing else in v1's direction, phasing shape, testing plan, or risk list needed correction. What follows is v1
with these nine points folded in, plus the concrete Phase-0/Phase-1 documents this revision produced (§14).

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

- Team: Steward + 10 CFAs, all `RATIFIED — OWNER-ALIGNED`. Exact identities, from
  `AGENTS_CONTEXT/AGENT-COMMONS/PEER-ROSTER.md` (the authoritative agent_id → home
  mapping the Commons runtime itself reads):

  | agent_id | CFA | Home |
  |---|---|---|
  | `architecture-steward` | — (Steward) | `AGENTS_CONTEXT/ARCHITECTURE_STEWARD` |
  | `world-ontology-context` | CFA-01 World & Context Steward | `.../SUBAGENTS/WORLD-ONTOLOGY-CONTEXT` |
  | `data-model` | CFA-02 Data Steward | `.../SUBAGENTS/DATA-MODEL-STEWARD` |
  | `semantic-continuity` | CFA-03 Self-Knowledge/Language/Command | `.../SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER` |
  | `authority-governance` | CFA-04 Authority/Governance | `.../SUBAGENTS/AUTHORITY-GOVERNANCE` |
  | `agency-work-execution` | CFA-05 Agency/Work/Execution | `.../SUBAGENTS/AGENCY-WORK-EXECUTION` |
  | `capability-provider-realization` | CFA-06 Capability/Provider/Realization | `.../SUBAGENTS/CAPABILITY-PROVIDER-REALIZATION` |
  | `composition-plugin-forge` | CFA-07 Composition/Plugin/Forge | `.../SUBAGENTS/COMPOSITION-PLUGIN-FORGE` |
  | `experience-interaction-surfaces` | CFA-08 Experience/Interaction/Surfaces | `.../SUBAGENTS/EXPERIENCE-INTERACTION-SURFACES` |
  | `evolution-compatibility-self-maintenance` | CFA-09 Evolution/Compatibility/Self-Maintenance | `.../SUBAGENTS/EVOLUTION-COMPATIBILITY-SELF-MAINTENANCE` |
  | `runtime-constitution-core-substrate` | CFA-10 Runtime Constitution/Core Substrate | `.../SUBAGENTS/RUNTIME-CONSTITUTION-CORE-SUBSTRATE` |

  Register of record: `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CORE-FUNCTION-AREA-REGISTER.md`.
- Communication: Agent Commons v0 protocol frozen
  (`AGENTS_CONTEXT/AGENT-COMMONS/`, `RUNTIME-PLATFORM-WORKSTREAM-2026-09-27.md`).
  Reference runtime: `AGENTS_CONTEXT/AGENT-COMMONS/runtime/` (`@vivim/agent-commons-runtime`
  0.1.0) with `GitBranchTransport`, `GitHubApiTransport`, `Memory` transport, a working
  CLI (`inbox | history | publish | presence | flush | who-needs-attention | capabilities`),
  and an implemented `AgentCommons` class (`send/dm/broadcast/reply/handoff/transitionHandoff/presence`).
- Execution today: human-launched ChatGPT fresh sessions (FSSP-1.3,
  `CHATGPT-AGENT-OPERATING-MODEL.md`). Steward compiles task envelopes; the owner
  launches. No daemon, no scheduler, no auto-loop.
- Known gaps (from repo evidence):
  - `AGENTS_CONTEXT/AGENT-COMMONS/VALIDATION-STATUS.md`: Commons tests authored, not
    independently reported passing — the container this design session ran in also
    could not execute `bun test` against the runtime (network egress is limited to a
    fixed allowlist that does not include an npm-based bun toolchain fetch path in
    every environment; verify locally before trusting this claim further).
  - `ARCHITECTURE_STEWARD/TASKS.md`: `COMMONS-IDENTITY-DRILL-2026-09-27` is
    `BLOCKED / BACKGROUND` — "remains blocked until a real key-rotation operation
    exists."
  - `ARCHITECTURE_STEWARD/TASKS.md`: `CFA-DOMAIN-ROADMAP-WAVE-2026-09-27` is
    `READY`, `P1` — **the current live Steward priority**, independent of this design.
  - `ARCHITECTURE_STEWARD/TASKS.md`: `CYCLE-4-LIVE-CHROME-ACCOUNTS-2026-09-27` is
    `SUPERSEDED` — selected before CFA domain-roadmap completion; re-evaluate later,
    don't treat as queued.
  - `ARCHITECTURE_STEWARD/TASKS.md`: `COMMONS-V0-RUNTIME-2026-09-27` is
    `READY / BACKGROUND`, operational owner `runtime-constitution-core-substrate`
    — this is the existing task record this design's CFA-10 duty assignment sits under.
  - `BCP-dev` root has no `.opencode/` wiring; the rich `opencode.json` (agents, MCP,
    skills) lives only in `vivim-original-baseline/`, and it declares agents under a
    singular `"agent"` JSON key.
- Local setup (verified 2026-09-27): node v24.11.1, bun 1.3.14, git 2.51.2,
  gh 2.83.2, opencode 1.18.4.

## 3. Team assessment — do we have the right team?

Yes for responsibility coverage; no for runnable operation. Keep the 10 CFAs, attach
three explicit *duties* instead of birthing new CFAs (freeze compliance):

| Duty | Owner (`agent_id`) | Why | Evidence |
|---|---|---|---|
| Tool & transport operation (MCP servers, browser/machine bindings, permission manifests, redaction) | `runtime-constitution-core-substrate` (delegated runtime duty) | Nobody owns "the team's hands" today; capability-provider-realization owns realization semantics, runtime-constitution-core-substrate owns enforcement — the operator sits between them. | New duty; not yet a task record. |
| Identity operations (key custody drills, rotation op, recovery ceremony) | `authority-governance` (custodian, already assigned) | Rotation op is the BLOCKED item; autonomous agents that cannot rotate keys cannot survive. | `TASKS.md`: `COMMONS-IDENTITY-DRILL-2026-09-27`, `BLOCKED/BACKGROUND`; CFA register's "Security / identity operational custodian" note already names `authority-governance` (as CFA-04) for this. |
| Liveness & evals (presence heartbeat loop, attention tuning, replay/chaos harness) | commons-daemon under `runtime-constitution-core-substrate` | `presence(state, ttl)` exists as a manual, one-shot emitter (`runtime/src/commons.ts`); nothing calls it on a loop before `expires_at`. `who-needs-attention` and `attention.ts` exist; nothing schedules them. | Corroborated by existing `COMMONS-V0-RUNTIME-2026-09-27` task record, operational owner already `runtime-constitution-core-substrate`. |

- Do NOT birth CFA-11 (Epistemic Integrity) yet. Wire the register's quantitative
  triggers (>10 pending receipts, >5 open contradictions, >7-day stale receipt) into
  the owner-digest as automatic counters so the decision becomes evidence-driven.
- Steward remains coherence-owner and envelope-compiler, never central scheduler.

## 4. Sequencing — wait or let them rebase themselves?

Three phases. Self-rebase is the first *real* task, not the first *activity*. This
sequencing runs **alongside**, not instead of, the Steward's current live P1 priority:

> Promotion amendment (sandbox, verified against `origin/main` e16db34): the
> `CFA-DOMAIN-ROADMAP-WAVE-2026-09-27` named in the original paragraph below is now
> `SUPERSEDED`. The live priority is `LAUNCH-CFA-STRATEGIC-ROADMAP-ROUND-1-2026-09-27`
> (`READY`, P1 — launch all ten independent CFA strategic-roadmap sessions in
> parallel) plus `CENTRAL-CFA-STRATEGIC-ROADMAP-SYNTHESIS-2026-09-27` (`WAITING`).
> Phase 1 below is sandbox-only, produces no runtime change, and must not consume
> the owner-launch budget that round needs. Do not present this design as a reason
> to defer the strategic-roadmap round, and do not let that round block reading this
> design — they are independent tracks that converge at Phase 2 (both need CFAs that
> can act on their own roadmaps).

1. **Harness (now, sandbox):** spec (this file) + transport/tool adapters + v0 test
   green across two runtimes (Memory + GitBranch, here in opencode). No home rewrites.
2. **Dogfood (first real task after v0 green):** "Rebase yourselves" as a governed
   `evolution-compatibility-self-maintenance`-owned evolution slice — that CFA owns
   the change contract, `authority-governance` gates authority, each CFA proposes its
   own home/tool diff, Steward reconciles, rollback path mandatory. Exercises identity,
   lineage, promotion, quarantine end-to-end.
3. **Operations wave:** owner-digest automation, receipt sweep, and **only then**
   re-evaluation of whether the (currently `SUPERSEDED`) Cycle 4 live-Chrome packet is
   still the right next product slice — with the now-proven team.

Rationale: self-modification before two runtimes provably share history risks forked
identity and lost lineage (exactly what the evolution CFA's safe envelope forbids).
Waiting for a "full system" waits forever — the freeze scope is deliberately thin.

## 5. Best-practice gaps (A2A / MCP / opencode, researched 2026-09-27)

Sources: A2A Protocol v0.3.0 (`a2a-protocol.org/v0.3.0/specification/`),
MCP Specification 2026-07-28 (`modelcontextprotocol.io/specification/2026-07-28`),
opencode agents docs (`opencode.ai/docs/agents`, `opencode.ai/v2/docs/agents`).

- **A2A as live adapter, never second protocol.** AgentCard per CFA at
  `/.well-known/agent.json` (name, description, version, url, preferredTransport,
  capabilities.streaming + pushNotifications, skills, security_schemes). Task states
  (submitted/working/input-required/completed/canceled/failed/rejected/auth-required)
  map onto the existing Handoff states (OFFERED/ACCEPTED/IN_PROGRESS/REPORTED/CLOSED —
  and, per the runtime's actual `HandoffState` union, also DECLINED/EXPIRED/CLOSED).
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
- **Opencode mapping.** 11 Markdown agents in `.opencode/agents/`, **named by Commons
  `agent_id`** (not by CFA ordinal — the filename is the Task-tool delegation name and
  should equal the identity that signs Commons events), `mode: subagent` for the 10
  CFAs, `mode: primary` for the Steward; least-privilege permissions per agent;
  `description` fields so the Steward can delegate programmatically via the Task tool;
  the Steward runs as the one thin primary/orchestrator; commands for the loop
  (`commons-sync`, `attention`, `receipt`) wrapping the *existing* CLI verbs
  (`flush`/`inbox`/`who-needs-attention`) rather than inventing new ones. Cheap-vs-
  frontier model routing (triage/attention on fast models, reasoning on capable ones).
- **Two unresolved schema questions before Phase 1 is "executable," not just
  "written."** Both are the same class of risk (a config key that looks right in
  docs but doesn't match the pinned local version) and both must be checked against
  the installed **opencode 1.18.4** before trusting this pack to load:
  1. JSON config key: `"agent"` (singular, confirmed working in the legacy baseline's
     `opencode.json`) vs `"agents"` (plural, current v2 docs).
  2. Per-agent permission shape: a flat per-tool object (`permission: {edit: "allow",
     bash: "allow"}`, confirmed working in the legacy baseline) vs an ordered array of
     `{action, resource, effect}` rules with last-match-wins (current v2 docs, and the
     schema this design's spawn-restriction plan in §12 actually needs). **This
     revision's `.opencode/agents/*.md` pack uses the flat object form because it is
     the one confirmed against a file that already runs in this repository; treat the
     spawn-list restriction in §12 as procedural/documented until the array form is
     confirmed against 1.18.4, not as a verified mechanical gate.**
- **Missing practices to add:** an autonomous loop that calls the existing
  `presence(state, ttl)` before `expires_at` elapses (the emitter exists; the loop
  does not); secret redaction at the transport boundary; cost/latency budgets per
  Work item; tool-call idempotency keys (extend the existing message idempotency);
  OTel span per causation chain; receipt-lag metrics feeding the CFA-11 counters;
  kill-switch per agent (revoke key + K0 fence); blast-radius labels on work branches;
  chaos test (SIGKILL mid-attempt → recover from durable Work state, never worker
  memory — CFA-05/`agency-work-execution` already demands this).

## 6. Target architecture

```
CFA agents (.opencode/agents/<agent_id>.md — 10 + steward, 1:1 with CORE-AGENT.md)
  │  Commons API (unchanged schema/versioning — freeze respected)
  ▼
Transport router: Memory (tests) │ GitBranch (durable truth) │ A2A-live (realtime adapter, NEW, Phase 3)
  │  Tool mesh (MCP): mcp-commons (wraps the existing runtime CLI, Phase 1)
  │                   mcp-machine │ mcp-web │ mcp-memory (Phase 3 — NOT YET IMPLEMENTED,
  │                   no server of these names exists in the repository today)
  ▼
Capability profiler (LOCAL_RUNTIME/HYBRID gate for machine+web authority)
  │  Autonomous loop: watcher → attention.rank → claim → execute → receipt → fold
  ▼
Authority gate (`authority-governance`) + safe envelope (`evolution-compatibility-self-maintenance`)
  on every consequential step
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
6. Execution through tool mesh; consequential calls gated by `authority-governance`,
   enveloped by `evolution-compatibility-self-maintenance`.
7. Outcome + evidence linkage (`agency-work-execution` separation: executor success ≠
   verification ≠ Outcome ≠ Evidence) → receipt persisted → cursors advanced.
8. Promotion of communication into evidence/docs only by owning systems with lineage
   preserved (Constitution §9).

## 8. Error handling

- Diverged commons branch → `COMMONS_LOCAL_BRANCH_DIVERGED`, additive repair event;
  never force-push `main` or any published commons branch.
- Bad signature / schema → dead-letter record, visible, no silent drop.
- Duplicate delivery → dedupe on stable event/message id (at-least-once preserved).
- Tool failure → Work UNKNOWN + `agency-work-execution` reconciliation path; no unsafe
  retry.
- Authority deny/expired → refuse + receipt; historical citation never treated as live
  permission.
- SSE break mid-task → `tasks/resubscribe` semantics over `readSince` cursors.
- Missing capability (webapp-only, no key) → READ_ONLY posture; never silent keygen
  (no identity fork).

## 9. Testing

1. Existing 10-point v0 completion test, two independent runtimes (Memory + GitBranch
   in opencode) — must go green first; unblocks everything.
2. A2A adapter conformance: same 10 points over SSE + resubscribe + push webhook.
3. Tool-gate tests: `authority-governance` deny/quarantine paths, redaction, budget
   exceeded.
4. Recovery: SIGKILL mid-attempt → reconstruct from durable Work state.
5. Replay: recorded event log → fresh runtime → projection equivalence (meaning-drift
   regression suite).
6. Rotation drill (unblocks the BLOCKED item): old-key retirement/rejection, new-key
   attribution, stream continuity.

## 10. Implementation path (sandbox-first)

- Phase 0: this spec reviewed + committed on `exp/local-theory-sandbox`.
- **Phase 1 (this revision's deliverable — see §14): `.opencode/agents/` pack (11
  files, named by `agent_id`) + `.opencode/command/` loop commands + root
  `.opencode/opencode.json` + `OWNER-DELEGATION.md`. No runtime changes.**
  Both the JSON config key (`agent` vs `agents`) and the per-agent permission shape
  (flat object vs ordered array) must be re-verified against the installed opencode
  1.18.4 before this pack is trusted to load, not just written to look right (§5).
- Phase 2: v0 green (Memory + GitBranch) with evidence.
- Phase 3: A2A-live adapter + presence-loop daemon + MCP mesh (`mcp-machine`,
  `mcp-web`, `mcp-memory` — gated, least-privilege, none exist yet).
- Phase 4: dogfood self-rebase slice (`evolution-compatibility-self-maintenance`
  contract, `authority-governance` gate, rollback).
- Phase 5: operations wave (digest automation, receipt sweep, **then** re-evaluate
  Cycle 4's `SUPERSEDED` status against a now-proven team — not before).
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
- **New (v2): documented-but-unverified permission schema tempts false confidence** →
  falsifier: if the Steward's spawn list in `OWNER-DELEGATION.md` is treated as an
  enforced gate before the `permissions` array schema is confirmed against 1.18.4 and
  actually wired, that is a defect — the delegation is procedural until then, and must
  say so.
  - Promotion amendment (sandbox, verified 2026-09-27 via `opencode agent list` /
    `debug agent` / `debug config` on 1.18.4): the flat `permission` object +
    `tools.task: false` form loads; CFAs resolve `task` denied, Steward `task: true`.
    Spawn *direction* is therefore mechanical. The *name list* remains procedural.
    The ordered-array schema was not needed and stays untested. See
    `.opencode/README.md` "Verification record".

## 12. Steward as owner interface (spawn authority)

The owner talks to exactly one agent: the Architecture Steward. The Steward spawns
the whole team and each sub does its work collaboratively. This resolves the
spawn-authority gap: spawn power is a standing delegation from owner to Steward,
not an ambient capability.

- **Standing delegation** (`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/OWNER-DELEGATION.md`,
  produced by this revision — see §14): names which agents the Steward may spawn (the
  10 CFAs by `agent_id`; `commons-daemon` is deferred to Phase 3 — it has no roster
  row or home yet and must not enter a spawn list until registered), step/cost
  budgets per wave, authority limits
  (no Ω law changes, no production implementation past the `authority-governance` /
  `evolution-compatibility-self-maintenance` gates, no force-pushes, no peer-home
  edits), stop conditions, and revocation (owner edits or deletes the file; in doubt
  the Steward stops and asks). Reviewed whenever the CFA register changes.
- **Opencode shape:** Steward runs as the primary session (`.opencode/agents/
  architecture-steward.md`); the 10 CFAs are subagents (`mode: subagent`, filename =
  `agent_id`) the Steward may invoke via the Task tool. CFA agent files set
  `tools: { task: false }` so a CFA cannot itself spawn further sessions — a CFA that
  needs another agent sends a Commons REQUEST/HANDOFF, and the Steward (or daemon)
  turns it into a spawned session. No sub-sub-trees. (Mechanical enforcement of "the
  Steward may spawn *only* these eleven names" needs the ordered-`permissions`-array
  schema confirmed in §5; until then this is a documented and prompted constraint, not
  a verified technical one — see the new falsifier in §11.)
- **How a goal flows:** owner states goal → Steward assesses the dependency graph
  (INDEPENDENT / ORDERED / CONDITIONALLY DEPENDENT / BLOCKED per the operating
  model) → compiles one task envelope per work unit (same contract as FSSP-1.3:
  identity, prerequisites as SHA+artifact+semantics, read-first paths, completion
  gate, STOP condition) → spawns wave 1 (parallel where independent) → collects
  RESULTS receipts → verifies each against the repo (never trusts the report) →
  reconciles durable context → spawns wave 2 → repeats until the goal's completion
  condition is met → reports to owner with evidence + refs.
- **Sub-to-sub collaboration bypasses the Steward at runtime:** CFAs talk directly
  via Commons rooms/DMs, replies/threads, and handoffs using their CORE-AGENT peer
  interfaces. The Steward does not relay messages; it reconciles outcomes. A CFA
  blocked on a peer records BLOCKED + cursor + handoff and ends (PARTIAL); the
  daemon surfaces the peer's REPORT as attention; the Steward respawns the waiter
  with the verified prerequisites. Long waits always detach — resumption is a new
  session, never a held-open one.
- **Steward team view:** a derived projection (not authority) over TASKS.md files,
  handoff states, cursors, and receipt lag — one place where the owner sees every
  goal, wave, blocker, and pending receipt. Feeds the CFA-11 counters automatically.
- **Failure posture:** if the Steward session itself dies mid-wave, the next Steward
  session recovers identically to any CFA: read delegation → STATE → TASKS →
  receipts → re-verify → respawn only the unreported units. No wave is ever assumed
  complete from a report alone.

## 13. Evidence & lineage

- Basis: `AGENTS_CONTEXT/` (368 files as of the v1 pass, re-read for this revision
  2026-09-27), Ω/destination authority unchanged, local setup verified (node 24.11.1 /
  bun 1.3.14 / opencode 1.18.4).
- Research: A2A v0.3.0, MCP 2026-07-28, opencode v2 agents docs (URLs in §5); the v2
  docs' `permissions` array/last-match-wins shape was fetched and read directly for
  this revision, not assumed from v1's description of it.
- Direct repository reads for this revision: `PEER-ROSTER.md`, `VALIDATION-STATUS.md`,
  `CORE-FUNCTION-AREA-REGISTER.md`, Steward `TASKS.md`, `AUTHORITY-GOVERNANCE/
  CORE-AGENT.md` (full), `SESSION-RESULT-CONTRACT.md`, `runtime/src/{cli,commons,
  types,events}.ts`, `vivim-original-baseline/opencode.json`.
- Next evidence: v0 test results, adapter conformance logs, drill records, and a
  confirmed answer (against the actual installed opencode 1.18.4, not docs) to the two
  schema questions in §5 — each with exact commit/ref before any claim of completion.

## 14. Deliverables produced by this revision (Phase 0/1)

These are new files, generated against the evidence above, ready to be reviewed and
placed on `exp/local-theory-sandbox`. None of them touch `main`, Ω law, or activate a
shared boundary; §5's two schema questions must be confirmed against the installed
opencode 1.18.4 before treating the `.opencode/` pack as more than "written and ready
to test."

- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/OWNER-DELEGATION.md` — the standing spawn
  delegation named in §12 (ten CFA `agent_id`s; daemon deferred), not previously
  present in the repository.
- `.opencode/agents/architecture-steward.md` — the Steward as primary/orchestrator.
- `.opencode/agents/<agent_id>.md` × 10 — one per CFA, named by Commons `agent_id`
  per the §5/§7 naming correction, `mode: subagent`, `tools.task: false`, each
  pointing the session at its own `CORE-AGENT.md` / `STATE.md` / `TASKS.md` /
  `SESSION-CONTEXT.md` rather than duplicating identity content into the opencode
  file (the repository's own anti-bureaucracy rule in `AGENTS.md` §"Agent operating
  rule" applies here too: one canonical representation, not a copy).
- `.opencode/opencode.json` — root wiring for BCP-dev (previously absent), singular
  `"agent"` key per the confirmed-working legacy baseline, `instructions` pointing at
  `/AGENTS.md`, loop commands wired to the existing Commons CLI.
- `.opencode/command/commons-sync.md`, `attention.md`, `receipt.md` — thin wrappers
  over the *existing* runtime CLI (`flush`/`inbox`, `who-needs-attention`) and the
  *existing* `SESSION-RESULT-CONTRACT.md` receipt format, not new mechanisms.
