# OpenCode OS — Gate Plan (G1–G4)

**Product**: a Tauri v2 installable desktop app that boots into a Windows-home-style
desktop environment ("the OS"). The first and only app is a floating, always-available
text chat box wired directly to an underlying OpenCode CLI installation. OS UI v1 is a
glorified file viewer with a real window manager.

**Gates are UX-task-driven**: every gate is a set of tasks a normal computer user does,
each with an observable success criterion and an automated test that proves it.
A gate passes only when **all** its criteria are proven by the test suite
(`npm run gates:verify` locally; CI additionally produces real installers).

---

## Gate 1 — Core Computer User Toolkit

*The user turns on their computer and does everyday things.*

| # | UX task | Success criterion | Proof |
|---|---------|-------------------|-------|
| G1.1 | Boot the machine | App launch ends on a rendered desktop (wallpaper, icons, taskbar with Start button + clock) within 3 s | `e2e/boot.spec` |
| G1.2 | See files on the desktop | Desktop shows This PC (Home), File Explorer, Notepad, Chat, Recycle Bin icons; double-click opens the app window | `e2e/desktop.spec` |
| G1.3 | Browse folders | File Explorer opens at Home; user can navigate into subfolders and back via breadcrumbs + Up/back/forward | `e2e/explorer.spec` + unit |
| G1.4 | Create content | "New folder" and "New text file" appear immediately in the real file system | `e2e/explorer.spec` (asserts on disk) |
| G1.5 | Rename / delete | Rename edits in place (F2 or context menu); Delete moves to `.Trash` and Recycle Bin shows it | `e2e/explorer.spec` + unit |
| G1.6 | Open & edit a text file | Double-click a `.txt` opens Notepad; edit + Save persists bytes to disk | `e2e/notepad.spec` (asserts on disk) |
| G1.7 | Search | Explorer filter box narrows the listing as the user types | `e2e/explorer.spec` |
| G1.8 | Manage windows | Drag by titlebar, minimize to taskbar, maximize/restore, close, focus raises z-order | `e2e/wm.spec` + unit |
| G1.9 | Chat is always available | Floating chat window stays on top of every app window, can dock/minimize to the taskbar and be recalled | `e2e/chat.spec` + unit |
| G1.10 | Shut the machine down | Start → Shut Down closes the OS window cleanly | `e2e/boot.spec` |

**Gate pass** = all 10 criteria green.

## Gate 2 — OpenCode Chat UX

*The user talks to the machine's built-in AI through the floating chat box.*

| # | UX task | Success criterion | Proof |
|---|---------|-------------------|-------|
| G2.1 | Machine auto-starts the AI service | On boot, OS spawns the OpenCode server (`opencode serve`) bound to 127.0.0.1 with generated basic-auth; health check passes | Rust unit `oc_server::tests` + `e2e/chat.spec` (live server in sandbox) |
| G2.2 | Start a conversation | Chat creates a real OpenCode session (`POST /session`) and shows it in the session list | `e2e/chat.spec` (real server, sandbox) |
| G2.3 | Get a streamed answer | Send a message → assistant reply streams token-by-token into the bubble (SSE), with typing indicator | `e2e/chat.spec` with mock stream; live path gated on zen key |
| G2.4 | Keep conversation history | User can switch between sessions; history loads from the server | unit `chat-parser` + e2e |
| G2.5 | Recover from errors | No zen key / network error → friendly bubble with "Open Setup" action; app never crashes | `e2e/chat.spec` (forced-error case) |
| G2.6 | First-run setup configures zen | Setup wizard collects the OpenCode Zen API key, writes `auth.json`/config, then a test message verifies the model round-trip | e2e wizard flow + `scripts/zen-check.sh` |
| G2.7 | Work inside a workspace | The server runs with the user's chosen workspace as cwd; chat "Attach current folder" injects the Explorer path as context | unit + e2e |

**Gate pass** = all 7 criteria green (G2.3 live-model leg requires a real zen key; the
transport/streaming proof is mock-verified, the live check is `npm run zen:check`).

## Gate 3 — Consumer-Ready Installable (Windows)

*A normal Windows user downloads one file and ends up with a working machine.*

