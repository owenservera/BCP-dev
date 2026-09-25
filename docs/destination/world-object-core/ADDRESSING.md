
# Addressing, Lookup and Resolution

> Classification: DERIVED — DESIGN-CANDIDATE

## 1. Canonical address forms

### Exact revision
~~~text
(ns,id,rev)
~~~

### Logical current object
~~~text
(ns,id)
~~~

### Alias
~~~text
alias:<scope>/<name>
~~~

### Source identity
~~~text
source:<authority>/<realm>/<externalId>
~~~

The last two resolve through identity mappings rather than replacing canonical identity.

## 2. Address is not search

Search produces candidates.

Addressing resolves a known identity.

Therefore:
- FTS/semantic retrieval can suggest an object;
- alias resolution can map an alternate identifier;
- source identity mapping can expose a canonical candidate;
- final execution still references canonical (ns,id[,rev]).

## 3. Human routes

The user-facing address grammar can layer project names, conversation names, file paths, natural language and surface routes.

Those should resolve to canonical refs through deterministic grounding.

## 4. Ambiguity

If multiple canonical objects satisfy an address, resolution should remain ambiguous rather than silently selecting one unless an explicit ranking/authority rule permits that choice.

## 5. Historical addressing

Exact revisions remain directly addressable for inspection, evidence, replay and export.

Status:
- canonical addressing: EVIDENCE-SUPPORTED;
- human-friendly resolution grammar: PROMOTION-CANDIDATE subject to existing language/grounding work.
