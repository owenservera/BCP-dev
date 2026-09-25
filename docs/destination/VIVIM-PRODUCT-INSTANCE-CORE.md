# VIVIM Product Instance & Core — VS1 Characterization

> Classification: DERIVED — PRODUCT RESEARCH / WORKING
> Status: CHARACTERIZATION BASELINE
> Date: 2026-09-25
> Repository baseline: `05464e085122a173d1f093612292336750436c7e`
> Purpose: define the smallest complete boundary of a running VIVIM prototype instance and map it to current Ω/VIVIM evidence before implementation. Product installation and packaging are deliberately deferred.
>
> This document is not Ω law. Current code, tests, explicit Ω decisions/contracts, and later owner-ratified product decisions remain authoritative. The legacy VIVIM tree is evidence to harvest, not destination authority.

## 1. Executive finding

The most important missing product boundary is not the canvas, the Windows shell, or another runtime subsystem in isolation.

It is the **VIVIM Product Instance**:

> **A persistent, single-user computing environment on an owned machine that has an identity, a durable user world, an active governed composition, a lifecycle, and one coherent product surface.**

The instance is the boundary between:

- the **machine/product lifecycle** the user owns;
- the **Ω composition** that supplies governed capabilities;
- the **persistent world** those capabilities operate on;
- the **surface** through which the person experiences and controls that world.

The current repository already contains substantial machinery for each side, but it does not yet assemble them into one destination-grade product instance.

### Core hypothesis

~~~text
                         VIVIM PRODUCT INSTANCE
                                  |
            +---------------------+---------------------+
            |                     |                     |
            v                     v                     v
       LIFECYCLE               WORLD                SURFACE
       install                vault                 native UI
       start                  identity              canvas
       recover                things                prompt
       update                 spaces                views
       shutdown               work                  interaction
            |                     |                     |
            +---------------------+---------------------+
                                  |
                                  v
                           ACTIVE Ω COMPOSITION
                    law / vault / run / mind / intent /
                    providers / capabilities / plugins
~~~

This boundary should become the **primary characterization seam for VS1 — Run my VIVIM**.

---

## 2.1 Prototype-first scope

For the first functioning prototype, the Product Instance is a logical/runtime boundary, not an installer boundary.

The prototype must prove one identifiable instance, an explicit durable user-data boundary, a bootable composition, an honest initial world, a coherent product surface, a meaningful persistent mutation, shutdown/restart reconstruction, and controlled recovery.

The prototype does **not** need a Windows installer, final AppData/Program Files packaging decisions, signed distribution bundles, an update channel, or uninstall/upgrade UX. Those are later productization concerns.

## 2. VS1 product outcome

VS1 is not "the application launches."

The minimum meaningful outcome is:

~~~text
RUN THE PROTOTYPE
  ↓
START
  ↓
INITIALIZE MY INSTANCE
  ↓
CREATE / OPEN MY DURABLE WORLD
  ↓
LOAD THE DEFAULT COMPOSITION
  ↓
PRESENT A USEFUL PRODUCT SURFACE
  ↓
MAKE A CHANGE
  ↓
CLOSE
  ↓
REOPEN
  ↓
SAME WORLD + SAME CONFIGURATION + SAME IDENTITY
~~~

A successful VS1 instance must therefore answer:

1. What is one VIVIM installation?
2. What belongs to one user?
3. Where does durable user state live?
4. What is temporary, cached, or disposable?
5. Which composition is active?
6. What does first-run create?
7. What is the default world?
8. What does the user see first?
9. What survives shutdown/restart?
10. How does recovery preserve user state?
11. How does the product update without silently changing the user's world?
12. What is the minimum native product surface?

---

## 3. Product Instance model

### 3.1 Recommended boundary

A VIVIM Product Instance should conceptually contain:

