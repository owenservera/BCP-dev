# PHASE 1 — As-Built Specification (OpenCode OS v0.1.0 + Windows port)

| | |
|---|---|
| **Doc** | 01 of 05 — see `00-README-INDEX.md` |
| **Purpose** | Everything needed to *rebuild, verify and stabilize* what exists today. Written from the code, not from the prior spec. |
| **Sources read** | `opencode-os-windows.zip` (base + Windows port), `opencode-os-workspace.tar` (original base, one git commit), `opencode-os-windows.patch`, `OPENCODE-OS-SPEC-1.md`, `GATES.md`, export of the "custom shell" conversation |
| **Status** | Draft 1.0 · 2026-09-29 |
| **Exit of this phase** | Baseline is verified on a real Windows machine and the P1-H stabilization set (§14) is closed |

> **Provenance warning.** The "custom shell with Windows filesystem access" conversation describes host-access work (a `host_access` setting, host Explorer backend, Windows-apps Start section, `ShellExecute` launcher). **None of it is in the delivered zip** — `grep` for `host_access`, `host_list`, `host_open`, `apps_list` returns nothing. Treat that work as *unbuilt intent*; Phase 2 specifies it from scratch. The zip is the source of truth for "what we have".

---

## 1. Product definition (as built)

A Tauri v2 desktop app that renders a Windows-style desktop (icons, taskbar, Start menu, clock, draggable/resizable windows) inside a WebView. Apps are in-page modules, not native windows. The first-class app is a floating chat wired to the **OpenCode CLI** already installed on the machine. All file operations are confined to one **workspace folder**.

**Is:** a UI shell + a thin Rust host + a process supervisor for the OpenCode CLI.
**Is not:** a Windows shell replacement, a sandbox for the agent, a multi-user system, or a launcher for real Windows apps.

## 2. System context

```
┌───────────────────────── OpenCode OS.exe (Tauri v2, one process) ─────────────────────────┐
│  WebView2 (ui/)                         │  Rust host (src-tauri/src/lib.rs)                │
│  vanilla ES modules, no build step      │  AppState{fs, server, settings, task_seq,        │
│  wm · taskbar · startmenu · desktop     │           setup_running}                          │
│  apps: explorer notepad recycle         │  20 #[tauri::command] fns  ──►  opencode-core     │
│        settings setup chat              │  events: oc://stream, oc://setup   (Tauri-free)   │
│        │  bridge.js: invoke()/events    │        fs_engine · oc_server · run_stream ·       │
└────────┼────────────────────────────────┴────────────────┬───────────────────────────────────┘
         │ IPC                                             │ spawn (CREATE_NO_WINDOW on Windows)
         ▼                                                 ▼
   (browser mode: POST /api/<cmd> to bridge-server/server.mjs)      child processes
                                                            ├─ opencode serve  (managed, 127.0.0.1:<free>, basic auth)
                                                            ├─ opencode run …  (one per chat message)
                                                            └─ powershell/sh installer (first-run wizard)
```

## 3. Repository inventory

| Path | Role | Size |
|---|---|---|
| `ui/index.html` | Shell DOM: `#os`, `#desktop`, `#icons`, `#windows`, `#chat-layer`, `#taskbar`, `#startmenu`, `#setup`, `#boot`, `#shutdown`, `#ctx-root`, `#toast-root` | 1.9 KB |
| `ui/css/desktop.css`, `apps.css` | Theme + window chrome; app styles | 17 KB / 6 KB |
| `ui/js/main.js` | Boot, app registry, `launch(key, opts)`, shutdown | 5 KB |
| `ui/js/wm.js` | Window manager | 8 KB |
| `ui/js/taskbar.js`, `startmenu.js`, `desktop.js` | Shell chrome | 2 / 1 / 3 KB |
| `ui/js/bridge.js` | Transport abstraction (Tauri IPC or HTTP) | 3 KB |
| `ui/js/lib/{path-util,dom,ctxmenu}.js` | Pure helpers (unit-tested), DOM builder `h()`, icons `S`, `toast`, context menu | 5.5 / 6 / 1 KB |
| `ui/js/apps/{explorer,notepad,recycle,settings,setup,chat}.js` | Apps | 12 / 4 / 2 / 2 / 7 / 11 KB |
| `src-tauri/src/{main,lib}.rs` | Entry (`windows_subsystem="windows"` in release) + IPC adapter | 0.2 / 18 KB |
| `src-tauri/crates/opencode-core/src/{fs_engine,oc_server,run_stream,settings,lib}.rs` | Engine (no Tauri dep) | 16 / 13 / 6.5 / 4 / 0.4 KB |
| `src-tauri/{tauri.conf.json,Cargo.toml,capabilities/default.json,icons/*}` | Packaging, workspace, capability, placeholder "OC" icons | — |
| `bridge-server/server.mjs` | Node re-implementation of the command API (dev + e2e) | 18.5 KB |
| `scripts/{fakebin/opencode,gates-verify.mjs,zen-check.mjs,gen-icons.py}` | Fake CLI, gate runner, key check, icon generator | — |
| `tests/{unit,bridge}.test.mjs`, `e2e/run.mjs` | Node tests (12 + 7), browser e2e (16 checks documented) | — |
| `.github/workflows/{ci,windows-installer}.yml` | CI | — |
| `README.md`, `GATES.md`, `WINDOWS.md`, `LICENSE` (MIT) | Docs | — |

