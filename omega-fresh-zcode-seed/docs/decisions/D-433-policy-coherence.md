# D-433 — Policy coherence: the conflict lattice and the composition security scan (Ω-2.5)

## Status

RATIFIED

## Context

- The law layer's two silent failure modes, named by the 100 (scenarios #37 and
  #40) and specified by the Ω-2.5 builder-gap doc (`D-434`, reserved paper id —
  the external upgrade spec this tree record translates; content over number):
  policies that fight, and compositions that smuggle.
- Policies accumulate across months: a broad grant ("my agent may read ns
  chat"), a later restriction ("nothing reads ns chat after midnight"), a
  plugin-shipped advisory, an amendment, a delegation. Today, which one "wins"
  depends on which row the walk happens to consult first — silent
  nondeterminism at the exact layer whose entire job is determinism. And when
  two rules disagree outright, the system picks one and logs nothing: the user
  asks "why did my agent read that?" and the true answer — "two of your rules
  disagreed and the tiebreak was load order" — is unrecoverable. Evidence dies
  at the very gate whose product is evidence.
- Compositions are signed capability sets, but their payload can carry a
  hardcoded API key, a capability the principal never granted, a UI selector
  stored as truth (the anti-pattern the constitution forbids), or an
  undeclared side effect. Without a pre-activation scan the signature vouches
  for the smuggler.
- Recon facts that shape the mechanism: `vivim.law` already owns the seams this
  builds on — policy as DATA (`D-215`/policy.ts), the per-principal overlay
  with vault persistence and boot reload (`D-325`), the vault-journal fold
  (`D-416`), the principal-identity rows (`D-412`), the shadow-amendment
  observer (`D-213`). Composition manifests are real JSON in `compositions/`:
  `{name, entries[].{id, source, bootPhase, grant.{capabilities, contracts},
  config}}` — the scanner's checks are written against those fields, not an
  invented shape. The risk-parity net (`D-351`) holds manifest-declared
  non-READ ops to exact policy rows; this record's four ops declare READ (the
  `law.forbidden.set@1` precedent — enforcement lives in `law.check@1`, the
  vault writes ride the fold), so the net's domain is untouched.

Blocks: none

## Options

