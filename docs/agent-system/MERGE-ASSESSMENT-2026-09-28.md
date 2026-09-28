# Autonomous Agentic Team — Merge Assessment
## 2026-09-28

> Branch under assessment: `exp/local-theory-sandbox`
> Base: `main`
> Purpose: define the safest integration sequence after `main` materially advanced beyond the branch's original 2026-09-27 evidence.
> Classification: derived integration assessment; not Ω law, not semantic authority.

## 1. Current topology

At assessment time:

- `main`: `7ae2460b04df22a949bae0f1478b539129ce8bca`
- Sandbox branch merge-base: `95bbfea34ae09676f39d01eb5cc57d8f5ee8f9d6`
- Before reconciliation, the branch was 6 commits ahead / 22 behind.
- PR #68 is open and draft; GitHub currently reports the PR content as mergeable/clean.

The branch is a historical development line with useful additions, not a current repository snapshot.

## 2. Integration classification

### SAFE TO INTEGRATE AFTER CURRENT-TREE VERIFICATION

These are isolated additions whose purpose is operational tooling/design:

- `.opencode/agents/*.md` bindings for the Steward + 10 CFAs.
- `.opencode/command/*.md` thin Commons loop commands.
- `.opencode/opencode.json` harness wiring.
- `.opencode/README.md` verification/documentation, after current-state refresh.
- `docs/agent-system/*` design, setup, requirements, and reconciliation documents.
- test-only Commons changes, subject to a fresh suite run on the current merged tree.

These do not themselves authorize production autonomy.

### REVIEW BEFORE MERGE

`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/OWNER-DELEGATION.md` is marked "DRAFT FOR OWNER REVIEW" but is located at a path that reads like a live Steward control-plane artifact.

Do not merge that draft under the live-looking path by accident.

Preferred choices:

1. Keep it sandbox-only until owner approval.
2. Move/rename it under `docs/agent-system/` as an explicitly draft artifact, then update the opencode Steward binding to reference the draft location.
3. After explicit owner approval, revise it against current `main` and deliberately promote it to the canonical Steward delegation path.

Option 3 is the only path that should create an active standing spawn delegation.

## 3. Stale-information cleanup

The v1/v2 design documents should remain intact as lineage. They should not be rewritten into a false historical snapshot.

The current-state pointer is the correct pattern:

`docs/agent-system/CURRENT-RECONCILIATION-2026-09-28.md`

Current main truth supersedes historical statements, especially:

- Stage-E L2 is CLOSED / RECONCILED (7/7), not pending.
- Durable Completion Gate now governs completion claims.
- Stage-E next action is L3 graph-bundle design.
- CFA-04 runtime policy-source binding remains UNKNOWN.
- CFA-01 runtime revision/CID propagation remains UNKNOWN/deferred.
- CFA-07 logical Composition identity remains unresolved.
- CFA-09 universal Change identity/revision remains UNKNOWN/deferred.
- CFA-10 runtime-generation binding is UNRESOLVABLE; B1 remains underproven.

## 4. Autonomous-team roadmap after integration

The sandbox roadmap should be treated as an independent enablement track, not as a replacement for the main Architecture Steward portfolio router.

The sensible post-merge sequence is:

### Gate A — Merge hygiene
Resolve the Owner Delegation path/approval question and refresh any remaining stale operational references.

### Gate B — Current-tree verification
On the merged tree:

- verify opencode 1.18.4 configuration/bindings;
- run the Commons runtime suite;
- verify the v0 completion test;
- ensure the Durable Completion Gate remains the completion authority;
- inspect that no Ω-law/shared-boundary/runtime-join changes slipped in.

### Gate C — Phase 2b evidence
Only after current-tree verification:

- genuine two-host v0 proof;
- real key-rotation operation + drill;
- automated receipt-lag counters.

### Gate D — Phase 3 mechanisms
Only with explicit authorization and fresh evidence:

- A2A-live;
- presence-loop daemon;
- MCP tool mesh;
- waiting-policy closure.

These should be delivered as separate bounded work units, not one giant autonomy merge.

### Gate E — Dogfood
The first substantive autonomous task should remain the governed self-rebase slice, with CFA-09 evolution ownership, CFA-04 authority gating, per-CFA proposals, Steward reconciliation, and rollback/lineage preservation.

## 5. Relationship to current main

The autonomous-team work should not block or reorder the current Stage-E L3 graph-bundle work.

The two tracks can coexist:

`main: Stage-E L3 readiness`

+

`agent-system: autonomous-team enablement`

The merge should therefore integrate the harness/design as infrastructure and lineage, while current program routing remains owned by the main Steward control plane.

## 6. Explicit no-go actions during merge

Do not:

- force-rebase or force-push the historical sandbox branch;
- merge the Owner Delegation draft as though it were already owner-approved authority;
- start A2A/MCP implementation merely because the design exists;
- infer production autonomy from the v0 test;
- treat single-host evidence as two-host proof;
- treat design receipts as live/runtime proof;
- modify Ω law;
- create a second task manager, architecture graph, identity store, or semantic authority.

## 7. Recommended outcome

The cleanest integration is a design + Phase-1 harness merge, with the Owner Delegation draft explicitly quarantined from active control-plane authority.

After that merge is verified on the current main tree, the autonomous-team work can continue from a genuinely current baseline instead of accumulating another stale branch.

## 8. Evidence boundary

This assessment uses GitHub repository/PR state as of 2026-09-28. Local runtime execution has not been performed by this document itself; test claims remain those recorded by the sandbox until re-executed on the current integration tree.