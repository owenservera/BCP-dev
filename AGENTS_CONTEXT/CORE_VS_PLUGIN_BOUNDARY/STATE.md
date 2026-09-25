# State — Core vs Plugin Boundary

Updated: 2026-09-25
Status: RESEARCH PASS 3 COMPLETE / RESPONSIBILITY INVENTORY CORRECTED

## Final result

Pass 3 confirms the narrow K0/K1/plugin architecture but does NOT approve the current implementation as a fully closed Core boundary.

A post-pass correction has now replaced the previous coarse destination responsibility matrix with:

`docs/destination/core-vs-plugin-boundary/DESTINATION-RESPONSIBILITY-MATRIX.md`

The corrected matrix contains 125 explicit responsibility rows plus a separate cross-cutting concern view.

## K0

PROVEN K0:
- signed Recipe admission;
- manifest integrity/signature verification;
- content integrity primitive;
- compartment/Port boundary;
- capability token verification and ownership;
- revocation/generation fencing;
- atomic activation;
- fail-closed recovery;
- generic lifecycle;
- necessary crypto/canonicalization primitives.

UNDERPROVEN:
- StateArbitrator;
- grant provenance;
- broader platform seam;
- full generation registry;
- hostile OS-level isolation;
- generic bootstrap role.

EXPERIMENT-REQUIRED:
- graph reduction;
- exact generation-pin primitive.

CONTRADICTED CURRENT IMPLEMENTATION:
- zero-plugin boot;
- executable-entry confinement.

## Corrected responsibility universe

The previous matrix was too coarse. The expanded inventory explicitly separates:

- ownership/principal identity;
- composition and bootstrap role;
- plugin lifecycle/trust;
- capability definition/reference/realization/discovery;
- canonical data model, ontology, object lifecycle, revision;
- relationship and identity reconciliation;
- provenance/evidence/verification/epistemic state;
- schema/semantic/identity/relationship evolution;
- query/retrieval/projection/import/export/restore;
- Self-Knowledge/freshness/diagnostics;
- NCLL/symbolic command language/grounding/teaching;
- Intent/Plan/Spatial Intent;
- Authority/Law/Consent/Delegation/Risk;
- Work/Step/Attempt/Recovery/Scheduler;
- Agent/Execution realization;
- resources/provider/account/session/external resource;
- routing/provider knowledge/discovery/healing/browser;
- credentials/secrets;
- Memory/Context;
- Attention/Notification/Background/Return continuity;
- Workspace/Surface/Canvas/desktop interaction;
- Product Instance/configuration/persistence/continuity;
- product shell/OS/install/update;
- backup/sync/sharing/cross-machine delegation;
- universal acquisition/generic web resources;
- local intelligence/model lifecycle;
- Forge/distribution/evolution/compatibility/impact/migration/rollback;
- observability/diagnostics/interoperability/tooling.

## Important negative result

The expanded inventory does not itself justify K0 promotion of Self-Knowledge, NCLL, the dynamic data model, World, Intent, Work, Provider/Account/Session, Memory, Attention, Surface, Product Instance, Forge or Evolution.

Their importance is acknowledged as destination responsibility; their semantic ownership remains above K0 unless a concrete universal non-bypassable invariant proves otherwise.

## Immediate blockers

- B1 entry confinement;
- generic zero-plugin/bootstrap-role semantics;
- minimal State/Graph/Grant/Generation mechanisms;
- first-party/third-party symmetry;
- active Work continuation across replacement.

## Next action

Run a targeted Core adequacy/reduction exercise against the **expanded responsibility inventory**, not another broad Core-definition pass.

Required trace:

`responsibility → invariant → minimum generic enforcement → current Ω → evidence → gap → K0/K1/plugin/tooling`

Ratified Ω law remains authoritative.
