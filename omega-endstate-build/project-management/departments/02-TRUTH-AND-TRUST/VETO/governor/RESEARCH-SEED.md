# VETO-01 Research Seed

Status: working synthesis, not law.
Date: 2026-09-28.

## Principle 1 — Independent review starts early

Independent assurance is most useful when it starts early enough to establish an independent understanding and identify risks before correction becomes expensive.

Transferable practice:

- get involved before commitment becomes costly;
- maintain independence from the producer;
- seek objective evidence;
- review products and processes across the lifecycle.

Primary source:
https://swehb.nasa.gov/spaces/SWEHBVD/pages/102695499/SWE-141%2B-%2BSoftware+Independent+Verification+and+Validation

## Principle 2 — Stop mechanisms can be productivity mechanisms

A stop should exist to trigger correction, not to accumulate permanent authority.

Transferable practice:

- stop only on meaningful abnormality;
- connect stop to diagnosis;
- make release conditions clear;
- measure the cost of stopping.

Reference:
https://global.toyota/en/company/vision-and-philosophy/production-system/

## Principle 3 — Separate validation from human authorization

Modern agent workflows distinguish automated checks from explicit human approval and can preserve resumable state across review.

Transferable practice:

- separate detection from authorization;
- place checks at consequential boundaries;
- preserve state across delayed decisions;
- do not make the reviewer the executor.

Primary source:
https://developers.openai.com/api/docs/guides/agents/guardrails-approvals

## Principle 4 — Structured principles improve critique

Constitutional-style supervision demonstrates that critique can be structured around explicit principles rather than vague preferences.

Transferable practice:

- declare the values/criteria being protected;
- make the critique inspectable;
- separate principles from the specific decision.

Reference:
https://www.anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback

## Principle 5 — Self-evolution requires empirical selection

Darwin Gödel Machine and AlphaEvolve provide relevant patterns for self-improving systems:

- explicit candidate variants;
- empirical evaluation;
- retained lineage/archive;
- parallel exploration;
- safety boundaries;
- human oversight.

Transferable practice:

> propose -> isolate -> evaluate -> compare -> preserve lineage -> decide -> activate

Do not assume that a self-change is beneficial because the model says it is.

Sources:
https://arxiv.org/abs/2505.22954
https://arxiv.org/abs/2506.13131

## Principle 6 — Evaluators themselves require evaluation

Research finds that LLM judges can show position bias, artifact sensitivity and sycophancy.

Transferable practice:

- reduce persuasive framing contamination;
- inspect evidence before advocacy when possible;
- repeat or cross-check difficult evaluations;
- measure reviewer errors;
- never treat one model's judgment as objective truth.

Sources:
https://aclanthology.org/2025.ijcnlp-long.18/
https://aclanthology.org/2025.acl-long.970/
https://aclanthology.org/2025.findings-emnlp.1222/

## Principle 7 — Durable decisions should preserve rationale and supersession

Lightweight decision records are useful because the reasoning behind a decision is otherwise lost to time and context-window churn.

Transferable practice:

- one consequential decision per durable record;
- record context, decision, consequences and status;
- preserve old records;
- supersede rather than silently rewrite.

Reference:
https://martinfowler.com/bliki/ArchitectureDecisionRecord.html

## Principle 8 — Real workloads are the test environment

The department should prefer evidence from actual VIVIM development work.

Toy benchmarks can illuminate mechanisms but cannot establish that a governance function accelerates the company's real mission.

## Meta-principle

Research findings are inputs.

They become operating practice only after adaptation, experiment and evidence in the current environment.
