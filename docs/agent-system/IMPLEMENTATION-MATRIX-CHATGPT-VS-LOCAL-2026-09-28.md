# Implementation Matrix — ChatGPT vs Local OpenCode
## 2026-09-28

## Operating model

The system is dual-speed.

**DELIBERATE mode** is led by reasoning/audit surfaces and can involve multiple CFAs deeply.

**EXECUTION mode** is led by local OpenCode and uses one active execution CFA with on-call specialist consultation.

## I can implement or prepare here

### Deliberative support
- architecture and cross-CFA design analysis;
- research and evidence synthesis;
- falsifier and acceptance-test design;
- constitutional documentation;
- review of local receipts and runtime evidence.

### Repository implementation
Where repository tooling permits:
- master architecture documentation;
- compact execution-context templates;
- canonical AGENT-PROTOCOL;
- work-envelope schema and generator;
- receipt JSON schema and validator;
- completion-gate tests;
- documentation/current-state lint;
- Commons unit tests;
- bounded Commons semantic fixes;
- causal replay/handoff/identity/transport tests;
- Commons CLI improvements;
- metrics definitions and reporting code;
- migration/deprecation indexes.

### What I cannot prove here
I cannot honestly establish behavior that depends on the user's actual Windows/OpenCode runtime, local credentials/keys, authenticated sessions, concurrent local processes, or machine-specific configuration.

## Local OpenCode must execute and prove

### Deliberate mode
- real multi-CFA coordination when a local deliberation is assigned;
- actual Commons session independence and identity behavior;
- local evidence generation.

### Execution mode
- actual OpenCode version and permission semantics;
- exact requested-agent resolution with fail-closed behavior;
- real Steward -> active CFA -> worker chain;
- worker path/command containment;
- Windows shell/path behavior;
- signing key persistence/recovery;
- code/test execution;
- actual state/receipt update;
- branch/commit/re-read against current main;
- real task-to-verified-commit measurements.

### Commons
- concurrent append behavior;
- concurrent handoff claim resolution;
- transport failure visibility;
- complete v0 acceptance suite;
- two-process/multi-session behavior.

## Shared responsibility

| Area | ChatGPT / COORD-01 | Local OpenCode |
|---|---|---|
| Deliberation | Lead research, synthesis, audit | Execute bounded local investigations when assigned |
| Execution design | Define envelope and constraints | Validate against runtime capabilities |
| Code | Candidate/bounded repo edits where available | Primary executor |
| Tests | Design and candidate implementation | Actual environment proof |
| Receipts | Define schema and audit | Produce verified receipts |
| Metrics | Define measurements | Collect runtime measurements |
| Commons | Review and bounded fixes | Concurrency/runtime proof |
| Windows/OpenCode | Research/documentation only | Authoritative proof surface |
| Main integration | Review/audit | Branch, merge/integrate, re-read and verify |

## Local execution sequence

1. Fast-forward local work to current main; verify clean tree.
2. Read the dual-speed ratification and current agent-system truth.
3. Freeze new architecture-document creation except concrete acceptance gaps.
4. Classify the requested work DELIBERATE or EXECUTION.
5. For DELIBERATE, use the existing rich Steward/CFA model.
6. For EXECUTION, generate a bounded work envelope and activate one execution CFA.
7. Implement the M1 completion contract.
8. Prove exact-agent fail-closed behavior.
9. Complete one real bounded code corridor.
10. Return machine-valid receipt plus runtime metrics.
11. Only then continue context compaction and Commons hardening.

## Final operating contract

ChatGPT / COORD-01:
THINK / RESEARCH / AUDIT / DESIGN / CHALLENGE / FALSIFY.

Local OpenCode:
EXECUTE / TEST / MEASURE / COMMIT / PROVE.

Git main:
DURABLE STATE.

Commons:
COMMUNICATE, subject to its promotion gate.

Owner:
AUTHORIZE / PRIORITIZE / OVERRIDE.

The repository is the bridge; no surface may claim proof that another surface has not actually produced.
