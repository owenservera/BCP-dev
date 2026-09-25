# PROGRAM-BOARD.md — Ω Program Master Control

> **Classification: DERIVED — CURRENT**
> **Purpose:** single lightweight program-management view for P1 sequencing, milestones, dependencies, blockers, complexity, and next actions.
> **Authority:** this board does not override Ω law, BCP state, code/tests, or workstream evidence. It is the program-control projection over those sources.
> **Maintainer:** COORD-01 / owner.
> **Board created from repository tip:** `cac86e77569b179bb6e124e34782f9e5dae7a078` (2026-09-25).

## 1. How to use this board

This is the page to read when asking:

**What are we doing? What is done? What is blocked? What comes next? What depends on what? How hard is it?**

Keep it intentionally small.

- **WORKSTREAMS.md** remains the registry for mission, boundary, owner, evidence, and proof state.
- **This board** owns program sequencing, milestone status, dependencies, complexity, and the immediate queue.
- **CURRENT.md** is a durable context snapshot, not a second project board.
- **CLAUDE.md** is the coordinator/bootstrap entry point and points here for program control.
- Detailed research, evidence, tests, and handoffs stay in their existing workstream artifacts.

### Status vocabulary

- **PROVEN** — the defined proof obligation has been met.
- **DONE / VERIFIED** — the currently ratified milestone is complete with repository evidence.
- **IMPLEMENTED / COMMITTED** — code or artifacts exist, but required live proof may still be open.
- **READY** — work can start when deliberately launched.
- **BLOCKED** — a named dependency or real-world action prevents progress.
- **AWAITING EVIDENCE** — the work is prepared; the owner must provide a real run/result.
- **DEFERRED** — intentionally not on the current critical path.
- **NOT STARTED** — registered but not yet researched/launched.

### Complexity scale

Complexity is a **program-management estimate**, not a LOC estimate:

- **S** — bounded documentation/proof slice; few moving parts.
- **M** — one subsystem plus bounded cross-links.
- **L** — multiple subsystems, runtime behavior, or meaningful evidence burden.
- **XL** — cross-workstream integration and/or live external reality with substantial unknowns.

Complexity can change after research. Never convert it into a schedule estimate without evidence.

---

## 3. Current program state

## 2. Practical product view

The architectural P1 list is intentionally retained. It is the **architecture/proof lens**.

For product management, read:
`docs/agent-system/PRODUCT-DELIVERY-MAP.md`

That file provides the orthogonal **delivery lens**:

- D1 Sovereign Product Foundation
- D2 AI Data & Workspace
- D3 Governed AI Action
- D4 Provider Network & Healing
- D5 Self-Knowledge & Evolution
- D6 Trust, Proof & Delivery Control

The important missing ownership exposed by this lens is the actual **user product surface and user-data lifecycle**. P1-10 is the program observatory, not the VIVIM product UI. P1-08's current `message.send@1` implementation is a Phase-1 vehicle, not a declaration that Forge owns long-term product execution.

### Phase distinction

**V0 / Phase-1:** prove that the governed system can perform one real action honestly.

**Post-V0:** move from architecture/proof convergence into explicit product outcomes: install/use locally → bring in AI history → work in a unified workspace → act across providers → survive provider change → become self-describing/extensible.

Do not create implementation work for these post-V0 outcomes until their minimum vertical slices have been researched and given an owner.


### The immediate critical path

```text
P1-08 M4  owner-run tests + omega:gate
        ↓
P1-06 M4/M5  real success + refusal + reconstruction
        ↓
P1-07 launch / provider reality proof
        ↓
P1-09 integration + end-to-end proof
```

P1-03, P1-05-M1, P1-02 and P1-01 are currently behind the critical path with completed/current baselines.

P1-04 is not required for the Phase-1 live-proof slice.

P1-05-M2 is **not on the critical path** and is explicitly proposed/unratified; do not start it until the milestone is separately ratified.

P1-10 is useful program observability work but remains off the Phase-1 convergence path.

### Do next — only three things

