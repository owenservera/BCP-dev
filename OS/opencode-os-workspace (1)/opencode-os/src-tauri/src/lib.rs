//! OpenCode OS — Tauri application layer.
//!
//! Thin adapter: exposes opencode-core's engine as IPC commands and streams
//! chat output to the webview through the `oc://stream` event.

use opencode_core::fs_engine::FsError;
use opencode_core::host::{discover_roots, HostEngine, HostRoot};
use opencode_core::run_stream::{parse_line, StreamEvent};
use opencode_core::settings::{load as settings_load, Settings};
use opencode_core::{
    FsEngine, ManagedServer, SpawnConfig, ServerEndpoint,
};
use serde::Serialize;
use std::io::{BufRead, BufReader};
use std::process::{Command, Stdio};
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::{Arc, Mutex};
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use tauri::{AppHandle, Emitter, State, Manager};

pub struct AppState {
    pub fs: Mutex<FsEngine>,
    pub host: Mutex<HostEngine>,
    pub server: Mutex<Option<ManagedServer>>,
    pub settings: Mutex<Settings>,
    pub task_seq: AtomicU64,
    pub setup_running: AtomicU64, // 0 = idle, else task id
}

/// Shared app state managed as `Arc<AppState>` so background workers can own it.
pub type SharedState = Arc<AppState>;

impl AppState {
    pub fn new() -> Self {
        let settings = settings_load();
        let workspace = settings.workspace.clone();
        if let Err(e) = std::fs::create_dir_all(&workspace) {
            eprintln!("cannot create workspace {workspace}: {e}");
        }
        AppState {
            fs: Mutex::new(FsEngine::new(workspace.into())),
            host: Mutex::new(HostEngine::from_settings()),
            server: Mutex::new(None),
            settings: Mutex::new(settings),
            task_seq: AtomicU64::new(1),
            setup_running: AtomicU64::new(0),
        }
    }
}

fn fs_err_to_string(e: FsError) -> String {
    e.to_string()
}

fn now_ms() -> u128 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_millis())
        .unwrap_or(0)
}

// ---------------------------------------------------------------------------
// System / info
// ---------------------------------------------------------------------------

#[derive(Serialize)]
pub struct SysInfo {
    home: String,
    workspace: String,
    os: String,
    app_version: String,
    opencode_installed: bool,
    opencode_version: Option<String>,
}

#[tauri::command]
async fn sys_info(state: State<'_, SharedState>) -> Result<SysInfo, String> {
    let settings = state.settings.lock().unwrap().clone();
    let home = std::env::var("USERPROFILE")
        .or_else(|_| std::env::var("HOME"))
        .unwrap_or_default();
    Ok(SysInfo {
        home,
        workspace: settings.workspace,
        os: std::env::consts::OS.to_string(),
        app_version: env!("CARGO_PKG_VERSION").to_string(),
        opencode_installed: opencode_core::oc_server::cli_version("opencode").is_some(),
        opencode_version: opencode_core::oc_server::cli_version("opencode"),
    })
}

// ---------------------------------------------------------------------------
// Filesystem (workspace-sandboxed)
// ---------------------------------------------------------------------------

#[tauri::command]
fn fs_list(state: State<'_, SharedState>, path: String) -> Result<Vec<opencode_core::Entry>, String> {
    state.fs.lock().unwrap().list(&path).map_err(fs_err_to_string)
}

#[tauri::command]
fn fs_read(state: State<'_, SharedState>, path: String) -> Result<String, String> {
    state.fs.lock().unwrap().read_text(&path).map_err(fs_err_to_string)
}

#[tauri::command]
fn fs_write(state: State<'_, SharedState>, path: String, content: String) -> Result<u64, String> {
    state
        .fs
        .lock()
        .unwrap()
        .write_text(&path, &content)
        .map_err(fs_err_to_string)
}

#[tauri::command]
fn fs_mkdir(state: State<'_, SharedState>, path: String) -> Result<(), String> {
    state.fs.lock().unwrap().mkdir(&path).map(|_| ()).map_err(fs_err_to_string)
}

#[tauri::command]
fn fs_rename(state: State<'_, SharedState>, from: String, to: String) -> Result<(), String> {
    state
        .fs
        .lock()
        .unwrap()
        .rename(&from, &to)
        .map_err(fs_err_to_string)
}

#[tauri::command]
fn fs_trash(state: State<'_, SharedState>, path: String) -> Result<String, String> {
    state.fs.lock().unwrap().trash(&path).map_err(fs_err_to_string)
}

