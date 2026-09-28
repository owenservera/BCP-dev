# Ω End-State Build Team — Branch Protocol

> Status: OWNER-DIRECTED
> Branch: `team/omega-endstate`

## Team integration line

`team/omega-endstate` is the team's long-lived end-to-end integration line. It is not a general-purpose autonomous-agent checkout.

## Mainline relationship

`main` is a parallel development path.

There is no requirement to track `main` continuously.

The team may inspect main whenever useful, but mainline work is not automatically incorporated.

## Agent work branches

When autonomous work needs isolation, create:

`work/omega-endstate/<AGENT_ID>/<TASK>`

Those work branches integrate into `team/omega-endstate`.

The branch should normally be based from the current `team/omega-endstate` SHA. Do not silently base Ω End-State work from `main` merely because `main` is the repository default branch.

Do not use `main` as the intermediate integration branch for this team.

## Workspace isolation

A branch is not an agent workspace. Every concurrently active agent must use its own isolated Git worktree or clone. Two active autonomous agents must never share one filesystem checkout.

Recommended normal unit:

`one agent + one isolated worktree/clone + one owned work branch + one coherent task`

High-risk Git or repository experiments may use a separate clone.

## Project home

`omega-endstate-build/` is the tracked project/control-plane home. It is shared durable state, not a shared multi-agent checkout.

Keep active agent workspaces separate from it.

## Branch-local law

The team may propose or adopt branch-local Ω architectural/law changes when the end state requires them. Such changes remain branch-local design decisions until explicitly reconciled with other development paths and do not silently change `main` or global repository authority.

## Divergence is allowed

The team may intentionally diverge in:

- architecture;
- laws;
- data models;
- contracts;
- runtime layout;
- product shell;
- agent operating system;
- testing strategy;
- build order.

Divergence is a design result, not an operational failure.

## Integration with main

Integration is optional.

If the team later proposes integration:

1. identify the exact artifact or system outcome;
2. compare the branch against current main;
3. explain design differences;
4. identify supersession, compatibility and migration implications;
5. verify the result in the target mainline environment;
6. integrate only the selected coherent outcome.

There is no presumption that the team's branch must eventually merge wholesale.

## Communication

Use existing Agent Commons for agent communication.

Do not create a second messaging substrate just because the product-development path is separate.

## Production scope

The team may change any part of the repository needed to create the end state.

The Ω subtree is the starting point, not a prison.

## History

Do not rewrite published branch history.

For detailed workspace and Git safety rules, use `omega-endstate-build/GIT-MANAGEMENT.md`.
