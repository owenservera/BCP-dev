# FINAL-BOUNDARY-VERDICT

> Pass 3 — Adversarial Core Boundary Closure

## FINAL K0

PROVEN K0:
- signed Recipe admission
- manifest integrity and signature verification
- content integrity primitives
- plugin identity enforcement mechanism in the narrow admission sense
- plugin isolation/compartment boundary and Port transport
- capability token verification
- token ownership
- revocation/generation fencing
- atomic activation
- fail-closed recovery boundary
- generic compartment lifecycle
- minimum crypto/canonicalization primitives needed by those functions

UNDERPROVEN K0:
- StateArbitrator as a distinct constitutional subsystem
- grant provenance as a separate AuditLog subsystem
- platform seam beyond the minimal primitive
- full generation-resolution registry
- hard OS-level isolation/security sandbox claim

EXPERIMENT-REQUIRED:
- graph subsystem reduction to a minimal op→implementation routing structure
- exact generation-pin continuity primitive

CONTRADICTED:
- current B1 executable-entry confinement claim, because source entry is not explicitly proven to remain inside the hashed source tree
- current zero-plugin boot claim, because parseRecipe rejects empty composition and verification requires vivim.law at boot phase 0

## FINAL K1

PROVEN K1:
- Manifest/Recipe protocol vocabulary
- Port wire
- Lifecycle vocabulary
- Capability references/tokens
- Outcome/Refusal envelope
- Plugin references
- Object/Revision references
- Evidence references
- Intent references
- Work references
- generic Authority frame shape
- Change references
- Runtime tier
- storage driver protocol

UNDERPROVEN / SEMANTIC API:
- Provider realization facade
- Control bootstrap/describe
- Lang frames
- Intent plan semantics
- World object semantics
- Work plan/attempt semantics
- Chat vocabulary

These are valid shared APIs where useful, but they are not constitutional K1 merely because they live in contracts/src.

## SYSTEM PLUGINS

PROVEN SYSTEM PLUGIN as domain placement:
vivim.law, vivim.vault, vivim.run, vivim.agent, vivim.mind, vivim.nlcl, provider.browser, plus their domain-specific capabilities and semantics.

The privilege symmetry is not fully proven yet because a hostile extension has not been exercised through the same runtime constraints and the boot-role exception remains first-party-specific.

## EXTENSION PLUGINS

PROVEN conceptually as the target boundary; runtime symmetry is UNDERPROVEN until a third-party plugin experiment passes without undocumented host APIs.

## TOOLING

PROVEN TOOLING / OUTSIDE RUNTIME:
- CLI composition compiler
- graph analytics such as blastRadius
- audit export/lens projections
- worker-pool optimization
- research/diagnostic generators and CI

## REAL K0 GAPS

1. B1 executable-entry confinement.
2. The exact minimum of StateArbitrator.
3. The exact minimum of graph + grant-provenance machinery.
4. The exact minimum generation-pin mechanism.
5. OS-level containment semantics if extension plugins are adversarial rather than merely signed code.
6. Generic bootstrap-role mechanism that removes the literal vivim.law exception without weakening the ratified boot trust chain.

## FALSE-CORE FINDINGS

Current evidence does not justify promoting Vault, Work, Law semantics, Intent/NLCL, World, Evidence storage, Provider/Account/Session, Browser, Routing, Discovery, Self-Knowledge, Spatial Intent, Agent, Forge, Memory, Attention, Surface or Product Instance into K0 domains.

## B1 STATUS

CONTRADICTED at the implementation boundary: contentHashDir() hashes the source directory, but manifest entry validation does not prove that m.entry resolves inside that hashed tree. This must be resolved before treating B1 executable-entry confinement as closed.

## ZERO-PLUGIN STATUS

CONTRADICTED in current implementation; the architecture remains a valid target. Empty-composition parsing and the hardcoded law boot role must be reconciled.

## ACTIVE-WORK REPLACEMENT STATUS

Boundary model: PROVEN K1/System Plugin. Live replacement/continuation: EXPERIMENT-REQUIRED.

## B5 STATUS

PROVEN K0 architectural constraint. Host is at 1500/1500, and several safe extraction opportunities exist. No evidence in this pass shows the constitutional minimum cannot fit after extraction.

## IMPLEMENTATION BLOCKERS

Blocker 1 — repair B1 entry confinement before any claim of complete B1 closure.
Blocker 2 — do not implement claimed zero-plugin boot until the generic empty-composition/bootstrap-role design is reconciled.
Blocker 3 — define and test the minimal K0 graph/generation/state/provenance primitives before extending host code.
Blocker 4 — prove first-party/third-party symmetry for the actual runtime boundary.
Blocker 5 — prove active Work continuation across implementation replacement.

## NEXT RESEARCH NEEDED

First priority is a tiny constitutional-runtime reduction exercise: derive the minimal Routing/Grant/Generation/State primitives and the bootstrap-role abstraction, then run the B1 entry-confinement and hostile-plugin experiments. Do not start a broad architecture redesign.