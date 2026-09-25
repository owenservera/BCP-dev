# HOST-RESPONSIBILITY-BY-FILE

| Host file | Responsibility slices | Classification | Extraction / reduction target | Critical finding |
|---|---|---|---|---|
| audit.ts | signed grant integrity; append-only grant history; export projection | PROVEN K0 + TOOLING | K0 keeps grant-integrity primitive; move export/history projection outward | Entire AuditLog is larger than constitutional need |
| boot.ts | vault init; verify; compose; spawn; readiness | PROVEN K0 + UNDERPROVEN | extract vault-format/key initialization; retain generic verify/activate/lifecycle | Contains product vault setup |
| canon.ts | canonical encoding; hashing; signatures; content hashing; atomic write; key file support | PROVEN K0 + UNDERPROVEN | retain crypto/integrity/atomic primitives; move root-key storage policy | Separate generic primitives from filesystem/key policy |
| contract.ts | generation publication; range matching; resolution | EXPERIMENT-REQUIRED | reduce to call-lifetime target pin contract; move registry/ranking outward | Current placement is continuity convenience, not proof of K0 necessity |
| genesis.ts | bootstrap identities; graph/audit/state/tool roots | UNDERPROVEN | reduce hardcoded roots to minimum trust anchor and generic bootstrap data | Several identities may be signed bootstrap data |
| graph.ts | nodes; signed grants; offer lookup; holder lookup; fan-in; blast radius; snapshot | EXPERIMENT-REQUIRED + PROVEN K0 primitive | keep minimal trusted route/grant state; move analytics/snapshot to tooling/plugin | Whole graph is not K0 |
| main.ts | CLI help; compose/verify; first-boot compile; run script | TOOLING / OUTSIDE RUNTIME | launcher around host | Not constitutional runtime |
| ports.ts | token checks; target dispatch; law gate; queues; priorities; lazy spawn; graph registration; journals; host ops | PROVEN K0 core + SYSTEM PLUGIN / TOOLING remainder | keep egress, dispatch, fail-closed lifecycle; move scheduling/analytics/projections outward | Largest semantic compression opportunity |
| recipe.ts | parse; signature/hash verification; composition invariants; compile; pin; entry verification | PROVEN K0 core + TOOLING + CONTRADICTED B1 subcase | keep verification; move compile; replace hardcoded law identity with bootstrap-role contract; enforce entry confinement | Current entry path can escape hashed tree |
| recovery.ts | incoming/pinned verification; fallback; stale swap cleanup | PROVEN K0 | retain generic recovery ceremony | Uses product-shaped recipe/build layout but mechanism is generic |
| state.ts | shared/exclusive keyed arbitration | UNDERPROVEN K0 | test smaller compare/fence or lease primitive | Current host ownership may be wider than necessary |
| worker.ts | worker creation; Port transport; ready/stop/crash; pool hook | PROVEN K0 + TOOLING | keep compartment/transport/lifecycle; move pool policy | Pool is optimization, not constitution |

## File-level conclusion

No host file should be classified as wholly K0 merely because it lives under host/src. The strongest future implementation gate is responsibility-level classification.