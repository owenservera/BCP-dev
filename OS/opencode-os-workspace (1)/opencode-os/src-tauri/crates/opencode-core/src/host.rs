//! Host access — Phase 2 "Host access as an app".
//!
//! Phase 1 kept every file operation inside a sandboxed workspace. Phase 2
//! graduates the desktop to *governed* access to the real machine:
//!
//! - `discover_roots()` enumerates sensible host roots (user home, drives,
//!   mounted volumes) without ever erroring.
//! - `HostEngine` exposes the same operation surface as `FsEngine` but rooted
//!   at a host root, behind three gates:
//!     1. global opt-in (`host_access.enabled`),
//!     2. a per-root allowlist (`host_access.allowed_roots`),
//!     3. a deny-list of system locations plus the full Phase 1 path rulebook
//!        (no `..`, no backslashes, no absolute paths, symlink-escape checks).
//!
//! Denying is always the fallback: any doubt -> blocked.

use crate::fs_engine::{Entry, FsError};
use serde::Serialize;
use std::fs;
use std::path::{Component, Path, PathBuf};
use std::time::SystemTime;

/// Maximum bytes a single host file read may return (protect the webview).
const MAX_READ_BYTES: u64 = 2 * 1024 * 1024;
/// Maximum bytes accepted for a single host file write.
const MAX_WRITE_BYTES: usize = 2 * 1024 * 1024;

#[derive(Debug, Clone, Serialize)]
pub struct HostRoot {
    /// Stable id used by the UI and the settings allowlist.
    pub id: String,
    /// Human label ("Home", "C:", "Backup USB").
    pub label: String,
    /// Absolute host path of the root.
    pub path: String,
    /// "home" | "drive" | "volume" | "dir"
    pub kind: String,
}

/// Directories we never touch inside a non-home root (Windows system land).
const DENY_TOP_LEVEL: &[&str] = &[
    "Windows",
    "Program Files",
    "Program Files (x86)",
    "ProgramData",
    "$Recycle.Bin",
    "System Volume Information",
    "Recovery",
    "boot",
    "proc",
    "sys",
    "dev",
    "etc",
];

// ---------------------------------------------------------------------------
// Discovery
// ---------------------------------------------------------------------------

/// Enumerate candidate host roots. Best-effort by design: a missing home or
/// unreadable /media never fails the call, it just yields fewer roots.
pub fn discover_roots() -> Vec<HostRoot> {
    let mut out = Vec::new();

    // 1. the user's home directory — the primary, friendliest root.
    if let Some(home) = home_dir() {
        out.push(HostRoot {
            id: "home".to_string(),
            label: "Home".to_string(),
            path: home.to_string_lossy().to_string(),
            kind: "home".to_string(),
        });
    }

    // 2. Windows drives (A:..Z:) / other roots.
    if cfg!(target_os = "windows") {
        for letter in b'A'..=b'Z' {
            let drive = format!("{}:\\", letter as char);
            let p = PathBuf::from(&drive);
            if p.is_dir() {
                let is_system = home_dir()
                    .map(|h| h.to_string_lossy().to_uppercase().starts_with(&drive.to_uppercase()))
                    .unwrap_or(false);
                if !is_system {
                    out.push(HostRoot {
                        id: format!("drive_{}", letter as char),
                        label: format!("{}\\", letter as char),
                        path: drive,
                        kind: "drive".to_string(),
                    });
                }
            }
        }
    } else if cfg!(target_os = "macos") {
        for vol in list_dirs("/Volumes") {
            out.push(HostRoot {
                id: format!("vol_{}", slug(&vol)),
                label: vol.file_name().map(|n| n.to_string_lossy().to_string()).unwrap_or_default(),
                path: vol.to_string_lossy().to_string(),
                kind: "volume".to_string(),
            });
        }
    } else {
        // linux/other: mounted media locations.
        for base in ["/media", "/run/media", "/mnt"] {
            for top in list_dirs(base) {
                // /media/<user>/<vol> on modern distros — descend one level.
                let mut pushed = false;
                if base.ends_with("/media") {
                    for sub in list_dirs(&top.to_string_lossy()) {
                        out.push(HostRoot {
                            id: format!("vol_{}", slug(&sub)),
                            label: sub.file_name().map(|n| n.to_string_lossy().to_string()).unwrap_or_default(),
                            path: sub.to_string_lossy().to_string(),
                            kind: "volume".to_string(),
                        });
                        pushed = true;
                    }
                }
                if !pushed {
                    out.push(HostRoot {
                        id: format!("vol_{}", slug(&top)),
                        label: top.file_name().map(|n| n.to_string_lossy().to_string()).unwrap_or_default(),
                        path: top.to_string_lossy().to_string(),
                        kind: "volume".to_string(),
                    });
                }
            }
        }
    }

    // Never hand out more than 16 roots — consumer UI sanity.
    out.truncate(16);
    out
}

