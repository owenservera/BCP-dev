# Frontend Architecture — hot-swappable capability UI (from slots + registry + storage mirror)

> Sources: `frontend/src/ui/slots.ts` (slot catalog), `frontend/src/ui/registry.ts`,
> `frontend/src/ui/defaults/`, `frontend/src/registry/`, `frontend/src/storage/contracts/`,
> `shared/ui-slots.ts` + `ui-component.ts`, `src/server/canvas-router.ts` + `canvas-ws.ts`.

## 1. Core idea: slots, not screens

A **slot** is a fixed position in a surface that renders a swappable component
(`slots.ts` header: "capability globals"). Every surface resolves each slot through the
global `UIComponentRegistry`, so the same component set is shared across providers and any
provider/capability can hot-swap a bespoke renderer **at runtime, no rebuild**.

Observed `SLOT_IDS` (canonical — add new capability globals here):

```
chat.entry, chat.sidebar, chat.thread, chat.bubble, chat.composer, chat.send,
chat.attach, chat.streaming, chat.result, chat.confirm, chat.error, chat.header,
chat.actionBar, canvas.controls, session.controls, autonomous.controls,
automation.launcher, fleet.controls, capabilities.panel, health.panel,
search.panel, zlayers.panel, audit.panel, templates.panel, rbac.panel,
tab.bar, tab.layer-switcher (+ tail — see slots.ts for full list)
```

## 2. Resolution chain (how a slot becomes pixels)

```
backend: CapabilityBinding(bestProgramId) + UiComponent rows + SlotBinding rows
   │  (contracts: ui-component-store, canvas-store, workspace-store)
   │  served over HTTP (canvas-router, collection-router) + WS (canvas-ws.ts deltas)
   ▼
frontend: UIComponentRegistry.resolve(slotId, { providerId, capabilityId })
   │  1. exact (slot, provider, capability) → bespoke renderer
   │  2. provider default → 3. global default (ui/defaults/) → 4. fallback skeleton
   ▼
React: slot component mounts renderer; capability action buttons (chat.actionBar)
       dispatch back through actions/ → api/ → server capability-router
```

## 3. Why this shape (design rationale)

1. **Provider quirks stay out of the layout.** A provider needing a custom result card
   registers a renderer for `(chat.result, thatProvider, thatCap)` — the thread layout,
   composer, and sidebar never fork.
2. **Backend owns WHAT, frontend owns HOW.** `UiComponent` + `SlotBinding` + `Primitive`
   rows (system DB) declare availability; `frontend/src/render/` + `canvas/` decide pixels.
   The `shared/ui-slots.ts` + `ui-component.ts` types are the only BE↔FE contract —
   hence frontend may import only `shared/` (I-2 frontend quarantine).
3. **Realtime without refetch.** `canvas-ws.ts` pushes mutation deltas; `mirror-engine`
   (backend) + frontend `storage/` memory impls converge via `MirrorState`/`OptimisticUpdate`
   rows — same pattern as conversation sync (`SyncLog`/`SyncState`).

## 4. Surface parity (the guarantee)

`capability-parity.ts` + `command-parity-capabilities.ts` + `config-universal-surface.ts`
enforce **FRONTEND = BACKEND = SDK = CLI = API**: every capability reachable from
`chat.actionBar` must also resolve via CLI (`pipeline-engine`), API (`setup-client`),
SDK (`sdk/src`), and MCP tools (`mcp/*-tools.ts`). `tests/arch/api-contract.test.ts`
fails the build on drift. When adding a capability: register taxonomy → binding → program
→ slot renderer → parity check, in that order.

## 5. Frontend zones that matter (from 22-dir scan)

- `app/` (routes: `api/`, `canvas/` top) · `actions/` (server actions) · `api/` (fetch clients mirroring server routers 1:1)
- `canvas/` + `render/` (scene) · `components/` + `ui/` (design system) · `registry/` (slot→renderer map — THE file to edit for new renderers)
- `engines/` (frontend mirrors: canvas, workspace, plugin, rbac, presence) · `features/` (user moments)
- `storage/contracts/` + `impl/memory` (memory-only doubles — real persistence stays backend)
- `schema/` (frontend zod mirrors `src/schema`) · `hooks/` · `lib/` · `ml/` · `test-utils/`
