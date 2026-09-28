# R-05 — ClawTeam

Repository: https://github.com/HKUDS/ClawTeam

## Main finding

ClawTeam is a practical example of agent-native orchestration: a leader can spawn agents, assign dependency-aware work, agents communicate directly, humans inspect a board, and workers operate in isolated Git worktrees. citeturn918030view5turn884303view4

## Key mechanisms

- explicit spawn commands are callable by agents;
- workers receive dedicated identities and worktrees;
- task dependencies can automatically unblock downstream work;
- inbox communication is directly available to workers;
- a board exposes team state;
- execution capacity can be killed/recycled while work artifacts remain isolated.

## Best practices extracted

1. Give agents a small explicit operational vocabulary.
2. Make workspace isolation physical.
3. Represent dependencies outside model memory.
4. Keep human observability available during autonomy.
5. Recycle workers while preserving durable work artifacts.

## Ω translation

This strongly supports:

`resident -> bounded worker -> bounded worktree -> bounded tool surface`

It also reinforces the distinction between semantic ownership and machine resource allocation.

## Important limitation

ClawTeam intentionally favors autonomous operational control. Ω requires the stronger distinction:

`agent decides` != `agent is authorized`

Its spawn/inbox/worktree mechanisms are useful execution patterns, not an Ω authority model.

Primary source: https://github.com/HKUDS/ClawTeam
