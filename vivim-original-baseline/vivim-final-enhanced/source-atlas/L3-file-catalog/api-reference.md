# L3 — API Reference (every callable surface, from `server/index.ts` + routers + MCP + CLI)

> Assembled from `src/server/index.ts` (1227 lines: two `fetch()` chains — minimal
> `createServer` + full `createServerWithEngines`), `src/server/*-router.ts` (~30),
> `src/server/routes/*` (10), `src/mcp/discovery-tools.ts` (27 tools) +
> `nlcl-tools.ts` (3) + `browser-*`, `src/cli/*`, `shared/api-types.ts` (105 lines).
> Pattern: `routes/*` = resource CRUD; `*-router.ts` = capability-oriented actions;
> any capability with `surface:'api'` + `apiEndpoint{method,path}` is reachable via the
> universal dispatcher with NO dedicated route file (`matchCapabilityEndpoint`).

## 0. Cross-cutting (applies to every route)

- Base: `http://localhost:9420` (discovered via `.runtime/backend.port`; `CAP_STORE_PORT` overrides).
- `GET /health` → `{status:'ok', version:'1.0.0'}` · `GET /readyz` → 503 until booted, then `{status:'ready', uptime}` · `GET /api/openapi.json` (YAML spec) · `GET /docs` (Swagger UI). All no-auth.
- Auth: `auth-gate.ts` — no `CAP_STORE_AUTH_TOKEN` → allow all (dev); else `Authorization: Bearer <token>` required, else 401 `{error, code:'AuthError'}`.
- Envelope: `response.ts: json()/errorResponse()/dispatch()` → `{ok,data,error?}` or `{error, code, details?, traceId?}`. Every response sets `X-Trace-Id` (honor-or-generate) + localhost-only CORS. `OPTIONS` preflight allows `GET,POST,PUT,PATCH,DELETE,OPTIONS,QUERY` + headers `Content-Type,Authorization,X-Source,X-Trace-Id,X-Request-Id`.
- `X-Source: cli|frontend|agent|script` (`shared/api-types.ts:Source`) tracks surface in audit logs (CLI `automate` sets `cli`; `moments` uses `createSetupClient({source:'cli'})`).
- Fallthrough: unmatched `/api/*` → `matchCapabilityEndpoint(registry, path, method)` (`{param}`+`:param` → regex, body+pathParams+query merged → `registry.execute(cap.id, input)`) → `FRONTEND_DIR` static/SPA fallback → `conversationRouter` + 500 safety net with `traceId`.
- Desktop precedence (full boot only): exact `path+verb` hits in `desktop/frontend-route-mount.ts` (ported App Router bag: `/api/canvas/shell`, `/api/canvas/definition/[id]`, `/api/media/open`, `/api/storage/health`) win over prefix routers.

## 1. HTTP routes by prefix (method routing lives in each router file)

