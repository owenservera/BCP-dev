# Second-Opinion Reconciliation — Additional Findings

Date: 2026-09-28
Status: PROPOSED

## Confirmed repository correction

`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/OWNER-DELEGATION.md` explicitly states that a CFA needing another CFA sends a Commons REQUEST/HANDOFF and that the Steward turns it into a spawned session. Therefore the resident-team design does require an explicit control-plane correction: resident CFA peers should normally communicate directly; Steward escalation should be reserved for authority, boundary, sequencing, resource, and reconciliation conditions.

## Highest-priority findings

1. Exact-agent fallback is a blocking R0 safety gate. The repository records silent `--agent` fallback on OpenCode 1.18.4, including fallback to the most-privileged local agent.
2. `prompt_async` must be treated as a delivery attempt, not execution proof. Current public reports include an OpenCode 1.18.x report where a busy-session async prompt persisted without scheduling the new turn. See issue 46842: https://github.com/anomalyco/opencode/issues/46842
3. Correlation IDs are not native idempotency. Retry safety requires read-before-retry plus reconciliation of late results.
4. Each CFA needs a serialized inbound delivery queue; the system should not depend on undocumented concurrent prompts to one session.
5. Commons-to-OpenCode delivery needs a durable consumption lifecycle so a supervisor crash cannot cause silent loss or duplicate wakeups.
6. Peer-to-peer wake chains need bounded thread turns, wake depth, active-turn limits, wall-clock limits and a circuit breaker.
7. The Steward must have guaranteed visibility or reconstructability for decision-relevant peer communication.
8. The supervisor's broad operational control needs an explicit capability membrane and audit trail.
9. One OpenCode server hosting eleven sessions is an experimental hypothesis, not a settled architecture.

## Revised proof sequence

R0 — Safety + substrate qualification
R1 — Durable single-agent delivery
R2 — Concurrent single-session control
R3 — Two-agent direct peer protocol
R4 — Ten-CFA resident bootstrap
R5 — Peer mesh + Steward observation
R6 — Recovery matrix
R7 — Owner direct interaction
R8 — Resident deliberate mode
R9 — Resident governed execution

## Current external evidence

OpenCode documents `opencode serve` as a headless HTTP server with session/message APIs, including `prompt_async`, and exposes a global event stream. `opencode service` manages the background server.

Primary documentation:
- https://dev.opencode.ai/docs/server/
- https://opencode.ai/v2/docs/cli/commands/

Relevant failure reports:
- https://github.com/anomalyco/opencode/issues/21524
- https://github.com/anomalyco/opencode/issues/26635
- https://github.com/anomalyco/opencode/issues/32010
- https://github.com/anomalyco/opencode/issues/33394
- https://github.com/anomalyco/opencode/issues/46842

These are evidence for what must be tested, not proof that the target local version currently fails.

## Bottom line

The resident-ten-CFA concept remains viable as the target architecture. The difficult engineering problem is durable, bounded, attributable message-to-turn-to-result continuity across resident sessions. The system should prove that chain before scaling from one session to ten.