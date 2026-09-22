# Step 1.15: BASELINE SYNTHESIS — What Exists Today

**Date:** 2026-08-28
**Sources:** Steps 1.1-1.14
**Status:** SYNTHESIZED

---

## Executive Summary

The vivim-next codebase has **the pieces of a VS Code-style extension model scattered across at least 8 subsystems**. Some pieces are production-grade (QuickJS sandbox, slot system, capability registry), some are aspirational (`reprogrammability/` with 7 surface kinds and 8 mutation ops, but not fully wired), and some are explicit stubs (`POST /api/plugins/install`).

**There is no single "extension model" today. There is a constellation of extension points, each with its own contract, its own lifecycle, and its own gap.**

This document maps the constellation. Phase 2-5 of this research project will design what unifies them.

---

## The Real Extension Surface (as the code actually works today)

### 1. Capabilities (the closest thing to "commands")

**Working today.** Two layers:

- **`UnifiedCapabilityRegistry`** (`kernel/capability/unified-registry.ts`) — declarative. `UnifiedCapability = { id, slug, name, description, category, surfaces, inputSchema, outputSchema, handler, cliCommand?, ui?, uiAction?, workflowNodeType?, mcpToolName?, apiEndpoint?, isAsync, requiresConfirmation, tags[] }`. Validated strictly (id/slug uniqueness; surface-specific fields required). 5 surfaces: `cli | ui | workflow | mcp | api`. Auto-exports to each surface.
- **`LiveCapabilityRegistry`** (`kernel/capability/live-capability-registry.ts`) — **runtime registration.** `LiveCapabilitySpec = { slug, name, description, handlerSpec, inputSchema, surfaces, registeredBy }`. **3 handler kinds: `mcp | http | inline`.** Persisted to `LiveCapabilityStore`, hot-reloaded via `CapabilityEventBus`. Auto cross-surface (CLI/UI/MCP/API/workflow bindings generated from `surfaces[]`).
- **Bootstrap** (`kernel/capability/capability-bootstrap.ts` + `capability-bootstrap-generated.ts`) — loads from `seeds/taxonomy/pool.taxonomy.json` (NOT in vivim-next) at boot. The hand-written `default-caps.ts` is forge-only.
- **Router bridge** (`plugins/plugin-system/router-capability-bridge.ts`) — covers 70+ HTTP endpoints as capabilities, auto-skipping if a real capability already exists.

**Gaps:**
- `requiresConfirmation: false` hardcoded for live caps (Step 1.7).
- HTTP live handler bypasses `ConsentEngine` (Step 1.11).
- No version, no manifest, no permission declaration in `LiveCapabilitySpec`.

### 2. Provider plugins (data-driven, complete)

**Working today, but limited to chat providers.**

- **12 JSON manifests** in `seeds/providers/manifests.ts` (forge; not in vivim-next). Each declares `provider`, `endpoints`, `models`, `parsers`, `capabilities_config`, `config`.
- **`ProviderRegistrar`** (`plugins/provider/provider-registrar.ts`) — `seedAll()`, `register(manifest)`, `seedProvider(slug)`, `verifySeeds()`. 6 tables per provider: `provider_definition`, `provider_endpoint`, `provider_parser` (2-pass fallback), `provider_capability`, `provider_config`, `provider_model`.
- **`provider-protocol-generator.ts`** (22354 lines) — reads DB, emits static `provider-protocol.ts`. `provider-protocol.dev.ts` is the editing surface.
- **8-phase onboarding pipeline** (`devops/onboard-controller.ts`): `discover → infer → test-selectors → test-parse → test-cap → test-frontend → verify → converge`. Developer workflow.

**Gaps:**
- 8-phase pipeline is developer-only. No runtime install for end users.
- No version management (re-running `seedAll` overwrites).
- No signing.
- Doesn't generalize to non-provider extensions (the manifest is provider-specific).

### 3. The reprogrammability substrate (aspirational)

**Designed, partially implemented in forge, NOT migrated to vivim-next.**

- **7 surface kinds**: `card | panel | layer | primitive | chrome | slot | custom`. (Step 1.4)
- **8 mutation ops**: `replace | insert | remove | reorder | restyle | rebind | set_property | set_slot`. (Step 1.4)
- **6 provenance tags**: `manual | nlcl | prefix | plugin | llm-harness | system`. (Step 1.4)
- **`ReprogrammableSurface` contract**: `id, kind, label, slot?, capabilities?, tags?, getSpec(), mutate(mutation), supportedOps, specSchema?`. Atomic mutations; no side effects in `mutate()`.
- **`SurfaceRegistry` singleton** (`surfaceRegistry`). 3 origins: frontend classes, backend descriptors (Phase 8, not done), plugin factories (Phase 9, partially done).
- **`SurfaceMutationPlan`**: ordered sequence + optional rollback. Producers: Composer, Reprogram Modal, Visual Builder, LLM Harness, **Plugins** (Phase 9).
- **DSL** in `reprogrammability/dsl/` (grammar.ts, parser.ts, executor.ts). The user-facing language.
- **`InMemorySurface`**: a permissive default impl.

