# Net-New Project Spec Template

> **Copy this file, fill it in, save to `specs/proposed/<your-slug>.md`, then run `bun .backbone/admit.ts propose`.** The spec is what we review. The code is what we build. The spec is also what lives in the backbone as the design doc forever.

---

## Required Sections

### 1. Summary (one sentence)

> What is this, in plain language?

_Example: "Voice input lets the user speak instead of typing, using local speech-to-text for privacy."_

### 2. User Value (which V-1..V-5 does this serve?)

- [ ] **V-1** (Installable Windows app) — friends can use it on day one
- [ ] **V-2** (Security) — no new vulnerabilities introduced
- [ ] **V-3** (Green verification) — covered by tests
- [ ] **V-4** (Codex docs→app) — documented and linkable
- [ ] **V-5** (Kernel/plugin) — makes future features cheaper

_Explain the V-* alignment in 2-3 sentences._

### 3. User Story

> As a **[type of user]**, I want to **[do something]**, so that **[outcome]**.

_Example: "As a friend using vivim-next on a laptop, I want to dictate messages instead of typing, so that I can chat while my hands are busy."_

### 4. Acceptance Criteria (testable)

- [ ] Criterion 1 (specific, measurable)
- [ ] Criterion 2
- [ ] Criterion 3
- [ ] All existing tests still pass
- [ ] No new security warnings
- [ ] Works offline (if applicable)

### 5. Design Sketch

> How does this work? Where does it live? What does it depend on?

```
[diagram or bullet points]

Layer: surface | plugin | kernel
Folder: (proposed path)
Depends on: (kernel contracts, plugins, external libs)
External: (any new npm packages)
```

### 6. Open Questions

> What don't we know yet? What needs to be decided before building?

- Question 1
- Question 2

### 7. Alternatives Considered

> What else did we look at? Why this approach?

- **Alternative A:** [description] — rejected because [reason]
- **Alternative B:** [description] — rejected because [reason]
- **This approach:** [description] — chosen because [reason]

### 8. Risks

> What could go wrong? How do we mitigate?

- Risk 1 → mitigation
- Risk 2 → mitigation

### 9. Effort Estimate

- **Size:** XS | S | M | L | XL
- **Time:** (rough estimate)
- **Reversibility:** easy | medium | hard
- **Friend interest:** 0 | 1 | 2+ (if known)

### 10. Reviewer Sign-off

> This spec is reviewed by the principal. The reviewer either:
> - **Admits** it (creates a FEATURE_CARD, moves spec to `specs/approved/`)
> - **Sends back to research** (asks for more detail, moves to `specs/proposed/` with notes)
> - **Rejects** it (moves to `specs/rejected/` with reason)

- Reviewer: ____________
- Date: ____________
- Decision: ADMIT | RESEARCH | DROP
- Reason: ____________

---

## How This Fits in the Backbone

1. **You write the spec** (this file, filled in) in `specs/proposed/`
2. **You run admission** (`bun .backbone/admit.ts propose <slug> "<name>" '<rubric-json>'`)
3. **Rubric scores it** automatically (threshold 12/22 to admit)
4. **If you want to override the rubric**, the reviewer sign-off is where you do it
5. **If admitted**, the spec moves to `specs/approved/` and a FEATURE_CARD is created
6. **The card inherits the spec** as its design doc (linked from the card's `description` field)
7. **Implementation begins** with the card transitioning MAPPED → DESIGNED (spec is the design) → SCAFFOLDED → PARTIAL → WORKING

---

## Example: A Filled Spec (voice-input)

> See `specs/proposed/voice-input.md` for a complete example.
