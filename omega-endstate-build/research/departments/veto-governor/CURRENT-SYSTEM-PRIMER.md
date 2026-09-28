# Current System Primer

Status: snapshot for cold-start acceleration, not authority.
Date: 2026-09-28.

This is the current known starting picture. Re-verify consequential facts.

## Ω End-State Build

Project home:
omega-endstate-build/

Primary mission:
Full VIVIM beta ready to distribute for free.

This branch is a meta-system laboratory: the development organization is being discovered and evolved while VIVIM is the proving-ground workload.

Do not assume existing VIVIM, BCP or Ω architecture is the final solution.

## Current seeded team

STEW-01:
Local End-State Build Steward.

PROV-01:
Proposed provider-live-environment investigator.

VER-01:
Proposed independent verifier.

These are seeds, not proof of the final organizational topology.

## Current resident-team experiment

Path:
omega-endstate-build/runtime/resident-team-lab/

Known role of the folder:
experimental integration around a vendored opencode-swarm implementation.

Current plugin:
observation of native Task/session events; it does not currently enforce governance.

Treat documented checkpoints as hypotheses until live behavior is reproduced.

## Vendored opencode-swarm

Path:
omega-endstate-build/runtime/vendor/opencode-swarm/

Current implementation provides, among other things:

- shared SQLite-backed memory;
- inter-agent messaging;
- roster/state inspection;
- OpenCode session orchestration;
- persistent swarm state and reports;
- native OpenCode plugin integration.

Its README describes the swarm as spawning OpenCode sessions and delivering messages between turns.

Do not treat any of these statements as current platform truth without checking the installed/runtime version for claims that matter.

## Existing BCP Agent Commons

Path:
AGENTS_CONTEXT/AGENT-COMMONS/runtime/

It contains durable identity, signed event streams, Git/GitHub transport, folding/projections, attention, handoffs, subscriptions, context compaction, capabilities and CLI functionality.

It is substantial prior art and an available substrate.

It is not automatically the architecture for this department.

## Existing mainline organization

Path:
.opencode/
AGENTS_CONTEXT/ARCHITECTURE_STEWARD/
docs/agent-system/

The mainline contains a mature Steward + CFA + worker organizational hypothesis.

The Ω End-State Build path is explicitly allowed to diverge from it.

## Research rule

This primer accelerates cold start.

It does not replace live inspection.

For current runtime behavior, always inspect exact source/version and perform a live probe when the claim is consequential.