~~~text
VIVIM INSTANCE
│
├── Installation Identity
│   ├── instance id
│   ├── product version
│   ├── active installation path
│   └── lifecycle metadata
│
├── User Environment
│   ├── durable vault
│   ├── root of trust
│   ├── configuration
│   ├── world state
│   ├── work/history
│   ├── connected account references
│   └── installed capability state
│
├── Active Composition
│   ├── signed recipe
│   ├── plugin composition
│   ├── runtime state
│   └── recovery/pinned state
│
├── Product Services
│   ├── world projection
│   ├── interaction
│   ├── work execution
│   ├── provider sessions
│   └── diagnostics
│
└── Product Surface
    ├── native application shell
    ├── canvas / spaces
    ├── universal prompt
    ├── object views
    └── attention / result presentation
~~~

This is a **product boundary**, not a claim that all of these concepts should become one implementation object or one database row.

### 3.2 Important separation

Do not collapse these into one thing:

- **Installation** — where the program exists.
- **Instance** — the user's durable environment on a machine.
- **Vault** — authoritative durable data/evidence store.
- **Composition** — what capabilities/plugins are active.
- **World** — what the user has in the environment.
- **Surface** — how the world is represented.
- **Session** — a transient interactive relationship.
- **Cache/temp** — disposable implementation state.

A useful product test is:

> If the executable is replaced but the user's environment remains intact, what survived?

Everything that answers "my world" should remain separate from replaceable program binaries.

---

## 4. Repository evidence map

### 4.1 Ω evidence

| Product responsibility | Current evidence | Read |
|---|---|---|
| Boot / composition | `omega-baseline/omega-final/host/src/main.ts` | Strong mechanism, product wrapper missing |
| Fail-closed recovery | `host/src/recovery.ts` | Strong mechanism |
| Platform boundary | `platform/src/platform.ts` and `spawn.ts` | Strong substrate |
| Durable vault | `plugins/vivim-vault` | Strong substrate |
| Vault recovery | `plugins/vivim-vault/src/index.ts` | Strong boot-time recovery mechanism |
| World projection | `plugins/vivim-mind` | Strong read-only world lens; bounded |
| Execution | `plugins/vivim-run` | Strong runtime substrate |
| Deterministic interaction | `plugins/vivim-nlcl`, `surfaces/web/src/api.ts` | Strong bounded path |
| Current web surface | `surfaces/web/src/server.ts` | Working console/service, not final product shell |
| CLI surface | `surfaces/cli/src/cli.ts` | Working developer/user-facing command surface |
| Product composition | `compositions/spine.json` | Development spine, not yet product default environment |
| Windows guidance | `docs/WINDOWS.md` inside Ω tree | Strong operational evidence, not full product lifecycle |

### 4.2 Critical evidence gap

The current Ω spine explicitly configures vault storage under:

~~~text
${TMP}/omega-spine/vault-data
~~~

That is appropriate for a development composition but is **not sufficient as the destination definition of a user's durable environment**.

The product core must establish a product-owned durable-data boundary distinct from temporary scratch space.

This is one of the clearest concrete reasons VS1 needs its own characterization.

---

## 5. Legacy VIVIM evidence to harvest

The legacy tree contains substantially more user-surface behavior than Ω currently exposes.

### Relevant evidence

`vivim-original-baseline/vivim-final-enhanced/frontend/src/app/page.tsx`

The existing product composition includes:

- persistent canvas as the dominant surface;
- unified entry;
- workspace/session configuration;
- onboarding;
- conversation creation;
- provider/capability access;
- panel system;
- assistant entry;
- canvas search;
- keyboard navigation.

`frontend/src/components/canvas/LivingCanvas.tsx`

Contains mature interaction evidence for:

- spatial navigation;
- node placement;
- connections;
- selection;
- zoom tiers;
- search;
- panels;
- direct manipulation;
- undo/redo;
- agent overlays.

`frontend/src/components/canvas/UnifiedEntry.tsx`

Contains evidence for a single interaction entry point:

- prompt/input;
- context-sensitive behavior;
- conversation creation;
- capability dispatch;
- layer-aware interaction.

