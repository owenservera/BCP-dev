# WS-010 Round 1 — Assertion / State Model

> **Classification: DERIVED — PROPOSED (WS-010 research, not authority)**
> **Replaces:** ENTITY-RELATIONSHIP-MODEL §3 (six dimensions) — see MODEL-DELTA §D-STATE.
> **Rule:** nine axes, never collapsed into one status. Absence of evidence
> on an axis renders as `unknown` (or axis-omitted with reason), never as a
> default positive.

## A-AXES — the nine axes

### A1. Authority — *who owns the truth of this claim?*

- Source: home-system authority tables (AGENTS.md authority list; Ω
  `CURRENT-INVARIANTS` + index; SYSTEM.md §2 epistemic separation; packet
  `Classification:` banners).
- Observed or derived: OBSERVED (banner/authority-table lookup).
- Vocabulary: `authoritative | supporting | non-authoritative | unknown`
  (keep ER-model's four; definitions: authoritative = Ω ratified record or
  gate verdict; supporting = tool-verified state, registry, ledger;
  non-authoritative = transcript/packet/handoff/opinion/history/annex).
- Conflict: yes — two sources may each claim authority (resolve by the
  AGENTS.md hierarchy; render loser as preserved history, never delete).
- Unavailable: `unknown` + render dimmed. Never inherit authority from a
  citing document.

### A2. Lifecycle — *where in its life is this object?*

- Source: per-system lifecycle vocabularies (BELOW — five distinct
  lifecycles that must never merge).
- Observed or derived: OBSERVED within each home system.
- Vocabulary (union, always namespace-prefixed in the model):
  - BCP work_item: `backlog|scoped|in_progress|in_review|falsified|landed|deferred`
  - BCP experiment: `proposed|active|merging|merged|abandoned|archived`
  - BCP lease: `active|released|expired|reassigned`
  - cooperative banner freshness: `CURRENT|STALE|SUPERSEDED|UNRESOLVABLE|CONFLICTED`
  - Ω runtime `LifecycleState`: `staged|verified|active|degraded|quarantined|retired`
  - genome layer: `implemented|external-assumed|ratified-unimplemented|queued`
  - decision record: `RATIFIED|PROPOSED|SUPERSEDED|REJECTED` (+ directive/evidence class)
  - migration: `VERIFIED|…` + proof-quad values `PROVEN|…|UNVERIFIED`
- Conflict: yes across systems (e.g. experiment `merging` vs integration
  reality) — C7 homonym rule: every lifecycle token is stored WITH its
  producing mechanism (`merging@sweep-depth-math`, never bare `merging`).
- Unavailable: `unknown`. Historical/parked material keeps its last
  OBSERVED value + a staleness flag on A5, never a fresh guess.

### A3. Operational state — *is it moving right now?* (NEW — split out of lifecycle)

- Source: leases (`expires_at`, holder silence), log recency, gate runs,
  session-open state (`omega:round-close` refuses while open), branch tip
  vs merge state.
- Observed or derived: DERIVED by named rule (sweep §§1–4 re-implemented
  read-only; rule id stored on the assertion).
- Vocabulary: `idle|in-progress|parked|stalled|awaiting-merge|unknown`.
  (`merging` is BORROWED from A2-experiment only with mechanism suffix;
  operational uses `awaiting-merge`.)
- Conflict: yes (log says active, lease expired) → `stalled` per sweep
  rule wins as DERIVED, inputs preserved.
- Unavailable: `unknown` (e.g. GitHub-side CI state has no V0 reader).

### A4. Epistemic state — *how strongly may we believe the representation?* (NEW)

- Source: migration observation confidences; genome `external-assumed`
  dual-reporting; packet fact-status column; aperture fail-closed codes.
- Observed or derived: OBSERVED where a source vocabulary exists;
  otherwise DERIVED with `INTERPRETATION REQUIRED` tag (language contract).
- Vocabulary: `observed|strongly-inferred|weakly-inferred|assumed|
  unverified|unknown|contested`.
- Conflict: yes — two confidences about one claim → `contested` +
  both preserved (CONFLICT-REGISTER pattern).
- Unavailable: `unknown` (preferred to guessing per O6/OBS-014).

### A5. Freshness / currentness — *as of when is this true?* (NEW — split out of lifecycle)

- Source: tip SHAs, `updated_at` fields, CURRENT-INVARIANTS pass header
  (`pass 7 · as-of D-431`), `status.json` vs HEAD staleness
  (`invariants-freshness`, `process.ts` reporting), packet `Tip:`/base
  fields, PR state.
- Observed or derived: DERIVED (comparison function, inputs stored).
- Vocabulary: `current|stale|superseded|unresolvable|tip-unpinned`.
  `tip-unpinned` is the honest value for any assertion whose source tip
  was not recorded (fail-closed: unpinned assertions cannot support A4
  above `weakly-inferred`).
- Conflict: n/a (comparison output, not claim). Stale inputs stay visible
  with their age; never refreshed by display.
- Unavailable: `unresolvable` (source gone, e.g. deleted pilot branch —
  residue `__pycache__` only).

### A6. Origin — *where did these bytes come from?*

- Source: librarian eras (Ω-side), migration transformation records,
  packet source-range headers, git authorship.
- Observed or derived: OBSERVED (era/registry lookup).
- Vocabulary: `authored|generated|derived|imported|transcript|
  experimental|unknown`. Keep ER-model's six. `derived` MUST name the
  derivation (rule id or generator id); bare `derived` is invalid.
- Conflict: yes (generator output disagrees with generator inputs →
  `derivation-drift`, shown per BLUEPRINT §13).
- Unavailable: `unknown` (unregistered, unbannered files).

### A7. Visibility — *can the observatory (and who else) see it?*

- Source: `git status` (tracked/untracked), `.gitignore`, ledger/vault
  locality (environment-local, never committed), Ω annex banners.
- Observed or derived: OBSERVED (filesystem + git).
- Vocabulary: `tracked|untracked|ignored|environment-local|absent`.
  Keep ER-model's five.
- Conflict: no (observation). Untracked-but-present (e.g. `bcp-algos/`)
  renders as `untracked` + hands-off note, never content-surmised.
- Unavailable: `absent` (source unreadable → show unavailable/stale per
  BLUEPRINT §13, preserve boundary).

### A8. Ownership / association — *who answers for it?*

- Source: ROSTER task rows, lease `leased_to`, directive `to`, decision
  Evidence actor fields, handoff authorship. Deliberately narrow.
- Observed or derived: OBSERVED only. **No inference rule exists in V0 —
  by design.** Activity, recency, and authorship-proximity are NOT
  ownership sources.
- Vocabulary: `owner-directed|workstream|subsystem|shared|associated|
  unknown`. (`associated` added: sourced contact without ownership, e.g.
  lease holder, handoff author. `owned-by` predicate restricted to
  OBSERVED ownership only — MODEL-DELTA §D-REL.)
- Conflict: yes (two owners recorded) → both shown + `contested`.
- Unavailable: `unknown` — the DEFAULT for artifacts. A card showing an
  owner must cite the cell; otherwise the field reads `unknown`.

### A9. Governance — *what protects it from change?*

- Source: AGENTS.md boundaries table, Ω AGENTS.md laws (B5, supersede-only,
  append-only), BCP write-path rule, CONFLICT-REGISTER dispositions,
  cleanup safety classes (P1-02 charter: banner/repair/move/delete lad
...[truncated 2085 chars]