| Prefix | Router file(s) | Serves |
|--------|---------------|--------|
| `/api/setup/*` (no auth — first-run) | `setup-router.ts` | `GET workspace` (`WorkspaceGetResponse{workspacePath,defaultPath}`), `POST workspace` (`WorkspaceSetRequest{path}`), `GET profiles` (`ProfilesResponse{profiles: ProfileEntry[]}`), `POST launch-visible` (`LaunchVisibleRequest{providerId,accountSlug,workspace,port?}` → `{profileDir,debugPort,pid,loginUrl}`), `POST verify` (`VerifyRequest{port,providerId?}` → `{alive,loggedIn,url,method}`), `POST complete` (`CompleteRequest` → `{accountId}`), `POST restore` (`RestoreResponse{restored,count}`) — see `shared/api-types.ts:SETUP_ENDPOINTS` |
| `/api/nlcl/*` + `POST /api/interpret` | `nlcl-router.ts`, `interpret-router.ts` | NL command layer over `NLCLEngine` (deterministic, works even in minimal `db-only` boot). `interpret` contract is shared by `cli/repl.ts` (`vivim>`), frontend chat box, and MCP `nl_command`. |
| `/api/conversations/*`, `/api/conversations/sync/*` | `conversation-router.ts`, `conversation-sync-router.ts` | Conversation CRUD + tail pagination + `conversation-history-sync` |
| `/api/knowledge/*` | `routes/knowledge.ts` | Ingestion/extraction/search/synthesis reads |
| `/api/memory/*` | `memory-viz-router.ts` (over `memoryEngine`) | Memory viz (returns `Response` directly) |
| `/api/capabilities*` | `capability-router.ts` | Registry list/get/execute (`GET ?surface=cli` feeds thin-client CLI) + `POST /api/capabilities/:id/execute {input}` (`X-Source` tracked) |
| `/api/agent/run` (POST) | inline in `index.ts:1000` | Calls `cap:agent:run` via registry with `{prompt,model,sessionId,cwd}` |
| `/api/agent/canvas/*` | `agent-canvas-router.ts` | Agent↔canvas command bridge (nullable fallthrough) |
| `/api/canvas/*` | `canvas-router.ts` (over in-memory `CanvasEngine` + `ServerLayerHost` + `RegistryCapabilityExecutor`) | Scene/layer/mutation ops; seeded `seedCoreLayers()` + `registerCapabilities(registry)` at boot |
| `/api/route/*` | `mux-router.ts` | Provider mux fan-out (`MuxSession`) |
| `/api/chrome/*` | `chrome-router.ts` | Slave/fleet/CDP ops (governor-owned) |
| `/api/automate/*` | `automation-router.ts` | Scheduler/UI-automation (CLI `automate` 10 subactions map 1:1: `navigate/click/type/text/value/exists/screenshot/page/reset`) |
| `/api/autonomous/*` | `autonomous-router.ts` | Planner/tasks/steps/gates (only when `autonomousEngine+policyEngine` present) |
| `/api/harness/*` | `llm-harness-router.ts` | 8-phase provider harness + repair |
| `/api/generative/*` | `generative-router.ts` (over `InMemoryGenerativeTaskStore`) | Generative tasks (minimal boot available) |
| `/api/opencode/*` | inline `handleOpenCodeRoutes` (`index.ts:775`) | `POST send {prompt,sessionId?,model?}`, `POST session {model?,cwd?}`, `GET sessions`, `GET instances` (managed-vs-external classifier — consult before killing PIDs), `POST permission/:id {sessionId,decision:allow\|deny\|allow_always}`; 503 unless `__opencodeServe` globals set |
| `/api/mutation/*`, `/api/surface/*`, `/api/template/*`, `/api/variant/*`, `/api/plugins/*` | `mutation-router.ts`, `surface-router.ts`, `template-router.ts`, `variant-router.ts`, `plugin-builder-router.ts` | Canvas/surface projection + plugin builder (all `dispatch(trySpecific, fallbackConversation)`) |
| `/api/version/*`, `/api/update/*` | `version-router.ts`, `update-router.ts` + `routes/update.ts` | Manifest/taxonomy/program/surface versions + updater |
| `/api/storage/*` | `storage-router.ts` (only when `relocationEngine` present) | Relocation/paths/health |
| `/api/nodes/*` | `node-router.ts` (over `NodeStoreImpl`, both boots) | Universal node graph queries |
| `/api/collections*` | `collection-router.ts` | Collections/items |
| `/api/containers/*`, `/api/content/*`, `/api/notifications/*`, `/api/contacts/*`, `/api/sync/*`, `/api/media/*`, `/api/tunnel/*` | `routes/containers|content|notifications|contacts|sync|media|tunnel.ts` | Resource CRUD (both boots; `tunnel` = P2P/tunnel subsystem) |
| `POST /api/system/refresh-provider-snapshot` | inline `index.ts:1079` | Rebuilds `CapabilitySnapshot` from active `ProviderDefinition`s, injects into governor; returns `{providers, entries, providerIds}` |

## 2. WebSocket (`/ws` + `websocket.ts` + `canvas-ws.ts`)

