# L3 — File Catalog: Surfaces (`src/server/` + `src/cli/` + `src/mcp/` + `src/api/`)

## `src/server/` — serving plane (~45 files)

**Bootstrap (6):** `index.ts` (listen + mount) · `bootstrap-engines.ts` (construct every engine
in dependency order, inject contracts) · `bootstrap-seeds.ts` (load `seeds/*` if empty) ·
`service-container.ts` (DI container: one instance per engine/store) · `module-registry.ts`
(capability → router binding) · `engines-catalog.ts` (name → constructor map).

**Cross-cutting (6):** `response.ts` (envelope `{ok,data,error}`) · `validate.ts` (zod guard
over `src/schema/*`) · `auth-gate.ts` (session/token gate) · `source-middleware.ts` ·
`middleware/*` · `errors.ts` (HTTP mapping of `src/errors.ts`).

**Realtime (2):** `websocket.ts` (general bus) · `canvas-ws.ts` (canvas mutations).

**Domain routers (~30, one per L2 cluster):** `agent-canvas-router.ts` · `automation-router.ts` ·
`autonomous-router.ts` · `canvas-router.ts` · `capability-router.ts` · `chrome-router.ts` ·
`collection-router.ts` · `conceptual-router.ts` · `conversation-router.ts` ·
`conversation-sync-router.ts` · `generative-router.ts` · `interpret-router.ts` ·
`kernel-router.ts` · `knowledge-router.ts` · `llm-harness-router.ts` · `memory-router.ts` ·
`memory-viz-router.ts` · `mutation-router.ts` · `mux-router.ts` · `nlcl-router.ts` ·
`node-router.ts` · `onboarding-boot.ts` · `plugin-builder-router.ts` · `plugin-router.ts` ·
`setup-router.ts` · `storage-router.ts` · `surface-router.ts` · `template-router.ts` ·
`variant-router.ts` · `version-router.ts` · `webhook-router.ts`.

**Grouped routes (10 in `routes/`):** `contacts.ts` · `containers.ts` · `content.ts` ·
`knowledge.ts` · `media.ts` · `notifications.ts` · `sync.ts` · `tunnel.ts` · `update.ts` · `users.ts`.
Pattern: `routes/*` = resource CRUD; `*-router.ts` = capability-oriented actions.

## `src/cli/` — operator plane (REASSESSED — full reference in `cli-complete.md`)

> First pass undercounted this zone (listed 7 files as 7 commands). Authoritative doc is now
> **`L3-file-catalog/cli-complete.md`** (4 CLIs, dual-mode dispatch, all flags/subcommands).

Core (8): `index.ts` (bin `vivim`, dual in-process/thin-client, `serve|help` hard-coded, port 9420) ·
`command-registry.ts` (longest-prefix ≤4, subsystems cap-store/backend/extension) ·
`pipeline-engine.ts` (Unix `|` pipes, `result.data` chaining) · `discovery-stack.ts` (serverless
discovery, ports 9300–9400) · `provider-harness.ts` (golden matrix, CI-gatable) · `repl.ts`
(`vivim>` NL shell → `/api/interpret`, same contract as chat box) · `output-formatter.ts`
(json/pretty/table/watch) · `json-schema.ts` (schema bridge #2 — see duplication warning).

Commands dir (7 files, 4 registered): `builtins.ts` registers `automate|moments|seed|migrate` ONLY —
`onboard-provider.ts` (`onboard <origin> --slave <id> [--dry-run]`) is DEAD (never registered;
thin-client TODO) · `registry-bridge.ts` (auto-command factory: `syncCliFromUnified`,
`fetchCliCapabilities`, `matchCapability` ≤8, `argvToInput`, `executeRemote` 30s cache) ·
`automate.ts` (10 subactions → `/api/automate/*`) · `moments.ts` (6 subcommands, same endpoints
as frontend wizard) · `seed.ts`/`migrate.ts` (`… all` → `createServerWithEngines(PORT)`).

Beyond `src/cli/`: CLI-B frontend shell (43 commands, `frontend/src/cli/commands/shell.ts` +
`storage-inspect.ts`) · CLI-C DevOps (`devops/index.ts` + router 20 aliases + 6 modules) ·
CLI-D scripts (37 files, incl. `verify-cross-surface.ts` 4-mode gate) + `package.json`
(`bin vivim`, ~60 scripts). See `cli-complete.md` §§8–10.

## `src/mcp/` — agent tool plane (11 files)

`server.ts` (stdio/HTTP MCP server) · `index.ts` (barrel) · `browser-mcp.ts`
(browser session tools) · `browser-session.ts` (session handle) · `browser-tools.ts`
(CDP-backed actions) · `discovery-tools.ts` (taxonomy/discovery queries) ·
`nlcl-tools.ts` (natural-language commands) · `types.ts` (tool I/O shapes) ·
`zod-schema.ts` (tool arg validators) · `serp-parser.ts` (search-result parsing) ·
`in-memory-heal-store.ts` (heal state without DB).

## `src/api/` — typed client (2 files)

`index.ts` (barrel: all route clients) · `setup-client.ts` (base URL + auth + retry wiring).
Mirrors `shared/api-types.ts` + `src/schema/api-types.ts`.
