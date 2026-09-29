// Window manager — the in-OS desktop window system (drag, resize, focus,
// minimize, maximize, close), with taskbar sync callbacks.

import { clampToViewport, cascadePos } from "./lib/path-util.js";
import { h, clear, S } from "./lib/dom.js";

const state = {
  container: null,
  zTop: 100,
  seq: 0,
  wins: new Map(), // id -> {id, el, title, icon, appKey, minimized, maximized, prevRect, onClose, onFocus}
  listeners: new Set(),
};

export function init(container) {
  state.container = container;
}

export function onChange(cb) {
  state.listeners.add(cb);
  return () => state.listeners.delete(cb);
}

function notify() {
  const list = listWindows();
  for (const cb of state.listeners) cb(list);
}

export function listWindows() {
  return [...state.wins.values()].map((w) => ({
    id: w.id,
    appKey: w.appKey,
    title: w.title,
    icon: w.icon,
    minimized: w.minimized,
    focused: w.el.classList.contains("focused"),
  }));
}

export function cascadePoint(defaultW, defaultH) {
  const vw = state.container.clientWidth;
  const vh = state.container.clientHeight;
  return cascadePos(state.seq, defaultW, defaultH, vw, vh);
}

export function focus(id) {
  const w = state.wins.get(id);
  if (!w) return;
  if (w.minimized) {
    w.minimized = false;
    w.el.classList.remove("minimized");
    w.el.style.display = "";
  }
  state.zTop += 1;
  w.el.style.zIndex = String(state.zTop);
  for (const other of state.wins.values()) other.el.classList.toggle("focused", other === w);
  w.onFocus && w.onFocus(w);
  notify();
}

export function minimize(id) {
  const w = state.wins.get(id);
  if (!w) return;
  w.minimized = true;
  w.el.classList.add("minimized");
  w.el.style.display = "none";
  // focus next topmost visible window
  const visible = [...state.wins.values()].filter((x) => !x.minimized && x !== w)
    .sort((a, b) => Number(b.el.style.zIndex || 0) - Number(a.el.style.zIndex || 0));
  if (visible[0]) focus(visible[0].id);
  else notify();
}

