# CFA-03 — Reality Engine Design Input (Semantic Continuity lens)

> Date: 2026-09-28
> CFA: CFA-03 — Semantic Continuity Steward
> agent_id: `semantic-continuity`
> Identity: **RATIFIED — OWNER-ALIGNED** (owner alignment 2026-09-25; delegation `OWNER-DELEGATION.md` row 3)
> Unit: DESIGN INPUT. MODE=DELIBERATE. No code, no implementation, no central synthesis.
> Classification: proposal / characterization from one owner lens. Not Ω law. Not a
> shared-boundary activation. Not a decision on any peer's seam.
> Write scope: CFA-03 home only.
> Owner material read (UNTRACKED, read-only, never committed/edited/moved):
> `docs/Reality-engine/Blueprint.txt`, `docs/Reality-engine/gotchas.txt`,
> `docs/Reality-engine/setup prompt.txt`,
> `docs/Reality-engine/# Reality Engine — Full Working Cor.txt`.

## 0. Delivery-path finding (OBSERVED) — and it is the theme of this unit

| Item | Value | Class |
|---|---|---|
| Base ref given at spawn | `edfe49b1d2cc871fabcc0b3388128f956db908ff` | OBSERVED |
| Spawn base is ancestor of `main` | yes | OBSERVED |
| `main` tip re-resolved this session | `83eca7a721d28387913e9f8ec3ba21218e8fa52e` | OBSERVED |
| Session worktree branch at start | `team/omega-endstate` at `ff8e141a4a611ddaa6a35315e71557832cef2a5d` | OBSERVED |
| `edfe49b1` ancestor of that worktree HEAD | **no** | OBSERVED |
| `LOCAL-TEAM-TOOLSET-SYNTHESIS-20260928.md` in the session worktree | **absent** (present on `main`) | OBSERVED |
| `docs/Reality-engine/` tracked files | zero; untracked owner material | OBSERVED |
| Uncommitted peer work in the primary worktree | `M omega-baseline/omega-final/build/status.json`; untracked `OmegaBuildBootstrap.txt`, `docs/Reality-engine/`, `local-team.md`, `session-ses_f1fc.md` | OBSERVED |

**Resolution taken (procedure, not authority):** delivery was performed in a dedicated
git worktree branched from current `main` (`83eca7a7`), so the peer's uncommitted
modifications in the primary worktree were never touched and the artifacts reach `main`
by fast-forward only. No force-move, no merge of a peer branch, nothing written under
`docs/Reality-engine/`.

**Why this belongs in CFA-03's input and not only a delivery note (DERIVED):** the
defect this session hit is *not* "the wrong branch". It is that a CFA home contained
**stale pointers that read as current** while the ratified identity was untouched — and
nothing in the team's current substrate would have flagged it. See §2.3, which proves
the CFA-03 "Critical" requirement is live, recurring, and mechanically detectable at
zero semantic cost.

## 1. Corpus inventory as it bears on this lens (OBSERVED)

| Artifact | Lines | Bearing on semantic continuity |
|---|---|---|
| `Blueprint.txt` | 341 | No epistemic/freshness vocabulary at all. Emits `"freshness": "CURRENT"` as a literal in its example output (line 98) with no proof mechanism and no freshness module in its deferral table. |
| `setup prompt.txt` | 845 | The specification. Two axes, 9 invariants, 21 falsifiers, 15 truthfulness tests. Carries the CFA-03 requirement verbatim (lines 71–74). |
| `gotchas.txt` | 77 | 5 traps + pre-Slice-1 checklist. None addresses the epistemic/freshness axis split. |
| `# Reality Engine — Full Working Cor.txt` | 2710 | Scaffold. Declares the type system; implements one observer. |

**OBSERVED — the CFA-03-relevant modules are declared and never written.** The file tree
declares `src/core/basis-engine.ts`, `src/core/freshness-engine.ts`,
`src/core/conflict-engine.ts`, `src/core/schema-registry.ts`,
`src/agent/identity-binding.ts`, `src/agent/cfa-profiles.ts`. None has a body. The
Git observer stamps its observation `status: "OBSERVED"`, `freshness: "CURRENT"`
unconditionally (corpus 1213–1214) with no freshness engine to have earned it.

**OBSERVED — the epistemic axis is decorative.** `status: "OBSERVED"` is assigned exactly
once in 2710 lines (corpus 1213). `status: "DERIVED"` is assigned **zero** times.
`status: "PROPOSED"` appears **zero** times. `UNOBSERVABLE` appears exactly once, as a
type member (corpus 199). Of the five ratified epistemic states, the engine can emit one.

**OBSERVED — the two-axis vocabulary is collapsed at the one place it is consumed.**
`computeOverallFreshness()` (corpus 1770–1778) inspects only member `freshness`, never
member `status` and never `snapshot.conflicts`:

```typescript
if (observations.some((o) => o.freshness === "UNRESOLVABLE")) return "UNRESOLVABLE";
if (observations.some((o) => o.freshness === "STALE")) return "STALE";
return "CURRENT";
```

## 2. (a) Validation of the setup prompt's CFA-03 sketch

The sketch under review (setup prompt 71–74):

```text
### CFA-03 Semantic Continuity
- **Needs:** trustworthy continuity basis, stale pointer detection
- **Queries:** `reality for cfa-03` → protocol refs, launch material, source-vs-doc drift
- **Critical:** detect "ratified identity = current but local pointer = stale"
```

**Verdict: `Needs` VALID. `Queries` REJECTED AS SPECIFIED. `Critical` REJECTED AS
WRITTEN, requirement ACCEPTED AFTER REWRITING.**

### 2.1 "trustworthy continuity basis" — VALID, and it is the correct first ask

This is the one line in the whole CFA roster that names the actual substrate. A
continuity basis is exactly what CFA-03 cannot obtain by re-reading: it is the
`DerivedView.basisRefs[]` + `basisDigest` + `dependencyVector` + `derivationIdentity`
shape already closed in
`DERIVED-VIEW-BASIS-FRESHNESS-CONTRACT-2026-09-27.md` and reconciled into
`BOUNDARY-DESIGN-SYSTEM/STAGE-E-L1-DERIVED-VIEW-FRESHNESS-CONTRACT-2026-09-27.md` §4.
**PROPOSED:** the engine adopts that shape rather than a parallel one. Convergent with
CFA-01 M-06, reached from the derivation side rather than the World side.

