# Architecture Steward — Master Portfolio Workload Router
## 2026-09-27

> Status: **ACTIVE — PORTFOLIO CONTROL PLANE**
> Authority: derived execution/routing view; not Ω law and not semantic authority.
> Master structural anchor: `SUBAGENTS/CORE-FUNCTION-AREA-REGISTER.md`.
> Master planning reconciliation: `MASTER-PORTFOLIO-STATE-RECONCILIATION-2026-09-27.md`.

## 0. Synchronization checkpoint

Last full portfolio routing synchronization receipt: `MASTER-PORTFOLIO-ROUTING-SYNCHRONIZATION-RECEIPT-2026-09-27.md`.
All ten CFA task queues were synchronized during the 2026-09-27 setup pass. Local historical routers remain lineage only.

## 1. Precedence

Execution state is resolved in this order:

1. Master CFA Register — enduring responsibility map.
2. Local CFA Strategic Roadmap — CFA-owned planning.
3. **Master Portfolio Workload Router — shared execution sequencing and enablement.**
4. Central Architecture Steward task/router state.
5. Local CFA `TASKS.md` — execution projection only.
6. Historical local routers/prompts — lineage only unless explicitly reactivated by the master router.

A local `READY`, `NEXT`, `WAITING`, or historical wave label does not override this router.

## 2. Ten-CFA portfolio

| CFA | Portfolio role | Current state | Current enablement |
|---|---|---|---|
| CFA-01 | World / semantic-reference closure | M1/M2 evidence complete; Stage-E L2 World/Object basis characterized; central L2 reconciliation CLOSED | STAGE-E / SEAM-CLOSURE |
| CFA-02 | Data continuity / external acquisition | M1 complete; Stage-E L2 owner characterization CLOSED / RECONCILED | EMPIRICAL-BLOCKER |
| CFA-03 | Semantic grounding / self-knowledge | M1 complete; Stage-E gate blocked | STAGE-E |
| CFA-04 | Authority reconstruction / live corridor | M1 evidence complete; Stage-E L2 CLOSED / partial; live work waiting | SEAM-CLOSURE |
| CFA-05 | Work envelope / Plan→Work | M1 candidate complete; not frozen | SEAM-CLOSURE |
| CFA-06 | Capability→realization / provider continuity | Stage-E L2 CLOSED; M2 reconciliation remains peer-blocked | SEAM-CLOSURE |
| CFA-07 | Composition identity / replacement | Stage-E L2 CLOSED; bounded downstream design closure remains | BOUNDED-DESIGN |
| CFA-08 | Surface/View / reconstructable space | M1 complete; M2 named | BOUNDED-DESIGN |
| CFA-09 | Change / compatibility / replacement | Stage-E L2 CLOSED; shared routing drift remains | SEAM-CLOSURE |
| CFA-10 | K0 / B1 runtime constitution | M1 complete; Stage-E L2 owner characterization CLOSED / RECONCILED; runtime generation UNRESOLVABLE; B1 underproven | EMPIRICAL-BLOCKER |

## 3. Portfolio work packages

### WP-A — Seam and evidence closure
Participants: CFA-01, CFA-03, CFA-04, CFA-05, CFA-06, CFA-09.
Objective: close named cross-CFA contract/evidence questions without activating shared boundaries.
Output: evidence-backed seam classifications, falsifiers, unresolved decisions and updated local routing.

### WP-B — Empirical blockers
Participants: CFA-02, CFA-10.
Objective: execute only evidence that cannot be truthfully manufactured by repository inspection.
Required environments: owner-machine authenticated Chrome for CFA-02; supported real checkout/Bun runtime for CFA-10.
Output: attributable experiment receipt or explicit blocked result. No simulated live proof.

### WP-C — Bounded downstream design
Participants: CFA-07, CFA-08.
Objective: finish narrowly scoped design/reconciliation work already justified by evidence.
Output: design/falsifier closure only; no broad production implementation.

### WP-D — Development substrate
Participants: Architecture Steward central kernel; CFA adapters as inputs.
Objective: implement generic collaboration/development mechanics already frozen, without absorbing domain meaning.
Output: mechanically validated central substrate and adapter extension points.

### WP-E — Stage-E readiness
Participants: CFA-03 + Steward, with bounded inputs from relevant CFAs.
Objective: close the self-knowledge freshness/grounding readiness gate.
Output: DerivedView/basis contract, graph bundle contract, explicit cross-plane link contract, falsifier matrix, bounded pilots, readiness receipt.

