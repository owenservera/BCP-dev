#!/usr/bin/env node
import { openGitCommons } from "./bootstrap.js";

const [command, ...args] = process.argv.slice(2);
const repoRoot = process.env.COMMONS_REPO_ROOT ?? process.cwd();
const agentId = process.env.COMMONS_AGENT_ID;
const agentHome = process.env.COMMONS_AGENT_HOME;
const sessionId = process.env.COMMONS_SESSION_ID ?? `session-${Date.now()}`;

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
    console.error("Commands: inbox | history <conversation> | publish <text> | presence <state> | flush");
    process.exit(2);
}
