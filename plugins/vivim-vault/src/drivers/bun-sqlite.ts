// vivim.vault — drivers/bun-sqlite.ts (D-373)
// The Bun-lane storage driver: the ONLY file in the vault that may import
// `bun:sqlite` (the D-373 rewrite of the D-361 one-importer rule — the
// allowlist moved from "one file anywhere" to "the vault driver lane").
// bun:sqlite's Database satisfies the SqliteDriver shape structurally;
// this module just names it, stamps the driverId, and applies the shared
// PRAGMA parity block before the caller's DDL.
//
// The one place a structural pass-through is NOT enough: bun:sqlite caches a
// prepared statement per SQL string on the Database, and Database.close() is
// DEFERRED (sqlite3_close_v2 zombie semantics) while any cached statement is
// unfinalized — it returns with the connection, its -wal and its -shm still
// open, and only the JS GC finishing them releases it. A close() whose
// postcondition is "nothing of mine is open" therefore cannot be a bare
// pass-through: VaultDB.close() promises a graceful close, and an untimed one
// left the vault directory unremovable (measured: EBUSY over the whole vault
// dir after close, in the F-DURABILITY compaction gate). Track what the
// connection handed out and finalize it here, so the handle is gone by the
// time close() returns. Reuse after finalize is safe — the cache hands back a
// live statement for the same SQL — so this costs nothing on the open path.
import { Database, type Statement } from "bun:sqlite";
import { VAULT_PRAGMAS, type SqliteDriver } from "./driver.ts";
import type { StorageDriverInfo } from "@vivim/omega-contracts"; // D-373: the driver self-description is contract vocabulary

export type { Database }; // re-exported so any Bun-lane tooling can name the native type

export const DRIVER_INFO: StorageDriverInfo = { id: "bun-sqlite", family: "sqlite", lazyLoaded: false };

export function openSqlite(path: string): SqliteDriver {
  const db = new Database(path);
  for (const pragma of VAULT_PRAGMAS) db.exec(pragma);
  const statements = new Set<Statement>(); // the same instances bun:sqlite caches; finalized at close
  const driver: SqliteDriver = {
    driverId: "bun-sqlite",
    exec: (sql) => db.exec(sql),
    query: (sql) => {
      const stmt = db.query(sql);
      statements.add(stmt);
      return stmt;
    },
    close: () => {
      for (const stmt of statements) {
        try { stmt.finalize(); } catch { /* already finalized — close still completes */ }
      }
      statements.clear();
      db.close();
    },
  };
  return driver;
}
