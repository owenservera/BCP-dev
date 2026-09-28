# CFA-01 — Reality Engine Design Input (World / Context lens)

> Date: 2026-09-28
> CFA: CFA-01 — World & Context Steward
> agent_id: `world-ontology-context`
> Identity: **RATIFIED — OWNER-ALIGNED**
> Unit: DESIGN INPUT. MODE=DELIBERATE. No code, no implementation, no central synthesis.
> Classification: proposal / characterization from one owner lens. Not Ω law. Not a
> shared-boundary activation. Not a decision on any peer's seam.
> Write scope: CFA-01 home only.
> Owner material read (UNTRACKED, read-only, never committed/edited/moved):
> `docs/Reality-engine/Blueprint.txt`, `docs/Reality-engine/gotchas.txt`,
> `docs/Reality-engine/setup prompt.txt`,
> `docs/Reality-engine/# Reality Engine — Full Working Cor.txt`.

## 0. Base-ref reconciliation and delivery-path finding (OBSERVED)

This section exists because the unit's own instruction required re-resolving main, and
re-resolving it changed the delivery path materially.

| Item | Value | Class |
|---|---|---|
| Base ref given at spawn | `edfe49b1d2cc871fabcc0b3388128f956db908ff` | OBSERVED |
| `edfe49b1` is an ancestor of `origin/main` | yes (`git merge-base --is-ancestor` exit 0) | OBSERVED |
| `origin/main` tip this session | `09f7ed24760fbe0b5de1e5aedf7f075e57609af5` | OBSERVED |
| `main` (local) vs `origin/main` | identical, `0 0` divergence | OBSERVED |
| Session worktree branch at session start | `team/omega-endstate` at `ff8e141a4a611ddaa6a35315e71557832cef2a5d` | OBSERVED |
| `edfe49b1` is an ancestor of the worktree HEAD | **no** (exit 1) | OBSERVED |
| `main...team/omega-endstate` divergence | `5` on main only, `52` on the worktree branch only | OBSERVED |
| Merge base of the two | `53e0cfb3f4a881b9589d234ce71427c55b0d8c1e` | OBSERVED |
| `dev-reality/` exists in the repository | no | OBSERVED |
| `docs/Reality-engine/` tracked files | zero (`git ls-files` returns none; shows as `??`) | OBSERVED |
| Uncommitted peer/owner work in the primary worktree | `M omega-baseline/omega-final/build/status.json`; untracked `OmegaBuildBootstrap.txt`, `docs/Reality-engine/`, `local-team.md`, `session-ses_f1fc.md` | OBSERVED |
| `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/LOCAL-TEAM-TOOLSET-SYNTHESIS-20260928.md` | **not present** at the stated path; the synthesis lives as `RESULTS/STEWARD-20260928-LOCAL-TEAM-TOOLSET-WAVE1.md` | OBSERVED |

**DERIVED:** the spawn base is on `main`'s lineage, but the session worktree sits on a
branch that does not contain it and has diverged 52/5. Committing in the primary
worktree would have placed this unit's artifacts on a lineage that `main` does not
contain, so the mandated "verify by re-reading current main" could not have passed.

**Resolution taken (procedure, not authority):** delivery was performed in a dedicated
git worktree branched from current `main` (`09f7ed24`), so the peer's uncommitted
modifications in the primary worktree were never touched, and the artifacts are
reachable from `main` by fast-forward only. No force-move, no merge of a peer branch,
no commit into `docs/Reality-engine/`.

**This is itself a finding, not boilerplate — see F-13 and W-17.** The engine as
specified has no representation for "this branch shares no ancestry with the delivery
ref", and the numeric divergence counters the corpus computes remain meaningful-looking
for exactly that case.

## 1. What the owner corpus actually is (OBSERVED inventory)

Before judging scope, the three artifacts differ in kind, not just in length:

| Artifact | Lines | Kind | Contains the invariants? | Contains working code? |
|---|---|---|---|---|
| `Blueprint.txt` | 341 | a *second* pragmatic design proposal, presented as analysis of an earlier "full blueprint" that is not in the folder | No | No |
| `setup prompt.txt` | 845 | the specification: boundaries, 9 invariants, type system, CLI contract, error taxonomy, 15 truthfulness tests, 7 failure-injection tests, acceptance list, 21 falsifiers, Slices 1–9 | **Yes** | No |
| `gotchas.txt` | 77 | 5 operational traps + a 7-item pre-Slice-1 checklist | No | One `canonicalizePath` sketch |
| `# Reality Engine — Full Working Cor.txt` | 2710 | a scaffold: project tree, ~20 files of code, expand instructions | Type system only | **Partially, and the parts are stubs** |

**OBSERVED — declared-but-absent in the "Full Working Core":** the file tree declares
`src/core/errors.ts`, `basis-engine.ts`, `freshness-engine.ts`, `conflict-engine.ts`,
`schema-registry.ts`, `agent/identity-binding.ts`, `agent/startup-block.ts`,
`agent/cfa-profiles.ts`, all of `observers/{filesystem,process,opencode,toolchain,verification}/`,
six of twelve `cli/commands/*`, `storage/{journal,indexes,locks,pruning}.ts`,
`engine/{backpressure,bootstrap}.ts`, and every test file. Only the Git observer is
registered; the other five observers are commented out in the registry
(corpus lines 1996–1998, 2013–2018).

**OBSERVED — the three modules this unit's seam depends on are exactly the three that
are declared and never implemented:** basis tracking, freshness proof, and path
canonicalization. The corpus additionally hardcodes the Git observer's
`freshness: "CURRENT"` and `status: "OBSERVED"` unconditionally (corpus lines
1213–1214) and ships no `freshness-engine` to compute anything else. `DegradationManager.checkAll()`
is an empty function (1975–1978) driven by a 10-second timer; `getUnavailable()` returns
`[]` (1780–1787); `getConflicts()` and `getCollisions()` return `[]` (2110–2118);
`health()` reports `watcherStatus: "ACTIVE"`, `eventLagMs: 0`, `snapshotDurationMs: 0`
as literals (1672–1675).

