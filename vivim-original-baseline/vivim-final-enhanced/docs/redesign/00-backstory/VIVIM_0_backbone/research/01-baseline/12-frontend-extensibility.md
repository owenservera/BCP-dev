# Step 1.12: Frontend Extensibility — The UI Slot System

**Date:** 2026-08-28
**Read:**
- `surfaces/web/src/ui/slots.ts` (139 lines)
- `surfaces/web/src/ui/registry.ts` (241 lines, first 100)
- **Status:** READ + ANALYZED

**Critical finding:** The frontend has a **slot-based hot-swappable UI system**. A "slot" is a fixed position in a surface (e.g. `chat.composer`, `chat.bubble`, `tab.bar`) that renders a swappable component. There are 30 named slots. Components are registered in a `UIComponentRegistry` (the in-memory store at `registry.ts`) and resolved at render time. **Resolution precedence: capabilitySlug > providerSlug > default.** A provider OR a capability can override any slot at runtime, and the UI live-updates (the registry is consumed via `useSyncExternalStore`).

**This is the frontend extension model. It is data-driven, hot-swappable, and already exists.**

---

## What the code does

### `slots.ts` (139 lines)

The canonical catalog of UI slots. From the file header (line 1-9): "Canonical catalog of UI slots ('capability globals'). A slot is a fixed position in a surface that renders a swappable component. Every surface resolves each slot through the global UIComponentRegistry so the same component set is shared across providers, and any provider/capability can hot-swap a bespoke renderer for that slot at runtime (no rebuild)."

**`SLOT_IDS`** (line 12-43) — 30 hard-coded slot ids, in 4 categories:

- **Chat-level (13)**: `chat.entry`, `chat.sidebar`, `chat.thread`, `chat.bubble`, `chat.composer`, `chat.send`, `chat.attach`, `chat.streaming`, `chat.result`, `chat.confirm`, `chat.error`, `chat.header`, `chat.actionBar`.
- **Panel-level (10)**: `canvas.controls`, `session.controls`, `autonomous.controls`, `automation.launcher`, `fleet.controls`, `capabilities.panel`, `health.panel`, `search.panel`, `zlayers.panel`, `audit.panel`, `templates.panel`, `rbac.panel`.
- **Tab-level (3)**: `tab.bar`, `tab.layer-switcher`, `tab.panel-content`.
- **Entry-level (2)**: `entry.unified`.

**`SLOT_META`** (line 56-122) — per-slot metadata: `{ id, label, overridableBy: 'capability' | 'provider' | 'both' }`. The `overridableBy` field is the **policy** that controls who can hot-swap this slot:
- `overridableBy: 'capability'` — only capabilities can override (not providers).
- `overridableBy: 'provider'` — only providers can override (not capabilities).
- `overridableBy: 'both'` — both can.

Examples:
- `chat.composer` → `provider` (ChatGPT has its own composer shape, Claude has its own)
- `chat.bubble` → `both` (anyone can customize message rendering)
- `chat.send` → `capability` (only capabilities should override the send button)
- `tab.bar` → `capability` (the tab bar is capability-defined)

**`SlotOverrideClaim`** (line 135-139) — the wire format from backend: `{ slot, component?, sandbox? }`. The `component` is a **catalog key** (a string, NOT a React component — "the frontend resolves it against the component catalog"). The `sandbox` is "the whitelist of capability(s) the bespoke renderer is allowed to touch (P8)."

This is the **canonical UI extension point**. A backend extension can:
1. Send a `SlotOverrideClaim` with `slot: 'chat.bubble'`, `component: 'bubble-citations'`, `sandbox: ['knowledge_search', 'memory_query']`.
2. The frontend looks up `bubble-citations` in the catalog, swaps it into the `chat.bubble` slot.
3. The component is rendered, but it can only call the listed capabilities.

**The sandbox here is the cross-component permission model.** A component is "sandboxed" to a list of capabilities.

### `registry.ts` (first 100 of 241 lines)

The runtime store. From the file header (line 1-12): "Global UIComponentRegistry — the backbone of the hot-swappable, capability-global UI. Every surface resolves its slots through this single registry. A slot has a generic DEFAULT shared by all providers; any provider or capability can register a BESPOKE renderer for that slot at RUNTIME, and the mounted UI live-updates. **Resolution precedence: capabilitySlug > providerSlug > default.**"

**`AnyComponent`** (line 22) — `ComponentType<Record<string, unknown>>`. A permissive type so defaults and bespoke renderers can be stored uniformly. Surfaces cast to their concrete prop shape.

**`SlotSource`** (line 24) — `'capability' | 'provider' | 'default'`. The provenance of the resolved component.

**`ResolvedSlot`** (line 26-31) — `{ component, source, sandbox: string[] }`. What a slot resolves to.

**`SlotOverrideRecord`** (line 33-38) — `{ slot, slug, component, sandbox }`. The override record.

