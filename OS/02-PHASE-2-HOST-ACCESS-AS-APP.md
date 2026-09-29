# PHASE 2 — Host Access as an App

| | |
|---|---|
| **Doc** | 02 of 05 |
| **Goal** | As much of "Windows" as possible — the whole file system, installed apps, processes, terminal, system info — **from inside OpenCode OS while it is still an ordinary windowed app** (Explorer keeps running; nothing is replaced) |
| **Entry** | Phase 1 gate passed (`01-…` §14) |
| **Exit** | §13 acceptance list; Agent Containment Baseline (ACB, §3) live and tested |
| **Replaces** | SPEC-1 T015, T016, T025, T026, T039 (part), T049, T061 (part), T062 (part); adds a slice of T009, T004–T006, T067 |

## 1. The one design decision that shapes this phase

**Two principals, two different doors.**

| Principal | Door | Reach in Phase 2 |
|---|---|---|
| **Human** (the person clicking in the UI) | IPC `host_*` commands | The whole machine, at the user's own Windows privilege — same as Explorer |
| **Agent** (OpenCode and anything it spawns) | OpenCode's own tools, contained by ACB | Workspace only by policy; everything else "ask" or "deny" |

Why: in v0.1.0 the agent is *not* sandboxed (Phase 1 §9). If Phase 2 simply widened the UI's reach and did nothing else, users would reasonably assume the agent was equally bounded or equally open. Neither is true today. So the first deliverable of this phase is **ACB (§3)**, and no host-access feature ships enabled until ACB passes its tests. The full governance plane (broker, snapshots, sandbox, taint tracking) is Phase 4; ACB is the minimum that makes Phase 2 honest.

## 2. Scope

**In:** host file system (all drives, UNC, long paths), Recycle Bin, copy/move/paste, drag-and-drop in-app, watchers, search, open/open-with/reveal/properties, installed-app index (Win32 + UWP + Start Menu), app launch, process list/terminate, system readouts, clipboard, environment, known folders, PowerShell terminal (ConPTY), elevation handling, host-aware Explorer/Notepad/viewers, contract tests, Windows CI.
**Out:** tracking or controlling *other apps' windows*, tray hosting, Alt-Tab (Phase 3); agent-callable OS tools/MCP (Phase 4); local models (Phase 5); replacing `explorer.exe` (Phase 5 optional).

## 3. Workstream A — Agent Containment Baseline (ship first)

| ID | Requirement | Acceptance |
|---|---|---|
| ACB-1 | **Version gate**: refuse to start any agent process below the minimum CLI version (≥ 1.18.22 or the pinned tested floor); Settings shows version + "Upgrade" | Fake CLI at 1.18.4 → blocked with actionable message |
| ACB-2 | **No server without a password**; credentials from OS CSPRNG; endpoint never sent to the renderer | Unit + IPC-payload grep |
| ACB-3 | **Process containment**: every child (agent, server, installer, terminal) in a Windows **Job Object** with `KILL_ON_JOB_CLOSE`, memory cap, and `UILIMIT` flags (no desktop/clipboard/global-atoms access for agent jobs) | Kill host → children die; agent job cannot read clipboard |
| ACB-4 | **Least-privilege launch**: agent processes never elevated; run with a restricted token (drop `SeDebug`, `SeBackup`, etc.) and Low or Medium integrity as feasible; the *shell itself* refuses to run elevated (warn + exit option) | `whoami /priv` inside agent shows minimal set |
| ACB-5 | **Managed OpenCode config**: the shell writes a per-workspace config (path via env/`--config` — *verify mechanism*) that sets tool permissions to *ask* for shell/edit/web and *deny* for anything outside the workspace where supported | Golden test on generated config; live check that a bash tool call triggers a permission request |
| ACB-6 | **Working directory discipline**: agent `cwd` and `--dir` = workspace; the workspace is never `C:\`, a drive root, `%USERPROFILE%`, or a system dir (validated on `settings_set`) | Rejected with message |
| ACB-7 | **Audit log v0**: append-only JSONL under `%LOCALAPPDATA%\opencode-os\audit\`, each record `{ts, seq, principal, cmd, target, decision, result, prev_hash, hash}` (SHA-256 chain); every `host_*` IPC and every agent spawn/kill is recorded | Tamper test: editing a middle line breaks verification (`ocos audit verify`) |
| ACB-8 | **Secrets**: move the Zen key to Windows Credential Manager (DPAPI-backed); `settings.json` keeps only a reference; env injected at spawn only | Key absent from `settings.json`; survives restart |
| ACB-9 | **Honest UI**: Settings → "Access" panel states who can touch what (human: whole machine; agent: workspace-by-policy, *not a hard sandbox until Phase 4*) | Text reviewed; screenshot in docs |
| ACB-10 | **Kill switch v0**: tray/taskbar "Stop all agents" + hotkey (`Ctrl+Alt+Shift+K`) terminates the agent job and revokes the server | E2E on Windows |

ACB explicitly does **not** claim: filesystem isolation of the agent, network isolation, or protection from prompt injection. Phase 4 delivers those.

## 4. Architecture delta

```
opencode-os (Tauri)          thin IPC adapters, event fan-out
 ├─ opencode-core            (existing) workspace FS, settings, server lifecycle, stream parser
 ├─ ocos-host   (NEW)        Windows host services behind traits + Linux/mac stubs (so CI on Linux still builds/tests)
 │    hostfs · shellexec · appindex · procs · sysinfo · clipboard · pty · watcher · known_folders
 └─ ocos-gov    (NEW)        Principal, Capability, guard(), audit v0, job/token containment helpers
