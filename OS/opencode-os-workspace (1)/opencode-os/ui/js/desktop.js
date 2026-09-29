// Desktop layer — icon grid, selection, context menus (New folder / New file).

import { h, clear, S, toast } from "./lib/dom.js";
import { openMenu } from "./lib/ctxmenu.js";
import { bridge } from "./bridge.js";

let selectedIcon = null;
let config = { icons: [], onLaunch: () => {} };

export function init({ icons, onLaunch }) {
  config = { icons: icons ?? [], onLaunch: onLaunch ?? config.onLaunch };
  renderIcons(config.icons);

  // Desktop background context menu — creates real folders/files in the
  // workspace root (the desktop IS the workspace home in v1).
  document.getElementById("desktop").addEventListener("contextmenu", (ev) => {
    if (ev.target.closest(".desk-icon") || ev.target.closest(".win") || ev.target.closest("#chat")) return;
    ev.preventDefault();
    openMenu(ev.clientX, ev.clientY, [
      {
        label: "New folder",
        action: async () => {
          try {
            await bridge.invoke("fs_mkdir", { path: "New folder" });
            toast("Created 'New folder' on the desktop");
            document.dispatchEvent(new CustomEvent("os:fs-changed", { detail: { path: "" } }));
          } catch (e) {
            toast(String(e.message || e).replace(/^.*error:\s*/, ""));
          }
        },
      },
      {
        label: "New text file",
        action: async () => {
          try {
            await bridge.invoke("fs_write", { path: "New file.txt", content: "" });
            toast("Created 'New file.txt' on the desktop");
            document.dispatchEvent(new CustomEvent("os:fs-changed", { detail: { path: "" } }));
          } catch (e) {
            toast(String(e.message || e).replace(/^.*error:\s*/, ""));
          }
        },
      },
      "-",
      { label: "Refresh", action: () => document.dispatchEvent(new CustomEvent("os:fs-changed", { detail: { path: "" } })) },
    ]);
  });

  // deselect on empty click
  document.getElementById("desktop").addEventListener("pointerdown", (ev) => {
    if (!ev.target.closest(".desk-icon")) select(null);
  });
}

function select(el) {
  if (selectedIcon) selectedIcon.classList.remove("selected");
  selectedIcon = el;
  if (el) el.classList.add("selected");
}

/// Rebuild the desktop icon grid (used when Host access is toggled — the
/// This PC icon appears/disappears without an app restart).
export function renderIcons(icons) {
  config.icons = icons ?? [];
  const host = document.getElementById("icons");
  clear(host);
  selectedIcon = null;
  for (const icon of config.icons) {
    const el = h(
      "div",
      { class: "desk-icon", "data-app": icon.key, tabindex: "0" },
      h("div", { class: "di-glyph", html: S[icon.icon] }),
      h("div", { class: "di-label" }, icon.label),
    );
    el.addEventListener("click", () => select(el));
    el.addEventListener("dblclick", () => config.onLaunch(icon.key));
    el.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") config.onLaunch(icon.key);
    });
    el.addEventListener("contextmenu", (ev) => {
      ev.preventDefault();
      select(el);
      openMenu(ev.clientX, ev.clientY, [
        { label: "Open", action: () => config.onLaunch(icon.key) },
      ]);
    });
    host.append(el);
  }
}
