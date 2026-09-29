// Floating chat — the first-class app of OpenCode OS.
// Always visible above other windows, draggable, minimizable to the taskbar,
// wired to the underlying OpenCode CLI (sessions + streamed replies).

import { h, clear, S, toast } from "../lib/dom.js";
import { bridge, onStream } from "../bridge.js";

export const FREE_MODELS = [
  ["opencode/space-bunny-free", "Space Bunny (free)"],
  ["opencode/nemotron-3.5-lightning-free", "Nemotron 3.5 Lightning (free)"],
  ["opencode/ling-3.0-flash-fin-free", "Ling 3.0 Flash (free)"],
  ["opencode/longcat-2.5-preview-free", "Longcat 2.5 Preview (free)"],
  ["opencode/mimo-v2.6-flash-free", "Mimo 2.6 Flash (free)"],
  ["opencode/nemotron-3-ultra-free", "Nemotron 3 Ultra (free)"],
  ["opencode/big-pickle", "Big Pickle (free)"],
];

const state = {
  el: null,
  msgs: null,
  input: null,
  send: null,
  status: null,
  sessionsEl: null,
  modelSel: null,
  minimized: false,
  currentSession: null,
  pendingTask: null,
  activeStreamEl: null,
  contextPath: null,
  online: false,
};

export function init() {
  if (state.el) return state.el;

  // --- header ---
  const status = h("span", { class: "chat-status" }, "offline");
  const btnMin = h("button", { class: "chat-head-btn", title: "Minimize", html: S.min });
  btnMin.addEventListener("click", () => minimize());
  const head = h(
    "div",
    { class: "chat-head" },
    h("span", { class: "ch-icon", html: S.chat }),
    h("span", { class: "ch-title" }, "OpenCode Chat"),
    status,
    btnMin,
  );

  // --- tabs ---
  const tabChat = h("div", { class: "chat-tab active" }, "Chat");
  const tabSessions = h("div", { class: "chat-tab" }, "Sessions");
  const tabs = h("div", { class: "chat-tabs" }, tabChat, tabSessions);

  // --- chat tab ---
  const msgs = h("div", { class: "chat-msgs" });
  const input = h("textarea", { placeholder: "Ask OpenCode anything… (Enter to send, Shift+Enter for a new line)" });
  const send = h("button", { class: "chat-send", title: "Send", html: S.send });
  const modelSel = h("select", {});
  for (const [id, label] of FREE_MODELS) modelSel.append(h("option", { value: id }, label));
  const ctxChip = h("span", { class: "cs-meta hidden" });

  const foot = h(
    "div",
    { class: "chat-foot" },
    modelSel,
    ctxChip,
  );
  const inputRow = h("div", { class: "chat-input-row" }, input, send);

  // --- sessions tab ---
  const sessionsEl = h("div", { class: "chat-sessions" });

  const chatPane = h("div", { style: "display:flex;flex-direction:column;flex:1;min-height:0;" }, msgs, inputRow, foot);
  const sessPane = h("div", { style: "display:none;flex:1;min-height:0;" }, sessionsEl);

  function selectTab(which) {
    tabChat.classList.toggle("active", which === "chat");
    tabSessions.classList.toggle("active", which === "sessions");
    chatPane.style.display = which === "chat" ? "flex" : "none";
    sessPane.style.display = which === "sessions" ? "block" : "none";
    if (which === "sessions") loadSessions();
  }
  tabChat.addEventListener("click", () => selectTab("chat"));
  tabSessions.addEventListener("click", () => selectTab("sessions"));

  const el = h("div", { id: "chat" }, head, tabs, chatPane, sessPane);
  document.getElementById("chat-layer").append(el);

  state.el = el; state.msgs = msgs; state.input = input; state.send = send;
  state.status = status; state.sessionsEl = sessionsEl; state.modelSel = modelSel;

  // --- dragging (header) ---
  head.addEventListener("pointerdown", (ev) => {
    if (ev.target.closest("button") || ev.target.closest("select")) return;
    const rect = el.getBoundingClientRect();
    const offX = ev.clientX - rect.left;
    const offY = ev.clientY - rect.top;
    head.setPointerCapture(ev.pointerId);
    const move = (e2) => {
      const x = Math.max(6, Math.min(window.innerWidth - rect.width - 6, e2.clientX - offX));
      const y = Math.max(6, Math.min(window.innerHeight - 60, e2.clientY - offY));
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.right = "auto";
      el.style.bottom = "auto";
    };
    const up = () => {
      head.removeEventListener("pointermove", move);
      head.removeEventListener("pointerup", up);
    };
    head.addEventListener("pointermove", move);
    head.addEventListener("pointerup", up);
    ev.preventDefault();
  });

  // --- sending ---
  input.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter" && !ev.shiftKey) {
      ev.preventDefault();
      submit();
    }
  });
  send.addEventListener("click", submit);

  // --- incoming stream events ---
  onStream(({ task, ev }) => {
    if (state.pendingTask == null || task !== state.pendingTask) return;
    handleStreamEvent(ev);
  });

  // context attach requests from the Explorer
  document.addEventListener("os:chat-attach", (e) => {
    state.contextPath = e.detail?.path ?? null;
    if (state.contextPath) {
      ctxChip.classList.remove("hidden");
      ctxChip.textContent = `folder: ${state.contextPath}  ✕`;
      ctxChip.title = "Click to remove context";
      ctxChip.onclick = () => {
        state.contextPath = null;
        ctxChip.classList.add("hidden");
      };
    }
    open();
    input.focus();
  });

  renderWelcome();
  return el;
}