### 2.2 "stale pointer detection" — VALID, and it is the cheapest high-value feature

A pointer is a declared reference; staleness is a *declared-token vs observed-token*
comparison. It is fully mechanical and needs no interpretation whatsoever. See MC-03.

### 2.3 The `Critical` line — REJECTED AS WRITTEN

> **Critical:** detect "ratified identity = current but local pointer = stale"

The requirement is real and important. The sentence, read literally, asks the engine for
a **ratification-validity oracle**, and that is a must-not, not a must-have. Decomposed:

| Fragment | Who can answer it | Mechanical? |
|---|---|---|
| "local pointer = stale" | engine | yes — declared token vs observed token |
| "ratified identity" | CFA-04 authority vocabulary + CFA-01 meaning | no |
| "= current" | *a semantic currency judgment about whether the ratified identity still holds* | **no** |

"Current" applied to an identity is a claim that the thing named still means what the
ratification said it means. That is my own L1 falsifier #5 — *"self-knowledge freshness
is used as permission or authority"* — reached from the other direction. A mechanical
observer that can answer it is no longer mechanical.

**PROPOSED rewrite (the requirement, stated so it is buildable):**

```text
Critical: detect "declared identity basis and observed pointer basis have diverged"
  → report the PAIR (identityBasisRef, pointerBasisRef) with both bases and their
    freshness; never report a boolean "the identity is current".
```

**OBSERVED — this is not hypothetical. It is in CFA-03's own home, right now.**

| Pointer in `STATE.md` | Declared | Actually observed at `main` | Status |
|---|---|---|---|
| `Session Result Contract current version` (STATE.md:20) | `1.1` | `1.2` (contract header, line 3) | **STALE** |
| `FSSP current version` (STATE.md:19) | `1.3` | `FSSP-1.3` (`CHATGPT-FRESH-SESSION-PROTOCOL.md`) | CURRENT |
| `Mainline verified …` (STATE.md:18) | `221e16a1` | `83eca7a7` | STALE (self-labelled informational) |

Three declared pointers, one current and two stale, **while CFA-03's ratified identity,
`agent_id`, mission and non-scope are all unchanged and still correct.** This is the
exact condition the sketch names, it occurred without anyone noticing, and it is
recoverable in full by token comparison.

**DERIVED — two conclusions that the corpus does not draw:**

1. The detection is *free*. It is a string comparison against a file this repository
   already maintains. No Phase-2 semantics, no AST, no authority. The `Critical` flag is
   affordable; only its literal wording is unaffordable.
2. The engine would have caught it and would still be **unable to say anything about the
   identity**. "The contract version pointer is stale" is a fact. "CFA-03's identity is
   therefore not current" is a category error — the identity is a Commons/owner fact with
   no filesystem representation at all. A projection that showed only the pointer would
   be complete and still silent about the identity, which is correct behaviour.

### 2.4 `reality for cfa-03` — REJECTED AS SPECIFIED

1. **Not implemented.** `for` is in the CLI `COMMANDS` map (corpus 2148) and the CLI
   contract (setup prompt 480) but has **no `case`** in the switch. The switch contains
   only `status`, `snapshot`, `observe`, `changes`, `divergence`, `preclosure`, `health`
   (corpus 2174–2232). Eleven of eighteen commands — including **`for`**, **`stale`**,
   **`conflicts`**, **`explain`** and **`verify`** — fall through to `default:` and exit 3.
   `cfaProfiles: []` (corpus 2719); `cli/commands/for-cfa.ts` and `agent/cfa-profiles.ts`
   are declared, never written. `explain` being unreachable is independently fatal: it is
   the only command that could produce the proof a `CURRENT` claim requires.
2. **"source-vs-doc drift" is a category error.** A doc that disagrees with a source is
   a *semantic* divergence requiring the source's meaning; what the engine can observe is
   "these two declared tokens disagree", which is MC-03. Renaming the request keeps the
   feature and drops the claim.
3. **Inherits CFA-01 F-05:** a hand-authored `relevantPaths` list is a static claim that
   fails silently. Renamed file → empty result → reads as "nothing relevant exists".
4. **Inherits CFA-01 F-06:** a per-CFA file projection is not Context and must not become
   a second projection engine (standing `ISS-002`).

### 2.5 Refined `reality for cfa-03` contract (PROPOSED — characterization, not code)

```text
reality for cfa-03
  pointerBasis[ ]  : [ { citedRef (opaque, owner-attributed),
                         resolvesAtRef, resolution: PRESENT|ABSENT|UNRESOLVABLE,
                         contentDigest?, digestKind: "content-not-revision",
                         declaredToken?, observedToken?, tokenMatch: MATCH|MISMATCH|NOT_DECLARED,
                         freshness, freshnessProofRef } ]     # MC-03, MC-04
  derivations[ ]   : [ { derivationId, subjectRefs[], dependencyVector[],
                         derivationIdentity, basisDigest, freshness } ]   # MC-01
  citations[ ]     : [ { scheme, owner, opaqueRef, revisionToken?, resolverHint } ]  # MC-06
                        # OPAQUE. engine parses nothing, validates nothing.
  conflicts[ ]     : preserved, never resolved; both sides retained
  unknowns[ ]      : named, with reason discriminator (MC-05)
  statusProjection : engine status + reason → ratified 5, total mapping (§3.2)
  explicitlyAbsent : identity currency, meaning continuity, authority, authorization,
                     closure, relevance ranking, "what is relevant to CFA-03"
```

The last row is load-bearing. A CFA-03 projection that omitted it would be a
per-CFA scope leak; a projection that *included* identity currency would be a
ratification oracle.

## 3. (c) Must-haves at the CFA-03 seam

### MC-01 — Basis is per-claim, not per-envelope (the sharpest defect from this lens)

**OBSERVED.** `Observation<T>` carries one `basis: BasisRef[]` for an arbitrary
composite `value: T`. The Git observer attaches a **two-element** basis array —
`.git/HEAD` and `refs/remotes/origin/main` (corpus 1111–1124) — to a
`RepositorySnapshot` whose members do not share a basis:

| Member | Produced by | Real basis | In the recorded vector? | Correct status |
|---|---|---|---|---|
| `head` | `git rev-parse HEAD` | `.git/HEAD` | yes | OBSERVED |
| `ahead` / `behind` | `git rev-list --left-right --count` | **not recorded at all** | **no** | OBSERVED |
| `isDiverged` | `ahead > 0 && behind > 0` (1196) | derived rule + inputs | no rule | **DERIVED** |
| `canFastForward` | `ahead === 0 && behind > 0` (1197) | derived rule + inputs | no rule | **DERIVED** |
| whole object | — | — | — | stamped **OBSERVED** (1213) |

**DERIVED — three separate harms, all silent:**

1. **Unrecorded dependency.** The one command that produces `ahead`/`behind` appears in
   no `BasisRef`. L1 §2.4 requires that a derivation "MUST NOT depend materially on a
   source that is absent from the vector". Here the dependency is real, material, and
   invisible.
2. **Spurious dependency.** When `origin/main` advances, the whole snapshot's digest
   changes, so `canFastForward` — whose only inputs come from `rev-list` — appears to rest
   on a changed basis. Over-invalidation and under-recording, simultaneously.
3. **Unreachable `DERIVED`.** Since `DERIVED` is never assigned, every derived member of
   every observation is currently reported as `OBSERVED`. The epistemic axis cannot
   distinguish a measurement from a rule, so a consumer cannot tell which facts it may
   recompute and which it must cite.

**Required (minimum):** split composite values into per-fact observations, **or** carry
per-field `{ value, status, basis[], rule }`. `DERIVED` must be reachable, and every
`DERIVED` fact must carry its rule and its input basis refs. Convergent with CFA-01 M-03;
CFA-03 owns the `status`+`reason`+`basis` half because that is the evidence-vocabulary
seam.

### MC-02 — The digest must be able to mean something (three independent defects)

**OBSERVED** in `computeBasisDigest` (corpus 1754–1768):

```typescript
const sorted = bases.sort((a, b) => `${a.source}:${a.ref}`.localeCompare(...));  // (i)
const serialized = canonicalSerialize(sorted);
let hash = 0;                                                                    // (ii)
for (let i = 0; i < serialized.length; i++) {
  hash = ((hash << 5) - hash + serialized.charCodeAt(i)) | 0;                   // (iii)
}
```

| # | Defect | Requirement violated |
|---|---|---|
| (i) | `localeCompare` is locale-sensitive | Shared L1 §4: canonicalization must be byte-deterministic; engine falsifier 14 |
| (ii) | 32-bit accumulator, not SHA-256 | Shared L1 §4: `basisDigest = SHA256(canonicalJSON(...))`, lowercase hex |
| (iii) | `confirmedAt` is inside every `BasisRef`, so the digest is a function of basis **+ observation time** | Shared L1 §6: never infer `CURRENT` from recency; my L2 §5: "timestamps are observational metadata, not proof" |

**DERIVED — (iii) is the decisive one and CFA-01's G-06 understates its consequence.**
`confirmedAt` is set to `new Date().toISOString()` on every `classify()` call. The digest
therefore **changes on every single observation even when nothing about the basis
changed**. A digest that always changes cannot serve as a freshness comparison token in
either direction: it can never match, so it can never *earn* a `CURRENT` — and the
engine's response to that impossibility was to hardcode `freshness: "CURRENT"` instead.

**So the corpus does not merely fail invariant 2 ("CURRENT is earned"); it fails it in a
way that explains why.** Writing `freshness-engine.ts` without fixing (iii) would produce
an engine that reports `STALE` forever. This is the mechanical reason the freshness
module was never written. Confirms and extends CFA-01 G-06.

**Required:** SHA-256 over canonical JSON of `(viewId, sorted basisRefs, sorted
dependencyVersions, derivationRef)`, lowercase hex; `confirmedAt` reported but excluded
from every digest; byte/codepoint comparison, never `localeCompare`.

### MC-03 — Pointer staleness, as a first-class mechanical observation

**Required shape (PROPOSED):** for each cited ref, a record of
`{ declaredToken, observedToken, tokenMatch, resolvesAtRef, resolution, freshness,
freshnessProofRef }`.

- `tokenMatch: MISMATCH` is the *only* thing the CFA-03 "Critical" becomes. It is a
  comparison of two declared tokens. Nothing more.
- `resolution: UNRESOLVABLE` is mandatory when the ref cannot be resolved; it must never
  degrade to `ABSENT` (CFA-01 M-04, same rule, same reason).
- `NOT_DECLARED` is a legitimate outcome and must be reported as such, not as a failure.
  CFA-03's own `STATE.md:18` pointer is `self-labelled informational` — an honest
  `NOT_DECLARED`-class entry, and the engine should be able to say so.
- No output field of this record may be read, by the engine or by any consumer, as
  "the identity is current" (NC-01).

### MC-04 — `derivationIdentity` must exist and must be versioned

**OBSERVED:** `derivationIdentity` appears **zero** times in the corpus. The nearest
candidate is `ObserverId` (`"reality-git"`, …, corpus 184–191), which is an unversioned
name and carries no configuration.

**Required:** derivation identity must distinguish (a) a different derivation
implementation or configuration, (b) the same derivation over a different basis, and
(c) a different subject via the same derivation — my L1 §2.5. Today (a) is
unanswerable: two runs with different `config.json` freshness windows and different
`freshnessWindowMs` produce the *same* derivation identity. (b) is conflated with
`basisDigest`, and (c) with `subjectId`. Three distinctions, one flat enum.

### MC-05 — Evidence vocabulary: the reconciliation I am ruling on

This is the seam the owner assigned me. My ruling is in §4; the requirements it produces:

- **MC-05a** Every emission carries a `(status, reason)` pair, never a bare status.
- **MC-05b** The mapping from engine states to the ratified epistemic five is **total**,
  **versioned**, and **fail-closed**: an unmapped state degrades to `UNKNOWN` + reason and
  never to a guess, and never to `OBSERVED`.
- **MC-05c** No team-facing surface prints a non-ratified token. `UNOBSERVABLE` in
  particular must never cross the seam unprojected.
