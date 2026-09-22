# L3 — File Catalog: CLI Complete Reference (reassessed — the first pass missed most of this)

> Reassessment scope: all 15 files under `src/cli/` (8 core + 7 commands), both files
> under `frontend/src/cli/`, all 6 `devops/commands/*` modules + router, 37 `scripts/*`
> entries, and the `bin` + `scripts` map in `package.json`. Every claim below names its file.

## 0. There are FOUR CLIs, not one

| CLI | Entry | Files | Talks to | Mode |
|-----|-------|-------|----------|------|
| **A. Backend CLI** (`vivim`) | `bin: vivim → src/cli/index.ts` + `bun run src/cli/index.ts …` | `src/cli/` 15 files | in-process engines OR thin-client HTTP to a running server | dual-mode (see §1) |
| **B. Frontend shell** (canvas `cap:canvas:shell-command`) | in-canvas prompt + `frontend/src/cli/commands/shell.ts` | 43 commands via `ShellCommandStore` | same `UnifiedCapabilityRegistry` via `/api/capabilities/:id/execute` | in-browser, FRONTEND=BACKEND invariant |
| **C. DevOps CLI** | `bun run devops <cmd>` → `devops/index.ts` → `devops/router/index.ts` | 6 modules, 20+ aliases | repo itself (gates, audits, roadmaps, onboarding) | repo-ops, `--tracker/--atomic-dir` satellites |
| **D. Scripts** (one-shot ops) | `bun run scripts/*.ts` + `package.json` scripts (~60) | 37 files in `scripts/` | DB, providers, taxonomy, CI | direct, often gate CI |

The old atlas described only CLI-A's 7 command filenames. Everything below is what was missing.

## 1. CLI-A dispatch (`src/cli/index.ts`, 182 lines — dual-mode)

```
argv → parseArgs() ──tokens[] + flags{}──┬── 'serve' → createServerWithEngines(port) [--port]
                                          ├── 'help'|∅ → showHelp() [groups by subsystem; thin-client fallback]
                                          ├── Phase 1: registry.resolve(tokens) [in-process, longest-prefix ≤4]
                                          │     → handler({args, flags}) → OutputMode --json pretty|table|watch
                                          └── Phase 2: fetchCliCapabilities(serverUrl)/matchCapability [thin-client, ≤8 tokens]
                                                → executeRemote(cap.id) → POST /api/capabilities/:id/execute
                                                → else exit(1). Remote failures propagate (never masked as Unknown).
```

- `parseArgs`: `--key=value` AND `--key value` forms; bare `--key` → `''`. Non-`--` tokens are positional.
- `serverUrl()`: `http://localhost:{config.port}` (default port **9420**; `PORT` env overrides in seed/migrate).
- `connectCapabilityRegistry(reg)`: called by server bootstrap — runs `syncCliFromUnified` THEN `registerBuiltinCommands`. So bridged capability commands and builtins coexist in one `CommandRegistry`.
- `showHelp()`: groups by `cmd.subsystem`; if registry empty, tries thin-client fetch and lists remote `cliCommand.name + [aliases]`.
- `import.meta.main` guard: file is both importable (server boot imports `connectCapabilityRegistry`, `registry`, `getCapabilityRegistry`) and executable.
- `getCapabilityRegistry()` throws unless connected — callers must boot or thin-client first.

## 2. Registry (`src/cli/command-registry.ts`, 50 lines)

```ts
CliCommand { name, description, subsystem: 'cap-store'|'backend'|'extension',
             schema: ZodSchema, handler: (args)=>Promise<CliOutput{data, format?}>, examples[] }
resolve(tokens): longest registered space-joined prefix, depth min(tokens,4) → {command, consumed}
```

Multi-word names are first-class (`kernel oracle query` = 3 tokens, `consumed=3`, rest are args).
`syncCliFromUnified` registers capability names the same way, so `automate`, `moments`, and
`kernel oracle query` all resolve through the identical path. Category→subsystem map
(`registry-bridge.ts` §6): conversation→cap-store; admin/system/user→backend; canvas/discovery→extension; else cap-store.

