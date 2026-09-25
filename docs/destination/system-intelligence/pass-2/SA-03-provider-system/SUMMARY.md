# SA-03-provider-system — Pass 2

## Structural conclusion
5 consequential atoms and 4 new relationships. This is an explicit structural delta over Pass 1.

## Findings
- **SA-030001 — Explicit provider realization lifecycle** — PROVEN. DRAFT→TESTING→PROMOTED, rediscovery, degradation and probation are defined in provider vocabulary.
- **SA-030002 — Evidence-bearing discovery candidates** — PROVEN. Inference derives candidates from an ApplicationGraph, requires evidence and persists them before promotion.
- **SA-030003 — Declarative discovery mapping** — PROVEN. Mapping consumes manifests/blueprints as data and does not import pack code.
- **SA-030004 — Distributed provider knowledge** — REQUIRES-DESIGN. Provider knowledge is spread across manifests, observations, candidates, mappings, parsers and realization rows.
- **SA-030005 — ChatGPT-specific live realization** — PROVIDER-SPECIFIC. Live descriptor validates providerId=chatgpt and the session schema hardcodes browser/chatgpt live metadata.

## Unknowns
- SA-030004: authoritative provider-knowledge query path