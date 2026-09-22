# L3 — MCP + CLI Full (all tools/commands; file lists in `generated/gen-mcp.md`, `gen-cli.md`)

> Agent root: `DiscoveryMcpServer{tool/callTool/listTools/connect/close}` (`mcp/server.ts` 66 lines).
> Arg guards reuse `src/schema/*` via `mcp/zod-schema.ts`. Files: 11 (`browser-mcp`, `browser-session`, `browser-tools`, `discovery-tools` 341 lines, `in-memory-heal-store`, `index`, `nlcl-tools`, `serp-parser`, `server`, `types`, `zod-schema`).

## MCP tools (37 total on disk)
- **Discovery 27** (`discovery-tools.ts:server.tool(` ×27): `discover_start/get_session/list_sessions/delete_session/navigate/page_state/get_dom/a11y_tree/evaluate/click/type/scroll/hover/observe_start/observe_stop/observe_list/intercept/match_shape/infer_capabilities` + `detect_parser_format/generate_manifest/validate_manifest/edit_manifest/test_parser/capture_response/approve/reject`. Flow: start→navigate→DOM/a11y→match→infer→generate→validate→test→approve/reject.
- **NLCL 3** (`nlcl-tools.ts`): `nl_command {input,surface?}`, `nl_list_commands`, `nl_help` (same `NLCLEngine` as HTTP `interpret` + CLI REPL).
- **Browser 7** (`browser-tools.ts` `name:` ×7): `google_search {query,limit?,lang?}` (SERP parse via `serp-parser.ts`, navigates shared tab), `browser_open {url}`, `browser_extract {url?}` (markdown), `browser_screenshot`, `browser_list_caps`, `browser_status`, `browser_quit`. Invoked as `auto:nav:*` through governor (never raw CDP); session in `browser-session.ts`, scaffold in `browser-mcp.ts`.
- **Infra**: `types.ts` (I/O), `zod-schema.ts` (`zodToJsonSchema`), `serp-parser.ts` (`parseGoogleSerp`), `in-memory-heal-store.ts` (DB-less heal).

## CLIs (4 — see `cli-complete.md` for flags/flows)
- **Backend `vivim`** (`src/cli/commands/` 7): `automate.ts` (10 subactions 1:1 with `/api/automate/*`), `moments.ts` (setup wizard via `setup-client.ts`, `X-Source: cli`), `seed.ts`/`migrate.ts` (boot-backed), `builtins.ts`, `registry-bridge.ts` (thin-client: `fetchCliCapabilities`, 30s cache, `argvToInput`), `onboard-provider.ts` (dead: never registered — matches `service-container.ts` gap note). Files: `generated/gen-cli.md`.
- **Frontend shell** (43 cmds, `frontend/src/cli/commands/shell.ts` 746 lines + `storage-inspect.ts`): `admin db`, `list`, `resolve`, `run`, `go/theme/canvas/zoom/node/stream/connect/drawer/zlayer/search/notifications/onboarding/component/ui`, `help`.
- **DevOps** (`bun run devops`, 20 aliases): `gate|select|mark|run|report|gc|fmt|toolkit|profiles`, `audit-code|audit-arch|invariants|deep-scan|sota`, `truth|goals|decision|features|roadmap|research`, `desktop-loop|desktop`, `onboard|discover-cdp|discover-protocol|protocol-promote`.
- **Scripts** (69): `dev/stop`, `provider-harness`, `verify-cross-surface` (parity gate), `db-doctor/backup/restore/seed-snapshot`, `taxonomy-gen/`, `openapi/manual-gen`, `setup-slaves/ensure-accounts`, `debug/test-parser*`, `ci`, `runtime-test` + subdirs (`taxonomy-gen/`, `db-reports/`, `tauri/`, `devops/`, `_archive/`).
