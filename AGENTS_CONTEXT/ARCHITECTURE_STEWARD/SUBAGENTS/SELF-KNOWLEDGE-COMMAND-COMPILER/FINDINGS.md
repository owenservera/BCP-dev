# CFA-03 — M1 Semantic Continuity Baseline Findings

> Date: 2026-09-27
> Round: Strategic Roadmap Round 1 — M1
> Classification: CFA-owned research evidence; not Ω law and not a shared boundary.
> Current main during M1 work: 5675dafd9da30855b3ddcd91402df51a2f054755

## M1 scope

Trace the live semantic path, identify current continuity and identity boundaries, and record the smallest evidence-backed gaps. No shared-boundary activation, Ω-law change, new semantic database, or production implementation.

## Findings

### F1 — Self-knowledge is derived input, not canonical authority
OBSERVED / CURRENT

vivim.mind reads the live law registry, bounded vault evidence and composition configuration, then derives a WorldModel. It has no write path and fails closed on evidence failure.

Implication: WorldModel is the current grounding target for the language layer, not canonical World truth and not execution authority.

Evidence:
- omega-baseline/omega-final/plugins/vivim-mind/src/index.ts
- omega-baseline/omega-final/plugins/vivim-mind/plugin.json
- docs/destination/self-knowledge-core/RESEARCH.md

### F2 — NCLL interpretation is already deterministic and traced
OBSERVED / CURRENT

The pure language package exposes interpret(text, world). The pipeline is scan → lex → symbol-parse → recognizers → frame-match → grounding → resolve → project.

Interpretation contains IR, alternatives, canonical form, reading, confidence, effects, suggestions, gaps and stage traces.

ground.ts deterministically ranks grounding matches. Learned priors only re-rank existing candidates and cannot add/remove candidates or bypass a gate.

Implication: M1 does not justify a new compiler core. The strategic gap is cross-plane continuity.

Evidence:
- omega-baseline/omega-final/plugins/vivim-nlcl-pure/src/index.ts
- omega-baseline/omega-final/plugins/vivim-nlcl-pure/src/interpret.ts
- omega-baseline/omega-final/plugins/vivim-nlcl-pure/src/ground.ts
- omega-baseline/omega-final/plugins/vivim-nlcl-pure/src/types.ts

### F3 — Language meaning is data over a bounded primitive grammar
OBSERVED / CURRENT

contracts/src/lang.ts defines the 17 command symbol families plus frame, slot and lexicon contribution shapes. frames.ts preserves the primitive grammar while meanings and lexicon remain extensible data.

Implication: visual/symbolic work should reuse this language model rather than create a second grammar.

Evidence:
- omega-baseline/omega-final/contracts/src/lang.ts
- omega-baseline/omega-final/plugins/vivim-nlcl-pure/src/frames.ts

### F4 — D-411 closes Intent continuity, but full Plan/Work continuity is not proven
OBSERVED / CURRENT

The current web surface routes interpret → intent.submit@1 → law.check@1 with citation for gated operations → routed operation → intent.resolution@1.

Intent persists type, payload, real payloadHash, interpretation summary, lifecycle state, steps, optional planRef and evidence references.

D-411 records UNDERSTOOD, AMBIGUOUS, REFUSED and EXECUTED as durable resolution semantics.

The important gap is that the current evidence proves the Intent plus resolution seam, but does not prove that every relevant live command traverses a durable canonical Plan and Work chain before execution. IntentStep and planRef exist, and vivim.run has a Work substrate, but the complete linkage is not established by the console path.

Status: PARTIAL / UNKNOWN.

Evidence:
- omega-baseline/omega-final/contracts/src/intent.ts
- omega-baseline/omega-final/docs/decisions/D-411-intent-seam.md
- omega-baseline/omega-final/surfaces/web/src/api.ts
- omega-baseline/omega-final/plugins/vivim-intent/src/index.ts
- omega-baseline/omega-final/docs/VAULT-NAMESPACES.md

### F5 — Context assembly and WorldModel are distinct derived projections
OBSERVED / CURRENT

D-443 defines deterministic context assemblies over cited durable evidence with byte offsets, epistemic kinds, named eviction and digest verification. vivim.mind independently derives a bounded WorldModel from governed evidence for grounding.

Implication:
durable evidence → context assembly
durable evidence → WorldModel

These are related projections, not interchangeable semantic or data authorities.

Evidence:
- omega-baseline/omega-final/docs/decisions/D-443-context-substrate.md
- omega-baseline/omega-final/plugins/vivim-mind/src/index.ts

### F6 — VisualSpec is representation, not yet a proven bidirectional compiler
OBSERVED / CURRENT

VisualSpec, slot cards, entity chips, channel picker, risk badges, suggestions and gaps already exist as deterministic interpretation projection structures.

The historical SVG design is useful for representation ideas but is archive evidence, not current authority.

Status: representation is current; general visual-edit write-back remains unproven.

Evidence:
- omega-baseline/omega-final/plugins/vivim-nlcl-pure/src/types.ts
- omega-baseline/omega-final/plugins/vivim-nlcl-pure/src/project.ts
- docs/archive/planning/chat-SVG Symbolic Communication Design.txt

### F7 — State dimensions must remain orthogonal
OBSERVED / CURRENT

Current contracts distinguish interpretation status, grounding state, epistemic status, confidence, risk, Intent resolution, authority, Intent lifecycle and execution lifecycle.

