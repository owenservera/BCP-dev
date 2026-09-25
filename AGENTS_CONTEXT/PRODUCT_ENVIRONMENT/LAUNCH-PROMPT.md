# Launch Prompt — VIVIM Product Environment / Native Windows Substrate Research

You are opening a dedicated deep-research/design workstream for VIVIM.

Repository:

https://github.com/owenservera/BCP-dev

Branch to create:

`research/product-environment-native-windows`

## Mission

Determine and design the product/machine substrate VIVIM needs to become a real sovereign Windows environment.

This is **research + canonical design first**.

Do **not** begin production implementation during this workstream.

The work must answer:

> What is the smallest coherent Product Environment that lets the existing Ω semantic/runtime substrate become a durable, understandable, governed, recoverable Windows product?

This is broader than a frontend and narrower than designing an entire operating system.

## First read

Read, in order:

1. `AGENTS.md`
2. `BUILD_CONTEXT.md`
3. `AGENTS_CONTEXT/README.md`
4. `AGENTS_CONTEXT/PRODUCT_VISION/STATE.md`
5. `docs/agent-system/PROGRAM-COMPLETENESS-AND-CONTROLS.md`
6. `docs/destination/README.md`
7. `docs/destination/DEPENDENCY-GRAPHS-AND-KEYSTONE-SCORECARD.md`
8. `docs/destination/VERTICAL-SLICE-REGISTRY.md`
9. `docs/destination/BUILD-AND-HARVEST-PLAN.md`
10. `docs/destination/V1-DEFAULT-ENVIRONMENT-AND-LIVE-PROOF.md`
11. `docs/destination/RECONCILIATION-MAP.md`
12. this complete `AGENTS_CONTEXT/PRODUCT_ENVIRONMENT/` context
13. relevant Product Instance, World/Workspace/Canvas, Interaction/Intent/Work, Agency/Attention, Personal Agent, and Agentic Core material.

Then inspect the current Ω implementation and the legacy VIVIM mine for existing Windows, frontend, local-resource, application-integration, installer, startup, process, browser, notification, diagnostics, and recovery behavior.

## Central questions

### A — Product boundary

- What is the VIVIM Product Environment?
- What does it own versus delegate?
- How does it relate to Product Instance, vault, runtime, shell, surface, workspace, and process?
- What is durable versus ephemeral?
- What survives process death?

### B — Native Windows shell

- What are the minimum responsibilities of the Windows host?
- Which current Windows technologies are viable?
- Can the environment host web-rendered surfaces without making the web layer authoritative?
- How should multiple windows/surfaces and single-instance behavior work?
- What is the startup/bootstrap sequence?
- How are child processes and failures handled?

### C — OS / filesystem / application integration

- How do files, folders, applications, processes, windows, devices, and machine state become governed capabilities?
- What identities are durable?
- What observations are transient?
- How are OS handles separated from canonical object identity?
- How is external state reconciled with local canonical state?

### D — Desktop interaction substrate

Define semantic capabilities for:

- observe;
- focus;
- open;
- close;
- move/resize;
- keyboard input;
- pointer input;
- clipboard read/write;
- screenshot/capture;
- native application interaction;
- window/application discovery.

Determine which actions require user presence, elevated authority, or explicit approval.

### E — Resource lifecycle / hydration

Reconcile existing Ω liveness/hydration concepts with:

- processes;
- browser profiles/sessions;
- windows;
- applications;
- devices;
- external services.

Define durable resource identity, observation, availability, lease, hydration, release, fencing, and stale-handle behavior.

### F — Product lifecycle and recovery

Design semantics for:

- install;
- first run;
- initialize;
- upgrade;
- migrate;
- rollback;
- crash;
- restart;
- restore;
- uninstall;
- export.

The environment must be recoverable without relying on process memory.

### G — Security and secret integration

Determine:

- what Windows secret mechanisms can provide;
- how secret references are represented;
- how authorization is requested;
- what can be audited;
- how secrets remain absent from ordinary canonical/work/evidence payloads;
- how the product behaves when secrets are inaccessible.

### H — Notification / attention surface

Connect Windows delivery mechanisms to standing intent and attention without creating a parallel attention authority.

### I — Diagnostics / repair

Define a user-grade loop:

```
observe
→ diagnose
→ explain
→ propose
→ authorize
→ repair
→ verify
```

The user must be able to understand failure without reading internal logs.

### J — Self-description

The Product Environment must naturally extend the Personal Agent / Self-Knowledge model.

A normal user should be able to ask about:

- product state;
- process/surface state;
- resource availability;
- configured permissions;
- installed/loaded plugins;
- current data location;
- failures;
- repair status;
- why an action was refused;
- what changed across an update.

No second documentation database.

## Contemporary technology research

Research current, authoritative documentation and current state for relevant Windows approaches, including as applicable:

