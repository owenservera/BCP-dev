// File Explorer — navigate, create, rename, delete (to Recycle Bin), search,
// open in Notepad. Works against the same bridge in Tauri and browser mode.

import { h, clear, S, toast } from "../lib/dom.js";
import { openMenu } from "../lib/ctxmenu.js";
import { basename, dirname, join, extOf, applyFilter, historyPush, historyBack, historyForward, fmtSize, fmtDate } from "../lib/path-util.js";
import { bridge } from "../bridge.js";

const OPENABLE = new Set(["txt", "md", "json", "js", "mjs", "ts", "css", "html", "rs", "toml", "yml", "yaml", "log", "ini", "cfg", "sh", "py", "csv"]);

export function createExplorer({ initialPath = "", onOpenFile } = {}) {
  const rootEl = h("div", { class: "explorer" });

  const state = {
    cwd: initialPath,
    history: [initialPath],
    hIdx: 0,
    filter: "",
    entries: [],
    selected: null,
  };
  let renameActive = false;
  let pendingRender = false;

  // ---- toolbar ----
  const backBtn = h("button", { class: "exp-btn", title: "Back", html: S.back });
  const fwdBtn = h("button", { class: "exp-btn", title: "Forward", html: S.fwd });
  const upBtn = h("button", { class: "exp-btn", title: "Up", html: S.up });
  const refreshBtn = h("button", { class: "exp-btn", title: "Refresh", html: S.refresh });
  const newDirBtn = h("button", { class: "exp-btn", html: S.newfolder }, "New folder");
  const newFileBtn = h("button", { class: "exp-btn", html: S.newfile }, "New file");
  const crumbs = h("div", { class: "exp-addr" });
  const search = h("input", { class: "exp-search", placeholder: "Search", spellcheck: "false" });

  const toolbar = h(
    "div",
    { class: "exp-toolbar" },
    backBtn, fwdBtn, upBtn, refreshBtn,
    h("div", { class: "exp-sep" }),
    newDirBtn, newFileBtn,
    h("div", { class: "exp-sep" }),
    crumbs,
    search,
  );

  // ---- sidebar ----
  const side = h("div", { class: "exp-side" });
  const sideHome = sideItem("pc", "Home", "");
  const sideTrash = sideItem("trash", "Recycle Bin", ".Trash");
  side.append(sideHome, sideTrash);

  // ---- grid + statusbar ----
  const grid = h("div", { class: "exp-grid" });
  const statusCount = h("span", {}, "0 items");
  const statusSel = h("span", {}, "");
  const statusbar = h("div", { class: "exp-statusbar" }, statusCount, statusSel);

  rootEl.append(toolbar, h("div", { class: "exp-main" }, side, grid), statusbar);

  function sideItem(icon, label, path) {
    const el = h("div", { class: "side-item" }, h("span", { html: S[icon] }), label);
    el.addEventListener("click", () => nav(path));
    return el;
  }

  // ---- navigation ----
  function nav(path) {
    const s2 = historyPush(state, path);
    Object.assign(state, s2);
    render();
  }
  function navBack() { Object.assign(state, historyBack(state)); render(); }
  function navFwd() { Object.assign(state, historyForward(state)); render(); }
  function navUp() { nav(dirname(state.cwd)); }

  backBtn.addEventListener("click", navBack);
  fwdBtn.addEventListener("click", navFwd);
  upBtn.addEventListener("click", navUp);
  refreshBtn.addEventListener("click", () => render());
  search.addEventListener("input", () => {
    state.filter = search.value;
    renderEntries();
  });

  async function render() {
    backBtn.disabled = state.hIdx <= 0;
    fwdBtn.disabled = state.hIdx >= state.history.length - 1;
    upBtn.disabled = state.cwd === "";
    sideTrash.classList.toggle("active", state.cwd === ".Trash");
    sideHome.classList.toggle("active", state.cwd === "");
    renderCrumbs();
    try {
      state.entries = await bridge.invoke("fs_list", { path: state.cwd });
    } catch (e) {
      state.entries = [];
      toast(String(e.message || e).replace(/^.*error:\s*/, ""));
      // recover to root if the folder vanished
      if (state.cwd !== "") { state.history = [""]; state.hIdx = 0; state.cwd = ""; }
    }
    renderEntries();
  }

  function renderCrumbs() {
    clear(crumbs);
    const parts = state.cwd ? state.cwd.split("/").filter(Boolean) : [];
    const mk = (label, path) =>
      h("span", {
        class: "crumb",
        onclick: () => nav(path),
      }, label);
    crumbs.append(mk("Home", ""));
    let acc = "";
    for (const p of parts) {
      acc = acc ? `${acc}/${p}` : p;
      crumbs.append(h("span", { class: "crumb-sep" }, "›"));
      crumbs.append(mk(p, acc));
    }
  }

  function glyphFor(entry) {
    if (entry.kind === "dir") return S.folder;
    const ext = extOf(entry.name);
    if (ext === "txt" || ext === "log") return S.txt;
    if (ext === "md") return S.md;
    return S.file;
  }

  function renderEntries() {
    // An active inline rename is an editing session — defer re-renders so the
    // input is never wiped mid-edit (refreshes replay after commit).
    if (renameActive) {
      pendingRender = true;
      return;
    }
    clear(grid);
    state.selected = null;
    statusSel.textContent = "";
    const shown = applyFilter(state.entries, state.filter);
    statusCount.textContent = `${shown.length} item${shown.length === 1 ? "" : "s"}`;
    if (!shown.length) {
      grid.append(
        h("div", { class: "exp-empty" },
          state.filter ? "No files match your search." : "This folder is empty.",
          h("div", {}, state.cwd === ".Trash" ? "" : "Right-click to create a folder or text file."),
        ),
      );
      return;
    }
    for (const entry of shown) {
      const el = h(
        "div",
        { class: "exp-item", "data-name": entry.name, "data-kind": entry.kind },
        h("div", { class: "ei-glyph", html: glyphFor(entry) }),
        h("div", { class: "ei-name" }, entry.name),
      );
      el.addEventListener("click", () => {
        grid.querySelectorAll(".exp-item.selected").forEach((n) => n.classList.remove("selected"));
        el.classList.add("selected");
        state.selected = entry;
        statusSel.textContent = entry.kind === "file" && entry.size ? fmtSize(entry.size) : "";
      });
      el.addEventListener("dblclick", () => activate(entry));
      el.addEventListener("contextmenu", (ev) => {
        ev.preventDefault();
        el.click();
        entryMenu(ev, entry, el);
      });
      grid.append(el);
    }
  }

  async function activate(entry) {
    if (entry.kind === "dir") {
      nav(join(state.cwd, entry.name));
      return;
    }
    const ext = extOf(entry.name);
    if (OPENABLE.has(ext) || entry.size < 512 * 1024) {
      onOpenFile && onOpenFile(join(state.cwd, entry.name));
    } else {
      toast("This file type cannot be opened in the viewer yet.");
    }
  }

  function entryMenu(ev, entry, el) {
    if (state.cwd === ".Trash") {
      openMenu(ev.clientX, ev.clientY, [
        { label: "Delete permanently", action: () => delTrash(entry) },
        "-",
        { label: "Empty Recycle Bin", action: emptyTrash },
      ]);
      return;
    }
    openMenu(ev.clientX, ev.clientY, [
      { label: entry.kind === "dir" ? "Open" : "Open in Notepad", action: () => activate(entry) },
      "-",
      { label: "Rename", hint: "F2", action: () => inlineRename(el, entry) },
      { label: "Delete", hint: "Del", action: () => del(entry) },
    ]);
  }

  async function inlineRename(el, entry) {
    const nameEl = el.querySelector(".ei-name");
    const input = h("input", { class: "ei-rename", value: entry.name, spellcheck: "false" });
    nameEl.replaceWith(input);
    renameActive = true;
    input.focus();
    input.select();
    const commit = async (cancel = false) => {
      if (!renameActive) return;
      renameActive = false;
      if (!cancel) {
        const newName = input.value.trim();
        if (newName && newName !== entry.name) {
          try {
            await bridge.invoke("fs_rename", { from: join(state.cwd, entry.name), to: join(state.cwd, newName) });
            document.dispatchEvent(new CustomEvent("os:fs-changed", { detail: { path: "" } }));
          } catch (e) {
            toast(String(e.message || e).replace(/^.*error:\s*/, ""));
          }
        }
      }
      renderEntries();
      if (pendingRender) {
        pendingRender = false;
        render();
      }
    };
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") { ev.preventDefault(); input._done = true; commit(); }
      if (ev.key === "Escape") { ev.preventDefault(); input._done = true; commit(true); }
    });
    input.addEventListener("blur", () => { if (!input._done) commit(); });
  }

  async function del(entry) {
    try {
      await bridge.invoke("fs_trash", { path: join(state.cwd, entry.name) });
      toast(`Moved '${entry.name}' to the Recycle Bin`);
      await render();
      document.dispatchEvent(new CustomEvent("os:fs-changed", { detail: { path: "" } }));
    } catch (e) {
      toast(String(e.message || e).replace(/^.*error:\s*/, ""));
    }
  }

  async function delTrash(entry) {
    try {
      await bridge.invoke("trash_delete", { name: entry.name });
      await render();
      document.dispatchEvent(new CustomEvent("os:fs-changed", { detail: { path: "" } }));
    } catch (e) {
      toast(String(e.message || e).replace(/^.*error:\s*/, ""));
    }
  }

  async function emptyTrash() {
    try {
      const n = await bridge.invoke("trash_empty", {});
      toast(`Recycle Bin emptied (${n} item${n === 1 ? "" : "s"})`);
      await render();
    } catch (e) {
      toast(String(e.message || e).replace(/^.*error:\s*/, ""));
    }
  }

  async function newFolder() {
    try {
      await bridge.invoke("fs_mkdir", { path: join(state.cwd, "New folder") });
      await render();
      document.dispatchEvent(new CustomEvent("os:fs-changed", { detail: { path: state.cwd } }));
      // start rename on the new entry
      const el = [...grid.querySelectorAll(".exp-item")].find((n) => n.dataset.name === "New folder");
      if (el) inlineRename(el, { name: "New folder", kind: "dir" });
    } catch (e) {
      toast(String(e.message || e).replace(/^.*error:\s*/, ""));
    }
  }

  async function newFile() {
    try {
      await bridge.invoke("fs_write", { path: join(state.cwd, "New file.txt"), content: "" });
      await render();
      const el = [...grid.querySelectorAll(".exp-item")].find((n) => n.dataset.name === "New file.txt");
      if (el) inlineRename(el, { name: "New file.txt", kind: "file" });
    } catch (e) {
      toast(String(e.message || e).replace(/^.*error:\s*/, ""));
    }
  }

  newDirBtn.addEventListener("click", newFolder);
  newFileBtn.addEventListener("click", newFile);

  grid.addEventListener("contextmenu", (ev) => {
    if (ev.target.closest(".exp-item")) return;
    ev.preventDefault();
    if (state.cwd === ".Trash") {
      openMenu(ev.clientX, ev.clientY, [{ label: "Empty Recycle Bin", action: emptyTrash }]);
      return;
    }
    openMenu(ev.clientX, ev.clientY, [
      { label: "New folder", action: newFolder },
      { label: "New text file", action: newFile },
      "-",
      { label: "Refresh", action: () => render() },
    ]);
  });

  rootEl.addEventListener("keydown", (ev) => {
    // Never hijack keys typed into the inline-rename input or the search box:
    // Enter while renaming must not re-activate the item, Delete must not trash it.
    if (ev.target === search) return;
    if (ev.target.closest && ev.target.closest(".ei-rename")) return;
    if (ev.key === "F2" && state.selected) {
      const el = [...grid.querySelectorAll(".exp-item")].find((n) => n.dataset.name === state.selected.name);
      if (el) inlineRename(el, state.selected);
    }
    if (ev.key === "Delete" && state.selected) {
      if (state.cwd === ".Trash") delTrash(state.selected);
      else del(state.selected);
    }
    if (ev.key === "Backspace" && state.cwd !== "") navUp();
    if (ev.key === "Enter" && state.selected) activate(state.selected);
  });
  rootEl.tabIndex = -1;

  document.addEventListener("os:fs-changed", (ev) => {
    // refresh only if the change touched our cwd or an ancestor
    if (!ev.detail || ev.detail.path === state.cwd || state.cwd.startsWith(ev.detail.path) || ev.detail.path === "") render();
  });

  render();
  return rootEl;
}

export { basename, dirname };
