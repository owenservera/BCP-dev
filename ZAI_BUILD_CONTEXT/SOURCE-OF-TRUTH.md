# Source of Truth and Repository Triage

## Read in this order

### Tier 1 — Product authority
Read:
- `ZAI_BUILD_CONTEXT/*`
- `docs/destination/`
- `docs/destination/VIVIM-PRODUCT-INSTANCE-CORE.md`
- `docs/destination/V1-BUILD-AND-LEARNING-SPRINT.md`

These describe the intended product and current V1 learning/build model.

### Tier 2 — Current Ω implementation
Primary implementation target:
- `omega-baseline/omega-final/`

Read its current docs, contracts, runtime, plugins, surfaces and tests as needed.

### Tier 3 — System Intelligence
Pass 1–3 are now durably present in main under:
- `docs/destination/system-intelligence/`

Use Pass 3 as the current design-characterization baseline for the hard problems; use the Architecture Steward for cross-repository normalization, dependency mapping, and drift/repull.

Important Pass 3 lineage:
`research/system-intelligence-pass3 @ 0121570c005112eb8875e9b8a6f484cc732d4e62`

The source branches remain lineage/history; new work should not depend on branch availability to discover the corpus.

### Tier 4 — Legacy behavioral mine
- `vivim-original-baseline/vivim-final-enhanced/`

Use it to answer “how did VIVIM already learn to behave?” and to harvest tests, fixtures, flows and proven mechanisms.

Do not make Legacy the architecture.

### Tier 5 — BCP/Forge machinery
- `bcp-speed/bcp/`

Use selectively for migration, forensic, harvesting and tooling needs.

Do not recursively analyze it unless the active problem requires it.

## What to ignore by default

Do NOT spend the first turns:
- redoing completed System Intelligence archaeology;
- redesigning the Ω ontology;
- rebuilding the cooperative agent system;
- reading every Legacy engine;
- porting all historical features;
- recreating old telemetry/admin machinery;
- optimizing provider implementations before identity/resource semantics are sound;
- inventing another provenance/evidence system;
- inventing another task/agent operating system.

## Existing work that should not be treated as a fresh problem

Before implementing anything, search for existing code/tests/docs for:
- Vault;
- Law/Authority;
- Recipe/Composition;
- Intent;
- Capability;
- Realization;
- Evidence;
- Forge;
- provider-browser;
- live `message.send`;
- Chrome/CDP integration;
- Product Instance;
- canvas/workspace;
- conversations.

Reuse or extend when correct. Replace only when evidence shows the existing boundary is wrong.

## Rule when sources conflict

Prefer:
1. current executable evidence;
2. current destination/product requirements;
3. current Ω contracts/invariants;
4. Pass 3 design candidates;
5. Legacy behavioral evidence;
6. historical/experimental code.

A historical implementation is never automatically authoritative.

## Stop archaeology

If you can answer:
- what the user needs;
- what the current implementation does;
- what is missing;
- what experiment can falsify the candidate;
then build.

Do not read another hundred files for comfort.
