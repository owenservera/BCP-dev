SESSION_STATUS: PARTIAL
SESSION_ID: CFA10-B1-CONTAINMENT-BYTE-BINDING-EXPERIMENT-2026-09-27
CFA / AGENT: CFA-10 / Runtime Constitution & Core Substrate Steward
IDENTITY: Runtime Constitution & Core Substrate Steward
AGENT_ID: runtime-constitution-core-substrate
TARGET_REF: main
BASE_MAIN_SHA: af25acab6a9c15956bbed3b5df9cf5993f7c25d2
TASK: B1 containment/byte-binding experiment
EXECUTION_STRATEGY: BOUNDED PRIMITIVE PROBE + DURABLE EVIDENCE UPDATE
STRATEGY_RATIONALE: Current main CFA-10 state, M1 matrix, central reconciliation, and Ω runtime implementation were re-read before execution. The experiment was constrained to evidence generation: no Ω-law change and no production-runtime implementation. Because a full repository checkout/runtime was not executable in this hosted session, the empirical portion used small local probes that reproduce the exact path and Worker primitives; full signed-manifest and target-runtime replay is queued separately.
RESULT: PARTIAL — relative entry traversal and source-root symlink behavior were empirically reproduced; verify→execute TOCTOU was directly demonstrated with the same join-based Worker loading shape. Absolute/drive/UNC spellings were also probed, showing that POSIX path.join does not blanket-escape them. Full Ω-host signed-manifest replay remains required.
FILES_CHANGED: AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/RUNTIME-CONSTITUTION-CORE-SUBSTRATE/EXPERIMENTS/B1-CONTAINMENT-BYTE-BINDING-EXPERIMENT-2026-09-27.md; AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/RUNTIME-CONSTITUTION-CORE-SUBSTRATE/TASKS.md; AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/RUNTIME-CONSTITUTION-CORE-SUBSTRATE/STATE.md; AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/RUNTIME-CONSTITUTION-CORE-SUBSTRATE/RESULTS/CFA10-B1-CONTAINMENT-BYTE-BINDING-EXPERIMENT-2026-09-27.md
COMMIT_SHA: PENDING — this receipt file is the final write of the session
PREDECESSOR_VERIFIED: VERIFIED — starting main was af25acab6a9c15956bbed3b5df9cf5993f7c25d2 and no concurrent ref rejection occurred during this bounded sequence.
OWNER_ALIGNMENT: RATIFIED — OWNER-ALIGNED / 2026-09-27
LESSONS_UPDATED: YES — material B1 findings are persisted in the experiment and CFA-10 state.
COMMONS: READ-ONLY — no Commons write attempted; no recoverable CFA-10 Commons signing key is exposed in this hosted connector session.
UNRESOLVED: Full signed-manifest B1 replay; regular-file target refusal; child-entry symlink semantics; manifest/source containment in verifyComposition; B4 recovery preservation per B1 case; native Windows/Bun path behavior; minimum byte-binding mechanism; K0/K0-adjacent placement.
BLOCKERS: Hosted session lacks an executable full BCP-dev/Bun checkout path, so target-runtime closure cannot be honestly claimed here.
BOUNDARIES_ACTIVATED: NO
OMEGA_LAW_CHANGED: NO
IMPLEMENTATION_STARTED: NO
NEXT_REQUIRED_STEP: Run RUNTIME-M1-B1-TARGET-RUNTIME-CLOSURE-2026-09-27 on an actual supported Ω runtime; preserve UNKNOWN for any unavailable platform behavior and do not choose a production containment mechanism until the signed-manifest corpus is replayed.
