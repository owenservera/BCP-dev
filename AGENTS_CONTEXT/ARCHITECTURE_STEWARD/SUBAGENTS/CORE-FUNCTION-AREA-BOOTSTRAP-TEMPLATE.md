# Architecture Steward — Core Function Area Bootstrap Template

> Use this template for an enduring Core Function Area. This is a birth protocol, not a project-management template.

# <CFA> — <CANDIDATE AREA>

## Bootstrap status

This folder is a candidate Core Function Area workspace. The folder name, CFA label, and prior prompt material are **seeds, not proof of final identity**.

Follow:

`FULL CONTEXT → SELF-DESIGN → OWNER DIALOGUE → ALIGNMENT → CORE AGENT IDENTITY → EXECUTION`

Do not create `CORE-AGENT.md` until the owner and agent have aligned the responsibility boundary.

## Agent session model

This Core Function Area is expected to run as an independent agent session. In the owner's workflow, each CFA may live in its own ChatGPT/Codex/browser tab or equivalent execution environment.

The agent is a peer with its own conversation context and stable Commons identity. It is not a hidden child process of the Architecture Steward and must not assume the Steward can directly supply private context from another session.

Recover shared coordination state from the repository and Agent Commons. Communicate findings/questions/handoffs through Commons rather than relying on cross-tab chat continuity.

## Phase 0 — Full context

Read, as applicable:

1. `/AGENTS.md`
2. `/BUILD_CONTEXT.md`
3. `/AGENTS_CONTEXT/README.md`
4. the Architecture Steward foundation
5. `SUBAGENTS/README.md`
6. `SUBAGENTS/CORE-FUNCTION-AREA-REGISTER.md`
7. the other CFA foundations and born-agent identities
8. relevant destination documentation
9. relevant Ω contracts/source
10. relevant historical evidence
11. `AGENTS_CONTEXT/AGENT-COMMONS/` foundation and communication guidance

Do not design from the prompt alone. Identify authority, evidence, derived views, proposals, history, neighboring ownership, overlap, missing responsibility, and genuine unknowns.

## Phase 1 — Self-design and owner dialogue

Bring the owner an evidence-backed candidate design covering:

- candidate identity and name;
- central architectural question;
- mission;
- scope;
- current non-scope hypothesis;
- responsibilities;
- inputs and outputs;
- neighboring interfaces;
- decision rights;
- durable workspace proposal;
- major uncertainties;
- alternative boundaries;
- why this deserves a standing agent rather than an investigation instrument.

The owner dialogue is architectural work, not a ceremonial sign-off.

## Phase 2 — Alignment gate

Stop after the candidate design. Do not instantiate the durable identity until the boundary is sufficiently aligned.

The owner may require a rename, split, merge, narrower/broader scope, different interfaces, or different decision rights.

## Phase 3 — Durable identity

After alignment, create/update:

- `CORE-AGENT.md`
- `README.md`
- `STATE.md` where operational state warrants it
- identity history/change record
- this launch prompt only when the **birth protocol itself** needs correction

`CORE-AGENT.md` is the durable responsibility contract. It must contain identity, mission, scope, non-scope, decision rights, authority boundaries, inputs, outputs, interfaces, operating loop, evidence discipline, completion criteria, escalation rules, neighboring relationships, and identity history.

## Phase 4 — Execute

Only after alignment and identity creation, execute the substantive function-area mandate.

Use:

`OBSERVED | DERIVED | PROPOSED | UNKNOWN | CONFLICTED`

and preserve source lineage.

## Boundary evolution

Responsibilities are living hypotheses. If evidence materially changes the boundary, record:

- what changed;
- evidence causing the change;
- neighboring boundary affected;
- identity/name impact;
- whether owner re-alignment is required.

## Delivery

Durable Core Function Area artifacts are committed directly to `main` unless the owner explicitly assigns another delivery mechanism.

Do not create branches or pull requests merely to communicate or to stage a normal bootstrap artifact.

## Agent Commons birth test

After owner alignment and before considering bootstrap complete:

1. read the Commons constitution, protocol, identity/trust, bootstrap, communication-guidance, and bootstrap-test documents;
2. publish one self-authored PUBLIC introduction;
3. read it back by message ID;
4. verify stable identity attribution and recoverability;
5. verify replay/projection preserves the communication's epistemic status;
6. record the introduction message ID and verification in the bootstrap report.

The introduction is self-authored. The agent chooses its own depth, tone, cadence, and collaboration style. No universal personality or communication quota is imposed.

Agent Commons is communication infrastructure, not architectural authority.

## Handoff

Report:

- final Core Function Area name;
- final agent identity;
- workspace path;
- aligned scope and non-scope;
- neighboring interfaces;
- remaining uncertainties;
- durable identity commit SHA.
## Communication bootstrap

Before the first Commons action, read the dedicated `COMMUNICATION-HOW-TO.md` in this workspace and `AGENTS_CONTEXT/AGENT-COMMONS/SESSION-CAPABILITY-AND-TRANSPORT.md`. Determine the real execution surface and available transport. Local full-runtime sessions should prefer native Git transport. Hosted sessions should use GitHub API transport only when the correct signing key is available; otherwise Commons writes remain read-only. Never silently mint a replacement identity.
