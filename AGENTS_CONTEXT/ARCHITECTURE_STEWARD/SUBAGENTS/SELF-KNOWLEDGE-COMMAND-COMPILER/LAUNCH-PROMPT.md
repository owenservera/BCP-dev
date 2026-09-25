# VIVIM — Architecture Steward Subagent
## Self-Knowledge × Ω Command Language × Deterministic Interpreter/Compiler

**Repository:** https://github.com/owenservera/BCP-dev  
**Access:** You have full GitHub access to the owner's account. Use it directly.  
**Branch:** `steward/subagent-self-knowledge-command-compiler`

## Mission

Independently investigate and design the architectural boundary and integration between three related VIVIM concerns:

1. **Runtime self-knowledge** — the runtime's derived, read-oriented knowledge of its own admitted plugins, capabilities, contracts, routes, compartments, Work, Evidence, law observations and freshness.
2. **The Ω command language / NLCL** — the deterministic Natural Command Language Layer, including its pinned symbolic family grammar, language-as-data contributions, frames, lexicon, grounding, interpretation and canonical intent production.
3. **The interpreter/compiler surface** — the path from human natural-language or symbolic command input to a deterministic canonical command/intent representation and, potentially, a live visual/symbolic representation (Unicode/SVG/glyph stream) that gives the user real-time assurance of what VIVIM has interpreted.

The objective is **not** to invent three systems independently.

The objective is to determine the smallest coherent architecture in which:

`human command → deterministic interpretation → canonical command/intent → executable plan / query → governed runtime → evidence → self-knowledge / grounding`

can be understood, traced and eventually represented visually without creating:
- a second ontology;
- a second architecture graph;
- a hidden authority path;
- a K0 project-management/developer subsystem;
- a second command grammar;
- or a visual representation that becomes authoritative merely because it is displayed.

## Strategic Context (V1 vs V2)

You must understand the immediate product timeline so that the “smallest implementation slice” is sized correctly and does not accidentally pull V1 into V2 scope.

