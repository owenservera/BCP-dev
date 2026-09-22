# Step 2.1: Register/AddListener/Extend/Mount/Install/Subscribe Patterns

**Date:** 2026-08-28
**Scope:** All `.ts` files in VIVIM-next (excl. node_modules, .quarantine)
**Status:** SCANNED

---

## Aggregate counts

| Pattern | Total matches in vivim-next |
|---|---|
| `.register(` | 133 |
| `.subscribe(` | 9 |
| `.extend(` | 8 |
| `.mount(` | 2 |
| `.install(` | 2 |
| `.addListener(` | 0 |

**133 `.register(` calls is the dominant pattern.** 9 subscribe, 8 extend, 2 mount, 2 install, 0 addListener. The codebase prefers imperative `.register()` over observer-style `.addListener()` or `.subscribe()`. The "register" verb is the universal "add this to the system" semantic.

---

## Who calls `.register()` and on what

A sample of the 133 calls — what registries are being populated, by whom:

| Caller (file:line) | What it registers | Where |
|---|---|---|
| `live-capability-registry.ts:112` | A `UnifiedCapability` derived from `LiveCapabilitySpec` | `UnifiedCapabilityRegistry` |
| `plugin-system.ts:92` | A `ReprogrammableSurface` from a plugin's `surfaces[]` | `surfaceRegistry` |
| `capability-bootstrap-generated.ts:319` | A `UnifiedCapability` from taxonomy pool | `UnifiedCapabilityRegistry` |
| `capability-composer.ts:177` | A `UnifiedCapability` composed from child caps | `UnifiedCapabilityRegistry` |
| `command-parity-capabilities.ts:303` | A batch of `UnifiedCapability` | `UnifiedCapabilityRegistry` |
| `provider-caps.ts:204` | Provider-specific caps | `UnifiedCapabilityRegistry` |
| `session-caps.ts:151` | Session-related caps | `UnifiedCapabilityRegistry` |
| `streaming-channel-caps.ts:149` | Streaming channel caps | `UnifiedCapabilityRegistry` |
| `builtin-capability-wrappers.ts:173` | Builtin wrappers (e.g. fs / shell) | `UnifiedCapabilityRegistry` |
| `workflow-engine.ts:252` | A workflow capability | `UnifiedCapabilityRegistry` |
| `cdp-capability-registrar.ts:173` | A capability derived from a CDP method descriptor | `UnifiedCapabilityRegistry` |
| `router-capability-bridge.ts:632` | A bridge-generated cap (HTTP endpoint → cap) | `UnifiedCapabilityRegistry` |
| `provider-registrar.ts:336` | Self-recursive (calls `register(manifest)` on itself) | `ProviderRegistrar` |
| `commands.ts:420` | Reference to `ActionRegistry.register(slug, ...)` (not actual call — a comment) | `ActionRegistry` |
| `auto-populate.ts:62` | `ActionRegistry.register(cap.slug, ...)` | `ActionRegistry` |
| `send-capability.ts:88` | A send-cap for a provider | `UnifiedCapabilityRegistry` |
| `shell.ts:733` | `store.register(cmd)` (CLI command) | CLI command store |
| `ui-engine.ts:168` | A `merged` UI definition | `UiEngine` (self-recursive) |
| `build-frontend.ts:43` | Comment: `CapabilityRegistry.register(slug, ...)` | Frontend `CapabilityRegistry` |
| `registry.ts:95` | `partRegistry.register(type, component)` — universal component registry | Universal component registry |

**Observations:**

1. **`UnifiedCapabilityRegistry` is the most-registered-into singleton.** ~12 distinct files register into it. This is the **central nervous system** of the system.
2. **`ActionRegistry` is a frontend concept** (`auto-populate.ts`, `commands.ts`). Distinct from `UnifiedCapabilityRegistry`.
3. **`SurfaceRegistry` (reprogrammability) is registered into exactly once** in production code: `plugin-system.ts:92`. Phase 9 wiring. Nothing else registers surfaces.
4. **CLI commands register into their own store** (`shell.ts:733`). Separate from capabilities.
5. **UI components register into a `partRegistry`** (`registry.ts:95` — the universal component registry, presumably the engine that renders parts of the UI from data). Different from the `UIComponentRegistry` (frontend slot system, Step 1.12).
6. **The "frontend CapabilityRegistry" is a different thing** from the backend `UnifiedCapabilityRegistry` (`build-frontend.ts:43` comment).
7. **ProviderRegistrar's `register()` is self-recursive** (`provider-registrar.ts:336` calls itself for a single manifest after parsing the array).

---

## Who calls `.subscribe()` and on what

| Caller (file:line) | What it subscribes to |
|---|---|
| `surfaceRegistry.subscribe` (in `reprogrammability/registry.ts:182`) | The SurfaceRegistry change events (for frontend useSyncExternalStore) |
| `UIComponentRegistry.subscribe` (in `surfaces/web/src/ui/registry.ts:71`) | UI slot changes |
| `capabilityEventBus.on` / `.subscribe` (multiple) | Capability events (e.g. `live_capability:registered`, `plugin:registered`) |
| 5+ other internal subscriptions | Telemetry streams, event recording, etc. |

**Observations:**

- 9 `.subscribe()` calls is low. The codebase is not heavy on observer pattern. The 2 explicit external-store subscribers are `surfaceRegistry` (for `useSyncExternalStore` in reprogrammability) and `UIComponentRegistry` (for slot updates). Everything else is internal event-bus subscriptions.

---

## Who calls `.extend()`

