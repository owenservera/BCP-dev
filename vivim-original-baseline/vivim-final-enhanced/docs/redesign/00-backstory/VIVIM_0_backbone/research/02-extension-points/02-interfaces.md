# Step 2.2: Catalog of Interfaces/Contracts in kernel/, plugins/, surfaces/

**Date:** 2026-08-28
**Scope:** VIVIM-next source (excl. node_modules, .quarantine, tests)
**Status:** CATALOGED

---

## Summary

| Category | Interface count | Source-of-truth location |
|---|---|---|
| **Kernel** | ~50 (capability + storage + execution + security + types) | `kernel/capability/`, `kernel/storage/contract/`, `kernel/security/`, `kernel/execution/` |
| **Plugins** | ~20 (provider, memory, retrieval, agent, sync, plugin-system) | `plugins/provider/`, `plugins/memory/`, `plugins/retrieval/`, etc. |
| **Surfaces** | ~10 (canvas, web, web/ui, web/shared) | `surfaces/web/src/canvas/`, `surfaces/web/src/ui/`, `surfaces/web/src/shared/`, `surfaces/web/src/sdk/`, `surfaces/web/src/storage/contracts/` |
| **Infra** | ~15 (desktop, seed, devops, logging, observability) | `infra/devops/`, `infra/seed/`, `infra/observability/`, `infra/logging/` |

**Approximate total: ~95 distinct interfaces.** Some are 1-line re-exports, some are 200+ line contracts. The "stable" interfaces (the ones extensions would touch) are concentrated in: `kernel/capability/`, `kernel/storage/contract/`, `kernel/security/`, `surfaces/web/src/ui/`.

---

## KERNEL — the irreducible contracts (the ones an extension would touch)

### `kernel/capability/` (the "command surface")

Already cataloged in Step 1.7. Key interfaces:
- **`UnifiedCapability`** — the universal capability shape (id, slug, name, surfaces, handler, etc.)
- **`CapabilityContext`** — passed to handlers (`conversationId?, providerId?, slaveId?, userId?, metadata`)
- **`CapabilitySurface = 'cli' | 'ui' | 'workflow' | 'mcp' | 'api'`**
- **`LiveHandlerSpec`** — 3 kinds: `mcp | http | inline`
- **`LiveCapabilitySpec`** — what a runtime-registered capability looks like
- **`CapabilityEventBus`** — the event bus (emits `plugin:registered`, `live_capability:registered`, etc.)
- **`SandboxPermissions`** — `{ canFetch, canReadFile, canWriteFile, canUseClipboard }`
- **`SandboxBudget`** — `{ cpuMs, memoryBytes }`
- **`SandboxResult`** — `{ ok, output?, error?, auditId }`

### `kernel/storage/contract/` (the "data surface")

Already cataloged in Step 1.13. **~60 contracts.** Key ones for an extension:
- **`NodeStore`** — universal Node layer. `NodeRow, NodeVersionRow, NodeAliasRow`.
- **`ConversationStore`** — conversations + messages. 10K lines.
- **`MemoryIntelligenceStore`** — memory items.
- **`CapabilityStore`** — capability bindings + selectors + programs.
- **`LiveCapabilityStore`** — persisted live caps.
- **`SandboxAuditStore`** — sandbox audit log.
- **`ConsentStore`** — persisted consent grants.
- **`CanvasStore`** / **`CanvasDefinitionStore`** — canvas persistence.
- **`UIComponentStore`** — slot overrides persistence.
- **`ProgramStore`** — harness programs.

### `kernel/security/` (the "permission surface")

Already cataloged in Step 1.11. Key interfaces:
- **`SandboxRunner`** — the sandbox runtime.
- **`ConsentEngine`** — operation-level consent.
- **`ConsentConfig, ConsentGrant, ConsentStore`** — the consent model.
- **`MutationProvenance`** — `'manual' | 'nlcl' | 'prefix' | 'plugin' | 'llm-harness' | 'system'`.
- **`TrustScore`** (from `trust-score.ts`).

