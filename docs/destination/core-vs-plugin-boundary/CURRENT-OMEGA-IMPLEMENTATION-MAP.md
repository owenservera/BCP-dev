# Current Ω Implementation Map

| Responsibility | Current implementation | Boundary classification | Pass 3 finding |
|---|---|---|---|
| Genesis bootstrap | host/src/genesis.ts | UNDERPROVEN K0 | bootstrap identities require reduction test |
| Hashing/signatures/canonical encoding | host/src/canon.ts | PROVEN K0 primitive | keep core crypto/integrity subset |
| Content hashing | host/src/canon.ts | PROVEN K0 primitive | B1 entry confinement still open |
| Atomic write | host/src/canon.ts | PROVEN K0 | activation boundary is irreducible |
| Plugin compartments | host/src/worker.ts | PROVEN K0 for compartment boundary | OS-level sandbox claim remains underproven |
| Port transport | host/src/worker.ts + ports.ts | PROVEN K0 | single transport path is constitutional |
| Token ownership/scope/revocation | host/src/ports.ts | PROVEN K0 | host enforcement is direct evidence |
| Risk→law gate | host/src/ports.ts | PROVEN K0 mechanism | policy content remains plugin-owned |
| Routing target selection | host/src/graph.ts + contract.ts | EXPERIMENT-REQUIRED | reduce to minimal dispatch/pin primitive |
| State arbitration | host/src/state.ts | UNDERPROVEN K0 | shrink-test required |
| Grant provenance | host/src/audit.ts + graph.ts | UNDERPROVEN K0 | reduce to signed-grant primitive |
| Recipe parsing | host/src/recipe.ts | PROVEN K1/K0 use | empty composition currently rejected |
| Composition invariant vivim.law phase 0 | host/src/recipe.ts | UNDERPROVEN constitutional coupling | generic bootstrap role preferred |
| Composition compilation | host/src/recipe.ts | TOOLING / OUTSIDE RUNTIME | move out of K0 |
| Recovery | host/src/recovery.ts | PROVEN K0 | generic fail-closed pattern |
| CLI | host/src/main.ts | TOOLING / OUTSIDE RUNTIME | not constitutional |
| Contracts | contracts/src/* | PROVEN K1 + SYSTEM APIs | domain-rich portions are not constitutional |

## Important contradiction

Current Ω law says everything else is a plugin, but the present verifier still contains a named first-party boot-role requirement. This is a ratified coupling that must be treated as a temporary constitutional seam until a generic bootstrap-role design is proven.