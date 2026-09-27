# Graph Attachment Wave 1 — Stage B Implementation Projection Contract — 2026-09-27

> Status: **COMPLETE — CONTRACT FROZEN**
> Classification: derived Steward control-plane design; not Ω law, semantic authority, or proof of implementation.
> Gate: Graph Gate OPEN
> Audited main: `0b03a3ccd175dc2e0595e2f354408ac4107521fc`

## 1. Scope

Stage B freezes the minimum contract for attaching implementation evidence to the existing documentation-first Architecture Graph.

This stage does **not** build a Source-Code Graph pilot, mutate the Architecture Graph artifacts, introduce a second graph, or make a semantic ownership decision.

Authoritative inputs for this stage:

- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/GRAPH-ATTACHMENT-WAVE-1-2026-09-27.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/GRAPH-W1-A-REVALIDATION-RECEIPT-2026-09-27.md`
- `docs/destination/architecture/graph/README.md`
- `docs/destination/architecture/graph/SCHEMA.json`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/README.md`

## 2. Contract statement

The implementation layer is a **derived projection of repository/code evidence**.

It may link implementation evidence to an already documented destination responsibility or contract, but it never becomes:

- semantic authority;
- ownership authority;
- canonical identity authority;
- evidence authority;
- a replacement for the existing Architecture Graph;
- a replacement for Ω law.

The Architecture Graph remains one underlying network. Implementation data is a later evidence-bearing projection into that network.

Therefore:

`code structure → evidence`

is permitted, while:

`code structure → architecture authority`

is not.

## 3. Logical implementation vocabulary

The minimum logical node vocabulary is frozen as:

| Kind | Meaning | Required identity basis |
|---|---|---|
| `repo` | repository being inspected | stable repository identity |
| `package` | package/workspace within a repository | repo + package path/name |
| `module/file` | source file/module | repo + normalized repository path |
| `symbol` | named declaration/exported or local symbol | repo + path + qualified symbol name |
| `export` | exported symbol surface | repo + path + qualified export name |
| `import` | import declaration/reference | repo + importing module + normalized import specifier |
| `call` | observed call-site relation record | repo + path + containing symbol + normalized callee + source span where available |
| `contract` | explicitly documented/typed implementation-facing contract | stable source identity of the contract |
| `test` | test executable/specification | repo + path + stable test identifier |
| `fixture` | replay/static fixture used by a test or investigation | repo + path + fixture identifier |
| `config/manifest` | configuration or manifest artifact | repo + normalized path |
| `commit/change` | attributable repository change | immutable commit/change identity |

These are **projection vocabulary**, not additions to semantic ontology.

## 4. Stable identity rules

Every implementation node must have a stable repository/source identity sufficient to recover the cited source.

Minimum requirement:

- repository identity;
- normalized repository-relative path or equivalent immutable source locator;
- kind-specific discriminator where path alone is insufficient.

Additional rules:

1. Line numbers alone are not node identity.
2. Symbol identity must include its containing source identity.
3. Call-site identity should prefer a normalized source span or another stable source discriminator; changing line numbers alone must not be treated as semantic replacement.
4. Generated/temporary artifacts must be marked as such and must not silently outrank first-party source evidence.
5. A refactor that moves a symbol may be represented as a change/supersession relation rather than pretending the old and new source identities are the same object.
6. IDs are deterministic from their source identity; no random IDs.

## 5. Edge contract

The minimum evidence-bearing relation vocabulary is frozen as:

| Relation | Meaning | Boundary rule |
|---|---|---|
| `implements` | implementation materially realizes a documented responsibility/contract | source-backed mapping required |
| `satisfies` | implementation/test satisfies an explicit contract assertion | assertion/test evidence required |
| `depends_on` | explicit implementation dependency | must not be inferred merely from proximity |
| `imported_by` | inverse/derived view of an observed import relation | implementation coupling only |
| `calls` | observed call relation | runtime/implementation observation only; not semantic necessity |
| `tested_by` | implementation/contract is exercised by a test | test source must identify the exercised target |
| `verified_by` | a claim/implementation state is supported by a named verification artifact | evidence must identify the scope verified |
| `produces` | implementation/test produces a named artifact, output, or evidence record | producer/consumer scope must be explicit |
| `governed_by` | implementation is constrained by an explicit governing contract/policy | governing source must be cited; never inferred from imports |
| `affects` | a change/implementation has an evidenced impact on another node | impact basis must be named |
| `supersedes` | one implementation/change/source identity replaces an earlier one | historical lineage only; does not imply correctness |
| `realizes` | implementation concretizes an explicitly documented design/contract target | documented target required |
| `traces_to` | implementation/test/change is traceable to source requirement, design, or evidence | source lineage required |

### Direction rule

Edges are directed and answer a concrete question about the source node.

Examples:

- implementation `→ implements → responsibility`
- implementation `→ satisfies → contract`
- module `→ imports → module` may be represented as the underlying observation; `imported_by` is the reverse projection
- call-site `→ calls → symbol`
- implementation `→ tested_by → test`
- implementation `→ verified_by → evidence`
- commit/change `→ affects → implementation`

