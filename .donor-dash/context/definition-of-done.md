# Definition of Done

Every feature, module, or significant change must satisfy ALL of these criteria before being considered complete.

---

## Architecture
- [ ] Module boundaries respected (no cross-module imports)
- [ ] Service layer handles business logic (not controllers)
- [ ] Domain events used for cross-module communication
- [ ] No circular dependencies

## Code Quality
- [ ] Follows naming conventions (`code-standards.md`)
- [ ] No `any` types
- [ ] No magic numbers or strings
- [ ] Functions under 30 lines
- [ ] Files under 300 lines
- [ ] No unused imports or variables

## Validation
- [ ] Zod schemas for all input boundaries
- [ ] Validation happens at route level (before controller)
- [ ] Error messages are user-friendly (from `error-catalogue.md`)

## Security
- [ ] Authentication on protected routes (`protect` middleware)
- [ ] Authorization checked (role-based access)
- [ ] No sensitive data in responses (password, tokens)
- [ ] Input sanitized

## Database
- [ ] Proper indexes for query patterns
- [ ] Decimal128 for monetary amounts
- [ ] Timestamps enabled (`{ timestamps: true }`)
- [ ] Transactions for multi-collection writes

## Financial (if applicable)
- [ ] Ledger entries balance (debits = credits)
- [ ] All financial invariants satisfied (`financial-invariants.md`)
- [ ] Balance updates in same transaction
- [ ] Audit trail entries created

## Testing
- [ ] Unit tests for services (90%+ coverage)
- [ ] Integration tests for routes
- [ ] Financial logic: 100% coverage
- [ ] Edge cases covered
- [ ] Error scenarios tested

## Frontend (if applicable)
- [ ] Uses shadcn/ui components
- [ ] Loading states for async operations
- [ ] Error states handled (toast + inline)
- [ ] Empty states designed
- [ ] Responsive on mobile
- [ ] Accessible (keyboard, ARIA labels)
- [ ] Dark mode works

## Documentation
- [ ] Swagger docs updated (if new/changed endpoints)
- [ ] Module contract updated (if module changes)
- [ ] ADR created (if architectural decision)
- [ ] Progress tracker updated (if milestone)

## Logging
- [ ] Pino structured logging (not console.log)
- [ ] No sensitive data in logs
- [ ] Request logging for new endpoints

## Performance
- [ ] No N+1 queries
- [ ] Projections limit returned fields
- [ ] Pagination on list endpoints
- [ ] Indexes for query patterns
