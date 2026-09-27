# CFA-06 — Session Result
## M2 Minimum Join-Shape Research — 2026-09-27

- **Status:** COMPLETE
- **Agent:** capability-provider-realization
- **Primary artifact:** `M2-MINIMUM-JOIN-SHAPE-RESEARCH-2026-09-27.md`
- **Primary artifact commit:** `35b1b2c841a86f7c466a471fdc5c7331526fc1e7`

### Result

The smallest defensible M2 shape is a **typed, non-authoritative join projection**, not a new durable entity:

`Capability → Realization → Provider → Account? → Model? → Session? → Resource?`

The proposal uses revisioned references through the existing vault/data seam, keeps Authority outside the join, and leaves Work/Attempt lifecycle with CFA-05.

### Key unresolved seams

- `browser` versus `chatgpt` provider/mediation vocabulary is not yet canonical.
- Account, Model and generalized Resource records are not yet canonicalized in Ω.
- Exact Account/Session persistence and reconstruction rules remain a CFA-02 gate.
- Exact Work/Attempt attachment remains a CFA-05 gate.
- Semantic continuity requirements remain a CFA-03 gate.
- World/Resource semantics remain a CFA-01 gate.

### Verification

No peer Round-1 outputs were consumed.
No contract, manifest, vault schema, production implementation, Ω law, authority store, Work lifecycle, or second canonical data store was changed.

### Next frontier

Independent M2 design is now sufficiently characterized to await cross-CFA reconciliation of the already-persisted peer-intelligence requests.
