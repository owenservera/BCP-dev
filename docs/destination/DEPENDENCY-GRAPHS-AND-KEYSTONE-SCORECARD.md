# VIVIM Destination — Dependency Graphs & Keystone Scorecard

> Classification: DERIVED — CURRENT PROGRAM MODEL
> Purpose: make destination dependencies visible as a graph, identify the 5–10 highest-leverage foundations, and track implementation distance to the full vision.
> Rule: scores are management instruments, not claims of exact engineering effort.

## 1. The three views

A destination feature has three different questions.

### Maturity

**How far is it actually implemented?**

### Dependency centrality

**How much of the destination depends on it?**

### Complexity

**How difficult is it to move it from its current state to destination-grade?**

Do not collapse these into one number.

---

## 2. Implementation ladder

| Level | Meaning | Evidence standard |
|---|---|---|
| **L0 — Vision** | Desired behavior only | destination statement / concept |
| **L1 — Prototype** | partial or experimental implementation | code/research exists |
| **L2 — Working** | implementation works in a bounded scenario | reproducible local behavior |
| **L3 — Integrated** | works with neighboring destination primitives | cross-component proof |
| **L4 — Live** | works against real external/owner environment where relevant | live evidence |
| **L5 — Productized** | normal user can use it coherently | UX + lifecycle + recovery |
| **L6 — Full vision** | sovereign, replaceable, extensible, adaptive, continuously coherent | destination completion evidence |

This is deliberately simpler than the M0–M7 architectural maturity scale. It is the **product implementation ladder** used for dependency management.

### Mapping to existing maturity

~~~text
M0–M1   → L0/L1
M2      → L1/L2
M3      → L2/L3
M4      → L4
M5      → L3/L4
M6      → L5
M7      → L6
~~~

A component can therefore be architecturally mature while still being productually low on the ladder.

---

## 3. Complexity score

Complexity is scored **1–10** from four observable dimensions.

| Dimension | 0–2 contribution |
|---|---|
| **Breadth** | number of destination domains it touches |
| **Coupling** | number/importance of neighboring dependencies |
| **Reality** | external/live-machine uncertainty |
| **Productization** | user-facing lifecycle/configuration/recovery burden |

### Interpretation

| Score | Meaning |
|---|---|
| **1–2** | bounded/local |
| **3–4** | moderate subsystem |
| **5–6** | multi-component |
| **7–8** | cross-cutting |
| **9–10** | keystone / high-uncertainty / system-wide |

The score is reviewed as evidence improves.

---

## 4. Destination dependency graph

### Primary graph

~~~mermaid
flowchart TD
    V[Vault / Evidence / Provenance]
    O[Ontology / World Identity]
    R[Ω Runtime / Plugin / Capability]
    I[Intent / Context / Interaction]
    A[Authority / Law / Consent]
    P[Provider / Account / Realization / Routing]
    W[World / Workspace / Canvas]
    K[Durable Work / Agent / Automation]
    T[Attention / Continuity]
    F[Forge / Composition / Healing]
    S[Product Shell / Lifecycle]
    E[E2E Destination Journey]

    V --> O
    V --> A
    V --> I
    V --> P
    V --> K
    V --> W
    O --> I
    O --> W
    O --> K
    R --> I
    R --> P
    R --> K
    R --> F
    I --> K
    I --> P
    I --> A
    P --> K
    A --> K
    W --> I
    W --> K
    K --> T
    K --> V
    T --> S
    F --> P
    F --> R
    F --> W
    F --> K
    S --> W
    S --> I
    S --> T
    O --> E
    R --> E
    I --> E
    A --> E
    P --> E
    W --> E
    K --> E
    T --> E
    F --> E
    S --> E
~~~

### Simplified critical path

~~~text
                ┌──────── Ontology / World ────────┐
                │                                   │
Vault/Evidence ─┼──► Runtime/Capabilities ─► Intent/Context
                │             │                  │
                │             └──────────┐       │
                │                        ▼       ▼
                ├──────────────► Authority/Law ─► Work
                │                        │          │
                │                        ▼          ▼
                └──────────────► Provider/Account ─► Continuity
                                                   │
