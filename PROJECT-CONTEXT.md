# Project Context — Why VIVIM-Ω Exists

## The product

VIVIM is intended to be the place where a person's digital world lives: a local environment that can hold and operate their information, accounts, conversations, tools, agents, automations, and other digital objects as governed, composable things.

The important word is **environment**.

This is not primarily another application with a chat interface, another agent manager, or another browser shell. The product ambition is a personal operating environment in which meaning, capability, authority, work, evidence, memory, continuity, and interaction form one coherent system.

## The long-horizon proposition

Over a five-to-ten-year horizon, assume that models, agent frameworks, protocols, providers, browsers, execution substrates, and interfaces will all change.

The durable proposition should therefore be:

> A person can express what they want in human terms, have that meaning resolved into explicit and governed operations, act across their digital world, retain what happened and what was learned, and allow the environment to evolve without surrendering ownership or continuity.

The strongest candidate durable capabilities are:

- a human-readable semantic execution language;
- a persistent personal semantic world;
- governed action between intent and effect;
- durable Work, evidence, and continuity;
- governed self-extension and evolution.

These are conceptual assets, not declarations that today's implementations are already complete.

## The product anchor

The first tangible beta should be a persistent local VIVIM environment in which real provider webapps are usable as first-class external capabilities.

A simple visible realization may be a single-pane environment where one or more provider webapps occupy the working surface.

That is a **functional wedge**, not the destination.

The value of the wedge is that it creates a complete, falsifiable product path:

**person → address/expression → intent → context → capability → provider/account/realization → authority → work → browser/webapp → observed result → evidence → local continuity**

The provider remains external.

VIVIM owns the local semantic relationship, authorized interaction, configuration, Work, evidence, and continuity around that external system.

The browser is a realization mechanism, not constitutional authority.

## Sovereignty

The core product stance remains:

**my machine, my internet, my accounts, my data, my apps, my intelligence, my rules, my interaction.**

This is not merely a deployment preference.

It means the local environment should minimize unnecessary dependence on proprietary APIs and centralized application backends when a real user-controlled interface can provide the needed capability.

For the intended first provider realization, this means Chrome master/slave and browser-mediated execution; live shippability must be proven on the target runtime.

## From VIVIM to Ω

The older VIVIM implementations are the mine.

They contain useful algorithms, domain knowledge, fixtures, parser evidence, provider experiments, interaction patterns, failures, and hard-earned constraints. They also contain architectural debt, duplication, assumptions that should not survive, and structures that were never designed as one composable system.

Ω is the destination and the seeded baseline is its current implementation substrate.

The intended relationship is therefore:

**old VIVIM → evidence / ore / fixtures / proven mechanisms**

**Ω baseline → current implementation to inspect and challenge**

**fresh build → new architecture and roadmap derived from current reality**

Do not default to porting old code.

Reuse an old implementation when it is genuinely the best proven realization of a requirement, and treat that reuse as an explicit engineering choice.

## Canonical conceptual stack

The repository uses many implementation-specific structures, but the durable conceptual path is:

**World → Context → Intent → Capability → Authority → Work → Execution → Evidence → World/Memory update**

For a concrete external interaction:

**human expression → semantic meaning → governed action → external realization → observed result → durable local evidence**

These are semantic coordinates, not a required class hierarchy.

## Important distinctions

The system should retain the separations captured in `INVARIANTS.md`.

In particular:

- reality is not representation;
- evidence is not authority;
- intent is not execution;
- capability is not realization;
- provider is not account;
- account is not session;
- discovery is not routing;
- routing is not authority;
- memory is not context;
- Work is not the worker;
- World is not the surface.

These distinctions are more durable than today's component boundaries.

## Canonicality, memory, and surfaces

The intended model is:

- the **Vault** is the durable local source of truth;
- the **World** is canonical product-level reality/semantic organization derived from durable truth and relationships;
- **Work** is durable process reality;
- **Evidence** supports claims about what happened;
- **Context** is a task-scoped derived assembly;
- a **Surface** is a representation and interaction boundary;
- a **Process/Session** is transient execution state.

A canvas, chat surface, provider webapp, CLI, or future interface may represent the same underlying world.

A surface can be replaced without changing canonical identity.

Current context can change without changing the world's canonical meaning.

## Human semantic control

The central control inversion is:

**probabilistic perception → deterministic meaning → governed/deterministic execution**

Natural language is an interface, not authority.

AI can be used for ambiguity resolution, inference, synthesis, discovery, planning, adaptation, and other tasks where intelligence adds value.

But raw model output never becomes constitutional authority.

The strategic objective is not more AI everywhere.

It is to flatten the boundary between what needs probabilistic intelligence and what can now be deterministic while still remaining usable by a normal person through human language.

## Work, observation, and proof

Consequential work should be something the environment can observe, reconstruct, and prove rather than infer from process behavior.

Where knowable, distinguish:

- completed work;
- active work;
- interrupted work;
- deliberately stopped work;
- work that never actually started;
- genuinely uncertain external effects.

Completion should be positively evidenced where practical.

A disappeared process is not proof of completion.

Evidence should survive long enough that consequential claims remain reconstructable after the worker, process, browser session, or other transient mechanism disappears.

Observations, hypotheses, caveats, rules, and proofs are distinct.

## The Forge

Ω is intended to make extension a first-class capability.

Forge is not a privileged SDK or second authority system.

It is part of the same governed extensibility model as other plugins and compositions.

The long-term test is whether the environment can describe, create, prove, and incorporate new pieces of itself without giving those pieces a secret authority path.

## Evolution

VIVIM should be able to change without losing identity, evidence, sovereignty, or continuity.

The project should distinguish ordinary maintenance, governed evolution, and constitutional change conceptually even if the implementation expresses those categories differently.

A system that can change itself but cannot explain what changed, why, what was affected, what was authorized, and what evidence supports the result is not trustworthy self-evolution.

## Beta objective

The practical objective remains a functioning, coherent beta that real people can use.

The product should demonstrate a real end-to-end environment rather than an impressive inventory of disconnected subsystems.

The project should prefer a small complete vertical slice over many partial features.

Do not optimize for documentation volume, architecture ceremony, agent count, provider count, rule count, or feature count.

Optimize for demonstrated user value plus a trustworthy underlying system.

## How to interpret the seeded corpus

The seeded repository contains the current implementation, tests, fixtures, gates, build artifacts, and the 11 selected bootstrap documents. The larger historical Ω documentation corpus is intentionally omitted.

Some records are law, some are evidence, some are design candidates, some are plans, and some are archaeology.

The new project should classify those distinctions from the repository itself.

Never let a stale roadmap become the reason something gets built.

The historical destination material used to shape the seed accelerated understanding before bootstrap; it is not present as an inherited project-management system.

## Development environment

The project can be developed on Windows and should preserve genuine runtime-neutrality where it matters.

The ZCode harness is intentionally outside the product architecture described here.

Build whatever development machinery the work proves necessary.
