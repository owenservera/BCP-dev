# P1-02 / WS-002 — PHASE-1-TRUTH-BASELINE

> **Classification:** DERIVED — CURRENT TRUTH BASELINE
> **Workstream:** WS-002 / P1-02 — Repository Truth, Cleanup & Drift
> **Date:** 2026-09-25
> **Repository:** `owenservera/BCP-dev`
> **Branch:** `main`
> **Baseline tip:** `630ee5d96100377d02f506c2ffb3c445def162e5`
>
> This document is a reconciliation artifact, not Ω law, not BCP state, and not a
> replacement authority. It exists so P1-06/P1-08 can consume Phase-1 repository
> truth without reconstructing the evidence chain.

## 1. Purpose and proof standard

This baseline answers one narrow question:

> **What can Phase-1 work safely treat as repository reality today, and what must it not treat as reality?**

It deliberately separates:

- **authority** — which repository artifact governs a claim;
- **implementation** — code that actually exists in the current repository;
- **state** — what BCP records claim;
- **history** — what earlier commits/documents recorded;
- **evidence** — material supporting a claim;
- **availability** — whether an implementation/evidence object is actually present now.

The critical rule is:

> A state claim does not prove implementation exists. A historical execution record does not become current implementation merely because a later snapshot describes it.

The current repository has **only one branch: `main`**. The prior P1-02 authority-pointer pilot branch is unavailable. Path-A and Path-B implementation work described in historical/current-context prose is also unavailable in the current repository tree; the owner has confirmed there is no more-complete unpushed copy elsewhere.

---

# 2. Phase-1 surface authority map

| Phase-1 surface | Authoritative current artifact | What it actually establishes | Current implementation availability | Safe-to-build-on verdict |
|---|---|---|---|---|
| **Path A — Chrome Skeleton / FAM-07** | `docs/EXPERIMENTAL-PATHS.md` for the declared path; `bcp-speed/bcp/state/capabilities.yaml` for BCP state | Defines the Path-A hypothesis, scope, falsifier, leases and target depth; state currently claims L2 | **NO IMPLEMENTATION AVAILABLE** in current tracked source | **NOT SAFE as an implementation dependency. Safe only as a historical/planning specification after applying C15.** |
| **Path B — Intent Fabric / FAM-08** | `docs/EXPERIMENTAL-PATHS.md` for the declared path; `bcp-speed/bcp/state/capabilities.yaml` for BCP state | Defines the deterministic-NL hypothesis, scope, falsifier and target depth; state currently claims L2 | **NO IMPLEMENTATION AVAILABLE** in current tracked source | **NOT SAFE as an implementation dependency. Safe only as a historical/planning specification after applying C15.** |
| **MIG-001 — ChatGPT send-message migration** | `bcp-speed/bcp/migration/index.json` → `bcp-speed/bcp/migration/MIG-001-chatgpt-send-message/migration-record.json` | A committed migration record with source pins, transformation decision, Ω target, verification ladder and explicit live/regression gaps | **RECORD AVAILABLE; live implementation proof unavailable** | **SAFE for migration knowledge, mapping and provenance. NOT safe to infer live proof.** |
| **MIG-002 — Claude send-message migration** | `bcp-speed/bcp/migration/index.json` → `bcp-speed/bcp/migration/MIG-002-claude-send-message/migration-record.json` | A committed migration record extending MIG-001's shared legs and recording Claude-specific transformation/verification | **RECORD AVAILABLE; live implementation proof unavailable** | **SAFE for migration knowledge, mapping and provenance. NOT safe to infer live proof.** |
| **BCP capabilities / FAM-07/08 state** | `bcp-speed/bcp/state/capabilities.yaml`, read through BCP authority rules | The enforced BCP state currently records 49 capabilities and L2 claims for FAM-07/08 | **STATE AVAILABLE; Path-A/B implementation absent** | **SAFE as the state artifact to reconcile; NOT safe to consume FAM-07/08 L2 as implementation proof.** |
| **Chrome adapter / browser realization** | `omega-baseline/omega-final/plugins/provider-browser/src/index.ts` | The existing Ω `BROWSER_MEDIATED` fixture realization: attach/release/send, parser pinning, realization promotion bars, redaction-before-vault and fail-closed behavior | **FIXTURE IMPLEMENTATION AVAILABLE; LIVE CDP ADAPTER NOT PROVEN/AVAILABLE** | **SAFE for existing fixture realization semantics and contracts. NOT safe as evidence of live Chrome mediation.** |

