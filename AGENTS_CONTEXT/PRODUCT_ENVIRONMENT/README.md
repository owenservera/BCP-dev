# VIVIM Product Environment — Cold-Start Context

> Status: ACTIVE RESEARCH CONTEXT
> Purpose: characterize the missing product/machine boundary that turns Ω/VIVIM into a real sovereign Windows environment.

## Why this context exists

The current destination architecture is strong in machine-side semantics, governance, vault durability, capabilities, intent, evidence, and provider realization. It is materially weaker at the boundary where VIVIM becomes an actual desktop product.

The next major research target is therefore not another abstract subsystem. It is the environment the user actually launches, inhabits, interacts with, recovers, and trusts.

This context covers the destination frontier around:

- native Windows product shell;
- product startup and lifecycle;
- local OS/filesystem/application integration;
- desktop interaction;
- external resource lifecycle and hydration;
- local security and secret integration;
- notification/attention delivery;
- product diagnostics/recovery/repair.

The goal is to determine the smallest coherent machine/product substrate that lets the existing Ω semantic core become a sovereign personal computing environment.

## Core thesis

VIVIM is not a web application pretending to be an operating environment.

The product environment should be a governed realization of the existing semantic model:

```
ADDRESS
→ INTENT
→ CONTEXT
→ CAPABILITY
→ CHOICE / ROUTING
→ AUTHORITY
→ WORK
→ EXECUTION
→ EVIDENCE
→ WORLD UPDATE
```

The Windows layer must provide real machine capabilities without becoming a second authority model, second storage system, or provider-specific special case.

## Relationship to other work

- Personal Agent / Self-Knowledge explains the system to the user and exposes its state, capabilities, relationships, and evidence.
- Agentic Core explains durable work and governed execution.
- World/Object Core explains canonical identity and projection.
- Product Environment explains the machine boundary in which those systems live.
- Provider Lab explains browser-mediated external reality.
- Product Environment must consume these systems, not replace them.

## Current program position

The destination dependency model identifies Product Shell / Native Windows as an L-1/L0 frontier with very high leverage for VS1 (Run My VIVIM). Related frontiers include OS/filesystem/application integration, desktop interaction, resource lifecycle, secret integration, and diagnostics/recovery.

The existing repository contains historical Windows, frontend, browser, installer, local-resource, and application-integration evidence, but no single destination-grade product boundary owns the whole problem.

## Research rule

First characterize. Then reconcile. Then define falsifiers. Only after the design package is accepted should production implementation begin.

Do not invent an architecture merely because a framework is convenient.

## Non-goals

This context is not a framework-selection exercise alone.

It is not:

- a UI redesign isolated from machine capabilities;
- a replacement for the Ω vault;
- a second OS abstraction that duplicates capability semantics;
- a browser automation architecture;
- a generic cross-platform desktop framework study with no VIVIM-specific boundary;
- a production implementation task.

## Cold-start order

1. `STATE.md`
2. `VISION.md`
3. `OPEN-FRONTIER.md`
4. `LAUNCH-PROMPT.md`
5. current `docs/destination/` product and dependency artifacts
6. Ω architecture and existing Windows/local-resource evidence
7. Legacy VIVIM machine/product evidence

## Expected outcome

A research package that tells the build program exactly:

- what the product environment is;
- what it owns;
- what remains delegated to plugins/capabilities;
- how Windows resources become inspectable objects/capabilities;
- how shell and surface lifecycle work;
- how startup, shutdown, crash, update, rollback, and recovery work;
- how desktop interaction is governed;
- how resources are hydrated/suspended/leased;
- how secrets cross the machine boundary safely;
- how attention is delivered;
- how the product diagnoses and repairs itself;
- which assumptions require live owner-machine experiments.
