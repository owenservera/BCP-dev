/**
 * Swarm plugin: gives every opencode agent the swarm_* tools — shared memory,
 * inter-agent messaging, and roster inspection — backed by the swarm SQLite DB
 * (.swarm/swarm.db in the project, or OPENCODE_SWARM_DB).
 *
 * Sessions are mapped to swarm agents by session ID (recorded by the
 * orchestrator at spawn time). Non-swarm sessions get a friendly error.
 */
import type { Plugin } from "@opencode-ai/plugin"
import { tool } from "@opencode-ai/plugin"
import type { Database } from "bun:sqlite"
import { existsSync } from "node:fs"
import { openDb, resolveDbPath } from "../src/db.ts"
import { SwarmMemory } from "../src/memory.ts"
import { MessageBus } from "../src/bus.ts"
import { SwarmState, type AgentRecord } from "../src/state.ts"

const z = tool.schema

export const SwarmPlugin: Plugin = async ({ directory }) => {
  const dbPath = resolveDbPath(directory)
  let db: Database | null = null
  // Lazy: don't create .swarm/ in projects that never use swarm tools.
  const getDb = () => {
    if (!db) {
      if (process.env.OPENCODE_SWARM_DB === undefined && !existsSync(dbPath))
        return null
      db = openDb(dbPath)
    }
    return db
  }

  const NOT_IN_SWARM =
    "Error: this session is not part of a swarm. These tools only work for agents spawned by `swarm run`."

  function whoami(sessionID: string): { agent: AgentRecord; db: Database } | null {
    const database = getDb()
    if (!database) return null
    const agent = new SwarmState(database).findAgentBySession(sessionID)
    return agent ? { agent, db: database } : null
  }

  return {
    tool: {
      swarm_memory_set: tool({
        description:
          "Store a value in the swarm's shared memory, visible to all agents. Use for decisions, findings, and artifacts teammates need.",
        args: {
          key: z.string().describe("Short kebab-case key, e.g. 'api-design'"),
          value: z.string().describe("The content to store"),
          tags: z.string().optional().describe("Optional comma-separated tags"),
        },
        async execute(args, ctx) {
          const me = whoami(ctx.sessionID)
          if (!me) return NOT_IN_SWARM
          new SwarmMemory(me.db, me.agent.swarmId).set(args.key, args.value, {
            tags: args.tags ? args.tags.split(",").map((t) => t.trim()) : [],
            updatedBy: me.agent.name,
          })
          return `Stored "${args.key}" in shared memory.`
        },
      }),
      swarm_memory_get: tool({
        description: "Read a value from the swarm's shared memory by exact key.",
        args: { key: z.string().describe("The key to read") },
        async execute(args, ctx) {
          const me = whoami(ctx.sessionID)
          if (!me) return NOT_IN_SWARM
          const entry = new SwarmMemory(me.db, me.agent.swarmId).get(args.key)
          if (!entry) return `No shared memory entry for "${args.key}".`
          return `${entry.value}\n\n(updated by ${entry.updatedBy ?? "unknown"})`
        },
      }),
      swarm_memory_search: tool({
        description: "Search the swarm's shared memory by substring across keys, values, and tags.",
        args: { query: z.string().describe("Substring to search for") },
        async execute(args, ctx) {
          const me = whoami(ctx.sessionID)
          if (!me) return NOT_IN_SWARM
          const hits = new SwarmMemory(me.db, me.agent.swarmId).search(args.query)
          if (hits.length === 0) return `No shared memory entries match "${args.query}".`
          return hits.map((e) => `## ${e.key} (by ${e.updatedBy ?? "?"})\n${e.value}`).join("\n\n")
        },
      }),
      swarm_memory_list: tool({
        description: "List all keys in the swarm's shared memory.",
        args: {},
        async execute(_args, ctx) {
          const me = whoami(ctx.sessionID)
          if (!me) return NOT_IN_SWARM
          const entries = new SwarmMemory(me.db, me.agent.swarmId).list()
          if (entries.length === 0) return "Shared memory is empty."
          return entries.map((e) => `- ${e.key} (by ${e.updatedBy ?? "?"})`).join("\n")
        },
      }),
      swarm_send: tool({
        description:
          'Send a message to another agent in the swarm by name, or "*" to broadcast to everyone. Delivery is automatic.',
        args: {
          to: z.string().describe('Recipient agent name, or "*" for broadcast'),
          message: z.string().describe("The message body"),
        },
        async execute(args, ctx) {
          const me = whoami(ctx.sessionID)
          if (!me) return NOT_IN_SWARM
          const state = new SwarmState(me.db)
          const bus = new MessageBus(me.db, me.agent.swarmId)
          const roster = state.getAgents(me.agent.swarmId).map((a) => a.name)
          if (args.to === "*") {
            bus.broadcast(me.agent.name, roster, args.message)
            return `Broadcast sent to ${roster.filter((n) => n !== me.agent.name).join(", ")}.`
          }
          if (!roster.includes(args.to))
            return `Error: no agent named "${args.to}" in this swarm. Agents: ${roster.join(", ")}.`
          bus.send(me.agent.name, args.to, args.message)
          return `Message sent to ${args.to}.`
        },
      }),
      swarm_inbox: tool({
        description: "Check for unread messages from other swarm agents (marks them read).",
        args: {},
        async execute(_args, ctx) {
          const me = whoami(ctx.sessionID)
          if (!me) return NOT_IN_SWARM
          const bus = new MessageBus(me.db, me.agent.swarmId)
          const msgs = bus.inbox(me.agent.name)
          if (msgs.length === 0) return "No new messages."
          bus.markDelivered(msgs.map((m) => m.id))
          return msgs.map((m) => `From ${m.from}:\n${m.body}`).join("\n\n---\n\n")
        },
      }),
      swarm_agents: tool({
        description: "List the agents in this swarm and their current status.",
        args: {},
        async execute(_args, ctx) {
          const me = whoami(ctx.sessionID)
          if (!me) return NOT_IN_SWARM
          return new SwarmState(me.db)
            .getAgents(me.agent.swarmId)
            .map((a) => `- ${a.name} [${a.status}]${a.name === me.agent.name ? " (you)" : ""}`)
            .join("\n")
        },
      }),
    },
  }
}
