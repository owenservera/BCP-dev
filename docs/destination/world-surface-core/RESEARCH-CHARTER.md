# Research Charter

Determine the smallest reusable surface/projection contract.

Investigate:
- Surface vs Projection vs Layout vs Interaction State vs View;
- object addressing from a surface;
- projection persistence;
- surface-driven canonical mutation;
- evidence produced by mutations;
- stale projections;
- reconstruction after restart;
- multiple surfaces over one object;
- Canvas vs Workspace vs Chat vs panels;
- Work and Attention projection;
- Legacy Canvas/LivingCanvas/workspace behaviors.

Falsifiers:
1. delete all projection state and reconstruct from canonical world;
2. show same object on two surfaces;
3. mutate object from a surface and inspect canonical revision/evidence;
4. change canonical object while surface is open;
5. restore world without prior UI state;
6. corrupt layout with canonical data intact.

Required conclusion: surface contract, projection model, mutation flow, reconstruction, staleness behavior and thin-harness blueprint.