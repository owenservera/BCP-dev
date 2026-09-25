# Dependency and Impact Map

The plugin graph should be explicit metadata, not a K0-owned universal graph.

Each plugin contribution should expose: requires, provides, conflicts, data ownership, contract versions, authority requirements, evidence dependencies, replacement compatibility and affected Work/data classes.

Impact derivation can then traverse the graph when a plugin, contract, object schema or realization changes. Core need only preserve graph references and enforce admission/activation constraints.

High-centrality changes require revalidation of dependent vertical slices and destination dependencies. The graph is a program/evolution input, not the kernel's product ontology.