Tar vs zip: the zip adds `WINDOWS.md`, `zen-check.mjs` (replaces `zen-check.sh`), and edits `fs_engine.rs`, `oc_server.rs`, `settings.rs`, `lib.rs`, `server.mjs`, tests, e2e, scripts, `package.json`, `README.md`. The `.patch` is that diff (22 KB).

## 4. Stack and versions

| Item | Value |
|---|---|
| Shell | Tauri **2.x** (`tauri = "2"`, `@tauri-apps/cli ^2.0.0`), `withGlobalTauri: true` |
| Rust | edition 2021, stable toolchain (`stable-msvc` on Windows); deps: `serde`, `serde_json`; dev: `tempfile`. No async runtime crate beyond Tauri's. |
| Crate layout | `opencode-os` (`lib` name `opencode_os_lib`, crate-types staticlib/cdylib/rlib) + workspace member `opencode-core`. Release: `strip`, `lto`, `codegen-units=1`. |
| Frontend | Vanilla ES modules, no bundler, no npm runtime deps |
| Node | 22+ (tests, bridge, e2e) |
| Package identity | `productName "OpenCode OS"`, `identifier com.opencodeos.desktop`, `version 0.1.0` |
| Window | label `main`, 1280×800, min 960×600, centered, resizable |
| CSP | `default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; connect-src 'self' ipc: http://ipc.localhost; font-src 'self' data:` |
| Capabilities | window `main`, permissions `["core:default"]` only |
| Bundles | NSIS (`currentUser`, English, no language selector) + MSI; WebView2 `downloadBootstrapper` |

## 5. Build, run, test

```powershell
npm ci
npm run tauri:dev     # native window, ui/ served from disk
npm run tauri:build   # src-tauri\target\release\bundle\{nsis,msi}\
npm start             # browser mode, http://127.0.0.1:8787 (bridge server)
npm test              # node --test tests/unit.test.mjs tests/bridge.test.mjs
npm run test:rust     # cargo test -p opencode-core --manifest-path src-tauri/crates/opencode-core/Cargo.toml
npm run e2e           # node e2e/run.mjs   (POSIX driver; skipped on Windows unless FORCE_E2E=1)
npm run gates:verify  # runs all three layers, prints scoreboard
npm run zen:check     # verifies OPENCODE_API_KEY against Zen
```

Windows prerequisites: Node 22 LTS, Rust (`rustup default stable-msvc`), VS 2022 Build Tools (VCTools workload), WebView2 runtime.

CI: `ci.yml` (Ubuntu: Rust core tests, `npm test`, bridge tests; container job `cargo build` of the Tauri app) and `windows-installer.yml` (`windows-latest`: core tests, `npm test`, `tauri-action` → NSIS + MSI artifacts; release on `v*` tags). Neither signs installers. Neither launches the app.

## 6. Runtime specification

### 6.1 Processes

