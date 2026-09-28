# Governance-of-Governance Guide

This is the department's guide for reasoning about changes to governance itself.

## The governance object

Treat a governance mechanism as a first-class object with:

- purpose;
- trigger;
- scope;
- authority;
- evidence basis;
- affected actors;
- cost;
- failure modes;
- override;
- rollback;
- retirement condition.

## Questions before changing governance

1. What recurring problem are we solving?
2. Why is the current mechanism insufficient?
3. What evidence shows recurrence or material impact?
4. What is the smallest change that tests the hypothesis?
5. Can the experiment be isolated?
6. Who is independent of the change?
7. What happens if the new governance mechanism is wrong?
8. How is override represented?
9. How is the mechanism retired?
10. Does this increase the organization's ability to serve the beta mission or merely increase organizational complexity?

## Governance capture tests

Look for changes that:

- make challenge harder;
- make authority ambiguous;
- turn advisory advice into de facto law;
- make the organization dependent on itself;
- hide decision provenance;
- make rollback difficult;
- optimize institutional survival over product delivery.

## Governance maturity

Do not move from advisory -> mandatory -> blocking because the technology exists.

Move only when evidence shows that the prior mode is useful, its failure modes are understood well enough, and the new authority has bounded scope and recovery.

## Owner override

Owner override is a legitimate governance path.

Treat overrides as data for improving the model, not as violations to suppress.
