# CFA-09 M0/M1 Safe Evolution Envelope — Session Result Contract v1.1 → v1.2

SESSION_STATUS: PARTIAL
SESSION_ID: CFA09-M0M1-EVOLUTION-20260928
CFA / AGENT: CFA-09 / evolution-compatibility-self-maintenance
IDENTITY: Change, Compatibility & Continuity Steward
AGENT_ID: evolution-compatibility-self-maintenance
TARGET_REF: main @ e181820502f1a5ea572ed51b98cebd3af0b9c5ae (design tip 24e5b88ec05b1406e22130fb5fcc03a79bf54f93 read-only, never checked out)
BASE_MAIN_SHA: e181820502f1a5ea572ed51b98cebd3af0b9c5ae
TASK: Define the SAFE EVOLUTION envelope for extending Session Result Contract v1.1 → v1.2 for M1 (versioning + compat rule; per-class evidence thresholds under the Gate; migration/rollback without history rewrite; safe-envelope conditions for the ONE real execution corridor). RESEARCH ONLY — no code, no commits, no peer-home edits, no TASKS.md update.
EXECUTION_STRATEGY: Single-session DELIBERATE investigation; read-only git inspection (no checkout of design branch); no leaf workers spawned (bounded task, no delegation needed).
STRATEGY_RATIONALE: The task is a semantic/governance characterization fully inside CFA-09 decision rights (evidence classifications, bounded change-state classifications, seam recommendations — CORE-AGENT.md § Decision rights). All evidence was directly readable; spawning workers would add lineage without adding evidence.
RESULT: INVESTIGATED
FILES_CHANGED: AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/EVOLUTION-COMPATIBILITY-SELF-MAINTENANCE/RESULTS/CFA09-M0M1-EVOLUTION-20260928.md (this receipt; UNCOMMITTED — Steward to verify + commit)
COMMIT_SHA: NONE — UNCOMMITTED (no commit authorized for this session; see NEXT_REQUIRED_STEP)
PREDECESSOR_VERIFIED:
- BASE_MAIN_SHA e181820502f1a5ea572ed51b98cebd3af0b9c5ae resolves (git cat-file: commit); HEAD == BASE_MAIN_SHA; worktree clean except 2 known untracked auto-exports (local-team.md, session-ses_f1fc.md) — left alone per Steward instruction.
- Design tip 24e5b88ec05b1406e22130fb5fcc03a79bf54f93 resolves (git cat-file: commit) on remotes/origin/design/agent-system-master-upgrade-2026-09-28; inspected read-only via git show / ls-tree / diff — never checked out.
- Session Result Contract v1.1 + changelog and Durable Completion Gate 2026-09-28 read from current main (quoted as authority below).
- M0/M1 upgrade prompt (docs/agent-system/LOCAL-AGENT-M0-M1-UPGRADE-PROMPT-2026-09-28.md), MASTER-UPGRADE-INDEX, IMPLEMENTATION-MATRIX, and DELEGATION-AND-CAPABILITY-ENFORCEMENT read from design tip, read-only.
- Contract v1.1 text is IDENTICAL on main and design tip (git diff exit 0) — no v1.2 proposal exists yet; this receipt is the first-word envelope for it, not a review of one.
OWNER_ALIGNMENT: OWNER-ALIGNMENT-2026-09-27.md (ratified CFA-09 identity v1.0) + dual-speed ratification (design branch, PROPOSED — not yet mainline authority; cited as proposal only).
LESSONS_UPDATED: NO (research-only session; TASKS.md untouched per mission).
COMMONS: NONE (no Commons transport operation in this session).
UNRESOLVED:
- Exact validator implementation language/location for the §5 automatic completion gate (M1 work, not this envelope).
- Whether OpenCode version under test can mechanically enforce exact-agent resolution (M0/M1 §6 anticipates a possible runtime-enforcement gap — must be recorded as PROCEDURAL if unprovable, never upgraded by prompt language).
- Canonical active-reconciliation registry designation (open W1-CFA11 counter-2 item — orthogonal, Steward-owned).
BLOCKERS: NONE (envelope formed; commit/TASKS-closure/re-read are Steward-side by mission design, not blockers).
BOUNDARIES_ACTIVATED: NONE
OMEGA_LAW_CHANGED: NONE (explicitly forbidden by and for this slice)
IMPLEMENTATION_STARTED: NO (research only; INVESTIGATED is a legitimate terminal outcome per M0/M1 §4)
NEXT_REQUIRED_STEP: STEWARD verify (re-read receipt at committed ref) + commit this receipt + run final re-read per the Durable Completion Gate; then route the M1 contract-text + validator slice as the corridor's first EXECUTION with exact allowed paths. CFA-09 has no further action until routed — do NOT repeat this characterization on a subsequent Next (Gate anti-loop invariant).