| Process | Started by | Lifetime | Notes |
|---|---|---|---|
| Host + WebView | user | until `app_quit` / window close | one webview window `main` |
| `opencode serve --hostname 127.0.0.1 --port <free>` | `oc_start` / first `oc_sessions` / setup finish | until `oc_stop` or `ManagedServer::drop` | stdout/stderr → null; cwd = workspace; env `OPENCODE_SERVER_USERNAME=opencode`, `OPENCODE_SERVER_PASSWORD=<24 chars>`, `OPENCODE_API_KEY` if set |
| `opencode run …` | `oc_send` | one message | see §6.5 |
| Installer (`powershell -NoProfile -Command "irm https://opencode.ai/install.ps1 \| iex"`, or `sh -c "curl -fsSL https://opencode.ai/install \| bash"`) | `setup_install_opencode` | until exit | `setup_running` flag prevents concurrent runs |

Windows helpers (`oc_server.rs`): `hide_console` (`CREATE_NO_WINDOW = 0x08000000`), `resolve_bin` (probes `<bin> --version`; on failure returns `<bin>.cmd` for npm shims), `refresh_path` (re-reads User+Machine `Path` through PowerShell after the installer runs). All are no-ops off Windows.

### 6.2 Boot sequence (`main.js → boot()`)

1. `wm.init(#windows)` → 2. `taskbar.init({onStart,onChat,onOpenWindow})` → 3. `startmenu.init({apps,onLaunch,onShutdown})` → 4. `desktop.init({icons,onLaunch})` → 5. `chat.init()` → 6. wire `wm.onChange → taskbar.renderWindows` → 7. `setup.init()` → 8. next animation frame: fade `#boot` (600 ms), log `desktop ready in Nms`, dispatch `os:desktop-ready` → 9. async: `setup.maybeShow()` (wizard if `!wizard_done` or CLI/key missing) and `chat.ensureService()` (→ `oc_start`).

Target in GATES: desktop rendered ≤ 3 s. Not measured natively.

### 6.3 Transport contract (`bridge.js`)

```
bridge.invoke(cmd, args)                -> Promise<data>        // rejects Error(message)
bridge.streamInvoke(cmd, args, onMsg)   -> Promise<taskId>
onStream(cb) -> unsubscribe             // persistent subscription (chat)
```

| | Tauri | Browser |
|---|---|---|
| invoke | `window.__TAURI__.core.invoke(cmd,args)` | `POST /api/<cmd>` JSON → `{ok:true,data}` \| `{ok:false,error}` |
| stream | events `oc://stream`, `oc://setup` via `event.listen` | same POST returns `application/x-ndjson`, one `{task,ev}` per line |

**Envelope:** `{task:number, ev:{…}}`; setup events additionally carry `setup:true` and `{line, done, ok}`.

**Chat `ev` union:** `{t:"delta",text}` · `{t:"session",id}` · `{t:"error",message,stderr?}` · `{t:"done"}`.

Argument naming: JS uses camelCase (`sessionId`); Tauri maps to Rust `session_id`. The bridge server reads the camelCase form.

### 6.4 IPC command reference (20)

| Command | Args | Returns | Notes |
|---|---|---|---|
| `sys_info` | — | `{home, workspace, os, app_version, opencode_installed, opencode_version}` | `home` = `USERPROFILE` or `HOME` |
| `fs_list` | `path` | `Entry[]` `{name, kind:"dir"\|"file", size, modified(ms)}` | dirs first, then files, case-insensitive; dotfiles hidden |
| `fs_read` | `path` | `string` | UTF-8 only; no size cap |
| `fs_write` | `path, content` | `bytes written` | creates parents |
| `fs_mkdir` | `path` | `null` | single segment only; error if exists |
| `fs_rename` | `from, to` | `null` | error if target exists |
| `fs_trash` | `path` | trash item name | into `<ws>/.Trash/<ms>_<name>`; refuses workspace root |
| `trash_list` | — | `Entry[]` | name-sorted |
| `trash_delete` | `name` | `null` | rejects `/`, `\`, `..` |
| `trash_empty` | — | `count` | |
| `oc_start` | — | `ServerEndpoint {base_url, port, username, password, pid}` | idempotent; **returns the password to the renderer** |
| `oc_stop` | — | `null` | kills server |
| `oc_status` | — | `{running, base_url}` | |
| `oc_sessions` | — | JSON from `GET /session` | starts server if needed |
| `oc_send` | `sessionId?, model, text` | task id | streams on `oc://stream` |
| `settings_get` | — | `Settings` | includes plaintext `zen_api_key` |
| `settings_set` | `settings` | `null` | re-roots `FsEngine` if `workspace` changed |
| `setup_status` | — | `{opencode_installed, opencode_version, zen_key_set, wizard_done, workspace, os}` | |
| `setup_install_opencode` | — | task id | streams on `oc://setup`; error if already running |
| `app_quit` | — | never returns | `app.exit(0)` |

