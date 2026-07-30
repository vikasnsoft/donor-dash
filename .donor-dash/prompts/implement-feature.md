# Implement Feature Prompt

Use this prompt when implementing a new feature or module.

```
You are implementing a feature for Donor Dash v2, a community finance platform.

CONTEXT FILES TO READ FIRST:
- .donor-dash/context/project-overview.md
- .donor-dash/context/architecture.md
- .donor-dash/context/module-boundaries.md
- .donor-dash/context/code-standards.md
- .donor-dash/context/coding-playbook.md
- .donor-dash/context/ai-guardrails.md

IF FINANCIAL:
- .donor-dash/context/accounting-guide.md
- .donor-dash/context/ledger-guide.md
- .donor-dash/context/financial-invariants.md

IF FRONTEND:
- .donor-dash/context/ui-rules.md
- .donor-dash/context/ui-tokens.md

TASK: [Describe the feature]

REQUIREMENTS:
1. Follow the modular architecture pattern (model → service → controller → routes)
2. Validate all input with Zod schemas
3. Use transactions for multi-collection writes
4. Use domain events for cross-module communication
5. Follow naming conventions from code-standards.md
6. Include proper error handling with codes from error-catalogue.md
7. Add Swagger documentation for new endpoints
8. Write tests following testing-recipes.md

CONSTRAINTS:
- Never violate module boundaries
- Never use floating-point for money
- Never skip validation
- Never mix business logic into controllers
```
