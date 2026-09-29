//! Settings store — a small JSON file under the user config directory.
//! Also derives the right per-OS config/data locations without external deps.

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

/// Phase 2 — governed access to the real machine. Off by default: the OS is
/// safe by default and host access is an explicit, per-root opt-in.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HostAccess {
    /// Master switch — This PC / host operations fail while false.
    #[serde(default)]
    pub enabled: bool,
    /// Root ids the user granted (subset of discover_roots() ids).
    #[serde(default)]
    pub allowed_roots: Vec<String>,
}

impl Default for HostAccess {
    fn default() -> Self {
        HostAccess { enabled: false, allowed_roots: Vec::new() }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Settings {
    /// Absolute path of the user workspace shown on the desktop.
    pub workspace: String,
    /// OpenCode Zen API key (stored 0600). Empty when the user skipped setup.
    #[serde(default)]
    pub zen_api_key: String,
    /// Default model in provider/model form (zen free tier default).
    #[serde(default = "default_model")]
    pub model: String,
    /// First-run wizard completed.
    #[serde(default)]
    pub wizard_done: bool,
    /// Phase 2: governed host access (This PC). Defaults to disabled.
    #[serde(default)]
    pub host_access: HostAccess,
    /// Phase 2: working directory handed to `opencode run/serve` when the user
    /// points the chat at a host folder. Empty = use `workspace`.
    #[serde(default)]
    pub oc_cwd: String,
}

fn default_model() -> String {
    "opencode/space-bunny-free".to_string()
}

impl Default for Settings {
    fn default() -> Self {
        Settings {
            workspace: default_workspace(),
            zen_api_key: String::new(),
            model: default_model(),
            wizard_done: false,
            host_access: HostAccess::default(),
            oc_cwd: String::new(),
        }
    }
}

/// User config dir: %APPDATA% on Windows, $XDG_CONFIG_HOME or ~/.config elsewhere.
pub fn config_dir() -> PathBuf {
    if let Ok(appdata) = std::env::var("APPDATA") {
        if !appdata.trim().is_empty() {
            return PathBuf::from(appdata).join("opencode-os");
        }
    }
    let base = std::env::var("XDG_CONFIG_HOME")
        .ok()
        .filter(|s| !s.trim().is_empty())
        .map(PathBuf::from)
        .or_else(|| std::env::var("HOME").ok().map(|h| PathBuf::from(h).join(".config")))
        .unwrap_or_else(|| PathBuf::from("."));
    base.join("opencode-os")
}

/// A friendly default workspace: ~/OpenCodeWorkspace
pub fn default_workspace() -> String {
    let home = std::env::var("USERPROFILE")
        .or_else(|_| std::env::var("HOME"))
        .unwrap_or_else(|_| ".".to_string());
    PathBuf::from(home)
        .join("OpenCodeWorkspace")
        .to_string_lossy()
        .to_string()
}

pub fn settings_path() -> PathBuf {
    config_dir().join("settings.json")
}

pub fn load() -> Settings {
    fs::read_to_string(settings_path())
        .ok()
        .and_then(|s| serde_json::from_str(&s).ok())
        .unwrap_or_default()
}

pub fn save(settings: &Settings) -> Result<(), String> {
    let dir = config_dir();
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let path = settings_path();
    // 0600-ish best effort on unix; ignore failures on other platforms.
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        let _ = fs::set_permissions(&dir, fs::Permissions::from_mode(0o700));
    }
    let json = serde_json::to_string_pretty(settings).map_err(|e| e.to_string())?;
    fs::write(&path, json).map_err(|e| e.to_string())?;
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        let _ = fs::set_permissions(&path, fs::Permissions::from_mode(0o600));
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn defaults_are_sane() {
        let s = Settings::default();
        assert!(!s.wizard_done);
        assert!(s.model.contains('/'));
        assert!(!s.workspace.is_empty());
    }

    #[test]
    fn v1_settings_without_host_access_migrate_cleanly() {
        // A Phase 1 settings file must deserialize with Phase 2 defaults.
        let v1 = r#"{
            "workspace": "/tmp/ws",
            "zen_api_key": "",
            "model": "opencode/space-bunny-free",
            "wizard_done": true
        }"#;
        let s: Settings = serde_json::from_str(v1).unwrap();
        assert!(s.wizard_done);
        assert!(!s.host_access.enabled, "host access must default to OFF");
        assert!(s.host_access.allowed_roots.is_empty());
        assert!(s.oc_cwd.is_empty());
    }

    #[test]
    fn save_load_roundtrip_and_corrupt_fallback() {
        let dir = tempfile::tempdir().unwrap();
        // Tests touching env vars are merged into one test to avoid parallel races.
        std::env::set_var("XDG_CONFIG_HOME", dir.path());
        let s = Settings {
            workspace: "/tmp/ws".into(),
            zen_api_key: "sk-zen-test".into(),
            model: "opencode/nemotron-3-ultra-free".into(),
            wizard_done: true,
            host_access: HostAccess { enabled: true, allowed_roots: vec!["home".into()] },
            oc_cwd: "/tmp/ws/project".into(),
        };
        save(&s).unwrap();
        let loaded = load();
        assert_eq!(loaded.workspace, "/tmp/ws");
        assert_eq!(loaded.zen_api_key, "sk-zen-test");
        assert!(loaded.wizard_done);
        assert!(loaded.host_access.enabled);
        assert_eq!(loaded.host_access.allowed_roots, vec!["home"]);
        assert_eq!(loaded.oc_cwd, "/tmp/ws/project");

        // Corrupt file -> defaults, never a crash.
        std::fs::write(settings_path(), "{not json").unwrap();
        let fallback = load();
        assert!(!fallback.wizard_done);
        std::env::remove_var("XDG_CONFIG_HOME");
    }
}
