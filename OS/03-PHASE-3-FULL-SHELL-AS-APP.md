# PHASE 3 — Full Shell as an App (launch and manage real installed apps)

| | |
|---|---|
| **Doc** | 03 of 05 |
| **Goal** | OpenCode OS *behaves like the Windows shell* — taskbar showing real running apps, Start, Alt-Tab-style switcher, quick settings, notifications, lock/sleep/power, multi-monitor — while `explorer.exe` keeps running underneath. Installed apps launch normally and keep their own native windows. |
| **Entry** | Phase 2 gate (host access + ACB) |
| **Exit** | §11 daily-drive acceptance; guardian process proven; performance budget met |
| **Replaces** | SPEC-1 T011, T012, T015–T024, T026–T028, T060 (part), T061, T063, T064 (part) — **but with the "as an app" constraints below, not the Winlogon shell** |

## 1. What "shell as an app" can and cannot do

A normal Windows process cannot become *the* shell without registering as one (Phase 5 optional). This phase gets as close as an app legitimately can. Be explicit about the seams:

| Capability | As an app | How | Limit |
|---|---|---|---|
| See other apps' windows | **Yes** | `SetWinEventHook` (create/destroy/show/hide/namechange/foreground/minimize/move) + initial `EnumWindows` | Must apply Alt-Tab eligibility rules (§4) |
| Activate/minimize/restore/close them | **Yes** | `SetForegroundWindow` (with `AllowSetForegroundWindow`/input trick), `ShowWindow`, `PostMessage(WM_CLOSE)` | Foreground-lock rules may need a user-input trigger |
| Own taskbar reserving screen space | **Yes** | **AppBar API** (`SHAppBarMessage` `ABM_NEW/QUERYPOS/SETPOS`) — the sanctioned way to dock a bar and shrink the work area | Native taskbar still exists (hide via auto-hide, see §3) |
| Hide the native taskbar | **Partly** | `ABM_SETSTATE` auto-hide (changes a user setting → must be restored) | Guardian must restore on crash (§3) |
| Host other apps' tray icons | **No (true hosting)** | Tray hosting requires owning `Shell_TrayWnd` | Keep native tray reachable (auto-hide peek) + best-effort UIA mirror (experimental) |
| Replace Alt-Tab / Win key | **No (reliably)** | Own switcher on a different hotkey; no global Win-key hook | `WH_KEYBOARD_LL` is flagged by security tools and fragile — don't ship |
| Intercept toast notifications | **Only if packaged** | `UserNotificationListener` needs package identity + user consent | Ship own notification center for shell/agent events first |
| Virtual desktops | **Read/limited** | `IVirtualDesktopManager` (documented: is-on-current, move-window) | Switching/creating uses undocumented COM → out of scope |
| Live window thumbnails | **Yes, costly** | DWM thumbnails need an HWND we own; or `Windows.Graphics.Capture`/`PrintWindow` snapshots | Start with static icon + title; add snapshots later |
| Desktop wallpaper/icons layer | **Optional/experimental** | Parent a window under the `WorkerW` (wallpaper-engine technique) | Undocumented; behind a flag |
| Lock, sleep, restart, shutdown | **Yes** | `LockWorkStation`, `SetSuspendState`, `ExitWindowsEx` (+ `SE_SHUTDOWN_NAME`) | Confirmation + audit |
| Quick settings | **Yes** | Core Audio (volume), DDC/CI or WMI (brightness), `GetSystemPowerStatus`, Network List Manager/WLAN API, WinRT `Radios` (Wi-Fi/BT) | Some toggles need Settings deep-link fallback |
| Settings coverage | **Deep-link** | `ms-settings:` URIs (Phase 2 index) | Don't rebuild Windows Settings |

## 2. Shell modes

| Mode | Description | Default |
|---|---|---|
| **Windowed** | Current behavior: the whole OS is one resizable window; native apps live outside it | ✔ (safe) |
| **Docked shell** | Borderless per-monitor bar windows registered as AppBars (taskbar), plus a transparent overlay window for Start/launcher/notifications; no big desktop window. Native apps use the full work area minus our bar | opt-in |
| **Full-screen desktop** | Docked shell + our desktop layer (icons, wallpaper) behind windows via `WorkerW` (experimental) | opt-in |

