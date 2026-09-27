# CFA-10 M1 — K0 Evidence / Falsifier Matrix
## 2026-09-27

> Status: M1 evidence closure artifact — research/design evidence only.
> CFA: CFA-10 — Runtime Constitution & Core Substrate
> Purpose: convert the retained K0 duty set into explicit invariant → bypass → minimum mechanism → evidence → falsifier rows, with executable-entry confinement as the first closure target.
> Authority: CFA-10 working evidence; not Ω law, not semantic authority, not implementation authorization.

## 1. M1 conclusion

**M1 result: PARTIALLY CLOSED — K0 duty matrix established; B1 remains unclosed.**

The current repository provides strong direct evidence for admission/integrity, Worker/Port compartment transport, host-side capability-token enforcement, Authority-gate routing, atomic activation/fail-closed recovery, and generic lifecycle. The remaining B1 gap is more precise than a generic path-validation concern:

1. \`e.source\` is resolved from \`buildDir\` but is not proven to remain inside the admitted build tree.
2. \`e.manifestPath\` is resolved from \`buildDir\` but is not proven to remain inside the intended manifest area.
3. \`m.entry\` is joined to the resolved source directory at spawn time, but verification does not prove that the canonical entry target is contained by the same content-hashed source tree.
4. \`contentHashDir()\` rejects symlinks encountered while walking a source tree, but the source-tree root itself is not lstat-checked before its walk; a source-root symlink is therefore an explicit containment test case.
5. Verification hashes filesystem contents and later spawns by path; current evidence does not prove that bytes executed cannot change between verification and execution (verify→execute TOCTOU).

These are observed/derived proof gaps, not a request to change Ω law in this task.

## 2. K0 duty matrix

| K0 duty | Universal invariant | Concrete bypass if removed | Minimum mechanism to test | Current evidence | M1 status | Falsifier |
|---|---|---|---|---|---|---|
| K0-1 Admission / integrity | No admitted guest executes unless Recipe, manifest identity/signature and content integrity are valid | Unsigned/foreign-root Recipe; tampered manifest; changed/truncated source | Verify Recipe signature/root; verify manifest hash/signature; verify source content hash before spawn | \`recipe.ts\`, \`boot.ts\`, adversarial cases 1–12, B4 recovery cases | STRONG / B1 GAP REMAINS | Any invalid or uncovered bytes execute, or any unverifiable composition reaches spawn |
| K0-2 Compartment / Port | Guest execution is structurally separated and messages cross the governed Port boundary | Direct host/plugin coupling or execution outside the compartment path | Worker-thread compartment creation + Port-only guest message path | \`worker.ts\`, \`ports.ts\`, B2 law and existing lifecycle/watchdog evidence | OBSERVED / BOUNDED | Guest reaches protected host behavior without Port/governed route; or a stronger isolation claim is made without proof |
| K0-3 Capability egress / fencing | Guest can invoke only capabilities structurally granted to that compartment and still live | Forged/foreign token, wrong scope, revoked generation token | Host-side token lookup, owner check, scope check, revocation/generation check before dispatch | \`ports.ts::checkToken\`, B3 law, token/routing evidence | STRONG | Unknown, foreign, wrong-scope, revoked or stale-generation token reaches governed dispatch |
| K0-4 Generic Authority-gate enforcement | Required consequential effects cannot bypass the configured Authority gate | Risky operation reaches realization without live gate | Route risky effective op through \`law.check@1\`; refuse deny/consent-required before spawn/dispatch | \`ports.ts::dispatch/callLaw\`, Authority seam, current law | STRONG / SEMANTICS EXTERNAL | Risky effective op executes without required gate result, or runtime decides policy meaning |
| K0-5 Atomic activation / fail-closed recovery | Invalid replacement never becomes active; recovery preserves known-good state or refuses | Torn/corrupt pin activates; invalid incoming recipe overwrites trusted state | Verify before pin; atomic rename; pinned fallback; corrupt pinned state refuses | \`recovery.ts\`, \`canon.ts::atomicWrite\`, adversarial 8/9/12, B4 drill | STRONG | Invalid state becomes active, or recovery continues on corrupt pinned state |
| K0-6 Generic lifecycle containment | Admitted execution can be started/stopped/fenced/recovered without leaving the governed lifecycle | Crashed/degraded compartment remains treated as active; termination cannot fence execution | Generic lifecycle state + bounded termination + crash transition + safe recovery | \`worker.ts\`, \`ports.ts\`, watchdog evidence | OBSERVED / THREAT-BOUNDED | Dead/degraded code remains invocable, or lifecycle safety requires Work/provider semantics |
| K0-7 Minimum crypto/canonical/platform primitives | Only primitives necessary for K0 invariants remain trusted runtime substrate | Duplicate hash/sign/canonical implementations diverge or extra platform authority leaks into K0 | Single canonical hash/sign/atomic primitive with reproducible inputs | \`canon.ts\`, shared contract/gate evidence | OBSERVED / MINIMALITY OPEN | Primitive retained without a universal invariant, or a second implementation can disagree |

## 3. B1 executable-entry closure matrix

### Canonical expected invariant

> The executable target is a regular file canonically contained within the exact source tree whose content digest is admitted by the Recipe, and the bytes actually executed are the same bytes covered by that admitted integrity boundary.

The test must establish both spatial containment and integrity-to-execution binding.

| Case | Mutation / attack | Current observation | Closure-required result | Failure proves |
|---|---|---|---|---|
| B1-01 control | \`m.entry = src/index.ts\`; normal source tree | Existing control path is valid | ALLOW + executed bytes match admitted hash-covered file | False negative if valid entry refuses |
| B1-02 traversal | \`m.entry = ../outside.ts\` | No explicit executable-entry containment check | REFUSE BEFORE SPAWN | Entry containment absent |
| B1-03 nested traversal | \`m.entry = nested/../../outside.ts\` | Same gap class | REFUSE BEFORE SPAWN | Canonical normalization not enforced |
| B1-04 POSIX absolute | \`m.entry = /tmp/evil.ts\` | No explicit absolute-path guard | REFUSE BEFORE SPAWN | Absolute entry escape |
| B1-05 Windows absolute | \`m.entry = C:\\\\outside\\\\evil.ts\` | Cross-platform containment not proven | REFUSE BEFORE SPAWN | Windows absolute escape |
| B1-06 Windows UNC | \`m.entry = \\\\\\\\server\\\\share\\\\evil.ts\` | UNC containment not proven | REFUSE BEFORE SPAWN | UNC escape |
| B1-07 source-root escape | \`e.source = ../other-tree\` | \`resolve(buildDir,e.source)\` can escape buildDir | REFUSE | Admitted source tree is not bounded to Recipe build root |
| B1-08 manifest-root escape | \`e.manifestPath = ../outside/plugin.json\` | \`join(buildDir,e.manifestPath)\` has no explicit containment proof | REFUSE | Verification trusts metadata outside intended admitted area |
| B1-09 source-root symlink | \`e.source\` names a symlink to a directory outside buildDir | Root path is not lstat-checked before walking | REFUSE | Hash tree can be rooted outside admitted tree |
| B1-10 entry symlink | Entry resolves through a symlink inside source tree | Child symlinks are rejected by walker, but refusal semantics are not normalized | REFUSE with stable verification result | Symlink target can escape or refusal is nondeterministic |
| B1-11 non-file entry | \`m.entry\` resolves to directory/device/special path | Target is not checked as a regular file | REFUSE | Execution target is not a hash-covered regular file |
| B1-12 post-verify mutation | Verify valid tree, mutate entry bytes before spawn | Current verify→spawn path has no demonstrated immutable binding | REFUSE or execute only the verified bytes by proved binding | TOCTOU gap |
| B1-13 post-verify replacement | Verify file A, replace path with file B before Worker loads | Worker is spawned by path | REFUSE or execute exactly A by proved binding | Path identity confused with integrity identity |
| B1-14 hash mismatch | Mutate hash-covered source before verification completes | Existing adversarial suite detects content mismatch | REFUSE BEFORE SPAWN | Content integrity bypass |

## 4. Refusal semantics

M1 does not introduce new runtime refusal codes.

The required semantic contract for the future B1 closure is:

- invalid entry/source/manifest relation produces a deterministic verification refusal;
- no Worker is spawned from the rejected composition;
- rejected incoming state is not pinned;
- B4 recovery continues to the pinned known-good recipe when applicable;
- a corrupt/unverifiable pinned recipe continues to refuse boot;
- UNKNOWN containment conditions are never promoted to VERIFIED.

A named B1 refusal code may be added later, but inventing one is outside this research task.

## 5. Evidence classification

### OBSERVED / CURRENT

- B1 law requires signed admission and content integrity.
- \`verifyEntryWithRootAsync()\` verifies manifest digest/signature and \`contentHashDirAsync(srcDir)\`.
- \`bootComposition()\` verifies before compartment spawn.
- \`spawnCompartment()\` ultimately creates the Worker from \`join(sourceDir, entry)\`.
- \`contentHashDir()\`/async reject symlinks encountered below the walked source root.
- Existing adversarial tests cover signature failure, wrong boot owner, foreign root, manifest hash mismatch, content hash mismatch, deleted entry file, replay after content change, atomic swap and corrupt pinned state.
- There is no dedicated executable-entry containment corpus in the existing evidence inspected for M1.

### DERIVED / CURRENT

- Hashing a source directory is not equivalent to proving the chosen executable path is contained by that directory.
- Path resolution is not equivalent to integrity-bound execution.
- A source-root symlink is distinct from a child symlink and requires its own test.
- Hash-before-spawn is not, by itself, proof against verify→execute TOCTOU.

### UNKNOWN / CURRENT

- Exact canonical containment implementation.
- Exact stable B1 refusal code/sentence, if any.
- Whether immutable snapshotting, an equivalent file binding, or another mechanism is required for byte identity at execution.
- Whether source/manifest containment belongs directly in K0 or in a proven K0-adjacent admission primitive.

### CONFLICTED

None identified. The current Ω B1 law and direct implementation evidence agree that executable-entry confinement is an open gap.

## 6. M1 exit gate

M1 can be called CLOSED only when a later bounded experiment demonstrates:

1. valid in-tree regular entry succeeds;
2. traversal, nested traversal, POSIX absolute, Windows absolute and UNC entries refuse before spawn;
3. source-root, manifest-root and symlink escape attempts refuse;
4. non-file executable targets refuse;
5. post-verify mutation/replacement cannot result in execution of uncovered bytes;
6. executed bytes are provably identical to the integrity-covered bytes;
7. invalid cases preserve B4 fail-closed recovery semantics;
8. the proof remains compatible with B5 and does not import product semantics into K0.

Until then, B1 remains UNDERPROVEN.

## 7. Explicit non-promotions

This artifact does not promote:

- full StateArbitrator;
- full graph/routing analytics;
- full AuditLog/history store;
- full generation registry;
- generic bootstrap role;
- zero-plugin implementation;
- OS-level sandboxing;
- provider/browser semantics;
- Work semantics;
- any new Ω-law rule.

## 8. Next experiment boundary

The next separately authorized runtime experiment is the B1 containment/byte-binding fixture, limited to the cases in §3 and stopped before broad K0 restructuring.