## 3. Builtins (`src/cli/commands/builtins.ts` — registers FOUR, not seven)

| name | subsystem | description | examples | runs |
|------|-----------|-------------|----------|------|
| `automate` | extension | Agent-driven frontend automation | `automate navigate URL`, `automate click "sel"`, `automate screenshot` | `runAutomate(args)` → `/api/automate/*` |
| `moments` | backend | User-journey moments (account setup) | `moments list`, `moments launch chatgpt slug`, `moments health` | `runMoments(args)` → setup-client (same endpoints as frontend wizard) |
| `seed` | backend | Seed DB | `seed all` | `runSeed` → `createServerWithEngines(PORT)` (boot seeds) |
| `migrate` | backend | Run migrations | `migrate all` | `runMigrate` → `createServerWithEngines(PORT)` (boot migrates) |

**Wiring gap (new finding):** `src/cli/commands/onboard-provider.ts` exports
`registerOnboardCommand` (`onboard <origin> --slave <id> [--dry-run]`, Zod `args[2]`, resolves
`onboardingOrchestrator` from `serviceContainer`, thin-client explicitly TODO/unsupported) —
but `builtins.ts` never calls it and `index.ts` never imports it. So `onboard` is **dead code**
until wired, exactly matching the `service-container.ts` header comment about the orchestrator
being "never wired into any surface". Also note: `serve` and `help` are hard-coded in `main()`,
not registry commands. The "7 commands" in the old atlas conflated the 7 files in
`commands/` (which include `registry-bridge.ts` + `onboard-provider.ts`, neither self-registers)
with the 4 actually registered builtins.

## 4. `automate` — 10 subactions (`commands/automate.ts`, 157 lines, `X-Source: cli`, 10s timeout)

`navigate <url=localhost:5173>` → POST `/api/automate/navigate` · `click <sel>` → POST `…/click {selector:{selector}}` ·
`type <sel> <text>` → POST `…/type` · `text <sel>` → GET `…/text?selector=` · `value <sel>` → GET `…/value` ·
`exists <sel>` → GET `…/exists` (prints yes/no) · `screenshot` → POST `…/screenshot`, writes `screenshot-{Date.now()}.png` from base64 ·
`page` → GET `…/page` (title/url/content) · `reset` → POST `…/reset` · unknown → help text.
Missing-arg usage errors `process.exit(1)`; any API non-OK throws `API error {status}`. Directly executable
(`import.meta.main` → `runAutomate(process.argv.slice(2))`).

## 5. `moments` — 6 subcommands (`commands/moments.ts`, 176 lines, via `createSetupClient({source:'cli'})`)

`list` (profiles with provider icons) · `launch <providerId> <accountSlug>` (launchVisible → prints
port/profileDir/loginUrl + next verify command; workspace default `C:\.config\vivim`) ·
`verify <port> <providerId>` (prints method/url, returns bool) · `complete <providerId> <slug> <profileDir> <debugPort>` ·
`health` (status/version) · `setup <providerId> <slug>` (interactive 1/3 launch → press-Enter → verify → complete).
Default subcommand is `list`. Same API endpoints as the frontend wizard; `X-Source` header tracks surface in audit logs.

## 6. Registry bridge (`commands/registry-bridge.ts`, 273 lines — the auto-command factory)

- `jsonSchemaToZod`: string→z.string, number/integer→z.number, boolean→z.boolean, array→z.array(typed items or string), object→z.record; non-required → `.optional()`.
- `syncCliFromUnified(reg, registry)`: every `surface:'cli'` capability with `cliCommand` becomes a `CliCommand` (name + aliases, alias collisions skipped + counted). Handler maps `{args, flags}` → `argvToInput` → `reg.execute(cap.id, input)`.
- `fetchCliCapabilities(remote)`: GET `{remote}/api/capabilities?surface=cli` (array or `{capabilities}` envelope).
- `matchCapability(caps, tokens)`: longest-prefix to depth 8 by name-or-alias, then head-alias fallback → `{cap, rest}`.
- `argvToInput(args, flags, schema)`: flags fill matching props first (with `coerce`), then positionals fill required-then-remaining in declared order. `coerce`: number/integer→Number (NaN-safe), boolean→only `'true'/'1'` true, object/array starting `{`→JSON.parse attempt.
- `stripMeta`: removes `json, remote, auth, help, version, verbose, quiet` before input mapping.
- `executeRemote(remote, capId, args, flags)`: 30s capability-list cache (`REMOTE_CAPS_TTL`), `--json-input` full-payload override (falls back to argv mapping on parse failure), POST `{remote}/api/capabilities/{id}/execute {input}` with `X-Source: cli`, 30s timeout, non-OK → `remote execute failed (status)`.

