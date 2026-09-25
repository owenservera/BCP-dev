# ActionPlan Harvest

## Evidence

- `src/engines/action-plan.ts`
- `src/engines/action-plan-compiler.ts`
- `src/engines/action-plan-bridge.ts`
- `src/engines/plan-validation-gate.ts`

Legacy lowers NLCL/browser/LLM proposals into one typed ActionPlan. The plan carries goal, nodes, capability, inputs, dependencies, risk, confirmation, verification, grounded refs and metadata. Validation rejects unknown capabilities, invalid inputs, risk mismatches, duplicate ids, unknown/self dependencies and cycles.

## Semantic invariant

> A user intent gets one inspectable execution representation, and that representation is validated before any side effect.

This creates a valuable preview boundary: what will happen, in what order, with what capability, inputs, risks and verification.

## Destination

| Legacy | Destination |
|---|---|
| goal | Intent / Work objective |
| capability | Capability |
| dependsOn | Composition dependency |
| risk/confirmation | Authority evaluation |
| verify | Success/evidence criterion |
| GroundedReference | Address / Context / Evidence |

## Preserve semantically

- one canonical deterministic execution representation;
- explicit dependencies;
- preflight validation;
- verification expectations;
- planning separated from effects.

## Rebuild under Ω

Plans become a lower-level representation feeding Work. Authority is not encoded by plan risk strings alone. Realized account/session/resource references are attached at Attempt level. Historical plans and evidence are revision-safe.

## Reject

- Zod/TypeScript as constitutional law;
- fixed node-count limits as product truth;
- risk enum names as universal authority;
- LLM-produced JSON as trusted authority;
- bridge behavior that treats the plan as optional when the actual destination action is required to pass through Work and Authority.

## Acceptance seed

`Intent → Plan → validate → authority → Work → ordered execution → verification → Result/Evidence`, with invalid plans causing zero effects.
