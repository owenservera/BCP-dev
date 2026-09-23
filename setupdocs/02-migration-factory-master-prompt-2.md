# BCP → VIVIM Ω
# MASTER PROMPT 2 — TURN THE FIRST MIGRATION INTO A MIGRATION FACTORY

## CONTEXT

You have already completed the first end-to-end VIVIM → Ω migration.

That means there is now at least one real example of:

```text
VIVIM
→ discovery
→ assay
→ behavioral specification
→ canonicality decision
→ Ω mapping
→ Ω contract
→ implementation
→ independent verification
→ evidence
→ integration
```

This completed migration is now our **reference implementation for the migration process itself**.

Your job is NOT simply to migrate the next feature.

Your job is to determine:

> **What had to happen manually or implicitly during the first migration, and how can BCP turn those steps into explicit, repeatable, evidence-producing capabilities?**

The objective is to transform BCP from:

```text
a system capable of performing one migration
```

into:

```text
a system capable of discovering, planning, executing,
verifying, recording, and continuously progressing
many migrations.
```

---

# 1. DO NOT RESTART FROM SCRATCH

Do NOT redesign BCP merely because the first migration exposed imperfections.

Do NOT throw away the first migration.

Do NOT create a generic framework detached from the actual repositories.

Treat the first migration as empirical evidence about the real problem.

The correct strategy is:

```text
FIRST MIGRATION
      ↓
observe what actually happened
      ↓
identify repeated patterns
      ↓
identify missing abstractions
      ↓
encode only proven abstractions
      ↓
run the next migration
      ↓
compare
      ↓
refine
```

---

# 2. USE THE FULL REPOSITORY AS CONTEXT

You have a very large context window.

Use it.

Inspect enough of all three systems to build a coherent model rather than reasoning from isolated files.

The relevant systems remain:

```text
vivim-original-baseline/vivim-final-enhanced/
omega-baseline/omega-final/
bcp-speed/bcp/
```

Also inspect:

- the artifacts produced by Migration #1
- its verification results
- its evidence
- its implementation
- its tests
- BCP state/event history
- any decisions recorded during the migration
- any agent/session transcripts that materially explain how the migration was performed

The completed migration is particularly important because it gives you **ground truth about the process**, not merely architectural theory.

---

# 3. FIRST TASK — RECONSTRUCT MIGRATION #1

Before changing BCP, reconstruct the migration as an actual process.

Produce an explicit process trace:

```text
DISCOVER
  ↓
ASSAY
  ↓
BEHAVIOR MODEL
  ↓
CLASSIFICATION
  ↓
Ω MAPPING
  ↓
CONTRACT
  ↓
IMPLEMENTATION
  ↓
TEST
  ↓
INDEPENDENT VERIFICATION
  ↓
EVIDENCE
  ↓
INTEGRATION
```

For every stage identify:

```text
INPUT
OUTPUT
ACTOR
TOOLS USED
DATA CREATED
DECISIONS MADE
EVIDENCE CREATED
AUTOMATION AVAILABLE
MANUAL WORK REQUIRED
AMBIGUITIES
FAILURES
```

Do not summarize this vaguely.

Reconstruct what actually happened.

---

# 4. SEPARATE FOUR DIFFERENT KINDS OF WORK

For every step of Migration #1 determine whether it was:

### A. DETERMINISTIC

The system can perform it mechanically.

Examples:

```text
locate files
hash artifacts
validate schema
check dependencies
run tests
record events
verify signatures
compare structured outputs
```

### B. AGENT REASONING

The agent must inspect evidence and make a contextual judgment.

Examples:

```text
identify likely behavior
interpret legacy semantics
choose canonicality
propose Ω representation
identify hidden dependencies
```

### C. HUMAN DECISION

The system should not autonomously decide.

Examples may include:

```text
product intent
whether a behavior is intentionally obsolete
whether a semantic change is acceptable
architectural policy
```

### D. EVIDENCE

The result must be recorded so another actor can independently understand what happened.

Do not collapse these categories.

This distinction is fundamental.

---

# 5. BUILD THE MIGRATION MACHINE MODEL

From Migration #1 derive the smallest reusable state machine.

The migration lifecycle should become an explicit BCP concept.

For example, the system may eventually represent states such as:

```text
DISCOVERED
ASSAYING
ASSESSED
SPECIFIED
MAPPED
READY_TO_IMPLEMENT
IMPLEMENTING
IMPLEMENTED
VERIFYING
VERIFIED
INTEGRATED
BLOCKED
UNRESOLVED
REJECTED
DISCARDED
```

Do not assume these exact names must be used.

Derive the actual states from the migration.

Each state must have:

```text
entry conditions
exit conditions
required artifacts
allowed transitions
failure handling
evidence requirements
```