fn home_dir() -> Option<PathBuf> {
    std::env::var("USERPROFILE")
        .or_else(|_| std::env::var("HOME"))
        .ok()
        .filter(|s| !s.trim().is_empty())
        .map(PathBuf::from)
}

fn list_dirs(base: &str) -> Vec<PathBuf> {
    let b = Path::new(base);
    if !b.is_dir() {
        return Vec::new();
    }
    let mut out = Vec::new();
    if let Ok(rd) = fs::read_dir(b) {
        for e in rd.flatten() {
            let name = e.file_name().to_string_lossy().to_string();
            if name.starts_with('.') {
                continue;
            }
            if e.path().is_dir() {
                out.push(e.path());
            }
        }
    }
    out.sort();
    out
}

fn slug(p: &Path) -> String {
    p.to_string_lossy()
        .chars()
        .map(|c| if c.is_ascii_alphanumeric() { c.to_ascii_lowercase() } else { '_' })
        .collect()
}

// ---------------------------------------------------------------------------
// Guarded engine
// ---------------------------------------------------------------------------

pub struct HostEngine {
    roots: Vec<HostRoot>,
    allowed: Vec<String>,
    enabled: bool,
}

impl HostEngine {
    /// Build an engine from discovered roots + the current settings.
    pub fn new(roots: Vec<HostRoot>, allowed: Vec<String>, enabled: bool) -> Self {
        HostEngine { roots, allowed, enabled }
    }

    pub fn from_settings() -> Self {
        let s = crate::settings::load();
        Self::new(discover_roots(), s.host_access.allowed_roots, s.host_access.enabled)
    }

    fn root(&self, id: &str) -> Result<(&HostRoot, PathBuf), FsError> {
        if !self.enabled {
            return Err(FsError::OutsideWorkspace); // "host access is disabled"
        }
        if !self.allowed.iter().any(|a| a == id) {
            return Err(FsError::OutsideWorkspace); // root not allowlisted
        }
        let root = self
            .roots
            .iter()
            .find(|r| r.id == id)
            .ok_or(FsError::OutsideWorkspace)?;
        let base = PathBuf::from(&root.path);
        // Canonicalise the root itself so the `starts_with` checks below are
        // symlink-proof (e.g. /tmp -> /private/tmp on macOS).
        let canon = base
            .canonicalize()
            .map_err(|_| FsError::NotFound(root.path.clone()))?;
        Ok((root, canon))
    }

    /// Resolve `root + rel` to an absolute path, refusing escapes. Same strict
    /// component rulebook as FsEngine::resolve.
    pub fn resolve(&self, root_id: &str, rel: &str) -> Result<PathBuf, FsError> {
        let (_root, base) = self.root(root_id)?;
        let rel_t = rel.trim();
        let joined = if rel_t.is_empty() || rel_t == "." {
            base.clone()
        } else {
            let p = Path::new(rel_t);
            if p.is_absolute() || p.has_root() {
                return Err(FsError::OutsideWorkspace);
            }
            for comp in p.components() {
                match comp {
                    Component::Normal(_) | Component::CurDir => {}
                    _ => return Err(FsError::OutsideWorkspace),
                }
                if comp.as_os_str().to_string_lossy().contains('\\') {
                    return Err(FsError::OutsideWorkspace);
                }
            }
            base.join(p)
        };
        verify_within(&base, joined)
    }

