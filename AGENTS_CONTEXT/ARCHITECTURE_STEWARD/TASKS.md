# Persistent Tasks — architecture-steward

> Owner: `architecture-steward`
> Status: ACTIVE
> Purpose: durable unfinished-work and next-action queue across ChatGPT sessions.
> Authority: task/work memory only; not Ω law, semantic authority, or proof of dependency.

## Open tasks

### CFA-05-10-BOUNDARY-GATE-BEFORE-GRAPH-2026-09-27
- **Status:** READY / CURRENT GATE
- **Priority:** P0
- **Purpose:** Close the missing durable boundary-evidence layer for CFA-05 through CFA-10 before Graph Kernel / Source-Code Graph attachment.
- **Canonical packet:** `BOUNDARY-DESIGN-SYSTEM/CFA-05-10-BOUNDARY-BASELINE-AND-RECONCILIATION-2026-09-27.md`
- **Reason:** CFA-05–10 are already owner-aligned/rationalized; the missing artifact layer is Boundary baseline + peer reconciliation, not CFA birth. Do not rerun one-shot bootstrap.
- **Wave 1:** CFA-05 through CFA-10 independently produce `BOUNDARY-BASELINE-DECLARATION-2026-09-27.md` in parallel.
- **Wave 2:** Steward reconciles the six baselines and emits the peer-reconciliation queue.
- **Wave 3:** CFA-05 → CFA-06 → CFA-07 → CFA-08 → CFA-09 → CFA-10 reconcile bounded seams sequentially.
- **Wave 4:** Steward audits completion and explicitly opens/withholds the Graph Gate.
- **Next action:** Human router sends **Next to CFA-05, CFA-06, CFA-07, CFA-08, CFA-09, CFA-10 in parallel**. After all six complete, send **Next to Steward** for Wave 2; then sequential Next through CFA-05…CFA-10; then Steward for Wave 4.
- **Completion condition:** Six baselines, Steward reconciliation, six peer outputs, and final audit are durably persisted with exact lineage; unresolved items remain UNKNOWN/CONFLICTED/DEFERRED.
- **Stop condition:** owner-intent conflict, Ω-law collision, material ownership transfer, or pressure to infer semantics from names/implementation.
- **Graph dependency:** Graph build is gated until Wave 4 explicitly opens it.



### DESIGN-CFA-COLLABORATION-DEVELOPMENT-ACCELERATION-2026-09-27
- **Status:** DONE / CENTRAL DESIGN FROZEN
- **Priority:** P1
- **Purpose:** Establish the shared collaboration + development-acceleration substrate design before any shared implementation, combining decision/evidence coordination with a fast context→experiment→proof→receipt loop.
- **Design set:** `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/DEVELOPMENT-ACCELERATION/`
- **Dependencies:** Reconciled CFA M1 evidence; existing FSSP-1.3, Agent Commons and Boundary Protocol remain the baseline.
- **Write scope:** Steward-owned generic design/control-plane implementation only; no domain-semantic implementation.
- **Next action:** Completed. Ten current CFA M1 evidence packets were reconciled; generic central schemas, implementation packet and CFA adapter contract are now frozen for mechanical implementation.
- **Completion condition:** Met. The central kernel can be implemented without inventing domain meaning, ownership, authority or live-proof semantics; deferred decisions have named CFA owners and explicit extension points.
- **Stop condition:** Preserved as an implementation guard: stop on semantic ownership conflict, Ω-law collision, or hidden domain semantics.

### CROSS-CFA-M1-CONTRACT-EVIDENCE-CLOSURE-2026-09-27
- **Status:** DONE / RECONCILED FOR DOWNSTREAM SELECTION
- **Priority:** P1
- **Purpose:** Coordinate and verify the first bounded CFA-owned M1 contract/evidence tasks identified by the ten independent roadmaps.
- **Dependencies:** Local CFA M1 tasks and their peer-information requests; no new centralized semantic ownership.
- **Write scope:** Steward control plane and central synthesis only; local CFA homes remain owned by their CFAs.
- **Next action:** Completed. All ten local M1 packets were verified and reconciled into the central evidence/dependency view; remaining gaps are named and owner-scoped.
- **Completion condition:** Met for downstream selection. The minimum contracts/evidence are sufficiently characterized to prepare one bounded governed corridor without inventing missing semantics; live proof remains separately gated.
- **Stop condition:** owner decision, Ω-law collision, material ownership dispute, or insufficient evidence.

