# VIVIM Conceptual Model

> Classification: DERIVED — WORKING / DRAFT
> This is a human-level conceptual vocabulary, not a database schema.

## Core concepts

**World** — the persistent environment representing the person's digital reality and relevant context.

**Space** — a spatial context in which things can be organized, related, surfaced, and experienced.

**Thing** — a meaningful entity in the world: project, conversation, document, person, account, repository, service, agent, task, idea, memory, or other entity.

**Context** — the relevant subset of the world assembled around what the person is doing, thinking about, or asking.

**Relationship** — a meaningful connection between things that can be understood and navigated.

**Surface** — a representation or interaction form through which a thing or context is experienced. One thing may have many surfaces.

**Attention** — what the person has asked the environment to care about, or what current activity makes salient.

**Address** — who or what an interaction is directed toward: VIVIM, a thing, space, agent, plugin, person, provider, or other target.

**Intent** — what the person wants to accomplish.

**Capability** — a power that can be exercised in the environment.

**Work** — an outcome entrusted to the environment. It may be immediate, scheduled, event-triggered, ongoing, or background.

**Agent** — a governed actor that performs delegated work using available capabilities.

**Authority** — the boundary of what an actor may do, under what scope and approval conditions.

**Evidence** — material supporting what was observed, produced, inferred, or claimed.

**Memory** — persistent knowledge or state retained about the world with explicit semantics.

**Time** — history and continuity: what happened, what is happening, what is scheduled, and what can be replayed, undone, or forked.

**Configuration** — how the person chooses the environment, plugin, capability, surface, task, attention, or policy to behave.

**Composition** — combining capabilities, things, surfaces, data, triggers, and policies into larger behavior.

**Plugin** — a provider of explicit powers to the environment, including capabilities, boundaries, configuration, dependencies, access, and possible effects.

**Forge** — the environment's native ability to create, modify, compose, extend, repair, replace, and evolve capabilities and surfaces.

## Candidate human verbs

See · navigate · focus · inspect · address · ask · create · connect · move · configure · run · delegate · approve · refuse · verify · remember · replay · share · export · forge

## Important separations

### Reality and representation
A tile, graph node, summary, or other surface is not automatically the canonical thing itself.

### Evidence and authority
Evidence can inform an action without granting permission to perform it.

### Capability and realization
A semantic capability can have multiple implementations or provider realizations.

### Intent and execution
Understanding what the person wants is distinct from deciding whether it may happen and how it will be executed.

### Work and mechanism
The person delegates an outcome. The system may combine deterministic tools, local data, LLM reasoning, provider sessions, and other capabilities.

### Space and world
Spatial arrangement is a representation of the world, not the only source of truth.

## Working UX grammar

A candidate chain is:

World → Context → Focus → Address → Intent → Capability → Authority → Work → Evidence → Memory → evolved world

This model is intentionally provisional. Future UX sessions should challenge it and refine it before it becomes canonical.
