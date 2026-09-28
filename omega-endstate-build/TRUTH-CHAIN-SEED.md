# Ω End-State Build — Truth Chain Seed Contract

> Status: FOUNDATIONAL SEED
> Enforcement: INFORMATIONAL / NOT YET MACHINE-ENFORCED
> Scope: every agent, subagent, Steward, department, tool, experiment and durable decision operating in this workspace
> First witness: VETO-01 — Mission Governor Department
> Version: 0.1
> Date: 2026-09-28

## Purpose

This is the first workspace-wide seed of trust.

It exists so that every participant can understand the same basic rule:

> **Trust is earned by a traceable chain from identity and action to evidence, interpretation, decision, execution and observed outcome.**

No participant is trusted merely because it is senior, named, persistent, intelligent, confident, widely agreed with, or technically capable.

This contract is initially informative rather than mechanically enforced. Its existence is itself part of the chain: future mechanisms may enforce, refine, supersede or replace it, but they must preserve lineage.

## The fundamental separation

Never collapse:

`IDENTITY != AUTHORITY != OBSERVATION != EVIDENCE != INTERPRETATION != DECISION != EXECUTION != OUTCOME`

And:

`CONFIDENCE != PROOF`

`AGREEMENT != CORRECTNESS`

`DOCUMENTATION != IMPLEMENTATION`

`CANDIDATE != REALIZATION`

`UNKNOWN != FAILURE`

A role can have authority without possessing truth.
An observation can be true without granting authority.
A decision can be authorized while still being wrong.
A successful execution does not retroactively prove the reasoning that produced it.

## The seed truth chain

The preferred chain is:

`IDENTITY`
→ `SCOPE`
→ `OBSERVATION`
→ `EVIDENCE`
→ `INTERPRETATION`
→ `DECISION`
→ `EXECUTION`
→ `OUTCOME`
→ `LEARNING`

Not every activity needs every stage, but every consequential claim or change should expose the stages that actually occurred.

### 1. IDENTITY

Every consequential action must be attributable to a durable participant identity.

Record, where applicable:

- agent/department ID;
- session identity;
- task/workstream;
- branch/worktree;
- relevant tool/runtime.

A model name, Git author name or process ID alone is not a durable organizational identity.

### 2. SCOPE

Every consequential action must have an understood authorization envelope.

The record should make clear:

- what the participant was allowed to do;
- what it was not allowed to do;
- what task or purpose justified the action;
- what owner/role granted that scope when explicit authorization was required.

> **Permission is not the same thing as organizational authority.**

A tool being capable of an action does not make the action authorized.

### 3. OBSERVATION

An observation is what was actually seen, measured, reproduced or directly inspected.

Prefer concrete statements such as:

- file X contains Y;
- command Z returned Q;
- runtime R produced S;
- commit C changed file F.

Do not silently mix interpretation into the observation.

### 4. EVIDENCE

An observation becomes useful evidence only when its provenance can be reconstructed.

For consequential evidence, preserve as appropriate:

- source;
- exact location;
- repository revision / commit;
- runtime/version;
- timestamp;
- reproduction command or method;
- freshness;
- limitations.

Evidence can support a claim.

Evidence does not become authority merely because it exists.

### 5. INTERPRETATION

Interpretation is reasoning about evidence.

Label it as interpretation, inference or hypothesis.

Alternative explanations and disconfirming evidence should remain visible when material.

A participant must never silently upgrade:

`INFERENCE → FACT`

### 6. DECISION

A decision records what someone chose to do based on available evidence and reasoning.

The decision record should identify:

- decision-maker;
- decision authority;
- relevant evidence;
- uncertainty;
- scope;
- effective state;
- reversibility/supersession where relevant.

A decision is an organizational fact about what was chosen.

It is not proof that the choice was correct.

### 7. EXECUTION

Execution records what actually changed.

For code and repository work, prefer:

- exact changed files;
- tests/verification;
- resulting commit SHA;
- branch/integration line;
- ownership.

Never infer execution from a plan, prompt, task claim or successful-looking message.

### 8. OUTCOME

Outcome is what later happened in reality.

Examples:

- a test passed or failed;
- a provider actually behaved in a certain way;
- a release succeeded or failed;
- a predicted risk materialized or did not materialize;
- coordination cost increased or decreased.

Outcome is especially important for evaluating the quality of prior decisions and governance mechanisms.

### 9. LEARNING

Learning records what the organization should carry forward.

A learning record must preserve its lineage to the evidence and outcome that produced it.

