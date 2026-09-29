# Workstreams — standing lanes of the Ω build

> Status: ACTIVE · set up 2026-09-29 (fork session)
> Authority: this index organizes work; it is not itself Ω law. Backlogs here cite their
> evidence sources (sweep findings, board minutes, repository documents). The owner ratifies
> entry and exit.

## Lifecycle

- **PROPOSED** — defined, not yet owner-ratified. No execution capacity spent.
- **ACTIVE** — owner-ratified; execution in flight via the serving workflows.
- **BLOCKED-EVIDENCE** — an owner question or missing evidence gates entry (never silently parked).
- **CLOSED** — exit criteria met and verified (`omega-verify`-style), with lineage to the
  session/receipt that closed it.

Rules: one lane per concern; a work item joins exactly one workstream; every backlog item
carries its evidence source; reordering requires a Board proposal or direct owner instruction.

## Index

| ID | Name | Owner officer | Status | Entry gate |
|---|---|---|---|---|
| [WS-1](WS-1-truth-repair.md) | Truth Repair (gates + corpus) | DELIVERY-01 | PROPOSED — recommended first | owner go |
| [WS-2](WS-2-commons-bootstrap.md) | Commons Bootstrap | STEW-01 | BLOCKED-EVIDENCE | owner answers BQ-1…BQ-3 |
| [WS-3](WS-3-dashboard-v1.md) | Team Dashboard v1 (control panel) | DELIVERY-01 (build) · CEO-01 (scope) | BLOCKED-EVIDENCE | WS-2 + owner answers BQ-4…BQ-6 |
| [WS-4](WS-4-reconciliation.md) | Reconciliation & Hygiene | STEW-01 | BLOCKED-EVIDENCE | owner answers BQ-7…BQ-8 |
| [WS-5](WS-5-core-build.md) | Ω Core Build (flagship) | CEO-01 (sequence) · DELIVERY-01 (execute) | PROPOSED | owner names the first lane |

Dependency notes: WS-4 before WS-3's UI renders queues (else the dashboard lies); WS-2 before
WS-3 (the dashboard is a Commons client); WS-1 is independent and runs in parallel; WS-5 is the
mission everything serves.
