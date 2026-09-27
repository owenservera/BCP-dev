# CFA-10 — B1 Containment / Byte-Binding Experiment
## 2026-09-27

> Status: **PARTIALLY EXECUTED — primitive evidence closed; target-runtime closure remains open**
> CFA: **CFA-10 — Runtime Constitution & Core Substrate**
> Purpose: empirically test the B1 falsifiers without changing production runtime or Ω law.
> Authority: CFA-10 evidence only; not Ω law, not a security certification, not an implementation decision.

## 1. Scope

This experiment is the bounded follow-up to M1's B1 gap. It tests only:

- executable-entry path confinement;
- source-root containment;
- source-root symlink behavior;
- regular-file target requirement;
- verify→execute byte binding / TOCTOU;
- the exact path primitives used by the current implementation.

It does **not** redesign K0, change Ω law, choose a final containment mechanism, or claim OS-level sandboxing.

## 2. Current implementation under test

The current Ω host contains three relevant primitives:

1. \`verifyEntryWithRoot{Async}()\` resolves \`e.source\` from \`buildDir\`, then hashes that tree.
2. \`contentHashDir{Async}()\` rejects symlinks encountered **inside** the walked tree, but does not lstat the root itself before walking it.
3. \`bootComposition()\` later passes \`join(sourceDir, m.entry)\` to \`new Worker()\`.

The experiment therefore distinguishes:

**A. admission-time containment** — what the verifier proves;

**B. launch-time path selection** — what Worker receives;

**C. byte identity** — whether the bytes executed are necessarily the same bytes that were integrity-covered.

## 3. Primitive probe

### 3.1 Entry path join

Exact Node \`path.join\` behavior was probed for the current Worker construction shape:

| Input | \`path.join(sourceDir, entry)\` result | Observation |
|---|---|---|
| \`../outside.ts\` | parent escape | **ESCAPES** |
| \`nested/../../outside.ts\` | parent escape | **ESCAPES** |
| \`/tmp/evil.ts\` | remains below \`sourceDir\` | no POSIX absolute escape under \`join\` |
| \`C:\\outside.ts\` | remains below \`sourceDir\` under POSIX | no POSIX escape; Windows-target semantics still require runtime validation |
| \`\\\\server\\share\\evil.ts\` | remains below \`sourceDir\` under POSIX | no POSIX escape; Windows-target semantics still require runtime validation |

**Result:** the B1 entry-path gap is real for relative traversal. The earlier matrix should not be interpreted as evidence that every absolute/UNC spelling necessarily escapes through the current \`join\` call. The missing proof is containment, not a blanket claim about observed escape for each spelling.

### 3.2 Source-root symlink

A temporary source-root symlink was created, then the current \`contentHashDir()\` algorithm was reproduced exactly enough to test its root handling.

Observed result:

- the root itself was accepted as a directory walk target;
- the symlink was followed at the root;
- the outside target's bytes were hashed;
- no root-level symlink refusal occurred.

**Result:** **SOURCE-ROOT SYMLINK GAP CONFIRMED.**

This is distinct from child symlinks, which the current walker rejects.

### 3.3 Verify→execute byte binding

A minimal Worker fixture was used:

1. create \`runner.mjs\` whose executable marker is \`A\`;
2. read the file as the integrity-covered bytes;
3. mutate the same path so its executable marker is \`B\`;
4. construct the Worker using the same \`join(sourceDir, entry)\` load pattern;
5. observe the executed marker.

Observed result:

\`coveredByte = A\`

\`executed = B\`

**Result:** **TOCTOU / BYTE-BINDING GAP CONFIRMED.**

The path remains valid while its bytes change. The current path-based launch primitive does not itself bind execution to the bytes previously integrity-covered.

## 4. Cases not fully executed against the Ω host

The following still require a full checkout/runtime replay against the actual Ω host and target platforms:

- signed-manifest entry traversal through \`verifyEntryWithRoot{Async}()\` with controlled manifest re-signing;
- \`e.source\` out-of-tree admission behavior in the full composition verifier;
- \`e.manifestPath\` out-of-tree behavior in the full composition verifier;
- regular-file versus directory/special-file executable targets;
- child-entry symlink refusal and stable refusal shape;
- post-verify mutation/replacement through the actual \`bootComposition()\` → Worker path;
- Windows-native drive-letter and UNC behavior under the actual supported Bun/Node runtime;
- B4 recovery preservation during each invalid B1 case.

No claim of M1 closure is made without those replays.

## 5. Evidence classification

### OBSERVED

- relative traversal escapes the source root under the exact current \`join(sourceDir, entry)\` primitive;
- the reproduced current content-hash walker follows a source-root symlink;
- the exact path-based Worker launch can execute mutated bytes after an earlier read/integrity step;
- absolute/drive/UNC spellings are not blanket escape cases under POSIX \`path.join\`.

### DERIVED

- content hashing a directory is insufficient to prove the executable target is contained by that directory;
- path identity is insufficient to prove byte identity across the verify→execute interval;
- root-symlink handling must be tested separately from child-symlink handling;
- “containment” and “absolute-path rejection” are related but not equivalent invariants.

### UNKNOWN

- the minimum production mechanism that can bind verified bytes to the executed bytes;
- the exact Bun/Windows semantics for every cross-platform path form;
- whether the eventual mechanism is snapshot-based, descriptor-based, or another equivalent binding;
- the stable B1 refusal code/sentence;
- the exact K0/K0-adjacent placement of any containment primitive.

## 6. Experiment verdict

**B1 remains UNDERPROVEN, but the gap is now experimentally sharpened.**

The most material proven defect is not “all absolute paths escape.” It is:

> the current verifier/launcher pair does not establish a proof that the executable target is contained by the integrity-covered source tree, nor that the bytes eventually loaded by Worker are the bytes that were integrity-covered.

The source-root symlink case adds a separate admission-root containment failure.

## 7. Non-promotions

This experiment does **not** promote:

- a specific containment implementation;
- immutable filesystem snapshots as the chosen design;
- descriptor-based execution;
- any new Ω-law rule;
- OS/process isolation;
- a new refusal code;
- any product-semantic responsibility into K0.

## 8. Next bounded closure

The next task is a full Ω-host replay of the B1 corpus on an actual supported runtime. It should produce deterministic allow/refuse results for the signed-manifest cases, then test the chosen candidate byte-binding mechanism only after the evidence shows what minimum mechanism is necessary.

Production implementation remains **NOT STARTED**.
