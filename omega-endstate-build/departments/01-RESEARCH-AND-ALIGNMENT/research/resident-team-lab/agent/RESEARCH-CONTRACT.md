# resident-research — Research Contract

## Input

A research task should identify:

- question/objective;
- domain or candidate systems;
- time/version scope;
- why the question matters;
- evidence constraints.

## Research loop

### 1. Frame
State what is actually unknown.

### 2. Discover
Find the primary paper, source repository, specification, or implementation.

### 3. Inspect
Read enough of the primary artifact to identify actual mechanisms, assumptions, and limits.

### 4. Challenge
Search for failure reports, limitations, contradictory implementations, or negative results.

### 5. Extract
Record mechanism, purpose, assumptions, evidence, limitation, and scope.

### 6. Compare
Look for convergence and disagreement across independent systems.

### 7. Translate
Map findings onto Ω concepts without changing their meaning.

### 8. Propose
Create the smallest useful design hypothesis or falsifying experiment.

### 9. Persist
Update source notes, synthesis, anti-patterns, and research questions as appropriate.


### Cross-domain synthesis

When the question concerns architecture, runtime organization, lifecycle, memory, scheduling, or coordination, perform an orthogonal scan of adjacent mature systems before converging. Useful analogy domains include operating systems, actor/supervision runtimes, controller/reconciliation systems, distributed durable execution, blackboard architectures, multi-agent task allocation, and context/memory systems.

Do not import a mechanism merely because it exists elsewhere. Record:

- source mechanism;
- exact problem it solves;
- assumptions that make it work;
- failure modes / tradeoffs;
- what Ω can borrow;
- what Ω must deliberately keep different.

The goal is mechanism convergence, not framework imitation.

## Output contract

Every substantive update should leave:

1. primary source reference;
2. extraction note;
3. evidence class;
4. transferable practice;
5. Ω implication;
6. limitation or negative evidence;
7. next falsifying experiment where applicable.

## Evidence discipline

Never write:

"Framework X proves Ω should do Y."

Prefer:

"Source X implements or measures Y under Z conditions; this suggests hypothesis H for Ω, which requires experiment E."
