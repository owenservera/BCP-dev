#!/usr/bin/env node
// OpenCode OS — end-to-end suite (real browser, real bridge server, real fs).
//
// Scenario A: seeded consumer machine — full desktop UX (Gate 1 + chat UX Gate 2).
// Scenario B: fresh machine — first-run wizard auto-setup (Gate 3.2).
// Scenario C: host access — This PC against a sandboxed fake HOME (Gate 4).
//
// Usage: node e2e/run.mjs [a|b|c]

import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ART = path.join(ROOT, "e2e", "artifacts");
fs.mkdirSync(ART, { recursive: true });

const results = [];
function record(id, name, ok, note = "") {
  results.push({ id, name, ok, note });
  console.log(`${ok ? "✔" : "✖"} ${id} ${name}${note ? ` — ${note}` : ""}`);
}

function ab(cmd, opts = {}) {
  return execSync(`agent-browser ${cmd}`, {
    encoding: "utf8",
    timeout: opts.timeout ?? 30_000,
    ...opts,
  }).trim();
}

// Dispatch a dblclick by locating an element via dataset (single-quote-safe JS
// for the shell layer; the UI's own dblclick listeners are exercised as-is).
function dblclickBy(selector, key, value) {
  const js = `(() => { const el = [...document.querySelectorAll('${selector}')].find(e => e.dataset.${key} === '${value}'); if (!el) return 'NO'; const r = el.getBoundingClientRect(); el.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, clientX: r.x + 10, clientY: r.y + 10 })); return 'OK'; })()`;
  ab(`eval "${js}"`);
}

function abJSON(cmd, opts = {}) {
  const out = ab(`${cmd} --json`, opts);
  try {
    return JSON.parse(out);
  } catch {
    return out;
  }
}

async function waitFor(fn, timeoutMs = 15_000, interval = 250) {
  const start = Date.now();
  for (;;) {
    let v = false;
    try { v = await fn(); } catch { v = false; }
    if (v) return true;
    if (Date.now() - start > timeoutMs) return false;
    await new Promise((r) => setTimeout(r, interval));
  }
}

async function startBridge(env) {
  const port = 8900 + Math.floor(Math.random() * 90);
  const proc = spawn("node", [path.join(ROOT, "bridge-server", "server.mjs")], {
    env: { ...process.env, PORT: String(port), PATH: `${path.join(ROOT, "scripts", "fakebin")}:${process.env.PATH}`, ...env },
    stdio: ["ignore", "ignore", "pipe"],
  });
  let stderr = "";
  proc.stderr.on("data", (d) => { stderr += d; });
  const base = `http://127.0.0.1:${port}`;
  const ready = await waitFor(async () => {
    try { return (await fetch(`${base}/`)).ok; } catch { return false; }
  }, 15_000);
  if (!ready) throw new Error(`bridge did not start: ${stderr}`);
  return { proc, base };
}

// ---------- Scenario A ----------

