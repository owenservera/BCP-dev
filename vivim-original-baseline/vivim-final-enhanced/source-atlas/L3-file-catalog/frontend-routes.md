# L3 — Frontend Routes (90 `route.ts` + pages; complete list in `generated/gen-frontend-routes.md`)

> `frontend/src/app/` is a Next.js App Router mirror of the backend. Every `route.ts`
> below exists on disk (`walk(frontend/src/app) route.ts = 90`). Backend owns WHAT
> (rows), frontend owns HOW (pixels). Desktop sidecar ports exact `path+verb` hits
> first (`desktop/frontend-route-mount.ts`), so this table IS the precedence list.

## Convention (read from code, not docs)
- `frontend/src/app/api/<area>/…/route.ts` → `GET/POST` handlers → `frontend/src/api/client.ts` → backend `src/server/*-router.ts` (see `server-routers-full.md`).
- `page.tsx/layout.tsx/loading.tsx/error.tsx/not-found.tsx` = shell states; `globals.css/accessibility.css` = tokens; `robots.ts/sitemap.ts` = SEO.
- `canvas/page.tsx + loading.tsx` = canvas shell (mirrors backend `canvas-router.ts` + `canvas-ws.ts`).

## Route groups (counts from disk; full paths in generated index)

| Group | Routes | Backend mirror |
|-------|--------|----------------|
| `api/agent/*` (canvas, canvas/command, invoke, list) | 4 | `agent-canvas-router.ts`, `cap:agent:run` |
| `api/audit/*` (export, list, stats) | 3 | `audit-trail.ts`, `telemetry-audit.ts` |
| `api/automation/*` (execute, list) | 2 | `automation-router.ts` (`/api/automate/*`) |
| `api/canvas/*` (definition, definition/[id], events, node/stream, node/[id]/execute, resolve, save, shell, workspace/switch) | 9 | `canvas-router.ts`; `shell` + `definition/[id]` are desktop-bag exact wins |
| `api/capabilities`, `api/conversations`, `api/conversations/[id]/send` | 3 | `capability-router.ts`, `conversation-router.ts` |
| `api/document/*` (edit×6: apply_op/redo/save/session/start/undo, filetypes, open, documents) | 9 | `document-edit` memory stores + node versions |
| `api/drawer/*` (7) | 7 | `drawer-engine.ts` + `memory-drawer-store` |
| `api/admin/command`, `api/health`, `api/help/*` (agent, search), `api/interpret`, `api/nlcl/interpret`, `api/search`, `api/session` | 8 | `interpret-router.ts`, `nlcl-router.ts`, health probe |
| `api/media` + `api/media/open` | 2 | `routes/media.ts`; `open` is desktop-bag exact win |
| `api/notification/*` (5), `api/onboarding/*` (6), `api/plugins/install`, `api/presence/*` (2), `api/providers`, `api/rbac/*` (6) | 20 | matching backend routers/stores |
| `api/setup/*` (complete, kill, launch-visible, profiles, verify, workspace) | 6 | `setup-router.ts` (no-auth first-run) |
| `api/storage/health`, `api/template/*` (2), `api/ui/*` (5: blueprint, component/[id]/spec, extend, list, set_property), `api/variant`, `api/workspace/list`, `api/zlayer/*` (5) | 15 | `storage-router.ts` (`health` exact win), template/variant/surface routers, z-layer engine |
| `api/route.ts` (root) | 1 | capability universal dispatcher |
| shell pages | `page.tsx`, `canvas/page.tsx`, `layout`, `loading`, `error`, `not-found`, `globals`, `accessibility`, `robots`, `sitemap` | — |

## How to use
Full 90 paths + headers in `generated/gen-frontend-routes.md`. For handler contract (method/zod), open the `route.ts` (mirrors `frontend/src/api/schemas.ts`); for backend behavior, follow the mirror column into `server-routers-full.md`.
