# OpenCode OS — Technical Specification

| | |
|---|---|
| **Status** | Draft v0.1 |
| **Date** | 2026-09-29 |
| **Product version covered** | opencode-os 0.1.0 (Tauri v2) |
| **Owner** | Owen |
| **Scope** | Current architecture, development stage, OpenCode dependency, target architecture, 100-task roadmap |

---

## 1. Vision

Replace the author's primary Windows installation with a **fully AI-native operating system**: a desktop where an AI agent is a first-class citizen of the OS (it can see, operate and modify the system under explicit permissions), not an app running on top of it.

**Strategy in two stages** (a from-scratch kernel is explicitly out of scope):

1. **Stage A — Shell on Windows.** OpenCode OS replaces `explorer.exe` as the user's shell. Windows keeps supplying kernel, drivers and app compatibility. Goal: daily-drivable after Phase 4.
2. **Stage B — Own Linux base.** Only if Stage A succeeds: boot a minimal Linux image straight into the same shell (Wayland kiosk compositor), with Wine/Proton and a VM fallback for Windows apps. Decision gate at task T081.

**Non-goals (for now):** custom kernel, custom drivers, mobile, multi-user server use.

---

## 2. Current state (v0.1.0)

### 2.1 What it is

A Tauri v2 desktop app that boots into a Windows-style desktop: icons, taskbar, Start menu, clock, and a real window manager. Its first-class app is a **floating, always-on-top chat** wired to the **OpenCode CLI** installed on the machine (free models through OpenCode Zen). About 5,500 lines in one repo; single commit; all files dated 2026-09-28.

### 2.2 Components

| Layer | Path | Role |
|---|---|---|
| Frontend | `ui/` | Vanilla ES modules, no build step. `wm.js` (windows), `taskbar.js`, `desktop.js`, `startmenu.js`, `bridge.js` (transport) |
| Apps | `ui/js/apps/` | `explorer`, `notepad`, `recycle`, `settings`, `setup` (first-run wizard), `chat` |
| Core engine | `src-tauri/crates/opencode-core/` | Tauri-free Rust crate: `fs_engine` (sandboxed FS), `oc_server` (server lifecycle + tiny HTTP client), `run_stream` (NDJSON parser), `settings` |
| Tauri layer | `src-tauri/src/lib.rs` | Thin IPC adapter over the core; streams events to the webview |
| Bridge server | `bridge-server/server.mjs` | Node re-implementation of the same command API so the UI runs in a plain browser (dev + e2e) |
| Test support | `scripts/fakebin/opencode`, `e2e/run.mjs`, `tests/` | Deterministic fake CLI, headless-browser e2e, unit + bridge tests |
| CI | `.github/workflows/` | `ci.yml` (Rust + Node tests, Linux build check), `windows-installer.yml` (NSIS + MSI) |

### 2.3 Transport (`ui/js/bridge.js`)

The UI calls one `invoke(cmd, args)` API. In Tauri it maps to IPC; in a browser it maps to `POST /api/<cmd>` on the bridge server. Streaming uses Tauri events (`oc://stream`, `oc://setup`) or the equivalent stream in browser mode.

### 2.4 IPC command surface

| Group | Commands |
|---|---|
| System | `sys_info`, `app_quit` |
| Filesystem (workspace-sandboxed) | `fs_list`, `fs_read`, `fs_write`, `fs_mkdir`, `fs_rename`, `fs_trash`, `trash_list`, `trash_delete`, `trash_empty` |
| OpenCode | `oc_start`, `oc_stop`, `oc_status`, `oc_sessions`, `oc_send` |
| Settings / setup | `settings_get`, `settings_set`, `setup_status`, `setup_install_opencode` |

### 2.5 Chat data flow

1. `oc_send` spawns `opencode run --format json --dir <workspace> -m <model> [-s <session>] "<text>"` (one process per message).
2. A reader thread parses stdout NDJSON with `run_stream::parse_line` into `Delta | Session | Error | Done` events and emits them on `oc://stream`.
3. A stderr drainer keeps the last ~2 KiB for error hints (auth/401 detection → "open Settings" message).
4. A watchdog kills the process after **90 s without output** (a code comment mentions a 10-minute total cap; only the idle limit is implemented).
5. A managed `opencode serve --hostname 127.0.0.1 --port <free>` is started with generated basic-auth credentials and is used for the session list (`GET /session`).