function renderWelcome() {
  state.msgs.append(
    h("div", { class: "msg assistant" },
      "Hi! This chat talks directly to the OpenCode CLI installed on this machine.\n",
      "Pick a free model below, then ask anything — I can also see your workspace."),
  );
}

// ---- messaging ----

async function submit() {
  const text = state.input.value.trim();
  if (!text || state.pendingTask != null) return;
  state.input.value = "";
  addUserMsg(text);
  const withCtx = state.contextPath ? `${text}\n\n(working folder: ${state.contextPath})` : text;
  state.contextPath = null;
  const chip = state.el.querySelector(".chat-foot .cs-meta");
  if (chip) chip.classList.add("hidden");

  state.send.disabled = true;
  state.pendingTask = -1; // lock: no concurrent sends
  const typing = h("div", { class: "typing" }, h("span"), h("span"), h("span"));
  state.msgs.append(typing);
  scrollDown();
  state.typingEl = typing;

  const model = state.modelSel.value;
  try {
    const taskId = await bridge.streamInvoke(
      "oc_send",
      { sessionId: state.currentSession, model, text: withCtx },
      // Browser mode delivers events through this per-request callback;
      // Tauri mode delivers them through the persistent oc://stream listener.
      ({ ev }) => {
        if (ev) handleStreamEvent(ev);
      },
    );
    // If the stream already finished (done -> pendingTask null), keep it null;
    // otherwise record the task id (Tauri mode resolves before events arrive).
    if (state.pendingTask != null) state.pendingTask = taskId;
  } catch (e) {
    typing.remove();
    state.typingEl = null;
    state.pendingTask = null;
    state.send.disabled = false;
    addErrorMsg(String(e.message || e), true);
  }
}

