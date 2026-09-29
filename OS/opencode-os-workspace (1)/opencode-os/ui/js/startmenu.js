// Start menu — app grid + power.

import { h, clear, S } from "./lib/dom.js";

export function init({ apps, onLaunch, onShutdown }) {
  const menu = document.getElementById("startmenu");
  const grid = menu.querySelector(".sm-apps");
  clear(grid);
  menu.querySelector(".sm-apps").before(h("div", { class: "sm-head" }, "Pinned"));

  for (const app of apps) {
    grid.append(
      h(
        "div",
        { class: "sm-app", onclick: () => { hide(); onLaunch(app.key); } },
        h("span", { html: S[app.icon] }),
        h("span", {}, app.label),
      ),
    );
  }

  document.getElementById("sm-shutdown").append(h("span", { html: S.power }));
  document.getElementById("sm-shutdown").addEventListener("click", () => {
    hide();
    onShutdown();
  });

  // close on outside click
  window.addEventListener("pointerdown", (ev) => {
    if (!menu.classList.contains("hidden")) {
      if (!ev.target.closest("#startmenu") && !ev.target.closest("#start-btn")) hide();
    }
  }, true);
}

export function show() {
  document.getElementById("startmenu").classList.remove("hidden");
}

export function hide() {
  document.getElementById("startmenu").classList.add("hidden");
}

export function toggle() {
  const m = document.getElementById("startmenu");
  if (m.classList.contains("hidden")) show();
  else hide();
}
