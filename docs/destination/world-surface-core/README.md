# VIVIM World / Surface Projection Core

Research/design lane F. Browser and AI providers are not required.

Mission: define how canonical World/Object state is projected into Canvas, Workspace, Chat, panels and other surfaces without making UI state canonical.

This lane owns surface/projection/reconstruction semantics. It does not own the canonical object model, Work semantics, Product Instance lifecycle or full frontend.

## Research output

- `RESEARCH-RESULTS.md` — semantic boundary, projection model, mutation flow, staleness, reconstruction, harvest conclusions.
- `FALSIFIER-BLUEPRINT.md` — deterministic falsifiers for the thin inspection/projection harness.
- `EXPERIMENT-MATRIX.md` — experiment inventory.

## Core invariant

**Canonical World/Object state survives surface deletion, layout corruption, projection staleness and surface replacement.**

A surface is a projection and interaction boundary. It is never canonical identity/storage/authority.
