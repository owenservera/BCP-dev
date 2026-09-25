# Dependency Map

## Atomic graph metrics

| Atom | Direct dependents | Transitive dependents | Downstream journeys | Downstream slices | Downstream workstreams | Proof dependency reach | External-reality exposure | Unknowns | Complexity |
|---|---:|---:|---:|---:|---:|---:|---|---:|---:|
| SI-010103 Vault durability and revisioned evidence | 14 | 23 | 8 | 9 | 7 | 23 | yes | 0 | 10 |
| SI-010104 Law / authority gate | 7 | 22 | 8 | 9 | 7 | 22 | yes | 0 | 8 |
| SI-010101 Recipe authority | 4 | 25 | 8 | 9 | 7 | 25 | yes | 0 | 9 |
| SI-010105 Canonical intent persistence | 4 | 22 | 8 | 9 | 7 | 22 | yes | 0 | 9 |
| SI-020102 Legacy Provider Account model | 5 | 15 | 8 | 9 | 7 | 15 | yes | 0 | 10 |
| SI-010107 Derived self-knowledge lens | 6 | 9 | 8 | 9 | 5 | 10 | yes | 0 | 9 |
| SI-030101 Standalone Ω all-plugin baseline | 3 | 10 | 8 | 9 | 8 | 9 | yes | 0 | 9 |
| SI-020105 ChromeGovernor as historical browser authority | 3 | 8 | 8 | 9 | 5 | 9 | yes | 0 | 10 |
| SI-020103 Legacy ProviderSession/ProfileSession chain | 2 | 8 | 8 | 9 | 5 | 9 | yes | 0 | 10 |
| SI-030106 BCP provider-browser live divergence | 4 | 5 | 8 | 9 | 3 | 6 | yes | 2 | 10 |
| SI-050101 Provider ↔ Account | 4 | 5 | 8 | 9 | 3 | 6 | yes | 2 | 10 |
| SI-010106 Execution/context substrate | 3 | 4 | 8 | 9 | 4 | 5 | yes | 0 | 10 |
| SI-030102 Standalone provider-browser was fixture-first | 1 | 6 | 8 | 9 | 3 | 7 | yes | 0 | 10 |
| SI-030103 D-418 / D-456 Chrome-only v1 sequencing | 1 | 6 | 8 | 9 | 3 | 7 | yes | 0 | 10 |
| SI-040101 VIVIM Product Instance | 3 | 3 | 8 | 9 | 4 | 4 | yes | 1 | n/a |
| SI-010102 µhost / Port Protocol | 1 | 5 | 8 | 9 | 4 | 6 | yes | 0 | 9 |
| SI-040105 Durable work and continuity | 2 | 2 | 8 | 9 | 3 | 3 | yes | 1 | n/a |
| SI-050103 Capability ↔ Realization | 1 | 3 | 8 | 9 | 4 | 4 | yes | 0 | 10 |
| SI-040102 World projection | 2 | 2 | 8 | 9 | 3 | 3 | no | 2 | n/a |
| SI-020104 Legacy conversation/message persistence | 1 | 3 | 8 | 9 | 5 | 4 | no | 0 | 9 |

Metrics remain separate; no composite importance score is used.

## Evidence-backed dependency chains

Provider chain: message.send/live realization → promoted ProviderRealization → attached browser session → Account/route selection → authority gate → external mutation → evidence. The graph proves only the middle and governance seams today; Account selection/routing remain UNSCOPED.

Product chain: Product Instance → durable persistence → active composition → world projection → surface/workspace/canvas → restart reconstruction. The Ω substrate exists, but the product-level wrapper and reconstruction journey remain UNSCOPED/PARTIAL.

Interaction chain: world/self-knowledge → canonical intent → authority → execution/work → evidence. This is the strongest internally evidenced semantic chain, but durable work/continuity remains product-partial.

Evolution chain: Forge provenance → harvested legacy mechanisms → generalized provider/discovery/healing artifacts → promoted realizations. This is a program mechanism, not evidence that autonomous healing is already live.