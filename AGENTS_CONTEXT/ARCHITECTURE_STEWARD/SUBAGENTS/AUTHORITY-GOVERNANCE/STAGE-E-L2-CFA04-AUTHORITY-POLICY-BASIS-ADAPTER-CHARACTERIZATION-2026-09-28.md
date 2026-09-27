# CFA-04 — Stage-E L2 Authority/Policy Basis Adapter Characterization
## 2026-09-28

> Status: CHARACTERIZED / PARTIAL
> Owner: CFA-04 Authority / Governance
> Scope: Authority/policy dependency basis for Stage-E derived-view freshness.
> Authority: derived readiness evidence; not Ω law, not a permission decision, not a runtime implementation.

## 1. Objective

Characterize the CFA-04-owned authority/policy basis required when a Stage-E self-knowledge view describes governing authority evidence. The adapter must allow freshness comparison without interpreting self-knowledge as permission and without creating a second authority store.

## 2. Adapter record

| Field | Characterization |
|---|---|
| adapterId | cfa04:authority-policy |
| ownerCFA | CFA-04 |
| basisKind | authority-policy-dependency |
| canonical policy source | `omega-baseline/omega-final/plugins/vivim-law/src/policy.ts` `LAW_POLICY_V1` |
| policy identity | `policyId = law.policy` |
| current policy version | `1.9.0` |
| law composition source | `omega-baseline/omega-final/plugins/vivim-law/plugin.json` |
| current law manifest version | `0.3.0` |
| governed contract references | `law.describe@1`, `invoke.check@1` |
| repository source revision token | policy source file SHA `f66e7049502cafacba3b35e238ad9d368c8e4ede`; manifest SHA `0d4e83eec4cf50fafd67a76a27f7793a1ce92ca3` |
| runtime immutable source token | UNKNOWN — manifest `contentHash` is empty and `law.describe@1` does not currently expose policy/source digest |
| resolver | resolve the governing policy identity/version from the canonical law policy source; for runtime promotion, require a separately attributable runtime source token before claiming immutable-source freshness |
| output BasisRef | policy id + policy version + law manifest version + governed contract refs; repository source revision may be attached as evidence |
| freshness comparison | compare current declared policy/source basis against the derived view's recorded basis; do not infer currentness from timestamps |
| STALE | known governing policy version or attributable source basis changes from the recorded basis |
| UNRESOLVABLE | the required governing policy identity/version or attributable source basis cannot be established |
| CONFLICTED | declared policy/version and attributable source/runtime observations disagree, or multiple incompatible governing bases are simultaneously asserted |
| evidence | current `policy.ts`, `plugin.json`, D-452 invocation decision, Stage-E readiness contract, CFA-04 authority corridor evidence |
| falsifier | alter a material policy rule while retaining policy version `1.9.0`; version-only comparison must not falsely leave the dependent derived view CURRENT when the source revision changes |
| residual UNKNOWN | exact runtime deployment/source binding for the active law implementation and policy bytes |

## 3. Basis semantics

The minimum authority/policy dependency is a description of **what governing source a derived view depends on**, not a cached authorization verdict.

A valid basis may identify:

```text
law.policy
  + policy version
  + law composition version
  + relevant contract identities
  + attributable source revision when available
```

It must not contain or manufacture:

```text
authorized = true
authorized = false
```

Those are gate-time Authority results and remain outside the self-knowledge freshness plane.

## 4. Current evidence

### OBSERVED / CURRENT

- `LAW_POLICY_V1` declares `policyId = law.policy` and version `1.9.0`.
- The law plugin manifest declares version `0.3.0`.
- The policy source and manifest have stable repository file revisions on the current mainline.
- D-452 requires live authority re-resolution at every consequential check; cached consent is explicitly invalid as current authority.
- `law.describe@1` exposes principal, kind, forbidden state, consent state and law generation, but does not currently expose a policy-content digest or immutable runtime source token.

### DERIVED / CURRENT

- Policy/version is a valid dependency identity for the semantic description layer.
- Repository source revision strengthens the basis when a derived view is tied to a specific repository revision.
- A derived view depending on authority policy must become STALE when the governing basis changes, rather than treating the prior policy version as permanently current.
- Self-knowledge must never resolve the basis into permission.

### PROPOSED / CURRENT

For Stage-E, use a non-authoritative BasisRef conceptually equivalent to:

```text
{
  kind: "authority-policy",
  policyId: "law.policy",
  policyVersion: "1.9.0",
  lawManifestVersion: "0.3.0",
  contracts: ["law.describe@1", "invoke.check@1"],
  sourceRevision?: <attributable repository/runtime revision>,
}
```

This is a characterization only; it is not a frozen shared TypeScript schema.

## 5. Resolution and freshness rules

**R1 — canonical source first:** the declared authority policy source is the law policy data, not an inferred graph/code relationship.

**R2 — policy identity is not permission:** policy/version identifies a governing dependency; it never answers whether a principal may perform an operation.

**R3 — live authority remains separate:** current authorization is obtained through the existing law/invocation gate and its current authority rows.

**R4 — version-only falsifier:** retaining version `1.9.0` while changing material policy content must invalidate any source basis that depends on the changed content.

**R5 — immutable-source limit:** because the current law manifest has an empty `contentHash` and `law.describe@1` does not return a source digest, runtime immutable-source freshness cannot presently be claimed from runtime observation alone.

**R6 — unresolved is explicit:** when the active runtime basis cannot be attributed at required strength, the derived view reports UNRESOLVABLE rather than guessing CURRENT.

**R7 — contradiction remains visible:** if declared policy metadata and attributable source/runtime evidence disagree, preserve CONFLICTED rather than selecting a winner inside CFA-04.

## 6. Falsifier matrix

| Claim | Falsifier / expected result |
|---|---|
| policy version alone proves unchanged governing source | modify a material policy rule while retaining `1.9.0`; version-only comparison must fail to certify CURRENT |
| repository revision proves deployed runtime bytes | deploy/execute a different runtime law build with the same repository-facing version; the adapter must require attributable runtime binding rather than assuming equivalence |
| self-knowledge freshness establishes authorization | present a CURRENT derived authority description to `invoke.check@1`; authorization must still be independently resolved |
| stale policy can remain CURRENT | change a material governing basis and verify the dependent derived view becomes STALE or UNRESOLVABLE |
| missing governing source can be treated as unchanged | remove the required policy/source token; expected result is UNRESOLVABLE |
| conflicting policy declarations can be silently selected | provide incompatible declared/current basis observations; expected result is CONFLICTED |

## 7. Ownership boundary

CFA-04 owns:
- authority/policy dependency meaning;
- live-vs-historical authority distinction;
- authority evidence required by the derived description.

CFA-04 does not own:
- generic BasisRef mechanics;
- canonical Data storage;
- self-knowledge derivation runtime;
- graph bundle mechanics;
- K0 enforcement implementation;
- provider, Work or surface semantics.

## 8. Stage-E L2 classification

**CHARACTERIZED / PARTIAL**

The semantic dependency is now explicit and bounded:
- governing policy identity/version is identified;
- repository source revision evidence is available;
- stale/unresolvable/conflicted behavior is defined;
- the non-authority boundary is explicit;
- the remaining runtime-source binding is explicitly UNKNOWN because current runtime-visible identity is insufficient.

No shared contract is frozen by this artifact.

## 9. Non-actions

No production code changed.
No runtime adapter was implemented.
No new authority store or identity system was created.
No Ω law changed.
No permission decision was made by the self-knowledge plane.
