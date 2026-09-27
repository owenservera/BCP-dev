# Persistent Tasks — runtime-constitution-core-substrate

## 🚨 CURRENT EXECUTION ROUTER — WAVE 3 — **RECEIPT-DRIVEN**

> **DO NOT TRUST CACHED ACTIVE/WAITING STATE. VERIFY CURRENT MAIN AND RECOMPUTE YOUR TURN.**

Canonical router:
`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/CURRENT-WAVE-ROUTER-2026-09-27.md`

Required order:
**CFA-05 → CFA-06 → CFA-07 → CFA-08 → CFA-09 → CFA-10**

Recompute the current Wave-3 turn from CURRENT-WAVE-ROUTER and committed receipts. Execute only when CFA-05 through CFA-09 receipts exist and your receipt is absent. Otherwise report exact waiting/done state; never use stale cached turn text.

When the human owner sends **“Next”**:
1. verify current `main`;
2. read the canonical router;
3. check the required predecessor Wave-3 receipts directly on current `main`;
4. decide whether this CFA is DONE, EXECUTE NOW, or WAITING;
5. if EXECUTE NOW, perform only this CFA's Wave-3 row from the Wave-3 queue;
6. commit the addendum, report the exact SHA, and STOP.

**A stale local TASKS message must never force a second Next.**
**Never resume older M1/M2/FUTURE work merely because it remains marked READY.**

Hard stop: no production implementation, no shared-boundary activation, no Ω-law change, no Graph attachment.


## Open tasks

### STRATEGIC-ROADMAP-ROUND-1-2026-09-27
- **Status:** DONE
- **Priority:** P1
- **Completed:** 2026-09-27
- **Roadmap:** `DOMAIN-ROADMAP-2026-09-27.md`
- **Receipt:** `RESULTS/CFA10-20260927-STRATEGIC-ROADMAP-R1.md`
- **Result:** Independent first-pass strategic roadmap persisted with five conceptual milestones, milestone-specific success/falsifiers, dependency model, tooling/substrate assessment, peer-intelligence gates, decision gates, product consequences, deferred boundaries and inherited-plan classifications.
- **First bounded actionable task:** `RUNTIME-M1-K0-EVIDENCE-CLOSURE-2026-09-27` (READY), limited to current-evidence/runtime-falsifier definition and B1 closure preparation; no production implementation.
- **Completion condition:** Met by durable roadmap, queue update, receipt and verified mainline commit.
- **Stop condition:** Further execution requires a separately assigned task; this planning stage does not authorize production implementation.

## Open bounded work

### RUNTIME-M1-K0-EVIDENCE-CLOSURE-2026-09-27
- **Status:** DONE
- **Priority:** P1
- **Completed:** 2026-09-27
- **Artifact:** `M1-K0-EVIDENCE-FALSIFIER-MATRIX-2026-09-27.md`
- **Receipt:** `RESULTS/CFA10-M1-K0-EVIDENCE-CLOSURE-2026-09-27.md`
- **Result:** Retained K0 duties were converted into an invariant → bypass → minimum mechanism → evidence → falsifier matrix. B1 was refined into explicit source-root, manifest-root, executable-entry, symlink and verify→execute byte-binding cases. No Ω-law or production-runtime changes were made.
- **Next state:** No new READY implementation task is created; B1 containment/byte-binding requires a separately authorized experiment.
- **Completion condition:** Met by durable matrix, state/queue update, receipt and verified mainline lineage.
- **Stop condition:** Further work stops for Ω-law collision, boundary/security-tier decision, insufficient evidence, or any request to begin production implementation.

## Future task intake
### RUNTIME-M1-B1-TARGET-RUNTIME-CLOSURE-2026-09-27
- **Status:** BLOCKED-HOSTED-RUNTIME
- **Priority:** P1
- **Purpose:** Replay the B1 signed-manifest corpus on an actual supported Ω runtime and close the remaining target-runtime evidence gaps identified by the bounded primitive experiment.
- **Preconditions:** EXPERIMENTS/B1-CONTAINMENT-BYTE-BINDING-EXPERIMENT-2026-09-27.md persisted; current Ω host and target-runtime checkout available.
- **Next action:** Execute the persisted handoff `EXECUTION-HANDOFFS/B1-TARGET-RUNTIME-CLOSURE-2026-09-27.md` from a real checkout on a supported Bun runtime; this hosted session cannot perform the runtime replay because GitHub DNS is unavailable to the execution container.
- **Write scope:** CFA-10 experiment/results only; no Ω-law or production-runtime changes until a later implementation decision.
- **Completion condition:** Reproducible target-runtime evidence covers the M1 B1 matrix or names the residual unknowns precisely; no uncovered bytes are shown to execute.
- **Stop condition:** remain blocked here until local/CI runtime evidence exists; stop on Ω-law collision, boundary/security-tier decision, or need to choose a production mechanism before evidence is sufficient.


Add durable agent-owned work here with status, priority, verified dependencies, write scope, next action, and completion condition.

## Completed task history

### HOME-UPGRADE-2026-09-27
- **Status:** DONE
- **Result receipt:** `RESULTS/CFA10-HOME-UPGRADE-2026-09-27-0538.md`
- **Completion commit:** bdad012a1e829bffdb2294f9fe5cbe276f1b8156
- **Result:** Home validated and cold-start corrections persisted; FSSP-1.3/session-result-contract alignment is now reflected at the home front door; no Ω law, shared boundary, or production implementation changes.
- **Revalidation:** `CFA10-HOME-UPGRADE-20260927-0644` — receipt `RESULTS/CFA10-HOME-UPGRADE-20260927-0644.md`; durable correction commit `7364988b40af58109d24a8b437c108fe144de3c8`; corrected remaining stale bootstrap-history markers and FSSP metadata after subsequent mainline evolution.

Keep completed entries compact. Preserve useful continuity/evidence; do not turn this into a transcript archive.
