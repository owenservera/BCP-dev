# Z.ai / ZCode Full-Stack Wiring for OpenCode

> Status: RESEARCH WORKSTREAM — SETUP COMPLETE
> Date: 2026-09-29
> Parent corpus: `omega-endstate-build/research/opencode/`
> Branch: `work/omega-endstate/COORD-01/opencode-research`

## Mission

Determine and prove the smallest practical way to reproduce the useful parts of Z.ai's ZCode full-stack-agent pattern **inside the existing OpenCode stack**, while keeping:

- **OpenCode as the user's TUI and primary agent control surface**;
- OpenCode's native sessions, permissions, skills, subagents, plugins, MCP and tooling as the substrate;
- the model/provider layer configurable rather than embedding a second agent runtime;
- the work isolated as an empirical research lane until its mechanisms are proven.

This is a wiring/proof workstream, not a redesign of the Ω architecture.

## Important terminology

OpenCode is an **agent runtime/harness and TUI**, not itself an LLM. In this workstream:

```
USER
  ↓
OpenCode TUI
  ↓
OpenCode primary agent / session
  ↓
ZCode-inspired full-stack skill + bounded subagents
  ↓
OpenCode tools / MCP / plugins / browser / Git
  ↓
verification + evidence
```

The LLM/model is selected through OpenCode's provider/model mechanism. A GLM model may be used for empirical comparison, but this workstream must not hard-bind the architecture to GLM.

## What we are wiring

The initial target is the **procedural capability** demonstrated by Z.ai's full-stack application workflow:

1. ingest a product requirement / task;
2. inspect supplied references and repository context;
3. produce an explicit implementation plan/design;
4. implement across frontend/backend/data boundaries;
5. exercise the result through real tools;
6. verify behavior and presentation;
7. leave reproducible startup/test/review evidence.

The question is how much of that behavior can be expressed as OpenCode-native **skills + agents + tools + checkpoints**, without importing ZCode as a second TUI/runtime.

## Source anchors

- ZCode: https://github.com/zai-org/ZCode
- ZCode Agent docs: https://zcode.z.ai/en/docs/agents
- ZCode subagents: https://zcode.z.ai/en/docs/subagents
- GLM Skills: https://github.com/zai-org/GLM-skills
- Full-stack skill: https://github.com/zai-org/GLM-skills/tree/main/skills/glmv-prd-to-app
- OpenCode corpus: `../`

## First proof objective

Build the smallest OpenCode-native reproduction that can take one bounded full-stack task from **request → implementation → verification → evidence**, entirely from the user's normal OpenCode TUI session.

No production Ω integration is implied by passing this experiment.
