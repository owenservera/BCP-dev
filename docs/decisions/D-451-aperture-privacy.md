# D-451 — Boundary: aperture privacy — the fence becomes the law (Ω-11)

## Status

RATIFIED

## Context

- The Ω-11 spec (paper `D-443`, re-materialized per
  `omega-upgrades/RE-MATERIALIZATION-NOTE.md` — the transcript original is not
  on disk; this tree record lands the re-materialized spec's mechanism under
  the continuation authority) generalizes D-379's single-principal fence from
  ns `chat` to the whole vault: what may NOT cross the aperture becomes data.
- The one invariant: **privacy classes are vault-schema law, the sibling of
  retention.** Every namespace declares a class on the lattice
  `open < internal < principal < secret`; undeclared fails closed to `secret`
  (the vault refuses what it cannot classify); derived rows inherit the
  strongest class of their inputs, verified mechanically at write; deputies
  see only what their delegation grammar's `dataReach` allows — absent means
  none; and every fence crossing is a REFUSED verdict + a ledger row, never a
  silent degradation.
- The silent failure this kills: a helpfully derived "overview" row in an open
  namespace, folded from principal-class inputs, readable by anyone — privacy
  died in the fold and no refusal ever fired.

Blocks: none

## Options

| Criterion | (a) pure privacy core in vivim-law (class lattice + write-verified taint + the universal fence) | (b) per-namespace ad-hoc guards (the D-379 pattern copy-pasted) | (c) encryption at rest |
|---|---|---|---|
| One fence, every namespace | Yes — class law is schema law, consulted by every read/write path | No — each ns re-learns the fence | No |
| The derived leak is impossible | Yes — taint = max of cited inputs, verified at write (APERTURE_TAINT_MISMATCH) | No — nothing tracks folds | No — ciphertext still folds |
| Deputies are grammared | Yes — dataReach absent = none, fail closed (APERTURE_REACH_UNDECLARED) | No — deputies inherit the reader's reach implicitly | No |
| Zero host LOC | Yes — plugins/vivim-law pure core + READ verdict ops | Yes | No — key survival is Ω-4's constitution |

## Decision

**Decision:** (a) — `plugins/vivim-law/src/apertureprivacy.ts`, in substance:

- **The sensitivity lattice:** `open < internal < principal < secret`. Class
  declarations live in ns `privacy`, ids `class:<ns>` —
  `{ns, class, amendedBy, at}`, append-only amendment history (the
  `policy.amend@1` discipline). An undeclared namespace fails closed to
  `secret` (APERTURE_CLASS_UNKNOWN at the fence: unclassifiable data is
  unreadable data).
- **The taint law:** a derived row (summary, index row, partial result,
  assembled context) carries `max(class of every input row it cites)`. The
  write gate verifies this mechanically at write — a declared class weaker
  than the fold refuses APERTURE_TAINT_MISMATCH; an unresolvable citation
  quarantines via APERTURE_TAINT_UNVERIFIED (fail-closed to secret).
- **The ratchets:** a row may carry a class STRONGER than its namespace,
  never weaker (APERTURE_CLASS_WEAKENED); and a write may not LOWER an
  existing row's taint (APERTURE_RATCHET_WEAKENED) — classes ratchet up,
  never down.
- **The universal fence:** any read where the resolved reader ≠ the row's
  owning principal and class ≥ `principal` refuses with the exact D-379
  shape — REFUSED verdict envelope `{refused, error: "REFUSED", op, detail,
  ledgered: true, ledgerRef}` (APERTURE_CROSS_PRINCIPAL) — plus a refusal
  row in ns `privacy` generalizing the `refusal_*` family:
  `{target, owner, caller, op, class, at}`. DEGRADED stays reserved for
  broken handlers.
- **The deputy law:** the D-328b delegation grammar gains an additive
  `dataReach` field (a lattice ceiling). Absent means none — the deputy sees
  `open` + `internal` only, and a principal/secret read refuses
  APERTURE_REACH_UNDECLARED; a declared-but-exceeded ceiling refuses
  APERTURE_DEPUTY_OVERREACH; the effective ceiling is
  `min(dataReach, the grantor's own lawful view)`.
