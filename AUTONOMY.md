# Autonomy Charter — Authority to Build and Change Ω

This document exists so the autonomous build does not confuse "baseline" with "boundary."

## ZCode capability-space mandate

At project start, inspect the actual ZCode runtime and its available native and extension capabilities. The project may design its own agents, workflows, skills, plugins, MCP servers, hooks, background jobs, schedules, remote workspaces, testing infrastructure, observability, memory conventions, and other DevOps machinery. Discover what is available before deciding what to build.

Maximize capability space, not authority. Broad access to optional mechanisms is useful; consequential authority remains explicit, scoped, observable, and governed. Development machinery is replaceable and must not become confused with VIVIM product architecture.

## Bootstrap capability leverage

The project should treat already-available development capabilities as bootstrap assets, not as subjects for unnecessary rediscovery. Before manually researching how to accomplish a development task, inspect the actual ZCode runtime and its available native tools, installed skills, accessible plugins, MCP servers, hooks, workflows, background/scheduling facilities, browser/Computer Use, memory, and reusable project knowledge. Use the seeded ZCode capability map as the initial capability prior.

Re-verify only what may have changed, what depends on the current runtime, what depends on permissions, or what is genuinely uncertain. Prefer composing an existing capability over rebuilding it. A bootstrap capability inventory should record what was found, what was adopted, what was rejected, and what gaps still justify new development.

