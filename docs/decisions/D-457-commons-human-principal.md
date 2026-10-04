# D-457 — The owner is a Commons principal: `user:owen` (human-principal amendment)

> Numbering: D-457 was reserved by the Ω Board session of 2026-09-29 for the Commons
> human-principal amendment (WS-2 entry question BQ-2) and is written here as board entry
> D-TEAM-002 — severity S3, TEAM-DECIDED, effective immediately, OWNER-INFORM: the owner's
> own identity is named, so the override path is explicitly open and silence means it
> stands. D-459's numbering note records the reservation and still reads true.

## Status

RATIFIED

## Context

- Ω law already carries the human principal. `user:<id>` sits beside `agent:<id>` with
  forbidden ops, consent, and inspection — D-336 (the shape, stated before multi-user
  pressure), D-353 (the re-land: `PrincipalKind`/`principalKind`, `law.describe@1`,
  `ConsentTable.listFor`, granted in all 13 law-carrying compositions), D-412 (the
  identity seam — ns `principal`, retention forever, register/retire/get).
- The Commons protocol text has no human principal. `AGENTS_CONTEXT/AGENT-COMMONS/
  IDENTITY-AND-TRUST.md` defines exactly one identity: "an agent is identified by a
  stable agent_id"; every principal id in the Commons transport and runtime is spelled
  `agent:<id>`. Measured at this record's landing: zero `user:` occurrences under
  `AGENTS_CONTEXT/AGENT-COMMONS/`, and the first agent principal (`agent:steward-zcode`,
  board entry D-TEAM-001, WS-2 backlog item 2) carries no `commons/` ref in this
  checkout yet.
- The owner is a roster member in the target design, not an observer of it. The team
  dashboard's purpose (WS-3, the owner's requirement of 2026-09-29) is the owner *as a
  roster member* — visible in the roster, rooms, and activity, able to engage and
  instruct. A roster with no id for the owner renders the owner as a spectator.
- The gap is a spelling gap, not an engineering gap: no law moves, no table is added,
  no kind is invented. What is missing is the Commons name for a principal the law
  already admits, plus the record that says the name exists.

Blocks: none

## Options

| Criterion | (a) amend the Commons protocol by record: the owner's principal id is `user:owen`, beside `agent:<id>` — this record | (b) no human principal in v1; the owner watches as a spectator | (c) reuse an agent id for the owner |
|---|---|---|---|
| Identity ≠ authority | Holds — a human principal is named, not granted authority; no capability, no signing identity is implied | Holds vacuously — nobody acts, so nothing can be confused with acting | Fails — one id space for humans and agents collapses the distinction the whole principal seam exists to keep |
| Roster honesty | The roster the dashboard projects carries the owner as a member | The owner is absent from the surface built to show the owner as a member | The owner appears wearing an agent's identity, and every future reader misreads the log |
| Cost of the amendment | One record plus one line of protocol text; no law, no tables, no code | Zero — and the debt is paid later at the cost of a migration | Zero — and the debt is a permanent ambiguity in the event history |
| Reversibility | A later dated record supersedes this one; the id is retired and nothing else references it | Additive debt | Irreversible in practice: the authored stream is already signed under that id |
| Precedent | D-336/D-353/D-412 already admit `user:<id>` on the law side — this record adds the Commons half of one existing shape | No precedent | No precedent, and it contradicts the shape the law ratified |

## Decision

**Decision:** (a) — the owner's Agent-Commons identity is `user:owen`, a human principal
parallel to `agent:<id>`, adopted by record as a Commons protocol amendment:

- The principal-id grammar gains its second legal prefix: `agent:<id>` for agents,
  `user:<id>` for humans. `user:owen` is the one human principal id in v1; every other
  id in both spaces remains an agent id.
