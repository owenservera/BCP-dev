# CFA-05–10 — One-Shot Launch Router

## Canonical protocol
https://github.com/owenservera/BCP-dev/blob/main/AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CORE-FUNCTION-AREA-ONE-SHOT-BOOTSTRAP.md

## Execution order

Run **serially**:

1. CFA-05
2. CFA-06
3. CFA-07
4. CFA-08
5. CFA-09
6. CFA-10

This is context accumulation, not authority ordering.

## Launch rule

For each CFA:

→ run its one-shot wrapper  
→ allow Owner Dialogue / Alignment to occur  
→ only after alignment, allow identity creation and execution  
→ commit durable artifacts to `main`  
→ record exact SHA + completion state  
→ STOP  
→ pass the resulting durable state to the next CFA

## Predecessor context

- CFA-05: CFA-01–04 Round-2 audit
- CFA-06: CFA-01–04 audit + CFA-05 durable bootstrap/identity artifacts
- CFA-07: all prior durable CFA-05–06 artifacts
- CFA-08: all prior durable CFA-05–07 artifacts
- CFA-09: all prior durable CFA-05–08 artifacts
- CFA-10: all prior durable CFA-05–09 artifacts

## Do not

- launch all six blindly in parallel;
- self-ratify identity;
- activate shared boundaries;
- rewrite Ω law;
- replace the domain seed with the reusable protocol;
- treat peer conclusions as authority.

## First launch
CFA-05 is next.
