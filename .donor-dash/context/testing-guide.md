# Testing Guide

## Stack
- **Backend**: Jest or Vitest (unit + integration)
- **Frontend**: Vitest + React Testing Library
- **E2E**: Playwright (future)

## Test Structure

### Backend
```
backend/src/modules/
├── auth/
│   ├── __tests__/
│   │   ├── service.test.js     # Unit: test service functions
│   │   └── routes.test.js      # Integration: test HTTP endpoints
│   ├── service.js
│   └── ...
```

### Frontend
```
frontend/src/
├── components/
│   ├── shared/
│   │   ├── amount-input.test.tsx
│   │   └── currency-picker.test.tsx
├── hooks/
│   ├── useAuth.test.ts
```

## Naming Convention

```javascript
describe('AuthService', () => {
  describe('authenticateUser', () => {
    it('should return user when credentials are valid', async () => {});
    it('should throw 401 when password is incorrect', async () => {});
    it('should throw 401 when user does not exist', async () => {});
    it('should throw 400 when email is missing', async () => {});
  });
});
```

Pattern: `should [expected behavior] when [condition]`

## What to Test

### Services (Unit)
- Happy path (correct input → correct output)
- Error cases (not found, duplicate, validation failure)
- Edge cases (empty input, boundary values, max values)
- Business rules (split calculations, balance updates)

### Routes (Integration)
- Correct HTTP status codes
- Correct response body format
- Authentication required (401 without token)
- Authorization enforced (403 with wrong role)
- Validation rejects bad input (400)
- Database state changes correctly

### Financial Logic (Critical — 100% coverage)
- Ledger entries balance (debits = credits)
- Balance calculations match expected values
- Settlements update both parties correctly
- Transactions roll back on error
- Void entries correctly reverse original entries

### Frontend Components
- Renders correctly with props
- Handles loading state
- Handles error state
- Handles empty state
- User interactions (click, type, submit)
- Accessibility (keyboard navigation)

## Mock Strategy

### Database
```javascript
// Unit tests: mock the model
vi.mock('../model.js', () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn(),
  },
}));

// Integration tests: use MongoDB Memory Server
import { MongoMemoryServer } from 'mongodb-memory-server';
```

### External Services
```javascript
vi.mock('../../../../utils/logger.js', () => ({
  default: { info: vi.fn(), error: vi.fn() },
}));
```

### Time
```javascript
vi.useFakeTimers();
vi.setSystemTime(new Date('2026-01-15'));
// ... test time-dependent logic
vi.useRealTimers();
```

## Coverage Targets

| Area | Minimum |
|------|---------|
| Services | 90% |
| Controllers | 80% |
| Validators | 95% |
| Financial logic | 100% |
| Frontend hooks | 85% |
| Frontend components | 70% |
| Overall | 80% |

## Running Tests

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test

# With coverage
cd backend && npm test -- --coverage

# Watch mode
cd backend && npm test -- --watch
```

## Test Data

### Factories (Future)
```javascript
// tests/factories/user.js
export const createUser = (overrides = {}) => ({
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  role: 'guest',
  ...overrides,
});
```

### Seeders (Development)
Use `npm run data:import` to seed development data.
