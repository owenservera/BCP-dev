# VETO-01 Authority Promotion Criteria

This document governs experimentation around increasing the consequences of VETO-01 judgments.

## Promotion is optional

The department must not progress through all levels.

A level exists only if evidence supports it.

## A0 -> A1: opinion usefulness

Evidence sought:

- owner finds independent reviews decision-relevant;
- recommendations are specific;
- context cost is manageable;
- the reviewer identifies issues not already obvious.

## A1 -> A2: veto proposals

Evidence sought:

- reviews identify concrete mission-relevant risk;
- proposals include decisive evidence and release conditions;
- false alarms do not dominate;
- owner decisions remain practical.

## A2 -> A3: mandatory review

Evidence sought:

- a recurring decision boundary consistently benefits from review;
- manual referral is causing avoidable misses;
- automatic review initiation would not materially obstruct flow;
- the review itself can remain advisory.

## A3 -> A4: bounded blocking

Evidence sought:

- the decision class is clearly defined;
- the governor's judgment is sufficiently reliable for that class;
- false blocks are understood;
- release/unblock behavior is explicit;
- rollback is tested;
- an independent evaluator has challenged the mechanism;
- the authority is narrowly scoped.

## A4 -> A5: automatic blocking

Evidence sought:

- repeated reliable performance under real workload;
- safe failure behavior;
- durable audit trail;
- independent challenge;
- known recovery path;
- measured net value over coordination cost.

## Authority should be earned per boundary

Do not grant global power when only one decision class has been proven.

Potential authority is a mapping:

decision class × maturity layer × trigger mode × authority level

## Regression rule

A promotion should be reversible.

If false positives, missed risks, coordination delay or mission drift increase materially, reduce authority rather than rationalizing the result.

## Owner governance

The owner remains the final authority during experimental phases.

An owner override is valid evidence.

It is not a system error.