**DERIVED:** the corpus reads as a finished artifact and is not one. A reviewer who
skims it will believe that "CURRENT is earned", conflict preservation, identity-collision
detection, degradation self-observation, and per-CFA projection are implemented. They
are not. This is the single largest scope risk in the package, and it is invisible from
the specification, which reads correctly.

## 2. (a) Validation of the setup prompt's CFA-01 sketch

The sketch under review (setup prompt lines 61–64):

```text
### CFA-01 World Ontology
- Needs: workspace/repository basis currency, source revision freshness
- Queries: `reality for cfa-01` → file/revision basis, staleness
- DO NOT: implement World semantics
```

**Verdict: the framing is VALID; the specification is REJECTED as written.** The `DO NOT`
is correct, load-bearing, and must survive unchanged. The two `Needs` are valid but each
is wrong at the edges, and the `Queries` line is wrong in a way that would cause semantic
damage to this CFA and to every consumer of the projection.

### 2.1 "workspace/repository basis currency" — VALID, must be split three ways (F-01)

"Currency" is one word for three different questions with three different bases:

1. **Workspace basis currency** — which workspace am I in, and is my view of it current.
2. **Repository basis currency** — which refs/HEAD/main exist, and am I reading them freshly.
3. **Evidence-revision currency** — is the revision of the artifact I am reasoning *over*
   the revision I intend to reason over.

The corpus models these with a single `RepositorySnapshot` and a single snapshot-level
`freshness`. This session is a live falsifier of that collapse (§0): the workspace branch
was current for itself, while `main` was a disjoint lineage, 5/52 diverged, sharing a
merge base four commits behind the spawn base. One `freshness: CURRENT` would have been
a true statement about a basis the agent was not reasoning over.

**Required refinement (not a redefinition):** three separately-based freshness values,
plus an explicit `lineageRelation` between the observation workspace and the *declared
delivery ref*, with the value `INCOMPARABLE` (no merge base) as a first-class outcome.
`DivergenceState` today models main-drift only; it has no vocabulary for
divergence-without-common-ancestry.

**Term collision to avoid (F-02):** the engine's `BasisRef.source` means *observation
channel* (`"git" | "filesystem" | "os-process-table" | ...`), while Stage-E L1's
`BasisRef.sourceRef` means *the attributable origin of a basis*, and in CFA-01 doctrine
"source" means an origin system whose identity is **not** local identity. One word,
three referents. The engine must name its field `channel`/`observerKind` and must not
emit `BasisRef.ref: ".git/HEAD"` as though a repository-internal path were a source
reference — that is the standing "selector/path is not a canonical address" violation
appearing inside a type that a consumer will reasonably read as a source reference.

### 2.2 "source revision freshness" — VALID as intent, ambiguous as words

Read as *evidence-revision freshness* this is exactly CFA-01's mandate and matches the
closed L2 adapter. Read as the corpus implements it — file `mtime`/size/content-digest
change detection — it is a *different claim with the same name*.

**Hard constraint for this unit (F-03):** **a file digest is not a World object
revision.** The L2 characterization explicitly rejects filesystem path, graph presence,
producer version markers, and stored freshness flags as World/Object freshness proof.
If `reality for cfa-01` returns "file/revision basis" derived from `fs` digests, every
consumer will read those digests as revision identity. The engine may emit a content
digest — as `contentDigest`, with its basis and its channel — and must never present it
as a revision, a `WorldModel.v`, or a canonical `(ns,id,rev)`.

The engine **can** supply basis 1 and basis 2 above, honestly and well. It **cannot**
supply basis 3 for World objects, and the honest report of that is a named UNKNOWN, not
a substitute.

### 2.3 `reality for cfa-01` — REJECTED AS SPECIFIED, four independent reasons

1. **Not implemented (F-04).** `for` appears in the CLI `COMMANDS` map (corpus 2148) and
   in the CLI contract (setup prompt 480) but has **no `case` in the switch**, so it falls
   to `default:` and exits 3 (corpus 2234–2238). `cfaProfiles: []` in the defaults
   (2719); `cli/commands/for-cfa.ts` and `agent/cfa-profiles.ts` are declared, never
   written. The package's central multi-CFA premise is 0% implemented in the artifact
   titled "Full Working Core".
2. **A hand-authored path list is a static claim that fails silently (F-05).**
   `RealityCfaProfile.relevantPaths` is authored config. If a path is renamed, the
   projection returns an empty result: no conflict, no UNKNOWN, no exit-code change. An
   empty projection reads as "nothing relevant exists", which is a false World claim
   produced by a projection mechanism. See M-08, W-11, G-15.
3. **"file/revision basis" is a category error** per 2.2 above.
4. **A per-CFA file projection is not Context, and must not become one (F-06).** Context
   per `CORE-AGENT.md` is purpose-scoped bounded selection with basis, scope, relevance
   and omission semantics. A path list plus staleness is a file listing. If the engine is
   specified to be a per-CFA projection *and* an observation substrate, it becomes a second
   projection engine (standing `ISS-002`), and it will acquire relevance ranking it has no
   standing to perform. The `--agent` block should be *D-443 assembly over cited
   observations*, not a bespoke context product.

### 2.4 Refined `reality for cfa-01` contract (PROPOSED — characterization, not code)

```text
reality for cfa-01
  workspaceBasis     : { workspaceIdentity (canonical), repositoryRoot (display form),
                         branch, head, localMain, remoteMain, mergeBasePresent,
                         lineageRelation, freshness + freshnessProofRef }
  homeBasis          : [ { path, resolution: PRESENT|ABSENT|UNRESOLVABLE,
                          contentDigest?, digestKind: "content-not-revision" } ]
  ownerAdapterStatus : { adapterId: "world.object-revision.basis.v1",
                         characterization: CHARACTERIZED,
                         runtimeTokenPropagation: UNKNOWN,
                         rejectedAsProof: [ WorldModel.v, WorldModel.t, EntityView.at,
                                            path, graphPresence, storedFreshnessFlag ] }
  conflicts[]        : preserved, never resolved
  unknowns[]         : named, with reasons
  explicitlyAbsent   : worldMeaning, equivalence claims, relevance ranking,
                       Context assembly (D-443 + CFA-01 M3 own this)
```