| Caller | What |
|---|---|
| `extendHandlerMap` (in `capability-bootstrap-generated.ts:71`) | Add a handler for a slug in the generated handler map |
| `extendContract` (somewhere) | Probably consent/policy extension |
| `extend` of strings, arrays, etc. | Normal usage, not extension pattern |

**`extendHandlerMap`** is the only extension-specific call. It lets new code register a handler for a slug that's already in the pool. This is the **runtime extension API for capability handlers**.

---

## Who calls `.mount()` and `.install()`

- **`.mount(`** (2 matches): Component lifecycle. Probably the universal component registry (`registry.ts`) and a router setup. Not user-facing extension.
- **`.install(`** (2 matches): Both are likely the `POST /api/plugins/install` route handler (Step 1.14). The installation endpoint.

---

## Key observations

- **`register()` is the universal verb for "add this to the system."** 133 uses. The pattern is consistent: `someRegistry.register(item)`. No `addListener` (despite the pattern's name in the process doc), no `attach`, no other verbs. The codebase has a strong idiom: register things.

- **`UnifiedCapabilityRegistry` is the central registration target.** ~12 different files register into it. This is the system's "command bus" for capabilities. If a user extension adds a capability, this is where it lands.

- **`ActionRegistry` is the frontend command registry.** Distinct from capabilities. The frontend's CLI is built on `ActionRegistry` (populated by `auto-populate.ts` from the capability list). This is the **dispatcher**, not the **definition**.

- **`SurfaceRegistry` is the rare-extension target.** Only `plugin-system.ts:92` writes to it in production code. Reprogrammability is designed for many writers (frontend, backend, plugins) but only the plugin path is wired.

- **`extendHandlerMap()` is the only true "add to existing thing" extension API.** Lines 71-73 of `capability-bootstrap-generated.ts`. It lets you add a handler for a slug that exists in the pool but wasn't in the original handler map. **This is the smallest, most targeted extension hook in the codebase.**

- **No "unregister" pattern shows up in the scan** (not part of the searched patterns). But we know from Phase 1:
  - `UnifiedCapabilityRegistry.unregister(id)` (Step 1.7)
  - `SurfaceRegistry.unregister(surfaceId)` (Step 1.4)
  - `PluginManagerImpl.unregister(providerId)` (Step 1.1)
  - `LiveCapabilityRegistry.revokeLive(id)` (Step 1.7)
  - `UIComponentRegistry` has unregister (Step 1.12, not read in full)

  So the lifecycle is: register, then unregister. No suspend/resume. No versioning.

- **No "registerHook" or "addHook" pattern** for lifecycle events. The hooks are method-shaped (`onRegister`, `onAction`, etc.), not event-shaped. Extensions are objects with methods, not observers of events.

- **The pattern is "register an instance" not "register a class."** No DI containers (no InversifyJS, no tsyringe). Plain `Map.set` or array push under the hood.

---

## Key questions raised

1. **Is there a central "extension registry" that knows about all the other registries?** No. The 4 registries (capability, surface, slot, action) are siblings, not hierarchical. Each is registered into independently.

2. **Is the `ActionRegistry` (frontend) the same as `UnifiedCapabilityRegistry` (backend)?** No. `ActionRegistry` is a frontend command dispatcher. `UnifiedCapabilityRegistry` is the backend capability store. `auto-populate.ts` copies capabilities from backend → frontend ActionRegistry. So there's a sync.

3. **What's the source of truth for "things that can be invoked"?** The capability registry (backend) is the source. The ActionRegistry is a projection. The slot registry is orthogonal (UI, not actions).

4. **What about handler types beyond `makeCapability`?** We saw `cdpMethodToCapability(desc, opts)` (cdp-capability-registrar.ts:173) and `capability-composer` (capability-composer.ts:177). These are higher-level constructors. The "raw" `registry.register(cap)` is the universal sink.

5. **Are there any "global" registration calls at module load?** (Module-level side effects, not inside a function.) Not in the scan. The pattern is "all registrations happen inside a function called at boot."

6. **What is the front-end `CapabilityRegistry` (in `build-frontend.ts:43`)?** Probably a different thing from the backend one. May be a generic registry. The comment `CapabilityRegistry.register(${JSON.stringify(r.slug)}, { slug: ... })` looks like a string → object map.

---

## Cross-references

- **Step 1.7 (UnifiedCapabilityRegistry, LiveCapabilityRegistry)** — the central registry. The .register pattern is the most common.
- **Step 1.4 (SurfaceRegistry)** — rare in production. Only `plugin-system.ts:92` writes.
- **Step 1.1 (PluginManagerImpl)** — its `register(plugin)` is in the scan (line 54 of test, line 92 in plugin-system.ts).
- **Step 1.12 (UIComponentRegistry)** — frontend slot registry. `subscribe()` is its main observation point.
- **Step 1.6 (ProviderRegistrar)** — self-recursive `register(manifest)`. Distinct.
- **Step 1.8 (capability-bootstrap-generated.ts)** — the bulk registration. `extendHandlerMap` is the only true extension hook.
- **Step 1.14 (`/api/plugins/install` route)** — the only `.install(` call in the codebase.
- **`capability-composer.ts:177`** — a `toUnifiedCapability()` from child caps. A "compose cap from other caps" pattern.
- **`cdp-capability-registrar.ts:173`** — auto-generate capabilities from CDP method descriptors. Auto-discovery pattern.
- **`auto-populate.ts:62`** — bridges backend capabilities → frontend `ActionRegistry`. The sync layer.
