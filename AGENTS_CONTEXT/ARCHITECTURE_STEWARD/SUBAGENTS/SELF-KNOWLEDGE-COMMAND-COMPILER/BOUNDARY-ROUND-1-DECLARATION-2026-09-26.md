# CFA-03 — Semantic Continuity Steward — Boundary Round 1 Declaration

> Date: 2026-09-27
> Classification: CFA-03 current claim; not a shared architectural boundary
> Basis: repository `main` as inspected for Round 1 recovery on 2026-09-27
> Identity basis: ratified CFA-03 Semantic Continuity Steward; foundation phase complete
> Independence note: peer declarations are evidence for the seam, not instructions for CFA-03 ownership

## Identity

| Field | Current claim |
|---|---|
| CFA ID | `CFA-03` |
| Canonical name | **Semantic Continuity Steward** |
| Machine-safe slug | `semantic-continuity` |
| Workspace | `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/` |
| Identity status | **RATIFIED / FOUNDATION-SEEDED** |
| Parent | Architecture Steward |
| Responsibility that must remain coherent | Semantic continuity across self-knowledge, grounding, command semantics, interpretation, canonical Intent/Plan meaning, execution meaning, evidence/provenance and representation, without becoming the authority of any participating plane |
| Explicit boundary | CFA-03 stewards continuity and cross-plane semantic contracts; it does not replace World meaning, canonical data identity, authority, Work/execution, capability/provider realization, surface realization, runtime law, or the Steward graph |

**Identity basis — OBSERVED / CURRENT**

The repository's ratified identity establishes CFA-03 as the **Semantic Continuity Steward**. The core identity explicitly defines the seam as:

`self-knowledge ↔ grounding ↔ command language ↔ interpretation ↔ canonical Intent/Plan ↔ execution meaning ↔ evidence/provenance ↔ representation`

and explicitly excludes runtime law, canonical World/data ownership, Work/execution implementation, provider realization, and surface/UI realization from CFA-03's authority.

## Responsibility

CFA-03 maintains one semantic continuity question:

> **Does the meaning of an input or request remain coherent and inspectable as it is grounded, interpreted, canonicalized, represented as Intent/Plan, handed to Work, realized through execution, evidenced, and represented back to humans or agents?**

This responsibility is about **continuity across independently owned planes**, not ownership of every subsystem participating in that continuity.

The current repository evidence supports the following bounded responsibility:

1. preserve the distinction between meaning and representation;
2. preserve the distinction between grounding and authorization;
3. preserve the distinction between interpretation and execution;
4. preserve the distinction between Intent and Work;
5. preserve the distinction between confidence and proof;
6. preserve the distinction between self-knowledge and authority;
7. trace semantic identity and provenance across cross-plane transformations;
8. maintain bounded terminology/CANON for this semantic seam;
9. characterize the smallest interoperable handoffs needed between World, Authority and Work;
10. identify falsifiers, unknowns, overlap and stale assumptions without silently converting them into settled architecture.

**Epistemic discipline**

All consequential claims in this declaration are classified as **OBSERVED**, **DERIVED**, **PROPOSED**, **UNKNOWN**, or **CONFLICTED**. Freshness is stated separately as **CURRENT**, **STALE**, or **UNRESOLVABLE** where material.

The declaration deliberately does not promote a peer assertion, research proposal, or historical implementation into authority merely because it is useful for interoperability.

## OWNS / CONTRIBUTES / CONSULTS / OUT-OF-SCOPE

