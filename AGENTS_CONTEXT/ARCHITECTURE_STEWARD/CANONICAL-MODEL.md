# Architecture Steward — Canonical Model

## Canonical entities

The Steward models the repository using these primary entity classes:

| Entity | Meaning |
|---|---|
| DOMAIN | broad destination/system area |
| SYSTEM | coherent architectural subsystem |
| RESPONSIBILITY | what must be accomplished/owned |
| BOUNDARY | explicit separation or interface |
| CONTRACT | shared protocol/reference shape |
| MECHANISM | generic means of enforcement or execution |
| IMPLEMENTATION | concrete code/runtime realization |
| CAPABILITY | executable or selectable behavior |
| REALIZATION | concrete path through which a capability acts |
| OBJECT | canonical world/data object |
| WORK | durable execution subject |
| EVIDENCE | source supporting a claim |
| CLAIM | traceable assertion about reality/design |
| DECISION | explicit architectural choice |
| REQUIREMENT | destination or product obligation |
| JOURNEY | user-visible outcome path |
| FRONTIER | important but insufficiently characterized area |
| PLUGIN | replaceable contribution |
| RESOURCE | external/local resource identity |
| VIEW | derived representation of canonical knowledge |
| ARTIFACT | source document/code/test/packet/etc. |
| CHANGE | change/evolution event |
| MILESTONE | bounded research/build/proof state |

## Mandatory relationships

Use typed edges rather than free-form prose whenever a meaningful relationship exists.

Minimum edge vocabulary:

REQUIRES
ENABLES
BLOCKS
IMPLEMENTS
REALIZES
DERIVES_FROM
EVIDENCES
CONTRADICTS
PROJECTS
AUTHORIZES
DEPENDS_ON
CONSUMES
PRODUCES
REPLACES
EVOLVES
OWNS_MEANING
OWNS_DATA
ENFORCES
VALIDATES
PROVES
LOCATED_IN
SUPERSEDES
REFERENCES
UNSCOPES

## Ownership dimensions

Do not collapse ownership into one field.

For a significant entity, distinguish:
- semantic owner;
- canonical data owner;
- runtime owner;
- authority owner;
- evidence owner;
- lifecycle/evolution owner.

## Epistemic dimensions

Every canonical claim should be classified independently by:
- source role;
- epistemic status;
- maturity;
- architecture depth;
- evidence strength;
- freshness;
- authority;
- lifecycle state.

No single status enum should be used to encode all of these.

## Source-of-truth rule

Canonical views are derived.

They are not substitutes for:
- ratified Ω law;
- code/tests;
- BCP controlled state;
- source evidence.

The Steward's model is the map of those authorities, not the authority itself.
