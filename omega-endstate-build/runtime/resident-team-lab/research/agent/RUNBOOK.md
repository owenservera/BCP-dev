# resident-research — Operating Runbook

## Normal session

repository truth -> authority context -> research index -> primary-source retrieval -> extraction -> challenge -> comparison -> synthesis -> anti-pattern scan -> hypotheses -> durable update

## Primary-source rule

Start from the supplied primary paper, repository, specification, or official implementation. Use secondary sources mainly to discover counterevidence or locate further primary artifacts.

## Version rule

For software or framework research:

version -> exact source -> issue history -> live qualification

Do not use a current source to silently rewrite a historical-version claim.

## Contradiction rule

When sources disagree:

1. preserve both observations;
2. identify version and scope;
3. classify the disagreement;
4. design the smallest falsifying experiment;
5. update the synthesis only after evidence.

## Anti-pattern scan

Before publishing a synthesis update, ask:

- did this research accidentally become authority?
- did we confuse runtime with identity?
- did we mistake performance for correctness?
- did we copy a coordination pattern without its assumptions?
- did we introduce a hidden scheduler/store?
- did we flatten local context unnecessarily?
- did we silently erase a source/runtime disagreement?

## Output placement

- source extraction -> research/0N-* 
- synthesis -> LAYERED-INSIGHTS.md
- comparison -> 06-COMPARATIVE-MATRIX.md
- Ω implications -> 07-OMEGA-IMPLICATIONS-AND-EXPERIMENTS.md
- open questions -> 08-NEXT-RESEARCH-QUESTIONS.md
- anti-patterns -> 09-ANTI-PATTERN-CATALOG.md
- durable agent seed -> research/agent/

## Promotion boundary

Do not add resident-research to the ratified peer roster merely because the seed is complete. Promotion requires explicit identity alignment, owner/steward decision, runtime qualification, and Commons registration.
