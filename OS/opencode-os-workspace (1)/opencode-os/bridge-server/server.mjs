#!/usr/bin/env node
// OpenCode OS bridge server — browser-mode backend implementing the exact same
// JSON command surface as the Tauri/Rust layer, so the OS UI runs identically
// in a plain browser (dev + e2e).
//
// Env:
//   PORT                listen port (default 8787)
//   OPENCODE_OS_CONFIG_DIR   settings dir (default: same layout as the Rust core)
//   OCOS_NO_OPENCODE    if "1", pretend the opencode CLI is missing (wizard test)

import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseOcLine } from "../ui/js/lib/path-util.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UI_DIR = path.resolve(__dirname, "../ui");
const PORT = Number(process.env.PORT || 8787);

// ---------- settings ----------
const CONFIG_DIR = process.env.OPENCODE_OS_CONFIG_DIR
  || path.join(os.homedir(), ".config", "opencode-os");
const SETTINGS_PATH = path.join(CONFIG_DIR, "settings.json");

function defaultWorkspace() {
  return path.join(os.homedir(), "OpenCodeWorkspace");
}

function loadSettings() {
  try {
    const s = JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));
    // Phase 2 defaults for settings written by Phase 1 builds.
    if (!s.host_access || typeof s.host_access !== "object") {
      s.host_access = { enabled: false, allowed_roots: [] };
    }
    if (typeof s.oc_cwd !== "string") s.oc_cwd = "";
    return s;
  } catch {
    return {
      workspace: defaultWorkspace(),
      zen_api_key: "",
      model: "opencode/space-bunny-free",
      wizard_done: false,
      host_access: { enabled: false, allowed_roots: [] },
      oc_cwd: "",
    };
  }
}

function saveSettings(s) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(s, null, 2));
}

// ---------- sandboxed fs engine (mirror of opencode-core fs_engine.rs) ----------
class FsError extends Error {
  constructor(kind, msg) { super(msg); this.kind = kind; }
}

function resolveWithin(workspace, rel) {
  const t = String(rel ?? "").trim();
  if (t === "" || t === ".") return workspace;
  if (t.includes("\\") || t.startsWith("/") || t.includes("\0")) {
    throw new FsError("outside", "operation outside the workspace was blocked");
  }
  const parts = t.split("/").filter((p) => p !== "" && p !== ".");
  for (const p of parts) {
    if (p === "..") throw new FsError("outside", "operation outside the workspace was blocked");
    if (p.includes("\\")) throw new FsError("outside", "operation outside the workspace was blocked");
  }
  const abs = path.resolve(workspace, ...parts);
  if (abs !== workspace && !abs.startsWith(workspace + path.sep)) {
    throw new FsError("outside", "operation outside the workspace was blocked");
  }
  return abs;
}

function listDir(workspace, rel) {
  const abs = resolveWithin(workspace, rel);
  if (!fs.existsSync(abs)) throw new FsError("notfound", `not found: ${rel}`);
  const out = [];
  for (const name of fs.readdirSync(abs)) {
    if (name.startsWith(".")) continue;
    const st = fs.statSync(path.join(abs, name));
    out.push({
      name,
      kind: st.isDirectory() ? "dir" : "file",
      size: st.isDirectory() ? 0 : st.size,
      modified: st.mtimeMs,
    });
  }
  out.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "dir" ? -1 : 1;
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });
  return out;
}

function trashDir(workspace) { return path.join(workspace, ".Trash"); }

// ---------- host access (Phase 2 — mirror of opencode-core host.rs) ----------

const HOST_DENY_TOP_LEVEL = new Set([
  "windows", "program files", "program files (x86)", "programdata",
  "$recycle.bin", "system volume information", "recovery",
  "boot", "proc", "sys", "dev", "etc",
]);
const HOST_MAX_READ = 2 * 1024 * 1024;
const HOST_MAX_WRITE = 2 * 1024 * 1024;

function homeDir() {
  return process.env.USERPROFILE || process.env.HOME || "";
}