- Windows App SDK / WinUI 3;
- WebView2;
- WPF;
- native Win32/COM surfaces;
- Electron;
- Tauri and other Rust-based shells;
- MSIX / App Installer / current Windows deployment mechanisms;
- service/process supervision options;
- Windows notifications;
- Windows credential/secret APIs;
- UI Automation and related accessibility/interaction APIs;
- PowerShell / Windows management facilities where relevant.

Do not assume any of these are appropriate. Compare them against VIVIM's actual constraints and semantic architecture.

Prefer primary sources for platform facts. Record versions/dates where relevant.

## Legacy harvest

Search the mine for existing behavior related to:

- Windows shell;
- installers and updater logic;
- local filesystem access;
- application/process launching;
- desktop/window interaction;
- clipboard/input;
- notifications;
- resource lifecycle;
- local credentials;
- health/diagnostics/recovery;
- startup/shutdown;
- browser fleet/resource supervision.

For each meaningful mechanism classify it:

- HARVEST AS IS;
- HARVEST BEHAVIOR;
- REBUILD UNDER Ω;
- REJECT;
- UNKNOWN / NEEDS EXPERIMENT.

Do not preserve architecture merely because code exists.

## Required design output

Create the complete package under:

`docs/destination/product-environment/`

At minimum:

1. `README.md`
2. `RESEARCH-SYNTHESIS.md`
3. `CANONICAL-MODEL.md`
4. `WINDOWS-SHELL-AND-SURFACE.md`
5. `OS-RESOURCE-AND-APPLICATION-MODEL.md`
6. `DESKTOP-INTERACTION-MODEL.md`
7. `PRODUCT-LIFECYCLE-AND-RECOVERY.md`
8. `RESOURCE-HYDRATION-AND-LEASES.md`
9. `SECURITY-AND-SECRET-INTEGRATION.md`
10. `NOTIFICATION-AND-ATTENTION-SURFACE.md`
11. `PRODUCT-DIAGNOSTICS-AND-REPAIR.md`
12. `IMPLEMENTATION-BLUEPRINT.md`
13. `FALSIFIERS.md`
14. `OPEN-FRONTIER.md`
15. `EVIDENCE-INDEX.md`
16. `DECISIONS.md`

## Required diagrams

Include at least:

1. Product Environment boundary diagram;
2. process/shell/runtime topology;
3. canonical resource ↔ OS handle relationship;
4. desktop interaction semantic path;
5. product lifecycle/recovery state machine;
6. resource hydration/lease lifecycle;
7. secret reference flow;
8. diagnostic/repair loop;
9. Product Environment ↔ Personal Agent self-description relationship.

## Falsification discipline

Every major abstraction must have at least one falsifier.

Examples:

- shell restart with durable state preserved;
- crash during startup;
- interrupted update and rollback;
- stale OS handle;
- process closes while durable Work continues;
- resource disappears and returns;
- permission revoked;
- clipboard/input boundary violation;
- secret unavailable;
- notification suppression;
- repair produces no silent authority escalation.

Distinguish:

- CHARACTERIZED;
- PROPOSED;
- IMPLEMENTED;
- VERIFIED;
- LIVE;
- INTEGRATED;
- PRODUCTIZED.

Do not call design evidence implementation proof.

## Mandatory dependency analysis

Explicitly map the package against:

- Vault / Evidence / Provenance;
- Ontology / World;
- Ω Runtime / Plugin / Capability;
- Intent / Context;
- Authority / Law / Consent;
- Provider / Account / Realization / Routing;
- Durable Work / Agent / Automation;
- World / Workspace / Canvas;
- Attention / Continuity;
- Forge / Composition / Healing;
- Product Instance;
- Personal Agent / Self-Knowledge.

Identify the top downstream journeys unlocked by this work, especially VS1.

## Non-goals

Do not:

- implement production code;
- create a second canonical data store;
- create a shell-specific authority system;
- turn Windows handles into canonical identity;
- create a separate desktop automation architecture unrelated to capabilities;
- pick a framework before defining semantic boundaries;
- redesign the Ω vault;
- redesign Personal Agent;
- redesign the provider lab;
- treat UI state as source of truth.

## Completion gate

Do not close the workstream until the repository contains:

- a complete product-environment boundary;
- canonical Windows/resource taxonomy;
- shell/runtime/process model;
- desktop interaction semantics;
- lifecycle/update/recovery design;
- resource hydration/lease design;
- security/secret integration;
- notification bridge;
- diagnostics/repair model;
- explicit Personal Agent/self-description integration;
- contemporary platform research with primary-source evidence;
- legacy harvest matrix;
- implementation mapping;
- falsifiers;
- open experiments;
- unresolved questions;
- evidence index;
- decision record.

Then:

1. update this context's `STATE.md` with the research result;
2. commit the complete package;
3. create a PR against `main`;
4. report branch, commit SHA, PR URL/number, package root, principal conclusions, and blockers.

Do not claim owner-machine live proof unless it was actually run and evidenced.
