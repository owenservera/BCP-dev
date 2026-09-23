# BCP MISSION — FORENSICALLY MAP VIVIM, THEN MIGRATE ONE REAL CAPABILITY INTO Ω

You are working inside:

`https://github.com/owenservera/BCP-dev`

This repository contains three deliberately different things:

```text
bcp-speed/bcp/
    BCP = migration / integration / orchestration system

vivim-original-baseline/vivim-final-enhanced/
    VIVIM prototype = accumulated product behavior, provider knowledge,
    Chrome automation, schemas, parsers, capabilities, conversation system,
    discovery machinery, and implementation history

omega-baseline/omega-final/
    Ω = redesigned internal architecture / target core for the upgraded VIVIM
```

## PRIMARY OBJECTIVE

Your job is NOT to build a generic autonomous coding factory.

Your job is to determine whether BCP can actually perform the architectural migration:

```text
VIVIM prototype
    ↓
extract proven behavior + knowledge + contracts
    ↓
re-express against Ω contracts/laws
    ↓
prove the migrated behavior
    ↓
produce the foundation of FINAL VIVIM
```

The first concrete migration target is:

> **One complete, real, provider-backed `send_message → receive_response → persist_conversation` path.**

The first provider should be **ChatGPT**.

Claude and Gemini are conformance targets after the ChatGPT slice.

DO NOT begin by inventing a new migration ontology, provider system, browser abstraction, or replacement database model.

VIVIM already contains substantial machinery for these things. Your job is to understand it and determine what Ω should absorb, what should remain as an adapter, and what should be discarded.

---

# OPERATING RULES

## Rule 1 — CODE IS TRUTH

Treat the actual repository implementation as authoritative.

Use:

1. executable code
2. Prisma schema
3. storage contracts
4. tests / fixtures
5. runtime wiring
6. generated protocol data
7. manifests / seeds
8. architecture documents

in that order when they disagree.

Do NOT infer architecture from filenames alone.

---

## Rule 2 — DO NOT PORT THE MONOLITH

The VIVIM prototype is a mine, not a template.

Do NOT:

- copy the old engine tree wholesale into Ω
- reproduce all 196-ish Prisma concepts in Ω
- port provider classes just because they exist
- create compatibility abstractions for every legacy subsystem
- preserve accidental architecture merely because it is implemented
- make Ω dependent on the VIVIM monolith

Instead:

```text
old implementation
      ↓
behavior
      +
semantic contract
      +
evidence
      +
proven implementation detail
      ↓
Ω representation
```

---

## Rule 3 — PREFER EXISTING VIVIM LANGUAGE

The prototype already has important concepts such as:

- ProviderDefinition
- ProviderEndpoint
- ProviderParser
- ProviderStreamConfig
- ProviderAccount
- ProviderSession
- Conversation
- ConversationMessage
- StreamBlock
- CapabilityTaxonomy
- CapabilityBinding
- CapabilityProgram
- SelectorStrategy
- Outcome
- ProviderCapabilityTaxonomy
- CapabilityShape
- ProviderOnboardingSession
- Provider discovery
- provider protocol generation
- recipe / harness execution
- ChromeGovernor
- FleetSupervisor
- CDPProxy
- CDPTransport
- provider selectors
- parser fallback
- capability snapshots
- trace / fleet / health telemetry

Do not invent new names for concepts that already have a coherent existing semantic meaning unless you can prove the old meaning is wrong for Ω.

---

# PHASE 0 — REPOSITORY FORENSICS BEFORE EDITING

Before modifying code, inspect all of the following deeply.

## VIVIM browser authority

Read:

```text
vivim-original-baseline/vivim-final-enhanced/src/engines/chrome-governor.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/chrome/cdp-proxy.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/chrome/types.ts
vivim-original-baseline/vivim-final-enhanced/src/executor/fleet-supervisor.ts
vivim-original-baseline/vivim-final-enhanced/src/executor/cdp-transport.ts
vivim-original-baseline/vivim-final-enhanced/src/executor/cdp.ts
vivim-original-baseline/vivim-final-enhanced/src/executor/slave-read.ts
```

