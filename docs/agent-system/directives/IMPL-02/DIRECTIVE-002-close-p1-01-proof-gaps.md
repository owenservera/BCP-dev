---
directive_id: DIR-002
kind: OWNER-DIRECTIVE
from: owner
to: IMPL-02
workstream: WS-001
issued: 2026-09-24
repository_tip: 1f0c43b
status: DONE
---

# Close the two remaining P1-01 proof gaps

## Objective

Close the two explicitly unresolved WS-001 / P1-01 proofs from DIR-001 without
changing the scope or silently upgrading the evidence:

1. MULTI-AGENT independence
2. CROSS-CHATGPT continuity

P1-01 remains PARTIALLY PROVEN until each proof passes independently.

## Required reads

1. /AGENTS.md
2. /BUILD_CONTEXT.md
3. /docs/CURRENT-CONTEXT.md
4. docs/agent-system/CHATGPT-BOOT.md
5. docs/agent-system/CURRENT.md
6. docs/agent-system/SYSTEM.md
7. docs/agent-system/WORKSTREAMS.md
8. docs/agent-system/workstreams/WS-001/README.md
9. docs/agent-system/handoffs/HANDOFF-004.md
10. docs/agent-system/packets/PKT-002-p1-01-dogfood-findings.md
11. docs/agent-system/outbox/IMPL-02/ITEM-002-merge-request.md
12. the current repository tip

## Required work

### A. MULTI-AGENT independence

Do NOT perform this proof yourself as IMPL-02.

Arrange for a genuinely independent second participant/agent identity to continue
from HANDOFF-004 alone, plus only the repository bootstrap material that the
handoff explicitly permits.

The independent participant must:
- be a distinct agent identity and distinct execution/thread;
- not receive the originating conversation, DIR-001 reasoning, PKT-002 reasoning,
  or hidden direct context;
- discover the task through durable repository artifacts;
- perform a meaningful continuation rather than merely acknowledge HANDOFF-004;
- produce its own evidence/handoff;
- record exactly what it was given at bootstrap;
- distinguish what it independently established from what it merely inherited.

Do not simulate independence by role-playing a second identity in the same
thread.

### B. CROSS-CHATGPT continuity

Do NOT simulate this proof.

A genuinely fresh ChatGPT conversation must bootstrap from:
- docs/agent-system/CHATGPT-BOOT.md
- docs/agent-system/CURRENT.md

It must not be given the originating conversation transcript or hidden prior
context as part of the proof.

The fresh conversation must demonstrate that it can:
- identify WS-001/P1-01's current state;
- identify the two unresolved proofs;
- locate the relevant durable evidence;
- continue the work without reconstruction from the originating conversation.

The fresh ChatGPT participant should record its findings as durable evidence or
a handoff through the established repository protocol.

## Constraints

- Do not create or implement P1-02 through P1-09.
- Do not create their setup prompts.
- Do not reopen or rebuild Phase 1.
- Do not edit RATIFIED Ω decisions.
- Do not hand-edit BCP state.
- Do not modify vivim-original-baseline/.
- Do not silently mark either proof green.
- Do not treat a transcript or packet as proof of independent continuity.
- Preserve the existing epistemic separation and evidence lineage.
- Follow the branch/worktree and session-ledger rules.

## Completion criteria

For each proof, produce one of:

- PROVEN, with mechanical evidence and durable artifact;
- NOT PROVEN, with exact failure and why;
- PARTIAL, only when the falsifier itself was meaningfully exercised but a
  bounded condition remained unmet.

Do not change the overall P1-01 verdict merely because a proof attempt was made.

If both proofs pass, submit a coordinator MERGE_REQUEST requesting P1-01 →
PROVEN.

If either fails, preserve the PARTIALLY PROVEN verdict and document the exact
remaining gap.

## Required durable outputs

- independent participant identity/session evidence for the multi-agent test;
- fresh ChatGPT continuity evidence;
- updated packet(s) only by version-forward derivation when claims change;
- final WS-001 handoff;
- MERGE_REQUEST to COORD-01 with the exact proof table delta;
- no direct edits to coordinator-owned CURRENT/WORKSTREAMS/ROSTER while the
  proof work is in flight.

## Explicit non-goal

This order is a P1-01 proof-closure exercise only.

It is NOT permission to begin another P1 workstream.

## Completion instruction

Pull the latest main, read this directive and the required durable context, then
execute the proof work without waiting for another conversational prompt.
