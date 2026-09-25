# VIVIM Product Instance / Persistence Core — Research & Design

> Classification: DERIVED — RESEARCH / DESIGN
> Status: evidence-backed characterization complete; fresh owner-machine falsifier execution is blocked in this session because a repository-local clone could not be established.
> Scope: Product Instance, persistence boundary, composition activation, world reconstruction, lifecycle, export/restore, executable replacement.
> Exclusions: browser/provider/account semantics, durable Work/agent semantics, full frontend/UI.

## 1. Execution note

The launch prompt requires repository-local falsifiers. GitHub repository contents are readable/writable from this session, but a local clone failed because the execution environment could not resolve github.com. No fresh local test result is claimed.

The research therefore reconciles current repository code/contracts and existing falsifier evidence, and records the exact owner-machine test procedures that remain to be run.

The referenced docs/destination/VIVIM-PRODUCT-INSTANCE-CORE.md is not present on current main. The repository contains only references to that path. It is treated as a missing artifact, not silently substituted.

Current main verified: d57d5bce13925828b98fc86800b4f97dd6dafa6e.

## 2. Central conclusion

The canonical VIVIM Product Instance must not be:

- the running process;
- a browser session;
- a composition/recipe by itself;
- the vault itself;
- a canvas or other surface;
- a second database containing a copy of the world.

It should be the durable identity and lifecycle boundary over one user-owned vault, with small bootstrap/activation metadata and lifecycle evidence.

The core relationship is:

    Product Instance
      -> durable identity + lifecycle + activation references
      -> User-owned Vault
         -> canonical records + revisions + evidence + history
      -> World
         -> deterministic projection over canonical records/relationships
      -> Surfaces / Layout / Caches
      -> Runtime / Processes

The invariant is:

    instance owns continuity
    vault owns durable truth
    composition owns executable capability
    world is a projection
    process is a session

This preserves the Ω one-vault / one-truth discipline and does not invent a parallel storage model.

## 3. Evidence baseline

### Destination

The destination layer says:

- the machine is the durable home of VIVIM;
- durable personal data is user-owned, inspectable, portable and recoverable;
- canvas is a surface over the world, not canonical truth;
- configuration, composition, time, evidence and world are distinct concepts;
- J8 is export -> restore -> reconnect -> reconstruct the working environment.

### System Intelligence

Pass 1 identifies Product Instance <-> Persistence as a high-uncertainty seam.

Pass 2 finds:

- Ω storage is evolution-ready at the driver layer;
- general artifact/document lifecycle is still missing;
- product lifecycle is missing;
- relationships still require design;
- Product Instance persistence and restart continuity remain critical gaps.

Pass 3 reduces the coupled design set to identity/resource relationships, canonical object/lifecycle rules, durable Work, provider knowledge, and self-knowledge freshness. This task deliberately owns only the Product Instance/persistence side.

### Ω vault

D-432 provides the strongest current durability evidence:

- two-phase append with fsynced intent and commit accounting;
- torn-tail quarantine;
- append-only Merkle changelog;
- content-addressed blobs;
- history-preserving compaction;
- dry-run-first schema migration with rollback points;
- chain-preserving namespace export and verified import.

### Ω boot/composition

Current boot verifies:

- recipe signature;
- root-of-trust match;
- composition invariants;
- manifest signature;
- content hash;
- routing table consistency.

Entries are booted by phase, with later phases dormant/lazy.

Important finding: bootWithRecovery verifies an incoming recipe and then pins it before bootComposition returns. Therefore:

    verified candidate != activated composition

A later boot/init failure can occur after the new recipe has become pinned. The Product Instance boundary needs an activation transaction that preserves the previous active composition until successful readiness.

## 4. Canonical Product Instance

### 4.1 Identity

Create exactly one immutable Product Instance genesis for each durable instance root.

Conceptual record:

    kind: vivim.product-instance
    schemaVersion: 1
    instanceId: opaque stable id
    createdAt
    vaultFormat: 1

The exact ID encoding is implementation detail. The important properties are stable, non-reused, portable and independent of process identity.

### 4.2 Identity is not the root-of-trust key

The current root key signs recipes/manifests and authenticates the composition.

It should not become the instance ID.

Instance identity describes the environment; the trust key describes the current cryptographic trust anchor. Future key rotation/rebinding should not create a new Product Instance.

### 4.3 No giant mutable instance state

Do not create one mutable row containing world state.

Use the same existing vault persistence substrate for three small classes of metadata:

1. immutable genesis;
2. append-only lifecycle/transition evidence;
3. revisioned activation/configuration references.

These describe the Product Instance boundary; they do not replace canonical world data.

