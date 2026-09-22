# Step 2.7: EXTENSION POINTS SYNTHESIS — What's Open, What's Closed

**Date:** 2026-08-28
**Sources:** Steps 2.1-2.6
**Status:** SYNTHESIZED

---

## The full map

For each "place" in the system, mark it as:
- **(a)** Already supports user extensions at runtime.
- **(b)** Supports OUR extensions only (engine-internal).
- **(c)** Closed / hard-coded / not extensible.

---

## 1. Backend commands (capabilities)

| Point | Status | Notes |
|---|---|---|
| Add a backend capability (engine time) | (b) | Edit `default-caps.ts` in forge, regenerate pool. Not runtime. |
| Add a backend capability (runtime, "Live") | **(a)** | `LiveCapabilityRegistry.registerLive(spec)`. **The primary runtime extension point.** |
| Capability surfaces (cli/ui/workflow/mcp/api) | **(a)** | `LiveCapabilitySpec.surfaces[]` declares which transports. Auto-projected. |
| Custom handler kinds (besides mcp/http/inline) | (c) | `LiveHandlerKind = 'mcp' | 'http' | 'inline'` is closed. |
| Add a new `CapabilitySurface` value | (c) | `'cli' | 'ui' | 'workflow' | 'mcp' | 'api'` is closed. |
| Add an NL pattern binding | (b) | `nlcl/catalog.ts` (forge only), static file. |
| Add a prefix command (`/`, `@`, `#`) | (c) | `MutationProvenance: 'prefix'` exists, but the execution layer is forge-only. |
| Add a built-in CLI command (bypass capability) | (b) | Edit `shell.ts:746`. The comment says "Production swaps in real capability dispatch" — so this is meant to be a fallback only. |

## 2. Backend data (storage)

| Point | Status | Notes |
|---|---|---|
| Read any data via a capability | **(a)** | The capability layer is the user API. |
| Write to `NodeStore` (new Node with custom type) | **(a)** | Stringly-typed `type` field. Data-only; no first-class recognition. |
| Write to `NodeStore` (existing type) | **(a)** | Same. Other systems recognize the type. |
| Add a new storage contract | (c) | ~60 hard-coded. |
| Add a new column to a table | (c) | Schema change = Prisma migration. |
| Add a new `KnowledgeEnvelope.sourceType` | **(a)** | `string`, not enum. Ingest with a custom type. |
| Add a new `KnowledgeEnvelope.contentType` | **(a)** | Same. |
| ACL / per-extension isolation | (b) | ACL is on data (`aclJson`). Enforcement is in the impl layer (forge). Per-extension isolation is not first-class. |

## 3. Backend browser (CDP / chat providers)

| Point | Status | Notes |
|---|---|---|
| Add a chat provider (manifest pipeline) | (b) | 12 JSON manifests in forge. `seedAll()` regenerates. Not user-facing install. |
| Add a custom parser (`logic_code`) | (b) | Provider manifest field. Inline JS as a string. |
| Customize provider recovery strategies | (b) | `recovery_strategies[]` in manifest. Engine code consumes. |
| Add a new chat protocol | (b) | Provider manifest schema. Same. |
| Add a new harness module | (c) | `HarnessRuntime` accepts modules; no user-facing install path. |
| Add a new harness command schema | (b) | `HarnessCommandRegistry` (4459 lines) + `seeds/harness/commands.json`. Forge-managed. |

## 4. Frontend UI (chrome + panels)

| Point | Status | Notes |
|---|---|---|
| Add a `SlotOverrideClaim` (per slot, per slug) | **(a)** | `UIComponentRegistry.register(slot, slug, component, sandbox)`. The 30 slots are fixed; the catalog is open. |
| Add a catalog entry (named component) | **(a)** | `UIComponentRegistry.registerCatalogEntry(key, component)`. Open. |
| Add a new `SlotId` | (c) | 30 hard-coded. |
| Add a new `SlotMeta.overridableBy` value | (c) | `'capability' | 'provider' | 'both'` is closed. |
| Customize the `ActionRegistry` (frontend command palette) | **(a)** | `auto-populate.ts` syncs from backend capabilities. |
| Add a frontend "live" action | **(a)** | `LiveCapabilitySpec.uiAction: { component: 'live-run', ... }`. Default. |

## 5. Frontend canvas (the workspace)