### `kernel/execution/` (the "action surface")

Already cataloged in Step 1.9. Key interfaces:
- **`HarnessRuntime`** + **`HarnessNode`** AST (sequence, branch, parallel, retry, precondition, step).
- **`HarnessCondition`** — 10 condition types (all browser-state).
- **`HarnessContext`** — the API a module sees (`query, queryAll, waitFor, getPageState, intercept, emitTelemetry`).
- **`HarnessModule`, `HarnessModuleResult, HarnessTelemetryEvent, HarnessProgressEvent`**.
- **`HarnessRepairEngine`**, **`RepairInput`, `RepairResult`** — LLM output repair.
- **`CapabilityExecutionResult, RecoveryStrategy, RecoveryStrategyResult, LoginDetectionResult, LoginIndicator`** — `CapabilityEngine` types.

### `kernel/types/` (the "vocab surface")

- **`EngineError`** — base error class.
- **`newId()`** — ULID.
- **`deriveSlaveId(providerId, accountId)`** — provider+account → slave.

---

## PLUGINS — the replaceable surface (one file per plugin, mostly engine code)

### `plugins/plugin-system/`

Already cataloged in Steps 1.1-1.3. The key interfaces:
- **`ProviderPlugin`** — the contract (5 mandatory hooks + 3 optional Phase 9).
- **`PluginManager`** + **`PluginManagerImpl`** — the registry.
- **`PluginHandler, PluginErrorHandler, PluginUnloadHandler`** — observer callbacks for `PluginHotReload`.
- **`ProviderPlugin`** (second one, in `plugin-hot-reload.ts`) — the load record shape.

### `plugins/provider/`

Already cataloged in Step 1.6. Key interfaces:
- **`ProviderManifest`** (Zod schema) — the canonical provider data.
- **`ProviderManifestSchema`** — the validator.
- **`ProviderDefinitionRow, ProviderEndpointRow, ProviderParserRow, ProviderCapabilityRow, ProviderConfigRow, ProviderModelRow`** — DB row shapes.
- **`ProviderRegistrar`** — the loader.
- **`RegisterResult, SeedAllResult, VerifyResult`** — return types.
- **`ChromeGovernor`** — the browser runtime for providers (30K lines).
- **`SelectorStrategy`** — how to find a DOM element.

### `plugins/memory/`

Already cataloged in Step 1.10. Key interfaces:
- **`EpisodicMemory, SemanticMemory, ProceduralRule`** — three memory kinds.
- **`Card, CardState, ReviewResult`** — FSRS-6.
- **`MemoryIntelligenceStore`** — the contract.

### `plugins/retrieval/`

~20 files. Key interfaces (not all read):
- **`KnowledgeEnvelope, VersionedKnowledgeEnvelope`** (Step 1.10) — canonical ingest format.
- **`CollectionItem`, `Collection`, `ContextAssembly` (23K lines)**, `Entity`, `Intent`, etc. — the retrieval data model.

### Other plugins

- `plugins/agent/`, `plugins/parsing/`, `plugins/sync/`, `plugins/mcp/`, `plugins/lib/` — not deeply read. Each is a plugin in the same sense: a directory of engines with a contract or two.

---

## SURFACES — the user-interaction surface

### `surfaces/web/src/canvas/`

Already cataloged in Step 1.5. Key interfaces:
- **`NodeType, EdgeKind, CanvasNode, CanvasEdge, CanvasBookmark, CanvasState, CanvasConfig, CanvasPalette, Viewport, Vec2`** — the canvas data model.
- **`Mode, CommandResult, CanvasAction`** — the modal command layer.
- **`DefinitionPatch, LiveConfigDeps, ResolvedSurface, RouteContext`** — the live-config toolkit.

### `surfaces/web/src/ui/` (the slot system)

