# Graph Attachment Wave 1 — Stage C Source-Code Pilot Receipt — 2026-09-27

> Status: **COMPLETE — BOUNDED PILOT SOURCE-BACKED**
> Classification: derived implementation-projection evidence; not architecture authority, Ω law, or live-proof evidence.
> Gate: Graph Gate OPEN
> Audited main before receipt commit: `595ce2adff68432e8e6f98f82b8b04be7020e1b2`

## 1. Pilot objective

Stage C demonstrates one small Source-Code Graph projection against an already documented destination responsibility.

The pilot intentionally remains a **receipt-scoped projection**, not a second committed architecture graph. No change was made to the existing Architecture Graph schema or its NODES/EDGES artifacts.

Selected corridor:

**R-003 Manifest integrity**

Why this corridor was selected:

- the destination responsibility is explicit and current;
- its semantic owner / enforcement boundary are already documented;
- the Ω manifest contract is directly represented in source;
- a concrete validator implementation exists;
- an executable self-host test exercises generated manifest validity;
- a deterministic authored fixture exists;
- source history is attributable to the repository's 2026-09-22 full snapshot;
- the corridor does not require CFA-02 ratification, B1 mechanism selection, live-provider proof, or a new semantic authority decision.

## 2. Architectural anchor

| Projection record | Value |
|---|---|
| Responsibility | **R-003 — Manifest integrity** |
| Canonical source | `docs/destination/core-vs-plugin-boundary/DESTINATION-RESPONSIBILITY-MATRIX.md` |
| Boundary class | K0+K1 |
| Semantic owner | core protocol |
| Canonical/data owner | manifest |
| Authority/enforcement | K0 |
| Replacement seam | manifest contract |
| Destination status | PROVEN K0 |

The responsibility record is treated as the architectural anchor. Its status is **not** upgraded by this pilot.

## 3. Implementation projection nodes

All identifiers below are deterministic projection identifiers scoped to this pilot. They are not canonical domain identities.

| ID | Kind | Source identity | Role |
|---|---|---|---|
| `PILOT-REPO-BCP-DEV` | repo | `owenservera/BCP-dev` | repository source |
| `PILOT-CON-MANIFEST` | contract | `omega-baseline/omega-final/contracts/src/manifest.ts` | PluginManifest / manifest contract |
| `PILOT-FILE-MANIFEST-CONTRACT` | module/file | same path as contract | contract implementation source |
| `PILOT-SYM-VALIDATE-MANIFEST` | symbol | `omega-baseline/omega-final/sdk/src/validate.ts::validateManifest` | semantic manifest validator |
| `PILOT-FILE-VALIDATE` | module/file | `omega-baseline/omega-final/sdk/src/validate.ts` | validator implementation |
| `PILOT-TEST-SELF-HOST` | test | `omega-baseline/omega-final/plugins/forge-author/test/happy/self-host.test.ts` | executable validation test |
| `PILOT-FIXTURE-SELF` | fixture | `omega-baseline/omega-final/plugins/forge-author/spec/self.json` | authored manifest/spec fixture |
| `PILOT-MANIFEST-FORGE-AUTHOR` | config/manifest | `omega-baseline/omega-final/plugins/forge-author/plugin.json` | concrete generated plugin manifest |
| `PILOT-CHANGE-SNAPSHOT-2026-09-22` | commit/change | `e724a517ea38778a93fb9a191e1957ac47e06ed5` | attributable source introduction/history |

## 4. Projection edges

| From | Relation | To | Basis / evidence |
|---|---|---|---|
| `PILOT-FILE-MANIFEST-CONTRACT` | `realizes` | `PILOT-CON-MANIFEST` | source artifact explicitly defines PluginManifest and manifest vocabulary |
| `PILOT-SYM-VALIDATE-MANIFEST` | `implements` | `R-003` | validator source explicitly enforces manifest-level semantic rules |
| `PILOT-SYM-VALIDATE-MANIFEST` | `satisfies` | `PILOT-CON-MANIFEST` | validator consumes PluginManifest and enforces its declared rules |
| `PILOT-FILE-VALIDATE` | `tested_by` | `PILOT-TEST-SELF-HOST` | self-host test imports/calls `validateManifest` against a generated manifest |
| `PILOT-FIXTURE-SELF` | `produces` | `PILOT-MANIFEST-FORGE-AUTHOR` | recorded spec contains the manifest template used to emit plugin.json |
| `PILOT-MANIFEST-FORGE-AUTHOR` | `satisfies` | `PILOT-CON-MANIFEST` | concrete manifest follows the typed manifest contract; validation is exercised by the self-host suite |
| `PILOT-TEST-SELF-HOST` | `traces_to` | `R-003` | test path is part of the concrete manifest-validation corridor |
| `PILOT-CHANGE-SNAPSHOT-2026-09-22` | `affects` | `PILOT-FILE-VALIDATE` | current file history reports the snapshot commit as attributable source history |

