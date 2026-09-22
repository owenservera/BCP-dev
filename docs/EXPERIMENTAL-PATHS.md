# 3 Experimental Dev Paths — BCP-dev (full-context gin)

Source trees ginned: `bcp-speed/bcp` (BCP-SPEED control plane) · `omega-baseline/omega-final` (Ω landing forge, 32 layers, 161 decisions, gate-green) · `vivim-original-baseline/vivim-final-enhanced` (legacy monolith: 1,043 src files, 186 engines, 201 Prisma models, 16 providers, Chrome master/slave) · `docs/` chats (endstate vision + Intent Fabric elevation + external ceremony-vs-execution critique).

BCP rule respected: BCP is the **tracking substrate**, Omega is the **product**. No cross-repo REQUIRES edges. New work uses free families **FAM-07 / FAM-08 / FAM-09** (FAM-01..06 = landing, FAM-10..14 = prototype — untouched).

> **Seeded 2026-09-22 (owner-directed, require_human structural edit):**
> `bcp-speed/bcp/state/{capabilities,deps,experiments}.yaml` now carry
> FAM-07/08/09 at L0 with invariants, internal REQUIRES edges plus the
> single bridge edge `FAM-09.1 → FAM-11.1`, and `EXP-2026-004/005/006`
> (proposed, STANDARD, target L2, closed REQUIRES scope).
> `validate.py` 0 errors 0 warnings · `sweep.py` dry clean · 28 unit
> tests green · guardrails probe-tested (blocked + cross-scope leases
> refuse; acquire→release loop clean). Lane brief for fresh sessions:
> `bcp-speed/bcp/agents/lanes.md`.

---

## PATH-A — W5 ATOM / FRESH SKELETON (`EXP-2026-004`)

**Hypothesis:** the Ω constitution can carry one real turn on the **Chrome master/slave substrate only**, without migration, without stubs. No Ollama. No API-native. No local-model spine.
**Falsifier (F6-lite):** `person types → Chrome master/slave streamed response → law gate → ledgered → CLI-queryable`, headless, zero Prisma import. Tests replay from recorded fixtures; live Chrome is the only live path.

- **Scope (new):** FAM-07.1 W5 vertical slice · FAM-07.2 Chrome-master/slave realization row (`realizationRef` stamped, attach-only first) · FAM-07.3 law-gated stream + refusal sentence · FAM-07.4 ledger + query. Target **L2**, L3 only after 2-pass hardening.
- **Deliberately OUT:** Ollama, API-native providers, canvas, MCP, multi-surface parity, history migration, ACU/DCB graph, automation. One substrate only (Chrome master/slave — CDP attach, per-account profile, canonical-shape selectors). CLI only.
- **2-pass discipline (per external critique):** Pass 1 = dumbest honest slice (message in → real response out through real kernel, no law/provenance yet) to get the true solo time-cost in **days**. Pass 2 = add law → ledger → badges one at a time. Never demand all seven constitutional layers in the first lease.
- **First 3 leases:** `FAM-07.2 L1` (realization row + handler + stream config) → `FAM-07.1 L2` (end-to-end CLI turn) → `FAM-07.3 L2` (one forbidden op refused + ledgered).
- **Done-when:** 1 fixture-recorded Chrome turn through `law.check@1`, streamed, ledgered, `vivim.mind`-queryable + 1 refusal, live-vs-fixture substitution proven before any live Chrome in tests, `omega:gate` green at tip.
- **Risks:** Stubbing Compromise (internal-row-green mistaken for done) — killed by the external-verification rule; Constitution-First Stall (demanding full badges on day 1) — killed by 2-pass rule.
- **Solo estimate:** Pass 1 = 2–3 days. Pass 2 = 1 week. Anything estimated in weeks before Pass 1 exists is fiction.

## PATH-B — INTENT FABRIC / DETERMINISTIC NL CONTROL PLANE (`EXP-2026-005`)

**Hypothesis (owner-elevated core):** Vivim can feel LLM-like with **zero LLM in the trusted execution path**. *Probabilistic perception. Deterministic intent. Deterministic execution.*
**Falsifier:** same intent + same state + same policy → same executable meaning; ambiguous → asks; destructive → refuses in a sentence; prompt-injection → refused at the law gate.

