// Notepad — open, edit, save (Ctrl+S), Save As. Persists to the real fs.
// Phase 2: also edits HOST files via the "host://<root>/<rel>" path scheme.

import { h, clear, S, toast } from "../lib/dom.js";
import { bridge } from "../bridge.js";
import { dirname, basename, isHostPath, parseHostPath, formatHostPath } from "../lib/path-util.js";

export function createNotepad({ path = null } = {}) {
  const rootEl = h("div", { class: "notepad" });
  let currentPath = path;
  let dirty = false;
  let titleCb = null; // set by main.js to update window title

  const ta = h("textarea", { spellcheck: "false", placeholder: "Start typing…" });
  const statusPath = h("span", {}, currentPath ?? "unsaved");
  const statusLen = h("span", {}, "0 chars");

  const fileMenu = h("div", { class: "np-dropdown hidden" },
    item("Save", save),
    item("Save As…", saveAs),
    "-",
    item("Close", () => rootEl.closest(".win") && rootEl.closest(".win").querySelector(".win-ctl.close").click()),
  );
  const fileBtn = h("button", { class: "np-menu-btn" }, "File", fileMenu);
  fileBtn.addEventListener("click", (ev) => {
    ev.stopPropagation();
    fileMenu.classList.toggle("hidden");
    fileBtn.classList.toggle("open", !fileMenu.classList.contains("hidden"));
  });
  window.addEventListener("pointerdown", (ev) => {
    if (!ev.target.closest(".np-menu-btn")) {
      fileMenu.classList.add("hidden");
      fileBtn.classList.remove("open");
    }
  });

  const menu = h("div", { class: "np-menu" }, fileBtn);
  const statusbar = h("div", { class: "np-statusbar" }, statusPath, statusLen);
  rootEl.append(menu, ta, statusbar);

  function item(label, action, hint) {
    return h("div", { class: "ctx-item", onclick: () => { fileMenu.classList.add("hidden"); action(); } },
      h("span", {}, label), hint ? h("span", { class: "ctx-hint" }, hint) : null);
  }

  ta.addEventListener("input", () => {
    dirty = true;
    statusLen.textContent = `${ta.value.length} chars`;
    emitTitle();
  });
  ta.addEventListener("keydown", (ev) => {
    if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === "s") {
      ev.preventDefault();
      save();
    }
  });

  function emitTitle() {
    titleCb && titleCb(`${dirty ? "*" : ""}${titleLabel(currentPath)} — Notepad`);
  }

  function titleLabel(p) {
    if (!p) return "Untitled";
    if (isHostPath(p)) {
      const { root, rel } = parseHostPath(p);
      return `This PC/${root}/${rel}`;
    }
    return p;
  }

  async function load() {
    if (!currentPath) return;
    try {
      let content;
      if (isHostPath(currentPath)) {
        const { root, rel } = parseHostPath(currentPath);
        content = await bridge.invoke("host_read", { root, path: rel });
      } else {
        content = await bridge.invoke("fs_read", { path: currentPath });
      }
      ta.value = content;
      dirty = false;
      statusLen.textContent = `${content.length} chars`;
      statusPath.textContent = titleLabel(currentPath);
      emitTitle();
    } catch (e) {
      toast(String(e.message || e).replace(/^.*error:\s*/, ""));
    }
  }

  async function save() {
    if (!currentPath) return saveAs();
    try {
      if (isHostPath(currentPath)) {
        const { root, rel } = parseHostPath(currentPath);
        await bridge.invoke("host_write", { root, path: rel, content: ta.value });
        const absDir = rel.split("/").slice(0, -1).join("/");
        document.dispatchEvent(new CustomEvent("os:host-fs-changed", { detail: { root, path: absDir } }));
      } else {
        await bridge.invoke("fs_write", { path: currentPath, content: ta.value });
        document.dispatchEvent(new CustomEvent("os:fs-changed", { detail: { path: dirname(currentPath) } }));
      }
      dirty = false;
      emitTitle();
      toast(`Saved ${titleLabel(currentPath)}`);
    } catch (e) {
      toast(String(e.message || e).replace(/^.*error:\s*/, ""));
    }
  }

  async function saveAs() {
    const hostMode = isHostPath(currentPath);
    let suggested = currentPath ?? "Untitled.txt";
    if (hostMode) suggested = parseHostPath(currentPath).rel || "Untitled.txt";
    const name = window.prompt("Save as (name or folder/name):", suggested);
    if (!name) return;
    const clean = String(name).trim().replace(/^\/+|\/+$/g, "");
    if (!clean) return;
    try {
      if (hostMode) {
        const { root } = parseHostPath(currentPath);
        await bridge.invoke("host_write", { root, path: clean, content: ta.value });
        currentPath = formatHostPath(root, clean);
        document.dispatchEvent(new CustomEvent("os:host-fs-changed", { detail: { root, path: dirname(clean) } }));
      } else {
        await bridge.invoke("fs_write", { path: clean, content: ta.value });
        currentPath = clean;
        document.dispatchEvent(new CustomEvent("os:fs-changed", { detail: { path: dirname(clean) } }));
      }
      dirty = false;
      statusPath.textContent = titleLabel(currentPath);
      emitTitle();
      toast(`Saved ${basename(clean)}`);
    } catch (e) {
      toast(String(e.message || e).replace(/^.*error:\s*/, ""));
    }
  }

  if (path) load();
  else emitTitle();

  return { el: rootEl, setTitleListener(cb) { titleCb = cb; emitTitle(); }, save };
}