Transitions should become mechanically enforceable where appropriate.

---

# 6. CREATE A REAL MIGRATION OBJECT

Determine the minimum persistent representation BCP needs for an individual migration.

Conceptually:

```text
Migration
├── identity
├── source capability
├── source locations
├── observations
├── behavioral specification
├── invariants
├── canonicality
├── Ω target
├── transformation
├── dependencies
├── implementation
├── verification plan
├── verification result
├── evidence
├── disposition
└── provenance
```

Do not duplicate information unnecessarily.

Reuse existing BCP concepts for:

- capabilities
- dependencies
- leases
- experiments
- events
- discoveries
- evidence

Add new structures only where the migration domain actually requires them.

---

# 7. CREATE THE LEGACY ASSAY PIPELINE

The agent should be able to initiate an assay against a VIVIM capability.

The assay should progressively answer:

```text
What is this?

Where is it?

What invokes it?

What does it consume?

What does it produce?

What state does it change?

What does the user observe?

What dependencies does it have?

What tests already describe it?

What assumptions does it contain?

What is proven?

What is inferred?

What is unknown?
```

The assay should produce persistent artifacts.

Do not make the knowledge exist only inside an agent transcript.

---

# 8. CREATE THE BEHAVIOR MODEL

A legacy implementation should be transformable into a representation independent of source code.

The behavior model should capture:

```text
inputs
outputs
state transitions
side effects
errors
constraints
invariants
observable behavior
dependencies
environment assumptions
```

Where possible distinguish:

```text
OBSERVED
DOCUMENTED
INFERRED
ASSUMED
UNKNOWN
```

The system must never silently promote:

```text
INFERRED → PROVEN
```

or:

```text
ASSUMED → FACT
```

---

# 9. CREATE THE CANONICALITY/DISPOSITION PIPELINE

A capability must eventually receive a disposition such as:

```text
PRESERVE
TRANSFORM
REIMPLEMENT
REPLACE
DEPRECATE
DISCARD
UNRESOLVED
```

The important requirement is not the labels.

The important requirement is that:

> **The disappearance or transformation of legacy behavior becomes explicit and traceable.**

The system must be able to answer:

```text
Why was this preserved?
Why was this transformed?
Why was this discarded?
Who/what decided?
What evidence supported the decision?
```

---

# 10. CREATE THE Ω MAPPING PIPELINE

This should become a first-class BCP operation.

The desired transformation is:

```text
LEGACY IMPLEMENTATION
        ↓
LEGACY BEHAVIOR
        ↓
SEMANTIC REQUIREMENT
        ↓
Ω CAPABILITY
        ↓
Ω CONTRACT
        ↓
Ω IMPLEMENTATION PLAN
```

Do NOT create mappings based simply on filename similarity, class similarity, or directory structure.

The mapping must be semantic.

For each mapping capture:

```text
source behavior
required invariant
Ω target
architectural transformation
new dependencies
removed dependencies
preserved semantics
changed semantics
unresolved semantics
```

---

# 11. MAKE Ω THE TARGET LANGUAGE

Treat Ω as the target architecture.

The migration process must understand enough of Ω to determine:

```text
where a behavior belongs
what authority it requires
what capability boundary applies
what protocol applies
what evidence must exist
what isolation applies
what verification is required
```

Do not allow legacy architecture to dictate Ω architecture.

The translation direction is:

```text
VIVIM → Ω
```

not:

```text
Ω → whatever legacy already had
```

---

# 12. GENERATE IMPLEMENTATION WORK

Once an Ω mapping is accepted, BCP should be able to generate a structured implementation task.

The task should include:

```text
source behavior
semantic requirements
Ω contract
dependencies
constraints
invariants
required evidence
verification plan
```

An implementing agent should not need to rediscover the entire legacy system.

It should receive the **distilled semantic problem**.

---

# 13. BUILD VERIFICATION INTO THE MIGRATION

Do not treat verification as a final checkbox.

Generate verification requirements at the moment the migration contract is created.

For example:

```text
Migration
   ↓
Behavioral invariants
   ↓
Verification cases
   ↓
Implementation
   ↓
Independent execution
   ↓
Evidence
```

The verification system should distinguish:

```text
PROVEN
SEMANTICALLY EQUIVALENT
INTENTIONALLY TRANSFORMED
INTENTIONALLY REMOVED
UNVERIFIED
UNKNOWN
```

Do not force uncertain results into pass/fail.

---

# 14. CREATE A REUSABLE EVIDENCE PACKAGE

Every completed migration should produce a durable evidence package.

Conceptually:

```text
migration/
├── source-assay
├── behavior-spec
├── canonicality-decision
├── omega-mapping
├── implementation-plan
├── implementation
├── tests
├── independent-verification
├── evidence
└── final-disposition
```