### 2.6 Filesystem sandbox

All UI paths are workspace-relative. `FsEngine::resolve` rejects absolute paths, `..`, drive prefixes, backslash components and NUL, then canonicalises the deepest existing ancestor to block symlink escapes. Deleting moves items into `<workspace>/.Trash`. Dotfiles are hidden in Explorer. Files are treated as UTF-8 text only.

### 2.7 Persistence

| Item | Location |
|---|---|
| Settings + Zen API key (JSON: `workspace`, `zen_api_key`, `model`, `wizard_done`) | `%APPDATA%\opencode-os\settings.json` (Linux: `$XDG_CONFIG_HOME` or `~/.config`) |
| Default workspace | `%USERPROFILE%\OpenCodeWorkspace` |
| Trash | `<workspace>\.Trash` |
| Default model | `opencode/space-bunny-free` |

The API key is stored in **plaintext**; the 0600/0700 permission hardening only runs on Unix.

### 2.8 Packaging

Tauri bundles NSIS (per-user, WebView2 bootstrapper) and MSI. CSP: `default-src 'self'` with `ipc:` connect. Capabilities: `core:default` only. Icons are a generated placeholder "OC" monogram.

---

## 3. Development stage

**Classification: early prototype (v0.1.0).**

| Area | Status |
|---|---|
| Architecture | Clean; core is Tauri-free and testable |
| Rust core | 25 unit tests (fs 11, server 5, stream 7, settings 2). Not executed during the Windows port work (no `cargo` in that environment) |
| Frontend + bridge | 19 Node tests passing |
| Browser e2e | 16 checks (`e2e/run.mjs`); POSIX-only driver |
| Tauri shell | Never observed running natively by the author's documentation; CI compiles it |
| Windows | Installer produced by CI; not yet validated on a real machine |
| Releases | None; unsigned |

**Known gaps and doc drift**
- `GATES.md` still references `zen-check.sh` (replaced by `zen-check.mjs`), per-feature e2e specs that are really one `run.mjs`, and SSE streaming (the code uses NDJSON from the CLI).
- Gate G3.5 promises an upgrade button; Settings only displays versions.
- No CLI version awareness or minimum-version enforcement.
- Model IDs are hardcoded.
- Chat is text-only: tool calls and file edits from the agent are not surfaced.
- File layer is text-only; no binary/image preview.

---

## 4. Windows port (delivered)

Delivered as `opencode-os-windows.zip` / `.patch` plus `WINDOWS.md`.

| Change | Reason |
|---|---|
| Canonicalise workspace in `FsEngine::new` | Windows `canonicalize()` returns `\\?\C:\…`; the `starts_with` sandbox check would otherwise reject every operation |
| `hide_console`, `resolve_bin`, `refresh_path` in `oc_server.rs` | No console flash from the GUI-subsystem app; find `opencode.cmd` npm shims; reload PATH after the installer runs |
| Bridge: `%APPDATA%` config dir, `OPENCODE_BIN` / `OPENCODE_BIN_PREFIX`, `windowsHide` | Portable config and CLI launching |
| `zen-check.sh` → `scripts/zen-check.mjs`; `gen:icons` → `python scripts/gen-icons.py` | Cross-platform scripts |
| Tests run fake CLI through `node`; explicit test file list in `npm test` | No shebang / `:`-PATH dependence; `node --test tests` fails on Node 22 |
| Unix-only symlink test gated with `#[cfg(unix)]`; settings test sets `APPDATA` | Test hygiene on Windows |
| e2e layer skipped on native Windows unless `FORCE_E2E=1` | Driver uses POSIX quoting; run in WSL or CI |

Verification: Node tests 19/19. Rust changes use standard APIs but were not compiled in the porting environment — run `npm run test:rust` on Windows first.

---

## 5. OpenCode dependency

### 5.1 Coupling

The app does not bundle or pin OpenCode; it runs whatever `opencode` is on PATH. The setup wizard installs the current release using the official installer.

**CLI surface relied on** (all present in the current CLI docs as of 2026-09-28):

- `opencode run` with `--format json`, `-m`, `-s`, `--dir`
- `opencode serve` with `--hostname`, `--port`
- Basic auth via `OPENCODE_SERVER_USERNAME` / `OPENCODE_SERVER_PASSWORD`

### 5.2 Versions

