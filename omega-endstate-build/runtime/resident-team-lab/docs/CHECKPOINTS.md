# Resident Team Lab — Proof Checkpoints

> Status: PROPOSED
> Rule: do not promote the next layer until the current checkpoint has observable evidence.

## CP-00 — Baseline retained

**Question:** Can we still run the installed `opencode-swarm` substrate independently?

**Evidence:**
- existing vendored unit/typecheck evidence;
- corrected Windows lifecycle harness;
- plugin-loading assertions in `runtime/scripts/validate-swarm.ps1`.

**Promotion:** The lab may add experiments without modifying the baseline's semantics.

---

## CP-01 — Native Task permission matching

**Question:** Does OpenCode v1.18.4 mechanically enforce agent-profile-specific `permission.task` patterns?

**Smallest test:**
- root may target `resident-*`;
- root may not target `worker-*`;
- resident may target `worker-*`;
- worker may not target anything.

**Required evidence:**
- allowed Task reaches the intended child session;
- denied Task produces an explicit permission refusal;
- no child session is created for the denied request;
- actual effective permission is inspected rather than inferred from the Task tool schema.

**Failure:** Treat the permission layer as unproven. Do not design around assumed pattern enforcement.

---

## CP-02 — Real native resident → worker creation

**Question:** Can a real resident session create a real fresh worker through native `Task`?

**Required evidence:**
- parent session ID;
- child session ID;
- child agent ID;
- child `parentID) equals the requesting resident session;
- worker turn result;
- no custom spawn API;
- no `task_id) was used.

**Promotion:** Native Task becomes the experimental worker-creation primitive.

---

## CP-03 — Plugin preflight gate actually blocks

**Question:** Can the VIVIM plugin reject a disallowed Task before the native Task creates a child?

**Required evidence:**
- explicit policy decision;
- caller stable identity;
- requested target;
- refusal reason;
- plugin hook failure/denial is observed;
- no child session is created.

**Failure:** The plugin is only advisory. Do not add richer delegation semantics.

---

## CP-04 — Worker leafness

**Question:** Is the leaf boundary mechanically enforced?

**Smallest test:** worker attempts a Task call for any target.

**Required evidence:**
- Task attempt observed;
- native permission refusal and/or VIVIM refusal;
- no grandchild session;
- worker remains a leaf.

---

## CP-05 — Resident chooses worker demand

**Question:** Can a resident independently choose whether one or two workers are warranted?

**Required evidence:**
- resident's actual decision identifies separate work units;
- one or two children created accordingly;
- worker types are selected from the registered catalog;
- Steward did not enumerate the children;
- runtime enforces the ceiling without choosing the intellectual decomposition.

This is the first behavioral checkpoint for resident autonomy.

---

## CP-06 — Duplicate/idempotency boundary

**Question:** Can retry/observer interruption avoid ambiguous double creation?

**Required evidence:**
- a unique `spawn_id);
- duplicate logical request is detected or reconciled;
- no unintended second child is created;
- final state is unambiguous.

---

## CP-07 — Unsafe Task resume is rejected

**Question:** Does U1 refuse `task_id)-based reuse of an unrelated existing session?

**Smallest test:** provide the ID of an existing worker/session while requesting a different governed target.

**Required evidence:**
- deterministic refusal before unsafe reuse;
- existing session remains owned by its original lineage;
- no cross-owner prompt is executed.

**Promotion:** No resume support enters the resident runtime until a separate resume qualification passes.

---

## CP-08 — Durable lineage/evidence

**Question:** Does worker completion remain reconstructable after the immediate turn ends?

**Required evidence:**
- `spawn_id);
- parent and child IDs;
- target agent;
- lifecycle outcome;
- evidence receipt;
- repository-visible durable record.

---

## CP-09 — Controlled failure semantics

**Question:** Are refusal, creation failure, execution failure, timeout, and unknown state distinguishable?

**Required evidence:** one fixture or live test for each class.

A green process exit cannot collapse these into `completed`.

---

## CP-10 — U1 promotion

Promote U1 only when CP-01 through CP-09 pass.

U1 promotion means:

- resident-owned fresh worker creation is real;
- authorization is narrower than model intent;
- worker leafness is mechanical;
- unsafe resume is excluded;
- lineage and evidence survive the turn;
- retry/failure states are explicit.

U1 promotion does not mean the ten-resident system is operational.

---

## Later checkpoints

The following remain downstream:

- resident-owned worker pool at meaningful scale;
- direct resident-to-resident Commons;
- supervisor and resident recovery;
- ten-CFA resource admission;
- surface continuity;
- Ω-native governance migration.

No later checkpoint should be marked proven from design documents alone.