    /// Deny-list enforcement happens inside every operation via `deny_top_level`.
    pub fn list(&self, root_id: &str, rel: &str) -> Result<Vec<Entry>, FsError> {
        let (root, base) = self.root(root_id)?;
        let dir = self.resolve(root_id, rel)?;
        deny_top_level(&root.kind, &base, &dir)?;
        if !dir.exists() {
            return Err(FsError::NotFound(format!("{root_id}/{rel}")));
        }
        if !dir.is_dir() {
            return Err(FsError::InvalidName(format!("{root_id}/{rel}")));
        }
        let mut out = Vec::new();
        for entry in fs::read_dir(&dir)? {
            let entry = entry?;
            let name = entry.file_name().to_string_lossy().to_string();
            if name.starts_with('.') {
                continue; // hide dotfiles, consistent with the workspace viewer
            }
            let meta = entry.metadata()?;
            let (kind, size) = if meta.is_dir() {
                ("dir".to_string(), 0)
            } else {
                ("file".to_string(), meta.len())
            };
            let modified = meta
                .modified()
                .unwrap_or(SystemTime::UNIX_EPOCH)
                .duration_since(SystemTime::UNIX_EPOCH)
                .map(|d| d.as_millis())
                .unwrap_or(0);
            out.push(Entry { name, kind, size, modified });
        }
        out.sort_by(|a, b| match (a.kind.as_str(), b.kind.as_str()) {
            ("dir", "dir") | ("file", "file") => a.name.to_lowercase().cmp(&b.name.to_lowercase()),
            ("dir", _) => std::cmp::Ordering::Less,
            _ => std::cmp::Ordering::Greater,
        });
        Ok(out)
    }

    pub fn read_text(&self, root_id: &str, rel: &str) -> Result<String, FsError> {
        let (root, base) = self.root(root_id)?;
        let p = self.resolve(root_id, rel)?;
        deny_top_level(&root.kind, &base, &p)?;
        if p.is_dir() {
            return Err(FsError::InvalidName(rel.to_string()));
        }
        let meta = fs::metadata(&p)?;
        if meta.len() > MAX_READ_BYTES {
            return Err(FsError::Io(format!(
                "file is larger than {} MB — open it with a native editor instead",
                MAX_READ_BYTES / (1024 * 1024)
            )));
        }
        Ok(fs::read_to_string(p)?)
    }

    pub fn write_text(&self, root_id: &str, rel: &str, content: &str) -> Result<u64, FsError> {
        if content.len() > MAX_WRITE_BYTES {
            return Err(FsError::Io("write refused: content larger than 2 MB".to_string()));
        }
        let (root, base) = self.root(root_id)?;
        let p = self.resolve(root_id, rel)?;
        deny_top_level(&root.kind, &base, &p)?;
        // refuse writes INTO hidden dirs (e.g. ~/.ssh) even though list hides them
        for comp in Path::new(rel.trim()).components() {
            if let Component::Normal(c) = comp {
                let s = c.to_string_lossy();
                if s.starts_with('.') {
                    return Err(FsError::OutsideWorkspace);
                }
            }
        }
        if let Some(parent) = p.parent() {
            fs::create_dir_all(parent)?;
        }
        fs::write(&p, content)?;
        Ok(content.len() as u64)
    }

    pub fn mkdir(&self, root_id: &str, rel: &str) -> Result<PathBuf, FsError> {
        if rel.contains('/') {
            return Err(FsError::InvalidName(rel.to_string()));
        }
        let (root, base) = self.root(root_id)?;
        let p = self.resolve(root_id, rel)?;
        deny_top_level(&root.kind, &base, &p)?;
        let name = p
            .file_name()
            .map(|n| n.to_string_lossy().to_string())
            .unwrap_or_default();
        if name.is_empty() || name.starts_with('.') {
            return Err(FsError::InvalidName(name));
        }
        if p.exists() {
            return Err(FsError::AlreadyExists(rel.to_string()));
        }
        fs::create_dir_all(&p)?;
        Ok(p)
    }

    pub fn rename(&self, root_id: &str, from_rel: &str, to_rel: &str) -> Result<(), FsError> {
        let (root, base) = self.root(root_id)?;
        let from = self.resolve(root_id, from_rel)?;
        let to = self.resolve(root_id, to_rel)?;
        deny_top_level(&root.kind, &base, &from)?;
        deny_top_level(&root.kind, &base, &to)?;
        let name = to
            .file_name()
            .map(|n| n.to_string_lossy().to_string())
            .unwrap_or_default();
        if name.is_empty() || name.starts_with('.') {
            return Err(FsError::InvalidName(name));
        }
        if !from.exists() {
            return Err(FsError::NotFound(from_rel.to_string()));
        }
        if to.exists() {
            return Err(FsError::AlreadyExists(to_rel.to_string()));
        }
        fs::rename(from, to)?;
        Ok(())
    }