Already cataloged in Step 1.12. Key interfaces:
- **`SLOT_IDS, SlotId, SlotMeta, SlotOverrideClaim`** — the catalog.
- **`AnyComponent, SlotSource, ResolvedSlot, SlotOverrideRecord, SlotContext, RegisterOptions`** — the registry types.

### `surfaces/web/src/shared/`

- **`CanvasDefinition, CanvasLayout, LayerBinding, SandboxPolicy`** — server-side canvas types.
- **`RouteContext, ResolvedSurface`** — routing concepts.
- **`ULID` helpers**.

### `surfaces/web/src/sdk/`

- **Frontend SDK** for capabilities. The `use-mutation.ts`, `use-variant.ts` hooks. Not deeply read.

### `surfaces/web/src/storage/contracts/`

- Frontend equivalents of the backend `kernel/storage/contract/`. Probably for IndexedDB or localStorage. Not deeply read.

### `surfaces/web/src/registry/`

- **`CapabilityRegistry`** (frontend). Distinct from backend `UnifiedCapabilityRegistry`.

---

## INFRA — build/deploy/logging

Not deeply read. The key files:
- `infra/devops/desktop/` — the desktop build pipeline.
- `infra/seed/` — seed scripts.
- `infra/observability/` — telemetry, audit.
- `infra/logging/` — log structure.

---

## What's "stable contract" vs "internal implementation detail"

**Stable (extensions would touch):**
- `UnifiedCapability`, `LiveCapabilitySpec` — capability surface
- `NodeStore` (read methods) — universal data
- `LiveCapabilityStore` (write methods) — capability persistence
- `SandboxPermissions`, `SandboxRunner` — sandbox boundary
- `SlotOverrideClaim` — frontend override wire format
- `KnowledgeEnvelope` — content ingest
- `MutationProvenance` — trust signal

**Internal (extensions should not import directly):**
- `CapabilityEngine.execute` (line 100 of capability.ts) — used by the dispatch path, not by extensions
- `HarnessRuntime` internals — used by the harness executor
- `Browser-action-types`, `cdp-*` — provider internals
- Prisma row types (the row shape is a `Row` suffix; the contract is the `Store` interface)

**Implementation detail (hidden by contracts):**
- The Prisma schema
- The `kernel/storage/impl/` directory (NOT in vivim-next)
- The exact routing layer
- The `useX` hooks (frontend) — they're React glue, not the contract

---

## Key observations

- **The system has a "vocabulary surface" in `kernel/types/` and `kernel/capability/`.** These are the *types* an extension would name. Every other surface is built on these primitives.

- **The `Live*` naming convention marks runtime-extensible things.** `LiveCapabilityRegistry`, `LiveCapabilityStore`, `LiveCapabilitySpec`. The "Live" prefix means "this is the user-facing registration path, not the engine-internal one." **An extension model should standardize this naming.**

- **The `Row` vs `Input` vs `Spec` vs `Contract` suffix is a discipline.** `Row` = DB shape, `Input` = write shape, `Spec` = user-facing shape, `Contract` = the interface. Extensions should see Spec and Contract, not Row.

- **The `Store` suffix marks data contracts.** Everything ending in `Store` is a data access interface. Engines depend on these. Extensions can too, but only via the capability layer (not directly) to maintain the trust boundary.

- **Two parallel "frontend" patterns:** the backend's `UnifiedCapabilityRegistry` is the source of truth. The frontend's `ActionRegistry` is a projection. The bridge is `auto-populate.ts`. This is a "thin client" model.

- **There's a "Universal" naming pattern.** `UnifiedCapability`, `UnifiedCapabilityRegistry`, `UniversalComponentRegistry` (referenced in contract.ts). The "Universal" prefix means "this is the canonical / single source of truth." An extension model should follow this convention.

- **The canvas and the slot system are independent.** Different `NodeType` and `SlotId` namespaces. The canvas is closed; the slot system is open. **They are sibling surfaces, not parent/child.**

---

## Key questions raised

