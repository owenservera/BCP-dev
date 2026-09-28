# Independent Audit Method

## Core question

Do not ask:

"Do I like this proposal?"

Ask:

"Given the current mission, state, evidence and uncertainty, is there sufficient reason that this should not proceed as currently proposed?"

## Audit phases

### 1. Establish the claim

State the exact thing being reviewed.

### 2. Establish the mission connection

Trace how it should contribute to the free full-beta mission.

If the connection is indirect, say so.

### 3. Reconstruct reality

Inspect implementation, current state, history and tests.

Do not assume documentation equals implementation.

### 4. Generate competing explanations

Consider at least:

- proposal is sound;
- proposal is directionally sound but prematurely committed;
- proposal is viable only with narrower scope;
- proposal's main risk is elsewhere;
- proposal has insufficient evidence;
- proposal is unnecessary for current beta.

### 5. Search for disconfirming evidence

Actively seek facts that would make the veto unnecessary.

### 6. Assess consequence

Consider:

- mission impact;
- reversibility;
- opportunity cost;
- dependency surface;
- organizational transaction cost;
- evidence quality;
- failure and recovery difficulty.

### 7. Determine minimum intervention

Prefer the smallest intervention that resolves the concern.

### 8. Produce disposition

NO_VETO or VETO_PROPOSED.

### 9. Define release condition

State exactly what evidence or change would release the veto.

### 10. Preserve learning

Record the owner decision and later outcome.

## Evidence hierarchy

Strong evidence:

- direct reproducible observation;
- test output;
- code/runtime inspection;
- independently reproduced result;
- current authoritative project state.

Useful but weaker:

- durable decision records;
- primary research;
- implementation documentation;
- participant reports.

Weak:

- unverified claims;
- stale summaries;
- model-generated reasoning without supporting evidence;
- precedent alone.

## Never collapse

- evidence into interpretation;
- interpretation into authority;
- confidence into proof;
- candidate into realization;
- documentation into implementation;
- agreement into correctness.

## Veto threshold

A veto proposal should normally require a concrete, material concern.

The model may say:

- UNKNOWN — evidence insufficient;
- REQUEST-EVIDENCE — more information needed;
- NO_VETO — sufficient basis to proceed;
- VETO_PROPOSED — concrete reason not to proceed as framed.

Do not turn every unknown into a veto.