- npm `opencode-ai` latest observed: **1.18.33**.
- A v2 generation is announced (docs banner; a `2.0.18` channel on the update API). Migration guidance was not reviewed.

### 5.3 Unverified assumptions (verify against a live CLI)

1. NDJSON event names (`message.updated`, `message.part.updated`, `session.idle`, `session.error`) — the fake CLI encodes the same guess, so passing tests do not prove them.
2. Hardcoded free model IDs (`opencode/space-bunny-free`, `opencode/nemotron-3-ultra-free`).
3. `OPENCODE_API_KEY` as the Zen key variable (not listed in the CLI env-var table; documented route is `opencode auth login` → `auth.json`).
4. `GET /session` on the server.

### 5.4 Security advisory — GHSA-632h-h47v-g4x4

Source: Datadog Security Labs, published 2026-09-24.

- **Affected:** OpenCode 1.14.30 through 1.18.21 inclusive. **Fixed in 1.18.22** (2026-08-24).
- **Flaw:** the `POST /global/upgrade` endpoint of `opencode serve` accepted an arbitrary npm package spec as its target and parsed JSON without checking `Content-Type`. A malicious webpage could submit a `text/plain` form via top-level navigation to `127.0.0.1:4096` and run an attacker's `preinstall` script.
- **Exploit conditions (all required):** version in range; `serve`/`web` running without password auth (or with recently cached browser credentials); CLI installed via npm, pnpm or Bun.
- **Reported dev-machine CLI:** 1.18.4 — inside the affected range. Action: `opencode upgrade` or `npm i -g opencode-ai@latest`, then confirm with `opencode --version`.
- **Exposure of this app:** the managed server always runs with a generated password on a random port, which likely breaks the password condition. Not tested. Independently run `opencode serve`/`web` without `OPENCODE_SERVER_PASSWORD` remains a risk.

**Requirements derived**
- R-SEC-1: enforce a minimum CLI version (≥ 1.18.22) with a warning and an Upgrade action.
- R-SEC-2: never start a server without a password.
- R-SEC-3: track the CLI's security advisories as part of release checks.

---

## 6. Target architecture

### 6.1 Principles

1. **Agent as a system principal**, always under explicit, revocable capabilities.
2. **Every agent action is visible, auditable and undoable.**
3. **Local-first**: works offline with local models; nothing leaves the machine without a logged reason.
4. **Untrusted input is tagged**: web pages, files and emails are data, never instructions.
5. **Escape hatches always exist** (recovery to Explorer / Windows; recovery mode on Linux).

### 6.2 Stage A — Shell on Windows