### IMPLEMENT-CENTRAL-DEVELOPMENT-ACCELERATION-KERNEL-2026-09-27
- **Status:** READY
- **Priority:** P1
- **Purpose:** Implement the frozen generic Layer-1 development-acceleration kernel without introducing domain semantics.
- **Design:** `DEVELOPMENT-ACCELERATION/CENTRAL-KERNEL-DESIGN-2026-09-27.md`
- **Implementation packet:** `DEVELOPMENT-ACCELERATION/CENTRAL-KERNEL-IMPLEMENTATION-PACKET-2026-09-27.md`
- **Adapter contract:** `DEVELOPMENT-ACCELERATION/CFA-ADAPTER-CONTRACT-2026-09-27.md`
- **Dependencies:** Reconciled CFA M1 evidence; FSSP-1.3; Agent Commons; Boundary Protocol; Session Result Contract v1.1.
- **Write scope:** Central generic development substrate only.
- **Next action:** Implement generic schemas/validation, reference/evidence/dependency indexes, bounded context/inspection, deterministic scaffolding, proof/replay bookkeeping, receipt generation, orchestration projection and friction telemetry in independently verifiable slices.
- **Completion condition:** Synthetic domain-neutral acceptance passes without central code knowing CFA semantics; receipts and derived projections are reproducible.
- **Stop condition:** Any requirement to invent domain meaning, authority, identity equivalence, product behavior or Ω-law.

### SELECT-GOVERNED-CORRIDOR-AFTER-M1-2026-09-27
- **Status:** WAITING
- **Priority:** P1
- **Purpose:** After M1 closure, choose one narrow consequential corridor for integration/live proof.
- **Dependencies:** M1 evidence closure; central dependency reconciliation.
- **Write scope:** Steward control plane and bounded execution packet.
- **Next action:** Do not start until the M1 completion condition is met.
- **Completion condition:** One corridor is justified by evidence and has named semantic, authority, Work, realization, runtime and evidence owners.
- **Stop condition:** corridor requires unresolved owner policy or unsupported live proof.

### LAUNCH-CFA-STRATEGIC-ROADMAP-ROUND-1-2026-09-27
- **Status:** DONE
- **Priority:** P1
- **Result:** all ten independent CFA strategic roadmap sessions returned durable roadmaps/task updates; see central synthesis and local receipts.
- **Completion:** reconciled 2026-09-27.

### CENTRAL-CFA-STRATEGIC-ROADMAP-SYNTHESIS-2026-09-27
- **Status:** DONE
- **Priority:** P1
- **Result:** `CFA-STRATEGIC-ROADMAP-CENTRAL-2026-09-27.md` populated with ten-roadmap milestone comparison, cross-CFA dependency/intelligence matrices, shared tooling, decision gates, contradictions, inherited-plan reconciliation, central sequencing and the first shared frontier.
- **Completion:** 2026-09-27.

### CFA-DOMAIN-ROADMAP-WAVE-2026-09-27
- **Status:** SUPERSEDED
- **Priority:** P1
- **Reason:** Expanded into the independent Strategic Roadmap Round 1; no second roadmap-generation wave should be run.

### CFA-HOME-UPGRADE-WAVE-RECONCILIATION-2026-09-27
- **Status:** DONE
- **Priority:** P1
- **Result:** historical CFA-05 exception resolved; durable home-upgrade receipt exists and was verified.

### CYCLE-4-LIVE-CHROME-ACCOUNTS-2026-09-27
- **Status:** SUPERSEDED / CANDIDATE
- **Priority:** P1
- **Reason:** valid candidate downstream slice, but not selected before M1 cross-CFA contract/evidence closure.
- **Next:** reconsider only after a governed corridor is justified.

### COMMONS-V0-RUNTIME-2026-09-27
- **Status:** READY / BACKGROUND
- **Priority:** P1
- **Operational owner:** runtime-constitution-core-substrate
- **Source:** `AGENTS_CONTEXT/AGENT-COMMONS/RUNTIME-PLATFORM-WORKSTREAM-2026-09-27.md`
- **Reason:** durable work remains valid but is not the shared Steward frontier.

### COMMONS-IDENTITY-DRILL-2026-09-27
- **Status:** BLOCKED / BACKGROUND
- **Priority:** P1
- **Reason:** remains blocked until a real key-rotation operation exists.

### OWNER-DIGEST-2026-09-27
- **Status:** ACTIVE
- **Priority:** P1
- **Owner:** architecture-steward
- **Cadence:** weekly derived snapshot.
- **Scope:** receipt verification, pending work, unresolved contradictions, handoff/attention items when computable.
- **Authority:** projection only.

## Completed task history

### CFA-PLANNING-CONTEXT-INVERSION-FIX-2026-09-27
- **Status:** DONE
- **Result:** `RESULTS/STEWARD-20260927-CFA-PLANNING-CONTEXT-FIX.md`

### HOME-UPGRADE-2026-09-27
- **Status:** DONE
- **Receipt:** `RESULTS/STEWARD-20260927-OPS-MATURITY.md`

### SESSION-LAUNCH-UPGRADE-2026-09-27
- **Status:** DONE
- **Receipt:** `RESULTS/STEWARD-20260927-SESSION-LAUNCH-UPGRADE.md`

### AGENT-SYSTEM-OPS-MATURITY-2026-09-27
- **Status:** DONE
- **Receipt:** `RESULTS/STEWARD-20260927-OPS-MATURITY.md`
