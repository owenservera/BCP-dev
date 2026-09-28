# CFA-02 — Reality Engine Design Input (Data / Identity / Persistence lens)

> Date: 2026-09-28
> CFA: CFA-02 — Data Steward · Core Function Area: Data / Identity / Persistence
> agent_id: `data-model`
> Identity: **RATIFIED — OWNER-ALIGNED**
> Unit: DESIGN INPUT. MODE=DELIBERATE. SURFACE=LOCAL. No code, no implementation, no central synthesis, no decision on a peer's seam.
> Classification: proposal / characterization from one owner lens. Not Ω law. Not a shared-boundary activation. Not an implementation authorization.
> Write scope: CFA-02 home only.
> Owner material read (UNTRACKED, read-only, never committed / edited / moved / staged): `docs/Reality-engine/Blueprint.txt`, `docs/Reality-engine/gotchas.txt`, `docs/Reality-engine/setup prompt.txt`, `docs/Reality-engine/# Reality Engine — Full Working Cor.txt`.

**Central question of this lens (CFA-02 `CORE-AGENT.md`):** *what is this data, what identity and lineage does it carry, what is durable or derived, and can the durable meaning still be faithfully reconstructed when the implementation changes?*

Applied to the Reality Engine, that becomes: **what does the engine persist, what is the identity of a persisted thing, and can any of it be reconstructed from the engine's own bytes?** The engine's whole value proposition is reconstructability of *machine* truth. An engine that cannot export, cannot replay its own journal, and cannot prove a fresh observation is not the one it cached, is a *new* source of stale lies — a strictly worse position than the 51 legacy devops scripts it replaces, because it *looks* authoritative.

---

## 0. Base-ref reconciliation and delivery path (OBSERVED)

Recorded because the unit's own instruction required re-resolving main, and re-resolving it changed the delivery path materially.

| Item | Value | Class |
|---|---|---|
| Base ref given at spawn | `edfe49b1d2cc871fabcc0b3388128f956db908ff` | OBSERVED |
| Session worktree branch at session start | `team/omega-endstate` at `ff8e141a4a611ddaa6a35315e71557832cef2a5d` | OBSERVED |
| `main` is an ancestor of the session worktree HEAD | **no** (exit 1) — the worktree branch diverged from `main` | OBSERVED |
| `main` tip this session (local, after `git fetch origin main`) | `83eca7a721d28387913e9f8ec3ba21218e8fa52e` | OBSERVED |
| `main` tip = CFA-01's main-lineage delivery commit | yes — `CFA-01: reality-engine input receipt + TASKS closure` | OBSERVED |
| Peer CFA-01 input artifact present on `main` | `SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/REALITY-ENGINE-INPUT-20260928.md` | OBSERVED |
| Synthesis `LOCAL-TEAM-TOOLSET-SYNTHESIS-20260928.md` present in the **session** worktree | **no** — exists only on `main`'s lineage | OBSERVED |
| Uncommitted peer/owner work in the primary worktree | `M omega-baseline/omega-final/build/status.json`; untracked `OmegaBuildBootstrap.txt`, `docs/Reality-engine/`, `local-team.md`, `session-ses_f1fc.md` | OBSERVED |
| Registered worktrees (this machine) | 3: `BCP-dev` (`team/omega-endstate`), `BCP-dev-steward` (`steward/session-work`), `…/STEW-01-bootstrap-team` | OBSERVED |

**DERIVED:** the session worktree is on a divergent lineage that does not contain `main` and does not contain the synthesis or the peer's input. Committing there would have made the mandated "verify by re-reading the delivery ref" verification impossible, and would have stranded this unit's artifacts on a branch `main` does not contain.

**Resolution taken (procedure, not authority):** delivery performed in a dedicated git worktree branched from current `main` (`83eca7a7`), on `work/data-model/CFA02-REALITY-INPUT`, fast-forwarding `main` afterwards. No force-move, no merge of a peer branch, no staging of untracked owner material, no `git add .`.

**This is a durability finding, not boilerplate — see D-06 and DUR-11.** The engine's storage design has **no engine-instance identity, no workspace discriminator, and no cross-restart sequence**. Three registered worktrees of one repository on this machine is the normal condition, not an edge case, and the engine's declared layout is a single unnamespaced `.dev-reality/` tree.

---

## 1. What this lens adds that the world/context lens does not

CFA-01 (independently, in parallel) has already established the world/context findings: path identity, `subjectId` namespace, `CURRENT`-is-earned, absence-as-triple, canonical serialization order, `for` unreachable, `getUnavailable()` returning `[]`, unconditional `exit(0)`, `--agent` printing `unknowns: 0`. **I agree with every one of those and do not restate them.**

This lens contributes the layer underneath all of them, which CFA-01 did not cover and which the owner corpus does not contain at all:

1. **The engine has no durability layer.** Not "a weak one" — the specification's entire storage section (setup prompt lines 403–434) is a *directory listing*. There is no write atomicity, no fsync, no write-ahead discipline, no journal replay, no reference integrity, no retention semantics, no export, no read-side schema validation, no engine-instance identity, and no storage-class declaration. Storage is scheduled as **Slice 6, week 6 of 10**.
2. **The engine mints record identity from display paths and non-deterministic UUIDs.** A demonstrable identity fork exists *in the scaffold today* (§3.2, O-09). This is the mechanical dress of the failure signal already named in this home's `STATE.md`: *"provider identity is used as canonical identity."*
3. **Gotcha #4 is correct about concurrency and silent about durability.** It gives a correct store-selection rule and never says which artifact is *durable*. That omission decides whether the engine is safe to prune, safe to export, and safe to reconstruct.
4. **The engine cannot describe this team's own durable data.** There is no field anywhere in the snapshot schema that can carry a canonical record revision reference. For the Data Steward's own lane this is the top must-have, and it is the question CFA-01 routed as `U-01` — which **this unit claims and answers**.

---

## 2. (a) The setup prompt's CFA-02 sketch — validate / refine / reject

The sketch under review (setup prompt lines 66–69):

```text
### CFA-02 Data Model
- Needs: physical schema/migration state, artifact freshness
- Queries: `reality for cfa-02` → schema files, migration drift, client freshness
- DO NOT: interpret schema meaning
```

### 2.1 Verdict summary