function discoverHostRoots() {
  const out = [];
  const home = homeDir();
  if (home) out.push({ id: "home", label: "Home", path: home, kind: "home" });
  if (process.platform === "win32") {
    for (let i = 65; i <= 90; i += 1) {
      const drive = `${String.fromCharCode(i)}:\\`;
      try {
        if (fs.statSync(drive).isDirectory() && !home.toUpperCase().startsWith(drive.toUpperCase())) {
          out.push({ id: `drive_${String.fromCharCode(i)}`, label: `${String.fromCharCode(i)}:`, path: drive, kind: "drive" });
        }
      } catch { /* drive absent */ }
    }
  } else {
    const bases = process.platform === "darwin" ? ["/Volumes"] : ["/media", "/run/media", "/mnt"];
    for (const base of bases) {
      let tops = [];
      try { tops = fs.readdirSync(base).filter((n) => !n.startsWith(".")).map((n) => path.join(base, n)); } catch { /* absent */ }
      for (const top of tops) {
        let subs = [];
        try { subs = fs.readdirSync(top).filter((n) => !n.startsWith(".")).map((n) => path.join(top, n)); } catch { /* absent */ }
        const leaves = base.endsWith("/media") && subs.length ? subs : [top];
        for (const leaf of leaves) {
          try {
            if (fs.statSync(leaf).isDirectory()) {
              out.push({ id: `vol_${leaf.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}`, label: path.basename(leaf), path: leaf, kind: "volume" });
            }
          } catch { /* vanished */ }
        }
      }
    }
  }
  return out.slice(0, 16);
}

function hostAllowed(state, rootId) {
  const ha = state.settings.host_access ?? { enabled: false, allowed_roots: [] };
  if (!ha.enabled) throw new FsError("outside", "host access is disabled");
  if (!(ha.allowed_roots ?? []).includes(rootId)) throw new FsError("outside", "host root not allowed");
}

function resolveHostRoot(state, rootId) {
  hostAllowed(state, rootId);
  const root = discoverHostRoots().find((r) => r.id === rootId);
  if (!root) throw new FsError("outside", "unknown host root");
  return root;
}

function resolveWithinRoot(root, rel) {
  const t = String(rel ?? "").trim();
  const base = path.resolve(root.path);
  if (t === "" || t === ".") return base;
  if (t.includes("\\") || t.startsWith("/") || t.includes("\0") || /^[a-zA-Z]:/.test(t)) {
    throw new FsError("outside", "operation outside the host root was blocked");
  }
  const parts = t.split("/").filter((p) => p !== "" && p !== ".");
  for (const p of parts) {
    if (p === "..") throw new FsError("outside", "operation outside the host root was blocked");
  }
  const abs = path.resolve(base, ...parts);
  if (abs !== base && !abs.startsWith(base + path.sep)) {
    throw new FsError("outside", "operation outside the host root was blocked");
  }
  // symlink escape check on the deepest existing ancestor
  let probe = abs;
  while (!fs.existsSync(probe)) {
    const parent = path.dirname(probe);
    if (parent === probe) break;
    probe = parent;
  }
  const realProbe = fs.realpathSync(probe);
  const realBase = fs.realpathSync(base);
  if (!realProbe.startsWith(realBase)) {
    throw new FsError("outside", "operation outside the host root was blocked");
  }
  return abs;
}

function denyHostTopLevel(rootKind, base, abs) {
  if (rootKind === "home") return;
  const rel = path.relative(base, abs);
  const top = rel.split(path.sep)[0] ?? "";
  if (top && HOST_DENY_TOP_LEVEL.has(top.toLowerCase())) {
    throw new FsError("outside", "system location blocked");
  }
}

function hostList(state, { root: rootId, path: p }) {
  const root = resolveHostRoot(state, rootId);
  const abs = resolveWithinRoot(root, p);
  denyHostTopLevel(root.kind, path.resolve(root.path), abs);
  if (!fs.existsSync(abs)) throw new FsError("notfound", `not found: ${rootId}/${p}`);
  const st = fs.statSync(abs);
  if (!st.isDirectory()) throw new FsError("invalid", `not a folder: ${rootId}/${p}`);
  const out = [];
  for (const name of fs.readdirSync(abs)) {
    if (name.startsWith(".")) continue;
    const s = fs.statSync(path.join(abs, name));
    out.push({ name, kind: s.isDirectory() ? "dir" : "file", size: s.isDirectory() ? 0 : s.size, modified: s.mtimeMs });
  }
  out.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "dir" ? -1 : 1;
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });
  return out;
}

// ---------- managed opencode server ----------
let managedServer = null; // { child, endpoint }

function pickFreePort() {
  return new Promise((resolve, reject) => {
    const srv = http.createServer();
    srv.listen(0, "127.0.0.1", () => {
      const port = srv.address().port;
      srv.close(() => resolve(port));
    });
    srv.on("error", reject);
  });
}

