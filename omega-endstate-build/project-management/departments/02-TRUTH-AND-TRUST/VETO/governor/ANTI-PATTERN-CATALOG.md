# VETO-01 Anti-Pattern Catalog

This catalog is a challenge surface, not an immutable taxonomy.

When auditing agent organizations, actively look for these failure modes.

## Identity and lineage

1. Identity/session confusion — treating runtime session IDs as durable agent identity.
2. Name equals authority — granting power because an agent has a recognized name.
3. Resume equals new spawn — losing continuity when work resumes.
4. In-memory lineage — losing causal history outside volatile runtime state.
5. Publication equals blueprint — treating a result artifact as equivalent to the process that produced it.
6. Hidden lineage — changes cannot be traced to source, variant, evaluator and decision.

## Authority and governance

7. Permission equals authority — confusing what a runtime permits with what the organization authorizes.
8. Boolean delegation — reducing nuanced authority to allow/deny without scope, purpose or lineage.
9. Task denied equals leaf — assuming inability to spawn fully defines a useful specialist.
10. Self-granted authority — an agent can increase its own permissions or role.
11. Authority laundering — advisory language becomes binding through repetition.
12. Shadow governance — informal rules override durable governance records.
13. Governance capture — the organization optimizes for its own continuation.
14. Veto inflation — every uncertainty becomes a stop condition.
15. Veto paralysis — review latency or excessive blocking overwhelms delivery.
16. Permanent veto — a temporary concern becomes irreversible law.

## Work and coordination

17. Session tree equals work graph — runtime nesting is mistaken for actual dependency structure.
18. Hidden scheduler — orchestration logic emerges implicitly inside prompts or plugins.
19. Coordination explosion — too many agents create more communication cost than productive work.
20. Message ping-pong — agents repeatedly exchange low-value turns.
21. Ownership ambiguity — nobody can identify who owns the next consequential action.
22. Completion equals acceptance — finished execution is mistaken for verified success.
23. Retry without idempotency — repeated execution creates duplicate side effects.
24. Happy-path-only coordination — failure, interruption and recovery are not designed.

## Evidence and evaluation

25. Result equals proof — an agent's answer is treated as evidence.
26. Confidence equals proof — model certainty is substituted for observation.
27. Agreement equals correctness — multiple agents converging is treated as validation.
28. Single-judge certainty — one evaluator is treated as objective.
29. Position/artifact bias — evaluation changes because of presentation rather than substance.
30. Sycophantic evaluation — the evaluator changes judgment merely because a participant argues persuasively.
31. Evaluation leakage — the judge sees information that should be held out.
32. Train-on-failure confusion — the system learns from an unlabelled outcome before establishing whether the failure diagnosis was correct.
33. Stale-state acceptance — historical evidence is treated as current.
34. Source/runtime disagreement erased — documentation wins without inspecting execution.

## Context and knowledge

35. Context flooding — more context is assumed to mean better judgment.
36. Context capture — reviewer sees only the producer's framing.
37. Research memory equals authority — a stored summary becomes a rule without validation.
38. Knowledge recreation — every session rebuilds expertise from scratch.
39. Atomic evidence loss — conclusions cannot be traced to small decisive observations.

## Organization and evolution

40. Premature specialization — persistent roles are created before recurring demand exists.
41. Organizational inflation — complexity grows faster than productive capacity.
42. Tool dependence — a role becomes defined by a specific vendor tool rather than capability.
43. Provider lock-in — process assumes one model/runtime/provider without evidence.
44. Live self-mutation — a running system changes the rules governing itself without an independent decision point.
45. Evolution by fashion — adopting a fashionable architecture without a measured problem.
46. Evolution without baseline — a change is declared better without comparing to the previous state.
47. Evolution without holdout — improvements are measured only on the cases used to guide them.
48. Evolution without archive — unsuccessful variants and their reasons are erased.
49. Evolution without rollback — the system cannot return to a known-good prior state.
50. Self-improvement mission drift — improving the organization becomes more important than the product mission.

## Governor-specific discipline

51. Preference masquerading as risk.
52. Vague veto with no concrete target.
53. Veto with no release condition.
54. Veto based solely on prior vetoes.
55. Reviewer becomes implementation team.
56. Reviewer becomes approval authority by implication.
57. Review overhead is never measured.
58. Prevented failures are claimed without counterfactual evidence.
