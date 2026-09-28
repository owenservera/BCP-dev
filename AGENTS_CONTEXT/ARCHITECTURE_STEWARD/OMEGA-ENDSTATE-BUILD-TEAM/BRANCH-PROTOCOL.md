# Ω End-State Build Team — Branch Protocol

> Status: OWNER-DIRECTED
> Branch: `team/omega-endstate`

## Primary branch

`team/omega-endstate` is the team's long-lived end-to-end development line.

## Mainline relationship

`main` is a parallel development path.

There is no requirement to track `main` continuously.

The team may inspect main whenever useful, but mainline work is not automatically incorporated.

## Team work branches

When parallel work needs isolation, create:

`work/omega-endstate/<AGENT_ID>/<TASK>`

Those work branches integrate into `team/omega-endstate`.

Do not use main as the intermediate integration branch for this team.

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