`workspaceIdentity` must be the canonical identity form, and must be a **mechanical
observation key in its own namespace** — not a World `(ns,id)` address. If the engine
starts minting World addresses it has crossed the must-not in §4 N-01. This is the
sharpest boundary question in the whole unit and it is routed as U-05.

## 3. (b) Scope verdict: HYBRID, with the ordering inverted

**Verdict: hybrid — but not "pragmatic waves, then the slices".** Both pure options are
wrong in the same direction: each defers exactly the machinery that makes the engine
truthful until after the breadth that makes it fast and widely wrong.

| Option | What it gets right | Why it is rejected |
|---|---|---|
| **A. Pragmatic-v1 Waves 0–3** (`Blueprint.txt`) | Correct first atom (single-file Git observer). Honest deferral table. Explicit "not authoritative — it observes Git, not overrides it". Zero-dependency discipline. | Defers *schema versioning*, *content hashing*, *elaborate degradation*, *event replay* — and silently also the freshness proof, conflict preservation, and canonical identity, which its own invariant list requires. Its storage design (`.dev-reality/basis-cache.json`, JSON indexes) is **directly contradicted by gotcha #4**, and its "what I'm deferring" table never mentions the freshness engine at all. Week 1 ships a tool that reports `freshness: "CURRENT"` with no proof — i.e. ships the exact defect it claims to avoid. |
| **B. Full Phase-1 Slices 1–9** (`setup prompt.txt`) | Correct law. Invariants, taxonomy, falsifiers and truthfulness tests are genuinely good and largely reusable verbatim. Correct anti-goals. | 10-week schedule puts the daemon at the end and continuous operation at the end, so weeks 1–8 produce a *fast* engine whose truthfulness infrastructure is still absent. Slice 1 is named "Core Schema + Git/Workspace Truth" but the corpus shows slice 1 delivering a Git observer with hardcoded `CURRENT` and no basis/freshness/path modules. Ordering is the defect, not content. |
| **C. Hybrid (recommended)** | Keeps A's first atom and B's law; moves B's truthfulness floor into increment 1. | — |

### 3.1 Recommended increments

```text
Phase-1a  TRUTHFUL GIT & BASIS FLOOR        (≈ B-Slice1 + G-1 + G-4 + G-5)
  canonical path identity (display + identity forms, UNC/case/dot-segment correct)
  basis-engine and freshness-engine actually implemented
  BasisRef reconciled with L1/L2, or explicitly renamed + adapter seam
  SHA-256 canonical digest, no timestamps, no localeCompare
  Git observer only, with real freshness proof and reason codes
  exit codes 0-5 implemented
  bun:sqlite for mutable indexes, JSONL for events, canonical JSON for snapshots
  --agent bounded (<800 tokens) via D-443 assembly semantics
  MUST PASS before any further code: T01, T04, T06, T07, T15, W01-W05, W17
  gate: no increment 1b code merges with any of those failing

Phase-1b  ABSENCE, IDENTITY, CONFLICT       (≈ B-Slice3 + B-Slice6-minus-daemon)
  process observer with PID + startTime generation token
  identity collisions persisted; PATH_AMBIGUITY raised on the *canonical identity function*
  presence triple (PRESENT | ABSENT | UNDETERMINED)
  conflict preservation, both observations retained, no silent pick
  `reality for <cfa-id>` with observed profile resolution

Phase-1c  VERIFICATION HONESTY              (≈ B-Slice5 + B-Slice8-minus-daemon)
  execution envelopes; executionAxis ⊥ resultAxis
  preclosure reports {value, status, basis}; the closure VERDICT is removed
  divergence incl. INCOMPARABLE; writer contention

Deferred out of Phase 1: daemon, recursive fs watcher, backpressure machinery,
schema migration tooling, OpenCode API integration, fs Level-C content reads.
```

### 3.2 What to cut or defer, and why (each with the reason, not a preference)

| Item | Action | Reason |
|---|---|---|
| Daemon (Slice 9) | **defer** | gotcha #3's git-hook accelerator delivers the "no polling latency" benefit at near-zero cost and no 24-hour availability burden. A daemon also becomes a second thing that can be stale and authoritative-looking. On-demand + hooks is the correct v1; the corpus already argues this ("No daemon yet. On-demand is fine."). |
| Recursive fs watcher (Slice 2) | **defer** | Highest cost, lowest marginal truthfulness, worst Windows reliability, and it is the module that most invites the Phase-2 bleed gotcha #5 exists to prevent. `git status --porcelain=v2 -z` already yields changed/untracked files. Revisit only when a named consumer needs sub-second file events. |
| Backpressure config | **defer** | `maxBufferSize: 10000`, `dropPolicy`, `coalesce` describe a buffer with a producer. With one loop and no daemon this is inert configuration that will be read as a guarantee. |
| Schema migration (falsifier 16) | **cut, keep the failure** | Keep `schemaVersion` and the *refuse-don't-guess* behavior on unknown version. Migration tooling is unjustified until a second version exists. This is the honest half of falsifier 16. |
| OpenCode API integration | **defer** | `integrationMethod` offers `"api"` with zero evidence it exists. Process + filesystem cross-reference is sufficient for phantom detection; API coupling is a transport decision, not an observation one. |
| `canonicalSerialize` sorting every array by serialized form | **cut outright** | Destroys semantic order (see M-10). Not a deferral; a defect. |
| 32-bit `hashPath` / `computeBasisDigest` | **cut outright** | Defect (collision surface, and `PATH_AMBIGUITY` unreachable). |
| Hardcoded `freshness:"CURRENT"` / `status:"OBSERVED"` | **cut outright** | Defect; falsifies invariant 2 in the same commit that states it. |
| Hardcoded `preclosure` `true`s + `MECHANICAL VERDICT: READY FOR CLOSURE` | **cut outright** | Defect; asserts unobserved facts and crosses the engine's own closure boundary. |
| Unconditional `process.exit(0)` | **cut outright** | Defect; the exit code is itself a claim. |
| `changes()` eventId/snapshotId comparison | **cut outright** | Defect; silently returns "no changes". |
| `exists: boolean` on file/dir observations | **cut outright** | Defect; cannot express UNDETERMINED. |
| `workspaceRoot: process.cwd()` as a raw basis | **cut outright** | Defect; raw path into basis identity, against gotcha #1. |

