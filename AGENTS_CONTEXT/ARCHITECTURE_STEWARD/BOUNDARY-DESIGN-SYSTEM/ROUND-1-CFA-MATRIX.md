# Round 1 — CFA Routing Matrix

This matrix tells the human router which seams to ask each CFA to examine first.

Every CFA uses the same common prompt:
`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/ROUND-1-BOUNDARY-BOOTSTRAP.md`

## Priority seams

| CFA | Primary responsibility | Round 1 seam focus |
|---|---|---|
| CFA-01 World / Ontology / Context | world meaning, objects, relationships, identity/correspondence, context | World ↔ Data; World ↔ Semantic; World ↔ Authority |
| CFA-02 Data / Identity / Persistence | durable identity, persistence, reconstruction, continuity | Data ↔ World; Data ↔ Capability; Data ↔ Work |
| CFA-03 Semantic Continuity | semantic continuity across grounding, command, intent/plan, evidence, representation | Semantic ↔ World; Semantic ↔ Authority; Semantic ↔ Work |
| CFA-04 Authority / Governance | authority, consent, delegation, scope, risk, revocation | Authority ↔ World; Authority ↔ Work; Authority ↔ Capability |
| CFA-05 Agency / Work / Execution | durable work, execution, recovery, outcomes, evidence | Work ↔ Authority; Work ↔ Capability; Work ↔ Data |
| CFA-06 Capability / Provider / Realization | capability semantics and valid external realizations | Capability ↔ Data; Capability ↔ Authority; Capability ↔ Evolution |
| CFA-07 Composition / Plugin / Forge | assembly, extension, creation, replacement, evolution of capabilities | Composition ↔ Capability; Composition ↔ Work; Composition ↔ Evolution |
| CFA-08 Experience / Interaction / Surfaces | human perception, navigation, manipulation, configuration, action | Experience ↔ World; Experience ↔ Semantic; Experience ↔ Work |
| CFA-09 Evolution / Compatibility / Self-Maintenance | change, migration, repair, replacement, compatibility | Evolution ↔ Data; Evolution ↔ Capability; Evolution ↔ Composition |
| CFA-10 Runtime Constitution / Core Substrate | irreducible runtime guarantees | Runtime ↔ Authority; Runtime ↔ Work; Runtime ↔ Composition |

## Router rule

Send the common prompt to each CFA. Include exactly this sentence:

> “Your Round 1 priority seams are listed in the routing matrix; do not perform work for other CFAs.”

If an agent is not yet fully bootstrapped, let it complete its own bootstrap first; then run Round 1.

## Round 1 is deliberately asymmetric

The same seam appears from both sides.

That is intentional.

We want to compare:
- what each side thinks it owns;
- what each side thinks crosses;
- where their falsifiers differ;
- where terminology differs;
- where evidence supports or contradicts the apparent boundary.

Do not manually reconcile the two sides before both declarations exist.

## After all declarations arrive

The Steward will:
1. create a cross-CFA boundary comparison;
2. identify direct agreements;
3. identify overlap;
4. identify gaps;
5. create BoundaryChallenges for material conflict;
6. identify the smallest set of Round 2 peer-to-peer reconciliation conversations;
7. propose the first live Boundary records.
