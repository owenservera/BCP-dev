# Anti-Patterns

This lane is specifically designed to catch these failure modes before any reuse decision.

1. **ZCode-as-a-second-runtime**  
   Bringing in ZCode wholesale and leaving OpenCode only as a shell around it.

2. **TUI split-brain**  
   Requiring the user to switch between an OpenCode TUI and a second agent UI to manage one job.

3. **Model/runtime coupling**  
   Encoding GLM-specific assumptions into the workflow so that another OpenCode-supported model cannot execute it.

4. **Prompt-only emulation**  
   Claiming that a ZCode capability has been reproduced because a prompt describes the same behavior, without execution evidence.

5. **Fake verification**  
   Allowing the agent to report tests/browser checks/design comparison without actually performing them.

6. **Agent recursion by convention**  
   Assuming that because multiple subagents exist, arbitrary recursive swarm behavior also exists.

7. **Unbounded worker spawning**  
   Allowing the full-stack procedure to create uncontrolled agents, processes or external side effects.

8. **Research leakage**  
   Letting this experiment silently modify Ω runtime law or production implementation.

9. **Evidence afterthought**  
   Completing work first and trying to reconstruct proof later.

10. **Capability conflation**  
    Treating Skill, Agent, Plugin, MCP server, model and TUI as interchangeable layers.

## Mandatory discipline

When a proposed wiring step cannot be expressed in OpenCode-native primitives, record the gap explicitly rather than recreating a hidden second runtime.