## 4. (c) Must-haves at the CFA-01 seam

Each is a precondition for this CFA being able to consume the engine without the engine
asserting World meaning. None requires new Ω law or a boundary activation.

- **M-01 — One canonical path identity, two forms, collision-resistant.**
  Canonicalization must resolve the long-path prefix, UNC paths, case-insensitivity per
  the engine's own stated Windows rule, and `.`/`..` segments, and must produce a
  **display form** (human/`fs`-usable) and an **identity form** (hashed with SHA-256,
  truncated, not a 32-bit accumulator). Raw paths must be unassignable to `subjectId` or
  `BasisRef.ref` without passing through it — enforce at the type/constructor boundary,
  not by convention.
  *Why:* gotcha #1 is correct that paths break digests, but its stated consequence is
  incomplete, and its sample code has three defects of its own (below).
- **M-02 — `subjectId` derives from canonical identity, never from a display path.**
  Two observers observing one subject must not mint two subject keys.
- **M-03 — Epistemic status is a property of the asserted claim, not of the envelope.**
  `Observation<T>.status: EpistemicStatus` is singular while `value: T` is an arbitrary
  composite. In one object the corpus reports `head` (OBSERVED), `isDiverged`
  (`ahead > 0 && behind > 0`, DERIVED) and `canFastForward` (DERIVED) — and stamps the
  whole object `OBSERVED`. Minimum fix: split composite values into per-fact
  observations, or carry per-field epistemic annotation. `DERIVED` is currently
  unreachable: no code path in the corpus sets it.
- **M-04 — Absence is a triple, and ABSENT is earned.**
  `FileObservation.exists: boolean` and `DirectoryObservation.exists: boolean` assert
  nonexistence after any walk, including a degraded, permission-limited, or partial one.
  Required: `presence: "PRESENT" | "ABSENT" | "UNDETERMINED"`, where `ABSENT` requires a
  **completed** enumeration that did not find the subject, and `UNDETERMINED` is
  mandatory whenever enumeration was partial, degraded, or scoped. This is the mechanical
  form of "not-found does not imply does-not-exist" and of L2's `UNRESOLVABLE`.
- **M-05 — Freshness is earned per basis, never from wall-clock or cache age.**
  Implement the declared `freshness-engine`. `CURRENT` requires: every **required** basis
  token resolved, digests compared, derivation identity matched, no owner-defined
  contradiction — with L1 precedence `CONFLICTED > UNRESOLVABLE > STALE > CURRENT`.
  `confirmedAt` may be reported; it must never enter a digest.
- **M-06 — BasisRef is owner-attributed, required-aware, and not a name collision.**
  The engine's `BasisRef` and the L1/L2 `BasisRef` share a name and disagree structurally.
  The engine's shape has no `ownerRef`, no `required`, no `basisId`, no `canonicalRef`,
  no `evidenceRefs`; its `digest` conflates content digest with basis digest and its
  `ref` is a channel-local path. Either make it structurally compatible with L1/L2, or
  rename it (e.g. `SourceRef`) and declare an explicit `toL2BasisRef()` adapter seam.
  A silent same-name-different-shape is the worst available outcome: consumers will
  assume compatibility and the failure will be discovered in a freshness decision.
- **M-07 — "No unknowns" must be a claim the engine can only make by having looked.**
  `getUnavailable()` must not return a literal `[]`; `--agent` must print the real unknown
  count with top-N named reasons; exit codes 1/2 must actually be produced. Today
  `formatAgent` prints `unknowns: ${snap.unavailable.length}` — permanently `0` — into the
  exact text block that gotcha #2 says is injected into an LLM's context window. **This is
  the most dangerous single defect in the package**: the engine affirmatively tells every
  reading agent that nothing is unknown.
- **M-08 — `reality for <cfa-id>` is a resolved, observed projection.**
  Profile paths resolved against the filesystem on every run; each path reported with its
  resolution state; an unresolvable or drifted profile yields explicit `UNRESOLVABLE` with
  a reason, never an empty list. The engine may *verify* a declared profile; it may never
  author its semantic content.
- **M-09 — Self-observation is measured, not asserted.**
  `watcherStatus`, `eventLagMs`, `snapshotDurationMs`, `getUsedBytes`, `getConflicts`,
  `getCollisions`, `getUnavailable` must be real, and `checkAll()` must actually detect
  transitions and emit `OBSERVER_DEGRADED` / `OBSERVER_RECOVERED`. A health block that
  reports HEALTHY by construction is a false World claim about the observer itself, and
  it makes falsifier 13 unanswerable.
- **M-10 — Canonical serialization preserves semantic order and is locale-independent.**
  Only *declared* set-like arrays are sorted, by *declared* stable identity keys, with
  byte/codepoint comparison. `localeCompare` is locale-sensitive and is used in both
  `canonicalSerialize` and `computeBasisDigest`. Ordered arrays — event `seq`, conflict
  observation order, lineage via `previousObservationId` — must retain declared order, per
  L1 §4 rule 4. Also: `canonicalSort` maps `null` → absent, collapsing the explicit-null
  distinction L1 §4 rule 5 preserves.
- **M-11 — The engine never emits a closure verdict.**
  Remove `MECHANICAL VERDICT: READY FOR CLOSURE`; report per-check `{value, status, basis}`
  and leave closure to Phase 5 and the gate. The human formatter currently crosses a
  boundary the type system was written to enforce.
