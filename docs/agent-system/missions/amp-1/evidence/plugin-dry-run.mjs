// Plugin dry-run harness (AMP-1 self-test 5.4). Stubs OpenCode client/$,
// uses the REAL committed plugin sources (copied verbatim to .mjs for ESM
// import) and real fs (guard files, inbox, STATE). Run: node <this file>.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const REPO = "C:\\0-BlackBoxProject-0\\Vivim-omega\\BCP-dev";
const PLUGINS = REPO + "\\bcp-speed\\bcp\\.opencode\\plugins";
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "amp-plugin-test-"));

function toMjs(name) {
  const src = fs.readFileSync(path.join(PLUGINS, name), "utf-8");
  const dst = path.join(TMP, name.replace(/\.js$/, ".mjs"));
  fs.writeFileSync(dst, src);
  return pathToFileURL(dst).href;
}

const canned = { branch: "", porcelain: "", show: "" };

function makeStubs() {
  const prompts = [];
  const logs = [];
  const $ = (strings, ...vals) => {
    const cmd = strings.reduce((a, s, i) => a + s + (vals[i] ?? ""), "");
    return {
      text: async () => {
        if (cmd.includes("branch --show-current")) return canned.branch;
        if (cmd.includes("status --porcelain")) return canned.porcelain;
        if (cmd.includes("agent_wip.py")) {
          return "refs/wip/selftest/20260924T000000Z\nprune: kept 1, deleted 0";
        }
        if (cmd.includes("agent_ingest.py")) return "ingest: 1 file(s), 1 insight(s)";
        if (cmd.includes("agent_views.py")) return "wrote x";
        if (cmd.includes("bcp_tool.py")) return canned.show;
        return "";
      },
    };
  };
  const client = {
    app: { log: async ({ body }) => { logs.push(body); } },
    session: { prompt: async ({ path: p, body }) => {
      prompts.push({ id: p.id, text: body.parts[0].text });
    } },
  };
  return { $, client, prompts, logs };
}

const idle = (sid) => ({ type: "session.idle",
  properties: { sessionID: sid } });
const other = () => ({ type: "session.ready", properties: {} });
let failures = 0;
function check(name, cond, extra = "") {
  console.log((cond ? "PASS" : "FAIL") + " " + name + (extra ? " -- " + extra : ""));
  if (!cond) failures++;
}

const flushMod = await import(toMjs("context-flush.js"));
const ralphMod = await import(toMjs("bcp-ralph.js"));
const flush = await flushMod.ContextFlush({ client: null, $: null });

// T1: dirty tree -> exactly one flush prompt with wip ref.
{
  try { fs.unlinkSync(path.join(os.tmpdir(), "amp-flush-mission_selftest-plugin")); } catch (_) {}
  canned.branch = "mission/selftest-plugin";
  canned.porcelain = " M docs/agent-system/missions/selftest-plugin/STATE.md";
  const s = makeStubs();
  const h = await flushMod.ContextFlush(s);
  await h.event({ event: idle("sess-1") });
  check("T1 dirty -> exactly one flush", s.prompts.length === 1,
    JSON.stringify(s.prompts.length));
  check("T1 prompt is CONTEXT FLUSH with wip ref",
    (s.prompts[0]?.text ?? "").includes("CONTEXT FLUSH")
    && (s.prompts[0]?.text ?? "").includes("refs/wip/"));
  check("T1 non-idle event ignored", (await (async () => {
    const n = s.prompts.length;
    await h.event({ event: other() });
    return s.prompts.length === n;
  })()));
}

// T2: same episode -> guard suppresses second flush.
{
  canned.branch = "mission/selftest-plugin";
  canned.porcelain = " M docs/agent-system/missions/selftest-plugin/STATE.md";
  const s = makeStubs();
  const h = await flushMod.ContextFlush(s);
  await h.event({ event: idle("sess-1") });
  check("T2 repeat idle -> silent (guard)", s.prompts.length === 0,
    JSON.stringify(s.prompts.length));
}

// T3: clean tree + empty inbox -> silent.
{
  canned.branch = "mission/amp-1";
  canned.porcelain = "";
  const s = makeStubs();
  const h = await flushMod.ContextFlush(s);
  await h.event({ event: idle("sess-1") });
  check("T3 clean -> silent", s.prompts.length === 0,
    JSON.stringify(s.prompts.length));
}

// T4: ralph coexistence — lane held, flush-silent tree.
{
  process.env.BCP_LANE_CAP = "FAM-09.1";
  process.env.BCP_AGENT = "AGT-1";
  canned.show = "FAM-09.1 [L1]\nlease: AGT-1 target L2";
  canned.branch = "mission/amp-1";
  canned.porcelain = "";
  const s = makeStubs();
  const fh = await flushMod.ContextFlush(s);
  const rh = await ralphMod.BcpRalph(s);
  await fh.event({ event: idle("sess-1") });
  await rh.event({ event: idle("sess-1") });
  const lane = s.prompts.filter((p) => p.text.includes("still hold"));
  check("T4 ralph fires lane prompt", lane.length === 1,
    JSON.stringify(s.prompts.length));
  check("T4 flush stays silent (nothing changed)", s.prompts.length === 1);
  // Dirty tree: both fire, each exactly once, no exception.
  canned.porcelain = " M docs/agent-system/missions/amp-1/STATE.md";
  try { fs.unlinkSync(path.join(os.tmpdir(), "amp-flush-mission_amp-1")); } catch (_) {}
  const s2 = makeStubs();
  const fh2 = await flushMod.ContextFlush(s2);
  const rh2 = await ralphMod.BcpRalph(s2);
  await fh2.event({ event: idle("sess-1") });
  await rh2.event({ event: idle("sess-1") });
  const flushes = s2.prompts.filter((p) => p.text.includes("CONTEXT FLUSH"));
  const lanes = s2.prompts.filter((p) => p.text.includes("still hold"));
  check("T4 dirty -> one flush + one lane prompt, no conflict",
    flushes.length === 1 && lanes.length === 1,
    JSON.stringify(s2.prompts.map((p) => p.text.slice(0, 30))));
  delete process.env.BCP_LANE_CAP;
  delete process.env.BCP_AGENT;
}

console.log(failures === 0 ? "PLUGIN-DRY-RUN ALL GREEN" : "PLUGIN-DRY-RUN FAILURES: " + failures);
process.exit(failures === 0 ? 0 : 1);
