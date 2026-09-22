# D-434 — Intent debugging & personalization: the derivation trace, the principal-owned lexicon, and the leakage tripwire

## Status

RATIFIED

## Context

- The Intent Layer amendment made natural language a primary operating interface
  and drew the line — *ML perceives, the substrate decides* — but a line drawn
  is not a line patrolled. The builder-gap sweep names four ways the human door
  fails without this record (scenarios #23/#24/#25/#27 of the 100): misresolution
  is unexplainable (the answer is buried in resolver internals, so the user can
  only fight the system, not correct it), personalization has no honest home
  (jargon like "my 'lab' means ns research" is either constantly misread or
  robotically rephrased), the ML proposal path is undefined (so someone will
  wire a model to "learn your preferences" and auto-apply raw output into the
  deterministic core — the exact constitutional violation the amendment exists
  to prevent), and leakage is undetectable (a probabilistic hand grafted into
  the resolution walk by a "smart" refactor fires nothing; the guarantee
  becomes a claim on a plaque).
- The one invariant this record exists to protect: **every intent resolution
  can be replayed, explained, and tuned by the person it serves; the
  deterministic core stays deterministic — ML may propose lexical knowledge,
  it may never apply a single entry, and any drift of resolution into
  probabilistic hands is a leakage event with a sentence.**
- Grounding, as the tree holds it: the NL resolution walk is
  `@vivim/omega-nlcl-pure`'s `interpret(text, world)` — pure by law N1 (same
  inputs, same outputs, no clocks), already carrying a stage trace
  (`Interpretation.stages`), consumed by `vivim.nlcl` (the compartment
  engine), the web surface, and the browser (the same bytes, three homes).
  `vivim.intent` (`D-389`/`D-411`) is the intent-tier boundary where
  resolution lands as rows: `intent.submit@1` persists the UNDERSTOOD
  artifact, `intent.resolution@1` writes the terminal states. What does not
  exist anywhere: the walk as a LEDGERED, REPLAYABLE, DIFFABLE artifact; a
  principal-owned lexicon evaluated inside the walk; a proposal-only path for
  learned entries; a standing tripwire on the walk's determinism.
- The spec is ratified in conversation as paper `D-435` (Ω-2.6, reserved
  builder-gap slot; the genome carries Ω-2.6 as queued, specId `D-435`,
  "spec pending — fill before building"); this record lands it in-tree.
  Paper↔tree mapping: Ω-2.6 = paper `D-435` = tree `D-434` (the
  `D-431`/`D-449` lineage pattern — tree numbering wins in-tree, the registry
  keeps both citable).

Blocks: none

## Options

| Criterion | (a) vivim-intent boundary: the walk wrapped + traced in-plugin, lexicon + audit as plugin law, 7 ops, 4 namespaces | (b) Fork/extend nlcl-pure with trace hooks and an in-core lexicon stage | (c) A Forge debugger view over console logs |
|---|---|---|---|
| Wraps the REAL walk, no fork | Yes — the trace composes `interpret()` itself (base pass + lexicon-projected pass); the real stages are quoted verbatim, never re-derived or faked | Yes but the pure core is browser-shared bytes another lane owns; a grammar/stage change is an amendment-class event per its own header | No — a view over artifacts that do not exist; the log is not the walk |
| Lexicon in the walk, at a defined stage | Yes — entries evaluate after base parsing and before disambiguation; every hit is a traced, rule-numbered step with `entryId` attribution | Yes | No — a lexicon applied outside the walk is the forbidden pre-processor shape (text in, text out, unauditable) |
| ML proposes, principal disposes — mechanically | Yes — the lexicon writer refuses realization-sourced rows (`INTENT_LEXICON_AUTO_APPLY_REFUSED`); acceptance is a principal ceremony citing `proposalRef`; proposals expire in 30d | n/a | No — nothing to enforce |
| Leakage becomes a named, dated event | Yes — replay battery + verdict-set diff + static no-realization scan, every finding a sentence, ledgered in ns `intent.audit` | Partial | No |
| Territory / blast radius | vivim-intent only; zero host LOC; contracts read-only; existing resolution ops untouched (no lexicon present ⇒ byte-same resolutions) | Cross-lane (nlcl-pure + nlcl + surfaces re-sync) | Surfaces lane |

