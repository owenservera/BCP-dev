# Contract Layer Map

K1 is the shared protocol language between Core and plugins.

| Contract | Shared meaning | Core use | Plugin use |
|---|---|---|---|
| Manifest/Recipe | declared composition/admission | verify | declare |
| Port | message boundary | transport | call/respond |
| Lifecycle | admitted/ready/running/stopped/recovering | enforce generic state | domain state |
| Capability reference | stable capability identity | egress check | define/implement |
| Outcome/refusal | result/refusal envelope | transport integrity | domain result |
| Plugin reference | identity/version | admission | dependency |
| Object/revision ref | stable canonical pointer | protect format/integrity | own semantics |
| Evidence ref | provenance pointer | preserve envelope | produce/consume |
| Intent ref | canonical intent identity | carry citation | interpret/execute |
| Work ref | durable Work identity | route safely | own Work semantics |
| Authority frame | caller/behalf/scope/authority | enforce shape/egress | resolve policy/content |
| Change ref | proposed change identity | admission/activation | analyze/propose |

Contracts are implementation-agnostic and versioned. A contract change is not automatically a K0 change; compatibility and impact are evaluated before activation.