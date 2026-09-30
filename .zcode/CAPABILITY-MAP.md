# ZCode capability map — mastery-gate deliverable

> Status: ACTIVE evidence document · produced 2026-09-30 by the Steward session, per the
> owner's Universal Charter ("ZCode Mastery Gate": capability discovery before team design).
> Sources: built-in `zcode-configuration-guide` skill + direct inspection of this environment
> (config files, skill roots, plugin cache, workflow journal) + capabilities exercised in
> sessions of 2026-09-29/30. Discrepancies between the charter's assumed capabilities and the
> observed environment are recorded at the end.

## Environment inventory (verified 2026-09-30)

- User config `~/.zcode/cli/config.json`: only `github@zcode-plugins-official` explicitly
  enabled; no user MCP servers, no user hooks, no skill/command overrides.
- Workspace config `.zcode/config.json`: **absent** — no workspace-scoped MCP/hooks.
- User skills: `~/.agents/skills/` (large third-party set, ~100 skills incl. the caveman,
  writing, tdd, debugging families). No `~/.zcode/skills/`.
- Workspace skills/commands: none.
- Official plugins in cache: browser-use, documents (docx/pdf/xlsx/pptx), github,
  presentations, skill-creator, spreadsheets, zcode-guide.
- No user `~/.zcode/AGENTS.md`; workspace `AGENTS.md` is the operative instruction file.
- MCP fallback `~/.agents/mcp.json`: absent. **No MCP servers configured anywhere.**

## Capability map

