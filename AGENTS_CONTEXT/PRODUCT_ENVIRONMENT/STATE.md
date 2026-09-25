# Product Environment — STATE

> Status: ACTIVE HANDOFF
> Classification: DERIVED — CONTEXT, NOT ARCHITECTURE LAW
> Date: 2026-09-25
> Repository: https://github.com/owenservera/BCP-dev
> Branch prepared from: main

## 1. Current reason for this work

Personal Agent / Self-Knowledge research is now running as a separate dedicated workstream.

The next unresolved high-leverage area is the **Product Environment / Native Windows Substrate**: the boundary that turns VIVIM from a strong machine-side semantic/runtime system into an actual sovereign desktop environment.

## 2. Why this is high priority

The destination dependency model identifies these related frontiers:

- F1 native Windows product shell;
- F2 install/update/rollback lifecycle;
- F3 local OS/filesystem/application integration;
- F4 desktop interaction substrate;
- F5 notification/attention delivery;
- F8 resource lifecycle/hydration;
- F9 local security/secret integration;
- F14 product diagnostics/recovery/repair.

F1, F3, and F4 are currently especially under-characterized and each carries very high cross-cutting complexity.

VS1 — Run My VIVIM — cannot reach productized maturity without a coherent answer to this boundary.

## 3. What already exists

Repository evidence includes:

- Ω local-first startup/boot and vault machinery;
- Ω surface and canvas concepts;
- liveness and hydration concepts;
- governed capabilities and authority;
- browser/Chrome resource machinery;
- legacy Windows/application/frontend and installer evidence;
- product-instance lifecycle characterization;
- diagnostics, health, refusal, evidence, and healing mechanisms;
- destination-level first-run, recovery, and export requirements.

These are evidence to reconcile, not automatically the final product architecture.

## 4. Key boundary questions

The research must determine:

1. What exactly is the VIVIM process/application boundary on Windows?
2. Which responsibilities belong to the shell, runtime, plugins, OS adapters, and ordinary capabilities?
3. How does a native VIVIM surface coexist with browser surfaces and future application-like surfaces?
4. How do filesystem, processes, windows, clipboard, keyboard, mouse, notifications, and other OS resources become governed capabilities?
5. How are external resources represented when available, dormant, unavailable, suspended, or replaced?
6. How do secrets flow between Windows credential facilities and ordinary capabilities without leaking into canonical payloads?
7. What is the safe product lifecycle across install, first run, start, crash, update, migration, rollback, uninstall, export, and restore?
8. How does a user understand and repair the environment after failure?
9. What requires owner-machine experimentation rather than repository research?
10. How should the environment remain self-describing and compatible with the Personal Agent model?

## 5. Architectural invariants to preserve

- no second canonical data store;
- no privileged shell authority bypassing normal law/capability paths;
- surface is not canonical storage;
- representation is not authority;
- capability is not realization;
- resource is not automatically an authority;
- secrets are reference-only in normal work data;
- unknown is not failure;
- crash recovery must derive from durable state rather than process memory;
- UI/framework choice must not become semantic authority.

## 6. Current maturity view

| Area | Current read |
|---|---|
| Native product shell | L-1 / unscoped |
| Product lifecycle | L0–L1 / under-modelled |
| OS/filesystem/app integration | L0–L1 / under-modelled |
| Desktop interaction | L-1 / mostly absent as destination model |
| Notification delivery | L-1 / conceptually related to attention |
| Resource hydration/lifecycle | L1 / partial |
| Local secret integration | L1 / partial |
| Product diagnostics/recovery | L1–L2 / fragmented |

These are working estimates for research sequencing, not proof claims.

## 7. Immediate downstream relationship

The research should be shaped around a future VS1 proof:

```
INSTALL / ACQUIRE
→ FIRST RUN
→ INITIALIZE LOCAL WORLD
→ START PRODUCT
→ SHOW USEFUL ENVIRONMENT
→ CLOSE / CRASH
→ RECOVER
→ REOPEN SAME WORLD
```

The first implementation slice should remain small enough to falsify the product boundary without prematurely solving the entire future desktop.

## 8. Open state

No production implementation should begin from this context alone.

The next launch prompt defines the research/design package, evidence expectations, contemporary technology research, and completion gate.
