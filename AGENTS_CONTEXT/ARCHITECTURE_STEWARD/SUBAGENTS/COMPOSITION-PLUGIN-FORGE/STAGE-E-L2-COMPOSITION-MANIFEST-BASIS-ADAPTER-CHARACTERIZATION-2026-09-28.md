# CFA-07 — Stage E L2 Composition / Manifest Basis Adapter Characterization

> Date: 2026-09-28
> CFA: **CFA-07 — Composition / Plugin / Forge**
> Owner: `composition-plugin-forge`
> Status: **L2 CHARACTERIZATION COMPLETE — REPRESENTATION-LEVEL BASIS CLOSED / LOGICAL IDENTITY REMAINS OPEN**
> Classification: derived owner-scoped readiness evidence; not Ω law, not a canonical identity store, not a runtime-join implementation.

## 1. Adapter record

| Field | Characterization |
|---|---|
| `adapterId` | `cfa07.composition-manifest-admission-basis@1` |
| `ownerCFA` | CFA-07 |
| `basisKind` | `COMPOSITION_MANIFEST_ADMISSION` |
| Canonical/current source | governed Recipe / CompositionEntry plus signed Manifest identities used by the admission/scan path |
| Source revision tokens available today | Recipe structure and signature; per-entry `manifestHash`; per-entry `contentHash`; existing composition/manifest source bytes |
| Resolver | resolve the current admitted Recipe for the target composition representation, then resolve each required entry manifest/content identity from the Recipe pins |
| Output | one or more generic L1 `BasisRef` / dependency tokens describing the exact admitted composition representation and its member artifact pins |
| Freshness | computed by comparing the recorded basis vector against current resolved Recipe/member tokens; stored freshness is only a cache hint |
| `STALE` | any required Recipe/member basis token differs from the recorded token while the current source remains resolvable |
| `UNRESOLVABLE` | the required admitted Recipe, manifest/content identity, or required source revision cannot be resolved |
| `CONFLICTED` | the required source set resolves but the owner-defined composition representation is internally inconsistent, e.g. a pinned member hash does not match the resolved artifact identity |
| Evidence | current Recipe/Manifest contracts, composition matrix/generator evidence, composition scan/activation evidence, CFA-07 survivor proof pack, CFA-07 Wave-3 reconciliation |
| Falsifier | alter a representation/member basis that should invalidate a derived view and verify that the old view cannot remain CURRENT |
| Explicit unknowns | logical Composition identity, semantic-revision discriminator, rename semantics, membership-change threshold, exact runtime Recipe retrieval shape |

## 2. Source evidence

### 2.1 Manifest contract

Current `PluginManifest` is versioned as `manifestVersion: "1"` and contains:

- plugin `id`;
- plugin `version`;
- signed `publisher` identity/signature;
- contribution declarations;
- dependency declarations;
- requested capabilities;
- runtime declaration;
- `contentHash`.

The manifest is a request/declaration, not a grant.

Source:

`omega-baseline/omega-final/contracts/src/manifest.ts`

Repository blob observed:
`16570d1c65f0c2fa6f6348519a1ed15733ceafe9`

### 2.2 Recipe contract

Current `Recipe` is:

`{ recipeVersion, hashAlgo, name, composition[], rootOfTrust, signature }`

Each `CompositionEntry` carries:

`{ id, version, source, manifestPath, manifestHash, contentHash, grant, bootPhase, config? }`

The Recipe is the grant-bearing signed representation.

Source:

`omega-baseline/omega-final/contracts/src/recipe.ts`

Repository blob observed:
`a7def490d0c6a14aff760c0b6d5c66cd790315eb`

### 2.3 Composition source matrix

`omega-baseline/omega-final/compositions/_matrix.json` is the declared source of truth for generated composition specs. Its composition map currently contains named compositions such as `agent`, `browser`, `chat`, `console`, `credentials`, `demo`, `discovery`, `discovery-mind`, `email`, `forge-author`, `healing`, `kernel`, `law`, `llm`, `notes`, `run`, `spine`, and `vault`.

Observed repository blob:
`693e83785fd54d1f2b50172e1ba4b1ceb1288a25`

This source proves deterministic composition representation/generation. It does **not** by itself prove durable logical Composition identity.

### 2.4 Composition scan and activation

`plugins/vivim-law/src/compose-scan.ts` currently:

- computes a deterministic `manifestHash`;
- derives `compositionRefOf` from manifest `name`;
- records `compose.scan@1` rows keyed by composition reference + manifest hash;
- requires a matching passing scan row for activation;
- distinguishes missing/stale scan evidence from passing admission-side scan evidence.

Observed repository blob:
`b05ebe9ff883d2871ec154d05ff1e7c3768c88d4`

This is a current implementation fact. It does not authorize promoting `name` to immutable semantic identity.

### 2.5 Replacement evidence

CFA-07's survivor-proof pack establishes the distinction:

`logical Composition identity`
`≠ human/display name`
`≠ CompositionSpec representation`
`≠ Recipe signed representation`
`≠ member Plugin identity`
`≠ member manifest/content hash`

It also defines high-confidence replacement hypotheses for implementation, realization and representation-only replacement while preserving the unresolved status of configuration, membership, contract-version and meaning-changing transitions.

Observed repository blob:
`85c9a50add1fc83f3fba334260b5e6aa858902cc`

### 2.6 Cross-CFA reconciliation

CFA-07 Wave-3 recorded:

- Capability/Realization membership seam: RECONCILED;
- Runtime admission/integrity seam: RECONCILED;
- Work replacement survivor contract: UNKNOWN;
- Change/promotion/rollback envelope: UNKNOWN;
- Surface view/mutation/staleness contract: UNKNOWN.

Observed repository blob:
`e3cf9f196325afc7eb6b1f7230d5ae3b5488cc71`

## 3. Canonical source/reference locations

The adapter is anchored to existing sources rather than a new store:

1. `omega-baseline/omega-final/contracts/src/recipe.ts` — Recipe / CompositionEntry contract.
2. `omega-baseline/omega-final/contracts/src/manifest.ts` — PluginManifest contract.
3. `omega-baseline/omega-final/compositions/_matrix.json` — generated composition source matrix.
4. `omega-baseline/omega-final/plugins/vivim-law/src/compose-scan.ts` — composition reference + manifest-hash scan/activation evidence.
5. CFA-07 survivor/replacement evidence — logical-vs-installed identity distinction.

No new canonical Composition identity registry is introduced.

## 4. Source identity and comparison token

### Closed at the representation/admission level

For a derived self-knowledge or grounding view whose subject is an **installed/admitted composition representation**, the strongest available current basis is the governed Recipe plus its pinned member artifact identities.

The adapter comparison vector is conceptually:

``
Recipe:
  recipeVersion
  hashAlgo
  canonical signed representation identity
  composition entries in declared semantic order
  per-entry id/version
  per-entry manifestHash
  per-entry contentHash
  relevant bootPhase/config/grant representation
``

with the existing signed Recipe `signature` retained as attribution of that representation.

Where the current environment exposes only individual source references rather than a resolved Recipe object, the adapter may preserve the individual manifest/content identities instead of inventing a synthetic logical identity.

### Important boundary

A **Recipe/admission representation token is not the logical Composition identity**.

The representation may change while the logical composition survives. Conversely, a material semantic change may require a new semantic revision or identity even when a representation can still be hashed.

Therefore the adapter closes currentness of an installed/admitted representation; it does not decide semantic survivor identity.

## 5. BasisRef characterization

A generic L1-compatible representation is:

```
BasisRef {
  basisId: "cfa07.composition-manifest-admission@1",
  ownerRef: "cfa-07:composition-plugin-forge",
  sourceKind: "COMPOSITION_MANIFEST_ADMISSION",
  sourceRef: "<resolved governed Recipe / admission source>",
  canonicalRef?: "<existing composition/Recipe reference when available>",
  revisionRef?: "<existing recipe/revision token when exposed>",
  contentDigest?: "<sha256 of canonicalized Recipe or exact required source bytes>",
  observationRef?: "<only when the current source is observational rather than canonical>",
  observedAt?: "<observation metadata when applicable>",
  required: true,
  evidenceRefs: [
    "recipe-contract",
    "manifest-contract",
    "composition-matrix",
    "compose-scan",
    "survivor-proof"
  ]
}
```

This is a characterization of how the existing evidence can map into the generic L1 envelope. It is not a request to add these fields to `Recipe`, `Manifest`, or K0.

## 6. Resolution rule

The resolver is bounded:

1. identify the target installed/admitted composition representation;
2. resolve its governed Recipe representation;
3. resolve the Recipe's required composition entries;
4. resolve each required `manifestHash` and `contentHash`;
5. preserve the Recipe's signed representation identity;
6. emit only the basis refs required by the consuming derived view;
7. do not broaden the basis to every repository file or every plugin merely because it exists.

If a stronger owner-defined revision/content identity exists, use it rather than a weaker timestamp, filename or display name.

## 7. Freshness comparison rule

A recorded derived view is **CURRENT** only when:

- every required basis reference resolves;
- all recorded member artifact identity tokens still match;
- the Recipe/admission representation identity still matches;
- the consuming derivation identity/dependency vector also matches under the generic L1 contract;
- no owner-defined Composition contradiction applies.

A derived view becomes **STALE** when a required, resolvable composition/manifest basis changes.

The following must never by themselves establish CURRENT:

- recent `scannedAt`;
- recent `computedAt`;
- same composition filename;
- same display `name`;
- successful deserialization;
- a previous passing scan row whose `manifestHash` no longer matches.

## 8. STALE condition

Mark the composition-related basis STALE when any required current token differs, including:

- Recipe representation changed;
- member `manifestHash` changed;
- member `contentHash` changed;
- relevant declared grants/config/boot representation changed for a view that depends on those fields;
- the required source revision/digest changed;
- required composition admission evidence has been replaced by a newer representation.