```
┌───────────────────────── OpenCode OS shell (Tauri) ─────────────────────────┐
│ Desktop · Taskbar · Start · Command bar · Notifications · Tray · Lock       │
├──────────────────────────────────────────────────────────────────────────────┤
│ Agent runtime: OpenCode CLI/server ─ permission broker ─ audit log ─ undo   │
│ OS tool server (MCP): windows, apps, files, clipboard, screen, settings      │
├──────────────────────────────────────────────────────────────────────────────┤
│ Native app host: Win32/UWP launch + window tracking · WebView2 apps          │
├──────────────────────────────────────────────────────────────────────────────┤
│ Windows kernel, drivers, filesystem (unchanged)                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

Key mechanisms: alternate shell via the Winlogon `Shell` value (with a recovery hotkey back to `explorer.exe`), foreign-window tracking for the taskbar, agent sandboxing with Job Objects / AppContainer, and a permission broker in front of every tool call.

### 6.3 Stage B — Own Linux base

Minimal Linux image (Buildroot, NixOS or minimal Ubuntu) → Wayland kiosk compositor (wlroots/cage) → the same shell via WebKitGTK. Wine/Proton for Windows apps, KVM Windows VM as fallback, A/B updates and recovery mode. Requires the hardware and app-compatibility decision at T081.

### 6.4 Threat model (summary)

| Threat | Mitigation (task) |
|---|---|
| Prompt injection via web/file/email content | Untrusted-content tagging, permission prompts (T031, T071) |
| Agent exceeding intended scope | Capability model, per-agent sandbox (T009, T046, T067) |
| Destructive agent action | Snapshots + undo, audit log (T047, T048) |
| Secret leakage | Credential Manager, vault, egress log (T006, T068, T072) |
| Vulnerable CLI version | Minimum-version enforcement (T004) |
| Shell lock-out | Recovery hotkey, VM-first testing (T013, T014) |
| Supply chain (installer, updates) | Code signing, signed updates with rollback (T007, T075) |

---

## 7. Roadmap — 100 atomic tasks

Each task is one deliverable. IDs are stable; check them off in your tracker.

### Phase 0 — Foundation (T001–T010)
Exit criteria: app runs and passes CI on Windows; CLI integration verified against a live CLI; keys stored securely.

- [ ] T001 Run `test:rust` and `tauri:dev` natively on Windows; fix what breaks
- [ ] T002 Add a Windows CI smoke test that launches the app and checks it boots
- [ ] T003 Verify the stream-event parser against live `opencode run --format json`
- [ ] T004 Add a minimum CLI version check (≥ 1.18.22) with an upgrade button
- [ ] T005 Load the model list from `opencode models` instead of hardcoding
- [ ] T006 Store API keys in Windows Credential Manager
- [ ] T007 Code-sign the installers
- [ ] T008 Write logs and crash reports to a local file
- [ ] T009 Document what the agent may touch (permission model)
- [ ] T010 Replace the placeholder icon; set the final app identity

### Phase 1 — Real Windows shell (T011–T028)
Exit criteria: can log in, start apps, switch windows, sleep/shutdown entirely from the shell, with a proven way back.

- [ ] T011 Borderless full-screen shell mode
- [ ] T012 Multi-monitor support
- [ ] T013 Register as the alternate Windows shell (Winlogon), with a safe fallback
- [ ] T014 Recovery hotkey that boots back to `explorer.exe`
- [ ] T015 Launch native `.exe` and UWP apps from the Start menu
- [ ] T016 Index installed apps from the registry and Start Menu
- [ ] T017 Track foreign app windows so the taskbar lists them
- [ ] T018 Global hotkeys and an Alt-Tab switcher
- [ ] T019 Host system-tray icons
- [ ] T020 Notification center
- [ ] T021 Volume, brightness, battery and network widgets
- [ ] T022 Wi-Fi and Bluetooth quick settings
- [ ] T023 Lock screen and login integration
- [ ] T024 Wire sleep, restart and shutdown to the OS APIs
- [ ] T025 Access beyond the workspace, with permission prompts
- [ ] T026 "Open with" and default file handlers
- [ ] T027 Drag-and-drop between apps
- [ ] T028 Clipboard manager

### Phase 2 — Agent-native core (T029–T048)
Exit criteria: the agent can operate the desktop through a permission broker; every action is visible, cancellable, logged and reversible.

- [ ] T029 Show tool calls and file edits in the chat UI
- [ ] T030 Render replies token by token
- [ ] T031 Approve / deny / always prompts for agent actions
- [ ] T032 Cancel button for running agents
- [ ] T033 Per-permission `--auto` policy setting
- [ ] T034 Reuse the managed server with `run --attach`
- [ ] T035 Session rename, delete, fork and resume
- [ ] T036 Structured agent commands to open apps and windows
- [ ] T037 Agent tool to read the window list and focused app
- [ ] T038 Expose desktop actions as an OS-level MCP tool server
- [ ] T039 Filesystem watcher so agent edits appear live in Explorer
- [ ] T040 Global command bar (Ctrl+Space) for natural-language actions
- [ ] T041 Voice input
- [ ] T042 Voice output
- [ ] T043 Local persistent user-memory store
- [ ] T044 Local semantic search index over files
- [ ] T045 Scheduled and background agents
- [ ] T046 Named agents with separate roles and permissions
- [ ] T047 Snapshot before agent actions so they can be undone
- [ ] T048 Action audit-log viewer

### Phase 3 — Daily-driver apps (T049–T066)
Exit criteria: the author's routine tasks (code, browse, mail, docs, media, print) can be done without Explorer or other shells.

- [ ] T049 Terminal app (ConPTY)
- [ ] T050 Browser app (WebView2 tabs)
- [ ] T051 Let the agent read and act on pages, with consent
- [ ] T052 Code editor (Monaco) with inline agent
- [ ] T053 Image viewer and media player
- [ ] T054 PDF viewer
- [ ] T055 Document viewer and editor (Markdown, docx)
- [ ] T056 Email client with agent triage
- [ ] T057 Calendar
- [ ] T058 Contacts
- [ ] T059 AI notes app replacing Notepad
- [ ] T060 Real Settings: display, sound, network, power, accounts
- [ ] T061 Task manager and process monitor
- [ ] T062 App installer UI backed by `winget`
- [ ] T063 Screenshots and screen recording
- [ ] T064 Calculator, clock and small utilities
- [ ] T065 Printing
- [ ] T066 Cloud sync for files and settings

### Phase 4 — Platform, security, privacy (T067–T080)
Exit criteria: safe to give the agent whole-machine access; **the system is daily-drivable on Windows.**

- [ ] T067 Sandbox each agent (Job Objects or AppContainer)
- [ ] T068 Secrets vault
- [ ] T069 Local models (Ollama or llama.cpp) for offline use
- [ ] T070 Provider routing beyond Zen
- [ ] T071 Tag untrusted web and file content to defend against prompt injection
- [ ] T072 Data-egress controls and a log of what leaves the machine
- [ ] T073 Disk and workspace encryption integration
- [ ] T074 Multiple user profiles
- [ ] T075 Shell auto-update with rollback
- [ ] T076 Opt-in telemetry and a privacy policy
- [ ] T077 Accessibility: screen reader, keyboard navigation, high contrast
- [ ] T078 Localization
- [ ] T079 Performance budget (cold boot, idle RAM)
- [ ] T080 Theming and personalization system

### Phase 5 — Bootable OS (T081–T095)
Exit criteria: the shell boots from its own image on the author's hardware, with Windows apps reachable through a compatibility layer or VM.

- [ ] T081 Decision doc: Linux base vs staying on Windows (include games and app compatibility) — **go/no-go gate**
- [ ] T082 Minimal Linux image that boots to the shell
- [ ] T083 Run the shell in a Wayland kiosk compositor
- [ ] T084 Port to WebKitGTK; get the Linux CI build green
- [ ] T085 Driver coverage matrix for the author's hardware
- [ ] T086 Network, Bluetooth and audio stack
- [ ] T087 GPU drivers and acceleration
- [ ] T088 ISO builder and installer with Windows dual-boot
- [ ] T089 Wine/Proton layer for Windows apps
- [ ] T090 KVM Windows-VM fallback
- [ ] T091 Suspend/resume and laptop power management
- [ ] T092 Secure boot and disk encryption
- [ ] T093 Recovery mode and A/B updates
- [ ] T094 Filesystem layout and per-user workspace mount
- [ ] T095 Boot splash and a branded first-boot experience

### Phase 6 — Daily driving and ecosystem (T096–T100)
Exit criteria: go/no-go checklist passed for replacing the primary machine.

- [ ] T096 Run real workflows on it for 30 days; keep a dogfood log
- [ ] T097 Windows migration tool for files, browser data and settings
- [ ] T098 SDK for third-party apps and agents
- [ ] T099 Public alpha ISO with docs and a feedback channel
- [ ] T100 Go/no-go review against a checklist for replacing the main machine

---

## 8. Risks and open questions

| Risk / question | Note |
|---|---|
| Shell registration can lock out login | Test T013 in a VM first; T014 must exist before any real-machine install |
| OpenCode v2 migration | Parser, flags and endpoints may change; verify at T003 and pin a tested range |
| Whole-machine agent access | Do not enable before T031, T047, T067, T071 |
| Windows app compatibility on Stage B | Anti-cheat games, vendor drivers and some enterprise apps may not run; decided at T081 |
| Single-developer scope | 100 tasks; Phases 0–4 alone are large — consider reducing app scope by using existing apps first |
| Free-tier model volatility | Model IDs rotate; T005 removes the hardcoding |

## 9. Appendix

**Run and test (Windows, PowerShell)**

```powershell
npm ci
npm run tauri:dev      # native window
npm run tauri:build    # installers in src-tauri\target\release\bundle\
npm start              # browser mode at http://127.0.0.1:8787
npm test               # unit + bridge tests
npm run test:rust      # opencode-core tests
```

**References**
- OpenCode CLI docs: https://opencode.ai/docs/cli/
- Datadog Security Labs, GHSA-632h-h47v-g4x4: https://securitylabs.datadoghq.com/articles/opencode-upgrade-remote-code-execution/
- Repo docs: `README.md`, `GATES.md`, `WINDOWS.md`