async function httpJson(url, { method = "GET", body, auth } = {}) {
  const headers = {};
  if (auth) headers.Authorization = `Basic ${Buffer.from(auth).toString("base64")}`;
  if (body) headers["Content-Type"] = "application/json";
  const res = await fetch(url, { method, headers, body });
  const text = await res.text();
  return { status: res.status, body: text };
}

async function startServer(state) {
  if (managedServer) return managedServer.endpoint;
  const settings = state.settings;
  const port = await pickFreePort();
  const username = "opencode";
  const password = Math.random().toString(36).slice(2, 14) + Math.random().toString(36).slice(2, 14);
  const env = {
    ...process.env,
    OPENCODE_SERVER_USERNAME: username,
    OPENCODE_SERVER_PASSWORD: password,
  };
  if (settings.zen_api_key) env.OPENCODE_API_KEY = settings.zen_api_key;
  const child = spawn("opencode", ["serve", "--hostname", "127.0.0.1", "--port", String(port)], {
    cwd: effectiveCwd(settings),
    env,
    stdio: "ignore",
  });
  // Missing binary etc. must not crash the server — surface via readiness loop.
  let spawnError = null;
  child.on("error", (e) => { spawnError = e; });
  const endpoint = { base_url: `http://127.0.0.1:${port}`, port, username, password, pid: child.pid };
  // readiness
  const deadline = Date.now() + 20_000;
  let lastErr = "not started";
  while (Date.now() < deadline) {
    if (spawnError) throw new Error(`cannot start opencode: ${spawnError.message}`);
    if (child.exitCode != null) throw new Error(`opencode serve exited early (${child.exitCode})`);
    try {
      const r = await httpJson(`${endpoint.base_url}/session`, { auth: `${username}:${password}` });
      if (r.status === 200) { managedServer = { child, endpoint }; return endpoint; }
      lastErr = `status ${r.status}`;
    } catch (e) { lastErr = e.message; }
    await new Promise((r) => setTimeout(r, 300));
  }
  child.kill("SIGKILL");
  throw new Error(`opencode server not ready: ${lastErr}`);
}

