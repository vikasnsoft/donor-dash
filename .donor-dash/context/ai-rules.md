# AI Rules

## Hard Rules (Never Violate)

1. **Never invent database fields.** Read the model file before assuming a field exists.
2. **Never change schema without considering migration impact.** Existing data must be handled.
3. **Never duplicate logic across modules.** Use domain events or shared interfaces.
4. **Never skip validation.** Every input boundary must validate with Zod.
5. **Never skip tests for financial logic.** 100% coverage required.
6. **Never mix business logic into controllers.** Controllers handle HTTP. Services handle logic.
7. **Never use `any` type.** Every type must be explicit.
8. **Never write raw MongoDB queries in controllers.** Use the service layer.
9. **Never create circular dependencies between modules.**
10. **Never modify posted ledger entries.** Void and re-create instead.
11. **Never log sensitive data** (passwords, tokens, PII, financial identifiers).
12. **Never return sensitive fields in API responses** (password hash, plaidAccessToken).
13. **Never commit `.env` files or secrets.**
14. **Never use floating-point for monetary amounts.** Use Decimal128.
15. **Never skip transactions for multi-collection financial writes.**

## Soft Rules (Follow Unless Good Reason Not To)

1. Prefer composition over inheritance.
2. Prefer early returns over deep nesting.
3. Prefer explicit over implicit.
4. Prefer immutable operations where possible.
5. Keep functions under 30 lines.
6. Keep files under 300 lines.
7. One export per file for services (named export).
8. Use `const` by default, `let` only when reassignment needed.

## Before Writing Code

1. Read the relevant context files
2. Check module boundaries
3. Check existing patterns in the codebase
4. Check decision records for relevant ADRs
5. Plan the approach (use `/architect` if complex)

## Before Submitting Code

1. Verify no anti-patterns (check `anti-patterns.md`)
2. Verify module boundaries respected
3. Verify input validation present
4. Verify error handling complete
5. If financial: run `/finance-auditor`
6. If UI: run `/ui-architect` review

## AI Assistant Behavior

- Ask for clarification when requirements are ambiguous
- Propose alternatives when there are trade-offs
- Flag risks proactively
- Explain why, not just what
- When unsure, check context files before guessing
