# Independent Review Questions

This file is intended for a second model, local agent, architecture reviewer, or future ChatGPT session.

## A. Substrate

1. Does current OpenCode provide enough server/session semantics to support ten resident CFA sessions?
2. Are session IDs durable across background-service restart?
3. Does the target OpenCode release reliably support async wake of idle sessions?
4. Are `/global/event` and `/session/status` sufficient for lifecycle detection?
5. Is one server preferable to one server per CFA for the target Windows workload?

## B. Residency

6. Is "resident = addressable/stateful/waiting" the correct interpretation?
7. What information must be persisted outside OpenCode to reconstruct the team?
8. What is the minimum supervisor state that can survive its own crash?
9. What happens when an OpenCode session disappears but the CFA identity must survive?

## C. Communication

10. Should peer CFAs communicate directly through Commons with the runtime acting only as delivery infrastructure?
11. Does any existing Commons rule incorrectly assume peers are spawned on demand?
12. How should direct peer REQUEST/OBJECTION/HANDOFF delivery be correlated with OpenCode prompts?
13. What exact semantics are needed when two peers concurrently claim a handoff?

## D. Authority

14. Does resident runtime accidentally become a new scheduler/task manager?
15. Can the owner address individual CFAs without creating a second authority path?
16. How do we distinguish "CFA recommends" from "Steward decides" from "owner authorizes"?
17. Does the existing Owner Delegation document need to be amended before implementation?

## E. Evidence

18. What is the minimum proof that an async OpenCode prompt actually caused a model turn?
19. What is the proof that no duplicate turn occurred after retry?
20. What is the proof that an idle CFA really remains resident rather than merely having an old session row?
21. What is the minimum restart/recovery evidence needed for the "persistent" claim?

## F. Performance

22. What are the CPU, memory and provider-concurrency implications of ten resident sessions?
23. Is one OpenCode server with ten sessions materially different from eleven servers?
24. Should all ten sessions share one provider/model or should each CFA have its own model configuration?
25. Can resident sessions remain idle cheaply, or does the target release maintain significant per-session process state?

## G. Safety / failure

26. What happens if the supervisor sends a wake to the wrong session?
27. What happens if OpenCode silently changes the selected agent?
28. What happens if the event stream misses a terminal event?
29. What happens if the server accepts a prompt but fails before execution?
30. What happens if the server executes but the supervisor dies before observing completion?

## H. Architecture

31. Does the resident team require any change to the ten-CFA constitution?
32. Can runtime residency remain entirely below the existing architecture semantics?
33. Is the proposed Team Runtime truly infrastructure, or is it accidentally becoming a new architectural agent?
34. Does the design preserve:
   - EVIDENCE != REPRESENTATION != DESCRIPTION != AUTHORITY
   - confidence != proof
   - candidate != realization
   - unknown != failure

## I. Implementation order

35. Is R0-R3 sufficient as the first proof?
36. Should the M0/M1 work be amended to incorporate runtime residency before code changes begin?
37. Which part must be proven on the actual Windows/OpenCode machine first?
38. What assumptions in this dossier should be explicitly downgraded from HIGH-CONFIDENCE DESIGN INFERENCE to HYPOTHESIS?

## Requested reviewer output

A second reviewer should classify each major proposition as one of:

- CONFIRMED
- HIGH-RISK
- HYPOTHESIS
- FALSIFIED
- NEEDS LOCAL PROOF

The reviewer should not rewrite the architecture merely because an alternative is imaginable. It should identify where evidence contradicts the proposed design and where implementation risk is material.