## 7. Pipelines, REPL, discovery, harness, formatting, schema (`src/cli/` core ×6)

- **`pipeline-engine.ts` (45 lines):** Unix pipes for CLI — `parsePipeline("a x | b y")` → `[{command,args}]`; `execute` threads `result.data` as next step's `input` (`handler({args, input})`). Unknown step throws.
- **`repl.ts` (108 lines, Units 24.8/25.8/29.2):** `vivim>` NL shell — identical `/api/interpret` requests as the frontend chat box (CLI half of the contract). `ReplOptions{remote, auth?}` (Bearer header); `ReplContext{activeSessionId, activeProviderId, activeConversationId}` sent per line; handles `clarification.prompt` (`? …`) and `requiresConfirmation`; quits on `exit|quit|:q`; `formatResult` unwraps `{output}`.
- **`discovery-stack.ts` (146 lines, Phase 23.5):** serverless discovery — `buildLocalDiscoveryStack({profileBaseDir='chrome-profiles', portRange=[9300,9400]})` wires governor (autoRestart false, circuit 5/60s) + native `CdpTransportImpl` + discovery/parser/align/sandbox stores directly from `getDb()`. Powers the `discovery` flow with no running server.
- **`provider-harness.ts` (131 lines, Unit 32.1):** golden matrix over `PROVIDER_MANIFESTS` (`seeds/providers/manifests.ts`, zero FS reads): per provider `manifest-parse → register → definition-present` (+ endpoints/capabilities; `system` meta-provider exempt) → `HarnessReport{total,passed,failed,rows}` + `formatHarnessMatrix`. Non-zero exit on regression — CI-gatable.
- **`output-formatter.ts` (45 lines):** `OutputMode json|pretty|table|watch` — json pretty-prints, pretty recurses arrays, table builds `header|sep|rows` from first-row keys (`No data` on empty), watch = json.
- **`json-schema.ts` (95 lines, Unit 24.8):** the OTHER schema bridge (for HTTP-introspected capabilities): `jsonSchemaToZod` (string+enum→z.enum, number, boolean, array→z.array(unknown), else unknown) + `argvToInput(jsonSchema, args, flags)` (positionals→required in order, flags→by-name, number/boolean coercion). Note the duplication with `registry-bridge.argvToInput` — two mappers, same job, different callers (in-process vs thin-shell); unify with care.

## 8. CLI-B: frontend shell — 43 commands (`frontend/src/cli/commands/shell.ts`, 746 lines)

Registered via `registerDefaultCommands(store: ShellCommandStore)` as `{path[], capabilityId, description, handler}`; dispatched through the SAME longest-prefix resolution as CLI-A; production swaps stubs for `POST /api/capabilities/:id/execute` (FRONTEND=BACKEND two-way, invariant 5). Stub `admin db status` prints the canonical row-count fixture (provider_type 5, primitive 13, ui_component 22, provider_definition 16, workspace 3, document 4, media 2, automation 100, agent 3, trace_entry 248, 4.2 MB, integrity ok).

```
admin db status | admin db migrate | admin db reset | admin invariants check
list conversations | list providers | list workspaces | list automations | list agents | list components
resolve canvas | open document | open video | open audio | publish component | patch component
run automation | invoke agent | help | go | theme accent | theme | canvas layout | canvas zoom
node | agent canvas | stream | connect | drawer toggle | drawer panel | zlayer | search
notifications | onboarding | component | ui list | ui get | ui set | ui extend | ui blueprint | ui apply | ui delete
```

