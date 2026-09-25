# Plugin Graph & Reprogrammability Audit

Ω genuinely supports composition inside existing contracts: manifests describe contributions and Recipe grants them. Port calls keep implementations decoupled.

But a new semantic protocol still requires contract/runtime change. Forge authoring is intentionally non-authoritative: it refuses signing, grants and composition membership.

Therefore:

- new provider inside existing realization family: **PLUGIN-EXTENSIBLE / EXPERIMENT**
- new parser inside governed parser contract: **PLUGIN-EXTENSIBLE**
- new surface inside existing surface contract: **CONTRACT-EXTENSIBLE**
- new semantic capability family: **REQUIRES CORE CHANGE**
- replacing a realization: **CONTRACT + PROOF dependent**
- self-authorizing product composition: **NOT CURRENTLY SUPPORTED**