#[tauri::command]
fn trash_list(state: State<'_, SharedState>) -> Result<Vec<opencode_core::Entry>, String> {
    state.fs.lock().unwrap().trash_list().map_err(fs_err_to_string)
}

#[tauri::command]
fn trash_delete(state: State<'_, SharedState>, name: String) -> Result<(), String> {
    state
        .fs
        .lock()
        .unwrap()
        .trash_delete(&name)
        .map_err(fs_err_to_string)
}

#[tauri::command]
fn trash_empty(state: State<'_, SharedState>) -> Result<usize, String> {
    state.fs.lock().unwrap().trash_empty().map_err(fs_err_to_string)
}

// ---------------------------------------------------------------------------
// Host access (Phase 2 — "This PC", governed by settings.host_access)
// ---------------------------------------------------------------------------

#[derive(Serialize)]
pub struct HostRootView {
    pub id: String,
    pub label: String,
    pub path: String,
    pub kind: String,
    pub allowed: bool,
}

#[tauri::command]
fn host_roots(state: State<'_, SharedState>) -> Result<Vec<HostRootView>, String> {
    let settings = state.settings.lock().unwrap().clone();
    let allowed = &settings.host_access.allowed_roots;
    Ok(discover_roots()
        .into_iter()
        .map(|HostRoot { id, label, path, kind }| HostRootView {
            allowed: allowed.iter().any(|a| a == &id),
            id,
            label,
            path,
            kind,
        })
        .collect())
}

#[tauri::command]
fn host_list(state: State<'_, SharedState>, root: String, path: String) -> Result<Vec<opencode_core::Entry>, String> {
    state.host.lock().unwrap().list(&root, &path).map_err(fs_err_to_string)
}

#[tauri::command]
fn host_read(state: State<'_, SharedState>, root: String, path: String) -> Result<String, String> {
    state.host.lock().unwrap().read_text(&root, &path).map_err(fs_err_to_string)
}

#[tauri::command]
fn host_write(state: State<'_, SharedState>, root: String, path: String, content: String) -> Result<u64, String> {
    state
        .host
        .lock()
        .unwrap()
        .write_text(&root, &path, &content)
        .map_err(fs_err_to_string)
}

#[tauri::command]
fn host_mkdir(state: State<'_, SharedState>, root: String, path: String) -> Result<(), String> {
    state.host.lock().unwrap().mkdir(&root, &path).map(|_| ()).map_err(fs_err_to_string)
}

#[tauri::command]
fn host_rename(state: State<'_, SharedState>, root: String, from: String, to: String) -> Result<(), String> {
    state
        .host
        .lock()
        .unwrap()
        .rename(&root, &from, &to)
        .map_err(fs_err_to_string)
}

#[tauri::command]
fn host_delete(state: State<'_, SharedState>, root: String, path: String) -> Result<(), String> {
    state.host.lock().unwrap().delete(&root, &path).map_err(fs_err_to_string)
}

/// Effective working directory for the OpenCode CLI (oc_cwd overrides workspace).
fn effective_cwd(settings: &Settings) -> String {
    if settings.oc_cwd.trim().is_empty() {
        settings.workspace.clone()
    } else {
        settings.oc_cwd.clone()
    }
}

fn validate_oc_cwd(state: &AppState, path: &str) -> Result<(), String> {
    let p = std::path::PathBuf::from(path);
    if !p.is_absolute() {
        return Err("working folder must be an absolute path".into());
    }
    let settings = state.settings.lock().unwrap().clone();
    if p == std::path::PathBuf::from(&settings.workspace) {
        return Ok(());
    }
    if !settings.host_access.enabled {
        return Err("Host access is disabled — enable it in Settings first.".into());
    }
    let canon = p.canonicalize().map_err(|_| format!("folder not found: {path}"))?;
    let roots = discover_roots();
    for rid in &settings.host_access.allowed_roots {
        if let Some(r) = roots.iter().find(|r| &r.id == rid) {
            if let Ok(rc) = std::path::PathBuf::from(&r.path).canonicalize() {
                if canon.starts_with(&rc) {
                    return Ok(());
                }
            }
        }
    }
    Err("folder is not inside an allowed host root".into())
}

