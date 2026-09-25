# Current Ω Implementation Map

| Responsibility | Current implementation | Boundary classification | Evidence |
|---|---|---|---|
| Genesis bootstrap | host/src/genesis.ts | K0 | D-340 lineage |
| Hashing, canonical encoding, signatures | host/src/canon.ts | K0 primitive | B1 / D-384 |
| Plugin compartments | host/src/worker.ts | K0 | B2 |
| Port routing and token enforcement | host/src/ports.ts | K0 + K1 | B3 / D-340 |
| Host operation vocabulary | contracts/src/lifecycle.ts | K1 + K0 enforcement mapping | B3 |
| Manifest/contribution vocabulary | contracts/src/manifest.ts | K1 | D-405 and lineage |
| Invocation frame | plugins/vivim-law/src/invocation.ts | System plugin | D-452 |
| Standing | plugins/vivim-law/src/standing.ts | System plugin | D-453 |
| Delegation | plugins/vivim-agent/src/delegation.ts | System plugin | D-454 |
| Adaptation governance | plugins/vivim-agent/src/adaptation.ts | System plugin | D-455 |
| Aperture/privacy | plugins/vivim-law/src/apertureprivacy.ts | System plugin | D-451 |
| Liveness/resource lifecycle | plugins/vivim-run/src/liveness.ts | System plugin | D-450 |
| Partial evaluation | plugins/vivim-run/src/partialeval.ts | System plugin | D-449 |
| Browser/provider realization | provider.browser lane | System/provider plugin | D-418 / D-456 |
| Forge | Forge plugins + authoring tooling | System plugin + tooling | D-405 / D-406 / D-417 |

## Interpretation

The implementation evidence supports a narrow host. The important architectural review task is to detect hidden host coupling and missing contracts rather than to enlarge K0 whenever a capability becomes central.