| Responsibility | Position | State | Freshness | Boundary note |
|---|---|---|---|---|
| Semantic continuity across grounding → interpretation → canonical meaning → Intent/Plan → Work-facing meaning → evidence → representation | **OWNS** | DERIVED | CURRENT | This is the CFA-03 responsibility itself |
| Interpretation semantics and interpretation-state distinctions | **OWNS** | CURRENT | CURRENT | Interpretation is not execution |
| Cross-plane canonical semantic continuity | **OWNS** | DERIVED | CURRENT | Continuity, not ownership of each semantic plane |
| Grounding contract semantics at the language/World seam | **OWNS** | DERIVED | CURRENT | Grounding resolves references/meaning; it does not authorize |
| Intent/Plan meaning continuity | **OWNS** | DERIVED | CURRENT | Intent/Plan are semantic artifacts; Work remains a separate owner |
| Semantic identity/provenance continuity across the chain | **OWNS** | DERIVED | CURRENT | This is a seam responsibility, not a universal identity database |
| Bounded terminology/CANON for this seam | **OWNS** | CURRENT / PROVISIONAL | CURRENT | Not Ω law, not universal taxonomy |
| Canonical World-domain meaning | **CONTRIBUTES** | DERIVED | CURRENT | CFA-01 retains World meaning ownership |
| Canonical data/storage identity | **CONTRIBUTES** | DERIVED | CURRENT | CFA-02 retains durable data ownership |
| Authority-facing semantic request/effect description | **CONTRIBUTES** | DERIVED / PROPOSED | CURRENT | CFA-04 owns authorization semantics |
| Evidence/provenance requirements needed for semantic continuity | **CONTRIBUTES** | DERIVED | CURRENT | General evidence/provenance ownership is not assumed here |
| Work-facing semantic package | **CONTRIBUTES** | DERIVED | CURRENT | CFA-05 retains durable Work/execution ownership |
| Runtime self-knowledge derivation | **CONSULTS** | OBSERVED | CURRENT | `vivim.mind` is read-only and evidence-derived |
| World target/addressability/context semantics | **CONSULTS** | OBSERVED / DERIVED | CURRENT | Needed to ground commands without owning World |
| Authority result/constraints | **CONSULTS** | DERIVED | CURRENT | Needed to keep semantic state distinct from permission state |
| Work lifecycle/execution/result semantics | **CONSULTS** | DERIVED | CURRENT | Needed to represent actual outcome without rewriting intent meaning |
| Capability/provider/routing realization | **CONSULTS** | DERIVED | CURRENT | Relevant when routing changes the concrete realization of the same semantic request |
| Surface/visual interaction realization | **CONSULTS** | DERIVED | CURRENT | Representation must remain downstream of canonical meaning |
| Ω constitutional/runtime law | **OUT-OF-SCOPE** | OBSERVED | CURRENT | CFA-03 cannot amend or define Ω law |
| Canonical World ontology/existence/correspondence authority | **OUT-OF-SCOPE** | OBSERVED | CURRENT | World meaning belongs to CFA-01 |
| Canonical persistence/storage mechanics | **OUT-OF-SCOPE** | OBSERVED | CURRENT | Data responsibility remains with CFA-02 |
| Authorization/consent/delegation/risk decision semantics | **OUT-OF-SCOPE** | OBSERVED / PEER-OWNED | CURRENT | CFA-04 owns authority semantics |
| Work lifecycle, scheduling, retries, execution engine | **OUT-OF-SCOPE** | DERIVED / PEER-OWNED | CURRENT | CFA-05 |
| Provider/browser/account/session realization mechanics | **OUT-OF-SCOPE** | DERIVED | CURRENT | CFA-06 |
| Surface/UI implementation | **OUT-OF-SCOPE** | DERIVED | CURRENT | CFA-08 |
| Architecture Steward graph | **OUT-OF-SCOPE** | OBSERVED | CURRENT | The Steward graph is a map/view, not CFA-03's semantic authority |
| Universal provenance database | **OUT-OF-SCOPE** | DERIVED | CURRENT | CFA-03 only requires seam-level provenance continuity |
| Repository-wide terminology renaming | **OUT-OF-SCOPE** | OBSERVED | CURRENT | CANON is a bounded instrument, not a rename program |

**Core ownership invariant**

> CFA-03 can own the **continuity relation** between two independently owned meanings without owning either endpoint.

That is the central Round-1 boundary claim.

## Assigned Seams

### Seam 1 — Semantic ↔ World

#### 1. What is the subject of this seam?

The crossing between:

- **World:** what a referenced World subject means, what it is, how its identity/correspondence/addressability is defined, and what bounded Context means on the World side; and
- **Semantic Continuity:** how that meaning is grounded, interpreted, carried into canonical Intent/Plan meaning, represented, and preserved across later transformations.

The critical boundary is:

`World: what the referenced thing means / is`

versus

`Semantic Continuity: whether that meaning remains coherent while grounded, interpreted, canonicalized and represented`

#### 2. What does CFA-03 own?

**DERIVED / CURRENT**

CFA-03 owns the continuity contract for:

- language/reference → grounded World reference;
- World reference/context → interpreted command meaning;
- interpreted command meaning → canonical semantic representation;
- canonical meaning → Intent/Plan meaning;
- semantic meaning → representation.

CFA-03 does not own the World model itself.

#### 3. What does CFA-01 / World own?

**OBSERVED / PEER CLAIM / CURRENT**

CFA-01's declaration claims ownership of:

- World-domain meaning;
- World subject/object and relationship meaning;
- semantic identity/correspondence meaning on the World side;
- addressability semantics;
- World projection semantics;
- Context semantics.

CFA-01 explicitly states that CFA-03 owns continuity across transformations while CFA-01 owns World-domain meaning. This is a useful present seam claim, but the two sides are not yet reconciled into an ACTIVE shared boundary.

#### 4. What does CFA-03 merely consume from World?

CFA-03 consumes:

- World subject definitions;
- addressability/reference semantics;
- identity/correspondence information needed to distinguish candidates;
- World/context scope and meaning;
- ambiguity/conflict status;
- evidence supporting candidate references;
- freshness/basis information where a derived World view is being used for interpretation.

The semantic layer may need this information to interpret a command, but consuming it does not make CFA-03 the owner of World truth.

#### 5. What does World consume from Semantic Continuity?

World-side consumers may need:

- grounded semantic reference requests;
- normalized terminology/crosswalk information relevant to World concepts;
- semantic target constraints;
- interpreted reference requirements;
- explicit unresolved/ambiguous state;
- provenance linking a command or representation back to the semantic reference that produced the lookup.

World should consume the **request to resolve/interact with World meaning**, not a semantic claim that silently redefines World meaning.

#### 6. What crosses the boundary?

At minimum:

- grounded World references;
- target identity/correspondence references;
- terminology/crosswalk entries;
- context references;
- semantic identity and provenance references;
- ambiguity/conflict status;
- freshness/basis status where a derived World view participates in grounding;
- canonical Intent/Plan references that preserve the intended World target;
- representation mappings that point back to the World subject.

#### 7. What must never cross?

- Command grammar must not become the World ontology.
- CANON must not silently become universal World ontology.
- A grounded mention must not automatically create a canonical World object.
- A representation label must not redefine World meaning.
- A parser/interpretation result must not silently become World authority.
- A World projection must not be mistaken for the complete canonical World.
- A stale or ambiguous World view must not be silently presented as current meaning.
- World-side evidence must not become authorization merely by being cited.