- **Scope (new):** FAM-08.1 Canonical Intent IR (typed, inspectable, versioned) · FAM-08.2 Perception pipeline (rules · lexicon · grammar · one shared classifier; Chrome-harvested intelligence takes **only** the ambiguous tail, confidence attached, never silently — no Ollama, no API-native) · FAM-08.3 Capability resolution → law/consent → deterministic op plan · FAM-08.4 NLCL mine assay (60 legacy files as **assay input**, re-expressed fresh — never ported). Target **L2**.
- **Pipeline (constitutional, sits between Law and Capability Graph):** `Human language → Perception → Canonical intent → Capability resolution → Law/consent/refusal → Deterministic op plan → Deterministic execution (Chrome master/slave only) → Evidence/provenance/event`. All surfaces (Language, Canvas, CLI, MCP, Automation, Agent) express the **same** operation; there are not multiple implementations.
- **Deliberately OUT:** provider execution, canvas placement, memory/RAG assembly (Mind Spine context pipeline is a downstream consumer, not this path). Fully offline-testable except the ambiguous-tail battery, which replays from Chrome fixtures — fastest data point of the three paths.
- **First 3 leases:** `FAM-08.1 L1` (IR schema + 10 golden intents: UNDERSTOOD / AMBIGUOUS / REFUSED / EXECUTED) → `FAM-08.2 L2` (classifier + lexicon, LLM-tail gated) → `FAM-08.3 L2` (resolution → law → op plan, injection battery green).
- **Done-when:** golden intent corpus replays deterministically; ambiguity asks instead of guessing; every refusal carries `{code, sentence}`; injection suite refused + ledgered.
- **Risks:** Grammar-Forever (perfecting linguistics instead of closing the loop) — killed by the 10-intent golden cap; LLM-in-the-parse-path regression (old Vivim's silent failure) — killed by the confidence-attached tail rule.
- **Solo estimate:** IR + corpus = 2 days. Pipeline = 1 week. Feeds A and C — build it **in parallel** with A-Pass-1.

## PATH-C — STRANGLER + AIRLOCK / CONSUMER CHATGPT BRIDGE (`EXP-2026-006`)

**Hypothesis:** ship consumer value (chatgpt.com-grade) while the fresh core proves itself; legacy stays working behind an adapter, history gets smelted — never ported.
**Falsifier:** live capture substitutes for a recorded fixture with zero classifier changes (byte-identical modulo declared volatile allowlist) + legacy history import preserves counts into the vault.

- **Scope (reuse, no new families except airlock):** FAM-10.x (provider graph as adapter seam) · FAM-11.x (storage — **schema-ready for multi-account, UI ships single-account**) · FAM-13.1 (web app as client, never second platform) · **new FAM-09.1 Airlock forge** (201 Prisma models → ~16 vault namespaces, one-time, writes `harvested` legacy rows). Target **L2**, L3 only on the import path + one provider.
- **Depth discipline (cheap-now vs expensive-later):** history **pull/import + search = deep first**; live bidirectional sync = polling first, realtime deferred. WebApp parity = **top 3–5 by (user value ÷ selector fragility)**, rest explicitly cut from v1. ACU/DCB intelligence = **deferred hardest** (raw storage + search first, model after months of real data). Automation = **shallowest on purpose** (single explicit user-triggered actions; no Fleet Supervisor — ToS/bot-flag risk on other people's accounts). Chrome Governor = **one quarantined realization**, attach-only first, canonical-shape (roles·structure·states·transitions) stored, selectors derived-disposable.
- **First 3 leases:** `FAM-09.1 L1` (model→namespace map + count-preservation probe — the single entry lease; FAM-10.1/11.1/10.2/10.3/13.1 are already L2, held as context and satisfied requirements, not leased) → adapter work rides `FAM-09.1` L1→L2 → import path hardens toward L3 only.
- **Done-when:** import preserves row counts + is searchable; 1 provider replays from fixture through adapter; 1 forbidden automation refused + ledgered; no bulk stealth admission (each file: law reason or refusal, same commit).
- **Risks:** God-Adapter (adapter becomes the product) — killed by the sunset clause (adapter dies when its provider goes Chrome-canonical); Edge-Case Tar Pit (parity treadmill vs someone else's UI) — killed by the 3–5 cap; Migration-in-critical-path — killed by fresh-state-first rule.
- **Solo estimate:** inventory + airlock map = 1 week. One provider bridge = 2 weeks. Do **not** start before A-Pass-1 gives the real velocity number.

---

## How the three run together (BCP mechanics)

| | A — Skeleton | B — Intent | C — Strangler |
|---|---|---|---|
| Experiment | EXP-2026-004 / L2 | EXP-2026-005 / L2 | EXP-2026-006 / L2 |
| Needs | nothing (fresh state) | nothing (offline) | A-Pass-1 velocity number |
| Feeds | C (Chrome-canonical target), B (execution target) | A (intent entry), C (same op vocab) | A (proving ground), B (real utterances) |
| Kills if red | constitution can't carry 1 turn → stop B/C scope growth | NL must stay LLM-driven → Intent stays adapter-only | bridge costs > fresh build → cut parity, keep airlock only |

No cross-repo REQUIRES. Each experiment's scope must contain its own REQUIRES closure (`validate.py` enforces). Leases: 5 per scoped-builder / 3 per fullscope-builder, one live lease per capability, holder-only bumps, `sweep.py --fix --views` every 5 min.

## Recommended order for a solo operator

1. **This week:** A-Pass-1 (dumb slice) + B-IR-corpus in parallel — two falsifiable-in-days bets.
2. **Next:** A-Pass-2 (law → ledger → badges, one layer at a time) + B-pipeline.
3. **Only then:** C-inventory → airlock map → one provider bridge. Cut to 3–5 surfaces, poll-sync, single-trigger automation.

The dream is the destination. The falsifiers are the mile-markers. The hand-fix tally is the fare — and Pass 1 is how we learn what the fare actually is.