`frontend/src/components/canvas/SessionStateProvider.tsx`

Contains evidence for product surface persistence:

- active layer;
- panels;
- panel sizes;
- tabs;
- composer state;
- workspace/session identity;
- local hydration.

`src/config.ts`

Contains evidence for an explicit user-data location concept:

- Windows `LOCALAPPDATA`;
- persistent application data;
- storage configuration;
- runtime configuration.

### Harvest conclusion

The legacy repository should be mined for **behavioral requirements and proven UX patterns**, especially around the canvas, unified entry, onboarding, session persistence, and local-data location.

It should not be treated as the architecture to transplant into Ω.

---

## 6. Product-instance lifecycle

The lifecycle should be treated as a first-class product concern.

### 6.1 Cold start

~~~text
PROCESS START
    ↓
LOCATE INSTALLATION
    ↓
LOCATE INSTANCE STATE
    ↓
VALIDATE USER-DATA / ROOT-OF-TRUST
    ↓
RUN RECOVERY IF NEEDED
    ↓
LOAD ACTIVE RECIPE / COMPOSITION
    ↓
VERIFY COMPOSITION
    ↓
BOOT Ω
    ↓
DERIVE WORLD
    ↓
START PRODUCT SURFACE
    ↓
READY
~~~

The existing Ω host already handles a large middle section of this sequence. The missing part is the **product-level wrapper and user-data lifecycle around it**.

### 6.2 Shutdown

~~~text
USER / OS CLOSE
    ↓
STOP ACCEPTING NEW WORK
    ↓
DRAIN / CHECKPOINT WHERE REQUIRED
    ↓
PERSIST PRODUCT STATE
    ↓
CLOSE Ω COMPOSITION
    ↓
EXIT
~~~

Shutdown should preserve a reconstructable state rather than merely terminate processes.

### 6.3 Recovery

The current `host/src/recovery.ts` provides strong evidence for:

- verify incoming recipe;
- preserve known-good pinned recipe;
- fail closed on corruption;
- clean stale swap state;
- boot the previous known-good composition.

VS1 should extend this principle to the **whole product instance**, including product configuration and user data.

---

## 7. Data ownership model

The product core needs an explicit four-zone model.

~~~text
PROGRAM / INSTALLATION
  replaceable binaries
  signed product/runtime assets

INSTANCE DATA
  user-owned durable configuration
  world
  history
  work
  capability choices
  account references

VAULT / EVIDENCE
  canonical records
  provenance
  event history
  durable object revisions

DISPOSABLE
  temp
  cache
  derived build artifacts
  transient sessions
~~~

### Product rule

**User-important state must never be durable only because a development process happens to leave it somewhere.**

A product reboot, executable replacement, temporary-directory cleanup, or application update must not erase the user's world.

---

## 8. Default environment

The first-run composition should not simply expose the development spine.

The destination model is:

~~~text
VIVIM CORE
+
DEFAULT FREE CAPABILITY / PROVIDER SET
+
OPTIONAL CONNECTED ACCOUNTS
+
USER ROUTING / CONFIGURATION
~~~

The user should encounter a useful environment before knowing:

- what a plugin manifest is;
- what a composition recipe is;
- what a realization is;
- what a port is;
- what a capability token is.

Those remain inspectable concepts.

### First-run target

~~~text
START
  ↓
"Create my VIVIM"
  ↓
local environment created
  ↓
default capabilities available
  ↓
world / empty-world orientation
  ↓
connect accounts when useful
  ↓
READY
~~~

The exact provider lineup is intentionally not frozen here.

---

## 9. Product surface boundary

### 9.1 What Ω currently has

The Ω tree has:

- CLI;
- MCP;
- web console;
- world snapshot;
- interpretation;
- execution;
- consent;
- live journal/world streams.

These establish a usable **control/service surface**.

### 9.2 What VIVIM needs

The destination product surface should add:

- native application lifecycle;
- persistent environment shell;
- spatial world presentation;
- universal prompt;
- direct manipulation;
- contextual object views;
- configuration through ordinary interaction;
- useful attention/continuity presentation.

