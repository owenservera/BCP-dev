// Shared context-menu singleton.

import { h, clear } from "./dom.js";

let root = null;

function ensureRoot() {
  if (!root) root = document.getElementById("ctx-root");
  return root;
}

export function openMenu(x, y, items) {
  const r = ensureRoot();
  clear(r);
  const menu = h("div", { class: "ctx" });
  for (const item of items) {
    if (item === "-") {
      menu.append(h("div", { class: "ctx-sep" }));
      continue;
    }
    menu.append(
      h(
        "div",
        {
          class: "ctx-item",
          onclick: () => {
            closeMenu();
            item.action && item.action();
          },
        },
        h("span", {}, item.label),
        item.hint ? h("span", { class: "ctx-hint" }, item.hint) : null,
      ),
    );
  }
  r.append(menu);
  // keep on screen
  const mw = menu.offsetWidth;
  const mh = menu.offsetHeight;
  menu.style.left = `${Math.min(x, window.innerWidth - mw - 6)}px`;
  menu.style.top = `${Math.min(y, window.innerHeight - mh - 6)}px`;
}

export function closeMenu() {
  const r = ensureRoot();
  if (r) clear(r);
}

window.addEventListener("pointerdown", (ev) => {
  const r = ensureRoot();
  if (r && !ev.target.closest(".ctx")) clear(r);
}, true);
