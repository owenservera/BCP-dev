# Autonomous Team — Consolidated Architecture

> Date: 2026-09-28 · Baseline: `main` @ 9348c2ec (Gate B passed)
> Status: CURRENT — regroups all prior design into one document.
> Lineage (preserved, not operating truth): `AUTONOMOUS-AGENTIC-TEAM-DESIGN-2026-09-27.md`
> (v1), `...-v2.md`, steward-interface addition, `REMAINING-SETUP-WORK-2026-09-27.md`,
> `SETUP-REQUIREMENTS-2026-09-27.md`.
> Authority: derived design + operating record; not Ω law, not Commons semantics,
> not a boundary activation.

## 1. Operating model

Two independent surfaces over one shared `main` (owner decision
`LOCAL-SYSTEM-SHARED-MAIN-DECISION-2026-09-28.md`):

- **ChatGPT webapp** — COORD-01 reasoning, audits, research, steering. Unchanged.
- **Local OpenCode** — Steward + 10 CFAs as an independently usable execution team.
- Neither surface is authoritative by being active. Repository state, artifacts,
  gates, evidence, and receipts are the continuity boundary.

## 2. Team

Steward (`architecture-steward`) + ten ratified CFAs, identities per
`AGENTS_CONTEXT/AGENT-COMMONS/PEER-ROSTER.md` (all ratified), responsibilities per
`CORE-FUNCTION-AREA-REGISTER.md` and each `CORE-AGENT.md`. Opencode bindings in
`.opencode/agents/` named by `agent_id`, thin (point at homes, never duplicate
identity). No CFA-11; Epistemic Integrity stays cross-cutting with automatic
counters before any birth decision.

Three attached duties (no new CFAs): tool/transport operation → CFA-10;
identity operations → CFA-04; liveness/evals → daemon-under-CFA-10 (deferred
until registered).

## 3. Spawn authority

Standing delegation `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/OWNER-DELEGATION.md`,
status OWNER-APPROVED FOR INTEGRATION: Steward may spawn the ten CFA `agent_id`s
(daemon deferred to registration). Limits: no Ω changes, no production past the
CFA-04/CFA-09 gates, no force-pushes, no peer-home edits. Revocation by editing
the file; doubt means stop-and-ask. Mechanically verified on 1.18.4: Steward
`task:true`, CFAs `task:false` (spawn *direction* enforced; name-list scope is
procedural + roster-reconciliation stop rule).

## 4. Three-tier execution tree

Steward (tier 0) → CFA subs (tier 1) → leaf workers (tier 2) → nothing. Depth
capped at two hops. Workers hold **no Commons identity**: output is input to the
parent CFA, verified before promotion; only CFAs/Steward sign and persist.
Leaves carry no spawn permission (mechanical floor). No budget ceilings by owner
decision (deferred, placeholder kept); depth, least-privilege, and verification
rules still apply.

## 5. Leaf-worker catalog (`work-*`, all `mode: subagent`, spawn: none)

| Worker | Tools | Returns |
|---|---|---|
| `work-scout` | read/glob/grep/webfetch only | locations + 3-line summaries + confidence |
| `work-researcher` | web + read | cited evidence pack + confidence + unknowns |
| `work-drafter` | edit scoped to draft paths | draft + diff summary (never control-plane files) |
| `work-verifier` | read-only; never the producer session | CONFIRMED / REFUTED / UNRESOLVED + refs |
| `work-runner` | scoped shell, no edit | exit codes + verbatim logs |

Workers persist nothing (no TASKS/RESULTS/Commons writes) — parents own all
durable state, eliminating worker write contention. Instances disposable; the
five type files are versioned design, registered beside the delegation.
`work-` prefix guarantees no collision with Commons identities.

## 6. Session topology

- **One session, whole team**: owner or Steward reaches all CFAs (spawn or
  `@`-mention); CFAs never spawn each other (see §4 for the worker exception).
- **Parallel sessions, each a full team**: N opencode sessions, each Steward-led,
  each in its **own working copy** (clone/worktree) off current `main`.
- Shared identities across sessions are legal (`session_id` differs per runtime)
  but **one writer at a time** per agent stream and per file; contention resolves
  via handoff, never concurrent edit. `main` is the single rendezvous.

## 7. Communication

Commons v0 is durable truth (frozen; GitBranch durable, Memory tests, GitHub API
alternate). A2A-live is a Phase-3 *transport adapter* (AgentCards, SSE →
sync/readSince, push → URGENT), never a second schema. Presence heartbeat exists
as a one-shot emitter; the re-emit loop arrives with the daemon. Inbox, rooms,
DMs, handoffs (OFFERED→…→CLOSED), attention, and folds are used as built; long
waits always detach (resumption = new session).

## 8. Autonomy loop

Owner goal → Steward dependency assessment (INDEPENDENT/ORDERED/CONDITIONAL/
BLOCKED) → envelopes (SHA+artifact+semantics prerequisites, gates, STOP) →
wave spawn → RESULTS receipts → verify-against-repo → reconcile → next wave →
report with evidence. Subs collaborate peer-to-peer over Commons; Steward
reconciles outcomes, relays nothing. Blocked ends PARTIAL with handoff+cursor.
Steward death recovers identically (delegation→STATE→TASKS→receipts→respawn
unreported only). Autonomy dial: spawn-within-delegation-and-report (no per-wave
gate) unless owner tightens it.

## 9. Safety invariants

Consequential effects require Authority gate + safe envelope + receipt +
repository verification. Falsifiers: transport-divergent event fails build;
gateless effect is a defect; credential bytes in any event invalidates the
slice; lineage break without additive repair blocks integration. Non-goals
unchanged: no Ω edits, no second ontology/store/graph/task-manager, no silent
UNKNOWN upgrades (open CFA findings list preserved in TASKS).

## 10. Provenance of this document

Regroups: 368-file audit, A2A/MCP/opencode research, v1, grounded v2 (9 verified
corrections), steward-interface + delegation, worker-catalog + topology interview
decisions, Gate B evidence (11/11 agents, spawn direction, 6/6 suite on this
tree). Prior docs remain as lineage; conflicts resolve to this file, then to
newer `main` artifacts.