Determine exactly:

- what owns Chrome lifecycle
- what owns the browser process
- what owns profile allocation
- what maps `(provider, account)` → profile
- what maps slave → port → CDP
- what persists versus what is runtime-only
- what the Governor really guarantees
- where raw CDP can still escape the Governor boundary
- how mutexes work
- how circuit breakers work
- how health checks work
- how reconnect works
- how authentication recovery works
- how provider/account resolution chooses a slave
- how a capability gets from semantic invocation to CDP
- which parts are actually production paths versus compatibility paths

Important architectural invariant to verify in code:

```text
engine
  ↓
ChromeGovernor
  ↓
CDPProxy
  ↓
CDPTransport
  ↓
Chrome
```

Call out every meaningful place where the actual code deviates from that model.

---

# PHASE 1 — PROVIDER DATA MODEL FORENSICS

Read:

```text
vivim-original-baseline/vivim-final-enhanced/prisma/schema.prisma

vivim-original-baseline/vivim-final-enhanced/src/engines/provider-registrar.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/provider-protocol-generator.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/provider-protocol-loader.ts
vivim-original-baseline/vivim-final-enhanced/src/config/provider-registry.ts
vivim-original-baseline/vivim-final-enhanced/src/storage/contracts/provider-store.ts
vivim-original-baseline/vivim-final-enhanced/src/storage/contracts/governor-store.ts
vivim-original-baseline/vivim-final-enhanced/src/storage/contracts/capability-store.ts
```

Then specifically trace these entities:

```text
ProviderDefinition
ProviderEndpoint
ProviderParser
ProviderStreamConfig
ProviderConfig
ProviderModel
ProviderAccount
ProviderSession
ProfileSession

CapabilityTaxonomy
CapabilityBinding
CapabilityProgram
SelectorStrategy
Outcome

Conversation
ConversationMessage
StreamBlock

ProviderManifestVersion
ProviderHealth
HealthTick
FleetEvent
TraceEntry
ParserExecutionLog
ProgramVersionMetric
BindingStatusLog
```

Produce a concrete relational/semantic map.

Answer:

### A. What is GLOBAL?

For example:

```text
send_message
select_model
receive_message
```

### B. What is PROVIDER-SPECIFIC?

For example:

```text
selectors
composer type
stream transport
parser
URL
recovery
model availability
```

### C. What is ACCOUNT-SPECIFIC?

For example:

```text
email
profile
authentication
Chrome slave
```

### D. What is EXECUTION-SPECIFIC?

For example:

```text
program version
selector actually used
latency
trace
result
failure
```

### E. What is USER-DATA / PRODUCT-STATE?

For example:

```text
conversation
message
stream block
attachments
```

Do not simply repeat the model names. Explain what each layer *means operationally*.

---

# PHASE 2 — PROVIDER MANIFEST / COMPILED PROTOCOL MODEL

Read:

```text
vivim-original-baseline/vivim-final-enhanced/seeds/providers/manifests.ts

vivim-original-baseline/vivim-final-enhanced/src/engines/providers/plugin.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/providers/plugin-registry.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/providers/registry.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/providers/provider-plugin-interface.ts
```

For ChatGPT, Claude, Gemini, determine which data is:

```text
declarative provider knowledge
versus
imperative provider code
```

Pay special attention to the fact that the repo contains BOTH:

- provider manifests / database-driven protocol
- concrete provider plugin classes

Determine:

1. Which path is actually used by the important runtime flow.
2. Which path is legacy / compatibility / additive.
3. Where the duplicate concepts exist.
4. What Ω should keep.
5. What should be retired.

Do not paper over contradictions.

---

# PHASE 3 — CAPABILITY PIPELINE FORENSICS

Read deeply:

```text
vivim-original-baseline/vivim-final-enhanced/src/engines/unified-registry.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/capability-taxonomy.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/capability-binder.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/capability-snapshot.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/capability-shape-registry.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/cdp-capability-registrar.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/harness/program-schema.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/harness/recipe-types.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/harness/recipe-compiler.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/harness/capability-program-registrar.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/capability-parity.ts
```

Reconstruct this exact semantic chain:

```text
natural language / UI
      ↓
intent / capability resolution
      ↓
global capability
      ↓
provider binding
      ↓
program
      ↓
recipe
      ↓
harness
      ↓
ChromeGovernor
      ↓
browser execution
```

Then determine:

- what is semantic
- what is provider adaptation
- what is execution
- what is policy
- what is evidence
- what is runtime-only
- what is persisted

---

# PHASE 4 — STREAM / RESPONSE PIPELINE FORENSICS

Read:

```text
vivim-original-baseline/vivim-final-enhanced/src/engines/stream-parser.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/stream-align.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/stream-block-store.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/streaming-protocol.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/streaming-response-analyzer.ts

vivim-original-baseline/vivim-final-enhanced/seeds/parsers/
```

Determine the actual data path:

```text
provider network stream
      ↓
capture
      ↓
wire-format recognition
      ↓
provider parser
      ↓
normalized stream blocks
      ↓
message
      ↓
conversation
```

For ChatGPT specifically, trace:

- how the network response is captured
- how streaming is detected
- which parser gets selected
- how parser fallback works
- how delta extraction works
- how completion is detected
- what becomes a `StreamBlock`
- what becomes final `ConversationMessage`
- what evidence is recorded
- what happens on malformed/partial streams

Do not assume `content: string` is the complete response model.

---

# PHASE 5 — DISCOVERY / ONBOARDING FORENSICS

Read:

```text
vivim-original-baseline/vivim-final-enhanced/src/engines/provider-discovery.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/cdp-discovery.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/protocol-discovery.ts

vivim-original-baseline/vivim-final-enhanced/src/engines/onboarding/provider-onboarding-orchestrator.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/onboarding/dom-capability-discoverer.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/onboarding/live-network-capturer.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/onboarding/protocol-sniffer.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/onboarding/parser-synthesis-engine.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/onboarding/webapp-fingerprint.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/onboarding/webapp-taxonomy-synthesizer.ts

vivim-original-baseline/vivim-final-enhanced/prisma/schema.prisma
```

Map:

```text
unknown website
    ↓
fingerprint
    ↓
shape/taxonomy
    ↓
discover capabilities
    ↓
discover protocol
    ↓
infer parser
    ↓
generate provider knowledge
    ↓
test
    ↓
promote/register
```

Determine whether this system is actually capable of generating the inputs required by:

```text
ProviderDefinition
ProviderEndpoint
ProviderStreamConfig
ProviderParser
CapabilityBinding
SelectorStrategy
CapabilityProgram
```

If not, identify the missing bridge.

---

# PHASE 6 — CONVERSATION DATA FORENSICS

Read:

```text
vivim-original-baseline/vivim-final-enhanced/src/engines/conversation-manager.ts
vivim-original-baseline/vivim-final-enhanced/src/engines/conversation-history-sync.ts
vivim-original-baseline/vivim-final-enhanced/src/storage/contracts/conversation-store.ts
vivim-original-baseline/vivim-final-enhanced/prisma/schema.prisma
```

Determine the canonical lifecycle of a real conversation turn:

```text
request
→ provider/session resolution
→ user message
→ execution
→ streaming
→ assistant message
→ block persistence
→ finalization
→ metadata / telemetry
```

Determine which identifiers are authoritative:

```text
conversationId
providerSessionId
accountId
providerMessageId
identityHash
message sequence
programId
selectorStrategyId
traceId
```

Explicitly document how deduplication and replay work.

---

# PHASE 7 — Ω FORENSICS

Now inspect:

```text
omega-baseline/omega-final/
```

Read the actual implementation and not only its documentation.

Identify:

- execution boundary
- plugin boundary
- recipe model
- capability/law model
- evidence/provenance model
- intent resolution
- host authority
- isolation model
- worker model
- consent model
- state model
- storage model
- runtime composition model