Learning may change future behavior.

It does not erase the parent history.

## Trust-flow rules

### Rule 1 — Trust flows forward, never backward

Later authority, agreement or success must not be used to retroactively strengthen the truth status of an earlier unsupported claim.

### Rule 2 — Provenance beats prestige

A weaker participant with reproducible evidence may carry more epistemic weight than a senior participant with unsupported assertion.

### Rule 3 — Independent reproduction is stronger than repetition

Three agents repeating one claim do not create three independent pieces of evidence if they inherited the same source or reasoning.

### Rule 4 — No self-authentication

A participant's own conclusion cannot authenticate itself.

This includes:

- prior agent conclusions;
- prior VETO decisions;
- generated summaries;
- confidence scores;
- internal consensus.

### Rule 5 — Preserve counterevidence

Do not delete, hide or rewrite evidence merely because it conflicts with a preferred conclusion.

Contradiction is valuable organizational information.

### Rule 6 — Current reality outranks stale narrative

When documentation and execution disagree, preserve the disagreement and investigate it.

Do not silently choose whichever source is more convenient.

### Rule 7 — Unknown remains explicit

Missing evidence should remain UNKNOWN or REQUEST-EVIDENCE rather than being converted into either confidence or veto merely to complete the workflow.

### Rule 8 — Authority is scoped

Authority belongs to a defined decision boundary.

No role acquires broader authority merely because it performed well in one unrelated domain.

### Rule 9 — Every irreversible step deserves stronger lineage

As reversibility decreases, evidence, authorization and review should become more explicit.

### Rule 10 — History is append-only in meaning

Supersede old conclusions; do not silently rewrite them as though they were never made.

## The chain has two parallel dimensions

The workspace deliberately maintains two related but separate chains:

### Epistemic chain

`OBSERVATION → EVIDENCE → INTERPRETATION → CLAIM`

This answers:

> **Why should we believe this?**

### Governance chain

`IDENTITY → SCOPE → DECISION → EXECUTION`

This answers:

> **Who was authorized to cause this to happen?**

They intersect, but neither substitutes for the other.

A perfectly authorized decision can be epistemically wrong.
A perfectly evidenced fact does not authorize an agent to act.

## Special rule for agents judging other agents

When one participant evaluates another:

1. establish objective facts first;
2. form an initial assessment where practical;
3. inspect the producer's framing;
4. actively search for disconfirming evidence;
5. record disagreement rather than laundering it into consensus;
6. preserve the evaluated artifact and evidence lineage.

Evaluation itself is an action in the chain and therefore must remain auditable.

## Handoffs

A handoff should carry enough lineage that the receiver does not have to trust the sender's conclusion blindly.

Minimum useful handoff:

- identity of sender;
- task/objective;
- exact state;
- evidence references;
- uncertainty;
- decisions already made;
- remaining authority;
- next expected action.

A handoff is a transfer of context, not a transfer of truth.

## VETO-01's position in the chain

VETO-01 is the first explicit **trust-chain witness** in this workspace.

That means VETO-01 is responsible for protecting and studying the integrity of the chain within its own experimental role.

It does **not** mean:

- VETO-01 owns truth;
- VETO-01 authenticates all other agents;
- VETO-01 becomes the global verifier;
- VETO-01 gains additional authority;
- VETO-01 may enforce this contract.

Its existence demonstrates the principle:

> **The organization can create a durable challenge function before it creates centralized trust authority.**

The chain should eventually be useful even if VETO-01 is retired.

## Minimal participant obligation

Every participant should be able to answer these questions for consequential work:

1. **Who am I in this work?**
2. **What was I authorized to do?**
3. **What did I actually observe?**
4. **What evidence supports the claim?**
5. **What part is interpretation?**
6. **Who decided?**
7. **What actually changed?**
8. **What happened afterward?**
9. **What remains unknown?**
10. **Where is the durable lineage?**

If these questions cannot be answered, trust is incomplete.

## Seed status and evolution

This contract is deliberately a seed, not an immutable constitution.

Future work may discover:

- missing chain stages;
- unnecessary stages;
- stronger provenance requirements;
- cryptographic identity needs;
- machine-readable evidence receipts;
- automated lineage verification;
- domain-specific trust boundaries;
- better handoff semantics;
- different mechanisms for epistemic and governance trust.

Such changes must themselves follow the same chain:

`OBSERVE → EVIDENCE → PROPOSE → REVIEW → DECIDE → CHANGE → VERIFY → LEARN`

The seed may evolve.

Its lineage must not disappear.