**Gaps:**
- Not migrated. The forge has the code; vivim-next's `plugin-system.ts` imports from `../reprogrammability/contract.js` which doesn't exist in the new tree.
- Phase 8 (Prisma backing) and Phase 10 (audit/enforcement) are not done.
- "Plugin-provided factories" is the closest thing to an extension model, but only one Phase 9 surface is wired (in `plugin-system.ts` lines 32-49): `ProviderPlugin.surfaces: ReprogrammableSurface[]`.

### 4. The frontend slot system (production-grade, narrow)

**Working today, the cleanest extension surface in the codebase.**

- **30 named slots** in `surfaces/web/src/ui/slots.ts`: `chat.*` (13), `*.panel` (10), `tab.*` (3), `entry.unified` (1). Each has `overridableBy: 'capability' | 'provider' | 'both'`.
- **`UIComponentRegistry`** (`surfaces/web/src/ui/registry.ts`) — external store with `subscribe()`, `getVersion()`. Three layers: `defaults` (per-slot), `bespoke` (per-slot + per-slug), `catalog` (key → component). Resolved precedence: `capabilitySlug > providerSlug > default`.
- **Live updates** via `useSyncExternalStore`.
- **Persisted** via `persist()` on every emit (likely localStorage; not read).
- **P8 sandbox**: each component carries a `sandbox: string[]` whitelist of capabilities it may call.
- **`SlotOverrideClaim`** is the wire format from backend: `{ slot, component?, sandbox? }`. `component` is a catalog key (a string), not a React component.