Determine exactly where the VIVIM capability pipeline can land.

Do NOT assume Ω's conceptual design automatically has runtime equivalents.

Mark each desired integration point as:

```text
EXISTS
PARTIAL
MISSING
CONFLICTING
```

---

# PHASE 8 — BUILD THE ACTUAL MIGRATION MATRIX

Create a concrete matrix with these columns:

| VIVIM Concept | VIVIM Source | Semantic Meaning | Ω Destination | Transformation | Evidence Needed | Status |
|---|---|---|---|---|---|---|

Populate it for at minimum:

```text
ProviderDefinition
ProviderEndpoint
ProviderAccount
ProviderParser
ProviderStreamConfig

CapabilityTaxonomy
CapabilityBinding
CapabilityProgram
SelectorStrategy
Outcome

Conversation
ConversationMessage
StreamBlock

ChromeGovernor
FleetSupervisor
CDPProxy
CDPTransport
Recipe
Harness
```

Then create a second matrix:

| VIVIM Runtime Behavior | Current Implementation | Required Ω Contract | Adapter Needed? | Migration Risk |
|---|---|---|---|---|

---

# PHASE 9 — DEFINE THE FIRST REAL MIGRATION SLICE

Before changing code, define exactly what “ChatGPT send_message works in Ω” means.

The minimum target is:

```text
1. existing authenticated ChatGPT profile
2. existing Chrome process / slave
3. Ω can invoke semantic `send_message`
4. provider binding selects ChatGPT
5. execution resolves a provider program
6. program resolves to browser actions
7. browser actions pass through the correct authority boundary
8. ChatGPT actually receives the text
9. response stream is captured
10. provider parser produces normalized blocks
11. final assistant message is created
12. conversation is persisted
13. execution evidence is recorded
14. failure is visible and deterministic
```

This is the first **real vertical slice**.

A mock-only implementation does not count.

A fixture-only implementation does not count.

A “compile succeeds” implementation does not count.

---

# PHASE 10 — IMPLEMENT THROUGH THE SMALLEST CLEAN SEAM

Only after the forensic work is complete, implement the minimum code needed to make the real ChatGPT slice possible.

Preferred pattern:

```text
VIVIM knowledge
      ↓
migration / adapter seam
      ↓
Ω semantic capability
      ↓
Ω execution law
      ↓
browser adapter / authority
      ↓
real Chrome
```

Do not invert this into:

```text
Ω imports VIVIM
```

The legacy code must not become Ω's permanent architectural dependency.

Prefer:

```text
shared contract
or
serialized knowledge
or
one-way adapter
```

over importing the old monolith into Ω.

---

# PHASE 11 — EVIDENCE MODEL

For every migrated artifact, record:

```text
source
source hash/version
semantic identifier
provider
target Ω identifier
transformation
implementation
test
runtime proof
timestamp
status
```

The evidence must distinguish:

```text
STATIC PROOF
    source inspection / typecheck / unit test

INTEGRATION PROOF
    cross-boundary execution

LIVE PROOF
    actual Chrome + actual provider + actual response

REGRESSION PROOF
    repeat execution after restart / mutation / failure
```

Do not treat static fixture tests as live proof.

Do not treat builder-generated claims as independent proof.

---

# PHASE 12 — CHATGPT REAL-WORLD CONFORMANCE TEST

Use ChatGPT as the first actual provider.

The target path must be:

```text
ChatGPT
  ↓
ProviderAccount
  ↓
profile
  ↓
Chrome slave
  ↓
ProviderEndpoint
  ↓
send_message capability
  ↓
CapabilityBinding
  ↓
CapabilityProgram
  ↓
Recipe
  ↓
browser execution
  ↓
network stream
  ↓
parser
  ↓
ConversationMessage
  ↓
StreamBlock(s)
  ↓
Outcome / evidence
```

The test should exercise the real browser.

Use the existing authenticated Chrome profile infrastructure.

