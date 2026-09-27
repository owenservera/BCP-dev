# CFA-10 — Stage E L2 Runtime Generation / Source Basis Adapter Characterization
## 2026-09-28

> Status: **CLOSED — OWNER CHARACTERIZATION COMPLETE / RUNTIME BASIS CURRENTLY UNRESOLVABLE WITHOUT A PROVEN GENERATION BINDING**
> CFA: CFA-10 — Runtime Constitution / Core Substrate
> agent_id: `runtime-constitution-core-substrate`
> Scope: Stage-E L2 readiness characterization only. No runtime-join implementation and no K0 expansion.

## 1. Adapter identity

- **adapterId:** `cfa10.runtime-generation-source.basis@1`
- **ownerCFA:** CFA-10
- **basisKind:** `RUNTIME_GENERATION_SOURCE`
- **purpose:** expose the minimum runtime-owned basis needed for a DerivedView to determine whether a runtime-derived observation still refers to the same governed runtime generation/source.

The adapter is deliberately narrower than the full runtime state model. State/Graph/Grant/Generation remain reduction experiments rather than ratified K0 subsystems.

## 2. Canonical source / evidence

The current runtime implementation/evidence is centered on the Ω host's governed boot, compartment, lifecycle and fencing paths:

- `omega-baseline/omega-final/host/src/boot.ts`
- `omega-baseline/omega-final/host/src/worker.ts`
- `omega-baseline/omega-final/host/src/recipe.ts`
- `omega-baseline/omega-final/host/src/canon.ts`
- CFA-10 `OWNER-ALIGNMENT-2026-09-27.md`
- CFA-10 `STATE.md`
- CFA-10 `M1-K0-EVIDENCE-FALSIFIER-MATRIX-2026-09-27.md`
- CFA-10 `EXPERIMENTS/B1-CONTAINMENT-BYTE-BINDING-EXPERIMENT-2026-09-27.md`
- CFA-10 `WAVE-3-PEER-RECONCILIATION-ADDENDUM-2026-09-27.md`
- Stage-E L1 `STAGE-E-L1-DERIVED-VIEW-FRESHNESS-CONTRACT-2026-09-27.md`

The current host verifies Recipe/Manifest/content integrity and then launches Workers, but the existing Worker launch is path-based and the runtime does not currently expose a proven durable runtime-generation identity that binds an observation to immutable executed bytes.

## 3. Runtime source/generation token available today

### Proven token

**NONE / NOT YET PROVEN**

The repository contains runtime lifecycle/fencing concepts and candidate Generation terminology, but no current evidence closes a CFA-10-owned immutable generation token with a deterministic resolver.

In particular:

- `activeGenerationRef` / `workerGenerationRef` appear in architectural handoff proposals, not as a proven current runtime source primitive;
- the runtime uses `join(sourceDir, entry)` for Worker launch;
- the B1 experiment establishes that path identity does not itself prove containment or byte identity across the verify→execute interval;
- native Windows drive-letter/UNC behavior remains unverified;
- the target-runtime B1 replay is separately blocked in the hosted environment.

Therefore this adapter must **not** substitute any of the following as a proven runtime generation token:

- process id;
- Worker object identity;
- memory address;
- startup timestamp;
- filename/path alone;
- cached lifecycle state;
- Recipe name alone;
- repository commit alone when deployment/runtime byte binding is not established.

### Bounded candidate shape

Where a future proven runtime binding exists, the generic L1 BasisRef can carry:

```
{
  basisId,
  ownerRef: "cfa10",
  sourceKind: "RUNTIME_GENERATION",
  sourceRef: <attributable runtime generation reference>,
  canonicalRef?: <governed implementation reference>,
  revisionRef?: <runtime generation/source revision>,
  contentDigest?: <exact executed-source digest when proven>,
  observationRef?: <bounded runtime observation>,
  required: true,
  evidenceRefs: [...]
}
```

This is a characterization shape only. It is not a request to create a new Generation registry.

## 4. Bounded resolver characterization

The resolver must be able to answer:

`"Which governed runtime generation/source produced this observation?"`

A valid future resolver must:

1. resolve the runtime observation to an attributable governed invocation/compartment;
2. resolve that invocation to a specific active/fenced generation reference;
3. resolve the generation reference to its admitted implementation/source identity;
4. where byte identity is claimed, verify the exact executed bytes against the integrity boundary that admitted them;
5. return explicit UNKNOWN/UNRESOLVABLE when any required binding is missing.

Current repository evidence does **not** prove step 4 for the existing path-based Worker launch. The adapter therefore cannot currently certify runtime-byte currentness from source paths or repository revisions alone.

## 5. Freshness comparison rule

Once a proven runtime-generation token exists, comparison is strict identity comparison on the owner-defined generation/source basis:

- same required generation/source token and required integrity identity → **CURRENT**;
- changed generation/source token or required integrity identity → **STALE**;
- missing/ambiguous/unbound generation/source token → **UNRESOLVABLE**;
- attributable contradictory runtime evidence about the same generation binding → **CONFLICTED**.

The adapter must not derive CURRENT from:

- recent `computedAt`;
- runtime state = `ACTIVE` or `READY`;
- unchanged path/name;
- identical repository source revision without a runtime binding;
- a previous cached freshness value.

Stored freshness remains only a cache hint under L1.

## 6. STALE behavior

A runtime-derived view becomes **STALE** when the owner-defined runtime basis demonstrably changes, for example:

- the observed governed generation is replaced by a different generation;
- a required integrity/content identity changes;
- the active generation reference changes while the derived view remains pinned to the predecessor.

Retirement/fencing by itself does not prove what replacement generation produced the new observation; the adapter must have an attributable source/generation reference.

## 7. UNRESOLVABLE behavior

A runtime-derived view becomes **UNRESOLVABLE** when the system cannot attribute the observation to a sufficiently strong runtime basis, including:

- no runtime generation reference is available;
- generation reference exists only as an architectural proposal rather than a proven runtime value;
- runtime observation cannot be tied to the governed invocation/compartment;
- the admitted source cannot be bound to the executed source/bytes at the required proof level;
- target-runtime semantics required for the claim are unavailable;
- B1 containment/byte-binding remains unresolved.

This state is intentional. It prevents self-knowledge from laundering an unresolved runtime observation into CURRENT.

## 8. CONFLICTED behavior

Report **CONFLICTED** only where runtime evidence is attributable and materially inconsistent, for example:

- two incompatible generation identities are simultaneously asserted for the same governed observation;
- lifecycle/fencing evidence and active-generation attribution disagree for the same invocation.

CFA-10 records the factual conflict. It does not select semantic authority.

## 9. Evidence classification

### OBSERVED / CURRENT

- governed boot verifies Recipe signature, root-of-trust, manifest/content integrity and routing before execution;
- Worker compartments expose lifecycle/crash/fencing-relevant runtime facts;
- Worker launch is currently path-based through `join(sourceDir, entry)`;
- B1 primitive evidence confirms source-root symlink and verify→execute byte-binding gaps;
- target-runtime B1 replay is blocked in the hosted environment.

### DERIVED / CURRENT

The minimum useful runtime freshness basis must identify an attributable governed generation/source, not merely process state or a path.

### UNKNOWN / CURRENT

A proven CFA-10-owned immutable generation/source token is not currently established.

### PROPOSED / CURRENT

The conceptual future token is a typed runtime generation/source reference that can be resolved from governed invocation to admitted implementation and, when claimed, exact executed bytes.

## 10. Falsifier set

**F-10-L2-01 — Replaced generation**

A DerivedView records runtime generation G1. Replace/fence G1 and start G2.

Expected: the old view is **STALE** or **UNRESOLVABLE** until its basis is re-resolved; it must not remain CURRENT merely because the composition path/name is unchanged.

**F-10-L2-02 — Missing generation binding**

Remove or withhold the generation/source attribution for an otherwise observed runtime event.

Expected: **UNRESOLVABLE**, never guessed CURRENT.

**F-10-L2-03 — Byte-binding insufficiency**

Keep the same path/generation label but alter the bytes between integrity verification and Worker load using the known B1 mutation pattern.

Expected: the adapter cannot certify CURRENT unless the runtime mechanism demonstrably binds the executed bytes to the admitted integrity boundary.

**F-10-L2-04 — Contradictory generation evidence**

Provide two incompatible attributable generation references for the same invocation.

Expected: **CONFLICTED**, with both evidence references preserved and no authority selection.

**F-10-L2-05 — Cached-status laundering**

Persist runtime `ACTIVE` / `READY` plus old freshness and remove current generation attribution.

Expected: **UNRESOLVABLE**; cached lifecycle state cannot substitute for runtime basis identity.

## 11. Unknown / deferred items

- exact production runtime-generation token;
- exact Generation pin/resolution mechanism;
- exact runtime observation → invocation → generation reference join;
- exact executed-bytes ↔ admitted-integrity binding;
- native Windows drive-letter/UNC semantics under supported Bun runtime;
- B1 target-runtime closure;
- active Work replacement/fencing proof;
- whether generation identity must be durable or can remain bounded to a runtime observation envelope;
- whether runtime source digest must be the admitted content digest or a distinct executable-byte identity.

## 12. Boundary and non-authority statement

This adapter:

- does not create a Generation registry;
- does not ratify State/Graph/Grant/Generation experiments as K0;
- does not redefine Composition, Work, Capability, Authority or Evolution semantics;
- does not convert runtime status into semantic outcome;
- does not claim Worker isolation is an OS sandbox;
- does not choose a B1 production mechanism;
- does not implement runtime joins;
- does not change Ω law.

It provides only the bounded freshness characterization needed for later Stage-E reconciliation.

## 13. L2 closure verdict

| Closure item | Result |
|---|---|
| canonical/current source identity | **CHARACTERIZED — governed runtime observation + attributable admitted implementation** |
| comparison token | **UNKNOWN — no proven immutable runtime-generation token currently exists** |
| resolver | **CHARACTERIZED — invocation/compartment → generation → admitted implementation → byte binding when proven; current byte-binding step remains unresolved** |
| STALE condition | **CLOSED** |
| UNRESOLVABLE condition | **CLOSED** |
| CONFLICTED condition | **CLOSED** |
| evidence refs | **CLOSED** |
| falsifier | **CLOSED as proof target; execution deferred** |
| UNKNOWN / DEFERRED | **EXPLICIT with target-runtime/B1 dependency** |

**CFA-10 Stage-E L2 adapter: CLOSED FOR OWNER CHARACTERIZATION, with runtime generation/source basis explicitly UNRESOLVABLE at present.**

This satisfies the L2 owner characterization rule without pretending that a runtime generation primitive or B1 byte-binding mechanism is already proven.
