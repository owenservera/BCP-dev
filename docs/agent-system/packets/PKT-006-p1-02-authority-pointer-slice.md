# PKT-006 — P1-02 authority-pointer pilot: first real implementation slice

> **Classification: DERIVED — CURRENT**
> **packet id:** PKT-006 · **workstream:** WS-002 (P1-02)
> **source transcripts:** none new (owner task text is the mission; P1-02 research
> charter from the prior turn is the proposed input, treated as proposal not law)
> **source handoffs:** HANDOFF-010 (this pilot's close) · **source evidence:**
> `outbox/IMPL-04/ITEM-001-merge-request-p1-02-slice.md`,
> `workstreams/WS-002/work/authority-pointer-report.json`
> **extraction session:** local docs-only pilot, 2026-09-24, no Ω ledger session
> (no product surface) · **base:** `ef26df8` · **branch:** `impl-04/p1-02-authority-pointer-slice`
> **freshness:** CURRENT · **supersedes:** — (first WS-002 packet; extends no prior packet)

## Facts

| # | Claim | Source | Status |
|---|---|---|---|
| F1 | `README.md:17` claims `ORCHESTRATION-REDESIGN.md` is "Canonical automation design (wins over the brief on conflict)" | `README.md:17` read verbatim | DERIVED-CURRENT |
| F2 | `ORCHESTRATION-REDESIGN.md:2` self-classifies as "HISTORICAL CONSTRUCTION PLAN (cleanup 2026-09-23)", executed Tasks 1–6, current truth elsewhere | `ORCHESTRATION-REDESIGN.md:1-7` | DERIVED-CURRENT |
| F3 | `AGENTS.md:44` lists `ORCHESTRATION-REDESIGN.md` under historical material; `CURRENT-CONTEXT.md:35-42` lists it under explicitly historical; `AUTHORITY-MAP.md:21-23` maps automation authority to `CONTEXT-system.md §6 + STATE.json` with the plan HISTORICAL | three governing surfaces read verbatim | DERIVED-CURRENT |
| F4 | Detector verdict on F1–F3 is `contradiction`, report-only, deterministic | `check.py` FINDING-001 + report JSON + 10/10 unittest green | DERIVED-CURRENT |
| F5 | `CURRENT.md:11` uses a semantic substantive-tip convention ("Current main tip … `de147d6` …; subsequent coordinator consolidation commits roll this marker"); literal HEAD `ef26df8` differs by design | `CURRENT.md:8-13` + `git rev-parse HEAD` | DERIVED-CURRENT |
| F6 | Detector verdict on F5 is `consistent-semantic-tip`, never stale on literal diff — holds for `--head de147d6`, `--head ef26df8…`, and live HEAD | FINDING-002 + three negative tests | DERIVED-CURRENT |
| F7 | C8 (Prisma counts), C11 (untracked Prompt-4/Chameleon), C12 (engine counts) are `[OPEN]` in `CONFLICT-REGISTER.md:61-67,86-105` and are preserved as `unresolved-preserved` with no winner chosen | FINDING-003/004/005 + register reads | DERIVED-CURRENT |
| F8 | Same tree + same `--head` ⇒ byte-identical output (stdout hash `0e69244b…587907b` twice for `--head ef26df8…`; report file 5660 bytes sha256 `2aa3c91d…77889755`) | determinism + read-only tests, `git status` clean of tracked mods | DERIVED-CURRENT |
| F9 | BCP control plane untouched: `validate.py` 49 caps / 8 leases / 105 log events — 0 errors; `git diff --name-only` empty; `git status` shows only new `WS-002/` + pre-existing untracked (`bcp-algos/`, `REPO-CLEANUP-PROMPT-V2.md`, `setupdocs.zip`) | `validate.py` run + git mechanics | DERIVED-CURRENT |
| F10 | Seven-dimension labels in findings are pilot working vocabulary only; nothing persisted as Ω law, BCP state, registry, or ontology | `check.py` header + `WS-002/README.md` scope rule + code inspection (no state writes) | DERIVED-CURRENT |

## Discovered concepts

* **Snapshot-scope matters:** `README.md:1-6` declares itself a 2026-09-22 snapshot while `L22-24` points fresh agents at the 2026-09-23 cold-start path. The L17 row is therefore best classified as `contradiction` with `claim_scope: snapshot-table-row` — era-true in snapshot, misleading as current guidance. Future P1-02 rules need explicit claim-scope (snapshot vs current), not just lifecycle.
* **Semantic-tip convention is load-bearing:** the actual marker text is "Current main tip … roll this marker" (no word "substantive" in file). A detector keyed on the charter's paraphrase ("substantive") fails; keyed on the file's own words ("roll this marker" + "consolidation") it passes. Reconciliation must quote the file, not the charter.
* **Cross-line authority needs file-level matching:** `AUTHORITY-MAP.md` names the target on one line and `HISTORICAL` on the next. Same-line matching drops a governor; file-level co-occurrence with separate line citations keeps all three governors.

## Proposals

* P-PROP-1 (MERGE_REQUEST, coordinator-owned): register IMPL-04 in ROSTER; link WS-002 launch folder + PKT-006 + HANDOFF-010 + ITEM-001 in the WORKSTREAMS P1-02 row as pilot evidence; leave P1-02 status REGISTERED (no promotion to ACTIVE — that needs owner/coordinator decision + setup prompt).
* P-PROP-2 (for coordinator/owner): accept the pilot as P1-02-P1…P7 evidence toward (not proof of) the workstream; next slice should be the plugin-authoring conflict (charter's named second test) only after this slice is integrated.
* P-NONPROP (explicitly not proposed): no README edit, no CURRENT/WORKSTREAMS content change beyond evidence links, no BCP state write, no Ω record action, no ontology persistence, no duplicate detector, no cleanup engine.

## Contradictions

* README-vs-authority on `ORCHESTRATION-REDESIGN.md` (F1–F4): represented as CLAIM A (README snapshot row, canonical) vs CLAIM B (target banner + AGENTS + CONTEXT + MAP, historical) with governing sources named and history retained. Reported, not merged, not edited.

## Unknowns (still open, owned)

* U1 ownership semantics when no explicit owner exists (charter §12-Q1) — untouched by this slice.
* U2 semantic-duplicate definition (charter §12-Q2) — this slice deliberately avoids duplicate judgments.
* U3 centralized-provenance breadth (charter §12-Q3) — this slice consumes one librarian row by reference only.
* U4 local-state representation (charter §12-Q4) — declared UNKNOWN via scope note; untracked surfaces unobserved.
* U5 lexical-vs-architectural terminology drift (charter §12-Q5) — out of slice.
* U6 report-only → blocking threshold (charter §12-Q6) — out of slice; this tool always exits 0 on gates-hold but never blocks anything.
* U7 charter file itself (`WS-002/P1-02-RESEARCH-CHARTER.md` path in task text) was absent on disk; the prior-turn charter text was used as proposed input. Coordinator should rule where the ratified research charter lives.

## Reasoning lineage

* **Why explicit rules, not NLP:** generic "canonical"-hunting would false-positive across the repo. The pilot hardcodes three named assertions with verbatim line evidence, so every verdict is auditable to file:line. Generalization is deferred by design.
* **Why `--head` override:** HEAD is the only volatile input. Overridability makes the negative test hermetic (both sides of the tip roll pass) and keeps determinism checkable without freezing the repo.
* **Why JSON + unittest, not a gate stage:** a new Ω gate stage would duplicate `docscan`/`decisions` ownership. A docs-tree stdlib script consumes their inputs without touching their domains (reuse map honored).
* **Explicitly rejected:** auto-fix of README; literal-SHA freshness; resolving C8/C11/C12; persisting the 7-dimension model; repository-wide scan; BCP state or Ω law contact.

## P1-02 proof criteria (ruled from evidence, this slice only)

* P1 authority resolution — HOLD (FINDING-001 names governors + lines).
* P2 historical preservation — HOLD (no historical file read was written; `git diff` empty).
* P3 semantic distinction — HOLD (no duplicate/adapter judgment attempted; plugin-authoring left for next slice).
* P4 unknown discipline — HOLD (untracked scope declared UNKNOWN; C8/C11/C12 preserved).
* P5 determinism — HOLD (byte-identical reruns; sorted keys/order; 10/10 tests).
* P6 existing-mechanism reuse — HOLD (consumes banners/registers; no second parser for validate/sweep/decisions/docscan/doctruth/genome/surfacesync).
* P7 safe action boundary — HOLD (report-only; exit code only; no delete/rewrite/ratify/mutate).

A passing suite does not prove the workstream (charter §15). It is evidence toward proof for one slice.

## Falsifiers (charter §16, this slice)

* F-TRUTH-01 false authority resolution — PASS (contradiction found with governors).
* F-TRUTH-02 false duplicate — PASS (no duplicate verdict emitted anywhere).
* F-TRUTH-03 false freshness — PASS (three negative tests, live + both fixed heads).
* F-TRUTH-04 guessed unknowns — PASS (C8/C11/C12 OPEN preserved; untracked UNKNOWN).
* F-TRUTH-05 genealogy destruction — PASS (zero tracked modifications).
* F-TRUTH-06 authority pollution — PASS (packet/handoff/report carry DERIVED banners; no law claim).
* F-TRUTH-07 mechanism duplication — PASS (no BCP/Ω checker re-implemented).
* F-TRUTH-08 non-determinism — PASS (identical hashes across reruns).
* F-TRUTH-09 automatic cleanup leap — PASS (no move/rename/delete/edit code path exists).
* F-TRUTH-10 scope blindness — PASS (scope note + visibility limits in every report).

## Recommended reads

1. `workstreams/WS-002/authority-pointer/README.md` + `check.py` (the mechanism).
2. `workstreams/WS-002/work/authority-pointer-report.json` (deterministic evidence).
3. HANDOFF-010 (files changed, tests run, proof table, next action).
4. `outbox/IMPL-04/ITEM-001-merge-request-p1-02-slice.md` (coordinator ask).
