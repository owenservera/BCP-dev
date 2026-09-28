# OpenCode Source Index

> Reviewed: 2026-09-28

## A. Official OpenCode documentation

| ID | Source | Why it matters |
|---|---|---|
| OC-D01 | https://opencode.ai/docs/agents | Agent definitions, modes, permissions, task targeting. |
| OC-D02 | https://dev.opencode.ai/docs/config/ | `default_agent`, `subagent_depth`, configuration surface. |
| OC-D03 | https://dev.opencode.ai/docs/permissions/ | V1 permission actions and target matching. |
| OC-D04 | https://dev.opencode.ai/docs/plugins/ | Plugin hooks, events, custom tools, SDK context. |
| OC-D05 | https://opencode.ai/docs/skills/ | Skill discovery, loading, and skill permission boundaries. |
| OC-D06 | https://opencode.ai/docs/commands/ | Custom commands and command-triggered subagents. |
| OC-D07 | https://opencode.ai/docs/custom-tools/ | Project-local custom tools and execution context. |
| OC-D08 | https://opencode.ai/v2/docs/permissions | V2 permission model; useful as migration/watch material, not V1 proof. |
| OC-D09 | https://opencode.ai/v2/docs/build/plugins | V2 plugin/hook model; use to detect future migration changes. |
| OC-D10 | https://opencode.ai/v2/docs/commands | V2 command/subagent semantics. |

## B. Exact OpenCode v1.18.4 source

These are the pinned source references for U1.

| ID | File | Specific relevance |
|---|---|---|
| OC-S01 | https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/tool/task.ts | Native Task flow, depth check, permission ask, target resolution, fresh vs resumed sessions, foreground/background behavior. |
| OC-S02 | https://github.com/anomalyco/opencode/blob/v1.18.4/packages/core/src/v1/config/permission.ts | V1 permission schema and preserved property ordering. |
| OC-S03 | https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/permission/index.ts | Last-match wildcard permission evaluation. |
| OC-S04 | https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/session/tools.ts | Generic tool execution path and plugin hook position. |
| OC-S05 | https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/plugin/index.ts | Plugin loading and hook/event execution. |
| OC-S06 | https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/session/session.ts | Session model including parentID, agent, directory, permissions, metadata. |
| OC-S07 | https://github.com/anomalyco/opencode/blob/v1.18.4/packages/opencode/src/agent/subagent-permissions.ts | Derivation of child-session restrictions, including default Task deny. |

## C. Current release / version watch

| ID | Source | Use |
|---|---|---|
| OC-V01 | https://github.com/anomalyco/opencode/releases/tag/v1.18.33 | Current release snapshot as of 2026-09-28. |
| OC-V02 | https://github.com/anomalyco/opencode/releases | Release stream and drift trigger. |
| OC-V03 | https://github.com/anomalyco/opencode/tree/dev | Current implementation, useful only as a forward-looking comparison. |

## D. Failure-class / edge-case watch

| ID | Source | Research relevance |
|---|---|---|
| OC-I01 | https://github.com/anomalyco/opencode/issues/33334 | Task schema can expose targets outside an active task allow-list; reinforces schema != authorization. |
| OC-I02 | https://github.com/anomalyco/opencode/issues/41681 | Task resume can retain prior subagent permissions in current development. Resume must remain a separately qualified feature. |
| OC-I03 | https://github.com/anomalyco/opencode/issues/17721 | Global Task permission can defeat intended recursion bounds; explicit target/depth policy matters. |
| OC-I04 | https://github.com/anomalyco/opencode/issues/18100 | Windows report of recursive subagent behavior; useful anti-pattern/reproduction context. |
| OC-I05 | https://github.com/anomalyco/opencode/issues/39086 | Windows/OpenCode Desktop report where Task tool exposure did not match explicit task permissions. |
| OC-I06 | https://github.com/anomalyco/opencode/issues/48232 | Current ACP report where Task-child permission requests can be dropped; relevant to future headless/ACP execution surfaces. |
| OC-I07 | https://github.com/anomalyco/opencode/issues/26747 | Older Windows report on subagent permission inheritance; historical failure class only. |

## E. Known-working OpenCode ecosystems

| ID | Source | Why retained |
|---|---|---|
| OC-K01 | https://github.com/ibraheem-111/opencode-swarm | OpenCode plugin + SDK swarm with shared memory, persistence, messaging, notifications; vendored locally. |
| OC-K02 | https://github.com/lovicho/oh-my-opencode | Current orchestration example using Task, team mode, background children, workflow/DAG concepts, and specialist agents. |
| OC-K03 | `../../vendor/opencode-swarm/` | Exact locally retained implementation, tests, and Windows adaptations used as the fallback substrate. |

## F. Local lab surfaces

| Path | Purpose |
|---|---|
| `../../config/opencode.team-lab.jsonc` | Isolated V1 team configuration. |
| `../../plugin/resident-team.ts` | Current observation-only plugin wrapper. |
| `../../scripts/` | Windows probes. |
| `../../docs/CHECKPOINTS.md` | Capability proof sequence. |
| `../../docs/FIRST-MAJOR-UPGRADE-DESIGN.md` | U1 proposed design. |
| `../../docs/FIRST-MAJOR-UPGRADE-RESEARCH-BASIS.md` | Detailed U1 evidence basis. |

## Source discipline

A source in this index is not automatically a recommendation.

For every important claim preserve:

`source -> exact observation -> scope/version -> limitation -> Ω implication -> falsifier`