Errors are `String` (Rust `Display` of `FsError` or ad-hoc text). `FsError` variants: `OutsideWorkspace`, `NotFound`, `AlreadyExists`, `InvalidName`, `Io`.

### 6.5 Chat pipeline (`oc_send`)

1. Read settings; `task = task_seq.fetch_add(1)`.
2. Command: `opencode run --format json --dir <workspace> -m <model> [-s <sessionId>] <text>`; `cwd = workspace`; env `OPENCODE_API_KEY` if key non-empty; stdout/stderr piped; `CREATE_NO_WINDOW`. Binary from `resolve_bin("opencode")`.
3. **stderr drainer** thread keeps a rolling ≤ 2 KiB tail (buffer is *cleared* when it would overflow, so the tail can be shorter than expected).
4. **Watchdog** thread polls every 3 s; kills the child if no stdout line for **90 s**. (A code comment says "or older than 10 min total" — **not implemented**.)
5. **Reader** thread: each stdout line → `parse_line` → events. `Session` emitted once (first seen). `Done` sets a flag.
6. After stdout closes: `wait()`. If no `Done` was seen: re-emit session; if exit status non-success → `Error` with hint (`auth`/`401`/`Unauthorized` in stderr → "Your OpenCode Zen API key is missing or invalid. Open Settings to add one."; empty stderr → "The OpenCode CLI ended without answering (no model output)."; else "The OpenCode CLI reported an error." + `stderr`); always emit `Done`.
   *Quirk:* a watchdog kill yields a non-success status, so users see the generic message; the "took too long" text is only emitted if `wait()` itself errors (effectively unreachable).
7. UI (`chat.js`): locks send while pending; prepends the "attached folder" context (`withCtx`) when the chip is active; appends deltas via `textContent`; on `error` shows a bubble and an **Open Setup** button when the message matches `/key|auth|setup|api/i`. No cancel. Text only — tool calls and edits are not surfaced.

### 6.6 Managed server (`oc_server.rs`)

* Credentials: user `opencode`; password = 24 chars from a 54-char alphabet generated by **xorshift64 seeded from `nanos ^ (pid<<32)` — not cryptographically secure** (D-004). The bridge server uses `Math.random` (D-005).
* Port: bind `127.0.0.1:0`, read port, drop listener (small race before the server binds).
* Readiness: `GET /session` every 300 ms, 1.5 s per attempt, **20 s** total; any parseable HTTP reply counts.
* HTTP client: hand-written HTTP/1.1 over `TcpStream`, `Connection: close`, Basic auth, `read_to_end`, manual chunked decoding (`dechunk`) that slices a `&str` by byte counts (D-007).
* `stop()`: `kill()` + `wait()`; `Drop` calls it. A crash of the host leaves the child running (no Job Object) (D-008).
* `settings_set` does **not** restart the server, so a changed workspace or key is not seen by an already-running server (D-009).

### 6.7 Stream parser (`run_stream.rs`, mirrored in `path-util.js:parseOcLine`)

Input: one NDJSON line. Output: `Delta(text) | Session(id) | Error(msg) | Done`.

| Rule | Behavior |
|---|---|
| Blank / non-JSON | ignored |
| Error | `type` contains `"error"`, or top-level `error`, or `message.error` → single `Error`; **returns early** (text on the same line is dropped). Message from `error` (string) → `error.message` → JSON of `error` |
| Session id | `sessionID`; `session` if it starts `ses_`; else nested `info|part|properties|message .sessionID` |
| Text | `delta` string; else `part` (or `properties.part`) with `type` `text` or empty → `part.text`; else top-level `type:"text"` with `text` |
| Done | `type` ∈ `session.idle`, `run.completed`, `done` |

**Unverified and load-bearing (V-01):** each `part.text` is treated as an *incremental* delta. If the real CLI emits *cumulative snapshots* of a part on every `message.part.updated`, replies will be duplicated. The fake CLI encodes the same guess, so passing tests prove nothing. Fix in Phase 1 (P1-H03): record real output, key parts by `part.id`, and emit only the suffix.

### 6.8 Filesystem engine (`fs_engine.rs`)

