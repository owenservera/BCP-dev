// Tiny DOM helpers + inline SVG icon set (no external assets).

export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null) continue;
    if (k === "class") el.className = v;
    else if (k === "dataset") Object.assign(el.dataset, v);
    else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === "html") el.innerHTML = v;
    else el.setAttribute(k, v);
  }
  for (const c of children.flat(9)) {
    if (c == null) continue;
    el.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return el;
}

export function clear(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

export const S = {
  folder: `<svg viewBox="0 0 48 48"><path fill="#FFB74D" d="M6 10h12l4 5h20a2 2 0 0 1 2 2v21a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V12a2 2 0 0 1 2-2z"/><path fill="#FFCC80" d="M4 18h40v20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V18z"/></svg>`,
  file: `<svg viewBox="0 0 48 48"><path fill="#E3E6EA" d="M10 4h20l10 10v30a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path fill="#C4CBD3" d="M30 4l10 10H30V4z"/><path stroke="#9AA5B0" stroke-width="2" stroke-linecap="round" d="M15 22h18M15 28h18M15 34h12"/></svg>`,
  txt: `<svg viewBox="0 0 48 48"><path fill="#CFE3F7" d="M10 4h20l10 10v30a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path fill="#9EC3EC" d="M30 4l10 10H30V4z"/><path stroke="#4A7BB5" stroke-width="2" stroke-linecap="round" d="M15 22h18M15 28h18M15 34h12"/></svg>`,
  md: `<svg viewBox="0 0 48 48"><path fill="#D7CCF5" d="M10 4h20l10 10v30a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path fill="#AC9AE8" d="M30 4l10 10H30V4z"/><path fill="#6C55C3" d="M12 24h4l4 5 4-5h4v12h-4v-6l-4 5-4-5v6h-4zM32 24l5 6 5-6z"/></svg>`,
  pc: `<svg viewBox="0 0 48 48"><rect x="4" y="8" width="40" height="26" rx="3" fill="#5B6773"/><rect x="8" y="12" width="32" height="18" rx="1.5" fill="#8FD0F0"/><path fill="#454F59" d="M14 38h20l4 6H10l4-6z"/></svg>`,
  explorer: `<svg viewBox="0 0 48 48"><path fill="#FFB74D" d="M6 10h12l4 5h20a2 2 0 0 1 2 2v21a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V12a2 2 0 0 1 2-2z"/><path fill="#FFE0B2" d="M4 18h40v20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V18z"/><path fill="#FFB74D" d="M12 22h14v3H12z"/></svg>`,
  notepad: `<svg viewBox="0 0 48 48"><rect x="8" y="4" width="32" height="40" rx="3" fill="#FFF8E1"/><rect x="8" y="4" width="32" height="8" rx="3" fill="#2196F3"/><path stroke="#90A4AE" stroke-width="2" stroke-linecap="round" d="M14 20h20M14 26h20M14 32h12"/></svg>`,
  chat: `<svg viewBox="0 0 48 48"><path fill="#4CC2FF" d="M24 6C13 6 4 13 4 22c0 5 3 9.4 7.6 12.3-.4 2.4-1.6 4.8-3.6 6.7 3.8-.3 7.2-1.7 9.8-3.6 2 .5 4.1.8 6.2.8 11 0 20-7 20-16.2S35 6 24 6z"/><circle cx="15" cy="22" r="2.4" fill="#0B3C5D"/><circle cx="24" cy="22" r="2.4" fill="#0B3C5D"/><circle cx="33" cy="22" r="2.4" fill="#0B3C5D"/></svg>`,
  trash: `<svg viewBox="0 0 48 48"><path fill="#90A4AE" d="M10 14h28l-3 28a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3l-3-28z"/><path fill="#78909C" d="M18 20l2 18h3l-2-18h-3zm12 0l-2 18h-3l2-18h3z"/><rect x="8" y="8" width="32" height="6" rx="2" fill="#607D8B"/><rect x="18" y="4" width="12" height="6" rx="2" fill="#607D8B"/></svg>`,
  settings: `<svg viewBox="0 0 48 48"><path fill="#78909C" d="M42 27v-6l-5-1.6a13 13 0 0 0-1.5-3.6l2.4-4.7-4.2-4.2-4.7 2.4A13 13 0 0 0 25.4 8L24 3h-6l-1.6 5a13 13 0 0 0-3.6 1.5L8.1 7.1 3.9 11.3l2.4 4.7A13 13 0 0 0 4.8 19.4L3 21v6l5 1.6a13 13 0 0 0 1.5 3.6l-2.4 4.7 4.2 4.2 4.7-2.4a13 13 0 0 0 3.6 1.5L21 45h6l1.6-5a13 13 0 0 0 3.6-1.5l4.7 2.4 4.2-4.2-2.4-4.7a13 13 0 0 0 1.5-3.6L42 27z" transform="translate(2 0) scale(.95)"/><circle cx="24" cy="24" r="7" fill="#CFD8DC"/></svg>`,
  start: `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="8.4" height="8.4" rx="1" fill="#4CC2FF"/><rect x="12.6" y="3" width="8.4" height="8.4" rx="1" fill="#4CC2FF"/><rect x="3" y="12.6" width="8.4" height="8.4" rx="1" fill="#4CC2FF"/><rect x="12.6" y="12.6" width="8.4" height="8.4" rx="1" fill="#4CC2FF"/></svg>`,
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`,
  fwd: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>`,
  up: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`,
  refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.6-6.3M21 3v6h-6"/></svg>`,
  newfolder: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 5h6l2 2h8a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm8 6v2h-2v2h2v2h2v-2h2v-2h-2v-2h-2z"/></svg>`,
  newfile: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h8l5 5v15H6V2zm8 1.5V8h4.5L14 3.5zM13 11h-2v2H9v2h2v2h2v-2h2v-2h-2v-2z"/></svg>`,
  power: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3v8M6.3 6.5a8 8 0 1 0 11.4 0"/></svg>`,
  send: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 11.5L21 3l-8.5 18-2.3-7.2L3 11.5z"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>`,
  min: `<svg viewBox="0 0 11 11"><path d="M1 5.5h9"/></svg>`,
  max: `<svg viewBox="0 0 11 11"><rect x="1.5" y="1.5" width="8" height="8" rx="1"/></svg>`,
  restore: `<svg viewBox="0 0 11 11"><rect x="0.5" y="3" width="7" height="7" rx="1"/><path d="M3 3V1h7v7H8.5" fill="none"/></svg>`,
  close: `<svg viewBox="0 0 11 11"><path d="M1 1l9 9M10 1l-9 9"/></svg>`,
};

export function glyph(name) {
  const span = document.createElement("span");
  span.style.display = "inline-grid";
  span.style.placeItems = "center";
  span.innerHTML = S[name] ?? S.file;
  return span;
}

let toastSeq = 0;
export function toast(msg, ms = 3200) {
  const root = document.getElementById("toast-root");
  const t = h("div", { class: "toast", id: `toast-${++toastSeq}` }, msg);
  root.append(t);
  setTimeout(() => t.remove(), ms);
}