## Decision

**Decision:** (a) — intent debugging lands at the `vivim.intent` boundary, in
substance:

- **The derivation trace (`plugins/vivim-intent/src/trace.ts`).** The walk of
  record is a two-pass composition of the REAL `interpret()`: **base-parse**
  (the utterance against the world as given — the actual resolver, its own
  stage list quoted verbatim inside the step, no fabricated internals), then
  the **lexicon stage** (active entries evaluated — aliases projected through
  the taught-verb mechanism `world.lexicon`, the same deterministic path
  `teach` rides, and the parse re-run with them in place; patterns matched
  against the folded utterance produce intent hints; defaults and
  disambiguation-rules registered for their stages), then **disambiguation**
  (rules applied with `entryId` citation, ties named, the decision and the
  rule that decided it recorded per step), then **resolve** (defaults applied,
  the canonical intent or the ambiguity refusal). The trace row
  `intent.trace@1` carries exactly: `{ utteranceRef (content-addressed),
  candidates[], lexiconHits[], disambiguations[], resolvedIntent,
  resolverDigest, replayable: true }` plus the ordered `steps[]` of the walk
  (additive — the diff primitive needs the steps it names) and the pinned
  versions (`nlclVersion`, `worldV`). `resolverDigest` =
  sha256(walk version · nlcl version · lexicon digest) — the pin that makes
  replay a claim, not a hope. Replay re-runs the walk and byte-compares;
  `intent.trace.diff@1` localizes the first divergent step (stage, index,
  both notes) plus the field-level diffs — "when did you start reading me
  wrong?" answered by the record, not by memory. The lexical
  knowledge-graph view is a pure projection of the same row (nodes:
  utterance → parses → entries → decisions → resolution) — derived, never a
  second source.
- **The lexicon (`plugins/vivim-intent/src/lexicon.ts`).** Principal-owned,
  append-only, in ns `intent.lexicon` (retention: forever — sovereign
  personal data). Entry shape: `{ entryId, principal, kind:
  alias \| pattern \| default \| disambiguation-rule, payload (typed,
  deterministic), scope, badge (ProvenanceTier × generality — personal
  entries are GEN_PERSONAL by law, no unlabelled generality), origin:
  principal-authored \| accepted-proposal (with proposalRef) }`. The active
  state is a pure function of the rows (revocation is a tombstone); the
  lexicon digest pins it into every trace. Scope is law-checked against a
  legal vocabulary (`global`, `surface:*`, `namespace:*`,
  `capability-family:*`) — anything else is `INTENT_LEXICON_SCOPE_INVALID`:
  your words may tune your door, not rewire the house.
- **The proposal path.** A badged realization (agent, plugin, composition —
  never the principal) calls `intent.lexicon.propose@1`: the row lands in ns
  `intent.proposal` (retention `lexicon-proposals-30d`) as
  `{ proposalId, realizationRef, proposedEntry, evidence, status: proposed,
  expiresAt }`. Proposals NEVER apply. The lexicon writer refuses a
  realization-sourced row outright — `INTENT_LEXICON_AUTO_APPLY_REFUSED` —
  and the same refusal fires when a realization attempts the acceptance
  ceremony itself; acceptance (`intent.lexicon.accept@1`) is principal-only,
  cites the `proposalRef` in the entry's origin, and flips the proposal to
  accepted. An expired proposal is not a standing temptation: acceptance
  past `expiresAt` is refused and names the expiry.
