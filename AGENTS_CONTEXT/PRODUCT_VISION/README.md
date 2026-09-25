# PRODUCT_VISION

> Context package for the Product Vision / destination-discovery fork.

## Files

### STATE.md
Read first. Compact handoff containing the current destination vision, product model, program state, vertical slices, keystone dependencies, dark-matter frontier, and fresh-session rules.

### SESSION-2026-09-25.json
Machine-readable source/context capture for the earlier destination-discovery session.

### CONVERSATION-2026-09-25-SYSTEM-INTELLIGENCE.json
Machine-readable export of the current System Intelligence discussion, including Wave 1 results, Pass 2 strategy, V1 capability-floor clarification, and resume context.

### HANDOFF-2026-09-25.md
Fresh-chat handoff with current state, confirmed findings, open questions, sequencing, and the explicit next action.

### PASS-2-LAUNCH-PROMPT-2026-09-25.md
Preserved operating prompt for the current Structural Coverage & Falsification pass, so a fresh agent can recover exactly what the running research pass was instructed to do.

## Relationship to repository truth

This package exists so a fresh conversation can recover the relevant context without relying on chat history.

It does not replace:
- current code and tests;
- explicit Ω canonical contracts/decisions;
- docs/destination/;
- docs/agent-system/.

If the package conflicts with current repository evidence, the repository wins and this package should be refreshed.

## Fresh-agent entry point

Start with STATE.md. Then read HANDOFF-2026-09-25.md. Use CONVERSATION-2026-09-25-SYSTEM-INTELLIGENCE.json when detailed rationale is useful. Then continue into docs/destination, System Intelligence, and the program-control artifacts.