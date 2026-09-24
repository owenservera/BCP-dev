# WS-010 Round 2 — Relationship Falsifier Matrix

> **Classification: DERIVED — PROPOSED (WS-010 research, not authority)**
> Every edge below carries class + provenance answering "Why does this
> relationship appear?" Receipt-less edges do not render (R-GRAPH).

## Y-CLASS — classification re-verified on corpus

| # | Edge | Class | Provenance (why it appears) |
|---|---|---|---|
| Y1 | FAM-09.1 --requires(L1)--> FAM-11.1 (C13) | EXPLICIT | `deps.yaml` row |
| Y2 | Ω-0 --depends-on--> CORE (C6) | EXPLICIT | `layers.json` row |
| Y3 | MIG-001 --sources--> 16 paths @sha256 (C10) | EXPLICIT | record `source_locations[]` |
| Y4 | MIG-001 --targets--> message.send@1 (C10) | EXPLICIT | record `omega_target` |
| Y5 | MIG-001 --discards--> monolith/Prisma-port (C10) | EXPLICIT | record `transformation.discarded` (negative provenance) |
| Y6 | D-456 --removes-concept--> Ollama-first (C5) | EXPLICIT | record Decision + Consequences inventory |
| Y7 | PKT-002 --ingests--> HANDOFF-002/3/4 (C9) | EXPLICIT | packet header source list |
| Y8 | PKT-002 --extends--> PKT-001 (C9) | EXPLICIT | header "extends, does not replace" |
| Y9 | CURRENT --evidence-linked--> PKT-005/HANDOFF-009 (C1) | EXPLICIT | mapping rows (D-DOG-01) |
| Y10 | IMPL-03 --authored--> PKT-005 (C8) | EXPLICIT | ROSTER + packet authorship |
| Y11 | Merge commit --closes--> PR #8 (C7) | MECHANICALLY DERIVED | `Merge pull request #N` message parse (rule MD-MSG) |
| Y12 | Lease-expiry → `stalled` (sweep §2 pattern) | MECHANICALLY DERIVED | rule MD-SWEEP2 (inputs preserved) |
| Y13 | `merging` rollup (sweep §4 pattern) | MECHANICALLY DERIVED | rule MD-SWEEP4, rendered `merging@sweep-depth-math` |
| Y14 | provider-* kinship (C14) | HEURISTIC, REJECTED | rule H-PATHSIM; rejected by D-456/D-420 (preserved rejection) |
| Y15 | MIG-003 mapping --targets--> parser contribution (C11) | HEURISTIC-as-PROPOSED | unratified mapping file; dashed + `unratified` badge |
| Y16 | MIG-003 assay --cites--> MIG-002 legs (C11) | EXPLICIT | assay §A header ("shared legs cited from MIG-002") |
| Y17 | Ten-vs-nine --conflicts-with-- (C12) | EXPLICIT (pair) | both sides cited; resolution OWNED by PR #11 (recorded wait) |
| Y18 | C15 gap --gated-by--> sunset clause | EXPLICIT | CURRENT-CONTEXT unresolved list |
| Y19 | file --generated-by--> generator | only where registered/banner-stated | librarian row / banner; else UNRESOLVED (U6) |
| Y20 | agent --owns--> artifact (any corpus case) | NO EDGE (correct absence) | A8: no source cell anywhere in corpus |

## Y-PROX — proximity / activity / recency / similarity are never edges

Tested lures and their correct handling: shared `provider-` prefix (Y14,
rejected); lease-adjacency suggesting ownership (Y20, absent); recent log
activity suggesting task-holding (leases.yaml all-closed → no
--holds-task-- derived); same-folder residence (WS-010 files co-located,
no inter-file edges asserted); recency of tip vs authority (newer packet
never outranks older RATIFIED — Q6). PASS: zero factual edges from
non-sources in the corpus rendering.

## Y-CONF — inferred-vs-explicit conflict (Q8)

When H-PATHSIM's implied merge met D-456/D-420's explicit distinction,
explicit won and the heuristic was preserved as rejected-candidate with
reason. Rule adopted: **rejection is preservation** — deleting a
considered-and-rejected inference destroys knowledge of the trap. The
rejected edge renders only in audit/forensic projections, never in
default views. PASS.

## Y-JUST — "why does this relationship appear?" receipt audit

All 20 rows above answer the question from a cell or rule id. Counter-test:
the zoom ladder PROGRAM→TERRITORY→WORKSTREAM (C1/C2 placement) produces NO
row here by design — grouping without containment evidence renders via
`shown-with` presentation grouping (PRESENTATION-VS-SEMANTICS §S-LAYERS),
which is explicitly NOT a relationship and carries no receipt because it
asserts nothing. PASS.
