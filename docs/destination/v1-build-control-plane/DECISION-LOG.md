# V1 Build Decision Log

> Build-time decision ledger, not a replacement for Ω decision law.

## Record format
DEC-ID / date / question / evidence / decision / rejected alternatives / affected gate / product impact / promotion target

## Seeded Pass 3 decisions

| ID | Candidate | Disposition |
|---|---|---|
| D3-001 | Account is a first-class user-world relationship to Provider | carry forward as DESIGN-CANDIDATE |
| D3-002 | Session binds Account + Realization + BrowserResource when browser-mediated | carry forward as DESIGN-CANDIDATE |
| D3-003 | debugPort is locator, not sufficient identity | carry forward as EXPERIMENT-REQUIRED invariant |
| D3-004 | Routing is policy over valid candidates; learning cannot grant authority | carry forward |
| D3-005 | Common object envelope without universal semantic supertype | carry forward |
| D3-007 | Work = durable outcome identity; Intent=request; Plan=procedure | carry forward |
| D3-008 | ProviderKnowledgeView is derived, not authoritative | carry forward |
| D3-009 | Self-knowledge freshness is basis-aware | carry forward |
| D3-010 | Universal semantic object supertype | REJECTED |
| D3-011 | Copy Legacy engine/class hierarchy | REJECTED |

## Decision rule
Every new implementation choice must reference current evidence, the relevant design packet, experiment/proof when available, and whether it promotes, narrows, or rejects a prior candidate.

No local implementation preference silently becomes architecture.