| Order | Action | Workstream | Why |
|---|---|---|---|
| **1** | Run `bun test plugins/provider-browser/test/live-send.test.ts` and `bun run omega:gate` from `omega-baseline/omega-final` | P1-08 | This is the current load-bearing unblocker. |
| **2** | Feed the real P1-08 result into the existing P1-06 runbook; execute the success and deterministic-refusal cases; capture M4 and then M5 evidence | P1-06 | P1-09 cannot be proved from design/code claims. |
| **3** | Launch P1-07 against the real P1-08/P1-06 evidence, then hand all three proof outputs to P1-09 | P1-07 → P1-09 | This is the convergence sequence. |

Do not create new portfolio work merely because another workstream has interesting future milestones.

---

## 4. Master workstream board

| WS | Workstream | Current state | Current milestone | Complexity | Key dependencies | Next action |
|---|---|---|---|---|---|---|
| **P1-01** | Cooperative Agent System | **PROVEN** | M4 closure / stable substrate | S | None for current baseline | Dormant; reopen only on a concrete protocol defect. |
| **P1-02** | Repository Truth, Cleanup & Drift | **IMPLEMENTED / COMMITTED** | Phase-1 truth baseline + reconciliation | M | All workstreams as evidence sources | Dormant; reopen on a concrete contradiction/drift trigger. |
| **P1-03** | Ω Ontology, Evidence & Representation | **IMPLEMENTED / COMMITTED** | M1–M4 baseline PASS | M | P1-02; Ω decisions/genome; vault/event/provenance | Dormant; monitor documented reopening triggers only. |
| **P1-04** | Ω Self-Knowledge & Context | **NOT STARTED** | M0 research/charter | L | P1-03; context/aperture substrate; vivim.mind | Deferred until Phase-1 convergence unless a dependency forces earlier research. |
| **P1-05** | Ω Plugin Kernel & Runtime | **DONE / VERIFIED** for M1 | M1 complete; M2 proposed/unratified | M | P1-03; P1-06; B1–B5; Forge | Do not start M2 until separately ratified. |
| **P1-06** | Ω Agency, Execution & Governance | **IMPLEMENTED / BLOCKED** | M4 real events → M5 reconstruction | L | P1-03; P1-05; P1-08 real result; governance decisions | After P1-08 M4, run success + refusal and capture event evidence. |
| **P1-07** | Provider Intelligence & Autonomous Maintenance | **NOT STARTED / BLOCKED** | M0 research → provider proof | XL | P1-03; P1-05; P1-06; P1-08; real Chrome | Launch after P1-08 and P1-06 have real evidence. |
| **P1-08** | Forge / VIVIM Harvest & Migration | **IMPLEMENTED / AWAITING EVIDENCE** | M4 owner-run test + gate | L | P1-02; provider-browser reality; Ω runtime | **Owner runs tests + gate now.** |
| **P1-09** | Ω Integration & End-to-End Proof | **NOT STARTED / BLOCKED** | M0 thin falsifiers → final E2E | XL | P1-06; P1-07; P1-08; all relevant Ω contracts | Prepare only lightweight falsifiers; full proof starts after upstream evidence is real. |
| **P1-10** | Program Observatory / Visual State | **REGISTERED / RESEARCHED / DEFERRED** | V0 research → thin read-only projection | M/L | Program state sources; P1-03 semantics | Keep off critical path; resume when useful for program visibility. |

---

## 5. Milestone map

Milestones here are **management milestones**. Detailed evidence and acceptance criteria remain in the workstream files.

### P1-01 — Cooperative Agent System · S

| Milestone | Goal | State |
|---|---|---|
| M1 | Durable coordination substrate and context conventions established | DONE |
| M2 | Multi-agent dogfood / handoff continuity | PROVEN |
| M3 | Cross-ChatGPT fresh-session continuity | PROVEN |
| M4 | Closure/reconciliation and stable operating protocol | PROVEN / STABLE |

**Exit:** no active work. Reopen only for a falsified protocol property.

### P1-02 — Repository Truth & Drift · M

| Milestone | Goal | State |
|---|---|---|
| M1 | Establish repository truth baseline and authority boundaries | DONE |
| M2 | Exercise a bounded truth/reconciliation slice | DONE |
| M3 | Maintain conflict/drift register and trigger-based re-entry | DORMANT |

**Exit:** baseline is good enough for current Phase-1 convergence. Do not turn maintenance into continuous churn.

### P1-03 — Ontology / Evidence / Representation · M

