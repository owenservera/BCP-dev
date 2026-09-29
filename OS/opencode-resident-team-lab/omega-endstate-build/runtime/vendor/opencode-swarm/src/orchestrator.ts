import type { Database } from "bun:sqlite"
import { MessageBus } from "./bus.ts"
import { SwarmMemory } from "./memory.ts"
import { SwarmState } from "./state.ts"
import { parseModel, type AgentSpec, type SwarmConfig } from "./config.ts"

/**
 * The slice of OpencodeClient the orchestrator needs — structural, so tests can
 * inject a fake and the real client just fits.
 */
export type SessionClient = {
  session: {
    create(opts: { body: { title: string } }): Promise<{ data?: { id: string }; error?: unknown }>
    prompt(opts: {
      path: { id: string }
      body: {
        model: { providerID: string; modelID: string }
        system?: string
        tools?: Record<string, boolean>
        parts: Array<{ type: "text"; text: string }>
      }
    }): Promise<{ data?: PromptResult; error?: unknown }>
  }
}

export type TurnTokens = { input: number; output: number; reasoning: number; cache: { read: number; write: number } }

type PromptResult = {
  info?: {
    error?: { name?: string; data?: { message?: string } }
    cost?: number
    tokens?: TurnTokens
  }
  parts: Array<{ type: string; text?: string }>
}

const ZERO_TOKENS: TurnTokens = { input: 0, output: 0, reasoning: 0, cache: { read: 0, write: 0 } }

export type SwarmEvent =
  | { type: "agent-spawned"; agent: string; sessionId: string }
  | { type: "agent-turn"; agent: string; round: number }
  | {
      type: "agent-turn-done"
      agent: string
      round: number
      /** "provider/model" that served this turn. */
      model: string
      /** Cost reported by the provider for this turn; 0 when the provider omits it. */
      costUsd: number
      /** Token counts for this turn — usable for price fallback when costUsd is 0. */
      tokens: TurnTokens
      /** Swarm-wide spend so far. */
      totalCostUsd: number
    }
  | { type: "agent-done"; agent: string; result: string; costUsd: number }
  | {
      /** Final per-agent settlement, emitted after the sweep — costUsd and result include sweep activity. */
      type: "agent-settled"
      agent: string
      status: string
      costUsd: number
      result: string | null
    }
  | { type: "agent-skipped"; agent: string; reason: string }
  | { type: "agent-failed"; agent: string; error: string }
  | { type: "messages-delivered"; agent: string; count: number }
  | { type: "budget-exceeded"; spentUsd: number; budgetUsd: number }
  | { type: "swarm-done"; swarmId: string; status: string; totalCostUsd: number }

export type SwarmResult = {
  swarmId: string
  status: "completed" | "failed" | "stopped"
  totalCostUsd: number
  agents: Array<{ name: string; status: string; result: string | null; costUsd: number }>
}

const DEFAULT_MAX_ROUNDS = 5

/** The coordination tools every swarm agent must keep, even under a restrictive tools map. */
export const SWARM_TOOLS = [
  "swarm_memory_set",
  "swarm_memory_get",
  "swarm_memory_search",
  "swarm_memory_list",
  "swarm_send",
  "swarm_inbox",
  "swarm_agents",
] as const

export function swarmSystemPrompt(agent: AgentSpec, config: SwarmConfig): string {
  const teammates = config.agents
    .filter((a) => a.name !== agent.name)
    .map((a) => `- ${a.name}: ${a.task.slice(0, 120)}`)
    .join("\n")
  return [
    agent.system ?? "",
    `\n## Swarm context`,
    `You are agent "${agent.name}" in the swarm "${config.name}", collaborating with:`,
    teammates || "(no other agents)",
    `\nShared tools:`,
    `- swarm_memory_set/get/search/list: shared key-value memory all agents can read. Record decisions and findings others need.`,
    `- swarm_send: message another agent by name (or "*" to broadcast). Messages are delivered to them automatically.`,
    `- swarm_inbox: check for messages sent to you (delivered messages also arrive as new prompts).`,
    `- swarm_agents: list the agents in this swarm and their status.`,
    `Coordinate through these tools instead of assuming what others did.`,
    `Never send acknowledgement-only or thank-you messages — only message teammates when it carries actionable information they don't have.`,
  ].join("\n")
}

function textOf(result: PromptResult | undefined): string {
  return (result?.parts ?? [])
    .filter((p) => p.type === "text" && p.text)
    .map((p) => p.text)
    .join("")
}