The exact storage mechanism should follow the existing BCP architecture.

The important property is:

> **Another agent should be able to inspect the migration later without reconstructing the original conversation.**

---

# 15. TURN DISCOVERIES INTO BCP KNOWLEDGE

Migration agents will repeatedly learn things about the VIVIM prototype.

Examples:

```text
provider X requires behavior Y

subsystem A indirectly depends on subsystem B

legacy component C is obsolete

Ω capability D already subsumes E

behavior F appears in three unrelated implementations
```

These discoveries should not disappear.

They should become durable BCP knowledge with provenance.

Over time this creates:

```text
VIVIM KNOWLEDGE GRAPH
```

which improves future migrations.

---

# 16. BUILD THE MIGRATION GRAPH

The eventual system should be able to construct a graph resembling:

```text
                 VIVIM
                   │
             legacy capability
                   │
                 assay
                   │
             behavior model
                   │
            semantic invariant
                   │
             canonicality
                   │
              Ω mapping
                   │
             Ω capability
                   │
             dependencies
                   │
              implementation
                   │
               verify
                   │
               evidence
                   │
              integrated
```

At fleet scale, BCP should eventually be able to answer:

```text
What remains unmigrated?

What is blocked?

What is unresolved?

What depends on what?

Which capabilities have already been replaced?

Which legacy components are now orphaned?

Which Ω capabilities are missing?

Which migrations have weak evidence?

Where are semantic conflicts?

Where is there duplicated behavior?
```

---

# 17. CREATE MIGRATION READINESS

Not every piece of the prototype should be immediately migrated.

Define a deterministic readiness assessment where possible.

Potential dimensions:

```text
observable behavior
test availability
dependency completeness
assay completeness
semantic confidence
Ω target availability
contract completeness
verification availability
integration readiness
```

Do not invent an arbitrary numerical score unless the system actually benefits from one.

The important output is actionable state:

```text
READY
NOT_READY
BLOCKED
UNRESOLVED
```

with reasons.

---

# 18. AUTONOMOUS MIGRATION LOOP

After the infrastructure exists, BCP should be capable of:

```text
discover capability
      ↓
assay
      ↓
classify
      ↓
create migration
      ↓
resolve dependencies
      ↓
generate implementation task
      ↓
agent claims task
      ↓
implement
      ↓
independent verification
      ↓
publish evidence
      ↓
integrate
      ↓
record disposition
      ↓
discover next migration
```

This should connect to BCP's existing lease and agent-loop machinery.

Do NOT build a second scheduler.

Reuse what already exists.

---

# 19. IMPORTANT — DO NOT MAKE THE AGENT THE ARCHITECTURAL AUTHORITY

Agent reasoning is valuable.

It is not automatically authoritative.

Keep the boundary:

```text
LLM
 ↓
proposal / inference
 ↓
deterministic validation
 ↓
policy / authority
 ↓
execution
 ↓
evidence
```

This is particularly important when migration reasoning can affect Ω architecture.

---

# 20. SELF-IMPROVING MIGRATION PROCESS

After each migration, BCP should be able to record process friction.

For example:

```text
STEP X required manual investigation
STEP Y lacked a deterministic tool
STEP Z repeatedly caused ambiguity
VERIFICATION Q was difficult to reproduce
MAPPING R appeared repeatedly
```

Then classify each friction point:

```text
one-off
reusable tooling opportunity
new ontology concept
new deterministic validator
new agent capability
new Ω abstraction
human decision required
```

Only promote a pattern into infrastructure when repeated evidence justifies it.

---

# 21. SECOND MIGRATION — VALIDATION EXPERIMENT

After building the generalized machinery, perform a second migration.

Do not choose something structurally identical to Migration #1.

Choose a capability that tests a different part of the migration system.

The second migration should answer:

> **Did we build a genuine migration mechanism, or merely encode the first example?**

Compare:

```text
Migration #1
vs
Migration #2
```

Measure qualitatively and, where useful, quantitatively:

```text
manual intervention
agent reasoning required
deterministic work
number of unknowns
verification complexity
new infrastructure required
reusable artifacts
time/step reduction
failure modes
```

The goal is generalization, not benchmark theater.

---

# 22. ONLY THEN BUILD THE LARGE MIGRATION BACKLOG

Once two materially different migrations have worked, begin systematic discovery across the prototype.

Build the migration inventory:

```text
VIVIM CAPABILITY
        ↓
ASSAY STATUS
        ↓
CANONICALITY
        ↓
Ω TARGET
        ↓
DEPENDENCIES
        ↓
READINESS
        ↓
MIGRATION STATUS
        ↓
VERIFICATION STATUS
```