/// Point the OpenCode CLI at a new working folder (Phase 2: chat on host dirs).
#[tauri::command]
fn oc_set_cwd(state: State<'_, SharedState>, path: String) -> Result<String, String> {
    let target = path.trim().to_string();
    if !target.is_empty() {
        validate_oc_cwd(&state, &target)?;
    }
    let mut guard = state.settings.lock().unwrap();
    guard.oc_cwd = target;
    let cwd = effective_cwd(&guard);
    opencode_core::settings::save(&guard)?;
    drop(guard);
    // The managed server is bound to the old workdir — recycle it.
    if let Some(mut srv) = state.server.lock().unwrap().take() {
        srv.stop();
    }
    Ok(cwd)
}

// ---------------------------------------------------------------------------
// OpenCode server lifecycle + chat
// ---------------------------------------------------------------------------

fn start_server_locked(state: &AppState) -> Result<ServerEndpoint, String> {
    let mut guard = state.server.lock().unwrap();
    if let Some(srv) = guard.as_ref() {
        return Ok(srv.endpoint.clone());
    }
    let settings = state.settings.lock().unwrap().clone();
    let cfg = SpawnConfig {
        bin: "opencode".to_string(),
        workdir: effective_cwd(&settings).into(),
        ..SpawnConfig::default()
    };
    let mut env: Vec<(String, String)> = Vec::new();
    if !settings.zen_api_key.is_empty() {
        env.push(("OPENCODE_API_KEY".to_string(), settings.zen_api_key.clone()));
    }
    let managed = opencode_core::spawn_server(&cfg, &env)?;
    let endpoint = managed.endpoint.clone();
    *guard = Some(managed);
    Ok(endpoint)
}

#[tauri::command]
async fn oc_start(state: State<'_, SharedState>) -> Result<ServerEndpoint, String> {
    let st: SharedState = state.inner().clone();
    tauri::async_runtime::spawn_blocking(move || start_server_locked(&st))
        .await
        .map_err(|e| e.to_string())?
}

#[tauri::command]
async fn oc_stop(state: State<'_, SharedState>) -> Result<(), String> {
    if let Some(mut srv) = state.server.lock().unwrap().take() {
        srv.stop();
    }
    Ok(())
}

#[derive(Serialize)]
pub struct OcStatus {
    running: bool,
    base_url: Option<String>,
}

#[tauri::command]
fn oc_status(state: State<'_, SharedState>) -> OcStatus {
    let guard = state.server.lock().unwrap();
    match guard.as_ref() {
        Some(srv) => OcStatus {
            running: true,
            base_url: Some(srv.endpoint.base_url.clone()),
        },
        None => OcStatus {
            running: false,
            base_url: None,
        },
    }
}

#[tauri::command]
async fn oc_sessions(state: State<'_, SharedState>) -> Result<serde_json::Value, String> {
    let st: SharedState = state.inner().clone();
    let endpoint = tauri::async_runtime::spawn_blocking(move || start_server_locked(&st))
        .await
        .map_err(|e| e.to_string())??;
    opencode_core::oc_server::list_sessions(&endpoint)
}

