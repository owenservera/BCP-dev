# Experiment Matrix

> Classification: DERIVED — EXECUTED DESIGN FALSIFIERS + OPEN RUNTIME PROOFS

| ID | Experiment | Result | Status |
|---|---|---|---|
| B1 | new object full lifecycle | synthetic weather-pin traversed all lifecycle stages without type-specific storage | PROMOTION-CANDIDATE |
| B2 | object revision/history | model uses existing (ns,id,rev) append history; no overwrite required | EVIDENCE-SUPPORTED |
| B3 | conflicting relationships | competing assertions coexist in same canonical substrate | PROMOTION-CANDIDATE |
| B4 | archive/delete/restore | tombstone revision + new restore revision preserves identity/history | PROMOTION-CANDIDATE |
| B5 | export/restore identity preservation | synthetic roundtrip preserves refs/CIDs/changelog; whole-world runtime proof still open | EXPERIMENT-REQUIRED |
| B6 | Work references object without duplication | synthetic Work record stores refs only; produced object remains canonical | PROMOTION-CANDIDATE |
| B7 | derived projection changes without canonical mutation | projection mutation leaves canonical CID/revision unchanged | EVIDENCE-SUPPORTED |
| B8 | imported source changes/disappears | synthetic source disappearance leaves local object and records source-unavailable state | EXPERIMENT-REQUIRED |
| B9 | alias/collision resolution | same source identity mapped to competing objects remains contested, not auto-merged | PROMOTION-CANDIDATE |

## Test discipline

Design falsifiers may establish semantic coherence but do not establish production/runtime integration.

Every future runtime experiment must record:
- input state;
- exact canonical refs;
- expected invariant;
- observed result;
- evidence;
- failure/refusal path;
- remaining uncertainty.

Browser and AI are not required for this workstream.
