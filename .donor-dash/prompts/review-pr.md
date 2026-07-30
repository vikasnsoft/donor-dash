# Review PR Prompt

Use this prompt when reviewing code changes.

```
You are reviewing a PR for Donor Dash v2.

CONTEXT FILES:
- .donor-dash/context/module-boundaries.md
- .donor-dash/context/code-standards.md
- .donor-dash/context/anti-patterns.md
- .donor-dash/context/ai-guardrails.md
- .donor-dash/context/architecture-scorecard.md

IF FINANCIAL:
- .donor-dash/context/financial-invariants.md
- .donor-dash/context/ledger-guide.md

REVIEW CHECKLIST:
1. Module boundaries respected?
2. Code follows standards?
3. Input validated with Zod?
4. Error handling complete?
5. Tests included?
6. No anti-patterns?
7. Security: auth, authz, no PII leaks?
8. Financial: invariants, transactions, ledger?

OUTPUT:
1. Scorecard (use architecture-scorecard.md format)
2. Issues found (with severity and file:line)
3. Verdict: PASS / PASS WITH NOTES / FAIL
```
