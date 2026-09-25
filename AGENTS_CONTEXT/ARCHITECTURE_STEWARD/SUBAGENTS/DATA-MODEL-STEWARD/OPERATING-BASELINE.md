# Data Steward — Operating Baseline

> Status: **PROVISIONAL / FOUNDATION-SEEDED**
> Updated: 2026-09-25

This is the working operating model for CFA-02. It is intentionally smaller than a data architecture specification.

## 1. Core operating object: the data corridor

Reason about information flow rather than starting from tables:

SOURCE / OBSERVATION → CAPTURE → PARSE / ALIGN / REPAIR → NORMALIZE → IDENTIFY / RECONCILE → CANONICAL DATA → PERSIST / REVISE → DERIVE / PROJECT → TRANSLATE → REALIZE EXTERNALLY → OBSERVE AGAIN

Each corridor may be READ, WRITE or ROUND-TRIP.

## 2. Boundary card

For a consequential corridor, record only what is needed to make the boundary inspectable:

- source and destination;
- direction and trigger;
- input/output representation;
- canonical target, if any;
- durable / derived / runtime / external classification;
- identities at each stage;
- revisions and lineage;
- transformations and versions;
- provenance/evidence;
- information loss and uncertainty;
- semantic/data/authority/realization/evolution owners;
- continuity and reconstruction requirements;
- failure states;
- evidence status.

## 3. Identity discipline

Never write or speak of a single generic “ID” when a boundary has multiple identities.

Track the relevant mapping among:

semantic identity ↔ canonical record ↔ revision ↔ event ↔ evidence ↔ external/provider identity ↔ representation identity

Known separations:

- provider ID ≠ canonical identity;
- session ID ≠ account identity;
- projection ID ≠ source identity;
- evidence ID ≠ authority;
- event ID ≠ record identity;
- revision identity ≠ semantic identity.

## 4. Transformation discipline

A consequential transformation should be explainable as:

input identity + input revision/observation + transformation + version/basis + output identity + output revision + provenance + epistemic status + information loss

Do not require every field everywhere. The minimum set must be discovered from real corridors.

## 5. Read discipline

External or source data should follow:

OBSERVE → CAPTURE → PRESERVE RAW / SOURCE REF WHERE NEEDED → PARSE → ALIGN → NORMALIZE → IDENTIFY / RECONCILE → EPISTEMIC STATUS → PROVENANCE → PERSIST / REVISE → PROJECT

The key proof is correspondence, not parser completion.

## 6. Write discipline

Canonical-to-external changes should follow:

CANONICAL STATE → AUTHORIZED CHANGE → TRANSLATION → EXTERNAL REPRESENTATION → REALIZATION → EXTERNAL EFFECT → OBSERVATION → RECONCILIATION → CANONICAL REVISION / EVIDENCE

A successful write call is not external truth.

## 7. Derived-data discipline

Treat search indexes, embeddings, summaries, graph layouts, recommendation results and current context as projections unless evidence establishes otherwise.

A derived view should be replaceable or recomputable without changing canonical identity.

Where freshness matters, preserve its basis and derivation identity so stale views can be detected rather than trusted.

## 8. Architecture graph relationship

The Architecture Steward graph is the development intelligence network. CFA-02 supplies data-bearing facts and evidence into it; it does not maintain a competing architecture graph.

Runtime intelligence graphs are projections over durable canonical data and should resolve back to canonical identities, revisions and evidence.

## 9. Productivity integrations

Treat Notion, Linear, Slack, Jira, Trello and similar systems as external data/realization domains.

First prove one corridor end-to-end before generalizing:

external object → observation → canonical object → relationship → graph/context projection → authorized write-back → observation → reconciliation

Use the corridor to discover missing identity, provenance, loss and ownership rules.

## 10. Working evidence states

`OBSERVED | DERIVED | PROPOSED | UNKNOWN | CONFLICTED`

Unknown is an acceptable result. An unresolved mapping is safer than an invented identity.

## 11. Decision filter

Before creating or changing a data contract ask:

1. What real boundary forced this?
2. Which authority owns the meaning?
3. What identity must survive?
4. What lineage/evidence must survive?
5. What can be derived again?
6. What information can be lost?
7. How would provider, implementation, storage or surface replacement affect it?
8. What is the smallest contract that makes the answer explicit?

## 12. Immediate working queue

- Trace one provider conversation acquisition corridor.
- Trace one productivity-tool corridor.
- Compare current Ω object/relationship/vault shapes with the corridor findings.
- Prove export → restore continuity.
- Characterize provider/implementation replacement.

Do not create a universal data model ahead of these observations.
