# Owner Delegation — Architecture Steward spawn authority

> Status: DRAFT FOR OWNER REVIEW — 2026-09-27
> Classification: derived design; not Ω law, not Commons semantic authority, not a
> CFA boundary activation.
> Governs: `AUTONOMOUS-AGENTIC-TEAM-DESIGN-2026-09-27-v2.md` §12.
> Sandbox rule: this file authorizes spawning inside the opencode/Commons harness
> under `exp/local-theory-sandbox` only. It does not authorize any `main` write, Ω
> law change, or shared-boundary activation by itself.

## Purpose

The owner talks to one agent — the Architecture Steward. Everything the Steward
spawns beyond itself is spawned under a standing delegation from the owner, recorded
here, not an ambient capability the Steward assumes it has.

**In doubt, the Steward stops and asks. This file is read, not inferred.**

## Who may be spawned

The Steward (`agent_id: architecture-steward`) may spawn sessions for exactly these
ten names, and no others, without a fresh owner conversation:

| # | `agent_id` | Role |
|---|---|---|
| 1 | `world-ontology-context` | CFA-01 — World & Context Steward |
| 2 | `data-model` | CFA-02 — Data Steward |
| 3 | `semantic-continuity` | CFA-03 — Self-Knowledge / Language / Command |
| 4 | `authority-governance` | CFA-04 — Authority / Governance |
| 5 | `agency-work-execution` | CFA-05 — Agency / Work / Execution |
| 6 | `capability-provider-realization` | CFA-06 — Capability / Provider / Realization |
| 7 | `composition-plugin-forge` | CFA-07 — Composition / Plugin / Forge |
| 8 | `experience-interaction-surfaces` | CFA-08 — Experience / Interaction / Surfaces |
| 9 | `evolution-compatibility-self-maintenance` | CFA-09 — Evolution / Compatibility / Self-Maintenance |
| 10 | `runtime-constitution-core-substrate` | CFA-10 — Runtime Constitution / Core Substrate |

> Promotion amendment (sandbox): the eleventh name in the draft (`commons-daemon`,
> liveness/eval loop under CFA-10) is **deferred** — it has no `PEER-ROSTER.md` row
> and no home directory yet. It enters this list only after registration, not by
> roster drift. Until then the ceiling below is ten concurrent sessions.

This list is copied from `AGENTS_CONTEXT/AGENT-COMMONS/PEER-ROSTER.md` at the time of
writing. If the roster changes, this file is reviewed before the new name is treated
as spawnable — a roster edit alone does not extend this delegation.

A CFA subagent may not itself spawn further sessions (`tools.task: false` in its
opencode definition). If a CFA needs another agent's work, it sends a Commons
`REQUEST`/`HANDOFF`; only the Steward (or, once built, the commons-daemon acting under
this same delegation) turns that into a spawned session. There are no sub-sub-trees.

## Step and cost budgets per wave

- A **wave** is one parallel batch of spawned sessions serving one owner-stated goal.
- Default per-wave ceiling: **10 concurrent sessions** (at most one per name in the
  table above).
- Default per-session ceiling: whatever step/turn budget the launching task envelope
  states explicitly (per `CHATGPT-AGENT-OPERATING-MODEL.md` Layer D). A session with
  no explicit budget in its envelope is a defect in the envelope, not a green light for
  an unbounded session.
- The Steward may not raise a wave's session count or an individual session's budget
  past what is stated here without recording the exception, the reason, and the
  owner's actual approval in its `SESSION-CONTEXT.md` for that wave — silent
  escalation is a violation of this delegation, not a judgment call.

## Authority limits

Inside this delegation, no spawned session — CFA, commons-daemon, or the Steward
itself — may:

- change Ω ratified law (`omega-baseline/omega-final/docs/decisions/
  CURRENT-INVARIANTS.md`, `docs/BUILD-DECISIONS.md`, D-records);
- ship production implementation past the `authority-governance` gate-time check and
  the `evolution-compatibility-self-maintenance` safe envelope on any consequential
  step;
- force-push `main` or any published `commons/<agent_id>` communication ref;
- edit another agent's home directory (`STATE.md`, `TASKS.md`, `CORE-AGENT.md`, etc.)
  — peer homes are edited only by their own owning agent, per `AGENTS.md`;
- activate a shared CFA boundary that is currently `UNACTIVATED` in the relevant
  `CORE-AGENT.md` peer-interface table;
- create a parallel task manager, ontology, authority store, or documentation
  bureaucracy (the general `AGENTS.md` / `CLAUDE.md` prohibition applies to every
  spawned session equally).

## Stop conditions

Any spawned session under this delegation stops and reports `BLOCKED` (not `DONE`,
not silently retried) when it hits:

- a required Commons key or signing capability it does not have (never silently
  generate a new identity — see `AGENT-COMMONS/IDENTITY-RECOVERY.md`);
- an authority result that is deny, expired, or unresolvable;
- a peer-boundary question that this file's authority limits do not resolve;
- a repository-write capability that is unavailable when a durable receipt is
  required (`SESSION-RESULT-CONTRACT.md` failure-handling clause);
- ambiguity about whether an action falls inside or outside this delegation's
  authority limits above. Ambiguity is a stop condition, not a coin flip.

## Revocation

This delegation is live only while this file exists in its current form at
`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/OWNER-DELEGATION.md` on the branch the Steward is
reading from.

- The owner revokes or narrows the delegation by editing or deleting this file.
- A Steward session that finds this file missing, unreadable, or materially altered
  since its last read must treat spawning as **not currently authorized** and ask the
  owner, rather than falling back to an ambient assumption of spawn authority.
- This file is reviewed whenever `CORE-FUNCTION-AREA-REGISTER.md` changes (a CFA is
  added, retired, split, or merged), per the review trigger already stated in the
  register.

## What this file does not do

- It does not grant Commons semantic authority, canonical-data ownership, or Ω
  authority to the Steward or any CFA.
- It does not mechanically enforce the eleven-name spawn list inside opencode. That
  enforcement depends on the ordered `permissions` array schema (`{action, resource,
  effect}`, last-match-wins) being confirmed against the installed opencode 1.18.4,
  per `AUTONOMOUS-AGENTIC-TEAM-DESIGN-2026-09-27-v2.md` §5/§11. Until that
  confirmation exists and is wired into `.opencode/agents/architecture-steward.md`,
  this delegation is a **documented and prompted** constraint that the Steward's own
  system prompt and this file's text hold it to — not yet a verified technical gate.
  Treat any claim that it is currently unbypassable as unverified until that
  confirmation is recorded here with a commit reference.