- **The leakage audit (`plugins/vivim-intent/src/audit.ts`).** Three
  probes, every finding a sentence, ledgered in ns `intent.audit`
  (retention: forever): (1) the **replay battery** — a pinned corpus of
  1,000 utterances resolves twice, byte-compared; any divergence is
  `INTENT_RESOLUTION_NONDETERMINISTIC` naming the divergent cases and their
  first divergent steps; (2) the **verdict-set diff** — the set of canonical
  intents the resolver can produce, computed symbolically (frames for the
  world ∪ world ops ∪ active entry targets), diffed against the pinned set;
  drift is `INTENT_AUDIT_VERDICT_DRIFT` naming the added/removed verdicts;
  (3) the **static no-realization check** — the walk's own source files
  scanned for provider/LLM/network markers (the `D-431` marker discipline),
  findings named by file and line. The audit is parameterized over the
  resolver so a grafted probabilistic call (a test build) is caught by the
  same battery that guards production.
- **Ops (all headless — CLI/daemon; the graph view is a projection):**
  `intent.explain@1` (READ — historical trace by ref, or live: caller
  supplies the utterance and the world snapshot it grounds against; a
  missing/pre-tracing ref is `INTENT_TRACE_UNAVAILABLE`, said, never
  guessed) · `intent.trace.diff@1` (READ — two refs or inline rows) ·
  `intent.lexicon.add@1` / `.revoke@1` (principal-only writes, tombstone
  revocation, every change bumps the lexicon digest every later trace
  cites) · `intent.lexicon.propose@1` (badged realization, budgeted by its
  own tier) · `intent.lexicon.accept@1` (the ceremony) · `intent.audit@1`
  (run the tripwire, ledger the report).
- **As-built honesty, stated in the record, not hidden:** the walk's steps
  are intent-tier granularity — the real nlcl stages ride the base-parse
  step verbatim (quoted from `interpret()`'s own return, never
  reconstructed); the alias kind fires where nlcl's verbs fire (command-word
  positions — the taught-verb mechanism); the four entry kinds are this
  record's vocabulary; the walk's disambiguation consumes `interpret()`'s
  scored candidates (primary + ties) rather than re-scoring them — no
  forked scorer exists in this plugin.

## Consequences