/// Kick off one chat turn: spawns `opencode run --format json` in a background
/// thread, parses NDJSON into normalized events and emits `oc://stream`.
/// Returns the task id so the UI can correlate events.
#[tauri::command]
fn oc_send(
    app: AppHandle,
    state: State<'_, SharedState>,
    session_id: Option<String>,
    model: String,
    text: String,
) -> Result<u64, String> {
    let settings = state.settings.lock().unwrap().clone();
    let task = state.task_seq.fetch_add(1, Ordering::SeqCst);
    let workspace = effective_cwd(&settings);

    let mut cmd = Command::new("opencode");
    cmd.current_dir(&workspace)
        .arg("run")
        .arg("--format")
        .arg("json")
        .arg("--dir")
        .arg(&workspace)
        .arg("-m")
        .arg(&model);
    if let Some(sid) = &session_id {
        cmd.arg("-s").arg(sid);
    }
    cmd.arg(&text);
    if !settings.zen_api_key.is_empty() {
        cmd.env("OPENCODE_API_KEY", &settings.zen_api_key);
    }
    cmd.stdout(Stdio::piped()).stderr(Stdio::piped());

    let mut child = cmd.spawn().map_err(|e| format!("cannot run opencode: {e}"))?;
    let stdout = child.stdout.take().ok_or("no stdout")?;
    let stderr = child.stderr.take().ok_or("no stderr")?;

    // Drain stderr so the pipe never deadlocks; keep last 2 KiB for errors.
    let err_tail = Arc::new(Mutex::new(String::new()));
    {
        let err_tail = err_tail.clone();
        std::thread::spawn(move || {
            let mut buf = String::new();
            for line in BufReader::new(stderr).lines().map_while(Result::ok) {
                if buf.len() + line.len() > 2048 {
                    buf.clear();
                }
                buf.push_str(&line);
                buf.push('\n');
            }
            *err_tail.lock().unwrap() = buf;
        });
    }

    // Child behind a mutex so the watchdog can kill a hung process.
    let child_slot = Arc::new(Mutex::new(child));
    let last_activity = Arc::new(AtomicU64::new(now_ms() as u64));
    let emitted_done = Arc::new(AtomicU64::new(0));

    {
        // watchdog: kill if no output for 90 s or older than 10 min total.
        let child_slot = child_slot.clone();
        let last_activity = last_activity.clone();
        std::thread::spawn(move || loop {
            std::thread::sleep(Duration::from_secs(3));
            let idle_ms = now_ms() as u64 - last_activity.load(Ordering::SeqCst);
            let mut guard = child_slot.lock().unwrap();
            match guard.try_wait() {
                Ok(Some(_)) => break, // already exited
                Ok(None) => {
                    if idle_ms > 90_000 {
                        let _ = guard.kill();
                        break;
                    }
                }
                Err(_) => break,
            }
        });
    }

    let app_handle = app.clone();
    let task_state = task;
    let done_flag = emitted_done.clone();
    std::thread::spawn(move || {
        let emit = |ev: serde_json::Value| {
            let _ = app_handle.emit(
                "oc://stream",
                serde_json::json!({ "task": task_state, "ev": ev }),
            );
        };
        let mut seen_session: Option<String> = None;
        for line in BufReader::new(stdout).lines().map_while(Result::ok) {
            last_activity.store(now_ms() as u64, Ordering::SeqCst);
            for ev in parse_line(&line) {
                match ev {
                    StreamEvent::Delta(t) => {
                        emit(serde_json::json!({ "t": "delta", "text": t }))
                    }
                    StreamEvent::Session(s) => {
                        if seen_session.is_none() {
                            seen_session = Some(s.clone());
                            emit(serde_json::json!({ "t": "session", "id": s }));
                        }
                    }
                    StreamEvent::Error(m) => emit(serde_json::json!({ "t": "error", "message": m })),
                    StreamEvent::Done => {
                        done_flag.store(1, Ordering::SeqCst);
                        emit(serde_json::json!({ "t": "done" }));
                    }
                }
            }
        }
        let status = {
            let mut guard = child_slot.lock().unwrap();
            guard.wait().ok()
        };
        if done_flag.load(Ordering::SeqCst) == 0 {
            let stderr_txt = err_tail.lock().unwrap().clone();
            if let Some(s) = seen_session {
                emit(serde_json::json!({ "t": "session", "id": s }));
            }
            // No explicit done event and stream ended: decide why.
            if let Some(st) = status {
                if !st.success() {
                    let hint = if stderr_txt.contains("auth")
                        || stderr_txt.contains("401")
                        || stderr_txt.contains("Unauthorized")
                    {
                        "Your OpenCode Zen API key is missing or invalid. Open Settings to add one."
                    } else if stderr_txt.trim().is_empty() {
                        "The OpenCode CLI ended without answering (no model output)."
                    } else {
                        "The OpenCode CLI reported an error."
                    };
                    emit(
                        serde_json::json!({ "t": "error", "message": hint, "stderr": stderr_txt.trim() }),
                    );
                }
                emit(serde_json::json!({ "t": "done" }));
            } else {
                emit(serde_json::json!({ "t": "error", "message": "The model took too long and was stopped." }));
                emit(serde_json::json!({ "t": "done" }));
            }
        }
    });

    Ok(task)
}

// ---------------------------------------------------------------------------
// Settings + first-run setup
// ---------------------------------------------------------------------------

#[tauri::command]
fn settings_get(state: State<'_, SharedState>) -> Result<Settings, String> {
    Ok(state.settings.lock().unwrap().clone())
}

