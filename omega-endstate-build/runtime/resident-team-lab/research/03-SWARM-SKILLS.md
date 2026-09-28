# R-03 — Swarm Skills

Paper: https://arxiv.org/html/2605.10052v1

## Main finding

Swarm Skills treats multi-agent coordination as a portable description artifact rather than a runtime. It uses progressive disclosure and attaches evolution experience to the coordination asset itself. citeturn952603view1

## Key mechanisms

- machine-readable frontmatter identifies a swarm skill and roles;
- natural-language workflow remains consumable by agents;
- detailed role/workflow content loads progressively;
- `evolutions.json` records runtime evolution experience;
- CREATE -> USE -> PATCH forms the evolution lifecycle;
- friction such as redundant communication, cycles, and premature termination becomes explicit input;
- Effectiveness, Utilization, and Freshness are used to curate accumulated evolution records;
- SIMPLIFY, REBUILD, and ROLLBACK prevent evolution history from becoming permanently bloated or unsafe. citeturn952603view2turn918030view3

## Best practices extracted

1. Make coordination independently versionable from execution.
2. Use progressive disclosure to control context.
3. Store evolution experience separately from the stable base.
4. Convert coordination friction into structured records.
5. Require curation, rebuild, and rollback paths.
6. Qualify portability on real hosts rather than assuming it.

## Ω translation

Potential future Ω asset:

`Coordination Asset + Version + Evolution Records + Evidence + Promotion State`

This is particularly relevant to the Ω everything-is-plugin direction: coordination behavior could eventually be a portable governed capability rather than hard-coded runtime orchestration.

## Important limitation

The paper explicitly acknowledges unresolved large-scale conformance testing and open problems around fault tolerance, message routing, and inter-agent isolation. citeturn591787view4 Those are exactly the areas Ω must prove independently.