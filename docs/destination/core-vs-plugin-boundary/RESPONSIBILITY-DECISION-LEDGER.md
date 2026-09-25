# Responsibility Decision Ledger

This ledger applies the boundary test to the major destination responsibilities. Classification is per responsibility, so mixed areas may occupy multiple layers.

| Responsibility | Class | Why not K0 | Semantic owner | Canonical owner | Authority | Evolution | Maturity/read |
|---|---|---|---|---|---|---|---|
| Admission | K0+K1 | cannot be safely delegated | runtime | runtime receipt | K0 | constitutional | RATIFIED |
| Isolation | K0+K1 | plugin must not define its own isolation | runtime | runtime | K0 | constitutional | RATIFIED |
| Port transport | K0+K1 | bypass would break compartment boundary | protocol/runtime | runtime | K0 | constitutional | RATIFIED |
| Capability definition | K1+SP/EP | meaning varies by capability | capability plugin | plugin | K0 egress | governed | CURRENT |
| Law content | K1+SP | policy semantics are composition data | law plugin | law/vault | K0 enforcement | governed/constitutional edge | PARTIAL |
| Consent/standing | K1+SP | duration/context are policy semantics | law plugin | vault | law | governed | PARTIAL |
| Vault implementation | K1+SP | storage engine is replaceable | vault plugin | vault | law | governed | PARTIAL |
| Object model | K1+SP | domain ontology cannot be constitutional | domain plugins | vault/world | authority | governed | PARTIAL |
| Relationship model | K1+SP | predicates are domain meaning | domain plugins | world/vault | authority | governed | PARTIAL |
| Evidence storage | K1+SP | evidence meaning/storage can evolve | evidence plugin | vault/evidence | authority | governed | PARTIAL |
| Intent interpretation | K1+SP | language realization is replaceable | NL/intent plugin | intent store | law | governed | PARTIAL |
| Spatial intent | K1+SP | user interaction semantics are product meaning | interaction plugin | intent/work | law | governed | DESIGN |
| Work semantics | K1+SP | durable work is a domain object | run/work plugin | work/vault | authority | governed | PARTIAL |
| Agent/delegation | K1+SP | delegation policy is semantic | agent/law plugins | work/control | authority | governed | PARTIAL |
| Provider knowledge | K1+SP | external reality changes | provider plugin | provider domain | authority | governed | UNDERPROVEN |
| Account/session | K1+SP | external relationship is user/domain state | provider plugin | provider domain | authority | governed | UNDERPROVEN |
| Routing | K1+SP | selection policy is contextual/product policy | routing plugin | routing state | law/user | governed | PROPOSED |
| Browser/CDP | K1+SP | realization detail is provider-specific | browser plugin | provider/session | authority | governed | IMPLEMENTATION |
| Discovery/healing | K1+SP | discovery is evidence-driven behavior | discovery plugin | evidence/change | Forge/law | governed | DESIGN |
| Memory/context | K1+SP | epistemic/product semantics vary | mind/context plugin | memory/context | authority | governed | DESIGN |
| Surface/canvas | K1+SP/EP | projection can be replaced | surface plugin | presentation state | aperture/law | governed | PRODUCT FRONTIER |
| Forge authoring | SP/T | generation is not trust | Forge/tooling | proposals/artifacts | K0 admission | governed | PARTIAL |
| Evolution analysis | K1+SP/T | impact/compatibility logic evolves | evolution plugin | change records | authority | governed | DESIGN |
| Product Instance | K1+SP | product lifecycle is product meaning | product plugin | product state | lifecycle/law | governed | L-1/L1 |
| OS integration | K0 seam + SP/EP | only generic safety boundary is kernel | platform/product | OS resources | K0 + user | governed | L-1 |
| Resource enforcement | K0 substrate + SP | hard safety bounds generic; economics contextual | runtime/plugin | resource state | authority | governed | MIXED |
| Self-Knowledge | K1+SP | projection of system reality is not trust root | mind/self-knowledge | derived view | authority | governed | DESIGN |
| Diagnostics | SP/T | diagnostic interpretation is not runtime trust | diagnostics | evidence | operator/user | governed | PARTIAL |

## Default decision

When evidence is ambiguous, classify upward only the smallest mechanism and leave semantics outside. The burden of proof is on K0 expansion.