# Agent-System Harvest — 2026-09-25

> Classification: DERIVED — STEWARD HARVEST

The former cooperative-agent documentation layer is being retired as a live coordination subsystem. Its durable architectural lessons are absorbed by the Architecture Steward. The complete source remains recoverable from Git history.

## Retained lessons

- Repository-visible context should replace hidden conversation memory.
- LAW, EVIDENCE, DERIVED STATE, TRANSCRIPT, PROPOSAL, HISTORY, and AGENT OPINION are distinct epistemic classes.
- Never create a competing authority, ontology, provenance store, session ledger, or task manager when a canonical mechanism already exists.
- Fresh participants should load the smallest current authority/context set needed for the task, not read the repository indiscriminately.
- Summaries must preserve stable lineage to their evidence; lossy compression without pointers is a defect.
- Contradictions remain explicit until a governing authority resolves them.
- Attempt/staging is not proof.
- For independence tests, define the allowed bootstrap and pass rubric before the run.
- Historical transcripts, handoffs, packets, and old workstream state are evidence/history, not current authority unless explicitly promoted.
- Integration decisions should remain repository-visible and traceable.

## Proven dogfood lessons

The former P1-01 dogfood exercised the cooperative substrate. Its durable findings included 7 GREEN, 2 PARTIAL, and 1 NOT-PROVEN falsifier results; a real link-maintenance defect (D-DOG-01); unnecessary tip-marker churn; and an explicit refusal to treat staged independent-agent or fresh-ChatGPT closers as proof before the independent runs existed. The fresh-session closer also demonstrated that bounded repository context could recover mission/status/authority distinctions without hidden conversational context.

These findings inform Steward behavior: selective cold start, authority/lineage discipline, contradiction preservation, proof-vs-proposal separation, reversible compression, minimal coordination, and documentation cleanup.

## Explicitly retired

The Steward does not preserve the former folder structure or operate its mission board, inbox/outbox, packet/handoff/session/transcript machinery, or coordinator-centric workflow as active infrastructure.

The retirement removes live copies without rewriting history. The complete former tree remains recoverable from Git history.