### Direction / interpretation guard

These edges mean only what their basis supports.

In particular:

- `implements` does not mean sole ownership of R-003;
- `satisfies` does not mean product proof;
- `tested_by` does not mean every manifest property is exhaustively proven;
- `produces` does not mean the output is authoritative;
- `affects` records history, not semantic correctness.

No import/call edge is promoted to an architectural dependency in this pilot.

## 5. Evidence / proof state

The pilot can establish the following **evidence states** without conflating them:

| Claim | State | Basis |
|---|---|---|
| R-003 exists as a canonical destination responsibility | CURRENT / DOCUMENTED | responsibility matrix |
| PluginManifest contract exists | CURRENT / CODE | `contracts/src/manifest.ts` |
| `validateManifest` exists and contains explicit manifest rules | CURRENT / CODE | `sdk/src/validate.ts` |
| executable test exercises generated manifest validation | PRESENT / TEST | `forge-author/test/happy/self-host.test.ts` |
| deterministic authored fixture exists | PRESENT / FIXTURE | `forge-author/spec/self.json` |
| historical source attribution exists | CURRENT / HISTORY | commit `e724a517ea38778a93fb9a191e1957ac47e06ed5` |
| current-session test execution | **NOT CLAIMED** | no local repository checkout was available for an independent run |

The test presence is therefore not upgraded into a fresh test-run or live-proof claim.

## 6. Fixture and live-proof separation

The self-host suite contains a real-host boot test and explicitly checks generated manifest validity, but this Stage C receipt does **not** claim that test was executed during this session.

Likewise, `spec/self.json` and the generated `plugin.json` are treated as fixture/source evidence.

They are not:

- live external proof;
- permission;
- authority;
- a replacement for the destination responsibility record.

## 7. Why no schema change occurred

Stage B froze the logical implementation vocabulary while preserving Architecture Graph schema v0.2.

Stage C therefore represents the pilot in this receipt using ordinary source-backed projection records.

No new node kinds were inserted into `SCHEMA.json`, and no new competing graph was created.

A future physical graph projection may be introduced only through an explicit schema/representation decision if evidence demonstrates that the existing representation cannot carry the required projection without ambiguity.

## 8. Unresolved / deliberately excluded

The pilot leaves these outside scope:

- CFA-02 durable identity/persistence semantics;
- B1 executable-content confinement production mechanism;
- content-integrity proof as a stronger claim than the current source evidence supports;
- live Chrome/provider realization;
- semantic composition identity beyond the existing R-003 manifest corridor;
- ownership inference from imports, calls, package adjacency or naming similarity;
- runtime self-knowledge joins.

Those remain UNKNOWN / separately gated where applicable.

## 9. Acceptance

Stage C acceptance conditions:

- [x] one existing destination responsibility selected;
- [x] canonical responsibility source identified;
- [x] contract source identified;
- [x] implementation files/symbol identified;
- [x] executable test identified;
- [x] fixture identified;
- [x] attributable source history identified;
- [x] implementation → responsibility/contract mapping is source-backed;
- [x] test/fixture relationship is source-backed;
- [x] evidence/proof state remains epistemically bounded;
- [x] no second graph created;
- [x] no architecture authority inferred from code topology;
- [x] no CFA-02 ratification;
- [x] no B1 production mechanism selection;
- [x] no live-provider claim.

## 10. Stage-C result

**STAGE C = COMPLETE — BOUNDED SOURCE-CODE GRAPH PILOT SOURCE-BACKED.**

The pilot demonstrates the intended chain:

**implementation → documented responsibility/contract → test/fixture → bounded evidence state**

without changing the existing Architecture Graph or elevating source topology into semantic authority.

The next stage is **Stage D — proof/evidence attachment**, subject to the separate evidence-readiness gate.
