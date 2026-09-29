// Transport layer: identical API surface in Tauri (IPC) and browser (HTTP bridge).
//
// bridge.invoke(cmd, args)         -> Promise<any>
// bridge.streamInvoke(cmd, args, onMsg) -> Promise<taskId>
//   onMsg receives { task, ev } where ev is a normalized chat/setup event.

const isTauri = typeof window !== "undefined" && !!window.__TAURI__;

const streamSubs = new Set(); // unified in-process dispatcher
let tauriListening = false;

async function ensureTauriListener() {
  if (tauriListening || !isTauri) return;
  tauriListening = true;
  const unlisten = await window.__TAURI__.event.listen("oc://stream", ({ payload }) => {
    dispatch(payload);
  });
  // also wire setup logs through the same dispatcher with a distinct ev tag
  await window.__TAURI__.event.listen("oc://setup", ({ payload }) => {
    dispatch(payload, true);
  });
  return unlisten;
}

function dispatch(payload, isSetup = false) {
  const msg = isSetup ? { ...payload, setup: true } : payload;
  for (const cb of streamSubs) {
    try {
      cb(msg);
    } catch (e) {
      console.error("stream subscriber error", e);
    }
  }
}

export const bridge = {
  isTauri,

  async invoke(cmd, args = {}) {
    if (isTauri) {
      return window.__TAURI__.core.invoke(cmd, args);
    }
    const res = await fetch(`/api/${cmd}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(args ?? {}),
    });
    const data = await res.json().catch(() => ({ ok: false, error: "bad gateway payload" }));
    if (!data.ok) throw new Error(data.error || `command ${cmd} failed`);
    return data.data;
  },

  async streamInvoke(cmd, args, onMsg) {
    if (onMsg) streamSubs.add(onMsg);
    try {
      if (isTauri) {
        await ensureTauriListener();
        return await window.__TAURI__.core.invoke(cmd, args);
      }
      // Browser mode: NDJSON stream over HTTP.
      const res = await fetch(`/api/${cmd}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args ?? {}),
      });
      if (!res.ok || !res.body) throw new Error(`stream ${cmd} failed: ${res.status}`);
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      let taskId = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let idx;
        while ((idx = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, idx).trim();
          buf = buf.slice(idx + 1);
          if (!line) continue;
          try {
            const msg = JSON.parse(line);
            if (msg.task) taskId = msg.task;
            onMsg && onMsg(msg);
          } catch {
            /* ignore malformed lines */
          }
        }
      }
      return taskId;
    } finally {
      if (onMsg) streamSubs.delete(onMsg);
    }
  },
};

// Convenience: subscribe to all stream events persistently (chat app uses this).
export function onStream(cb) {
  streamSubs.add(cb);
  if (isTauri) ensureTauriListener();
  return () => streamSubs.delete(cb);
}
