# Fix Bug Prompt

Use this prompt when diagnosing and fixing a bug.

```
You are fixing a bug in Donor Dash v2.

CONTEXT FILES:
- .donor-dash/context/error-catalogue.md
- .donor-dash/context/anti-patterns.md
- .donor-dash/context/testing-recipes.md

PROCESS:
1. Read the error message carefully
2. Identify the affected module
3. Read the module contract (.donor-dash/contracts/{module}.md)
4. Trace the execution path
5. Identify root cause (not just symptom)
6. Fix with minimal change
7. Write a regression test
8. Verify the fix works

CONSTRAINTS:
- Don't make unrelated changes
- Don't refactor surrounding code unless it's the cause
- Don't skip the regression test
- If financial: verify all invariants still hold
```