export function toggleMaximize(id) {
  const w = state.wins.get(id);
  if (!w) return;
  const el = w.el;
  if (w.maximized) {
    const r = w.prevRect;
    el.classList.remove("maximized");
    Object.assign(el.style, { left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px` });
    w.maximized = false;
  } else {
    const r = el.getBoundingClientRect();
    w.prevRect = { x: r.left, y: r.top, w: r.width, h: r.height };
    el.classList.add("maximized");
    Object.assign(el.style, { left: "0px", top: "0px", width: "100%", height: "100%" });
    w.maximized = true;
  }
  w.onResize && w.onResize();
  notify();
}

export function close(id) {
  const w = state.wins.get(id);
  if (!w) return;
  try {
    w.onClose && w.onClose();
  } catch (e) {
    console.error("window onClose failed", e);
  }
  w.el.remove();
  state.wins.delete(id);
  const visible = [...state.wins.values()].filter((x) => !x.minimized)
    .sort((a, b) => Number(b.el.style.zIndex || 0) - Number(a.el.style.zIndex || 0));
  if (visible[0]) focus(visible[0].id);
  else notify();
}

export function create(opts) {
  const {
    id = `win-${++state.seq}`,
    appKey = id,
    title,
    icon = "file",
    width = 760,
    height = 520,
    x,
    y,
    content,
    onClose,
    onFocus,
    onResize,
    resizable = true,
  } = opts;

  state.seq += 1;
  const container = state.container;
  const vw = container.clientWidth;
  const vh = container.clientHeight;
  const defW = Math.min(width, vw - 20);
  const defH = Math.min(height, vh - 20);
  const pos = x == null ? cascadePoint(defW, defH) : { x, y };
  const safe = clampToViewport(pos.x, pos.y, defW, defH, vw, vh);

  const el = h("div", { class: "win", "data-win-id": id });
  el.style.left = `${safe.x}px`;
  el.style.top = `${safe.y}px`;
  el.style.width = `${safe.w}px`;
  el.style.height = `${safe.h}px`;

  const titleEl = h("div", { class: "win-title" }, title);
  const titlebar = h(
    "div",
    { class: "win-titlebar" },
    h("div", { class: "win-title-icon", html: S[icon] ?? S.file }),
    titleEl,
    h(
      "div",
      { class: "win-controls" },
      h("button", { class: "win-ctl", title: "Minimize", html: S.min, onclick: () => minimize(id) }),
      h("button", { class: "win-ctl", title: "Maximize", html: S.max, onclick: () => toggleMaximize(id) }),
      h("button", { class: "win-ctl close", title: "Close", html: S.close, onclick: () => close(id) }),
    ),
  );

  const body = h("div", { class: "win-body" });
  if (content) body.append(content);

  el.append(titlebar, body);

  if (resizable) {
    for (const dir of ["n", "s", "e", "w", "ne", "nw", "se", "sw"]) {
      el.append(h("div", { class: `rs rs-${dir}`, "data-dir": dir }));
    }
    el.addEventListener("pointerdown", startResize);
  }

  titlebar.addEventListener("pointerdown", (ev) => startDrag(ev, el, titlebar, id));
  titlebar.addEventListener("dblclick", () => toggleMaximize(id));
  el.addEventListener("pointerdown", () => focus(id), true);

  container.append(el);
  const win = { id, appKey, el, title, icon, titleEl, body, minimized: false, maximized: false, prevRect: null, onClose, onFocus, onResize };
  state.wins.set(id, win);
  focus(id);
  return win;
}

export function setTitle(id, title) {
  const w = state.wins.get(id);
  if (!w) return;
  w.title = title;
  w.titleEl.textContent = title;
  notify();
}

// ---- pointer interactions ----

function startDrag(ev, el, titlebar, id) {
  if (ev.target.closest(".win-ctl")) return;
  const w = state.wins.get(id);
  if (w && w.maximized) {
    // Windows behaviour: dragging a maximized window restores it.
    const rel = ev.clientX / state.container.clientWidth;
    toggleMaximize(id);
    const r = el.getBoundingClientRect();
    el.style.left = `${Math.max(0, ev.clientX - r.width * rel)}px`;
  }
  const rect = el.getBoundingClientRect();
  const offX = ev.clientX - rect.left;
  const offY = ev.clientY - rect.top;
  titlebar.setPointerCapture(ev.pointerId);
  const move = (e2) => {
    const vw = state.container.clientWidth;
    const vh = state.container.clientHeight;
    const p = clampToViewport(e2.clientX - offX, e2.clientY - offY, rect.width, rect.height, vw, vh);
    el.style.left = `${p.x}px`;
    el.style.top = `${p.y}px`;
  };
  const up = () => {
    titlebar.removeEventListener("pointermove", move);
    titlebar.removeEventListener("pointerup", up);
    titlebar.removeEventListener("pointercancel", up);
  };
  titlebar.addEventListener("pointermove", move);
  titlebar.addEventListener("pointerup", up);
  titlebar.addEventListener("pointercancel", up);
  ev.preventDefault();
}

function startResize(ev) {
  const handle = ev.target.closest(".rs");
  if (!handle) return;
  const el = handle.closest(".win");
  const id = el.dataset.winId;
  const w = state.wins.get(id);
  const dir = handle.dataset.dir;
  const startRect = el.getBoundingClientRect();
  const startX = ev.clientX;
  const startY = ev.clientY;
  handle.setPointerCapture(ev.pointerId);
  const minW = 420;
  const minH = 260;
  const move = (e2) => {
    const dx = e2.clientX - startX;
    const dy = e2.clientY - startY;
    let { left, top, width, height } = { left: startRect.left, top: startRect.top, width: startRect.width, height: startRect.height };
    if (dir.includes("e")) width = Math.max(minW, startRect.width + dx);
    if (dir.includes("s")) height = Math.max(minH, startRect.height + dy);
    if (dir.includes("w")) {
      width = Math.max(minW, startRect.width - dx);
      left = startRect.right - width;
    }
    if (dir.includes("n")) {
      height = Math.max(minH, startRect.height - dy);
      top = startRect.bottom - height;
    }
    Object.assign(el.style, {
      left: `${Math.max(0, Math.round(left))}px`,
      top: `${Math.max(0, Math.round(top))}px`,
      width: `${Math.round(width)}px`,
      height: `${Math.round(height)}px`,
    });
  };
  const up = () => {
    handle.removeEventListener("pointermove", move);
    handle.removeEventListener("pointerup", up);
    handle.removeEventListener("pointercancel", up);
    w && w.onResize && w.onResize();
  };
  handle.addEventListener("pointermove", move);
  handle.addEventListener("pointerup", up);
  handle.addEventListener("pointercancel", up);
  ev.preventDefault();
  ev.stopPropagation();
}

export { clear };
