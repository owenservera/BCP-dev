# D-452 — Boundary: invocation — nothing runs without a frame (Ω-12)

## Status

RATIFIED

## Context

- The Ω-12 spec (paper `D-444`, re-materialized per
  `omega-upgrades/RE-MATERIALIZATION-NOTE.md` — the transcript original is not
  on disk; this tree record lands the re-materialized spec's mechanism under
  the continuation authority) gives every invocation of every capability an
  explicit frame, resolved through the law gate before anything runs.
- The one invariant: **a cached consent is a stale consent.** Authority
  re-resolves at EVERY check — no memoization anywhere — so revocation
  propagates at the next gate call; the frameless call, the out-of-scope
  call, and the broken-deputy-chain call all refuse with sentences; and root
  gets a DECLARED frame kind, never an exemption (no privileged path, not
  even a kind one).
- The silent failure this kills: a mis-scoped automation running nightly for
  a year on a consent granted for one manual run — every row legal, and no
  row ever saying *whose behalf*.

Blocks: none

## Options

| Criterion | (a) the frame as an additive gate shape in vivim-law (pure check core + inv ledger) | (b) a separate invocation ceremony plugin | (c) journal-only afterthought (record who called, never gate) |
|---|---|---|---|
| Refuses before anything runs | Yes — the frame resolves at the gate; unframed EXTERNAL_MUTATION refuses INVOKE_FRAME_MISSING | No — a peer ceremony drifts from the one gate | No — the frameless call already ran |
| Authority is never stale | Yes — re-resolve at every check, structurally (live rows in, verdict out, zero cache) | Partially | No |
| Scope-undo is a query | Yes — inv rows {caller, behalf, frameDigest, at} keyed inv:<causationId> | Yes, but outside the law journal | No — archaeology |
| Zero host LOC, additive + grandfathered | Yes — the D-411 F-3 pattern: callers without frames journal exactly as before | Yes | Yes |

## Decision

**Decision:** (a) — `plugins/vivim-law/src/invocation.ts`, in substance:

- **The invocation frame:** `{caller, behalf?, op, scope, authority:
  {kind: consent|standing|root-act, ref?}, intentRef?}` — `behalf` defaults
  to `caller` (explicit with caller-default; the implicit deputy is the bug
  this layer kills); `scope` is a declared op mask (exact | prefix-`*` | `*`,
  the tokens.ts subset discipline); `intentRef` is the D-411 citation when
  the call came through the fabric.
- **Frame resolution (pure, re-resolved every check):** an unframed
  EXTERNAL_MUTATION refuses INVOKE_FRAME_MISSING; a frame missing required
  elements refuses INVOKE_FRAME_INCOMPLETE; an op absent from the capability
  graph refuses INVOKE_UNKNOWN_OP; a target outside the declared scope
  refuses INVOKE_SCOPE_EXCEEDED; authority that resolves to no live consent,
  standing, or declared root act refuses INVOKE_AUTHORITY_UNRESOLVED (the
  sentence carries the underlying reason — an expired standing names its
  lapse). READ-class ops frame best-effort, journaled when cited.
- **Deputy frames:** `behalf ≠ caller` requires a live delegation chain OR a
  standing (Ω-13, D-453) covering (op × scope) — resolved at gate time from
  the LIVE rows passed to the check, never cached; a dead chain refuses
  INVOKE_DEPUTY_CHAIN_BROKEN at the next identical call.
- **Root is a frame kind, not an exemption:** `authority: {kind:
  "root-act"}` is valid only for root callers acting for themselves; a root
  call without a declared frame refuses exactly like anyone else's.
- **Invocation rows + the pairing law:** ns `invoke`, ids `inv:<causationId>`
  — `{frameDigest, verdict, at, outcomeRef?}`; every EXECUTED `:res` row
  pairs one-for-one with an `inv` row, enforced by the audit fold — drift is
  INVOKE_PAIRING_DRIFT, a loud ledgered finding, never a migration. The
  scope-undo compensation set is exactly the `inv` rows with `caller` in the
  window — a query, not archaeology.

## Consequences

