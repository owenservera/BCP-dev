# Step 1.1: F-022 plugin-system — The Core Plugin Interface

**Date:** 2026-08-28
**Read:** `plugins/plugin-system/plugin-system.ts` (267 lines)
**Status:** ANALYZED

---

## What the code does

`plugin-system.ts` is the file the codebase calls "the plugin system." It defines:

1. **`ProviderPlugin` interface** (lines 14-50) — the contract every plugin must satisfy. Despite the name `ProviderPlugin`, it is NOT just for chat/LLM providers. It has five mandatory hooks (`onRegister`, `onResolveCapabilities`, `onAction`, `onProjectState`, `onParse`) and three optional Phase 9 additions (`surfaces`, `mutationHandlers`, `capabilities`).

2. **`PluginManager` interface + `PluginManagerImpl` class** (lines 62-266) — the registry. Stores plugins keyed by `providerId`. On `register()` it emits events on the `CapabilityEventBus` and, for Phase 9, lazy-imports `SurfaceRegistry` to register the plugin's surfaces. On `unregister()` it removes the plugin and unregisters its surfaces.

3. **Five `execute*` methods** (lines 170-266) — one per mandatory hook. Each looks up the plugin by `providerId`, calls the hook, catches errors, emits `plugin:hook_error` on the event bus, and returns a safe default (`null` or the original input). Errors never propagate; they're swallowed and surfaced as events.

---

## Key observations

- **Misnamed.** The interface is `ProviderPlugin` but Phase 9 expanded it to cover `surfaces`, `mutationHandlers`, and `capabilities`. The mandatory hooks (action/projectState/parse) are provider-flavored, but the optional ones are general-purpose. The name leaks the file's history; the contract is broader now.

- **`providerId` is the primary key, not `pluginId`.** Lines 70, 75. This is significant: the registry is namespace-scoped to providers, not plugins. A "plugin" is currently 1:1 with "provider."

- **Phase 9 split between mandatory and optional.** The mandatory hooks (lines 16-23) are provider lifecycle. The optional ones (lines 32-49) are extension surface. Both are in the same interface. There is no separate "Extension" or "Capability" interface; everything is `ProviderPlugin`.

- **Lazy import to break a cycle.** Lines 88 and 149: `import('../reprogrammability/registry.js')` is dynamic. Comment (lines 86-87) explains: "plugin-system.ts is loaded early in bootstrap and we don't want to force surfaceRegistry init here." This is a real architectural signal — the kernel/plugin dependency direction is fragile enough that a runtime import cycle had to be broken.

- **Best-effort registration.** Lines 84-122. If a surface fails to register (e.g. duplicate id), the whole `register()` call still succeeds; the error is emitted as `plugin:hook_error` and the manager continues. This is a deliberate design choice: plugin failures must not break app boot.

- **All hooks swallow errors and return safe defaults.** Lines 173-184, 196-205, 213-226, 232-247, 253-265. `onRegister` returns `void`; `onResolveCapabilities` returns `null`; `onAction` returns `null`; `onProjectState` returns the unchanged input; `onParse` returns `null`. There is NO exception path. The event bus is the only error signal.

- **No version, no manifest schema, no permissions.** A plugin is identified only by its `providerId` string. There is no `version`, no `kind`, no `dependencies`, no `permissions`, no `activationEvents`. The VS Code extension manifest is much richer.

- **No lifecycle hooks for activation/deactivation.** Plugins are eagerly registered. There is no `onActivate`, no `onDeactivate`, no "load when X happens" mechanism. The only way to remove a plugin is `unregister(providerId)`.

- **No resource limits.** Nothing about CPU, memory, network budgets.

- **`execute*` methods are public on `PluginManagerImpl`.** Any caller can invoke a hook on a registered plugin. The hooks are the public extension surface; the registry is a key-value store.

- **Phase 9 evidence is real, not aspirational.** Lines 1-6 (the file header) reference "Phase 9 of ROADMAP-REPROGRAMMABLE-CANVAS.md" extending `ProviderPlugin` with `surfaces` and `mutationHandlers`. The comments in lines 25, 31, 33-38, 45-48, 81, 86-87, 147 confirm this was actually designed and implemented, not stubbed.

---

## Key questions raised

1. **Is `ProviderPlugin` the right name?** It is provider-flavored. If we are designing a VS Code-style extension model, the unit should be an "extension" or "contribution," not a "provider plugin." But the contract is already broader than providers (surfaces, mutationHandlers, capabilities are all general).

2. **Are `surfaces` and `mutationHandlers` the only "extension" surface, or will more come?** Phase 9 added these. A future Phase X might add commands, panels, settings, etc. Should the interface grow, or should the plugin declare a list of `contributions` of different kinds?

3. **Why is the event bus the only error channel?** If a plugin throws in `onAction`, the caller gets `null` and the event bus gets `plugin:hook_error`. But the event bus is async / fire-and-forget. The caller has no synchronous way to know it failed. For user-facing extensions, "silently null on failure" may be wrong.

4. **Where does the `providerId` come from?** The interface declares it but no code in this file shows it being set. Is it the plugin's own property? Is it assigned at register-time? (Looking ahead, this is what Step 1.2 — hot-reload — likely shows.)

5. **What does "execute" mean without a contract?** The hooks take `Record<string, unknown>` for inputs. There is no schema. The plugin is free to return anything. There is no validation that the plugin's return value matches what the caller expects. This is duck-typing at the extreme.

6. **Is there a sandbox boundary here?** No. Plugins are first-class TypeScript objects in the same process. There is no VM, no worker, no process isolation. The "trust boundary" is currently: "if we trust the code, we run it."

---

## Cross-references

- **Phase 1.2 (plugin-hot-reload.ts)** — different `ProviderPlugin` shape expected; check if they match.
- **Phase 1.3 (router-capability-bridge.ts)** — different "plugin" semantics; check if it overlaps.
- **Phase 1.4 (reprogrammability module)** — the `ReprogrammableSurface`, `SurfaceMutation`, `SurfaceSpec` types imported at lines 8-10. Need to read these.
- **`./capability-event-bus.js`** — the event bus the manager depends on. The bus is the de facto extension notification channel.
- **`../schema/streaming.js`** — `ContentBlock` type used in `onParse` return. Streaming is a real concern for plugins.
- **`ROADMAP-REPROGRAMMABLE-CANVAS.md`** — referenced in the file header. The Phase 9 design source. Need to find this in the repo (or note it as external).
