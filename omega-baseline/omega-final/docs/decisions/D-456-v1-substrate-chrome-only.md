# D-456 — The v1 substrate is Chrome-only: the Ollama concept leaves the plan

## Status

RATIFIED

## Context

- The owner's standing call, via D-418 verbatim 2026-09-20 plus this session's directive: Ollama is a false vestige — the shippable product is fully chrome master slave, no AI-API connected.
- D-418 killed Ollama-first *sequencing* in four law-bearing docs, but left the *concept* alive: the vision §3 end-state list names Ollama; the Frank scenario pictures `provider.llm-ollama`; the assessment corpus still teaches pilot-first (`04-WAVE-MAP.md` W2, `TRIAGE-LEDGER.md` T-02, `05-GAP-REGISTRY.md` carry, `STRATEGY-OMEGA-PLUGIN-REBUILD.md` §3).
- A cold reader meeting an Ollama pilot in any of those builds toward Ollama next — the exact failure mode D-418 named, still reachable through the side door.
- Falsifier for this record: the extended mechanical sweep below — the gate's own grep proves no planning doc still names an Ollama path after this record lands.

Blocks: none

## Options

| Criterion | (a) Remove the concept from every planning doc, history keeps its cited audit trail — this record | (b) Banner-only: leave live teaching under banners | (c) Defer — leave the concept standing |
|---|---|---|---|
| Append-only doctrine | Holds — markered amendments authorized by this directive; RATIFIED records, logs, and history rows untouched | Holds vacuously | Holds vacuously |
| Agent reading cold | A cold reader meets Chrome-only on every planning page; history is labeled history | A cold reader still meets a live Ollama pilot under a banner and builds toward it | A cold reader builds toward Ollama next — the known failure mode |
| Scope honesty | The sweep inventory in Consequences names every touched file and every deliberately-untouched location | Unbounded — banners cover passages nobody re-reads | The drift compounds |
| Cost | One record + markered doc edits + one new sweep test | Near-zero, and the vestige keeps costing attention | Zero, and the vestige keeps costing builds |

## Decision

**Decision:** (a) — remove the Ollama concept from the plan, in substance:

- Vision `OMEGA-ENDSTATE-VISION.md` §3 list drops Ollama with a D-456 marker clause; the Frank scenario re-points to a Chrome-mediated `provider.browser-gmail` harvested example with a D-418/D-456 marker; §28 row 3, §31 Wave-1 row, and the architecture row-4 markers stand as cited history.
- `04-WAVE-MAP.md` W2 objective goes Chrome-first with a D-456 marker; `llm.json` graduates language gives way to the D-420 fence pointer.
- `STRATEGY-OMEGA-PLUGIN-REBUILD.md` §3 pilot clause is markered void; `TRIAGE-LEDGER.md` T-02 and `05-GAP-REGISTRY.md` carry go browser-first with D-456 markers.
- `ROADMAP.md`, `WAVE2-PROVIDER-STRATUM.md`, and `OMEGA-CONSOLIDATION-INTEGRATION.md` §4.10 banners gain the D-456 pointer; `CURRENT-INVARIANTS.md` v1 bullet is extended.
- The v1 sweep's Frank clause is advanced to the browser example and a new `d-456-substrate-removal.test.ts` sweep lands; `provider.llm` code plus the proving compositions stay fenced by D-420, with code removal directed as follow-up.

## Consequences

- The plan speaks Chrome-only on every page: `provider.browser` is the realization that ships and the only named provider path; no local-model or AI-API sequencing claim survives in any planning doc.
- What gets harder: every future agent must cite THIS record alongside D-418 when reasoning about substrate; D-407/D-408-era citations of Ollama text must be read through both markers.
- What gets easier: the side-door failure mode is dead — no banner-covered pilot text remains for a cold reader to build toward.
- Revisit trigger: none scheduled. If the owner re-dates an AI-API realization into any stage, a new directive record re-opens the concept the same way this one closes it.
- The sweep inventory, touched and markered: `OMEGA-ENDSTATE-VISION.md` §3 plus Frank; `04-WAVE-MAP.md` W2; `STRATEGY-OMEGA-PLUGIN-REBUILD.md` §3; `TRIAGE-LEDGER.md` T-02; `05-GAP-REGISTRY.md` carry; `ROADMAP.md` banner; `WAVE2-PROVIDER-STRATUM.md` banner; `OMEGA-CONSOLIDATION-INTEGRATION.md` §4.10; `CURRENT-INVARIANTS.md` v1 bullet; `v1-substrate-sweep.test.ts` Frank clause; new `d-456-substrate-removal.test.ts`. Untouched on purpose: all RATIFIED records including D-418 and D-338, round and audit logs, `BUILD-DECISIONS.md` history rows, `provider.llm` code and the fenced proving compositions, the D-418 historical markers.

## Evidence

- F-CHROME-ONLY, the removal sweep, mechanical: `tooling/gates/test/d-456-substrate-removal.test.ts` — greps every planning doc in the inventory and asserts no Ollama-first sequencing claim and no Ollama provider path survives outside cited history; the v1 sweep's Frank clause is advanced to the browser example in the same tree:
  - F-CHROME-ONLY.1 — the vision doc no longer pictures an Ollama path (§3 list clean with marker; no unmarkered sequencing claim)
  - F-CHROME-ONLY.2 — the wave map teaches Chrome-first (W2 objective names the substrate; no unmarkered sequencing claim)
  - F-CHROME-ONLY.3 — strategy strata and triage rows go browser-first (strategy voided with marker; ledger and registry name no Ollama pilot)
  - F-CHROME-ONLY.4 — the extended banners point at this record (roadmap, wave-2, invariants, consolidation)
- Analysis citations, all file:line at this tree: vision §3 list plus Frank, `04-WAVE-MAP.md` W2, `STRATEGY-OMEGA-PLUGIN-REBUILD.md` §3, `TRIAGE-LEDGER.md` T-02, `05-GAP-REGISTRY.md` carry, the three extended banners, the `CURRENT-INVARIANTS.md` v1 bullet.
- Ratified on measured evidence (directive-class, same-day per D-364): PROPOSED landing commit d678dd0; full gate 1409/18 twice pre-fix plus confirmatory 1410/17 post-fix — the delta is F-GOV-CI.7 going green on the F-CHROME-ONLY citation, and every remaining red lane is proven pre-existing on the clean tree by stash proof, Windows-informational with Linux CI the merge arbiter; decisions, compositions, genome, and quick green throughout; zero host LOC; anvil untouched; compositions unchanged.

## Index

summary: Chrome master/slave is the only v1 substrate and the only named provider path; local-model and AI-API sequencing claims leave every planning doc
rationale: A cold reader meeting an Ollama pilot anywhere builds the wrong system, so the concept goes everywhere the plan speaks and history keeps only its cited audit trail
class: directive