- **MC-05d** `CONFLICTED` is legal in **both** axes, and a `CONFLICTED` claim or a
  snapshot with unresolved conflicts **may not report freshness `CURRENT`**. Precedence
  `CONFLICTED > UNRESOLVABLE > STALE > CURRENT`.
- **MC-05e** `PROPOSED` is unreachable outbound and load-bearing inbound. The engine
  cannot assert a proposal; it may *carry* one as an attributed opaque citation.
- **MC-05f** Mapping is a projection, never an identity. An engine state is not a team
  state; the difference is a fact to be recorded, not a defect to be smoothed away.

### MC-06 — NCLL / Intent citations are carried opaquely, and are not basis

**Required:**

1. A citation is `{ scheme, owner, opaqueRef, revisionToken?, resolverHint }`. The engine
   **parses nothing, validates nothing, resolves nothing**. In, opaque, out.
2. The engine **may** observe that a cited file resolves at a ref with a given content
   digest. That is a *pointer* observation. It is not a check that the cited Intent is the
   right Intent.
3. **A citation is not a basis.** Recording an Intent ID changes nothing about whether its
   target is current. Citations must not raise the epistemic status of anything they
   accompany.
4. **An Intent is not a permission.** No output may place a citation in a position a
   consumer could read as authorization (invariant 8; my L1 §3 rule 7).
