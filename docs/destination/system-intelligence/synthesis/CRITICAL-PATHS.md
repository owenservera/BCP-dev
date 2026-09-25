# Critical Paths

## Highest-centrality atomic dependencies

1. SI-010103 — Vault durability and revisioned evidence; direct dependents 14, transitive 23, downstream journeys 8, slices 9, workstreams 7, proof-critical downstream 23, external exposure yes, unknowns 0, complexity 10
2. SI-010104 — Law / authority gate; direct dependents 7, transitive 22, downstream journeys 8, slices 9, workstreams 7, proof-critical downstream 22, external exposure yes, unknowns 0, complexity 8
3. SI-010101 — Recipe authority; direct dependents 4, transitive 25, downstream journeys 8, slices 9, workstreams 7, proof-critical downstream 25, external exposure yes, unknowns 0, complexity 9
4. SI-010105 — Canonical intent persistence; direct dependents 4, transitive 22, downstream journeys 8, slices 9, workstreams 7, proof-critical downstream 22, external exposure yes, unknowns 0, complexity 9
5. SI-020102 — Legacy Provider Account model; direct dependents 5, transitive 15, downstream journeys 8, slices 9, workstreams 7, proof-critical downstream 15, external exposure yes, unknowns 0, complexity 10
6. SI-010107 — Derived self-knowledge lens; direct dependents 6, transitive 9, downstream journeys 8, slices 9, workstreams 5, proof-critical downstream 10, external exposure yes, unknowns 0, complexity 9
7. SI-030101 — Standalone Ω all-plugin baseline; direct dependents 3, transitive 10, downstream journeys 8, slices 9, workstreams 8, proof-critical downstream 9, external exposure yes, unknowns 0, complexity 9
8. SI-020105 — ChromeGovernor as historical browser authority; direct dependents 3, transitive 8, downstream journeys 8, slices 9, workstreams 5, proof-critical downstream 9, external exposure yes, unknowns 0, complexity 10
9. SI-020103 — Legacy ProviderSession/ProfileSession chain; direct dependents 2, transitive 8, downstream journeys 8, slices 9, workstreams 5, proof-critical downstream 9, external exposure yes, unknowns 0, complexity 10
10. SI-030106 — BCP provider-browser live divergence; direct dependents 4, transitive 5, downstream journeys 8, slices 9, workstreams 3, proof-critical downstream 6, external exposure yes, unknowns 2, complexity 10

## Build/proof paths

Provider chain: message.send/live realization → promoted ProviderRealization → attached browser session → Account/route selection → authority gate → external mutation → evidence. The graph proves only the middle and governance seams today; Account selection/routing remain UNSCOPED.

Product chain: Product Instance → durable persistence → active composition → world projection → surface/workspace/canvas → restart reconstruction. The Ω substrate exists, but the product-level wrapper and reconstruction journey remain UNSCOPED/PARTIAL.

Interaction chain: world/self-knowledge → canonical intent → authority → execution/work → evidence. This is the strongest internally evidenced semantic chain, but durable work/continuity remains product-partial.

Evolution chain: Forge provenance → harvested legacy mechanisms → generalized provider/discovery/healing artifacts → promoted realizations. This is a program mechanism, not evidence that autonomous healing is already live.

## Deep-dive candidates selected from graph reach and boundary exposure

1. SI-050101 — Provider ↔ Account
2. SI-050102 — Account ↔ Session ↔ Browser
3. SI-030106 — BCP provider-browser live divergence
4. SI-060102 — Provider live code still needs live proof
5. SI-050107 — Product Instance ↔ Persistence
6. SI-010105 — Canonical intent persistence
7. SI-010103 — Vault durability and revisioned evidence
8. SI-050105 — Work ↔ Evidence
9. SI-040102 — World projection
10. SI-040103 — Space / workspace / canvas projection
11. SI-040105 — Durable work and continuity
12. SI-060107 — Continuity / attention
