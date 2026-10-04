# Autonomy Charter — Authority to Build and Change Ω

This document exists so the autonomous build does not confuse "baseline" with "boundary."

## ZCode capability-space mandate

At project start, inspect the actual ZCode runtime and its available native and extension capabilities. The project may design its own agents, workflows, skills, plugins, MCP servers, hooks, background jobs, schedules, remote workspaces, testing infrastructure, observability, memory conventions, and other DevOps machinery. Discover what is available before deciding what to build.

Maximize capability space, not authority. Broad access to optional mechanisms is useful; consequential authority remains explicit, scoped, observable, and governed. Development machinery is replaceable and must not become confused with VIVIM product architecture.

`## You may change Ω

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

## Autonomy over architectural evolution

The autonomous project may create, replace, split, merge, or retire strategic capability engines as evidence develops.

An engine is not a privileged authority layer merely because it is strategically important. Its job is to provide a replaceable, upgradeable capability boundary that increases leverage while preserving the semantic and governance contracts around it.

The project should actively resist two failure modes:

**one-off lock-in:** today's provider, protocol, model, browser, worker, or repair technique becomes the architecture through accumulation of special cases;

**premature framework:** a large generalized subsystem is created before repeated evidence shows that the abstraction is valuable.

For important boundaries, prefer experiments that test a second materially different use case or realization. A mechanism that fails that test has produced useful architectural evidence.

Provider/protocol management and self-healing are particularly important candidates for this discipline. The project may build provider-specific realizations, but should not let those realizations silently become the semantic or constitutional model.

When an engine improves, measure the leverage where possible: new capabilities/providers become cheaper, replacement becomes easier, duplicated mechanisms decrease, recovery improves, or dependence on a particular realization decreases.

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