1. **What is the full list of surfaces (chat, canvas, settings, etc.)?** From the slot catalog, we see `chat.*`, `*.panel`, `tab.*`, `entry.unified`. So the surfaces are: chat (main), canvas, panels (capabilities, health, search, etc.), tab bar, unified entry. The `entry.unified` slot suggests a "switcher" surface. Not deep-dived.

2. **What's the relationship between `surfaces/web/src/registry/CapabilityRegistry` and backend `UnifiedCapabilityRegistry`?** Probably the same purpose (capability storage) but on different sides. The auto-populate bridge is the sync.

3. **What's in `surfaces/web/src/sdk/`?** 2 hooks (use-mutation, use-variant). Probably the React glue for the reprogrammability system.

4. **What is `surfaces/web/src/storage/contracts/`?** Frontend storage. Probably for the slot system persistence (UIComponentStore is one of them).

5. **Are there surfaces other than web?** Per the AGENTS.md and BACKBONE.md, the target is "surfaces/web", "surfaces/desktop" (via Tauri), "surfaces/cli", "surfaces/api". But the file listing shows only `surfaces/web/src/`. The others may be in the forge only.

6. **What is `surfaces/web/src/cli/`?** Per AGENTS.md, frontend CLI tools (canvas-scaffold). Not deep-dived.

7. **What is `surfaces/web/src/features/`?** AGENTS.md mentions "onboarding, provider-setup-wizard". Not deep-dived.

8. **What is `surfaces/web/src/actions/`?** AGENTS.md mentions "ActionRegistry + auto-populate". The `auto-populate.ts` is the bridge from backend capabilities to frontend actions.

9. **What is `surfaces/web/src/engines/`?** Frontend-side engines (canvas, workspace, plugin, rbac, presence, etc.). Not in the kernel — these are UI-side concerns.

---

## Cross-references

- **Step 1.7 (capability system)** — full `UnifiedCapability` family.
- **Step 1.4 (reprogrammability)** — `ReprogrammableSurface`, `SurfaceRegistry`, `SurfaceKind`, `MutationOp`, `MutationProvenance`, `SurfaceMutation`, `SurfaceMutationPlan`.
- **Step 1.10 (memory/knowledge)** — `EpisodicMemory`, `SemanticMemory`, `ProceduralRule`, `KnowledgeEnvelope`, `VersionedKnowledgeEnvelope`.
- **Step 1.11 (security)** — `SandboxPermissions`, `SandboxBudget`, `SandboxResult`, `ConsentConfig`, `ConsentGrant`.
- **Step 1.12 (frontend slot system)** — `SLOT_IDS`, `SlotId`, `SlotMeta`, `SlotOverrideClaim`, `AnyComponent`, `SlotSource`, `ResolvedSlot`, `SlotOverrideRecord`, `SlotContext`, `RegisterOptions`.
- **Step 1.13 (storage contracts)** — ~60 contracts, the full list.
- **Step 1.5 (canvas)** — `NodeType`, `EdgeKind`, `CanvasNode`, `CanvasEdge`, `CanvasState`, `CanvasConfig`, `CanvasAction`, `Mode`, `CommandResult`.
- **Step 1.9 (harness)** — `HarnessRuntime`, `HarnessNode`, `HarnessCondition`, `HarnessContext`, `HarnessModule`, `HarnessRepairEngine`.
- **Step 1.6 (provider plugins)** — `ProviderManifest`, `ProviderManifestSchema`, `ProviderDefinitionRow`, `ProviderEndpointRow`, `ProviderParserRow`, `ProviderCapabilityRow`, `ProviderConfigRow`, `ProviderModelRow`.
- **Step 1.1 (plugin-system)** — `ProviderPlugin`, `PluginManager`, `PluginHandler`, `PluginErrorHandler`, `PluginUnloadHandler`.
- **Phase 1 synthesis (Step 1.15)** — the map of 4 extension surfaces and 8 implementation layers.
