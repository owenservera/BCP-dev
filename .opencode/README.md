# .opencode/ — Local autonomous team harness

> Status: **INTEGRATION TARGET — 2026-09-28**
>
> This pack was developed on exp/local-theory-sandbox against an older repository
> snapshot. The current main baseline has since completed Stage-E L2 owner
> reconciliation and advanced to the L3 graph-bundle frontier. The intended target
> is now one shared integrated main used by both the ChatGPT webapp workflow and
> the local OpenCode team.
>
> The sandbox branch remains historical lineage. After reviewed integration, local
> work continues from current main; it must not create a second architectural
> baseline.

## Shared operating model

- **ChatGPT webapp:** independently usable owner-facing COORD-01 surface.
- **Local OpenCode:** independently usable Steward + 10-CFA execution surface.
- **BCP-dev main:** single durable shared repository baseline.
- **Agent Commons:** inter-agent collaboration substrate; its communication refs
  are never treated as product branches.
- **Durable Completion Gate:** repository evidence/ref/receipt closure is required;
  chat-only DONE never advances durable state.

Both surfaces may be used in alternating fashion. Local execution does not require
a live ChatGPT session, and ChatGPT work does not require the local runtime to be
running.

## What's here

- opencode.json — root wiring for the local team.
- agents/architecture-steward.md — the Steward as the one primary/orchestrator.
- agents/<agent_id>.md × 10 — one per ratified CFA, named by Commons agent_id.
- command/*.md — thin wrappers over the existing Commons CLI/receipt workflow.

## Current verification record

The branch-local evidence verified against opencode 1.18.4 established:

1. all eleven agent bindings resolve;
2. the Steward is primary and has task: true;
3. each CFA is a subagent with task: false;
4. flat per-tool permission configuration loads;
5. the Commons runtime suite was green in the recorded sandbox run;
6. the v0 completion test was green in the recorded sandbox run.

Those results remain branch-local until the integrated current-main tree is
re-executed. They do **not** prove two-host live operation, A2A-live, presence-loop,
or MCP mesh readiness.

## Shared-main readiness gate

Before local autonomous work resumes on main:

1. verify the merged tree against current main control-plane artifacts;
2. run opencode agent list and opencode debug config on the actual machine;
3. run the Commons runtime suite, including v0 completion;
4. confirm no Ω-law or shared-boundary changes entered the merge;
5. confirm the current Durable Completion Gate and Steward routing remain intact.

Only after that gate should Phase 2b/Phase 3 setup continue.

## Deliberately not included yet

- no A2A-live transport implementation;
- no presence daemon;
- no MCP machine/web/memory servers;
- no CFA-11 identity;
- no second task manager, identity store, ontology, or Architecture Graph;
- no automatic authority bypass.

Historical design documents remain in docs/agent-system/ as lineage. The current
repository state always wins over older statements in those documents.