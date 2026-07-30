# AI Guardrails

Hard boundaries that AI must never cross. These are non-negotiable.

---

## Never Do These

### Architecture
- Never rewrite existing modules without explicit user request
- Never bypass the module boundary rules in `module-boundaries.md`
- Never create circular dependencies between modules
- Never import from another module's model or service directly
- Never skip the service layer (no business logic in controllers)

### Financial
- Never bypass the ledger for financial operations
- Never skip MongoDB transactions for multi-step financial writes
- Never use floating-point (`Number`) for monetary amounts
- Never modify a posted ledger entry
- Never invent financial calculations — consult `accounting-guide.md`
- Never delete donation records (only cancel/refund)
- Never allow cash balance to go negative
- Never reuse receipt numbers

### Database
- Never add fields to a model without understanding all consumers
- Never remove fields without a migration plan
- Never create indexes without analyzing query patterns
- Never query another module's collection directly

### Security
- Never skip authentication on protected routes
- Never skip authorization checks
- Never log sensitive data (passwords, tokens, PII)
- Never return sensitive fields in API responses
- Never commit `.env` files or secrets

### Code
- Never use `any` type
- Never use `console.log` in production code (use Pino)
- Never duplicate logic across modules
- Never skip input validation (Zod at boundary)
- Never skip tests for financial logic
- Never invent error messages (use `error-catalogue.md`)

### Frontend
- Never create custom primitives when shadcn/ui has one
- Never skip loading/error/empty states
- Never make direct API calls in components (use TanStack Query hooks)
- Never skip responsive design
- Never break keyboard accessibility

---

## Always Do These

### Before Writing Code
1. Read relevant context files
2. Check module boundaries
3. Check existing patterns
4. Check decision records

### Before Submitting Code
1. Verify no anti-patterns
2. Verify module boundaries respected
3. Verify input validation present
4. Verify error handling complete
5. If financial: verify all invariants
6. If UI: verify all states (loading, error, empty)

### When Unsure
1. Check context files before guessing
2. Ask for clarification rather than assuming
3. Propose alternatives when there are trade-offs
4. Flag risks proactively
5. Document decisions as ADRs

---

## Escalation Rules

| Situation | Action |
|-----------|--------|
| User asks to violate financial invariant | Refuse and explain why |
| User asks to skip auth on protected route | Refuse and explain why |
| User asks to delete donation records | Refuse, suggest cancel/refund instead |
| User asks to modify posted ledger entry | Refuse, suggest void and re-create |
| User asks to bypass module boundaries | Refuse, suggest domain events instead |
| Requirement is ambiguous | Ask for clarification |
| Multiple valid approaches exist | Present options with trade-offs |