**Invariant:** every path from the UI is workspace-relative and cannot resolve outside `workspace`.

`FsEngine::new` canonicalizes the workspace once (on Windows this yields `\\?\C:\…`; without it every `starts_with` check fails).

`resolve(rel)`:
1. `""`/`"."` → workspace.
2. Reject if `is_absolute()` or `has_root()`.
3. Allow only `Normal` and `CurDir` components; reject `ParentDir`, `RootDir`, `Prefix` — **even `a/../b` that would stay inside**.
4. Reject any component containing `\`.
5. Join, then `verify_within`: canonicalize the deepest *existing* ancestor, require `starts_with(workspace)` (blocks symlink escapes), re-append the non-existent suffix.

Operation semantics:

| Op | Rules |
|---|---|
| list | dotfiles hidden (Windows hidden/system attributes are *not* consulted); dirs first; case-insensitive name sort |
| read | file only; `read_to_string` (UTF-8) |
| write | validates final name; `create_dir_all(parent)`; overwrites |
| mkdir | `rel` must not contain `/`; name valid; must not exist |
| rename | both resolved; new name valid; source must exist; target must not exist |
| trash | source exists; not the workspace root; dest `.Trash/<unix_ms>_<name>` (`_<n>_` on collision); plain `rename` (no original-path metadata → **no restore**) |
| trash_delete/empty | remove_file / remove_dir_all under `.Trash` |
| name validity | non-empty, not `.`/`..`, no `/` `\` NUL, `trim()==name` |

Known limits: no reserved-name handling (`CON`, `NUL`, …), no trailing-dot/space handling, no NTFS alternate-data-stream handling, TOCTOU between `verify_within` and use (D-010).

### 6.9 Settings (`settings.rs`)

```json
{ "workspace": "C:\\Users\\<u>\\OpenCodeWorkspace",
  "zen_api_key": "",
  "model": "opencode/space-bunny-free",
  "wizard_done": false }
```

Path: `%APPDATA%\opencode-os\settings.json` (else `$XDG_CONFIG_HOME` or `~/.config`, then `opencode-os/`). `load()` returns defaults on a missing **or corrupt** file (a corrupt file silently erases the key and wizard state). `save()` writes non-atomically; Unix-only 0700/0600 hardening; **the key is plaintext on Windows** (D-003).

### 6.10 First-run wizard (`setup.js`)

Five progress dots: Welcome → OpenCode CLI (auto-install if missing; streams installer log) → Zen key (paste; persisted via `settings_set`) → Workspace (default `~/OpenCodeWorkspace`; folder created) → finish (`settings_set{wizard_done:true}` then `oc_start`). The wizard replays the whole `Settings` object on save. Re-run from Settings.

## 7. Frontend specification

**Window manager (`wm.js`).** State: `{container, zTop=100, seq, wins:Map, listeners}`. Window record: `{id, appKey, el, title, icon, titleEl, body, minimized, maximized, prevRect, onClose, onFocus, onResize}`. API: `init, onChange, listWindows, cascadePoint, focus, minimize, toggleMaximize, close, create, setTitle`. `create` clamps to viewport (`clampToViewport`), cascades new windows (`cascadePos`), adds 8 resize handles, drag by titlebar (pointer events), double-click titlebar maximizes, pointer-down focuses (capture phase). Focus raises `zTop`, un-minimizes, toggles `.focused`, notifies the taskbar.

**Taskbar.** Start button, "Search" box (opens Explorer — `launch()` drops the `{search:true}` option, so the filter is not focused: drift), chat indicator (online dot), running-window buttons (click = focus or minimize), clock (`fmtClock`, date).

**Start menu.** Header "Pinned", 5 app tiles, footer "User" + Shut down. No search, no all-apps, no power submenu.

**Desktop.** Five icons (Explorer, Notepad, Chat, Recycle Bin, Settings); double-click launches; context menu Open; desktop context menu: New folder / New text file / Refresh. Those two create `New folder` / `New file.txt` in the **workspace root**, but the desktop grid lists only app icons, so the toast "Created on the desktop" is misleading, and a second click fails with "already exists" (D-013).

**Explorer.** Grid view; breadcrumbs, back/forward/up (`historyPush/Back/Forward`), filter box (`applyFilter`), selection, inline rename (F2, Enter/Esc), Delete → trash, Backspace = up, Enter = open; context menus (Open / Open in Notepad / Rename / Delete; blank area: New folder / New text file / Refresh); a Recycle Bin mode (Delete permanently / Empty). Files open in Notepad via `onOpenFile`.

**Notepad.** `<textarea>`; open (`fs_read`), save (`fs_write`, Ctrl+S), Save As (prompt), title `*name — Notepad` when dirty. **No unsaved-changes prompt on close** (D-014).

**Recycle Bin app.** List, per-item permanent delete, empty. No restore.

**Settings app.** Shows app version, CLI status/version, platform, workspace, key configured?, model; "Re-run first-run setup". Values are injected with `innerHTML` (paths/versions) — should be `textContent` (D-012). No upgrade button, no CLI version gate.

**Chat.** `#chat-layer` above windows; tabs Chat / Sessions; 7 hard-coded free model ids (`opencode/space-bunny-free`, `…nemotron-3.5-lightning-free`, `…ling-3.0-flash-fin-free`, `…longcat-2.5-preview-free`, `…mimo-v2.6-flash-free`, `…nemotron-3-ultra-free`, `…big-pickle`); sessions from `oc_sessions`; "Attach current folder" chip; typing indicator; error bubbles.