// ---------- command implementations ----------
const commands = {
  sys_info: async (state) => ({
    home: os.homedir(),
    workspace: state.settings.workspace,
    os: `${process.platform}-${process.arch}`,
    app_version: "0.1.0",
    opencode_installed: process.env.OCOS_NO_OPENCODE === "1" ? false : await hasOpencode(),
    opencode_version: process.env.OCOS_NO_OPENCODE === "1" ? null : await opencodeVersion(),
  }),

  fs_list: async (state, { path: p }) => listDir(state.settings.workspace, p ?? ""),
  fs_read: async (state, { path: p }) => fs.readFileSync(resolveWithin(state.settings.workspace, p), "utf8"),
  fs_write: async (state, { path: p, content }) => {
    const abs = resolveWithin(state.settings.workspace, p);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content ?? "");
    return (content ?? "").length;
  },
  fs_mkdir: async (state, { path: p }) => {
    if (String(p ?? "").includes("/")) throw new FsError("invalid", `invalid name: ${p}`);
    const abs = resolveWithin(state.settings.workspace, p);
    if (fs.existsSync(abs)) throw new FsError("exists", `already exists: ${p}`);
    fs.mkdirSync(abs);
    return null;
  },
  fs_rename: async (state, { from, to }) => {
    const a = resolveWithin(state.settings.workspace, from);
    const b = resolveWithin(state.settings.workspace, to);
    if (!fs.existsSync(a)) throw new FsError("notfound", `not found: ${from}`);
    if (fs.existsSync(b)) throw new FsError("exists", `already exists: ${to}`);
    fs.renameSync(a, b);
    return null;
  },
  fs_trash: async (state, { path: p }) => {
    const ws = state.settings.workspace;
    const abs = resolveWithin(ws, p);
    if (abs === ws) throw new FsError("outside", "cannot trash the workspace root");
    fs.mkdirSync(trashDir(ws), { recursive: true });
    const stamp = Date.now();
    let dest = path.join(trashDir(ws), `${stamp}_${path.basename(abs)}`);
    let n = 1;
    while (fs.existsSync(dest)) dest = path.join(trashDir(ws), `${stamp}_${n++}_${path.basename(abs)}`);
    fs.renameSync(abs, dest);
    return path.basename(dest);
  },
  trash_list: async (state) => {
    const t = trashDir(state.settings.workspace);
    if (!fs.existsSync(t)) return [];
    return fs.readdirSync(t).map((name) => {
      const st = fs.statSync(path.join(t, name));
      return { name, kind: st.isDirectory() ? "dir" : "file", size: st.isDirectory() ? 0 : st.size, modified: st.mtimeMs };
    }).sort((a, b) => a.name.localeCompare(b.name));
  },
  trash_delete: async (state, { name }) => {
    if (String(name).includes("/") || String(name).includes("\\") || String(name).includes("..")) {
      throw new FsError("outside", "operation outside the workspace was blocked");
    }
    const abs = path.join(trashDir(state.settings.workspace), name);
    if (!abs.startsWith(trashDir(state.settings.workspace))) throw new FsError("outside", "blocked");
    fs.rmSync(abs, { recursive: true });
    return null;
  },
  trash_empty: async (state) => {
    const t = trashDir(state.settings.workspace);
    if (!fs.existsSync(t)) return 0;
    const items = fs.readdirSync(t);
    for (const i of items) fs.rmSync(path.join(t, i), { recursive: true });
    return items.length;
  },

  host_roots: async (state) => {
    const ha = state.settings.host_access ?? { allowed_roots: [] };
    return discoverHostRoots().map((r) => ({ ...r, allowed: (ha.allowed_roots ?? []).includes(r.id) }));
  },
  host_list: async (state, args) => hostList(state, args),
  host_read: async (state, { root, path: p }) => {
    const r = resolveHostRoot(state, root);
    const abs = resolveWithinRoot(r, p);
    denyHostTopLevel(r.kind, path.resolve(r.path), abs);
    const st = fs.statSync(abs);
    if (st.isDirectory()) throw new FsError("invalid", `not a file: ${root}/${p}`);
    if (st.size > HOST_MAX_READ) throw new FsError("io", "file is larger than 2 MB — open it with a native editor instead");
    return fs.readFileSync(abs, "utf8");
  },
  host_write: async (state, { root, path: p, content }) => {
    const r = resolveHostRoot(state, root);
    const body = String(content ?? "");
    if (body.length > HOST_MAX_WRITE) throw new FsError("io", "write refused: content larger than 2 MB");
    const abs = resolveWithinRoot(r, p);
    denyHostTopLevel(r.kind, path.resolve(r.path), abs);
    for (const seg of String(p ?? "").split("/")) {
      if (seg.startsWith(".")) throw new FsError("outside", "hidden locations are never writable");
    }
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, body);
    return body.length;
  },
  host_mkdir: async (state, { root, path: p }) => {
    if (String(p ?? "").includes("/")) throw new FsError("invalid", `invalid name: ${p}`);
    const r = resolveHostRoot(state, root);
    const abs = resolveWithinRoot(r, p);
    denyHostTopLevel(r.kind, path.resolve(r.path), abs);
    const name = path.basename(abs);
    if (!name || name.startsWith(".")) throw new FsError("invalid", `invalid name: ${p}`);
    if (fs.existsSync(abs)) throw new FsError("exists", `already exists: ${p}`);
    fs.mkdirSync(abs);
    return null;
  },
  host_rename: async (state, { root, from, to }) => {
    const r = resolveHostRoot(state, root);
    const a = resolveWithinRoot(r, from);
    const b = resolveWithinRoot(r, to);
    denyHostTopLevel(r.kind, path.resolve(r.path), a);
    denyHostTopLevel(r.kind, path.resolve(r.path), b);
    if (!fs.existsSync(a)) throw new FsError("notfound", `not found: ${from}`);
    if (fs.existsSync(b)) throw new FsError("exists", `already exists: ${to}`);
    if (path.basename(b).startsWith(".")) throw new FsError("invalid", `invalid name: ${to}`);
    fs.renameSync(a, b);
    return null;
  },
  host_delete: async (state, { root, path: p }) => {
    const t = String(p ?? "").trim();
    if (!t || t === ".") throw new FsError("outside", "refusing to delete the root");
    const r = resolveHostRoot(state, root);
    const abs = resolveWithinRoot(r, p);
    denyHostTopLevel(r.kind, path.resolve(r.path), abs);
    fs.rmSync(abs, { recursive: true });
    return null;
  },

  oc_set_cwd: async (state, { path: p }) => {
    const target = String(p ?? "").trim();
    if (target) {
      if (!path.isAbsolute(target)) throw new FsError("invalid", "working folder must be an absolute path");
      const ws = path.resolve(state.settings.workspace);
      if (path.resolve(target) !== ws) {
        const ha = state.settings.host_access ?? { enabled: false, allowed_roots: [] };
        if (!ha.enabled) throw new FsError("outside", "host access is disabled");
        const roots = discoverHostRoots().filter((r) => (ha.allowed_roots ?? []).includes(r.id));
        const realTarget = fs.realpathSync(target);
        const inside = roots.some((r) => realTarget.startsWith(fs.realpathSync(r.path)));
        if (!inside) throw new FsError("outside", "folder is not inside an allowed host root");
      }
    }
    state.settings.oc_cwd = target;
    saveSettings(state.settings);
    if (managedServer) { managedServer.child.kill("SIGKILL"); managedServer = null; }
    return effectiveCwd(state.settings);
  },

  oc_start: async (state) => {
    const endpoint = await startServer(state);
    const { password, ...rest } = endpoint;
    return rest;
  },
  oc_stop: async () => {
    if (managedServer) { managedServer.child.kill("SIGKILL"); managedServer = null; }
    return null;
  },
  oc_status: async () => ({
    running: !!managedServer,
    base_url: managedServer ? managedServer.endpoint.base_url : null,
  }),
  oc_sessions: async (state) => {
    const endpoint = await startServer(state);
    const r = await httpJson(`${endpoint.base_url}/session`, {
      auth: `${endpoint.username}:${endpoint.password}`,
    });
    if (r.status !== 200) throw new Error(`GET /session -> ${r.status}`);
    return JSON.parse(r.body);
  },

  settings_get: async (state) => state.settings,
  settings_set: async (state, { settings }) => {
    const workspaceChanged = settings.workspace && settings.workspace !== state.settings.workspace;
    saveSettings(settings);
    state.settings = settings;
    if (workspaceChanged) fs.mkdirSync(settings.workspace, { recursive: true });
    return null;
  },

  setup_status: async (state) => {
    const v = process.env.OCOS_NO_OPENCODE === "1" ? null : await opencodeVersion();
    return {
      opencode_installed: !!v,
      opencode_version: v,
      zen_key_set: !!state.settings.zen_api_key,
      wizard_done: !!state.settings.wizard_done,
      workspace: state.settings.workspace,
      os: process.platform,
    };
  },

  app_quit: async () => null,
};

