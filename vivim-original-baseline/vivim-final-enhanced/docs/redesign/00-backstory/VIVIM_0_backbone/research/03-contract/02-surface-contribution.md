# Step 3.2: Surface Contribution — Design Contract

**Date:** 2026-08-28
**Read:** Phase 1 Step 1.4 (reprogrammability), Phase 1 Step 1.5 (canvas), Phase 1 Step 1.12 (frontend slots)
**Status:** DESIGNED

---

## The question

**Can an extension add a new UI surface? A new canvas panel? A new sidebar tab?**

Today: **3 partial mechanisms**, none unified.

1. **Frontend slots (Step 1.12)** — open at the catalog + override level, closed at the 30-slot-id level. A user can register a component for `chat.composer`, `tab.bar`, etc.
2. **Reprogrammability surfaces (Step 1.4)** — `ReprogrammableSurface` interface. 7 `SurfaceKind` values. Closed at kind. Open at spec. **Not in vivim-next** (forge only).
3. **Canvas nodes (Step 1.5)** — `CanvasNode.type` is one of 7 hard-coded. Open at `data`.

The proposed `SurfaceContribution` wraps the **frontend slot system** (the production-grade one) and bridges to the other two.

---

## The proposed `SurfaceContribution` shape

```typescript
// In an extension manifest, this is a JSON object.
// At runtime, this is a TypeScript object passed to UIComponentRegistry.
export interface SurfaceContribution {
  // ── Identity (required) ──
  id: string                  // unique within extension; e.g. "bubble-citations"
  slot: SlotId                // one of 30 (closed)
  slug: string                // the renderer slug; e.g. "myext.bubble-citations"
                             // resolution: capabilitySlug > providerSlug > default
                             // so the contribution must declare its slug

  // ── Component (required) ──
  component:
    | { kind: 'inline-jsx'; source: string; bundledFile?: string }  // bundled React component
    | { kind: 'component-key'; key: string }                         // reference to a host catalog entry
    | { kind: 'catalog-bundle'; entryPoint: string; assets: string[] }  // bundled separately

  // ── Sandbox (required, P8) ──
  sandbox: string[]            // capabilities this component can call; empty = none

  // ── Mount conditions (optional) ──
  mount?: {
    when?: 'always'            // always mount once registered
    | 'on-capability-call'     // mount when one of the whitelisted caps is invoked
    | 'on-event'               // mount on an event
    events?: string[]
  }

  // ── Unmount on what? (optional) ──
  unmount?: {
    onExtensionUninstall?: boolean   // default true
    onExtensionUpdate?: boolean      // default true
  }

  // ── Display (optional) ──
  display?: {
    icon?: string
    label?: string             // overrides the default
    order?: number             // if multiple contributions target the same slot
  }
}
```

---

## What this fixes

- ✅ A single shape for "I want my UI to appear in slot X."
- ✅ Mount conditions (always / on-capability-call / on-event).
- ✅ Unmount conditions (clean up on uninstall/update).
- ✅ Three ways to provide the component: inline JSX, catalog-key, or bundled file.
- ✅ Sandbox (P8) — the component is gated to the listed capabilities.

---

## What this does NOT fix

- **30 slots are still closed.** A user can render in `chat.composer` but cannot add a new "toolbar" position.
- **The component source must be in the host's build system.** `inline-jsx` is fine for prototypes; production needs bundled assets.
- **No component-to-component communication.** The P8 sandbox is one-way: component → capabilities. Components cannot directly invoke other components.
- **No server-side rendering of slots.** Slots render in the browser. (Probably; not deep-dived.)
- **No A/B testing / variant selection.** Reprogrammability's `SurfaceVariant` is a separate system (Step 1.4); not unified with slot overrides.

---

## Bridge to Reprogrammability

