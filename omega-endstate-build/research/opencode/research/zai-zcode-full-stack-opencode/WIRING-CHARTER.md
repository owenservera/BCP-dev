# Wiring Charter

## Question

> Can the useful ZCode full-stack-agent pattern be expressed as an OpenCode-native capability while OpenCode remains the sole user TUI and agent control surface?

## Constraints

### Preserve

- OpenCode TUI remains the human interaction surface.
- OpenCode remains the execution/session substrate.
- Existing `AGENTS.md`, project instructions, permissions and repository authority remain in force.
- Research stays isolated from production Ω code.
- Provider/model selection remains external to the procedural skill.
- Every experimental conclusion must be backed by observable evidence.

### Do not do

- Do not embed ZCode's TUI.
- Do not create a second orchestration daemon just to reproduce the workflow.
- Do not fork or silently vendor ZCode.
- Do not declare architectural equivalence from prompt similarity alone.
- Do not promote an experiment into Ω runtime law without a separate reconciliation decision.
- Do not treat model output as evidence of implementation correctness.

## Candidate mapping to investigate

| ZCode / Z.ai pattern | OpenCode candidate | Status |
|---|---|---|
| Long-running goal loop | Session + todo/goal discipline + explicit verification loop | PROVE |
| Full-stack procedure | OpenCode Skill | PROVE |
| Specialized workers | OpenCode subagents | PROVE |
| Reusable capability package | OpenCode plugin / skill | PROVE |
| External capabilities | OpenCode MCP / tools | PROVE |
| Browser-based realization | OpenCode browser capability / MCP | PROVE |
| Git-aware work | Native repository/Git tooling | PROVE |
| Permission gating | OpenCode permissions | PROVE |
| Persistent human TUI | OpenCode TUI/session | BASELINE |
| Model layer | OpenCode provider/model config | BASELINE |
| Automatic goal completion | ZCode-specific behavior | OPEN QUESTION |
| Recursive team spawning | Not assumed available | OPEN QUESTION |

## Working architecture

```
                 ┌──────────────────────┐
                 │      USER / TUI      │
                 │     OpenCode TUI     │
                 └──────────┬───────────┘
                            │
                    OpenCode session
                            │
                 ┌──────────▼───────────┐
                 │  Primary OpenCode    │
                 │       Agent          │
                 └──────────┬───────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
        full-stack       specialist    verification
           Skill          subagents       workers
              │             │             │
              └─────────────┼─────────────┘
                            │
                tools / MCP / plugins
                            │
                 repo + runtime + browser
                            │
                     evidence / review
```

The model is deliberately omitted from the control-flow diagram because it is a replaceable provider dependency, not the user-facing runtime.

## Required output

The research lane must eventually produce:

- a proven wiring recipe;
- a minimal working configuration;
- a capability-by-capability mapping;
- proof artifacts for each non-trivial claim;
- known gaps versus ZCode;
- anti-patterns discovered during integration;
- a recommendation for what, if anything, is reusable by the Ω swarm.

No production implementation is required to complete the research.
