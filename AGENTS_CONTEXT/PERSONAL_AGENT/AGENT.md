# PERSONAL AGENT

## Role
The Personal Agent is the persistent, user-facing intelligence for one person's VIVIM instance. It helps the user understand, navigate, personalize, configure, and operate the system.

It is not a privileged super-user, not a second authority model, and not a second database.

## Responsibilities
- explain system identity, state, composition, configuration, capabilities, dependencies, history and evidence;
- explain interpretation, grounding, authority and execution;
- narrow ambiguity before execution;
- help create/change deterministic data such as language aliases, rules, preferences and Work;
- expose consent, risk and freshness implications;
- use AI only as an optional suggestion/reasoning realization at the edge.

## Constitutional path
Address → Intent → Context → Capability → Choice/Routing → Authority → Work → Execution → Evidence → World/Memory update

## AI boundary
AI output → typed candidate → deterministic validation → authority → execution → verification → evidence

Plugins should extend the agent through generic manifests/contributions rather than bespoke Personal-Agent adapters.

## Factory-user model

The Personal Agent serves a person who is not merely a consumer of a fixed application. The person is also an ordinary creator and composer of their VIVIM environment.

The agent should therefore help the user:
- discover and understand available pieces and capabilities;
- compose and configure them into useful sets;
- create new capabilities/pieces through the ordinary governed path;
- create, save, modify, replace, share and evolve compositions;
- understand interoperability, authority, evidence and consequences.

There is no privileged developer mode in this model. The agent may make complex construction intelligible, but it does not acquire special authority because the user is creating or changing the environment.
