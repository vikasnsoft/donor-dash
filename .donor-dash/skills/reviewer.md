# Reviewer Skill

## Purpose
Review code for quality, consistency, correctness, and adherence to project standards.

## When to Invoke
- After implementation is complete
- Before marking a task as done
- When asked to review specific files

## Review Checklist

### 1. Module Boundaries
- [ ] Code respects module ownership defined in `module-boundaries.md`
- [ ] No direct imports from another module's internals (model, service)
- [ ] Cross-module communication uses domain events or shared interfaces
- [ ] No circular dependencies

### 2. Code Standards
- [ ] Follows naming conventions from `code-standards.md`
- [ ] Thin controllers (no business logic)
- [ ] Services handle all business logic
- [ ] Proper error handling with ErrorResponse
- [ ] No `any` types
- [ ] No magic numbers or strings (use constants)

### 3. Validation
- [ ] All input validated with Zod schemas
- [ ] Validation happens at the route level (before controller)
- [ ] Error messages are user-friendly

### 4. Security
- [ ] Authentication required on protected routes
- [ ] Authorization checked (role-based access)
- [ ] No sensitive data in responses (password, tokens)
- [ ] Input sanitized
- [ ] Rate limiting considered for public endpoints

### 5. Financial Logic (if applicable)
- [ ] Consult Finance Auditor skill
- [ ] Ledger entries balance (debit = credit)
- [ ] Decimal128 used for monetary amounts
- [ ] Transactions used for multi-step financial operations

### 6. Database
- [ ] Proper indexes for query patterns
- [ ] No N+1 queries
- [ ] Projections used to limit returned fields
- [ ] Transactions used where needed

### 7. Error Handling
- [ ] All async routes wrapped with asyncHandler
- [ ] Errors thrown with proper statusCode
- [ ] No unhandled promise rejections
- [ ] Meaningful error messages

### 8. Logging
- [ ] Pino logger used (not console.log)
- [ ] Structured logging with context
- [ ] No sensitive data in logs

### 9. Frontend (if applicable)
- [ ] Follows `ui-rules.md`
- [ ] Loading states for async operations
- [ ] Error states handled
- [ ] Empty states designed
- [ ] Responsive on mobile
- [ ] Accessible (keyboard, screen reader)

### 10. Testing
- [ ] Unit tests for services
- [ ] Integration tests for routes
- [ ] Edge cases covered
- [ ] Error scenarios tested

## Output Format

```markdown
## Review: [File/Feature]

### Status: PASS | PASS WITH NOTES | FAIL

### Issues Found
1. **[CRITICAL/HIGH/MEDIUM/LOW]** [Description] → [File:Line]
   - Fix: [How to fix]

### Notes
- [Observations that aren't blockers]

### Verdict
[Summary and recommendation]
```

## Severity Levels
- **CRITICAL**: Security vulnerability, data loss risk, financial calculation error
- **HIGH**: Module boundary violation, missing validation, broken functionality
- **MEDIUM**: Code smell, missing error handling, performance issue
- **LOW**: Style inconsistency, missing docs, minor improvement