Mode is a setting with a **panic path** in all modes: `Ctrl+Alt+Shift+Esc` (registered global hotkey) and a tray-menu item both call the guardian to restore the native taskbar and quit the shell.

## 3. Architecture delta

```
opencode-os (Tauri, multi-window)
 ├─ windows: main(desktop) · bar-<monitor> (AppBar) · launcher (transparent, on top) · popup (flyouts/notifications)
 ├─ ocos-winshell (NEW crate, cfg(windows)) — trait ShellHost + FakeShellHost for tests
 │     winwatch · appbar · switcher · tray_peek · power · quick_settings · hotkeys · monitors · dnd
 ├─ ocos-host (Phase 2)   ocos-gov (Phase 2)
 └─ ocos-guardian (NEW small exe, separate process)
       heartbeat from shell every 1 s; on missed heartbeats or shell crash:
       restore native taskbar auto-hide state, release AppBars, restore work area, remove hotkeys marker, log to audit
```

Guardian requirements: single-purpose, no network, no file access beyond its own state file; started by the shell (or at login when docked mode is enabled); launched *before* the shell mutates taskbar state; state file records prior auto-hide setting so restore is exact.

**Threading:** one Win32 message-loop thread owns hooks/AppBars/hotkeys; it publishes events over a bounded channel to the async side; the webview never touches HWNDs, only opaque `winId` handles the Rust side maps back.

## 4. Window tracking model

```
WinInfo { win_id, hwnd, pid, exe, title, class, aumid?, icon_key, state: normal|minimized|maximized|fullscreen,
          monitor, z_order, is_uwp, cloaked, flashing, progress? }
```

**Eligibility (which windows appear on the taskbar)** — follow the classic Alt-Tab rules: visible (`IsWindowVisible`), not cloaked (`DWMWA_CLOAKED == 0`), has no owner **or** has `WS_EX_APPWINDOW`, and lacks `WS_EX_TOOLWINDOW` (unless `WS_EX_APPWINDOW`); exclude our own bar/launcher/popup windows and known shell windows (`Progman`, `WorkerW`, `Shell_TrayWnd`, `Windows.UI.Core.CoreWindow` helpers).
**UWP:** windows are hosted by `ApplicationFrameHost.exe`; resolve the real app via the `CoreWindow` child / `GetApplicationUserModelId` on the underlying process, and de-duplicate suspended/cloaked frames.
**Grouping:** group by AUMID (UWP) or by exe path (Win32); pinned apps from the app index appear even when not running.
**Flashing/badges:** track `HSHELL_FLASH`/`EVENT_OBJECT_…` flash state; taskbar-progress (`ITaskbarList3`) is **not visible** to non-shell apps — document as a limitation.

## 5. Component specs

**5.1 Taskbar** — Start button; search/command entry; pinned + running app buttons (group, hover title, click = activate/minimize toggle, middle-click = new instance via `apps_launch`, right-click jump menu: New window, Pin/Unpin, Close window, Close all, Run as admin); running indicator; overflow when crowded; system area (§5.5); clock/calendar flyout; multi-monitor: one bar per monitor, "show windows from all bars / only this monitor" setting; auto-hide option; size/position (bottom/top/left/right) via AppBar edge.

**5.2 Start** — Pinned grid (drag to reorder, folders), "All apps" A–Z with letter jump, **Recommended** (recent files via Recent folder + recent launches), unified search (apps, files via Phase 2 search + optional index, `ms-settings:` pages, commands, "Ask AI" row that hands the query to the agent — read-only tools only in Phase 3), profile menu, Power menu (Lock, Sleep, Restart, Shut down, **Quit OpenCode OS**). Keyboard-first: type-to-search, arrows, Enter, Ctrl+Enter = run as admin.

**5.3 Switcher** — Own overlay on `Alt+Q` (default; configurable) and `Ctrl+Alt+Tab`: MRU order from foreground events, arrow/tab cycling, type-to-filter, close (`Delete`). Native Alt+Tab is untouched.

