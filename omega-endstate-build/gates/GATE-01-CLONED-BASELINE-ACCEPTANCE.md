
# GATE-01 — Cloned Agent-System Baseline Acceptance

> Status: PROPOSED
> Scope: the currently cloned/local opencode-swarm baseline
> Governing mission: Full VIVIM beta ready to distribute for free.

## Gate question

Has the local team implemented and fully tested everything the cloned repository actually promised, on the supported local runtime, without requiring proof of additional future Omega capabilities?

This gate establishes only:

"The inherited agentic substrate is a working, tested baseline."

It does not establish:
- that this is the best architecture;
- that it is sufficient for VIVIM beta;
- that resident teams are proven;
- that self-evolution is proven;
- that governance is proven;
- that it scales to any particular agent count;
- that it should remain unchanged.

## Baseline contract

For this gate, the primary contract is the cloned repository itself, currently vendored under:
omega-endstate-build/runtime/vendor/opencode-swarm/

Use, in order:
1. the vendored README;
2. the vendored package metadata and exported/runtime source;
3. the vendored tests;
4. the exact local integration/runtime configuration.

Do not import requirements from later forks, unrelated versions, or the desired Omega end state.

## Evidence freshness and decision lineage

For each acceptance claim, distinguish:
- source contract: what the cloned repository says it promises;
- implementation observation: what the local tree contains;
- runtime observation: what the supported environment actually does;
- independent verification, where required;
- acceptance decision: who ratified the gate result.

Prefer fresh reproducible runtime evidence over stale reports. Never let a later green artifact silently erase a known regression.

## Environment receipt

Record:
- exact vendored commit/version;
- exact OpenCode version;
- Bun version;
- operating system;
- provider/model used for runtime tests;
- effective OpenCode configuration;
- local integration commit(s);
- test date/time;
- network/authentication requirements;
- platform-specific exclusions.

## A. Installation and startup

Prove:
1. clean dependency installation succeeds;
2. typecheck succeeds;
3. the CLI starts;
4. swarm init produces a usable configuration;
5. a configured swarm can start on the supported local environment.

Evidence:
- clean-install receipt;
- typecheck result;
- CLI smoke result;
- initialized configuration;
- runtime start receipt.

## B. Multi-agent execution

Prove:
1. more than one configured agent executes;
2. agents run as separate OpenCode sessions;
3. parallel execution works as promised;
4. per-agent model override works when configured;
5. per-agent tool restrictions are honored.

Do not require ten agents or any future resident topology.

Evidence should identify the run and participating sessions/agents where available.

## C. Shared memory

Prove the documented memory surface:
- set;
- get;
- search;
- list.

Prove actual cross-agent visibility, not just successful tool invocation.

Prove persistence across the relevant process boundary.

## D. Inter-agent communication

Prove:
- named-agent messaging;
- broadcast where supported;
- inbox retrieval;
- push delivery between turns;
- mid-turn inbox retrieval where supported;
- a receiving agent can observe and act on the message.

Distinguish message persistence from actual delivery.

## E. Persistent state and resume

Prove:
- durable swarm state is written to the promised database location;
- status reconstructs the run;
- logs expose durable message/memory/state history;
- an interrupted swarm can resume;
- completed agents are skipped on resume as promised;
- a later process can recover the swarm state.

At least one test must cross a process boundary.

## F. External control

Prove:
- external send can inject a message into a running swarm;
- the target observes the message;
- status can be queried externally as documented;
- JSON status works where the baseline documents it.

## G. Machine-readable execution

Prove:
- JSON run output;
- JSONL event output;
- explicit database-path override;
- event records representing the documented execution information.

Do not treat file existence as proof that event semantics are correct.

## H. Cost and telemetry semantics

Where the provider/runtime exposes the promised fields, prove:
- model identification;
- token counts;
- per-turn cost;
- per-agent settlement;
- budget-exceeded event when the soft brake trips.

A provider that reports zero cost or omits a field must be recorded as a platform condition, not silently converted into PASS or FAIL.

## I. Concurrency and budget controls

Prove the documented behavior of:
- maxConcurrent;
- budgetUsd soft brake;
- in-flight turns completing when the soft brake trips;
- new turns stopping after the ceiling is crossed.

Do not claim a provider-independent hard spend ceiling unless one is actually implemented and documented.

## J. Reports and notifications

Prove:
- a markdown report is created after a run;
- the report contains the promised result/history information;
- supported completion notification paths work when configured.

