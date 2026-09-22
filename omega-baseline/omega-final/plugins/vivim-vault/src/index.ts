// vivim.vault — index.ts (Ω2, D-432 durability ops), the vault spine plugin (wiring only: onInit/onShutdown + ops).
//
// Ops exposed (CONTRACT contributions, see plugin.json):
//   vault.append@1    MUTATION         — new revision: CAS blob + objects row + FTS + Merkle link (two-phase since D-432)
//   vault.get@1       READ             — latest or specific revision (hot, cold fallback)
//   vault.getmany@1   READ             — bounded batch of latest-rev-per-id reads, ONE hop (D-387)
//   vault.query@1     READ             — latest revision per id in a ns (idPrefix/minRev filters)
//   vault.search@1    READ             — FTS5 MATCH with rank
//   vault.verify@1    READ             — Merkle walk + CAS resolution proof
//   vault.compact@1   MUTATION         — superseded revisions → cold_objects, refs survive; plan-driven path (D-432) guards referenced blobs
//   vault.roundtrip@1 EXTERNAL_MUTATION— full copy + verify + head comparison (swap harness; copies the quarantine zone, D-432)
//   vault.recover@1         MUTATION          — the crash-recovery ceremony (also automatic on boot, D-432)
//   vault.migrate.dryrun@1  MUTATION          — READ-only census; its only write is its own ledgered plan row (D-432)
//   vault.migrate@1         EXTERNAL_MUTATION — schema change through the versioned registry, dry-run-first (D-432)
//   vault.compact.dryrun@1  MUTATION          — the reference census + ledgered plan (D-432)
//   vault.export@1          READ              — namespace-scoped chain-preserving archive (persisting it is the caller's act, D-432)
//   vault.import@1          EXTERNAL_MUTATION — verified merge into a caller-named fresh vault dir (D-432)
//
// Data sovereignty: the data directory belongs to the USER'S VAULT, not this plugin —
// ctx.config.dataDir (composition passthrough, never authority), default
// "./dev-vault/vault-data". All state lives there; plugin replacement keeps the data.
//
// Handlers throw on bad payloads — the shim turns throws into DEGRADED returns.
// Mutation ops run through the single-writer queue (enqueueWrite); reads never queue.

import { definePlugin, startPlugin } from "@vivim/omega-shim";
import type { PluginContext } from "@vivim/omega-shim";
import { appendObject } from "./changelog.ts";
import { compact, compactDryrun, compactGuarded } from "./compaction.ts";
import { recoverVault } from "./durability.ts";
import { exportVault, importVault, type ExportScope } from "./export.ts";
import { migrate, migrateDryrun } from "./migrate.ts";
import "./db.ts"; // D-373: binds the Bun lane — a Node build swaps THIS ONE import to ./db.node.ts
import { openVault, GET_MANY_BOUND, queryObjects, readObject, readObjects, searchObjects, type VaultDB } from "./sql.ts";
import { roundtrip } from "./roundtrip.ts";
import { verify } from "./verify.ts";
import {
  optionalInt, requireInt, requireName, requireObject, requireRefs, resolveDataDir,
} from "./validate.ts";

let vault: VaultDB | null = null;

function mustOpen(): VaultDB {
  if (!vault) throw new Error("vivim.vault: not initialized (onInit failed or already shut down)");
  return vault;
}