- **The export law:** an export carrying secret-class rows refuses
  APERTURE_EXPORT_WITH_SECRETS; principal-class rows cross only under treaty
  (Ω-15's shape). The audit fold (taint sweep) ledgers findings
  (APERTURE_DERIVED_LEAK), never auto-fixes.

## Consequences

- D-379's ns `chat` fence is the grandfathered first instance of the family —
  not migrated, not orphaned; the general law is a strict superset.
- As-built: the ops land in vivim-law as READ verdicts (the law.forbidden.set
  precedent — enforcement lives at the write/read paths, the risk-parity
  net's non-READ domain stays untouched): `privacy.taint@1` (the taint fold)
  and `privacy.check@1` (the write-gate / fence verdict); refusal rows ride
  vault ns `privacy` through the granted ports wherever present, memory-first
  otherwise. Zero host LOC; no new dependencies; existing tests stay green.

## Evidence

- Falsifiers, green in this record's tree BEFORE the flip per `D-364`
  (`omega:loop --stub D-451` generates the RED stub this list resolves to):
  - `F-APERTURE-PRIVACY.1` (the-generalized-fence) — a cross-principal read against ns email (not just chat) → REFUSED verdict + ns privacy refusal row naming owner/caller/class; the owner's read still succeeds
  - `F-APERTURE-PRIVACY.2` (the-derived-leak) — a summary row written into an open namespace citing principal-class inputs → APERTURE_TAINT_MISMATCH at write; the same summary written with class principal succeeds — and the fence then guards it
  - `F-APERTURE-PRIVACY.3` (the-deputy-ceiling) — a deputy delegated without dataReach reading principal-class rows → APERTURE_REACH_UNDECLARED (absent = none, fail closed); a declared ceiling below the class → APERTURE_DEPUTY_OVERREACH; with dataReach principal → the read succeeds and the grantor's own view caps it (min)
  - `F-APERTURE-PRIVACY.4` (fail-closed-default) — a namespace with no class row → reads refuse APERTURE_CLASS_UNKNOWN; declaring the class opens it exactly as declared; a write weakening the fail-closed baseline refuses APERTURE_CLASS_WEAKENED
  - `F-APERTURE-PRIVACY.5` (grandfather-honesty) — the D-379 chat-fence envelope shape reads identically under the general law (strict superset; the refusal_* row family generalized, the precedent rows untouched)
  - `F-APERTURE-PRIVACY.6` (headless) — 1–5 daemon-only, zero pixels: the module imports no surface dependency and never touches window/document/navigator
  - `F-APERTURE-PRIVACY.7` (loud-failure) — zero silent degradation: every fence crossing is a verdict + row; every taint finding is ledgered, never auto-fixed; an export carrying secrets refuses APERTURE_EXPORT_WITH_SECRETS
- Files: `plugins/vivim-law/src/apertureprivacy.ts` (the pure core), wiring in
  `plugins/vivim-law/src/index.ts` (privacy.taint@1, privacy.check@1),
  `plugins/vivim-law/plugin.json` (two READ contracts),
  `tooling/gates/test/f-aperture-privacy.test.ts`.
- Refusal register (exact): APERTURE_CROSS_PRINCIPAL ·
  APERTURE_DEPUTY_OVERREACH · APERTURE_DERIVED_LEAK · APERTURE_CLASS_UNKNOWN ·
  APERTURE_CLASS_WEAKENED · APERTURE_TAINT_MISMATCH ·
  APERTURE_TAINT_UNVERIFIED · APERTURE_RATCHET_WEAKENED ·
  APERTURE_REACH_UNDECLARED · APERTURE_EXPORT_WITH_SECRETS (+ the store-door
  APERTURE_CLASS_ROW_INVALID / _DUPLICATE family).
- Precedents: the re-materialized Ω-11 spec (paper `D-443`); `D-379` (the
  fence precedent and its verdict envelope — generalized, never broken);
  `D-328b`/tokens.ts (the authority grammar dataReach extends); `D-433`
  (the pure-core + row-store + READ-verdict-op pattern this rides); `D-364`.


- Ratified on greens (evidence-class, F-APERTURE-PRIVACY.1-7 green in this record's tree BEFORE the flip per D-364): landing commit f9b8841; full gate green 1418/0 ×2 on the PROPOSED tree (2026-09-21T07:20:03Z and 07:25Z; the prior tip's 1362 + 56 new); zero host LOC; anvil untouched.

## Index

summary: plugins/vivim-law/src/apertureprivacy.ts — the aperture privacy law: the sensitivity lattice open<internal<principal<secret with undeclared namespaces failing closed to secret, the write-verified taint law (derived class = max of cited inputs, APERTURE_TAINT_MISMATCH), the strengthen-only ratchets (APERTURE_CLASS_WEAKENED, APERTURE_RATCHET_WEAKENED), the deputy dataReach ceiling (absent = none), the universal cross-principal fence as REFUSED verdicts + ns privacy refusal rows, and the export refusal for secret-class rows
rationale: What may not cross the aperture becomes data - a summary folded from principal-class inputs and served open is privacy laundered through a fold, and a deputy inheriting the reader's reach implicitly is authority without a grammar (Omega-11, aperture privacy, re-materialized spec)
class: evidence
