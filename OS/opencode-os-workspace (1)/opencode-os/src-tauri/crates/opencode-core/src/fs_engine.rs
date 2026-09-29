//! Sandboxed filesystem engine — every user-facing file operation in OpenCode OS.
//!
//! All paths given by the UI are workspace-relative. The engine guarantees that
//! no operation can escape the workspace root (Gate 3.4 "Safe by default").

use serde::Serialize;
use std::fs;
use std::io;
use std::path::{Component, Path, PathBuf};
use std::time::SystemTime;

#[derive(Debug)]
pub enum FsError {
    OutsideWorkspace,
    NotFound(String),
    AlreadyExists(String),
    InvalidName(String),
    Io(String),
}

impl std::fmt::Display for FsError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            FsError::OutsideWorkspace => write!(f, "operation outside the workspace was blocked"),
            FsError::NotFound(p) => write!(f, "not found: {p}"),
            FsError::AlreadyExists(p) => write!(f, "already exists: {p}"),
            FsError::InvalidName(p) => write!(f, "invalid name: {p}"),
            FsError::Io(e) => write!(f, "filesystem error: {e}"),
        }
    }
}

impl From<io::Error> for FsError {
    fn from(e: io::Error) -> Self {
        match e.kind() {
            io::ErrorKind::NotFound => FsError::NotFound(e.to_string()),
            io::ErrorKind::AlreadyExists => FsError::AlreadyExists(e.to_string()),
            _ => FsError::Io(e.to_string()),
        }
    }
}

#[derive(Debug, Clone, Serialize)]
pub struct Entry {
    pub name: String,
    pub kind: String, // "dir" | "file"
    pub size: u64,
    pub modified: u128, // ms since epoch
}

pub struct FsEngine {
    workspace: PathBuf,
}

fn name_is_valid(name: &str) -> bool {
    !name.is_empty()
        && name != "."
        && name != ".."
        && !name.contains('/')
        && !name.contains('\\')
        && !name.contains('\0')
        && name.trim() == name
}

impl FsEngine {
    pub fn new(workspace: PathBuf) -> Self {
        FsEngine { workspace }
    }

    pub fn workspace(&self) -> &Path {
        &self.workspace
    }

    /// Resolve a workspace-relative path to an absolute path, refusing escapes.
    /// Accepts "", ".", "foo", "foo/bar", nested "a/b/c". Rejects absolute
    /// paths, any ".." component and Windows drive/UNC-ish inputs.
    pub fn resolve(&self, rel: &str) -> Result<PathBuf, FsError> {
        let rel_t = rel.trim();
        if rel_t.is_empty() || rel_t == "." {
            return Ok(self.workspace.clone());
        }
        let p = Path::new(rel_t);
        if p.is_absolute() || p.has_root() {
            return Err(FsError::OutsideWorkspace);
        }
        // Strict rule: only Normal and CurDir components allowed. Any ParentDir
        // (".."), RootDir, Prefix (Windows drive) or Backslash-ish component is
        // rejected outright — the UI never needs them, and refusing is simpler
        // to audit than resolving then re-checking.
        for comp in p.components() {
            match comp {
                Component::Normal(_) | Component::CurDir => {}
                _ => return Err(FsError::OutsideWorkspace),
            }
            if comp.as_os_str().to_string_lossy().contains('\\') {
                // "..\\windows" is a legal *filename* on unix but a traversal on
                // Windows — reject for a consistent cross-platform guarantee.
                return Err(FsError::OutsideWorkspace);
            }
        }
        let joined = self.workspace.join(p);
        // Canonicalise lazily: verify no symlink escapes by canonicalizing the
        // deepest existing ancestor.
        let joined = self.verify_within(joined)?;
        Ok(joined)
    }

    fn verify_within(&self, target: PathBuf) -> Result<PathBuf, FsError> {
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
        if !canon.starts_with(&self.workspace) {
            return Err(FsError::OutsideWorkspace);
        }
        let mut out = canon;
        for part in suffix.into_iter().rev() {
            out = out.join(part);
        }
        Ok(out)
    }

