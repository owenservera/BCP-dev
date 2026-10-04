# forge.survey — the survey ops (D-417 Wave 1+ lane)

Class 1 / **READ** Forge plugin: `forge.survey.run@1` and
`forge.survey.render@1`, "pure past the capture". They turn a **stored** capture
receipt into an inventory of its files and then into a deterministic markdown
atlas, reading nothing but the governed ledger.

## The class, and what no gate checks about it

Reading a foreign legacy tree is `forge.mine.capture@1`'s job — EXTERNAL_MUTATION,
consent-gated twice, audited. **This compartment has no `node:fs` import and no
filesystem capability of any kind.** If a READ op could re-walk the mine, D-409's
class split would be a fiction: the dangerous act would live behind an ungated op.

That is not enforced by a gate. `FORGE_CLASS_SPAN` (`tooling/gates/forge-surface.ts:103-112`)
reads the manifest's **declared** contributions and fires only when a plugin spans
two risk classes; nothing inspects what a READ op's source actually reaches for.
That gap is **G-11**, open. What holds this compartment honest is the
import-**specifier** scan in `test/happy/survey.test.ts` — it reads the module
specifiers `src/` actually imports, not a substring of the text, because a comment
explaining the rule names `node:fs` and would satisfy a raw search. Treat a green
`forge-surface` as evidence about the *manifest*, not about the source.

## What the ops do

| op | payload | returns | I/O |
|---|---|---|---|
| `forge.survey.run@1` | `{mineId}` | `SurveyInventory@1` | `vault.get@1` ×1, `vault.getmany@1` ×1 (bounded batches) |
| `forge.survey.render@1` | `{mineId}` **or** `{inventory}` | `SurveyAtlas@1` | same, or **none** in the `{inventory}` form |

### Why render takes an inventory too

The architecture's §6.5 note is that the fused `build-atlas.ts` failed the
substitutability axis: *you cannot swap the renderer without touching the
walker*. So the renderer is a **pure function** (`renderAtlas`) behind an op that
can be handed its input. `render({inventory})` touches no port at all, and the
suite asserts `render({inventory: run(x)}) === render({mineId: x})` — the same
bytes, two ways in.

A supplied envelope must be one this op could itself have emitted (shape, pinned
mine id, root hash, rows carrying the frozen row shape, `count` matching
`rows.length`). One that does not is `SURVEY_INVENTORY_MALFORMED` — rendering an
inventory this op would refuse to emit would make the renderer a second, laxer
entry point into the same facts.

## The three modules

- **`src/inventory.ts`** — the PURE core. No ports, no I/O, no filesystem, no
  `Bun.*`: the language map, the per-language extraction rules, the per-field cap,
  the mirrored CAS decoder, and the atlas renderer.
- **`src/survey.ts`** — the only I/O. The receipt read, the chunked blob read, and
  the two failure-classification rules.
- **`src/index.ts`** — the shim entry: the refusal envelope, the ten rules, and the
  two ops.

### Mirrored, not imported

The receipt-row id derivation, the CAS row shape, `MINE_ID_PATTERN` and the sha256
are all owned by the plugins that **write** them (`forge-mine-capture/`,
`forge-mine/`). This compartment does not import them: a plugin reaching into a
sibling's source has taken a dependency on code it holds no authority over. The
grammar is **mirrored** — twice, independently — and `test/happy/survey.test.ts`
proves the two implementations agree against the **live** receipt and every live
blob. Two derivations agreeing on real bytes is evidence; "the same formula
written twice" is a claim, and only one of those is worth anything.

## Absence vs a closed ledger

Two different failures arrive in the same envelope and must never be collapsed.
`vault.get@1` **throws** on a missing row (`vivim-vault/src/sql.ts:234`), and the
shim maps a throw to `{ok:false, error:"DEGRADED", detail:"handler vault.get@1
threw: …"}` (`shim/src/index.ts:101`). So:

- DEGRADED **+** `/no object/` **+** `/(not found)/` → the receipt is genuinely
  absent → `SURVEY_RECEIPT_MISSING`;
- anything else, **including a capability REFUSED** → the ledger is closed →
  `SURVEY_LEDGER_REFUSED`.

Everything unclassifiable fails **closed** toward "I could not read it": "it is
not there" is the claim that needs positive evidence. Reporting "no receipt here"
for a ledger nobody may read would be the most dangerous answer this op could give.

