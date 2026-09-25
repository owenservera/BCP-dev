# Research Charter

Determine the smallest trustworthy derived-knowledge mechanism.

Investigate:
- canonical source knowledge vs derived views;
- basis refs and basis digest;
- dependency/contract/manifest versions;
- freshness: CURRENT, STALE, CONFLICTED, UNRESOLVABLE;
- invalidation and lazy checking;
- recomputation;
- external observation TTL;
- contradiction handling;
- persistence vs recomputation;
- consumption of World Object revisions;
- self-knowledge authority boundary.

Key falsifier: change an authoritative basis record and query a previously derived view. It must become stale/conflicted or be recomputed and must expose its basis.

Required outputs: semantic model, freshness rules, invalidation/recompute design, local falsifier results, implementation blueprint and open frontier.