// Pure path utilities for the OpenCode OS file viewer. No DOM — unit tested in node.

export function basename(p) {
  const parts = String(p || "").split("/").filter(Boolean);
  return parts.length ? parts[parts.length - 1] : "";
}

export function dirname(p) {
  const parts = String(p || "").split("/").filter(Boolean);
  parts.pop();
  return parts.join("/");
}

export function join(...segs) {
  return segs
    .filter((s) => s !== "" && s !== "." && s != null)
    .join("/")
    .replace(/\/+/g, "/");
}

export function isHidden(name) {
  return String(name || "").startsWith(".");
}

export function extOf(name) {
  const b = basename(name);
  const i = b.lastIndexOf(".");
  return i > 0 ? b.slice(i + 1).toLowerCase() : "";
}

// Pure reducer for explorer state transitions — kept here for unit testing.
export function historyPush(state, path) {
  const history = state.history.slice(0, state.hIdx + 1);
  if (history[history.length - 1] !== path) history.push(path);
  return { ...state, history, hIdx: history.length - 1, cwd: path };
}

export function historyBack(state) {
  if (state.hIdx <= 0) return state;
  return { ...state, hIdx: state.hIdx - 1, cwd: state.history[state.hIdx - 1] };
}

export function historyForward(state) {
  if (state.hIdx >= state.history.length - 1) return state;
  return { ...state, hIdx: state.hIdx + 1, cwd: state.history[state.hIdx + 1] };
}

// Filter + sort listing client-side (server returns name-sorted entries).
export function applyFilter(entries, query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return entries;
  return entries.filter((e) => e.name.toLowerCase().includes(q));
}

export function fmtSize(bytes) {
  const n = Number(bytes) || 0;
  if (n === 0) return "";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  let v = n;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i += 1;
  }
  return `${v >= 10 || i === 0 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, "")} ${units[i]}`;
}

export function fmtDate(ms) {
  if (!ms) return "";
  const d = new Date(Number(ms));
  const pad = (x) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Host path scheme (Phase 2): "host://<root-id>/<rel>" identifies a real file
// on the machine behind the This PC allowlist. Pure helpers — unit tested.
export function isHostPath(p) {
  return String(p || "").startsWith("host://");
}

export function parseHostPath(p) {
  const m = /^host:\/\/([^/]+)\/?([\s\S]*)$/.exec(String(p || ""));
  if (!m) return null;
  return { root: m[1], rel: m[2] };
}

export function formatHostPath(root, rel) {
  const r = String(rel || "").replace(/^\/+|\/+$/g, "");
  return `host://${root}${r ? "/" + r : ""}`;
}

// Pure clock formatter (taskbar) — unit tested.
export function fmtClock(d) {
  const pad = (x) => String(x).padStart(2, "0");
  return {
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
    date: `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`,
  };
}

// Pure geometry helper for the window manager — unit tested.
// Keeps at least 60px of width / 40px of height visible at all times.
export function clampToViewport(x, y, w, h, vw, vh) {
  const w2 = Math.min(w, vw);
  const h2 = Math.min(h, vh);
  const minX = w2 > 60 ? -(w2 - 60) : 0;
  const maxX = vw - 60;
  const minY = h2 > 40 ? -(h2 - 40) : 0;
  const maxY = vh - 40;
  let x2 = Math.min(Math.max(x, minX), Math.max(minX, maxX));
  let y2 = Math.min(Math.max(y, minY), Math.max(minY, maxY));
  return { x: Math.round(x2), y: Math.round(y2), w: w2, h: h2 };
}

// Cascade placement for new windows — pure, unit tested.
export function cascadePos(n, defaultW, defaultH, vw, vh) {
  const offset = (n % 8) * 28;
  const x = Math.max(0, Math.min(vw - defaultW, 90 + offset));
  const y = Math.max(0, Math.min(vh - defaultH - 40, 60 + offset));
  return { x, y };
}

// Chat stream event parser (JS mirror of opencode-core run_stream.rs) —
// liberal harvesting of deltas/session ids/errors from OpenCode NDJSON.
export function parseOcLine(line) {
  const t = String(line || "").trim();
  if (!t) return [];
  let v;
  try {
    v = JSON.parse(t);
  } catch {
    return [];
  }
  if (typeof v !== "object" || v === null) return [];
  const out = [];
  const kind = typeof v.type === "string" ? v.type : "";
  const looksError = v.error != null || (v.message && typeof v.message === "object" && v.message.error != null);
  if (kind.includes("error") || looksError) {
    let msg = null;
    const errObj = v.error ?? (v.message && v.message.error);
    if (typeof errObj === "string") msg = errObj;
    else if (errObj && typeof errObj === "object") msg = errObj.message ?? JSON.stringify(errObj);
    out.push({ t: "error", message: msg ?? "The model could not answer this message." });
    return out;
  }
  const harvestSession = () => {
    if (typeof v.sessionID === "string") return v.sessionID;
    if (typeof v.session === "string" && v.session.startsWith("ses_")) return v.session;
    for (const k of ["info", "part", "properties", "message"]) {
      const n = v[k];
      if (n && typeof n === "object" && typeof n.sessionID === "string") return n.sessionID;
    }
    return null;
  };
  const sid = harvestSession();
  if (sid) out.push({ t: "session", id: sid });
  if (typeof v.delta === "string") {
    out.push({ t: "delta", text: v.delta });
  } else {
    const part = v.part ?? (v.properties && v.properties.part);
    if (part && typeof part === "object") {
      const ptype = typeof part.type === "string" ? part.type : "";
      if ((ptype === "text" || ptype === "") && typeof part.text === "string") {
        out.push({ t: "delta", text: part.text });
      }
    } else if (typeof v.text === "string" && kind === "text") {
      out.push({ t: "delta", text: v.text });
    }
  }
  if (kind === "session.idle" || kind === "run.completed" || kind === "done") {
    out.push({ t: "done" });
  }
  return out;
}
