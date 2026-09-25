# Destination Responsibility Matrix

| Responsibility | Class | Semantic owner | Canonical data owner | Authority | Replacement seam | Status |
|---|---|---|---|---|---|---|
| Admission/integrity | K0+K1 | Core protocol | Core receipts | Core | constitutional | RATIFIED |
| Isolation/transport | K0+K1 | Core protocol | runtime | Core | host tier | RATIFIED |
| Capability definition | K1+SP/EP | plugin | plugin | Core egress | capability contract | DERIVED |
| Law/policy | K1+SP | law plugin | law/vault | Core enforcement | policy contract | DERIVED |
| Vault | K1+SP | vault plugin | vault | law/authority | vault protocol | PARTIAL |
| Object/relationship | K1+SP | domain plugins | domain/vault | authority | object contract | PARTIAL |
| Evidence/provenance | K1+SP | producers/store | evidence plugin | authority | evidence contract | PARTIAL |
| Intent/NLCL | K1+SP | intent/language | intent plugin | law | intent contract | PARTIAL |
| Spatial Intent | K1+SP | interaction plugin | intent/work refs | law | interaction contract | DESIGN-REQUIRED |
| Work/Agent | K1+SP | run/agent | work/vault | authority | Work/agent contract | PARTIAL |
| Provider/Account/Session | K1+SP | provider plugins | provider/account | authority | provider contract | UNDERPROVEN |
| Browser realization | K1+SP | provider.browser | provider/session | authority | realization contract | IMPLEMENTATION-REQUIRED |
| Routing | K1+SP | routing/provider | routing state | policy | routing contract | PROPOSED |
| Discovery/healing | K1+SP | discovery | change/evidence | Forge/law | evolution contract | DESIGN-REQUIRED |
| Memory/context | K1+SP | mind/context | memory/context | authority | context contract | DESIGN-REQUIRED |
| Surface/canvas | K1+SP/EP | surface | presentation state | aperture/law | surface contract | PRODUCT FRONTIER |
| Product Instance | K1+SP | product plugin | product state | lifecycle/law | product contract | L-1/L1 |
| Forge | K1+SP/T | Forge | proposals/artifacts | Core admission | evolution contract | PARTIAL |
| Evolution | K1+SP/T | evolution | change/evidence | constitutional boundary | change contract | DESIGN-REQUIRED |
| OS integration | K0 seam + SP/EP | platform/product | OS resources | Core + user | platform contract | L-1 |
| Tooling/CI | T | tooling | repo/dev vault | outside runtime | tool interface | CURRENT |