---

## 1. Change subject + semantic delta (CFA-09 operating loop)

- **Subject:** Session Result Contract v1.1 (process/control-plane contract, Architecture-Steward-owned; NOT Ω law, NOT semantic authority — Contract header).
- **Proposed delta (v1.2):** ADDITIVE extension only — new OPTIONAL execution-proof fields alongside the 23 canonical v1.1 fields (candidate set per M0/M1 §3: MODE, WORK_ID, SURFACE, REQUESTED_AGENT, RESOLVED_AGENT, ALLOWED_PATHS, ACTUAL_CHANGED_PATHS, REQUIRED_TESTS, TEST_RESULTS, ENFORCEMENT_LEVEL). No existing field is renamed, removed, or redefined; no field canonical elsewhere is duplicated.
- **Meaning of the delta:** a v1.2 receipt can carry machine-checkable execution proof; the meaning of every v1.1 field is unchanged. This is governed evolution (CORE-AGENT.md § Scope.1), not constitutional change.
- **Classification:** maintenance-adjacent governed evolution of a control-plane form. It does not alter Ω law, K0/K1, any CFA semantic authority, or any shared boundary.

## 2. Versioning + compatibility rule

1. **v1.1 receipts remain valid under v1.2.** The v1.2 validator MUST accept v1.1-shape receipts. No old receipt is ever rewritten (rollback ≠ history deletion — CFA-09 invariant).
2. **v1.2 is additive-only:** any v1.2 parser/validator MUST tolerate unknown fields (forward-compat), so a suspended or superseded v1.2 never orphans receipts already on main.
3. **REQUIRED vs OPTIONAL is per completion class, not per version:**

| Completion class | v1.2 fields | Rationale |
|---|---|---|
| INVESTIGATED (DELIBERATE) | OPTIONAL (MODE/SURFACE recommended) | v1.1 shape is sufficient proof; this very receipt is the exhibit — RESULT=INVESTIGATED with v1.1 fields only. |
| FALSIFIED (DELIBERATE) | OPTIONAL (MODE/SURFACE recommended) | Proof is the falsifier + contradictory evidence, not execution fields. |
| IMPLEMENTED with MODE=EXECUTION | **REQUIRED** — full execution-proof set | Execution claims require machine-checkable proof (§3, row 3). |
| IMPLEMENTED with MODE=DELIBERATE (bounded repo work, e.g. doc slice) | OPTIONAL, RECOMMENDED (MODE, SURFACE at minimum) | Validator applies v1.1 checks only (commit exists, receipt present, TASKS closed, final re-read). |
| BLOCKED / PARTIAL | OPTIONAL — REQUIRED only if EXECUTION was attempted (then WORK_ID, SURFACE, ENFORCEMENT_LEVEL required to show what was attempted and where it stopped) | Attempt evidence, not proof. |
| SUPERSEDED / PARKED | OPTIONAL | Proof is the supersession pointer / park reason. |
| REPORTED-UNVERIFIED | N/A — not a claimable class; it is the validator's verdict on an unverified claim | Must not advance any downstream gate (Gate § Failure states). |

