// Taskbar — start button, pinned apps, running windows, chat indicator, clock.

import { h, clear, S } from "./lib/dom.js";
import { fmtClock } from "./lib/path-util.js";

const clock = { time: null, date: null, timer: null };

export function init({ onStart, onChat, onOpenWindow }) {
  const startBtn = document.getElementById("start-btn");
  startBtn.append(h("span", { html: S.start }));

  const chatBtn = document.getElementById("tb-chat-indicator");
  chatBtn.append(h("span", { html: S.chat }));
  chatBtn.append(h("span", { class: "dot" }));
  chatBtn.addEventListener("click", onChat);
  chatBtn.classList.add("offline");

  const search = document.getElementById("tb-search");
  search.addEventListener("click", () => onOpenWindow("explorer", { search: true }));

  startBtn.addEventListener("click", (ev) => {
    ev.stopPropagation();
    onStart();
  });

  clock.time = document.getElementById("clock-time");
  clock.date = document.getElementById("clock-date");
  tick();
  clock.timer = setInterval(tick, 10_000);
}

function tick() {
  const f = fmtClock(new Date());
  clock.time.textContent = f.time;
  clock.date.textContent = f.date;
}

export function setChatOnline(online) {
  const chatBtn = document.getElementById("tb-chat-indicator");
  chatBtn.classList.toggle("online", !!online);
}

export function renderWindows(windows, { onFocus, onToggle }) {
  const host = document.getElementById("tb-apps");
  clear(host);
  for (const w of windows) {
    const btn = h(
      "button",
      {
        class: `tb-app${w.minimized ? " minimized" : ""}`,
        title: w.title,
        onclick: () => onToggle(w),
      },
      h("span", { html: S[w.icon] ?? S.file }),
      h("span", { class: "tb-underline" }),
    );
    if (w.focused && !w.minimized) btn.classList.add("active");
    btn.dataset.winId = w.id;
    host.append(btn);
  }
}