Core invariant:
confidence is not proof;
evidence is not authority;
grounding is not authorization;
Intent is not Work;
representation is not authority;
authorization is not execution.

Evidence:
- omega-baseline/omega-final/contracts/src/vocabulary.ts
- omega-baseline/omega-final/contracts/src/intent.ts
- omega-baseline/omega-final/surfaces/web/src/api.ts
- omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md

## Live semantic trace

| Stage | Current mechanism | Semantic artifact | Status |
|---|---|---|---|
| Raw input | web surface / caller | input text | OBSERVED |
| Knowledge assembly | vivim.mind | WorldModel | OBSERVED |
| Lex/symbol analysis | lexer + symbols | tokens/modifiers | OBSERVED |
| Recognition | recognizers + frames + grammar | candidates / IR | OBSERVED |
| Grounding | ground.ts | target candidates / ambiguity | OBSERVED |
| Interpretation | interpret.ts | Interpretation | OBSERVED |
| Representation | project.ts / VisualSpec | projected meaning/effects | OBSERVED |
| Canonical Intent | intent.submit@1 | Intent + interpretation + payloadHash | RATIFIED / CURRENT |
| Authority gate | law.check@1 | live permission decision | RATIFIED / CURRENT |
| Routed operation | router/runtime | operation outcome | OBSERVED |
| Resolution evidence | intent.resolution@1 | terminal resolution record | RATIFIED / CURRENT |
| Derivation trace | intent.trace / intent.explain@1 | replayable explanation trace | OBSERVED |
| Plan/Work continuity | planRef + vivim.run Work substrate | expected semantic-to-execution link | PARTIAL / UNKNOWN |
| Closed-loop self-knowledge update | derived self-views | future semantic feedback | PARTIAL / UNKNOWN |

## Current proven spine

WorldModel
→ deterministic NCLL Interpretation
→ canonical IR
→ persisted Intent
→ live authority citation/gate
→ routed operation
→ resolution evidence.

## Current unproven spine

Intent
→ canonical Plan
→ durable Work
→ Attempt / execution state
→ evidence
→ semantic self-knowledge refresh.

## M1 identity dimensions

Semantic identity; World subject reference; durable record identity; revision identity; Intent identity; Plan/step identity; Work/attempt identity; evidence identity; representation identity; authority-citation identity.

Anti-collapse rule: no single identifier is proof of all dimensions. Use explicit relations among independently owned identities.

## M1 gaps

G1 — General freshness: current systems expose versions/timestamps/bases, but no single generalized freshness contract spans all derived semantic views.

G2 — Complete Intent → Plan → Work continuity: contracts and substrates exist, but complete live linkage is not yet proven.

G3 — Visual write-back: deterministic projection exists; general semantic-edit round-trip is not yet proven.

G4 — General relation vocabulary: explicit identity/provenance relations are conceptually clear, but a universally reusable relation vocabulary is not ratified.

G5 — Self-knowledge closed loop: derived self-description exists; a complete evidence-preserving semantic feedback loop is not yet established.

## Round-2 status correction

Current repository evidence now records:
- CFA-01 / CFA-03 RP-01: AGREED on the minimum WorldReferenceResult dimensions.
- CFA-04 / CFA-03 RP-02: AGREED on the minimum semantic package and separate live authority result.
- CFA-02 / CFA-03 RP-06: AGREED on the explicit semantic ↔ record/revision/evidence/representation relation pattern.

The shared boundaries remain unactivated; these agreements describe seam compatibility, not universal ownership transfer.

## M1 conclusion

The current system already has a strong deterministic semantic spine through Intent. The strategic risk is not basic parsing. It is continuity across independently owned semantic, data, authority, Work, evidence and representation planes.

No new universal semantic store or second grammar is justified by M1.

## Evidence index

- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/BOUNDARY-ROUND-1-DECLARATION-2026-09-26.md
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md
- AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md
- omega-baseline/omega-final/contracts/src/lang.ts
- omega-baseline/omega-final/contracts/src/intent.ts
- omega-baseline/omega-final/contracts/src/vocabulary.ts
- omega-baseline/omega-final/plugins/vivim-nlcl-pure/src/index.ts
- omega-baseline/omega-final/plugins/vivim-nlcl-pure/src/interpret.ts
- omega-baseline/omega-final/plugins/vivim-nlcl-pure/src/ground.ts
- omega-baseline/omega-final/plugins/vivim-nlcl-pure/src/project.ts
- omega-baseline/omega-final/plugins/vivim-nlcl-pure/src/types.ts
- omega-baseline/omega-final/plugins/vivim-nlcl-pure/src/frames.ts
- omega-baseline/omega-final/plugins/vivim-mind/src/index.ts
- omega-baseline/omega-final/plugins/vivim-mind/plugin.json
- omega-baseline/omega-final/plugins/vivim-intent/src/index.ts
- omega-baseline/omega-final/plugins/vivim-intent/src/trace.ts
- omega-baseline/omega-final/surfaces/web/src/api.ts
- omega-baseline/omega-final/docs/decisions/D-411-intent-seam.md
- omega-baseline/omega-final/docs/decisions/D-443-context-substrate.md
- omega-baseline/omega-final/docs/VAULT-NAMESPACES.md
- docs/destination/self-knowledge-core/RESEARCH.md
- docs/archive/planning/chat-SVG Symbolic Communication Design.txt