The native surface should call into the same underlying semantic system rather than invent a parallel product API.

### 9.3 Canvas rule

The canvas remains a projection.

~~~text
CANONICAL WORLD
     ↓
WORLD / CONTEXT / WORK STATE
     ↓
SURFACE PROJECTION
     ↓
CANVAS
~~~

Moving a tile is not the same thing as changing canonical world identity unless a specific product operation says so.

---

## 10. Identity chain

The following identity boundaries should remain explicit:

~~~text
MACHINE
  ↓
VIVIM INSTALLATION
  ↓
VIVIM INSTANCE
  ↓
USER
  ↓
WORLD
  ↓
ACCOUNT
  ↓
SESSION
  ↓
WORK
~~~

These concepts answer different questions.

For example:

- "Which machine is this?" → machine.
- "Which installation is running?" → installation.
- "Which environment am I in?" → instance.
- "Whose data is this?" → user.
- "Which external relationship am I using?" → account.
- "Which live browser/profile context is executing?" → session.
- "What outcome is being pursued?" → work.

This separation is especially important for migration, backup, restore, multi-account operation, and eventual multi-device continuity.

---

## 11. VS1 acceptance contract

VS1 should not be considered complete merely because a binary launches.

### G1 — Prototype launchable

The VIVIM prototype can be launched repeatably from the repository/developer environment through one documented path.

### G2 — Instance created

A first launch creates or locates exactly one durable user environment for that installation/user context.

### G3 — Durable

The user can identify where durable state lives, and it survives restart.

### G4 — Composition booted

The active composition is verified and boots through the ordinary Ω boot/recovery path.

### G5 — World available

The product can derive and present an initial world, including an honest empty-world state.

### G6 — Surface available

The person reaches a coherent VIVIM product surface without using Ω implementation commands.

### G7 — Mutation survives

At least one meaningful local world change survives:

~~~text
write → close → reopen → same state
~~~

### G8 — Recovery survives

A recoverable product-level failure does not silently destroy the user's world.

### G9 — Configuration survives

At minimum, user-controlled product/environment choices that are defined as durable survive restart.

### G10 — Runtime replaceability

Replacing/restarting the executable does not redefine or erase the user's durable world.

### G11 — Honest separation

Temporary/demo/fixture state is not presented as the user's durable world.

### G12 — Evidence

The above behavior is reproducibly demonstrated, with the exact environment and persistence boundary recorded.

---

## 12. Product-core dependency graph

~~~mermaid
flowchart TD
    A[Installation Identity]
    B[Instance Lifecycle]
    C[Durable Data Boundary]
    D[Root of Trust / Recovery]
    E[Active Composition]
    F[Ω Runtime]
    G[Vault / Evidence]
    H[World Projection]
    I[Product Surface]
    J[Universal Prompt]
    K[Workspace / Canvas]
    L[Configuration]
    M[Connected Accounts]
    N[Work / History]

    A --> B
    B --> C
    B --> D
    D --> E
    E --> F
    C --> G
    G --> H
    H --> I
    I --> J
    I --> K
    I --> L
    C --> L
    G --> N
    H --> N
    M --> C
    M --> E
    N --> I
    L --> I
~~~

### Highest leverage inside VS1

The critical chain is:

~~~text
Instance Identity
    ↓
Durable Data Boundary
    ↓
Boot / Recovery
    ↓
Active Composition
    ↓
World Projection
    ↓
Product Surface
    ↓
Restart / Reconstruction
~~~

If these are coherent, many later capabilities can attach without redefining the product boundary.

---

## 13. Current maturity

Using the destination implementation ladder:

| Core area | Current | VS1 target | Main reason |
|---|---:|---:|---|
| Ω boot/runtime | L3–L4 | L5 | already strong technically |
| Vault/evidence | L3–L4 | L5 | product lifecycle still outside it |
| World projection | L2–L3 | L5 | needs persistent product integration |
| Product instance identity | L0–L1 | L5 | not yet explicit |
| Local durable data boundary | L1–L2 | L5 | Ω dev spine still uses temp-oriented config |
| Install/update lifecycle | L-1/L0 | **Later** | deliberately deferred until the prototype is proven |
| Native Windows shell | L-1/L0 | L5 | not yet characterized |
| Unified product surface | L1–L2 | L5 | legacy evidence exists; Ω integration missing |
| Workspace/canvas integration | L1–L2 | L5 | strong mine evidence, weak destination integration |
| Account onboarding | L1–L2 | L5 | model/evidence exists, product flow missing |
| Product diagnostics/recovery | L1–L2 | L5 | runtime mechanisms exist; user product loop missing |

**Key observation:** the largest VS1 gap is not a low-level runtime primitive. It is the **assembly boundary across lifecycle + durable environment + world + surface**.

---

## 14. What belongs in the next characterization

The next research/build seam should be narrow enough to remain tractable.

### VS1-C1 — Instance definition

Define the minimum persistent data and identity required for one VIVIM instance.

### VS1-C2 — Prototype data boundary

Determine the smallest explicit prototype separation for:

- durable user data;
- vault;
- configuration;
- plugin state;
- cache;
- temp;
- logs;
- browser/profile references;
- secrets references.

### VS1-C3 — Boot contract

Map the existing Ω boot/recovery chain into the product-level startup lifecycle.

### VS1-C4 — Default composition

Define the minimum useful VIVIM composition rather than exposing a development spine directly.

### VS1-C5 — Empty world

Define the truthful first-run/empty-world experience without demo data pretending to be user data.

### VS1-C6 — Surface bridge

Map the smallest path from current `surfaces/web` + legacy canvas behavior to a VIVIM product surface.

### VS1-C7 — Restart proof

Produce the first full:

~~~text
start → create/change → close → start → reconstruct
~~~

falsifier.

### VS1-C8 — Failure/recovery proof

Break one controlled product dependency and demonstrate recovery without loss of durable user state.

### Later — Productization / installation

After the functioning prototype is proven, characterize and implement installer/package format, Windows installation location, AppData/data placement, signed distribution, update/rollback, uninstall, upgrade migration, and end-user first-run packaging.

---

## 15. What is explicitly out of scope for VS1

VS1 should not absorb:

- multi-device synchronization;
- collaboration;
- marketplace/distribution economics;
- full autonomous provider healing;
- general desktop automation;
- 3D environment implementation;
- universal internet acquisition;
- full local model lifecycle;
- broad provider expansion;
- a second plugin architecture;
- a replacement routing engine.

Those may depend on the Product Instance boundary, but they should not be hidden inside its first implementation.

---

## 16. Product-core research conclusion

The current repository has enough machinery to begin product assembly.

The central missing concept is:

> **VIVIM is a persistent instance, not merely an Ω composition and not merely a canvas.**

The instance owns the lifecycle and the user's relationship to the composition.

The composition owns capabilities.

The vault owns durable evidence/data.

The world is derived from authoritative local evidence.

The surface projects that world.

The user's interaction traverses the same governed substrate.

~~~text
             VIVIM INSTANCE
                   |
        +----------+----------+
        |                     |
   USER ENVIRONMENT       ACTIVE Ω
        |                     |
     durable                 governed
      world                  capability
        |                     |
        +----------+----------+
                   |
              PRODUCT SURFACE
                   |
             human interaction
~~~

This gives us the product-core rule:

> **Do not build “the VIVIM UI” first. Build the smallest complete VIVIM instance, then let the UI become its primary surface.**

The immediate destination slice is therefore:

**VS1 — Run my VIVIM prototype: launch from the repository → initialize → open durable world → use → close → reopen → reconstruct truthfully.**

Installation, packaging, distribution, updates, and uninstall are explicitly later productization work. They should not block proving the functioning product loop.

That slice should become the anchor for the next major product effort.
