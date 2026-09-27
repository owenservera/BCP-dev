# CFA-02 — M2 Provider Conversation Corridor Evidence
## 2026-09-27

> Status: PARTIAL / BLOCKED ON LIVE PROOF
> CFA: CFA-02 — Data Steward
> Purpose: execute the fixture/replay half of M2 and identify the minimum missing owner-machine proof.

## Result
The existing repository provides a strong fixture/replay proof of the provider conversation corridor, but not the external owner-machine proof needed to call M2 product/live complete.

## Proven fixture path
1. A recorded browser capture is redacted before vault persistence; the capture carries an integrity hash and the session cites the capture by reference.
2. Provider-browser uses a parserVersion and governed parserPins; an unpinned or mismatched realization is refused before send.
3. The standard discovery lifecycle carries evidence from perception through inference, mapping and verification into a PROMOTED browser realization.
4. A consented, promoted and pinned fixture send produces a pack-schema-exact message row, with ordered streamed chunks and stream provenance.
5. Vault verification remains green and known fixture secrets are absent from stored rows.
6. The W1 harvest falsifier separately demonstrates recorded SSE/import fixtures parsed through governed pins, with realizationRef/parserPins/provenance surviving vault round-trip and remaining queryable.

## Continuity mapping
| Stage | Evidence | Status |
|---|---|---|
| Provider/session identity | SessionRecord providerId + sessionId + live/sim distinction | OBSERVED / CURRENT |
| Capture representation | redacted capture row + captureRef + sha256 integrity | VERIFIED / CURRENT |
| Parser transformation | parserVersion + governed ParserPin + pinMatches | VERIFIED / CURRENT |
| Canonical conversation/message | ChatConversation / ChatMessage with stable IDs, writer-assigned seq and vault revisions | VERIFIED / CURRENT |
| Provider provenance | providerId + realizationRef + streamRef | VERIFIED / CURRENT |
| Evidence lineage | captureRef + discovery evidence refs + vault journal/changelog | VERIFIED / CURRENT |
| Projection/read path | chat.history and downstream derived views | OBSERVED / CURRENT |
| Vault reconstruction | vault export/import and verification | VERIFIED / CURRENT |
| Semantic cross-provider equivalence | no proof of equivalence across providers | UNKNOWN / CURRENT |
| Provider replacement continuity | no live replacement proof | UNKNOWN / CURRENT |

## Exact live-proof gap
Current provider-browser code explicitly supports a live ChatGPT descriptor and localhost CDP path, while the checked-in falsifier uses a simulated/recorded capture path.

The missing proof is therefore not 'does a browser implementation exist?' It is:

authenticated Chrome owner-machine observation → live response capture → same pinned parser → canonical/provenance persistence → vault verification

with the same continuity properties demonstrated by the fixture path and without provider-specific additions to the continuity core.

## M2 decision
**Current disposition: BLOCKED / PARTIAL.**

Fixture evidence is sufficient to preserve the M2 design direction.
Live/external proof remains required before claiming the provider corridor is empirically complete.

## No implementation authorization
No production implementation should start from this evidence alone. The current Ω parser/provider/bar architecture is already the implementation substrate; this task identifies the proof gap rather than redesigning it.

## Evidence index
1. omega-baseline/omega-final/plugins/provider-browser/test/browser-falsifier.test.ts
2. omega-baseline/omega-final/plugins/vivim-chat/test/harvest.test.ts
3. omega-baseline/omega-final/plugins/provider-browser/src/session.ts
4. omega-baseline/omega-final/plugins/provider-browser/plugin.json
5. omega-baseline/omega-final/contracts/src/chat.ts
6. omega-baseline/omega-final/docs/decisions/D-355-parser-governance.md
7. omega-baseline/omega-final/docs/decisions/D-357-browser-realization.md
8. omega-baseline/omega-final/docs/decisions/D-358-chat-storage.md
9. docs/destination/system-intelligence/findings/SI-03/SUMMARY.md
10. docs/destination/system-intelligence/findings/SI-03/EVIDENCE.md

## Integrity
- No Ω law changed.
- No shared CFA boundary activated.
- No new Round-1 peer roadmap consumed to shape the evidence.
- Fixture evidence is not presented as live proof.