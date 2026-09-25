# WebApp Output Requirements

The autonomous agent is expected to turn the repository into something the owner can actually use and retrieve.

## Required owner-facing views

### 1. Build dashboard
Show:
- current turn;
- active hard problem;
- completed hard problems;
- current product/build state;
- last commit;
- test/build status.

### 2. System map
Show the current implemented spine:
Intent → Capability → Routing → Authority → Work → Realization → Effect → Result → Evidence → World → Surface → Continuity

For each stage show:
- implemented/not implemented;
- proof level;
- relevant source;
- known limitations.

### 3. Problem explorer
For each HP:
- objective;
- status;
- evidence;
- tests;
- changed files;
- architecture;
- package;
- known limitations.

### 4. Evidence/proof view
Clearly distinguish:
- fixture;
- local;
- live;
- restart;
- multi-resource;
- unproven.

Never show “green” as proof of live external behavior when it is only a fixture.

### 5. Artifact/download center
Allow the owner to download:
- repository snapshot;
- build/package artifact;
- each hard-problem ZIP;
- documentation bundles;
- sanitized experiment reports.

### 6. What changed / What next
The owner should immediately see:
- what was solved;
- what changed;
- what became proven;
- what remains uncertain;
- what the next hard problem is.

## Security

The WebApp must never expose:
- cookies;
- provider credentials;
- auth headers;
- browser profile contents;
- secrets;
- private environment variables.

It may expose metadata and sanitized evidence.
