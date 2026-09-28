# Local System / Shared Main Integration Decision
## 2026-09-28

> Classification: owner-directed integration decision; derived operational guidance.
> This document does not amend Ω law, Commons semantics, CFA boundaries, or the
> Architecture Steward's constitutional authority.

## Owner direction

The owner has directed that the autonomous local system be fully prepared for
continued operation while preserving the existing ChatGPT webapp workflow.

The intended operating model is:

- **ChatGPT webapp:** remains an independently usable owner-facing surface for
  COORD-01 architectural reasoning, research, audits, and steering.
- **Local OpenCode team:** becomes an independently usable execution surface for
  the Steward + 10 CFAs, using the repository's durable Commons and control-plane
  artifacts.
- **main:** becomes the single integrated durable repository baseline shared by
  both surfaces.

Neither interface becomes authoritative merely because it is active. Repository
state, durable artifacts, evidence, explicit authority gates, and the Durable
Completion Gate remain the continuity boundary.

## Shared-main rule

After integration, there is no long-lived autonomous-team sandbox branch that
defines a competing architectural baseline.

Short-lived implementation branches may still be used for bounded changes, but
the working system repeatedly returns to the current main. Historical sandbox
branches remain lineage/evidence sources and are not alternate product truths.

## Required integration posture

1. Preserve the existing ChatGPT workflow; do not couple local execution to a
   running ChatGPT session.
2. Integrate the Phase-1 OpenCode harness and Commons test evidence through a
   reviewed PR into current main.
3. Deliberately activate the ten-agent Steward delegation on the integrated tree
   under the owner's direction recorded here.
4. Re-verify the resulting main tree before local autonomous work resumes.
5. Keep Phase 2b/Phase 3 mechanisms separately gated; this decision does not prove
   two-host v0, live A2A, the presence daemon, or the MCP mesh.
6. Preserve the current Architecture Steward portfolio routing, including the
   Stage-E L3 graph-bundle frontier, rather than replacing it with the local
   autonomous loop.

## Verification boundary

This decision records the owner's target operating model. It is not itself a test
result. Actual local readiness still requires the current-tree verification gate,
the installed-toolchain check, and the evidence gates documented by the autonomous
team setup documents.