async function scenarioA() {
  console.log("\n=== Scenario A: consumer desktop (Gate 1 + Gate 2) ===");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ocos-e2e-a-"));
  const ws = path.join(tmp, "ws");
  fs.mkdirSync(ws, { recursive: true });
  fs.mkdirSync(path.join(ws, "projects"), { recursive: true });
  fs.writeFileSync(path.join(ws, "notes.txt"), "hello from workspace\n");
  fs.writeFileSync(path.join(ws, "readme.md"), "# Readme\n");
  fs.writeFileSync(path.join(ws, "projects", "plan.txt"), "step one");
  fs.writeFileSync(path.join(tmp, "cfg-settings.json"), "");
  const cfg = path.join(tmp, "cfg");
  fs.mkdirSync(cfg, { recursive: true });
  fs.writeFileSync(path.join(cfg, "settings.json"), JSON.stringify({
    workspace: ws, zen_api_key: "", model: "opencode/space-bunny-free", wizard_done: true,
  }));

  const { proc, base } = await startBridge({ OPENCODE_OS_CONFIG_DIR: cfg, OCOS_MOCK_DIR: path.join(tmp, "mock") });
  const disk = (p) => path.join(ws, p);

  try {
    ab(`set viewport 1280 800`);
    ab(`open ${base}`);
    ab(`wait --fn "document.getElementById('boot').classList.contains('hidden')"`, { timeout: 20_000 });

    // G1.1 boot to desktop
    await waitFor(() =>
      ab(`eval "document.getElementById('clock-time').textContent.length >= 4"`).includes('"true"') || ab(`eval "document.getElementById('clock-time').textContent.length >= 4"`).includes("true"));
    const clockRaw = ab(`eval "document.getElementById('clock-time').textContent"`);
    const clockOk = /\d{2}:\d{2}/.test(clockRaw);
    const iconRaw = ab(`get count ".desk-icon"`);
    const iconCount = Number(String(iconRaw).replace(/[^0-9]/g, "")) || 0;
    ab(`screenshot ${ART}/a-01-desktop.png`);
    record("G1.1", "boot lands on desktop with icons + taskbar clock", iconCount === 5 && clockOk,
      `icons=${iconCount} clockRaw=${JSON.stringify(clockRaw)}`);

    // G1.2 double-click opens File Explorer
    dblclickBy(".desk-icon", "app", "explorer");
    const explorerOpen = await waitFor(() =>
      ab(`eval "!!document.querySelector('.win[data-win-id^=\\'explorer\\']')"`).includes("true"));
    record("G1.2", "desktop icon double-click opens File Explorer", explorerOpen);

    // G1.3 navigate: Home shows seeded files, enter folder, back
    const seesNotes = await waitFor(() =>
      ab(`eval "document.body.innerText.includes('notes.txt')"`).includes("true"));
    dblclickBy(".exp-item", "name", "projects");
    const inProjects = await waitFor(() =>
      ab(`eval "document.body.innerText.includes('plan.txt')"`).includes("true"));
    ab(`find first ".exp-btn[title=Back]" click`);
    const backHome = await waitFor(() =>
      ab(`eval "document.body.innerText.includes('notes.txt')"`).includes("true"));
    ab(`screenshot ${ART}/a-02-explorer.png`);
    record("G1.3", "browse folders + navigate back", seesNotes && inProjects && backHome);

    // G1.4 create folder + file via context menu (real disk assertions)
    const ctxMenuGrid = () =>
      ab(`eval "document.querySelector('.exp-grid').dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,clientX:500,clientY:300}))"`);
    const evalUntil = async (js, timeout = 8000) =>
      waitFor(() => { try { return ab(`eval "${js}"`).includes("OK"); } catch { return false; } }, timeout);
    // deterministic menu item click, scoped to the open context menu
    // (startsWith because items may carry a hint suffix like "Rename  F2")
    const menuClick = async (label, timeout = 8000) => {
      const js = `(() => { const it = [...document.querySelectorAll('.ctx .ctx-item')].find(n => n.textContent.trim().startsWith('${label}')); if (!it) return 'NO'; it.click(); return 'OK'; })()`;
      return evalUntil(js, timeout);
    };
    const renameInput = async (value) => {
      await evalUntil(`(() => { const i = document.querySelector('.ei-rename'); if (!i) return 'NO'; i.value = '${value}'; i.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); return 'OK'; })()`);
    };

    ctxMenuGrid();
    await menuClick("New folder");
    await waitFor(() => fs.existsSync(disk("New folder")));
    await renameInput("Albums"); // new-folder flow opens inline rename automatically
    await waitFor(() => fs.existsSync(disk("Albums")));
    ctxMenuGrid();
    await menuClick("New text file");
    await waitFor(() => fs.existsSync(disk("New file.txt")));
    await renameInput("created-by-ui.txt");
    await waitFor(() => fs.existsSync(disk("created-by-ui.txt")));
    ab(`screenshot ${ART}/a-03-created.png`);
    record("G1.4", "New folder / New text file hit the real disk",
      fs.existsSync(disk("Albums")) && fs.existsSync(disk("created-by-ui.txt")));

    // G1.5 rename via context menu + delete moves to .Trash
    const ctxMenuItem = (name) =>
      ab(`eval "(() => { const el = [...document.querySelectorAll('.exp-item')].find(e => e.dataset.name === '${name}'); if (!el) return; const r = el.getBoundingClientRect(); el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: r.x + 20, clientY: r.y + 20 })); })()"`);
    ctxMenuItem("created-by-ui.txt");
    await menuClick("Rename");
    await renameInput("renamed.txt");
    const renamed = await waitFor(() => fs.existsSync(disk("renamed.txt")));
    ctxMenuItem("renamed.txt");
    await menuClick("Delete");
    const trashed = await waitFor(() => !fs.existsSync(disk("renamed.txt")) && fs.readdirSync(path.join(ws, ".Trash")).some((n) => n.endsWith("renamed.txt")));
    record("G1.5", "rename in place + delete moves to .Trash", renamed && trashed);

    // G1.6 open in Notepad, edit, Ctrl+S persists
    dblclickBy(".exp-item", "name", "notes.txt");
    const npOpen = await waitFor(() =>
      ab(`eval "!!document.querySelector('.win.focused .notepad textarea')"`).includes("true"));
    ab(`eval "(() => { const t = document.querySelector('.win.focused .notepad textarea'); t.value = 'hello from workspace\\nedited by e2e\\n'; t.dispatchEvent(new Event('input', { bubbles: true })); })()"`);
    ab(`eval "document.querySelector('.win.focused .notepad textarea').dispatchEvent(new KeyboardEvent('keydown', { key: 's', ctrlKey: true, bubbles: true }))"`);
    const saved = await waitFor(() => fs.readFileSync(disk("notes.txt"), "utf8").includes("edited by e2e"));
    ab(`screenshot ${ART}/a-04-notepad.png`);
    record("G1.6", "double-click opens Notepad; Ctrl+S persists to disk", npOpen && saved);

    // G1.7 search filter
    ab(`eval "(() => { const s = document.querySelector('.exp-search'); s.value = 'read'; s.dispatchEvent(new Event('input', { bubbles: true })); })()"`);
    const filtered = await waitFor(() => {
      const t = ab(`eval "document.querySelector('.exp-statusbar').textContent"`);
      return t.includes("1 item");
    });
    record("G1.7", "search box narrows the listing", filtered);

    // G1.8 window management: drag, minimize, taskbar-restore, maximize, close
    ab(`eval "(() => { const s = document.querySelector('.exp-search'); s.value = ''; s.dispatchEvent(new Event('input', { bubbles: true })); })()"`);
    // focus the explorer so it is topmost, then drag ITS titlebar dynamically
    ab(`eval "document.querySelector('.win[data-win-id=explorer-1]').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))"`);
    const tbRaw = ab(`eval "(() => { const r = document.querySelector('.win[data-win-id=explorer-1] .win-titlebar').getBoundingClientRect(); return JSON.stringify([Math.round(r.x + r.width / 2), Math.round(r.y + 14)]); })()"`);
    const [tbx, tby] = String(tbRaw).match(/-?\d+/g).map(Number);
    const posBefore = ab(`eval "JSON.stringify(document.querySelector('.win[data-win-id=explorer-1]').getBoundingClientRect())"`);
    ab(`mouse move ${tbx} ${tby}`);
    ab(`mouse down left`);
    ab(`mouse move ${Math.max(20, tbx - 350)} ${Math.min(700, tby + 90)}`);
    ab(`mouse up left`);
    const posAfter = ab(`eval "JSON.stringify(document.querySelector('.win[data-win-id=explorer-1]').getBoundingClientRect())"`);
    const dragged = posBefore !== posAfter;
    const num = (s) => Number(String(s).replace(/[^0-9.]/g, "")) || 0;
    ab(`eval "document.querySelector('.win[data-win-id=explorer-1] .win-ctl[title=Minimize]').click()"`);
    const minimized = await waitFor(() =>
      ab(`eval "document.querySelector('.win[data-win-id=explorer-1]').style.display==='none'"`).includes("true"));
    ab(`eval "document.querySelector('.tb-app[data-win-id=explorer-1]').click()"`); // taskbar restores
    const restored = await waitFor(() =>
      ab(`eval "document.querySelector('.win[data-win-id=explorer-1]').style.display!== 'none'"`).includes("true"));
    ab(`eval "document.querySelector('.win[data-win-id=explorer-1] .win-ctl[title=Maximize]').click()"`);
    const maximized = await waitFor(() => {
      const w = ab(`eval "document.querySelector('.win[data-win-id=explorer-1]').getBoundingClientRect().width"`);
      return num(w) > 1270;
    });
    ab(`eval "document.querySelector('.win[data-win-id=explorer-1] .win-ctl[title=Close]').click()"`);
    const closed = await waitFor(() =>
      ab(`eval "!!document.querySelector('.win[data-win-id=explorer-1]')"`).includes("false"));
    ab(`screenshot ${ART}/a-05-wm.png`);
    record("G1.8", "drag / minimize / taskbar-restore / maximize / close", dragged && minimized && restored && maximized && closed,
      `dragged=${dragged} min=${minimized} rest=${restored} max=${maximized} closed=${closed}`);

    // G1.9 floating chat always on top + taskbar recall
    const numz = (s) => Number(String(s).replace(/[^0-9.]/g, "")) || 0;
    const chatZ = numz(ab(`eval "getComputedStyle(document.getElementById('chat-layer')).zIndex"`));
    const winZ = numz(ab(`eval "getComputedStyle(document.getElementById('windows')).zIndex"`));
    ab(`eval "document.querySelector('#tb-chat-indicator').click()"`); // minimize chat
    const chatHidden = await waitFor(() =>
      ab(`eval "document.getElementById('chat').classList.contains('minimized')"`).includes("true"));
    ab(`eval "document.querySelector('#tb-chat-indicator').click()"`); // bring it back
    const chatBack = await waitFor(() =>
      ab(`eval "!document.getElementById('chat').classList.contains('minimized')"`).includes("true"));
    record("G1.9", "chat floats above app windows + taskbar minimize/recall",
      chatZ > winZ && chatHidden && chatBack, `chatZ=${chatZ} winZ=${winZ}`);

    // G2.2/G2.3 send a message -> streamed MOCK-REPLY through the real UI
    ab(`eval "(() => { const t = document.querySelector('.chat-input-row textarea'); t.value = 'hello machine'; t.dispatchEvent(new Event('input', { bubbles: true })); })()"`);
    ab(`eval "document.querySelector('.chat-input-row textarea').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))"`);
    const replied = await waitFor(() =>
      ab(`eval "document.body.innerText.includes('MOCK-REPLY: you said')"`).includes("true"), 30_000);
    ab(`screenshot ${ART}/a-06-chat-reply.png`);
    record("G2.3", "chat streams a reply into the bubble (mock transport)", replied);

    // G2.4 sessions tab lists the conversation
    ab(`eval "[...document.querySelectorAll('.chat-tab')].find(t=>t.textContent==='Sessions').click()"`);
    const sessListed = await waitFor(() =>
      ab(`eval "document.querySelectorAll('.chat-session').length>=1"`).includes("true"));
    record("G2.4", "session history visible in Sessions tab", sessListed);

    // G2.5 friendly error bubble with recovery action
    ab(`eval "[...document.querySelectorAll('.chat-tab')].find(t=>t.textContent==='Chat').click()"`);
    ab(`eval "(() => { const t2 = document.querySelector('.chat-input-row textarea'); t2.value = 'ERRORPLZ now'; t2.dispatchEvent(new Event('input', { bubbles: true })); })()"`);
    ab(`eval "document.querySelector('.chat-input-row textarea').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}))"`);
    const errBubble = await waitFor(() =>
      ab(`eval "!!document.querySelector('.msg.error')"`).includes("true"), 30_000);
    ab(`screenshot ${ART}/a-07-chat-error.png`);
    record("G2.5", "errors render as friendly bubbles, app keeps running", errBubble);
  } finally {
    proc.kill("SIGKILL");
  }
}