Do not create a fake browser abstraction merely to make the test pass.

---

# PHASE 13 — SECONDARY CONFORMANCE CASES

Only after ChatGPT works, test the abstraction against:

## Claude

Expected differences include:

```text
composer implementation
contenteditable / ProseMirror
selector strategy
stream format
parser
recovery
```

## Gemini

Expected differences include:

```text
Quill composer
button-based submission
Google-specific stream transport
parser
completion detection
```

The goal is not feature parity yet.

The goal is proving that:

```text
same semantic capability
+
different provider realization
```

works without contaminating Ω's core.

---

# PHASE 14 — IDENTIFY DUPLICATE ARCHITECTURES

Explicitly identify and classify duplicated concepts such as:

```text
old ProviderPlugin interface
new ProviderPlugin interface

old provider registry
new provider plugin registry
generated protocol registry
```

Also identify any duplicated:

```text
capability registries
execution models
selector models
browser execution models
state stores
conversation models
```

For each duplicate, classify:

```text
KEEP
MERGE
ADAPTER
RETIRE
UNKNOWN
```

Do not silently choose.

---

# PHASE 15 — IMPORTANT GOVERNOR QUESTIONS

Answer these from code, not theory:

### Q1
Is `ChromeGovernor` actually the sole browser I/O authority?

### Q2
Can any engine currently reach CDP transport directly?

### Q3
Does `CDPProxy` itself bypass higher-level Governor rules in any material way?

### Q4
Are `Runtime.evaluate`, `Input.*`, navigation, network capture, and harness actions equally governed?

### Q5
Is provider/account → slave resolution deterministic?

### Q6
Does the same provider/account always resolve to the intended Chrome profile?

### Q7
What is durable if the process dies?

### Q8
What is lost if the process dies?

### Q9
Can a response be reconstructed from persisted data?

### Q10
Can a browser execution be independently replayed?

These answers become part of the Ω contract.

---

# PHASE 16 — IMPORTANT DATA QUESTIONS

Answer:

### Q1
What is the canonical representation of:

```text
provider
account
session
conversation
message
stream block
capability
binding
program
selector
outcome
```

### Q2
Which of these are product data?

### Q3
Which are runtime state?

### Q4
Which are executable specifications?

### Q5
Which are telemetry?

### Q6
Which are historical evidence?

### Q7
Which should exist in Ω at all?

This is critical.

Do not migrate database tables merely because they exist.

Migrate semantics.

---

# PHASE 17 — REQUIRED DELIVERABLES

Create these artifacts in the repository:

```text
docs/migration/
    VIVIM_FORENSIC_MODEL.md
    VIVIM_TO_OMEGA_MAPPING.md
    CHROME_GOVERNOR_CONTRACT.md
    PROVIDER_DATA_MODEL.md
    FIRST_VERTICAL_SLICE.md
    MIGRATION_RISK_REGISTER.md
```

## `VIVIM_FORENSIC_MODEL.md`

Must contain:

- actual runtime architecture
- actual data architecture
- actual provider architecture
- actual execution path
- actual stream path
- actual conversation lifecycle
- actual discovery/onboarding lifecycle

---

## `VIVIM_TO_OMEGA_MAPPING.md`

Must contain:

- concept mapping
- adapter boundaries
- retirement candidates
- target Ω contracts
- unresolved contradictions

---

## `CHROME_GOVERNOR_CONTRACT.md`

Must define:

```text
authority
lifecycle
profile identity
slave identity
CDP session identity
execution serialization
health
reconnect
recovery
trace
evidence
```

and explicitly mark any invariant that is only documentary today.

---

## `PROVIDER_DATA_MODEL.md`

Must explain:

```text
global semantic layer
provider realization layer
account layer
execution layer
stream layer
conversation layer
evidence layer
```

Use concrete examples from ChatGPT.

---

## `FIRST_VERTICAL_SLICE.md`

Must contain:

- exact execution path
- exact files touched
- exact contracts introduced/reused
- exact live test procedure
- exact evidence generated
- known limitations
- next two conformance steps

