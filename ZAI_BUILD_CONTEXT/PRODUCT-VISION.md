# VIVIM Product Vision — Builder Edition

## What you are building

VIVIM is a **sovereign personal computing environment** running primarily on the user's machine.

It is local-first, network-optional, provider-agnostic and user-governed.

The product is not:
- a SaaS chatbot;
- a wrapper around one AI provider;
- a collection of developer tools;
- a centralized user database;
- an autonomous system with authority to change itself without user governance.

The product is:

> **My machine. My internet. My accounts. My apps. My data. My intelligence. My rules. My interaction.**

## The user's world

VIVIM should eventually hold and relate:
- conversations;
- messages;
- files and documents;
- artifacts;
- projects and workspaces;
- people;
- providers/accounts/sessions;
- tasks and durable Work;
- history and evidence;
- memories;
- interests;
- capabilities/plugins;
- agents;
- external services;
- user-created surfaces.

The user should not need to know the internal architecture to use these things.

## Universal interaction

The universal entry/prompt is a native control surface, not merely a chat box.

A user should be able to address:
- VIVIM itself;
- a project/workspace;
- a conversation;
- an account/provider/model;
- a file/document/artifact;
- an agent or capability;
- an existing Work;
- a person/service;
- an external AI provider.

The system resolves:

`Address → Intent → Context → Capability → Choice/Routing → Authority → Work → Execution → Evidence → World/Memory update`

## Governed intelligence

VIVIM may use local or external AI.

AI output is never automatically authority.

Generated code, plans, provider mappings, routing suggestions and Forge proposals must pass the appropriate contract, evidence, policy and promotion boundaries.

The user owns policy.

Explicit user constraints cannot be silently overridden by learned ranking.

## The world is canonical; surfaces are projections

Canvas, workspace, chat, dashboards and future spatial/3D views are representations of canonical state.

Do not make the UI the source of truth.

A canonical object should be able to:
- exist without a particular surface;
- have stable identity;
- relate to other objects;
- change through versions/revisions;
- carry evidence/provenance;
- be projected into different surfaces;
- be exported/restored.

## AI provider philosophy

VIVIM should be able to work with multiple AI providers through a common semantic capability layer.

Provider-specific behavior belongs at the realization/extension boundary unless evidence proves it is canonical.

The product must distinguish:

`Provider ≠ Account ≠ Session ≠ Browser Resource ≠ Realization`

The browser may be the physical substrate for a provider realization, but a locator such as debugPort is not sufficient identity.

## Product experience

A successful early VIVIM should let a user:

1. Start VIVIM.
2. Have a durable personal instance/world.
3. See/use a coherent product surface.
4. Connect a real AI provider account.
5. Choose an account/provider/model according to explicit policy.
6. Send work through the provider.
7. Receive and preserve the result.
8. See what happened and why.
9. Continue later.
10. Close/reopen and find the same world.
11. Recover from provider/browser failures truthfully.
12. Work with artifacts/documents/files.
13. Run durable background Work.
14. Eventually create/evolve capabilities through Forge.

## V1 philosophy

Do not attempt the entire vision simultaneously.

But do not reduce V1 to a technically elegant Ω kernel with no product.

V1 should be a **real product spine** that exercises:
- identity;
- external resources;
- governed action;
- durable work;
- canonical world;
- evidence;
- surface;
- continuity.

Then expand.

## Legacy knowledge

Legacy VIVIM contains valuable behavioral knowledge:
- browser/provider control;
- account/session relationships;
- conversation continuity;
- workspace/canvas;
- background execution;
- export/recovery;
- discovery/healing.

Harvest behavior and evidence.

Do not copy its architecture.

## Ω knowledge

Ω contains the strongest current governance model:
- vault;
- law;
- authority;
- recipes/composition;
- capabilities;
- realizations;
- evidence;
- governed run;
- Forge boundaries.

Preserve these distinctions while extending the product.

## What success looks like

At the end of autonomous development, the owner should be able to clone the repository, run the product, open the WebApp, interact with VIVIM, inspect meaningful system state, exercise real provider/browser behavior where credentials permit, download the complete build, and download reusable solution packages for the major hard problems solved along the way.

The system should be understandable by another fresh engineering agent without needing this conversation.
