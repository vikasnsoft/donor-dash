# Testing Specialist Skill

## Purpose
Define testing strategy, review test coverage, and ensure quality through systematic testing.

## When to Invoke
- After implementing a new feature
- When reviewing test coverage
- When tests are failing
- Before marking work as complete

## Testing Pyramid

```
        /  E2E  \         (few, slow, high confidence)
       /----------\
      / Integration \     (moderate, medium speed)
     /----------------\
    /    Unit Tests     \  (many, fast, focused)
```

### Unit Tests
- **What**: Individual functions, services, validators
- **Where**: `module/__tests__/service.test.js`
- **Speed**: Milliseconds
- **Coverage**: Business logic, calculations, transformations

### Integration Tests
- **What**: API endpoints with database
- **Where**: `module/__tests__/routes.test.js`
- **Speed**: Seconds
- **Coverage**: Request/response, middleware, database operations

### E2E Tests
- **What**: Full user flows through the UI
- **Where**: `frontend/e2e/`
- **Speed**: Minutes
- **Coverage**: Critical paths (login, create donation, settle up)

## Test File Structure

```
backend/src/modules/
├── auth/
│   ├── __tests__/
│   │   ├── service.test.js     # Unit tests
│   │   └── routes.test.js      # Integration tests
│   ├── controller.js
│   ├── service.js
│   └── ...
```

## Naming Convention

```javascript
describe('AuthService', () => {
  describe('authenticateUser', () => {
    it('should return user when credentials are valid', async () => { ... });
    it('should throw 401 when password is incorrect', async () => { ... });
    it('should throw 401 when user does not exist', async () => { ... });
  });
});
```

## What to Test

### Services (Unit)
- Happy path
- Error cases (not found, duplicate, validation)
- Edge cases (empty input, boundary values)
- Business rules (split calculations, balance updates)

### Routes (Integration)
- Correct status codes
- Correct response format
- Authentication required
- Authorization enforced
- Validation rejects bad input
- Database state changes correctly

### Financial Logic (Critical)
- Ledger entries balance
- Balance calculations are correct
- Settlements update both parties
- Transactions roll back on error

## Coverage Targets

| Area | Target |
|------|--------|
| Services | 90%+ |
| Controllers | 80%+ |
| Validators | 95%+ |
| Financial logic | 100% |
| Overall | 80%+ |

## Mock Strategy

### Database
- Unit tests: Mock Mongoose models
- Integration tests: Use test database (MongoDB Memory Server)

### External Services
- Always mock: Sentry, Plaid, OCR, email
- Never make real API calls in tests

### Time
- Mock `Date.now()` for time-dependent tests (recurring expenses, reports)

## Rules
- Financial logic must have 100% test coverage
- Every bug fix must include a regression test
- Tests must be independent (no shared state between tests)
- Tests must be deterministic (same result every time)
