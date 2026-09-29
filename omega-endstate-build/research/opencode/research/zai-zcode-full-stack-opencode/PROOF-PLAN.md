# Proof Plan

## Proof rule

A mechanism is **PROVEN** only when the OpenCode TUI can exercise it in a real session and the repository contains enough durable evidence to reconstruct the result.

## Checkpoints

### ZFOC-01 — TUI baseline

**Objective:** confirm the entire experiment starts and remains controllable from the normal OpenCode TUI.

Evidence:
- exact OpenCode version;
- exact invocation/config;
- session transcript or captured notes;
- successful bounded task start.

### ZFOC-02 — Full-stack skill

**Objective:** express the Z.ai full-stack workflow as an OpenCode Skill without introducing a second runtime.

Evidence:
- skill source;
- trigger/invocation method;
- one executed task;
- resulting artifacts.

### ZFOC-03 — Specialist decomposition

**Objective:** move at least one bounded phase into a dedicated OpenCode subagent.

Evidence:
- agent definition;
- delegation trace;
- worker output;
- parent-session integration result.

### ZFOC-04 — Tool realization

**Objective:** execute real repository/runtime operations through OpenCode tools or MCP rather than simulated outputs.

Evidence:
- command/tool trace;
- changed files;
- test/build/runtime result.

### ZFOC-05 — Verification loop

**Objective:** require the worker to inspect its own result through an explicit verification phase.

Evidence:
- verification checklist;
- failed or successful checks;
- correction pass when a check fails.

### ZFOC-06 — Model/provider separation

**Objective:** confirm the workflow remains valid when the configured model/provider changes.

Evidence:
- two provider/model runs, or one provider plus a documented controlled substitution;
- identical workflow contract;
- explicit differences recorded.

### ZFOC-07 — Human TUI continuity

**Objective:** confirm the user never needs to leave OpenCode TUI to direct, inspect or resume the work.

Evidence:
- session resume/re-entry;
- human intervention point;
- final evidence accessible from the session/repository.

## Exit condition

The experiment may move from **SETUP** to **CONVERGED** only when the workflow is reproducible and the remaining gaps are explicitly documented.

A successful single run is not sufficient proof of a general capability.
