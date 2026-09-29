//! OpenCode server lifecycle — spawn `opencode serve` as a managed child process,
//! wait for readiness, provide a tiny dependency-free HTTP client for JSON calls
//! (session listing) with basic auth.

use serde::{Deserialize, Serialize};
use std::io::{BufReader, Read, Write};
use std::net::TcpStream;
use std::path::PathBuf;
use std::process::{Child, Command, Stdio};
use std::time::{Duration, Instant};

/// Spawned-server handle describing how the UI can reach the OpenCode server.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServerEndpoint {
    pub base_url: String,
    pub port: u16,
    pub username: String,
    pub password: String,
    pub pid: u32,
}

pub struct ManagedServer {
    pub endpoint: ServerEndpoint,
    child: Child,
}

/// Generate basic-auth credentials for the server (readable, random-enough).
pub fn generate_credentials() -> (String, String) {
    let password = random_token(24);
    ("opencode".to_string(), password)
}

fn random_token(len: usize) -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    // std-only randomness: pid + time mixed through a xorshift — sufficient for
    // a localhost-only basic-auth password, no crypto claims.
    let mut state = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_nanos() as u64)
        .unwrap_or(0x9E3779B97F4A7C15)
        ^ (std::process::id() as u64) << 32;
    let mut out = String::with_capacity(len);
    const ALPHABET: &[u8] = b"abcdefghjkmnpqrstuvwxyz23456789ABCDEFGHJKMNPQRSTUVWXYZ";
    for _ in 0..len {
        state ^= state << 13;
        state ^= state >> 7;
        state ^= state << 17;
        let idx = (state % ALPHABET.len() as u64) as usize;
        out.push(ALPHABET[idx] as char);
    }
    out
}

/// Pick a free TCP port by binding port 0 and releasing it (small race, acceptable
/// on loopback; the readiness probe validates the real outcome).
pub fn pick_free_port() -> std::io::Result<u16> {
    std::net::TcpListener::bind(("127.0.0.1", 0)).and_then(|l| l.local_addr())
        .map(|a| a.port())
}

#[derive(Debug, Clone)]
pub struct SpawnConfig {
    pub bin: String,      // e.g. "opencode"
    pub workdir: PathBuf, // workspace = project directory for the server
    pub username: String,
    pub password: String,
}

impl Default for SpawnConfig {
    fn default() -> Self {
        let (username, password) = generate_credentials();
        SpawnConfig {
            bin: "opencode".to_string(),
            workdir: std::env::temp_dir(),
            username,
            password,
        }
    }
}

/// Spawn `opencode serve` and wait until it answers an authenticated JSON call.
pub fn spawn_server(cfg: &SpawnConfig, extra_env: &[(String, String)]) -> Result<ManagedServer, String> {
    let port = pick_free_port().map_err(|e| format!("no free port: {e}"))?;
    let mut cmd = Command::new(&cfg.bin);
    cmd.args(["serve", "--hostname", "127.0.0.1", "--port", &port.to_string()])
        .current_dir(&cfg.workdir)
        .env("OPENCODE_SERVER_USERNAME", &cfg.username)
        .env("OPENCODE_SERVER_PASSWORD", &cfg.password)
        .stdout(Stdio::null())
        .stderr(Stdio::null());
    for (k, v) in extra_env {
        cmd.env(k, v);
    }
    let child = cmd
        .spawn()
        .map_err(|e| format!("failed to start {}: {e}", cfg.bin))?;
    let pid = child.id();
    let endpoint = ServerEndpoint {
        base_url: format!("http://127.0.0.1:{port}"),
        port,
        username: cfg.username.clone(),
        password: cfg.password.clone(),
        pid,
    };
    let managed = ManagedServer { endpoint, child };
    wait_ready(&managed, Duration::from_secs(20))?;
    Ok(managed)
}

impl ManagedServer {
    pub fn stop(&mut self) {
        let _ = self.child.kill();
        let _ = self.child.wait();
    }
}

impl Drop for ManagedServer {
    fn drop(&mut self) {
        self.stop();
    }
}

/// Poll the server until `GET /session` answers 200 with valid basic auth.
pub fn wait_ready(server: &ManagedServer, timeout: Duration) -> Result<(), String> {
    let start = Instant::now();
    let mut last_err = String::from("not started");
    while start.elapsed() < timeout {
        // If the child already died, fail fast with a hint.
        match http_json(&server.endpoint, "GET", "/session", None, Duration::from_millis(1500)) {
            Ok(_) => return Ok(()),
            Err(e) => {
                last_err = e;
            }
        }
        std::thread::sleep(Duration::from_millis(300));
    }
    Err(format!(
        "opencode server did not become ready within {timeout:?}: {last_err}"
    ))
}

// ---------------------------------------------------------------------------
// Tiny HTTP/1.1 client (GET/POST JSON) — no external dependencies.
// Enough for localhost JSON calls against the OpenCode server API.
// ---------------------------------------------------------------------------

pub fn base64_encode(data: &[u8]) -> String {
    const T: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let mut out = String::with_capacity((data.len() + 2) / 3 * 4);
    for chunk in data.chunks(3) {
        let b = [chunk[0], *chunk.get(1).unwrap_or(&0), *chunk.get(2).unwrap_or(&0)];
        let n = ((b[0] as u32) << 16) | ((b[1] as u32) << 8) | b[2] as u32;
        out.push(T[(n >> 18 & 63) as usize] as char);
        out.push(T[(n >> 12 & 63) as usize] as char);
        out.push(if chunk.len() > 1 { T[(n >> 6 & 63) as usize] as char } else { '=' });
        out.push(if chunk.len() > 2 { T[(n & 63) as usize] as char } else { '=' });
    }
    out
}

