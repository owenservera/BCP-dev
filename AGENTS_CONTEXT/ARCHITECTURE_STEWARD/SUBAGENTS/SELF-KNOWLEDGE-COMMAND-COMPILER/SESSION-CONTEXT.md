# CFA-03 — Session Context

> Protocol: FSSP-1.3
> Status: RATIFIED — FOUNDATION-SEEDED
> Navigation aid only; not semantic authority.
> Last reconciled: 2026-09-27

## Current execution assignment

This CFA is currently enabled by the Architecture Steward master portfolio router for **WP-E / Stage-E readiness**, specifically L1 — Derived-view and freshness contract.

Master routing authority:
`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/MASTER-PORTFOLIO-WORKLOAD-ROUTER-2026-09-27.md`

The current bounded output is the CFA-03 working contract:
`DERIVED-VIEW-BASIS-FRESHNESS-CONTRACT-2026-09-27.md`

The contract is proposed working evidence only. Do not infer shared runtime implementation authority from it. The next CFA-03 action is peer/Steward reconciliation of basis kinds, comparison rules and falsifiers.

## Identity
- CFA: CFA-03 — Semantic Continuity
- identity: Semantic Continuity Steward
- agent_id: `semantic-continuity`
- workspace: `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/`
- durable identity: `AGENT.md` (existing ratified identity artifact)
- ratified identity reference: `CORE-AGENT-IDENTITY.md`
- state: `STATE.md`
- lessons: `LESSONS.md`
- persistent task queue: `TASKS.md`
- session receipts: `RESULTS/<SESSION_ID>.md`

## Fresh-session load
1. Resolve and verify the current `main` tip.
2. Read `/AGENTS.md`, `/BUILD_CONTEXT.md`, `/docs/CURRENT-CONTEXT.md`, and `/AGENTS_CONTEXT/README.md`.
3. Read this home `SESSION-CONTEXT.md`, identity, `STATE.md`, `LESSONS.md`, and `TASKS.md`.
4. Read the current semantic-boundary/reconciliation artifacts needed for the assigned task.
5. Treat `LAUNCH-PROMPT.md` as historical bootstrap lineage only; do not repeat bootstrap.

## Mission
Maintain semantic continuity across self-knowledge, grounding, command language, interpretation, canonical Intent/Plan meaning, execution semantics, evidence/provenance, representation and bounded terminology.

## Key boundaries
World meaning/Addressability with CFA-01; durable data with CFA-02; Authority with CFA-04; Work with CFA-05; surfaces with CFA-08; evolution with CFA-09; runtime guarantees with CFA-10.

Shared boundaries remain unactivated unless a separately verified and authorized reconciliation activates them.

## Current frontier
- CFA-03 identity is ratified and verified.
- Round-2 reconciliation is persisted in `BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md`.
- RP-01 is classified AGREED on the CFA-03 side.
- RP-02 and RP-06 are AGREED in current peer-side Round-2 reconciliation.
- M1 semantic baseline is complete.
- Stage-E L1 freshness contract is proposed and persisted; peer/Steward reconciliation is pending.

## Verified baseline
`8353bb2db22b6f2e45f628c4c79ed42d5d8a56fb`

The recorded baseline above is orientation only. Fresh sessions must independently resolve the current `main` tip; it is never a dependency gate.

## Navigation
- Boundary Round 1: `BOUNDARY-ROUND-1-DECLARATION-2026-09-26.md`
- Boundary Round 2: `BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md`
- Current task queue: `TASKS.md`
- Durable state: `STATE.md`
- Durable lessons: `LESSONS.md`
- Completion receipts: `RESULTS/`


## Stage-E outputs
- `DERIVED-VIEW-BASIS-FRESHNESS-CONTRACT-2026-09-27.md` — L1 working contract
- `RESULTS/CFA03-20260927-STAGE-E-L1-DERIVEDVIEW-BASIS-FRESHNESS-CONTRACT.md` — session receipt

## M1 outputs
- `DOMAIN-ROADMAP-2026-09-27.md` — strategic roadmap
- `FINDINGS.md` — current semantic trace and evidence-backed gaps
- `CROSSWALK.md` — identity/state/terminology crosswalk
- Current M1 gaps: complete Intent→Plan→Work continuity, generalized freshness, visual semantic write-back, and broader relation vocabulary remain unproven or require later reconciliation.
