# System Intelligence — Current State

> Classification: DERIVED — CURRENT
> Wave 1 archaeology and first synthesis complete. Research remains non-authoritative.

## Archaeology status
**WAVE 1 SYNTHESIS COMPLETE — STOPPED BEFORE IMPLEMENTATION**

Six investigator packages are complete. No production code was modified.

## Investigator completion
| Role | Status | Focus |
|---|---|---|
| SI-01 | COMPLETE | Ω runtime, law, vault, intent, execution, self-knowledge |
| SI-02 | COMPLETE | Legacy provider/account/session, conversations, browser, discovery/healing, surface behavior |
| SI-03 | COMPLETE | standalone Ω to BCP lineage |
| SI-04 | COMPLETE | Product Instance, world, workspace, canvas, surface |
| SI-05 | COMPLETE | cross-boundary dependencies |
| SI-06 | COMPLETE | contradictions, proof limits, frontier threats |

## Counts
- Atoms: 44
- Edges: 65
- Unique evidence records: 99
- Metrics: direct dependents, transitive dependents, journey reach, vertical-slice reach, workstream reach, proof dependency reach, external-reality exposure, uncertainty, existing destination complexity.
- No composite importance score.

## Highest-impact dependencies from the graph
1. SI-010103 Vault durability/evidence — 14 direct dependents; 23 transitive; 8/8 journeys; 9 downstream slices; 7 workstreams; 23 proof-critical downstream atoms; external exposure.
2. SI-010101 Recipe authority — 4 direct; 25 transitive; 8 downstream journeys; 9 downstream slices; 7 workstreams; 25 proof-critical downstream atoms; external exposure.
3. SI-010104 Law/authority — 7 direct; 22 transitive; 8 downstream journeys; 9 downstream slices; 7 workstreams; 22 proof-critical downstream atoms; external exposure.
4. SI-010105 Canonical intent — 4 direct; 22 transitive; 8 downstream journeys; 9 downstream slices; 7 workstreams; 22 proof-critical downstream atoms; external exposure.
5. SI-020102 Legacy ProviderAccount — 5 direct; 15 transitive; 8 downstream journeys; 9 downstream slices; 7 workstreams; external exposure.
6. SI-010107 Self-knowledge lens — 6 direct; 9 transitive; 8 downstream journeys; 9 downstream slices; 5 workstreams.
7. SI-030106 BCP provider-browser live divergence — 4 direct; 5 transitive; 8 downstream journeys; 9 downstream slices; external exposure; 2 explicit unknowns; proof CODE+TEST with NO-LIVE-RUN.

These are graph dimensions, not product rankings.

## Highest-uncertainty atoms
- SI-050101 / SI-050102: canonical Account, authentication/profile ownership, account selection, session expiry/reconnect.
- SI-030106 / SI-060102: owner-machine Chrome run and live proof.
- SI-050108 / SI-060103: routing policy, fallback, route explanation.
- SI-040101 / SI-050107 / SI-060105: Product Instance identity, durable boundary, replacement/update and shell scope.
- SI-040102 / SI-060104: world breadth, identity reconciliation, projection bounds.
- SI-040105 / SI-060107: Work identity, continuation, attention and notification semantics.

## Deep dives selected after Wave 1 graph
1. Provider ↔ Account ↔ Session ↔ Browser: SI-050101, SI-050102.
2. Provider-browser live proof: SI-030106, SI-060102.
3. Product Instance ↔ Persistence: SI-040101, SI-050107, SI-060105.
4. Intent ↔ Capability ↔ Authority: SI-010105, SI-050104.
5. Vault ↔ Work ↔ Evidence: SI-010103, SI-050105.
6. World ↔ Surface: SI-040102, SI-040103, SI-050106.
7. Durable Work ↔ Attention: SI-040105, SI-060107.
8. Canonical AI Chat/provider translation: SI-020104 plus VS2 trace.

No deep-dive implementation is authorized.

## Major contradictions
- provider-browser live implementation versus owner-side live proof pending;
- Legacy ChromeGovernor versus current Ω plugin-local CDP;
- concrete Legacy Account model versus missing/proposed canonical Ω Account/routing;
- Ω implementation maturity versus destination product maturity;
- bounded mind WorldModel versus broader destination whole-world model.

## Open frontier
Product shell/lifecycle; Account/routing/session; whole-world projection; canonical AI conversation translation; durable Work; continuity/Attention; general desktop/filesystem/native-app/device/network reality; generic web/resource substrate; local intelligence/model lifecycle; plugin distribution; multi-device continuity.

See synthesis/OPEN-FRONTIER.md and synthesis/RED-TEAM-REPORT.md.

## Boundaries investigated
Provider↔Account; Account↔Session↔Browser; Capability↔Realization; Intent↔Capability↔Authority; Work↔Evidence; World↔Surface; Product Instance↔Persistence; Provider↔Routing; Ω runtime↔composition; Legacy↔Ω lineage; external provider reality.

## Synthesis commits
- Open Frontier: 1059aed7dd2fa0a2f6e43230fb5d3e1a7959357a
- Red Team / synthesis-series tip: 4c28dd29a18e8c363fbe4ce911a46a4e207d2862
- State update: current commit returned below

The GitHub contents API landed the synthesis as a short commit series rather than one monolithic commit. The Red Team commit is the synthesis-series tip.

## Recommended next action
**Do not implement.** Open the Provider ↔ Account ↔ Session ↔ Browser characterization using one real authenticated provider account and prove: selected account → session → realization → governed external effect → evidence.