| Point | Status | Notes |
|---|---|---|
| Add a `CanvasNode` with a new `data` shape | **(a)** | `data: Record<string, unknown>`. Open. |
| Add a new `NodeType` | (c) | 7 hard-coded. |
| Add a new `EdgeKind` | (c) | 4 hard-coded. |
| Add a new `CanvasAction` (command) | (c) | 17 hard-coded in `commands.ts`. |
| Add a new canvas keybinding (rebinding existing) | **(a)** | `config/canvas.toml` hot-reload. |
| Add a new palette / theme | **(a)** | `CanvasConfig.palette`. |
| Edit a `CanvasDefinition` (live config) | **(a)** | `live-config.ts` `patchDefinition()`. P8-enforced (no inline script). |
| Add a new `CanvasDefinition` (the `custom` spec) | **(a)** | `CustomSpec` is the escape hatch. |

## 6. Reprogrammability (the declarative mutation layer)

| Point | Status | Notes |
|---|---|---|
| Register a new `ReprogrammableSurface` | (b) | `SurfaceRegistry.register(surface)`. The forge uses it; the `plugin-system.ts` Phase 9 wiring is the only caller in the migration target. **Not in vivim-next proper.** |
| Apply a `SurfaceMutationPlan` | (b) | Forge only. Reprogrammability is not migrated. |
| Add a custom `MutationHandler` for a `SurfaceKind` | (b) | `ProviderPlugin.mutationHandlers` (Phase 9, plugin-system.ts). Forge-wired. |
| Add a new `SurfaceKind` | (c) | 7 hard-coded. Requires "contract amendment" (Phase 10 audit). |
| Add a new `MutationOp` | (c) | 8 hard-coded. Same. |
| Use the DSL | (b) | `reprogrammability/dsl/` (grammar, parser, executor). Forge only. |
| Read/write `InMemorySurface` | **(a)** | The default impl is permissive (all 8 ops, all kinds). |

## 7. Sandbox / security

| Point | Status | Notes |
|---|---|---|
| Run code in QuickJS sandbox | **(a)** | `LiveCapabilityRegistry` inline handler. Default-deny permissions. |
| Run code in vm mode | (b) | Requires `VIVIM_UNSAFE_VM=1`. For rollback only. |
| Set sandbox permissions for a live cap | (b) | `LiveCapabilityRegistry.permissionsFor()` is hardcoded. Not per-cap. |
| Add a new sandbox mode (besides quickjs/vm) | (c) | The selector at `sandbox-runner.ts:40` is closed. |
| Request consent (operation-level) | **(a)** | `ConsentEngine.require(operation)`. Time-bounded grants. |
| Bypass consent (live HTTP handlers) | (c) | **A known gap** — the live registry uses `audit?.fetch` (TelemetryAudit), not ConsentEngine. |
| Compute a trust score for a mutation | **(a)** | `trust-score.ts` consumes `MutationProvenance`. |

## 8. Distribution

| Point | Status | Notes |
|---|---|---|
| Install a `.vivim-plugin` tarball | (c) | `POST /api/plugins/install` is a stub (Step 1.14). It acks; it doesn't extract. |
| Watch a directory for plugin files | **(a)** | `PluginHotReload.start(directory)`. Works. |
| Hot-update a plugin | (c) | No `onUpgrade` hook in `ProviderPlugin`. Test references it. |
| Uninstall a plugin | (b) | `unregister(providerId)` removes the plugin. No `onUninstall` hook. |
| Health check on a plugin | (c) | No `onHealthCheck` in `ProviderPlugin`. Test references it. |
| Version a plugin | (c) | No version field in `ProviderPlugin`. No version in install endpoint. |
| Sign a plugin | (c) | No signing. No checksums. |
| Browse a marketplace | (c) | No marketplace exists. |

## 9. Event bus

| Point | Status | Notes |
|---|---|---|
| Emit an event | **(a)** | `CapabilityEventBus.emit(...)`. Public. |
| Listen to events | **(a)** | `CapabilityEventBus.on(...)`. Public. |
| Add a new event type | **(a)** | Stringly-typed. The bus is open. |

---

## Summary by category