**5.4 Window management** — Snap via `SetWindowPos` to halves/quarters/thirds using hotkeys (`Ctrl+Alt+Arrows`), "move to next monitor", "maximize without covering our bar" (work-area aware). No forced tiling of others' windows.

**5.5 System area** — Icons for volume, network, battery, Bluetooth, agent status, notifications, clock. Flyouts:
* *Volume:* master slider + mute + output device picker (Core Audio).
* *Network/Wi-Fi:* status, list, connect (open Settings deep link for enterprise/auth cases).
* *Bluetooth:* toggle + paired devices (WinRT `Radios`, `DeviceInformation`).
* *Battery/power mode:* percent, charging, power plan.
* *Brightness:* slider when DDC/WMI available; hidden otherwise.
* *Display:* projection (`ms-settings:` / `DisplaySwitch.exe` launch).
* *Tray peek:* button that briefly un-hides the native taskbar overflow (experimental UIA mirror behind a flag).

**5.6 Notification center** — Two sources: (1) OpenCode OS events (agent approvals, task completion, updates, errors) — full control, actionable; (2) Windows toasts only if/when packaged with identity (§9). Do-not-disturb, per-source toggles, history (bounded), actions (buttons), audit link.

**5.7 Power & session** — Lock (`LockWorkStation`), Sleep (`SetSuspendState`), Restart/Shut down (`ExitWindowsEx` with reason codes; confirm dialog listing apps with unsaved windows is *not possible* — rely on Windows' own prompts), Sign out. **Shut down in the shell must not be confused with quitting the shell** — separate menu items with distinct icons and copy.

**5.8 Hotkeys** — `RegisterHotKey` for: launcher (`Ctrl+Space`), agent command bar, switcher, snap, panic. Conflict detection with clear error on registration failure; per-user remap; **no low-level keyboard hook**.

**5.9 Drag & drop / clipboard manager** — Files dragged from native Explorer into our windows (Tauri file-drop events) and out to native apps (drag-out via a vetted plugin or OLE `DoDragDrop` shim). Clipboard history (text/image/files) local-only, bounded, encrypted at rest (DPAPI), **respects the "exclude from history" clipboard format** password managers set, per-app deny list, one-key wipe, agent access = deny (Phase 4 makes it a capability).

**5.10 Default handlers & jump lists** — "Open with" and default-app resolution (`AssocQueryString`), recent items, user pins persisted; `Set default app` deep-links to `ms-settings:defaultapps`.

**5.11 Monitors** — Enumerate (`EnumDisplayMonitors`), DPI-aware (per-monitor v2 manifest), hot-plug handling, per-monitor bars/wallpapers, layout persistence.

**5.12 Startup** — Optional autostart (HKCU `Run`), "start docked", crash-loop breaker (3 crashes in 2 minutes → start Windowed and notify).

## 6. IPC additions

| Command / event | Purpose |
|---|---|
| `win_list`, `win_activate{win_id}`, `win_minimize`, `win_restore`, `win_close`, `win_move{win_id,rect\|snap}` ; event `oc://win` `{kind:added\|removed\|changed\|focused, win}` | Taskbar/switcher |
| `shell_mode_get/set`, `appbar_set{edge,size,autohide}` | Modes |
| `tray_peek` | Tray fallback |
| `power{action: lock\|sleep\|restart\|shutdown\|signout}` | Session (audited, confirm) |
| `qs_get`, `qs_set{key,value}` for `volume`, `mute`, `brightness`, `wifi`, `bluetooth`, `power_mode`; event `oc://qs` | Quick settings |
| `monitors_list`; event `oc://monitors` | Multi-monitor |
| `hotkeys_get/set`; event `oc://hotkey{id}` | Hotkeys |
| `notify{source,title,body,actions}`; events `oc://notify`, `oc://notify-action` | Notification center |
| `pin_get/set`, `recent_list` | Start/taskbar data |

Every command is a capability (`WinRead`, `WinControl`, `Power`, `QuickSettingsWrite`, `ClipboardHistory`, …) checked by `ocos-gov::guard`; **Human** allowed, **Agent** denied by default (Phase 4 will grant selectively).

## 7. Multi-window Tauri configuration

| Window | Flags | Capability scope |
|---|---|---|
| `main` (desktop) | resizable, decorations on/off by mode | full UI commands |
| `bar-<n>` | no decorations, `skip_taskbar`, always-on-top, AppBar-registered (Rust owns geometry) | `win_*`, `qs_*`, `pin_*`, `notify` |
| `launcher` | transparent, no shadow, always-on-top, shown on hotkey, focus-trap | `apps_*`, `host_search`, agent command entry |
| `popup` | transparent flyouts anchored to bar | `qs_*`, calendar, notifications |

Separate capability files per window (least privilege). CSP unchanged; remove `unsafe-inline` styles (move to classes) as part of this phase.

## 8. Persistence

`%APPDATA%\opencode-os\shell.json`: mode, bar edge/size/autohide, pins, hotkeys, notification prefs, per-monitor layout. `%LOCALAPPDATA%\opencode-os\`: icon cache, clipboard history (encrypted), audit logs, guardian state. Versioned schemas with migrations; atomic writes; corrupt-file → backup + defaults (never silent data loss — fixes Phase 1 D-009-class issue for these files too).

## 9. Optional: MSIX / sparse package for identity

Packaging with a package identity (sparse package) unlocks `UserNotificationListener`, some WinRT APIs without hacks, and cleaner app identity in Settings. Cost: signing, install flow changes. **Decision gate P3-D1** at mid-phase: if toast mirroring is a must-have, adopt; otherwise defer to Phase 5.

## 10. Task list

| ID | Task | Depends | Acceptance |
|---|---|---|---|
| P3-01 | Create `ocos-winshell` + `FakeShellHost`; message-loop thread; event bus | P2-01 | Unit tests on fake; Windows smoke |
| P3-02 | **Guardian**: heartbeat, restore logic, state file | P3-01 | Kill shell with `taskkill /f` → native taskbar restored < 3 s |
| P3-03 | Window tracker (`SetWinEventHook` + enumerate) with eligibility rules | P3-01 | Matches Alt-Tab list on a 20-window test rig |
| P3-04 | UWP frame resolution + AUMID grouping | P3-03 | Calculator, Photos, Settings appear once with right icon |
| P3-05 | `win_*` control commands (activate/min/restore/close/move) incl. foreground workaround | P3-03 | 50 activations, ≥ 98% succeed |
| P3-06 | AppBar registration, edge/size, work-area shrink, multi-monitor | P3-02 | Maximized apps stop at bar; clean release on exit |
| P3-07 | Native-taskbar auto-hide toggle with exact restore | P3-02 | Setting round-trips; guardian restores after crash |
| P3-08 | Multi-window Tauri setup + per-window capability files | P3-06 | Least-privilege test: bar cannot call `host_write` |
| P3-09 | Taskbar UI (pinned, running, groups, jump menu, overflow) | P3-05, P3-08 | §11 tasks 1–5 |
| P3-10 | Start v2 (pinned, all apps, recommended, search, power menu) | P2-24 | §11 tasks 6–8 |
| P3-11 | Launcher window + global hotkey | P3-08 | Opens < 100 ms after hotkey |
| P3-12 | Switcher overlay (MRU, filter, close) | P3-03 | Order matches foreground history |
| P3-13 | Snap/move hotkeys, work-area-aware maximize | P3-05 | Halves/quarters on 2 monitors |
| P3-14 | Power & session actions (audited, confirm) | P2-01 | Lock/sleep/restart/shutdown/sign-out work; each audited |
| P3-15 | Volume + mute + device picker | — | Slider ↔ Windows mixer in sync |
| P3-16 | Battery, power mode, network status | — | Matches Settings |
| P3-17 | Wi-Fi + Bluetooth toggles / lists (with Settings fallback) | — | Toggle works or deep-links |
| P3-18 | Brightness (DDC/WMI) | — | Works on laptop panel; hides on unsupported |
| P3-19 | Notification center (own events) + DND | P3-08 | Agent approval toast with actions |
| P3-20 | Clipboard manager (encrypted, exclusion-aware, deny list) | P2-18 | Password-manager copy not recorded |
| P3-21 | Drag-drop in/out with native apps | P3-08 | Drag file to Chrome upload and back |
| P3-22 | Default handlers/Open-with polish, pins, recent items | P2-14 | Recent list matches Windows |
| P3-23 | Monitor hot-plug + DPI v2 | P3-06 | Unplug/plug keeps bars sane |
| P3-24 | Autostart + docked-start + crash-loop breaker | P3-02 | 3 forced crashes → Windowed mode |
| P3-25 | Tray peek (fallback) + experimental UIA mirror (flagged) | P3-07 | Native tray reachable in docked mode |
| P3-26 | Remove `unsafe-inline`; audit all IPC capability tags; window-level scope review | P3-08 | CSP test; capability matrix reviewed |
| P3-27 | Perf budget instrumentation (§12) | — | Dashboard in Settings → About |
| P3-28 | Decision gate P3-D1 (MSIX identity / toast mirroring) | — | Written decision |
| P3-29 | Full-screen desktop layer via WorkerW (flagged, experimental) | P3-06 | Icons + wallpaper behind windows; disable switch |
| P3-30 | Windows CI: docked-mode smoke on a runner with a virtual display; manual matrix MT-31…MT-60 (Win10/11, 1 & 2 monitors, 100–200% DPI, RDP session, Focus Assist) | all | signed report |

## 11. Acceptance: daily-drive checklist (P3-G)

Run for one full working day in **Docked shell** mode with Explorer still running:
1. Taskbar lists every app window that native Alt-Tab lists; click activates/minimizes correctly.
2. Pinned apps launch normally (Win32 and UWP); middle-click opens a new instance.
3. Closing an app removes its button within 500 ms; a crashing app does too.
4. Two monitors: each bar shows its windows; moving a window updates bars.
5. Maximized apps never cover the bar; `Win+D`, `Win+Tab`, native Alt-Tab still work (we don't break them).
6. Start: type-to-launch, All apps, recent files, `ms-settings:` results, Ask-AI row.
7. Launcher hotkey, switcher, snap hotkeys work with 20+ windows.
8. Volume, brightness, Wi-Fi, Bluetooth, battery reflect reality.
9. Lock, sleep, restart, shut down, sign out, and Quit-shell each do exactly one thing.
10. Notifications from agent tasks arrive with working actions.
11. Clipboard history skips password-manager entries; wipe works.
12. **Crash drill:** `taskkill /f` the shell → guardian restores the native taskbar and work area; relaunch restores layout. Do it 5 times.
13. **Panic hotkey** restores everything from any state.
14. No orphaned `opencode` or helper processes after quit.

## 12. Performance and reliability budget (targets — calibrate in P3-27)

| Metric | Target |
|---|---|
| Cold start to interactive bar | ≤ 2.5 s |
| Idle RAM (shell + guardian + 1 webview) | ≤ 350 MB |
| Idle CPU | < 1% |
| Window event → taskbar update | ≤ 100 ms p95 |
| Launcher open after hotkey | ≤ 100 ms |
| Guardian restore after crash | ≤ 3 s |
| 8-hour soak | no handle/memory growth > 10% |

## 13. Risks

| Risk | Mitigation |
|---|---|
| Foreground-lock prevents activating windows | Use input-attached workaround only on user-initiated actions; document failures |
| Tray icons unreachable | Keep native tray via auto-hide peek; be explicit in docs; true hosting deferred to Phase 5 optional shell registration |
| Hooks/AppBar interact badly with RDP, fast user switching, DPI changes | Manual matrix; crash-loop breaker; Windowed mode always available |
| Security tools flag global hooks | No low-level keyboard/mouse hooks; only `SetWinEventHook` + `RegisterHotKey` |
| Webview overhead for many windows | One shared runtime; bars are tiny pages; measure in P3-27 |
| Leaving the user's taskbar hidden after a bug | Guardian + panic hotkey + startup self-check that restores if state file says "hidden by us" |

## 14. Assumptions to verify

Tauri multi-window with transparent always-on-top popups behaves on Win10 and Win11; AppBar registration works with WebView2-backed windows; DWM cloaking flags on target builds; `ms-settings:` URIs present on the target builds; a drag-out solution for Tauri is available and maintained.