#[tauri::command]
fn settings_set(state: State<'_, SharedState>, settings: Settings) -> Result<(), String> {
    // Workspace changes re-root the sandboxed filesystem.
    let mut guard = state.settings.lock().unwrap();
    let workspace_changed = guard.workspace != settings.workspace;
    let host_changed = guard.host_access.enabled != settings.host_access.enabled
        || guard.host_access.allowed_roots != settings.host_access.allowed_roots;
    opencode_core::settings::save(&settings)?;
    if workspace_changed {
        std::fs::create_dir_all(&settings.workspace).map_err(|e| e.to_string())?;
        *state.fs.lock().unwrap() = FsEngine::new(settings.workspace.clone().into());
    }
    if host_changed {
        *state.host.lock().unwrap() =
            HostEngine::new(discover_roots(), settings.host_access.allowed_roots.clone(), settings.host_access.enabled);
    }
    *guard = settings;
    Ok(())
}

#[derive(Serialize)]
pub struct SetupStatus {
    opencode_installed: bool,
    opencode_version: Option<String>,
    zen_key_set: bool,
    wizard_done: bool,
    workspace: String,
    os: String,
}

#[tauri::command]
fn setup_status(state: State<'_, SharedState>) -> SetupStatus {
    let s = state.settings.lock().unwrap().clone();
    let version = opencode_core::oc_server::cli_version("opencode");
    SetupStatus {
        opencode_installed: version.is_some(),
        opencode_version: version,
        zen_key_set: !s.zen_api_key.is_empty(),
        wizard_done: s.wizard_done,
        workspace: s.workspace,
        os: std::env::consts::OS.to_string(),
    }
}

/// Install the OpenCode CLI using the official per-OS installer, streaming a
/// progress log to `oc://setup`. Used by the first-run wizard (Gate 3.2).
#[tauri::command]
fn setup_install_opencode(app: AppHandle, state: State<'_, SharedState>) -> Result<u64, String> {
    if state.setup_running.swap(1, Ordering::SeqCst) != 0 {
        return Err("setup already running".into());
    }
    let task = state.task_seq.fetch_add(1, Ordering::SeqCst);
    let app_handle = app.clone();
    std::thread::spawn(move || {
        let emit = |line: &str, done: bool, ok: bool| {
            let _ = app_handle.emit(
                "oc://setup",
                serde_json::json!({ "task": task, "line": line, "done": done, "ok": ok }),
            );
        };
        let (program, args): (&str, Vec<&str>) = if cfg!(target_os = "windows") {
            (
                "powershell",
                vec!["-NoProfile", "-Command", "irm https://opencode.ai/install.ps1 | iex"],
            )
        } else {
            ("sh", vec!["-c", "curl -fsSL https://opencode.ai/install | bash"])
        };
        emit(&format!("Running installer: {program} {}", args.join(" ")), false, true);
        let result = Command::new(program)
            .args(&args)
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .output();
        match result {
            Ok(out) => {
                let ok = out.status.success();
                let tail = String::from_utf8_lossy(&out.stderr);
                let stdout = String::from_utf8_lossy(&out.stdout);
                for l in stdout.lines().rev().take(3).collect::<Vec<_>>().into_iter().rev() {
                    emit(l, false, true);
                }
                if !ok && !tail.trim().is_empty() {
                    emit(tail.trim(), false, false);
                }
                let version = opencode_core::oc_server::cli_version("opencode");
                emit(
                    &match &version {
                        Some(v) => format!("OpenCode CLI installed: {v}"),
                        None => "Installer finished, but opencode was not found on PATH yet — you may need to restart OpenCode OS.".into(),
                    },
                    true,
                    ok,
                );
            }
            Err(e) => emit(&format!("installer failed to start: {e}"), true, false),
        }
        // Release the setup lock so the wizard can retry after a restart fix.
        app_handle
            .state::<SharedState>()
            .setup_running
            .store(0, Ordering::SeqCst);
    });
    Ok(task)
}

#[tauri::command]
fn app_quit(app: AppHandle) -> Result<(), String> {
    // Dropping AppState kills the managed opencode server.
    app.exit(0);
    #[allow(unreachable_code)]
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            app.manage(Arc::new(AppState::new()));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            sys_info,
            fs_list,
            fs_read,
            fs_write,
            fs_mkdir,
            fs_rename,
            fs_trash,
            trash_list,
            trash_delete,
            trash_empty,
            host_roots,
            host_list,
            host_read,
            host_write,
            host_mkdir,
            host_rename,
            host_delete,
            oc_start,
            oc_stop,
            oc_status,
            oc_sessions,
            oc_send,
            oc_set_cwd,
            settings_get,
            settings_set,
            setup_status,
            setup_install_opencode,
            app_quit,
        ])
        .run(tauri::generate_context!())
        .expect("error while running OpenCode OS");
}