| Criterion | (a) lattice + scanner inside vivim-law: two modules, four ops, the law.check seam | (b) a standalone vivim-conflict plugin | (c) gate-stage tooling (tooling/gates/*) |
|---|---|---|---|
| Resolution is part of the gate, not a pass before it | Yes — law.check consults the row store; a paradox blocks the scope at the one place rules acquire meaning | No — a plugin that "harmonizes" policies rewrites the constitution at runtime; the highest-value privileged path | No — the gate would re-derive law semantics outside the law compartment |
| The scan is a border check, not advice | Yes — activation requires a passing scan row citing the manifest hash; a red finding is a named refusal | The smuggler guards the door — a peer plugin's verdict is advisory to the signer | Partial — CI-time only; local activation (the daemon path) is unscanned |
| Replayable byte-for-byte | Yes — pure functions over the row set; explain re-walks the lattice deterministically; inputHash pins the scanned bytes | Yes, but the resolution walk would live outside the law's own journal | No — tooling output is a report, not a ledgered row |
| Zero host LOC, no new write path | Yes — plugins/vivim-law only; vault rows through the existing granted ports | Yes | Yes |
| Existing compositions byte-identical | Yes — empty row store ⇒ the lattice layer never engages; READ-risk ops ⇒ the parity net's domain untouched | Yes | Yes |

## Decision

**Decision:** (a) — two modules in `plugins/vivim-law/src/` plus four ops, in substance:

- **`conflict.ts` — the policy lattice.** A policy row is DATA:
  `{ id, principal, precedenceClass: constitutional|statutory|grant|advisory,
  scope, effect: allow|deny|constrain, constraint?, supersedes?,
  supersededBy? }`. `supersededBy` is DERIVED by replay, never stored on the
  old row: an amendment appends a new row naming its target via `supersedes`,
  and the active view fills `supersededBy` — the amendment chain is
  append-only, never edited. `constraint` is a typed payload
  `{ windows?: ["HH:MM-HH:MM"], rateCapPerMin?, retentionFloorDays? }`.
  **Resolution is a total deterministic function** of the row set:
  1. collect applicable rows (principal exact-or-`*`, scope glob match, not superseded);
  2. order by precedenceClass — constitutional > statutory > grant > advisory;
  3. the highest surviving class decides; lower classes are recorded in the
     walk as superseded-by-precedence, never silently applied;
  4. within the surviving class the effect is most-restrictive (deny >
     constrain > allow — deny-overrides-allow generalized); constraints
     intersect (windows pairwise, rate caps by min, retention floors by max);
  5. an empty applicable set resolves deny — fail-closed, most-restrictive;
  6. two unrecoverable states are PARADOX, first-class: **constitutional
     allow+deny in direct opposition** (the constitution may not contradict
     itself — at statutory/grant/advisory the same pair resolves
     deny-overrides-allow and is ledgered resolved), and **constraint
     intersection that empties** (narrowing is the only safe direction;
     union would be an expansion of permission wearing a constraint's
     clothes). A paradox carries BOTH rule ids in its sentence.
- **`law.conflict.scan@1`** — the coherence sweep over the whole active row
  set: every pair that can interact (overlapping scope, principal-compatible)
  is evaluated symbolically; resolvable pairs produce `conflict.resolved@1`
  rows `{policyA, policyB, resolution, precedenceApplied, scannedAt,
  inputHash}`, paradoxical pairs produce `conflict.paradox@1` rows
  `{policyA, policyB, scope, sentence, blockedUntil, inputHash}` that block
  the affected scope until amended. No mutable summary table: the active
  resolution of a pair is derived by replay, never stored as editable truth.
- **`law.conflict.explain@1`** — the deterministic replay of the lattice walk
  for any (principal, op): the ordered steps (applicable rows, class
  precedence, effect composition, constraint intersection) as sentences —
  every "why did the gate decide that?" question becomes answerable by
  re-execution, not archaeology.
- **`policy.amend@1`** — the append-only supersession: appends the amendment
  row, marks the target superseded, then RE-RUNS the conflict scan; an
  amendment that would CREATE a new paradox is refused LAW_POLICY_PARADOX and
  rolled back — the live set never gains a paradox by its own hand. Paradoxes
  still arrive honestly through history (vault replay of rows written before
  this law, or by a foreign writer) — and then they are loud: the scan
  ledgers the paradox row, the scope blocks, the amendment unblocks.
- **`compose-scan.ts` — the composition security scan.** Five checks over the
  REAL manifest shape, each backed by a VERSIONED, INSPECTABLE pattern set
  (exported data — `SECRET_PATTERN_SET_V1`, `SELECTOR_PATTERN_SET_V1` — never
  a hidden constant, because a secret scanner whose patterns you cannot
  inspect is a scanner that can be taught to miss): **secret-pattern**
  (hardcoded keys/tokens/passwords in any manifest string),
  **grant-coverage** (every capability the manifest references must be in the
  principal's live grant set — the capability-graph input), **selector-as-
  truth** (DOM/CSS/XPath selectors stored in durable config fields),
  **mutation-declaration** (side-effect references — op-shaped strings,
  write targets — outside the declared surface: granted contracts, declared
  mutations, per-entry config), **budget-binding** (stream/loop-shaped
  contracts without a declared budget — the Ω-2 hookup). The verdict is a
  ledgered `compose.scan@1` row `{compositionRef, manifestHash, findings[],
  verdict: pass|refused, scannedAt}` citing the exact manifest bytes
  (`manifestHash` = sha256 over the canonical serialization).
- **`compose.scan@1`** — the gate stage as an op: `action:"scan"` runs the
  five checks and ledgers the row; `action:"activate"` refuses unless a
  PASSING scan row exists whose manifestHash matches the manifest being
  activated — a stale or missing row is COMPOSE_SCAN_NOT_RUN; a red row is
  refused naming every finding's code and locator. Compositions can be built
  dirty for testing; they cannot RUN dirty.
- **The law.check seam** — when the row store is non-empty, the gate consults
  the lattice: a scope blocked by a standing paradox denies with
  LAW_CONFLICT_UNRESOLVED naming the pair; a live constitutional paradox
  denies with LAW_POLICY_PARADOX; a lattice deny denies; allow/constrain
  leave the baseline policy decision unchanged (the row layer only narrows —
  most-restrictive composition with the existing policy walk). An EMPTY row
  store leaves law.check byte-identical to today — every existing composition
  boots unchanged.
- **Namespace law**: `law.conflict` (owner vivim.law, sole writer the conflict
  scan — policy rows `policy:<id>` append-only, conflict rows
  `conflict-resolved:`/`conflict-paradox:` append-only; retention forever)
  and `compose.scan` (owner vivim.law, sole writer the composition scanner —
  `scan:<boot>-<seq>` rows; retention compose-scan-2y, 730-day shred with
  tombstones forever). Both ride the `D-325`/`D-416` persistence posture:
  vault rows wherever `port:vault.append/query/get@1` are granted, boot
  reload with bounded retries, memory-only otherwise — stated, never hidden.
- **Refusal register** (sentences verbatim): LAW_POLICY_PARADOX ("Your rules
  {A} and {B} contradict each other in scope {scope} and the law refuses to
  guess; amend one and the scope unblocks.") · LAW_CONFLICT_UNRESOLVED
  ("This scope is blocked by an unresolved policy paradox; the law does not
  execute where it disagrees with itself.") · COMPOSE_SCAN_SECRET_FOUND ·
  COMPOSE_UNGRANTED_CAPABILITY · COMPOSE_SELECTOR_AS_TRUTH ·
  COMPOSE_UNDECLARED_MUTATION · COMPOSE_SCAN_NOT_RUN ("This composition has
  no scan row matching its manifest hash; unscanned code does not activate,
  full stop."). The fifth check's own code (COMPOSE_UNBUDGETED_LOOP) is
  declared with its check and recorded as a NON-BLOCKING finding until Ω-2's
  budget ledger lands (five shipped compositions today grant stream-shaped
  contracts with no manifest budget — the check reports them honestly today
  and flips blocking when Ω-2 gives budgets a ledger to bind to).

## Consequences

- The law may not contradict itself silently: every conflict resolves by
  explicit precedence with most-restrictive at the tie, and the residue —
  paradox — is a first-class refusal with a sentence naming both rules, never
  a coin-flip that executes quietly. Resolving a paradox is an explicit
  amendment, and the conflict's resolution is itself history (ledgered rows).
- The resolution mathematics is a pure function: 1,000 randomized pairs
  replay identically across 100 runs, order-independent — the falsifier makes
  determinism a property of the code, not a claim in a doc.
- Composition activation gains a border check worthy of the name: secrets,
  ungranted capabilities, stored selectors, and undeclared mutations are
  named refusals at activation, each citing its locator; unscanned code does
  not activate at all. The pattern sets are versioned data — the scanner can
  be audited by reading it.
- The scan is static analysis over manifest bytes, bounded and honest: it
  catches what its versioned patterns express, no more. A determined
  smuggler who obfuscates past the pattern set is Ω-trust-mesh territory,
  not this record's — stated plainly.
- law.conflict.explain makes the gate's reasoning replayable, but only over
  the CURRENT row set for live queries; historical replay re-walks a past row
  set fed from the append-only vault rows — the rows are the history, the
  walk is a pure function over them.
- Zero host LOC; writes only through the existing granted vault ports; the
  four ops declare READ risk (the `law.forbidden.set@1` precedent — the
  enforcement teeth live in `law.check@1` and the activation gate); the
  parity net's domain, the compositions, and every existing test surface are
  untouched (empty row store ⇒ byte-identical law.check).

## Evidence

- Falsifiers, green in this record's tree BEFORE the flip per `D-364`
  (`omega:loop --stub D-433` generates the RED stub this list resolves to):
  - `F-LAW-COHERENCE.1` (deterministic-resolution) — 1,000 randomized policy pairs resolve identically across 100 replays: the lattice (constitutional > statutory > grant > advisory; deny-overrides-allow; constraints intersect; most-restrictive-at-tie) is a pure function
  - `F-LAW-COHERENCE.2` (planted-paradox) — two opposed constitutional rules refuse LAW_POLICY_PARADOX naming both ids and scope; amendment (supersession) unblocks; all ledgered
  - `F-LAW-COHERENCE.3` (smugglers-tour) — a composition carrying a fake secret / an ungranted capability / a stored selector-as-truth / an undeclared mutation is refused with four DISTINCT named refusals; fixing each unblocks activation
  - `F-LAW-COHERENCE.4` (no-scan-no-activation) — activation with a stale/missing scan row (manifest-hash mismatch) refuses COMPOSE_SCAN_NOT_RUN
  - `F-LAW-COHERENCE.5` (headless) — the whole conflict/scan ceremony is CLI/daemon-only
  - `F-LAW-COHERENCE.6` (loud-failure) — zero warn-and-continue branches in the resolution path: every anomaly is a named refusal or a ledgered paradox row
- `plugins/vivim-law/src/conflict.ts` (new — the row shape, the lattice, the
  pairwise scan, the explain walk, the append-only row store with derived
  supersession, the amendment ceremony), `plugins/vivim-law/src/compose-scan.ts`
  (new — the versioned pattern sets, the five checks, the activation gate,
  the scan-row ledger), `plugins/vivim-law/src/index.ts` (the four ops
  wired in the plugin's existing shape; the law.check lattice seam; the
  boot reload of policy rows), `plugins/vivim-law/plugin.json` (four READ
  contract contributions: law.conflict.scan@1, law.conflict.explain@1,
  compose.scan@1, policy.amend@1), `tooling/gates/test/f-law-coherence.test.ts`
  (the falsifier — pure-function replays plus the FakeHost end-to-end path
  with an in-memory vault: zero filesystem writes, the strongest hermeticity).
- Shared-file integrations for the wave coordinator (this lane does not edit
  them): the BUILD-DECISIONS index row is generated from this record's
  `
- Ratified on greens (evidence-class, F-LAW-COHERENCE.1-6 green in this record's tree BEFORE the flip per D-364): landing commit 362c690; full gate green 1278/0 ×2 on the PROPOSED tree (2026-09-21T04:20:10Z and 04:25Z; the prior tip's 1253 + 25 new); zero host LOC; anvil untouched.

## Index` (`bun run omega:questions --write`); `genome/layers.json` flips
  Ω-2.5 to implemented (treeId 433, specId `D-434`); `docs/VAULT-NAMESPACES.md`
  gains the `law.conflict` and `compose.scan` rows (namespace law: an
  undocumented namespace is a namespace nobody can compact, query, or trust).
- Precedents: spec `D-434` (Ω-2.5, the builder-gap doc this record
  translates — scenarios #37, #40), `D-325` (the overlay persistence +
  fail-closed rollback pattern the row store rides), `D-416` (the fold: law's
  evidence rows ride the vault through granted ports), `D-412` (the
  identity-row store idiom), `D-351` (the risk-parity net whose domain this
  record deliberately does not enter), `D-213` (shadow amendment — observe,
  never swap live; this record's amendment is the append-only kind),
  `D-426` (the falsifier-first loop this record rides), `D-364` (evidence
  class: green before the flip).

## Index

summary: the policy lattice in vivim.law — precedence classes with most-restrictive-at-tie, PARADOX as a first-class refusal naming both rules, the append-only amendment, and the five-check composition security scan whose passing row (manifest-hash pinned) activation requires
rationale: Policies accumulate and today resolve by evaluation order - silent nondeterminism at the layer whose job is determinism - and composition activation assumes the signer's virtue; the 100 named both (scenarios #37, #40) and the Ω-2.5 builder-gap spec (paper `D-434`) reserves the slot this tree record lands
class: evidence