### Important distinction

The Chrome adapter is **not** Path A's missing implementation.

`omega-baseline/omega-final/plugins/provider-browser/src/index.ts` is a real,
tracked Ω plugin and is the authoritative implementation of the **existing
fixture BROWSER_MEDIATED realization**. Its own header states that the CDP leg is
owner-machine-only/future work and is never silently simulated.

Therefore:

- fixture browser realization = **exists**;
- live Chrome master/slave Path-A implementation = **does not currently exist in this repo**;
- live proof = **not established**.

---

# 3. Authority chain

The repository's existing authority hierarchy remains authoritative:

1. **Ω ratified law:** `omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md`
   plus `docs/BUILD-DECISIONS.md` and decision records.
2. **BCP enforced vocabulary/state:** `bcp-speed/bcp/state/` through
   `bcp_tool.py`, with `RECONCILIATION.md` as tie-breaker.
3. **Current repository context:** `docs/CURRENT-CONTEXT.md`.
4. **Migration records:** `bcp-speed/bcp/migration/index.json` and MIG records.
5. **Evidence/history:** VIVIM mine and `docs/archive/`; useful evidence, not authority.
6. **Planning/context prose:** useful for intent and historical reasoning, but cannot
   override the authority above.

Primary governing documents are `AGENTS.md`,
`docs/cleanup/AUTHORITY-MAP.md`,
`docs/cleanup/CONFLICT-REGISTER.md`, and the P1-02 setup/charter.

P1-02 itself is a **reconciliation layer**, not a new authority.

---

# 4. Corrections applied on 2026-09-25

## C14 — Authority-pointer pilot: NOT AVAILABLE

The setup lineage references:

- `impl-04/p1-02-authority-pointer-slice`;
- PKT-006;
- HANDOFF-010;
- ITEM-001-merge-request-p1-02-slice;
- pilot authority-pointer files.

Direct current-repository verification found:

- branch listing contains only `main`;
- the cited pilot branch is absent;
- the cited pilot artifacts are absent from the current tree;
- repository commit/name checks did not recover a matching pilot object.

**Resolution:** the pilot is **gone/unavailable** for current work. It must not be
cited as evidence of P1-02 behavior or proof. The setup prompt's requirement to
verify the pilot against main therefore terminates in **NOT AVAILABLE**, not
"unverified."

**Deferred?** No. This is resolved as an availability fact. Reopening requires
recovering an actual repository object.

## C15 — FAM-07/FAM-08 L2 claims contradict seed history and source reality

Current `bcp-speed/bcp/state/capabilities.yaml` says:

- FAM-07.1–07.4 = L2;
- FAM-08.1–08.4 = L2.

But `docs/archive/sessions/session-ses_f371.md` records the seed commit
`d949b06` with **"FAM-07/08/09 at L0"**, followed immediately by a
metrics-recompute commit again confirming **FAM-07/08/09 at L0**.

Further, `bcp-speed/bcp/state/experiments.yaml` records
`agents_assigned: []` for EXP-2026-004 and EXP-2026-005.

The current repository contains no implementation of the named FAM-07/FAM-08
capabilities in tracked `.ts`, `.js`, or `.py` source. The previously
described lane work lived under `bcp-speed/bcp/work/`, which is not current
repository state. The owner has confirmed this repository is the complete state;
there is no unpushed implementation elsewhere to check.

**Resolution:** this is a **direct contradiction**, not an evidence gap.

The L2 values in `capabilities.yaml` are therefore **not valid present-state
implementation claims** for Path A/B. They must not be consumed as proof of
implementation, integration, or live capability.

**Deferred?** No. The contradiction is resolved factually: Path A and Path B
implementations are currently **nonexistent/unavailable** in this repository.
The state-depth repair itself belongs to the BCP state authority/owner rather
than this document silently rewriting state.

---

# 5. Conflict register disposition

The complete conflict register remains at:

`docs/cleanup/CONFLICT-REGISTER.md`

Its Phase-1-relevant dispositions are:

| Entry | Status | Resolution / treatment |
|---|---|---|
| C1 — historical orchestration plan vs executed tasks | RESOLVED | Historical plan is not current automation authority. |
| C2 — old lane lease sequences vs later board | RESOLVED | Old sequences are completed history; current coordination state governs. |
| C3 — dated inbox orders vs parked board | RESOLVED | Parked entries are not live orders. |
| C4 — old host LOC numbers vs current B5 law | EXPLAINED | Dated measurements remain history; current Ω law governs. |
| C5 — historical composition counts | EXPLAINED | Era-specific counts; current Ω law governs. |
| C6 — Ollama-first vs Chrome-only | RESOLVED | D-456/current Ω law settles v1 substrate. |
| C7 — "merging/verified/green" language | CLARIFIED | Fixture verification is not live/integration proof. |
| C8 — 201 vs ~400 model counts | OPEN / narrowed | 201 declarations = 200 unique names; the ~400 figure is a bad split-file denominator. Path-C canonical mapping remains deferred. |
| C9 — migration state-table promotion | RESOLVED | Deliberately deferred; `index.json` remains current migration registry. |
| C10 — generic 140-cap README vs current 49-cap instance | RESOLVED | README describes package shape, not this instance. |
| C11 — Prompt-4/chameleon surfaces | OPEN | Owner-controlled; do not consume as current authority. |
| C12 — 186 engine files vs 32 dirs | OPEN / narrowed | Different denominators can both be true; no single "engine count" should be inferred without denominator. |
| C13 — Prompt-4 outputs vs one authoring path | OPEN | Committed/unratified material is not current law; owner decides resumption. |
| **C14 — authority-pointer pilot** | **RESOLVED: NOT AVAILABLE** | Do not cite or build on it. |
| **C15 — FAM-07/08 L2 vs L0 seed + absent source** | **RESOLVED: DIRECT CONTRADICTION** | Path-A/B implementation is unavailable; state depth cannot serve as implementation proof. |

No open conflict above is silently promoted to a winner. Where the reason for
deferral is owner/workstream scope, the open status remains explicit.

---

# 6. Migration surfaces — what is actually safe

## MIG-001

Authoritative record:

`bcp-speed/bcp/migration/MIG-001-chatgpt-send-message/migration-record.json`

The record says:

- canonicality = TRANSFORM;
- Ω target = `message.send@1` through `provider-browser`;
- VIVIM sources are pinned with hashes;
- static proof = PROVEN;
- recorded-fixture integration = PROVEN;
- live = UNVERIFIED;
- regression = UNVERIFIED;
- several provider/live authority questions remain UNKNOWN.

The associated verification report explicitly preserves those proof boundaries.

**Safe-to-build-on:** **YES for migration mapping/provenance; NO for live-proof
claims.**

## MIG-002

Authoritative record:

`bcp-speed/bcp/migration/MIG-002-claude-send-message/migration-record.json`

The record says:

- canonicality = TRANSFORM;
- Ω target = `message.send@1` through `provider-browser`;
- shared legs reference MIG-001;
- static proof = PROVEN;
- recorded-fixture integration = PROVEN;
- live = UNVERIFIED;
- regression = UNVERIFIED;
- Claude-specific typed-block and live-authority questions remain open.

**Safe-to-build-on:** **YES for migration mapping/provenance; NO for live-proof
claims.**

---

# 7. Chrome adapter truth

Authoritative existing implementation:

`omega-baseline/omega-final/plugins/provider-browser/src/index.ts`

It is a real tracked plugin implementing:

- `browser.attach@1`;
- `browser.release@1`;
- `message.send@1`;
- redaction before vault persistence;
- realization-status and provider-class bars;
- parser-pin coverage;
- ordered fixture replay;
- fail-closed refusal behavior.

Its source explicitly identifies the implementation as a **fixture realization**
and says the CDP leg is owner-machine-only/future work.

Therefore:

**Safe-to-build-on:** **YES for the existing fixture contract/realization layer;
NO for treating it as a live Chrome implementation.**

---

# 8. Path A truth

Declared authority:

`docs/EXPERIMENTAL-PATHS.md` — PATH-A section.

BCP state:

`bcp-speed/bcp/state/capabilities.yaml` — FAM-07.1–07.4.

Historical seed evidence:

`docs/archive/sessions/session-ses_f371.md` — FAM-07/08/09 L0 seed.

Current source reality:

**No Path-A implementation exists in tracked current source.**

The planning document's "Path A" describes what should be proved; it is not proof
that the work was built.

**Safe-to-build-on:** **NO as an implementation dependency.** A future builder
may use the Path-A specification as the intended experiment, but must start from
the repository's actual available Chrome substrate rather than assuming the
historical L2 lane build exists.

---

