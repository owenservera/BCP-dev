import type { Database } from "bun:sqlite"

export type SwarmRecord = {
  id: string
  name: string
  config: unknown
  status: string
  createdAt: number
  updatedAt: number
}

export type AgentRecord = {
  swarmId: string
  name: string
  sessionId: string | null
  status: string
  result: string | null
  costUsd: number
  updatedAt: number
}

type SwarmRow = { id: string; name: string; config_json: string; status: string; created_at: number; updated_at: number }
type AgentRow = { swarm_id: string; name: string; session_id: string | null; status: string; result: string | null; cost_usd: number; updated_at: number }

const toSwarm = (r: SwarmRow): SwarmRecord => ({
  id: r.id,
  name: r.name,
  config: JSON.parse(r.config_json),
  status: r.status,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
})

const toAgent = (r: AgentRow): AgentRecord => ({
  swarmId: r.swarm_id,
  name: r.name,
  sessionId: r.session_id,
  status: r.status,
  result: r.result,
  costUsd: r.cost_usd,
  updatedAt: r.updated_at,
})

/** Persistent swarm + agent state. Enables `swarm status` and `swarm resume`. */
export class SwarmState {
  constructor(private db: Database) {}

  createSwarm(name: string, config: unknown): string {
    const id = `sw_${crypto.randomUUID().replaceAll("-", "").slice(0, 16)}`
    const now = Date.now()
    this.db
      .query(`INSERT INTO swarms (id, name, config_json, status, created_at, updated_at) VALUES (?, ?, ?, 'created', ?, ?)`)
      .run(id, name, JSON.stringify(config), now, now)
    return id
  }

  getSwarm(id: string): SwarmRecord | null {
    const row = this.db.query<SwarmRow, [string]>(`SELECT * FROM swarms WHERE id = ?`).get(id)
    return row ? toSwarm(row) : null
  }

  listSwarms(): SwarmRecord[] {
    return this.db.query<SwarmRow, []>(`SELECT * FROM swarms ORDER BY rowid DESC`).all().map(toSwarm)
  }

  setSwarmStatus(id: string, status: string): void {
    this.db.query(`UPDATE swarms SET status = ?, updated_at = ? WHERE id = ?`).run(status, Date.now(), id)
  }

  upsertAgent(
    swarmId: string,
    name: string,
    fields: { sessionId?: string; status?: string; result?: string } = {},
  ): void {
    // The insert defaults status to 'created', but the conflict branch must see the
    // RAW param (not excluded.status, which carries that default) or updates without
    // an explicit status would reset existing agents to 'created'.
    this.db
      .query(
        `INSERT INTO agents (swarm_id, name, session_id, status, result, updated_at)
         VALUES (?, ?, ?, COALESCE(?, 'created'), ?, ?)
         ON CONFLICT (swarm_id, name) DO UPDATE SET
           session_id = COALESCE(excluded.session_id, agents.session_id),
           status     = COALESCE(?, agents.status),
           result     = COALESCE(excluded.result, agents.result),
           updated_at = excluded.updated_at`,
      )
      .run(
        swarmId,
        name,
        fields.sessionId ?? null,
        fields.status ?? null,
        fields.result ?? null,
        Date.now(),
        fields.status ?? null,
      )
  }

  /** Accumulate spend for an agent (cost arrives per turn). */
  addAgentCost(swarmId: string, name: string, usd: number): void {
    this.db
      .query(`UPDATE agents SET cost_usd = cost_usd + ?, updated_at = ? WHERE swarm_id = ? AND name = ?`)
      .run(usd, Date.now(), swarmId, name)
  }

  /** Total spend across all agents in a swarm. */
  totalCost(swarmId: string): number {
    const row = this.db
      .query<{ total: number }, [string]>(`SELECT COALESCE(SUM(cost_usd), 0) total FROM agents WHERE swarm_id = ?`)
      .get(swarmId)
    return row?.total ?? 0
  }

  getAgents(swarmId: string): AgentRecord[] {
    return this.db
      .query<AgentRow, [string]>(`SELECT * FROM agents WHERE swarm_id = ? ORDER BY name`)
      .all(swarmId)
      .map(toAgent)
  }

  /** Resolve which swarm agent a given opencode session belongs to (used by plugin tools). */
  findAgentBySession(sessionId: string): AgentRecord | null {
    const row = this.db.query<AgentRow, [string]>(`SELECT * FROM agents WHERE session_id = ?`).get(sessionId)
    return row ? toAgent(row) : null
  }
}
