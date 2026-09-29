# Phase 2 — Host Access as an App (implemented spec)

> Status: **implemented & tested**. This document captures the as-built scope of
> Phase 2. (The planning copy of this spec did not reach the build environment;
> the scope below was derived from the phase title and the Phase 1 architecture.
> If the planning doc differs, reconcile here — every decision is annotated.)

## Goal

Phase 1 jailed every file operation inside the app's own workspace. Phase 2
graduates the OS to **governed access to the real machine**, delivered as a
first-class app — **This PC** — with consent-first UX and the same
"safe by default" bar as Phase 1.

## Non-negotiable principles

1. **Off by default.** `host_access.enabled = false` in all settings (old or
   new). Nothing on the host is reachable until the user grants it.
2. **Grant per root.** The allowlist is a list of root ids (`home`,
   `drive_C`, `vol_…`), not paths. Users see labels, never raw paths, in the UI.
3. **Deny is the fallback.** Any ambiguous path → blocked.
4. **One rulebook.** The host engine reuses the Phase 1 path rules: no `..`,
   no `\`, no absolute paths, no drive prefixes, symlink-escape checks on the
   deepest existing ancestor.

## Architecture

### Rust — `src-tauri/crates/opencode-core/src/host.rs`

- `discover_roots() -> Vec<HostRoot>` — best-effort enumeration:
  - Windows: `%USERPROFILE%` as `home`, then `A:\`–`Z:\` as `drive_X`
    (skipping the drive that hosts the profile).
  - macOS: `$HOME` + `/Volumes/*`.
  - Linux/other: `$HOME` + `/media/<user>/<vol>`, `/run/media/*`, `/mnt/*`.
  - Capped at 16 roots; never errors.
- `HostEngine { roots, allowed, enabled }` — operation surface mirrors
  `FsEngine`: `list / read_text / write_text / mkdir / rename / delete`.
  Every op passes three gates: enabled → root allowlisted → strict resolve.
- Guardrails beyond the path rulebook:
  - dotfiles/dot-dirs are **never listed** and never writable (`.ssh` etc.);
  - deny-listed top-level dirs inside non-home roots (`Windows`, `Program
    Files*`, `ProgramData`, `$Recycle.Bin`, `System Volume Information`,
    `Recovery`, `boot`, `proc`, `sys`, `dev`, `etc`) are unreadable/unwritable,
    case-insensitive;
  - reads capped at 2 MiB, writes capped at 2 MiB;
  - `delete` is permanent (host has no Recycle Bin) — the UI confirms first
    and the root itself is undeletable.

### Settings v2 — backward compatible

```json
{
  "workspace": "…", "zen_api_key": "…", "model": "…", "wizard_done": true,
  "host_access": { "enabled": false, "allowed_roots": [] },
  "oc_cwd": ""
}
```

Phase 1 settings files deserialize unchanged (`serde(default)`; JS bridge
mirrors this normalization). Proven by
`settings::tests::v1_settings_without_host_access_migrate_cleanly`.

### Tauri commands (added)

`host_roots`, `host_list`, `host_read`, `host_write`, `host_mkdir`,
`host_rename`, `host_delete`, `oc_set_cwd` (28 total now). `settings_set`
rebuilds the host engine when the grant changes. `oc_set_cwd` validates the
folder (absolute, inside workspace or inside an allowed root) and recycles the
managed `opencode serve` so the CLI actually changes directory. `oc_send` and
`start_server` use `effective_cwd()` = `oc_cwd || workspace`.

### Bridge server (browser mode)

Mirror implementations of all eight commands with identical guardrail logic
(`resolveWithinRoot`, `denyHostTopLevel`, caps, dotfile rules) — the OS runs
identically in a plain browser, which is what makes the whole gate e2e-testable.

### UI

- **`ui/js/apps/host.js` — This PC**: root grid → per-root file browsing with
  Explorer visuals; New folder / New text file / Rename / Delete permanently
  (with confirm); **"Use as OpenCode working folder"** → `oc_set_cwd` +
  floating-chat context chip. Disabled state offers an "Open Settings" button.
- **Notepad**: understands `host://<root>/<rel>` paths — reads, saves and
  Save-As against the host engine; window title shows `This PC/<root>/<rel>`.
- **Settings → Host access**: master toggle + per-root checkboxes (granted /
  blocked pills) + Save; emits `os:host-changed`.
- **Setup wizard**: new step 5 of 6 — "Host access (optional)", one checkbox,
  grants Home only; finishing without it keeps everything locked.
- **Desktop**: the This PC icon exists only while host access is granted
  (`desktop.renderIcons` rebuilds on `os:host-changed` — no restart needed).
- Path scheme helpers `isHostPath / parseHostPath / formatHostPath` live in
  `ui/js/lib/path-util.js` (pure, unit-tested).

## Deliberate scope decisions (vs. an unbounded "host access" reading)

- No shell/PTY execution on the host — that is Phase 3's "Full shell as app".
- No ambient FS access for the chat: the CLI reaches a host folder only through
  the explicit `oc_set_cwd` consent flow (validated against the allowlist).
- No write access to hidden/system locations even if a user grants the root.
- Read/write caps at 2 MiB keep the webview responsive; larger files get an
  explicit "use a native editor" message instead of a frozen app.

## Test matrix

| Layer | What proves Gate 4 |
|---|---|
| Rust (12 new tests in `host.rs` + 1 in `settings.rs`) | discovery, disabled/non-allowed rejection, roundtrip, traversal, symlink escape, hidden dirs, deny-listed system dirs, size caps, v1→v2 migration |
| Bridge HTTP (6 new tests) | grant flow over real HTTP, hidden/traversal attacks, revoke-instantly-blocks, `oc_set_cwd` validation + persistence |
| E2E Scenario C (6 new checks) | This PC icon appears ↔ disappears with the grant, browse real HOME (sandboxed fake `$HOME`), create/rename on real disk, Notepad edit + Ctrl+S on a real host file, chat re-cwd chip, revoke → blocked state |
| E2E Scenario B (2 updated checks) | wizard consent step shown; finishing without granting leaves host access OFF |

Run everything: `npm run gates:verify`.
