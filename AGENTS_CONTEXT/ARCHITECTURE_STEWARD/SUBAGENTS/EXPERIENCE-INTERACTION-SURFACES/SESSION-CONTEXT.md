# CFA-08 — Session Context

> Protocol: FSSP-1.3
> Status: RATIFIED — OWNER-ALIGNED
> Navigation aid only; not authority itself.
> Last validated: 2026-09-27

## Identity
- CFA: CFA-08 — Experience / Interaction / Surfaces
- identity: Experience / Interaction / Surfaces Steward
- agent_id: `experience-interaction-surfaces`
- workspace: `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/EXPERIENCE-INTERACTION-SURFACES/`
- durable identity: `CORE-AGENT.md`
- state: `STATE.md`
- tasks: `TASKS.md`
- lessons: `LESSONS.md`
- owner alignment: `OWNER-ALIGNMENT-2026-09-27.md`
- identity history: `IDENTITY-HISTORY.md`

## Mission
Human-facing representation, navigation, manipulation, configuration and re-entry across World, Context, Intent, Work, capabilities and compositions.

## Core invariants
Canonical semantic state != presentation state. Gesture != semantic effect. A stale, partial, conflicted or refused surface must not silently become canonical meaning. Semantic mutation returns through the owning typed contract.

## Key boundaries
- CFA-01 owns semantic World / Space / Context; CFA-08 owns perception, navigation and workspace/layout realization.
- CFA-03 owns semantic Intent / Plan; CFA-08 owns representation and inspect/edit/confirm/reject interaction.
- CFA-04 owns authority; CFA-08 owns authority presentation.
- CFA-05 owns Work/execution; CFA-08 owns controls/progress/results/approval/re-entry presentation.
- CFA-06 owns capability/provider/routing semantics; CFA-08 owns user-facing choice/status presentation.
- CFA-07 owns composition/plugin/Forge semantics; CFA-08 owns editing/inspection/Forge UX.
- CFA-09 owns evolution semantics; CFA-08 presents continuity/change impact.
- CFA-10 owns K0/K1 runtime enforcement; CFA-08 presents relevant runtime state.
- CFA-02 remains explicitly provisional for durable-data ownership.

## Current frontier
See `STATE.md` for the active Experience / Interaction / Surfaces frontiers and unresolved seams.

## This session
- Task: `HOME-UPGRADE-2026-09-27`
- Target: `main`
- Current main verified during upgrade: `20d127685215c358f6dd33930c24936eef2d04fa`
- Execution strategy: INDEPENDENT home maintenance; own-home write scope only.
- Result receipt: `RESULTS/CFA08-HOME-UPGRADE-20260927-0538.md`
- Completion rule: persist the receipt and durable upgrade changes, verify them, then mark the home-upgrade task DONE.

## Fresh-session navigation
1. Read `/AGENTS.md`, `/BUILD_CONTEXT.md`, `/docs/CURRENT-CONTEXT.md`, `/AGENTS_CONTEXT/README.md`.
2. Read `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/CHATGPT-AGENT-OPERATING-MODEL.md` and `CHATGPT-FRESH-SESSION-PROTOCOL.md`.
3. Read `CORE-AGENT.md`, `STATE.md`, `TASKS.md`, `LESSONS.md`.
4. Read alignment/history and only the peer/Ω/destination material relevant to the active task.
5. Read the latest `RESULTS/` receipt before relying on a prior session's completion claim.

## Commons
- Guide: `COMMUNICATION-HOW-TO.md`
- Local scaffold: `commons/`
- Hosted connector session: repository read/write is available; no recoverable Commons signing key is claimed. Do not fabricate Commons events or signatures.

## Baseline note
A historical baseline may be retained for orientation, but it is informational only. Fresh sessions must resolve and verify the current `main`/target ref.
