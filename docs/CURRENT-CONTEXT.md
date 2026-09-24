# CURRENT-CONTEXT.md — operational truth map (2026-09-23 cleanup)

A map, not a constitution. Each row: present truth → its authority → its evidence.
If anything here contradicts a linked authority, the authority wins and this file
needs a patch.

## Board and lanes

| Truth | Authority | Evidence |
|---|---|---|
| Board parked: 0 active leases, validate 0/0 | `bcp_tool.py show/available`, `validate.py` | `state/leases.yaml` (8 records, all closed) |
| EXP-004/005 MERGING at L2 (fixture-proven, NOT live-proven, NOT integrated) | `docs/CONTEXT-product.md` §3–§4 | `workspaces/` task RESULTs; lane `work/` suites re-run externally |
| EXP-006 proposed, gate OPEN, c1 unspawned | `docs/CONTEXT-appendix.md` §3 | `available --experiment EXP-2026-006` → FAM-09.1 |
| Lane first-lease sequences + 2026-09-22 inbox entries are PARKED history | inbox banners; `agents/lanes.md` banner | live state shows nothing leasable in 004/005 |
| Coordinator re-issues directives before any resume | `agents/coordinator.md`, `MY-LOOP.md` | — (procedure, not event) |

## Migration machinery

| Truth | Authority | Evidence |
|---|---|---|
| Record schema + checker + `index.json` registry = current machinery | `docs/migration/MIGRATION_MODEL.md` | MIG-001 + MIG-002 VERIFIED, `verify_migration.py` green |
| `state/migrations.yaml` + sweep guards: explicitly DEFERRED | `docs/migration/MIGRATION_COMPARISON_001_002.md` | decision recorded, not an omission |
| MIG-001/MIG-002 verdicts: INTENTIONALLY_TRANSFORMED; live UNVERIFIED | `bcp-speed/bcp/migration/index.json` | verification-reports in each record dir |
| Next: #3 Gemini (completes triangle), then first non-provider slice | `docs/migration/MIGRATION_GRAPH.md` | — (plan, not fact) |

## Destination law (Ω)

| Truth | Authority | Evidence |
|---|---|---|
| Present-day law = synthesis page | `omega-…/docs/decisions/CURRENT-INVARIANTS.md` (pass 7, as-of D-431) | gate `invariants-freshness` stage |
| Full audit trail = append-only index + records | `omega-…/docs/BUILD-DECISIONS.md` + `docs/decisions/D-NNN-*.md` | `bun run omega:decisions` |
| Host ≤1500 LOC (zero headroom); 18-spec matrix; Chrome-only v1 | CURRENT-INVARIANTS.md (B5, D-420, D-418/D-456) | `bun run omega:gate` |
| Forge backlog = live sequencing | `omega-…/docs/forge/BACKLOG.md` | round-close derivations |

## Explicitly historical (do not build from)

- `ORCHESTRATION-REDESIGN.md` (plan; Tasks 1–6 executed) · `setupdocs/01–03`
  (executed prompts) · `setupdocs/04–05` (superseded entry drafts) ·
  `TRACKER.md` time-bound orders (snapshot; state confirmed by appendix §3–§4) ·
  Ω `docs/migration/00-ASSESSMENT/10-WAVE0/20-WAVES` pre-09-16 docs (stale per
  migration README) · forge `HANDOFF-ROUND-*`, `OMEGA-FORGE-ARCHITECTURE*`
  (construction material, bannered) · everything under `docs/archive/`.

## Explicitly unresolved

- C-bridge economics (God-Adapter / parity-tar-pit guards: sunset clause, 3–5 cap)
- Prisma model-count reconciliation (201 claimed vs ~400 blocks counted)
- b1's formal b2-consumption word; 004's `omega:gate`-at-tip check
- Hands-off surfaces — do not touch without the owner: untracked `bcp-algos/`,
  `setupdocs.zip`; tracked-but-unratified Ω `docs/architecture/`,
  `examples/plugin-echo2/` (see `docs/cleanup/CONFLICT-REGISTER.md` C11/C13);
  untracked `docs/REPO-CLEANUP-PROMPT-V2.md` (UNKNOWN triage pending owner).
- Prompt 4 INTERRUPTED (not complete): checkpoint + per-file dispositions in
  `docs/cleanup/PROMPT-4-CHECKPOINT.md`; resumption status C13 in CONFLICT-REGISTER.
- Canonical plugin-authoring path: `docs/cleanup/PLUGIN-BUILDER-ARCHITECTURE.md`
  (pack.builder → forge.author → builder composition → surface); `sdk/` = internal
  pre-boot anvil, NOT a developer SDK (see `docs/cleanup/SDK-ANVIL-ACCOUNTING.md`).

## Next agent reads (in order)

1. `/AGENTS.md` → `/BUILD_CONTEXT.md` → this file.
2. Area authority from the tables above (no other doc).
3. `docs/cleanup/CONFLICT-REGISTER.md` only if touching a listed conflict.