## 4. Portfolio sequence

Current program is parallelized:

```text
                 MASTER REGISTER
                       │
              PORTFOLIO WORKLOAD
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
      WP-A           WP-B           WP-C
        │              │              │
        └──────────────┼──────────────┘
                       ▼
               WP-D + WP-E
                       │
                       ▼
              GOVERNED CORRIDOR
                       │
                       ▼
             LIVE / PRODUCT PROOF
```

WP-A, WP-B and WP-C can proceed independently where their inputs are already sufficient. WP-E can consume the same evidence while the central generic kernel proceeds mechanically.

## 5. Enablement rules

A CFA is enabled for work only when:
- its master-register responsibility matches the task;
- the local roadmap identifies the milestone;
- required peer inputs are explicit and available or clearly classified as non-blocking;
- the task has a bounded completion condition and falsifier;
- no higher-level gate blocks the work;
- the task does not activate another CFA's authority.

A task is `WAITING` when required evidence/peer input exists but has not landed.
A task is `BLOCKED` when required execution capability/environment is unavailable.
A task is `READY` only when the needed evidence and authority to execute are present.
A task is DONE only with a durable, attributable receipt or equivalent evidence and a final re-read confirming the receipt plus task-state closure on the actual delivery ref. A chat-reported completion without that verification is REPORTED-UNVERIFIED and cannot advance a gate.

## 6. Routing rules for `Next`

When the owner sends `Next` to the Steward:

1. verify current `main`;
2. read this master router;
3. identify the highest-priority enabled workload package;
4. check the package's named CFA and evidence prerequisites;
5. execute exactly one bounded action;
6. commit a durable result/receipt;
7. update this router and affected task projections;
8. stop.

If the highest-priority package is blocked, do not loop on it. Select the next independently enabled package when doing so does not violate its dependencies. Record the block explicitly.

## 7. Durable completion routing

When a CFA reports DONE in chat but current main lacks the corresponding receipt or TASKS.md closure, classify it as REPORTED-UNVERIFIED. This status is not a substantive work request: the next command performs only durable-completion verification/repair, not a second characterization. The next Next for that CFA must repair/verify the durable completion surface; it must not repeat the substantive task.

See AGENTS_CONTEXT/ARCHITECTURE_STEWARD/DURABLE-COMPLETION-GATE-2026-09-28.md.

## 8. Current ordering

1. **WP-E / Stage-E readiness closure** — L2 owner inputs are reconciled; next bounded action is the L3 Steward graph-bundle contract.
2. **WP-D / generic development-acceleration kernel** — mechanically independent and useful to all CFAs.
3. **WP-A / named seam and evidence closure** — parallel CFA-owned work.
4. **WP-B / empirical blockers** — execute when required owner-machine/runtime environments are available.
5. **WP-C / bounded CFA-07 and CFA-08 design tasks.**
6. After sufficient closure: select one narrow governed consequential corridor.

This ordering is not a ranking of the CFAs. It is the order of shared enablement dependencies.

## 9. Hard stops

- no second Architecture Graph;
- no second global task manager;
- no CFA-11 without the master-register review trigger and owner decision;
- no Ω-law rewrite;
- no CFA semantic ownership transfer;
- no live proof from fixtures;
- no B1 mechanism selection without its evidence gate;
- no broad product/live implementation before the governed corridor is selected;
- no silent resurrection of historical local router stages.

## 10. Required synchronization

Each local CFA home should retain its own roadmap/task detail but add a current portfolio-routing pointer to this master router.

The central Steward should periodically reconcile:
`MASTER REGISTER → LOCAL ROADMAP → LOCAL TASKS → PORTFOLIO ROUTER → CENTRAL TASKS → CURRENT MISSION`.

Any mismatch is routing drift and should be corrected by updating the projection/pointer, not by rewriting historical receipts.

## 11. Current frontier

**Primary shared frontier: WP-E Stage-E readiness — L2 owner characterization is CLOSED / RECONCILED (7/7); L3 graph-bundle contract is next.**

**Parallel enabling frontier: WP-D central generic development-acceleration kernel.**

**Parallel domain frontier:** all seven Stage-E L2 owner inputs are repository-verified and centrally reconciled. CFA-04 remains PARTIAL/UNKNOWN on runtime policy-source binding; CFA-01, CFA-07, CFA-09 and CFA-10 retain explicit unresolved identity/runtime limitations. L3 graph-bundle design is enabled; runtime joins remain gated.

Production/runtime joins remain gated.