This does not mean the logical composition identity is new.

It means the recorded derived view no longer describes the same basis.

## 9. UNRESOLVABLE condition

Return UNRESOLVABLE when required basis cannot be established, for example:

- no current governed Recipe can be resolved;
- a required member manifest cannot be resolved;
- a required content identity cannot be resolved;
- a referenced source revision is unavailable;
- the runtime/admission path exposes insufficient information to establish the basis without guessing.

The adapter must not downgrade UNRESOLVABLE to CURRENT by falling back to display name, path, timestamp or plugin id alone.

## 10. CONFLICTED condition

The adapter may emit CONFLICTED when the required representation inputs resolve but disagree on a composition-side fact that CFA-07 is actually authorized to compare.

Examples:

- a required pinned manifest hash does not match the manifest bytes resolved for the installed entry;
- an admitted Recipe claims one member identity while the required admission evidence resolves a contradictory member identity for the same installed representation;
- two required composition representation sources explicitly disagree and neither is designated as the resolving authority for that specific comparison.

The adapter must preserve the conflicting references and diagnostics.

It must not choose a winner by itself and must not reinterpret the conflict as permission or law.

## 11. Replacement behavior

The adapter distinguishes **basis freshness** from **semantic survivor identity**.

### Implementation/realization/representation replacement

A change in member identity/hash/config can make the old derived representation STALE.

The adapter does not automatically declare:

`new CompositionIdentity`

Instead, semantic survivor handling remains governed by CFA-07 and peer evidence.

### Logical identity

Stable logical Composition lineage remains OPEN.

The current adapter therefore supports:

`installed representation changed`
without asserting:

`logical Composition identity changed`

That is the required preservation for the current readiness phase.

## 12. System-plugin / extension-plugin symmetry

The adapter applies the same representation-level logic to first-party/system and extension/plugin members:

- both use the governed Manifest → Recipe → admission vocabulary;
- first-party status does not create a second basis authority;
- Forge output does not create a privileged basis path;
- any existing constitutional special role remains an Ω-law/runtime fact, not an adapter privilege.

Complete empirical symmetry proof remains outside this characterization.

## 13. Falsifier

### Primary L2 falsifier

Construct or replay a composition representation whose required basis changes while the derived view retains an old basis snapshot.

Expected result:

``
old DerivedView
→ basis comparison
→ STALE or UNRESOLVABLE
``

and **never** CURRENT.

### Secondary falsifiers

1. Rename-only change incorrectly forces semantic identity break solely because `name` changed.
2. Member content replacement leaves a representation-dependent derived view CURRENT despite a changed `contentHash`.
3. Missing Recipe/member basis is silently replaced with filename/display-name inference.
4. Contradictory admitted representation sources are silently normalized.
5. A Forge artifact is treated as sufficient admission/authority evidence.
6. A first-party/system plugin receives a parallel trust/admission path merely because of provenance.

These remain proof targets; this L2 artifact does not claim a fresh execution of those falsifiers.

## 14. Evidence level and residual unknowns

### CLOSED / CHARACTERIZED

- representation-level source set;
- available Recipe/Manifest/member identity tokens;
- bounded resolver principle;
- STALE behavior;
- UNRESOLVABLE behavior;
- bounded CONFLICTED condition;
- non-authority and single-store boundary;
- logical-vs-installed identity separation.

### UNKNOWN / DEFERRED

- immutable logical Composition identity field;
- semantic revision discriminator;
- rename semantics;
- membership-change semantics;
- contract-version survivor rule;
- meaning-changing redesign classification;
- exact runtime retrieval/reference shape for the current Recipe;
- active Work replacement consequences;
- final generic Change envelope;
- first/third-party empirical symmetry proof.

## 15. Acceptance against the L2 closure rule

| Required closure item | State |
|---|---|
| canonical/current source identity | **CLOSED — governed Recipe + pinned member identities** |
| comparison token | **CLOSED — Recipe/admission representation + manifest/content hashes** |
| resolver | **CLOSED — bounded Recipe/member resolution rule** |
| stale condition | **CLOSED** |
| unresolvable condition | **CLOSED** |
| evidence refs | **CLOSED** |
| falsifier | **CLOSED — explicit target; execution deferred to L5/pilot evidence** |
| unresolved details | **CLOSED — explicit register above** |

**L2 adapter status: CLOSED / DESIGN-CHARACTERIZED.**

This closure is intentionally narrower than semantic Composition identity closure.

## 16. Integrity / non-authority

This adapter characterization:

- does not add a canonical Composition identity store;
- does not promote `name` to immutable semantic identity;
- does not alter `Recipe` or `Manifest`;
- does not implement a runtime join;
- does not change K0;
- does not grant authority;
- does not amend Ω law;
- does not activate a shared CFA boundary;
- does not claim live/runtime proof.

The adapter is a derived mapping from existing owner-controlled sources into the generic L1 freshness vocabulary.