| Category | Open for user | Engine only | Closed |
|---|---|---|---|
| **Backend commands** | Live cap register | Engine cap declare; NL catalog | New surface, new handler kind, new command palette transport |
| **Backend data** | NodeStore, KnowledgeEnvelope, capability-mediated access | ACL enforcement | New contract, new column |
| **Backend browser** | (none) | Provider manifest pipeline, parser, harness | New protocol, new harness module |
| **Frontend UI (chrome)** | Slot override, catalog entry, ActionRegistry sync | (none) | New slot, new override policy |
| **Frontend canvas** | Node data, keybinding, palette, CanvasDefinition patch | (none) | New NodeType, new EdgeKind, new action |
| **Reprogrammability** | InMemorySurface | Phase 9 plugin surfaces (forge only) | New SurfaceKind, new MutationOp |
| **Sandbox / security** | QuickJS sandbox, ConsentEngine | Sandbox permissions config | New sandbox mode |
| **Distribution** | Directory watch | (none) | Tarball install, hot-update, health check, version, sign, marketplace |
| **Event bus** | Emit, listen, new event types | (none) | (none) |

---

## The "extension" model that already works (with caveats)

If you wanted to ship a "VS Code-style extension model" today, you could:

1. **Add a backend command** — call `LiveCapabilityRegistry.registerLive({ slug, name, handlerSpec: { kind: 'inline', code: '...' }, surfaces: ['cli', 'mcp', 'api'] })`. It appears in 3 transports automatically. Sandbox with default-deny permissions.
2. **Add a UI component** — write a React component, register in `UIComponentRegistry` catalog, send a `SlotOverrideClaim`. It renders in one of 30 positions. P8 sandbox per component.
3. **Add a data shape** — write Nodes with `type: 'my-extension.event'`. The data is persisted and queryable.
4. **Watch for plugin files** — `PluginHotReload.start('/path/to/dir')`. Auto-loads `.ts`/`.js`. (But there's no auto-wire to `LiveCapabilityRegistry` — you have to do that yourself.)

**That's 4 extension mechanisms, with caveats:**
- (1) is the most polished. (2) is the cleanest UI model. (3) is data-only. (4) is unglued from the rest.

**What's missing for a true VS Code model:**
- A **unified manifest format** that combines (1) + (2) + (3) into a single `vivim-extension.json` (analog of `package.json`).
- A **package format** (the `.vivim-plugin` tarball stub).
- A **version + dependencies** model.
- **Hot-update** with `onUpgrade`.
- A **marketplace** or distribution story.
- A **trusted-by-default** security model.
- **Activation events** (declarative: "I want to activate when X").
- **Cross-extension compatibility** (no two extensions can claim the same slug).
- A **unified permission model** that combines `SandboxPermissions` + `ConsentEngine` + `TrustScore`.

---

## Critical insights for Phase 3 (contract design)

1. **The "extension" is a *thing* with a manifest.** The manifest declares: name, version, capabilities (live), surfaces (slot overrides), data (Nodes), permissions (sandbox + consent + trust).

2. **The "extension" is *not* code (today).** Today, extensions are runtime `register` calls. Tomorrow, a manifest can declare these declaratively, and the host runs the registration on install.

3. **The "extension" has a *lifecycle* that's partial.** Register + unregister work. Hot-update, health check, version are aspirational.

4. **The "extension" is *isolated* via the sandbox, but not in other dimensions.** Sandbox = code isolation. No data isolation, no network isolation (live HTTP bypasses consent), no UI isolation (the slot sandbox is the only per-component gate).

5. **The "extension" is *discoverable* through the event bus + the registries.** A user can see all registered live caps, all surfaces, all slot overrides. There's no "extension" entity that aggregates these.

**The Phase 3 design should pick a single shape that wraps all four mechanisms into one package.**

---

## Cross-references

- **Step 2.1 (register patterns)** — the 133 `.register()` calls; 12 writers to UnifiedCapabilityRegistry.
- **Step 2.2 (interface catalog)** — ~95 interfaces; Live*/Store*/Row*/Spec* conventions.
- **Step 2.3 (lifecycle hooks)** — 5+3 mandatory/optional + 3 test-only; hot-reload and manager unglued.
- **Step 2.4 (data surfaces)** — NodeStore universal; capability layer is the user API.
- **Step 2.5 (UI surfaces)** — 3 layers (canvas, slots, reprogrammability).
- **Step 2.6 (commands)** — UnifiedCapabilityRegistry IS the command palette; 5 surfaces auto-project.
- **Phase 1 Step 1.15 (synthesis)** — 4 extension surfaces today.
- **Phase 3 (next)** — design the unified `vivim-extension.json` + extension package format.
