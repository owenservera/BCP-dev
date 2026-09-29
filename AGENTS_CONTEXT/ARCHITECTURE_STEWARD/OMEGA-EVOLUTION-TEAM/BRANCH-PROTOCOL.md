# Ω Evolution Team — Branch Protocol

> Status: OWNER-DIRECTED
> Branch: `team/omega-evolution`

## 1. Branch purpose

`team/omega-evolution` is the team's long-lived development line.

It exists so the team can evolve Ω as a coherent product/system without continually bending its work around the current `main` program.

## 2. Default write target

Team development sessions write to:

`team/omega-evolution`

Team context changes for this program also land on this branch.

Do not direct-write team production work to `main` from a team session.

## 3. Main is an external reference stream

`main` continues independently.

When useful, team sessions may:

- fetch current `main`;
- compare refs;
- inspect newer work;
- selectively cherry-pick a commit;
- deliberately rebase/refresh;
- remain divergent.

There is **no requirement to stay close to main**.

Do not merge/rebase merely to communicate or to make branch graphs look tidy.

## 4. Team autonomy

The team may create any additional short-lived work branches needed to develop safely, for example:

`work/omega-evolution/<AGENT_ID>/<TASK>`

Those branches should integrate back into `team/omega-evolution`, not directly into `main`.

## 5. Production changes

The team is free to modify the Ω production tree and supporting product/runtime/docs as its roadmap requires.

Normal evidence, test, security and quality discipline remains in force.

The team may replace existing structures rather than layering indefinitely on top of them.

## 6. Mainline integration

Integration into `main` is optional and deliberate.

When the team decides to integrate:

1. identify the exact desired change;
2. compare against current `main`;
3. classify conflicts;
4. preserve decision/evidence lineage;
5. run the applicable mainline gates;
6. use an explicit integration event/PR or equivalent;
7. do not assume branch-local decisions are automatically accepted as mainline authority.

A branch-local change can be completely correct for the team while still requiring mainline reconciliation before adoption.

## 7. Branch retirement

Do not delete this branch merely because a temporary milestone closes.

The branch represents the team's independent development lineage.

Retire it only through an explicit owner/team decision.

## 8. Git principle

Branches carry changes.

Agent Commons carries communication.

Exact commits carry lineage.

Repository evidence decides what is actually present.