`## Shared five-lane intelligence pool

Bootstrap should recognize the existing ZCode execution pool as five independently configured provider lanes, each wired to a 1M-context model named **Space Bunny Free**: **Owen**, **OpenCode acct 2**, **OpenCode acct 3**, **OpenCode acct 4**, and **OpenCode acct 5**.

These provider/account configurations are pre-existing infrastructure. The autonomous project should **not** alter provider configuration, credentials, endpoints, account associations, model mappings, quotas, or routing settings unless the owner explicitly asks it to. It may inspect availability and health for scheduling purposes only.

The operating objective is to maximize validated parallel throughput across the five lanes. Use fan-out aggressively when tasks are independent, allocate coherent work units to different lanes, avoid accidental duplication, and use independent verification when duplication has a deliberate evidentiary purpose. Rebalance idle capacity dynamically and avoid making one provider the permanent serial bottleneck.

This pool does not imply five permanent agents or five permanent departments. Providers are execution resources; organizational accountability belongs to the workstream/head layer. A head may dispatch, reprioritize, or reclaim work across available lanes while preserving work ownership and verification boundaries.

The project should exploit the large context window for deep independent tasks, but context size is not a reason to collapse many unrelated tasks into one session. Partition work so each lane can produce a concise, durable result that another lane or head can consume.

## You may change Ω

The autonomous build has permission to change:

- implementation code;
- contracts and schemas;
- plugin and composition boundaries;
- runtime architecture;
- storage structures;
- provider realization strategy;
- Forge design;
- surfaces and UX;
- tests, fixtures, and tooling;
- documentation and terminology;
- sequencing and project-management structure;
- architectural assumptions inherited from the baseline.

You may delete or replace an existing Ω mechanism when a better implementation is demonstrated.

## You may create the development organization

The fresh project should create a real operating organization early rather than waiting for organizational complexity to emerge accidentally.

At bootstrap, establish a small set of durable core workstreams with accountable heads of department/workstream. The exact names and boundaries remain open to discovery, but the organization should normally cover:

- **R&D / Research & Architecture Discovery** — uncertainty reduction, technical research, architectural exploration, experiments, and capability discovery.
- **Product Development / DevOps Efficiency** — implementation, build/test acceleration, development tooling, automation, reliability, and removal of delivery friction.
- **Project Management / Governance** — objectives, priorities, dependencies, coordination, delivery state, escalation, decisions, and operating integrity.
- **Truth / Quality / Verification** — independent challenge, proof, validation, evidence quality, regression detection, and reality checks.

The project may add an explicit product/UX, provider/browser, security/reliability, or other head when the work demonstrates that the function deserves durable ownership. It may also split, merge, rotate, or retire workstreams.

A head owns coordination and accountability for a workstream; being a head does not make the agent a constitutional authority. Project-level authority remains governed separately from organizational responsibility.

The organization must include a shared **Commons** communication system. Provide a project-wide commons and durable rooms/streams for each core workstream, plus mechanisms for cross-workstream requests, handoffs, blockers, decisions, escalations, and urgent coordination. The communication layer should preserve enough history and structure for a fresh participant to reconstruct what matters without replaying every conversation.

The organization should support **event-driven activation**. Define explicit triggers that can wake or assign the appropriate head/workstream when useful, such as a new objective, failed verification, research uncertainty, dependency conflict, integration conflict, blocked or stale work, external-change detection, scheduled maintenance, or a newly discovered high-priority risk. Triggering routes responsibility; it does not silently create authority. Consequential external actions, constitutional changes, and other governed effects retain their required authorization boundaries.

The only requirement is that organizational machinery earns its keep. Do not reproduce past orchestration structures as cargo cult, but do not mistake “no inherited organization” for “no organization.”

The project should become more autonomous by learning which organizational boundaries and triggers improve validated throughput, quality, continuity, and recovery.

## You may change the vision

The vision is the strongest project-level guidance in this folder, but it is not an article of faith.

If implementation evidence, product testing, real user needs, or technical discovery demonstrates that a core assumption is wrong, you may propose and make a better one.

When changing a core architectural or product assumption:

1. state the old assumption;
2. state the observed evidence or new requirement;
3. explain the alternative;
4. show the smallest useful falsifier or experiment;
5. record the new rationale;
6. preserve enough lineage that a later agent can understand why the change happened.

Do not silently rewrite history.

## The important negative permission

No old agent setup has authority here.

Do not inherit:

- old ZCode workflows;
- OpenCode swarm structures;
- old agent rosters;
- old boards or project-management departments;
- old workstream ordering;
- old session ledgers;
- old context-bundle conventions;
- old owner-waiting procedures.

Those may have been useful in the previous environment. They are not part of this project's starting truth.

## Autonomy over architectural evolution

The autonomous project may create, replace, split, merge, or retire strategic capability engines as evidence develops.

An engine is not a privileged authority layer merely because it is strategically important. Its job is to provide a replaceable, upgradeable capability boundary that increases leverage while preserving the semantic and governance contracts around it.

The project should actively resist two failure modes:

**one-off lock-in:** today's provider, protocol, model, browser, worker, or repair technique becomes the architecture through accumulation of special cases;

**premature framework:** a large generalized subsystem is created before repeated evidence shows that the abstraction is valuable.

For important boundaries, prefer experiments that test a second materially different use case or realization. A mechanism that fails that test has produced useful architectural evidence.

Provider/protocol management and self-healing are particularly important candidates for this discipline. The project may build provider-specific realizations, but should not let those realizations silently become the semantic or constitutional model.

When an engine improves, measure the leverage where possible: new capabilities/providers become cheaper, replacement becomes easier, duplicated mechanisms decrease, recovery improves, or dependence on a particular realization decreases.

## What should remain stable

Even while changing architecture, preserve the deepest product truths unless there is evidence to replace them:

- sovereignty and user ownership;
- one authoritative durable state model;
- explicit authority and consent;
- provenance and evidence;
- deterministic control where authority matters;
- extensibility through composable pieces;
- honest failure and refusal semantics;
- testable, reversible evolution.

## Decision style

Favor:

measure → understand → experiment → falsify → choose → implement → verify

over:

assume → organize → plan extensively → build the plan → rationalize the result

The project is allowed to discover that an assumption was wrong.

That is not failure. Failing to discover it is.


# Continuous Product Release Gym

The project should operate a continuous product-release gym rather than a fixed feature roadmap.

The gym repeatedly asks:

> **What is the smallest genuinely useful product we can release now that a real user would actually install?**

For every round, generate **10 product-release candidates**. Optimize for the smallest useful product space and the shortest credible time to market, while maximizing the real user value and learning produced by the release.

Prefer:

**small product surface + real utility + existing Ω capability reuse + immediate installability + strong learning**

over:

**large feature set + architectural completeness + speculative future functionality**

Every candidate should state the user, the single job, the minimum installable surface, existing Ω capabilities reused, what must be built, what can remain manual, how success would be observed, and what evidence would justify expanding it.

Rank candidates by minimum product surface, immediate usefulness, time-to-market, reuse of existing capabilities, distinctiveness, learning value, and expansion potential.

### Current first-round hypothesis

A particularly strong example from the current Ω state is a **floating AI control center**.

The minimum product is a small installable VIVIM utility with a floating control surface based primarily on a text box.

The user types one prompt.

VIVIM shows which supported AI WebApps are currently available and, for a first useful release, can send the same prompt to each available provider.

Initial required providers:

- ChatGPT / OpenAI Web
- Claude Web
- Gemini Web

The UI can remain extremely small, for example:

**● ChatGPT   ● Claude   ○ Gemini**

The product should remember observed provider/account/profile capabilities locally, including differences such as which models or capabilities are available on free versus paid profiles. Observed capability state is refreshable evidence, not permanent truth.

The product should not require an AI API merely to provide this capability. Existing user-controlled AI WebApps are the external intelligence providers; VIVIM supplies semantic control, discovery, routing, authorization, browser realization, observed outcome, evidence, and continuity.

The first interface should resist becoming a dashboard. Start with the text command surface and a compact availability indicator. Additional UI should be discoverable and configurable through user language rather than built in advance.

The first release is valuable because a very small product can exercise a meaningful Ω path:

**human expression → intent → context → capability → provider/account/realization → authority → Work → browser/WebApp → observed result → evidence → continuity**

This candidate is a hypothesis, not a predetermined roadmap. The gym must remain free to select a different candidate when current evidence indicates that another tiny product has better immediate value.

### Release-loop rule

Do not automatically build candidate 2 after candidate 1.

A release creates evidence. The next gym round should be influenced by installation, use, repeated user requests, friction, failures, successful/unsuccessful provider realization, architectural reuse, and what the released product teaches about the actual product boundary.

Therefore:

**released product + observed evidence → next 10 candidates**

not:

**predetermined roadmap → implementation**

A product is not considered released merely because its underlying mechanism works. A release must support the basic user journey:

**install → launch → understand → perform the core job → receive a real result**

The gym is also an architectural pressure test. A mechanism that helps one product is not automatically an engine. Promote abstractions only when repeated product work demonstrates reusable value.

Preferred progression:

**concrete case → repeated pattern → reusable capability → engine candidate → validated upgradeable engine**

No engine boundary is sacred. No product-release round should become an excuse to freeze the architecture.