#### 8. Where does grounding belong?

Grounding belongs at the **semantic/world seam** as a reference-and-meaning resolution activity.

**DERIVED / CURRENT:** grounding answers questions such as:

- what World subject might this phrase denote?
- what known context is relevant?
- which candidate is resolved?
- what evidence/basis supports the reference?
- is the reference ambiguous, stale or unresolved?

Grounding does **not** answer:

> may this effect be caused?

That question belongs to the Authority seam.

#### 9. Where does interpretation belong?

Interpretation remains with CFA-03's semantic continuity responsibility and the existing NCLL/interpreter plane.

The current repository states that NCLL has a deterministic pure interpretation pipeline over WorldModel, and D-216 makes identical `(text, WorldModel, version)` produce identical interpretation.

Interpretation consumes grounded/contextual information but does not become the canonical World ontology.

#### 10. When does a grounded result become canonical semantic meaning?

**DERIVED / CURRENT**

A grounded reference becomes part of canonical semantic meaning only when the deterministic interpretation resolves the request into a stable semantic representation whose meaning downstream Intent/Plan can cite.

This is not the same as creating or changing a World fact.

D-411 provides concrete evidence for the downstream continuity boundary: the persisted Intent row carries the interpretation summary and becomes the canonical-intent artifact consumed by the law-facing citation path.

The exact future contract for turning every possible grounded reference into a canonical semantic reference is **UNKNOWN** and requires peer reconciliation.

#### 11. How should World meaning enter command interpretation without becoming command authority?

World meaning should enter interpretation as **grounding/context evidence**:

`World meaning → candidate/reference/context → deterministic interpretation → canonical semantic meaning`

The World contributes the meaning of the referenced subject.

The semantic layer transforms that information into command meaning.

Neither step authorizes execution.

#### 12. How should command interpretation refer to World entities without becoming the canonical World model?

Use explicit bounded references to World subjects and preserve unresolved states.

A semantic interpretation should be able to say, in effect:

- target resolved to World reference X;
- target remains candidate/ambiguous;
- target is stale/unresolvable;
- target is unavailable for the current view.

It should not copy the World ontology into a second semantic database.

The exact reference shape is **UNKNOWN** at full destination breadth; current repository evidence supports the principle, not one universal object shape.

#### 13. What identity/provenance needs to survive the seam?

At minimum:

- source/World subject reference or correspondence reference;
- semantic interpretation identity;
- provenance/evidence basis for the grounding;
- derivation version where freshness can affect interpretation;
- Intent reference once canonicalized;
- where applicable, Work/reference identity downstream.

These are distinct identity dimensions. In particular:

`semantic identity ≠ World identity ≠ record identity ≠ Intent identity ≠ Work identity ≠ Evidence identity ≠ representation identity`

A cross-plane reference may connect them; it must not collapse them into one universal identity.

#### 14. What evidence currently supports the boundary?

**OBSERVED / CURRENT**

- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/CORE-AGENT-IDENTITY.md` — CFA-03 explicitly owns semantic continuity and excludes canonical World/data ownership.
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/BOUNDARY-ROUND-1-DECLARATION-2026-09-26.md` — CFA-01 explicitly distinguishes World-domain meaning from CFA-03 continuity and lists the same seam.
- `docs/destination/self-knowledge-core/RESEARCH.md` — `vivim.mind` is read-only and derives a bounded WorldModel from governed evidence; the research also warns that the current model does not carry a complete freshness basis.
- `omega-baseline/omega-final/docs/BUILD-DECISIONS.md` — D-215 establishes `vivim.mind` as a plugin-derived, non-authoritative self-knowledge model and D-216 establishes deterministic NCLL interpretation over WorldModel.
- `omega-baseline/omega-final/plugins/vivim-mind/plugin.json` — the current mind lens is explicitly derived, read-only and non-authoritative.
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/CANON-DICTIONARY.md` — grounding and representation are explicitly distinguished from authority and canonical ontology.
- `docs/destination/INTERACTION-INTENT-WORK-RECONCILIATION.md` — addressing and context are upstream of Intent in the destination path.

#### 15. What would falsify the boundary?

The boundary would be falsified if durable ratified evidence demonstrates that:

1. CFA-03 must own the canonical World ontology for command interpretation to be coherent;
2. World-domain meaning cannot be separated operationally from semantic continuity;
3. command interpretation is itself the authoritative World model;
4. grounding is defined as an authorization operation rather than a reference/meaning operation;
5. a ratified destination contract explicitly assigns World truth to CFA-03.

#### 16. What remains unknown?

- Exact grounded-reference contract between CFA-03 and CFA-01.
- Exact handling of World identity evolution/merge/split across semantic history.
- Whether all World concepts participate in CANON or only terminology crossing this seam.
- Exact multi-step target propagation into Plan/Work.
- Exact future visual write-back semantics when World objects are manipulated spatially.
- Complete freshness propagation from derived World/self-knowledge views into interpretation.

#### 17. What appears to overlap?

- **Meaning:** World meaning and command meaning both use the word "meaning".
- **Identity:** World semantic identity/correspondence and cross-plane semantic identity can both be called "identity".
- **Context:** World Context semantics and semantic grounding context may be described with the same term.
- **Terminology:** CANON may contain names that also denote World concepts.
- **Projection:** World projection and semantic representation are both derived views.

Current assessment: **overlap is real, but duplicate ownership is not proven**. The safest current boundary is to distinguish *endpoint meaning* from *continuity of meaning across transforms* and route any unresolved shared term into peer reconciliation.

---

### Seam 2 — Semantic ↔ Authority

#### 1. What is the subject of this seam?

The crossing between:

- **Semantic Continuity:** what the user request means, what effect/target is being requested, and what semantic provenance binds that request; and
- **Authority:** whether that requested effect may occur under the applicable principal/actor, scope, consent, standing, delegation, duration, risk and revocation state.

The seam exists precisely to prevent meaning from becoming permission.

#### 2. What does CFA-03 own?

**DERIVED / CURRENT**

CFA-03 owns:

- canonical semantic interpretation of the requested action/effect;
- semantic target and context references;
- semantic constraints;
- interpretation status;
- semantic provenance;
- the translation of interpreted meaning into the request/effect package presented to Authority;
- continuity of meaning after authority results are returned.

CFA-03 does not decide whether the action is permitted.

#### 3. What does CFA-04 / Authority-Governance own?

**OBSERVED / PEER CLAIM / CURRENT**

CFA-04 claims ownership of:

- authorization/permission semantics;
- authority basis, scope, duration and revocation;
- consent, standing and delegation semantics;
- principal/actor semantics at the authority boundary;
- live authorization evaluation;
- authority-specific refusal/escalation semantics;
- the authority-facing seam to mechanical enforcement.

The peer declaration explicitly states that CFA-04 does not own Intent/Plan construction.

This is compatible with the current CFA-03 boundary, but is not yet a reconciled ACTIVE boundary.

#### 4. What semantic information must reach Authority?

At minimum:

- canonical semantic request/effect;
- target references;
- actor/on-behalf context where semantically available;
- relevant scope constraints;
- capability/effect identity where already resolved;
- context necessary to understand the requested effect;
- intent reference and payload binding where the authority path uses them;
- provenance sufficient to explain what semantic request was evaluated;
- explicit ambiguity/unresolved state where authorization cannot safely proceed.

D-411 concretely establishes `intentRef + payloadHash` as an authority-facing citation/evidence binding; the decision states that this citation does not alter policy granularity.

#### 5. What authority information must reach semantic interpretation?

Where needed for continuity, Authority may return:

- allow / refuse / escalate or equivalent authority outcome;
- consent required / standing / delegation requirements;
- scope or condition constraints;
- authority reference/citation;
- revocation or expiry reason;
- retry/re-resolution requirement;
- a user-facing refusal explanation where policy permits.

These are semantic inputs to **representation and next-state handling**, not replacements for the original interpretation.

#### 6. What must never be inferred merely from interpretation?

Never infer:

- permission;
- consent;
- standing;
- delegation;
- authority scope;
- revocation state;
- principal authorization.

A perfectly deterministic interpretation can still be refused.

#### 7. What must never be inferred merely from confidence?

Never infer authority from confidence.

Likewise:

`confidence ≠ proof`

and

`confidence ≠ authority`

A high-confidence interpretation can be semantically wrong, stale, ambiguous at another layer, or unauthorized.

#### 8. Where does grounding stop and authorization begin?

**Derived boundary**

Grounding stops when the system has established the best supported semantic reference(s) and contextual interpretation needed to describe the requested effect.

Authorization begins when the question changes from:

> **What is this request/effect, and what does it refer to?**

to:

> **May this effect be caused under the applicable authority right now?**

The exact live execution gate remains an Authority/Runtime responsibility. CFA-03 only preserves the semantic distinction.

#### 9. How does a semantic interpretation remain meaningful without becoming permission?

Keep the semantic artifact immutable with respect to meaning.

A semantic request may remain:

`UNDERSTOOD / canonical`

while an independent authority dimension returns:

`ALLOWED | REFUSED | ESCALATE`

The authority result is a related state, not a rewrite of what the user meant.

D-411's interpretation summary and four-state resolution rows provide current evidence for this separation.

#### 10. What authority state must remain orthogonal to semantic state?

At minimum:

- interpretation status;
- confidence;
- grounding status;
- ambiguity/conflict;
- authority result;
- consent state;
- execution state;
- evidence state.

None should be encoded by silently changing another.

For example:

`REFUSED ≠ ambiguous`

`REFUSED ≠ failed execution`

`AUTHORIZED ≠ executed`

`EXECUTED ≠ semantically correct`

`representation ≠ authority`

#### 11. What evidence/provenance must connect the interpreted request to an authorization decision?

At minimum:

- the Intent reference when an Intent exists;
- the real payload hash where the D-411 seam is used;
- semantic target/effect references sufficient to reconstruct the evaluated request;
- authority decision/citation;
- relevant consent/standing/delegation references where applicable;
- eventual execution/evidence links.

D-411 specifically establishes the law-facing `{intentRef, payloadHash}` citation as an evidence binding rather than a new policy rule.

#### 12. What would falsify the boundary?

The boundary would be falsified if:

1. a ratified architecture makes interpretation itself sufficient to grant permission;
2. a semantic confidence score is an authority input that determines permission without an independent authority rule;
3. a representation is accepted as permission without an authority decision;
4. an Intent artifact is itself the source of permission;
5. CFA-03 must own authority policy to preserve semantic continuity.

#### 13. What remains unknown?

- Exact canonical authority-reference shape exposed to the semantic layer.
- Exact treatment of authority constraints that alter semantic presentation versus execution gating.
- Whether all authority failures should become semantic resolution rows or remain separate lifecycle records.
- Exact multi-step authority propagation from Intent to Work.
- How live revocation/expiry should be represented in user-facing semantic continuity without mutating historical interpretation.

#### 14. What appears to overlap?

- **Effect:** semantic effect description versus authority evaluation of the same effect.
- **Scope:** semantic target/context constraints versus authority scope.
- **Actor/principal:** identity referenced semantically versus authority identity.
- **Risk:** semantic interpretation may carry effect/risk metadata while Authority evaluates policy implications.
- **Consent:** user-facing request semantics may describe approval, while Authority owns whether consent is actually valid.

Current assessment: **shared subjects do not establish shared ownership**. The seam requires typed handoffs.

---

### Seam 3 — Semantic ↔ Work

#### 1. What is the subject of this seam?

The crossing between:

- **Semantic Continuity:** what was requested and canonically understood; and
- **Work / Execution:** the durable responsibility that acts on that meaning, tracks lifecycle, records execution outcomes, retries/resumes, and accumulates evidence.

The core distinction is:

`Intent = what was requested / canonically understood`

`Work = durable execution responsibility and lifecycle`

`Execution = what actually happened`

`Evidence = what establishes what actually happened`

#### 2. What does CFA-03 own?

**DERIVED / CURRENT**

CFA-03 owns:

- the semantic meaning carried into Work;
- semantic identity/provenance references required for continuity;
- distinction among Intent, Plan, Work, Execution and Evidence;
- preservation of original intent meaning when execution becomes partial, paused, failed or cancelled;
- translation of execution outcomes back into semantic representation without rewriting the original request.

CFA-03 does not own the Work object implementation or lifecycle.

#### 3. What does Work/Execution own?

**DERIVED / PEER RESPONSIBILITY**

Work/Execution owns:

- durable Work identity and lifecycle;
- step/attempt execution;
- scheduling/waiting/recovery;
- execution outcome;
- partial completion;
- retry/resume behavior;
- actual realization;
- execution evidence generation/association.

The destination reconciliation explicitly describes Work as a first-class durable object and separately names the Work object, Work decomposition, background continuity and failure semantics as current destination gaps rather than completed runtime contracts.

#### 4. When does semantic interpretation become Intent?

**OBSERVED / CURRENT**

D-411 provides a concrete canonical-intent seam:

- deterministic interpretation is retained rather than discarded;
- `intent.submit@1` persists an Intent artifact;
- the Intent row carries an interpretation summary;
- `intent.resolution@1` records AMBIGUOUS / REFUSED / EXECUTED resolution rows;
- law citations can refer to the canonical Intent using `intentRef` and `payloadHash`.

Thus, for the current path, interpretation becomes **Intent-level canonical meaning when it crosses the canonical Intent persistence contract**.

The exact destination-grade boundary for multi-step Plans and durable Work remains **UNKNOWN**.

#### 5. What is the distinction between Intent and Work?

Intent answers:

> **What outcome/request was asked for and canonically understood?**

Work answers:

> **What durable execution responsibility is entrusted with carrying that request through lifecycle and realization?**

A Work record may reference an Intent.

Work does not become the source of the Intent's meaning.

#### 6. What semantic information must survive into Work?

At minimum:

- Intent reference;
- canonical semantic meaning;
- target references;
- relevant Plan reference or decomposition identity;
- context snapshot/reference where required for reproducibility;
- selected capability/effect requirements;
- realization-selection information where semantically consequential;
- authority citation/reference needed for re-check;
- provenance/evidence references;
- user-visible constraints/preferences that are semantically part of the requested outcome.

Huge payload duplication is not required when durable references can preserve the basis.

#### 7. What execution information must return to semantic representation?

At minimum:

- Work/attempt identity;
- current execution state;
- actual outcome;
- resolution status;
- refusal/failure reason where meaningful;
- partial completion information;
- cancellation boundary;
- evidence references;
- realization/provider result references where relevant;
- current authority result if it changes subsequent handling.

This information enriches the representation of **what happened**. It must not silently rewrite **what was requested**.

#### 8. How should semantic identity/provenance survive multi-step execution?

Use explicit cross-references:

`semantic meaning → Intent → Plan/Work → Step/Attempt → Evidence`

The chain should preserve enough links to answer:

- which Intent produced this Work;
- which Work produced this attempt;
- which attempt produced this evidence;
- which semantic request the final result refers back to.

This is a continuity requirement, not a claim that CFA-03 owns the record schemas of each layer.

#### 9. How should partial completion be represented without rewriting the original meaning?

Keep the original semantic artifact stable.

Represent:

- the original Intent;
- the current Plan/Work state;
- committed/completed portions;
- pending/unattempted portions;
- evidence;
- next-step/recovery requirements.

Example distinction:

`Intent: "send the Project X update"`

can remain unchanged while Work records:

`PARTIALLY_COMPLETED`

because one child action succeeded and another remains pending.

The partial outcome describes execution history; it does not redefine the original request.

#### 10. How should `PAUSED_AT_GATE`, `PARTIALLY_COMPLETED`, `FAILED`, and `CANCELLED` remain distinct from interpretation state?

They are **execution/lifecycle states**, not interpretation states.

In particular:

- `PAUSED_AT_GATE` means execution is waiting on a required gate; it does not mean the request is ambiguous.
- `PARTIALLY_COMPLETED` means some execution effects occurred and the Work remains non-terminal or reviewable; it does not mean the Intent was only partially understood.
- `FAILED` means execution failed under its defined lifecycle semantics; it does not mean the original interpretation was invalid.
- `CANCELLED` means execution was terminated/cancelled; it does not mean the original request disappeared.
- An authority refusal is not the same thing as an execution failure.

The repository's current agent role explicitly preserves these execution states as orthogonal to interpretation semantics.

#### 11. What must never cause execution state to be mistaken for semantic interpretation?

Never infer:

- semantic ambiguity from execution failure;
- semantic correctness from execution success;
- semantic invalidity from cancellation;
- permission from Work existence;
- intent change from partial completion;
- evidence completeness from UI completion state.

Execution is evidence about what happened, not a replacement for what was meant.

#### 12. What evidence/provenance must survive the seam?

At minimum:

- Intent reference;
- payload/semantic hash where the canonical-intent seam requires it;
- Plan/Work reference where created;
- Step/Attempt reference where available;
- execution result/evidence references;
- reason/refusal/consent references when relevant;
- source references needed to reconstruct the semantic target;
- representation provenance if the final user-facing projection is generated from execution evidence.

D-411 proves the earliest part of this chain in the current system; the durable Work portion is not fully closed.

#### 13. What would falsify the boundary?

The boundary would be falsified if:

1. Work becomes the canonical source of user-request meaning;
2. execution state is intentionally defined as the semantic interpretation state;
3. Work can safely execute without preserving the canonical semantic request;
4. a ratified architecture assigns Intent/semantic meaning to CFA-05 rather than CFA-03;
5. the only way to preserve semantic continuity is to collapse Intent and Work into one entity.

#### 14. What remains unknown?

- Exact current production shape of multi-step command compilation into Plan and Work.
- Exact durable Work envelope carrying Intent, context, authority and evidence.
- Exact Work/Attempt identity fields and cross-reference contract.
- Exact retry/resume continuity semantics after semantic or authority changes.
- Exact mapping of the older PlanExecutionState states into current destination Work.
- Whether some execution outcomes should be materialized as semantic resolution rows versus Work/evidence records.
- Exact user-facing continuity model for background Work completion.

#### 15. What appears to overlap?

- **Plan:** semantic decomposition versus execution-oriented decomposition.
- **Context:** semantic grounding context versus Work's execution context snapshot/reference.
- **Evidence:** semantic provenance versus execution evidence.
- **Result:** semantic resolution versus actual execution outcome.
- **Identity:** Intent identity versus Work identity and attempt identity.
- **Status:** interpretation status versus Work/execution state.

Current assessment: these are **cross-plane correspondences**, not proof of duplicate ownership.

## Handoff Proposals

The following are intentionally bounded proposals, not active contracts.

| ID | Source | Target | Subject | Proposed handoff | Status |
|---|---|---|---|---|---|
| H-03-01 | CFA-01 / World | CFA-03 | Grounding input | World subject meaning + addressability/correspondence + ambiguity/conflict/basis information sufficient to resolve a semantic reference | PROPOSED |
| H-03-02 | CFA-03 | CFA-01 / World | Grounded semantic reference | Target-reference request + semantic constraints + provenance needed to retrieve/verify the intended World subject without redefining World meaning | PROPOSED |
| H-03-03 | CFA-03 | CFA-04 / Authority | Canonical semantic request | Canonical Intent/effect description + target/reference + relevant constraints + `intentRef/payloadHash` citation when applicable | PROPOSED / partly OBSERVED through D-411 |
| H-03-04 | CFA-04 | CFA-03 | Authority result | Allow/refuse/escalate + authority citation/constraints + consent/standing/delegation/recheck information required for semantic continuity | PROPOSED |
| H-03-05 | CFA-03 | CFA-05 / Work | Canonical semantic package | Intent reference + canonical meaning + target/context references + Plan/decomposition reference where present + authority/effect references needed for durable Work | PROPOSED |
| H-03-06 | CFA-05 / Work | CFA-03 | Execution continuity result | Work/attempt identity + execution state/outcome + evidence/refusal/failure/partial-completion/cancellation references needed to represent what happened without changing what was requested | PROPOSED |
| H-03-07 | CFA-03 | Surface/Representation owner | Semantic projection | Canonical semantic meaning + execution/evidence state + provenance needed for a truthful human/agent-facing representation | PROPOSED |
| H-03-08 | Surface/Representation owner | CFA-03 | Semantic edit/write-back | Permitted semantic edit expressed against the canonical semantic model, with enough identity/provenance to reject representation-only meaning forks | PROPOSED |

**Handoff rule**

A handoff transfers information or a bounded work request across a seam. It does not transfer ownership or authority.

## Boundary Hazards

### Responsibility overlap

1. **Meaning vs continuity of meaning**
   - CFA-01 owns World-domain meaning.
   - CFA-03 owns continuity of meaning across transformations.
   - The term "meaning" can make these look identical when they are not.

2. **Identity**
   - World semantic identity/correspondence;
   - record identity;
   - Intent identity;
   - Work identity;
   - Evidence identity;
   - representation identity.
   
   Collapsing these would create false continuity.

3. **Context**
   - World Context semantics;
   - grounding context;
   - execution context;
   - representation context.
   
   The same word may refer to different semantic dimensions.

4. **Evidence**
   - evidence used to ground a command;
   - evidence used to prove an execution outcome;
   - evidence/citation binding used by Authority.
   
   Shared evidence does not imply shared authority.

5. **Result / status**
   - interpretation result;
   - authority result;
   - Work outcome;
   - evidence verification.
   
   A generic "status" field would be especially dangerous.

### Missing responsibility

**DERIVED / CURRENT**

The repository does not yet establish one complete, durable cross-plane contract for:

`grounded reference → canonical semantic reference → Intent → multi-step Plan → durable Work → evidence`

The seam is described more strongly than the destination-grade implementation is proven.

Other missing or incomplete areas:

- exact grounded-reference contract;
- exact authority citation shape exposed beyond D-411;
- exact Intent-to-Work package;
- complete Work/Attempt identity propagation;
- complete semantic continuity for retries/resumes;
- full freshness propagation from self-knowledge into interpretation.

### Semantic authority confusion

High-risk substitutions include:

- WorldModel treated as World ontology;
- self-knowledge treated as authority;
- parser confidence treated as proof;
- Intent treated as permission;
- representation treated as canonical truth;
- Work status treated as semantic status;
- execution success treated as semantic correctness.

### Grounding / authorization confusion

The high-risk ambiguity is the phrase "can access."

A system may:

- know a subject exists;
- resolve a subject;
- be allowed to view it;
- be allowed to act on it;
- be allowed to cause a particular effect.

These are distinct questions.

CFA-03 should preserve the distinction without deciding Authority semantics.

### Evidence / representation confusion

A visible representation can display:

- evidence;
- an authority result;
- an execution outcome.

It must not thereby become the authority, evidence source, or canonical semantic source itself.

### Intent / Work confusion

The destination reconciliation explicitly calls the Work object the largest missing bridge.

This creates pressure to overload Work with semantic meaning because it is the durable object. The boundary should resist that collapse:

`Intent meaning ≠ Work lifecycle`

### Implementation leakage

Examples of implementation details that must not silently become semantic contracts:

- current NCLL package/module names;
- current `vivim.mind` field shapes;
- current law plugin internals;
- current vault namespace layout;
- current browser/provider realization details;
- current UI representations.

They are evidence for boundaries, not automatically the definitions of those boundaries.

### Stale self-knowledge

The self-knowledge research identifies a specific current weakness:

- existing `WorldModel.v` and `t` do not provide a complete basis;
- source revisions/dependency identities are not fully retained in the current model;
- a persisted freshness flag cannot be trusted as proof.

Therefore semantic interpretation based on self-knowledge must eventually distinguish the semantic state from the freshness state of the evidence it consumed.

### Terminology collisions

High-risk terms:

- meaning;
- context;
- grounding;
- reference;
- interpretation;
- semantic;
- canonical;
- compiler;
- plan;
- intent;
- work;
- result;
- evidence;
- authority;
- permission;
- confidence;
- proof;
- freshness;
- identity.

### Hidden second semantic models

The main hazard is allowing:

- WorldModel;
- Intent IR;
- Work payloads;
- VisualSpec;
- UI state;
- provider-specific command objects

to drift into independently authoritative semantic models.

They may be projections or specialized contracts, but they should not silently acquire a second meaning for the same user request.

### V1 / V2 divergence

**OBSERVED / CURRENT**

V1 remains viable through text/NCLL/Intent without requiring visual compilation.

The repository's identity files establish the intended invariant:

> V1 command interaction remains viable without the visual compiler; V2 visual/symbolic projection and editing converge on the same canonical semantic model used by V1.

Any future visual/write-back path must therefore project and edit canonical semantic meaning rather than become a second execution meaning.

### Visual representation becoming canonical truth

A diagram, glyph, VisualSpec or UI label may be a faithful projection.

It is not canonical merely because a human can see it.

### Semantic interpretation becoming execution authority

Interpretation may identify what should happen.

It must not itself cause the effect merely because the interpretation is confident or deterministic.

## Unresolved Questions for Peers

### CFA-01 / World

1. **Grounded reference contract:** What exact World-side reference/result should CFA-03 receive for resolved, ambiguous, stale and unresolvable targets?
2. **Meaning split:** When a command term is grounded to a World subject, which precise part is World meaning and which precise part is command meaning?
3. **Identity continuity:** Which World identity/correspondence token is stable enough to survive Intent → Work → Evidence without becoming a duplicate semantic identity system?
4. **Context:** Which Context semantics are World-owned, and which are merely interpretation inputs?
5. **Freshness:** Which World/self-knowledge freshness signals must invalidate or constrain semantic interpretation?

### CFA-04 / Authority

1. **Authority-facing package:** What minimum canonical semantic package must Authority receive before it can decide permission?
2. **Citation:** Is `intentRef + payloadHash` the minimum authority-facing semantic citation, or is another reference contract required for destination Work?
3. **Result contract:** Which Authority result states must be represented as semantic resolution, and which remain purely authority/execution state?
4. **Live re-check:** How should semantic continuity represent authority expiry/revocation without rewriting historical Intent meaning?
5. **Visibility vs permission:** Which authority-derived visibility constraints may reach semantic interpretation without making the semantic layer an authority evaluator?

### CFA-05 / Work

1. **Intent → Work bridge:** What exact semantic package is persisted when an Intent becomes durable Work?
2. **Identity:** What stable references link Intent, Plan, Work, Step/Attempt and Evidence?
3. **Partial execution:** Which fields/state represent partial completion versus semantic incompleteness?
4. **Retry/resume:** How are semantic meaning and provenance preserved across retry/resume after provider or authority changes?
5. **Outcome:** Which execution outcomes should be returned to CFA-03 for semantic representation, and which remain execution-only details?

### Cross-CFA

1. What is the smallest stable vocabulary for **reference, target, context, effect, intentRef, workRef, evidenceRef, authorityRef, freshness and provenance**?
2. Which references are immutable historical citations and which are live-resolved references?
3. Which semantic transitions are deterministic transformations versus projections versus authority outcomes?
4. Where is the exact seam at which an interpretation becomes canonical Intent meaning?
5. Which unresolved overlaps require owner/ratification decisions rather than CFA-local terminology choices?
6. How should a future visual edit cite the same canonical semantic identity without creating a second interpretation path?

## Non-Authority Statement

CFA-03 does **not** decide:

- what World objects/entities are or what their ontology means;
- canonical data/storage identity or persistence mechanics;
- whether an actor is authorized;
- consent, standing, delegation, scope, risk policy or revocation policy;
- Work lifecycle, scheduling, retry policy or execution semantics;
- provider/account/session/routing realization semantics;
- runtime constitutional law or K0 enforcement;
- the general architecture graph;
- the universal evidence/provenance system;
- product UI or surface implementation;
- whether a peer's ownership claim is ultimately ratified;
- whether a historical term should be mechanically renamed across the repository.

CFA-03 may challenge a semantic boundary, propose a bounded contract, identify a contradiction, and request peer evidence. It does not become the authority merely because it stewards continuity.

## Evidence Index

| Source | Use | State / freshness |
|---|---|---|
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/BOUNDARY-PROTOCOL.md` | Shared epistemic states, multidimensional ownership, handoff and boundary challenge rules | OBSERVED / CURRENT |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/ROUND-1-CFA-MATRIX.md` | CFA-03 assigned seams and asymmetric Round-1 method | OBSERVED / CURRENT |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/CORE-AGENT-IDENTITY.md` | Ratified CFA-03 identity, authority boundary, core semantic distinctions | OBSERVED / CURRENT |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/STATE.md` | Current CFA-03 mission and confirmed foundation state | OBSERVED / CURRENT |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/CANON-DICTIONARY.md` | Existing terminology and explicit semantic non-equivalences | OBSERVED / CURRENT |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/AGENT.md` | Operational identity, semantic chain, execution-state separation and V1/V2 invariant | OBSERVED / CURRENT |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/BOUNDARY-ROUND-1-DECLARATION-2026-09-26.md` | Peer World-side claim at Semantic↔World and World↔Authority seams | PEER CLAIM / CURRENT |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/BOUNDARY-ROUND-1-DECLARATION-2026-09-26.md` | Peer Authority-side claim and explicit non-equivalences | PEER CLAIM / CURRENT |
| `omega-baseline/omega-final/docs/decisions/D-411-intent-seam.md` | Ratified canonical-intent persistence, interpretation summary, four-state resolution, law citation and live path | RATIFIED / CURRENT |
| `omega-baseline/omega-final/docs/BUILD-DECISIONS.md` | D-215/D-216 current self-knowledge/NCLL foundation and D-411 context | RATIFIED / CURRENT |
| `omega-baseline/omega-final/plugins/vivim-mind/plugin.json` | Current read-only derived `vivim.mind` contract and evidence sources | OBSERVED / CURRENT |
| `docs/destination/self-knowledge-core/RESEARCH.md` | Derived-view basis/freshness research and explicit current basis limitation | DERIVED / CURRENT |
| `docs/destination/self-knowledge-core/STATE.md` | Converged self-knowledge freshness model | DERIVED / CURRENT |
| `docs/destination/system-intelligence/pass-3/SELF-KNOWLEDGE-DESIGN.md` | Candidate freshness and authority separation | DERIVED / CURRENT |
| `docs/destination/INTERACTION-INTENT-WORK-RECONCILIATION.md` | Destination interaction → Intent → Context → Capability → Authority → Work → Execution → Evidence spine; Work gap | DERIVED / CURRENT |
| `docs/destination/architecture/research/JOURNEY-ARCHITECTURE-MAPPING.md` | Existing Work responsibility chain and execution/evidence continuity mapping | DERIVED / CURRENT |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/CANONICAL-MODEL.md` | Multidimensional ownership and canonical relationship discipline | OBSERVED / CURRENT |

