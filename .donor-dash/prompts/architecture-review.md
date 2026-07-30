# Architecture Review Prompt

Use this prompt when evaluating a major architectural decision.

```
You are reviewing an architectural decision for Donor Dash v2.

CONTEXT FILES:
- .donor-dash/context/architecture.md
- .donor-dash/context/module-boundaries.md
- .donor-dash/context/project-memory.md
- .donor-dash/context/decision-records/ (check existing ADRs)

REVIEW DIMENSIONS:
1. Does it respect module boundaries?
2. Does it align with the event-centric model?
3. Does it maintain ledger independence?
4. What are the scalability implications?
5. What are the migration risks?
6. What alternatives were considered?

OUTPUT:
1. Assessment (approve/concerns/reject)
2. Trade-offs analysis
3. ADR draft (if approving)
4. Migration plan (if breaking change)
```
