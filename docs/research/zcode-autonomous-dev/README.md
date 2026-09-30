# ZCode Autonomous Dev — Source Lab

This branch is the concrete source-analysis lane for turning ZCode into a single-prompt, long-running autonomous development environment.

## Pinned upstreams

- `vendor/zcode` → `zai-org/ZCode` at `29628c9acdb81b703bbd4080c207a0e7ce5e276e`
- `vendor/symphony` → `openai/symphony` at `be10a1b79df723d6d7612b5651c8522704dafb2e`

These are Git submodules, so they are actual upstream repositories pinned to known commits rather than partial copies.

## ZCode documentation

The ZCode source snapshot contains 398 Markdown/text documentation files. The complete discovered-path inventory is recorded in `docs/research/zcode-autonomous-dev/ZCODE-DOCUMENTATION-INVENTORY.txt`.

The particularly relevant material includes ZCode agent/subagent contracts, plugin architecture, dynamic workflows, browser automation, MCP, skills, architecture governance, model/agent state, and the CLI runtime.

## Selected leverage repository

Symphony is the primary external implementation reference for this lane. The important idea is not to transplant Symphony wholesale, but to extract its durable orchestration model: explicit lifecycle state, scheduling, isolated workspaces, retry/recovery, and long-running worker sessions.

Supporting references are documented in `EVALUATION.md` and `SOURCES.md`.

## Target

One natural-language objective should be sufficient for ZCode to discover the system, decide what needs doing, generate the minimum useful team, route each task to an appropriate model/provider, execute in isolation, verify evidence, repair/replan on failure, integrate work, and continue until the completion gate is satisfied.

The system must distinguish “agent says done” from “objective is proven complete.”
