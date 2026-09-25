#!/usr/bin/env node
import { openGitCommons } from "./bootstrap.js";
import { whoNeedsAttention } from "./who-needs-attention.js";

const [command, ...args] = process.argv.slice(2);
const repoRoot = process.env.COMMONS_REPO_ROOT ?? process.cwd();
const agentId = process.env.COMMONS_AGENT_ID;
const agentHome = process.env.COMMONS_AGENT_HOME;
const sessionId = process.env.COMMONS_SESSION_ID ?? `session-${Date.now()}`;

if (command === "who-needs-attention") {
  const staleIndex = args.indexOf("--stale-hours");
  const staleHours = staleIndex >= 0 ? Number(args[staleIndex + 1]) : Number(process.env.COMMONS_HANDOFF_STALE_HOURS ?? 4);
  if (!Number.isFinite(staleHours) || staleHours < 0) {
    console.error("Invalid --stale-hours value.");
    process.exit(2);
  }
  console.log(JSON.stringify(await whoNeedsAttention({repoRoot, staleAfterMs: staleHours * 60 * 60 * 1000}), null, 2));
  process.exit(0);
}

if (!agentId || !agentHome) {
  console.error("Set COMMONS_AGENT_ID and COMMONS_AGENT_HOME.");
  process.exit(2);
}

const commons = await openGitCommons({repoRoot, agentId, agentHome, sessionId});

switch (command) {
  case "inbox":
    console.log(JSON.stringify(await commons.inbox(), null, 2));
    break;
  case "history":
    console.log(JSON.stringify(await commons.history(args[0] ?? "commons.public"), null, 2));
    break;
  case "publish":
    console.log(JSON.stringify(await commons.publish({kind:"ANNOUNCEMENT",body:{format:"text",content:args.join(" ")},attention:{level:"NORMAL",requested_delivery:"INBOX"}}), null, 2));
    break;
  case "presence":
    console.log(JSON.stringify(await commons.presence((args[0] ?? "IDLE") as any), null, 2));
    break;
  case "flush":
    console.log(JSON.stringify(await commons.flush(), null, 2));
    break;
  default:
    console.error("Commands: inbox | history <conversation> | publish <text> | presence <state> | flush | who-needs-attention [--stale-hours N]");
    process.exit(2);
}