// streaming commands return an async generator of {task, ev}
function effectiveCwd(settings) {
  return settings.oc_cwd && settings.oc_cwd.trim() ? settings.oc_cwd : settings.workspace;
}

const streamCommands = {
  oc_send: async function* (state, args, task) {
    const settings = state.settings;
    const cwd = effectiveCwd(settings);
    const cliArgs = ["run", "--format", "json", "--dir", cwd, "-m", args.model ?? settings.model];
    if (args.sessionId) cliArgs.push("-s", args.sessionId);
    cliArgs.push(args.text ?? "");
    const env = { ...process.env };
    if (settings.zen_api_key) env.OPENCODE_API_KEY = settings.zen_api_key;
    const child = spawn("opencode", cliArgs, { cwd, env });
    let buf = "";
    let seenSession = null;
    let done = false;
    let exitCode = null;
    let spawnError = null;
    let stderrTail = "";
    child.on("error", (e) => { spawnError = e; });
    child.stderr.on("data", (d) => {
      stderrTail = (stderrTail + d.toString()).slice(-2048);
    });
    child.stdout.on("data", (d) => { buf += d.toString(); });
    child.on("exit", (code) => { exitCode = code; });

    const flush = async function* () {
      let idx;
      while ((idx = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, idx).trim();
        buf = buf.slice(idx + 1);
        for (const ev of parseOcLine(line)) {
          if (ev.t === "session") {
            if (seenSession) continue;
            seenSession = ev.id;
          }
          if (ev.t === "done") done = true;
          yield { task, ev };
        }
      }
    };

    const deadline = Date.now() + 120_000;
    while (exitCode == null && spawnError == null && Date.now() < deadline) {
      yield* flush();
      await new Promise((r) => setTimeout(r, 60));
    }
    if (spawnError) {
      yield { task, ev: { t: "error", message: `Cannot run the OpenCode CLI: ${spawnError.message}` } };
      yield { task, ev: { t: "done" } };
      return;
    }
    if (exitCode == null) { child.kill("SIGKILL"); yield { task, ev: { t: "error", message: "The model took too long and was stopped." } }; }
    yield* flush();
    if (!done) {
      const authy = /auth|401|unauthorized/i.test(stderrTail);
      if (exitCode !== 0) {
        yield {
          task,
          ev: {
            t: "error",
            message: authy
              ? "Your OpenCode Zen API key is missing or invalid. Open Setup to add one."
              : "The OpenCode CLI ended without answering (no model output).",
          },
        };
      }
      yield { task, ev: { t: "done" } };
    }
  },

  setup_install_opencode: async function* (state, _args, task) {
    if (process.env.OCOS_FAKE_INSTALL === "1") {
      // Deterministic e2e mode: pretend the official installer ran.
      yield { task, ev: { line: "Running installer: (e2e fake mode)", done: false, ok: true } };
      yield { task, ev: { line: "Downloading opencode… 100%", done: false, ok: true } };
      yield { task, ev: { line: "OpenCode CLI installed: 1.0.0-mock", done: true, ok: true } };
      return;
    }
    const cmd = process.platform === "win32"
      ? ["powershell", ["-NoProfile", "-Command", "irm https://opencode.ai/install.ps1 | iex"]]
      : ["sh", ["-c", "curl -fsSL https://opencode.ai/install | bash"]];
    yield { task, ev: { line: `Running installer: ${cmd[0]} ${cmd[1].join(" ")}`, done: false, ok: true } };
    const out = await new Promise((resolve) => {
      const p = spawn(cmd[0], cmd[1], { stdio: ["ignore", "pipe", "pipe"] });
      let stdout = ""; let stderr = "";
      p.stdout.on("data", (d) => { stdout += d; });
      p.stderr.on("data", (d) => { stderr += d; });
      p.on("exit", (code) => resolve({ code, stdout, stderr }));
      p.on("error", (e) => resolve({ code: 127, stdout: "", stderr: String(e) }));
    });
    for (const line of out.stdout.trim().split("\n").slice(-3)) {
      if (line) yield { task, ev: { line, done: false, ok: true } };
    }
    const v = await opencodeVersion();
    if (out.code === 0 && v) yield { task, ev: { line: `OpenCode CLI installed: ${v}`, done: true, ok: true } };
    else {
      yield { task, ev: { line: out.stderr.trim() || "install failed", done: false, ok: false } };
      yield { task, ev: { line: "Installer finished, but opencode was not found on PATH yet.", done: true, ok: out.code === 0 } };
    }
  },
};

