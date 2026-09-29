// First-run setup wizard — the "fully sets everything up" experience.
// Steps: Welcome → OpenCode CLI (auto-install if missing) → Zen key →
// Workspace → Done. Re-openable from Settings/chat errors.

import { h, clear, S } from "../lib/dom.js";
import { bridge } from "../bridge.js";

const el = () => document.getElementById("setup");

export async function maybeShow() {
  const st = await bridge.invoke("setup_status", {});
  if (!st.wizard_done || !st.opencode_installed) {
    show();
  } else {
    el().classList.add("hidden");
  }
}

export function show() {
  const host = el();
  host.classList.remove("hidden");
  clear(host);
  const card = h("div", { class: "setup-card" });
  host.append(card);
  stepWelcome(card);
}

function header(card, step, total, title, sub) {
  const steps = h("div", { class: "setup-steps" });
  for (let i = 0; i < total; i += 1) steps.append(h("div", { class: `dot-step${i < step ? " on" : ""}` }));
  card.append(
    h("h1", {}, title),
    h("div", { class: "sub", html: sub }),
    steps,
  );
}

function actions(card, { back, next, nextLabel = "Next", nextDisabled = false, onBack, onNext }) {
  const row = h("div", { class: "setup-actions" });
  if (back) row.append(h("button", { class: "btn", onclick: onBack }, "Back"));
  const n = h("button", { class: "btn primary", disabled: nextDisabled ? "true" : null, onclick: onNext }, nextLabel);
  row.append(n);
  card.append(row);
  return n;
}

function stepWelcome(card, total = 6) {
  clear(card);
  header(card, 1, total, "Welcome to OpenCode OS",
    "This machine comes with a built-in AI agent (OpenCode). Setup takes under a minute — " +
    "we check the CLI, link your free Zen key and prepare your workspace. You can skip anything optional.");
  actions(card, {
    onNext: () => stepOpencode(card, total),
    nextLabel: "Get started",
  });
}

async function stepOpencode(card, total) {
  clear(card);
  header(card, 2, total, "OpenCode CLI",
    "The chat, file helper and everything else runs on the local OpenCode CLI.");
  const status = h("div", { class: "setup-badge" }, "checking…");
  const log = h("div", { class: "setup-log hidden" });
  card.append(status, log);
  const st = await bridge.invoke("setup_status", {});
  if (st.opencode_installed) {
    status.classList.remove("bad");
    status.textContent = `OpenCode CLI found — version ${st.opencode_version}`;
    actions(card, { back: true, onBack: () => stepWelcome(card, total), onNext: () => stepZenKey(card, total) });
    return;
  }
  status.classList.add("bad");
  status.textContent = "OpenCode CLI not found — we'll install it now (official installer).";
  log.classList.remove("hidden");
  const nextBtn = actions(card, {
    back: true,
    onBack: () => stepWelcome(card, total),
    onNext: () => {},
    nextLabel: "Installing…",
    nextDisabled: true,
  });
  try {
    await bridge.streamInvoke("setup_install_opencode", {}, ({ ev }) => {
      if (!ev) return;
      if (ev.line) log.append(`${ev.line}\n`);
      log.scrollTop = log.scrollHeight;
      if (ev.done) {
        if (ev.ok) {
          status.classList.remove("bad");
          status.textContent = "OpenCode CLI installed successfully.";
        } else {
          status.classList.add("bad");
          status.textContent = "Install failed — see log. You can retry after restarting, or install manually (opencode.ai/docs).";
        }
        nextBtn.disabled = null;
        nextBtn.textContent = "Next";
        nextBtn.onclick = () => stepZenKey(card, total);
      }
    });
  } catch (e) {
    status.textContent = `Installer error: ${e.message || e}`;
    nextBtn.disabled = null;
    nextBtn.textContent = "Skip";
    nextBtn.onclick = () => stepZenKey(card, total);
  }
}