    /// Permanent delete on the host — the workspace Recycle Bin does not apply.
    /// The UI must confirm before calling this.
    pub fn delete(&self, root_id: &str, rel: &str) -> Result<(), FsError> {
        let (root, base) = self.root(root_id)?;
        let p = self.resolve(root_id, rel)?;
        deny_top_level(&root.kind, &base, &p)?;
        if rel.trim().is_empty() || rel.trim() == "." {
            return Err(FsError::OutsideWorkspace); // never delete the root itself
        }
        if !p.exists() {
            return Err(FsError::NotFound(rel.to_string()));
        }
        if p.is_dir() {
            fs::remove_dir_all(p)
        } else {
            fs::remove_file(p)
        }
        .map_err(FsError::from)
    }
}

/// Block the well-known system top-level dirs inside non-home roots. Checked
/// against the first component of `resolved` relative to the canonical root
/// base (both are canonicalized, so strip_prefix is reliable).
fn deny_top_level(root_kind: &str, base: &Path, resolved: &Path) -> Result<(), FsError> {
    if root_kind == "home" {
        return Ok(());
    }
    let rel = resolved.strip_prefix(base).unwrap_or_else(|_| resolved);
    if let Some(c) = rel.components().next() {
        let name = c.as_os_str().to_string_lossy().to_string();
        if DENY_TOP_LEVEL.iter().any(|d| d.eq_ignore_ascii_case(&name)) {
            return Err(FsError::OutsideWorkspace);
        }
    }
    Ok(())
}

