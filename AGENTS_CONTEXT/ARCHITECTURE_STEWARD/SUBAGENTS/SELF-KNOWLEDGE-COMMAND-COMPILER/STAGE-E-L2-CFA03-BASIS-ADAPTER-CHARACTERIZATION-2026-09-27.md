# CFA-03 — Stage-E L2 Basis Adapter Characterization
## Semantic Continuity / Self-Knowledge
## 2026-09-27

> Status: **COMPLETE — CFA-03 CHARACTERIZATION**
> Owner: CFA-03 Semantic Continuity Steward
> Scope: CFA-03-owned semantic/self-knowledge derivation basis only.
> Authority: derived readiness evidence; not Ω law, not shared-boundary activation, not universal identity.

## 1. Objective

Characterize the basis inputs CFA-03 owns or defines for semantic continuity and self-knowledge derivation under the closed Stage-E L1 freshness contract. Do not close basis semantics owned by other CFAs.

## 2. Evidence inspected

- omega-baseline/omega-final/plugins/vivim-nlcl-pure/src/frames.ts
- omega-baseline/omega-final/plugins/vivim-nlcl-pure/src/types.ts
- omega-baseline/omega-final/plugins/vivim-nlcl-pure/src/interpret.ts
- omega-baseline/omega-final/plugins/vivim-nlcl-pure/src/index.ts
- omega-baseline/omega-final/contracts/src/lang.ts
- omega-baseline/omega-final/contracts/src/intent.ts
- omega-baseline/omega-final/plugins/vivim-mind/plugin.json
- omega-baseline/omega-final/plugins/vivim-mind/src/index.ts
- omega-baseline/omega-final/plugins/vivim-mind/src/derive.ts
- omega-baseline/omega-final/plugins/vivim-mind/test/mind.test.ts
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SELF-KNOWLEDGE-AND-DEVELOPMENT-GROUNDING-DESIGN.md
- docs/destination/self-knowledge-core/RESEARCH.md
- BOUNDARY-DESIGN-SYSTEM/STAGE-E-L1-DERIVEDVIEW-FRESHNESS-CONTRACT-2026-09-27.md

## 3. Current observed basis facts

### A. NCLL semantic derivation

| Field | Characterization |
|---|---|
| adapterId | cfa03:ncll-derivation |
| ownerCFA | CFA-03 |
| basisKind | semantic-derivation-contract |
| canonical source | plugins/vivim-nlcl-pure/src/frames.ts, src/types.ts, src/interpret.ts |
| current token | NCLL_VERSION = 0.1.0 |
| resolver | resolve the NCLL contract/version exposed to the interpretation path; Interpretation also records nlclVersion |
| STALE | stored derivation/output-contract version differs from current supported version |
| UNRESOLVABLE | producer cannot establish the derivation/output version used by the stored result |
| CONFLICTED | no generic CFA-03 cross-source contradiction rule is claimed here |
| evidence | frames.ts, types.ts, interpret.ts, index.ts |
| falsifier | change semantic derivation while retaining the same version; version-only identity must fail to detect the change if no stronger identity exists |
| residual UNKNOWN | whether 0.1.0 is guaranteed immutable across implementation changes |

### B. vivim.mind self-knowledge derivation

| Field | Characterization |
|---|---|
| adapterId | cfa03:mind-derivation |
| ownerCFA | CFA-03 |
| basisKind | self-knowledge-derivation-contract |
| canonical source | plugins/vivim-mind/plugin.json, src/index.ts, src/derive.ts |
| current token | manifest version 0.1.0 |
| important limitation | manifest contentHash is currently empty, so no runtime-visible immutable implementation-content identity is established |
| resolver | resolve active vivim.mind manifest/output-contract version; stronger immutable source token remains future work |
| STALE | mind derivation/output contract identity changes |
| UNRESOLVABLE | producer identity cannot be established at required strength |
| CONFLICTED | not defined generically here; preserve derivation-local diagnostics |
| evidence | plugin manifest, index wiring, pure derivation module, mind tests |
| falsifier | change mind implementation/configuration while holding 0.1.0; version-only comparison must not falsely certify CURRENT |
| residual UNKNOWN | final immutable implementation/configuration identity mechanism |

### C. WorldModel consumer seam

CFA-03 consumes WorldModel for grounding but does not own World/Object source identity.