1. **V1 (Immediate Priority):** a Sovereign AI Command Center built around a universal command/prompt surface, Vault, and Chrome substrate. The immediate UI may remain a raw Command Palette.
2. **V2 (This Subagent's Strategic Domain):** the Spatial Intent Circuit and the richer Visual/Symbolic Compiler.

Your boundary design must therefore preserve this layering:

`V1 raw Command Palette → existing NLCL / Intent pipeline`

with:

`V2 Visual/Symbolic Compiler → optional projection/editing layer over the same canonical interpretation and Intent model`

V1 must not require the full visual compiler.

The visual compiler must be designed so it can be introduced later as a projection and editing surface **without rewriting the V1 NLCL/Intent core or introducing a parallel semantic engine**.

Do not interpret this as permission to ignore visual/compiler semantics. The subagent must still determine the correct long-term bidirectional and execution-aware boundary now, while keeping immediate implementation scope narrow.

## Why delegated

The subject spans current Ω contracts, a pure deterministic parser/interpreter implementation, runtime self-knowledge, the Architecture Steward development graph, and an older archived design conversation about an SVG/Unicode symbolic compiler.

Independent exploration is needed to:
- recover what already exists in code and contracts;
- distinguish current implementation from historical ideation;
- identify semantic seams rather than duplicate responsibilities;
- test whether self-knowledge and command interpretation currently share stable identities;
- identify the minimum missing contracts or mappings;
- and expose unresolved questions before implementation hardens the boundary.

Treat the archived symbolic-communication design as historical research that may contain ideas worth harvesting; it is not authority.

## Starting context — read these first

### Architecture Steward
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/AGENT.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/README.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/STATE.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/OPERATING-INTERPRETATION.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/MAPPING-SYSTEM.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/DEPTH-MODEL.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/DEPENDENCY-GRAPH-METHOD.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/GRAPH-PROTOCOL.md` when present
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SELF-KNOWLEDGE-AND-DEVELOPMENT-GROUNDING-DESIGN.md`
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SESSION-HANDOFF-2026-09-25.md`

### Current Ω command-language / interpreter implementation
Start with:
- `omega-baseline/omega-final/contracts/src/lang.ts`
- `omega-baseline/omega-final/contracts/src/intent.ts`
- `omega-baseline/omega-final/contracts/src/surface.ts`
- `omega-baseline/omega-final/contracts/src/vocabulary.ts`
- `omega-baseline/omega-final/plugins/vivim-nlcl-pure/src/index.ts`
- `omega-baseline/omega-final/plugins/vivim-nlcl-pure/src/symbols.ts`
- `omega-baseline/omega-final/plugins/vivim-nlcl-pure/src/frames.ts`
- `omega-baseline/omega-final/plugins/vivim-nlcl-pure/src/interpret.ts`
- related `grammar.ts`, `ground.ts`, `lexer.ts`, `recognize.ts`, `project.ts`, `types.ts`
- `omega-baseline/omega-final/plugins/vivim-director/test/lang-mirror.test.ts`

Search the repo for:
- `NCLL_VERSION`
- `LangContribution`
- `LangFamilyChar`
- `IntentResolution`
- `interpret(`
- `nlcl.interpret@1`
- `grounding.trace@1`
- `self.knowledge.snapshot@1`
- `mind.portrait@1`
- `WorldModel`
- `VisualSpec`
- `VisualSlotCard`
- `VisualEntityChip`
- `canonical`
- `reading`
- `confidence`
- `payloadHash`
- `interpretation`

### Historical symbolic-communication design
Read:
- `docs/archive/planning/chat-SVG Symbolic Communication Design.txt`

Extract especially:
- the 17 symbolic family grammar;
- proposed Unicode/SVG visual compiler;
- real-time interpretation assurance;
- representation of ambiguity/incomplete/understood/verified/refused states;
- visual treatment of confidence vs proof;
- command DAG visualization;
- symbol/core/envelope/slot composition;
- provenance and epistemic indicators;
- what is already reflected in current Ω code;
- what remains purely conceptual.

### Destination / graph context
Inspect:
- `docs/destination/architecture/graph/README.md`
- `docs/destination/architecture/graph/GRAPH-MANIFEST.json`
- `docs/destination/architecture/graph/SCHEMA.json`
- `docs/destination/architecture/graph/NODES.json`
- `docs/destination/architecture/graph/EDGES.json`

Also inspect the destination/intelligence sources needed to resolve ownership:
- `docs/destination/CONCEPTUAL-MODEL.md`
- `docs/destination/DESTINATION-MASTER-MAP.md`
- `docs/destination/core-vs-plugin-boundary/DESTINATION-RESPONSIBILITY-MATRIX.md`
- `docs/destination/system-intelligence/indexes/ATOMS.json`

Do not read the whole repository indiscriminately. Search outward from these anchors.

## Core questions to answer

### A. What is actually current?
Determine, with path/line/commit evidence where possible:
- what command grammar currently exists;
- where the 17 symbolic families are defined;
- where frames and lexicon live;
- where natural language is interpreted;
- how candidate scoring/confidence works;
- how ambiguity is represented;
- how canonical output is built;
- how an Intent persists its interpretation;
- how runtime WorldModel data participates in grounding;
- how self-knowledge currently works;
- how the Steward graph currently relates to runtime self-knowledge;
- whether any visual compiler / symbolic projection already exists beyond the archived design.

### B. What is the canonical command compilation pipeline?
Trace:
`raw input → lex → symbolic modifier parse → recognizers → frame match → grounding → deterministic resolution → IR → canonical → reading → Intent`

Also determine whether:
- symbolic and natural-language input converge to the same IR/canonical form;
- visual output is derived from the same interpretation object or would create a parallel semantics path;
- multi-step commands become IntentSteps / DAGs or another plan representation.

### C. What is the relationship between command interpretation and self-knowledge?
Separate:
- knowledge needed to interpret;
- knowledge needed to authorize;
- knowledge needed to execute;
- knowledge produced after execution.

Inspect operations, capabilities, entities, providers/accounts/sessions, Work, context, lexicon, routing, risk, law and freshness.

### D. What should a “self-knowledge graph” actually be?
Evaluate:
- runtime self-knowledge projection;
- Steward development architecture graph;
- grounding bundle;
- explicit cross-plane links.

Determine the smallest graph-shaped capability supported by current evidence. Do not propose a universal graph database unless evidence requires it.

### E. What should “compiler” mean?
Disambiguate:
1. NL interpreter: text → IR.
2. Canonical command compiler: IR → canonical symbolic command.
3. Execution-plan compiler: command → Intent/steps/DAG.
4. Visual compiler: canonical interpretation → glyph/token/SVG.
5. Grounding compiler: target/query → localized self-knowledge/architecture trace.

Determine what is current, proposed, or should remain separate.

### F. What is the proper role of the 17 symbols?
Determine:
- lexer grammar primitives;
- grammar-fixed vs data-contributed meaning;
- symbol ↔ frame/slot relationships;
- modifiers vs primary command families;
- exact role of all 17 symbols;
- whether symbols are sufficient to reconstruct canonical commands;
- whether visual rendering is merely a representation or an input-capable canonical syntax.

**Bidirectional Compilation:** Evaluate whether the visual representation can act as a writable surface through direct manipulation. If a user drags an edge, changes a slot/entity chip, inserts/removes a node, changes ordering, or otherwise edits the visual DAG, determine how that edit canonicalizes back into the underlying IR, canonical command and/or Intent/plan representation.

Define a **Round-Trip Invariant** for the system. At minimum evaluate:

`parse(canonical(compile(intent))) ≡ intent`

and determine the correct strengthened form when plan identity, evidence, non-semantic presentation metadata, or execution state make literal equality inappropriate.

The visual representation must therefore be treated as a potentially editable representation of canonical semantics, not merely a screenshot of them. Any editing semantics must remain deterministic and must converge on the same canonical semantic model used by V1.

### G. Real-time interpretation assurance
Determine how the user should distinguish:
- incomplete parse;
- unresolved slot;
- ambiguity;
- accepted deterministic interpretation;
- refusal;
- execution state;
- proof/verification;
- stale/unknown grounding.

Keep separate:
- confidence;
- epistemic status;
- intent resolution;
- risk/consent;
- execution state;
- proof.

**Orthogonal Visual Encoding:** Design a visual grammar in which Epistemic State (match/knowledge quality) and Risk Class (consequence level) are encoded orthogonally rather than collapsed into one flat state machine. A concrete encoding strategy is required (for example, Dual-Ring Encoding where Inner Ring = Epistemic and Outer Ring = Risk), but the agent may propose a different orthogonal mechanism if it is equally explicit and deterministic.

The visual model must allow a user to distinguish, at a glance, cases such as:
- VERIFIED + READ;
- VERIFIED + MUTATION;
- VERIFIED + EXTERNAL_MUTATION;
- AMBIGUOUS + EXTERNAL_MUTATION;
- STALE/UNKNOWN + any risk class.

Do not use a single “color/status” value that makes combinations like “verified but dangerous” impossible to represent.

**Execution-Time Semantics:** The visual/compiler model must not stop at pre-execution parsing. Define visual and semantic states for at least:
- `RUNNING` — active node/step progress;
- `PAUSED_AT_GATE` — waiting for `law.consent` / approval on an External Mutation;
- `PARTIALLY_COMPLETED` — committed steps versus pending/gated steps;
- `FAILED` — distinguish failure from successful committed prior work;
- `CANCELLED` — distinguish cancellation from rollback and make clear which work is already committed.

Treat execution state as a separate axis from interpretation, epistemic state and risk.

### H. Self-knowledge command surface
Investigate how user/agent commands could ask:
- what capabilities exist;
- what a command means;
- what is currently routed;
- why a capability exists;
- what a realization depends on;
- why interpretation is ambiguous;
- what evidence supports a result.

Classify likely surfaces as ordinary operations, surface-only pseudo-intents, grounding operations, self-knowledge queries, or developer tooling.

Do not assume `graph:trace` is final syntax.

### I. Identity and provenance
Map:
- raw command text;
- interpretation;
- canonical form;
- Intent ID;
- step ID;
- capability/op;
- entity reference;
- Work ID;
- Evidence ref;
- self-knowledge node identity;
- architecture graph node identity;
- visual representation identity.

Identify where hashes, revisions, provenance refs and freshness basis need to survive.

A visual token must never become canonical identity merely because it has an SVG/Unicode representation.

### J. Falsifiers
Explicitly test:
- visual representation diverges from executable meaning;
- symbolic and NL parsers diverge semantically;
- confidence becomes proof;
- visual verified state appears before proof;
- self-knowledge grants authority;
- runtime graph becomes second architecture authority;
- development graph becomes runtime authority;
- parser bypasses Intent/law;
- provider/account/realization collapse into one identity;
- stale WorldModel gives falsely confident interpretation;
- visual DAG is mistaken for executable DAG;
- language contribution changes grammar rather than data;
- surface-only pseudo-intent accidentally routes;
- changing visual representation changes semantic identity;
- the visual compiler is read-only and lacks a canonical write-back path, violating the Round-Trip Invariant;
- a visual edit (for example dragging an entity chip to a new object or changing a dependency edge) does not deterministically update the underlying canonical text/IR/plan;
- execution state is flattened into parse state such that RUNNING, PAUSED_AT_GATE, PARTIALLY_COMPLETED, FAILED and CANCELLED cannot be represented without semantic loss;
- a visual edit appears to authorize, bypass, or mutate law without going through the governed runtime authority path;
- V2 visual functionality forces a rewrite of the V1 NLCL/Intent pipeline rather than remaining a projection/editing layer over stable canonical semantics.

## Anti-assumption rule

The current corpus is incomplete until checked.

Do not assume documentation is implementation, implementation is destination-correct, archived research is current, names imply ownership, or visual representation is authority.

Every important conclusion must be classified as:
- OBSERVED
- DERIVED
- PROPOSED
- UNKNOWN
- CONFLICTED

## Evidence discipline

For consequential findings record:
- repository path(s);
- branch/ref and commit when discoverable;
- symbol/function/type/document;
- observed fact;
- derived interpretation;
- unresolved unknown;
- source role: current, historical, proposed, or authoritative within scope.

Preserve disagreements.

## Required outputs

Create these durable outputs under:

`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/`

### 1. `FINDINGS.md`
Grounded current-state research:
- command pipeline;
- self-knowledge pipeline;
- visual/compiler inventory;
- evidence table;
- contradictions;
- unknowns.

### 2. `CROSSWALK.md`
Normalize:

`COMMAND LANGUAGE ↔ INTERPRETATION ↔ INTENT ↔ SELF-KNOWLEDGE ↔ GROUNDING ↔ STEWARD GRAPH ↔ VISUAL REPRESENTATION`

For every important relationship include:
- canonical identity;
- semantic owner;
- authority owner;
- source/evidence basis;
- runtime/durable status;
- current/target/historical/proposed state.

### 3. `BOUNDARY-DESIGN.md`
Produce a bounded architecture design covering:
- command language;
- interpreter;
- execution-plan compilation;
- visual compilation;
- self-knowledge;
- grounding;
- Steward;
- minimum interfaces;
- identity/provenance/freshness seams;
- smallest implementation slice proving the boundary.

The design must explicitly address:
- V1 raw Command Palette compatibility;
- V2 optional visual projection/editing;
- bidirectional compilation and the Round-Trip Invariant;
- orthogonal visual encoding;
- execution-time semantics;
- how visual editing remains below semantic/authority ownership.

Explicitly state what **not** to build.

### 4. `IMPLEMENTATION-QUEUE.md`
Only justified implementation gaps.

Each item:
- target;
- reason;
- source/evidence;
- dependency;
- proof/falsifier;
- blocker / enabling seam / later enhancement.

No broad roadmap.

## Required examples

Include one fully traced example for each:
- simple single-step command;
- multi-step command;
- ambiguous command;
- self-knowledge/grounding query;
- visual symbolic projection;
- **paused execution:** a multi-step command where step 2 has succeeded/committed, but step 3 is an `EXTERNAL_MUTATION` currently `PAUSED_AT_GATE` awaiting user consent. Show how the visual model represents the committed state of step 2 separately from the gated state of step 3.

For the visual/editable example, include at least one direct-manipulation mutation (for example changing a target entity, removing a step, or editing an edge) and trace the deterministic write-back to canonical semantics.

For every example distinguish **observed current behavior** from **proposed future behavior**.

## Completion test

Stop when:
- all required starting contexts have been inspected or explicitly marked unavailable;
- command/interpreter architecture is traced end-to-end;
- self-knowledge architecture is traced end-to-end;
- the archived SVG design is reconciled against current Ω reality;
- identities and provenance across planes are mapped;
- contradictions are named;
- the boundary proposal is minimal and explicit;
- the implementation queue contains only justified next steps;
- the V1/V2 compatibility boundary is explicit;
- bidirectional compilation and its round-trip invariant are addressed;
- orthogonal state encoding is addressed;
- execution-time states and partial completion semantics are addressed.

## Non-goals

Do NOT:
- implement Ω law;
- widen K0;
- rewrite the destination graph;
- create a second architecture graph;
- create a universal graph database;
- replace `vivim.mind` without evidence;
- invent a second command grammar;
- rewrite `nlcl-pure` merely to make the visual concept easier;
- build the full SVG UI;
- turn this into project management;
- silently promote archived design ideas;
- make V1 depend on the full V2 visual compiler;
- introduce a visual-only semantic model that diverges from the canonical NLCL/Intent semantics.

## Handoff rule

When complete:
- commit all four outputs to the branch;
- report the final commit SHA;
- summarize the 5–10 most consequential findings;
- identify the smallest next implementation seam;
- explicitly list remaining UNKNOWN items.

The Architecture Steward will reconcile these outputs into canonical views. Your findings are evidence/research, not architecture authority.
