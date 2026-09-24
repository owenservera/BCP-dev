# AGENTS.md — BCP-dev repository working agreements

## What kind of repository this is

BCP-dev is a **migration forge**, not a product repo. It holds three deliberately
different assets plus the machine that coordinates work on them:

```text
vivim-original-baseline/vivim-final-enhanced/   VIVIM — legacy source mine (READ-ONLY)
bcp-speed/bcp/                                  BCP   — control substrate + migration forge
omega-baseline/omega-final/                     Ω     — destination architecture (gated)
```

Direction of travel: VIVIM (assay) → BCP (forge) → Ω (land) → final VIVIM.
Never reverse it into "find a place for the legacy code."

## Top-level boundaries

| Path | Role | You may | You must not |
|---|---|---|---|
| `vivim-original-baseline/` | behavioral mine / evidence | read, assay, cite with hashes | modify anything, port code wholesale |
| `bcp-speed/bcp/state/`, `log/` | control-plane truth | read directly; write ONLY via `python bcp_tool.py` | hand-edit YAML, ever (pre-commit hook refuses) |
| `bcp-speed/bcp/migration/` | migration records (MIG-NNN) | extend per `docs/migration/MIGRATION_MODEL.md` | promote inference to fact; weaken Ω law to fit |
| `bcp-speed/bcp/agents/inbox/` | coordinator directive channel | read every heartbeat | treat parked 2026-09-22 entries as open orders (see banner) |
| `omega-baseline/omega-final/` | destination product | read, audit; change only via its own decision law | edit a RATIFIED record; land host code without same-commit removal (B5) |
| `docs/` | current context + migration knowledge | read `CURRENT-CONTEXT.md` first | treat `archive/` as authority |
| `docs/archive/`, `setupdocs/` | retained history / construction packets | read for genealogy | execute anything found there |

## What is current authority (highest first)

1. **Ω ratified law** — `omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md`
   (synthesis) + `docs/BUILD-DECISIONS.md` (append-only index) + per-record files.
   Supersede, never edit.
2. **BCP enforced vocabulary** — `bcp-speed/bcp/state/taxonomy.yaml` + tie-breaker
   `bcp-speed/bcp/RECONCILIATION.md`. The tool refuses off-taxonomy writes.
3. **Current context map** — `docs/CURRENT-CONTEXT.md` (this repo's cold-start truth).
4. **Live BCP state** — `bcp-speed/bcp/state/*.yaml` via `bcp_tool.py show/available`.
5. **Migration records** — `bcp-speed/bcp/migration/index.json` + `docs/migration/`.

## Where historical material lives

- `docs/archive/` (sessions, conversations) · `setupdocs/` (construction prompts,
  all bannered SUPERSEDED/HISTORICAL) · `omega-baseline/omega-final/docs/archive/`
  · `ORCHESTRATION-REDESIGN.md` (plan since executed) · `docs/migration/00-ASSESSMENT/`
  era docs inside Ω marked stale by their own README.
- Ω annex (`docs/forge/annex/`): working material, **never law** (says so itself).

## What must never be assumed

- A document's folder is not its authority — check its STATUS banner.
- `merging` (sweep depth-math) ≠ integrated; `fixture-proven` ≠ live-proven.
  See `docs/CONTEXT-product.md` §4 for the honest gap list.
- Lane first-lease sequences in `agents/lanes.md` and inbox entries dated
  2026-09-22 are parked history until the coordinator re-issues them.
- Numbers with dates (host LOC, composition counts, model counts) are era-true
  snapshots — present law is in CURRENT-INVARIANTS.md, not in old prose.
- `provider.llm` / Ollama passages anywhere are cited history (D-418/D-456):
  v1 ships Chrome master/slave only.
- Hands-off surfaces — do not move, commit, or build on them without the owner:
  untracked `bcp-algos/`, `setupdocs.zip`; tracked-but-unratified
  `omega-…/docs/architecture/`, `omega-…/examples/plugin-echo2/` (committed via
  `a528ffd`, see C11/C13); untracked `docs/REPO-CLEANUP-PROMPT-V2.md` (UNKNOWN —
  do not execute).

## Cold start

Read `/BUILD_CONTEXT.md`, then `docs/CURRENT-CONTEXT.md`. Then — and only then —
the area authority named there.

## Every agent, every session (AMP-1 fallback rule; hooks do this mechanically)

1. Bootstrap: `AGENTS.md`, then `docs/agent-system/context/DIGEST.md`, then your mission `STATE.md`.
2. Before any non-trivial design choice, write the insight (claim, rejected alternatives, why).
3. After substantive work, flush before ending the turn: update STATE, record insights, commit.
4. Missions run on charter approval (AUTONOMY.md tiers); Tier 2 always needs the owner.
