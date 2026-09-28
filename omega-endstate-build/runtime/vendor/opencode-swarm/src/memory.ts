import type { Database } from "bun:sqlite"

export type MemoryEntry = {
  key: string
  value: string
  tags: string[]
  updatedBy: string | null
  updatedAt: number
}

type Row = { key: string; value: string; tags: string; updated_by: string | null; updated_at: number }

const toEntry = (r: Row): MemoryEntry => ({
  key: r.key,
  value: r.value,
  tags: JSON.parse(r.tags),
  updatedBy: r.updated_by,
  updatedAt: r.updated_at,
})

/** Shared key-value memory for one swarm. Safe for concurrent multi-process access (WAL). */
export class SwarmMemory {
  constructor(
    private db: Database,
    private swarmId: string,
  ) {}

  set(key: string, value: string, opts: { tags?: string[]; updatedBy?: string } = {}): void {
    this.db
      .query(
        `INSERT INTO memory (swarm_id, key, value, tags, updated_by, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT (swarm_id, key) DO UPDATE SET
           value = excluded.value, tags = excluded.tags,
           updated_by = excluded.updated_by, updated_at = excluded.updated_at`,
      )
      .run(this.swarmId, key, value, JSON.stringify(opts.tags ?? []), opts.updatedBy ?? null, Date.now())
  }

  get(key: string): MemoryEntry | null {
    const row = this.db
      .query<Row, [string, string]>(
        `SELECT key, value, tags, updated_by, updated_at FROM memory WHERE swarm_id = ? AND key = ?`,
      )
      .get(this.swarmId, key)
    return row ? toEntry(row) : null
  }

  search(query: string): MemoryEntry[] {
    const like = `%${query}%`
    return this.db
      .query<Row, [string, string, string, string]>(
        `SELECT key, value, tags, updated_by, updated_at FROM memory
         WHERE swarm_id = ? AND (key LIKE ? OR value LIKE ? OR tags LIKE ?)
         ORDER BY updated_at DESC`,
      )
      .all(this.swarmId, like, like, like)
      .map(toEntry)
  }

  list(): MemoryEntry[] {
    return this.db
      .query<Row, [string]>(
        `SELECT key, value, tags, updated_by, updated_at FROM memory WHERE swarm_id = ? ORDER BY key`,
      )
      .all(this.swarmId)
      .map(toEntry)
  }
}
