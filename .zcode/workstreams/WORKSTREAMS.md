# Workstreams — standing lanes of the Ω build

> Status: ACTIVE · set up 2026-09-29 (fork session)
> Authority: this index organizes work; it is not itself Ω law. Backlogs here cite their
> evidence sources (sweep findings, board minutes, repository documents). The owner ratifies
> entry and exit.

## Lifecycle

- **PROPOSED** — defined, not yet executed. Capacity is spent only when the serving workflow starts.
- **ACTIVE** — execution in flight via the serving workflows.
- **TEAM-DECIDED** — running on team decisions from the [decision ledger](../board/DECISIONS.md)
  (formerly "waiting for the owner"). **Effective immediately**; the owner may override any entry
  at any time, and an override re-routes the lane — silence means the decision stands.
- **BLOCKED-EVIDENCE** — **evidence** is missing (a file, a measurement, a gate result). Never
  used for a missing human answer: those are decided by the team per
  [../DECISIONS-POLICY.md](../DECISIONS-POLICY.md).
- **CLOSED** — exit criteria met and verified (`omega-verify`-style), with lineage to the
  session/receipt that closed it.

Rules: one lane per concern; a work item joins exactly one workstream; every backlog item
carries its evidence source; reordering requires a Board decision (or an owner override).

## Index

| ID | Name | Owner officer | Status | Entry gate |
|---|---|---|---|---|
| [WS-1](WS-1-truth-repair.md) | Truth Repair (gates + corpus) | DELIVERY-01 | ACTIVE — items 1–6 landed (4/5: run dwfrun-ca04737e, commit 08ddf708); exit pending fresh sweep + verify receipts | gate: `omega:quick` green |
| [WS-2](WS-2-commons-bootstrap.md) | Commons Bootstrap | STEW-01 | ACTIVE (TEAM-DECIDED D-001…003) | none — bootstrap authorized now |
| [WS-3](WS-3-dashboard-v1.md) | Team Dashboard v1 (control panel) | DELIVERY-01 (build) · CEO-01 (scope) | ACTIVE after WS-2 (TEAM-DECIDED D-004…006) | WS-2 smoke exchange |
| [WS-4](WS-4-reconciliation.md) | Reconciliation & Hygiene | STEW-01 | ACTIVE — items 1/2/3 done (TEAM-DECIDED D-014) | item 4: fresh sweep |
| [WS-5](WS-5-core-build.md) | Ω Core Build (flagship) | CEO-01 (sequence) · DELIVERY-01 (execute) | **ACTIVE — Wave 1 COMPLETE: both corridors landed.** Corridor 1 `forge-mine-capture` (`16f95419`); corridor 2 `forge-mine` READ siblings, adopted + landed under D-TEAM-020 (`5475a57b`, `766b6d92`). `omega:quick` exit 0, hostLoc 1500 | next is **not a corridor** — it is the D-409 SF2 decision (gap G-03 / task T-19), which blocks `forge-survey` entirely. All three resolutions collide with a frozen rule |

Dependency notes: WS-4's sweep runs before WS-3's UI renders queues (else the dashboard lies);
WS-2 before WS-3 (the dashboard is a Commons client); WS-1 is independent and runs in parallel;
WS-5 is the mission everything serves.
