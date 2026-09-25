# State — Core vs Plugin Boundary

Updated: 2026-09-25
Status: RESEARCH PASS 3 COMPLETE / ADVERSARIAL CLOSURE

## Final result

Pass 3 confirms the narrow K0/K1/plugin architecture but does NOT approve the current implementation as a fully closed Core boundary.

PROVEN K0: signed Recipe admission; manifest integrity/signature verification; content integrity primitive; compartment/Port boundary; capability token verification and ownership; revocation/generation fencing; atomic activation; fail-closed recovery; generic lifecycle; necessary crypto/canonicalization primitives.

UNDERPROVEN K0: StateArbitrator; grant-provenance subsystem; broader platform seam; full generation registry; hostile OS-level isolation claim; literal bootstrap-role mechanism.

EXPERIMENT-REQUIRED: graph reduction; exact generation-pin primitive.

CONTRADICTED current implementation: zero-plugin boot; executable-entry confinement.

PROVEN K1: Manifest/Recipe, Port, Lifecycle, Capability references, Outcome/Refusal, Plugin/Object/Revision/Evidence/Intent/Work references, Authority frame shape, Change references, Runtime tier and storage-driver protocol.

SYSTEM PLUGINS PROVEN as domain placement: vivim.law, vivim.vault, vivim.run, vivim.agent, vivim.mind, vivim.nlcl and provider.browser.

EXTENSION PLUGIN boundary is PROVEN conceptually but runtime privilege symmetry remains UNDERPROVEN until exercised with a third-party plugin.

## What changed from Pass 2

Earlier wording implied zero-plugin boot was an already-valid runtime state. Direct source inspection overturned that claim: parseRecipe() requires a non-empty composition and verifyCompositionInvariants() requires vivim.law at boot phase 0.

Earlier wording treated StateArbitrator and the larger graph/audit/generation structures too confidently as K0. Pass 3 reduces those claims to minimal candidates pending experiments.

Pass 3 also identifies a concrete B1 executable-entry confinement gap: entry is joined to sourceDir but not explicitly constrained to the hashed tree.

## Canonical package

docs/destination/core-vs-plugin-boundary/

The package now contains the required Pass 1/2 artifacts plus the complete Pass 3 adversarial closure package and diagrams.

## Immediate blockers

- do not claim B1 executable-entry confinement closed until the entry-path experiment/fix is proven;
- do not claim zero-plugin boot current until empty-composition/bootstrap-role semantics are proven;
- do not enlarge host code for state/graph/generation without first reduction-testing smaller mechanisms;
- do not claim first-party/third-party runtime symmetry without an actual extension experiment;
- do not claim active Work replacement until a live continuation/reconciliation experiment succeeds.

## Next action

Use FINAL-BOUNDARY-VERDICT.md as the implementation-gate baseline. The next work should be a tiny constitutional-runtime reduction experiment, not a broad redesign.