# R-01 — Meta-Team

Source: https://arxiv.org/html/2605.29790v1
Code: https://github.com/zz-haooo/Meta-Team

## Main finding

Meta-Team argues that MAS should evolve as a team, preserving agent-local execution context and connecting it through post-task communication instead of flattening all experience into one giant analyzer context. The paper presents agent-level, interaction-level, and team-level evolution as distinct scopes. citeturn132580view0turn591787view0

## Key mechanisms

- local execution trajectories remain associated with the agents that produced them;
- cross-agent communication provides evidence needed for attribution;
- agent-level evolution changes individual scaffolds;
- interaction-level evolution changes teammate understanding/collaboration;
- team-level evolution changes organization and shared constitution;
- implementation uses an evolve -> freeze -> holdout-test pipeline.

## Best practices extracted

1. Keep local context instead of flattening every trace.
2. Preserve causal relationships between agents' outputs and downstream decisions.
3. Classify changes by scope before applying them.
4. Separate evolution generation from final promotion.
5. Test evolved teams on held-out work.

## Ω translation

Future Ω self-knowledge should distinguish:

`agent-local lesson` -> `relationship lesson` -> `team coordination lesson` -> `team composition proposal` -> `constitutional proposal`

An agent can surface evidence for a team-level change without acquiring unilateral authority to change Ω law.

## Important limitation

The paper's empirical results support its method under its stated benchmarks and setup; they do not prove the method is appropriate for Ω. The transferable contribution is primarily the evidence organization and multi-scale evolution structure, not the specific prompts or optimizer.

Primary source: https://arxiv.org/html/2605.29790v1
