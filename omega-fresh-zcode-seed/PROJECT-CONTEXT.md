# Project Context — Why VIVIM-Ω Exists

## The product

VIVIM is intended to be the place where a person's digital world lives: a local environment that can hold and operate their information, accounts, conversations, tools, agents, automations, and other digital objects as governed, composable things.

The important word is environment. This is not primarily another application with a chat interface. The product ambition is a personal operating environment with a constitutional kernel: authoritative state, capabilities, intent, law, evidence, memory, execution, composition, surfaces, and evolution all belong to one coherent system.

The canvas is a visible language for that environment. It is not the source of truth.

## Sovereignty

The core product stance is local sovereignty:

my machine, my internet, my accounts, my data, my apps.

The system should minimize dependence on proprietary APIs and centralized application backends when a real user-controlled interface can provide the needed capability. For the current first shippable provider path, that means Chrome master/slave and browser-mediated realization.

This is not an aesthetic preference. It is part of the product's reason for existing.

## From VIVIM to Ω

The older VIVIM implementations are the mine.

They contain useful algorithms, domain knowledge, fixtures, parser evidence, provider experiments, interaction patterns, failures, and hard-earned constraints. They also contain architectural debt, duplication, assumptions that should not survive, and structures that were never designed as one composable system.

Ω is the destination.

The intended relationship is therefore:

old VIVIM → evidence / ore / fixtures

Ω → fresh constitutional system built from the lessons

Do not default to porting old code. Reuse an old implementation when it is genuinely the best proven realization of a requirement, and treat that reuse as an explicit engineering choice.

## The architectural idea

The central stack is roughly:

Vault → governed events and evidence → law and authority → canonical intent → execution → plugins and compositions → Forge → surfaces

Natural language is a control interface, not a source of authority.

AI is a replaceable realization inside the system, not the constitutional decision maker.

The system should remain meaningful without an LLM: deterministic intent, policy, capability checks, state change, evidence, and execution remain explicit.

## The Forge

Ω is intended to make extension a first-class capability.

A Forge is not a privileged SDK layer. It is itself part of the plugin and composition model, constrained by the same capability and evidence discipline as the rest of the system.

The long-term test is more demanding than the product simply running: the environment should be capable of describing, generating, proving, and incorporating new pieces of itself in a controlled, inspectable way.

## The beta objective

The practical objective is a functioning, coherent beta that can be distributed and used by real people, while retaining the constitutional properties that make Ω meaningfully different from a conventional AI application.

Do not optimize for documentation volume, architecture ceremony, agent count, or feature count. Optimize for demonstrated user value plus a trustworthy underlying system.

## How to interpret the seeded baseline

The seeded baseline is a strong starting point, but it represents a particular point in Ω's evolution. Some docs are design law; some are evidence; some are historical plans; some describe limits that may now be closed.

The new project must classify those distinctions from the repository itself.

Never let a stale roadmap become the reason something gets built.

## Development environment

The current project can be developed on Windows, and the Ω architecture already contains explicit cross-runtime and platform seams. Preserve runtime-neutrality where it is a real architectural property rather than coupling core logic to one developer environment.

The ZCode harness is intentionally outside this seed's concerns. Build whatever agent and development machinery the work proves necessary.
