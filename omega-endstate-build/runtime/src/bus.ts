/**
 * bus.ts — inter-agent messaging for the VIVIM end-state team runtime.
 *
 * Delivery model, and it is not negotiable: **opencode has no MCP server-push.**
 * A busy agent cannot be interrupted mid-turn. So the bus delivers between turns:
 * the orchestrator watches for messages addressed to an agent whose session is
 * between prompts, and injects them as a follow-up prompt.
 *
 * From the agent's point of view this is push. Underneath it is a poll plus a
 * prompt send, and pretending otherwise produces designs that cannot work.
 */

import type { Store, MessageRecord } from "./db.ts";

export interface Delivery {
  id: number;
  from: string;
  to: string;
  body: string;
}

export class Bus {
  constructor(private store: Store) {}

  /**
   * Post a message. `to` may be an agent name or "*" for broadcast.
   * Broadcast fans out to every other agent in the run; a message to yourself is
   * a bug in the caller and is rejected rather than silently delivered.
   */
  post(
    runId: string,
    from: string,
    to: string,
    body: string,
  ): { delivered: number; rejected?: string } {
    if (!body || !body.trim()) return { delivered: 0, rejected: "empty body" };
    if (to === from) return { delivered: 0, rejected: "cannot message yourself" };

    if (to === "*") {
      const others = this.store
        .listAgents(runId)
        .filter((a) => a.name !== from);
      if (others.length === 0) return { delivered: 0, rejected: "no other agents" };
      for (const a of others) this.store.postMessage(runId, from, a.name, body);
      return { delivered: others.length };
    }

    this.store.postMessage(runId, from, to, body);
    return { delivered: 1 };
  }

  /** Messages waiting for an agent, oldest first. */
  pending(runId: string, to: string, limit = 20): Delivery[] {
    return this.store.pendingMessages(runId, to, limit).map(toDelivery);
  }

  /**
   * Claim the pending messages for an agent and mark them delivered.
   *
   * Marking happens on claim, not on successful send. That is deliberate: if the
   * send fails we would otherwise redeliver forever, and a message that was
   * already surfaced in a prompt should not be replayed. The run report records
   * the full history, so an undelivered tail is still inspectable.
   */
  claim(runId: string, to: string, limit = 20): Delivery[] {
    const msgs = this.store.pendingMessages(runId, to, limit);
    if (msgs.length > 0) this.store.markDelivered(msgs.map((m) => m.id));
    return msgs.map(toDelivery);
  }

  hasPending(runId: string, to: string): boolean {
    return this.store.pendingMessages(runId, to, 1).length > 0;
  }

  history(runId: string): MessageRecord[] {
    return this.store.allMessages(runId);
  }
}

function toDelivery(m: MessageRecord): Delivery {
  return { id: m.id, from: m.fromAgent, to: m.toAgent, body: m.body };
}

/**
 * Render claimed messages as the follow-up prompt body.
 *
 * Kept pure and exported so it can be unit-tested without a server, and so the
 * exact wording delivered to an agent is reviewable in isolation.
 */
export function renderDeliveryPrompt(agentName: string, msgs: Delivery[]): string {
  if (msgs.length === 0) return "";
  const lines = msgs.map(
    (m) => `- from ${m.from}: ${m.body}`,
  );
  return [
    `[vivim-swarm] You have ${msgs.length} new message(s).`,
    "",
    ...lines,
    "",
    `Addressed to: ${agentName}`,
    "Use vivim_swarm_memory_search / vivim_swarm_memory_get to read shared memory if a",
    "message refers to a key you have not read yet. Reply with vivim_swarm_send.",
  ].join("\n");
}
