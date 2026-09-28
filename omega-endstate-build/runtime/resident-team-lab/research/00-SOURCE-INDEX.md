# Research Source Index

> Retrieval status: primary sources inspected 2026-09-28

| ID | Source | Research | Code / implementation | Role in this study |
|---|---|---|---|---|
| R-01 | Meta-Team | https://arxiv.org/abs/2605.29790 | https://github.com/zz-haooo/Meta-Team | collaborative self-evolution |
| R-02 | OneManCompany | https://arxiv.org/abs/2604.22446 | https://github.com/1mancompany/OneManCompany | organization + heterogeneous runtime |
| R-03 | Swarm Skills | https://arxiv.org/abs/2605.10052 | JiuwenSwarm reference discussed by paper | portable coordination assets |
| R-04 | SwarmAgentic | https://arxiv.org/abs/2506.15672 | https://github.com/yaoz720/SwarmAgenticCode | automated team search/evolution |
| R-05 | ClawTeam | practical framework | https://github.com/HKUDS/ClawTeam | practical agent-native orchestration |
| O-01 | OpenCode substrate | https://opencode.ai/docs/ | https://github.com/anomalyco/opencode | native execution host for the resident-team program |
| O-02 | opencode-swarm | — | https://github.com/ibraheem-111/opencode-swarm | known-working plugin + SDK swarm, vendored locally |
| O-03 | oh-my-opencode | — | https://github.com/lovicho/oh-my-opencode | current native OpenCode orchestration/team example |
| O-04 | Local OpenCode lab | — | `opencode/` | versioned substrate, Windows, U1 evidence and experiment map |

## R-01 — Meta-Team

Paper: https://arxiv.org/html/2605.29790v1
Code: https://github.com/zz-haooo/Meta-Team

Key observations:

- distributed MAS experience contains local agent trajectories plus cross-agent events;
- flattening the full trajectory into one analyzer can recreate the context bottleneck;
- collaborative attribution preserves local context while restoring cross-agent awareness;
- evolution is separated into agent-level, interaction-level, and team-level scopes;
- the implementation uses evolve -> freeze -> held-out test.

## R-02 — OneManCompany

Paper: https://arxiv.org/html/2604.22446v1
Code: https://github.com/1mancompany/OneManCompany

Key observations:

- Talent separates durable agent package from runtime Container;
- Employee composes Talent + Container under lifecycle management;
- E²R separates Explore, Execute, Review;
- task state is represented as a tree plus dependency graph;
- completed work requires acceptance before dependencies unblock;
- retry and escalation are bounded;
- company-wide lifecycle includes recruitment, review, coaching, offboarding, meetings, cost accounting, and project iteration.

## R-03 — Swarm Skills

Paper: https://arxiv.org/html/2605.10052v1

Key observations:

- coordination is specified as a portable asset, not a runtime;
- progressive disclosure keeps initial context small;
- evolution experience is stored separately from the base skill;
- CREATE -> USE -> PATCH forms a continuous learning loop;
- friction is explicitly captured;
- evolution records use Effectiveness, Utilization, and Freshness;
- SIMPLIFY, REBUILD, and ROLLBACK address accumulation and drift;
- authors explicitly identify fault tolerance, routing, isolation, and broad conformance testing as open problems.

## R-04 — SwarmAgentic

Paper: https://arxiv.org/html/2506.15672
Code: https://github.com/yaoz720/SwarmAgenticCode

Key observations:

- candidate teams are generated from task + objective;
- candidates execute on sampled tasks;
- failures are diagnosed;
- roles, prompts, and topology can be updated;
- candidate state and metrics are checkpointed for later evaluation;
- best-performing candidates are exported for reuse.

## R-05 — ClawTeam

Repository: https://github.com/HKUDS/ClawTeam

Key observations:

- agents can spawn agents through explicit CLI primitives;
- workers receive dedicated worktrees, execution surfaces, and identities;
- dependencies and task state are explicit;
- inbox-based peer communication is agent-accessible;
- humans retain a live observability surface;
- workers can be recycled while preserving isolated worktrees.

## Interpretation rule

Implemented by a source system does not mean appropriate for Ω. Every mechanism is evaluated separately for execution utility, governance implications, evidence quality, and sovereignty.