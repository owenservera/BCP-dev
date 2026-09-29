// Recycle Bin — lists .Trash contents, restore-less v1 (delete permanently).

import { h, clear, S, toast } from "../lib/dom.js";
import { bridge } from "../bridge.js";

export function createRecycler() {
  const rootEl = h("div", { class: "recycler" });
  const list = h("div", { class: "rec-list" });
  const emptyBtn = h("button", { class: "exp-btn" }, "Empty Recycle Bin");
  emptyBtn.addEventListener("click", async () => {
    try {
      const n = await bridge.invoke("trash_empty", {});
      toast(`Removed ${n} item${n === 1 ? "" : "s"}`);
      render();
    } catch (e) {
      toast(String(e.message || e).replace(/^.*error:\s*/, ""));
    }
  });
  const toolbar = h("div", { class: "rec-toolbar" }, emptyBtn);
  rootEl.append(toolbar, list);

  async function render() {
    clear(list);
    try {
      const items = await bridge.invoke("trash_list", {});
      if (!items.length) {
        list.append(h("div", { class: "rec-empty" }, "The Recycle Bin is empty."));
        return;
      }
      for (const it of items) {
        const row = h(
          "div",
          { class: "rec-row" },
          h("span", { html: it.kind === "dir" ? S.folder : S.file }),
          h("span", { class: "rr-name" }, it.name),
          h("button", { class: "rr-del" }, "Delete"),
        );
        row.querySelector(".rr-del").addEventListener("click", async () => {
          try {
            await bridge.invoke("trash_delete", { name: it.name });
            render();
          } catch (e) {
            toast(String(e.message || e).replace(/^.*error:\s*/, ""));
          }
        });
        list.append(row);
      }
    } catch (e) {
      list.append(h("div", { class: "rec-empty" }, String(e.message || e)));
    }
  }
  render();
  return rootEl;
}
