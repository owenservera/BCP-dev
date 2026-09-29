# WS-4 — Reconciliation & Hygiene

> Status: **ACTIVE** — owner "Begin" 2026-09-29 adopts the Steward recommendations (BQ-7:
> Steward owns the reconciliation; BQ-8: pass runs ahead of WS-3). Items 1 and 3 in flight;
> item 2's per-class decisions (commit/park/delete the 13 untracked entries) remain owner calls.
> Owner: STEW-01 · ratified by owner
> Serving workflows: `omega-verify` (closure), `omega-reality-check` (re-check)

## Purpose

Make the queues truthful and every file owned, so the dashboard (WS-3) renders reality instead
of drift. Evidence: sweep findings — seven queue entries claiming `PENDING-STEWARD-COMMIT` for
already-committed work (commits 119c9f13, a80cc232, e18c2005, e1818205); Board P3 (rejected as
tabled) surfaced 13 untracked entries with no owner and 10 commits since 2026-09-28 touching
neither queue file.

## Entry questions (owner)

- **BQ-7** Who owns the unowned reconciliation? The 13 untracked entries: five OS phase specs,
  `docs/Reality-engine/`, a 738 KB worktree zip, a `.bundle`, `local-team.md`, a session
  transcript, `OmegaBuildBootstrap.txt`, `.zcodeignore`. [Recommendation: Steward]
- **BQ-8** Queue-reconciliation pass next, ahead of the dashboard?
  [Recommendation: yes]

## Backlog

| # | Item | Notes |
|---|---|---|
| 1 | Queue-reconciliation pass: align the seven PENDING-STEWARD-COMMIT entries and the CFA-01/06/10 routing headers to committed reality | sweep findings (verified) |
| 2 | Assign each of the 13 untracked entries: commit as evidence, park with an owner, or delete with lineage note | owner decides per class; zip/bundle likely park-or-ignore |
| 3 | Commit `.zcode/` (team charter, board charter, workflows, workstreams) | closes the sweep's HIGH drift finding on our own charter |
| 4 | Re-run `omega-reality-check` queues lens; require zero confirmed high/medium queue drift | closure evidence |

## Exit criteria

Every file tracked or queue-owned; fresh sweep shows zero confirmed high/medium drift in the
queues and working-tree areas; receipts committed.
