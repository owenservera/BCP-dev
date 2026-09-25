# PRODUCT_VISION

> Context package for the Product Vision / destination-discovery fork.

## Files

### STATE.md
Read first. Compact handoff containing the current destination vision, product model, program state, vertical slices, keystone dependencies, dark-matter frontier, and fresh-session rules.

### SESSION-2026-09-25.json
Machine-readable session/source capture containing the substantive decisions and conversation index that led to the current state.

## Relationship to repository truth

This package exists so a fresh conversation can recover the relevant context without relying on chat history.

It does not replace:
- current code and tests;
- explicit Ω canonical contracts/decisions;
- docs/destination/;
- docs/agent-system/.

If the package conflicts with current repository evidence, the repository wins and this package should be refreshed.

## Fresh-agent entry point

Start with STATE.md. Use the JSON when historical rationale is useful. Then continue into docs/destination and the program-control artifacts.