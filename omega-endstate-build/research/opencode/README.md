# OpenCode Research Corpus

## Purpose

Durable research corpus for the Ω End-State Build Team's local OpenCode-based agentic development system.

This corpus is intentionally divided into:
- `official/` — primary OpenCode documentation/specification snapshots.
- `research/` — additional official/adjacent research collected after the primary snapshot.
- `notes/` — synthesized findings, comparisons, and implications for Ω.

## Primary source snapshot

Repository: https://github.com/anomalyco/opencode
Captured commit: `03e67171ab2dc1e7f16e8cebfbc7f778f61b89f0`
Captured: 2026-09-28

## Current primary corpus

- `official/OFFICIAL-V1-CORE.md` — agents, config, permissions, rules, tools, custom tools, plugins, MCP, commands, CLI.
- `official/OFFICIAL-ADDITIONAL.md` — skills, SDK, models, providers, web, TUI, LSP, formatters, server, ACP.
- `official/OFFICIAL-V2-SPECS.md` — v2 configuration, tools, sessions, plugin/config lifecycle, instructions, providers, schema evolution, todo, API.

## Version discipline

OpenCode's public operational documentation and its v2 specifications are not the same thing. The v2 material is treated as evolving design evidence. A later research note must identify whether a claim is:
1. current/stable operational behavior,
2. current upstream source behavior,
3. v2 specification/design intent, or
4. external/adjacent research.

## Collection rule

Prefer primary sources and exact source refs. Do not turn examples, defaults, or current implementation details into Ω architecture without independent reasoning and evidence.
