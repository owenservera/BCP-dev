# SA-02-data-evolution — Pass 2

## Structural conclusion
5 consequential atoms and 4 new relationships. This is an explicit structural delta over Pass 1.

## Findings
- **SA-020001 — Revision-addressed Ω storage** — PROVEN. Storage is namespace/table/key/revision based and drivers are byte stores; semantic lifecycle belongs above the driver.
- **SA-020002 — Small canonical Ω chat vocabulary** — PROVEN. Conversation and Message are vault records; order is writer-derived and realization is provenance rather than identity.
- **SA-020003 — Browser captures and sessions are separate records** — PROVEN. Capture bytes are redacted and hashed before storage; SessionRecord references the capture and optional live metadata.
- **SA-020004 — Legacy schema embeds provider protocol detail** — LEGACY-ONLY. ProviderAccount, ProviderParser, ProviderCapability and ProviderStreamConfig are first-class relational structures.
- **SA-020005 — No single product-wide data lifecycle contract** — MISSING. Ω has separate chat/provider/intent/vault vocabularies while Legacy has many models; CREATE→RESTORE semantics are not unified.

## Unknowns
- SA-020005: universal lifecycle contract
- SA-020005: deletion/retention policy