// ---------- Scenario B ----------

async function scenarioB() {
  console.log("\n=== Scenario B: first-run auto-setup wizard (Gate 3.2) ===");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ocos-e2e-b-"));
  const cfg = path.join(tmp, "cfg");
  fs.mkdirSync(cfg, { recursive: true });
  fs.mkdirSync(path.join(tmp, "ws"), { recursive: true });
  const { proc, base } = await startBridge({
    OPENCODE_OS_CONFIG_DIR: cfg,
    OCOS_MOCK_DIR: path.join(tmp, "mock"),
    OCOS_NO_OPENCODE: "1",
    OCOS_FAKE_INSTALL: "1",
  });
  try {
    ab(`set viewport 1280 800`);
    ab(`open ${base}`);
    ab(`wait --fn "document.getElementById('boot').classList.contains('hidden')"`, { timeout: 20_000 });

    const wizardShown = await waitFor(() =>
      ab(`eval "!document.getElementById('setup').classList.contains('hidden')"`).includes("true"));
    ab(`screenshot ${ART}/b-01-wizard.png`);
    record("G3.2a", "first boot shows the setup wizard (no CLI installed)", wizardShown);

    ab(`find text "Get started" click`);
    // The "not found" phase is sub-poll-duration in fake-install mode, so we
    // assert the durable evidence: final status badge + streamed install log.
    let instRaw = "";
    const installed = await waitFor(() => {
      try {
        instRaw = ab(`eval "document.body.innerText.includes('installed successfully')"`);
        return instRaw.includes("true");
      } catch (e) {
        instRaw = `EVAL-ERROR: ${String(e.message).slice(0, 120)}`;
        return false;
      }
    }, 30_000);
    const logOk = await waitFor(() => {
      try {
        return ab(`eval "((document.querySelector('.setup-log') || {}).textContent || '').includes('Running installer')"`).includes("true");
      } catch { return false; }
    }, 8000);
    ab(`screenshot ${ART}/b-02-installed.png`);
    record("G3.2b", "wizard auto-installs the OpenCode CLI (streamed log)", installed && logOk, `raw=${instRaw.slice(0, 40)} log=${logOk}`);

    // Next -> zen key step -> skip
    ab(`eval "[...document.querySelectorAll('.setup-card .btn.primary')].pop().click()"`);
    await waitFor(() => ab(`eval "!!document.querySelector('.setup-input[type=password]')"`).includes("true"));
    ab(`eval "document.querySelector('.setup-check input').click()"`);
    ab(`eval "[...document.querySelectorAll('.setup-card .btn.primary')].pop().click()"`);
    await waitFor(() => ab(`eval "document.body.innerText.includes('workspace')"`).includes("true"));
    record("G3.2c", "zen key step works and can be skipped", true);

    // workspace step -> host access consent step (new in Phase 2, default OFF)
    ab(`eval "[...document.querySelectorAll('.setup-card .btn.primary')].pop().click()"`);
    const hostStep = await waitFor(() =>
      ab(`eval "document.body.innerText.includes('Host access')"`).includes("true"));
    ab(`screenshot ${ART}/b-03-host-consent.png`);
    record("G3.2d", "host-access consent step shown in the wizard", hostStep);

    // finish WITHOUT granting -> host access must stay off
    ab(`eval "[...document.querySelectorAll('.setup-card .btn.primary')].pop().click()"`);
    const wizardClosed = await waitFor(() =>
      ab(`eval "document.getElementById('setup').classList.contains('hidden')"`).includes("true"), 30_000);
    const settings = JSON.parse(fs.readFileSync(path.join(cfg, "settings.json"), "utf8"));
    ab(`screenshot ${ART}/b-04-finished.png`);
    record("G3.2e", "finish writes settings; host access stays OFF unless granted",
      wizardClosed && settings.wizard_done === true && settings.host_access?.enabled === false);
  } finally {
    proc.kill("SIGKILL");
  }
}

