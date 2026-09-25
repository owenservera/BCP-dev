# Documentation Depth Model

> This depth model is about **resolution of architectural description**.
> It must not be confused with BCP build depth or destination maturity.

## Depths

### D0 — Frame

Why does this area exist? What question/product outcome is being discussed?

### D1 — System

What major system/domain/subsystem is involved?

### D2 — Responsibility

What distinct responsibilities exist? What owns each one?

### D3 — Boundary

Where are the interfaces, contracts, authority seams, ownership cuts, and replaceable boundaries?

### D4 — Mechanism / Realization

What concrete generic mechanisms and implementations realize the responsibility?

### D5 — Dependency / Integration

What depends on what? What cross-system joins, journeys, evidence and lifecycle consequences exist?

### D6 — Product / Operational Reality

How does the architecture become a real user/product lifecycle: startup, continuity, external reality, failure, recovery, update, exit and evolution?

## Creating a new depth

A new depth may be introduced only when:

1. an existing depth cannot express a recurring distinction without overload;
2. at least two real artifacts require the distinction;
3. the new depth has a defined semantic question;
4. it has clear parent/child mapping rules;
5. existing views can be migrated without losing information;
6. the change is recorded in the Steward state/change log.

Do not create depths for decorative hierarchy.

## Creating sub-depths

Sub-depths are allowed when resolution inside one depth becomes materially different, for example D3a/D3b.

They must inherit the parent meaning and never become an independent ontology.

## Depth versus maturity

Depth answers:
> “How finely are we describing this?”

Maturity answers:
> “How far along is it?”

They are orthogonal.

## Existing maturity model

Where the destination uses L-1…L6, preserve it as maturity:
L-1 uncharacterized → L0 vision → L1 prototype → higher levels through proven/integrated/productized according to the authoritative destination maturity model.

Where BCP uses L0–L3 build depth, preserve that as BCP state vocabulary.

Never collapse these systems.