# 9. Path B truth

Declared authority:

`docs/EXPERIMENTAL-PATHS.md` — PATH-B section.

BCP state:

`bcp-speed/bcp/state/capabilities.yaml` — FAM-08.1–08.4.

Historical seed evidence:

`docs/archive/sessions/session-ses_f371.md` — FAM-07/08/09 L0 seed.

Current source reality:

**No Path-B implementation exists in tracked current source.**

The planning document's Intent Fabric pipeline is a declared hypothesis/plan, not
current implementation.

**Safe-to-build-on:** **NO as an implementation dependency.** A future builder
must treat Path B as a fresh implementation/research target, not inherit the
historical L2 claim.

---

# 10. What is deferred, and why

These items remain deliberately open rather than being guessed:

1. **C8 model-count canonicalization:** the denominator issue is substantially
   reconciled, but Path-C's model→namespace mapping is a separate migration
   decision and is not owned by P1-02.
2. **C11 Prompt-4 surfaces:** owner/workstream disposition is still required.
3. **C12 engine-count terminology:** different denominators are simultaneously
   true; no single semantic "engine count" is declared here.
4. **C13 Prompt-4 authoring-path status:** unratified material remains outside
   current law until owner-directed reconciliation.
5. **MIG-001/002 live proof:** deliberately remains UNVERIFIED because the records
   themselves require authenticated Chrome execution and independent witness.
6. **Chrome live adapter:** fixture implementation exists; live CDP realization
   remains outside current repository proof.
7. **BCP FAM-07/08 state correction:** P1-02 records the contradiction but does
   not hand-edit BCP state. State repair belongs through BCP's governed mutation
   mechanism/owner decision.

---

# 11. Fresh-agent consumption rule

A fresh Phase-1 agent should read this file **before** using any of the following
as implementation evidence:

- FAM-07/FAM-08 depth;
- Path-A/Path-B completion language;
- old lane reports;
- TRACKER/inbox claims;
- `docs/CONTEXT-product.md` sections describing the lane builds;
- the missing authority-pointer pilot.

The correct interpretation is:

> **Path A implementation: unavailable.**
>
> **Path B implementation: unavailable.**
>
> **Authority-pointer pilot: unavailable.**
>
> **MIG-001/MIG-002 records: available as migration evidence, with live proof explicitly unverified.**
>
> **provider-browser: available as the existing fixture browser realization, not a live Chrome adapter.**

---

# 12. One-line build verdicts

- **Path A:** **NOT SAFE TO BUILD ON AS EXISTING IMPLEMENTATION — implementation unavailable; use only the declared experiment specification.**
- **Path B:** **NOT SAFE TO BUILD ON AS EXISTING IMPLEMENTATION — implementation unavailable; use only the declared experiment specification.**
- **MIG-001:** **SAFE TO BUILD ON FOR TRANSFORMED MIGRATION KNOWLEDGE/PROVENANCE; LIVE PROOF REMAINS UNVERIFIED.**
- **MIG-002:** **SAFE TO BUILD ON FOR TRANSFORMED MIGRATION KNOWLEDGE/PROVENANCE; LIVE PROOF REMAINS UNVERIFIED.**
- **capabilities.yaml:** **SAFE AS THE BCP STATE AUTHORITY, BUT NOT SAFE TO TREAT FAM-07/08 L2 AS IMPLEMENTATION PROOF UNTIL C15 IS REPAIRED.**
- **Chrome adapter:** **SAFE AS THE EXISTING FIXTURE BROWSER REALIZATION; NOT SAFE AS EVIDENCE OF A LIVE CHROME ADAPTER.**

---

# 13. Baseline conclusion

This baseline establishes a usable Phase-1 truth boundary without creating a new
authority system.

The decisive current facts are:

1. The P1-02 authority-pointer pilot is **unavailable**.
2. Path A and Path B implementation work is **not present in the current repo**.
3. The FAM-07/FAM-08 L2 state is therefore in direct contradiction with current
   implementation reality and cannot be used as proof.
4. MIG-001 and MIG-002 are real committed migration records with explicit proof
   ladders; their live layers remain unverified.
5. The existing `provider-browser` plugin is real fixture implementation, not
   live Chrome.
6. Existing Ω/BCP authorities remain in force; P1-02 records their relationships
   rather than replacing them.

**P1-06/P1-08 can now consume this file as the Phase-1 repository-truth baseline
without re-deriving the above distinctions.**
