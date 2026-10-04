# D-432 — Vault durability: two-phase append, torn-tail quarantine, migration rehearsal, guarded compaction, chain-preserving export

## Status

RATIFIED

## Context

- The Ω-0.5 spec (`D-455`, the reserved paper id — the upgrade doc
  `omega-upgrades/OMEGA-0.5-VAULT-DURABILITY.md`) names the second critical
  foundation gap: **the vault survives the machine's failures, and proves it**.
  Gap scenarios #9 (power cut mid-write), #11 (schema migration dry-run),
  #15 (compaction preserving the merkle chain), #19 (selective namespace
  export). The genome carries Ω-0.5 as queued behind Ω-0 — hermetic bootstrap
  landed as D-431, so durability can now be rehearsed on a ground that can be
  wiped and re-proven.
- The one invariant this record exists to protect: **an append-only log that
  corrupts on crash is a lie with a merkle root.** Today the vault rides
  SQLite's WAL, which gives atomic *transactions* — a torn transaction rolls
  back — but the rollback is SILENT: the machine lost a write and the system
  whose entire identity is "every anomaly is ledgered or refused" says nothing.
  The fold is never corrupted, but the loss is unaccounted. Silent is the
  death sentence the spec names: the first unlogged mutation in a log whose
  identity is "no unlogged mutations."