| Field | Characterization |
|---|---|
| adapterId | cfa03:worldmodel-consumption |
| ownerCFA | source semantics remain with CFA-01 / relevant producers |
| basisKind | semantic-grounding-input |
| observed token | WorldModel.v and kernel.nlclVersion |
| rule | WorldModel.v is NOT a complete source-basis token; do not use it as sole freshness proof |
| resolver | consume an explicit producer-supplied basis envelope when available |
| STALE | producer-declared material World/self-knowledge basis changes |
| UNRESOLVABLE | required producer basis identity is absent or cannot be compared |
| CONFLICTED | preserve producer/domain conflict semantics |
| evidence | types.ts, mind/derive.ts, self-knowledge research, WorldReferenceResult peer evidence |
| falsifier | alter a material underlying source while keeping the bounded WorldModel representation insufficient to encode the change; v alone must not certify CURRENT |
| residual UNKNOWN | exact peer-owned World/Object and durable source basis tokens |

### D. Language contributions / frames

| Field | Characterization |
|---|---|
| adapterId | cfa03:language-contribution-contract |
| ownerCFA | CFA-03 |
| basisKind | semantic-language-contract |
| canonical source | contracts/src/lang.ts plus NCLL frame/lexicon data |
| current token | pinned grammar families/slot kinds plus active contribution metadata |
| resolver | resolve the active contribution set through the existing governed composition/runtime path |
| STALE | material frame/lexicon contribution or semantic contract changes |
| UNRESOLVABLE | contribution identity cannot be established sufficiently to reproduce interpretation basis |
| CONFLICTED | retain domain/data contribution conflict; do not create a universal semantic winner |
| evidence | lang.ts, frames.ts, interpret.ts |
| falsifier | change a material contribution while omitting its identity/version and show that an old interpretation can otherwise appear CURRENT |
| residual UNKNOWN | final contribution-level identity/version semantics; composition owner remains CFA-07 |

## 4. Required external basis dependencies

mind.snapshot@1 and mind.portrait@1 also consume external evidence that CFA-03 does not own:

1. law.registry@1 — runtime/law source.
2. vault.query@1 and vault.getmany@1 — durable data source.
3. composition configuration — composition/installation semantics.
4. vault.verify@1 — durable integrity observation for portrait.

These are required external BasisRefs. Their canonical meaning and comparison tokens remain in the parallel CFA L2 adapter wave.

## 5. Explicit freshness rules for CFA-03

- NCLL_VERSION may identify the semantic output contract, but it is not by itself proven immutable implementation identity.
- vivim.mind version 0.1.0 is a declared dependency token; the empty contentHash means it is not currently sufficient as a complete immutable source token.
- WorldModel.v is a bounded representation version and must not be promoted to universal freshness identity.
- timestamps are observational metadata, not proof that sources are unchanged.
- language contribution identity must be explicit; imports, filenames, names, lexical similarity and graph proximity cannot create material dependency.
- missing required basis must become UNRESOLVABLE, not guessed CURRENT.
- freshness remains diagnostic and never grants permission, changes Ω law or establishes universal semantic identity.

## 6. Falsifier matrix

| Claim | Falsifier |
|---|---|
| NCLL version alone identifies derivation bytes | change semantics without changing version and show detection fails |
| mind plugin version alone identifies derivation bytes | change mind implementation while holding 0.1.0 and show version-only freshness misses it |
| WorldModel.v proves source currentness | change a material source without an equivalent complete WorldModel basis change |
| timestamp proves currentness | source changes between two observations with timestamp-only comparison |
| contribution set is reproducible without identity | change a material contribution while omitting explicit contribution identity |
| self-knowledge can manufacture its own complete basis | remove an external source adapter and verify the result becomes UNRESOLVABLE |
| freshness implies authority | attempt to use CURRENT self-knowledge as an authorization decision; authority still must be separately resolved |

## 7. L2 classification

| Adapter | Status |
|---|---|
| cfa03:ncll-derivation | CHARACTERIZED / PARTIAL — declared version exists; immutable content identity remains UNKNOWN |
| cfa03:mind-derivation | CHARACTERIZED / PARTIAL — version exists; runtime contentHash is empty |
| cfa03:worldmodel-consumption | CHARACTERIZED / DEPENDENT — producer basis remains peer-owned |
| cfa03:language-contribution-contract | CHARACTERIZED / DEPENDENT — contribution identity crosses composition ownership |

Every local basis source now has an explicit current token or a named limitation, resolver, stale/unresolvable behavior, evidence and falsifier. Unresolved semantics are recorded rather than synthesized.

## 8. Boundaries preserved

- no runtime freshness implementation;
- no production-code changes;
- no universal identity model;
- no second Architecture Graph;
- no authority semantics assigned to self-knowledge;
- no Ω-law changes;
- no LIVE/PRODUCT proof claim;
- no peer-owned source semantics ratified by CFA-03.

## 9. Handoff

CFA-03 characterization is ready for Architecture Steward L2 reconciliation. The next meaningful CFA-03 work is consumption of the reconciled owner adapters into Stage-E L4 cross-plane grounding, unless that reconciliation identifies a specific proof gap requiring a narrower closure task.