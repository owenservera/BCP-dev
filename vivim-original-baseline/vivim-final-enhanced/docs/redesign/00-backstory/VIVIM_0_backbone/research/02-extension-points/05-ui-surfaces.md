# Step 2.5: UI Surfaces — Where Extensions Can Add UI

**Date:** 2026-08-28
**Scope:** VIVIM-next source
**Status:** CATALOGED

---

## The 3 layers of UI extensibility

```
┌──────────────────────────────────────────────┐
│ Layer 3: REPROGRAMMABILITY (forge only)       │
│   ReprogrammableSurface.mutate() — apply      │
│   8 ops to a 7-kind surface. Atomic.          │
│   Not in vivim-next.                          │
├──────────────────────────────────────────────┤
│ Layer 2: FRONTEND SLOTS (30 positions)        │
│   UIComponentRegistry.register(slot, slug,    │
│   component, sandbox). P8 sandbox per        │
│   component. capabilitySlug > providerSlug >  │
│   default. Live updates.                      │
├──────────────────────────────────────────────┤
│ Layer 1: CANVAS NODES (7 types)              │
│   CanvasNode { type: NodeType, data, ... }   │
│   Closed at type level; open at data level.  │
│   Vim commands. CRDT revision. P8 no inline  │
│   script.                                    │
└──────────────────────────────────────────────┘
```

These three layers are independent. An extension can use one, two, or all three. They are not hierarchical.

---

## Layer 1: Canvas (the user-workspace surface)

Already cataloged in Step 1.5. Key facts:

- **7 hardcoded `NodeType` values**: `'package' | 'note' | 'code' | 'image' | 'link' | 'group' | 'marker'`.
- **4 hardcoded `EdgeKind` values**: `'depends-on' | 'conflicts' | 'relates' | 'references'`.
- **`data: Record<string, unknown>`** — the escape hatch. A user can put anything here.
- **Vim-style modal commands** (`commands.ts`) — `normal | insert | visual | command`. Actions are 17 hardcoded kinds.
- **Config hot-reload** — `config/canvas.toml` is hot-reloaded via the file watcher (not the plugin hot-reload; the canvas's own config).
- **P8 invariant** — no inline `<script>` in `CanvasDefinition.html`. `sandbox.allowInlineScript` is literal-false.
- **CRDT** — every node/edge has a `revision` counter (used by `collaboration.ts`).

**Extensibility summary for Layer 1:**
- CAN add: a node with a new `data` shape; a new command binding (via config.toml); a new palette; a new edge kind (no — 4 hardcoded).
- CANNOT add: a new `NodeType`; a new command action kind; a new layout algorithm.

**The "configurable canvas.toml" is the user-extension path for the canvas layer.** A user can change colors, snap behavior, keybindings. Not a new node type.

---

## Layer 2: Frontend slots (the chrome and panels)

Already cataloged in Step 1.12. **30 slots** in 4 groups:

| Group | Count | Override policy |
|---|---|---|
| `chat.*` | 13 | capability / provider / both (per slot) |
| `*.panel` | 10 | mostly capability |
| `tab.*` | 3 | capability |
| `entry.unified` | 1 | provider |

**`UIComponentRegistry` external store** with three layers:
- `defaults: Map<SlotId, AnyComponent>` — generic baseline.
- `bespoke: Map<SlotId, Map<string, SlotOverrideRecord>>` — per-slug overrides.
- `catalog: Map<string, AnyComponent>` — string → component.

**Resolution:** `capabilitySlug > providerSlug > default`.

**Wire format (`SlotOverrideClaim`):** `{ slot, component?, sandbox? }`. The `component` is a catalog key.

**P8 sandbox per component:** Each component carries a `sandbox: string[]` whitelist of capabilities it can call.

**Extensibility summary for Layer 2:**
- CAN add: a new catalog entry (a named component); a slot override for any of 30 slots.
- CANNOT add: a new slot id; a new slot group; a new resolution rule.

**This is the cleanest extension surface in the codebase.** A user extension that wants to render a custom UI in the chat sidebar can register a `bubble-citations` catalog entry + a `SlotOverrideClaim`.

---

## Layer 3: Reprogrammability (the declarative mutation layer)

Already cataloged in Step 1.4. NOT in vivim-next (the `reprogrammability/` directory exists in forge, not in the migration target).

- **7 surface kinds**: `card | panel | layer | primitive | chrome | slot | custom`.
- **8 mutation ops**: `replace | insert | remove | reorder | restyle | rebind | set_property | set_slot`.
- **6 provenance tags**: `manual | nlcl | prefix | plugin | llm-harness | system`.
- **`SurfaceRegistry`** singleton. Three origins: frontend classes, backend descriptors, plugin factories. (Backend descriptors = Phase 8, not done. Plugin factories = Phase 9, partial.)
- **`InMemorySurface`** — permissive default impl.
- **DSL** in `reprogrammability/dsl/` (grammar, parser, executor). User-facing language.

**Extensibility summary for Layer 3:**
- CAN add (in forge, not vivim-next): a new `ReprogrammableSurface` (any kind); a `SurfaceMutationPlan`; a custom `mutationHandlers` entry in a `ProviderPlugin` (Phase 9).
- CANNOT add: a new `SurfaceKind` (contract amendment required, Phase 10 audit); a new `MutationOp` (same).

**This layer is the "user-configurable program" model** (per the original AR-003 admission). The 4 user-facing producers (Composer, Modal, Builder, LLM Harness) all produce `SurfaceMutationPlan`s. An extension that wants to mutate a surface uses one of these producers or the DSL.

---

## What "UI surface" means for an extension

**Closed to extensions:**
- `NodeType` (canvas) — 7 values, no add.
- `EdgeKind` (canvas) — 4 values, no add.
- `CommandResult` action kinds (canvas) — 17 values, no add.
- `SlotId` (frontend) — 30 values, no add.
- `SurfaceKind` (reprogrammability) — 7 values, no add (without contract amendment).
- `CapabilitySurface` — 5 values (`cli | ui | workflow | mcp | api`), no add.

**Open to extensions (per-slot, per-slug, per-surface):**
- New `CanvasNode` instances (data: any).
- New command bindings (config.toml).
- New `UIComponentRegistry` catalog entries + slot overrides.
- New `ReprogrammableSurface` instances (forge only).
- New `MutationHandler` entries in `ProviderPlugin` (forge only).
- New Live capabilities (each can declare `uiAction: { component: 'live-run', ... }`).

---

## The UI surface taxonomy (consolidated)

| UI unit | Open or closed? | User can add? | Via |
|---|---|---|---|
| **Chat composer** | open | yes | `SlotOverrideClaim` for `chat.composer` |
| **Chat bubble** | open | yes | `SlotOverrideClaim` for `chat.bubble` |
| **Chat send button** | open | yes | `SlotOverrideClaim` for `chat.send` |
| **Chat sidebar** | open | yes | `SlotOverrideClaim` for `chat.sidebar` |
| **Tab bar** | open | yes | `SlotOverrideClaim` for `tab.bar` |
| **Canvas node** | closed at type, open at data | no new type | new `data: Record<string, unknown>` |
| **Canvas edge** | closed at kind, open at label | no new kind | new `label` |
| **Reprogrammable surface** | closed at kind, open at spec | no new kind | new `InMemorySurface` instance |
| **Capability UI binding** | open | yes | `LiveCapabilitySpec.uiAction` or `UnifiedCapability.ui/uiAction` |
| **Slot** (30 positions) | closed at id, open at component | no new id | new component in catalog |

---

## The "chat" UI specifically

The chat is the central surface. It has:
- **`chat.entry`** (host region) — overridable by capability.
- **`chat.sidebar`** (conversation list) — overridable by provider.
- **`chat.thread`** (message scroll region) — overridable by capability.
- **`chat.bubble`** (single message) — overridable by both.
- **`chat.composer`** (input + send) — overridable by provider.
- **`chat.send`** (send button) — overridable by capability.
- **`chat.attach`** (attach button) — overridable by capability.
- **`chat.streaming`** (progressive indicator) — overridable by capability.
- **`chat.result`** (rich result renderer) — overridable by capability.
- **`chat.confirm`** (confirmation dialog) — overridable by capability.
- **`chat.error`** (error/toast) — overridable by capability.
- **`chat.header`** (provider switcher) — overridable by provider.
- **`chat.actionBar`** (capability action buttons, B8) — overridable by capability.

**A "VS Code-style extension" that wants to add a button to the chat action bar would:**
1. Define a `bubble-citations` component (a React function).
2. Register it in the catalog: `registerCatalogEntry('bubble-citations', MyComponent)`.
3. Send a `SlotOverrideClaim { slot: 'chat.actionBar', component: 'bubble-citations', sandbox: ['knowledge_search'] }`.
4. The host looks up `bubble-citations` in the catalog and renders it.
5. The component can call only `knowledge_search` (per the sandbox).

**This works today.** The infrastructure is there. The user-facing UX for *installing* a slot override is not (Step 1.14 stub).

---

## Key observations

- **The frontend slot system is the most production-ready UI extension point.** 30 named positions, external store, P8 sandbox, persistence, live updates. It works.

- **The canvas is the most closed UI surface.** Closed at type, open at data. A user can put arbitrary data in a node, but cannot define a new node type. This is a deliberate choice — nodes are a small, well-typed set of "things on the canvas."

- **Reprogrammability is the most "declarative" UI extension point.** Mutation ops, surface kinds, provenance tags. But it is NOT in vivim-next. **This is the biggest gap.** The forge has it; the migration target doesn't.

- **The "chrome" surface kind in reprogrammability is conceptually similar to "slot" in the slot system.** Both are about "places in the UI." But the slot system is production; reprogrammability's `chrome` kind is not.

- **The "primitive" surface kind in reprogrammability is conceptually similar to `CanvasNode` type `'workspace' | 'projects' | 'knowledge' | 'agents' | 'providers' | 'conversations'`.** 6 of the 7 primitive kinds map directly to a canvas node type. This is not a coincidence — reprogrammability's "primitives" are the canvas's nodes. (Or vice versa.)

- **`Capability.ui` and `Capability.uiAction` are the per-capability UI binding.** A capability declares what UI it shows. Live capabilities default to `{ component: 'live-run', position: 'palette', order: 0 }` (Step 1.7 line 153-155). Engine capabilities get a richer `ui` block.

- **The slot sandbox (P8) is the only per-component permission model in the UI.** A slot override can only call the whitelisted capabilities. This is **the UI's trust boundary.** A malicious component can't make arbitrary HTTP calls.

- **There is no "default UI for a new slot."** A new slot id is not in the catalog. But if a slot id is added to `SLOT_IDS` and no `registerDefault()` call is made, the slot renders as nothing. (Not read in full; assumption.)

- **The canvas `live-config.ts` `patchDefinition` is the only safe canvas edit path.** User-edited canvas definitions go through P8 enforcement (no inline script, sandbox literal-false). This is the canvas's trust boundary.

- **The `tab.panel-content` slot is where a canvas panel renders.** Per the catalog, this is overridable by capability. So a capability can render a custom panel in the canvas tab system. **This is the "extension adds a new tab" pattern.**

---

## Key questions raised

1. **What is the relationship between a `tab.panel-content` slot override and a `ReprogrammableSurface` of kind `card` or `panel`?** Both can render content in the canvas. Are they competing? Or composing?

2. **Can a slot override render a `ReprogrammableSurface`?** The slot system stores React components; the surface system stores typed specs. A bridge would render the surface's spec as a React component. **The bridge is not built.**

3. **Can a user extension add a new "position" in the UI?** No. The 30 slots are hardcoded. So a user can add a new renderer for an existing position, but not a new position.

4. **What is the "B8" tag in `chat.actionBar`?** Line 73 of slots.ts. A bug/feature id from a tracker. Not a permanent designator.

5. **What is the "PRD-hot-swappable-ui.md" referenced in slots.ts (line 9) and registry.ts (line 2)?** The design doc for the slot system. Not in vivim-next. In the forge probably.

6. **Is there a UI for managing slot overrides?** The slot registry has `registerCatalogEntry` and `register(...)` but no in-app UI. The user (or host) calls them programmatically.

7. **Can a slot override be temporary?** No. Once registered, it persists (via `persist()` on every emit). The only way to remove is to call the unregister.

8. **What happens to a slot override when the component fails?** The slot has no error boundary. The component is rendered; if it throws, the slot renders nothing. (Probably.)

9. **Can a slot override declare its own settings?** `SlotOverrideRecord` has `slot, slug, component, sandbox` — no settings field. So no per-component config.

10. **What is the "tab bar" UX?** Per AGENTS.md: "Ctrl+Tab / ⌘+Tab cycle surface tabs." So the tab bar cycles through the 12 main surfaces. An extension can override the `tab.bar` slot to customize this.

11. **What is `entry.unified`?** The "Unified Entry" — the app shell. Overridable by provider. So a provider can replace the entire app. Heavy.

12. **Is the `chrome` SurfaceKind in reprogrammability the same as a "slot"?** Probably. Both are about "a place in the UI." But the slot system is the working model; reprogrammability's `chrome` is aspirational.

---

## Cross-references

- **Step 1.5 (canvas surface)** — `NodeType`, `EdgeKind`, `CanvasNode`, `CanvasAction`, `Mode`, `CommandResult`, `DefinitionPatch`, P8 invariant.
- **Step 1.12 (frontend slot system)** — 30 slots, `UIComponentRegistry`, `SLOT_IDS`, `SlotMeta`, `SlotOverrideClaim`, `AnyComponent`, `SlotSource`, `ResolvedSlot`.
- **Step 1.4 (reprogrammability)** — `ReprogrammableSurface`, `SurfaceKind`, `MutationOp`, `MutationProvenance`, `SurfaceRegistry`, `SurfaceMutationPlan`, `InMemorySurface`. (Forge only.)
- **Step 1.7 (capability system)** — `UnifiedCapability.ui`, `UnifiedCapability.uiAction`, `LiveCapabilitySpec.uiAction` default.
- **Step 1.10 (memory)** — `KnowledgeEnvelope.contentType` is a string; user can define a custom content type.
- **Step 1.14 (distribution)** — the install endpoint doesn't actually wire slot overrides today. **Stub.**
- **Phase 1 synthesis** — Layer 1, 2, 3 of UI extensibility.
