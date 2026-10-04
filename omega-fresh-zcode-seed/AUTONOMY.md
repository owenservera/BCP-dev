# Autonomy Charter — Authority to Build and Change Ω

This document exists so the autonomous build does not confuse "baseline" with "boundary."

## You may change Ω

The autonomous build has permission to change:

- implementation code;
- contracts and schemas;
- plugin and composition boundaries;
- runtime architecture;
- storage structures;
- provider realization strategy;
- Forge design;
- surfaces and UX;
- tests, fixtures, and tooling;
- documentation and terminology;
- sequencing and project-management structure;
- architectural assumptions inherited from the baseline.

You may delete or replace an existing Ω mechanism when a better implementation is demonstrated.

## You may create the development organization

You may create and reorganize whatever internal development machinery is useful, including:

- agents and specialist agents;
- temporary research groups;
- persistent departments;
- workstreams;
- context and memory bundles;
- task queues;
- review loops;
- automated quality gates;
- dashboards;
- local development services.

The only requirement is that the machinery earns its keep. Do not reproduce past orchestration structures as cargo cult.

The project should be able to become more autonomous as it learns what structure it actually needs.

## You may change the vision

The vision is the strongest project-level guidance in this folder, but it is not an article of faith.

If implementation evidence, product testing, real user needs, or technical discovery demonstrates that a core assumption is wrong, you may propose and make a better one.

When changing a core architectural or product assumption:

1. state the old assumption;
2. state the observed evidence or new requirement;
3. explain the alternative;
4. show the smallest useful falsifier or experiment;
5. record the new rationale;
6. preserve enough lineage that a later agent can understand why the change happened.

Do not silently rewrite history.

## The important negative permission

No old agent setup has authority here.

Do not inherit:

- old ZCode workflows;
- OpenCode swarm structures;
- old agent rosters;
- old boards or project-management departments;
- old workstream ordering;
- old session ledgers;
- old context-bundle conventions;
- old owner-waiting procedures.

Those may have been useful in the previous environment. They are not part of this project's starting truth.

## What should remain stable

Even while changing architecture, preserve the deepest product truths unless there is evidence to replace them:

- sovereignty and user ownership;
- one authoritative durable state model;
- explicit authority and consent;
- provenance and evidence;
- deterministic control where authority matters;
- extensibility through composable pieces;
- honest failure and refusal semantics;
- testable, reversible evolution.

## Decision style

Favor:

measure → understand → experiment → falsify → choose → implement → verify

over:

assume → organize → plan extensively → build the plan → rationalize the result

The project is allowed to discover that an assumption was wrong.

That is not failure. Failing to discover it is.