**Internal store** (lines 52-58):
- `defaults: Map<SlotId, AnyComponent>` — the generic default for each slot.
- `bespoke: Map<SlotId, Map<string, SlotOverrideRecord>>` — `slot → (slug → override)`. The hot-swap layer.
- `catalog: Map<string, AnyComponent>` — `key → component`. The backend-claim resolver.
- `version: number` — bumped on every change.
- `listeners: Set<() => void>` — pub/sub for live updates.

**External store API** (line 71-80): `subscribe(listener)`, `getVersion()`. Consumed by `useSyncExternalStore` on the React side. So the registry is an external store.

**Public registration functions** (line 85+):
- `registerDefault(slot, component)` — set the default renderer.
- `registerCatalogEntry(key, component)` — add a named component to the catalog.
- `register(slot, slug, ...)` — register or replace a bespoke renderer. (Not read past line 100.)

**The full file (241 lines) likely includes:** the `register()` implementation, a `resolve(slot, context)` function that picks `capabilitySlug > providerSlug > default`, a `useSlot(slot, context)` React hook, a `persist()` function (line 66: `persist()` is called on every `emit()`), and the data shapes for slot override claims.

---

## Key observations

- **The frontend has a real extension model.** A plugin/provider/capability can:
  1. Register a catalog entry (a named React component).
  2. Send a `SlotOverrideClaim` to override a specific slot for a specific slug.
  3. The UI live-updates (registry is an external store).
  4. The component is sandboxed to a capability whitelist (P8).

- **The slot system is closed at the slot-id level, open at the component level.** You can't add a new slot id without editing `SLOT_IDS` (and the SLOT_META map). But for any of the 30 existing slots, you can register a new component. So the *positions* are fixed; the *renderers* are pluggable.

- **Resolution precedence is deterministic.** `capabilitySlug > providerSlug > default`. If capability X has a bespoke renderer for slot `chat.bubble`, it wins. If only provider Y has one, that wins. Otherwise, default.

- **The override-by policy is enforced at the `SLOT_META` level.** A slot marked `overridableBy: 'capability'` cannot be overridden by a provider. The `register()` function (not read in detail) presumably checks this.

- **The `sandbox` field is the per-component capability whitelist.** P8 invariant: a bespoke renderer can only call whitelisted capabilities. This is a real, declarative sandbox — the component can request `knowledge_search` if it's whitelisted, but not `provider_send_message` unless that's also whitelisted.

- **Persistence is built in.** Line 66: `persist()` is called on every `emit()`. So slot overrides survive page reloads. (Need to read the `persist()` body to know the storage backend — localStorage? IndexedDB? Server?)

- **The catalog is the bridge from string to component.** A backend extension doesn't have a React component reference. It sends a `component: 'bubble-citations'` string. The frontend looks up `'bubble-citations'` in `catalog` and finds the component. So the catalog is the **public API** for new components — the catalog is where you register them.

- **There are 30 slots, but the catalog size is not bounded by code.** A user extension can register as many catalog entries as it wants. The slot system is a finite set of *places*; the catalog is an open set of *components*.

- **Two "plugin" patterns coexist at the frontend level:**
  1. **Slot override (runtime, data-driven, hot-swap)** — `SlotOverrideClaim`. Live UI.
  2. **The reprogrammability `surfaces[]` (Phase 9 of plugin-system.ts)** — adding a `ReprogrammableSurface` to the SurfaceRegistry. The renderer for the surface is presumably also looked up here. (But canvas is closed at the NodeType level per Step 1.5; this is a different model.)

- **`useSyncExternalStore` is the React integration.** The registry exports `subscribe()` and `getVersion()`. React components subscribe and re-render when `version` bumps. This is the standard external-store pattern.

- **The `entry.unified` slot is a special one.** Line 121. The "Unified Entry" is presumably the main app shell — the thing that decides which surface (chat / canvas / etc.) is shown. Overridable by `'provider'`, so a provider can replace the app shell.

- **The `tab.bar`, `tab.layer-switcher`, `tab.panel-content` are the canvas tab system.** Lines 39-41, 110-119. The canvas has a tabbed layout (per Step 1.5 + AGENTS.md "Ctrl+Tab cycles surface tabs"). The tab system is its own slot group, overridable by capability.

- **`overridableBy: 'both'` is rare.** Only `chat.bubble` and `fleet.controls` and... let me recount: `chat.bubble: 'both'`. That's it. Most slots are `'capability'` or `'provider'`. So the system has a clear policy: providers customize the chrome, capabilities customize the actions.

- **The slot system is decoupled from the canvas.** The canvas has its own `NodeType` (Step 1.5). The slot system has its own `SLOT_IDS`. A canvas `NodeType: 'package'` and a slot `canvas.controls` are different things — the slot is the *chrome around* the canvas; the NodeType is the *content inside* the canvas.