- Recon facts that shape the mechanism: `changelog.ts` is the single append
  path (CAS → objects → FTS → merkle link, one IMMEDIATE transaction inside
  the single-writer queue); `compaction.ts` moves hot→cold and honors refs but
  has no dry-run plan, no mechanical referenced-blob refusal, and no receipt
  row — the D-410 item-C invariant ("compaction never deletes a revision,
  period") is remembered, not enforced; no migration mechanism exists; no
  export exists ("give me only ns `chat` on this drive" is either everything
  or a subset without its chain); `verify.ts` is the merkle walk that any
  recovery must leave green.
- Sole-writer namespaces are the constitutional vault's discipline; this
  record registers three kernel namespaces (recovery, migrate, compact) with
  their retention laws, in `docs/VAULT-NAMESPACES.md` via the integration
  manifest (the shared-file law: this record names them, the landing commit
  adds the rows).

Blocks: none

## Options

| Criterion | (a) two-phase append journal + recovery/migration/compaction/export ceremonies in the vault spine | (b) trust SQLite alone; durability = backup tooling and manual migrations | (c) defer crash recovery to the Ω-8 rehearsal engine |
|---|---|---|---|
| Torn writes are ledgered, not silent | Yes — every durable append is intent→data→commit; a present intent without commit is quarantined with a refusal-shaped row, verbatim bytes preserved content-addressed | No — SQLite rolls back silently; the loss is unaccounted; "repair and hope" tooling rewrites during a panic | No — rehearsal injects failures but is advisory; the spine still lacks the discipline to be rehearsed |
| Schema evolution without archaeology | Yes — migrations are dry-run-first versioned functions; execute refuses without a ledgered plan row and a cited, resolvable rollback point | No — break-everything rewrites violate append-only; frozen legacy violates evolvability | No |
| D-410 item C mechanically enforced | Yes — the plan-driven compaction recomputes the reference census and refuses VAULT_COMPACTION_REFERENCED_BLOB before touching anything; the receipt is ledgered | No — the invariant lives in prose and review | Partially — a test can check it, but the op itself never refuses |
| Selective export that can prove itself | Yes — the archive carries the namespace's chain segment, its blobs, badges, and retention manifest; import verifies the segment before any merge | No — row dumps without chain segments are gift boxes of claims | No |
| Backward compatible, zero host LOC, no new deps | Yes — the append path keeps its signature and fold; new modules + ops in `plugins/vivim-vault`; existing tests stay green | Yes | Yes |

## Decision

**Decision:** (a) — the durability spine in `plugins/vivim-vault`, in substance:

- **Two-phase append (wal.ts + changelog.ts).** Every durable append is now
  three ordered writes: (1) an `append.intent` line — `{rowHash, byteRange,
  namespace}` in the spec's vocabulary, realized as the full predicted link
  (seq/rev/cid/prevHash/entryHash, all computable before the transaction
  because the single-writer queue serializes prediction) — appended to the
  intent journal `<dataDir>/wal/intents.jsonl` and fsynced BEFORE the data
  write; (2) the data transaction (CAS → objects → FTS → merkle link, the
  unchanged body, which refuses if the committed link drifted from the
  prediction — a void intent is never silently folded); (3) an `append.commit`
  line `{intentRef, fsyncProof}` fsynced after. A reader treats
  intent-without-commit as UNCOMMITTED — it never enters the fold. The
  journal is an append-only byte file: byte ranges are real, tears are real
  bytes, and the newline is part of the record (a final line without its
  terminator is uncommitted by construction).
- **The crash-recovery ceremony — `vault.recover@1` (durability.ts).** Walk
  the journal tail. A complete intent+commit pair survived. A torn or
  commit-less tail is QUARANTINED: the byte range is moved (verbatim,
  content-addressed under `<dataDir>/quarantine/`, with a sidecar carrying
  the row it owes) out of the live journal into the quarantine zone, and a
  `vault.recovery` row is appended citing the byte range, the quarantine
  hash, and the preceding committed chain head. Where SQLite proves the data
  committed (the changelog contains the predicted link) the fold KEEPS the
  data — deleting a provably-committed revision would be the actual crime —
  and the recovery row records the torn accounting. Never reconstruction,
  never silent truncation: the torn bytes are preserved and named, the fold
  resumes from the last committed row. Recovery is idempotent and
  self-healing (an interrupted recovery completes its own unledgered rows
  from the sidecars); an artifact with no sidecar and no row refuses
  VAULT_RECOVERY_UNLEDGERED. The plugin's onInit runs the walk on every boot
  (a clean journal is a no-op).
- **Schema migration — `vault.migrate.dryrun@1` / `vault.migrate@1`
  (migrate.ts).** Migrations are versioned functions `schema.v<N>→v<N+1>` in
  a registry, each with a READ-only census (rows counted, namespaces named)
  and an idempotent apply. Dry-run is law: execute refuses
  VAULT_MIGRATION_REQUIRES_DRYRUN without a prior ledgered plan row, and
  VAULT_MIGRATION_ROLLBACK_UNCITED when the plan's rollback point does not
  resolve (history is the backup — the rollback point is a ledgered version
  row; v1's implicit genesis is stamped explicit at first migration so every
  rollback point cites a real row). Migrations append version rows and never
  rewrite history: old-shape rows verify forever under their mint-time
  schema (the merkle walk recomputes their bytes identically). The first
  real migration ships here: v1→v2 adds the `vault_meta` table (the
  version/mint-time substrate later waves need).
- **Compaction dry-run + guard — `vault.compact.dryrun@1` and the plan-driven
  path of `vault.compact@1` (compaction.ts).** The census (every live row's
  content-addressed dependencies) produces a ledgered plan: blobs eligible,
  blobs excluded (referenced — always), space estimate, census digest. The
  plan-driven execute recomputes the census and refuses
  VAULT_COMPACTION_REFERENCED_BLOB if the plan touches any referenced blob
  (D-410 item C, enforced by the machine, before any mutation); a stale plan
  refuses loudly. The legal execute moves eligible revisions hot→cold
  (never deletes), drops their FTS rows, and ledgers the receipt row
  (counts, census digest, reclaimed bytes, receipt hash) in
  ns `vault.compact`. The merkle chain never changes.
- **Chain-preserving export & verified import — `vault.export@1` /
  `vault.import@1` (export.ts).** Export is namespace-scoped and refuses
  VAULT_EXPORT_SCOPE_UNNAMED unless every namespace is named WITH its
  retention rule (an export without a forgetting law is a leak waiting to
  happen). The archive carries the namespace's chain segment (rows + linkage
  + segment head), its object revisions, its CAS blobs byte-faithfully, its
  badges (per-ns chain seal) and retention manifest, and any quarantine
  artifacts its `vault.recovery` rows cite — and it refuses to exist unless
  it verifies against itself. Import verifies the segment BEFORE merging
  (VAULT_IMPORT_CHAIN_MISMATCH on any divergence, on a mid-chain segment
  whose prefix it would have to fabricate, or on a non-empty target — no
  cross-vault sync semantics, by the spec's own refusal), then inserts rows
  and blobs verbatim, rebuilds FTS, and runs the full merkle walk green.
- **Ops** (risk-honest): `vault.recover@1` MUTATION (kernel ceremony — also
  automatic on boot); `vault.migrate.dryrun@1` and `vault.compact.dryrun@1`
  MUTATION (READ-only over schema and object rows; their only write is their
  own ledgered plan row — the ledger is the vault's only write verb);
  `vault.migrate@1` and `vault.import@1` EXTERNAL_MUTATION (schema change;
  merge into a caller-named fresh vault dir); `vault.export@1` READ (returns
  the archive; persisting it is the caller's external act).

## Consequences

- The vault can lose power mid-write, watch the disk tear the tail of its own
  ledger, and recover into a state that is byte-honest about exactly what
  survived: zero corrupted folds, every tear a ledgered refusal-shaped row,
  the fold exactly the committed rows. Ω-1's watch atoms get a spine that
  survives crashes; Ω-8's rehearsal engine gets a crash-injection script
  worth rehearsing; decade-scale vaults become maintainable (compaction with
  receipts, migration with rollback points, export with forgetting laws).
- **As-built notes, stated plainly:** (1) the fsync discipline is real (each
  journal line is written and fsynced through a filehandle sync) but the
  `fsyncProof` field is a *binding hash* (intent byte-range → commit), not a
  filesystem receipt — a portable post-sync fsstat receipt does not exist and
  is not claimed. (2) SQLite's own durability boundary is unchanged:
  `synchronous=NORMAL` in WAL mode (the D-373 parity block) — commits survive
  process crash; power-loss hardening of the SQLite side rides checkpoint
  cadence, deliberately not re-tuned here (the D-378/D-387 perf baselines
  stay honest). The two-phase journal is what makes the ACCOUNTING
  crash-honest. (3) The recovery walk reads the whole journal file (linear
  in appends, compact relative to the DB); tail-windowing is a named deferral
  for the first vault that needs it. (4) Import merges genesis segments into
  fresh vaults only — a segment starting mid-chain refuses rather than
  fabricating its prefix; multi-vault interleaved-namespace sync is refused
  by the spec and by this code. (5) Export encryption is a keyRef
  pass-through: Trust Mesh (Ω-4) does not exist yet, so no key management is
  claimed or performed. (6) The legacy `vault.compact@1` shape (ns + keep,
  protective skip) is preserved for compatibility — its receipt law rides
  the plan-driven path; migrating the legacy call sites is a later wave's
  amendment. (7) The boot chain's `cleanShutdown` field (spec §3.2) is not
  wired to Ω-0's receipts yet — recovery runs its walk on every boot, which
  is a no-op on a clean journal and correct on an unclean one; the flag
  integration is deferred to the boot-ceremony amendment.
- Roundtrip (swap harness) now copies the quarantine zone with the fold, so
  a copy's recovery rows keep their evidence — the journal deliberately does
  NOT ride along (it is the in-flight protocol, not history; the changelog
  is the truth).
- Zero host LOC; no new dependencies; all new code under
  `plugins/vivim-vault/src` (node builtins + the existing seam modules);
  existing vault tests stay green (the append path's signature, fold, and
  driver-conformance digest are unchanged).

## Evidence

- Falsifiers, green in this record's tree BEFORE the flip per `D-364`
  (`omega:loop --stub D-432` generates the RED stub this list resolves to):
  - `F-DURABILITY.1` (chaos-append) — 100 randomized torn appends: zero corrupted folds, every tear quarantined as a ledgered refusal-shaped row, the fold sees exactly the committed rows
  - `F-DURABILITY.2` (migration-rehearsal) — a real schema change lands only through dry-run first; old-shape rows still verify under their mint-time schema; rollback points are ledgered
  - `F-DURABILITY.3` (compaction-guard) — a compaction plan touching a referenced blob refuses VAULT_COMPACTION_REFERENCED_BLOB; a legal compaction leaves merkle verification green
  - `F-DURABILITY.4` (export-import) — namespace-scoped export → wipe → import on a fresh vault: chain verifies, badges + retention carried
  - `F-DURABILITY.5` (headless) — the whole ceremony is daemon/CLI-only, zero canvas dependency
  - `F-DURABILITY.6` (loud-failure) — zero silent truncation/reconstruction paths: every recovery decision is a ledgered row or a named refusal
- Files: `plugins/vivim-vault/src/wal.ts` (the intent journal: two-phase line
  writes with fsync, the walk, the quarantine zone), `src/durability.ts`
  (recoverVault, auditRecovery), `src/migrate.ts` (registry, dry-run law,
  rollback citation, the real v1→v2), `src/export.ts` (archive build/verify,
  import), `src/compaction.ts` (census, plan, guard, receipt),
  `src/changelog.ts` (appendObject → two-phase), `src/index.ts` + `plugin.json`
  (six new ops + onInit recovery), `src/roundtrip.ts` (quarantine copy),
  `tooling/gates/test/f-durability.test.ts` (the falsifier), and an
  integration case for the new ops.
- Refusal register (exact): VAULT_TORN_TAIL_QUARANTINED ·
  VAULT_MIGRATION_REQUIRES_DRYRUN · VAULT_MIGRATION_ROLLBACK_UNCITED ·
  VAULT_COMPACTION_REFERENCED_BLOB · VAULT_EXPORT_SCOPE_UNNAMED ·
  VAULT_IMPORT_CHAIN_MISMATCH · VAULT_RECOVERY_UNLEDGERED — each fires with
  its spec sentence.
- Namespace rows (integration manifest for `docs/VAULT-NAMESPACES.md`, the
  shared-file law): `vault.recovery` (kernel, the recovery ceremony, forever,
  quarantined torn tails verbatim) · `vault.migrate` (kernel, the migration
  op, forever, dry-run plans + version rows + rollback points) ·
  `vault.compact` (kernel, the compaction op, compact-shred-90d, tombstone
  zone: plan + receipt rows, 90-day shred of moved blobs, rows forever).
- Precedents: spec `D-455` (Ω-0.5 — the §10 record text this tree record
  translates); `D-431` (Ω-0 — the proven ground crash recovery rehearses on);
  `D-410` (item C — the never-delete invariant this mechanizes);
  `D-373`/`D-378`/`D-387` (the driver seam and perf baselines the append
  path must not regress); `D-426` (the falsifier-first loop this record
  rides); `D-428` (the law-committed/memory-local boundary the quarantine
  zone's evidence discipline follows); `D-364` (evidence-class ratification).


- Ratified on greens (evidence-class, F-DURABILITY.1-6 green in this record's tree BEFORE the flip per D-364): landing commit 362c690; full gate green 1278/0 ×2 on the PROPOSED tree (2026-09-21T04:20:10Z and 04:25Z; the prior tip's 1253 + 25 new); zero host LOC; anvil untouched.

## Index

summary: plugins/vivim-vault gains the durability spine: two-phase append (fsynced intent and commit journal lines around the data transaction), torn-tail quarantine as ledgered refusal-shaped vault.recovery rows, dry-run-first schema migration with cited rollback points, census-guarded compaction with receipts, and namespace-scoped chain-preserving export with verified import
rationale: An append-only log that corrupts on crash is a lie with a merkle root: SQLite rolls a torn transaction back silently, but the constitution requires every anomaly to be a ledgered row or a named refusal - durability is a property the system proves about itself, not one the filesystem happens to grant (the Ω-0.5 vault-durability upgrade spec)
class: evidence
