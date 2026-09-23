# Migration Graph — living inventory (Prompt 2, §§16–17, 22)

> BCP answers, with provenance: what remains, what is blocked, what depends
> on what, which Ω capabilities are missing, where evidence is weak.
> Updated per completed migration. Counts are mechanical (records + checker);
> judgments are cited to records.

## Nodes

```text
VIVIM prototype (6,948 files, mine — never ported)
├── LEGACY CAPABILITY: ChatGPT send_message
│     ├── assay OBSERVED (16 pins, 0 drift) → behavior spec → TRANSFORM
│     ├── Ω mapping → message.send@1 / provider-browser (BROWSER_MEDIATED)
│     ├── MIG-001: VERIFIED (static+fixture proven; live+regression unverified)
│     └── evidence: record + 4 artifacts + DISC-022/023
├── LEGACY CAPABILITY: Claude send_message
│     ├── assay OBSERVED (8 new pins + 7 shared-leg cites) → spec (+I-7) → TRANSFORM
│     ├── Ω mapping → message.send@1 / provider-browser (same op, new data)
│     ├── MIG-002: VERIFIED (static+fixture proven; live+regression unverified)
│     └── evidence: record + 4 artifacts + DISC-024/025
├── LEGACY CAPABILITY: Gemini send_message ......... UNMIGRATED (next: #3)
├── LEGACY CAPABILITY: browser authority (Governor) . UNRESOLVED (exclusivity documentary)
├── LEGACY CAPABILITY: discovery/onboarding ........ UNRESOLVED (no assay yet)
├── LEGACY CAPABILITY: conversation storage ....... UNRESOLVED (D-378 gap noted)
└── LEGACY CAPABILITY: provider registry authority  PARTIALLY RESOLVED (Prompt-03: manifest→DB→generated file is the live path, STRONGLY_INFERRED; plugin classes RETIRE; unified interface is the new-provider write path)
├── FORENSIC FINDINGS (Prompt-03, code-grounded — see FORENSIC_EVIDENCE.md + DISC-026/027):
│     ├── Governor NOT sole authority (raw-transport consumer autonomous-execution→grounding)
│     ├── Harness capture-in-DAG deadlocks on non-reentrant mutex (STRONGLY_INFERRED)
│     ├── recoverAuth broken by default wiring (contract declares, class lacks)
│     ├── Execution-path slave resolution account-blind (slaves[0])
│     ├── Unknown harness actions succeed vacuously; capture-timeout resolves empty
│     ├── Discovery→program/selector bridge MISSING (discovered providers unexecutable until authored)
│     └── Dedup mechanical via identityHash (OBSERVED) — portable as-is
Ω destination (untouched: 0 core edits across both migrations)
├── message.send@1 (reused ×2) · provider-browser · vivim-providers
├── parser pins (D-355) + fence (D-385) + sequencing (D-352) — bars passed by construction
├── MISSING: block-kind vocabulary (U-5 — reasoning/tool-call representation)
└── MISSING: chat pack-schema for vault message rows (MIG-001 L-5, still open)
```

## Status table

| Capability | Assay | Canonicality | Ω target | Migration | Verification | Disposition |
|---|---|---|---|---|---|---|
| ChatGPT send_message | done | TRANSFORM | message.send@1 | MIG-001 | static+fixture PROVEN; live UNVERIFIED | Transformed |
| Claude send_message | done | TRANSFORM | message.send@1 | MIG-002 | static+fixture PROVEN; live UNVERIFIED | Transformed |
| Gemini send_message | none | UNKNOWN | message.send@1 (predicted) | none | none | UNKNOWN |
| Governor exclusivity | partial (scan) | UNKNOWN | TBD | none | none | UNRESOLVED |
| Discovery machinery | none | UNKNOWN | TBD | none | none | UNRESOLVED |
| Registry authority | observed (×3 reps) | UNKNOWN | TBD | none | none | UNRESOLVED |

## Readiness (per capability — READY / NOT_READY / BLOCKED / UNRESOLVED + reason)
- Gemini send_message: NOT_READY (no assay; predicted READY-after-assay — same
  class as #1/#2, Quill composer + button submit + Google stream transport).
- Governor migration: UNRESOLVED (needs per-method proxy audit + determinism
  proof before any mapping).
- Block-kind vocabulary: BLOCKED on Ω design decision (human) — text paths
  proceed; reasoning/tool paths carry I-7 unresolved.
- Live proof (both migrations): BLOCKED on authenticated profiles + Chrome +
  independent witness (environmental, not architectural).

## Weak-evidence list
- LIVE/REGRESSION unverified ×2 (environmental; unblocks documented).
- Manifest-vs-plugin-vs-interface authority (UNKNOWN ×2, growing — Gemini is
  the forcing function).
- Identity/dedup exactness (INFERRED ×2, never live-proven).
- BCP unit tests 26/28 (2 pre-existing stale assumptions — maintainer loop).
