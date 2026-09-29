# Decisions

| Date | Decision | Reason |
|---|---|---|
| 2026-09-29 | Use OpenCode as the sole user TUI for the experiment. | Keeps the research focused on wiring capability into the existing local workflow rather than replacing the interaction surface. |
| 2026-09-29 | Treat OpenCode as the agent/runtime harness, not as an LLM. | Keeps model/provider selection separate from orchestration and TUI concerns. |
| 2026-09-29 | Treat ZCode full-stack behavior as a procedural reference to reproduce selectively. | The useful research target is the workflow pattern, not a wholesale runtime transplant. |
| 2026-09-29 | Keep the lane isolated from production Ω code. | Passing research evidence must precede any architectural or implementation reuse decision. |