function formatDelivery(msgs: Array<{ from: string; body: string }>): string {
  const lines = msgs.map((m) => `From ${m.from}:\n${m.body}`).join("\n\n---\n\n")
  return `You received ${msgs.length === 1 ? "a message" : `${msgs.length} messages`} from your swarm teammates:\n\n${lines}\n\nAct on this if it affects your work, reply with swarm_send if needed, then continue or confirm you are done.`
}

/** Minimal semaphore: run() admits at most `limit` concurrent thunks. */
function createLimiter(limit: number) {
  let active = 0
  const waiters: Array<() => void> = []
  return async <T>(fn: () => Promise<T>): Promise<T> => {
    if (active >= limit) await new Promise<void>((resolve) => waiters.push(resolve))
    active++
    try {
      return await fn()
    } finally {
      active--
      waiters.shift()?.()
    }
  }
}

type RunCtx = {
  swarmId: string
  config: SwarmConfig
  maxRounds: number
  budgetUsd?: number
  budgetFired: boolean
  /** Monotonic per-agent prompt ordinal (this process) — what turn events report. */
  turns: Map<string, number>
}

export class Orchestrator {
  private state: SwarmState
  private bus!: MessageBus
  readonly memory: (swarmId: string) => SwarmMemory

  private onEvent: (e: SwarmEvent) => void
  private backoffMs: number

  constructor(
    private client: SessionClient,
    private db: Database,
    opts: { onEvent?: (e: SwarmEvent) => void; backoffMs?: number } = {},
  ) {
    this.state = new SwarmState(db)
    this.memory = (swarmId) => new SwarmMemory(db, swarmId)
    this.onEvent = opts.onEvent ?? (() => {})
    this.backoffMs = opts.backoffMs ?? 500
  }

  async run(config: SwarmConfig, opts: { resumeSwarmId?: string } = {}): Promise<SwarmResult> {
    let swarmId: string
    if (opts.resumeSwarmId) {
      const existing = this.state.getSwarm(opts.resumeSwarmId)
      if (!existing) throw new Error(`swarm ${opts.resumeSwarmId} not found`)
      swarmId = existing.id
    } else {
      swarmId = this.state.createSwarm(config.name, config)
    }
    const ctx: RunCtx = {
      swarmId,
      config,
      maxRounds: config.maxRounds ?? DEFAULT_MAX_ROUNDS,
      budgetUsd: config.budgetUsd,
      budgetFired: false,
      turns: new Map(),
    }
    this.bus = new MessageBus(this.db, swarmId)
    this.state.setSwarmStatus(swarmId, "running")

    const previous = new Map(this.state.getAgents(swarmId).map((a) => [a.name, a]))
    const pending = config.agents.filter((a) => previous.get(a.name)?.status !== "done")

    const limit = createLimiter(config.maxConcurrent ?? Number.POSITIVE_INFINITY)
    await Promise.all(pending.map((agent) => limit(() => this.runAgent(ctx, agent))))

    // Final sweep: late messages sent to agents that already finished.
    for (let round = 0; round < ctx.maxRounds && this.bus.undelivered().length > 0; round++) {
      for (const agent of config.agents) {
        const msgs = this.bus.inbox(agent.name)
        if (msgs.length === 0) continue
        const record = this.state.getAgents(swarmId).find((a) => a.name === agent.name)
        this.bus.markDelivered(msgs.map((m) => m.id))
        if (!record?.sessionId || this.overBudget(ctx)) continue
        this.onEvent({ type: "messages-delivered", agent: agent.name, count: msgs.length })
        const text = await this.promptAgent(ctx, record.sessionId, agent, formatDelivery(msgs))
        // Append the late reaction — never let a courtesy reply clobber the settled result.
        const result = record.result ? `${record.result}\n\n[update after message] ${text}` : text
        this.state.upsertAgent(ctx.swarmId, agent.name, { result })
      }
    }
    // Anything still undelivered after maxRounds is dropped deliberately (ping-pong guard).
    this.bus.markDelivered(this.bus.undelivered().map((m) => m.id))

    const agents = this.state.getAgents(swarmId)
    for (const a of agents) {
      this.onEvent({ type: "agent-settled", agent: a.name, status: a.status, costUsd: a.costUsd, result: a.result })
    }
    const totalCostUsd = this.state.totalCost(swarmId)
    const status = agents.some((a) => a.status === "failed") ? "failed" : ctx.budgetFired ? "stopped" : "completed"
    this.state.setSwarmStatus(swarmId, status)
    this.onEvent({ type: "swarm-done", swarmId, status, totalCostUsd })
    return {
      swarmId,
      status,
      totalCostUsd,
      agents: agents.map((a) => ({ name: a.name, status: a.status, result: a.result, costUsd: a.costUsd })),
    }
  }

