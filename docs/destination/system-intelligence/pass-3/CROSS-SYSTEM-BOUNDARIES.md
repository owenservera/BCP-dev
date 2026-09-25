# Pass 3 — Cross-System Boundaries

> Classification: DERIVED — CURRENT BOUNDARY MAP
> Status: candidate invariants require experiment/proof where marked.

| Boundary | Control | Data | Authority | Evidence | Recovery | Status |
|---|---|---|---|---|---|---|
| Provider↔Account | account selected against provider candidate | account identity refs | account policy + law | provider identity observation | re-auth/disconnect | DESIGN-CANDIDATE |
| Account↔Session | session acquisition for selected account | accountRef on session | session lease, law | auth/session proof | reconnect or refuse | DESIGN-CANDIDATE |
| Session↔Browser | session acquires exact resource | profile/process/target refs | resource lease | ownership proof | reattach only if proven | EXPERIMENT-REQUIRED |
| Provider↔Realization | realization selected for capability | providerId/archetype/pins | promotion lifecycle | verification evidence | degrade/rediscover | EVIDENCE-SUPPORTED |
| Provider↔Routing | route policy filters valid realizations | policy/candidate/decision refs | user policy, law | decision record | ask/fallback per policy | DESIGN-CANDIDATE |
| Artifact↔World | object becomes addressable world thing | object envelope + relation refs | object lifecycle | provenance/evidence | restore by identity | DESIGN-CANDIDATE |
| Work↔Evidence | work records outcome and supporting proof | Work refs/evidence refs | work authority/law | receipts + outcome | checkpoint/recover | DESIGN-CANDIDATE |
| World↔Surface | surface projects world | object refs/layout | surface mutation scope | basis/object refs | restore projection | EXPERIMENT-REQUIRED |
| Plugin↔Runtime | plugin invokes declared contract via ports | manifest/Recipe/deps/state refs | Recipe/host/law | boot/ledger evidence | composition recovery | EVIDENCE-SUPPORTED |
| Canonical Data↔Self-Knowledge | derivation reads canonical basis | basis refs/digest | source remains authority | freshness basis | stale/recompute | DESIGN-CANDIDATE |
| Composition↔Product Instance | instance selects/owns active composition | instance/composition refs | Recipe + instance policy | boot/recovery receipts | previous known-good | DESIGN-CANDIDATE |
| Export↔Restore | archive mapped to instance | identity/revision/provenance refs | restore policy | archive/verify receipts | rollback/retry | UNRESOLVED |

## Boundary invariants to test

1. **Identity** — external effect has one attributable account/session/resource chain.
2. **No substitution** — failed identity proof causes refusal, not best-effort attachment.
3. **Policy** — route choice never grants authority.
4. **Projection** — surface state never becomes canonical merely by being visible.
5. **Durability** — canonical revisions survive compaction and export rules.
6. **Continuity** — Work can be reconstructed from the last durable checkpoint.
7. **Freshness** — derived currentness is tied to its basis.
8. **Evolution** — generated proposals are never equivalent to promoted capability.
