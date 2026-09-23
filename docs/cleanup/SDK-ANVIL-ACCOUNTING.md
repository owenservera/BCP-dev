# SDK-ANVIL-ACCOUNTING — symbol-level audit of `omega-baseline/omega-final/sdk/src` (master §11/§28)

> Method: full reads of all 6 files + consumer grep (code + docs) across the Ω
> tree (node_modules excluded). D-404 is LAW until superseded — nothing here
> moves, removes, or renames anything; destinations are PROPOSED only.

## Current SDK status
`@vivim/omega-sdk`: 6 files, ANVIL_BUDGET 860 LOC (landing 856, headroom 4),
ANVIL_EXPORT_SURFACE 45 names, remove-to-add discipline, "anvil is not a
Forge" hygiene check. RATIFIED by D-404 (landed 0763556, gates green ×2).

## D-404 status
INTACT and binding. The audit finds NO basis for immediate removal (every
anvil-class function has live gate/conformance/ceremony consumers) and NO
basis for silent decomposition (surface + budget walls forbid it without a
superseding D-record). Outcome below.

## Symbol table (C=consumers: H=host, G=gates, T=testkit/conformance, P=plugin tests, B=tooling/builder, D=docs only)

| Symbol | File | Consumers | Phase | Class | Destination | Retire? |
|---|---|---|---|---|---|---|
| parseManifest | schema | P,T,B,D | dev/test | VALIDATION + SCHEMA MIRROR | anvil (keep) | no |
| parseRecipeShape | schema | G(anvil list),D | dev | SCHEMA MIRROR | anvil (keep; lowest-consumer mirror — watch) | no |
| *Schema mirrors (zod)* | schema | G,T,B | pre-boot | SCHEMA MIRROR | anvil (keep) | no |
| validateManifest | validate | H(ref),G,T,P | pre-boot+test | VALIDATION | anvil (keep) | no |
| validateComposition | validate | T,G + P4 echo2 test | pre-boot+test | VALIDATION | anvil (keep) | no |
| grantableFromOps | validate | T,G | pre-boot+test | VALIDATION | anvil (keep) | no |
| validateGenerality | validate | G(forge-surface),badge | pre-boot | VALIDATION | anvil (keep) | no |
| PATTERN/RISK/FRESHNESS consts | validate | G,T | pre-boot | CONTRACT/WIRE | anvil (keep) | no |
| signManifest/verifyManifest | sign | T | ceremony | SIGNING | anvil-adjacent (keep) | no |
| signPluginDir | sign | G(anvil test) | ceremony | BUILDER LOGIC (signing helper) | anvil (keep; builder.ts does NOT use it — scaffold never signs) | no |
| keyIdForPrivateKey | sign | via signManifest | ceremony | SIGNING support | anvil (keep) | no |
| contentHashDir/signJson/verifyJson/sha256Hex | sign (re-export host canon) | H,G,P,T | pre-boot | DUPLICATE (honest re-export; single impl in host/canon.ts, never forked) | keep re-export | no |
| createPortClient (+types) | client | G(list only),D | caller runtime | PORT CLIENT / CALLER CONVENIENCE | CANDIDATE: surfaces or testkit on decomposition; RETAIN under freeze | no (frozen) |
| describeGrants (+types) | client | G(list only),D | review UI | CALLER CONVENIENCE | CANDIDATE: surfaces (review UI); RETAIN under freeze | no (frozen) |
| streamRootCall (+types) | stream | P(m13),D | caller runtime | STREAMING (consumer half; producer stays host-side per D-329) | CANDIDATE: surfaces on decomposition; RETAIN under freeze | no (frozen) |

## Test requirements (before ANY move)
`tooling/gates/test/anvil.test.ts` 9/9 (budget, surface both directions,
hygiene) + full `omega:quick` + `bun test sdk testkit` + consumer suites
(builder tests, conformance, m13, forge-surface). Any transition must keep all
green in one commit with the D-record.

## Gate implications
anvil-loc + anvil-surface run every gate. Moving one function = surface −1 =
gate red until ANVIL_EXPORT_SURFACE + D-record change together. LOC moved OUT
frees budget (856−n) but the receiving home (surfaces/testkit) has no budget
wall — the wall must travel with the code or discipline is lost. Recorded here,
not implemented.

## Decision-record implications
Decomposition or removal requires a new RATIFIED record explicitly
`supersedes D-404`, with per-symbol destinations, consumer migration, and test
evidence. A rename-only ("anvil" not "sdk") needs no record but changes 25+
import sites for zero semantic gain — NOT recommended.

## Outcome

```text
SDK RETAINED AS ANVIL
```

Rationale: the irreducible pre-boot set (parse/validate/sign/hash) is
actively consumed by gates, conformance, and ceremony; the three non-anvil
passengers (port client, grant describer, stream consumer) have zero
in-runtime consumers but are frozen by the same walls that protect the anvil —
removing them now buys nothing and costs a D-record + consumer migration.
Proposition A (no developer SDK layer) is SATISFIED CONCEPTUALLY: no authoring
API exists in sdk/ (builders were never added — §3 of the PROPOSED design doc
never landed); Proposition B (sdk/src = ratified anvil) HOLDS. The name
"sdk" is the remaining smell: classify as HISTORICAL-NAME, do not churn
imports to fix a label. Revisit only if a Forge needs a symbol the anvil
cannot lawfully hold.