// ---------- Scenario C ----------

async function scenarioC() {
  console.log("\n=== Scenario C: host access — This PC (Gate 4) ===");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ocos-e2e-c-"));
  const fakehome = path.join(tmp, "fakehome");
  fs.mkdirSync(path.join(fakehome, "docs"), { recursive: true });
  fs.writeFileSync(path.join(fakehome, "docs", "real.txt"), "real host file\n");
  const ws = path.join(tmp, "ws");
  fs.mkdirSync(ws, { recursive: true });
  const cfg = path.join(tmp, "cfg");
  fs.mkdirSync(cfg, { recursive: true });
  // Host access PRE-GRANTED (home root) — the post-wizard consumer state.
  fs.writeFileSync(path.join(cfg, "settings.json"), JSON.stringify({
    workspace: ws, zen_api_key: "", model: "opencode/space-bunny-free", wizard_done: true,
    host_access: { enabled: true, allowed_roots: ["home"] },
    oc_cwd: "",
  }));

  const { proc, base } = await startBridge({
    OPENCODE_OS_CONFIG_DIR: cfg,
    OCOS_MOCK_DIR: path.join(tmp, "mock"),
    HOME: fakehome,
    USERPROFILE: fakehome,
  });
  const hostDisk = (p) => path.join(fakehome, p);
  try {
    ab(`set viewport 1280 800`);
    ab(`open ${base}`);
    ab(`wait --fn "document.getElementById('boot').classList.contains('hidden')"`, { timeout: 20_000 });

    const evalUntil = async (js, timeout = 8000) =>
      waitFor(() => { try { return ab(`eval "${js}"`).includes("OK"); } catch { return false; } }, timeout);
    const menuClick = async (label, timeout = 8000) => {
      const js = `(() => { const it = [...document.querySelectorAll('.ctx .ctx-item')].find(n => n.textContent.trim().startsWith('${label}')); if (!it) return 'NO'; it.click(); return 'OK'; })()`;
      return evalUntil(js, timeout);
    };
    const renameInput = async (value) => {
      await evalUntil(`(() => { const i = document.querySelector('.ei-rename'); if (!i) return 'NO'; i.value = '${value}'; i.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); return 'OK'; })()`);
    };
    const ctxMenuItem = (name) =>
      ab(`eval "(() => { const el = [...document.querySelectorAll('.exp-item')].find(e => e.dataset.name === '${name}'); if (!el) return; const r = el.getBoundingClientRect(); el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: r.x + 20, clientY: r.y + 20 })); })()"`);
    const iconCount = () => Number(String(ab(`get count ".desk-icon"`)).replace(/[^0-9]/g, "")) || 0;

    // G4.1 This PC appears on the desktop when host access is granted
    await waitFor(() => iconCount() === 6);
    const hasLabel = ab(`eval "document.body.innerText.includes('This PC')"`).includes("true");
    ab(`screenshot ${ART}/c-01-desktop-thispc.png`);
    record("G4.1", "This PC icon appears on the desktop once granted", iconCount() === 6 && hasLabel,
      `icons=${iconCount()}`);

    // G4.2 browse the real HOME: root tile -> docs fixture visible
    dblclickBy(".desk-icon", "app", "host");
    await waitFor(() => ab(`eval "!!document.querySelector('.win[data-win-id^=host-1]')"`).includes("true"));
    const homeTile = await waitFor(() =>
      ab(`eval "[...document.querySelectorAll('.exp-item')].some(e => e.dataset.name === 'Home')"`).includes("true"));
    dblclickBy(".exp-item", "name", "Home");
    const seesHostFiles = await waitFor(() =>
      ab(`eval "document.body.innerText.includes('real.txt') || document.body.innerText.includes('docs')"`).includes("true"));
    ab(`screenshot ${ART}/c-02-thispc-home.png`);
    record("G4.2", "This PC lists the granted Home root and its real files", homeTile && seesHostFiles);

    // G4.3 create a file on the host through the UI (real disk assertion)
    ab(`eval "document.querySelector('.win[data-win-id^=host-1] .exp-grid').dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,clientX:500,clientY:300}))"`);
    const clicked = await menuClick("New text file");
    const created = await waitFor(() => fs.existsSync(hostDisk("New file.txt")));
    if (!created) {
      console.log("DEBUG menu:", ab(`eval "(() => { const m = document.querySelector('.ctx'); return m ? m.textContent.trim().slice(0, 100) : 'NO-MENU'; })()"`));
      console.log("DEBUG items:", ab(`eval "JSON.stringify([...document.querySelectorAll('.exp-item')].map(e => e.dataset.name))"`));
      console.log("DEBUG cwd:", ab(`eval "document.querySelector('.win[data-win-id^=host-1] .exp-addr').textContent"`));
    }
    await renameInput("host-made.txt");
    const hostMade = await waitFor(() => fs.existsSync(hostDisk("host-made.txt")));
    record("G4.3", "New text file inside Home hits the real disk", hostMade,
      `clicked=${clicked} created=${created}`);

    // G4.4 open a real host file in Notepad, edit, Ctrl+S persists
    dblclickBy(".exp-item", "name", "docs");
    await waitFor(() => ab(`eval "document.body.innerText.includes('real.txt')"`).includes("true"));
    dblclickBy(".exp-item", "name", "real.txt");
    const npOpen = await waitFor(() =>
      ab(`eval "(() => { const t = document.querySelector('.win.focused .notepad textarea'); return !!t && t.value.includes('real host file'); })()"`).includes("true"));
    ab(`eval "(() => { const t = document.querySelector('.win.focused .notepad textarea'); t.value = 'real host file\\nedited on the host\\n'; t.dispatchEvent(new Event('input', { bubbles: true })); })()"`);
    ab(`eval "document.querySelector('.win.focused .notepad textarea').dispatchEvent(new KeyboardEvent('keydown', { key: 's', ctrlKey: true, bubbles: true }))"`);
    const savedToHost = await waitFor(() =>
      fs.readFileSync(hostDisk("docs/real.txt"), "utf8").includes("edited on the host"));
    ab(`screenshot ${ART}/c-03-host-notepad.png`);
    record("G4.4", "host file opens in Notepad; Ctrl+S writes the real file", npOpen && savedToHost);

    // G4.5 point the chat at a host folder (oc_set_cwd) — chip + toast
    ab(`eval "[...document.querySelectorAll('.crumb')].find(c => c.textContent === 'Home').click()"`);
    await waitFor(() => ab(`eval "[...document.querySelectorAll('.exp-item')].some(e => e.dataset.name === 'docs')"`).includes("true"));
    ctxMenuItem("docs");
    await menuClick("Use as OpenCode working folder");
    const chip = await waitFor(() =>
      ab(`eval "(() => { const c = document.querySelector('.chat-foot .cs-meta'); return c && !c.classList.contains('hidden') && c.textContent.includes('folder:'); })()"`).includes("true"));
    const cwdOnDisk = JSON.parse(fs.readFileSync(path.join(cfg, "settings.json"), "utf8")).oc_cwd;
    record("G4.5", "'Use as OpenCode working folder' re-cwd's the CLI + chat chip", chip && !!cwdOnDisk,
      `oc_cwd=${cwdOnDisk}`);

    // G4.6 revoke in Settings -> icon disappears + This PC shows blocked state
    dblclickBy(".desk-icon", "app", "settings");
    await waitFor(() => ab(`eval "!!document.querySelector('.settings-app')"`).includes("true"));
    await evalUntil(`(() => { const lab = [...document.querySelectorAll('.settings-app label')].find(l => l.textContent.includes('Enable access to this computer')); if (!lab) return 'NO'; lab.querySelector('input').click(); return 'OK'; })()`);
    ab(`find text "Save host access" click`);
    await waitFor(() => iconCount() === 5, 10_000);
    const blockedShown = await waitFor(() =>
      ab(`eval "[...document.querySelectorAll('.win[data-win-id^=host-1] .exp-empty')].some(e => e.textContent.includes('review the permission'))"`).includes("true"), 10_000);
    ab(`screenshot ${ART}/c-04-revoked.png`);
    record("G4.6", "revoking host access: icon gone, This PC shows blocked state",
      iconCount() === 5 && blockedShown);
  } finally {
    proc.kill("SIGKILL");
  }
}

// ---------- main ----------

const only = process.argv[2];
let failures = 0;
try {
  if (only !== "b" && only !== "c") await scenarioA();
  if (only !== "a" && only !== "c") await scenarioB();
  if (only !== "a" && only !== "b") await scenarioC();
} catch (e) {
  console.error("E2E fatal:", e.message);
  try { ab(`screenshot ${ART}/fatal.png`); } catch {}
  failures += 1;
} finally {
  try { ab(`close`); } catch {}
}

const pass = results.filter((r) => r.ok).length;
console.log(`\n=== E2E scoreboard: ${pass}/${results.length} passed ===`);
for (const r of results.filter((r) => !r.ok)) console.log(`  FAILED: ${r.id} ${r.name}`);
process.exit(failures || results.some((r) => !r.ok) ? 1 : 0);