| Milestone | Goal | State |
|---|---|---|
| M1 | Extract de facto ontology from authoritative/current evidence | DONE |
| M2 | Map semantic gaps and contradictions | DONE |
| M3 | Publish minimal canonical representation semantics | DONE |
| M4 | Reconcile model against actual P1-06/P1-08 chain | PASS |

**Exit:** current Phase-1 ontology baseline complete; only documented reopening triggers matter.

### P1-04 — Self-Knowledge / Context · L

| Milestone | Goal | State |
|---|---|---|
| M0 | Deep repository research and evidence-backed charter | NOT STARTED |
| M1 | Characterize self/world/intent/context sources | FUTURE |
| M2 | Define deterministic context compilation boundary | FUTURE |
| M3 | Implement bounded context projection | FUTURE |
| M4 | Prove cold-agent self/context reconstruction from governed evidence | FUTURE |

**Dependency note:** P1-04 should consume P1-03 semantics rather than inventing a parallel ontology.

### P1-05 — Plugin Kernel / Runtime · M

| Milestone | Goal | State |
|---|---|---|
| M1 | Characterize current kernel, contracts, plugins, and B1–B5 boundaries | DONE / VERIFIED |
| M2 | Enforce signed plugin entry confinement within the content-hashed tree | PROPOSED / UNRATIFIED |
| M3 | Decide any future dynamic-composition trigger without expanding Phase-1 host prematurely | PROPOSED / FUTURE |

**Gate:** M2 is not work until ratified.

### P1-06 — Agency / Execution / Governance · L

| Milestone | Goal | State |
|---|---|---|
| M1 | Minimal principal + authority model | DONE / CODE |
| M2 | Invocation chain through governed ports | DONE / CODE; execution pending |
| M3 | Deterministic refusal path | DONE / CODE; execution pending |
| M4 | Produce real governed success + refusal events | BLOCKED ON P1-08 |
| M5 | Reconstruct both outcomes from event evidence alone | BLOCKED ON M4 |

**Exit:** M5 PROVEN only when actual evidence satisfies the existing reconstruction rubric.

### P1-07 — Provider Intelligence / Maintenance · XL

| Milestone | Goal | State |
|---|---|---|
| M0 | Research provider reality and establish experiment boundary | BLOCKED |
| M1 | Capture real authenticated Chrome behavior and evidence corpus | FUTURE |
| M2 | Produce replayable behavioral/provider representations | FUTURE |
| M3 | Demonstrate drift → rediscovery → repair cycle | FUTURE |
| M4 | Verify repaired realization and promote only on evidence | FUTURE |

**Dependency note:** this is the largest uncertainty-heavy workstream because external provider behavior is live and can change.

### P1-08 — Forge / VIVIM Harvest & Migration · L

| Milestone | Goal | State |
|---|---|---|
| M1 | Characterize exact VIVIM behavior being harvested | DONE |
| M2 | Map behavior to Ω `message.send@1` contract and invariants | DONE |
| M3 | Implement Ω-side provider-browser execution leg | DONE / COMMITTED |
| M4 | Owner-run targeted test + `omega:gate` | **AWAITING EVIDENCE** |
| M5 | Publish verified handoff suitable for P1-06/P1-07 consumption | PENDING M4 |

**Current owner action:** run the two commands from the existing handoff package and return the unedited result to the P1-08 workstream.

### P1-09 — Integration / End-to-End Proof · XL

| Milestone | Goal | State |
|---|---|---|
| M0 | Maintain thin integration falsifiers against live boundaries | READY / LIGHTWEIGHT |
| M1 | Reconcile cross-workstream contracts and proof inputs | BLOCKED |
| M2 | Prove governed success path end-to-end | BLOCKED |
| M3 | Prove governed refusal path end-to-end | BLOCKED |
| M4 | Demonstrate evidence-only reconstruction and integration invariants | BLOCKED |
| M5 | Final Phase-1 convergence verdict | BLOCKED |

**Rule:** do not invent an integration verdict from subsystem design documents.

### P1-10 — Program Observatory / Visual State · M/L

| Milestone | Goal | State |
|---|---|---|
| M1 | Establish V0 blueprint and semantic boundary | DONE |
| M2 | Research semantic, identity, relationship, and assertion models | RESEARCHED |
| M3 | Build a thin read-only program-state projection | DEFERRED |
| M4 | Adversarial proof: authority, unknowns, relationships, state, zoom, read-only integrity | DEFERRED |
| M5 | Owner acceptance / usability gate | DEFERRED |

