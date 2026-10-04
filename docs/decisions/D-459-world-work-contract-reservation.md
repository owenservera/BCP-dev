# D-459 — Reserve the canonical World and durable Work contract vocabulary (D-332 loud allowlist)

> Numbering note: D-457 and D-458 are reserved by the Ω Board session of 2026-09-29 for the
> Commons human-principal amendment (WS-2 BQ-2) and the dashboard placement record (WS-3 BQ-6).
> This record takes the next free number; nothing else was ever written at D-457/D-458.

## Status

PROPOSED

## Context

- The canonical World (`contracts/src/world.ts`) and durable Work (`contracts/src/work.ts`)
  contract vocabularies landed 2026-09-25 (d0ebea0a, ce33ab45) as committed wire shapes —
  29 exported names — ahead of any consumer.
- The D-332 contract call-site net correctly flags every one of them: vocabulary without a
  writer/reader. The net was unable to say this earlier because the compositions stage was
  hard-failing at the P1-06 source corruption (literal `\n` splices in
  `plugins/vivim-law/src/policy.ts` and `plugins/vivim-agent/plugin.json`); once the parse
  error was repaired the full issue list surfaced.
- Wiring 29 exports now would mean fabricating consumers before the lanes that need them are
  sequenced: the authoritative sequencing (`docs/forge/BACKLOG.md`, per D-410) presents its
  open lanes unranked, and the owner has not yet named the first lane (WS-5 BQ-9).
- Deleting the contracts would discard the durable-Work lane's landed, manifest-declared
  vocabulary (`work.*` ops in vivim-run + the ns `work` VAULT-NAMESPACES registration).

Blocks: none

## Options

| Criterion | (a) Loud reservation now | (b) Wire consumers now | (c) Delete the exports |
|---|---|---|---|
| Gate honesty | allowlist entries carry the pointer; zero-hit stays visible | real readers, but consumers are invented pre-sequencing | net is green, history erased |
| Sequencing fidelity | lanes unranked per BACKLOG.md/BQ-9; nothing invented | forces a lane choice the owner has not made | discards landed durable-Work lane output |
| Precedent | matches D-373 storage.kv and D-389 plan-template reservations | no precedent for pre-sequencing wiring | contradicts append-only evidence discipline |
| Reversibility | entry removal the day a call site appears (mechanical) | large corridor, hard to un-wind | possible via git history only |

## Decision

**Decision:** TBD — (a) reserve the 29 zero-call-site world.ts/work.ts exports loudly in
`tooling/gates/contract-sites.ts`, each entry pointing at this record; the consumers land
with their own wave and falsifier (still the owner's call while TBD).

## Consequences

- The D-332 net stays honest: reserved names are visible as reserved, not laundered.
- Every allowlist entry must be removed the day its export gains a real call site — the
  net's own rule; a stale reservation is a live finding, not furniture.
- The world/work contracts remain UNRATIFIED vocabulary until their governing lanes land:
  no consumer code may treat these types as ratified law before this record is ratified and
  the consuming lane's own records exist.

## Evidence

- Falsifier (per D-364, named before ratification): if any reserved name gains a real
  tree-wide call site, the reservation entry for that name is wrong and must be removed —
  `bun run tooling/gates/contract-sites.ts` (via the compositions stage) is the check.
- Corruption lineage: `git show f8ddd073` / `git show be977a44` (P1-06, 2026-09-25) — the
  literal `\n` splices that hid these findings since the durable-Work landing.
- Precedent records: D-373 step-2 reservations, D-389 deferred-by-design reservations
  (`tooling/gates/contract-sites.ts` header block).

## Index

summary: The world.ts/work.ts contract exports landed 2026-09-25 (d0ebea0a, ce33ab45) as wire vocabulary ahead of their consumers; the D-332 net correctly flags them. Reserve them loudly per the D-373/D-389 precedent; consumers land with their own wave and falsifier.
rationale: Wiring 29 exports now would mean fabricating consumers before the lanes that need them are sequenced (BACKLOG.md lanes are open, unranked per BQ-9); deleting them would discard the durable-Work lane's landed contracts. Loud reservation matches the D-373 storage.kv and D-389 plan-template precedent: names committed, writers arrive with their own wave.
class: directive

## Annotation 2026-10-03 (corridor repair — the D-426 named-falsifier form; D-TEAM-011)

Additive note. No decision, status, option, or index row above is changed by it.

The Evidence clause above names a real and runnable falsifier, but writes it in prose, so
it carries no `F-*` id and the gov validator raised the named-falsifier finding against
this record (F-GOV-CI.7). **The checker was right, not wrong.** D-426's named-falsifier
convention governs every record from D-426 on (grandfathered below it, per the validator's
own era constant); D-457's `F-COMMONS-PRINCIPAL.1` and D-458's `F-TOOLING-UI.1` are the
form, and both pass. The gap is this record's naming, not the validator's expectation, so
the repair is the record's — closed by giving the clause already written its id:

- `F-WORLD-WORK-RESERVATION.1` (a reservation goes stale the day its export gains a
  caller) — if any name in this record's reservation set gains a real tree-wide call
  site, this record is falsified: that name's reservation entry is wrong and must be
  removed. The check is the one the Evidence clause above already names, run through the
  compositions stage: `bun run tooling/gates/contract-sites.ts` reports a reserved name
  only while it is still zero-hit. This is the D-373/D-389 reservation posture stated as
  a condition that can fail.

Honest scope note, so the id is not read as more than it is: like the passing
`F-COMMONS-PRINCIPAL.*` and `F-TOOLING-UI.*` ids, this is a named falsifier condition,
not a registered test case — no suite under `tooling/gates/test/` carries this id. The
mechanism it names is mechanical and already runs on every gate pass.

Per D-TEAM-011 this is a dated annotation, never a rewrite: every line of the original
record above is preserved verbatim, and a later dated note supersedes this one. Per D-364
the falsifier was already named before ratification; it now also carries the id the
generated era requires.