// ---------- helpers ----------
async function hasOpencode() {
  return (await opencodeVersion()) != null;
}
async function opencodeVersion() {
  return new Promise((resolve) => {
    const p = spawn("opencode", ["--version"]);
    let out = "";
    p.stdout.on("data", (d) => { out += d; });
    p.on("error", () => resolve(null));
    p.on("exit", (code) => resolve(code === 0 ? out.trim() : null));
    setTimeout(() => { p.kill(); resolve(null); }, 5000);
  });
}

// ---------- HTTP plumbing ----------
const MIME = {
  ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".mjs": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png",
  ".json": "application/json", ".ico": "image/x-icon", ".woff2": "font/woff2",
};

function sendJson(res, obj, status = 200) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  const state = { settings: loadSettings() };

  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);

  // API
  if (req.method === "POST" && url.pathname.startsWith("/api/")) {
    const cmd = url.pathname.slice(5);
    let args = {};
    try { args = await readBody(req); } catch { /* empty body ok */ }
    try {
      if (streamCommands[cmd]) {
        const task = Date.now() % 1_000_000 + Math.floor(Math.random() * 1000);
        res.writeHead(200, { "Content-Type": "application/x-ndjson", "Cache-Control": "no-store" });
        for await (const msg of streamCommands[cmd](state, args, task)) {
          res.write(`${JSON.stringify(msg)}\n`);
        }
        res.end();
        return;
      }
      if (!commands[cmd]) return sendJson(res, { ok: false, error: `unknown command ${cmd}` }, 404);
      const data = await commands[cmd](state, args);
      return sendJson(res, { ok: true, data });
    } catch (e) {
      return sendJson(res, { ok: false, error: e.message || String(e) }, 200);
    }
  }

  // static files
  let file = url.pathname === "/" ? "/index.html" : url.pathname;
  file = path.normalize(file).replace(/^(\.\.[/\\])+/, "");
  const abs = path.join(UI_DIR, file);
  if (!abs.startsWith(UI_DIR)) { res.writeHead(403); return res.end(); }
  try {
    const data = fs.readFileSync(abs);
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(abs)] ?? "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("not found");
  }
});

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (c) => { body += c; });
    req.on("end", () => {
      if (!body.trim()) return resolve({});
      try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
    });
    req.on("error", reject);
  });
}

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[opencode-os] bridge server on http://127.0.0.1:${PORT}`);
});