### 4.4 Lifecycle state is a fold

Do not persist open=true as a truth.

Use lifecycle evidence such as:

    open-attempt
    open-confirmed
    close-confirmed

An unmatched open boundary on next startup means unclean interruption. It is evidence, not a new identity.

## 5. What survives

### Canonical durable

- Product Instance identity;
- vault records;
- historical revisions;
- evidence/provenance;
- durable user configuration;
- active composition reference/digest;
- vault schema/migration state;
- export/restore lineage;
- durable layout/presentation history once defined;
- canonical world relationships once established.

### Reconstructable

- mind/world snapshots;
- FTS/search indexes;
- rendering caches;
- lazy plugin compartments;
- router/token memory;
- temporary surface projections.

### Ephemeral

- µhost process;
- worker threads/processes;
- in-memory tokens and generations;
- process IDs;
- temporary files;
- open network connections;
- browser process/page/session state.

### Durable bootstrap materialization but not world truth

- keys/root-of-trust;
- format.json;
- recipe.pinned;
- signed manifests and built composition material.

The instance ledger should retain digests/references to these bootstrap artifacts rather than copying their contents into a second store.

## 6. Lifecycle trace

### START

Starting an executable enters an existing logical instance. Process start must never mint a new instance merely because a process started.

### INITIALIZE

Current ensureVault creates the directory, root key if absent, and format file if absent.

Required Product Instance initialization adds:

1. locate the durable instance root;
2. recover/open the vault;
3. validate vault format;
4. resolve immutable instance genesis;
5. derive current lifecycle state;
6. resolve active activation/configuration basis;
7. detect incomplete prior lifecycle boundaries.

Gap: current ensureVault does not semantically validate an existing format.json value.

### CREATE INSTANCE

Fresh root:

    initialize vault substrate
    -> mint instance genesis
    -> record initial activation/config basis
    -> activate first verified composition

If genesis is not durably committed, no instance exists.

If genesis exists but activation fails, the instance exists but is not ready; it must recover without generating a new identity.

### OPEN INSTANCE

Target ceremony:

    vault recovery
    -> instance genesis
    -> instance lifecycle fold
    -> activation/configuration basis
    -> recipe verification
    -> instance compatibility
    -> composition boot
    -> activation confirmation
    -> world projection
    -> surface restoration

The current Ω runtime performs only part of this sequence. Product Instance orchestration is the missing bridge.

### LOAD COMPOSITION

Existing Ω verification is necessary but insufficient.

Product Instance adds compatibility over:

- Product Instance protocol version;
- vault format/version;
- required migration state;
- host/runtime contract;
- required capabilities/contracts;
- configuration compatibility.

Therefore:

    verified != compatible != activated

A validly signed composition can still be incompatible with an existing instance.

### CREATE / OPEN WORLD

Do not create a separate world database.

The destination World should remain a deterministic projection over canonical vault records and canonical relationships. vivim.mind is evidence for this approach because it derives a bounded WorldModel and writes nothing.

### USE

The user works through surfaces and capabilities. Runtime materializations can come and go. No process-local state becomes canonical simply because it is convenient.

### MUTATE

Durable mutations use the existing vault append path:

    intent journal
    -> CAS
    -> object revision
    -> FTS
    -> Merkle changelog
    -> SQLite commit
    -> append.commit

D-432 explicitly accounts for a crash after the database commit but before the commit-journal line: recovery keeps provably committed data and records the accounting anomaly.

### CLOSE

Close is a lifecycle boundary, not deletion of the instance.

Target order:

    stop new durable work
    -> drain durable writes
    -> record close-confirmed
    -> release runtime

If the process dies first, next open identifies an unclean boundary and performs recovery. No new instance is created.

### REOPEN

Reopen reconstructs the same logical environment:

    same instanceId
    same vault history
    same activation/configuration basis
    same compatible composition
    same canonical world relationships
    same durable presentation history
    rederived world/self-knowledge
    recreated runtime

A different process ID, executable path or worker fleet is not a new instance.

## 7. Failure matrix

