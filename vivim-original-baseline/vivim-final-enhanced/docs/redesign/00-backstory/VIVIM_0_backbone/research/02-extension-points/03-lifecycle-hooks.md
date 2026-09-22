# Step 2.3: Lifecycle Hooks — When Code Runs

**Date:** 2026-08-28
**Scope:** VIVIM-next source
**Status:** CATALOGED

---

## All "on*" / "before*" / "after*" hooks in the codebase

| Hook | Defined in | Fires when | Args | What extensions can do |
|---|---|---|---|---|
| `onRegister(manifest)` | `ProviderPlugin` (Step 1.1) | Plugin is registered with `PluginManager` | `manifest: unknown` | Initialize plugin state |
| `onResolveCapabilities(providerId, planTier)` | `ProviderPlugin` (Step 1.1) | Capability resolver needs the provider's caps | `(providerId, planTier)` | Return `Record[] \| null` of caps |
| `onAction(action)` | `ProviderPlugin` (Step 1.1) | An action is dispatched to the provider | `action: Record<string, unknown>` | Return result or null |
| `onProjectState(rawState)` | `ProviderPlugin` (Step 1.1) | Project state is being computed | `rawState: Record<string, unknown>` | Transform the state |
| `onParse(rawBody)` | `ProviderPlugin` (Step 1.1) | Raw stream body needs parsing | `rawBody: string` | Return `ContentBlock[] \| null` |
| `onUpgrade(fromVersion)` | Test reference (Step 1.14) | Plugin upgrade available | `fromVersion: string` | (Not in code) |
| `onUninstall()` | Test reference (Step 1.14) | Plugin is being removed | (none) | (Not in code) |
| `onHealthCheck()` | Test reference (Step 1.14) | Health check tick | (none) | (Not in code) |
| `onMount` (component) | `mount(` calls (Step 2.1, 2 matches) | A component is mounted | (varies) | (UI lifecycle) |
| `onPluginLoaded` (hot-reload) | `PluginHotReload` (Step 1.2) | A plugin file is loaded | `ProviderPlugin` (the load record) | React to load event |
| `onPluginUnloaded` (hot-reload) | `PluginHotReload` (Step 1.2) | A plugin file is removed | `pluginId: string` | React to unload |
| `onPluginError` (hot-reload) | `PluginHotReload` (Step 1.2) | A plugin file failed to load | `(error, filePath)` | React to error |

---

## When does each hook fire — the lifecycle of a plugin

Based on the code (not aspirational):

1. **File appears in watched directory** → `PluginHotReload.loadPlugin()` called.
2. **Module imported** (with cache-bust `?t=...`).
3. **If import succeeds** → `onPluginLoaded(plugin)` fired. Plugin file is now "loaded" but NOT yet wired into the system.
4. **Host decides what to do** — there is NO automatic connection. The `onPluginLoaded` handler must call `PluginManager.register(plugin)` to actually wire it up. **This glue is the gap.**
5. **`PluginManager.register(plugin)`** called by host.
6. **`onRegister(manifest)`** called inside the manager.
7. **Plugin's `surfaces[]` registered with `SurfaceRegistry`** (lazy import).
8. **Plugin's `capabilities[]` emits `plugin:capabilities-registered` event** (not registered as capabilities; just an event for listeners).
9. **Plugin is "active."** The system can now call `executeOnAction`, `executeOnProjectState`, etc. as needed.
10. **On file change** → `unloadByPath` → `onPluginUnloaded` fired. Plugin's surfaces unregistered. The "active" state ends.

---

## Hooks that are *not* in the plugin system but exist in other systems

- **`ReprogrammableSurface.mutate(mutation)`** (Step 1.4) — fires when a mutation is applied. Async. Must be atomic. Returns new spec.
- **`HarnessModule.run(ctx, input)`** (Step 1.9) — fires when the harness reaches a `step` node. Returns `HarnessModuleResult`.
- **`HarnessCondition` types** (Step 1.9) — fire during branch evaluation.
- **`SurfaceRegistry.subscribe(listener)`** (Step 1.4) — observer callback for surface register/unregister/clear events.
- **`UIComponentRegistry.subscribe(listener)`** (Step 1.12) — observer for slot changes.
- **`LiveCapabilityStore.create / revoke`** (Step 1.7) — observer for live cap lifecycle (via event bus).
- **`HarnessRepairEngine.repair(input)`** — fires when LLM output needs repair.
- **`HarnessFeedbackCoordinator`** (referenced, not read) — escalating retry prompts.
- **`HarnessCheckpoint`** — save/restore harness state.

---

## Event bus events (the pub/sub layer)

The `CapabilityEventBus` is the central event bus. Events emit on:

- `plugin:registered` (from `PluginManagerImpl.register`)
- `plugin:unregistered` (from `PluginManagerImpl.unregister`)
- `plugin:surface-registered` (from PluginManager lazy import)
- `plugin:hook_error` (any plugin hook error)
- `plugin:capabilities-registered` (from PluginManager when a plugin declares capabilities)
- `live_capability:registered` (from `LiveCapabilityRegistry.registerLive`)
- `live_capability:revoked` (from `LiveCapabilityRegistry.revokeLive`)
- `capability:progress` (from `HarnessRuntime.execute` — line 115-120)
- `account:plan_tier_changed` (consumed by `live-config.ts` observeContext)
- `provider:added` (consumed by `live-config.ts`)
- `provider:seeded` (from `ProviderRegistrar.register`)
- `workspace:switched` (consumed by `live-config.ts`)
- `canvas:def:updated` (from `live-config.ts` patchDefinition; consumed by itself)
- Various others (e.g. autonomous, harness, telemetry)