| Capability | What it is / config | Precedence & scope | Verified | Team disposition |
|---|---|---|---|---|
| **AGENTS.md** | Instruction file loaded into context. Workspace file searched upward from cwd to project root | User first, workspace second (workspace narrows/overrides) | Yes — repo AGENTS.md is in context every session | **Use.** Already carries the non-hanging protocol, authority hierarchy, cold-start chain. Keep lean; push detail to peer docs it can link |
| **Memory** | Per-project file memory at `~/.zcode/cli/memories/projects/<key>/memory/`, index in MEMORY.md | Session-scoped recall, cross-session persistence | Yes — 4 memories from 2026-09-29 recalled at cold start | **Use** for owner directives + standing-state pointers. Repo remains durable truth; memory only points |
| **Skills** | Directory + SKILL.md; discovered at user `.zcode`→`.agents`→workspace `.zcode`→`.agents`→plugins | First same-named skill in discovery order wins (path identity) | Yes — invoked `zcode-configuration-guide` today | **Use selectively.** Most of the ~100 user skills are third-party noise for this lane. Team-specific skills belong in `<repo>/.zcode/skills/` when a recurring procedure outgrows a doc |
| **Commands** | `.md` files in commands roots; nested dirs join as `name:sub` | First match wins, user overrides workspace | Verified absent (no commands configured) | **Avoid for now** — the team's recurring actions are workflows/automations, not slash commands. Revisit if a human-facing trigger is needed |
| **Subagents (Agent tool)** | General-purpose + Explore + judge specialists (documents/pdf/presentations/spreadsheets); parallel dispatch, background runs | Spawned fresh with self-contained prompt; result returns as tool result | Yes — foundation of every omega workflow | **Use heavily** (owner token-economy directive: fan out, narrow typed results, paths not contents) |
| **Plugins** | Directory + `.zcode-plugin/plugin.json`; can package skills/commands/hooks/MCP/agents; state in user config | Plugin components at lowest skill precedence; hooks auto-enable the runner | Partial — plugin cache inspected, official plugins active | **Use official ones already active** (github, documents, browser-use, zcode-guide). Build our own only when a gap proves durable |
| **MCP** | Servers in user config / workspace config / `.agents/mcp.json` fallback | User overrides workspace for same-named; all scopes auto-connect at session start | Verified: none configured | **Deliberately empty.** GitHub access is via the github plugin + gh CLI. Add an MCP server only when a real external capability is needed |
| **Hooks** | 7 events (SessionStart, UserPromptSubmit, PreToolUse, PermissionRequest, PostToolUse, PostToolUseFailure, Stop); config hooks need `hooks.enabled: true` | User + workspace config; plugin hooks appended | Not exercised | **Hold.** Invariants are currently enforced by workflow structure (read-only workers, deterministic gates). Revisit when an invariant must hold outside workflows (e.g. block writes to `bcp-speed/bcp/state` outside prescribed tooling) |
| **Dynamic workflows** | Saved `*.dwf.ts` in `.zcode/workflows/`; typechecked scripts orchestrating subagents with control flow, cache-on-amend, journal per project | Runs survive/resumable across sessions; AmendWorkflow supersedes with warm cache | Yes — 6 runs in journal; one amend/resume chain observed; two live peer runs | **Primary mechanism.** The team's operational units. Rules that held: `maxDepth` spawn grants, narrow typed results, deterministic `world.run` gates |
| **Cron automations** | Persistent schedules in host; cron or delayMinutes; survive restarts. **Limit verified 2026-09-30: one CronCreate per session** — a second is refused ("session already belongs to a scheduled task"); each new automation needs a fresh session | Workspace-bound; run in fresh sessions | Yes — standup (2026-09-29) + completion-gate audit (2026-09-30) exist | **Use** for the standing duty cycles; budget one new automation per session. Automations must prompt the *final work directly* (no nested scheduling) |
| **OffPeak tasks** | One-off deferred idle-capacity tasks | Runs later unattended in same session lineage | Not exercised | **Use on request** for heavy deferred jobs (deep audits, doc passes) |
| **Browser automation** | browser-use plugin: control-browser + web-gui-tester skills | Skill-invoked; Node REPL-backed | Not exercised in this lane | **Use when WS-3 dashboard** needs verification. Nothing browser-facing exists yet in the Ω core |
| **Terminal / background execution** | Bash tool gated on pipe EOF, NOT process exit; Windows overlapped pipes + 8KB buffer + Job Objects make hangs real | `timeout` does not fix held-open pipes | Yes — AGENTS.md non-hanging protocol is hard-won evidence | **Follow AGENTS.md protocol always**: redirect to files, no `Select-Object -First`, split spawn/verify calls, cmdlets for inspection |
| **Git integration** | github plugin (pr/issue/commit skills) + gh CLI; branches-for-changes convention in AGENTS.md | Commons ≠ branches; never merge to communicate | Yes — plugin enabled; Commons protocol documented | **Use** per AGENTS_CONTEXT/GIT-AND-GITHUB-AGENT-PROTOCOL.md |
| **Models** | One `subagent_model` per workflow run; session model is owner's choice | Owner directive 2026-09-29: all workflow subagents on `new-provider/space-bunny-free` (Zen free tiers broken: network_error/timeout observed live on 2026-09-30) | Yes — live failure observed on WS-1.1 | **Enforce**: every workflow invocation passes the directive model; watch for regressions to Zen tiers |

## Charter-vs-environment discrepancies (recorded, not resolved silently)

The Universal Charter names capabilities from its OpenCode-era template that this ZCode
environment does not expose as such:

| Charter term | Observed reality | Disposition |
|---|---|---|
| "Goal Mode / long-horizon execution" | No Goal primitive; equivalent = saved workflow run in background + cron automations + OffPeak tasks | Map the need onto those three; record if a gap appears |
| "Remote Development (SSH/Docker)" | Not present in this environment | N/A — record as platform condition, never converted to PASS |
| "Command Center / integrated ADE" | ZCode desktop/client surface exists but is not agent-inspectable; agent operates via tools | Treat as human-side surface; agent evidence comes from tools/journal |
| "one scheduled task per session" (old TEAM/board notes) | **True here** — verified 2026-09-30: a second CronCreate in one session is refused | Confirmed; each new cadence automation needs a fresh session |

## Bootstrap exercises (evidence the gate was worked, not skimmed)

2026-09-29: five workflows authored + run (sweep 18.3M tok, board session 13.3M tok), cron
standup created, TEAM/board/workstream charters written. 2026-09-30: completion-gate audit
automation created; one-per-session limit discovered live (second CronCreate refused);
skill invocation verified against config docs; environment inventory inspected; model-policy
violation caught live in a peer run; board charter ratified by owner instruction.