function handleStreamEvent(ev) {
  if (!ev) return;
  if (ev.t === "delta") {
    if (state.typingEl) { state.typingEl.remove(); state.typingEl = null; }
    if (!state.activeStreamEl) {
      state.activeStreamEl = h("div", { class: "msg assistant" });
      state.msgs.append(state.activeStreamEl);
    }
    state.activeStreamEl.textContent += ev.text ?? "";
    scrollDown();
    return;
  }
  if (ev.t === "session") {
    state.currentSession = ev.id;
    return;
  }
  if (ev.t === "error") {
    if (state.typingEl) { state.typingEl.remove(); state.typingEl = null; }
    addErrorMsg(ev.message ?? "Unknown error", /key|auth|setup|api/i.test(ev.message ?? ""));
    scrollDown();
    return;
  }
  if (ev.t === "done") {
    state.typingEl?.remove();
    state.typingEl = null;
    state.activeStreamEl = null;
    state.pendingTask = null;
    state.send.disabled = false;
    state.input.focus();
  }
}

function addUserMsg(text) {
  state.msgs.append(h("div", { class: "msg user" }, text));
  scrollDown();
}

function addErrorMsg(message, withSetup = false) {
  const bubble = h("div", { class: "msg error" }, message);
  if (withSetup) {
    bubble.append(
      h("div", { class: "msg-action" },
        h("button", {
          onclick: () => document.dispatchEvent(new CustomEvent("os:open-setup")),
        }, "Open Setup"),
      ),
    );
  }
  state.msgs.append(bubble);
  scrollDown();
}

function scrollDown() {
  state.msgs.scrollTop = state.msgs.scrollHeight;
}

// ---- sessions ----

async function loadSessions() {
  clear(state.sessionsEl);
  state.sessionsEl.append(h("div", { class: "cs-meta" }, "Loading sessions…"));
  try {
    const sessions = await bridge.invoke("oc_sessions", {});
    clear(state.sessionsEl);
    const list = Array.isArray(sessions) ? sessions : [];
    const btnNew = h("div", { class: "chat-session", onclick: () => { newSession(); } },
      h("div", { class: "cs-title", style: "color:#8ab4f8" }, "+ New conversation"));
    state.sessionsEl.append(btnNew);
    for (const s of list.slice().sort((a, b) => (b.time?.updated ?? 0) - (a.time?.updated ?? 0))) {
      const active = s.id === state.currentSession;
      const row = h(
        "div",
        { class: `chat-session${active ? " active" : ""}` },
        h("div", { class: "cs-title" }, s.title || s.slug || s.id),
        h("div", { class: "cs-meta" }, new Date(s.time?.updated ?? s.time?.created ?? Date.now()).toLocaleString()),
      );
      row.addEventListener("click", () => {
        state.currentSession = s.id;
        clear(state.msgs);
        renderWelcome();
        toast(`Switched to "${s.title || s.slug}"`);
        loadSessions();
      });
      state.sessionsEl.append(row);
    }
    if (!list.length) state.sessionsEl.append(h("div", { class: "cs-meta" }, "No conversations yet."));
  } catch (e) {
    clear(state.sessionsEl);
    state.sessionsEl.append(h("div", { class: "msg error" }, `Could not reach the OpenCode service: ${e.message || e}`));
  }
}

export function newSession() {
  state.currentSession = null;
  clear(state.msgs);
  renderWelcome();
}

// ---- window behaviour ----

export function open() {
  if (!state.el) init();
  state.el.classList.remove("minimized");
  state.el.style.display = "";
  state.minimized = false;
  state.input && state.input.focus();
}

export function minimize() {
  if (!state.el) return;
  state.el.classList.add("minimized");
  state.minimized = true;
}

export function toggle() {
  if (!state.el || state.minimized) open();
  else minimize();
}

export function setOnline(online) {
  state.online = !!online;
  if (state.status) {
    state.status.textContent = online ? "online" : "offline";
    state.status.classList.toggle("online", online);
  }
  const indicator = document.getElementById("tb-chat-indicator");
  if (indicator) indicator.classList.toggle("online", online);
}

export async function ensureService() {
  try {
    await bridge.invoke("oc_start", {});
    setOnline(true);
  } catch (e) {
    console.warn("opencode service unavailable:", e);
    setOnline(false);
  }
}