When a user installs an extension that declares a `SurfaceContribution`, the host:
1. Loads the component source (inline JSX, catalog key, or bundled file).
2. Registers the component in the `UIComponentRegistry` catalog.
3. Sends a `SlotOverrideClaim { slot, component: <catalog-key>, sandbox: <capability-list> }` for the requested slot.
4. (If reprogrammability is present) also registers a `ReprogrammableSurface` of kind matching the slot, with the same renderer.

The reprogrammability bridge is optional. If the host has reprogrammability, the surface is a first-class `ReprogrammableSurface`. If not, it's just a slot override.

---

## Bridge to Canvas

Canvas nodes are NOT slot-based. A surface contribution that targets the canvas would:
1. Be of a kind matching a canvas `NodeType` (or a new kind if Phase 6 of the canvas is open — currently closed).
2. The renderer is keyed on `NodeType` + `data.kind`.
3. The host registers a custom `NodeType` renderer (the canvas's renderer registry, not the slot system).

**This is a separate surface family.** The `SurfaceContribution` for the canvas would have a different shape:
```typescript
interface CanvasSurfaceContribution {
  nodeType: string              // the canvas NodeType (closed at 7)
  renderer: { /* same as SurfaceContribution.component */ }
  defaultData?: Record<string, unknown>
  // Sandbox per canvas node — probably no sandbox; canvas is local-first.
}
```

**For the v1 model, canvas surface contributions are out of scope.** The slot system is the primary UI surface.

---

## Sample slot override (in `vivim-extension.json`)

```json
{
  "id": "bubble-citations",
  "slot": "chat.bubble",
  "slug": "myext.bubble-citations",
  "component": {
    "kind": "inline-jsx",
    "source": "export default function BubbleCitations({ message }) { /* ... */ }"
  },
  "sandbox": ["knowledge_search", "memory_query"],
  "display": {
    "icon": "📚",
    "label": "Citations"
  }
}
```

This is one slot override. The host loads the JSX, registers in the catalog, sends the override claim. The user sees the citations in the chat bubble.

---

## Open design questions

1. **Can two contributions target the same slot?** Yes — `slug` is the disambiguator. The user sees both. The host can choose which to mount.

2. **Can a contribution depend on a capability?** If the component calls a capability not in its `sandbox`, the call is rejected. The contract should fail-fast at install time if a sandbox reference is missing.

3. **What if a contribution's slot is one the user has hidden?** The override is registered but not rendered. The slot system has `overridableBy: 'capability' | 'provider' | 'both'` (Step 1.12). The host's slot system already gates this.

4. **What about the slot catalog (the 30 ids)?** The contract uses `SlotId` (a closed enum). New slots would require a new release. **This is a deliberate design choice** — the host defines the chrome, the extension fills the chrome.

5. **Can a contribution provide a "fallback" for an unavailable slot?** Yes — `mount.unmount.when: 'on-capability-call'` means the contribution only mounts when the capability is invoked. The component can render a placeholder or nothing.

6. **What's the SSR story?** Not addressed. The slot system is client-side React. Server-rendered extensions would need a separate mechanism.

7. **Can a contribution change the slot's `overridableBy`?** No. The slot's `overridableBy` is fixed in `SLOT_META`. The contribution is accepted only if the policy allows.

---

## Cross-references

- **Step 1.12 (frontend slot system)** — `SLOT_IDS`, `SlotId`, `SlotMeta`, `SlotOverrideClaim`, `UIComponentRegistry`. The contract this wraps.
- **Step 1.4 (reprogrammability)** — `ReprogrammableSurface`, `SurfaceKind`, `SurfaceRegistry`, `SurfaceVariant`. The optional bridge target.
- **Step 1.5 (canvas)** — `NodeType`, `CanvasNode`, the canvas's own renderer registry.
- **Step 1.7 (capability system)** — `LiveCapability.uiAction` is a similar concept at the capability level.
- **Step 2.5 (UI surfaces synthesis)** — the 3-layer UI extensibility map.
- **Step 2.7 (extension points synthesis)** — the open/closed status.
- **Phase 3 Step 3.7 (synthesis)** — the unified manifest.