  /** True (and fires the one-time event) once reported spend reaches the budget. */
  private overBudget(ctx: RunCtx): boolean {
    if (ctx.budgetUsd === undefined) return false
    if (ctx.budgetFired) return true
    const spent = this.state.totalCost(ctx.swarmId)
    if (spent >= ctx.budgetUsd) {
      ctx.budgetFired = true
      this.onEvent({ type: "budget-exceeded", spentUsd: spent, budgetUsd: ctx.budgetUsd })
      return true
    }
    return false
  }

  private async runAgent(ctx: RunCtx, agent: AgentSpec): Promise<void> {
    try {
      if (this.overBudget(ctx)) {
        this.state.upsertAgent(ctx.swarmId, agent.name, { status: "skipped", result: "budget exceeded before start" })
        this.onEvent({ type: "agent-skipped", agent: agent.name, reason: "budget exceeded" })
        return
      }
      let sessionId = this.state.getAgents(ctx.swarmId).find((a) => a.name === agent.name)?.sessionId ?? null
      if (!sessionId) {
        const session = await this.client.session.create({ body: { title: `${ctx.config.name}/${agent.name}` } })
        if (!session.data) throw new Error(`session create failed: ${JSON.stringify(session.error)}`)
        sessionId = session.data.id
        this.state.upsertAgent(ctx.swarmId, agent.name, { sessionId, status: "running" })
        this.onEvent({ type: "agent-spawned", agent: agent.name, sessionId })
      } else {
        this.state.upsertAgent(ctx.swarmId, agent.name, { status: "running" })
      }

      this.onEvent({ type: "agent-turn", agent: agent.name, round: 0 })
      let lastText = await this.promptAgent(ctx, sessionId, agent, agent.task)

      for (let round = 1; round <= ctx.maxRounds; round++) {
        const msgs = this.bus.inbox(agent.name)
        if (msgs.length === 0) break
        this.bus.markDelivered(msgs.map((m) => m.id))
        if (this.overBudget(ctx)) break
        this.onEvent({ type: "messages-delivered", agent: agent.name, count: msgs.length })
        this.onEvent({ type: "agent-turn", agent: agent.name, round })
        lastText = await this.promptAgent(ctx, sessionId, agent, formatDelivery(msgs))
      }

      this.state.upsertAgent(ctx.swarmId, agent.name, { status: "done", result: lastText })
      const record = this.state.getAgents(ctx.swarmId).find((a) => a.name === agent.name)
      this.onEvent({ type: "agent-done", agent: agent.name, result: lastText, costUsd: record?.costUsd ?? 0 })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      this.state.upsertAgent(ctx.swarmId, agent.name, { status: "failed", result: message })
      this.onEvent({ type: "agent-failed", agent: agent.name, error: message })
    }
  }

  private async promptAgent(ctx: RunCtx, sessionId: string, agent: AgentSpec, text: string): Promise<string> {
    const turn = ctx.turns.get(agent.name) ?? 0
    ctx.turns.set(agent.name, turn + 1)
    const modelStr = agent.model ?? ctx.config.model
    const model = parseModel(modelStr)
    const userTools = agent.tools ?? ctx.config.tools
    // A restrictive map like {"*": false} must never strip the coordination tools.
    const tools = userTools
      ? { ...userTools, ...Object.fromEntries(SWARM_TOOLS.map((t) => [t, true])) }
      : undefined
    let lastError = ""
    for (let attempt = 0; attempt < 3; attempt++) {
      const result = await this.client.session.prompt({
        path: { id: sessionId },
        body: {
          model,
          system: swarmSystemPrompt(agent, ctx.config),
          ...(tools ? { tools } : {}),
          parts: [{ type: "text", text }],
        },
      })
      const modelError = result.data?.info?.error
      if (result.data && !modelError) {
        const costUsd = result.data.info?.cost ?? 0
        if (costUsd > 0) this.state.addAgentCost(ctx.swarmId, agent.name, costUsd)
        this.onEvent({
          type: "agent-turn-done",
          agent: agent.name,
          round: turn,
          model: modelStr,
          costUsd,
          tokens: result.data.info?.tokens ?? ZERO_TOKENS,
          totalCostUsd: this.state.totalCost(ctx.swarmId),
        })
        return textOf(result.data)
      }
      lastError = modelError
        ? `${modelError.name}: ${modelError.data?.message ?? JSON.stringify(modelError)}`
        : `prompt failed: ${JSON.stringify(result.error)}`
      await new Promise((r) => setTimeout(r, this.backoffMs * (attempt + 1) ** 2))
    }
    throw new Error(lastError)
  }
}
