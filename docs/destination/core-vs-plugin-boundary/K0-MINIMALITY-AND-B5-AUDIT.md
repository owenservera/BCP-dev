# K0-MINIMALITY-AND-B5-AUDIT

> Host budget: 1500/1500 under ratified B5. This pass does not add production code.

## Current host budget conclusion

B5 is functioning as an architectural forcing function. The correct question is not how to make the host fit by deleting useful enforcement, but how to remove responsibilities that do not need to be constitutional.

## Extraction candidates

| Current responsibility | Current host location | Target | Why safe to extract | Priority |
|---|---|---|---|---|
| CLI help/compose/verify wrapper | main.ts | tooling / launcher | no plugin safety property | P0 |
| Composition compilation | recipe.ts | tooling / authoring | build-time ceremony, not runtime trust | P0 |
| Graph fan-in/blast-radius/snapshot | graph.ts | tooling / kernel-lens plugin | analysis is not admission enforcement | P0 |
| Audit export projection | audit.ts | kernel-lens/plugin | read projection, not trust root | P0 |
| Worker-pool acquisition policy | worker.ts | run/resource plugin | optimization, not isolation | P1 |
| Vault format initialization | boot.ts | vault/product bootstrap | storage semantics are not universal | P1 |
| Root-key file lifecycle policy | boot.ts/canon.ts | platform/credential seam | key storage policy is environment-specific | P1 |
| Queue priority and scheduling policy | ports.ts | run/resource plugin | product scheduling semantics | P1 |
| Graph registration analytics | ports.ts | graph/evolution service | not required to enforce the call itself | P1 |
| Generation registry storage | contract.ts | contract/runtime service | K0 needs a stable in-call pin, not a full version registry | P1 |

## K0 reduction target

The host should converge toward five constitutional duties:

1. Verify/admit an exact signed composition.
2. Establish the compartment/transport boundary.
3. Enforce capability egress and generic authority fencing.
4. Make activation and recovery atomic/fail-closed.
5. Provide only the minimum platform/crypto/lifecycle primitives needed for those duties.

## B5 does not justify semantic deletion

Removing a constitutional primitive only because it costs LOC would weaken the architecture. Conversely, retaining analytics, CLI, composition compilation or product bootstrap code because it is convenient would abuse B5.

## B5 finding

Result: PROVEN K0 minimality constraint; current host contains multiple extraction opportunities. The cap is not itself a blocker for constitutional enforcement, but the implementation must remove non-K0 responsibilities before adding host behavior.

## B5 falsifier

F-P3-13 remains open only if a genuinely universal, non-bypassable K0 primitive is demonstrated to exceed the remaining budget after all safe extraction opportunities are taken. No such necessity has been demonstrated in this pass.