4. **Compatibility never implies authorization** (CORE-AGENT.md § Challenge): a validator PASS on shape/proof never authorizes Ω change, boundary activation, or production implementation.

## 3. Per-class evidence thresholds under the Durable Completion Gate

Validator checks C1–C9 are the nine M0/M1 §5 gate questions: (C1) receipt structurally valid · (C2) requested_agent == resolved_agent when explicitly requested · (C3) source SHA valid · (C4) referenced commit exists when implementation claimed · (C5) actual changed paths ⊆ allowed paths when an envelope applies · (C6) required tests present and successful for IMPLEMENTED · (C7) required STATE update present/current · (C8) final delivery ref contains the receipt · (C9) claimed completion class matches the evidence.

| Class | Validator must check | Return to DELIBERATION when (M0/M1 §11 stop conditions) |
|---|---|---|
| INVESTIGATED | C1 + C8; TASK question answered with cited evidence/lineage; UNKNOWNs explicitly named with paths | Never a failure — terminal. If Steward finds thin evidence, open a follow-up INVESTIGATED step; do not demand code. |
| FALSIFIED | C1 + C8; explicit falsifier statement + contradictory evidence cited; MUST NOT carry IMPLEMENTED semantics (no implementation commit claimed) | Never a failure — terminal. A falsified corridor proposal returns its *successor proposal* to deliberation, not the falsification itself. |
| IMPLEMENTED (EXECUTION) | ALL of C1–C9; ENFORCEMENT_LEVEL honest (MECHANICAL only if mechanically enforced; else PROCEDURAL — prompt-only checking is never labeled enforcement, per M0/M1 §6 and DELEGATION doc); STATE update verified on delivery ref, not merely written | ANY check failure is explicit (no silent downgrade to warning): authority ambiguous; Ω change needed; boundary activation needed; second ontology/store/task-manager proposed; core architectural assumption contradicted; exact-agent identity unprovable for a consequential step; worker exceeded envelope; task cross-domain enough for architectural review. |
| IMPLEMENTED (DELIBERATE-bounded) | C1, C3 (if SHA cited), C4, C7, C8, C9 (v1.1 checks only); v1.2 fields accepted if present, never demanded | Same stop conditions as EXECUTION minus agent/path/test enforcement rows. |
| BLOCKED | C1 + C8; blocker evidenced (capability missing, where attempted, verbatim output where practical); MUST NOT claim completion semantics | If the blocker dissolves (capability appears), the *retry* is a new deliberated decision, not an automatic resume. |
| PARTIAL | C1 + C8; durable evidence exists + resumption cursor (exact ref, next command, open questions) | If the cursor's premise is contradicted by new evidence, re-deliberate the plan before resuming. |
| SUPERSEDED / PARKED | C1 + C8; supersession pointer (exact ref of superseding work) or park reason + revival condition | Revival against changed repository state re-enters DELIBERATION; never auto-resume. |
| REPORTED-UNVERIFIED (validator verdict) | Applied by the Steward when chat claims DONE/COMPLETE but receipt or TASKS closure is absent on current main | Anti-loop invariant: the next Next MUST first attempt durable completion verification (receipt + task-state on delivery ref + final re-read) — it must NOT automatically repeat the underlying research/characterization. |

## 4. Migration / rollback note (no history rewrite)

- **Migration is forward-only and additive:** v1.2 ships as a new contract revision + validator version; existing v1.1 receipts are never touched. Validator versions are pinned per receipt (receipt declares contract version; validator dispatches on it).
- **Rollback if the validator is proved wrong:** (1) Steward marks v1.2 SUSPENDED — issuance of new v1.2 receipts freezes; (2) v1.2-shaped receipts already committed on main REMAIN VALID and readable under the tolerate-unknown-fields rule (§2.2) — they are evidence, not damage; (3) new receipts revert to v1.1 shape; (4) validator pinned back to v1.1 checks; (5) any correction proceeds as v1.2.1/v1.3 — a new governed change with lineage to the suspended v1.2, never an edit of history.
- **Forbidden rollback shapes:** rewriting or deleting any committed receipt; force-moving main to erase the v1.2 episode (Gate § Concurrency: retry without force-moving main); reinterpreting past v1.1 receipts under v1.2 REQUIRED rules retroactively.

