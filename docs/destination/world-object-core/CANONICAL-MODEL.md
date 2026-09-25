
# Canonical World/Object Model

> Classification: DERIVED — DESIGN-CANDIDATE
> Status: smallest semantic model proposed by this research.

## 1. Canonical object

A canonical object has:

~~~text
Object
  ref                 = (ns,id) logical identity
  revision            = rev
  kind                = semantic type identifier
  schemaVersion       = payload schema version
  ownerScope?         = local ownership/visibility scope
  lifecycle           = semantic state
  origin              = local | imported | synchronized | generated
  sourceIdentities[]  = external identities, when applicable
  content             = typed semantic payload or content reference
  createdAt
  updatedAt
~~~

The current vault envelope may continue carrying caller metadata and structural provenance refs. Those refs are not domain relationships.

The payload remains type-specific. There is no universal semantic inheritance tree.

## 2. Identity

Logical identity is (ns,id).

Exact revision identity is (ns,id,rev).

Content identity is cid.

Source identity is a structured external key, conceptually:

~~~text
(sourceAuthority, sourceRealm, sourceAccountScope?, externalId)
~~~

A source identity is not the canonical local id.

## 3. Object kind

kind answers only what semantic object family this payload belongs to.

Examples: conversation, message, document, file, project, person, account, repository, task, agent, space, memory, forecast-pin.

A new kind should be admitted by a typed schema/contract, not by adding a storage engine.

## 4. Lifecycle

The world/object lifecycle is semantically:

~~~text
active
archived
deleted
~~~

Additional state axes such as source availability, verification or provider realization status must not be overloaded into this lifecycle.

Archived means intentionally omitted from ordinary active-world views while identity remains.
Deleted means a semantic tombstone; identity and history remain.
Active means available to ordinary world queries.

Hard physical removal is a storage/retention concern, not the meaning of deletion.

## 5. Artifact

Artifact is a role, not a universal superclass.

A produced object is an artifact when a Work or other authorized process establishes a relation such as:

~~~text
object --[produced-by]--> work
~~~

The same physical canonical object may therefore be a document, file, report, package, image or other kind while also serving as a Work artifact.

## 6. Revision

A revision is already represented by the vault tuple (ns,id,rev) plus changelog evidence.

Do not create a second Revision table for product semantics unless an experiment shows metadata that cannot live in the revision payload/changelog.

## 7. Canonical vs derived

Canonical:
- identity;
- kind;
- typed payload;
- source identities;
- semantic lifecycle;
- canonical relationship records;
- provenance/evidence;
- content references;
- revision history.

Derived:
- latest world membership;
- search index;
- summaries;
- graph layout;
- workspace membership views;
- current-context;
- recommendation/ranking;
- provider-knowledge aggregates.

## 8. Universal-envelope rule

The common envelope may express metadata needed by every object. It must not accumulate the semantics of every domain.

Test: if a proposed universal field exists only so one object family can explain private business rules, it belongs in that family's payload or contract.