| Falsifier | Current evidence | Current gap | Required Product Instance behavior |
|---|---|---|---|
| Crash during boot | bootWithRecovery, adversarial recipe tests, B1/B4 | candidate can be pinned before successful boot | failed candidate never becomes active; prior activation survives |
| Crash during persistence | D-432 wal/changelog/durability | no fresh run in this session | instance lifecycle writes use the same durable append/recovery semantics |
| Restart after world mutation | vault/mind evidence; no full instance journey | no end-to-end proof | same instanceId, same canonical revisions, same world basis |
| Missing optional plugin | current recipe has no optional entry | optionality is not modeled | missing mandatory entry refuses; optional capability must be outside active recipe or require explicit contract support |
| Incompatible composition | signature/hash/invariant checks exist | no product compatibility check | reject before activation; preserve prior activation |
| Export/restore | vault.export/import evidence | not a full installed-instance bundle | restore identity, vault, activation/config, presentation, trust requirements |
| Executable replacement | composition content hashes and boot verification | no runtime/instance compatibility contract | compatible replacement preserves instance; incompatible executable refuses without mutation |
| Interrupted migration | dry-run/version/rollback mechanism | no fresh kill-point proof | schema state never silently advances; rollback/recovery state is explicit |
| Corrupted projection | mind is derivation-only; layout has history | no end-to-end projection repair proof | preserve canonical world; invalidate/rebuild projection |

## 8. Owner-machine falsifier procedures

The nine required tests remain explicit.

### F1 boot crash

Kill before verification, after verification but before activation promotion, and during eager plugin initialization.

Acceptance:

- previous active recipe remains available;
- candidate is not silently promoted;
- lifecycle evidence explains the interrupted attempt;
- instance identity is unchanged.

### F2 persistence crash

Kill between the existing D-432 phases:

- intent fsync;
- data transaction;
- database commit;
- commit journal.

Acceptance:

- committed canonical data survives;
- torn intent is quarantined;
- recovery is idempotent;
- no duplicate lifecycle state is created.

### F3 restart after world mutation

Mutate a durable project/world record, close, restart from the same root.

Acceptance:

- same instance identity;
- same latest canonical revision;
- same relationships;
- same world basis digest where determinism is promised.

### F4 missing optional plugin

Run without an actually optional component.

Important: current CompositionEntry has no optional flag. Until that is explicitly modeled, the correct falsifier is only the mandatory-component case, where absence must refuse.

### F5 incompatible composition

Present a validly signed composition with an unsupported instance protocol, vault format, required capability or configuration schema.

Acceptance: refuse before activation; prior activation and world remain intact.

### F6 export/restore

Export, wipe target, restore into a fresh durable root.

Acceptance:

- logical instance identity is preserved or an explicit restore-identity ceremony is recorded;
- canonical world reconstructs;
- activation/configuration basis returns;
- trust requirements are explicit;
- executable bytes need not be identical if runtime compatibility is satisfied.

Current vault export/import alone does not satisfy the full instance journey.

### F7 executable replacement

Replace the runtime executable while preserving the instance root.

Acceptance:

- same instance identity;
- same canonical data;
- composition verification remains valid;
- compatibility passes;
- failed replacement cannot mutate the instance.

### F8 interrupted migration

Kill at every meaningful point in a registered migration.

Acceptance:

- no false schema version;
- rollback point resolves;
- history remains verifiable;
- reopen either completes a known migration state or returns safely to the last valid state.

### F9 corrupted projection

Corrupt a regenerable projection or presentation artifact while canonical vault rows remain intact.

Acceptance:

- canonical world remains valid;
- projection is marked invalid/stale;
- projection is rebuilt or restored from a valid revision;
- canonical data is never altered just to satisfy a broken projection.

## 9. Export / restore design

Current vault export is correctly scoped as a vault archive. It is not currently an installed-environment format.

Product Instance export should be a wrapper around the vault archive rather than a new runtime persistence system.

Conceptual wrapper contents:

    instance identity
    instance protocol version
    vault archive reference + digest
    active recipe reference + digest
    root-of-trust identity/reference
    durable configuration reference/digest
    durable presentation references
    world basis/projection information
    runtime compatibility requirement
    trust/restore ceremony requirement

Restore:

    verify export manifest
    -> create fresh vault root
    -> verify/import vault archive
    -> restore instance identity
    -> restore activation/configuration basis
    -> satisfy trust ceremony
    -> verify compatible runtime/composition
    -> reconstruct world and projections

A raw filesystem copy is not the recovery model.

### Root-of-trust problem

D-432 explicitly says current export encryption/key management is incomplete.

Therefore full sovereign Product Instance restore still has an open dependency around:

- root key portability;
- key protection;
- restore rebinding;
- eventual key rotation.

This is a product exit dependency, not something to hide inside the vault implementation.

## 10. Executable replacement

The runtime executable is a replaceable implementation of the Product Instance.

The desired invariant is:

    same durable instance
    + compatible runtime contract
    + verified composition
    + valid vault
    = same logical environment

A replacement executable must not silently:

- adopt a new instance ID;
- rewrite history;
- reinterpret incompatible data as current;
- promote an unverified composition;
- destroy the previous activation.

