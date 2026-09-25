# SA-01-graph-runtime — Pass 2

## Structural conclusion
5 consequential atoms and 4 new relationships. This is an explicit structural delta over Pass 1.

## Findings
- **SA-010001 — Recipe composition grant boundary** — PROVEN. Signed Recipe entries carry manifest/content hashes, grants, contracts, boot phase and config; composition participates directly in runtime authority.
- **SA-010002 — Port protocol runtime seam** — PROVEN. Current Ω plugins invoke neighboring functionality through ctx.port, so imports understate runtime coupling.
- **SA-010003 — Host-mediated runtime state arbitration** — PROVEN. HOST_OPS exposes state acquire/release and graph/audit reads; this is runtime coupling hidden from plugin folders.
- **SA-010004 — Split realization state** — BOUNDARY-CRITICAL. ProviderRealization is latest-state data while discovery promotion events remain audit history; consumers cross two representations.
- **SA-010005 — Configuration creates hidden runtime edges** — IMPLEMENTED-BUT-STRUCTURALLY-WEAK. Discovery mapping loads blueprints from composition config; provider-browser behavior is also configuration-gated.

## Unknowns
- SA-010005: complete configuration-driven registration inventory