This becomes the actual migration program.

---

# 23. FINAL SYSTEM BEHAVIOR

The desired mature state is:

```text
BCP opens the prototype
        ↓
continuously discovers capabilities
        ↓
assays them
        ↓
builds behavioral knowledge
        ↓
identifies canonical behavior
        ↓
maps behavior into Ω
        ↓
creates migration work
        ↓
agents implement
        ↓
independent verification runs
        ↓
evidence is recorded
        ↓
accepted work is integrated
        ↓
the graph updates
        ↓
new work becomes available
        ↓
the system repeats
```

The system should progressively transform:

```text
VIVIM PROTOTYPE
```

into:

```text
VIVIM Ω
```

without requiring the entire old architecture to be carried forward.

---

# 24. WHAT YOU MUST NOT DO

Do NOT:

- rewrite BCP wholesale
- rewrite Ω merely to accommodate legacy code
- blindly port VIVIM files
- migrate everything at once
- treat tests as semantic proof
- let an implementing agent self-certify
- turn every LLM inference into persistent truth
- create a giant generic abstraction layer prematurely
- introduce another orchestration engine
- delete legacy functionality merely because it looks old
- preserve legacy functionality merely because it exists
- hide uncertainty
- hide migration failures
- make architectural changes without repository evidence

---

# 25. REQUIRED OUTPUT

At the end of this phase, produce:

## A. Migration Factory Architecture

A concrete architecture for the reusable migration machinery.

## B. Migration Ontology

The persistent concepts/entities required.

## C. Migration State Machine

Explicit states and transitions.

## D. Assay Pipeline

How BCP turns legacy implementation into behavioral knowledge.

## E. Ω Translation Pipeline

How semantic behavior becomes Ω-native capability contracts.

## F. Verification Pipeline

How semantic preservation is independently established.

## G. Migration Graph

How all known legacy capabilities relate to their Ω destinations.

## H. Second Migration

A genuinely different capability migrated using the generalized machinery.

## I. Remaining Gaps

Anything still requiring human decision, missing tooling, unresolved semantics, or architectural work.

---

# 26. SUCCESS CRITERION

Success is NOT:

> “BCP has more code.”

Success is:

> **A second materially different VIVIM capability can move through the migration lifecycle using reusable BCP machinery, while producing durable behavioral specifications, Ω mappings, independent verification, and evidence.**

At that point BCP has crossed an important boundary:

```text
                    BEFORE

       BCP
        │
   orchestrates agents


                    AFTER

       BCP
        │
        ├── understands migration state
        ├── assays legacy behavior
        ├── preserves semantic knowledge
        ├── maps behavior into Ω
        ├── creates implementation work
        ├── coordinates agents
        ├── independently verifies results
        ├── records evidence
        └── continuously advances migration
```

That is the beginning of the actual **VIVIM reconstruction machine**.

---

# 27. OPERATING COMMAND

Proceed in this order:

```text
1. RECONSTRUCT MIGRATION #1
2. IDENTIFY WHAT WAS MANUAL
3. IDENTIFY REPEATED PATTERNS
4. FORMALIZE THE MIGRATION MODEL
5. IMPLEMENT THE MINIMUM REUSABLE MACHINERY
6. RUN MIGRATION #2
7. COMPARE AGAINST MIGRATION #1
8. FIX GENERALIZATION FAILURES
9. BUILD THE MIGRATION GRAPH
10. ONLY THEN SCALE THE MIGRATION PROGRAM
```

Do not skip directly to step 10.

The first two migrations are the experimental foundation for everything that follows.

---

# FINAL DIRECTIVE

You are no longer merely building software.

You are building the **machine that can understand an existing software system, extract its valuable behavior, transform that behavior into a new architecture, and produce evidence that the transformation was correct.**

BCP is the control plane for that process.

VIVIM is the source of accumulated knowledge.

Ω is the target architectural language.

The objective is:

```text
        KNOW WHAT VIVIM KNOWS
                 ↓
        KNOW WHAT VIVIM DOES
                 ↓
        KNOW WHAT SHOULD SURVIVE
                 ↓
        KNOW HOW Ω REPRESENTS IT
                 ↓
        BUILD IT
                 ↓
        PROVE IT
                 ↓
        RECORD IT
                 ↓
        MOVE TO THE NEXT ONE
```

Do that repeatedly until the distinction between:

```text
"legacy VIVIM"
```

and:

```text
"VIVIM Ω"
```

becomes progressively smaller because the behavior, knowledge, and capability inventory have been transferred deliberately and with evidence.

**Do not optimize for finishing quickly. Optimize for creating a migration process that remains trustworthy when the number of migrations becomes hundreds or thousands.**
