// main.js — boot sequence of OpenCode OS.

import { bridge } from "./bridge.js";
import * as wm from "./wm.js";
import * as taskbar from "./taskbar.js";
import * as startmenu from "./startmenu.js";
import * as desktop from "./desktop.js";
import * as chat from "./apps/chat.js";
import { createExplorer } from "./apps/explorer.js";
import { createNotepad } from "./apps/notepad.js";
import { createRecycler } from "./apps/recycle.js";
import { createSettings } from "./apps/settings.js";
import { createHostApp } from "./apps/host.js";
import * as setup from "./apps/setup.js";

const APPS = [
  { key: "explorer", label: "File Explorer", icon: "explorer" },
  { key: "host", label: "This PC", icon: "pc" },
  { key: "notepad", label: "Notepad", icon: "notepad" },
  { key: "chat", label: "OpenCode Chat", icon: "chat" },
  { key: "recycle", label: "Recycle Bin", icon: "trash" },
  { key: "settings", label: "Settings", icon: "settings" },
];

const DESKTOP_ICONS = [
  { key: "explorer", label: "File Explorer", icon: "explorer" },
  { key: "notepad", label: "Notepad", icon: "notepad" },
  { key: "chat", label: "OpenCode Chat", icon: "chat" },
  { key: "recycle", label: "Recycle Bin", icon: "trash" },
  { key: "settings", label: "Settings", icon: "settings" },
];

const openCounters = new Map();
const notepads = new Map(); // winId -> notepad controller

function boot() {
  const t0 = performance.now();

  wm.init(document.getElementById("windows"));

  taskbar.init({
    onStart: () => startmenu.toggle(),
    onChat: () => chat.toggle(),
    onOpenWindow: (key) => launch(key),
  });

  startmenu.init({
    apps: APPS,
    onLaunch: launch,
    onShutdown: shutdown,
  });

  desktop.init({
    icons: DESKTOP_ICONS,
    onLaunch: launch,
  });

  // Phase 2: the This PC icon only exists while host access is granted.
  refreshDesktopIcons();
  document.addEventListener("os:host-changed", refreshDesktopIcons);

  // Generic launch channel for in-app "Open Settings" buttons etc.
  document.addEventListener("os:launch", (e) => {
    if (e.detail?.key) launch(e.detail.key);
  });

  chat.init();

  taskbar.renderWindows(wm.listWindows(), {
    onFocus: (w) => wm.focus(w.id),
    onToggle: (w) => (w.minimized || !w.focused ? wm.focus(w.id) : wm.minimize(w.id)),
  });
  wm.onChange((list) => {
    taskbar.renderWindows(list, {
      onFocus: (w) => wm.focus(w.id),
      onToggle: (w) => (w.minimized || !w.focused ? wm.focus(w.id) : wm.minimize(w.id)),
    });
  });

  setup.init();

  // hide boot screen once everything is painted
  requestAnimationFrame(() => {
    const boot = document.getElementById("boot");
    boot.classList.add("fading");
    setTimeout(() => boot.classList.add("hidden"), 600);
    console.info(`[OpenCode OS] desktop ready in ${(performance.now() - t0).toFixed(0)}ms`);
    document.dispatchEvent(new CustomEvent("os:desktop-ready"));
  });

  // background: first-run wizard if needed, then bring the AI service online
  setup.maybeShow().catch(() => {});
  chat.ensureService();
}

async function refreshDesktopIcons() {
  try {
    const settings = await bridge.invoke("settings_get", {});
    const hostOn = !!settings?.host_access?.enabled;
    const icons = hostOn
      ? [{ key: "host", label: "This PC", icon: "pc" }, ...DESKTOP_ICONS]
      : DESKTOP_ICONS;
    desktop.renderIcons(icons);
  } catch {
    desktop.renderIcons(DESKTOP_ICONS);
  }
}

// ---- app launching ----

function launch(key, opts = {}) {
  switch (key) {
    case "explorer": {
      const n = (openCounters.get("explorer") ?? 0) + 1;
      openCounters.set("explorer", n);
      const content = createExplorer({
        initialPath: opts.initialPath ?? "",
        onOpenFile: (path) => openNotepad(path),
      });
      wm.create({
        id: `explorer-${n}`,
        appKey: "explorer",
        title: "File Explorer",
        icon: "explorer",
        width: 860,
        height: 560,
        content,
      });
      break;
    }
    case "notepad":
      openNotepad(null);
      break;
    case "host": {
      const n = (openCounters.get("host") ?? 0) + 1;
      openCounters.set("host", n);
      wm.create({
        id: `host-${n}`,
        appKey: "host",
        title: "This PC",
        icon: "pc",
        width: 860,
        height: 560,
        content: createHostApp({
          onOpenFile: (path) => openNotepad(path),
        }),
      });
      break;
    }
    case "chat":
      chat.open();
      break;
    case "recycle": {
      const n = (openCounters.get("recycle") ?? 0) + 1;
      openCounters.set("recycle", n);
      wm.create({
        id: `recycle-${n}`,
        appKey: "recycle",
        title: "Recycle Bin",
        icon: "trash",
        width: 640,
        height: 440,
        content: createRecycler(),
      });
      break;
    }
    case "settings": {
      const n = (openCounters.get("settings") ?? 0) + 1;
      openCounters.set("settings", n);
      wm.create({
        id: `settings-${n}`,
        appKey: "settings",
        title: "Settings",
        icon: "settings",
        width: 680,
        height: 520,
        content: createSettings(),
      });
      break;
    }
    default:
      console.warn("unknown app", key);
  }
}

function openNotepad(path) {
  if (path) {
    // focus an existing window for the same file
    for (const [id, np] of notepads) {
      if (np.path === path) {
        wm.focus(id);
        return;
      }
    }
  }
  const n = (openCounters.get("notepad") ?? 0) + 1;
  openCounters.set("notepad", n);
  const id = `notepad-${n}`;
  const np = createNotepad({ path });
  np.path = path;
  notepads.set(id, np);
  const win = wm.create({
    id,
    appKey: "notepad",
    title: path ? `${path} — Notepad` : "Untitled — Notepad",
    icon: "notepad",
    width: 720,
    height: 520,
    content: np.el,
    onClose: () => notepads.delete(id),
  });
  np.setTitleListener((t) => wm.setTitle(id, t));
  return win;
}

async function shutdown() {
  const sd = document.getElementById("shutdown");
  sd.classList.remove("hidden");
  try {
    if (bridge.isTauri) {
      setTimeout(() => bridge.invoke("app_quit", {}).catch(() => {}), 1200);
    } else {
      setTimeout(() => { sd.classList.add("hidden"); }, 2200);
    }
  } catch {
    /* window closes anyway */
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
