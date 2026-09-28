# Community research: OpenCode orchestration systems

Collected 2026-09-28. These are external, community-authored references. They are evidence/examples only, not architecture requirements.

## Oh-My-OpenAgent / Oh-My-OpenCode lineage

Primary references:
- https://github.com/code-yeongyu/oh-my-openagent
- https://github.com/code-yeongyu/oh-my-openagent/blob/dev/docs/reference/features.md
- https://github.com/code-yeongyu/oh-my-openagent/blob/dev/docs/reference/configuration.md
- https://github.com/lovicho/oh-my-opencode/blob/dev/docs/guide/orchestration.md
- https://github.com/opensoft/oh-my-opencode/blob/dev/docs/guide/understanding-orchestration-system.md

## Patterns worth studying

Community implementations push OpenCode beyond a flat list of agents by introducing concepts such as:

- a main orchestrator that delegates through Task;
- specialized agents for research, architecture, exploration, visual work, and execution;
- domain/category-based model selection;
- model fallback chains;
- skills as a second axis distinct from agent identity;
- explicit team/task abstractions;
- workflow graphs for dependencies and phases;
- background execution and inter-agent messaging.

These patterns are useful as experimental design material because they demonstrate ways of turning a single coding-agent session into a small development organization.

## Important caution

These projects are strongly opinionated and evolve independently of OpenCode core. Names, models, config schemas, hooks and team APIs can change. The Ω team should extract concepts, then verify the underlying OpenCode primitives and decide independently what belongs in its own system.

## Useful research question

The most interesting architectural question for Ω is not “which community framework should we install?” but:

“What minimal orchestration kernel do we need to add around OpenCode so the development organization can create, specialize, supervise, retire and replace agents without becoming dependent on a third-party team framework?”
