// context-flush - AMP-1 L2 automatic context updating.
// On session.idle (the only lifecycle event confirmed for @opencode-ai/plugin
// 1.18.4 - see bcp-ralph.js header; all other event types are ignored
// defensively): if the worktree has tracked changes, or mission-relevant
// untracked files, or STATE is older than the newest changed file, or
// context/inbox/ is non-empty, snapshot WIP, run ingest, and send exactly one
// CONTEXT FLUSH prompt. Silent otherwise (idle-storm guard: at most one flush
// prompt per 5 minutes per branch, and silent checks never arm the guard).
// Runs BEFORE bcp-ralph in effect: conditions are disjoint from bcp-ralph's
// (which fires only when BCP_LANE_CAP+BCP_AGENT lane env is set and a lease is
// held). This plugin never touches lane leases, so the two never fight.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const REPO_ROOT = "C:\\0-BlackBoxProject-0\\Vivim-omega\\BCP-dev";
const TOOLS = REPO_ROOT + "\\agent-tools";
const REL_STATE = (id) => `docs/agent-system/missions/${id}/STATE.md`;
const REL_INBOX = "docs/agent-system/context/inbox";
// Untracked paths that never trigger a flush (charter allowlist_ignore).
const IGNORE_PREFIX = [
  "bcp-algos/",
  "setupdocs.zip",
  "docs/REPO-CLEANUP-PROMPT-V2.md",
];
// Untracked files under these extensions can trigger a flush.
const WATCH_EXT = new Set([".md", ".py", ".js", ".ts", ".ps1", ".yaml",
  ".yml", ".json", ".sh"]);
const GUARD_SECONDS = 300;

function ignored(rel) {
  return IGNORE_PREFIX.some((p) => rel === p || rel.startsWith(p));
}

function guardPath(branch) {
  const safe = branch.replace(/[^A-Za-z0-9-]/g, "_") || "nobranch";
  return path.join(os.tmpdir(), `amp-flush-${safe}`);
}

function guardArmed(branch) {
  try {
    const mtime = fs.statSync(guardPath(branch)).mtimeMs;
    return (Date.now() - mtime) < GUARD_SECONDS * 1000;
  } catch (_) {
    return false;
  }
}

function guardSet(branch) {
  try {
    fs.writeFileSync(guardPath(branch), String(Date.now()));
  } catch (_) { /* guard must never break a session */ }
}

async function log(client, level, message) {
  try {
    await client.app.log({ body: { service: "context-flush", level,
      message } });
  } catch (_) { /* logging must never break a session */ }
}

async function shText(promise) {
  try {
    return (await promise.text()).trim();
  } catch (_) {
    return "";
  }
}

export const ContextFlush = async ({ client, $ }) => {
  return {
    event: async ({ event }) => {
      try {
        if (!event || event.type !== "session.idle") return;
        const props = event.properties || {};
        const sessionId = props.sessionID || props.sessionId || props.id
          || "";
        if (!sessionId) return;

        const branch = await shText($`git -C ${REPO_ROOT} branch --show-current`);
        const mission = branch.startsWith("mission/")
          ? branch.slice("mission/".length)
          : "";
        const porcelain = await shText($`git -C ${REPO_ROOT} status --porcelain`);
        const lines = porcelain ? porcelain.split("\n") : [];
        const trackedDirty = lines.some((l) => l && !l.startsWith("??"));
        const untrackedInteresting = lines
          .filter((l) => l.startsWith("??"))
          .map((l) => l.slice(3).trim().replace(/"/g, ""))
          .filter((p) => !ignored(p) && WATCH_EXT.has(path.extname(p)));

        // STATE staleness: STATE older than newest changed file.
        let staleState = false;
        if (mission) {
          const stateAbs = path.join(REPO_ROOT, REL_STATE(mission));
          try {
            const stateM = fs.statSync(stateAbs).mtimeMs;
            const changed = lines
              .map((l) => (l.startsWith("??") ? l.slice(3) : l.slice(3))
                .trim().replace(/"/g, ""))
              .filter((p) => p && !ignored(p));
            for (const p of changed) {
              try {
                if (fs.statSync(path.join(REPO_ROOT, p)).mtimeMs > stateM) {
                  staleState = true;
                  break;
                }
              } catch (_) { /* deleted file: ignore */ }
            }
          } catch (_) { staleState = true; /* no STATE: flush */ }
        }

        // Inbox check (mission-independent).
        let inbox = [];
        try {
          const dir = path.join(REPO_ROOT, REL_INBOX);
          inbox = fs.readdirSync(dir).filter((f) =>
            !f.startsWith(".") && fs.statSync(path.join(dir, f)).isFile());
        } catch (_) { /* no inbox: empty */ }

        if (!trackedDirty && untrackedInteresting.length === 0
            && !staleState && inbox.length === 0) {
          return; // silent: nothing changed
        }
        if (guardArmed(branch)) return; // at most one flush per episode

        // WIP safety net (never touches branch/index/worktree).
        let wipRef = "(none)";
        if (mission) {
          const out = await shText($`python ${TOOLS}/agent_wip.py snapshot ${mission}`);
          const m = out.match(/refs\/wip\/\S+/);
          if (m) wipRef = m[0];
        }
        // Deterministic ingest half.
        let ingestSummary = "inbox empty";
        if (inbox.length > 0) {
          const out = await shText($`python ${TOOLS}/agent_ingest.py`);
          ingestSummary = out.split("\n").slice(-1)[0] || "ingest ran";
          // Regenerate views so DIGEST covers new insights.
          await shText($`python ${TOOLS}/agent_views.py digest`);
          await shText($`python ${TOOLS}/agent_views.py brief`);
          await shText($`python ${TOOLS}/agent_views.py index`);
        }

        guardSet(branch);
        await log(client, "info", `context flush on ${branch || "(no branch)"} (wip ${wipRef}; ${ingestSummary})`);
        await client.session.prompt({
          path: { id: sessionId },
          body: { parts: [{ type: "text", text:
            `CONTEXT FLUSH: update ${mission ? REL_STATE(mission) : "your mission STATE.md"} (POSITION, DONE, NEXT_ACTION, UNCOMMITTED with latest wip ref ${wipRef}); write insights for any design reasoning not yet recorded; ingest: ${ingestSummary}${inbox.length > 0 ? " - check context/ingest-receipts/ and do the judgment half for any raw transcript" : ""}; commit on your mission branch.` }] },
        });
      } catch (e) {
        try { await log(client, "error", `context-flush error; staying silent (${e && e.message ? e.message : e})`); } catch (_) {}
      }
    },
  };
};
