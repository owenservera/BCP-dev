# CFA-04 — Peer Relationship Atlas

> Status: PROVISIONAL / OPERATIONAL CONTEXT
> Updated: 2026-09-26

This is a working supplier/customer and boundary map. It is not a hierarchy.

## 1. Peer matrix

| Peer | CFA-04 receives | CFA-04 provides | Main boundary |
|---|---|---|---|
| CFA-01 World | world entities, relationships, context | authority implications for world objects | meaning of a thing ≠ authority over it |
| CFA-02 Data | principal/object identity, durable refs, persistence facts | authority meaning over durable records | data record ≠ permission |
| CFA-03 Semantic Continuity | identity/meaning continuity across change | authority continuity or re-resolution implications | continuity ≠ continuing authorization |
| CFA-05 Agency/Work | actor, intent, work, invocation | authorization basis for consequential work | work ≠ authority |
| CFA-06 Capability/Provider | capability, realization, possible effects | authorized exercise | capability ≠ authority |
| CFA-07 Composition/Forge | composition, install, promotion, change context | authorization boundary around consequential composition | creation ≠ authority |
| CFA-08 Experience/Surfaces | interaction and consent presentation | canonical consent/authority semantics | UI state ≠ authority |
| CFA-09 Evolution | proposed change, compatibility, adaptation context | who may authorize consequential change | evolution mechanics ≠ authority |
| CFA-10 Runtime | K0 enforcement mechanics and observations | semantic authority contract | enforcement ≠ semantic ownership |
| Architecture Steward | architecture reconciliation and boundary context | authority findings and ownership evidence | Steward ≠ authority source |

## 2. Closest operational customers

CFA-05:
- needs authority before consequential work and when continuing work crosses consequential boundaries.

CFA-10:
- needs semantic authority contracts that K0 can enforce mechanically.

CFA-06:
- needs the technical capability / authorized exercise distinction.

CFA-09:
- needs authorization semantics for consequential change, migration, adaptation, and self-maintenance.

## 3. Closest operational suppliers

CFA-02:
- stable identity and durable references.

CFA-01:
- world meaning and target/resource context.

CFA-03:
- continuity and equivalence evidence.

CFA-05:
- actor, intent, work, invocation.

CFA-06:
- capability and realization facts.

CFA-09:
- change and compatibility context.

CFA-10:
- runtime enforcement seams and observations.

## 4. Bilateral corridors

Intent → Authority → Work
- CFA-05 → CFA-04 → CFA-05
- Question: Does this requested or entrusted work have authority to cause the effect?

Capability → Authority → Runtime
- CFA-06 → CFA-04 → CFA-10
- Question: Technical capability exists; is exercise authorized and enforced?

Principal → Authority → Data
- CFA-02 → CFA-04 → CFA-02
- Question: Which principal relationship authorizes access/change to the durable object?

Change → Authority → Evolution
- CFA-09 → CFA-04 → CFA-09
- Question: Who may authorize the consequential change?

Surface consent → Authority
- CFA-08 → CFA-04
- Question: Does the interaction actually constitute governed consent?

Semantic continuity → Authority continuity
- CFA-03 → CFA-04
- Question: Does continuity preserve the object without silently preserving or expanding authority?

## 5. Identity boundary

Keep distinct:
- principal identity;
- canonical object identity;
- capability identity;
- authority relationship identity;
- delegation/standing identity;
- invocation identity;
- evidence identity;
- provider/session identity.

A stable identity does not imply stable authority.

## 6. Change boundary

CFA-09 may preserve semantic continuity while authority still requires re-resolution.

Examples:
- provider replacement;
- principal retirement;
- capability meaning change;
- resource replacement;
- law/policy change;
- delegation change.

## 7. Escalation

Escalate to Architecture Steward when:
- peer boundaries conflict materially;
- a second authority store or engine is proposed;
- current contracts disagree on authority ownership.

Escalate to Owner when:
- owner intent is required to determine legitimate control;
- the issue changes the owner's sovereignty/control model.

## 8. Communication priority

P0:
- continuity/authorization boundary threat.

P1:
- cross-CFA ambiguity affecting a consequential corridor.

P2:
- useful discovery or contract clarification.

P3:
- local implementation detail.

## 9. Relationship lifecycle

RECOGNIZE
→ TRACE
→ CONTRAST
→ HANDOFF
→ PROVE
→ MONITOR

Do not generalize a universal contract before a real corridor demonstrates the need.