World/Workspace/Canvas ────────────────────────────┘
                         │
                         ▼
                Forge / Evolution
                         │
                         ▼
                 Productized VIVIM
~~~

---

## 5. Keystone dependencies

The following are the **top 10 high-centrality dependencies** for the destination. “Fan-out” is an estimate of how many major destination areas/journeys they materially influence; it is not an exact graph-theory centrality calculation.

| Rank* | Keystone dependency | Current L | Target | Gap | Fan-out | Complexity | Why it matters |
|---:|---|---:|---:|---:|---:|---:|---|
| 1 | **Vault / Evidence / Provenance** | L3–L4 | L6 | 2–3 | 10 | **10** | Underpins trust, memory, reconstruction, authority evidence, exit, and evolution |
| 2 | **Ontology / World Identity** | L2–L3 | L6 | 3–4 | 10 | **9** | Prevents duplicated/conflicting representations of the user's world |
| 3 | **Ω Runtime / Plugin / Capability boundary** | L3–L4 | L6 | 2–3 | 10 | **9** | Every capability, composition, extension, and product feature crosses it |
| 4 | **Intent / Context / Universal Interaction** | L2–L3 | L6 | 3–4 | 9 | **9** | Converts human requests into one common control path |
| 5 | **Provider / Account / Realization / Routing** | L1–L2 | L6 | 4–5 | 8 | **10** | Makes “my internet / my accounts / my intelligence” real and requires live external proof |
| 6 | **Authority / Law / Consent** | L3–L4 | L6 | 2–3 | 9 | **8** | Prevents mysterious agency and keeps every meaningful effect governed |
| 7 | **Durable Work / Agent / Automation** | L1–L2 | L6 | 4–5 | 7 | **10** | Connects intent to execution, background work, progress, result, and recovery |
| 8 | **World / Workspace / Canvas** | L1–L2 | L6 | 4–5 | 8 | **9** | Turns architecture into the persistent spatial environment the user experiences |
| 9 | **Attention / Continuity** | L1 | L6 | 5 | 7 | **8** | Makes the environment persistent rather than request/response |
| 10 | **Forge / Composition / Healing** | L2–L3 | L6 | 3–4 | 8 | **10** | Makes the environment extensible, repairable, and capable of evolving with the owner |

*Rank is a program-management ordering by leverage, not a claim that one subsystem is “better” than another.

---

## 6. Why these ten are different from the P1 list

P1 is organized around **architecture and proof obligations**.

The keystone graph is organized around **destination leverage**.

For example:

- P1-03 covers important ontology/evidence work.
- The graph asks how ontology participates in the whole product.
- P1-08 covers provider/browser harvesting.
- The graph asks whether accounts, routing, sessions, work, and user choice form one destination capability.
- P1-10 is an observatory.
- The graph treats product observability as support, not a keystone of the product itself.

This prevents the program from mistaking a clean workstream boundary for a complete product dependency.

---

## 7. Destination gap heatmap

The most important gaps are not uniformly distributed.

~~~text
CURRENT → FULL VISION

Vault / Evidence          ████░░   L3–L4 → L6
Ontology / World           ███░░░   L2–L3 → L6
Runtime / Capability       ████░░   L3–L4 → L6
Intent / Context           ███░░░   L2–L3 → L6
Provider / Account         ██░░░░   L1–L2 → L6
Authority                  ████░░   L3–L4 → L6
Durable Work               ██░░░░   L1–L2 → L6
World / Canvas             ██░░░░   L1–L2 → L6
Attention                  █░░░░░   L1 → L6
Forge / Evolution          ███░░░   L2–L3 → L6
Product Shell / Lifecycle  █░░░░░   L0–L1 → L6
~~~

The visually small bars are not “less important.” They indicate **distance to the full vision**.

---

## 8. The dependency leverage rule

A dependency should move onto the active critical path when it meets both conditions:

1. it is a prerequisite for multiple destination journeys; and
2. its current implementation level blocks downstream composition.

This means:

~~~text
HIGH CENTRALITY + LOW MATURITY
        =
        KEYS TONIGHT'S WORK
~~~

Whereas:

~~~text
HIGH CENTRALITY + HIGH MATURITY
        =
        PROTECT / COMPOSE / PROVE
