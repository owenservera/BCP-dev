# Autonomous Build Mission

## North Star

VIVIM is a sovereign, local-first personal computing environment:

> My machine. My internet. My accounts. My apps. My data. My intelligence. My rules. My interaction.

It is not fundamentally a chat application, SaaS dashboard, or AI wrapper.

The product should provide a persistent personal world containing conversations, projects, files, people, accounts, providers, work, history, memories, interests, tasks and other user-owned things, with a governed intelligent control surface.

Core semantic path:

`Address → Intent → Context → Capability → Choice/Routing → Authority → Work → Execution → Evidence → World/Memory update`

Core principles:
- Provider ≠ Account.
- Account ≠ Session.
- Session ≠ Browser Resource.
- Capability ≠ Realization.
- Candidate ≠ Realization.
- Representation ≠ Truth.
- Evidence ≠ Authority.
- Confidence ≠ Proof.
- LLM output ≠ Authority.
- Unknown ≠ Failure.
- Selector ≠ Canonical Truth.
- Surface ≠ Canonical Storage.

## What “working” means

Do not optimize for architecture diagrams. Optimize for a user being able to:
- start VIVIM;
- have a durable personal world;
- connect/use real AI providers through owned browser sessions;
- choose/control accounts/providers/models/routing;
- send and receive real work;
- preserve conversations and artifacts;
- see truthful state/evidence;
- resume interrupted work;
- navigate/use a coherent surface;
- survive browser/provider failure;
- add or evolve capabilities without silently granting authority to generated code;
- close and reopen without losing the world.

## Product priority

The product must preserve a meaningful behavioral floor from Legacy VIVIM while rebuilding it under Ω governance.

Important Legacy behavioral evidence includes:
- account-aware provider use;
- profile/resource isolation;
- conversation/stream continuity;
- workspace/project/canvas organization;
- background/long-running work;
- export/backup/recovery;
- provider discovery/healing.

Do not copy Legacy's engine/class hierarchy.

## VIVIM Ω

Ω is the destination architecture and governed substrate, not a reason to avoid solving product problems.

Protect proven Ω:
- vault/evidence;
- law/authority;
- recipe/composition/runtime;
- canonical intent;
- capability/realization boundary;
- evidence/provenance;
- Forge proposal vs promotion separation.

When Ω is incomplete, implement the smallest bridge required by an actual product slice and preserve its governing distinctions.

## Highest-value hard problems

The central coupled chain is:

`Provider → Account → Session → Browser Resource → Routing/Realization → Work → Evidence → Canonical World → Self-Knowledge`

The hardest unresolved physical/product problems are:
1. Account identity and ownership.
2. Session lifecycle.
3. Browser resource ownership/lease/isolation/recovery.
4. Routing policy and explainability.
5. Durable Work/checkpoint/recovery.
6. Canonical objects, relationships, lifecycle, versions, export/restore.
7. Artifact/Document/File semantics.
8. Provider knowledge aggregation/discovery/healing.
9. Self-knowledge freshness.
10. Legacy behavioral parity.
11. Product Instance lifecycle and restart continuity.
12. Real user-facing surface.

Do not solve these as isolated CRUD modules. Solve them through end-to-end product slices.

## The build strategy

Build the spine repeatedly:

`Intent → Capability → Routing → Authority → Work → Realization → Effect → Result → Evidence → World → Surface → Continuity`

For each hard problem:
- characterize only what is needed;
- design a candidate;
- run the strongest available falsifier;
- implement;
- test;
- integrate into a real slice;
- package the solution;
- document what remains unknown.

Never confuse a passing unit test with live provider/browser proof.
