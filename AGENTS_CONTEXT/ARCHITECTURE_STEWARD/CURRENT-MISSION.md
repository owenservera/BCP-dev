# Architecture Steward — Current Mission

> Updated: 2026-09-27
> Status: ACTIVE / EXECUTION FRONTIER
> Authority: derived Steward operating state; not Ω law or semantic authority.

## Current phase

**CFA home-upgrade handoff**

The common ChatGPT agent operating model has now been established and the fresh Steward cold-start test has passed. No further Steward test is required.

## Immediate next action

**Owner launches the ten CFA home-upgrade sessions. These are architecturally INDEPENDENT and should be launched in parallel unless a fresh session discovers a real dependency.**

Launch queue: `CFA-HOME-UPGRADE-LAUNCH-QUEUE-2026-09-27.md`.

The Steward must not merely say "launch CFA-01 through CFA-10." It must compile an **owner action package** containing, for every CFA:

1. the CFA name and agent_id;
2. the direct home link;
3. the exact launch instruction/envelope to paste;
4. any genuine prerequisite (none for this wave unless repository evidence changes);
5. the expected stop/report condition.

The owner should be able to execute the next step directly from the Steward response without reconstructing links, prompts, or sequencing.

Once a delegated session runs, its durable completion receipt under `SUBAGENTS/<CFA-HOME>/RESULTS/<SESSION_ID>.md` is the Steward's primary repository-visible result surface. The owner should not need to manually relay substantive session results.

Each fresh CFA session is responsible for validating and upgrading its own home against:

- `CHATGPT-AGENT-OPERATING-MODEL.md`;
- FSSP-1.3;
- its own `SESSION-CONTEXT.md`;
- its durable identity;
- `STATE.md`;
- `LESSONS.md`;
- applicable owner-alignment and history artifacts.

The CFA sessions must make only agent-specific corrections supported by their own repository evidence. They must not redesign the shared operating model.

## Execution strategy

For this wave the current evidence supports:

- **Semantic dependency:** none between CFA home upgrades.
- **Authority dependency:** none between already-ratified CFA identities.
- **Write surface:** each CFA owns a distinct home directory.
- **Shared synchronization:** repository mainline only.
- **Architectural classification:** **INDEPENDENT**.
- **Operational constraint:** concurrent writes to the same ref may require repository synchronization/retry; that does not make the tasks semantically ordered.

Therefore the owner-facing action is **launch all ten fresh CFA sessions in parallel**.

Only a newly discovered, evidence-backed dependency may change this. The Steward must not manufacture serial ordering.

```
OWNER LAUNCHES CFA-01 ... CFA-10 IN PARALLEL
                  ↓
VERIFY EACH RESULT / COMMIT
                  ↓
STEWARD CONSTELLATION RECONCILIATION
                  ↓
SELECT NEXT ARCHITECTURAL FRONTIER
```

## CFA session completion condition

Each CFA fresh session must:

1. verify its identity against current repository evidence;
2. understand its own home without prior-chat memory;
3. validate the home against FSSP-1.3;
4. preserve its existing ratified identity and boundaries;
5. update its own durable context only where genuinely required;
6. record durable lessons only when justified;
7. verify and commit its changes;
8. return the standard FSSP-1.3 completion report.

## Strategic operating-maturity frontier

The next Steward-level operating frontier is the existing Agent Commons runtime, not another expansion of the protocol corpus.

- R1 — bus convergence: repository receipts are the current durable projection/compatibility surface for Commons HANDOFFs targeting REPORTED; convergence remains a target until Commons is the operational transport.
- R2 — trust: repository commits establish lineage, not agent identity; unsigned/unverified artifact authorship is treated as an unattributed claim.
- R3 — runtime owner/freeze: the Commons runtime/platform workstream is assigned to CFA-10, with shared design breadth frozen until the existing v0 operational completion test passes.
- R4 — epistemic trigger: CFA-11 remains uninstantiated; quantitative review triggers are defined in the CFA register.
- R5 — publishing concurrency: parallel readers are permitted; one active publishing session per stable agent_id is the default Commons rule.
- R6 — owner digest: OWNER-DIGEST.md is the derived weekly human-facing compression surface; it does not replace source state.
- R7 — identity drill: CFA-04 is the operational security/identity custodian; recovery is tested, but the full rotation + recovery drill remains blocked until a real key-rotation operation exists.

The current actionable workstream is AGENTS_CONTEXT/AGENT-COMMONS/RUNTIME-PLATFORM-WORKSTREAM-2026-09-27.md.

## Steward stop condition

The Steward should **not** perform the ten CFA home upgrades itself.

The Steward resumes after the CFA sessions have produced verified repository results and reconciles the constellation as a whole. No additional Steward cold-start test is required.

## Not the current task

Do not:

- restart CFA ratification already completed;
- redesign the ten CFA boundaries;
- create another agent-management system;
- rebuild the architecture graph yet;
- start unrelated production implementation;
- treat the fresh-session test as requiring perfect automation.

## Success condition

A fresh Steward can enter the Steward home from its directory alone and determine **and operationalize**:

```
WHO AM I?
WHAT IS CURRENT?
WHAT DID THE LAST VALIDATED TEST PROVE?
WHAT IS THE ACTUAL DEPENDENCY / EXECUTION STRATEGY?
WHAT EXACT TASKS DOES THE OWNER LAUNCH NOW?
WHERE ARE THE DIRECT LINKS?
WHAT EXACT INSTRUCTION IS PASTED INTO EACH SESSION?
WHAT PREREQUISITES ACTUALLY EXIST?
WHEN DOES THE STEWARD RESUME?
```

The answer is not complete when it merely describes the next work. It is complete when it gives the owner the concrete launch package.
