# Research Scope

## Primary question

> What is the smallest Ω Core that can safely host the full intended VIVIM product and its future extensions without embedding product/domain meaning into the kernel?

## Required passes

### Pass A — Archaeological inventory
Map the legacy and Ω implementations that were previously called CORE, K0, K1, generic, system plugin, provider, surface, tooling, or similar.

### Pass B — Destination inventory
Enumerate every major destination responsibility from the current→destination map, including hidden joins.

### Pass C — Semantic ownership
For each responsibility, determine who defines its meaning and who enforces its boundary.

### Pass D — Boundary decomposition
Split mixed areas into mechanism / contract / plugin / tooling where possible.

### Pass E — False-Core audit
Try to move apparently central responsibilities outward and determine whether a real non-bypassable dependency prevents doing so.

### Pass F — Plugin generality audit
For each proposed system plugin, ask whether a legitimate third-party plugin could use the same boundary without special-case paths.

### Pass G — Evolution audit
Determine what happens when each responsibility changes, is replaced, becomes incompatible, or is removed.

### Pass H — Integration audit
Trace boundary effects through World, Work, Authority, Evidence, Self-Knowledge, Spatial Intent, Product Instance, surfaces, providers, and resource lifecycle.

## Explicit non-goals
- redesigning the entire Ω architecture from scratch;
- implementing the migration;
- creating another plugin framework;
- turning current proposals into ratified law without evidence;
- optimizing for plugin count as a metric.