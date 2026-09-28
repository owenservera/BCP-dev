# Implementation Matrix — ChatGPT vs Local OpenCode
## 2026-09-28

## I can implement or prepare here
- master architecture documentation and migration plans
- CHARTER/STATE/LESSONS templates
- canonical agent protocol and envelope schema
- receipt JSON schema and validator
- completion-gate tests and documentation lint
- current-state manifest generation
- Commons unit tests and bounded semantic fixes
- first-class Commons CLI code where repository access permits
- metrics schema/reporting
- migration/deprecation indexes
- audit, research, falsifiers, and acceptance criteria

## Local OpenCode must execute and prove
- actual OpenCode version and permission semantics
- exact-agent resolution and fail-closed behavior
- real Steward -> CFA -> worker chain
- Windows path/shell behavior
- signing key persistence and recovery
- concurrent Commons processes
- full Commons v0 acceptance suite
- actual cold-start and task-to-commit measurements
- local branch/working-tree integration and re-read from main

## Shared
Architecture: ChatGPT designs/audits; local implements/proves.
Documentation: ChatGPT can draft; local keeps execution state current.
Tests: ChatGPT can write candidates; local runs the actual environment.
Commons: ChatGPT can inspect and patch bounded code; local proves concurrency.
Metrics: ChatGPT defines; local collects runtime values.

## Local master sequence
1. Fast-forward local work to current main and verify clean tree.
2. Read this master upgrade and current agent-system truth.
3. Freeze new architecture-document creation.
4. Inventory current homes, receipts, tasks, and Commons state.
5. Implement M1 completion contract.
6. Implement M2 envelope generation.
7. Prove M3 exact-agent fail-closed behavior.
8. Execute one real bounded code corridor.
9. Return receipt and metrics.
10. Then simplify homes and harden Commons.

## Operating contract
ChatGPT: THINK / RESEARCH / AUDIT / DESIGN / CHALLENGE.
Local OpenCode: EXECUTE / TEST / MEASURE / COMMIT / PROVE.
Git main: DURABLE STATE.
Commons: COMMUNICATE, subject to promotion gate.
Owner: AUTHORIZE / PRIORITIZE / OVERRIDE.