## 5. Safe-envelope conditions — the ONE real execution corridor (falsifiers that must hold)

Each condition is a falsifier: if it fails, the corridor stops and returns to DELIBERATION (M0/M1 §§7, 11). All must hold simultaneously:

1. **Singularity:** one active CFA, one writer, exact ALLOWED_PATHS declared pre-execution; actual changed paths ⊆ allowed (C5).
2. **Pre-justification:** the task is already justified by repository evidence — small, non-Ω, no new architecture layer (M0/M1 §7: "prove the operating model, not maximize feature output"; explicitly NOT a Commons redesign).
3. **No authority escalation via this slice:** no Ω-law change, no shared-boundary activation, no second task/ontology/store/registry system — extension of existing representations only (M0 §2, M1 §3).
4. **Exact-agent honesty:** requested_agent == resolved_agent proven where the runtime permits; where it does not, the gap is recorded as PROCEDURAL enforcement, never described as equivalent to mechanical enforcement (M0/M1 §6).
5. **Pre-declared tests:** REQUIRED_TESTS defined before execution, runnable on the executing surface, results recorded in TEST_RESULTS (C6).
6. **Gate transaction closed:** receipt + STATE update + commit + final re-read from main all verified on the delivery ref (C7, C8; Gate §§ Mandatory completion transaction, L2-specific rule).
7. **Surface-evidence honesty:** no local-runtime claim without local-runtime evidence (Implementation Matrix § Local runtime proof boundary); ChatGPT-surface work claims only what its environment produced.
8. **Surprise routing:** any architectural surprise encountered mid-corridor returns to DELIBERATION; the corridor has no authority to absorb it by scope growth.

## 6. Explicit forbids (this slice)

- NO second task system, receipt system, ontology, canonical store, authority store, evolution registry, or architecture graph (CORE-AGENT.md §§ Explicit non-scope, Guardrails; M1 §3).
- NO Ω-law change (Contract and Gate are process contracts only — "not Ω law or semantic authority").
- NO shared-boundary activation via this slice; CFA boundaries remain UNACTIVATED (STATE.md § Boundary/activation state).
- NO production implementation authorization beyond the single bounded corridor after M1.
- NO compatibility-implies-authority inference; NO prompt-guidance-labeled-as-enforcement.

## 7. Evidence discipline for this receipt

- OBSERVED: contract v1.1 text (main); Gate text (main); M0/M1 prompt + index + matrix + delegation doc (design tip, read-only); BASE/HEAD SHAs; worktree status; v1.1-identical-on-both-refs diff (exit 0).
- DERIVED: additive-only v1.2 shape; per-class REQUIRED/OPTIONAL matrix; validator check mapping C1–C9; suspend-tolerate-supersede rollback.
- PROPOSED: this envelope (validator implementation itself is M1 future work, not decided here).
- UNKNOWN: validator language/location; OpenCode mechanical-enforcement capability for exact-agent; counter-2 registry designation (orthogonal).
- CONFLICTED: none.
- Freshness: CURRENT (verified against HEAD e1818205 and tip 24e5b88e during this session, 2026-09-28).

## 8. Peer seams touched (requirements only — no peer ownership taken)

- CFA-04 (Authority): v1.2 validator PASS ≠ authorization; reauthorization triggers on changed-effect out of scope here — flagged for CFA-04.
- CFA-05 (Work): WORK_ID lineage and attempt identity must survive surface switches without forking authority — execution-envelope requirement, Work lifecycle stays CFA-05.
- CFA-10 (Runtime): MECHANICAL vs PROCEDURAL enforcement labeling depends on runtime capability profiles — enforcement stays CFA-10.
- Architecture Steward: owns v1.2 ratification, this receipt's commit, and corridor routing.
