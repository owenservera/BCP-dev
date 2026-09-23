# PKT-001 — Cooperative Substrate Charter (packet over the initiating brief)

> **Classification: DERIVED — CURRENT**
> **packet id:** PKT-001 · **workstream:** WS-001
> **source transcript:** `transcripts/2026-09-23/CHAT-2026-09-23-cooperative-agent-context.md`
> (§§1–31, full range) · **source kind:** human charter (owner-issued, ChatGPT-originated architecture)
> **extraction session:** IMPL-01 local session 2026-09-23 · **base tip:** `becb920`
> **freshness:** CURRENT · **supersedes:** — · **superseded-by:** —

## Facts (each traceable)

| # | Claim | Source kind / id / location | Repo support | Status |
|---|---|---|---|---|
| F1 | First job is the cooperative context system, NOT `vivim.self` | transcript §Mission | WORKSTREAMS.md (WS-001 active, WS-002 blocked) | DERIVED-CURRENT |
| F2 | Transcript ≠ law; discoveries become knowledge only via evidence/decision mechanisms | transcript §§1,4 | Ω AGENTS.md (ratify/supersede discipline); CURRENT-INVARIANTS.md | DERIVED-CURRENT (restates law) |
| F3 | Repo roles stay separated: VIVIM mine / BCP forge / Ω destination | transcript §2 | `/AGENTS.md` boundary table | DERIVED-CURRENT (restates law) |
| F4 | Reuse before invention: session ledger, dev-vault, doctruth, genome, brief/entry/portrait, agent plugin, D-443/D-448/D-452..455 | transcript §2 list + §9 | Ω tree: `tooling/gates/session.ts`, `devvault.ts`, `doctruth.ts`, `genome.ts`, `brief.ts`, `entry.ts`, `tooling/portrait/`, `contracts/src/agent.ts`, decisions D-309/D-425..D-430/D-443/D-448/D-451..D-455 | DERIVED-CURRENT (verified by audit this session) |
| F5 | Nine-class + five-freshness banner scheme governs every artifact | transcript §§15,23 | SYSTEM.md §§5,13; all substrate files bannered | DERIVED-CURRENT |
| F6 | Session protocol = Ω ledger (begin/stream/close), referenced not forked | transcript §9 | D-430; Ω AGENTS.md session-ledger law | DERIVED-CURRENT (restates law) |
| F7 | v1 explicitly excludes embeddings/vector DBs/memory layers/semantic index/ontology DB/autonomy/cloud | transcript §28 | SYSTEM.md §18 | DERIVED-CURRENT (scope decision, coordinator-owned) |
| F8 | Long-term direction: conversations + work + observations + evidence + decisions + semantics → substrate → Ω self-description → task-conditioned context | transcript §29 | WORKSTREAMS.md WS-002 (PROPOSED) | PROPOSED (direction, not plan) |

## Discovered concepts

- **Repository as synchronization substrate:** continuity without any single
  participant holding full context — the durable-memory inversion (§§3,31).
- **Epistemic separation as load-bearing protocol**, not etiquette (§4):
  LAW ≠ EVIDENCE ≠ DERIVED ≠ TRANSCRIPT ≠ PROPOSAL ≠ HISTORY ≠ OPINION.
- **Compaction with stable references + on-demand expansion** instead of
  ever-growing summaries (§20).
- **Contradiction representation** (CLAIM A vs CLAIM B + governing resolution,
  history retained) instead of silent merges (§21).
- **Coordinator as visible integrator**, explicitly not a hidden singleton
  memory (§25).

## Proposals (all accepted into this substrate unless noted)

- P1: `docs/agent-system/` layout + six conventions — accepted as built
  (SYSTEM/ROSTER/WORKSTREAMS/CURRENT/CONTEXT-INDEX/CHATGPT-BOOT + six dirs).
- P2: Ten falsifiers F-AGENT-* — accepted in `FALSIFIERS.md` (protocol-grade,
  D-426-shaped, living outside `tooling/gates/test/`).
- P3: Inbox/outbox envelope v1 — accepted in `ENVELOPE.md` (dogfood will judge).
- P4: Phases 0–5 sequencing (audit → substrate → dogfood → wall test →
  cross-conversation → self-knowledge) — accepted; WS-001 tracks Phases 0–1
  done, 2–4 owned by TEST-01/CONTEXT-01/DOC-01, Phase 5 = WS-002 gate.

## Contradictions

- None between the charter and repo law as audited. Standing watch-item (not
  a contradiction): any future transcript claiming Ollama/`provider.llm` as
  plan conflicts with D-418/D-456 — resolution pre-recorded: decisions govern,
  transcript retained as history (pattern §21 example).

## Unknowns

- U1: Is packet schema v1 expressive enough for cross-ChatGPT continuity?
  (TEST-01, F-AGENT-CROSS-CHATGPT.)
- U2: Is envelope v1 enough for 3-agent dogfood? (Phase 2.)
- U3: Exact CURRENT size budget under real multi-workstream load (target
  ~120 lines; revisit after WS-002 opens).

## Reasoning lineage (genealogy, not just conclusions)

- **Why the substrate-first order:** the charter assumes concentrated context
  (one owner + one long chat) does not scale; the correction it makes is
  sequencing — memory protocol before self-model (WS-002 blocked on WS-001
  proofs). Evidence: repo already shows the failure mode (parked lanes, stale
  era docs, cold-reader traps listed in `/AGENTS.md`).
- **Why reuse-not-fork:** Ω already built the hard mechanisms (ledger,
  vault, genome, agent control, aperture). The charter's §2 list was verified
  against the tree this session (all present); forking any of them would
  create two writers for one truth. Explicitly rejected: a parallel session
  log, a packet-native provenance scheme competing with doctruth, a second
  ontology beside genome/taxonomy.
- **Why transcripts immutable + packets versioned:** conclusions decay,
  reasoning history must not. The charter's §§7–8/23 make update-in-place a
  first-class bug; the substrate encodes it (SUPERSEDED + forward links).
- **Why coordinator-owned CURRENT with agent proposals via outbox:** concurrent
  direct edits to one canonical file diverge; the §12→§13→§25 chain routes
  integration through one visible integrator whose state is itself in-repo.
- **Explicitly rejected:** embeddings/vector/LLM-memory/semantic-index v1
  (§28); `vivim.self` before substrate proofs (Phase 5 gate); elevating this
  charter or any chat into law (§§1,4 — this packet is DERIVED).

## Recommended reads

1. `transcripts/2026-09-23/CHAT-2026-09-23-cooperative-agent-context.md` §§4, 9, 20–23 (epistemics, sessions, compaction, conflict, provenance, freshness).
2. Ω `docs/decisions/D-430-session-ledger.md`, `D-428-development-vault.md`, `D-425-genome-fold.md`, `D-426-falsifier-first-loop.md`.
3. Ω `docs/decisions/D-443-context-substrate.md`, `D-448-aperture.md`, `D-452-invocation.md`..`D-455-adaptation-governance.md`, `D-309` family.
4. `/AGENTS.md` cold-reader traps; `docs/CURRENT-CONTEXT.md` unresolved list.