- Upgrade: `GET /ws` → `server.upgrade(req)` else 400. Handlers `open/message/close(ws, eventBus)`; full boot registers conversation + canvas-mutation + node forwarders on `CapabilityEventBus`.
- Use for: live capability events (`kernel|plugin.<id>|legacy` kinds), conversation deltas, canvas mutation deltas (converge with `MirrorState`/`OptimisticUpdate`), node graph events. No polling needed; HTTP stays request/response.

## 3. MCP tools (agent root — `src/mcp/` 11 files)

| Group | Tools | Context |
|-------|-------|---------|
| Discovery (27) | `discover_start/get_session/list_sessions/delete_session/navigate/page_state/get_dom/a11y_tree/evaluate/click/type/scroll/hover/observe_start/observe_stop/observe_list/intercept/match_shape/infer_capabilities` + `detect_parser_format/generate_manifest/validate_manifest/edit_manifest/test_parser/capture_response/approve/reject` | `DiscoveryServerContext{discoveryEngine}` (`server.ts:DiscoveryMcpServer{tool/callTool/listTools/connect/close}`) |
| NLCL (3) | `nl_command {input, surface?} → Status+response text`, `nl_list_commands`, `nl_help` | same `NLCLEngine` as HTTP `interpret` + CLI REPL |
| Browser (`browser-mcp.ts`, `browser-tools.ts`, `browser-session.ts`) | session-scoped CDP-backed actions (selectors, navigation, capture) | governor-mediated, never raw CDP |
| Infra | `types.ts` (I/O shapes), `zod-schema.ts` (arg validators re-using `src/schema/*`), `serp-parser.ts` (search-result parsing), `in-memory-heal-store.ts` (DB-less heal state) | — |

## 4. CLI as API (4 CLIs — full map in `cli-complete.md`)

- **A Backend `vivim`**: `serve [--port]` (hard-coded, bypasses registry) · `help` · registry `automate|moments|seed|migrate` + N bridged `surface:'cli'` capabilities (longest-prefix ≤4, `argvToInput` coercion, 30s remote cache, `X-Source: cli`) + pipes (`a | b` threads `result.data`) + `vivim>` REPL (identical `interpret` contract). Dead: `onboard` (never registered — matches `service-container.ts` "never wired" comment).
- **B Frontend shell** (43 cmds via `ShellCommandStore`, `frontend/src/cli/commands/shell.ts` 746 lines): `admin db status|migrate|reset|invariants check`, `list conversations|providers|workspaces|automations|agents|components`, `resolve canvas|open document|video|audio|publish|patch component`, `run automation|invoke agent`, `go|theme|canvas layout|zoom|node|agent canvas|stream|connect|drawer|zlayer|search|notifications|onboarding|component|ui list|get|set|extend|blueprint|apply|delete`, `help`. Production swaps stubs for `POST /api/capabilities/:id/execute`.
- **C DevOps** (`bun run devops <cmd>`): `gate|select|mark|run|report|gc|fmt|toolkit|profiles`, `audit-code|audit-arch|invariants|deep-scan|sota`, `truth`, `goals|decision|features|roadmap|research`, `desktop-loop|desktop`, `onboard|discover-cdp|discover-protocol|protocol-promote`.
- **D Scripts** (25 `scripts/*.ts`): `dev/stop`, `provider-harness.ts` (`providers:smoke`), `verify-cross-surface.ts` (4-mode parity gate), `db-doctor/backup-db/restore-db/seed-snapshot`, `taxonomy-gen/`, `openapi-gen/manual-gen`, `setup-slaves/ensure-accounts`, `debug-parser/test-parser/test-claude-parser`, `ci.ts`, `runtime-test`.

## 5. Frontend-consumed subset (what the UI actually calls)

`frontend/src/api/*` (`client.ts`, `schemas.ts`, `transformers.ts`) mirror server routers 1:1; `actions/` (server actions) call the same; `storage/` is memory-only (real persistence stays backend). Chat path: `chat.actionBar` buttons → `actions/` → `api/` → `server/capability-router.ts` → `registry.execute` → WS deltas back. Setup wizard (`moments.ts` CLI parity): `profiles → launch-visible → verify → complete` (`shared/api-types.ts`).
