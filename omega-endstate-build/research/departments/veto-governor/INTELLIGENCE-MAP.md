# VETO-01 Intelligence Map

This is a map of where knowledge comes from, not a list of authorities.

Every source must be re-checked against current state before being used for a consequential conclusion.

## Tier 0 — Mission and local department state

Read first:

- MISSION-AND-BOUNDARIES.md
- STATE.json
- TASK-QUEUE.md
- AUTHORITY-REVIEW-MODEL.md
- CONCEPTUAL-COMMITMENT-BOUNDARY.md
- VETO-PROTOCOL.md

## Tier 1 — Current Ω End-State Build control plane

- omega-endstate-build/README.md
- omega-endstate-build/AGENTS.md
- omega-endstate-build/STEWARD-BOOTSTRAP.md
- omega-endstate-build/team/README.md
- omega-endstate-build/team/AGENT-ROSTER.json
- omega-endstate-build/state/TEAM-STATE.json

## Tier 2 — Current experimental runtime

Inspect, do not assume:

- omega-endstate-build/runtime/resident-team-lab/README.md
- omega-endstate-build/runtime/resident-team-lab/plugin/resident-team.ts
- omega-endstate-build/runtime/resident-team-lab/config/opencode.team-lab.jsonc
- omega-endstate-build/runtime/vendor/opencode-swarm/README.md
- omega-endstate-build/runtime/vendor/opencode-swarm/plugin/swarm.ts
- omega-endstate-build/runtime/vendor/opencode-swarm/src/

## Tier 3 — Existing BCP organizational substrate

Inspect as prior art and counterexample:

- AGENTS_CONTEXT/AGENT-COMMONS/runtime/
- AGENTS_CONTEXT/AGENT-COMMONS/
- .opencode/agents/
- .opencode/opencode.json
- docs/agent-system/WORKER-CATALOG-2026-09-28.md
- docs/agent-system/
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/

The existing 10-CFA system is not assumed to be the destination for this path.

## Tier 4 — Ω and legacy VIVIM evidence

Use to understand capabilities, failures, accumulated knowledge and counterexamples:

- omega-baseline/omega-final/
- vivim-original-baseline/
- legacy VIVIM evidence and experiments

Do not equate reuse with obligation.

## Tier 5 — External research

### Independent assurance

NASA IV&V emphasizes technical independence, lifecycle-wide review, objective evidence and early risk discovery.

https://swehb.nasa.gov/spaces/SWEHBVD/pages/102695499/SWE-141%2B-%2BSoftware+Independent+Verification+and+Validation

### Human review and guardrails

OpenAI's current agent guidance distinguishes automatic guardrails from human approval and supports resumable review states.

https://developers.openai.com/api/docs/guides/agents/guardrails-approvals

### Decision records

Martin Fowler's 2026 ADR guidance emphasizes short, durable decision records with status, rationale, consequences and supersession rather than rewriting history.

https://martinfowler.com/bliki/ArchitectureDecisionRecord.html

### Self-improvement

Darwin Gödel Machine explores open-ended self-improvement through empirical evaluation, archived variants, lineage, sandboxing and human oversight.

https://arxiv.org/abs/2505.22954

### Evolutionary coding systems

AlphaEvolve combines LLM-generated candidate changes with automated evaluators and an evolutionary archive.

https://arxiv.org/abs/2506.13131

### Evaluator bias

Studies report position bias, artifact sensitivity and sycophancy in LLM evaluators.

https://aclanthology.org/2025.ijcnlp-long.18/
https://aclanthology.org/2025.acl-long.970/
https://aclanthology.org/2025.findings-emnlp.1222/

## Tier 6 — Live platform/runtime facts

For claims about OpenCode, installed versions, native Task semantics, plugin hooks, permissions or external runtime behavior:

- inspect the installed runtime;
- inspect current source and docs;
- perform a live probe;
- record exact version and date.

Never treat an old experiment as current platform truth.