```

Rules: `ocos-host` never calls Tauri; every public function takes a `&Ctx { principal, audit }` and passes through `ocos-gov::guard()`; all Windows FFI (`windows` crate) lives behind `#[cfg(windows)]`; a `FakeHost` implements the traits for tests and for bridge-mode e2e.

**Capability v0 (foundation for Phase 4):**
```rust
enum Principal { Human, Agent(AgentId) }
enum Cap { FsRead, FsWrite, FsDelete, AppLaunch, ProcList, ProcKill, ClipboardRead, ClipboardWrite, Exec, SysRead }
struct Target { path: Option<HostPath>, app: Option<AppId>, pid: Option<u32> }
fn guard(p: &Principal, c: Cap, t: &Target) -> Decision   // Allow | Deny(reason) | Ask(prompt)
```
Phase 2 policy: `Human` → Allow (with protected-path warnings, §7); `Agent` → Allow only `FsRead/FsWrite` inside the workspace, everything else `Ask`/`Deny`. Every decision is audited.

## 5. Path model (`HostPath`)

| Concern | Rule |
|---|---|
| Form | Store a normalized absolute path string; accept `C:\…`, `\\server\share\…`, `\\?\…`; reject relative, `/` mixed only if unambiguous (normalize to `\`) |
| Long paths | Convert to `\\?\` form for API calls when > 240 chars; display the friendly form |
| Case | Compare case-insensitively (Windows) for capability checks |
| Reserved names | Reject/flag `CON PRN AUX NUL COM1–9 LPT1–9`, trailing dots/spaces; block `:stream` (ADS) on create; warn on read |
| Links | Junctions/symlinks/reparse points: shown with an overlay; **not followed** for delete/recursive ops; followed for open; agent checks canonicalize *then* compare |
| Drives | `GetLogicalDrives` + `GetVolumeInformation`/`GetDiskFreeSpaceEx`; removable/network/optical typed; offline network drives handled with timeouts |
| TOCTOU | Capability checks operate on canonicalized handles where possible (open first, verify via `GetFinalPathNameByHandle`, then act) |

## 6. IPC additions

All return `{…}` or reject with `{code, message}` (code ∈ `denied`, `not_found`, `exists`, `invalid`, `busy`, `io`, `elevation_required`). Paging is cursor-based for large directories.

| Command | Args → Returns |
|---|---|
| `host_roots` | → `{drives:[{path,label,fs,type,free,total}], known:[{id,name,path}], quick:[…]}` |
| `host_list` | `path, cursor?, limit?, sort?, show_hidden?` → `{entries:[HostEntry], cursor?}`; `HostEntry{name,path,kind,size,mtime,ctime,attrs,link_target?,icon_key}` |
| `host_stat` | `path` → `HostEntry` + `{owner?, readonly, hidden, system}` |
| `host_read` | `path, offset?, len?, encoding?` → bytes (base64) or text; hard cap (default 8 MB text) |
| `host_write` | `path, data, mode: create\|overwrite\|append, expect_mtime?` → `{size,mtime}` (atomic: temp + rename) |
| `host_mkdir` / `host_rename` | as workspace versions but absolute |
| `host_copy` / `host_move` | `sources[], dest, on_conflict: ask\|skip\|replace\|keep_both` → task id; progress on `oc://fsop` `{task,done,total,current,err?}` |
| `host_delete` | `paths[], permanent?:false` → to **Recycle Bin** (`IFileOperation`/`SHFileOperation` with `FOF_ALLOWUNDO`) |
| `host_recycle_list/restore/empty` | Recycle Bin via Shell API (restores to original path) |
| `host_open` | `path, verb?: open\|edit\|print\|runas\|properties` → `ShellExecuteExW`; verbs allow-listed |
| `host_open_with` | `path` → handlers list (`SHAssocEnumHandlers`); `host_open_with_run{path,handler}` |
| `host_reveal` | `path` → select in native Explorer (`SHOpenFolderAndSelectItems`) |
| `host_watch` / `host_unwatch` | `path, recursive?` → watch id; events `oc://fs` `{watch,kind,path}` (coalesced 100 ms) |
| `host_search` | `root, query, kind?, limit` → streaming results (walk + name/ext filter; content search opt-in) |
| `host_thumb` | `path, size` → PNG (`IShellItemImageFactory`) with LRU cache |
| `apps_list` / `apps_refresh` | → `AppEntry[]` (§8) |
| `apps_launch` | `id, args?, elevated?` → `{pid?}` |
| `proc_list` | → `[{pid,ppid,name,exe,cpu,mem,user,started}]`; `proc_kill{pid, tree?}` (confirm in UI; audited) |
| `sys_stats` | → cpu, mem, disks, battery, uptime, os build, hostname, user |
| `clip_read` / `clip_write` / `clip_formats` | text, image, file-list |
| `env_list` | → process env (redacting names matching `KEY\|TOKEN\|SECRET\|PASSWORD`) |
| `pty_open/write/resize/close` | ConPTY session; events `oc://pty` `{id,data}` |

## 7. Human-access UX rules

* **Consent once**: first use of host mode shows what the shell can do; stored as a setting (`host_access: true`). Default **on for Windows**, off in browser/dev mode.
* **Protected paths** (write/delete → confirm dialog with the path in monospace): `C:\Windows`, `C:\Program Files*`, `C:\ProgramData`, other users' profiles, `\\?\`-device paths, the shell's own install dir and config dir.
* **Elevation**: the shell is never elevated. A "Run as administrator" action uses `ShellExecute` verb `runas` (UAC prompt, separate process). File ops that fail with access denied offer "Retry as administrator" via a one-shot elevated helper (`ocos-elevate.exe`, signed, single-purpose, argument-validated) — **stretch; not required for exit**.
* **Never** pass user-supplied strings to `cmd.exe`/`powershell -Command` for file ops. Only the terminal app runs shells, and only as the user's interactive session.
* Delete defaults to Recycle Bin; "Delete permanently" needs Shift + confirm.

## 8. App index and launching

```
AppEntry { id, kind: "win32"|"uwp"|"url"|"settings"|"folder", name, exe?, args?, aumid?, source, icon_key, pinned?, launch_count }
```

Sources (merge, de-duplicate by resolved target or AUMID):
1. **Start Menu** — recursive `.lnk`/`.url` scan of `%ProgramData%\Microsoft\Windows\Start Menu\Programs` and `%AppData%\…\Start Menu\Programs`; resolve targets via `IShellLink`.
2. **Registry** — `App Paths` (HKLM/HKCU), `Uninstall` keys (name/icon/install path; low confidence, used only to enrich).
3. **UWP/Store** — enumerate the `shell:AppsFolder` (or `Get-StartApps`) to obtain **AppUserModelIDs**.
4. **Settings pages** — curated list of `ms-settings:` URIs (Display, Sound, Network, Bluetooth, Apps, Windows Update, Privacy…) so the shell can deep-link to Windows Settings instead of re-implementing it.
5. **Manual** — user-pinned exe/folder/URL.

Launch: Win32 → `ShellExecuteExW` (respects UAC, working dir, associations); UWP → `IApplicationActivationManager::ActivateApplication(aumid)` (fallback `explorer.exe shell:AppsFolder\<aumid>`); URLs/settings → `ShellExecute`. Validate that `id` exists in the index before launching (IPC never takes a raw command line). Icons: extract via `SHGetFileInfo`/`IShellItemImageFactory` → PNG cache keyed by hash.

## 9. Terminal

ConPTY via `portable-pty` (or `windows` crate directly) → xterm.js (vendored, no CDN; CSP unchanged). Profiles: PowerShell, cmd, WSL distros (if present), Git Bash (if present). Resize, copy/paste, scrollback (bounded), "open here" from Explorer. The terminal runs as the **Human** principal; the agent gets no handle to it. Session output is not logged by default (audit records open/close and exit codes only).

## 10. UI deliverables

| Component | Spec |
|---|---|
| **Explorer 2** | Backend adapter `{ws, host}` behind one interface (`list/stat/read/write/mkdir/rename/delete/copy/move/watch`); nav pane (Quick access, This PC drives, known folders, Recycle Bin, Workspace); address bar accepts typed paths; details view (name/date/type/size) with sortable columns; multi-select (Ctrl/Shift/rubber-band); cut/copy/paste; drag-drop between Explorer windows and to the Recycle Bin; breadcrumb dropdown; preview pane (text/image/PDF-thumb); status bar; keyboard parity (F2, Del, Ctrl+C/X/V, Ctrl+A, Alt+←/→, Alt+↑, F5, Backspace); context menu incl. Open with…, Reveal in Windows Explorer, Properties, Copy path, Open terminal here |
| **Viewers** | Image (png/jpg/gif/webp/bmp), text/code (read-only highlight), hex fallback; open unknown types via `host_open` |
| **Notepad** | Host scope, encodings (UTF-8/UTF-16/ANSI detect), line endings, unsaved-changes guard, large-file guard |
| **Start menu** | Pinned + All apps (alphabetical, from index) + search box (apps, files, Settings pages) + Power (sleep/restart/shutdown are Phase 3; here only "Quit OpenCode OS") |
| **Task Manager Lite** | Processes table (CPU/mem, sortable), End task (confirm), system graphs |
| **Settings → Access** | Host access toggle, protected paths list, audit log viewer (read-only, verify button), agent containment status (ACB-1…10 pass/fail), workspace picker with validation |
| **Desktop** | Optional "Show my real Desktop folder" toggle (host `~\Desktop`), icons from `apps_list` |

## 11. Bridge/browser mode and contract tests

Bridge server stays **dev + e2e only**. It gets a `FakeHost` (a temp-dir "C:\") so the UI can be exercised without Windows. To stop the two implementations drifting (D-019):
* Shared **contract vectors** `tests/contract/*.json` (`{cmd, args, expect}`), executed by Rust integration tests (`ocos-host` with `FakeHost` and, on Windows, the real host in a temp dir) and by Node tests against the bridge.
* CI fails if a command exists in Rust but not in the contract set.

## 12. Task list

| ID | Task | Depends | Acceptance |
|---|---|---|---|
| P2-01 | Create `ocos-gov` (Principal, Cap, guard, audit v0) | — | Unit tests; chain verify (ACB-7) |
| P2-02 | Job Object + restricted-token helpers; wrap all spawns | P2-01 | ACB-3/4 tests on Windows CI |
| P2-03 | Version gate + upgrade action (ACB-1) | P1-H04 | §3 |
| P2-04 | Credential Manager storage + migration (ACB-8) | — | §3 |
| P2-05 | Managed OpenCode config writer + live permission check (ACB-5) | P1-H03 | §3 |
| P2-06 | Workspace validation + kill switch (ACB-6/10) | P2-02 | §3 |
| P2-07 | Settings → Access panel + honest copy (ACB-9) | P2-01 | screenshot |
| P2-08 | `HostPath` type + normalization tests (reserved names, ADS, long paths, UNC, junctions) | — | 40+ table-driven tests, Windows-only cases `#[cfg(windows)]` |
| P2-09 | `hostfs` list/stat/read/write/mkdir/rename (atomic writes, paging) | P2-08 | contract vectors |
| P2-10 | Copy/move engine with progress, conflicts, cancel | P2-09 | 1 GB copy test; conflict matrix |
| P2-11 | Recycle Bin: delete/list/restore/empty via Shell API | P2-09 | restore returns to original path |
| P2-12 | Watcher (`notify`) with coalescing → `oc://fs` | P2-09 | Explorer refreshes on external change < 500 ms |
| P2-13 | Search (walk + filters, cancellable, streaming) | P2-09 | 100k-file tree < 3 s name search |
| P2-14 | `host_open`, open-with, reveal, properties | P2-09 | verbs allow-list tests |
| P2-15 | Thumbnails + icon cache | P2-14 | LRU bound respected |
| P2-16 | App index: Start Menu + registry + UWP + settings URIs | — | ≥ 95% of Start-menu apps on test machine resolve |
| P2-17 | `apps_launch` (Win32 + UWP + URL) with index-only ids | P2-16 | launches Notepad, Calculator (UWP), Chrome, a `.url` |
| P2-18 | Processes, sysinfo, env (redacted), clipboard | P2-01 | contract vectors |
| P2-19 | Terminal (ConPTY + xterm.js vendored) | P2-02 | vim/`ping`/colors work; resize OK |
| P2-20 | Explorer 2 backend adapter + host mode | P2-09 | G1 tasks pass in both `ws` and `host` |
| P2-21 | Explorer 2 UI: nav pane, details, multi-select, clipboard, DnD | P2-20, P2-10 | §13 |
| P2-22 | Preview pane + viewers | P2-15 | png/jpg/txt/md preview |
| P2-23 | Notepad host mode + encodings + dirty guard | P2-09 | round-trips UTF-16 file byte-exact |
| P2-24 | Start menu: All apps + search | P2-16 | type-to-launch |
| P2-25 | Task Manager Lite | P2-18 | End task kills a test process |
| P2-26 | Bridge `FakeHost` + contract runner (Rust + Node) | P2-09 | CI gate |
| P2-27 | Models from `opencode models` (T005); drop hard-coded list | P1-H03 | List matches CLI |
| P2-28 | Windows CI: integration tests, launch smoke, installer install/uninstall on runner | P1-H14 | green |
| P2-29 | Manual test matrix MT-01…MT-30 executed on Win10 + Win11 | all | signed report |
| P2-30 | (Stretch) elevated helper for access-denied retry | P2-14 | UAC prompt appears; helper rejects bad args |

## 13. Acceptance: UX tasks a person must be able to do (P2-G)

1. Browse any drive, network share, and known folder; type a path in the address bar.
2. Create, rename, delete-to-Recycle-Bin, and **restore** a file outside the workspace.
3. Copy/move a 1 GB folder with progress, cancel it midway, resolve conflicts.
4. Multi-select with keyboard and mouse; Ctrl+C/X/V; drag between two windows.
5. Edit a `C:\Users\<me>\Documents\x.txt` in Notepad (UTF-8 and UTF-16 both preserved).
6. Double-click a `.pdf`, `.docx`, `.zip`, `.exe` → opens in the Windows default handler.
7. "Open with…" and "Reveal in Windows Explorer" work.
8. Start menu lists the installed apps; typing "calc" launches Calculator; a Store app launches.
9. Launch an app as administrator via UAC; the shell itself stays unelevated.
10. Open a PowerShell terminal, run `git`, `node`, `python`; resize; close cleanly.
11. See live CPU/mem; end a misbehaving process (with confirm).
12. External file changes appear in an open Explorer window without refresh.
13. Long paths (> 260), UNC paths, `CON`/trailing-dot names behave predictably (clear errors, no crashes).
14. Toggle host access off → host commands return `denied`; workspace mode still works.
15. Audit viewer shows every host action from the session; "Verify" passes; a hand-edited log fails.
16. **Agent checks:** with the agent told to read/write `C:\Windows\System32\drivers\etc\hosts`, it is blocked or prompts; "Stop all agents" kills it within 2 s; killing the shell leaves no stray `opencode` processes.

## 14. Test plan

* **Rust:** table-driven `HostPath` tests; `FakeHost` for logic; `#[cfg(windows)]` integration tests in temp dirs (reparse points, ADS, reserved names, long paths, Recycle Bin round-trip with a per-test temp volume path).
* **Node/e2e:** contract vectors against the bridge; Playwright flows for Explorer 2 on `FakeHost`.
* **Windows CI runner:** build, run integration tests, install NSIS silently, launch app, assert window title and that the process tree contains no orphan after exit; uninstall.
* **Manual matrix:** clean Win10 22H2 and Win11 24H2 VMs, non-admin and admin accounts, with/without OneDrive Known Folder Move, with a network share and a USB drive.
* **Security tests:** hostile paths (`..\..`, `\\?\C:\`, `C:\Windows\..\Windows`, ADS, junction pointing to `C:\Windows`), oversized listings, symlink swap during copy, launching non-indexed ids, IPC fuzz with malformed args.

## 15. Risks

| Risk | Mitigation |
|---|---|
| Windows API surface is large; COM lifetimes/threading bugs | Isolate in `ocos-host`; STA thread for Shell/COM calls; one worker per subsystem; soak tests |
| Users read "host access" as "agent has access" | ACB-9 copy; Access panel; separate principals in every UI label |
| Explorer 2 scope creep | Fix the feature list (§10); everything else to backlog |
| UWP enumeration/launch differences across Windows builds | Feature-detect, fall back to `explorer.exe shell:AppsFolder\…` |
| OpenCode config/permission keys differ from assumption (ACB-5) | Task P2-05 starts with a live verification; if unsupported, fall back to Phase 4 option B early (agent gets only our tools) |
| Job Object `UILIMIT`/restricted token break Node-based CLI startup | Test matrix on the pinned CLI; document the exact flags that work |

## 16. Assumptions to verify at kickoff

OpenCode config file/env override and permission schema; whether built-in tools can be disabled; whether `serve` exposes an event stream we can use later; that Node/Bun-based CLI runs under a restricted token at Low integrity; `IApplicationActivationManager` availability on the target Windows builds.
