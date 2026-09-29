// Settings / About — honest system info, setup links, re-run wizard.

import { h, S, toast } from "../lib/dom.js";
import { bridge } from "../bridge.js";

export function createSettings() {
  const rootEl = h("div", { class: "settings-app" });
  const pill = (ok, okText, warnText) =>
    h("span", { class: `status-pill ${ok ? "ok" : "warn"}` }, ok ? okText : warnText);

  (async () => {
    let info = {};
    let settings = {};
    let roots = [];
    try {
      info = await bridge.invoke("sys_info", {});
      settings = await bridge.invoke("settings_get", {});
      roots = await bridge.invoke("host_roots", {}).catch(() => []);
    } catch (e) {
      rootEl.append(h("p", {}, `Could not load settings: ${e.message || e}`));
      return;
    }
    const oc = info.opencode_installed;
    const ha = settings.host_access ?? { enabled: false, allowed_roots: [] };

    // --- Host access (Phase 2) ---
    const hostToggle = h("input", { type: "checkbox", style: "width:auto" });
    hostToggle.checked = !!ha.enabled;
    const rootChecks = roots.map((r) => {
      const cb = h("input", { type: "checkbox", style: "width:auto" });
      cb.checked = ha.allowed_roots.includes(r.id);
      cb.disabled = !hostToggle.checked;
      const rowEl = h(
        "label",
        { class: "set-row", style: "align-items:center;" },
        h("div", { style: "display:flex;align-items:center;gap:8px;" }, cb, h("span", {}, `${r.label} `),
          h("code", {}, r.path)),
        h("div", { class: "val" }, h("span", { class: `status-pill ${cb.checked ? "ok" : "warn"}` }, cb.checked ? "granted" : "blocked")),
      );
      cb.addEventListener("change", () => {
        rowEl.querySelector(".status-pill").className = `status-pill ${cb.checked ? "ok" : "warn"}`;
        rowEl.querySelector(".status-pill").textContent = cb.checked ? "granted" : "blocked";
      });
      return { cb, rowEl, root: r };
    });
    hostToggle.addEventListener("change", () => {
      for (const { cb } of rootChecks) cb.disabled = !hostToggle.checked;
    });
    const hostStatus = h("span", { class: `status-pill ${ha.enabled ? "ok" : "warn"}` }, ha.enabled ? "on" : "off");
    const saveBtn = h("button", {
      class: "btn primary",
      onclick: async () => {
        try {
          const next = { ...settings };
          next.host_access = {
            enabled: hostToggle.checked,
            allowed_roots: hostToggle.checked
              ? rootChecks.filter(({ cb }) => cb.checked).map(({ root }) => root.id)
              : [],
          };
          await bridge.invoke("settings_set", { settings: next });
          settings = next;
          hostStatus.className = `status-pill ${hostToggle.checked ? "ok" : "warn"}`;
          hostStatus.textContent = hostToggle.checked ? "on" : "off";
          toast(`Host access ${hostToggle.checked ? "enabled" : "disabled"}`);
          document.dispatchEvent(new CustomEvent("os:host-changed", {}));
        } catch (e) {
          toast(String(e.message || e).replace(/^.*error:\s*/, ""));
        }
      },
    }, "Save host access");

    rootEl.append(
      h("h2", {}, "Settings"),
      h("p", { class: "hint" }, "OpenCode OS — your desktop for the OpenCode CLI."),
      h("div", { class: "sec" },
        h("h3", {}, "Machine"),
        row("OpenCode OS version", `<code>${info.app_version ?? "?"}</code>`),
        row("OpenCode CLI", pill(oc, `installed ${info.opencode_version ?? ""}`, "not installed")),
        row("Platform", info.os ?? "?"),
        row("Workspace", `<code>${info.workspace ?? "?"}</code>`),
      ),
      h("div", { class: "sec" },
        h("h3", {}, "AI service (OpenCode Zen)"),
        row("Zen API key", pill(settings.zen_api_key ? true : false, "configured", "not set")),
        row("Default model", `<code>${settings.model ?? "?"}</code>`),
        h("p", { class: "hint" },
          "Free models are provided by OpenCode Zen. Get a key at ",
          h("a", { href: "https://opencode.ai/auth", target: "_blank", rel: "noreferrer" }, "opencode.ai/auth"),
          " — it takes about a minute.",
        ),
      ),
      h("div", { class: "sec" },
        h("h3", {}, "Host access (This PC)"),
        row("Host access", hostStatus),
        h("label", { class: "set-row", style: "align-items:center;" },
          h("div", { style: "display:flex;align-items:center;gap:8px;" }, hostToggle, h("span", {}, "Enable access to this computer")),
          h("div", { class: "val" })),
        h("p", { class: "hint" },
          "Off by default. When enabled, the This PC app can browse and edit ONLY the locations you tick below — ",
          "system folders stay untouchable and hidden files are never listed.",
        ),
        ...rootChecks.map(({ rowEl }) => rowEl),
        h("div", { style: "display:flex;gap:10px;margin-top:10px;" }, saveBtn),
      ),
      h("div", { class: "sec" },
        h("h3", {}, "Setup"),
        h("div", { style: "display:flex;gap:10px;margin-top:6px;" },
          h("button", {
            class: "btn primary",
            onclick: () => document.dispatchEvent(new CustomEvent("os:open-setup")),
          }, "Re-run first-run setup"),
        ),
      ),
    );
  })();

  function row(label, valueHtml) {
    const val = h("div", { class: "val" });
    if (typeof valueHtml === "string") val.innerHTML = valueHtml;
    else val.append(valueHtml);
    return h("div", { class: "set-row" }, h("div", {}, label), val);
  }

  return rootEl;
}

export { toast };
