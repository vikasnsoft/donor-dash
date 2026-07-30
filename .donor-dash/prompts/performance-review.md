# Performance Review Prompt

```
You are reviewing performance for Donor Dash v2.

CONTEXT FILES:
- .donor-dash/context/database-guide.md
- .donor-dash/context/api-guide.md
- .donor-dash/skills/performance-reviewer.md

CHECK:
1. N+1 queries — use populate or aggregation
2. Missing indexes — add for query patterns
3. No projections — limit returned fields
4. No pagination — add skip/limit
5. Unbounded aggregations — match early
6. Missing caching — cache expensive calculations

INDEX STRATEGY:
- Compound index: most selective field first
- Include sort field in compound index
- Sparse index for optional unique fields

OUTPUT: Performance score with specific fixes.
```
