# Research Charter

Determine the minimum semantics that make VIVIM a persistent personal environment rather than a process.

Investigate:
- Installation vs Product Instance vs Vault vs World vs Composition vs Runtime Session;
- first-run and empty-world semantics;
- identity that survives executable replacement;
- boot/recovery;
- composition recovery;
- durable configuration;
- export/restore;
- secrets/reference-only reconnect metadata;
- migrations and incompatible versions;
- crash boundaries;
- projection/cache separation.

Falsify with process kills during boot/persist, restart, restore, executable replacement, missing plugin/composition, interrupted migration, corrupted projection and empty-world initialization.

Required conclusion: exact durable boundary, restart behavior, recovery rules, export/restore envelope, implementation slices, unresolved decisions.