import type { Database } from "bun:sqlite"

export type SwarmMessage = {
  id: number
  from: string
  to: string
  body: string
  createdAt: number
  deliveredAt: number | null
}

type Row = {
  id: number
  from_agent: string
  to_agent: string
  body: string
  created_at: number
  delivered_at: number | null
}

const toMsg = (r: Row): SwarmMessage => ({
  id: r.id,
  from: r.from_agent,
  to: r.to_agent,
  body: r.body,
  createdAt: r.created_at,
  deliveredAt: r.delivered_at,
})

const COLS = "id, from_agent, to_agent, body, created_at, delivered_at"

/** Inter-agent message bus for one swarm, backed by the shared SQLite DB. */
export class MessageBus {
  constructor(
    private db: Database,
    private swarmId: string,
  ) {}

  send(from: string, to: string, body: string): number {
    const res = this.db
      .query(`INSERT INTO messages (swarm_id, from_agent, to_agent, body, created_at) VALUES (?, ?, ?, ?, ?)`)
      .run(this.swarmId, from, to, body, Date.now())
    return Number(res.lastInsertRowid)
  }

  /** Send the same message to several recipients (used to expand "*" broadcasts). */
  broadcast(from: string, recipients: string[], body: string): number[] {
    return recipients.filter((r) => r !== from).map((r) => this.send(from, r, body))
  }

  /** Pending (default) or full message history for an agent. */
  inbox(agent: string, opts: { all?: boolean } = {}): SwarmMessage[] {
    const filter = opts.all ? "" : "AND delivered_at IS NULL"
    return this.db
      .query<Row, [string, string]>(
        `SELECT ${COLS} FROM messages WHERE swarm_id = ? AND to_agent = ? ${filter} ORDER BY id`,
      )
      .all(this.swarmId, agent)
      .map(toMsg)
  }

  /** All undelivered messages in the swarm — used by the orchestrator's push watcher. */
  undelivered(): SwarmMessage[] {
    return this.db
      .query<Row, [string]>(
        `SELECT ${COLS} FROM messages WHERE swarm_id = ? AND delivered_at IS NULL ORDER BY id`,
      )
      .all(this.swarmId)
      .map(toMsg)
  }

  markDelivered(ids: number[]): void {
    if (ids.length === 0) return
    const placeholders = ids.map(() => "?").join(",")
    this.db
      .query(`UPDATE messages SET delivered_at = ? WHERE id IN (${placeholders})`)
      .run(Date.now(), ...ids)
  }
}
