# Implementation Matrix — ChatGPT vs Local OpenCode
## 2026-09-28

## Operating model

ChatGPT web applications and local OpenCode are **peer work surfaces**, not fixed roles.

Both can support DELIBERATE and EXECUTION work.

The important distinction is evidence capability, not permitted intellectual depth.

## DELIBERATE mode

### ChatGPT webapps can
- perform deep architectural research;
- synthesize multiple CFA perspectives;
- challenge assumptions;
- design falsifiers and acceptance criteria;
- inspect repository truth;
- review local results;
- prepare or perform bounded repository edits where tooling permits.

### Local OpenCode can
- perform deep architectural reasoning;
- read the full local corpus and runtime;
- run local experiments;
- coordinate multiple CFA sessions;
- investigate implementation realities;
- challenge and revise proposed designs through evidence.

### Shared principle

Neither surface is the thinker and neither surface is the doer.

The owner chooses the surface that has the evidence, tooling or context required for the current step.

## EXECUTION mode

### ChatGPT webapps can
- prepare execution briefs;
- inspect and modify bounded repository artifacts where tooling permits;
- design tests and validators;
- review implementation receipts;
- audit changed paths and evidence;
- identify architectural surprises that should return to deliberation.

### Local OpenCode can
- execute the local work corridor;
- run tests and commands;
- validate OpenCode-specific behavior;
- measure local execution;
- commit and verify against local main;
- prove Windows/local-runtime properties.

### Important distinction

Local OpenCode has authoritative access only for claims that require its actual runtime.

ChatGPT can perform real repository work and real verification within its accessible environment; it simply must not claim evidence from a local environment it did not execute.

## Mode/surface matrix

| | DELIBERATE | EXECUTION |
|---|---|---|
| ChatGPT webapp | deep research, multi-CFA synthesis, audit, falsification, bounded repo work | bounded repo work, validators, evidence review, preparation, some implementation |
| Local OpenCode | deep research, full-corpus reasoning, local experiments, multi-CFA deliberation | local implementation/proof, tests, runtime behavior, commits |
| Cross-surface | transfer questions/evidence through durable lineage | handoff implementation or audit across surfaces |

## Surface switching contract

When moving work between surfaces, preserve goal_id, work_id, mode, source revision, current STATE, unresolved questions, evidence references, session identity and attempt identity.

A surface switch must not silently fork authority or create a competing task.

## Local runtime proof boundary

Claims about OpenCode version/behavior, Windows path/shell behavior, local credentials or keys, concurrent local processes, local authenticated sessions, or machine-specific performance require evidence from the local runtime that actually exercised the condition.

## Local master sequence

1. Fast-forward to current main and verify clean tree.
2. Load current durable context and classify MODE.
3. Select the surface based on evidence/tooling needed, not on mode.
4. For DELIBERATE, load the rich context required by the question.
5. For EXECUTION, generate a right-sized envelope and bounded corridor when appropriate.
6. Implement M0/M1.
7. Prove exact-agent fail-closed behavior where the runtime allows it.
8. Complete one bounded execution corridor.
9. Return machine-valid receipt and measurements.
10. Re-read the delivery ref and preserve continuity for the next surface.

## Final contract

ChatGPT:
THINK / RESEARCH / AUDIT / DESIGN / CHALLENGE / FALSIFY / BOUNDED-IMPLEMENT.

Local OpenCode:
THINK / RESEARCH / AUDIT / DESIGN / CHALLENGE / FALSIFY / EXECUTE / TEST / MEASURE / COMMIT / PROVE.

Git main:
DURABLE STATE.

Commons:
COMMUNICATE, subject to its promotion gate.

Owner:
SELECT SURFACE / SELECT MODE / AUTHORIZE / PRIORITIZE / OVERRIDE.

No surface may claim evidence it did not actually produce.
