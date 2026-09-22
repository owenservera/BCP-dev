# L3 — Server Routers Full (30 routers + 10 resource routes; prefixes in `generated/gen-server-routers-detail.md`)

> Routing order lives in `src/server/index.ts` fetch() (minimal `createServer` + full
> `createServerWithEngines`): `/health` → `/readyz` → `/api/openapi.json` → `/docs` →
> `/api/setup/*` (no-auth) → `/ws` upgrade → shutdown-503 → auth-gate → desktop-bag exact
> wins → prefix routers → universal `matchCapabilityEndpoint` → `FRONTEND_DIR` static →
> `conversationRouter` + 500 safety net. Every response: `X-Trace-Id` + localhost CORS.

## Router → prefix → backing (all 30 observed on disk)

| Router file | Prefix(es) | Backing |
|-------------|-----------|---------|
| `setup-router.ts` | `/api/setup/*` (no-auth) | workspace/profiles/launch-visible/verify/complete/restore (`shared/api-types.ts`) |
| `nlcl-router.ts`, `interpret-router.ts` | `/api/nlcl/*`, `POST /api/interpret` | `NLCLEngine` (works in minimal boot) |
| `conversation-router.ts`, `conversation-sync-router.ts` | `/api/conversations/*`, `/api/conversations/sync/*` | `ConversationManager` + `StreamBlock` tail |
| `knowledge-router.ts` (= `routes/knowledge.ts`) | `/api/knowledge/*` | ingestion/extraction/search/synthesis |
| `memory-viz-router.ts`, `memory-router.ts` | `/api/memory/*` | `memoryEngine` (viz returns `Response` directly) |
| `capability-router.ts` | `/api/capabilities*` + `POST :id/execute` | `UnifiedCapabilityRegistry` (`list/get/execute`) |
| `agent-canvas-router.ts` | `/api/agent/canvas/*` | agent↔canvas bridge (nullable fallthrough) |
| `canvas-router.ts` | `/api/canvas/*` | `CanvasEngine` (in-memory store + `ServerLayerHost`) |
| `mux-router.ts` | `/api/route/*` | `ProviderMuxEngine` (`MuxSession`) |
| `chrome-router.ts` | `/api/chrome/*` | `ChromeGovernor` (sole CDP owner) |
| `automation-router.ts` | `/api/automate/*` | scheduler + UI-automator (CLI `automate` 1:1) |
| `autonomous-router.ts` | `/api/autonomous/*` | planner/tasks/gates (only when engines present) |
| `llm-harness-router.ts` | `/api/harness/*` | 8-phase harness + repair |
| `generative-router.ts` | `/api/generative/*` | `InMemoryGenerativeTaskStore` (minimal boot OK) |
| `mutation-router.ts`, `surface-router.ts`, `template-router.ts`, `variant-router.ts`, `plugin-builder-router.ts`, `plugin-router.ts` | `/api/mutation|surface|template|variant|plugins/*` | projection + builder (`dispatch(specific, fallbackConversation)`) |
| `version-router.ts` | `/api/version/*` | manifest/taxonomy/program/surface versions |
| `update-router.ts` + `routes/update.ts` | `/api/update/*` | updater |
| `storage-router.ts` | `/api/storage/*` (only when `relocationEngine`) | relocation/paths/health |
| `node-router.ts` | `/api/nodes/*` (both boots) | `NodeStoreImpl` |
| `collection-router.ts` | `/api/collections*` | collections/items |
| `conceptual-router.ts`, `kernel-router.ts`, `webhook-router.ts` | `/api/conceptual/*`, `/api/kernel/*`, webhooks | conceptual service, kernel introspection, workflow webhooks |
| `routes/{containers,content,notifications,contacts,sync,media,tunnel}.ts` | matching `/api/*` (both boots) | resource CRUD + P2P/tunnel |
| inline in `index.ts` | `POST /api/agent/run`, `/api/opencode/*` (send/session/sessions/instances/permission), `POST /api/system/refresh-provider-snapshot` | registry `cap:agent:run`; `__opencodeServe` globals; snapshot rebuild |

Universal fallback: any capability with `surface:'api'` + `apiEndpoint{method,path}` resolves via `matchCapabilityEndpoint` with NO route file (body+path+query merged → `registry.execute`). Literal prefix hits per file: `generated/gen-server-routers-detail.md`.
