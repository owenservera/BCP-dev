// This PC — Phase 2 "Host access as an app".
// Browses the REAL machine (home, drives, volumes) behind the settings
// allowlist. Reuses the Explorer visual language (.exp-* classes).

import { h, clear, S, toast } from "../lib/dom.js";
import { openMenu } from "../lib/ctxmenu.js";
import { basename, extOf, fmtSize, historyPush, historyBack, historyForward, isHostPath, parseHostPath, formatHostPath } from "../lib/path-util.js";
import { bridge } from "../bridge.js";

const OPENABLE = new Set(["txt", "md", "json", "js", "mjs", "ts", "css", "html", "rs", "toml", "yml", "yaml", "log", "ini", "cfg", "sh", "py", "csv"]);

// state.cwd === ""            -> show the roots grid
// state.cwd === host://root/a -> inside a host root
export function createHostApp({ onOpenFile } = {}) {
  const rootEl = h("div", { class: "explorer host-app" });

  const state = { cwd: "", history: [""], hIdx: 0, entries: [], roots: [], selected: null };
  // Same guard as Explorer: an active inline rename is an editing session —
  // deferred re-renders must never wipe the input mid-edit.
  let renameActive = false;
  let pendingRender = false;

  // ---- toolbar ----
  const backBtn = h("button", { class: "exp-btn", title: "Back", html: S.back });
  const fwdBtn = h("button", { class: "exp-btn", title: "Forward", html: S.fwd });
  const upBtn = h("button", { class: "exp-btn", title: "Up", html: S.up });
  const refreshBtn = h("button", { class: "exp-btn", title: "Refresh", html: S.refresh });
  const crumbs = h("div", { class: "exp-addr" });
  const toolbar = h("div", { class: "exp-toolbar" }, backBtn, fwdBtn, upBtn, refreshBtn, h("div", { class: "exp-sep" }), crumbs);

  const grid = h("div", { class: "exp-grid" });
  const statusCount = h("span", {}, "");
  const statusSel = h("span", {}, "");
  const statusbar = h("div", { class: "exp-statusbar" }, statusCount, statusSel);
  rootEl.append(toolbar, grid, statusbar);

  backBtn.addEventListener("click", () => { Object.assign(state, historyBack(state)); render(); });
  fwdBtn.addEventListener("click", () => { Object.assign(state, historyForward(state)); render(); });
  upBtn.addEventListener("click", () => nav(upOf(state.cwd)));
  refreshBtn.addEventListener("click", () => render());

  function nav(path) {
    const s2 = historyPush(state, path);
    Object.assign(state, s2);
    render();
  }
  function upOf(p) {
    if (!isHostPath(p)) return "";
    const { root, rel } = parseHostPath(p);
    if (!rel) return "";
    const parts = rel.split("/").filter(Boolean);
    parts.pop();
    return formatHostPath(root, parts.join("/"));
  }

  async function render() {
    backBtn.disabled = state.hIdx <= 0;
    fwdBtn.disabled = state.hIdx >= state.history.length - 1;
    upBtn.disabled = !isHostPath(state.cwd);
    renderCrumbs();
    try {
      if (!isHostPath(state.cwd)) {
        state.roots = await bridge.invoke("host_roots", {});
        renderRoots();
      } else {
        const { root, rel } = parseHostPath(state.cwd);
        state.entries = await bridge.invoke("host_list", { root, path: rel });
        renderEntries();
      }
      rootEl.dataset.disabled = "";
    } catch (e) {
      const msg = String(e.message || e).replace(/^.*error:\s*/, "");
      renderBlocked(msg);
    }
  }

  function renderCrumbs() {
    clear(crumbs);
    crumbs.append(h("span", { class: "crumb", onclick: () => nav("") }, "This PC"));
    if (!isHostPath(state.cwd)) return;
    const { root, rel } = parseHostPath(state.cwd);
    const rootLabel = state.roots.find((r) => r.id === root)?.label ?? root;
    let acc = formatHostPath(root, "");
    crumbs.append(h("span", { class: "crumb-sep" }, "›"));
    crumbs.append(h("span", { class: "crumb", onclick: () => nav(acc) }, rootLabel));
    let relAcc = "";
    for (const p of rel.split("/").filter(Boolean)) {
      relAcc = relAcc ? `${relAcc}/${p}` : p;
      crumbs.append(h("span", { class: "crumb-sep" }, "›"));
      const target = formatHostPath(root, relAcc);
      crumbs.append(h("span", { class: "crumb", onclick: () => nav(target) }, p));
    }
  }

  function renderRoots() {
    clear(grid);
    state.selected = null;
    const allowed = state.roots.filter((r) => r.allowed);
    const denied = state.roots.filter((r) => !r.allowed);
    statusCount.textContent = `${allowed.length} location${allowed.length === 1 ? "" : "s"}`;
    if (!allowed.length) {
      grid.append(
        h("div", { class: "exp-empty" },
          "Host access is not enabled.",
          h("div", {}, "Open Settings → Host access, switch it on and pick the locations This PC may see."),
          h("div", { style: "margin-top:10px;" },
            h("button", {
              class: "btn primary",
              onclick: () => document.dispatchEvent(new CustomEvent("os:launch", { detail: { key: "settings" } })),
            }, "Open Settings"),
          ),
        ),
      );
      return;
    }
    for (const r of allowed) {
      const el = h(
        "div",
        { class: "exp-item", "data-name": r.label, "data-kind": "dir", title: r.path },
        h("div", { class: "ei-glyph", html: r.kind === "home" ? S.pc : S.folder }),
        h("div", { class: "ei-name" }, r.label),
      );
      el.addEventListener("dblclick", () => nav(formatHostPath(r.id, "")));
      el.addEventListener("contextmenu", (ev) => {
        ev.preventDefault();
        openMenu(ev.clientX, ev.clientY, [
          { label: "Open", action: () => nav(formatHostPath(r.id, "")) },
          { label: "Use as OpenCode working folder", action: () => useInChat(r.path) },
        ]);
      });
      grid.append(el);
    }
    if (denied.length) {
      grid.append(h("div", { class: "exp-empty", style: "grid-column:1/-1;padding-top:14px;" },
        `${denied.length} more location${denied.length === 1 ? "" : "s"} on this machine are not granted — enable them in Settings → Host access.`));
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
    if (renameActive) {
      pendingRender = true;
      return;
    }
    clear(grid);
    state.selected = null;
    statusSel.textContent = "";
    const { root } = parseHostPath(state.cwd);
    const shown = state.entries;
    statusCount.textContent = `${shown.length} item${shown.length === 1 ? "" : "s"}`;
    if (!shown.length) {
      grid.append(h("div", { class: "exp-empty" }, "This folder is empty.", h("div", {}, "Right-click to create a folder or text file.")));
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
        entryMenu(ev, entry);
      });
      grid.append(el);
    }
    void root;
  }

  async function activate(entry) {
    const { root, rel } = parseHostPath(state.cwd);
    const childRel = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.kind === "dir") {
      nav(formatHostPath(root, childRel));
      return;
    }
    const ext = extOf(entry.name);
    if (OPENABLE.has(ext) || entry.size < 512 * 1024) {
      onOpenFile && onOpenFile(formatHostPath(root, childRel));
    } else {
      toast("This file type cannot be opened in the viewer yet.");
    }
  }

  function entryMenu(ev, entry) {
    const { root, rel } = parseHostPath(state.cwd);
    const childRel = rel ? `${rel}/${entry.name}` : entry.name;
    const abs = absoluteOf(root, childRel);
    const items = [
      { label: entry.kind === "dir" ? "Open" : "Open in Notepad", action: () => activate(entry) },
    ];
    if (entry.kind === "dir") {
      items.push({ label: "Use as OpenCode working folder", action: () => useInChat(abs) });
    }
    items.push(
      "-",
      { label: "Rename", hint: "F2", action: () => inlineRename(entry, childRel) },
      { label: "Delete permanently", hint: "Del", action: () => del(entry, childRel) },
    );
    openMenu(ev.clientX, ev.clientY, items);
  }

  function absoluteOf(rootId, rel) {
    const r = state.roots.find((x) => x.id === rootId);
    return r ? `${r.path.replace(/[\\/]+$/, "")}/${rel}` : rel;
  }

  async function useInChat(absPath) {
    try {
      await bridge.invoke("oc_set_cwd", { path: absPath });
      toast(`OpenCode now works in ${absPath}`);
      document.dispatchEvent(new CustomEvent("os:chat-attach", { detail: { path: absPath } }));
    } catch (e) {
      toast(String(e.message || e).replace(/^.*error:\s*/, ""));
    }
  }

  async function inlineRename(entry, childRel) {
    // find the grid element and swap in an input (Explorer behaviour)
    const el = [...grid.querySelectorAll(".exp-item")].find((n) => n.dataset.name === entry.name);
    if (!el) return;
    const nameEl = el.querySelector(".ei-name");
    const input = h("input", { class: "ei-rename", value: entry.name, spellcheck: "false" });
    nameEl.replaceWith(input);
    renameActive = true;
    input.focus();
    input.select();
    let done = false;
    const commit = async (cancel = false) => {
      if (done || !renameActive) return;
      renameActive = false;
      const newName = input.value.trim();
      if (!cancel && newName && newName !== entry.name) {
        const { root, rel } = parseHostPath(state.cwd);
        const toRel = rel ? `${rel}/${newName}` : newName;
        try {
          await bridge.invoke("host_rename", { root, from: childRel, to: toRel });
          notifyHostChanged(root, rel);
        } catch (e) {
          toast(String(e.message || e).replace(/^.*error:\s*/, ""));
        }
      }
      renderEntries();
      if (pendingRender) {
        pendingRender = false;
        render();
      }
    };
    input.addEventListener("keydown", (ev2) => {
      if (ev2.key === "Enter") { ev2.preventDefault(); input._done = true; commit(); }
      if (ev2.key === "Escape") { ev2.preventDefault(); input._done = true; commit(true); }
    });
    input.addEventListener("blur", () => { if (!input._done) commit(); });
  }

  async function del(entry, childRel) {
    if (!window.confirm(`Delete '${entry.name}' permanently from the host? This cannot be undone.`)) return;
    try {
      const { root, rel } = parseHostPath(state.cwd);
      await bridge.invoke("host_delete", { root, path: childRel });
      toast(`Deleted '${entry.name}'`);
      await render();
      notifyHostChanged(root, rel);
    } catch (e) {
      toast(String(e.message || e).replace(/^.*error:\s*/, ""));
    }
  }

  function notifyHostChanged(root, rel) {
    document.dispatchEvent(new CustomEvent("os:host-fs-changed", { detail: { root, path: rel ?? "" } }));
  }

  async function newFolder() {
    const { root, rel } = parseHostPath(state.cwd);
    try {
      await bridge.invoke("host_mkdir", { root, path: "New folder" });
      await render();
      notifyHostChanged(root, rel);
      const el = [...grid.querySelectorAll(".exp-item")].find((n) => n.dataset.name === "New folder");
      if (el) inlineRename({ name: "New folder", kind: "dir" }, rel ? `${rel}/New folder` : "New folder");
    } catch (e) {
      toast(String(e.message || e).replace(/^.*error:\s*/, ""));
    }
  }

  async function newFile() {
    const { root, rel } = parseHostPath(state.cwd);
    try {
      const childRel = rel ? `${rel}/New file.txt` : "New file.txt";
      await bridge.invoke("host_write", { root, path: childRel, content: "" });
      await render();
      notifyHostChanged(root, rel);
      const el = [...grid.querySelectorAll(".exp-item")].find((n) => n.dataset.name === "New file.txt");
      if (el) inlineRename({ name: "New file.txt", kind: "file" }, childRel);
    } catch (e) {
      toast(String(e.message || e).replace(/^.*error:\s*/, ""));
    }
  }

  function renderBlocked(message) {
    clear(grid);
    statusCount.textContent = "";
    grid.append(
      h("div", { class: "exp-empty" },
        message || "Host access is unavailable.",
        h("div", {}, "Open Settings → Host access to review the permission."),
        h("div", { style: "margin-top:10px;" },
          h("button", {
            class: "btn primary",
            onclick: () => document.dispatchEvent(new CustomEvent("os:launch", { detail: { key: "settings" } })),
          }, "Open Settings"),
        ),
      ),
    );
  }

  grid.addEventListener("contextmenu", (ev) => {
    if (ev.target.closest(".exp-item")) return;
    ev.preventDefault();
    if (!isHostPath(state.cwd)) return;
    openMenu(ev.clientX, ev.clientY, [
      { label: "New folder", action: newFolder },
      { label: "New text file", action: newFile },
      "-",
      { label: "Refresh", action: () => render() },
    ]);
  });

  rootEl.addEventListener("keydown", (ev) => {
    if (ev.target.closest && ev.target.closest(".ei-rename")) return;
    if (ev.key === "F2" && state.selected && isHostPath(state.cwd)) {
      const { root, rel } = parseHostPath(state.cwd);
      const childRel = rel ? `${rel}/${state.selected.name}` : state.selected.name;
      inlineRename(state.selected, childRel);
    }
    if (ev.key === "Delete" && state.selected && isHostPath(state.cwd)) {
      const { root, rel } = parseHostPath(state.cwd);
      const childRel = rel ? `${rel}/${state.selected.name}` : state.selected.name;
      del(state.selected, childRel);
    }
    if (ev.key === "Backspace" && isHostPath(state.cwd)) nav(upOf(state.cwd));
    if (ev.key === "Enter" && state.selected) activate(state.selected);
  });
  rootEl.tabIndex = -1;

  document.addEventListener("os:host-fs-changed", (ev) => {
    if (!isHostPath(state.cwd)) return;
    const cur = parseHostPath(state.cwd);
    if (!ev.detail || ev.detail.root === cur.root) render();
  });
  document.addEventListener("os:host-changed", () => render());

  render();
  return rootEl;
}

export { basename };