- **P8 is enforced in the slot sandbox.** A bespoke renderer's `sandbox: string[]` list is the whitelist. The component is expected to check the sandbox before invoking a capability. (The mechanism for checking is presumably in the component itself — the registry stores the list, the component reads it.)

- **The `entry.unified` slot is overridable by `'provider'`.** So a provider (e.g. a custom LLM provider) can completely replace the app shell. This is a heavy override — the provider becomes the app.

---

## Key questions raised

1. **What is the `register()` function's full signature?** Line 98: `function register(slot: SlotId, slug: string, ...)` — what else? Probably `component: AnyComponent` and `sandbox?: string[]`. Need to read more.

2. **How is `persist()` implemented?** Line 66. localStorage? IndexedDB? Server? If local, the slot overrides are per-browser. If server, they're per-user. If neither, they're in-memory only.

3. **Where is the slot override claim wire protocol?** A backend sends a `SlotOverrideClaim` (`{ slot, component?, sandbox? }`). What carries this? An HTTP endpoint? A WebSocket? The `capability:surface-registered` event from plugin-system.ts? (Step 1.1 mentioned that event for plugin surfaces.)

4. **What happens if the catalog doesn't have the requested component key?** The registry would have to handle a missing key — fall back to default? Throw? The contract is not specified in the first 100 lines.

5. **Can a slot override be removed at runtime?** The `register()` function presumably supports unregister. Need to read the full file.

6. **What is the React `useSlot` hook's signature?** Probably `(slot: SlotId, context: SlotContext) => ResolvedSlot`. Need to read the rest of the file.

7. **What is `defaults/index.tsx` (10209 lines)?** Probably the default renderers for all 30 slots. Big file.

8. **What is `defaults/register.ts` (1076 lines)?** Probably the function that registers all defaults. Sets the baseline.

9. **What is `ui/context.tsx` (1133 lines)?** Probably a React context that provides the slot resolution to descendants.

10. **Are there any frontend tests for the slot system?** The AGENTS.md mentions "Phase 0" tests for the UI but not in detail. Not in this step.

11. **What's the precedence of the slot override vs a `ReprogrammableSurface`?** A `ReprogrammableSurface` from Step 1.4 has a `kind: SurfaceKind`. A slot has a `slot: SlotId`. Are these the same namespace? Probably not — slots are positions in the chrome; surfaces are typed UI units. But both can be renderer-bound.

12. **Can a user add a new slot id?** Per the catalog, the 30 slots are hard-coded. So no, you can't add a new "position" in the app. But you can render a new component into one of the 30 positions.

13. **What's the typing story for a custom component?** A custom component is `AnyComponent` which is `ComponentType<Record<string, unknown>>`. So it takes a generic `Record<string, unknown>`. Each surface casts to its concrete shape. This is permissive but unsafe — a wrong-cast is a runtime error.

14. **What is the lifecycle of a slot override?** When is it loaded? When is it removed? Hot-reload? Persisted across app restarts? Per-session? Per-user?

---

## Cross-references

- **Step 1.1 (plugin-system.ts)** — `plugin.surfaces` is registered with the `SurfaceRegistry` (reprogrammability, Step 1.4). The slot system is a *different* extension point. Both can fire `capability:surface-registered` events. The relationship between the two is unclear.
- **Step 1.4 (reprogrammability)** — `SurfaceRegistry` is a backend singleton. The UI registry here is frontend. They are probably wired: a backend `Surface` has a `component` catalog key; the UI looks it up.
- **Step 1.5 (canvas surface)** — the canvas has its own `NodeType` (closed) and the slot system has `canvas.controls` (open). Different layers.
- **Step 1.7 (live-capability-registry.ts)** — a live capability can declare `ui: 'live-run'` in its `uiAction` (Step 1.7 line 153-155). The slot system probably consumes that.
- **`surfaces/web/src/ui/defaults/index.tsx`** (10209 lines) — the 30 default renderers.
- **`surfaces/web/src/ui/defaults/register.ts`** (1076 lines) — the bootstrap that registers them.
- **`surfaces/web/src/ui/context.tsx`** (1133 lines) — the React context.
- **`surfaces/web/src/registry/`** (from AGENTS.md: "frontend/src/registry/CapabilityRegistry") — the frontend's capability registry. Different from the backend `UnifiedCapabilityRegistry`. (Not in the dir listing we got; might be elsewhere or named differently.)
- **`surfaces/web/src/actions/`** (from AGENTS.md: "ActionRegistry + auto-populate") — the action registry. Related to slot overrides? (Not explored.)
- **`docs/prd-hot-swappable-ui.md`** (referenced in slot.ts line 9) — the design doc. Not in vivim-next; probably in the forge.
- **`surfaces/web/src/app/api/plugins/`** (found in dir listing) — the API endpoint for plugin management. Probably wires backend plugin events to frontend slot overrides.