startPlugin(definePlugin({
  onInit(ctx: PluginContext) {
    const dataDir = resolveDataDir(ctx.config);
    const v = openVault(dataDir);
    vault = v;
    // D-432: the recovery walk runs on EVERY boot — a clean journal is a no-op,
    // an unclean one is quarantined and ledgered before the plugin serves a
    // single op (the spine does not open for business over an unaccounted tear).
    const recovery = v.enqueueWrite(() => recoverVault(v));
    recovery.then((r) => {
      if (r.clean) ctx.log(`vivim.vault: open ${v.path} (WAL+FTS5), dataDir=${dataDir}, recovery walk clean`);
      else ctx.log(`vivim.vault: open ${v.path} — RECOVERY ran: ${r.quarantines.length} tear(s) quarantined, ${r.rowsLedgered} row(s) ledgered (D-432)`);
    }).catch((err) => {
      ctx.log(`vivim.vault: recovery walk FAILED on boot — ${String(err instanceof Error ? err.message : err)} (D-432)`);
    });
  },
  onShutdown() {
    vault?.close();
    vault = null;
  },
  ops: {
    "vault.append@1": (payload, _ctx, meta) => {
      const p = requireObject("vault.append@1", payload);
      const ns = requireName("vault.append@1", "ns", p.ns);
      const id = requireName("vault.append@1", "id", p.id);
      if (p.data === undefined) throw new Error("vault.append@1: data is required");
      if (p.meta !== undefined && p.meta !== null && (typeof p.meta !== "object" || Array.isArray(p.meta))) {
        throw new Error("vault.append@1: meta must be an object when provided");
      }
      const refs = requireRefs("vault.append@1", p.refs);
      const causationId = requireName("vault.append@1", "causationId", meta?.causationId);
      const v = mustOpen();
      return v.enqueueWrite(() => appendObject(v, { ns, id, data: p.data, meta: p.meta ?? null, refs, causationId }));
    },

    "vault.get@1": (payload) => {
      const p = requireObject("vault.get@1", payload);
      const ns = requireName("vault.get@1", "ns", p.ns);
      const id = requireName("vault.get@1", "id", p.id);
      const rev = optionalInt("vault.get@1", "rev", p.rev, 1);
      return readObject(mustOpen(), ns, id, rev);
    },

    // D-387 (perf review #1): one port round trip for a bounded batch of latest-rev
    // reads — the mind's per-namespace window was 1 query + up to 200 sequential
    // gets, every 500ms, on every console. Fail-closed payload validation:
    // duplicates collapse to distinct ids; over-bound REFUSES (→ DEGRADED).
    "vault.getmany@1": (payload) => {
      const p = requireObject("vault.getmany@1", payload);
      const ns = requireName("vault.getmany@1", "ns", p.ns);
      if (!Array.isArray(p.ids) || p.ids.some((id: unknown) => typeof id !== "string" || id.length === 0)) {
        throw new Error("vault.getmany@1: ids must be an array of non-empty strings");
      }
      const ids = p.ids as string[];
      const distinct = new Set(ids);
      if (distinct.size > GET_MANY_BOUND) {
        throw new Error(`vault.getmany@1: ${distinct.size} distinct ids exceeds the ${GET_MANY_BOUND} bound — page through vault.query@1 + repeated batches`);
      }
      return readObjects(mustOpen(), ns, ids);
    },

    "vault.query@1": (payload) => {
      const p = requireObject("vault.query@1", payload);
      const ns = requireName("vault.query@1", "ns", p.ns);
      const filter = p.filter === undefined || p.filter === null ? {} : requireObject("vault.query@1 filter", p.filter);
      const idPrefix = filter.idPrefix === undefined || filter.idPrefix === null ? null : requireName("vault.query@1", "filter.idPrefix", filter.idPrefix);
      const minRev = optionalInt("vault.query@1", "filter.minRev", filter.minRev, 0);
      return queryObjects(mustOpen(), ns, { idPrefix, minRev });
    },

    "vault.search@1": (payload) => {
      const p = requireObject("vault.search@1", payload);
      const ns = requireName("vault.search@1", "ns", p.ns);
      if (typeof p.q !== "string" || p.q.length === 0) throw new Error("vault.search@1: q must be a non-empty string");
      return searchObjects(mustOpen(), ns, p.q);
    },

    "vault.verify@1": () => verify(mustOpen()),

    "vault.compact@1": (payload) => {
      const p = requireObject("vault.compact@1", payload);
      const v = mustOpen();
      // D-432: the plan-driven path when planRef is present (dry-run-first,
      // referenced-blob guard, receipt row); the legacy (ns, keep) shape keeps
      // its protective-skip semantics for compatibility (as-built note 6).
      if (p.planRef !== undefined && p.planRef !== null) {
        const ref = requireObject("vault.compact@1 planRef", p.planRef);
        const ns = requireName("vault.compact@1 planRef", "ns", ref.ns);
        const keep = requireInt("vault.compact@1 planRef", "keep", ref.keep, 1);
        const censusDigest = requireName("vault.compact@1 planRef", "censusDigest", ref.censusDigest);
        return v.enqueueWrite(() => compactGuarded(v, { ns, keep, censusDigest }));
      }
      const ns = requireName("vault.compact@1", "ns", p.ns);
      const keep = requireInt("vault.compact@1", "keep", p.keep, 1);
      return v.enqueueWrite(() => compact(v, ns, keep));
    },

    "vault.compact.dryrun@1": (payload) => {
      const p = requireObject("vault.compact.dryrun@1", payload);
      const ns = requireName("vault.compact.dryrun@1", "ns", p.ns);
      const keep = requireInt("vault.compact.dryrun@1", "keep", p.keep, 1);
      const v = mustOpen();
      return v.enqueueWrite(() => compactDryrun(v, ns, keep));
    },

    "vault.recover@1": () => {
      const v = mustOpen();
      return v.enqueueWrite(() => recoverVault(v));
    },

    "vault.migrate.dryrun@1": (payload) => {
      const p = requireObject("vault.migrate.dryrun@1", payload);
      const toVersion = optionalInt("vault.migrate.dryrun@1", "toVersion", p.toVersion, 0) || undefined;
      const v = mustOpen();
      return v.enqueueWrite(() => migrateDryrun(v, { toVersion }));
    },

    "vault.migrate@1": (payload) => {
      const p = requireObject("vault.migrate@1", payload);
      const toVersion = optionalInt("vault.migrate@1", "toVersion", p.toVersion, 0) || undefined;
      const v = mustOpen();
      return v.enqueueWrite(() => migrate(v, { toVersion }));
    },

    "vault.export@1": (payload) => {
      const p = requireObject("vault.export@1", payload);
      if (!Array.isArray(p.namespaces)) throw new Error("vault.export@1: namespaces must be an array of {ns, retention}");
      const scopes: ExportScope[] = p.namespaces.map((s: unknown, i: number) => {
        const o = requireObject(`vault.export@1 namespaces[${i}]`, s);
        return { ns: requireName(`vault.export@1 namespaces[${i}].ns`, "ns", o.ns), retention: requireName(`vault.export@1 namespaces[${i}].retention`, "retention", o.retention) };
      });
      return exportVault(mustOpen(), scopes);
    },

    "vault.import@1": (payload) => {
      const p = requireObject("vault.import@1", payload);
      const targetDir = p.targetDir;
      if (typeof p.archive !== "object" || p.archive === null) throw new Error("vault.import@1: archive is required (a vault.export@1 result)");
      return importVault(targetDir, p.archive);
    },

    "vault.roundtrip@1": (payload) => {
      const p = requireObject("vault.roundtrip@1", payload);
      const targetDir = p.targetDir;
      const v = mustOpen();
      return v.enqueueWrite(() => roundtrip(v, targetDir)); // write queue → consistent snapshot
    },
  },
}));