**Rule:** P1-10 observes the program; it must not become a new task/authority system.

---

## 6. Dependency map

### Hard dependency chain for current Phase-1 proof

```text
P1-02 ────────────────┐
                      │
P1-03 ────────────────┼──► P1-05 ──► P1-06 ──┐
                      │                       │
P1-08 ────────────────────────────────────────┼──► P1-09
                      │                       │
                      └──────────────► P1-07 ─┘
```

More precisely:

| Consumer | Requires | Reason |
|---|---|---|
| P1-05 | P1-03 | runtime/plugin boundaries depend on canonical semantic distinctions |
| P1-06 | P1-03 + P1-05 + P1-08 | governance proof must invoke the real target capability through the governed runtime |
| P1-07 | P1-03 + P1-05 + P1-06 + P1-08 | provider intelligence must operate against the governed provider realization |
| P1-09 | P1-06 + P1-07 + P1-08 | final proof composes the real upstream evidence |
| P1-04 | P1-03 | self/context views consume, rather than redefine, ontology/evidence semantics |
| P1-10 | P1-03 + live program-state sources | observatory must project governed meaning without becoming an authority source |

**P1-01 and P1-02 are cross-cutting controls**, not prerequisites that should force every workstream to wait.

### What is not a dependency

- P1-04 is not required to finish the current Phase-1 governed-send proof.
- P1-05 M2 is not required for the already-composed Phase-1 path and is not authorized until ratified.
- P1-10 is not a prerequisite for product/runtime proof.
- Historical VIVIM mechanisms are evidence inputs, not authority.

---

## 7. Program health

| Area | Current read |
|---|---|
| **Truth** | Good enough for Phase-1 execution; P1-02 is dormant unless a new contradiction appears. |
| **Architecture** | Core semantic/runtime/governance boundaries have current baselines. |
| **Implementation** | The real send path and governance chain are committed. |
| **Proof** | **The program is waiting on owner-run evidence, not another design round.** |
| **Largest uncertainty** | Provider reality / autonomous maintenance (P1-07). |
| **Largest integration risk** | P1-09: assumptions that look coherent individually may fail when exercised together. |
| **Management risk** | Reopening completed workstreams or starting future milestones before the current critical path is exercised. |

---

## 8. Lightweight operating rule

A management state change should update **this board + the affected workstream row**.

Nothing else needs to move unless the change affects fresh-session bootstrap, current architectural context, an authority/decision record, or an immutable evidence artifact.

That keeps program management to **one board + the source evidence**, rather than forcing every agent to maintain several overlapping ledgers.

### Completion rule

Never mark a milestone DONE/PROVEN from a conversation claim alone.

Require the evidence named by that milestone: committed artifact, test output, gate result, live run, or independent reconstruction.

### Librarian rule

Every new durable artifact must be reachable from this board or its workstream row.

Do not create a new tracker when an existing artifact can be linked.

### Next-action rule

Every non-complete workstream has exactly **one** current next action in this board.

Future milestones can remain visible without becoming simultaneous work.

---

## 9. Update history

| Date | Change |
|---|---|
| 2026-09-25 | Created as the single lightweight P1 program-control projection: milestones, dependencies, complexity, critical path, current queue. |

## 10. Destination product assembly

The destination package now provides the product-level synthesis above the P1 architecture portfolio:

- docs/destination/NORTH-STAR.md — destination promise.
- docs/destination/CONCEPTUAL-MODEL.md — human-level vocabulary.
- docs/destination/DESTINATION-MASTER-MAP.md — destination-to-repository mapping and canonical journeys.
- docs/destination/MATURITY-AND-GAPS.md — maturity levels, current state, and gap register.
- docs/destination/BUILD-AND-HARVEST-PLAN.md — sequenced product assembly and harvest plan.

The delivery lens is now:

**world coherence → capability choice → durable work → live external reality → persistent continuity → native evolution.**

P1 remains the architecture/proof decomposition. D1–D6 in the destination build plan are the user-visible product assembly tracks feeding that portfolio. Do not create a second P1 portfolio merely to represent product assembly.