| # | UX task | Success criterion | Proof |
|---|---------|-------------------|-------|
| G3.1 | Download & install | NSIS `.exe` (and MSI) installers are produced by CI on every tag (`windows-latest`) | `.github/workflows/windows-installer.yml` |
| G3.2 | Zero manual setup | First launch runs the auto-setup wizard: installs/verifies OpenCode CLI, links zen API key, creates default workspace — user clicks Next 3 times | `src-tauri` setup module + e2e wizard |
| G3.3 | It feels like Windows | Product installs as "OpenCode OS", launches full-desktop window with its own icon in Start Menu | installer config (`tauri.conf.json` nsis/msi) |
| G3.4 | Safe by default | All file operations are jailed to the user workspace (path-traversal attacks rejected) | Rust unit `fs_engine::tests::traversal_*` |
| G3.5 | Updatable & honest | `opencode --version` shown in Settings/About; upgrade button calls `opencode upgrade` | e2e settings.spec |
| G3.6 | Repo is the deliverable | `git bundle` + `zip` of the full repo clone-builds from scratch: `npm ci && npm run tauri:build` on Windows CI | CI green badge + artifacts |

**Gate pass** = workflow file valid, core tests green, wizard e2e green; Windows
artifacts produced by CI runner (this sandbox cannot cross-compile WebView2/MSVC —
documented, not hidden).

## Gate 4 — Host Access as an App (Phase 2)

*The OS graduates from its sandbox to governed access to the real machine —
delivered as the "This PC" app, off by default, grant-per-root.*

| # | UX task | Success criterion | Proof |
|---|---------|-------------------|-------|
| G4.1 | See the machine | When (and only when) host access is granted, a "This PC" icon appears on the desktop listing the machine's real locations (Home, drives, volumes) | `e2e` Scenario C G4.1 + Rust `host::tests::discover_finds_home_root` |
| G4.2 | Browse real folders | This PC lists the granted root's real files; navigation/breadcrumbs behave like Explorer | `e2e` Scenario C G4.2 + Rust `host::tests::host_roundtrip_list_read_write` |
| G4.3 | Create content on the host | "New folder" / "New text file" inside a granted root hit the real disk | `e2e` Scenario C G4.3 |
| G4.4 | Edit real files | Double-click opens the host file in Notepad; Ctrl+S writes the real file (≤2 MB guard) | `e2e` Scenario C G4.4 + Rust `host::tests::host_read_size_cap` |
| G4.5 | Safety rail | traversal/backslash/absolute/symlink-escape rejected; dotfiles never listed; hidden + system dirs (Windows/, Program Files/, /etc…) never readable or writable; revoking access blocks everything instantly | Rust `host::tests::*` + bridge HTTP tests (G4.5) |
| G4.6 | Chat works on host folders | "Use as OpenCode working folder" re-points the OpenCode CLI cwd (`oc_set_cwd`, server recycled); chip shows context; validation refuses non-allowed paths | `e2e` Scenario C G4.5 + bridge `oc_set_cwd` test |
| G4.7 | Consent-first UX | Setup wizard asks before granting (default OFF, grants Home only); Settings → Host access toggles + per-root allowlist; revoking hides This PC and re-blocks the engine | `e2e` Scenario B G3.2d/G3.2e + Scenario C G4.6 + Rust disabled/non-allowed tests |

**Gate pass** = Rust host tests + bridge host tests + e2e Scenario C all green;
settings v1→v2 migration proven (`settings::tests::v1_settings_without_host_access_migrate_cleanly`).

---

## Test topology in this sandbox (no root, no webkit2gtk — honest constraints)

- `cargo test -p opencode-core` → real Rust unit tests (fs engine, host engine, server lifecycle, settings)
- `npm run test` → frontend logic + bridge API unit tests (node:test)
- `npm run e2e` → real headless Chromium drives the actual UI via `bridge-server/`
  (same JSON API surface as the Rust commands; real disk operations on a temp workspace +
  fake HOME for host tests; real `opencode serve` for G2.1/G2.2)
- `npm run gates:verify` → runs everything and prints the gate scoreboard
- Windows installers → GitHub Actions `tauri-action` on `windows-latest`
