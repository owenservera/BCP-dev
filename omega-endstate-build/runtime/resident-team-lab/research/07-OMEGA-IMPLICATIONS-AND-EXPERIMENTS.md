# Ω Research → Design Implications

> This document turns external research into hypotheses for the resident-team lab. None of these are Ω law.

## A. Immediate U1 implications

### A1 — Worker demand should remain resident-owned

ClawTeam demonstrates agent-native spawn and OMC demonstrates dynamic task decomposition. citeturn884303view4turn591787view3

**U1 implication:** the test must allow the resident to choose whether capacity is needed, while the runtime only enforces policy/resource bounds.

### A2 — Worker result acceptance should be tested as a separate state

OMC makes completed -> accepted a real quality boundary. citeturn918030view1

**U1/U2 implication:** after native Task works, introduce a result receipt that distinguishes execution completion from verified acceptance.

### A3 — Physical worker isolation is not optional long-term

ClawTeam's use of dedicated worktrees/execution surfaces supports physical rather than purely prompt-based separation. citeturn952603view3

**U1 implication:** the worker profile must not have an alternate agent-control path through shell/MCP.

## B. Next-stage resident runtime implications

### B1 — Local context should remain local

Meta-Team's central finding is that collaborative attribution preserves local context while connecting it through cross-agent evidence. citeturn591787view0

**Design hypothesis:** each resident should retain its own state/lessons/context and expose compact evidence references, not dump its entire history into a central prompt.

### B2 — Presence is a runtime fact, identity is a durable fact

OMC's Talent/Container split gives a useful external analogue. citeturn591787view2

**Design hypothesis:** one resident identity may survive multiple runtime sessions/containers, while liveness remains an observed runtime property.

### B3 — Coordination history should become an asset

Swarm Skills treats coordination protocols as portable assets with evolution records. citeturn952603view1

**Design hypothesis:** recurring successful coordination patterns should eventually be represented as versioned coordination assets rather than copied prompts.

## C. Forge/self-evolution implications

### C1 — Keep the live team stable while candidates evolve elsewhere

SwarmAgentic demonstrates iterative candidate generation/evaluation; Swarm Skills demonstrates PATCH/REBUILD/ROLLBACK for evolution artifacts. citeturn884303view3turn918030view3

**Design hypothesis:** Ω Forge should host candidate team configurations and evolution experiments. The live resident team consumes only promoted versions.

### C2 — Classify the smallest evolution scope first

Meta-Team's three levels provide a strong decomposition: agent, interaction, team. citeturn591787view0

**Design hypothesis:** an observed failure should first be classified as local, relational, coordination, composition, or constitutional before a broad change is proposed.

### C3 — Preserve rollback lineage

Swarm Skills explicitly includes REBUILD and ROLLBACK. citeturn918030view3

**Design hypothesis:** every promoted evolution must identify its parent version, evidence, evaluator, and rollback target.

## D. New Ω research hypotheses

### H1 — A resident can learn better by querying peers than by reading all history

Derived from Meta-Team's collaborative attribution result.

Experiment later: compare peer-supported diagnosis with centralized full-context diagnosis at increasing trace sizes.

### H2 — A coordination protocol can be treated as a governed plugin-like asset

Derived from Swarm Skills portability model.

Experiment later: represent one recurring Ω workflow as a versioned coordination asset and run it through two different execution surfaces.

### H3 — Team reorganization should be treated as a candidate, not a live mutation

Derived from SwarmAgentic's candidate-population optimization model plus Ω authority requirements.

Experiment later: generate two alternative resident compositions in Forge, evaluate them on held-out work, and produce a promotion candidate without mutating the active team.

### H4 — Operational resource recycling should be decoupled from semantic ownership

Derived from ClawTeam worker recycling and OMC Talent/Container separation.

Experiment later: kill/recreate worker runtimes while preserving the same parent work/evidence lineage.

## Research-to-architecture boundary

Keep these in the live resident runtime:

- identity binding;
- authorization;
- execution admission;
- lineage;
- evidence capture;
- minimal coordination primitives.

Keep these primarily in Forge/research:

- team search;
- prompt optimization;
- topology optimization;
- evolution-record curation;
- candidate comparison;
- held-out evaluation;
- organization redesign.

The distinction prevents self-evolution machinery from becoming an unbounded production scheduler.