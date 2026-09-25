# Investigator Protocol

Research read-only first.

Map existing Ω vault/storage/evidence primitives; then map Legacy data behavior.

For each candidate primitive:
- semantic meaning;
- identity;
- owner;
- lifecycle;
- persistence;
- revision;
- evidence/provenance;
- relationships;
- projections;
- export/restore;
- source identity;
- dependencies;
- current implementation;
- gaps.

Run red-team cases:
- duplicate imports;
- conflicting relationships;
- stale projection;
- archive + restore;
- source disappears;
- content changes;
- export/import collision;
- object created by Work;
- object referenced by Work;
- object referenced by evidence.

Never promote ORM structure into semantic authority.