Current B1/B4 content and recipe verification are important prerequisites but do not yet constitute the Product Instance compatibility protocol.

## 11. Projection corruption

Three levels must remain distinct.

1. Canonical:
   vault rows, revisions, evidence, canonical relationships.

2. Durable presentation:
   user-authored layout/workspace state.

3. Regenerable projection/cache:
   mind snapshots, search indexes, rendering caches, temporary projections.

If a regenerable projection is corrupt:

    canonical world = keep
    projection = invalid/stale
    repair = rebuild

If durable presentation state is corrupt:

    canonical world = keep
    presentation history = restore prior valid revision
    otherwise = safe rebuilt default

A surface must never become canonical merely to make a broken projection appear consistent.

## 12. Implementation blueprint

This remains design-only; no production implementation is authorized by this research task.

### PI-1 Contract the Product Instance

Specify immutable genesis, lifecycle events, activation/configuration references, instance protocol version, compatibility outcomes and export wrapper.

### PI-2 Use the existing vault

Introduce the Product Instance records through the existing vault namespace discipline and one-writer rule.

Do not introduce another database or alternate object store.

The exact namespace name and first writer require explicit owner/program decision.

### PI-3 Separate candidate from activation

The boot path must mechanically distinguish:

    candidate
    -> verified
    -> compatible
    -> activated

Activation promotion occurs only after successful composition readiness.

### PI-4 Instance-aware boot

Wrap the existing Ω recovery/verification/boot machinery:

    recover vault
    -> resolve instance
    -> resolve prior activation
    -> verify candidate
    -> compatibility check
    -> boot candidate
    -> wait for readiness
    -> atomically promote activation
    -> derive world
    -> restore surfaces

The previous activation remains the rollback point.

### PI-5 World reconstruction bridge

Reuse the existing vault as canonical storage. Build a deterministic world reconstruction contract over canonical namespaces/relationships established by the ontology/world work.

### PI-6 Close/reopen ceremony

Write close-confirmed only after durable writes are drained. Detect unmatched open boundaries on next startup and classify them as unclean interruption.

### PI-7 Product Instance export

Wrap the existing vault export/import with instance identity, activation/configuration, presentation state, runtime requirements and trust requirements.

### PI-8 Upgrade/replacement compatibility

Define a small machine-verifiable compatibility contract between the executable and the instance. Reuse existing Ω boot/self-verification evidence.

### PI-9 Projection repair

Give projections a basis digest or equivalent validity contract. On mismatch, mark stale and rebuild; never treat a derived projection as authority.

### PI-10 Proof gate

Do not call the Product Instance destination-grade until the nine owner-machine falsifiers have evidence, including failed activation rollback, restart reconstruction, full exit/restore, executable replacement, migration interruption and projection recovery.

## 13. Boundary decisions

### A — Instance is above persistence, not beside it

The Product Instance is the continuity boundary. The vault remains the durable truth substrate.

### B — No second world store

World remains a deterministic projection over canonical records and relationships.

### C — Process is a session

Process restart does not create a new logical environment.

### D — Composition is replaceable

The active composition is a durable activation reference, not the instance identity.

### E — Verification is not activation

A cryptographically valid recipe is not automatically the active product environment.

### F — Export is reconstruction

The export format reconstructs the logical environment rather than preserving one process tree forever.

### G — Projection failure is lower-level than canonical-world failure

Broken representations are rebuilt or quarantined without rewriting canonical world state.

## 14. Open frontier

1. Canonical namespace name and writer for Product Instance metadata.
2. Discovery of one or more durable instances on Windows and moved/portable roots.
3. Product Instance <-> executable compatibility contract.
4. Full activation transaction with previous-composition rollback.
5. Trust/key portability and restore rebinding.
6. Open, documented full-instance export format.
7. Kill-point proof for interrupted migration.
8. Canonical world relationship authority and reconstruction inputs.
9. Complete user configuration persistence model.
10. Durable presentation versus discardable cache semantics.
11. Native install/update/rollback lifecycle.
12. Multi-machine and future multi-device continuity.

## 15. Status against launch prompt

The design/research objective is satisfied to the extent possible without a local runtime: the canonical boundary, lifecycle trace, failure semantics, implementation blueprint and open frontier are characterized from current repository evidence.

The explicit local-run requirement remains outstanding for this session because the runtime could not clone the repository. No fabricated pass/fail results are included.

The correct next state is:

    CHARACTERIZED DESIGN CANDIDATE
    +
    OWNER-MACHINE FALSIFIERS REQUIRED
    +
    NO PRODUCTION CODE CHANGED

