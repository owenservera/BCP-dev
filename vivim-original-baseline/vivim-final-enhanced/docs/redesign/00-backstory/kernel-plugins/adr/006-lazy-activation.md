# ADR 006 — Lazy `activationEvents` Deferred: `ModuleRegistry` Stays Eager in v1

- **Date:** 2026-08-28
- **Status:** Ratified (I-1)
- **Deciders:** agent (E2E owner)
- **Tags:** bootstrap, lifecycle, ModuleRegistry, risk

## Context

- `src/server/module-registry.ts:59` `ModuleRegistry` is a declarative DI container: `ModuleDefinition { name, tags, dependsOn, create(deps), lifecycle:{init,start,stop} }`, Kahn's-algorithm topo sort, cycle detection. Its header says it is "infrastructure for future migration" away from `bootstrap-engines.ts` — that migration is this project.
- `src/server/bootstrap/orchestrator.ts:15` is already a 5-phase pipeline (`seeds → stores → knowledge → capabilities → lifecycle` via `BootstrapContext:37`). `src/server/bootstrap/phases/capabilities.ts:26` (738 lines) is where all dynamic registration lives — provider caps, cdp bindings, harness program resolver, MCP, memory fabric, policy/autonomous. It already activates `TrustedPluginManager`.
- Eager→lazy is subtle. `src/engines/*.ts` is 186 files. Deferring 150+ engine constructions to `activationEvents` (`onCommand:*`, `onProvider:*`, `onSchema:*`) without a per-engine audit risks boot ordering regression (a module that assumed eager construction is not ready when first needed).

## Decision

- **v1: `ModuleRegistry` stays eager.** No change to `define().create(deps)` signature. No `activationEvents` wiring. The kernel does not add lazy activation anywhere in v1.
- **v1 deliverable:** `evidence/capabilities-phase-audit.md` — classify every construction in `capabilities.ts:26` as "core, stays eager" vs "candidate for `FeatureContribution` + lazy `activationEvents`". This audit is the exit criterion for the axis in v1.
- **v2 (designed in v1):** `FeatureContribution { name, tags, dependsOn, activationEvents, create(ctx: PluginContext), lifecycle }` mapped to `ModuleDefinition`. Plugin-sourced modules receive `PluginContext` (permission-gated) instead of raw `ModuleDependencies:46` (`Record<string, any>`). In-tree `trusted:true` modules keep the raw bag during migration to avoid big-bang rewrite. Lazy activation is gated to the `capabilities` phase only — `seeds`/`stores` stay eager (they are infra the kernel depends on).

## Consequences

- Boot stays green and ordered in v1. The hardest lifecycle change ships after the trust layer and three axes are proven.
- `activationEvents` is parsed in the manifest in v1 but not acted on (validated, stored, ignored until v2 — with a clear note).

## Alternatives Considered

- Wire lazy activation in v1 across all phases → rejected: either we audit 186 files before shipping any axis (schedule risk) or we ship lazy without the audit (correctness risk).
- New `ActivationRegistry` on top of all 5 phases → rejected: `seeds`/`stores` are infra; lazily activating a store that the kernel needs to serve a plugin is a category error.