**Custom DOM events:** `os:desktop-ready`, `os:open-setup`, `os:fs-changed` (`detail.path`).

## 8. Bridge server (`bridge-server/server.mjs`)

Node HTTP server on `127.0.0.1:${PORT||8787}`; serves `ui/` statically and exposes every command at `POST /api/<cmd>`; stream commands (`oc_send`, `setup_install_opencode`) return NDJSON. Env: `PORT`, `OPENCODE_OS_CONFIG_DIR`, `OCOS_NO_OPENCODE=1`, `OPENCODE_BIN`, `OPENCODE_BIN_PREFIX` (JSON array). It re-implements the FS sandbox in JS (`resolveWithin`, `listDir`) — a second implementation that must be kept in parity with Rust.

Security observations (dev tool, but it runs real `fs_write`, `settings_get` (returns the key) and `oc_send`):
* No `Origin`/`Host` validation and no `Content-Type` requirement → the same class of bug as GHSA-632h-h47v-g4x4: any web page open in the user's browser can `POST` a `text/plain` body to `127.0.0.1:8787/api/...` (CSRF), and DNS rebinding is unmitigated (D-006).
* Static-file guard uses `abs.startsWith(UI_DIR)` without a path separator (sibling-directory prefix match) (D-011).
* Password via `Math.random` (D-005).

## 9. Security posture (as built)

| Boundary | Reality |
|---|---|
| UI → host | Tauri IPC; capability `core:default`; all privileged work in Rust commands. `withGlobalTauri` exposes `__TAURI__` to every script in the page. CSP allows `'unsafe-inline'` styles. |
| UI file access | Workspace-jailed (§6.8). This is the **only** sandbox in the product. |
| **Agent** | **Not sandboxed.** `opencode run` runs as the user with OpenCode's own tools (shell, edit, web). `--dir <workspace>` sets a starting directory, not a boundary. Gate G3.4 "safe by default" covers the *UI*, not the agent. |
| Secrets | Zen key plaintext in `settings.json`, passed by env to children, returned by `settings_get` to the renderer; managed-server password returned by `oc_start`. |
| Untrusted input | Chat text goes into a **command-line argument**. On Windows the npm shim is `opencode.cmd`; passing untrusted text through batch files is the "BatBadBut" class (CVE-2024-24576; Rust std ≥ 1.77.2 escapes or errors, but verify on the pinned toolchain). Text starting with `-` may be parsed as a flag; a very long message can exceed the ~32 K Windows command-line limit (D-015). |
| Supply chain | Installer is `irm … \| iex` from a remote host; no pinning, no signature check; app installers unsigned. |
| CLI vulnerability | GHSA-632h-h47v-g4x4: OpenCode 1.14.30–1.18.21 (fixed 1.18.22) `/global/upgrade` RCE via CSRF when `serve`/`web` runs without password. This app always sets a password (mitigates), but no minimum version is enforced (D-001). |

## 10. Test specification