---

## Is there a consistent "thing that runs at X time" pattern?

**No.** The patterns are:

- **Plugin hooks**: method-shaped (5+3 mandatory/optional) on the `ProviderPlugin` object.
- **Surface hooks**: method-shaped (`mutate`) on the `ReprogrammableSurface` object.
- **Harness hooks**: method-shaped (`run`) on a `HarnessModule`, registered by name.
- **Observers**: callback-shaped (`subscribe(listener)`) on the registries.
- **Events**: pub/sub on the event bus.

The patterns are siblings, not unified. **An extension model needs to pick one.**

---

## Key observations

- **The plugin lifecycle has 5+3 hooks** that are method-shaped, plus 3 test-only hooks (`onUpgrade`, `onUninstall`, `onHealthCheck`) that the production code doesn't define. So the test is ahead of the contract.

- **The lifecycle is well-defined for register/unregister but missing for upgrade.** The test expects `onUpgrade(fromVersion)`, the code has no upgrade path. A user can't update a plugin to a new version.

- **The hot-reload and the manager are unglued.** `PluginHotReload` calls `onPluginLoaded` → host must call `PluginManager.register` → manager calls `onRegister`. **There's no auto-wire.** A user (or a host bootstrap) must connect them.

- **Lifecycle hooks are method-shaped, not event-shaped.** You don't subscribe to "before register." You implement `onRegister()` on the plugin object. This is the "interface" pattern, not the "observer" pattern.

- **There is no "deactivate" / "suspend" hook.** A plugin is either registered or not. The `LiveCapabilityRegistry.revokeLive(id)` (Step 1.7) is the closest thing — but for live caps, not plugins.

- **There is no "lifecycle" beyond register/unregister.** No init-only hooks. No per-invocation hooks (besides `onAction` / `onParse` / etc.). No "after-all-done" hooks.

- **The event bus is the cross-cutting pub/sub.** But it's mostly for the system to announce things, not for plugins to listen and respond. (Plugins can listen; they just don't have a "subscribe" pattern.)

- **`HarnessModule` is a developer hook, not a user hook.** A user extension cannot contribute a `HarnessModule` because the harness is closed at the user level (Step 1.9).

- **`ReprogrammableSurface.mutate` is a "thing that runs at this time" hook** — when a mutation is applied. But the mutation is initiated by someone else (Composer, Modal, LLM Harness). A surface doesn't subscribe to "after every mutation."

- **The most "lifecycle-y" hook in the codebase is `onAction`** (Step 1.1) — fires for every action dispatched to the provider. The closest analog to "intercept every X."

---

## Key questions raised

1. **What is the relationship between `onRegister` (ProviderPlugin) and the 3 test-only hooks?** The test was written for a future where the contract is richer. The current `ProviderPlugin` doesn't have these. The migration to a unified contract is open.

2. **What about a plugin's "first use" activation?** VS Code uses `activationEvents` to declare "I want to activate when X happens." The current system has no such concept. Plugins are either on (registered) or off (not registered).

3. **Can a plugin prevent its own unload?** `PluginHotReload.unloadByPath()` is fire-and-forget — it removes the entry and fires `onPluginUnloaded`. There's no "I'm busy, don't unload me" hook.

4. **What about a plugin's "idle" state?** No hooks fire when the plugin is "doing nothing." If a plugin wants to clean up resources on idle, it has to use its own timers.

5. **Are hooks sync or async?** `onRegister(manifest): Promise<void>`. Async. Errors are caught and emitted as `plugin:hook_error`. But the host has no way to know a hook failed (the event is fire-and-forget).

6. **What is the order of hook invocation across multiple plugins?** Map iteration order. Not deterministic. If plugin A's `onAction` depends on plugin B's, that's a bug waiting to happen.

7. **Are hooks cancellable?** No. Once you call `executeOnAction`, the plugin gets the call. There's no "skip this plugin" mechanism.

8. **What is the deactivation model?** Unregister = remove. There's no soft-delete. The plugin's data (Nodes it wrote) is not cleaned up.

9. **What about plugin dependencies?** None. The `ProviderPlugin` interface has no `dependencies` field. The package.json would have them, but the system doesn't read it (no package format spec yet — Step 1.14).

10. **What is the version upgrade story?** Test has `onUpgrade(fromVersion)`. The code has no `upgrade()` method on `PluginManagerImpl`. The install endpoint doesn't take a version. So upgrade is unimplemented.

---

## Cross-references

- **Step 1.1 (plugin-system)** — full `ProviderPlugin` hook list.
- **Step 1.2 (plugin-hot-reload)** — `onPluginLoaded` / `onPluginUnloaded` / `onPluginError`.
- **Step 1.4 (reprogrammability)** — `ReprogrammableSurface.mutate`.
- **Step 1.7 (live-capability-registry)** — registerLive / revokeLive / `loadFromDb`.
- **Step 1.9 (harness)** — `HarnessModule.run` and `HarnessCondition`.
- **Step 1.12 (UIComponentRegistry)** — `subscribe` for live slot updates.
- **Step 1.14 (distribution)** — test references `onUpgrade/onUninstall/onHealthCheck` that don't exist.
- **Phase 1 Step 1.15 (synthesis)** — the 4 extension surfaces and their hooks.
- **`CapabilityEventBus`** — the central pub/sub.