| Element | Verdict | One-line reason |
|---|---|---|
| `DO NOT: interpret schema meaning` | **VALID — strengthen** | Correct and load-bearing. It is the only line in the sketch that is currently enforced by anything. It needs two siblings: never interpret *migration* meaning (CFA-09), never emit a *continuity verdict* (this CFA's own M4). |
| `Needs: … artifact freshness` | **VALID — split three ways** | "Artifact freshness" is three questions with three different bases, and only one of them is the engine's to answer. |
| `Needs: … physical schema/migration state` | **PARTIALLY VALID — half is a governed claim** | *Physical schema-artifact state* is mechanically observable and in scope. *Migration state* is a CFA-09 semantic determination the engine is structurally unable to make and is forbidden from approximating. |
| `Queries: reality for cfa-02 → schema files` | **VALID after resolution discipline** | Physical existence/digest/revision of a declared path is observable. A hand-authored path list resolved silently-empty is not (shared with CFA-01 `W-11`, extended here in §6). |
| `Queries: … migration drift` | **REJECT AS SPECIFIED** | Not mechanically observable by an engine with no schema registry. Must be `UNRESOLVABLE` with a named reason until a CFA-02/CFA-09-owned migration-state artifact exists (routed as `DU-05`). |
| `Queries: … client freshness` | **REJECT AS SPECIFIED** | Category error against a local-only, no-network engine. Also duplicates the closed L2 adapter, which already owns derived-view freshness. |
| Existence of `reality for cfa-02` at all | **NOT IMPLEMENTED (OBSERVED)** | `for` is in the CLI `COMMANDS` map (corpus 2148) and in the CLI contract (setup prompt 480) but has **no `case` in the switch** → falls to `default:` → exit 3 (corpus 2234–2238). `cfaProfiles: []` (corpus 2619); `cli/commands/for-cfa.ts` and `agent/cfa-profiles.ts` are declared (corpus 84, 96) and never written. |

### 2.2 "physical schema/migration state" — split at the physical/semantic seam (REFINE)

The phrase bundles one observation with one judgment.

- **Observable (keep, and specify):** for a declared schema artifact at path `P` — does it exist, at what git revision `R`, with what content digest `D`, at what size/mtime, and does the engine's own `schemaVersion` `S` match any version declaration found *inside* the artifact **as an opaque token** (not as a parsed schema).
- **Not observable (reject):** *migration drift*. Determining that `R`'s schema differs from `S` in a migration-relevant way requires (i) a registry of what schemas are expected, (ii) a schema grammar, (iii) an instance-vs-declaration comparison. The spec has none of the three. Worse, parsing a schema to compare it is exactly the semantic inference the engine's own anti-goals forbid ("no architecture inference from folders, imports, names"; gotcha #5's parse ban). **The engine may report the two tokens and their inequality. It may not name the inequality a migration.**

**Required refinement (PROPOSED):** `reality for cfa-02` reports `schemaArtifacts[]` (physical facts, each with `path`, `resolution`, `contentDigest`, `digestKind: "content-not-revision"`, `gitRevision`, `artifactClass`) and reports `migrationState: { status: "UNRESOLVABLE", reason: "no-migration-state-artifact", requiredOwner: "cfa-09+cfa-02" }` until §2.2's artifact exists. `migrationState` is a first-class field so that its absence is *visible* rather than *missing*.

### 2.3 "artifact freshness" — three questions, three bases (REFINE)

| # | Question | Engine's answer? | Basis that must be compared |
|---|---|---|---|
| 1 | Is *this observation* fresh (was the basis re-read in this run)? | **Yes** — the engine's own job | basis token vs the token re-read now |
| 2 | Is *the engine's own persisted state* (snapshots, journal, indexes) intact and non-superseded? | **Yes, and currently unanswerable** | persisted artifact digest + journal replay completeness (§4) |
| 3 | Is a *derived view of durable product data* fresh? | **No — already closed elsewhere** | `(ns,id,rev)` + optional `cid`, per the closed adapter `cfa02.data-continuity.revision-basis@1` |

Question 3 is the closed Stage-E L2 characterization in this home (`STAGE-E-L2-CFA02-DATA-CONTINUITY-BASIS-ADAPTER-CHARACTERIZATION-2026-09-28.md` §5, §6, §7). **The engine must cite that adapter, not reimplement it, and must not grow a competing freshness rule.** If `reality for cfa-02` computes derived-view freshness itself, the engine has become a second freshness authority — the exact thing L2 was written to avoid.

### 2.4 "client freshness" — REJECT (category error + duplication)

The spec is local-first, no cloud, no network, no external APIs (setup prompt lines 46–56). "Client" has no referent in the engine's observation scope. Two candidate referents, both wrong:

- *a network client* — out of scope by boundary, and observing one would require the network substrate the spec forbids;
- *a consumer's projection of engine data* — outside the engine's observation scope **and** outside its ownership. The engine cannot know what projections exist, and a consumer-side projection is by definition a derived view whose freshness is that consumer's to establish (CFA-01, CFA-03, CFA-08 depending on the projection).

**Required substitution (PROPOSAL):** replace "client freshness" with **"engine-artifact freshness"** = question 2 above. This is in-scope, mechanically decidable, and it is the freshness the team actually needs from this tool.

### 2.5 `DO NOT: interpret schema meaning` — VALID, strengthened to three (PROPOSED)

```text
reality for cfa-02 MUST NOT:
  - interpret schema meaning, or name what a schema MEANS   (CFA-01 semantics)
  - name whether a schema difference is a MIGRATION          (CFA-09 change semantics)
  - emit a continuity / reconstructability VERDICT           (CFA-02 M4, M5)
It MUST report, per artifact: existence, content digest (+ kind), git revision,
size, mtime, declared version token as an opaque string, and artifact class.
```

The third prohibition matters and is missing from the whole corpus. `formatPreclosureHuman` already emits `MECHANICAL VERDICT: READY FOR CLOSURE` (corpus 2412–2414) — CFA-01 flagged the string. From this lens the deeper defect is that a **verdict field has no `EpistemicStatus` and no `basis`**, so it cannot be reported as derived-from-observations. Any boolean the engine emits must be a *fact about a named subject* with a basis, not a *judgment about readiness*. This is the durable-shape half of the same problem.

### 2.6 Refined `reality for cfa-02` contract (PROPOSAL — characterization, not code)

```text
reality for cfa-02
  engineArtifacts     : [ { path, artifactClass: CANONICAL_DOC | RUNTIME_STATE | BUILD_OUTPUT
                            | UNTRACKED_MATERIAL | UNKNOWN,
                            resolution: PRESENT | ABSENT | UNRESOLVABLE,
                            contentDigest?, digestKind: "content-not-revision",
                            gitRevision?, sizeBytes?, mtime? } ]
  engineSchema        : { engineVersion: S, storageClassDeclared: boolean,
                          readValidationPerformed: boolean, migrationTooling: "none" }
  migrationState      : { status: "UNRESOLVABLE", reason, requiredOwner }     # until DU-05 resolves
  artifactFreshness   : { snapshotDigestVerified, journalReplayComplete,
                          indexRebuildableFromJournal, referencesIntact }   # all with basis
  durableDataBasis    : { adapter: "cfa02.data-continuity.revision-basis@1",
                          status: CHARACTERIZED, runtimeJoin: UNKNOWN,
                          explicitlyNot: [ (ns,id,rev) minting, cid minting,
                                           continuity verdicts, authority evaluation ] }
  conflicts[]         : preserved, never resolved
  unknowns[]          : named, with reasons
  explicitlyAbsent    : schema meaning, migration naming, identity meaning,
                        client/network observation, second store, second identity registry
```

`artifactClass` is load-bearing and is **this unit's** addition to the shared profile shape. A path list that resolves `build/status.json` (which is *modified and uncommitted* in this repository right now) or untracked owner material, and reports only its digest, hands the consumer a number that reads as a data-plane fact. See **G-27**.

---

## 3. (b) Scope verdict

### 3.1 Verdict: **HYBRID — and the increments must be reordered around durability, not around truthfulness**

CFA-01 independently reached "hybrid, truthfulness floor first". **I agree with the verdict and refine the boundaries**, because the hybrid is currently under-specified in a way that would still ship an engine with no durability layer.

Both pure options fail, for one shared reason: **the persistence contract is assumed rather than specified.**

| Option | What it gets right | Why rejected (this lens) |
|---|---|---|
| **A. Pragmatic-v1 Waves 0–3** (`Blueprint.txt`) | Correct first atom; honest deferral table; explicit "not authoritative"; zero-dependency discipline. | Its storage design is `.dev-reality/{snapshots/latest.json, events.jsonl, basis-cache.json}` (Blueprint 157–164). `basis-cache.json` is **exactly the mutable JSON index gotcha #4 forbids**. Its deferral table (Blueprint 267–280) lists *schema versioning*, *content hashing*, *event replay/recovery* as deferrable and never mentions atomicity, retention, reference integrity, or export — because the Blueprint has no concept of a durable artifact. Shipping Wave 1 with a mutable JSON cache and no atomic write produces a file that is *sometimes* right. |
| **B. Full Phase-1 Slices 1–9** (`setup prompt.txt`) | Correct law. Invariants, taxonomy, falsifiers, truthfulness tests, anti-goals are genuinely reusable nearly verbatim. | Slice 6 — "Storage + Restart + Audit Trail" — is **week 6 of 10**, and it is the slice that contains everything in §4. Weeks 1–5 write snapshots and events with a `writeFile` and no atomicity, no instance identity, and no replay. Ordering is the defect, not content. |
| **C. Hybrid (recommended)** | Keeps A's first atom and B's law; moves B's *truthfulness* floor (per CFA-01) **and** B's *durability* floor (§4) into increment 1a. | — |

### 3.2 Recommended increments

```text
Phase-1a  DURABLE TRUTH FLOOR                             (B-Slice1 + CFA-01's 1a + §4)
  persistence contract WRITTEN FIRST, as a document, before any observer writes a byte:
    artifact classes + storageClass per class
    atomic write discipline (tmp -> fsync -> rename) for every file
    single durable root: the append-only event journal
    engineInstanceId on every event and snapshot; seq scoped (engineInstanceId, seq)
    one source for schemaVersion; read-side refusal on unknown version
    reference-aware retention rule (reachability, not age)
    export + verify-export contract (no absolute-path dependence)
  then: canonical path identity; basis/freshness engines actually implemented;
        Git observer only, with real freshness proof; SHA-256 digests, no timestamps;
        exit codes 0-5; bun:sqlite for mutable indexes, JSONL for the journal,
        canonical JSON for immutable snapshot documents
  MUST PASS before any other increment merges: T01, T04, T06, T07, T15, T16-T23,
        W01-W05, W17, DUR-01..DUR-08
  gate: no increment 1b/1c code merges while any of the above fails

Phase-1b  IDENTITY, ABSENCE, CONFLICT                    (B-Slice3 + B-Slice6-minus-daemon)
  two identities: occurrence (uuidv7) + subject-state (content-derived) — see §4
  process observer with PID + startTime generation token; lock identity to match
  ID_PID_FORK detection on the canonical subject function (not on paths)
  presence triple (PRESENT | ABSENT | UNDETERMINED)
  conflict persistence in the JOURNAL (index is a rebuildable projection)
  `reality for <cfa-id>` with per-path resolution + artifactClass + observed profile resolution

Phase-1c  VERIFICATION HONESTY                           (B-Slice5 + B-Slice8-minus-daemon)
  execution envelopes; executionAxis orthogonal to resultAxis
  preclosure reports {value, status, basis}; the closure VERDICT field is removed
  divergence including INCOMPARABLE; writer contention
  ref-identity discipline: every "is X on main" field names WHICH main it measured

Deferred out of Phase 1: daemon; recursive fs watcher; backpressure machinery;
schema *migration* tooling (read-side *refusal* is kept, see §5.2); OpenCode API
integration; fs Level-C content reads; the separate durable `observations/` store.
```

### 3.3 Cut / defer list, with reasons (durability lens specifically)

| Item | Action | Reason |
|---|---|---|
| Daemon (Slice 9) | **defer** | Agrees with CFA-01 on cost. Durability-specific reason: a long-lived writer is the only configuration in which a torn write becomes likely and an unbounded journal becomes real. On-demand + git hooks keeps the writer count at one and short-lived. |
| Recursive fs watcher (Slice 2) | **defer** | Agrees with CFA-01. Durability-specific reason, and it is the reason CFA-01 did not have: the watcher is the **largest unbounded producer into the journal**, on the least reliable Windows primitive. Every fs event becomes a durable record that must survive replay. Deferring the watcher is deferring the journal's largest integrity risk. |
| `observations/obs_<id>.json` as a durable store | **defer / derive** | A third copy of facts already in the journal and in snapshots. Three copies of one fact is a lineage hazard with no retrieval benefit: the journal plus the snapshot archives reconstruct any observation exactly. Make `observations/` a *projection*, or drop it. |
| `indexes/*.json` as files | **cut; use `bun:sqlite`** | Agrees with gotcha #4. **But see §4.2 — the index must be declared rebuildable-from-journal before it is allowed to be an index.** |
| `latest.json` as a document | **cut outright** | Defect, not a deferral. See **O-06** and **G-25**. |
| Atomic write / tmp+rename | **must NOT be deferred** | Without it, "restart lineage" (T09) is unfalsifiable in the direction that matters: a torn write is indistinguishable from a quiet repository. |
| Engine-instance identity | **must NOT be deferred** | Without it the journal is an unattributed bag of records with a per-process sequence. See **O-04**, **G-26**. |
| Reference-aware retention | **must NOT be deferred** | Age-based pruning is the one deferred item that *destroys evidence*. See §4.4. |
| Export / verify-export | **must NOT be deferred** | Not a luxury. Falsifier 7 ("loses observation lineage after restart") is currently unanswerable for *portable* loss without it. See §4.5. |
| Schema **migration** tooling | **cut, keep read-side refusal** | Agrees with CFA-01. **Refinement:** cutting migration tooling must not become cutting *validation*. Falsifier 16 ("cannot recover from schema version mismatch") is only answerable if unknown versions are **refused on read** with a named code. Migration and refusal are different things; only one is cut. |
| `getUsedBytes(): 0` | **cut outright** | Defect. `maxDiskMb: 500` is unenforced config that reads as a guarantee (same class as CFA-01's **G-17**). |
| `preclosure` hardcoded `true`s | **cut outright** | Defect (corpus 1639–1643). See also §4.6 — the one check it *does* compute uses the wrong ref. |
| `schemaVersion` in three places with no single source | **cut outright to one** | See **O-07**, **G-20**. |

---

## 4. (c) Must-haves at the CFA-02 seam

Each is a precondition for a *durable* substrate. None requires Ω law or a boundary activation.

### 4.1 Snapshot schema and canonical serialization — review verdict

**REJECT the serializer as written; it is not injective and it is not total.**

OBSERVED, corpus `src/core/serialization.ts`:

- line 2498: `return JSON.stringify(canonicalSort(value), null, 2)` — pretty-printed, so the on-disk bytes carry a free whitespace variable that a future non-canonical writer can differ on. Not fatal, but it makes byte-comparison a *format* check rather than an *identity* check.
- line 2502: `if (value === null || value === undefined) return undefined` — **explicit `null` is collapsed into absent.** `parse ∘ serialize` is therefore not the identity. The engine's own types mostly use `?` (absent) rather than `null`, so the immediate blast radius is small — which is exactly what makes it dangerous. It is invisible until a consumer distinguishes "explicitly null" from "absent", at which point the loss is unrecoverable because it happened at write time.
- line 2510 and 1759: `localeCompare` in both the serializer's array sort and the basis-digest sort — locale-dependent byte ordering.

**Required (PROPOSED):**

- **DM-01 — The serializer is a total, injective, locale-independent function with a round-trip test.** `parse(canonicalSerialize(x)) ≡ x` for every legal persisted value, verified by property test over the schema, not by three examples. Falsifier **DUR-06**.
- **DM-02 — Explicit `null` is preserved, or prohibited by the schema.** Pick one and enforce it in validation. A serializer that cannot distinguish two legal states is not canonical.
- **DM-03 — Sorting applies only to declared set-like arrays, by declared stable identity keys, with byte/codepoint comparison.** Agrees with CFA-01 `M-10`; the addition from this lens is that the *declaration* must live in the schema (`reality-1.0.0.json`), not in prose, or a future observer author will re-introduce the order-destroying sort for their own array.
- **DM-04 — Canonical form is minimal (no pretty-print) for digest inputs; a separate human/pretty form may exist.** A digest over pretty bytes is a digest over a formatting choice.
- **DM-05 — One `schemaVersion` source, validated on every read, refused on unknown.** See §5.2.
- **DM-06 — Schema artifact is real.** `.dev-reality/schema/reality-1.0.0.json` is declared in the file tree (corpus 127–128) and the storage design (setup prompt 406–408) and is **never written or read**; `core/schema-registry.ts` is declared (corpus 27) and never written. A declared schema file that no code consults is a *claim of validation*. The engine should either validate against it or stop shipping it — a plausible inert file is the failure mode CFA-01 names as **G-17**.

### 4.2 Storage layout verdict — gotcha #4 (the rule from durability ownership)

**gotcha #4 is correct and load-bearing, and it is incomplete in a way that decides the architecture.**

What it says (OBSERVED, `gotchas.txt` 45–51): JSONL is safe for concurrent appends; **JSON indexes are NOT safe**; use `bun:sqlite` for `basis-to-observation` and `subject-history`; keep JSONL for the journal and JSON for immutable snapshot archives.

What is right: the concurrency diagnosis is correct and the remedy is the right one. File-based read-modify-write on a shared JSON document has no atomicity and no locking primitive; `bun:sqlite` is built into Bun with zero dependencies and gives real locking and transactions.

**What is missing — and it is the part that decides retention and export safety:**

> gotcha #4 never says *which artifact is durable*. It defaults implicitly to "indexes are just indexes", i.e. rebuildable. For two of the three declared indexes that default is right. For the third it is **wrong**.

OBSERVED, setup prompt 416–419 declares three indexes: `basis-to-observation.json`, `subject-history.json`, **`conflict-index.json`**. `conflict-index` holds the rows for `ConflictRecord`s whose `status` may be `UNRESOLVED`. Conflict preservation is invariant 8, falsifier 8, and TRUTH-T08. **If the conflict index is prunable or lossy, the engine can lose the fact that a conflict ever existed, and it will do so silently, on schedule, after `retention.eventsDays`.** An engine that reports no conflicts because it pruned the record of one is worse than an engine with no conflict detection, because the absence is now *affirmative*.

**VERDICT (PROPOSED), stated as a rule rather than a filename list:**

Classify every persisted artifact by durability class first; the store follows the class, not the extension.

| Class | Artifacts | Store | Loss tolerance | Rule |
|---|---|---|---|---|
| **D1 — durable audit root** | `events/journal_*.jsonl` | JSONL, `O_APPEND` + fsync | **ZERO.** Loss here is lineage loss. | The *only* artifact that must survive every other artifact. Never pruned while any retained receipt, unresolved conflict, or unreconstructed gap references it. |
| **D2 — immutable document** | `snapshots/snap_<id>.json`, `schema/*.json` | canonical JSON file, content-addressed name | Rebuildable from D1 + engine version. | Written tmp→fsync→rename. Never mutated in place. |
| **D3 — derived index** | `basis-to-observation`, `subject-history`, **`conflict-index`** | `bun:sqlite` (WAL) | **ZERO only if rebuildable.** | **Admission test, and it is the whole rule: *can this index be rebuilt by replaying D1?* If yes → index. If no → it is not an index, it is a second store, and it must be journaled into D1 before it is allowed to exist.** `conflict-index` passes only if unresolved conflicts are journal events. |
| **D4 — pointer** | `snapshots/latest.json` | pointer (name or digest), atomic rename | ZERO | **Must not be a document.** See O-06. |
| **D5 — ephemeral** | `tmp/`, `locks/` | files | ZERO | Locks resolve to `UNRESOLVABLE`, never auto-cleared (§4.4). |

**Three consequences that follow directly and are not in any of the four owner documents:**

- **DM-07 — Only D1 is durable. Everything else is a projection of D1.** This single rule is what makes retention safe, export provable, and `reality verify-export` implementable as "replay the journal and diff". It is also the answer to the Blueprint's `basis-cache.json`: that file is D3 and must be SQLite or a replay projection, never a hand-maintained JSON cache.
- **DM-08 — If a future feature cannot be expressed as a projection of D1, that feature is a D1 change and needs a schema decision.** Not a "we'll add an index later" decision.
- **DM-09 — `observations/obs_<id>.json` as a separate durable store is cut** (§3.3). It is D2-adjacent duplication of D1.

### 4.3 Must-haves — durability, identity, retention, lineage, export

- **DM-10 — Two identities, both named, both content- or occurrence-derived, never conflated.**
  OBSERVED: the corpus mints `obs:`/`evt:`/`snap:`/`cfl:` from `uuidv7()` (corpus 2466–2482) and uses `subjectId: "repo:${state.root}"` — a **display path** — as the record key (corpus 1211). Consequence: re-observing an identical basis produces a *different* observation id, so the engine has **no way to express "nothing changed."** Two identical-basis runs yield two states and no delta. The `basis-to-observation` index is then useless for its stated purpose, because "the observation" is not addressable.
  Required: `occurrenceId` (uuidv7, non-deterministic, identifies *an* observation) **and** `subjectStateId` (content-derived over canonical subject identity + basis digest, deterministic, identifies *the current state of a subject*). Lineage is `previousSubjectStateId` for revision semantics and `previousOccurrenceId` for occurrence semantics — they are different chains and the corpus has only one field for both jobs.
- **DM-11 — A demonstrable identity fork exists in the scaffold today (OBSERVED).**
  `scope.workspaceId` is `workspace:${hashPath(state.root)}` at corpus **1218**; `snapshot.workspace.workspaceId` is `workspace:${repo.repositoryRoot}` at corpus **1819**. Same field name, two derivations, one run: a 32-bit hash of a lowercased path, and a raw path. `hashPath` lowercases (corpus 1315); the raw-path form does not. **One workspace, two identities, in the first runnable commit of the project.** This is not a hypothetical collision risk; it is the fork, shipped. It is also the mechanical form of this home's `STATE.md` failure signal *"provider identity is used as canonical identity."*
- **DM-12 — `subjectId` and `workspaceId` derive from canonical identity, never from a display path** (agrees with CFA-01 `M-02`, extended: the corpus *already violates this*, so it is a defect with a known location, not a design caution).
- **DM-13 — Every persisted record carries `engineInstanceId`.** OBSERVED: `EventBus` keeps `private sequence = 0` in memory (corpus 774), `resetEventBus()` runs on `stop()` (corpus 1507), and the journal is never read back. So `seq` restarts at 1 every process while living in a single date-keyed file. `seq: "monotonic within session"` (setup prompt 232) has no session in the record. Required: `seq` is monotonic within `(engineInstanceId, seq)`, and every event/snapshot carries the instance id, so a journal spanning many processes is attributable, orderable within an instance, and orderable *across* instances by `(occurredAt, instanceId)`.
- **DM-14 — Reference-aware retention. Age is a candidate filter; reachability is the permission.**
  OBSERVED: `retention: { eventsDays: 30, snapshotsDays: 7, observationsDays: 14, maxDiskMb: 500 }` (corpus 2607–2612); `storage/pruning.ts` declared (corpus 61), never written; `getUsedBytes(): 0` (corpus 2120–2123) so `maxDiskMb` is unenforced.
  Required: a candidate may be pruned **only if** (a) it is past its age bound, **and** (b) no retained artifact references it, **and** (c) it is not the basis of an `UNRESOLVED` conflict, **and** (d) no receipt cites it. Refusal is a recorded outcome (`STOR_RETENTION_REFUSED`), not a silent skip. The two currently-absent conditions are (c) and (d), and (d) is the one that matters here: **receipts live in git forever and cite `COMMIT_SHA` / `BASE_MAIN_SHA`; a 30-day event horizon is shorter than the citation horizon of the team's own audit records.**
- **DM-15 — Restart lineage is proven by replay, not by assertion.** TRUTH-T09 says "lineage intact, stale marked". Today there is no replay mechanism to make that testable, and `previousObservationId` can dangle across a restart with nothing detecting it. Required: `reality replay` reads D1 in `(engineInstanceId, seq)` order, reconstructs the snapshot lineage, and reports `STOR_REPLAY_INCOMPLETE` on any gap. A dangling `previousObservationId` is `STOR_LINEAGE_DANGLING`, not a record to be skipped.
- **DM-16 — Export and verify exist, and the engine's state is reconstructible from its own bytes.**
  OBSERVED: **there is no export command anywhere** — not in the CLI contract (setup prompt 462–481), not in the acceptance list (681–700), not in the corpus. Yet the falsifier list asserts reconstructability (item 7) and the whole design rationale is "the factual floor". Required:
  ```text
  reality export --since <event-or-ref> --out <path>
  reality verify-export <path>
  ```
  `verify-export` must: byte-compare a re-derived digest; `parse ∘ serialize` every record; rebuild every D3 index **from the exported D1 alone**; and succeed with **no `.dev-reality/`-specific absolute path present** (portability). Falsifiers **DUR-10**, **TRUTH-T20**.
- **DM-17 — The engine can carry an opaque durable-data citation, and cites the closed L2 adapter rather than reimplementing it.** OBSERVED: the snapshot schema has **no field** that can express a canonical record revision reference. Required: the engine's basis type gains a *citable* form for `(ns,id,rev)` + optional `cid` + `evidenceRefs`, carried opaquely, with an explicit adapter seam to and from the closed `cfa02.data-continuity.revision-basis@1`. See §7 `DU-01` — this unit **claims and answers** the question CFA-01 routed to it.

### 4.4 Lock identity must match the engine's own PID-reuse rule (OBSERVED contradiction)

The setup prompt's Windows table says *"PID + CreationDate (never PID alone)"* (line 572) and the process observer uses `ProcessIdentity { pid, startTime, generationToken }` (corpus 457–461). The **storage** design then specifies *"File-based locking (PID + timestamp)"* (setup prompt 434) with `locks/engine.lock`, `locks/snapshot.lock` (419–422).

**The engine's own invariant contradicts its own lock design.** A lock keyed on PID alone collides with the `ID_PID_REUSE` class the engine declares it can detect — and a stale-lock auto-clear is a **silent repair of a state that may be live** (invariant 7's neighbour: "never silently repair"). Required:

- **DM-18** — lock identity is `(pid, processStartTime, nonce)`, and stale-lock detection resolves the process before concluding anything.
- **DM-19** — an unresolvable lock holder is `STOR_LOCK_STALE_UNKNOWN` with freshness `UNRESOLVABLE` and CLI exit 5. The engine **does not clear it**. Falsifier **DUR-11**, test **TRUTH-T23**.

### 4.5 The ref-identity defect in `preclosure` (OBSERVED, and it is the field a closure decision would consume)

`preclosure()` sets `currentMainContainsCommit: repo.head === repo.remoteMain || await this.isCommitOnMain(repo.head)` (corpus 1644–1646). `isCommitOnMain` runs `git branch --contains <sha> --list main` (corpus 1789–1800) — that tests containment in **local `main`**, while `repo.remoteMain` is `refs/remotes/origin/main` (corpus 1051–1055), and every other field in the same snapshot is described as `origin/main` (e.g. corpus 2326).

**The field is named "current main", measures local `main`, and sits in a snapshot that means `origin/main` by `origin/main`.** In this very repository, local `main` and `origin/main` differ during any unfetched window, and this session observed exactly that situation (a branch 5 commits ahead of local `main` while `origin/main` was fetched separately). The one boolean a closure decision would read is measured against a ref that is not the one its name denotes.

Required: **every containment/reachability field names the ref it measured** (`onLocalMain`, `onRemoteMain`, `onCurrentBranch` — the three-way split the spec's own invariant 5 demands and the corpus collapses). This is a *truthfulness* defect that CFA-01 will also see; it is listed here because the durable form of it — *which artifact is the reference* — is this lens's.

### 4.6 Absence of an effect record for `reality hooks install` (OBSERVED)

`gotchas.txt` 37–43 proposes that the engine install `.git/hooks/post-commit` etc. to append events. That is a **mutation of the owner's repository**, proposed as a shell snippet, with:

- no opt-in, no uninstall path, no record that it happened;
- **no journaled effect record** — the engine's own design has no vocabulary for "the engine did something", only "something was observed";
- and, on this repository specifically, an interaction with the delivery hazard in §0: a hook that appends to a file inside a worktree is a writer that can fire during a commit, including during the engine's own delivery.

Required: **any engine-initiated mutation is an `EFFECT_*` record in D1** — what changed, when, which invocation, reversible-or-not. An effect that is not journaled is an unaccountable mutation, and invariant 8's "no second authority" is exactly what an unrecorded mutation of `.git/` becomes. Routed as `DU-03`.

---

## 5. (d) Must-nots (data / identity / persistence lens)

- **DN-01 — `.dev-reality/` is never canonical.** It is a **derived cache plus the engine's own observation evidence**, and nothing else. It is never a Product Instance, never a vault, never a continuity store, never a place where a product fact is written. Corollary: the engine has **no write path** into the vault, receipts, `TASKS.md`, `docs/`, or any Ω artifact. Agrees with CFA-01 `U-07`'s framing; this unit states it as a hard must-not because retention authority follows from it.
- **DN-02 — The engine never becomes a second canonical store, and the admission test is mechanical.** Any new persisted artifact must pass: *is this a projection of D1?* If not, it does not ship until it is either journaled or deleted. This is the enforcement of DM-07, stated as a boundary rather than a preference.
- **DN-03 — The engine never becomes a second identity registry.** It mints **occurrence identity** (`obs:`, `evt:`, `snap:`, `cfl:` — uuidv7) and **mechanical subject keys** (content-derived, in a namespace provably disjoint from canonical addresses). It must never mint, author, or validate: `(ns,id,rev)`, `cid`, agent ids, session ids, CFA ids, key ids, or roster entries. `cfaProfiles[].cfaId` is an identity field — the engine may *verify* it against the roster and report `UNRESOLVABLE` if absent; it may never author it. This is veto **V2** from the closed M0/M1 receipt, restated for the engine.
- **DN-04 — The engine never mints or repairs a *durable lineage* of its own that competes with the session record.** `previousObservationId` / `subject-history` are the engine's *occurrence and state* lineage. The team's lineage lives in receipts + `TASKS.md` + git. The two have **no join today**, and the correct fix is a one-way citation (the engine's record may *cite* a `SESSION_ID`/`COMMIT_SHA` opaquely), never a merge. Falsifier **DUR-15**.
- **DN-05 — The engine never collapses the seven-identity ladder** (`CORE-AGENT.md`: semantic / record / revision / source-provider / event / evidence / representation). Field-level collisions that MUST be documented at the type, because each is a live misreading waiting to happen:

  | Engine field | What it is | What it must never be read as |
  |---|---|---|
  | `ProcessIdentity.generationToken` | PID + start time | record identity |
  | `FileObservation.digest` / `contentDigest` | content identity | `cid`, or a `WorldModel.v`, or a revision |
  | `subjectId` | mechanical observation key | `canonicalRef` / `(ns,id)` |
  | `snapshotId` | an occurrence of a capture | a revision |
  | `BasisRef.revision` | a git OID | a data revision |
  | `eventId` | an occurrence of an event | an event *identity* in the team's sense |

- **DN-06 — The engine never treats presence as durability.** A file existing is not a record being retained; an index row existing is not evidence preserved. **Absence of a retention declaration is not permission to prune.**
- **DN-07 — The engine never emits a verdict field.** Not `MECHANICAL VERDICT: READY FOR CLOSURE` (corpus 2412–2414), not a "readiness" boolean, not a continuity verdict, not an authorization state. Every boolean is a fact about a **named subject**, carrying a **basis** and an **epistemic status**. A field that means "is this ready" has no basis and is a judgment; this is the durable-shape version of CFA-01 `M-11`.
- **DN-08 — The engine never becomes a second authority over Git or over any canonical store.** Invariant 8 stands. Teeth-check from this lens: conflict and collision accessors currently return `[]` (corpus 2110–2118), so a conflict would be **invisible** rather than preserved — and an invisible conflict is an authority claim by omission.

---

## 6. (e) Acceptance-criterion and falsifier additions

### 6.1 Acceptance additions (additive to setup prompt 681–700)

- **AC-01** Every persisted artifact declares its `storageClass` (D1–D5), and every D3 index passes the replay-rebuild test.
- **AC-02** No file outside `.dev-reality/` is written by the engine without an opt-in flag and a journaled effect record.
- **AC-03** Every event and snapshot carries `engineInstanceId`; `seq` is monotonic within `(engineInstanceId, seq)`; a journal spanning ≥2 processes replays with zero gaps.
- **AC-04** `parse(canonicalSerialize(x)) ≡ x` for every legal persisted value, verified by property test against the schema.
- **AC-05** Two `reality snapshot --fresh` runs against an unchanged tree produce identical `subjectStateId` and `basisDigest` values, and the engine reports a delta of *zero changes* rather than two new states.
- **AC-06** `reality export` → `reality verify-export` on a clean directory succeeds with no absolute `.dev-reality/` path required, and every index rebuilds from the exported journal alone.
- **AC-07** An artifact referenced by a retained receipt citation, or by an `UNRESOLVED` conflict, is never pruned; refusals are recorded, not silent.
- **AC-08** `reality for cfa-02` reports an `artifactClass` for every resolved path, and reports `migrationState.status = "UNRESOLVABLE"` with a named reason and owner.
- **AC-09** Every containment/reachability field names the ref it measured (`onLocalMain` / `onRemoteMain` / `onCurrentBranch`); no field named "current main" measures a different ref.
- **AC-10** An unresolvable lock holder yields `STOR_LOCK_STALE_UNKNOWN` and exit 5, and the lock file is **not** removed.
- **AC-11** Grep over the whole persisted surface finds no minted `(ns,id,rev)`, `cid`, agent id, CFA id, or roster entry; only `obs:`/`evt:`/`snap:`/`cfl:` occurrence ids and content-derived mechanical subject keys.
- **AC-12** Unknown `schemaVersion` on read is **refused** with `STOR_SCHEMA_UNKNOWN`, and the engine does not serve the record under any interpretation.

### 6.2 Falsifier additions (additive to the prompt's 21; prefixed `DUR-` to avoid collision with CFA-01's `W-` series). Engine is broken if **any** is true.

- **DUR-01** `basisDigest` changes when no basis token changed, or two observations of one unchanged basis disagree on it.
- **DUR-02** The engine has no way to report "unchanged" — two identical-basis runs produce two states and no delta.
- **DUR-03** A persisted record lacks engine-instance identity, or `seq` restarts and is treated as monotonic.
- **DUR-04** One mechanical subject resolves to two `workspaceId` or `subjectId` values within a single run. *(Demonstrated live in §4.2 / DM-11 at corpus 1218 vs 1819.)*
- **DUR-05** A mutation of an existing persisted record is possible (any in-place write of a D2/D3 file), or a write is not tmp→fsync→rename.
- **DUR-06** `parse(canonicalSerialize(x)) ≠ x` for any legal persisted value — the serializer is not injective.
- **DUR-07** Retention prunes an artifact referenced by a retained receipt, or by an `UNRESOLVED` conflict.
- **DUR-08** Storage class is undeclared for any artifact class, or an index that cannot be rebuilt by journal replay is treated as an index.
- **DUR-09** A field named "current main" measures local `main` while the surrounding snapshot means `origin/main` — demonstrated by corpus `isCommitOnMain` (1789–1800) feeding `currentMainContainsCommit` (1644–1646).
- **DUR-10** Persisted state cannot be exported and re-verified from its own bytes, or verification requires an absolute `.dev-reality/` path.
- **DUR-11** A lock is auto-cleared because a PID was not found, without resolving that PID's start time.
- **DUR-12** `schemaVersion` is duplicated across more than one source, or an unknown version is served rather than refused.
- **DUR-13** The engine writes outside `.dev-reality/` (including `.git/hooks`) without an opt-in and a journaled effect record.
- **DUR-14** `reality for cfa-02` returns a non-empty schema/migration view whose migration determination was made by the engine rather than reported `UNRESOLVABLE` with a reason.
- **DUR-15** The engine's own lineage (`previousObservationId` / `subject-history`) is presented as, or joined to, a session receipt's lineage.
- **DUR-16** A conflict record is removed while its conflict is `UNRESOLVED` and no journal event explains the removal.

### 6.3 Truthfulness-test additions (`TRUTH-T16`–`TRUTH-T23`; the prompt's T01–T15 stand)

- **TRUTH-T16 — spurious basis-digest change.** Re-observe an unchanged tree in-process and across a restart → `basisDigest` identical. *(Fails today: `confirmedAt` is inside the digest, corpus 1754–1768.)*
- **TRUTH-T17 — idempotent snapshot.** Two `--fresh` snapshots of an unchanged tree → identical `subjectStateId` / `basisDigest`; occurrence ids may differ; the reported delta is zero changes.
- **TRUTH-T18 — journal replay completeness.** After N restarts, replay reconstructs every `SNAPSHOT_CREATED` with its declared basis, zero gaps; any gap → `STOR_REPLAY_INCOMPLETE`, never silent omission.
- **TRUTH-T19 — conflict survives pruning.** An `UNRESOLVED` conflict older than `retention.eventsDays` is still reported and its referenced observations still resolve.
- **TRUTH-T20 — export/verify round-trip.** Export → verify on a clean directory: digests match, round-trip is identity, indexes rebuild from the exported journal alone, no absolute path required.
- **TRUTH-T21 — reference-aware retention.** An observation cited by a retained receipt's `COMMIT_SHA` / `BASE_MAIN_SHA` is not pruned past `observationsDays`.
- **TRUTH-T22 — no canonical identity minted.** §6.1 `AC-11`, run as a test over the whole persisted surface.
- **TRUTH-T23 — lock staleness is `UNRESOLVABLE`.** Dead-PID lock with unresolvable start time → `STOR_LOCK_STALE_UNKNOWN`, no clearing, exit 5.

### 6.4 `STOR_*` error-code additions (additive to setup prompt 509–537)

The existing storage family is `STOR_WRITE_FAILED | STOR_READ_FAILED | STOR_CORRUPT | STOR_LOCK_HELD`. Additions, each with a distinct failure the engine will otherwise perform silently:

| Code | Meaning | Silent failure it prevents |
|---|---|---|
| `STOR_SCHEMA_UNKNOWN` | read refused on unrecognised `schemaVersion` | serving an old record under a new engine's assumptions |
| `STOR_TORN_WRITE` | partial/trailing record detected on read | a crash mid-write read as "nothing changed" |
| `STOR_LINEAGE_DANGLING` | a record references a basis/observation that is absent and not prunable | lineage loss presented as a complete record |
| `STOR_REPLAY_INCOMPLETE` | journal sequence gap or non-monotonic `seq` within an instance | a truncated journal replaying as a short history |
| `STOR_RETENTION_REFUSED` | a prune candidate is still referenced | pruning without a decision record |
| `STOR_IDENTITY_FORK` | two identities for one mechanical subject | the DM-11/O-09 fork, and any future one |
| `STOR_EXPORT_MISMATCH` | exported digest ≠ re-derived digest | an export that cannot be verified |
| `STOR_LOCK_STALE_UNKNOWN` | lock holder PID unresolvable | silent auto-clear of a possibly-live lock |
| `STOR_CLOCK_SKEW` | `observedAt < occurredAt`, or day-segmented journal files out of order | a clock-stepped machine producing a plausible-looking invalid journal |

Identity family addition: **`ID_SUBJECT_FORK`** — distinct from the existing `ID_COLLISION_DETECTED`, which the corpus scopes to PID/workspace/session. Subject-key forking is a different defect with a different owner (the canonicalizer), and merging them would put one class of failure behind another's diagnostics.

---

## 7. (f) Gotcha additions

Additive to `gotchas.txt`; numbered `G-18`–`G-27` to continue after CFA-01's `G-06`–`G-17`. Each presents as a *correct-looking result* — which is the property that makes a gotcha dangerous.

- **G-18 — The double-`workspaceId`.** The same field name is derived two ways in one run: `workspace:${hashPath(root)}` (corpus 1218) and `workspace:${repo.repositoryRoot}` (corpus 1819). One is a 32-bit hash of a lowercased path; the other is a raw path. Nothing errors. A consumer that joins observations to snapshots by `workspaceId` gets a partial match and reports *some* data — the most dangerous shape of wrong.
- **G-19 — The two-identity trap.** UUIDv7 occurrence ids get mistaken for record identity. The symptom is not a wrong answer, it is an *absent capability*: the engine cannot say "nothing changed", cannot dedupe a re-observation, and `basis-to-observation` has no stable key to index by. Every one of these looks like a missing feature rather than an identity modelling error.
- **G-20 — The three-`schemaVersion` trap.** `Observation.schemaVersion`, `RealitySnapshot.schemaVersion` and `RealityConfig.schemaVersion` are three copies, plus a declared-and-inert `schema/reality-1.0.0.json`. No single source, no read-side validation. The first schema change produces three versions that disagree and a JSON-schema file that nothing reads — and the file's *presence* suppresses the question.
- **G-21 — The retention-by-age trap.** `eventsDays: 30` prunes on a calendar while receipts cite commits forever. The dangerous part is not the loss, it is that the loss is **scheduled and invisible** — the engine does the wrong thing on a timer, and looks healthiest on the day it does it. Add: any retention that is not reference-aware is a scheduled evidence-destruction policy.
- **G-22 — The index-is-canonical trap.** gotcha #4 says "SQLite for indexes" and stops. The dangerous case is the index whose contents are **not** fully reconstructible from journal + snapshots: that is a second store wearing an index's name, and it is `conflict-index` specifically. Test: *replay the journal — does the index come back?* If no, it is canonical and must be journaled.
- **G-23 — The lock-PID trap.** File locks keyed on PID alone (setup prompt 434) contradict the engine's own `ID_PID_REUSE` rule (line 572). Auto-clearing a "stale" lock is a **silent repair** of a state that may be live — the exact class invariant 7 exists to prevent, hiding inside the storage layer where nobody looks for judgment.
- **G-24 — The atomicity trap.** `writeFile` twice with no tmp+rename (corpus 2096–2100). After a crash, `latest.json` is older than `snap_<id>.json` and nothing records which is right. The `tmp/` directory exists in the declared layout (setup prompt 426) and no code uses it — a *declared mechanism with no implementation* reads as a guarantee.
- **G-25 — The `latest.json`-as-document trap.** The newest-state pointer is stored as a full second copy of the snapshot. Two writers, one content, byte-duplication that can diverge, and a torn write that corrupts both. The pointer should be a name or a digest.
- **G-26 — The day-journal trap.** `journal_YYYYMMDD.jsonl` has no engine-instance id, no cross-file sequence continuity, no rotation record, and no clock-skew handling. A machine whose clock steps backward produces out-of-order files that still parse as a valid journal. Combined with G-19/G-03 this means the audit trail is unattributable *and* unordered across restarts.
- **G-27 — The artifact-class trap for `reality for <cfa-id>`.** A path list resolves build outputs, runtime state, and untracked owner material alongside canonical documents — and reports only paths and digests. In this repository, `omega-baseline/omega-final/build/status.json` is currently modified-and-uncommitted and `docs/Reality-engine/` is untracked owner material; a projection that reports their digests hands a consumer a number that reads as a data-plane fact. Every resolved path needs an `artifactClass`.
- **G-28 — The "declared JSON schema" trap.** A schema file that ships, is versioned, and is never consulted is worse than no schema file: it converts "we have no validation" into "we have validation, apparently". Applies directly to `schema/reality-1.0.0.json` and `core/schema-registry.ts` today.

---

## 8. Standing verdict carried forward: `ENFORCEMENT_LEVEL` must never be receipt-authored

**Reaffirmed unchanged from the closed M0/M1 receipt** (`RESULTS/CFA02-M0M1-DATA-20260928.md`, `ENFORCEMENT_LEVEL: REJECT (from receipt schema)`; Session Result Contract v1.2 §"MUST NOT be receipt-authored canonical data"; veto **V3**).

**This lens adds three places the same rule must bite in the engine**, because the engine is a third candidate site for exactly the failure the rule prevents:

1. **`PreClosureChecks` must be facts-only.** No `MECHANICAL VERDICT` string (corpus 2412–2414), and — the deeper fix — no field that means "is this ready". Every boolean names a subject and carries a basis. A verdict field has no basis, so it cannot be attributed, and an unattributable readiness claim is a governance claim made by a formatter.
2. **`reality health` is not a runtime-constitution statement.** `watcherStatus` / `observerStates` / `eventLagMs` describe **the engine's own observers**. They are not runtime-integrity, not activation state, and not enforcement capability. CFA-10 owns that vocabulary. A consumer that reads `HEALTHY` from `reality health` as "the substrate is sound" has crossed a boundary the engine never declared.
3. **Exit codes are claims, not signals.** CFA-01's **G-10** (unconditional `process.exit(0)`) is the same defect as a receipt asserting an enforcement level: a machine-readable token that a validator may consume as a decision, sourced from a place that has no standing to make one. Exit codes must be *derived* from observation state, and no exit code may encode permission, capability, or enforcement.

**Standing rule, unchanged:** enforcement capability is CFA-04/CFA-10 runtime semantics. A receipt may **cite** it opaquely; it may never **assert** it. A validator may **emit** it as a derived view; the receipt must not author it. The engine may **observe** that a tool resolved to a path; it may never **conclude** that a permission is in force.

---

## 9. (g) Unknowns with named owners

No entry below is filled by this unit. Each is routed.

| ID | Unknown | Owner | CFA-02 position |
|---|---|---|---|
| **DU-01** | **Canonical basis shape for the engine** — adopt the L1/L2 `BasisRef` structurally, or rename the engine's and add an explicit adapter seam? *(CFA-01 routed this as its `U-01`; this unit claims it.)* | CFA-02 (normalization) + Steward (contract); CFA-09 owns the compatibility envelope | **Rename + explicit adapter.** The engine's `BasisRef` has no `canonicalRef` / `revisionRef` / `contentDigest` / `evidenceRefs`; the team's has no `channel`. A silent same-name-different-shape is the worst available outcome — consumers assume compatibility and the failure surfaces inside a freshness decision. |
| **DU-02** | Is `.dev-reality/` cache, evidence, or canonical — and therefore who owns its retention? | CFA-04 (retention/authority) + CFA-09 (lifecycle) + CFA-01 | **Derived cache + the engine's own observation evidence. Never canonical.** Retention must be lossless for unresolved conflicts and receipt-cited artifacts. |
| **DU-03** | May the engine install Git hooks in the owner's repository, and who owns install/uninstall and the effect record? | CFA-04 (consent to mutate the owner's repo) + CFA-10 (observation surface) | Requires explicit authorization **and** a journaled effect record. An unrecorded mutation of `.git/` is invariant 8's failure. |
| **DU-04** | Should `reality` become a verification input for `TARGET_REF` / `BASE_MAIN_SHA` in the receipt validator? | CFA-05 (work lifecycle) + CFA-10 (enforcement ledger) + Steward | Provider, never replacement. A snapshot is not a receipt. (CFA-01 raised the validator half as `U-11`; this unit adds the instance-citation half.) |
| **DU-05** | **Who owns the migration-state artifact that `reality for cfa-02` needs?** Without one, migration drift is permanently `UNRESOLVABLE`. | CFA-09 (migration semantics) + CFA-02 (durable representation) + Steward | The engine reports the two version tokens and their inequality, and refuses to name it a migration. Someone must own the naming; it is not the engine's. **This is the one sketch element with no possible implementation and no owner today.** |
| **DU-06** | Is a per-worktree `.dev-reality/` correct when one repository has N worktrees, and is the ignore entry shared across all of them? | CFA-01 (workspace identity) + CFA-10 (runtime) + Steward (repo conventions) | Requires a workspace discriminator on every persisted record and a decision on shared-vs-per-worktree ignore config. Three worktrees is the normal condition here, not an edge case. |
| **DU-07** | May the engine ever *read* Ω vault revisions to enrich a basis, or is citation-only correct for Phase 1? | CFA-02 (this lane) + CFA-01 (World identity) | **Citation-only in Phase 1.** Reading the vault to compute freshness would make the engine a second continuity resolver and would pull World identity into it. |
| **DU-08** | Does retention need owner approval as a governed act? An engine that prunes is performing a destructive act on the team's audit basis. | CFA-04 (consent) + CFA-05 (work evidence) + Steward | Yes — retention defaults are a policy, not a default. |
| **DU-09** | **The sharpest data-lens unknown: is the event journal *evidence* or *cache*?** If evidence, it needs a governance owner, a retention floor, and export. If cache, it can be pruned freely and the engine is honest about losing history. | CFA-04 + Steward | **Evidence**, on the strength of invariant 8, falsifier 8, and the receipt-citation chain. But this is a governance decision, not a CFA-02 decision, and every retention answer in §4.3 depends on it. |
| **DU-10** | May the engine carry an opaque `AuthorityCitation`? And does carrying one create the same live-permission risk as receipt-authored `ENFORCEMENT_LEVEL`? | CFA-04 (authority semantics) + CFA-02 | Citation allowed, evaluation forbidden — the same rule as `ENFORCEMENT_LEVEL`. Exact storage/join remains **UNKNOWN / DEFERRED** per owner alignment; the engine does not change that. |

---

## 10. Where this lens refines the world/context lens (no repetition, explicit deltas)

| Topic | CFA-01 position | This unit's addition |
|---|---|---|
| Scope | Hybrid, truthfulness floor in 1a | Same verdict, **different increment boundary**: the persistence contract is *specified* in 1a, and nothing may write to `.dev-reality/` until the write path is atomic, instance-identified, and journaled. Contract-before-code, not code-early. |
| `BasisRef` | Route to CFA-02 as `U-01` | **Answered**: rename + explicit `toL2BasisRef()`/`fromL2BasisRef()` seam. Silent same-name-different-shape is the worst outcome. |
| Schema migration | Cut migration tooling | **Refine**: cut migration, **keep read-side refusal** (`STOR_SCHEMA_UNKNOWN`). Falsifier 16 is only answerable if unknown versions are refused. Migration ≠ validation. |
| `subjectId` namespace | Mechanical key, disjoint from World addresses | Same, plus: the corpus **already violates it** (corpus 1211, 1819) — this is a defect with a known location, not a design caution. |
| `.dev-reality/` classification | Route as `U-07` (cache, never canonical) | **Adopted and made mechanical**: five storage classes D1–D5, with a replay-rebuild admission test. "Cache" alone does not tell you whether pruning is safe. |
| `preclosure` | Remove the verdict string | Same, plus: the field that *is* computed (`currentMainContainsCommit`) measures local `main` while the snapshot means `origin/main` — a ref-identity defect underneath the verdict-string defect. |
| Retention | Not addressed | Reference-aware, not age-aware; receipt-cited artifacts are protected; refusal is a recorded outcome. Age-based pruning is scheduled evidence destruction. |
| Export / reconstruction | Not addressed (routed to CFA-01's M4 framing) | No export command exists anywhere in the spec or scaffold. Without it, falsifier 7's portable-loss case is unanswerable. Contract specified in §4.3 `DM-16`. |

---

## 11. Evidence classification of this document

| Claim | Class |
|---|---|
| Branch divergence, main tip `83eca7a7`, three registered worktrees, untracked owner material present, `build/status.json` modified-uncommitted, `docs/Reality-engine/` untracked, synthesis absent from the session worktree | **OBSERVED** this session |
| Corpus line-level facts: corpus 1218 vs 1819 workspaceId fork · 1639–1643 hardcoded `true` · 1644–1646 + 1789–1800 `isCommitOnMain` on local `main` · 2096–2101 double `writeFile` + `latest.json` as document · 2110–2118 `getConflicts`/`getCollisions` → `[]` · 2120–2123 `getUsedBytes` → `0` · 2412–2414 verdict string · 2453 `unknowns: 0` · 2498/2502 pretty-print + `null`→absent · 2510/1759 `localeCompare` · 2607–2612 retention defaults · 2619 `cfaProfiles: []` · 774/828/1507 in-memory `seq` + `resetEventBus` · 2466–2482 uuidv7 identity minting | **OBSERVED** in the owner corpus |
| Spec-level facts: no `for` case in the CLI switch (2148 vs 2234–2238) · declared-and-absent `schema-registry.ts`, `storage/pruning.ts`, `storage/indexes.ts`, `journal.ts`, `locks.ts`, `agent/*`, five of six observers · no export command in the CLI contract, acceptance list, or corpus · no field capable of carrying `(ns,id,rev)` · `tmp/` declared and unused | **OBSERVED** in the owner corpus |
| gotcha #4's omission of durability class; the Blueprint's `basis-cache.json` contradicting gotcha #4; the storage design contradicting the engine's own `ID_PID_REUSE` rule; `TRUTH-T09`'s lineage claim being unfalsifiable without replay; falsifier 7's portable-loss case being unanswerable without export; `preclosure`'s ref-identity mismatch | **DERIVED** (both documents read this session) |
| That the "Full Working Core" is not a working implementation of its own specification | **DERIVED** from the declared-vs-implemented inventory |
| All `DM-*`, `DN-*`, `AC-*`, `DUR-*`, `TRUTH-T16..T23`, `G-18..G-28`, the D1–D5 storage classification, the §2.6 refined contract, the §3.2 increments, the §3.3 cut list, the §8 engine extensions to the `ENFORCEMENT_LEVEL` rule, the §10 deltas | **PROPOSED** |
| `DU-01` … `DU-10` | **UNKNOWN**, routed with named owners. `DU-01`'s answer is a CFA-02 recommendation, not a ratification. |

---

## 12. Boundaries and non-actions taken this session

- No Ω law touched. `CURRENT-INVARIANTS.md`, `BUILD-DECISIONS.md`, D-records untouched.
- No implementation, no code, no `dev-reality/`, no `dev-reality/` directory created.
- No central synthesis attempted; the ten-CFA reconciliation is Steward-owned.
- No shared CFA boundary activated.
- `docs/Reality-engine/` read only — not committed, not edited, not moved, **not staged**. Live hazard: it is untracked owner material, so `git add .` in the primary worktree would capture it. Explicit-path staging only.
- Peer homes untouched. Peer uncommitted modifications in the primary worktree (`M omega-baseline/omega-final/build/status.json`) untouched.
- Peer-homed unknowns routed by name, not by writing into peer homes. CFA-01's `U-01` is *claimed* in `DU-01` with an answer, not silently taken.
- No force-push; `main` advanced by fast-forward only.

---

## 13. What this unit asks the Steward to decide

1. Accept or reject the **§3.2 increment order** — specifically that the *persistence contract is written and gated* in 1a, and that no observer may write to `.dev-reality/` until the write path is atomic, instance-identified, and journaled.
2. Accept or reject the **D1–D5 storage classification** and the replay-rebuild admission test in §4.2 — in particular that `conflict-index` is only an index if unresolved conflicts are journal events.
3. Accept or reject the **cut list** in §3.3 (these are defects, not deferrals), and the **refinement** that schema *migration* tooling is cut while schema *refusal* is kept.
4. Ratify or reject **§8**'s extension of the standing `ENFORCEMENT_LEVEL` verdict to three engine sites: `PreClosureChecks` verdicts, `reality health` as a runtime statement, and exit codes as decisions.
5. Route **DU-09** (is the journal evidence or cache?) before any implementation begins — it decides retention, export, and governance ownership, and it is not a CFA-02 decision.
6. Route **DU-05** (who owns the migration-state artifact?) — it is the one element of the CFA-02 sketch with no possible implementation and no owner today.
7. Assign **DU-01** (basis shape), **DU-02** (storage classification authority), **DU-03** (git-hook consent) for confirmation by the named owners.
