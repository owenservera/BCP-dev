# R-02 — OneManCompany

Paper: https://arxiv.org/html/2604.22446v1
Code: https://github.com/1mancompany/OneManCompany

## Main finding

OMC makes organization a first-class system concern and separates Talent (portable agent identity/capability package) from Container (execution environment). Employee is the managed composition of the two. citeturn591787view2turn918030view0

## Key mechanisms

- Talent packages role, tools, skills, principles, and supporting resources;
- Container abstracts different agent runtimes;
- Explore / Execute / Review separates planning from execution and acceptance;
- task trees carry dependency edges;
- explicit acceptance prevents unverified work from unblocking downstream tasks;
- bounded retries and escalation prevent indefinite cycles. citeturn591787view3turn918030view1

## Best practices extracted

1. Separate identity/capability from runtime.
2. Separate planning, execution, and review.
3. Model dependencies explicitly.
4. Treat completed execution and accepted result as different states.
5. Bound retry loops and escalation.
6. Give long-lived agents explicit lifecycle semantics.

## Ω translation

Strong implications:

`agent_id != OpenCode session`
`session tree != Work graph`
`completed != accepted`
`runtime container != durable identity`

This strengthens the current U1/U2 design rather than replacing it.

## Important limitation

The company metaphor is an organizational abstraction, not Ω authority law. Ω should not import CEO/HR semantics literally where they conflict with explicit authority, evidence, or sovereign owner control.