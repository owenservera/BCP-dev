# ADR 001 — Kernel Location: `src/plugin-kernel/` (not `src/kernel/`)

- **Date:** 2026-08-28
- **Status:** Ratified (I-1)
- **Deciders:** agent (E2E owner)
- **Tags:** naming, boundaries, arch-test

## Context

`src/engines/kernel/` already exists and is live. It is a diagnostics/observability kernel:

- `src/engines/kernel/kernel-registry.ts:15` — `class KernelRegistry` registers `EngineDescriptor`, `StoreDescriptor`, `CapabilityDescriptor`, `RouteDescriptor`; exposes `describe(): SystemTopology`, `listEngines()`, `health/dependentsOf`, `markRunning/markError`.
- Siblings: `kernel-context.ts`, `kernel-bootstrap.ts`, `kernel-provenance.ts`, `kernel-tracer.ts`, `oracle-actuator.ts`, `oracle-diagnostic.ts`, `oracle-event-stream.ts`, `oracle-query.ts`.

A proposed `src/kernel/` for the plugin activation kernel would collide on two axes: filesystem (`grep -r "kernel"`) and conceptual (two "kernels" with unrelated purposes — one introspects, one activates). Audit B4 flagged this; probe confirms it is load-bearing, not cosmetic.

## Decision

The plugin activation kernel lives at **`src/plugin-kernel/`**. Bare `src/kernel/` will never be created.

## Consequences

- `tests/arch/kernel-boundary.test.ts` asserts `src/plugin-kernel/**` never imports from `src/engines/*` — including `src/engines/kernel/` — and never from `plugins/*`. The test is added in Phase 1.5 while the dir is nearly empty (cheapest time).
- `src/engines/kernel/KernelRegistry` becomes a **consumer** of plugin-kernel events: each installed plugin registers an `EngineDescriptor` row the same way core engines do today. No structural change to `KernelRegistry` required; it just gets new rows, giving `/api/system/topology` and health dashboards free visibility into plugins.
- Import discipline: `plugin-kernel → {shared, src/schema, src/storage/contracts, src/lib}` only. The arrow never reverses.

## Alternatives Considered

- `src/kernel/` + rename diagnostics kernel → rejected: diagnostics kernel is already imported across the codebase; renaming it is higher churn and higher risk than picking the non-colliding path now.
- `src/plugin/kernel/` → rejected: implies plugin-kernel is a sub-concern of a broader `plugin` module that does not exist; the kernel is top-level activation infra.