    pub fn list(&self, rel: &str) -> Result<Vec<Entry>, FsError> {
        let dir = self.resolve(rel)?;
        if !dir.exists() {
            return Err(FsError::NotFound(rel.to_string()));
        }
        let mut out = Vec::new();
        for entry in fs::read_dir(&dir)? {
            let entry = entry?;
            let name = entry.file_name().to_string_lossy().to_string();
            if name.starts_with('.') {
                continue; // hide dotfiles in the consumer file viewer (v1)
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
            out.push(Entry {
                name,
                kind,
                size,
                modified,
            });
        }
        out.sort_by(|a, b| match (a.kind.as_str(), b.kind.as_str()) {
            ("dir", "dir") | ("file", "file") => a.name.to_lowercase().cmp(&b.name.to_lowercase()),
            ("dir", _) => std::cmp::Ordering::Less,
            _ => std::cmp::Ordering::Greater,
        });
        Ok(out)
    }

    pub fn read_text(&self, rel: &str) -> Result<String, FsError> {
        let p = self.resolve(rel)?;
        if p.is_dir() {
            return Err(FsError::InvalidName(rel.to_string()));
        }
        Ok(fs::read_to_string(p)?)
    }

    pub fn write_text(&self, rel: &str, content: &str) -> Result<u64, FsError> {
        let p = self.resolve(rel)?;
        if let Some(name) = p.file_name().map(|n| n.to_string_lossy().to_string()) {
            if !name_is_valid(&name) {
                return Err(FsError::InvalidName(name));
            }
        }
        if let Some(parent) = p.parent() {
            fs::create_dir_all(parent)?;
        }
        fs::write(&p, content)?;
        Ok(content.len() as u64)
    }

    pub fn mkdir(&self, rel: &str) -> Result<PathBuf, FsError> {
        // New Folder creates exactly one directory: single segment only.
        if rel.contains('/') {
            return Err(FsError::InvalidName(rel.to_string()));
        }
        let p = self.resolve(rel)?;
        let name = p
            .file_name()
            .map(|n| n.to_string_lossy().to_string())
            .unwrap_or_default();
        if !name_is_valid(&name) {
            return Err(FsError::InvalidName(name));
        }
        if p.exists() {
            return Err(FsError::AlreadyExists(rel.to_string()));
        }
        fs::create_dir_all(&p)?;
        Ok(p)
    }

    pub fn rename(&self, from_rel: &str, to_rel: &str) -> Result<(), FsError> {
        let from = self.resolve(from_rel)?;
        let to = self.resolve(to_rel)?;
        let name = to
            .file_name()
            .map(|n| n.to_string_lossy().to_string())
            .unwrap_or_default();
        if !name_is_valid(&name) {
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

    /// Move a file or folder into the workspace trash (`.Trash`), Recycle-Bin style.
    pub fn trash(&self, rel: &str) -> Result<String, FsError> {
        let src = self.resolve(rel)?;
        if !src.exists() {
            return Err(FsError::NotFound(rel.to_string()));
        }
        if src == self.workspace {
            return Err(FsError::OutsideWorkspace);
        }
        let trash_dir = self.workspace.join(".Trash");
        fs::create_dir_all(&trash_dir)?;
        let name = src
            .file_name()
            .map(|n| n.to_string_lossy().to_string())
            .unwrap_or_else(|| "item".to_string());
        let stamp = SystemTime::now()
            .duration_since(SystemTime::UNIX_EPOCH)
            .map(|d| d.as_millis())
            .unwrap_or(0);
        let mut dest = trash_dir.join(format!("{stamp}_{name}"));
        // ensure uniqueness within the same millisecond
        let mut n = 1u32;
        while dest.exists() {
            dest = trash_dir.join(format!("{stamp}_{n}_{name}"));
            n += 1;
        }
        fs::rename(&src, &dest)?;
        Ok(dest
            .file_name()
            .map(|n| n.to_string_lossy().to_string())
            .unwrap_or_default())
    }

    /// List trash contents (for the Recycle Bin desktop app).
    pub fn trash_list(&self) -> Result<Vec<Entry>, FsError> {
        let trash_dir = self.workspace.join(".Trash");
        if !trash_dir.exists() {
            return Ok(Vec::new());
        }
        let mut out = Vec::new();
        for entry in fs::read_dir(&trash_dir)? {
            let entry = entry?;
            let name = entry.file_name().to_string_lossy().to_string();
            let meta = entry.metadata()?;
            out.push(Entry {
                name,
                kind: if meta.is_dir() { "dir" } else { "file" }.to_string(),
                size: if meta.is_dir() { 0 } else { meta.len() },
                modified: meta
                    .modified()
                    .unwrap_or(SystemTime::UNIX_EPOCH)
                    .duration_since(SystemTime::UNIX_EPOCH)
                    .map(|d| d.as_millis())
                    .unwrap_or(0),
            });
        }
        out.sort_by(|a, b| a.name.cmp(&b.name));
        Ok(out)
    }

    /// Permanently remove one item from the trash.
    pub fn trash_delete(&self, trash_item: &str) -> Result<(), FsError> {
        if trash_item.contains('/') || trash_item.contains('\\') || trash_item.contains("..") {
            return Err(FsError::OutsideWorkspace);
        }
        let p = self.workspace.join(".Trash").join(trash_item);
        if !p.starts_with(self.workspace.join(".Trash")) || !p.exists() {
            return Err(FsError::NotFound(trash_item.to_string()));
        }
        if p.is_dir() {
            fs::remove_dir_all(p)
        } else {
            fs::remove_file(p)
        }
        .map_err(FsError::from)
    }

    /// Empty the entire trash.
    pub fn trash_empty(&self) -> Result<usize, FsError> {
        let trash_dir = self.workspace.join(".Trash");
        if !trash_dir.exists() {
            return Ok(0);
        }
        let mut count = 0usize;
        for entry in fs::read_dir(&trash_dir)? {
            let entry = entry?;
            let p = entry.path();
            if p.is_dir() {
                fs::remove_dir_all(p)?;
            } else {
                fs::remove_file(p)?;
            }
            count += 1;
        }
        Ok(count)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn engine() -> (FsEngine, tempfile::TempDir) {
        let tmp = tempfile::tempdir().unwrap();
        (FsEngine::new(tmp.path().to_path_buf()), tmp)
    }

    #[test]
    fn write_read_list_roundtrip() {
        let (fs, _t) = engine();
        fs.mkdir("docs").unwrap();
        let n = fs.write_text("docs/hello.txt", "hello world").unwrap();
        assert_eq!(n, 11);
        assert_eq!(fs.read_text("docs/hello.txt").unwrap(), "hello world");
        let entries = fs.list("docs").unwrap();
        assert_eq!(entries.len(), 1);
        assert_eq!(entries[0].name, "hello.txt");
        assert_eq!(entries[0].kind, "file");
        let root = fs.list("").unwrap();
        assert_eq!(root[0].name, "docs");
        assert_eq!(root[0].kind, "dir");
    }

    #[test]
    fn dirs_sort_before_files_case_insensitive() {
        let (fs, _t) = engine();
        fs.write_text("banana.txt", "x").unwrap();
        fs.mkdir("Apple").unwrap();
        fs.write_text("Cherry.txt", "x").unwrap();
        let names: Vec<String> = fs.list("").unwrap().iter().map(|e| e.name.clone()).collect();
        assert_eq!(names, vec!["Apple", "banana.txt", "Cherry.txt"]);
    }

    #[test]
    fn traversal_absolute_rejected() {
        let (fs, _t) = engine();
        for evil in ["/etc/passwd", "C:\\Windows", "//server/share"] {
            let err = fs.read_text(evil).unwrap_err();
            assert!(matches!(err, FsError::OutsideWorkspace), "{evil}");
        }
    }

    #[test]
    fn traversal_parent_rejected() {
        let (fs, _t) = engine();
        fs.mkdir("sub").unwrap();
        for evil in ["../", "sub/../../escape", "a/../..", "..\\windows"] {
            let err = fs.list(evil).unwrap_err();
            assert!(matches!(err, FsError::OutsideWorkspace), "{evil}");
        }
    }

    #[test]
    fn traversal_any_parentdir_is_rejected_even_if_it_stays_inside() {
        let (fs, _t) = engine();
        fs.write_text("a/b/f.txt", "x").unwrap(); // write creates parent dirs
        // Strict policy: ".." is always refused, even when it would resolve
        // back inside the workspace. Simpler to audit, and the UI never sends it.
        for evil in ["a/..", "a/b/../b/f.txt", "./../workspace"] {
            let err = fs.read_text(evil).unwrap_err();
            assert!(matches!(err, FsError::OutsideWorkspace), "{evil}");
        }
        // "./" current-dir components are fine.
        assert_eq!(fs.read_text("./a/b/f.txt").unwrap(), "x");
    }

    #[test]
    fn rename_and_conflicts() {
        let (fs, _t) = engine();
        fs.write_text("old.txt", "data").unwrap();
        fs.rename("old.txt", "new.txt").unwrap();
        assert_eq!(fs.read_text("new.txt").unwrap(), "data");
        fs.write_text("clash.txt", "c").unwrap();
        let err = fs.rename("new.txt", "clash.txt").unwrap_err();
        assert!(matches!(err, FsError::AlreadyExists(_)));
    }

    #[test]
    fn invalid_names_rejected() {
        let (fs, _t) = engine();
        assert!(fs.mkdir("bad/name").is_err());
        assert!(fs.mkdir("..").is_err());
        assert!(fs.mkdir(" ").is_err());
        assert!(fs.write_text("  ", "x").is_err());
    }

    #[test]
    fn trash_moves_and_lists() {
        let (fs, _t) = engine();
        fs.write_text("bye.txt", "gone soon").unwrap();
        let trashed = fs.trash("bye.txt").unwrap();
        assert!(trashed.ends_with("bye.txt"));
        assert!(fs.read_text("bye.txt").is_err());
        let items = fs.trash_list().unwrap();
        assert_eq!(items.len(), 1);
        assert!(items[0].name.ends_with("bye.txt"));
        fs.trash_empty().unwrap();
        assert_eq!(fs.trash_list().unwrap().len(), 0);
    }

    #[test]
    fn trash_cannot_target_root_or_escape() {
        let (fs, _t) = engine();
        assert!(fs.trash("").is_err());
        assert!(fs.trash("../x").is_err());
        assert!(fs.trash_delete("../../etc").is_err());
    }

    #[test]
    fn symlink_escape_is_blocked() {
        let (fs, tmp) = engine();
        let outside = tempfile::tempdir().unwrap();
        std::os::unix::fs::symlink(outside.path(), tmp.path().join("link")).unwrap();
        let err = fs.list("link").unwrap_err();
        assert!(matches!(err, FsError::OutsideWorkspace));
    }

    #[test]
    fn write_creates_parent_dirs() {
        let (fs, _t) = engine();
        fs.write_text("deep/nested/dir/file.txt", "ok").unwrap();
        assert_eq!(fs.read_text("deep/nested/dir/file.txt").unwrap(), "ok");
    }
}
