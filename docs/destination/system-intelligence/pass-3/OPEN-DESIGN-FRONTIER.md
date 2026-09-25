# Pass 3 — Open Design Frontier

> Classification: DERIVED — OPEN DESIGN FRONTIER
> Status: unresolved questions intentionally preserved.

## External identity
1. What provider evidence is sufficient to assert external account identity?
2. Is profile identity sufficient, or must account identity be observed in the provider UI/network response?
3. Can one browser profile ever safely serve multiple accounts?
4. What resource granularity is required for parallel work?
5. How is session expiry detected without leaking credentials?

## Routing
6. Exact precedence when multiple scoped policies match.
7. How are “never use X” constraints represented and overridden.
8. When does a learned score become stale?
9. How should cost/performance data be normalized across providers without becoming a hidden policy engine.

## Data / World
10. Exact canonical relationship predicates and conflict semantics.
11. Whether Document/File content lives in the vault, file system, or content-addressed storage by default.
12. Whether the common object envelope is sufficient for all V1 things.
13. Product-level delete/archive semantics for source-backed objects.
14. Instance-level export manifest and external reconnect semantics.

## Work
15. Exact checkpoint boundary relative to an external side effect.
16. Idempotency and duplicate-effect detection after a crash.
17. Work cancellation semantics for already-applied external mutations.
18. Product Attention integration with Work.

## Provider knowledge
19. Exact assembly inputs required for a complete ProviderKnowledgeView.
20. How provider-specific contradictions are represented without collapsing them into one “current” fact.
21. Live healing probation and promotion criteria.
22. What constitutes a “materially different” third provider.

## Self-knowledge
23. Basis digest representation and dependency graph granularity.
24. Whether all important derived views must persist or can be recomputed.
25. External observation TTL policy.

## Composition / Forge
26. How an ordinary user reaches Forge without seeing architecture.
27. Which generated artifact classes can be auto-tested/auto-promoted within standing policy.
28. Compatibility model for replacing a Core Plugin.
29. When a new contract is a product evolution versus a developer/core change.

## Product
30. Exact product instance identity across executable replacement and restore.
31. Full first-run empty-world semantics.
32. End-user UI for route/account/session inspection.
33. Product shell / Windows integration, which remains a larger separate frontier.

**Rule: UNRESOLVED** until evidence or explicit owner decision closes each item.