- The human door becomes accountable: every resolution leaves a replayable
  derivation a person can read, diff, and tune; misresolution turns from a
  fight into a debug session ("the trace says your 'lab' entry fired at step
  3; revoke it or teach it differently").
- Personalization becomes sovereign data with a law-governed intake: your
  jargon lives in your vault namespace under your retention; the only writer
  is the principal or an acceptance ceremony; a model can ask, never land.
- The deterministic guarantee becomes a property under test: the replay
  battery, the verdict-set diff, and the static scan re-prove the walk's
  determinism on demand and at every version bump — leakage gets a name, a
  date, and a replayable event instead of silence.
- The existing resolution ops are untouched: with no lexicon present the
  walk's resolution is exactly the base parse's (`interpret()`'s own pick),
  byte-for-byte — wrapping the walk changed nothing about what it resolves,
  only what it can prove.
- Integration boundaries this record manifests for the owning lanes (this
  wave's lane territory ends at vivim-intent + this record + the falsifier):
  the `docs/BUILD-DECISIONS.md` index row (generated — `omega:questions
  --write` at wave merge), the genome layer flip (Ω-2.6 queued →
  implemented, treeId 434, falsifier `F-INTENT-DEBUG`), the
  `docs/VAULT-NAMESPACES.md` rows for the four new namespaces, and the
  composition contract grants whenever the console routes the new ops.
  `contracts/src/intent.ts` is untouched (read-only lane law): the new op
  and row shapes live plugin-side behind the `plugin.json` CONTRACT
  contributions, the established pattern; an sdk mirror, if ever wanted, is
  a future amendment to manifest, not to land here.
- The trace's replay guarantee is exact over (utterance, world, lexicon
  state) — all three pinned by the falsifier and by `resolverDigest` +
  `worldV` on the row; replaying a HISTORICAL trace after the WORLD moved is
  exactly the case `intent.trace.diff@1` exists to surface, not to erase.
- Zero host LOC; no new gate stage; no new external dependency (one
  workspace edge to the in-tree `@vivim/omega-nlcl-pure`, the same edge
  `vivim.mind` and `vivim.nlcl` already ride); anvil untouched.

## Evidence

- Falsifiers, green in this record's tree BEFORE the flip per `D-364`
  (`omega:loop --stub D-434` generates the RED stub this list resolves to):
  - `F-INTENT-DEBUG.1` (exact-replay) — a pinned corpus of utterances resolves twice to byte-identical derivation traces (the walk is a pure function of utterance + lexicon state)
  - `F-INTENT-DEBUG.2` (lexicon-attribution) — a lexicon entry ("lab" → ns research) changes a resolution with entryId cited in the trace; revoking the entry reverts resolution exactly
  - `F-INTENT-DEBUG.3` (auto-apply-refused) — a realization path writing a lexicon row directly refuses INTENT_LEXICON_AUTO_APPLY_REFUSED — proposals are the only path to acceptance
  - `F-INTENT-DEBUG.4` (leakage-tripwire) — a grafted probabilistic/nondeterministic call in the walk makes replay diverge → INTENT_RESOLUTION_NONDETERMINISTIC names the case
  - `F-INTENT-DEBUG.5` (diff-debugging) — a planted lexicon/policy change between two runs is localized by intent.trace.diff naming the changed step
  - `F-INTENT-DEBUG.6` (headless) — traces/diffs/lexicon are CLI/daemon ops; any graph view is a derived projection
- `plugins/vivim-intent/src/trace.ts` (new — the walk, the trace row, replay,
  diff, the graph projection), `plugins/vivim-intent/src/lexicon.ts` (new —
  the entry law, the scope law, the proposal store, the write guard),
  `plugins/vivim-intent/src/audit.ts` (new — the three probes, the report,
  the walk-source scanner); `plugins/vivim-intent/src/index.ts` gains the
  seven ops; `plugins/vivim-intent/plugin.json` gains their CONTRACT
  contributions; `plugins/vivim-intent/package.json` gains the
  `@vivim/omega-nlcl-pure` workspace edge (the `vivim.mind` pattern);
  `tooling/gates/test/f-intent-debug.test.ts` is the falsifier.
- Self-host, exercised in this record's own tree: the audit op runs against
  the plugin's own walk sources (the static probe scans the files that
  implement this record), and the replay battery's pinned corpus exercises
  the lexicon kinds this record defines — the tripwire guards the door it
  ships behind.
- Precedents: spec `D-435` (Ω-2.6,
  `omega-upgrades/OMEGA-2.6-INTENT-DEBUG-PERSONALIZATION.md` — the record
  text this tree record translates); `D-389` (the intent spine this wraps);
  `D-411` (the canonical-intent seam the trace rows extend);
  `D-216`/`D-218` (the nlcl engine + frames as data, the walk being
  wrapped); `D-426` (the falsifier-first loop this record rides);
  `D-431` (the marker discipline the static probe inherits); the Intent
  Layer amendment (the parent law: ML perceives, the substrate decides).


- Ratified on greens (evidence-class, F-INTENT-DEBUG.1-6 green in this record's tree BEFORE the flip per D-364): landing commit 362c690; full gate green 1278/0 ×2 on the PROPOSED tree (2026-09-21T04:20:10Z and 04:25Z; the prior tip's 1253 + 25 new); zero host LOC; anvil untouched.

## Index

summary: vivim-intent gains the derivation trace (the real interpret() walk wrapped, lexicon stage after base parse and before disambiguation, replay + diff), the principal-owned lexicon with the proposal-only ML path and 30d expiry, and the three-probe leakage audit — seven ops, four namespaces, five named refusals
rationale: The human door is the most-used interface and the least accountable: misresolution is unexplainable, personalization has no honest home, auto-apply is the path of least resistance, and leakage is undetectable — Omega-2.6 (spec D-435) makes every resolution replayable, explainable, and tunable by the person it serves, with ML proposing and never applying
class: evidence