---

## `MIGRATION_RISK_REGISTER.md`

Include at minimum:

```text
legacy dependency leakage
duplicate provider registries
duplicate plugin interfaces
Governor boundary leakage
runtime-vs-persistence confusion
parser migration
selector migration
conversation semantic drift
stream block loss
identity/dedup drift
auth/profile drift
insufficient live proof
```

Each risk needs:

```text
severity
evidence
current mitigation
migration consequence
next action
```

---

# PHASE 18 — TESTING REQUIREMENTS

At minimum:

```text
existing VIVIM tests relevant to the touched paths
Ω tests relevant to the touched paths
new adapter/integration tests
ChatGPT live test
```

Where possible, include:

```text
replay
failure injection
duplicate request
Chrome restart
CDP disconnect
selector miss
parser fallback
partial stream
provider timeout
```

Do not over-build resilience before the first vertical slice works.

---

# PHASE 19 — BCP INTEGRATION

After the first slice works, identify precisely what BCP now needs to automate.

BCP should be able to represent work such as:

```text
ASSAY:
    inspect legacy capability

CLASSIFY:
    semantic / provider / runtime / obsolete

MAP:
    source concept → Ω contract

BUILD:
    implement adapter / Ω realization

TEST:
    static proof

LIVE VERIFY:
    real provider/browser proof

PROMOTE:
    accepted implementation

RECORD:
    migration genealogy + evidence
```

The goal is for BCP to eventually automate this process across the VIVIM capability surface.

Do not prematurely automate the wrong abstraction.

---

# PHASE 20 — FINAL DECISION REPORT

At the end, produce a concise but technically serious report answering:

## 1. Is VIVIM's existing Provider/Capability/Chrome architecture coherent enough to migrate into Ω?

## 2. Which parts are genuinely reusable knowledge rather than legacy implementation?

## 3. Is ChromeGovernor the correct long-term browser authority for Ω, or does it need to be transformed?

## 4. Is the existing ProviderDefinition → CapabilityBinding → CapabilityProgram model good enough to become Ω's provider realization model?

## 5. What should happen to the existing Prisma schema?

Possible conclusions:

```text
preserve
partition
translate
compress
retire
```

Do not assume one answer for the whole schema.

## 6. What is the minimum new machinery required in Ω?

## 7. What does BCP itself still lack to perform this migration repeatedly?

## 8. What is the exact next migration after ChatGPT?

---

# STOP CONDITIONS

STOP and report before implementing if you discover:

- Ω has no suitable execution seam
- the Governor boundary cannot be preserved
- the provider model has an unresolved semantic contradiction
- the stream model loses information required by VIVIM
- the ChatGPT path cannot be proven live
- migration would require importing the VIVIM monolith into Ω

Do not hide these problems by introducing compatibility hacks.

---

# ENGINEERING STYLE

Favor:

```text
small seams
explicit contracts
one-way dependencies
typed data
deterministic execution
persisted evidence
minimal new abstractions
```

Avoid:

```text
massive refactors
framework additions
generic “migration engines”
new orchestration layers
duplicated registries
duplicate schemas
temporary compatibility code with no deletion path
```

The agent should leave the codebase **more intelligible than it found it**.

---

# SUCCESS CONDITION

Success is NOT:

```text
all code compiles
```

Success is:

```text
We can explain exactly how VIVIM works.
We can explain exactly how Ω wants to work.
We can prove where the semantic boundary belongs.
We can migrate one real capability across that boundary.
ChatGPT can execute a real turn.
The response can be parsed and persisted.
The execution is evidenced.
The old monolith is not imported into Ω.
The same model can then be applied to Claude and Gemini.
BCP has a concrete, repeatable migration workflow to scale this process.
```

The final output should therefore contain both:

1. **forensic architectural truth**
2. **one working, live, evidenced migration slice**

Do not give me a speculative architecture essay without implementation evidence.

Do not give me an implementation without the forensic model.

Do both, in that order.