The existence of an edge never upgrades the target's authority or maturity.

## 6. Architecture-link rules

An implementation-to-architecture mapping is admissible only when there is a source/evidence basis that identifies both sides.

Required for `implements`, `realizes`, and architecture-facing `satisfies` relations:

- target responsibility/contract exists in the canonical Architecture Graph or its cited source;
- implementation source is identifiable;
- the mapping rationale is explicit;
- source references are retained;
- evidence status is retained independently of architecture status.

An implementation node with no supported destination mapping is **drift/unmapped implementation evidence**, not permission to invent a new responsibility.

## 7. Import/call discipline

Import and call topology is useful implementation evidence but is never semantic authority.

Therefore:

- import ≠ architecture dependency;
- call ≠ semantic necessity;
- package adjacency ≠ ownership;
- shared utility ≠ universal boundary;
- naming similarity ≠ identity equivalence.

A stronger `depends_on`, `implements`, `governed_by`, or ownership claim requires separate evidence beyond structural adjacency.

## 8. Evidence and maturity contract

The projection preserves these states separately:

`DESIGN ≠ IMPLEMENTED ≠ INTEGRATED ≠ LIVE ≠ PRODUCTIZED`

Permitted evidence classes include:

- design/document evidence;
- implementation/source evidence;
- test/fixture evidence;
- integration evidence;
- live/external evidence;
- product evidence.

Rules:

1. Static fixtures are not live/external proof.
2. A green test proves only the behavior/assertions covered by that test.
3. A commit proves lineage/change attribution, not semantic correctness.
4. Presence of an implementation node never upgrades destination maturity.
5. A failed or absent proof is not converted into confidence by graph connectivity.
6. Evidence supports a claim; it does not grant permission.

## 9. UNKNOWN contract

Unresolved mappings remain **UNKNOWN**.

The projection must not manufacture a relation merely because:

- names match;
- files are nearby;
- imports exist;
- calls exist;
- types look similar;
- one implementation is historically associated with another.

When evidence is insufficient, record the unresolved mapping as UNKNOWN in the stage/pilot report rather than emitting a stronger edge.

## 10. Source lineage contract

Every implementation node and derived implementation edge must carry recoverable source lineage.

At minimum:

- source repository identity;
- source path or immutable source locator;
- basis for the relation;
- evidence references when a claim depends on evidence;
- attributable change/commit where change history is material.

The source lineage must allow a later reviewer to distinguish:

**observed source fact → derived mapping → interpretation.**

The graph is not allowed to collapse those layers into one undifferentiated claim.

## 11. Schema boundary

The current Architecture Graph is validated at **schema v0.2**.

Stage B does not amend `SCHEMA.json`, `NODES.json`, or `EDGES.json`.

The logical implementation vocabulary therefore becomes the **contract to be represented**, while the physical representation for Stage C must remain schema-disciplined.

Before implementation nodes are physically added to the committed graph artifacts, Stage C must explicitly record the minimal representation choice. Any actual schema-version change requires a separately designed and reviewed schema change; it is not implied by this receipt.

This preserves the current graph contract instead of silently widening it.

## 12. Projection and regeneration discipline

Implementation projections must be regenerable or reconstructable from repository evidence.

Generated projection data must not be hand-edited to manufacture claims.

When source changes, the projection may change. Such a delta must be attributable to:

- source change;
- projection/builder change;
- intentionally curated mapping layer;
- stale artifact correction.

The projection must not rewrite the destination model merely because source topology changed.

## 13. Stage C pilot acceptance contract

The next pilot is accepted only if it can demonstrate, for one small existing corridor:

`implementation → documented responsibility/contract → test/fixture → evidence/proof state`

with:

- one canonical destination owner;
- one existing design/contract source;
- identifiable implementation source;
- identifiable test/fixture;
- at least one attributable change/commit;
- source lineage on all emitted relations;
- no unresolved CFA-02 dependency;
- no B1 production-mechanism selection;
- no live-provider proof requirement;
- no new semantic authority decision.

The pilot must remain small enough that every emitted relationship can be inspected manually.

## 14. Explicit non-authority declarations

This contract does **not** authorize:

- a second Architecture Graph;
- a graph-owned ontology;
- a graph-owned authority/data store;
- a universal identity/event/state primitive;
- semantic ownership transfer;
- CFA-02 ratification;
- B1 production mechanism selection;
- live Chrome/provider/product claims;
- Ω-law amendment.

## 15. Stage-B result

**STAGE B = COMPLETE — IMPLEMENTATION PROJECTION CONTRACT FROZEN.**

The existing Architecture Graph remains the sole architecture network.

The minimum implementation vocabulary, stable identity rules, evidence-bearing edge semantics, source-lineage requirements, UNKNOWN behavior, maturity separation and schema boundary are now explicit.

The next eligible action is **Stage C — bounded Source-Code Graph pilot**.
