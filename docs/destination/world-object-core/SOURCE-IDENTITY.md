# Source Identity, Imports and Identity Collision

> Classification: DERIVED — DESIGN-CANDIDATE

## Source identity

An external system defines its own identity space. VIVIM must preserve at least authority, realm/tenant/account scope, and externalId, with optional source version or locator.

The same external id may exist in distinct source scopes.

## Import

Import should create or update a canonical local object through evidence-backed mapping:

~~~text
external source
  -> observed identity + payload
source evidence
  -> mapping
canonical local object
~~~

The external record remains external. The local object is VIVIM's durable representation.

## Collision

If one source identity maps to multiple canonical objects, do not auto-merge.

Retain candidates, evidence and contested/unresolved status. Any later merge is an explicit governed operation.

## Alias

An alias is a durable identity/address mapping record resolving to a canonical ref. It is not a second canonical object.

## Source disappearance

A vanished source does not delete local canonical data. Retain source identity and record source availability/freshness separately.

## Source replacement

A refresh that appears to describe a different object is blocked or mapped to a new local identity until explicit semantic merge is established.

Status:
- collision refusal: PROMOTION-CANDIDATE after synthetic test;
- real source refresh/disappearance: EXPERIMENT-REQUIRED.