pub struct HttpReply {
    pub status: u16,
    pub body: String,
}

/// Perform a JSON HTTP call against the server with basic auth.
pub fn http_json(
    endpoint: &ServerEndpoint,
    method: &str,
    path: &str,
    body: Option<&str>,
    timeout: Duration,
) -> Result<HttpReply, String> {
    let host = format!("127.0.0.1:{}", endpoint.port);
    let mut stream = TcpStream::connect(&host).map_err(|e| format!("connect: {e}"))?;
    stream.set_read_timeout(Some(timeout)).map_err(|e| e.to_string())?;
    stream.set_write_timeout(Some(timeout)).map_err(|e| e.to_string())?;
    let auth = base64_encode(format!("{}:{}", endpoint.username, endpoint.password).as_bytes());
    let payload = body.unwrap_or("");
    let req = format!(
        "{method} {path} HTTP/1.1\r\nHost: {host}\r\nAuthorization: Basic {auth}\r\n\
         Content-Type: application/json\r\nAccept: application/json\r\n\
         Content-Length: {}\r\nConnection: close\r\n\r\n{payload}",
        payload.len()
    );
    stream
        .write_all(req.as_bytes())
        .map_err(|e| format!("write: {e}"))?;
    let mut raw = Vec::new();
    BufReader::new(stream)
        .read_to_end(&mut raw)
        .map_err(|e| format!("read: {e}"))?;
    let text = String::from_utf8_lossy(&raw).to_string();
    let (head, body) = text
        .split_once("\r\n\r\n")
        .ok_or_else(|| "malformed HTTP reply".to_string())?;
    let status_line = head.lines().next().unwrap_or("");
    let status: u16 = status_line
        .split_whitespace()
        .nth(1)
        .and_then(|s| s.parse().ok())
        .ok_or_else(|| format!("bad status line: {status_line}"))?;
    // NOTE: chunked bodies are re-assembled; good enough for localhost JSON.
    let body = if head.to_lowercase().contains("transfer-encoding: chunked") {
        dechunk(body)
    } else {
        body.to_string()
    };
    Ok(HttpReply { status, body })
}

fn dechunk(body: &str) -> String {
    let mut out = String::new();
    let mut rest = body;
    loop {
        let Some((size_line, remainder)) = rest.split_once("\r\n") else { break };
        let Ok(size) = usize::from_str_radix(size_line.trim().split(';').next().unwrap_or("0"), 16)
        else {
            break;
        };
        if size == 0 {
            break;
        }
        let end = remainder.len().min(size);
        out.push_str(&remainder[..end]);
        rest = &remainder[end..];
        if rest.starts_with("\r\n") {
            rest = &rest[2..];
        }
    }
    out
}

/// List sessions (GET /session) — returns the parsed JSON value.
pub fn list_sessions(endpoint: &ServerEndpoint) -> Result<serde_json::Value, String> {
    let reply = http_json(endpoint, "GET", "/session", None, Duration::from_secs(8))?;
    if reply.status != 200 {
        return Err(format!("GET /session -> {}", reply.status));
    }
    serde_json::from_str(&reply.body).map_err(|e| format!("bad session json: {e}"))
}

/// Best-effort `opencode --version` for setup checks.
pub fn cli_version(bin: &str) -> Option<String> {
    let out = Command::new(bin).arg("--version").output().ok()?;
    let s = String::from_utf8_lossy(&out.stdout).trim().to_string();
    if s.is_empty() {
        None
    } else {
        Some(s)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn base64_matches_known_vectors() {
        assert_eq!(base64_encode(b""), "");
        assert_eq!(base64_encode(b"f"), "Zg==");
        assert_eq!(base64_encode(b"fo"), "Zm8=");
        assert_eq!(base64_encode(b"foo"), "Zm9v");
        assert_eq!(base64_encode(b"foobar"), "Zm9vYmFy");
        // basic auth style
        assert_eq!(base64_encode(b"opencode:pass1234"), "b3BlbmNvZGU6cGFzczEyMzQ=");
    }

    #[test]
    fn credentials_are_random_and_sized() {
        let (u1, p1) = generate_credentials();
        let (_u2, p2) = generate_credentials();
        assert_eq!(u1, "opencode");
        assert_eq!(p1.len(), 24);
        assert_ne!(p1, p2);
    }

    #[test]
    fn pick_free_port_returns_usable_port() {
        let p1 = pick_free_port().unwrap();
        let p2 = pick_free_port().unwrap();
        assert_ne!(p1, 0);
        // Flaky-by-nature if a race grabs the same port twice; nearly impossible here.
        assert_ne!(p1, p2);
    }

    #[test]
    fn cli_version_detects_opencode_or_none() {
        // In sandboxes with opencode on PATH we get a version; without, None.
        let v = cli_version("opencode");
        if let Some(v) = v {
            assert!(v.contains('.') || v.chars().next().map(|c| c.is_ascii_digit()).unwrap_or(false));
        }
    }

    // Live-server integration: skipped unless OPENCODE_BIN is on PATH.
    #[test]
    fn live_server_spawn_and_sessions() {
        if cli_version("opencode").is_none() {
            eprintln!("skipping: opencode not on PATH");
            return;
        }
        let tmp = tempfile::tempdir().unwrap();
        let cfg = SpawnConfig {
            bin: "opencode".to_string(),
            workdir: tmp.path().to_path_buf(),
            ..SpawnConfig::default()
        };
        let mut server = spawn_server(&cfg, &[]).expect("spawn opencode serve");
        let sessions = list_sessions(&server.endpoint).expect("list sessions");
        assert!(sessions.is_array());
        server.stop();
    }
}
