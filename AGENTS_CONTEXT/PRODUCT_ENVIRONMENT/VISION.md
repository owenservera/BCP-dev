# VIVIM Product Environment — Vision

## The product boundary

VIVIM should feel like an environment that happens to contain applications, providers, agents, files, conversations, and other resources rather than an application that merely links to them.

The user launches VIVIM and enters a persistent personal environment.

The environment can:

- reveal what exists;
- open or focus things;
- interact with the local machine;
- connect external resources;
- run governed work;
- survive process failure;
- explain its own state;
- repair or guide recovery;
- evolve its capabilities.

## Machine sovereignty

The machine boundary is part of the user's sovereignty claim:

> my machine, my apps, my files, my interaction.

Windows resources are therefore not hidden implementation details. They are concrete resources that can be represented, inspected, selected, and acted upon through ordinary VIVIM semantics.

But the machine must not become an unbounded capability escape hatch.

A desktop operation should still be:

```
intent
→ capability
→ applicable authority
→ execution
→ evidence
```

## Shell versus system

The shell should be treated as a product surface and lifecycle boundary, not as the place where semantic truth lives.

A shell may:

- start the runtime;
- render a surface;
- host navigation;
- mediate window and application lifecycle;
- surface notifications and recovery;
- expose local diagnostics.

It should not:

- become a second database;
- silently mutate canonical state;
- bypass policy;
- own arbitrary business semantics that belong in capabilities;
- force all future surfaces into one UI technology.

## Native does not mean monolithic

The destination may use more than one technical substrate.

Potentially:

- a native Windows host for lifecycle and machine integration;
- a web-rendered surface where appropriate;
- WebView2 or another embedded surface technology;
- native Windows APIs for OS capabilities;
- browser-hosted surfaces for providers;
- future application-like or spatial surfaces.

The architecture should define semantic boundaries first and allow technical realizations to change.

## The desktop as a governed resource system

Windows exposes many real resources:

- files and folders;
- processes;
- windows;
- displays;
- input devices;
- clipboard;
- notifications;
- networking;
- power/session state;
- installed applications;
- devices and peripherals;
- credential stores.

VIVIM should not model all of these as one generic object.

Instead, it should define a resource taxonomy and capability families that preserve identity, availability, authority, realization, lifecycle, and evidence.

## Product continuity

A sovereign environment must remain coherent across:

- start;
- stop;
- crash;
- restart;
- update;
- migration;
- restore;
- offline operation;
- temporary external-resource loss.

A running process is not the canonical state of the environment.

## Self-description

The Product Environment should be naturally queryable through the Personal Agent / Self-Knowledge system.

A user should be able to ask:

- What is running?
- Which windows/surfaces are open?
- Where is my data stored?
- Which plugins can access the filesystem?
- What resources are unavailable?
- Why can't VIVIM perform this desktop action?
- What changed after the update?
- What needs repair?
- Which capability opened this application?

These questions should resolve from canonical state, evidence, and current observations rather than an admin-only diagnostics subsystem.

## The first end-to-end proof

The minimal product proof is not “the UI opened.”

It is:

```
CREATE
→ RUN
→ USE
→ PERSIST
→ CRASH / CLOSE
→ RECOVER
→ REOPEN
→ EXPLAIN STATE
```

That proof establishes the machine boundary before the product grows further.
