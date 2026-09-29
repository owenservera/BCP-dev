# Ω Swarm + Product Evidence Matrix

> Status: ACCEPTANCE FRAMEWORK
> Date: 2026-09-29

## Evidence classes

### E1 — Runtime evidence

Proof that a mechanism actually executed.

Examples:
- process/session records;
- command output;
- event stream;
- test result;
- workspace inspection.

### E2 — Integration evidence

Proof that independently produced pieces work together.

Examples:
- integration test;
- clean-worktree run;
- cross-agent handoff;
- end-to-end execution trace.

### E3 — Product evidence

Proof that a user-relevant Ω capability works.

Examples:
- real browser conversation;
- persisted Vault record;
- resumed session;
- completed product journey.

### E4 — Evolution evidence

Proof that a swarm change improves the development system.

Examples:
- baseline/candidate comparison;
- repeated workload;
- regression suite;
- rollback drill;
- measured coordination or reliability improvement.

## Acceptance matrix

| Milestone | Minimum proof |
|---|---|
| M0 | isolated workspace + recoverable agent task + durable evidence |
| M1 | real Chrome session + observation + recovery evidence |
| M2 | real ChatGPT multi-turn conversation + local persistence + replay evidence |
| M3 | three provider realizations + normalized evidence + drift test |
| M4 | natural-language command → realization → outcome → Vault/evidence |
| M5 | leave/return continuity + lineage/reconstruction |
| M6 | external-world journey + authority + mutation/evidence controls |
| M7 | representative user journey on product shell |
| M8 | clean-environment beta install/use/recovery |
| M9 | swarm-built milestone + independent verification + self-evolution evidence |

## Swarm evolution acceptance

| Evolution stage | Required proof |
|---|---|
| E0 | substrate actually runs |
| E1 | resident recovery |
| E2 | isolated delegated workers |
| E3 | coordinated milestone |
| E4 | organization survives interruption |
| E5 | repeated product delivery |
| E6 | three successful self-improvements |
| E7 | dynamic capacity change |
| E8 | sustained autonomous operation with protected boundaries |
| E9 | repeated reliable Ω delivery + continuous evidence-backed evolution |

## Falsifiers

The program must explicitly treat these as falsifiers:

- shared checkout corruption;
- unrecoverable work after restart;
- false completion reports;
- inability to reconstruct why a change happened;
- self-evolution that cannot be rolled back;
- performance gains caused by easier workloads;
- increased agent count without increased useful throughput;
- product regressions caused by swarm optimization;
- durable state that depends on one live process;
- communication becoming an implicit authority mechanism.

A swarm that violates these conditions is not considered mature merely because it completes tasks.