- **M-12 — Reuse D-443 rather than rebuilding a bounded-output convention.**
  The `--agent` block should be `context.assemble@1` semantics (deterministic fold over
  cited sources, digest, named fail-closed eviction) rather than bespoke 800-token
  truncation. Ratified precedent, already in `omega-baseline/.../vivim-run/src/context.ts`.
- **M-13 — Distinct namespaces for machine observation keys and World addresses.**
  `subjectId` must live in a mechanical namespace provably disjoint from World
  `(ns,id)` addresses. Without this the engine silently becomes an identity authority.
  Routed as U-05; this unit recommends the disjoint-namespaces answer and does not decide it.

### 4.1 Corrections this unit must make to gotcha #1 (path canonicalization)

OBSERVED in `gotchas.txt` lines 7–22 — the canonicalizer is directionally right and
materially incomplete:

| Defect | Consequence at this seam |
|---|---|
| `\\?\` prefix stripped, but **no UNC handling** | `\\?\UNC\server\share` collapses to `/server/share`, which is not the form any other component will use. Two spellings of one UNC path, two identities. |
| Only the **drive letter** is lowercased | The engine's own Windows rule is "case-insensitive path comparison". `C:/Dev/BCP-dev` and `C:/dev/BCP-dev` are one file and two identities. |
| **No `.`/`..` normalization** | `C:/a/../b` and `C:/b` are one file and two identities. This is the most likely real-world duplicate generator on Windows. |
| Single string serves as both display and identity | Cosmetic, but it forces a choice between human-readable output and stable identity, and the corpus resolves it wrongly in both directions (`hashPath` lowercases everything; `subjectId` uses the raw root). |
| Consequence stated as "digests will never match → perpetually `STALE` or `CONFLICTED`" | **Incomplete, and the more dangerous consequence is the opposite.** If the same subject is spelled two ways, the engine does not see one subject with two observations — it sees **two subjects**. Nothing conflicts, nothing is stale; both can be served as `CURRENT`. A stale read self-corrects on the next refresh. **A split identity does not.** The engine would manufacture a World containing duplicates, silently, forever. |

## 5. (d) Must-nots (engine authority boundary)

- **N-01 — The engine never asserts World meaning, identity, or equivalence.** It may not
  name what a subject *is*, may not state that two observed things are the same thing, and
  may not state that they are different. It may report only *mechanical* correspondence —
  "these two path spellings resolve to the same file" — and that is a fact about the
  filesystem, not semantic equivalence. One `subjectId` per mechanical subject is the
  ceiling, not a floor.
- **N-02 — The engine never authors a CFA profile's semantics.** It may verify a declared
  `relevantPaths` list and report resolution state. The semantic content of "what is
  relevant to CFA-01" belongs to CFA-01 and is not derivable from a filesystem.
- **N-03 — The engine never resolves ambiguity.** `CONFLICTED` / `AMBIGUOUS` are outputs,
  never inputs to a resolution step. No best-candidate selection anywhere, at any layer.
- **N-04 — The engine never upgrades evidence.** A SHA-256 content digest is content
  identity, not meaning. `confidence` never becomes `proof`; the engine has no confidence
  field and must not grow one without Steward decision.
- **N-05 — The engine never infers meaning from content.** No parser imports in the fs
  observer (gotcha #5 stands). Additionally: the engine must not read the untracked owner
  material in `docs/Reality-engine/` as evidence, and must not treat Git-tracked-ness as
  World-known-ness.
- **N-06 — The engine never becomes a second authority** over Git or any canonical store.
  Invariant 8 stands, and it needs a teeth-check: the corpus's `getCollisions`/`getConflicts`
  stubs mean a conflict would currently be invisible rather than preserved.
- **N-07 — The engine never silently repairs.** No cache regeneration presented as
  observation. `BaseObserver.observe()` returns cached values re-stamped `STALE` on failure,
  which is correct in principle — but only if the caller honours `STALE`; the CLI exits 0
  regardless (F-06).
- **N-08 — The engine never grows scope by observability convenience.** No AST, no graph,
  no "smart" classification. Concretely: process classification by regex is a
  **hypothesis**, and the corpus presents it as a flat `classification` field. It must be
  visibly a label, carry the matching pattern as its basis, be classified DERIVED, and
  default to `unclassified` rather than assert a wrong confident label.
- **N-09 — The engine emits no World vocabulary it did not receive.** No `worldMeaning`, no
  ontology terms, no relationship assertions, no relevance ranking.
- **N-10 — The engine never manufactures a "no change" answer from a failed comparison.**
  Currently `changes(--since snap:...)` returns an empty set because `"evt:..." > "snap:..."`
  is false for every event. An empty result from a mismatched key is indistinguishable from
  a quiet repository, and is a fabricated World state.
- **N-11 (current, operational) — `git add .` in this repository would commit owner
  material.** `docs/Reality-engine/` is untracked and currently shows as `??`. `.dev-reality/`
  must be ignored **before** the engine's first commit, and the engine's own bootstrap must
  never stage the repository. Flagged to the Steward as a live hazard, not a design point.

## 6. (e) Acceptance-criterion additions

Additive to the setup prompt's list; each is phrased so a fresh session can satisfy it
without archaeology.

- **A-01** No two spellings of one subject can produce two `subjectId`s, in the same run or
  across runs, including long-path, UNC, drive-case, and dot-segment variants.
- **A-02** Every emitted `freshness: "CURRENT"` is backed by an inspectable proof record
  (basis digest match + derivation identity + absence of contradiction), retrievable via
  `reality explain <observation-id>`.
- **A-03** The `unknowns` figure in `--agent` output equals the actual number of requested
  scopes that were not fully observed. It is impossible to print `0` without having resolved
  every requested scope.
- **A-04** Canonical serialization is byte-identical across two runs, two machines, and two
  system locales; invariant to insertion order for declared set-like arrays; order-preserving
  for declared ordered arrays.
- **A-05** `basisDigest` is unchanged when an unchanged basis is re-observed, and changes
  when any required basis token changes.
- **A-06** Exit code is `0` only when there are zero unresolved conflicts, zero unknowns, and
  every requested scope resolved; otherwise `1` or `2` per the contract.
- **A-07** `reality for cfa-01` reports a resolution state for every declared path, resolved
  during that run.
- **A-08** Absence is reported as `UNDETERMINED`, never `ABSENT`, after a partial or degraded
  enumeration.
- **A-09** No human-readable output contains a semantic or closure verdict (verifiable by
  string assertion over the formatter).
- **A-10** A fresh session can state its workspace basis, its relationship to the declared
  delivery ref, and what is unknown about both — with no manual Git archaeology and no
  fabricated completeness.

## 7. (f) Falsifier additions

Additive to the prompt's 21. Engine is broken if **any** is true.

- **W-01** A second spelling of a real path yields a second `subjectId`.
- **W-02** A stable basis yields two different `basisDigest` values across two observations
  (timestamp or incidental-field leakage into the digest).
- **W-03** Canonicalization run under two system locales produces different bytes
  (`localeCompare` is locale-sensitive; it is used in both the serializer and the digest).
- **W-04** An array whose order is semantic — event `seq`, conflict observation order,
  `previousObservationId` lineage — changes order after canonical serialization.
- **W-05** `freshness: "CURRENT"` is emitted with no retrievable proof, or `reality explain`
  cannot produce the proof.
- **W-06** Any observation reports `status: "OBSERVED"` for a value computed from other
  observations (composite/derived leakage).
- **W-07** Nonexistence is asserted after a degraded, partial, or permission-limited enumeration.
- **W-08** The engine cannot represent `PROPOSED`, and a consumer is observed inventing it
  outside the engine.
- **W-09** `--agent` output reports `unknowns: 0` while any requested scope was unresolved.
- **W-10** Exit code `0` is returned with unresolved conflicts or unknowns present.
- **W-11** A hand-authored CFA profile path is renamed and the projection silently returns an
  empty result instead of an explicit `UNRESOLVABLE`.
- **W-12** `basisDigest` or workspace identity is a non-cryptographic hash (demonstrated with
  two constructed colliding inputs), or `PATH_AMBIGUITY` detection is unreachable.
- **W-13** Pre-closure reports a mechanical fact it did not observe.
- **W-14** Any output states a semantic or closure verdict.
- **W-15** The health block reports HEALTHY while an observer is demonstrably degraded.
- **W-16** `reality for <cfa-id>` returns non-empty without having resolved every declared
  path during that run.
- **W-17** Divergence counters are reported as meaningful when the two refs share **no merge
  base**. `git rev-list --left-right --count` still returns plausible numbers in that case;
  the correct result is `UNRESOLVABLE` / `INCOMPARABLE`. (Demonstrated live in §0.)
- **W-18** `changes --since <snapshot-id>` returns an empty set for a reason other than "no
  changes occurred" — including key-prefix mismatch.
- **W-19** A pattern-derived label (e.g. `classification: "test-runner"`) is reported as an
  observed property of the process rather than as a derived hypothesis with a basis.

## 8. (g) Gotcha additions

Additive to `gotchas.txt`. Each is a trap that will present as a correct-looking result.

- **G-06 — The timestamp-in-digest trap.** `BasisRef.confirmedAt` changes on every
  observation and the corpus folds it into `computeBasisDigest`. The digest is then a
  function of *basis + observation time*, not of basis identity, so it changes whenever
  nothing changed. The digest cannot serve as a freshness comparison token. Keep
  `confirmedAt` in the report; keep it out of the digest (L1 §4 rule 7). This is a
  *different* cause of perpetual `STALE` than gotcha #1, and it survives a perfect path
  canonicalizer.
- **G-07 — The order-destroying canonicalizer.** Sorting every array by serialized form
  silently rewrites lineage, event order, and conflict precedence. The dangerous part is
  that the output is still valid JSON and still looks correct; only the *meaning* moved.
- **G-08 — The 32-bit identity hash.** The corpus contains two distinct 32-bit string
  accumulators (`hashPath`, `computeBasisDigest`), both with a "use crypto in production"
  comment. A declared `PATH_AMBIGUITY` detector built on a 32-bit key has an enormous
  collision surface, and with `getCollisions()` returning `[]` the detector is unreachable
  in any case.
- **G-09 — Absence is not a boolean.** `exists: false` after a failed walk asserts
  nonexistence. The failure is silent and the assertion is confident.
- **G-10 — The green exit code.** Unconditional `process.exit(0)` means every automation
  that gates on exit status reads a `CONFLICTED`, partially-observed world as clean. The
  exit code is itself a claim about the world, and it is the claim most likely to be
  consumed by something that cannot read the JSON.
- **G-11 — The ID-prefix comparison trap.** `evt:` and `snap:` prefixed UUIDv7 strings are
  compared lexicographically. Passing a snapshot id as a "since" cursor filters everything
  out and returns "no changes" — a fabricated World state from a real query.
- **G-12 — The enum gap.** The engine's epistemic enum has no `PROPOSED`; the team's has no
  `UNOBSERVABLE`. Consumers bridge the gap themselves, and every bridge is an ungoverned
  semantic decision made in the least governed place. See §10.
- **G-13 — The declared-but-absent module trap.** The file tree lists `basis-engine.ts`,
  `freshness-engine.ts`, and the path canonicalizer; none is written. A reader who trusts
  the tree concludes that freshness is proven, conflicts are preserved, and identity is
  canonical. None of that is true. Treat a design document's file list as a *claim about
  intent*, never as an inventory of behavior.
- **G-14 — The staging hazard.** `.dev-reality/` must be gitignored before the first engine
  commit, and in *this* repository `docs/Reality-engine/` is untracked owner material that
  a `git add .` would capture. Agent instruction: add explicit paths, always.
- **G-15 — The static CFA profile drift.** A hand-authored `relevantPaths` list is an
  address written by hand and never verified. Renames make it wrong; nothing makes it loud.
  Resolve and report per-path resolution state on every run.
- **G-16 — The verdict in the formatter.** `MECHANICAL VERDICT: READY FOR CLOSURE` is
  emitted by the human formatter, past a boundary the type system was written to enforce.
  Boundary crossings happen in presentation code, not in types.
- **G-17 — The stub that reads as a guarantee.** A declared type, a declared event, a
  declared error code, and a declared CLI command are all *claims*. In this corpus the
  stubs returning `[]`/`0`/`true` are more dangerous than absence, because absence is
  visible and a plausible-looking value is not.

## 9. Epistemic-vocabulary reconciliation (REQUIRED — not unilaterally decided here)

Two vocabularies exist. This unit does not redefine either. It states what must be
reconciled, by whom, and what it must not collapse.

OBSERVED — engine (`setup prompt.txt:174`, corpus `types.ts:195–200`):

```text
EpistemicStatus : OBSERVED | DERIVED | UNKNOWN | UNOBSERVABLE | CONFLICTED
FreshnessStatus : CURRENT   | STALE   | UNRESOLVABLE
```

OBSERVED — team (`STAGE-E-L1-...CONTRACT-2026-09-27.md:215`, `CORE-AGENT.md:104`,
`CFA-DOMAIN-ROADMAP-FORMATION-PROTOCOL-2026-09-27.md:133`, `CURRENT-MISSION.md:53`):

```text
EpistemicStatus : OBSERVED | DERIVED | PROPOSED | UNKNOWN | CONFLICTED
FreshnessState  : CURRENT  | STALE   | CONFLICTED | UNRESOLVABLE
```

OBSERVED — this unit's own closed resolutions: L2 uses `(ns,id,rev)`; M2 uses
`RESOLVED | AMBIGUOUS | STALE | UNRESOLVABLE | CONFLICTED`.

**Concrete divergences (not cosmetic):**

| # | Divergence | Consequence |
|---|---|---|
| D-1 | `CONFLICTED` is an *epistemic* state in the engine and a *freshness* state in L1. | The engine can emit a `CONFLICTED` observation carrying `freshness: "CURRENT"`, and `computeOverallFreshness` (corpus 1770–1778) inspects only `freshness`, so a conflicted snapshot reports `CURRENT`. Precedence is wrong at the one place it is consumed. |
| D-2 | Engine `UNKNOWN` conflates "not yet observed" with L1's `UNRESOLVABLE` (a *freshness* state about a required basis). | A missing required basis and an un-run observer become the same word. L1 §5 requires them distinct: one is epistemic, one is freshness. |
| D-3 | `PROPOSED` exists in the team vocabulary and is unreachable in the engine. | Consumers invent it (see W-08). A pattern-derived label is the exact case that needs it. |
| D-4 | `AMBIGUOUS` (this unit's M2 five-state resolver) has no home on either engine axis. | "These observations disagree" and "which subject was meant is undetermined" are different, and only the first is representable. Conflating them forces a consumer to either resolve ambiguity or drop it — both forbidden. |
| D-5 | The engine collapses the two axes in practice. | `Observation.status` and `Observation.freshness` are separate fields, but snapshot-level freshness is computed from member freshness while ignoring member status entirely. |

**Reconciliation this unit requires (PROPOSED — for Steward + named owners to ratify):**

1. **Keep both axes orthogonal and both named.** L1 §5 already forbids collapsing them; the
   implementation must honour that rather than the reverse. No single merged enum.
2. **Do not add an epistemic state to the engine to close D-3.** The cheaper and more
   faithful fix keeps the team's five-state vocabulary intact: the engine emits the
   *observed* string and a *derived* label, and the projection maps them — a regex match is
   `OBSERVED` (the command line was observed) plus a derived, basis-carrying label that
   may not be described as `PROPOSED`, because that state is not available to it. Adding
   `PROPOSED` to the engine's enum would be a change to the shared vocabulary and is
   **not this unit's to make**; it is routed as U-04.
3. **Close D-2 by qualifying, not by adding.** `UNKNOWN` stays one team state and carries a
   `reason` discriminator — `not-yet-observed` | `unobservable-in-this-environment` |
   `required-basis-missing` — mapping cleanly onto the engine's `UNKNOWN` and
   `UNOBSERVABLE` and onto L1's `UNRESOLVABLE`. No new state on either side.
4. **Close D-1 by putting `CONFLICTED` in both axes, with L1 precedence**, and by making it
   impossible for a `CONFLICTED` observation to carry `freshness: "CURRENT"`.
5. **Close D-4 by giving ambiguity a home in a resolution axis** — distinct from the
   conflict axis. This unit proposes `AMBIGUOUS` for the World-reference axis and a
   mechanical analogue (`MULTI_MATCH`) for observation keys, and flags the *naming* as
   U-12 rather than deciding it.
6. **Publication rule.** The engine emits its own 5+3. The team-facing projection
   (`reality for <cfa-id>`, receipts, `RESULTS/`) carries an explicit, versioned mapping to
   the team's 5+4. Any state with no mapping becomes `UNKNOWN` + reason. **Mapping is a
   projection, never an identity** — an engine state is not a team state, and the
   difference is a fact, not a defect.
7. **Who decides:** vocabulary changes are Steward/owner decisions. This unit's role is to
   surface the divergence, state the seam, and refuse to let it be closed silently at a
   consumer.

## 10. Unknowns with named owners

No entry below is filled by this unit. Each is routed.

| ID | Unknown | Owner | CFA-01 position |
|---|---|---|---|
| U-01 | Which `BasisRef` shape is canonical for the engine — adopt L1/L2 structurally, or rename and add an adapter seam? | CFA-02 (normalization) + Architecture Steward (contract); CFA-01 proposes; CFA-09 owns the compatibility envelope | Rename + explicit adapter is safer than a silent shared name |
| U-02 | Is the engine a *replacement* for, or a *provider of* the `reality-cache` `BasisRef` consumed by the L1 freshness engine? | CFA-09 (envelope) + CFA-10 (runtime guarantees) | Provider, never replacement |
| U-03 | Absence semantics as a first-class World concept: does `ABSENT` require a completed enumeration, and is "completed" owner-defined per domain? | CFA-01 proposes; CFA-04 (may a nonexistence conclusion be made under this authority) + CFA-09 (delete/recreate races) | Engine may report UNDETERMINED freely; `ABSENT` is a governed claim |
| U-04 | Is `PROPOSED` representable in a machine observation pipeline? | CFA-01 + CFA-03 (meaning/grounding) + Steward | Engine emits observed + derived label; no new state without ratification |
| U-05 | **Sharpest boundary question:** should `subjectId` be a canonical World address, or a purely mechanical observation key? | CFA-01 (World address meaning) + CFA-02 (durable record identity) + Steward | Disjoint mechanical namespace. A World address here would make the engine an identity authority (N-01) |
| U-06 | Is a Git-untracked, absent file World-absent, or merely unrecorded by Git? | CFA-09 (tracked ≠ canonically known) + CFA-01 | Different questions; must not share one boolean |
| U-07 | Does `.dev-reality/` count as canonical store, cache, or evidence — i.e. what are its retention and "no second authority" properties? | CFA-02 (store classification) + CFA-04 (retention/authority) | Cache. Never canonical. Retention must be lossless for unresolved conflicts |
| U-08 | May the engine install Git hooks in the owner's repository (`reality hooks install`)? Who owns install/uninstall? | CFA-04 (consent for mutating the user's repo) + CFA-10 (runtime observation surface) | Requires explicit authorization; hooks write into `.git/hooks` |
| U-09 | What is the actual OpenCode integration surface — process-observation, filesystem-session, or API? | CFA-05 (worker liveness) + CFA-10 | Corpus asserts `process-observation` with no supporting evidence |
| U-10 | Is the 800-token `--agent` bound compatible with D-443 `context.assemble@1` eviction, or should `--agent` simply *be* a D-443 assembly over cited observations? | CFA-01 proposes reuse; CFA-03 owns the grounding/assembly boundary | Reuse (M-12) |
| U-11 | Should `Validate-Receipt.ps1` consume the engine for `TARGET_REF` / `BASE_MAIN_SHA` verification? | CFA-10 (enforcement ledger) + Steward | Today it does not; the validator lives at `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/tools/Validate-Receipt.ps1` and no root `tools/` exists |
| U-12 | Is `PATH_AMBIGUITY` the right type name, or must it separate "two subjects, one key" (engine defect) from "one subject, many keys" (M2 `AMBIGUOUS`)? | CFA-01, with CFA-09 compatibility | Conflating them puts a World resolution state inside an engine error taxonomy |
| U-13 | Is the 2,710-line scaffold now evidence to preserve, or disposable? | Owner + Steward | The folder is untracked owner material; divergence from it must be *recorded*, not silently applied. If the version we need replaces it, the replacement's lineage should cite it |
| U-14 | What is the honest relationship between the engine's snapshot and the Session Result Contract's `TARGET_REF` / `BASE_MAIN_SHA`? | CFA-05 (work lifecycle) + CFA-10 + Steward | A snapshot is not a receipt; a receipt is not a snapshot. Neither may stand in for the other |

## 11. Evidence classification of this document

| Claim | Class |
|---|---|
| Base-ref/branch divergence, untracked owner material, absent `dev-reality/`, absent named synthesis path | OBSERVED this session |
| Declared-but-absent modules; hardcoded `CURRENT`/`OBSERVED`; `getUnavailable`/`getConflicts`/`getCollisions`/`getUsedBytes` stubs; `checkAll()` empty; `for` command unreachable; hardcoded preclosure `true`s; unconditional `exit(0)`; `evt:`/`snap:` comparison; `exists: boolean`; `localeCompare`; 32-bit hashes; `confirmedAt` inside the digest; static `relevantPaths` | OBSERVED in the owner corpus |
| All W-01..W-19 falsifiers, M-01..M-13, N-01..N-11, G-06..G-17, the hybrid scope verdict, the 2.4 refined contract, the §9 reconciliation requirement | PROPOSED |
| D-1..D-5 vocabulary divergences and their consequences | DERIVED from two OBSERVED vocabularies |
| U-01..U-14 | UNKNOWN, routed with named owners |
| That the pragmatic Blueprint contradicts gotcha #4 on index storage | DERIVED (both documents read this session) |
| That the corpus's "Full Working Core" is not a working implementation of the specification | DERIVED from the inventory in §1 |

## 12. Boundaries and non-actions taken this session

- No Ω law touched. `CURRENT-INVARIANTS.md`, `BUILD-DECISIONS.md`, D-records untouched.
- No implementation, no code, no `dev-reality/` directory created.
- No central synthesis attempted; the ten-CFA reconciliation is Steward-owned.
- No shared CFA boundary activated.
- `docs/Reality-engine/` read only — not committed, not edited, not moved, not staged.
  (Live hazard N-11/G-14 noted: it is untracked, so a careless `git add .` would capture it.)
- Peer homes untouched. Peer uncommitted modifications in the primary worktree untouched.
- Peer-homed unknowns routed by name, not by writing into peer homes.

## 13. What this unit asks the Steward to decide

1. Accept or reject the **hybrid increment order** in §3.1 — in particular, that
   truthfulness infrastructure lands in increment 1a and gates 1b and 1c.
2. Accept or reject the **cut list** in §3.2 (these are defects, not deferrals).
3. Ratify or reject the **vocabulary reconciliation shape** in §9 (two orthogonal axes,
   qualification over new states, mapping-is-projection).
4. Route **U-05** (mechanical `subjectId` namespace vs World address) — this is the one
   that decides whether the engine is an observation substrate or a quiet identity authority.
5. Assign **U-03, U-07, U-08** to their named owners before increment 1a is implemented,
   because all three change what the engine is allowed to assert.
