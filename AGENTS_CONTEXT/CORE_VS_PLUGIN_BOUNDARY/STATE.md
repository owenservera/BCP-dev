# State — Core vs Plugin Boundary

Updated: 2026-09-25

Status: **SETUP COMPLETE / RESEARCH NOT STARTED AS A COMPLETE PASS**

## Existing baseline

Current archaeology already supports:

- K0 Ω Core = irreducible trust/runtime boundary;
- K1 contracts = shared plugin-boundary vocabulary;
- System plugins = first-party VIVIM capabilities that remain replaceable;
- Extension plugins = user/third-party capabilities;
- Tooling = development/research/CI machinery outside product runtime.

## Existing proposed criterion

A K0 candidate should demonstrate:
1. plugin-independent necessity;
2. non-bypassable enforcement responsibility;
3. domain neutrality;
4. cross-plugin universality;
5. constitutional stability;
6. minimality;
7. absence of product semantics.

Default classification is **not Core**.

## Research gap

The current classification is a strong synthesis, but not yet a complete audited map of every destination responsibility against every concrete Ω and Legacy implementation.

The dedicated research pass must produce that complete map and identify contradictions, false-Core candidates, missing contracts, and unresolved boundaries.