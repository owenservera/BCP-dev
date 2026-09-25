# System Intelligence — Atom & Edge Schema

> **Classification: DERIVED — PROPOSED · Research schema, not Ω ontology**

This is lightweight research bookkeeping. It does not establish runtime objects or canonical product IDs.

## Atomic finding

Each substantive finding receives a local ID: SI-######.

Example:

~~~yaml
id: SI-004281

subject:
  kind: capability
  name: message.send

claim: >
  Current BCP Ω contains a live ChatGPT browser realization
  for message.send.

status: OBSERVED

lineage:
  - BCP-OMEGA

evidence:
  - source: BCP-dev
    ref: omega-baseline/omega-final/...
    commit: abc123
    location: symbol-or-line-range

product:
  concepts:
    - Capability
  requirements: []
  journeys:
    - J3
  vertical_slices:
    - VS3
  keystones:
    - provider-account-realization-routing

program:
  workstreams:
    - P1-07
    - P1-08
  delivery_tracks:
    - D3
    - D4

depends_on:
  - SI-001122
  - SI-003344

enables:
  - SI-004500

maturity:
  existence: VERIFIED
  product: PARTIAL
  proof: LIVE
  destination: CANDIDATE

unknowns:
  - canonical session lifecycle

conflicts: []
~~~

## Finding status

Use the smallest useful vocabulary:

- UNKNOWN
- HYPOTHESIS
- OBSERVED
- VERIFIED
- CONTRADICTED
- PROPOSED

Status describes the finding/evidence state, not product maturity.

## Maturity

Keep these independent:

- existence — does an implementation/mechanism exist?
- product — does it satisfy intended product behavior?
- proof — how strongly is behavior demonstrated?
- destination — is it currently part of the emerging target model?

Where appropriate, use the existing destination implementation ladder L0–L6.

## Edge model

Edges receive local IDs: SIE-######.

Relationships:

- REQUIRES
- ENABLES
- REALIZES
- INVOKES
- AUTHORIZES
- PERSISTS
- OBSERVES
- REPRESENTS
- GOVERNS
- GATES
- DERIVES
- COMPOSES
- SUPERSEDES
- CONTRADICTS
- VARIANT_OF
- RELATED_TO

Every non-trivial edge needs a reason/evidence reference.

## Source reference

Prefer:

~~~yaml
source:
  lineage: BCP-OMEGA
  repository: owenservera/BCP-dev
  ref: main-or-branch
  commit: full-sha
  path: path/to/file.ts
  location: symbol-or-line-range
  evidence_kind: implementation | test | decision | documentation | transcript | live-run
~~~

For standalone Ω use lineage STANDALONE-OMEGA and repository owenservera/vivim-omega.

## Destination links

Use existing targets:

- destination document path + section;
- journey IDs already present, such as J1;
- vertical slice IDs already present, such as VS3;
- keystone dependency names from DEPENDENCY-GRAPHS-AND-KEYSTONE-SCORECARD.md;
- requirement rows from REQUIREMENT-EVIDENCE-TRACEABILITY.md;
- P1 workstreams;
- delivery tracks D1–D6;
- existing decision IDs such as D-418.

If a useful product concept has no stable identifier, link the document/section and mark it UNSCOPED instead of inventing an ID.

## Contradiction record

~~~yaml
conflict:
  claim_a:
    source: ...
    status: ...
  claim_b:
    source: ...
    status: ...
  question: ...
  governing_authority: null
  resolution: UNRESOLVED
~~~

## Important boundary

SI-* and SIE-* are research bookkeeping only. They do not become Ω object IDs or canonical product ontology without a separate decision/process.