async function stepZenKey(card, total) {
  clear(card);
  header(card, 3, total, "OpenCode Zen — free models",
    "Paste your free Zen API key to enable chatting. Get one at <b>opencode.ai/auth</b>. " +
    "You can skip now and add it later in Settings — everything else still works.");
  const st = await bridge.invoke("setup_status", {});
  const input = h("input", { class: "setup-input", type: "password", placeholder: "Zen API key (sk-…)", value: "" });
  const skipNote = st.zen_key_set ? h("div", { class: "setup-check" }, "A key is already configured.") : null;
  const skip = h("label", { class: "setup-check" },
    h("input", { type: "checkbox", style: "width:auto" }), " Skip for now");
  card.append(input, skip);
  if (skipNote) card.append(skipNote);
  skip.querySelector("input").addEventListener("change", () => {
    input.disabled = skip.querySelector("input").checked;
  });
  let nextBtn;
  const onNext = () => {
    const useKey = !skip.querySelector("input").checked && input.value.trim();
    pendingKey = useKey ? input.value.trim() : "";
    stepWorkspace(card, total);
  };
  nextBtn = actions(card, { back: true, onBack: () => stepOpencode(card, total), onNext });
  input.focus();
}

async function stepWorkspace(card, total) {
  clear(card);
  header(card, 4, total, "Your workspace",
    "The folder your desktop and the AI work in. Files you see on the desktop live here.");
  const st = await bridge.invoke("setup_status", {});
  const input = h("input", { class: "setup-input", value: st.workspace, spellcheck: "false" });
  card.append(input);
  actions(card, {
    back: true,
    onBack: () => stepZenKey(card, total),
    onNext: async () => {
      const ws = input.value.trim();
      stepHostAccess(card, total, ws);
    },
    nextLabel: "Next",
  });
}

let pendingHostAccess = null;

async function stepHostAccess(card, total, workspace) {
  clear(card);
  header(card, 5, total, "Host access (optional)",
    "By default OpenCode OS only sees its own workspace. Turn on <b>This PC</b> to let the desktop " +
    "browse and edit real folders (Home, drives) — limited to the locations you pick, with system " +
    "folders always off-limits. You can change this any time in Settings.");
  const grant = h("label", { class: "setup-check", style: "margin-top:8px;" },
    h("input", { type: "checkbox", style: "width:auto" }),
    " Enable This PC — grant access to my Home folder");
  card.append(grant);
  actions(card, {
    back: true,
    onBack: () => stepWorkspace(card, total),
    onNext: () => {
      pendingHostAccess = grant.querySelector("input").checked;
      applyAndFinish(card, total, workspace);
    },
    nextLabel: "Finish setup",
  });
}

let pendingKey = null;

async function applyAndFinish(card, total, workspace) {
  clear(card);
  header(card, 6, total, "All set!",
    "Your machine is being prepared — starting the AI service now.");
  const status = h("div", { class: "setup-badge" }, "applying settings…");
  card.append(status);
  try {
    const settings = await bridge.invoke("settings_get", {});
    settings.wizard_done = true;
    if (workspace) settings.workspace = workspace;
    if (pendingKey != null) settings.zen_api_key = pendingKey;
    pendingKey = null;
    // Phase 2: consented host access grants the Home root only — extra roots
    // are opted into later via Settings → Host access.
    settings.host_access = {
      enabled: !!pendingHostAccess,
      allowed_roots: pendingHostAccess ? ["home"] : [],
    };
    pendingHostAccess = null;
    await bridge.invoke("settings_set", { settings });
    // Starting the AI service is best-effort here: it auto-retries on first
    // use, and a PATH refresh may need an app restart on some systems.
    let svcOk = true;
    try {
      await bridge.invoke("oc_start", {});
    } catch {
      svcOk = false;
    }
    status.textContent = svcOk
      ? "Everything is ready. Enjoy your OpenCode OS!"
      : "Setup complete. The AI service will start automatically on first use.";
    setTimeout(() => {
      el().classList.add("hidden");
      document.dispatchEvent(new CustomEvent("os:fs-changed", { detail: { path: "" } }));
      document.dispatchEvent(new CustomEvent("os:host-changed", {}));
    }, 900);
  } catch (e) {
    status.classList.add("bad");
    status.textContent = `Setup could not finish: ${e.message || e}`;
  }
}

export function init() {
  document.addEventListener("os:open-setup", () => show());
}