## Current Boundary Summary

CFA-03's Round-1 claim is:

> **Semantic Continuity Stewardship means preserving one inspectable meaning across independently owned transformations — grounding, interpretation, canonical Intent/Plan, Work-facing semantics, execution meaning, evidence and representation — without taking ownership of World ontology, authority, durable Work, or runtime realization.**

The three seam claims are:

### Semantic ↔ World

`World meaning` and `semantic continuity` are complementary dimensions.

- World determines what the referenced subject means.
- CFA-03 determines how that meaning remains coherent while translated into command semantics and onward artifacts.
- Grounding connects the two.
- Neither side becomes authority merely by grounding or interpreting.

### Semantic ↔ Authority

`Grounding ≠ Authorization`

`Interpretation ≠ Permission`

`Confidence ≠ Authority`

`Representation ≠ Authority`

- CFA-03 sends Authority a canonical semantic request.
- CFA-04 decides whether that effect is permitted.
- The authority result returns as an orthogonal state/citation; it does not rewrite the original semantic meaning.

### Semantic ↔ Work

`Intent = requested/canonically understood meaning`

`Work = durable execution responsibility/lifecycle`

`Execution = what actually happened`

`Evidence = what establishes what actually happened`

- D-411 proves the current canonical-intent seam exists in the Ω path.
- The destination Work bridge remains incomplete.
- The boundary requirement is to preserve semantic identity/provenance into Work and bring execution outcomes back without turning execution state into interpretation state.

No boundary in this declaration is declared ACTIVE. Cross-CFA reconciliation remains the Architecture Steward's next step.