`vault.getmany@1` needs no classifier at all — a missing id is **DATA**
(`{id, found:false}`, `sql.ts:266`), never an error, precisely so one absent row
cannot lose a batch's other rows. That is what makes `SURVEY_BLOB_MISSING`
decidable from returned data while a DEGRADED getmany stays
`SURVEY_LEDGER_REFUSED`.

## Every row is re-verified before it exists

The receipt's `hash`/`bytes` are **claims**. Each cited blob is decoded and
re-hashed (`hashBytes(decoded) === the cited address`, and the length must agree)
before its row is built. A mismatch is a named **refusal**
(`SURVEY_BLOB_MISMATCH`), not a row with a caveat: `InventoryRowSchema` is a
`z.strictObject` with nowhere to record an unverified row, and a survey that
emitted one would report an unverified fact in the shape of a verified one.

The decoder is deliberately **strict**: `Buffer.from(s, "base64")` is lenient
(skips characters outside the alphabet), which would turn a corrupt row into a
plausible buffer. Both the shape and the base64 round-trip are checked, and the
payload is base64 of the capture's **normalised** bytes — so on a CRLF checkout
the re-hash still holds.

## Truncation counts itself out loud

`MAX_FIELD_ITEMS = 25` per field. When a field hits it the envelope records
`capped[]: {path, field, kept, dropped}` — the forge-mine.diff `'+N more'`
discipline. Truncation that states itself is honest; truncation that reads as
completeness is not. Truncation never lives inside a row.

## The atlas is deterministic

No clock, no randomness, no ordering that is not already in the inventory. Two
calls over the same mine produce byte-identical text, and the suite asserts
exactly that: a report whose diff is a timestamp teaches nothing.

## The named refusals

Every refusal is DATA (D-379 refusal-as-data): an `ok:true` envelope carrying
`{refused: true, error: "REFUSED", op, rule, detail}`.

| rule | the failure |
|---|---|
| `SURVEY_RUN_MALFORMED_INPUT` | the run payload is not `{mineId}` (or carries unknown fields) |
| `SURVEY_RENDER_MALFORMED_INPUT` | render carries neither, both, or an extra field |
| `SURVEY_MINE_ID_MALFORMED` | `mineId` is not `<repo>@<7-64 hex>` |
| `SURVEY_RECEIPT_MISSING` | no capture receipt is stored for that pin |
| `SURVEY_RECEIPT_MALFORMED` | the stored row is not a readable, verifiable `CaptureReceipt@1` |
| `SURVEY_BLOB_MISSING` | a cited `casRef` is not in the ledger |
| `SURVEY_BLOB_MALFORMED` | the stored row is not a decodable CAS blob |
| `SURVEY_BLOB_MISMATCH` | the decoded bytes do not re-hash to the cited address |
| `SURVEY_INVENTORY_MALFORMED` | a supplied inventory is not one render could have emitted |
| `SURVEY_LEDGER_REFUSED` | the receipt or the blobs could not be read |

The refusal suite triggers **all ten** inside `expect()` lines and seeds its
ledger rows directly (as root, under throwaway pins) rather than damaging the
pinned fixture — a refusal net that breaks the corpus to make itself fail is a
net that breaks the corpus.

## Generality: shipped `speculative`, deliberately

`OMEGA-FORGE-ARCHITECTURE.md:649-651` predicts `generic` for `run` and
`harvested` for `render`. **This landing ships `speculative` for both**, and the
divergence is recorded rather than left as prose drift:

- `generic` requires ≥2 resolvable evidence refs with at least one **independent
  of the declared mine** (`sdk/src/validate.ts:293-311`). A first landing cannot
  honestly evidence that.
- `harvested` requires a pinned `mine`, real `originPaths` and a harvest class.
  This op generalises past `synthetic-v0`; claiming the fixture as its origin
  would be a claim about provenance it does not have.

Promoting either is a decision with evidence behind it, and the manifest, this
README and the decision record all say the same thing about which.

## Run it

```bash
bun test plugins/forge-survey          # the falsifier + all ten named refusals
bun run omega:quick                    # the gate
```

The happy suite boots the real `compositions/forge-survey.json` (law + vault +
capture + survey), runs the two-principal consent ceremony, captures
`fixtures/mines/synthetic-v0/` through the capture seam, and then shows both ops
consuming what the seam stored — 42 inventory rows, 41 CAS blobs, a
11,767-byte atlas, byte-identical across two calls.
