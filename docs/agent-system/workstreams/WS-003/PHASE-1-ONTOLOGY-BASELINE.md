
# P1-03 / WS-003 — Phase-1 Ontology Baseline

> **Classification:** DERIVED — CURRENT ONTOLOGY / REPRESENTATION BASELINE  
> **Workstream:** WS-003 / P1-03 — Ω Ontology, Evidence & Representation  
> **Status:** M1–M4 completed as repository reconciliation; this document is **not new Ω law**.  
> **Authority rule:** where this synthesis appears to disagree with a RATIFIED decision, the RATIFIED decision wins. Any required amendment is named explicitly below rather than silently resolved.

## 0. Purpose and proof boundary

P1-03 is registered to establish canonical identity, entity, evidence, provenance, lineage, epistemic status, revision, conflict, staleness, and representation semantics. Its boundary is specifically what things/claims/evidence/representations are and how their relationships are represented. Dependencies include Repository Truth, Ω decisions/genome, and the existing vault/event/provenance mechanisms. (docs/agent-system/WORKSTREAMS.md:L33-L39)

This baseline therefore does **not** create a parallel ontology implementation. It reconciles the ontology that already exists across ratified decisions, the live \`vivim-vault\` implementation, the ontology-bearing contracts, and the already-committed Phase-1 governance/provider chain.

Repository Truth establishes the authority hierarchy: ratified Ω law and decision records first; BCP enforced vocabulary/state next; current context and migration records below that; evidence/history is useful evidence but not authority; planning prose cannot override the higher layers. P1-02 itself is a reconciliation layer, not a new authority. (docs/agent-system/workstreams/WS-002/PHASE-1-TRUTH-BASELINE.md:L65-L83)

---

# M1 — De facto ontology extraction

## 1. Identity

### 1.1 There is already a three-layer identity model

**Revision identity is \`(ns, id, rev)\`.** The vault's core contract defines \`Ref = {ns, id, rev}\`; \`rev\` is the explicit revision number and is required to be an integer ≥ 1 for structural references. (omega-baseline/omega-final/plugins/vivim-vault/src/sql.ts:L35-L38; omega-baseline/omega-final/plugins/vivim-vault/src/validate.ts:L51-L63)

**Logical object identity is \`(ns, id)\` across revisions.** The vault stores hot revisions under the primary key \`(ns,id,rev)\`; reads of an object without an explicit revision resolve the latest revision, with a cold-object fallback. (omega-baseline/omega-final/plugins/vivim-vault/src/sql.ts:L40-L57; omega-baseline/omega-final/plugins/vivim-vault/src/sql.ts:L220-L236)

**Content identity is \`cid\`.** The vault computes \`cid = sha256(canonicalJson(data))\`; the on-disk changelog link separately hashes sequence, causation id, namespace, object id, revision, content id, and previous hash. (omega-baseline/omega-final/plugins/vivim-vault/src/canon.ts:L11-L18; omega-baseline/omega-final/plugins/vivim-vault/src/canon.ts:L38-L53)

These are different identities and must not be collapsed:

| Identity | Meaning | Current representation |
|---|---|---|
| Logical object | “this domain object” across time | \`ns + id\` |
| Revision | “this exact version of that object” | \`ns + id + rev\` |
| Content | “these exact serialized data bytes” | \`cid = sha256(canonicalJson(data))\` |
| Ledger link | “this append in vault history” | \`seq + causationId + ns + id + rev + cid + entry_hash + prev_hash\` |

The distinction is enforced by code, not just prose. Revision allocation is taken from the changelog rather than the hot-object table, specifically so compaction cannot cause revision reuse. (omega-baseline/omega-final/plugins/vivim-vault/src/changelog.ts:L5-L12; omega-baseline/omega-final/plugins/vivim-vault/src/changelog.ts:L67-L84)

### 1.2 “Entity” is currently namespace- and domain-specific, not one global type

**Inference from the inspected ontology-bearing contracts and namespace registry:** Ω does not currently have one universal \`Entity\` interface governing all persisted things. Instead, objects are namespace-owned and typed by their domain payload.

Concrete entity-like records already exist:

- **Principal identity:** D-412 defines a permanent \`principal\` record whose id is the principal string, with \`kind\`, registration time, lifecycle state, retirement time, and generation. Retired identities can never be re-registered. (omega-baseline/omega-final/docs/decisions/D-412-principal-seam.md:L19-L30)
- **Agent identity:** \`AgentIdentity\` is a persistent actor record containing id, optional parent id, behavior contract/version, capability scope, lifecycle state, creation metadata, and provenance. (omega-baseline/omega-final/contracts/src/agent.ts:L16-L26)
- **Behavior contract:** the behavior contract is a versioned domain object with lifecycle state, preconditions, invariants, forbidden actions, required capabilities, recovery policy, and provenance. (omega-baseline/omega-final/contracts/src/agent.ts:L28-L38)
- **Decision record:** a decision is an ordinary \`decision\` namespace object; genealogy is represented by parent decisions and provenance refs, not by a separate graph engine. (omega-baseline/omega-final/contracts/src/agent.ts:L40-L55)
- **Provider realization:** the namespace registry defines realization rows as the current provider state, with later revisions superseding earlier state. (omega-baseline/omega-final/docs/VAULT-NAMESPACES.md:L41-L45)
- **Governed event:** P1-06 defines a specific governed-action record with principal, authority, capability, invocation result, execution state, outcome, and optional intent/result fields. (omega-baseline/omega-final/plugins/vivim-agent/src/governance.ts:L41-L64)
- **Policy row:** D-433 defines policy itself as data with principal, precedence, scope, effect, optional constraints, and append-only supersession. (omega-baseline/omega-final/plugins/vivim-law/src/conflict.ts:L30-L66)

### 1.3 Canonical interpretation for this baseline

For P1-03 documentation purposes:

> **An Ω entity is a namespace-owned, addressable domain object identified logically by \`(ns,id)\`; a particular state of that entity is a revision \`(ns,id,rev)\`. There is no global entity schema in the current system.**

That statement is a synthesis of existing practice, not a new runtime contract.

---

## 2. Evidence

### 2.1 Evidence is already a first-class relationship, but not a universal record type

D-324 starts from the existing \`VaultProvenanceRef\` precisely because it is how cited evidence is represented: it is a typed backward-link to a stored object, augmented with epistemic information and optional build-decision lineage. (omega-baseline/omega-final/docs/decisions/D-324-provenance-linkage.md:L7-L14; omega-baseline/omega-final/docs/decisions/D-324-provenance-linkage.md:L24-L32)

The current contract shape is:

    VaultProvenanceRef = {
      ns: string
      id: string
      rev: number
      cid?: string
      meta?: unknown
      refs?: VaultProvenanceRef[]
      epistemicStatus?: EpistemicStatus
    }

(omega-baseline/omega-final/contracts/src/vocabulary.ts:L29-L45)

There is **no universal \`EvidenceRecord\` contract** in the inspected ontology-bearing contracts. Instead, evidence is normally a reference to an existing domain object: a discovery row, a policy/authority row, a decision, a realization, a session/capture, an invocation, a governed event, and so on.

The namespace registry makes the separation explicit. For example, discovery promotion rows are audit evidence while provider realization rows are current state; the realization points back to the promotion evidence rather than collapsing both meanings into one object. (omega-baseline/omega-final/docs/VAULT-NAMESPACES.md:L24-L32)

D-416 likewise distinguishes durable evidence stores by purpose: the vault changelog/object store, the law narrative journal, and the kernel audit chain all carry different evidence roles; the decision folds the law journal and audit witnesses into vault namespaces without claiming that all evidence is one record type. (omega-baseline/omega-final/docs/decisions/D-416-evidence-store.md:L15-L23; omega-baseline/omega-final/docs/decisions/D-416-evidence-store.md:L52-L88)

### 2.2 Evidence does not become authority merely by existing

P1-02 explicitly distinguishes **evidence/history** from **authority**, with ratified law and decision records higher in the authority chain. (docs/agent-system/workstreams/WS-002/PHASE-1-TRUTH-BASELINE.md:L67-L77)

D-424 reinforces the same direction for development-process snapshots: once published, they become ordinary vault evidence, while enforcement and ratification remain elsewhere. The mind does not gain authority merely from being able to read that evidence. (omega-baseline/omega-final/docs/decisions/D-424-process-publish-seam.md:L35-L49)

**Canonical implication:** evidence is support for a claim or decision; evidence is not itself the authority that decides whether a claim is permitted.

---

## 3. Provenance

### 3.1 The vault has a structural provenance edge

The live \`vivim-vault\` writer requires structural refs in the exact shape \`{ns,id,rev}\`. (omega-baseline/omega-final/plugins/vivim-vault/src/validate.ts:L51-L63)

Those refs are stored in the object's metadata envelope as:

    { meta: <caller metadata>, refs: [{ns,id,rev}, ...] }

(omega-baseline/omega-final/plugins/vivim-vault/src/sql.ts:L182-L200)

Compaction scans those live structural refs and protects referenced history. (omega-baseline/omega-final/plugins/vivim-vault/src/sql.ts:L203-L215)

### 3.2 The richer provenance citation exists above the structural edge

D-324 ratified the richer \`VaultProvenanceRef\` shape, including optional \`epistemicStatus\`, optional \`cid\`, optional metadata, nested refs, and the optional build-decision lineage field on decision records. (omega-baseline/omega-final/docs/decisions/D-324-provenance-linkage.md:L24-L32; omega-baseline/omega-final/contracts/src/vocabulary.ts:L29-L45)

The live director demonstrates the two-layer pattern. Its \`ResolveDecision\` payload contains rich \`evidenceRefs\` including \`epistemicStatus\`, while the same refs are separately passed to \`vault.append@1\` as structural refs. (omega-baseline/omega-final/plugins/vivim-director/src/resolve.ts:L95-L138; omega-baseline/omega-final/plugins/vivim-director/src/index.ts:L286-L298)

The vault's runtime ref validator preserves only the structural \`ns/id/rev\` triple in the envelope. (omega-baseline/omega-final/plugins/vivim-vault/src/validate.ts:L53-L63; omega-baseline/omega-final/plugins/vivim-vault/src/sql.ts:L184-L200)

D-324's round-trip test therefore matters: the INFERRED-vs-VERIFIED distinction survives because the rich citation is also part of the decision object data, not because the vault structural edge itself grows arbitrary metadata. (omega-baseline/omega-final/docs/decisions/D-324-provenance-linkage.md:L37-L41)

**De facto representation rule:**

> **Structural provenance** = exact vault edge to \`(ns,id,rev)\`.  
> **Rich provenance citation** = producer-owned evidence description that may carry epistemic status and other citation metadata.  
> A producer may use both on the same append; they are complementary layers, not two competing truths.

### 3.3 Causation is not the same thing as provenance

Every vault changelog row contains \`causationId\`, and the Merkle link includes it. (omega-baseline/omega-final/plugins/vivim-vault/src/changelog.ts:L28-L36; omega-baseline/omega-final/plugins/vivim-vault/src/canon.ts:L47-L53)

That field identifies the causal ledger context of an append; it does not itself name the previous domain object that supplied evidence. The explicit backward relationship is \`refs\`.

This distinction is visible in P1-06: the governed event has a \`causationId\` and it separately carries a structural ref to the \`invoke/inv:<causationId>\` record. (omega-baseline/omega-final/plugins/vivim-agent/src/index.ts:L168-L223)

---

## 4. Epistemic status

### 4.1 Current legal values

D-324 ratified **\`OBSERVED | INFERRED | ASSUMED\`**, with **\`VERIFIED\` reserved** for probe-backed writes. It explicitly deferred \`CONTRADICTED\` until a producer exists. (omega-baseline/omega-final/docs/decisions/D-324-provenance-linkage.md:L18-L26)

The current contract enum actually declares four values:

- \`OBSERVED\`
- \`INFERRED\`
- \`ASSUMED\`
- \`VERIFIED\`

(omega-baseline/omega-final/contracts/src/vocabulary.ts:L48-L57)

The current production writer pattern is explicit:

- rule-based evidence is marked **INFERRED**;
- promoted realization evidence is marked **VERIFIED**;
- \`CONTRADICTED\` is not emitted. (omega-baseline/omega-final/plugins/vivim-director/src/resolve.ts:L101-L128)

### 4.2 Epistemic status is not freshness, confidence, lifecycle, or outcome

D-324 explicitly says Freshness is a separate timing concern and is untouched by epistemic status. (omega-baseline/omega-final/docs/decisions/D-324-provenance-linkage.md:L28-L32)

The vocabulary contract also separates confidence from proof: confidence only ranks candidates; proof is the promotion gate. (omega-baseline/omega-final/contracts/src/vocabulary.ts:L60-L75)

Other existing status-like values are different axes:

- provider realization lifecycle;
- computation kind DETERMINISTIC/PROBABILISTIC/HUMAN;
- intent resolution outcome;
- policy conflict result.

These are not substitutes for epistemic status. (omega-baseline/omega-final/contracts/src/vocabulary.ts:L7-L17; omega-baseline/omega-final/contracts/src/computation.ts:L13-L20; omega-baseline/omega-final/docs/decisions/D-411-intent-seam.md:L26-L30; omega-baseline/omega-final/plugins/vivim-law/src/conflict.ts:L205-L227)

---

## 5. Revision and historical representation

### 5.1 Revisions are append-only history, not destructive updates

The namespace registry states the live convention directly: object revisions are latest-wins with hot+cold fallback, while the changelog is append-only forever. The stronger D-410 invariant says compaction **never deletes any revision**; it only moves revisions hot→cold. (omega-baseline/omega-final/docs/VAULT-NAMESPACES.md:L7-L22)

D-432 ratifies the implementation consequence:

- the append path computes the next revision from changelog history;
- compaction moves eligible revisions hot→cold and never deletes them;
- the Merkle chain remains unchanged. (omega-baseline/omega-final/docs/decisions/D-432-vault-durability.md:L52-L69; omega-baseline/omega-final/docs/decisions/D-432-vault-durability.md:L99-L109)

The vault reader exposes latest or exact-revision reads and checks cold storage if necessary. (omega-baseline/omega-final/plugins/vivim-vault/src/sql.ts:L220-L236)

### 5.2 Revision is not staleness

A revision can be old and still be the correct historical evidence. Cold storage is a storage tier, not a semantic statement that the represented fact is “wrong” or “stale.” The current namespace rules make the distinction because superseded revisions remain readable for time travel, replay, export, genealogy, and evidence. (omega-baseline/omega-final/docs/VAULT-NAMESPACES.md:L12-L22)

### 5.3 Durability is part of representation semantics

D-432 makes the durable append itself two-phase: an fsynced \`append.intent\`, the data transaction, then an \`append.commit\`. An intent without commit is uncommitted and never enters the fold; torn tails are quarantined and ledgered instead of silently truncated. (omega-baseline/omega-final/docs/decisions/D-432-vault-durability.md:L52-L85)

D-395 separately ratifies the single-writer ceiling. The queue remains the serialization boundary that makes predicted sequence/revision allocation stable. (omega-baseline/omega-final/docs/decisions/D-395-vault-saturation-ceiling.md:L19-L27; omega-baseline/omega-final/plugins/vivim-vault/src/changelog.ts:L61-L84)

---

## 6. Staleness / freshness

### 6.1 There is no universal staleness field or enum today

**Inference from the current contracts and vault representation:** \`VaultProvenanceRef\` has no staleness field; the core \`ObjectRecord\` has revision/content identity but no universal freshness state. (omega-baseline/omega-final/contracts/src/vocabulary.ts:L29-L45; omega-baseline/omega-final/plugins/vivim-vault/src/sql.ts:L218-L236)

D-324 deliberately leaves Freshness separate from epistemic status. (omega-baseline/omega-final/docs/decisions/D-324-provenance-linkage.md:L28-L32)

### 6.2 One concrete staleness semantics is already ratified as a direction

D-424 defines staleness for a **published process snapshot**: the snapshot carries its source-tip SHA and generation time, and readers compare that SHA with the live repository tip; a mismatch is reported as stale, never as current. D-424 explicitly says this is a design direction and that implementation is a separate record. (omega-baseline/omega-final/docs/decisions/D-424-process-publish-seam.md:L25-L44)

Therefore:

> **Current law supports a concrete snapshot-staleness pattern, but Ω does not yet have a universal stale/fresh semantic for all evidence or all entities.**

This is a genuine ontology gap, not a missing implementation detail to invent here.

---

## 7. Conflict

### 7.1 Policy conflict is already implemented and ratified

D-433 closes the law-layer conflict problem. A policy row is data; amendments append a replacement relationship via \`supersedes\`; \`supersededBy\` is derived by replay. Conflict resolution is deterministic: precedence class first, then most-restrictive effect, with constraint intersection. Unresolvable cases are first-class PARADOX results. (omega-baseline/omega-final/docs/decisions/D-433-policy-coherence.md:L51-L98; omega-baseline/omega-final/plugins/vivim-law/src/conflict.ts:L56-L66; omega-baseline/omega-final/plugins/vivim-law/src/conflict.ts:L205-L227)

The resulting \`law.conflict\` namespace already records:

- \`conflict.resolved@1\` rows containing the two policies, resolution, precedence, scan time, and input hash;
- \`conflict.paradox@1\` rows containing both policies, scope, sentence, blockedUntil, and input hash;
- policy rows themselves as append-only supersession history. (omega-baseline/omega-final/docs/decisions/D-433-policy-coherence.md:L79-L98; omega-baseline/omega-final/docs/VAULT-NAMESPACES.md:L60-L60)

### 7.2 Knowledge contradiction is still unresolved

D-324 explicitly did **not** add a \`CONTRADICTED\` epistemic value because no producer existed. (omega-baseline/omega-final/docs/decisions/D-324-provenance-linkage.md:L18-L26)

Therefore “conflict” currently has at least two meanings:

1. **Policy conflict:** resolved by the D-433 law lattice and, when irreconcilable, recorded as a first-class policy paradox.
2. **Knowledge/evidence contradiction:** no universal representation exists yet.

These must not be conflated.

---

## 8. Lineage

### 8.1 Lineage is represented by typed backward relationships

Current Ω already carries lineage in multiple domain-specific forms:

- Agent genealogy: \`AgentIdentity.parentId\`. (omega-baseline/omega-final/contracts/src/agent.ts:L16-L26)
- Decision genealogy: \`DecisionRecord.parentDecisions[]\`; each parent must resolve before the decision is written. (omega-baseline/omega-final/contracts/src/agent.ts:L40-L55; omega-baseline/omega-final/plugins/vivim-agent/src/index.ts:L461-L476)
- State/revision lineage: a new revision can cite the previous revision of the same object. For example, \`resolve.report@1\` appends rev 2 and cites the decision at the previous revision. (omega-baseline/omega-final/contracts/src/computation.ts:L42-L45; omega-baseline/omega-final/plugins/vivim-director/src/index.ts:L301-L323)
- Policy genealogy: \`supersedes\` is the append-only input; \`supersededBy\` is derived. (omega-baseline/omega-final/plugins/vivim-law/src/conflict.ts:L25-L27; omega-baseline/omega-final/plugins/vivim-law/src/conflict.ts:L229-L241)
- Provenance lineage: exact-revision \`refs\`. (omega-baseline/omega-final/plugins/vivim-vault/src/validate.ts:L51-L63)

**Inference:** Ω currently has **typed lineage relationships**, but no single universal polymorphic lineage record.

### 8.2 “Lineage” is not the same as Git history

P1-02 treats repository history as a separate evidence/history layer and explicitly keeps it below ratified law in the authority hierarchy. (docs/agent-system/workstreams/WS-002/PHASE-1-TRUTH-BASELINE.md:L67-L77)

The P1-03 representation model therefore does not treat a Git SHA, a vault revision, and a domain parent pointer as interchangeable identifiers.

---

## 9. Representation and canonical serialization

### 9.1 Data identity is canonically serialized

The vault's canonical JSON algorithm sorts object keys, preserves array order, serializes scalars with JSON, and drops undefined-valued object keys. (omega-baseline/omega-final/plugins/vivim-vault/src/canon.ts:L20-L31)

The content hash is computed over that canonical JSON. (omega-baseline/omega-final/plugins/vivim-vault/src/canon.ts:L38-L40)

The CAS stores exactly that canonical JSON representation and is idempotent for equal content. (omega-baseline/omega-final/plugins/vivim-vault/src/cas.ts:L31-L49)

### 9.2 The provenance/meta envelope is not the content identity

The vault stores \`meta + refs\` separately from \`data\`, and \`cid\` is derived from \`data\` alone. (omega-baseline/omega-final/plugins/vivim-vault/src/sql.ts:L21-L24; omega-baseline/omega-final/plugins/vivim-vault/src/canon.ts:L38-L40; omega-baseline/omega-final/plugins/vivim-vault/src/sql.ts:L182-L200)

The envelope is serialized with ordinary \`JSON.stringify\`; its field order therefore is not the canonical content-identity mechanism. (omega-baseline/omega-final/plugins/vivim-vault/src/sql.ts:L182-L200)

This is intentional separation, not an error: data identity and provenance/metadata are different layers.

### 9.3 Search representation is also separate

FTS indexes use the data itself when it is a string, otherwise the canonical JSON form. The indexed body is therefore a search representation, not a third object identity. (omega-baseline/omega-final/plugins/vivim-vault/src/canon.ts:L56-L58; omega-baseline/omega-final/plugins/vivim-vault/src/sql.ts:L297-L310)

---

# M2 — Gap and inconsistency map

| Area | Current state | Gap / inconsistency | Phase-1 blocker? | Required treatment |
|---|---|---|---|---|
| **Universal Entity semantics** | Namespace-specific entities with common \`ns/id/rev\` storage identity | No single global Entity type/semantic contract | **No** for P1-06/P1-08 | Document as the current de facto model; do not invent a universal type yet |
| **Generic Evidence type** | Evidence is represented through resolvable domain objects + provenance refs | No universal \`EvidenceRecord\` or evidence namespace | **No** | Keep evidence as a cross-cutting relationship; future generic evidence API needs its own decision |
| **Structural vs rich provenance** | Structural refs are \`{ns,id,rev}\`; rich \`VaultProvenanceRef\` can carry epistemic metadata and is often retained inside producer data | Same logical citation has two layers, which is easy to confuse | **No** | Canonicalize the distinction in documentation; do not alter \`vault.append@1\` |
| **Universal lineage** | Parent/supersedes/ref relationships already exist | No one polymorphic lineage object | **No** | Use typed lineage where it already exists; do not introduce a graph engine |
| **Epistemic status** | OBSERVED/INFERRED/ASSUMED/VERIFIED exist; VERIFIED is reserved | No CONTRADICTED producer; contradiction semantics remain open | **No** | Respect D-324; formal proposal only if a contradiction state is needed |
| **Policy conflict** | Fully represented by D-433 lattice + \`law.conflict\` ledger | None at the policy-conflict layer | **No** | Treat as existing stable semantics, not a P1-03 invention |
| **Knowledge/evidence conflict** | Not universally represented | No relation/status for “these evidence items contradict each other” | **No** | Requires a future decision; see P1-03-PROP-001 |
| **Universal staleness** | D-424 specifies one snapshot pattern; D-324 keeps freshness orthogonal | No universal stale/fresh representation | **No** | Leave as gap; no cross-domain semantics invented here |
| **Revision semantics** | Explicit rev, changelog allocation, hot+cold, no deletion | None found in current spine | **No** | Stable |
| **Authority vs evidence** | Existing authority hierarchy and governance law separate authority from evidence | Cross-workstream readers can still confuse evidence with authority | **No** | State the separation as canonical documentation |
| **Session namespace documentation** | \`VAULT-NAMESPACES.md\` says session bookkeeping is deferred | Current provider-browser source already writes \`session:<uuid>\` rows and P1-08 depends on them | **No** | Documentation drift; belongs to repository-truth cleanup, not a vault-code change here |
| **Live Phase-1 proof** | P1-06/P1-08 are designed/coded and their committed records say live proof is pending | Runtime execution evidence is still missing | **Not an ontology blocker** | Preserve the proof boundary; never upgrade code-level evidence to live evidence |

## 2.1 Important non-gap distinction: not all statuses are epistemic statuses

The current system contains many status-like values. Only the values explicitly in \`EpistemicStatus\` belong to the epistemic axis. Provider lifecycle, intent outcome, computation kind, principal lifecycle, policy resolution, and vault recovery are different dimensions. (omega-baseline/omega-final/contracts/src/vocabulary.ts:L48-L75; omega-baseline/omega-final/contracts/src/computation.ts:L13-L20; omega-baseline/omega-final/docs/decisions/D-411-intent-seam.md:L26-L30; omega-baseline/omega-final/plugins/vivim-law/src/conflict.ts:L205-L227)

This distinction is critical to prevent an ontology that is merely an index of labels: the meaning must come from the typed role and surrounding context, not from reusing a generic status word across unrelated domains.

---

# M3 — Minimal canonical representation document

## 3. Canonical model

This section is the **documentation-level canonical representation** for P1-03. It deliberately restates existing semantics before adding anything.

### 3.1 Entity

An entity is a namespace-owned domain object.

- Logical identity: \`(ns,id)\`.
- Revision identity: \`(ns,id,rev)\`.
- Content identity: \`cid\`.
- The namespace owns the entity's domain schema and writer discipline.
- A revision is historical state, not a replacement of the entity's identity.
- A current projection may expose the latest revision; historical revisions remain addressable. (omega-baseline/omega-final/plugins/vivim-vault/src/sql.ts:L40-L57; omega-baseline/omega-final/plugins/vivim-vault/src/sql.ts:L220-L236)

### 3.2 Event

An event is a domain object whose payload records that something happened, was requested, observed, produced, changed, approved, refused, or otherwise occurred.

The current system already uses event-shaped objects such as the P1-06 \`governed-action@1\` event and law journal rows. These are not a second identity model; each is an ordinary vault object with namespace-specific data and the same vault identity/revision machinery. (omega-baseline/omega-final/plugins/vivim-agent/src/governance.ts:L41-L64; omega-baseline/omega-final/docs/VAULT-NAMESPACES.md:L47-L49)

### 3.3 Evidence

Evidence is **a citable, resolvable representation that supports a claim, decision, state transition, or reconstruction**.

Evidence therefore has:

1. a source object identity/revision;
2. an explicit relationship to the consuming record;
3. optional epistemic metadata;
4. no automatic authority merely because it is cited.

The source object remains independently addressable; the citation is a relationship to that source.

### 3.4 Provenance

Provenance is the explicit relationship from a record to the source records it depends on.

Current canonical layers:

    rich citation
      VaultProvenanceRef
            |
            v
    structural edge
      { ns, id, rev }

The rich citation may carry \`epistemicStatus\`, \`cid\`, nested refs, or other metadata in the containing record; the structural edge is the vault's compaction/durability reference. (omega-baseline/omega-final/contracts/src/vocabulary.ts:L29-L45; omega-baseline/omega-final/plugins/vivim-vault/src/sql.ts:L184-L215)

### 3.5 Epistemic status

The canonical current epistemic vocabulary is:

| Value | Current meaning | Stability |
|---|---|---|
| \`OBSERVED\` | Directly read from a source | RATIFIED |
| \`INFERRED\` | Derived deterministically from observed inputs | RATIFIED |
| \`ASSUMED\` | Taken as given without direct evidence; should escalate rather than be blindly trusted | RATIFIED |
| \`VERIFIED\` | Backed by passing postcondition/probe evidence; reserved writers only | RATIFIED / constrained |
| \`CONTRADICTED\` | **Not currently legal**; D-324 deferred it until a producer exists | GAP |

(omega-baseline/omega-final/docs/decisions/D-324-provenance-linkage.md:L24-L32; omega-baseline/omega-final/contracts/src/vocabulary.ts:L48-L57)

### 3.6 Authority

Authority is not an epistemic value.

A record can be:

- high-quality evidence without being authoritative;
- authoritative because of governance law without being new evidence;
- both evidence and authority witness in a specific domain.

The current authority hierarchy and law layer remain the governing mechanism. (docs/agent-system/workstreams/WS-002/PHASE-1-TRUTH-BASELINE.md:L67-L83)

### 3.7 Lineage

Lineage is the relationship that lets a reader answer “which prior record does this record descend from or supersede?”

Current mechanisms are typed:

- parent agent id;
- parent decision ids;
- same-object previous revision refs;
- policy \`supersedes\`;
- general structural provenance refs. (omega-baseline/omega-final/contracts/src/agent.ts:L16-L55; omega-baseline/omega-final/plugins/vivim-law/src/conflict.ts:L56-L66)

No universal graph engine is introduced. D-324 explicitly makes a second provenance graph a non-goal. (omega-baseline/omega-final/docs/decisions/D-324-provenance-linkage.md:L28-L32)

### 3.8 Revision

Revision means immutable historical version of a logical object.

Rules already in force:

- revision numbers are positive integers;
- next revisions come from changelog history;
- compaction may move a revision hot→cold;
- compaction never deletes a revision;
- latest is a projection, not a loss of history. (omega-baseline/omega-final/docs/VAULT-NAMESPACES.md:L7-L22; omega-baseline/omega-final/plugins/vivim-vault/src/changelog.ts:L5-L12)

### 3.9 Staleness

No universal stale/fresh law is adopted here.

The strongest existing semantic is:

> A representation is stale when it is explicitly claiming to describe a source's current state, and the source identity/tip it was derived from no longer matches the live source.

That rule is **only ratified today for the D-424 process-publish direction**; it must not be retroactively treated as a universal Ω law until a dedicated decision closes the gap. (omega-baseline/omega-final/docs/decisions/D-424-process-publish-seam.md:L27-L44)

### 3.10 Conflict

Current canonical distinction:

- **Policy conflict** → D-433 deterministic lattice; unresolved constitutional/constraint contradictions become first-class PARADOX records. (omega-baseline/omega-final/docs/decisions/D-433-policy-coherence.md:L53-L98)
- **Knowledge/evidence contradiction** → not yet universally represented; no \`CONTRADICTED\` epistemic value is legal today. (omega-baseline/omega-final/docs/decisions/D-324-provenance-linkage.md:L18-L26)

### 3.11 Representation

The canonical storage representation is layered:

    Domain data
       |
       +--> canonical JSON
       |       |
       |       +--> cid
       |       +--> CAS bytes
       |
       +--> metadata/provenance envelope
       |       { meta, refs[] }
       |
       +--> changelog identity
               { seq, causationId, ns, id, rev, cid, entry_hash, prev_hash }

(omega-baseline/omega-final/plugins/vivim-vault/src/canon.ts:L20-L53; omega-baseline/omega-final/plugins/vivim-vault/src/sql.ts:L21-L24; omega-baseline/omega-final/plugins/vivim-vault/src/changelog.ts:L28-L36)

This means:

- \`cid\` identifies content, not metadata;
- \`refs\` identify provenance dependencies;
- \`causationId\` identifies the append's causal context;
- \`seq/entry_hash/prev_hash\` establish durable history and integrity.

### 3.12 Durability and epistemic honesty

A representation is not proof merely because it is durable.

The vault proves the integrity of its history and references; epistemic status describes how the producer knows the cited thing; governance authority remains a separate question. D-432 and D-324 jointly establish these distinct axes. (omega-baseline/omega-final/docs/decisions/D-432-vault-durability.md:L70-L85; omega-baseline/omega-final/docs/decisions/D-324-provenance-linkage.md:L24-L32)

---

## 4. Formal proposals for genuine unresolved gaps

### P1-03-PROP-001 — Knowledge contradiction semantics

**Problem:** Ω already has policy contradiction semantics, but not a universal representation for two evidence/knowledge items that disagree.

**Existing ratified boundary:** D-324 explicitly deferred \`CONTRADICTED\` because there was no producer. (omega-baseline/omega-final/docs/decisions/D-324-provenance-linkage.md:L18-L26)

**Proposal:** Do not add any fifth epistemic value in this baseline.

A future proposal must decide whether contradiction is:

- a fifth epistemic value;
- a separate relation between evidence items;
- or both.

**Decision impact:** introducing \`CONTRADICTED\` as an epistemic value would require review/amendment of **D-324**. P1-03 does not silently supersede it.

### P1-03-PROP-002 — Universal freshness/staleness semantics

**Problem:** process snapshots have a specific staleness rule, but ordinary vault evidence does not.

**Existing ratified boundary:** D-324 keeps Freshness orthogonal; D-424 gives a specific snapshot design direction. (omega-baseline/omega-final/docs/decisions/D-324-provenance-linkage.md:L28-L32; omega-baseline/omega-final/docs/decisions/D-424-process-publish-seam.md:L27-L44)

**Proposal:** defer a universal stale/fresh field until a cross-domain consumer requires it. Any future decision must state what source identity/tip is compared, whether staleness is computed or persisted, and whether historical evidence can be stale while remaining valid history.

No code or current ref shape is changed here.

---

# M4 — Phase-1 reconciliation against the running chain

## 5. P1-06 governed-event chain

### 5.1 Structural fit

P1-06's governed action event is a normal vault object in namespace \`agency\`. Its record contains:

- \`kind\`, \`eventId\`, \`at\`, \`causationId\`;
- a principal statement;
- an authority statement;
- the exact governed capability;
- invocation verdict / authority resolution;
- execution attempted/completed;
- outcome;
- optional refusal reason;
- optional intent ref;
- optional target result. (omega-baseline/omega-final/plugins/vivim-agent/src/governance.ts:L41-L64)

The execution path constructs that event and appends it to \`ns agency\`, while adding a structural ref to \`invoke/inv:<causationId>\`. (omega-baseline/omega-final/plugins/vivim-agent/src/index.ts:L168-L223)

This maps cleanly to the P1-03 model:

    agency event
      ├── logical identity: agency / event:<causationId>
      ├── revision: vault-assigned
      ├── causal identity: causationId
      ├── evidence/provenance edge: invoke / inv:<causationId>
      └── semantic payload: governed-action@1

No ontology change is required.

### 5.2 Epistemic fit

The P1-06 governed event does not carry an \`epistemicStatus\`, and that is not a contradiction. The event is itself a record of a governed attempt; it is not a claim that another source has a particular epistemic relationship. The existing model makes epistemic status optional. (omega-baseline/omega-final/contracts/src/vocabulary.ts:L29-L45)

### 5.3 Phase-1 proof boundary

The committed P1-06 document explicitly states that the chain is DESIGNED + CODED but **not live-proven**; the real success/refusal event rows are still required from the owner run. (docs/agent-system/workstreams/WS-006/PHASE-1-GOVERNANCE-CHAIN.md:L464-L474; docs/agent-system/workstreams/WS-006/PHASE-1-GOVERNANCE-CHAIN.md:L516-L535)

P1-03 therefore treats the event schema as current implementation/design evidence, not as a fabricated live evidence sample.

---

## 6. P1-08 provider-browser chain

### 6.1 Capture and session representation

The live provider-browser source creates a redacted capture record in \`providers\`, computes its integrity digest over the redacted text, and stores that capture as a normal vault object. (omega-baseline/omega-final/plugins/provider-browser/src/index.ts:L145-L177)

The session record is itself a normal \`providers\` object whose \`captureRef\` is an exact \`{ns,id,rev}\` reference; live sessions carry a separate localhost descriptor and are never mislabeled as fixtures. (omega-baseline/omega-final/plugins/provider-browser/src/session.ts:L18-L50; omega-baseline/omega-final/plugins/provider-browser/src/session.ts:L90-L125)

This is a direct fit for the P1-03 model:

    session
       |
       +--> captureRef ----> exact capture revision
       |
       +--> live descriptor (transport fact)

### 6.2 Outbound message representation

The live \`message.send@1\` path writes the outbound message to \`ns email\`, and its structural refs point to the provider session and the attach-time capture revision. Optional provider response identity is stored in metadata and may also be returned to the caller. (omega-baseline/omega-final/plugins/provider-browser/src/index.ts:L286-L325)

The fixed operation contract remains \`message.send@1\`; P1-08 explicitly confirms no rename or caller-side contract rewrite. (docs/agent-system/workstreams/WS-008/PHASE-1-HANDOFF-PACKAGE.md:L516-L555)

### 6.3 Provider identity vs local object identity

The outbound row has a local \`messageId\`; live ChatGPT may additionally supply \`providerMessageId\`. The P1-08 handoff explicitly distinguishes these and says crash/replay deduplication is not solved in this phase. (docs/agent-system/workstreams/WS-008/PHASE-1-HANDOFF-PACKAGE.md:L416-L431)

This is exactly consistent with the three-layer identity model:

- local object identity remains \`email + messageId + rev\`;
- provider identity is additional domain metadata;
- exactly-once delivery is a separate execution property, not an identity claim.

### 6.4 Evidence boundary

P1-08 redacts capture input before it reaches the vault, retains the live response in memory for parsing, and deliberately does not persist the raw provider response body on the live path. (docs/agent-system/workstreams/WS-008/PHASE-1-HANDOFF-PACKAGE.md:L463-L475)

That is consistent with evidence representation as selective, purposeful citation rather than “store everything.”

### 6.5 Phase-1 proof boundary

The P1-08 handoff explicitly marks ordering, identity, content preservation, exactly-once delivery intent, and redaction as **code-level / M4 pending**; live authenticated execution and final gate runs are still open. (docs/agent-system/workstreams/WS-008/PHASE-1-HANDOFF-PACKAGE.md:L402-L475; docs/agent-system/workstreams/WS-008/PHASE-1-HANDOFF-PACKAGE.md:L650-L695)

Again, P1-03 treats those as implementation/provenance evidence, not as fabricated live records.

---

## 7. M4 verdict

**RECONCILIATION RESULT: PASS — no critical ontology/representation contradiction found.**

The already-committed P1-06/P1-08 chain fits the current model without changing:

- \`vault.append@1\`;
- \`{ns,id,rev}\` structural references;
- the current epistemic enum;
- existing event payloads;
- \`message.send@1\`;
- provider-browser session/capture/message shapes.

The only limitations are already explicit in the source workstreams:

1. live execution proof is still pending;
2. crash/replay deduplication is not solved;
3. P1-08 keeps the historical attach-time capture reference even though live send does not consume capture bytes;
4. the universal knowledge-conflict and universal staleness semantics remain open ontology work. (docs/agent-system/workstreams/WS-008/PHASE-1-HANDOFF-PACKAGE.md:L680-L695)

None of those requires modifying the current Phase-1 event/provenance shapes.

---

# 8. Final proof matrix

| Concept | What Ω currently means | Status |
|---|---|---|
| **Entity** | Namespace-owned addressable domain object; logical identity \`(ns,id)\`, revision \`(ns,id,rev)\` | **Documented de facto semantics** |
| **Evidence** | A resolvable cited representation supporting a claim/decision/reconstruction | **Documented de facto semantics; no universal EvidenceRecord type** |
| **Provenance** | Exact backward reference to a stored revision, optionally accompanied by richer citation metadata | **RATIFIED + implemented** |
| **Epistemic status** | OBSERVED / INFERRED / ASSUMED / VERIFIED | **RATIFIED; VERIFIED restricted; CONTRADICTED open** |
| **Authority** | Separate governance property; evidence does not confer authority | **Existing governing principle** |
| **Lineage** | Typed parent/supersedes/revision/provenance relationships | **Implemented; no universal lineage object** |
| **Revision** | Immutable historical version; latest is a projection; old revisions remain addressable | **RATIFIED + implemented** |
| **Conflict** | Policy conflict is a first-class D-433 lattice; knowledge contradiction is not yet universally represented | **Partly RATIFIED, partly open** |
| **Staleness** | No universal status; D-424 defines a specific snapshot-tip mismatch rule | **Open outside the specific D-424 direction** |
| **Representation** | Canonical JSON for data/CID; separate metadata+structural refs; Merkle-chained ledger for history | **RATIFIED + implemented** |
| **Live Phase-1 evidence** | P1-06/P1-08 code-level records exist; live execution evidence does not yet exist | **Needs owner run; do not infer live proof** |

## 9. Ratified-law revision triggers

Only two findings in this baseline would plausibly require reopening ratified ontology law:

1. **Introducing a universal knowledge contradiction state such as \`CONTRADICTED\`** would require review/amendment of **D-324**, because D-324 intentionally deferred that value until a producer exists. (omega-baseline/omega-final/docs/decisions/D-324-provenance-linkage.md:L18-L26)
2. **Generalizing D-424's process-snapshot staleness rule into universal Ω freshness/staleness law** would require a new formal decision and must not silently be treated as already ratified. (omega-baseline/omega-final/docs/decisions/D-424-process-publish-seam.md:L35-L44)

No other finding in M1-M4 requires revising the ratified vault/event/provenance shapes already used by Phase-1.

## 10. Bottom line

The existing Ω ontology is not empty and should not be redesigned from scratch.

The current system already has:

- a load-bearing object identity model;
- exact-revision provenance edges;
- richer epistemic citations;
- explicit principal/agent/decision/realization/event records;
- typed lineage relationships;
- immutable revision history;
- a deterministic policy-conflict lattice;
- canonical content representation;
- durable, integrity-checked vault history.

The remaining ontology work is mostly **unification at the semantic level**, not invention of a new storage substrate: make the existing distinctions legible as one model, and formally decide only the genuinely unresolved parts—especially knowledge contradiction and universal staleness.

**P1-03 M1–M4 baseline status: COMPLETE.**
