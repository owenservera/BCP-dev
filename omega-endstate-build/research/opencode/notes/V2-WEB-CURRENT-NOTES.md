# Current OpenCode V2 web-documentation notes

Captured: 2026-09-28

These notes summarize the current public V2 documentation pages. They are intentionally separate from the repository V2 spec snapshot because the website is a living surface.

## Agents

Source: https://opencode.ai/v2/docs/agents

V2 uses `agents`, `permissions`, and `subagent` vocabulary. Primary agents run the main session; subagents run in child sessions. The parent controls which subagents may be launched, while the child uses its own configured permissions. Hidden controls discovery/visibility, not security. V2 explicitly says legacy V1 fields such as `permission`, `tools`, `prompt`, `temperature`, `top_p`, `disable`, and `maxSteps` should not be used in new V2 agent configuration.

## Permissions

Source: https://opencode.ai/v2/docs/permissions

Permissions are ordered rules over an action/resource pair with allow/deny/ask effects. The last matching rule wins. V2 falls back to `ask` when no rule matches. Global rules are loaded before agent-specific rules. A child uses its own configured permissions rather than automatically becoming a subset of the parent.

## Configuration

Source: https://opencode.ai/v2/docs/config

V2 moves toward plural `agents` and `permissions` structures and adds experimental policy controls for provider usage and hard-denying permission classes. The configuration page explicitly notes that some accepted fields are not yet fully active.

## Instructions

Source: https://opencode.ai/v2/docs/instructions

`AGENTS.md` is the active V2 persistent instruction mechanism. Nested instruction files are discovered as the agent explores relevant directories. Instructions are combined rather than conflict-resolved automatically. The V2 `instructions` config field exists in the schema but the current page states it does not yet resolve files/globs/URLs into model instructions.

This is highly relevant to a self-building team: context is discovered incrementally, and the team should not assume that putting arbitrary paths into configuration guarantees the model receives them.

## Skills

Source: https://opencode.ai/v2/docs/skills

Skills are progressive-disclosure units. OpenCode advertises permitted skill IDs/descriptions, then the agent loads a specific skill through the native skill tool. Supporting files are not injected wholesale; the agent reads them when needed. Skills can therefore be used as reusable operating procedures without permanently inflating every prompt.

## MCP

Source: https://opencode.ai/v2/docs/mcp-servers

OpenCode exposes MCP capabilities including tools, prompts, resources and instructions. The docs warn that MCP tools consume model context. Local and remote MCP servers are both supported, so the deployment boundary matters to sovereignty.

## Commands

Source: https://opencode.ai/v2/docs/commands

Commands can explicitly choose an agent/model and can opt into background child execution with `subagent: true`. This gives a project a declarative action surface above raw prompts.

## Compaction

Source: https://opencode.ai/v2/docs/compaction

V2 uses summary-based compaction. The summary is intended to preserve objective, requirements, decisions, completed/active work, blockers, next moves and relevant files. Earlier messages remain stored even when omitted from subsequent model context.

This means durable team state should not depend exclusively on the live model transcript.

## ACP / programmatic sessions

Source: https://opencode.ai/v2/docs/cli/acp/

ACP sessions have explicit working directories and can be created, loaded, resumed and forked. Session directory is authoritative for an existing session. Clients can change model and visible primary-agent selection during a session, and session activity streams text, reasoning, tools, permission requests and usage updates.

## Emerging architecture signal

Across the V2 docs, OpenCode is becoming more explicit about separate layers for:
`agent identity -> permissions/policy -> tools/skills/MCP -> child sessions -> persistent session state/context`.

Ω should investigate these primitives as separable interfaces rather than baking them into one monolithic “agent” abstraction.