Plus `frontend/src/cli/commands/storage-inspect.ts` (`bun run storage:inspect`): probes every store via `probeStorage`/`getStorageProvider`, prints `name|impl|ready|count|error` sorted (not-ready first), exits 1 unless all ready.

## 9. CLI-C: DevOps (`devops/index.ts` 35 lines + `devops/router/index.ts` + 6 modules)

`bun run devops [--tracker <path>] [--atomic-dir <path>] <cmd>`: `gate|select|mark|run|report|gc|fmt|toolkit|profiles` → `commands/gate.ts` (quality gates, unit selection, closure loops); `audit-code|audit-arch|invariants|deep-scan|sota` → `commands/audit.ts`; `truth` → `truth.ts`; `goals|decision|features|roadmap|research` → `strategy.ts`; `desktop-loop|desktop` → `desktop.ts`; `onboard|discover-cdp|discover-protocol|protocol-promote` → `onboard.ts`. Unknown → exit 1 with alias list. (`devops/commands/` dir listing earlier appeared empty over tooling — `read` shows 6 files: audit, desktop, gate, onboard, strategy, truth.)

## 10. CLI-D: scripts + package.json entry points (37 + ~60)

- `scripts/` (37 entries): `dev.ts`/`stop.ts` (lifecycle), `provider-harness.ts` (`providers:smoke` gate), `verify-cross-surface.ts` (Unit 19.4 FRONTEND=BACKEND gate — `--offline|--live|--runtime|--runtime-registry`, non-zero blocks PR), `verify-moment.ts`, `db-doctor.ts`/`backup-db.ts`/`restore-db.ts`/`seed-snapshot.ts`, `taxonomy-gen/` pipeline (`taxonomy:generate|taxonomy-gen|taxonomy:openclaw`), `openapi-gen.ts`/`manual-gen.ts`, `generate-skills.ts`, `split-schema.ts`, `setup-slaves.ts`, `ensure-accounts.ts`, `debug-parser.ts`/`test-parser.ts`/`test-claude-parser.ts`, `runtime-test.ts`, `gen-baseline.ts`, `ctx-tag-pass.ts`, `backfill-taxonomy.ts`, `run-code-audit.ts`, `gen-test-scaffold.ts`, `ci.ts` (`ci|ci:fix`), plus `devops/`, `tauri/`, `db-reports/`, `_archive/`, ps1 helpers.
- `package.json` CLI-relevant scripts: `bin vivim`; `dev` (scripts/dev.ts), `dev:backend`/`serve` (`src/cli/index.ts serve`), `migrate` (`… migrate --source all`), `seed` + `prisma.seed` (`… seed all`), `devops`/`devops:toolkit`, `providers:smoke`, `taxonomy:*`, `db:*`, `prisma:*` (dev/prod/generate/studio/push/baseline × system/user), `bench`, `docs:*`, `generate-skills`, `gen:protocol`, `web:*`/`frontend:*`/`tauri:*`, `seed:snapshot`, `ci*`, `coverage`, `test*` (unit/integration/e2e/arch/fast), `lint`/`format`/`typecheck`.

## 11. What the first pass got wrong (corrections)

1. "7 CLI commands" → actually **4 registered builtins** (`automate, moments, seed, migrate`) + N bridged capability commands (dynamic, from `surface:'cli'`) + hard-coded `serve|help` + **dead `onboard`** (never registered) + 43 frontend shell commands + 20 DevOps aliases + 37 scripts.
2. `onboard-provider.ts` + `registry-bridge.ts` are infrastructure, not commands — the old atlas counted files as commands.
3. `serve`/`help` bypass the registry entirely (early-return in `main()`); pipelines/REPL/discovery/harness are parallel execution modes, not subcommands.
4. Two `argvToInput`/`jsonSchemaToZod` implementations exist (`registry-bridge.ts` vs `json-schema.ts`) — documented separately in §6–§7 with callers and merge warning.
