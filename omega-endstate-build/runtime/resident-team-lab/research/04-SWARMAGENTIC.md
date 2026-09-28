# R-04 — SwarmAgentic

Paper: https://arxiv.org/html/2506.15672
Code: https://github.com/yaoz720/SwarmAgenticCode

## Main finding

SwarmAgentic treats team organization itself as a search space. Candidate systems are generated, executed, evaluated, diagnosed, refined, and checkpointed through an iterative optimization loop. citeturn777962search0turn884303view3

## Key mechanisms

- generate candidate roles and collaboration plans from task + objective;
- execute candidate teams on sampled tasks;
- log interactions and evaluation outcomes;
- identify failure causes and coordination gaps;
- modify prompts/roles/topology;
- checkpoint candidate state and metrics;
- reuse the selected candidate for later evaluation. citeturn884303view3

## Best practices extracted

1. Make organization an explicit experimental variable.
2. Keep candidate generation separate from candidate evaluation.
3. Diagnose failures before choosing repairs.
4. Preserve checkpoints and metrics.
5. Separate optimization/search from the live production system.

## Ω translation

This belongs naturally in a future Forge/research plane:

`Live Team -> Candidate Team -> Execution Corpus -> Evaluation -> Promotion Candidate`

The live resident team should not continuously mutate itself by optimizer feedback during consequential work.

## Important limitation

SwarmAgentic optimizes task performance. Ω also needs sovereignty, identity continuity, authority, evidence, and safe-execution constraints. A higher benchmark score therefore cannot be the sole promotion criterion.