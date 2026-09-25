# K1-CONTRACT-BOUNDARY-AUDIT

| Contract / family | Classification | Why | Evolution concern |
|---|---|---|---|
| Manifest | PROVEN K1 | shared declaration of plugin identity, contributions, dependencies, runtime and risk | structural compatibility is not semantic compatibility |
| Recipe | PROVEN K1 + K0 use | composition/grant vocabulary; host verifies it | signed role fields should replace product-specific literals where possible |
| Port | PROVEN K1 | universal inter-compartment wire | changes affect every plugin; version discipline required |
| Lifecycle | PROVEN K1 | generic state vocabulary used by plugins | avoid baking domain lifecycle into enum |
| Capability | PROVEN K1 | stable capability identity/reference | definition is plugin-owned, enforcement is K0 |
| Outcome / Refusal | PROVEN K1 | expected-negative result envelope | keep refusal semantics attributable but domain-neutral |
| Plugin reference | PROVEN K1 | identity/version/dependency reference | identity continuity must be tested across replacement |
| Object reference | PROVEN K1 | ns/id stable reference | object meaning remains plugin-owned |
| Revision reference | PROVEN K1 | immutable historical pointer | migration must preserve revision genealogy |
| Evidence reference | PROVEN K1 | provenance pointer across boundaries | evidence is not authority |
| Intent reference | PROVEN K1 | canonical identity/citation | intent interpretation is plugin-owned |
| Work reference | PROVEN K1 | durable execution identity | active replacement semantics remain experimental |
| Authority frame | PROVEN K1 | caller/behalf/scope/authority envelope | law semantics remain plugin-owned |
| Change reference | PROVEN K1 | evolution proposal/change identity | constitutional changes use distinct admission |
| Provider realization | SYSTEM PLUGIN API | provider-domain semantics | not every plugin needs provider meaning |
| Runtime tier | PROVEN K1 | execution modality declaration | process/WASM semantics must stay generic |
| Resource/budget declaration | PROVEN K1 | declared runtime envelope | budget economics should not become host policy |
| Lang contribution | SYSTEM PLUGIN API over K1 | language-domain semantic data | 17-family grammar is product-specific, not K0 |
| Chat | SYSTEM PLUGIN API | conversation domain semantics | should not be prerequisite to generic runtime |
| World | SYSTEM PLUGIN API | canonical product/world semantics | identity refs can be K1 while object meaning remains outside |
| Work plan/attempt | SYSTEM PLUGIN API over K1 refs | execution-domain semantics | replacement and migration semantics need proof |
| Control bootstrap/describe | SYSTEM PLUGIN API | Personal Agent/control-plane semantics | static orientation should not become kernel ontology |
| Provider facade | SYSTEM PLUGIN API / convenience facade | aggregates provider+agent+control vocabulary | over-broad export surface can disguise semantic APIs as K1 |
| Storage driver | PROVEN K1 | DB-agnostic byte-store contract | storage engines remain replaceable |

## K1 gate

A contract is K1 when unrelated plugin families can implement/consume its observable shape without importing VIVIM product internals from the host. Domain-rich contracts may still be legitimate shared APIs, but they are SYSTEM PLUGIN APIs rather than constitutional K1.