// bcp-ralph — session.idle continuation for lane sessions (Task 6).
// Only after Tasks 1-5 stable (they are: workspaces/STATE.json all PASS).
// Lane pinned per session via env: BCP_LANE_CAP (FAM-nn.n) + BCP_AGENT (AGT-x).
// On session.idle: shell to `python bcp_tool.py show <cap>`; if THIS agent
// still holds the lease and depth < target -> re-prompt continuation through
// the client; else stay silent. Never re-prompts a released/merged lane.
// The Task-5 watchdog stays the only dead-process catcher.
// Docs: opencode.ai/docs/plugins (event hook + session.idle + $ shell),
// opencode.ai/docs/sdk (client.session.prompt + client.app.log).
// API: session.idle confirmed in 1.18.4-era event list; prompt shape
// {path:{id}, body:{parts:[{type:"text",text}]}} per SDK docs.

const BCP_ROOT = "C:\\0-BlackBoxProject-0\\Vivim-omega\\BCP-dev\\bcp-speed\\bcp";
const TOOL = BCP_ROOT + "\\bcp_tool.py";
const RANK = { L0: 0, L1: 1, L2: 2, L3: 3 };

async function log(client, level, message) {
  try {
    await client.app.log({ body: { service: "bcp-ralph", level, message } });
  } catch (_) { /* logging must never break a session */ }
}

export const BcpRalph = async ({ client, $ }) => {
  return {
    event: async ({ event }) => {
      try {
        if (!event || event.type !== "session.idle") return;
        const cap = process.env.BCP_LANE_CAP || "";
        const agent = process.env.BCP_AGENT || "";
        if (!cap || !agent) return; // not a lane session: silent
        const props = event.properties || {};
        const sessionId = props.sessionID || props.sessionId || props.id || "";
        if (!sessionId) { await log(client, "warn", `idle with ${cap}/${agent} but no session id; staying silent`); return; }

        let out = "";
        try {
          out = await $`python ${TOOL} show ${cap}`.text();
        } catch (e) {
          await log(client, "warn", `show ${cap} failed; staying silent (${e && e.message ? e.message : e})`);
          return;
        }
        const first = (out.split("\n")[0] || "");
        const depthMatch = first.match(/\[([A-Z][0-9])\]/);
        const depth = depthMatch ? depthMatch[1] : "";
        const leaseLine = out.split("\n").find((l) => l.indexOf("lease:") === 0) || "";
        if (leaseLine.indexOf("lease: none") === 0) return; // released/merged: silent
        if (leaseLine.indexOf(agent) === -1) return; // someone else's lease: silent
        const targetMatch = leaseLine.match(/target ([A-Z][0-9])/);
        const target = targetMatch ? targetMatch[1] : "";
        if (!depth || !target) { await log(client, "warn", `unparseable show for ${cap}; staying silent`); return; }
        if ((RANK[depth] || 0) >= (RANK[target] || 0)) return; // target reached: silent
        await log(client, "info", `idle resume ${agent} on ${cap} (${depth} < ${target})`);
        await client.session.prompt({
          path: { id: sessionId },
          body: { parts: [{ type: "text", text: `Continue. You still hold ${cap} (${depth} -> ${target}). Re-read agents/inbox and agents/lanes.md, do the next discrete unit of work, renew the lease, and report only in state.` }] },
        });
      } catch (e) {
        try { await log(client, "error", `ralph error; staying silent (${e && e.message ? e.message : e})`); } catch (_) {}
      }
    },
  };
};