| Layer | Count | What it proves |
|---|---|---|
| Rust `opencode-core` | 25 (fs 11, server 5, stream 7, settings 2) | Traversal/symlink/rename/trash rules; base64, credentials, free port, CLI detection, live server spawn; parser shapes; defaults + save/load + corrupt fallback. **Green on Linux (25/25, per the porting conversation); never run on Windows.** |
| Node unit | 12 | path helpers, explorer history/filter, formatters, WM geometry, `parseOcLine` (4), fold |
| Node bridge | 7 | sys_info, FS round-trip, traversal over HTTP, streamed chat, error path, sessions via fake server, wizard status/settings |
| Browser e2e | 16 checks (documented) | Scenario A (desktop UX + chat), Scenario B (wizard). POSIX-only driver |
| CI | — | Linux tests + Tauri debug compile; Windows tests + installers |

Fake CLI (`scripts/fakebin/opencode`, run through `node`): implements `--version` (`1.0.0-mock`), `serve` (session store over HTTP + basic auth), `run --format json`. State dir `$OCOS_MOCK_DIR`.

**What no test covers:** the Tauri layer (`lib.rs`) at runtime, `oc_send` threads/watchdog, Windows-only helpers, real CLI output, installer behavior, any native window.

## 11. Gate status (GATES.md vs reality)

| Gate | Status | Note |
|---|---|---|
| G1 (10 desktop tasks) | Proven in browser e2e only | Never observed natively |
| G2.1–G2.2 | Proven against fake server | Live CLI not verified |
| G2.3 streaming | Proven with mock stream | GATES says SSE; code uses CLI NDJSON. V-01 open |
| G2.5–G2.7 | Proven with fake | |
| G3.1 installers | CI produces them | Not run on a real machine; unsigned |
| G3.4 sandbox | Proven for UI FS layer | Not for the agent |
| **G3.5 upgrade button** | **Not implemented** | Settings only displays versions |
| G3.2, G3.3, G3.6 | Wizard e2e + config only | |

Doc drift to fix: `GATES.md` mentions `zen-check.sh` (now `.mjs`), per-feature `e2e/*.spec` files (single `run.mjs`), SSE.

## 12. Defect and drift register

| ID | Sev | Finding | Fix |
|---|---|---|---|
| D-001 | High | No CLI min-version check (advisory range affects 1.18.4 seen on dev machine) | P1-H04 |
| D-002 | High | Agent unsandboxed; UI jail gives false assurance | Phase 2 (ACB), Phase 4 |
| D-003 | High | Zen key plaintext; returned to renderer | P1-H05 → Phase 4 vault |
| D-004 | High | Server password from non-CSPRNG | P1-H06 |
| D-005 | Med | Bridge password `Math.random` | P1-H06 |
| D-006 | High | Bridge CSRF / rebinding (no Origin/Host/Content-Type checks) | P1-H07 |
| D-007 | Med | `dechunk` slices `&str` by byte count → possible panic on multibyte titles | P1-H08 |
| D-008 | Med | Orphaned `opencode serve` after host crash | P1-H09 (Job Object) |
| D-009 | Med | Server not restarted after workspace/key change | P1-H10 |
| D-010 | Low | Windows path edge cases (reserved names, ADS, trailing dot) | Phase 2 |
| D-011 | Low | Bridge static guard prefix bug | P1-H07 |
| D-012 | Low | `innerHTML` in Settings | P1-H11 |
| D-013 | Low | Desktop "New folder/file" misleading + collision | P1-H11 |
| D-014 | Low | Notepad closes without prompt when dirty | P1-H11 |
| D-015 | Med | Chat text as CLI arg (`-` prefix, length, `.cmd` shim) | P1-H12 |
| D-016 | Low | Watchdog 10-min cap missing; timeout message unreachable | P1-H13 |
| D-017 | Low | Taskbar search drops `{search:true}` | P1-H11 |
| D-018 | Med | Model ids hard-coded; free-tier rotation | Phase 2 (T005) |
| D-019 | Info | Two implementations of the command API (Rust, Node) | Phase 2 contract tests |

## 13. Rebuild checklist (from an empty repo)

Each step has an acceptance test; do them in order.

