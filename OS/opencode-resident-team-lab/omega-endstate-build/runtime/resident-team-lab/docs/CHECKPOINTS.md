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

## CP-01 — Task permission matching

**Question:** Does the installed OpenCode build mechanically enforce agent-profile-specific `permission.task` patterns?

**Smallest test:**
- root may target `resident-*`;
- root may not target `worker-*`;
- resident may target `worker-*`;
- worker may not target anything.

**Required evidence:**
- allowed Task reaches the intended child session;
- denied Task produces an explicit permission refusal;
- no child session is created for the denied request.

**Failure:** Treat the permission layer as unproven. Do not design around assumed pattern enforcement.

---

## CP-02 — Native resident → worker creation

**Question:** Can a real resident session create a real worker through native `Task`?

**Required evidence:**
- parent session ID;
- child session ID;
- child agent ID;
- parent/child relationship;
- worker turn result;
- no custom spawn API.

**Promotion:** The native Task tree becomes the experimental execution primitive.

---

## CP-03 — Plugin observes the delegation boundary

**Question:** Does the VIVIM plugin reliably observe Task calls and child lifecycle events?

**Required evidence:**
- Task call ID;
- caller session;
- target agent;
- created child session;
- lifecycle timestamps;
- correlation record that survives the parent turn.

**Failure:** Improve instrumentation before adding policy semantics.

---

## CP-04 — Deterministic delegation refusal

**Question:** Can the VIVIM layer deny a spawn that configuration/native permissions should not authorize?

**Required evidence:**
- explicit refusal;
- caller identity;
- target;
- delegation reason;
- no child created.

**Promotion:** Only then add richer delegation grants.

---

## CP-05 — Resident chooses worker count/type

**Question:** Can a resident independently decide that it needs multiple workers?

**Required evidence:**
- resident's reasoning identifies separate work units;
- multiple children created from the resident;
- distinct worker roles;
- resident receives and synthesizes results;
- Steward did not enumerate the workers.

This is the first behavioral checkpoint for genuine resident autonomy.

---

## CP-06 — Durable lineage and evidence

**Question:** Does worker disappearance leave a durable, verifiable lineage?

**Required evidence:**
- parent and child IDs;
- execution outcome;
- evidence receipt;
- repository-visible or otherwise canonical durable record.

---

## CP-07 — Resident-to-resident Commons

**Question:** Can two residents communicate laterally without the Steward relaying messages?

**Required evidence:**
- sender/recipient durable identities;
- typed communication;
- persisted message;
- explicit distinction between opinion/finding and authority.

---

## CP-08 — End-state governance migration

Only after CP-01 through CP-07 pass should we decide which substrate mechanisms are absorbed, replaced, or retired in the Ω runtime.

Until then, `opencode-swarm` remains a valid fallback baseline.