**Gaps:**
- 30 slots are HARDCODED. You can't add a new slot position. You can add a new renderer for an existing position.
- `AnyComponent = ComponentType<Record<string, unknown>>` is permissive — wrong casts are runtime errors.
- No validation of `component` key (if the catalog doesn't have it, fallback is unspecified).

### 5. The plugin runtime (split in two)

**Two unconnected pieces, both aspirational.**

- **`PluginManagerImpl`** (`plugins/plugin-system/plugin-system.ts`): `ProviderPlugin` contract with 5 mandatory hooks (`onRegister`, `onResolveCapabilities`, `onAction`, `onProjectState`, `onParse`) + 3 optional Phase 9 (`surfaces`, `mutationHandlers`, `capabilities`). Errors swallowed, events emitted. Lazy import of `SurfaceRegistry` to break a cycle.
- **`PluginHotReload`** (`plugins/plugin-system/plugin-hot-reload.ts`): a *different* `ProviderPlugin` type — `{ id, name, version, filePath, exports, loadedAt }`. Watches a directory for `.ts`/`.js`, dynamic-imports with cache-bust, no contract beyond `id/name/version`.

**The two are NOT connected.** No code in either file references the other. The hot-reload produces load records; the manager has hooks. There is no glue.

**Gaps:**
- "plugin" has 3 meanings: `ProviderPlugin` (contract, Step 1.1), `ProviderPlugin` (load record, Step 1.2), provider manifest (data, Step 1.6). Same name, three semantics.
- No `onActivate` / `onDeactivate` lifecycle.
- No resource limits (CPU/memory budget not enforced on plugins).
- No version. No dependencies. No activation events. No per-plugin sandbox.

### 6. The sandbox (production-grade for live caps, missing for plugins)

**QuickJS WASM with vm-mode fallback. Permissions are allowlist (default-deny).**

- **`SandboxRunner`** (`kernel/security/sandbox-runner.ts`): QuickJS default, vm-mode requires `VIVIM_UNSAFE_VM=1`.
- **`SandboxPermissions`** = `{ canFetch: string[], canReadFile: string[], canWriteFile: string[], canUseClipboard: boolean }`. Empty = no.
- **`SandboxBudget`** = `{ cpuMs, memoryBytes }`.
- **Audit log**: `sandbox-audit-store.ts`. Per-call `auditId`.
- **`LiveCapabilityRegistry` inline handler** uses sandbox with `canUseClipboard: true` only. Cannot fetch, cannot read files.
- **`HarnessRepairEngine`** cleans LLM output. Side-table repair metadata, no prototype patching. Preserves apostrophes.
- **`ConsentEngine`**: 6-tier classification (`read < write < navigate < destructive < financial = communication`), time-bounded grants (default 1h), `defaultDeny: true`, `requireApprovalAbove: 'write'`.
- **`safe-expression.ts`** (14136 lines) — AST allowlist, the *proper* replacement for `safe-eval.ts` denylist.
- **`trust-score.ts`** (8326 lines) — provenance → score. Plugins get a score from `MutationProvenance`.

**Gaps:**
- **Live HTTP handlers bypass ConsentEngine.** (Step 1.7 → Step 1.11.) Real security gap.
- `safe-eval.ts` is explicitly a stop-gap (HAZARD H9).
- `permissionsFor()` for live caps is hardcoded (no per-cap override).
- The `SandboxRunner` is used by `LiveCapabilityRegistry` but NOT by `PluginManager`. Plugin code runs in the host process.

### 7. Storage contracts (60 interfaces, Node layer universal)

**Production pattern, but closed.**

- **~60 typed contracts** under `kernel/storage/contract/`. The biggest: `conversation-store.ts` (10,281 lines), `agentic-store.ts` (9104), `node-store.ts` (4400), `capability-store.ts` (4833), `canvas-store.ts` (4721).
- **`NodeStore` is the universal layer** (Step 1.13): every node type (message, email, document, contact, task, event, media, social post, financial, ...) is a Node. Has NodeVersion (append-only time travel) and NodeAlias (entity resolution). ACU-proven fields: `contentHash, version, state, securityLevel, contentType, authorDid, signature, acl, quality, validFrom, validUntil, parentVersion`.
- **Interface-first invariant** (AGENTS.md P2): "Engines depend on `src/storage/contracts/*.ts`, never `src/storage/impl/*.ts`."
- **JSON blobs for structured data** (`*Json` fields). Pragmatic but not type-safe at the DB level.
- **ACL is on the data, not the contract.** A user extension that gets a `NodeStore` reference can call any method; the ACL is on the `aclJson` field.

**Gaps:**
- `impl/` directory (Prisma implementations) is NOT in vivim-next. Contracts have no impls in the new tree.
- A user extension can write a Node with any `type: string`. But other systems (renderer, search, capability registry) won't know what to do with the new type — new node types are data-only.

### 8. Distribution (a stub)

**An upload endpoint that acks and emits an event. Nothing else.**

- `POST /api/plugins/install` accepts a `.vivim-plugin` tarball (multipart). Generates `pluginId`, emits `plugin:registered`, returns OK. **No extract, no validation, no registration.** Comment at line 31-33 explicitly says "For the prototype" and references a "production impl" that doesn't exist.
- `PluginHotReload.start(directory)` watches a local directory for `.ts`/`.js` files.
- `provider-protocol-generator.ts` regenerates the static protocol file from DB.
- **NO marketplace.** (Grep returns 0 matches in vivim-next source.)
- **NO signing, NO checksums, NO version management.**
- **Test ahead of code:** `tests/integration/providers/plugin-lifecycle.test.ts` references `onUpgrade`, `onUninstall`, `onHealthCheck` hooks that don't exist in `plugin-system.ts`. The test uses `as any` to bypass.

**Gaps:**
- The install endpoint is the entire distribution pipeline. It's a stub.
- No format spec for `.vivim-plugin`. No manifest schema. No version concept.
- No rollback. No update mechanism for non-provider plugins.
- No trust model for installed plugins (they're fully trusted by default).

---

## The Map: 5 Extension Surfaces, 8 Implementation Layers

| Surface | Real extension point? | Code today | Production-grade? | Gaps |
|---|---|---|---|---|
| **Capabilities** | YES | `LiveCapabilityRegistry` (3 handler kinds, persisted, cross-surface) | ✓ Works | requiresConfirmation hardcoded false, HTTP bypasses consent |
| **Providers** | YES (chat only) | 12 JSON manifests → 6-table upsert → static file | ✓ Complete | No runtime install, no version, no signing |
| **Reprogrammability** | PARTIAL | Forge only; 8 ops, 7 kinds, DSL, registry singleton | ✗ Not in vivim-next | Migration incomplete; Phase 8 + 10 not done |
| **Frontend slots** | YES (UI only) | 30 slots, UIComponentRegistry, P8 sandbox | ✓ Production-grade | Hardcoded slots; permissive typing |
| **Plugin runtime** | PARTIAL | 2 unconnected systems (PluginManager + PluginHotReload) | △ Aspirational | No glue; 3 "plugin" meanings; no onActivate |

---

## What's ASPIRATIONAL vs REAL

**ASPIRATIONAL (designed but not built):**
- Reprogrammability's Phase 8 (Prisma backing) and Phase 10 (audit/enforcement).
- The full plugin lifecycle: `onUpgrade`, `onUninstall`, `onHealthCheck`.
- The `.vivim-plugin` format spec.
- The marketplace.
- A unified `ProviderPlugin` interface that combines the load record + the contract.
- A glue between `PluginManager.register()` and the `LiveCapabilityRegistry` / `SurfaceRegistry`.
- Migration of `reprogrammability/` to vivim-next.

**REAL (built but partial):**
- `LiveCapabilityRegistry` — works, but security gaps.
- `UIComponentRegistry` (frontend slots) — works, but constrained to 30 positions.
- `ProviderRegistrar` + provider manifest pipeline — works, but provider-only.
- `SandboxRunner` (QuickJS) — works, but not used by plugins.
- `ConsentEngine` — works, but bypassed by live HTTP handlers.
- `NodeStore` — works, but extensions can only read/write existing data shapes.

**REAL (built and complete):**
- `CapabilityEngine` + `UnifiedCapabilityRegistry` for engine-declared capabilities.
- `ChatProvider` system: discover → seed → execute.
- The `Node` layer (versioning, ACL, ACU fields).
- The QuickJS sandbox with default-deny permissions.

**STUBS (acknowledged TODOs):**
- `POST /api/plugins/install` — explicit "prototype" comment.
- `safe-eval.ts` — explicit "stop-gap" comment (HAZARD H9).

---

## The Design Question for Phase 2-5

**There is no single "extension model" today. The closest things are:**

1. **`LiveCapabilityRegistry`** — runtime-registered, persisted, cross-surface, with a 3-kind handler model. **This is the "user adds a new command" path.**
2. **`UIComponentRegistry` slots** — runtime-registered, persisted, with a 30-position catalog and per-component sandbox. **This is the "user adds a new UI piece" path.**
3. **`SurfaceRegistry`** (reprogrammability) — runtime-registered, atomic mutations, with a 7-kind/8-op model. **This is the "user modifies an existing surface" path.** (Not in vivim-next.)
4. **`ProviderRegistrar`** — runtime-seedable, but build-time regeneration. **This is the "user adds a new chat provider" path.**

**None of these is the "VS Code extension model" the user asked for.** The VS Code model is:
- A package format (`.vsix` / tarball)
- A manifest (`package.json` with `contributes`)
- An activation model (`activationEvents`)
- An API surface (`vscode.workspace`, `vscode.window`, ...)
- A permission model (`"permissions": [...]`)
- A marketplace
- Hot-install + hot-update
- Multi-extension compatibility

**What we have is fragmented into 4 mechanisms, each with a partial subset of those concerns.** A unified extension model would need to:

1. **Pick a package format** (likely the `.vivim-plugin` tarball, but specify the manifest).
2. **Pick a manifest schema** (combine `ProviderPlugin` + `LiveCapabilitySpec` + `SurfaceSpec` + `SlotOverrideClaim`).
3. **Pick an activation model** (lazy on first event? eager on install? declarative via `activationEvents`?).
4. **Pick an API surface** (consolidate the 4 registries + 60 contracts into a "what an extension can call" list).
5. **Pick a permission model** (extend `SandboxPermissions` + `ConsentEngine` to the extension level).
6. **Specify a marketplace or distribution story** (the stub endpoint needs to become real).
7. **Unify the 3 plugin runtimes** (PluginManager + PluginHotReload + LiveCapabilityRegistry).

**Phase 2-5 of this research will design that unified model.** This baseline is the foundation.

---

## Cross-Reference Index

| Topic | Step |
|---|---|
| ProviderPlugin contract (5 hooks + 3 optional) | 1.1 |
| PluginHotReload (file watcher, cache-bust) | 1.2 |
| Router-bridge (70+ HTTP → capabilities) | 1.3 |
| Reprogrammability (8 ops, 7 kinds, 6 provenance, DSL) | 1.4 |
| Canvas (7 NodeTypes, config.toml, P8 no-inline-script) | 1.5 |
| Provider plugins (12 manifests, 6-table upsert) | 1.6 |
| Capability system (Unified + Live registries) | 1.7 |
| Capability bootstrap (pool JSON → registry) | 1.8 |
| Harness (DAG executor + LLM repair) | 1.9 |
| Memory & knowledge (episodic/semantic/procedural, FSRS-6, Node layer) | 1.10 |
| Security (QuickJS sandbox + 6-tier consent + trust score) | 1.11 |
| Frontend slots (30 positions, UIComponentRegistry, P8 sandbox) | 1.12 |
| Storage contracts (60 contracts, NodeStore universal) | 1.13 |
| Distribution (POST /api/plugins/install STUB) | 1.14 |

**15 steps, 14 atomic outputs, 1 synthesis. Total: 15 commits for Phase 1.**