- **This record is the amendment.** It is the authority the Commons protocol text is
  amended under, not a claim made on that text's behalf: `AGENTS_CONTEXT/AGENT-COMMONS/
  IDENTITY-AND-TRUST.md` gains a human-principal clause naming `user:owen` and pointing
  here. That text sits outside this ledger's tree and belongs to its own writer corridor,
  tracked as WS-2 backlog item 1. When the clause lands it is additive: no existing
  sentence is weakened and no agent id is renamed.
- No law moves. The law side is already complete (D-336 the shape, D-353 the
  classification and consent surface, D-412 the identity seam and its retention law);
  this record adds no principal kind, no table, no op, and no vault namespace.
- The human principal carries **no authority of its own**: it signs nothing, holds no
  signing identity, and is granted nothing it did not send. Being the owner is a
  roster fact, not a capability — the same IDENTITY≠AUTHORITY line the law already draws
  for agents is what this record extends to the owner.
- A Commons implementation that lets a `user:`-prefixed principal publish an event
  without a verifiable signature has falsified this record (F-COMMONS-PRINCIPAL.2 below)
  and must be corrected before the owner acts through the surface.

## Consequences

- The owner can be a roster member: the dashboard (WS-3) projects the Commons roster, and
  the owner's entry now exists to project. The WS-2 BQ-2 entry question is discharged by
  this record.
- What gets harder: every Commons reader now carries one more identity kind in its
  validation path, and a reader that assumes a single `agent:` prefix will reject or, worse,
  mis-file the owner's events. The grammar change is the honest cost of naming the owner.
- What gets easier: the "reuse an agent id for the owner" shortcut is closed by record
  rather than by etiquette, and the IDENTITY≠AUTHORITY line has a second, human-side
  instance to be audited against.
- Revisit trigger: if Ω law's `user:<id>` semantics turn out to constrain Commons
  differently than assumed here, a later dated record supersedes this one — it is
  superseded, never rewritten (the dated-annotation law, board entry D-TEAM-011).
- Out of scope, deliberately: the owner's response/instruction path (board entry
  D-TEAM-003, WS-3 backlog item 4) and any capability the owner might hold. This record
  names an identity; it grants nothing.

## Evidence

- Falsifiers (named before the flip, per D-364; the named-falsifier form of D-426). This
  is a directive-class record: the checks are greppable and reading-cheap, and each is
  stated so a later agent can run it without re-deriving intent.
  - `F-COMMONS-PRINCIPAL.1` (the id is unambiguous) — in the **Commons id space** —
    `AGENTS_CONTEXT/AGENT-COMMONS/` and the workstream/board docs that name Commons
    principals — `user:owen` is the only human principal id, and `agent:<id>` is the only
    agent spelling. A second `user:<id>` there, any other spelling of the owner's id, or
    an agent-shaped id in the human space falsifies this record. Measured green at this
    record's landing: the sweep returns exactly one human id, `user:owen`, and zero in the
    protocol text itself. Check:
    `grep -rEoh "user:[a-z0-9-]+" AGENTS_CONTEXT/AGENT-COMMONS .zcode | sort -u`
    Law-side `user:<id>` strings elsewhere in the tree (D-336's grammar examples, law
    fixtures) are the ratified law vocabulary this record does **not** narrow; scoping the
    clause to the Commons id space is what keeps the two from colliding.
  - `F-COMMONS-PRINCIPAL.2` (the principal signs nothing) — a Commons implementation
    that accepts an event authored by a `user:` principal without a verifiable signature
    falsifies this record: the human principal would have become an authority. The
    Commons runtime (`AGENTS_CONTEXT/AGENT-COMMONS/runtime/`) is Git-transport today, so
    this is a standing constraint on the first implementation that renders or posts as
    the owner — not a code check this tree can yet run.
  - `F-COMMONS-PRINCIPAL.3` (one shape, not two) — the amendment adds a name, never a
    second principal system. A Commons principal that needs a law-side record type,
    table, op, or vault namespace beyond the ns `principal` seam D-412 already ratified
    falsifies this record.
- Lineage and ratification event: board entry D-TEAM-002 (severity S3, TEAM-DECIDED)
  entered the board ledger at commit `e3f33583` ("policy(decide-and-inform): owner
  directive — no human decision blocks… DECISIONS-POLICY + ledger (D-TEAM-001..014
  converting BQ-1..9…)"). That commit is this record's ratification receipt: the decision
  is effective on its landing, and the owner may override it at any time.
- Board-ledger reasoning, quoted rather than re-derived: severity S3 because it names the
  owner's own identity (panel of three, rollback declared); rejected alternatives were
  "no human principal in v1" (rejected: makes the owner a spectator) and "reuse an agent
  id for the owner" (rejected: collapses IDENTITY≠AUTHORITY); rollback is a superseding
  dated record with the id retired.
- Law-side precedents cited, unchanged by this record: D-336, D-353, D-412. Protocol-side
  gap: `AGENTS_CONTEXT/AGENT-COMMONS/IDENTITY-AND-TRUST.md` (stable agent_id only) and
  the `agent:<id>` spelling throughout the Commons transport and runtime.
- Working-set entry question discharged: `.zcode/workstreams/WS-2-commons-bootstrap.md`
  BQ-2 and backlog item 1, whose recommendation already named `user:owen` and this record.

## Index

summary: The owner's Agent-Commons identity is user:owen, a human principal parallel to agent:<id>, adopted by record as a Commons protocol amendment that adds a name and no law, no table, no op, and no authority
rationale: The owner is a roster member in the target design, so a roster with no id for the owner makes the owner a spectator, and the law side is already closed by D-336/D-353/D-412 so only the Commons spelling was missing — an unnamed principal is drift wearing an agent's clothes when the shortcut is taken instead
class: directive