Apply the clone's own platform conditions:
- Linux desktop notification is conditional on supported Linux tooling;
- ntfy is conditional on configuration and network availability;
- unsupported conditions must be recorded as N/A rather than falsely marked green.

## K. MCP server

Prove the documented MCP surface through an actual MCP client/transport:
- swarm mcp starts;
- swarm_run returns a swarm identifier;
- background execution occurs;
- swarm_status observes it;
- swarm_wait returns bounded completion;
- swarm_send works;
- memory search works;
- logs are retrievable;
- results remain in durable swarm state.

## L. Standalone notification plugin

Where the notification plugin is included in the local realization, exercise the documented hooks:
- session.idle;
- session.error;
- permission prompts.

Distinguish hook execution from successful external notification delivery.

## M. Failure isolation and retry behavior

Exercise:
- at least one retryable/transient/model failure;
- at least one terminal agent failure.

Prove that:
- retry behavior follows the clone's documented policy;
- terminal failure of one agent does not incorrectly terminate the entire swarm;
- final state accurately records the failed agent.

## N. Integration/provenance boundary

Prove that the local realization still uses the cloned OpenCode plugin/SDK mechanism and its intended swarm runtime rather than quietly replacing the baseline with a different custom scheduler or session manager.

Local Windows adaptations and integration glue are allowed.

The test is about fidelity to the inherited capability contract, not zero local changes.

## Automated test floor

All appropriate tests exposed by the cloned package must pass, including where applicable:
- bun test;
- bun run typecheck;
- bun scripts/smoke.ts;
- documented end-to-end tests with an authenticated provider.

A unit-test-only green result is insufficient.

A test can be marked N/A only when the upstream contract itself makes the capability conditional.

## Clean end-to-end acceptance

After automated tests pass, run at least one clean end-to-end acceptance sequence:

initialize
-> run multiple agents
-> shared memory
-> inter-agent message
-> completion
-> persisted state
-> status/logs

Then reopen/restart the process and reconstruct the same durable state.

Exercise at least one negative/failure path in the same acceptance campaign.

## Evidence package

Leave durable evidence containing:
- environment receipt;
- source/version receipt;
- automated test results;
- runtime run identifiers;
- agent/session identifiers where available;
- database/event/report paths;
- failure-injection results;
- notification and MCP observations;
- platform-conditional decisions;
- known deviations;
- unresolved UNKNOWNs.

A fresh session must be able to reproduce the gate conclusion without this conversation.

## Pass condition

GATE-01 passes only when:
1. every mandatory capability explicitly promised by the cloned baseline has a corresponding passing test or explicitly applicable upstream-conditioned test;
2. the core end-to-end path is observed on the actual local runtime;
3. persistence/recovery is observed across a process boundary;
4. promised negative/failure semantics are exercised where practical;
5. no material deviation is hidden;
6. the evidence package is durable and reproducible;
7. the conclusion does not depend on future Omega capabilities;
8. the local team can truthfully state:

"The cloned agent system is implemented and fully tested on our supported environment according to what its own repository promised."

## Gate result and acceptance record

The gate evaluator must not silently become the sole authority for acceptance of its own consequential implementation.

Record evaluator, independent verifier (if applicable), ratifying decision-maker, evidence references, exact environment scope, and unresolved conditions.

Use exactly one:
- PASS
- FAIL
- CONDITIONAL
- BLOCKED-EVIDENCE

BLOCKED-EVIDENCE means the gate cannot responsibly conclude because required evidence is unavailable. It is not equivalent to FAIL.

## Explicit non-criteria

Do not require for GATE-01:
- ten persistent residents;
- autonomous resident-to-worker delegation;
- resident-to-resident Commons;
- self-evolving organization;
- self-governance;
- VETO authority;
- Omega-native ontology;
- production-scale performance;
- a fixed final agent topology;
- superiority over native OpenCode Task;
- proof that this baseline is the eventual architecture.

Those belong to later gates or research.

## Relationship to existing checkpoints

The resident-team-lab CP-00 through CP-10 checkpoints are narrower implementation proofs, especially around U1.

GATE-01 is broader: it asks whether the whole inherited cloned baseline, as promised by its own repository, has actually been implemented and fully tested.

Therefore:
- a passing checkpoint does not automatically pass GATE-01;
- GATE-01 does not prove later U1/U2/Resident/Omega capabilities;
- checkpoint evidence may be reused as evidence where it directly covers a Gate-01 criterion.