5. **Three distinct digests, three distinct field names.** `contentDigest` (bytes of a
   file), `basisDigest` (the freshness comparison token, MC-02), and canonical Intent
   `payloadHash` (D-411 seam, my TOOLSET #3) are three different things. The engine's
   `BasisRef.digest` conflates the first two. Same word, three referents, in a type
   consumers will reasonably read as one. Extends CFA-01 M-06 from the derivation side.
6. **Version token ≠ content identity.** `NCLL_VERSION = 0.1.0`,
   `vivim.mind` manifest `0.1.0`, and `WorldModel.v` are *declared* tokens.
   `vivim.mind`'s `contentHash` is currently **empty**
   (`STAGE-E-L2-CFA03-BASIS-ADAPTER-CHARACTERIZATION-2026-09-27.md` §3B), so no
   runtime-visible immutable content identity exists there at all. Wiring any of these to
   a `CURRENT` claim is certification with nothing behind it — my L2 falsifier, made
   operational. Where the engine observes these sources it must report the *token it
   found*, never `CURRENT` on the strength of a version string.

## 4. Ruling on the two peer findings (VERIFIED, EXTENDED, ONE REFRAMED)

A peer independently raised two findings against the same corpus. I re-verified both
against the source and against ratified team vocabulary. One is confirmed and extended.
The other is **correct in substance but mis-framed**, and the correction changes who may
decide it.

### 4.1 Finding 1 — `CONFLICTED` on the wrong axis. **VERIFIED, and worse than stated.**

**VERIFIED (OBSERVED).** The engine declares:

```text
EpistemicStatus : OBSERVED | DERIVED | UNKNOWN | UNOBSERVABLE | CONFLICTED   (corpus 195–200)
FreshnessStatus : CURRENT   | STALE   | UNRESOLVABLE                        (corpus 202–207)
```

The ratified CFA-03 working contract declares four freshness states including
`CONFLICTED` (`DERIVED-VIEW-BASIS-FRESHNESS-CONTRACT-2026-09-27.md` §3, §5), as does
the Steward-level shared L1 contract §5 (203–218), which additionally fixes precedence
`CONFLICTED > UNRESOLVABLE > STALE > CURRENT` and states the axes "must never be
collapsed."

**The consequence is confirmed and is live today:** `computeOverallFreshness` (1770–1778)
returns `"CURRENT"` whenever no member is `STALE`/`UNRESOLVABLE`, never consulting member
`status` or `snapshot.conflicts`. **A snapshot carrying unresolved `ConflictRecord`s
reports `freshness: "CURRENT"`.** This falsifies the engine's own invariant 8 ("You report
CONFLICTED") in the same commit that states it, and it is the direct mechanical cause of
the peer's concern.

**EXTENSION 1 — the framing "wrong axis" is inaccurate, and the correction is material.**
`CONFLICTED` is not in the wrong axis. It is in **both** ratified axes, and the engine
copied only the epistemic half of a two-axis vocabulary while dropping the freshness half.
That is an *incomplete copy*, not a *misplacement* — and the two situations call for
different fixes and different owners.

**EXTENSION 2 — a ratified-artifact contradiction that nobody has recorded (NEW, and it
changes the target).** The team's machine-readable boundary schema and the team's prose
contract disagree with each other on the freshness axis:

| Artifact | Freshness values | Class |
|---|---|---|
| `BOUNDARY-DESIGN-SYSTEM/SCHEMAS/boundary.schema.json` `$defs.claim.freshness` | `["CURRENT","STALE","UNRESOLVABLE"]` — **3** | OBSERVED |
| `BOUNDARY-DESIGN-SYSTEM/STAGE-E-L1-…CONTRACT-2026-09-27.md` §5 | "freezes exactly four derived freshness states" incl. `CONFLICTED` — **4** | OBSERVED |

Both are ratified team material. **The target is therefore not uniquely determined
today**, and an implementer who reads one and not the other will produce a
spec-compliant-looking engine either way. I record this; I do not resolve it. Routed as
UC-01.

**EXTENSION 3 — the same schema settles the second finding.**
`boundary.schema.json` `$defs.claim.epistemic_state` is
`["OBSERVED","DERIVED","PROPOSED","UNKNOWN","CONFLICTED"]` — **machine-readable, five
members, `PROPOSED` present.**

### 4.2 Finding 2 — "adding `PROPOSED` is not CFA-03's to do". **CORRECT IN SUBSTANCE, REFRAMED.**

**Where the peer is right (I concur and add the citation):** the disposition of
`UNOBSERVABLE` — a token that exists in the engine and in **no** ratified team
vocabulary — is not mine. I am not ratifying it and not removing it.

**Where the framing needs correcting (PROPOSED):** the engine's defect is **not** that it
lacks `PROPOSED`. It is that the engine **omits a ratified member** while **inventing an
unratified one**. `PROPOSED` already exists, already ratified, already machine-readable
in `boundary.schema.json`. Restoring it is *conformance to ratified vocabulary*, not a
vocabulary change, and it needs no new ratification.

Consequently:

- **Restoring `PROPOSED` to the engine's enum is not a shared-vocabulary change.** I
  decline to route it as one, because routing it as one would stall a conformance fix
  behind a governance question that does not exist.
- **What genuinely is not mine:** the reconciliation of the 3-vs-4 freshness contradiction
  (UC-01), the ratification status of `UNOBSERVABLE` (UC-02), and who owns the mapping
  version (UC-06).
- **But the deeper resolution makes the question mostly moot (PROPOSED, preferred):** if
  the engine's team-facing surface is the **evidence dossier** — synthesis tool **C3**,
  Phase NOW, which already carries OBSERVED/DERIVED/PROPOSED/UNKNOWN plus
  CURRENT/STALE/UNRESOLVABLE — then the engine needs **no team-facing epistemic surface
  at all**. It stays purely mechanical; the CFA labels; the dossier is the only crossing
  point. This dissolves the projection problem instead of governing it, and it is
  consistent with the synthesis's own tension #4 ("implement once, cite everywhere; second
  stores stay forbidden"). Routed as UC-08; CFA-03 proposes it.

### 4.3 The qualification/mapping I am ruling in (PROPOSED — no state added, none removed)

| ratified epistemic | `reason` discriminator | engine form | L1 freshness |
|---|---|---|---|
| `OBSERVED` | `directly-measured` | measured field | independent |
| `OBSERVED` | `pattern-matched` | measured string **+** basis-carrying derived label | independent |
| `DERIVED` | `computed-from-observations` | value + `rule` + input `basisRefs` | independent |
| `PROPOSED` | *(not emittable outbound)* | arrives **inbound** as an attributed citation | independent |
| `UNKNOWN` | `not-yet-observed` | engine `UNKNOWN` | — |
| `UNKNOWN` | `unobservable-in-this-environment` | engine `UNOBSERVABLE` **folded** | — |
| `UNKNOWN` | `required-basis-missing` | engine `UNKNOWN` | `UNRESOLVABLE` |
| `CONFLICTED` | `contradictory-observations` | `ConflictRecord`, both sides retained | `CONFLICTED` |

Three rulings inside this table:

1. **`UNOBSERVABLE` is folded, not ratified.** It is a genuinely useful internal
   distinction and losing it would lose a real one — but it is an *engine-internal
   convenience* qualified under `UNKNOWN`, never a ratified state. Rule: keep it inside the
   engine, forbid it from crossing the seam unprojected (MC-05c).
2. **`PROPOSED` is inbound-only.** A mechanical observer has no standing to assert a
   proposal. A CFA-03 L2 characterization *is* a `PROPOSED` artifact and may be cited as
   one; the engine may carry that citation opaquely and may not restate its epistemic
   status as its own. This is the clean form of "carried opaquely".
3. **`CONFLICTED` in both axes, with a hard prohibition.** Not "prefer not to"; *may
   not*. MC-05d. This is a precedence rule, not a new state — which is why it needs no
   ratification and can be fixed now.

**One further requirement the peer's framing makes visible (PROPOSED):** the mapping
table itself needs an owner and a version, or it becomes a silent fourth vocabulary
(UC-06). A mapping with no version is a mapping that drifts.

## 5. (b) Scope verdict: HYBRID — same skeleton, one CFA-03 amendment

I reach the same verdict as CFA-01 by a different route, and I do not restate its
reasoning. Both pure options are wrong for one shared reason: **each defers the
machinery that makes a *derived* fact citable until after the breadth that makes it
fast and widely wrong.** The engine's entire value to CFA-03 is derived facts —
staleness, drift, divergence, pre-closure — and *none of them is currently citeable*
(MC-01), *distinguishable from a measurement* (MC-01), or *comparable over time*
(MC-02).

| Option | Gets right | Rejected because |
|---|---|---|
| **A. Pragmatic-v1 Waves 0–3** | Correct first atom; honest deferral table; "not authoritative — it observes Git". | Emits `freshness: "CURRENT"` as a literal (line 98) with no freshness module anywhere in its deferral table. Ships a `basis-cache.json` that gotcha #4 forbids. Ships the defect it claims to avoid, in week 1. |
| **B. Full Phase-1 Slices 1–9** | Correct law; invariants, taxonomy and falsifiers largely reusable verbatim. | Ten weeks put truthfulness last, and the corpus shows slice 1 delivering a Git observer with hardcoded `CURRENT` and no basis/freshness/path modules. **Ordering is the defect, not content.** |
| **C. Hybrid** | A's first atom, B's law, B's truthfulness floor moved into increment 1. | — |

**My amendment to increment 1a (the CFA-03 constraint):** truthfulness is not
sufficient; **citeability** is the floor. Increment 1a must additionally contain
per-claim basis (MC-01), reachable `DERIVED` (MC-01), the two-axis status+reason
projection (MC-05), and a SHA-256 `basisDigest` that excludes observation time (MC-02).
Without those four, increment 1a produces a faster engine that reports every derived
fact as an unciteable measurement — and CFA-03's entire first requirement, "trustworthy
continuity basis", is a *derived* fact.

**My addition to increment 1c:** pre-closure reports `{ value, status, basis, reason }`
per check and emits **no verdict**. This is a continuity defect before it is a governance
defect — see the cut table.

### 5.1 Cut list from this lens (defects, not deferrals)

| Item | Corpus | Why it is a CFA-03 defect, not only an engineering one |
|---|---|---|
| Per-envelope `basis` for a composite value | 1111–1124 | Unciteable derivation; unrecorded dependency (MC-01) |
| `computeOverallFreshness` ignoring `status`/`conflicts` | 1770–1778 | Makes contradiction report `CURRENT` (MC-05d) |
| 32-bit accumulator + `localeCompare` + `confirmedAt` in the digest | 1754–1768 | The digest cannot mean anything (MC-02) |
| Snapshot-level single `freshness: FreshnessStatus` | 270, 1534–1554 | One boolean over a heterogeneous set; it is the *mechanical cause* of the CONFLICTED/`CURRENT` bug. Replace with per-section freshness + a precedence rollup. |
| `status: "OBSERVED"` on a composite containing derived members | 1213 | Asserts measurement for a rule (MC-01) |
| `derivationIdentity` absent | never appears | Three distinctions, no vocabulary (MC-04) |
| `preclosure()` four hardcoded `true`s | 1639–1646 | `artifactExists: true` is a fact with **no basis and no observation** — a fabricated `OBSERVED` claim about an artifact. Same shape as my L1 falsifier #4. Its own comment says "Needs artifact path parameter". |
| `MECHANICAL VERDICT: READY FOR CLOSURE` | 2413 | Crosses the engine's own Phase-5 boundary; and a *derived verdict* about whether work is complete is exactly a semantic-closure claim (NC-03) |
| `BasisRef.digest` conflating content digest and basis digest | 209–223 | One field, two referents; extended by `payloadHash` into three (MC-06.5) |

### 5.2 Defer list (deferral, with the trigger that would un-defer)

| Item | Trigger to revisit |
|---|---|
| Daemon (Slice 9) | A named consumer that cannot tolerate `reality hooks install` latency. Concur with CFA-01. |
| Recursive fs watcher (Slice 2) | A named consumer needing sub-second file events. `git status --porcelain=v2 -z` covers the CFA-03 need today. |
| Semantic citation *resolution* | Deferred indefinitely. MC-06 requires opacity; resolution is a grounding tool (my TOOLSET #2), not an engine function. |
| OpenCode API integration | The CFA-03 need is the branch/ref basis, which the Git observer already supplies. |

## 6. (d) Must-nots at the CFA-03 seam

- **NC-01 — The engine never asserts that a meaning is current.** `isCurrent` is not an
  engine output. `pointerFreshness` is. This is the guard for the `Critical` line, and it
  is the direct mechanical form of my L1 falsifier #5.
- **NC-02 — The engine never interprets a citation.** Opaque in, opaque out. No parsing,
  no validation, no normalization, no "is this the right Intent".
- **NC-03 — The engine never gates an effect.** No closure verdict, no block/allow, no
  exit code that a gate may consume as permission. Exit codes report *observation quality*
  and must be labelled as such (setup prompt 483–489, `1 = state observed but has
  conflicts/unknowns`). A number that means "I am unsure" must never be readable as "you
  may not proceed".
- **NC-04 — The engine never collapses `UNKNOWN` into failure.** Live hazard: exit code 2
  is `observer unavailable / unresolvable`, and every automation convention reads non-zero
  as failure. That converts an *epistemic gap* into an *operational failure*. The Durable
  Completion Gate already has a state for this — `REPORTED-UNVERIFIED` — and the engine's
  non-zero must never cause a gate to auto-downgrade a session into it. Concretely: no
  consumer may map a `reality` exit code onto a work verdict.
- **NC-05 — The engine never emits a state it did not receive, and never drops one it
  did.** Guards the `UNOBSERVABLE` leak outward and the silent `PROPOSED` drop inward.
- **NC-06 — The engine never lets a basis ref be read as an address.** `BasisRef.ref` is
  channel-local: not a World `(ns,id)`, not an Intent ID, not an NCLL frame, not a
  canonical pointer. Convergent with CFA-01 F-02/N-01, extended to the citation axis.
- **NC-07 — The engine never certifies CFA-03's own semantic basis.** It may observe that
  NCLL or `vivim.mind` source files exist at a ref with a digest. It may not compute the
  CFA-03 derivation basis, and it may not report `CURRENT` for `cfa03:ncll-derivation` or
  `cfa03:mind-derivation` on a version token. Those adapters are CFA-03 artifacts (L2
  closed); the engine is one of their `BasisRef` **channels**, never their owner.
  Self-certification is the standing "self-knowledge authorizes" violation, reached
  through freshness instead of permission.
- **NC-08 — No fact without a basis.** An emitted value with an empty `basis` and no
  `reason` is a claim, not an observation. The engine's own output is subject to the rule
  it exists to enforce.
- **NC-09 — `.dev-reality/` is cache, never a second evidence store.** The synthesis
  already forbids second stores (tension #4) and the engine is a *provider* of basis, not
  a canonical record (CFA-01 U-02, which I concur with). Retention must be lossless for
  unresolved conflicts; pruning an unresolved conflict destroys evidence.

## 7. (e) Acceptance-criterion additions

Additive to the setup prompt's list. Each phrased so a fresh session can satisfy it
without archaeology.

- **AC-01** Every emitted fact carries a non-empty `basis` **or** a `reason` from the
  closed discriminator set. The set of facts with neither is provably empty.
- **AC-02** `DERIVED` is reachable, and every `DERIVED` fact carries its `rule` and its
  input `basisRefs`. A composite value mixing measured and derived members is not
  emitted.
- **AC-03** `basisDigest` is SHA-256 lowercase hex; byte-identical across two runs, two
  machines and two locales; identical for an unchanged basis; different when any required
  basis token changes; **unchanged by a change in observation time alone**.
- **AC-04** `derivationIdentity` distinguishes implementation, configuration, basis and
  subject, and is retrievable per observation.
- **AC-05** The engine-state → ratified-epistemic mapping is total, versioned, and
  fail-closed; every engine status resolves to exactly one ratified state plus a reason;
  an unmapped status yields `UNKNOWN` + reason and never a guess.
- **AC-06** No team-facing surface emits `UNOBSERVABLE` or any other non-ratified token.
- **AC-07** A claim or snapshot with unresolved conflicts **cannot** report freshness
  `CURRENT`. Verifiable by constructing the conflict and asserting the emitted value.
- **AC-08** `reality for cfa-03` reports, per cited ref, the resolution, the observed
  content digest with `digestKind: "content-not-revision"`, and any declared-vs-observed
  token comparison — and emits **no** field that could be read as identity currency.
- **AC-09** An NCLL or Intent citation round-trips through the engine **unchanged and
  opaque**, with zero extracted semantics in the output.
- **AC-10** `contentDigest`, `basisDigest` and `payloadHash` are three distinct fields,
  and no code path compares one against another.
- **AC-11** Every exit code is documented as a report of **observation quality**, and no
  shipped consumer maps one onto a work verdict.
- **AC-12** The pre-closure report contains per-check `{ value, status, basis, reason }`
  and no verdict string (verifiable by string assertion over the formatter).

## 8. (f) Falsifier additions

Additive to the prompt's 21. The engine is broken if **any** is true.

- **WC-01** A claim or snapshot with unresolved conflicts reports `freshness: "CURRENT"`.
- **WC-02** A `DERIVED` value is reported with `status: "OBSERVED"`.
- **WC-03** Any fact is emitted with an empty `basis` and no `reason`.
- **WC-04** `basisDigest` changes between two observations of an unchanged basis
  (observation-time leakage), or two different bases produce the same digest.
- **WC-05** Canonicalization under two system locales produces different bytes, or an
  array whose order is semantic changes order after serialization.
- **WC-06** A derived fact's real input command/artifact is absent from its dependency
  vector while unrelated bases are present in it.
- **WC-07** A citation is parsed, normalized, validated, or resolved by the engine.
- **WC-08** A non-ratified token (`UNOBSERVABLE`) appears on a team-facing surface, or a
  ratified state (`PROPOSED`) is silently dropped rather than qualified.
- **WC-09** A pointer-staleness record, or any field of a `reality for cfa-03` output, is
  read by the engine or a shipped consumer as a statement that an identity or meaning is
  current.
- **WC-10** A non-zero exit code is consumed as a work-failure decision rather than an
  observation-quality report — in particular, any path that auto-downgrades a session to
  `REPORTED-UNVERIFIED` on `reality` exit status alone.
- **WC-11** The engine reports `CURRENT` for a CFA-03 derivation (`cfa03:ncll-derivation`,
  `cfa03:mind-derivation`) on the strength of a version token such as `0.1.0` or
  `WorldModel.v`, with no content identity behind it.
- **WC-12** `reality for cfa-03` returns an empty list because a cited ref was renamed or
  moved, instead of `UNRESOLVABLE` + reason.
- **WC-13** Pre-closure reports a fact it did not observe, or any output states a closure
  verdict.
- **WC-14** `derivationIdentity` is unchanged across two runs with different observer
  configuration.
- **WC-15** The engine reports on its own repository/specification files and the result is
  suppressed, exempted, or used to justify editing the spec.

## 9. (g) Gotcha additions

Additive to `gotchas.txt`. Each presents as a correct-looking result.

- **GC-01 — The basis-aliasing trap.** One `basis` array on a composite `value` looks
  complete and is silent about which member rests on which input. The derived members
  inherit a basis that is not theirs, and the command that actually produced their inputs
  is recorded nowhere. Neither the over-attribution nor the omission is visible in the
  output.
- **GC-02 — The unreachable epistemic state.** `DERIVED` is declared and never assigned;
  `status: "OBSERVED"` is assigned exactly once in 2710 lines. A vocabulary you never emit
  is not a capability, and a reviewer reading the type system will believe the engine
  distinguishes a measurement from a rule.
- **GC-03 — The digest that can never match.** `confirmedAt` inside every `BasisRef` makes
  `basisDigest` a function of observation time. It changes on every run, so it can never
  *earn* a `CURRENT` — and the engine's response was to hardcode `CURRENT`. This is a
  different cause from gotcha #1, it survives a perfect path canonicalizer, and it is the
  mechanical reason the freshness module was never written. (Extends CFA-01 G-06 with the
  consequence.)
- **GC-04 — The two-enum trap.** Two ratified team artifacts, two freshness enums, 3
  values versus 4. An implementer will read one, produce an engine that looks compliant
  against it, and never discover the other exists. Neither is wrong; the pair is
  inconsistent.
- **GC-05 — The citation-is-not-a-basis trap.** An Intent ID or an NCLL frame reference
  sitting in a report *looks* like provenance. It is a pointer. Its presence must not
  raise the epistemic status of anything beside it, and a report that cites something is
  not thereby better evidenced.
- **GC-06 — The version-token trap.** `NCLL_VERSION = 0.1.0`, `vivim.mind` `0.1.0`,
  `WorldModel.v` are *declared* tokens, and `vivim.mind`'s `contentHash` is currently
  **empty**. Every one of them will pass a naive freshness check and none of them
  identifies implementation bytes. Version-only identity must be visibly labelled as
  weaker, and must never certify `CURRENT`.
- **GC-07 — The exit-code-as-verdict trap.** `1 = conflicts/unknowns` is the single most
  consumed field in the engine, and it is an epistemic report. Anything gating on it turns
  a gap in *knowing* into a failure of *doing* — and the repository already has a distinct,
  correct state for that (`REPORTED-UNVERIFIED`). Wiring the two together is a one-line
  mistake with a large blast radius, because the receipt validator is a shipped consumer.
- **GC-08 — The self-observation trap.** The engine observes a repository that contains its
  own specification. It will find that spec change and may report itself `STALE` or
  `CONFLICTED`. That is a **correct and useful** observation. The trap is the implementer
  who "fixes" it by exempting the engine's own files — which manufactures a
  self-exempting authority inside a component whose entire purpose is to have none.
- **GC-09 — The projection drift trap.** A mapping table from engine states to ratified
  states, with no version and no owner, is a fourth vocabulary that nobody governs. It
  will drift the first time either side changes, silently, and the failure will surface
  as a wrong epistemic label in a receipt.

## 10. Unknowns with named owners

No entry below is filled by this unit. Each is routed.

| ID | Unknown | Owner | CFA-03 position |
|---|---|---|---|
| **UC-01** | Which freshness vocabulary is canonical — `boundary.schema.json`'s **3** values, or Stage-E L1 §5's frozen **4**? | Architecture Steward (contract owner) + CFA-04 (authority vocabulary) | **Blocking for team-facing output.** I do not decide between two ratified artifacts. Until ratified, the engine's freshness field is not team-facing and no consumer may map it into a receipt. |
| **UC-02** | Is `UNOBSERVABLE` eligible for ratification as a `reason` under `UNKNOWN`, or must it be removed from the engine entirely? | Steward + CFA-04 | Reason-discriminator (fold), never a state. Keep it inside the engine; forbid it from crossing the seam. |
| **UC-03** | What is the canonical identity form of a **continuity citation** — the CFA-03 analogue of CFA-01's `U-05` for `subjectId`? | CFA-02 (durable record identity) + CFA-01 (meaning address) + Steward | A citation is a pointer, not an address. Propose a namespace provably disjoint from World `(ns,id)` and from Intent IDs. |
| **UC-04** | May a CFA-facing projection carry a *semantic* status label at all, or only `(mechanical fact, basis, freshness)` with the CFA labeling? | CFA-03 proposes; CFA-04 if any label could be construed as a claim | **The CFA labels; the engine publishes mechanical status + reason only.** This is the cleanest available anti-collapse rule and it is mine to propose. |
| **UC-05** | May `reality for cfa-03` compute a content digest over a cited protocol ref? Gotcha #5 permits `crypto.createHash('sha256')` on file content. | CFA-04 (reading is cheap, but a digest will be read as identity) + CFA-09 (compat envelope) | Permitted mechanically; must be emitted as `contentDigest` with `digestKind: "content-not-revision"`, never as identity or revision. |
| **UC-06** | Who owns and versions the engine-state → ratified-state mapping? | Architecture Steward | Needs a named owner and a version before the table ships. A mapping with no version is a silent fourth vocabulary (GC-09). |
| **UC-07** | What is the honest relationship between a `reality` snapshot and the Session Result Contract's `TARGET_REF` / `BASE_MAIN_SHA`? | CFA-05 (work lifecycle) + CFA-10 + Steward | A snapshot is not a receipt; a receipt is not a snapshot; neither may stand in for the other. Convergent with CFA-01 U-14 — recorded as convergent, not claimed as new. |
| **UC-08** | **Preferred escape:** can the **evidence dossier** (synthesis C3, Phase NOW, already carrying the ratified vocabulary) *be* the entire team-facing projection, so the engine never needs one? | CFA-03 proposes + Steward; CFA-02/CFA-09 as current C3 owners | **Preferred.** It dissolves the projection problem rather than governing it, and matches synthesis tension #4 ("implement once, cite everywhere; second stores stay forbidden"). |
| **UC-09** | Does the CFA-03 basis adapter (L2, closed) become a *consumer* of the engine, a *provider* to it, or both — and in which direction is the cycle broken? | CFA-03 proposes; CFA-02 (store classification) + CFA-10 (runtime guarantees) | Provider, never replacement (concur CFA-01 U-02). The engine supplies mechanical channels; the adapter owns the semantic basis. |
| **UC-10** | Is `docs/Reality-engine/` evidence to preserve, or disposable? | Owner + Steward | Convergent with CFA-01 U-13. The folder is untracked owner material; if "the version we need" replaces it, the replacement's lineage should cite it rather than silently diverge from it. |

## 11. Evidence classification of this document

| Claim | Class |
|---|---|
| Branch divergence; synthesis file absent from the session worktree; `docs/Reality-engine/` untracked | OBSERVED this session |
| `STATE.md:20` declares contract `1.1`, contract is `1.2`; `STATE.md:19` declares FSSP `1.3`, protocol is `FSSP-1.3`; `STATE.md:18` SHA stale | OBSERVED this session |
| `status:"OBSERVED"` assigned once; `DERIVED` and `PROPOSED` assigned zero times; `UNOBSERVABLE` appears once | OBSERVED in the corpus |
| `computeOverallFreshness` returns `CURRENT` without consulting `status` or `conflicts`; 11 of 18 CLI commands reach `default:`; per-envelope basis; `rev-list` absent from the basis vector; 32-bit + `localeCompare` + `confirmedAt` in the digest; `derivationIdentity` absent; 4 hardcoded preclosure `true`s; closure verdict string | OBSERVED in the corpus |
| `boundary.schema.json` epistemic = 5 (incl. `PROPOSED`), freshness = 3; Stage-E L1 §5 freezes freshness = 4 | OBSERVED in ratified team material |
| D-1..D-3 extensions, the 3-vs-4 contradiction, the digest consequence chain, the two-enum and projection-drift traps | DERIVED from cited OBSERVED artifacts |
| MC-01..MC-06, NC-01..NC-09, AC-01..AC-12, WC-01..WC-15, GC-01..GC-09, the hybrid verdict, the cut/defer lists, §2.5, §4.3 | PROPOSED |
| The `Critical` line as written asks for a ratification-validity oracle | DERIVED (decomposition in §2.3) |
| UC-01..UC-10 | UNKNOWN, routed with named owners |

## 12. Boundaries and non-actions taken this session

- No Ω law touched. `CURRENT-INVARIANTS.md`, `BUILD-DECISIONS.md`, D-records untouched.
- No implementation, no code, no `dev-reality/` directory created.
- No central synthesis attempted; the ten-CFA reconciliation is Steward-owned.
- No shared CFA boundary activated.
- **No state added to, removed from, or renamed in any shared vocabulary.** `UNOBSERVABLE`
  and the 3-vs-4 freshness contradiction are recorded and routed, not decided.
- `docs/Reality-engine/` read only — not committed, not edited, not moved, not staged.
- Peer homes untouched. Peer uncommitted modifications in the primary worktree untouched.
- Peer findings re-verified independently against source; agreement is credited, one
  framing is corrected with its citation, and correction is not treated as a peer error.
- Peer-homed unknowns routed by name, not by writing into peer homes.

## 13. What this unit asks the Steward to decide

1. Accept or reject the **hybrid scope verdict** in §5, including the CFA-03 amendment that
   increment 1a carries **citeability** (per-claim basis, reachable `DERIVED`, two-axis
   projection, SHA-256 digest) and not merely truthfulness.
2. Accept or reject the **cut list** in §5.1 — these are defects, not deferrals.
3. Ratify the **qualification/mapping shape** in §4.3: no state added, `UNOBSERVABLE`
   folded to a `reason`, `PROPOSED` inbound-only, `CONFLICTED` legal in both axes with a
   hard prohibition on `CURRENT`. In particular, confirm that restoring `PROPOSED` is
   treated as **conformance** to `boundary.schema.json` rather than as a vocabulary change.
4. **Route UC-01 first.** Until the 3-vs-4 freshness contradiction is reconciled, no
   engine freshness field is team-facing. This blocks increment 1a's projection work and
   is the one item where CFA-03 declines to proceed on its own authority.
5. Accept or reject **UC-08** — the dossier as the entire team-facing projection, which
   would remove the need for an engine-side epistemic surface altogether.
6. Assign **UC-02, UC-04, UC-06** before any projection ships; each one changes what the
   engine is permitted to say.
