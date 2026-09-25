# CFA-04 — Findings

> Status: PROVISIONAL WORKING LEDGER
> Updated: 2026-09-26
> This ledger records CFA-04 findings; it is not a law registry.

## Recording rule

Only persist findings that are reusable across cases, materially affect a boundary, falsify an assumption, or unblock a real implementation corridor.

Classify each finding:

OBSERVED | DERIVED | PROPOSED | UNKNOWN | CONFLICTED

## Active findings

### F-04-001 — Authority is a cross-domain semantic boundary

State: DERIVED
Basis:
- current CFA-04 bootstrap design;
- Round-1 boundary declaration;
- destination responsibility mapping;
- current Ω invocation/standing/delegation decisions.

Finding:
Authority should be treated as the semantic boundary that determines whether a consequential effect may be caused now, rather than as ownership of one implementation plugin.

Implication:
vivim-law is an important realization/evidence source, but not by itself the definition of CFA-04's enduring scope.

### F-04-002 — Capability does not imply authority

State: DERIVED
Finding:
Technical capability, provider availability, account/session possession, or routing success must not silently become permission.

Implication:
CFA-06 and CFA-04 require an explicit effect/authority handoff.

### F-04-003 — Historical authority is not current authority

State: DERIVED
Finding:
A prior grant, standing, delegation, or cached authorization is evidence of history. Current permission depends on liveness, scope, expiry, revocation and other governing conditions.

Implication:
live re-resolution is an explicit boundary requirement.

### F-04-004 — Evidence does not create authority

State: DERIVED
Finding:
A signed, persisted, acknowledged, or well-proven record can evidence an authority relationship but does not create permission merely by existing.

Implication:
Commons, evidence stores, audit records, and documentation remain outside the authority source unless governed otherwise.

## Open investigations

- exact authority/data record boundary;
- principal semantics shared with CFA-02;
- effect/risk vocabulary shared with CFA-06;
- consent-to-surface handoff with CFA-08;
- minimum authority reference carried by Work with CFA-05;
- authority/change handoff with CFA-09;
- semantic authority contract versus K0 enforcement contract with CFA-10;
- exact evidence required to prove live authorization and runtime enforcement.

## Supersession rule

When a later finding changes an earlier finding:

- preserve the earlier finding;
- cite the new evidence;
- mark the earlier entry SUPERSEDED;
- explain the boundary change;
- notify affected peers when consequential.

Do not rewrite history to make the current view appear continuous.
