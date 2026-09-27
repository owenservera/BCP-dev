# Persistent Tasks — architecture-steward

> Owner: `architecture-steward`
> Status: ACTIVE
> Purpose: durable unfinished-work and next-action queue across ChatGPT sessions.
> Authority: task/work memory only; not Ω law, semantic authority, or proof of dependency.

## Open tasks

### HOME-UPGRADE-2026-09-27
- **Status:** READY
- **Priority:** P1
- **Dependencies:** None currently known.
- **Write scope:** Own agent home only.
- **Next action:** Read current main, then reconcile this task against `SESSION-CONTEXT.md`, identity, `STATE.md`, `TASKS.md`, `LESSONS.md`, and applicable alignment/history.
- **Completion condition:** Validate the home as cold-startable; persist only justified corrections; update task status; report exact result/commit; do not start unrelated work.
- **Stop condition:** Stop after this task and report.

## Open strategic operating tasks

### COMMONS-V0-RUNTIME-2026-09-27
- **Status:** READY
- **Priority:** P1
- **Operational owner:** runtime-constitution-core-substrate
- **Source:** AGENTS_CONTEXT/AGENT-COMMONS/RUNTIME-PLATFORM-WORKSTREAM-2026-09-27.md
- **Dependencies:** Current Commons design freeze; no semantic boundary activation required.
- **Next action:** implement/test the existing Commons Phases 1–3 scope and drive the 10-point v0 operational completion test to evidence-backed green.
- **Completion condition:** two independent agent runtimes satisfy the complete Commons v0 test and persist the evidence; then the owner decides whether to unfreeze broader protocol design.

### COMMONS-IDENTITY-DRILL-2026-09-27
- **Status:** BLOCKED
- **Priority:** P1
- **Operational owner:** authority-governance
- **Dependencies:** a real key-rotation operation must exist before the full rotation + recovery drill can run.
- **Current evidence:** recovery/no-silent-fork guard is covered by the Commons smoke test; rotation operation is absent.
- **Next action:** implement/authorize a real rotation operation, then execute the documented drill.
- **Completion condition:** stable agent_id, explicit old/new key ceremony, old-key retirement/rejection, new-key attribution, and authored-stream continuity are all evidenced.

### OWNER-DIGEST-2026-09-27
- **Status:** ACTIVE
- **Priority:** P1
- **Owner:** architecture-steward
- **Cadence:** weekly derived snapshot; generate/replace rather than append history.
- **Scope:** pending receipts, receipt verification state, handoff/attention items when computable, open contradictions, and births awaiting ratification.
- **Authority:** projection only; it never replaces source receipts, Commons history, the CFA register, or authority-owned records.

## Future task intake

Add durable agent-owned work here with status, priority, verified dependencies, write scope, next action, and completion condition.

## Completed task history

### SESSION-LAUNCH-UPGRADE-2026-09-27
- **Status:** DONE
- **Completed:** 2026-09-27
- **Receipt:** RESULTS/STEWARD-20260927-SESSION-LAUNCH-UPGRADE.md
- **Result:** Upgraded the fresh-session and session-receipt machinery to FSSP-1.3 / Contract 1.1, including the Steward receipt pull loop and investigation-subagent receipt coverage.

### AGENT-SYSTEM-OPS-MATURITY-2026-09-27
- **Status:** DONE
- **Completed:** 2026-09-27
- **Receipt:** RESULTS/STEWARD-20260927-OPS-MATURITY.md
- **Result:** Reviewed and implemented the operating-maturity seams: Commons/repository receipt convergence and trust posture, runtime ownership/freeze line, quantitative Epistemic Integrity trigger, publishing-session reconciliation, owner digest projection, security/identity custodian assignment, roster drift correction, and explicit blocked status for the unimplemented rotation drill.

Keep completed entries compact. Preserve useful continuity/evidence; do not turn this into a transcript archive.