1. **Workspace scaffold** — root `package.json` (scripts in §5), `src-tauri/Cargo.toml` with workspace member, `tauri.conf.json` (§4), `capabilities/default.json`. *Accept:* `cargo metadata` resolves.
2. **`opencode-core`**: `fs_engine` → `settings` → `run_stream` → `oc_server`. *Accept:* 25 tests green on Linux and Windows.
3. **Tauri layer** (`lib.rs`, `main.rs`): `AppState`, 20 commands, two event channels, `generate_handler!`. *Accept:* `cargo build` on Linux CI; `tauri dev` opens a window on Windows.
4. **UI shell**: `index.html`, CSS, `dom.js`, `wm.js`, `taskbar.js`, `startmenu.js`, `desktop.js`, `main.js`. *Accept:* boot screen fades to a desktop; windows drag/resize/min/max/close.
5. **Apps**: explorer → notepad → recycle → settings → setup → chat. *Accept:* the G1 task list, by hand.
6. **Bridge server + fake CLI**. *Accept:* `npm test` = 19/19.
7. **e2e** (`e2e/run.mjs`) scenarios A and B. *Accept:* 16/16 on Linux/WSL.
8. **CI + packaging** workflows, icons (`gen-icons.py`). *Accept:* NSIS + MSI artifacts.
9. **Docs**: README, GATES (with drift fixed), WINDOWS.

## 14. Phase 1 exit: baseline stabilization set (P1-H)

These are small, mostly independent. Do them before any Phase 2 feature work.

| ID | Task | Acceptance |
|---|---|---|
| P1-H01 | Run `npm run test:rust` and `npm test` on real Windows 10/11; fix breakage | 25 + 19 green on a clean Windows VM |
| P1-H02 | Run `tauri:dev` and the CI-built installer on a clean VM; record a 10-item manual checklist (install, first-run, chat, quit, uninstall) | Checklist signed off, screenshots in `docs/` |
| P1-H03 | Capture real `opencode run --format json` output (fixtures in `tests/fixtures/`), verify event names and delta-vs-snapshot behavior, make the parser part-id aware | Golden-file tests pass; long replies do not duplicate |
| P1-H04 | Read `opencode --version`; block/warn below **1.18.22**; add Upgrade action (`opencode upgrade`, npm fallback); show in Settings | Test with fake CLI reporting 1.18.4 |
| P1-H05 | Stop returning the key/password to the renderer: `settings_get` returns `zen_key_set` only; `oc_start` returns `{base_url,running}` | UI works; grep shows no secret in any IPC payload |
| P1-H06 | Generate credentials from the OS CSPRNG (`getrandom` / `crypto.randomBytes`) | Test asserts byte source; no `xorshift`/`Math.random` |
| P1-H07 | Bridge: bind check, require `Content-Type: application/json`, validate `Host` and `Origin`, fix static guard with `path.sep` | Bridge test: `text/plain` POST → 415; foreign Origin → 403 |
| P1-H08 | Make `dechunk` byte-based (work on `Vec<u8>`), add multibyte test | Test with emoji title |
| P1-H09 | Windows Job Object (`KILL_ON_JOB_CLOSE`) for all child processes | Kill host in Task Manager → no `opencode` left |
| P1-H10 | Restart the managed server when workspace or key changes | Bridge + Rust test |
| P1-H11 | UI fixes: `textContent` in Settings, dirty-close prompt in Notepad, taskbar search focus, honest desktop New-item behavior | Manual + unit |
| P1-H12 | Pass the prompt safely: prefer native `opencode.exe`, insert `--` before the message if supported, cap length, or send via the server API; verify escaping through the `.cmd` shim with hostile strings (`& calc`, `"`, `%PATH%`, `^`) | Hostile-string test on Windows |
| P1-H13 | Implement the 10-minute total cap and a real timeout error | Fake CLI that never finishes |
| P1-H14 | Fix doc drift (GATES.md, README) and add a Windows smoke test in CI that launches the built exe and asserts the window title | CI green |

**Phase 1 gate:** P1-H01…H14 closed, installer verified on a clean Windows VM, `gates:verify` green.

## 15. Assumptions to verify against a live CLI (carry-over)

| # | Assumption | How |
|---|---|---|
| V-01 | NDJSON shapes and delta semantics | Task P1-H03 |
| V-02 | Free model ids exist today | `opencode models` → drive the list from it (Phase 2) |
| V-03 | `OPENCODE_API_KEY` is honored (documented path may be `opencode auth login` → `auth.json`) | `zen:check` + live run without env |
| V-04 | `GET /session` exists and returns the list shape the UI expects | live server |
| V-05 | OpenCode 2.x compatibility | read migration notes; pin a tested range |