~~~

And:

~~~text
LOW CENTRALITY + LOW MATURITY
        =
        DEFER
~~~

This is the mechanism for preventing attractive side work from consuming the program.

---

## 9. Top cross-cutting dependencies by destination journey

| Keystone | J1 Open | J2 Continue | J3 Interact | J4 Delegate | J5 Provider | J6 Background | J7 Evolve | J8 Exit |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Vault/Evidence | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Ontology/World | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Runtime/Capabilities | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Intent/Context |  | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  |
| Provider/Account/Routing |  | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Authority/Law |  |  | ✓ | ✓ | ✓ | ✓ | ✓ |  |
| Durable Work/Agent |  | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  |
| World/Workspace/Canvas | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Attention/Continuity | ✓ | ✓ |  | ✓ | ✓ | ✓ | ✓ | ✓ |
| Forge/Evolution |  |  | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

This table is intentionally broad: a check means “materially participates,” not “hard prerequisite for every implementation step.”

---

## 10. The three most dangerous gaps

### 1. Provider / Account / Routing

This is both high-centrality and live-reality dependent.

It is where the destination claim “my accounts / my intelligence” becomes physically testable.

### 2. Durable Work

Without a durable work object, intent, agents, background execution, attention, and results remain disconnected features.

### 3. Product Environment / Lifecycle

The architecture can be extraordinarily mature while VIVIM still fails the first-minute test.

Install, startup, account connection, persistence, update, recovery, and exit must become an explicit product dependency rather than an afterthought.

---

## 11. Complexity is not the same as remaining work

A component may have:

- high complexity but small current gap;
- low complexity but huge maturity gap;
- high centrality and high maturity;
- low centrality and low maturity.

Example:

**Authority/Law**

- high complexity;
- relatively high maturity;
- therefore current strategy is mostly **protect + expand coverage + compose**.

**Attention**

- moderate/high complexity;
- very low maturity;
- therefore it is **future-heavy**, but should not be built before durable work and continuity sources exist.

---

## 12. Active dependency strategy

The program should manage the keystone graph using four states:

### BUILD

Current maturity is low enough to block downstream composition.

### PROTECT

High-centrality dependency is already strong; avoid unnecessary redesign.

### COMPOSE

Dependencies individually work; effort moves into cross-domain proof.

### PRODUCTIZE

Architecture works, but the human lifecycle, configuration, recovery, and presentation remain.

Current broad allocation:

~~~text
BUILD
  Provider / Account / Routing
  Durable Work
  World / Workspace / Canvas
  Product Environment

PROTECT
  Vault / Evidence
  Authority / Law
  Ω Runtime
  Ontology core

COMPOSE
  Intent / Context
  Provider / Account
  Work / Agent
  World / Canvas
  Evidence

PRODUCTIZE
  Everything that currently works only for engineers/agents
~~~

---

## 13. What should be tracked every cycle

For every keystone dependency, record:

~~~text
Current level
Target level
Evidence proving current level
Dependencies in
Dependencies out
Current complexity
Top unresolved gap
Next concrete falsifier
Last change
Owner / workstream
~~~

The program board should show only the summary.

The detailed evidence stays in the destination/workstream artifact.

---

## 14. Decision rule for new work

Before starting a new piece of work, ask:

1. Which keystone dependency does it advance?
2. Which destination journey does it unlock?
3. Does it increase implementation level or merely add machinery?
4. Does it remove a named dependency edge?
5. What evidence moves the dependency from one level to the next?

If those answers are unclear, the work is probably not on the critical path.

---

## 15. Working conclusion

The destination is best managed as a **dependency system**, not as a checklist.

The highest leverage comes from moving a small number of keystone dependencies upward together:

~~~text
TRUTH
  ↓
WORLD
  ↓
CAPABILITY
  ↓
INTERACTION
  ↓
AUTHORITY
  ↓
PROVIDER / ACCOUNT
  ↓
WORK
  ↓
CONTINUITY
  ↓
EVOLUTION
  ↓
PRODUCT
~~~

That graph is the thing to watch.

The key management question becomes:

> **Which dependency, if raised one implementation level, unlocks the most of the destination?**
