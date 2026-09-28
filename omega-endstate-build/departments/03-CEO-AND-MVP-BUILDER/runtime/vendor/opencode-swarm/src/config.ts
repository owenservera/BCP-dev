export type AgentSpec = {
  /** Unique agent name within the swarm, e.g. "researcher". */
  name: string
  /** The work this agent is asked to do. */
  task: string
  /** Extra system prompt for this agent (the swarm preamble is always appended). */
  system?: string
  /** "provider/model", e.g. "openrouter/openai/gpt-4o-mini". Falls back to swarm default. */
  model?: string
  /** opencode tool enable/disable map for this agent, e.g. {"*": false, "read": true}. */
  tools?: Record<string, boolean>
}

export type SwarmConfig = {
  name: string
  /** Default "provider/model" for agents that don't specify one. */
  model: string
  agents: AgentSpec[]
  /** Max message-delivery rounds per agent before the swarm is force-completed. Default 5. */
  maxRounds?: number
  /**
   * Soft budget brake: once total reported spend crosses this, no further prompts are
   * issued and the swarm stops (status "stopped"). Granularity is one turn — in-flight
   * turns finish. Providers that report cost 0 never trip it.
   */
  budgetUsd?: number
  /** Cap on agents running turns simultaneously. Default: unlimited. */
  maxConcurrent?: number
  /** Default tools map applied to agents without their own. */
  tools?: Record<string, boolean>
  notify?: {
    /** Desktop notification via notify-send when the swarm finishes. Default true. */
    desktop?: boolean
    /** Optional ntfy.sh topic for push notifications. */
    ntfyTopic?: string
  }
}

export function parseModel(model: string): { providerID: string; modelID: string } {
  const slash = model.indexOf("/")
  if (slash < 1 || slash === model.length - 1)
    throw new Error(`invalid model "${model}" — expected "provider/model", e.g. "openrouter/openai/gpt-4o-mini"`)
  return { providerID: model.slice(0, slash), modelID: model.slice(slash + 1) }
}

export function validateConfig(raw: unknown): SwarmConfig {
  const c = raw as Partial<SwarmConfig>
  if (!c || typeof c !== "object") throw new Error("swarm config must be a JSON object")
  if (!c.name || typeof c.name !== "string") throw new Error("swarm config needs a string `name`")
  if (!c.model || typeof c.model !== "string") throw new Error("swarm config needs a default `model`")
  parseModel(c.model)
  if (!Array.isArray(c.agents) || c.agents.length === 0) throw new Error("swarm config needs a non-empty `agents` array")
  const seen = new Set<string>()
  for (const a of c.agents) {
    if (!a.name || typeof a.name !== "string") throw new Error("every agent needs a string `name`")
    if (a.name === "*") throw new Error(`agent name "*" is reserved for broadcasts`)
    if (seen.has(a.name)) throw new Error(`duplicate agent name "${a.name}"`)
    seen.add(a.name)
    if (!a.task || typeof a.task !== "string") throw new Error(`agent "${a.name}" needs a string \`task\``)
    if (a.model) parseModel(a.model)
  }
  return c as SwarmConfig
}
