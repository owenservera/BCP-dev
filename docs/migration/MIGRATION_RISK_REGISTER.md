# Migration Risk Register — severity, evidence, mitigation, consequence, next action

> Severity: CRITICAL (slice cannot honestly complete) / HIGH / MEDIUM / LOW.
> Every risk carries evidence, not adjectives.

## R-1 Legacy dependency leakage (VIVIM monolith imported into Ω)

- Severity: CRITICAL. Evidence: 200-model Prisma schema + 186-file engine surface
  make wholesale import tempting. Mitigation: one-way adapter (knowledge →
  serialized data → Ω), zero Ω core edits this slice, verify script asserts no
  VIVIM imports. Consequence if realized: Ω replaceability destroyed.
  Next: keep the import-surface gate green; re-assert every migration.

## R-2 Duplicate provider registries (manifest vs plugin vs generated protocol)

- Severity: HIGH. Evidence: ChatGPT represented in manifests.ts AND plugins/chatgpt.ts
  with overlapping but non-identical fields (OBSERVED both). Mitigation: ADAPTER
  verdict, both pinned as assay input, authority UNKNOWN. Consequence: wrong
  single-source choice silently drops behavior. Next: Migration #2 forces the verdict.

## R-3 Duplicate plugin interfaces (old vs new ProviderPlugin)

- Severity: HIGH. Evidence: provider-plugin-interface.ts + plugin.ts + plugin-registry.ts
  + registry.ts coexist (file inventory). Mitigation: slice consumes behavior, alters
  neither registry. Next: interface genealogy trace before Migration #2.

## R-4 Governor boundary leakage (direct CDP reach / proxy bypass)

- Severity: HIGH. Evidence: exclusivity is DOCUMENTARY (G-1/G-2), scan outstanding.
  Mitigation: V-3 import scan + per-method proxy audit are required verification,
  not optional. Consequence: browser authority claims are fiction until proven.
  Next: run the scan; publish the importer list.

## R-5 Runtime-vs-persistence confusion (profile vs DB vs runtime)

- Severity: MEDIUM. Evidence: triple-layer state invariant exists but kill/restart
  proofs outstanding (G-9, Q7/Q8). Mitigation: login-truth pinned to cookie files;
  restart test deferred explicitly. Next: Chrome restart + CDP disconnect injection
  with the live run.

## R-6 Parser migration (DB-only logic → governed pins)

- Severity: MEDIUM. Evidence: DB-only invariant + fallback chain OBSERVED; ChatGPT
  grammar detail UNKNOWN. Mitigation: pin LAW migrated (D-355/D-385), grammar
  deferred. Consequence: premature grammar port bakes in wrong semantics.
  Next: parser assay with recorded ChatGPT streams before any live send.

## R-7 Selector migration (DOM knowledge → op-map data)

- Severity: MEDIUM. Evidence: 3+3 ChatGPT selector variants OBSERVED; drift
  handling lives in healing (probation states OBSERVED). Mitigation: selectors as
  data, healing owns drift. Next: drift-seed falsifier for the ChatGPT selector set.

## R-8 Conversation semantic drift (identity/dedup/replay)

- Severity: MEDIUM. Evidence: identifier list INFERRED; dedup/replay UNKNOWN.
  Mitigation: no identity contract pinned this slice; chat pack-schema future work.
  Next: lifecycle trace + duplicate-request injection with the live run.

## R-9 Stream block loss (partial/malformed streams)

- Severity: MEDIUM. Evidence: normalize/validate + fallbackDepth OBSERVED;
  ChatGPT completion detection UNKNOWN. Mitigation: sequence discipline + refused-
  never-truncated law carried into the slice contract. Next: partial-stream +
  parser-fallback injection tests.

## R-10 Auth/profile drift (login truth vs session rows)

- Severity: HIGH if live scope expands; LOW for this slice (existing profile
  assumed, recovery excluded). Evidence: per_account strategy + cookie-truth
  OBSERVED. Next: isAuthenticated→relogin path proof with the live run.

## R-11 Insufficient live proof (fixture presented as live)

- Severity: CRITICAL (evidence-law violation). Evidence: none claimed — record
  labels LIVE as UNVERIFIED. Mitigation: proof-ladder labels enforced by the
  verify script (fixture≠live assertion). Next: the named live unblock in
  FIRST_VERTICAL_SLICE §6, independently witnessed.
