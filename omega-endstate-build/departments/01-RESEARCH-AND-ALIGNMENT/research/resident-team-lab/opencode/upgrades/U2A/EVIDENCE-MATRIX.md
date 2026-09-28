# U2A Evidence Matrix

| Claim | Evidence class | Status | Required proof |
|---|---|---|---|
| Department identity can outlive session | DESIGN-CONCLUSION | OPEN | Restart/session-replacement fixture |
| Resident identity can outlive session | DESIGN-CONCLUSION | OPEN | Fresh-session continuation test |
| Capability can materialize multiple instances | DESIGN-CONCLUSION | OPEN | Parallel same-capability work |
| Dormant resident remains valid | DESIGN-CONCLUSION | OPEN | Durable state with no active session |
| Trigger causes bounded wake | DESIGN-CONCLUSION | OPEN | Event -> one admitted turn |
| Related events coalesce | DESIGN-CONCLUSION | OPEN | Burst fixture |
| Context projection stays narrow | DESIGN-CONCLUSION | OPEN | Token/content comparison |
| Background sentinel stays bounded | DESIGN-CONCLUSION | OPEN | Repeated-trigger budget test |
| Attention budget is enforced | DESIGN-CONCLUSION | OPEN | Foreground/background contention |
| Restart restores resident state | DESIGN-CONCLUSION | OPEN | Runtime restart recovery |
| Background cannot bypass authority | DESIGN-CONCLUSION | OPEN | Consequential-action refusal fixture |
| OpenCode can host fresh/background children | OFFICIAL-DOCS + SOURCE-EXACT | PARTIAL | Version-specific live proof |
| V2 context hook can alter model-visible context | OFFICIAL-DOCS | FORWARD-LOOKING | V2-targeted experiment |