- As-built: the op lands in vivim-law as a READ verdict (the D-411 additive
  + grandfathered pattern): `invoke.check@1` — payload carries the frame, the
  target's risk class, and the LIVE authority rows (consents, delegations,
  standings; the standing registry consults the module store's live view);
  the verdict returns with the frameDigest and the `inv` row, ledgered to
  vault ns `invoke` wherever the granted ports exist, memory-first
  otherwise. Policy granularity stays who/which-op (the D-411 ruling
  preserved — the frame binds evidence and authority, never widens
  evaluation). Zero host LOC; existing tests stay green.

## Evidence

- Falsifiers, green in this record's tree BEFORE the flip per `D-364`
  (`omega:loop --stub D-452` generates the RED stub this list resolves to):
  - `F-INVOKE.1` (the-framed-run) — one op through a complete frame → the inv row carries caller, behalf, op, scope, authority, intentRef and the frameDigest; the digest replays byte-identically; journal + EXECUTED :res row cite the same causationId
  - `F-INVOKE.2` (the-frameless-refusal) — an unframed EXTERNAL_MUTATION → INVOKE_FRAME_MISSING with sentence; a frame missing elements → INVOKE_FRAME_INCOMPLETE; a READ-class op frames best-effort (never refused for framelessness)
  - `F-INVOKE.3` (the-deputy-trace) — an agent invokes on behalf of user:ada with a live delegation → framed, the walk carrying the chain; revoke the delegation (or the standing) → the NEXT identical call refuses INVOKE_DEPUTY_CHAIN_BROKEN — re-resolution is structural, no cache anywhere
  - `F-INVOKE.4` (scope-undos-evidence) — "undo everything agent:X did in the window" → the compensation set is exactly the inv rows with caller agent:X in the window — a query, not archaeology
  - `F-INVOKE.5` (pairing-audit) — delete one inv row (simulated corruption) → the pairing fold reports INVOKE_PAIRING_DRIFT naming the orphan; both sides of the orphan drift are findings
  - `F-INVOKE.6` (headless) — 1–5 daemon-only, CLI-answerable, zero pixels: no surface imports, no window/document/navigator
  - `F-INVOKE.7` (loud-failure) — zero implicit frames; root without a declared root-act refuses like anyone else; every refusal a sentence; every drift a finding — no branch resolves silently
- Files: `plugins/vivim-law/src/invocation.ts` (the pure core),
  wiring in `plugins/vivim-law/src/index.ts` (invoke.check@1),
  `plugins/vivim-law/plugin.json` (one READ contract),
  `tooling/gates/test/f-invoke.test.ts`.
- Refusal register (exact): INVOKE_FRAME_MISSING · INVOKE_AUTHORITY_UNRESOLVED ·
  INVOKE_SCOPE_EXCEEDED · INVOKE_UNKNOWN_OP · INVOKE_DEPUTY_CHAIN_BROKEN ·
  INVOKE_PAIRING_DRIFT · INVOKE_FRAME_INCOMPLETE (+ the store-door
  INVOKE_CAUSATION_REUSED).
- Precedents: the re-materialized Ω-12 spec (paper `D-444`); `D-411` (the
  additive + grandfathered gate-seam pattern, the intentRef citation);
  `D-433` (the pure-core + READ-verdict-op pattern); `D-453` (standing — the
  authority kind the frame resolves); `D-364`.


- Ratified on greens (evidence-class, F-INVOKE.1-7 green in this record's tree BEFORE the flip per D-364): landing commit f9b8841; full gate green 1418/0 ×2 on the PROPOSED tree (2026-09-21T07:20:03Z and 07:25Z; the prior tip's 1362 + 56 new); zero host LOC; anvil untouched.

## Index

summary: plugins/vivim-law/src/invocation.ts — the invocation frame {caller, behalf, op, scope, authority, intentRef?}: nothing runs without a frame, authority re-resolves at every check (no cache, structurally), deputy frames require live chains or standings, root gets a declared frame kind never an exemption, inv rows pair one-for-one with EXECUTED rows (drift is a loud finding), and scope-undo reads the inv rows as a query
rationale: An agent's call and a user's call through the same op are journal-identical when on-whose-behalf lives nowhere - scope-undo cannot separate the deputy's work from the principal's and replay cannot answer under-what-right (Omega-12, invocation, re-materialized spec)
class: evidence