/// Canonicalise the deepest existing ancestor of `target` and require it to
/// stay within `base` — blocks symlink escapes (same strategy as FsEngine).
fn verify_within(base: &Path, target: PathBuf) -> Result<PathBuf, FsError> {
    let mut existing = target.clone();
    let mut suffix = Vec::new();
    while !existing.exists() {
        match existing.parent() {
            Some(p) => {
                suffix.push(existing.file_name().unwrap_or_default().to_os_string());
                existing = p.to_path_buf();
            }
            None => break,
        }
    }
    let canon = existing
        .canonicalize()
        .map_err(|e| FsError::Io(e.to_string()))?;
    if !canon.starts_with(base) {
        return Err(FsError::OutsideWorkspace);
    }
    let mut out = canon;
    for part in suffix.into_iter().rev() {
        out = out.join(part);
    }
    Ok(out)
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;

    /// Engine over a single temp-dir root, fully enabled.
    fn engine(root: &Path) -> HostEngine {
        HostEngine::new(
            vec![HostRoot {
                id: "test".to_string(),
                label: "Test".to_string(),
                path: root.to_string_lossy().to_string(),
                kind: "dir".to_string(),
            }],
            vec!["test".to_string()],
            true,
        )
    }

    fn engine_disabled(root: &Path) -> HostEngine {
        HostEngine::new(
            vec![HostRoot {
                id: "test".to_string(),
                label: "Test".to_string(),
                path: root.to_string_lossy().to_string(),
                kind: "dir".to_string(),
            }],
            vec!["test".to_string()],
            false,
        )
    }

    #[test]
    fn discover_finds_home_root() {
        let roots = discover_roots();
        assert!(roots.iter().any(|r| r.id == "home"), "home root must exist");
        assert!(roots.iter().all(|r| !r.path.is_empty()));
    }

    #[test]
    fn disabled_access_blocks_everything() {
        let tmp = tempfile::tempdir().unwrap();
        let eng = engine_disabled(tmp.path());
        let err = eng.list("test", "").unwrap_err();
        assert!(matches!(err, FsError::OutsideWorkspace));
        assert!(eng.read_text("test", "x.txt").is_err());
        assert!(eng.write_text("test", "x.txt", "v").is_err());
    }

    #[test]
    fn non_allowed_root_blocks_everything() {
        let tmp = tempfile::tempdir().unwrap();
        let eng = HostEngine::new(
            vec![HostRoot {
                id: "test".to_string(),
                label: "Test".to_string(),
                path: tmp.path().to_string_lossy().to_string(),
                kind: "dir".to_string(),
            }],
            vec![], // nothing allowed
            true,
        );
        assert!(eng.list("test", "").is_err());
    }

    #[test]
    fn unknown_root_rejected() {
        let tmp = tempfile::tempdir().unwrap();
        let eng = engine(tmp.path());
        assert!(eng.list("nope", "").is_err());
    }

    #[test]
    fn host_roundtrip_list_read_write() {
        let tmp = tempfile::tempdir().unwrap();
        let eng = engine(tmp.path());
        eng.mkdir("test", "docs").unwrap();
        let n = eng.write_text("test", "docs/hello.txt", "hi host").unwrap();
        assert_eq!(n, 7);
        assert_eq!(eng.read_text("test", "docs/hello.txt").unwrap(), "hi host");
        let entries = eng.list("test", "docs").unwrap();
        assert_eq!(entries.len(), 1);
        assert_eq!(entries[0].name, "hello.txt");
        // root listing shows the dir
        let root_entries = eng.list("test", "").unwrap();
        assert_eq!(root_entries[0].name, "docs");
    }

    #[test]
    fn host_traversal_rejected() {
        let tmp = tempfile::tempdir().unwrap();
        let eng = engine(tmp.path());
        for evil in ["../", "sub/../../escape", "/etc/passwd", "..\\windows", "a/.."] {
            let err = eng.list("test", evil).unwrap_err();
            assert!(matches!(err, FsError::OutsideWorkspace), "{evil}");
        }
    }

    #[test]
    fn host_symlink_escape_blocked() {
        let tmp = tempfile::tempdir().unwrap();
        let outside = tempfile::tempdir().unwrap();
        std::os::unix::fs::symlink(outside.path(), tmp.path().join("link")).unwrap();
        let eng = engine(tmp.path());
        let err = eng.list("test", "link").unwrap_err();
        assert!(matches!(err, FsError::OutsideWorkspace));
    }

    #[test]
    fn host_rename_and_delete() {
        let tmp = tempfile::tempdir().unwrap();
        let eng = engine(tmp.path());
        eng.write_text("test", "a.txt", "x").unwrap();
        eng.rename("test", "a.txt", "b.txt").unwrap();
        assert_eq!(eng.read_text("test", "b.txt").unwrap(), "x");
        eng.delete("test", "b.txt").unwrap();
        assert!(eng.read_text("test", "b.txt").is_err());
        // never the root itself
        assert!(eng.delete("test", "").is_err());
        assert!(eng.delete("test", ".").is_err());
    }

    #[test]
    fn host_hidden_dirs_are_listed_never_and_writes_refused() {
        let tmp = tempfile::tempdir().unwrap();
        let eng = engine(tmp.path());
        std::fs::write(tmp.path().join(".secret"), "s").unwrap();
        std::fs::create_dir_all(tmp.path().join(".ssh")).unwrap();
        let entries = eng.list("test", "").unwrap();
        assert!(entries.is_empty(), "dotfiles must be hidden");
        assert!(eng.write_text("test", ".ssh/evil", "x").is_err());
        assert!(eng.mkdir("test", ".hidden").is_err());
    }

    #[test]
    fn host_system_dirs_denied_in_non_home_roots() {
        let tmp = tempfile::tempdir().unwrap();
        let eng = engine(tmp.path());
        // Pretend a "Windows" dir exists at the top of this root.
        std::fs::create_dir_all(tmp.path().join("Windows")).unwrap();
        let err = eng.list("test", "Windows").unwrap_err();
        assert!(matches!(err, FsError::OutsideWorkspace));
        let err = eng.write_text("test", "Windows/evil.txt", "x").unwrap_err();
        assert!(matches!(err, FsError::OutsideWorkspace));
        // Case-insensitive: windows
        let err = eng.list("test", "windows").unwrap_err();
        assert!(matches!(err, FsError::OutsideWorkspace));
    }

    #[test]
    fn host_read_size_cap() {
        let tmp = tempfile::tempdir().unwrap();
        let eng = engine(tmp.path());
        // > 2 MiB file
        let big = vec![b'x'; 2 * 1024 * 1024 + 1];
        std::fs::write(tmp.path().join("big.bin"), &big).unwrap();
        let err = eng.read_text("test", "big.bin").unwrap_err();
        assert!(matches!(err, FsError::Io(_)));
        // write cap
        let huge = "y".repeat(2 * 1024 * 1024 + 1);
        assert!(eng.write_text("test", "big2.bin", &huge).is_err());
    }
}
