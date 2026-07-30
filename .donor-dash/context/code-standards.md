# Code Standards

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| File (JS/TS) | camelCase | `userController.js`, `balanceService.js` |
| File (React) | kebab-case | `user-menu.tsx`, `amount-input.tsx` |
| Directory | kebab-case | `modules/auth/`, `components/shared/` |
| Variable | camelCase | `totalAmount`, `isDeleted` |
| Constant | UPPER_SNAKE | `MAX_SPLIT_MEMBERS`, `DEFAULT_CURRENCY` |
| Function | camelCase | `getUserById()`, `createDonation()` |
| Class/Type | PascalCase | `ErrorResponse`, `LedgerEntry` |
| Interface | PascalCase with I prefix (optional) | `User`, `CreateDonationInput` |
| Enum values | snake_case | `door_to_door`, `bank_transfer` |
| Database field | camelCase | `createdAt`, `paidBy` |
| Boolean field | is/has prefix | `isDeleted`, `hasReceipt` |
| API endpoint | kebab-case plural | `/api/donation-receipts` |

## File Structure

### Module (Backend)
```
module-name/
├── __tests__/          # Tests
├── model.js            # Mongoose schema
├── controller.js       # HTTP handlers
├── service.js          # Business logic
├── validator.js        # Zod schemas
├── routes.js           # Express routes
└── permissions.js      # Role-based access (optional)
```

### Component (Frontend)
```
components/
├── ui/                 # shadcn/ui primitives (don't modify)
├── shared/             # Cross-cutting shared components
├── module-name/        # Module-specific components
│   ├── component-name.tsx
│   └── component-name.test.tsx
└── index.ts            # Barrel exports (if needed)
```

## Import Order

### Backend
```javascript
// 1. External packages
import mongoose from 'mongoose';
import { z } from 'zod';

// 2. Internal utilities
import asyncHandler from '../../middleware/asyncHandler.js';
import logger from '../../utils/logger.js';

// 3. Module imports (same module)
import User from './model.js';
import { formatUserResponse } from './service.js';
```

### Frontend
```typescript
// 1. External packages
import { useQuery } from '@tanstack/react-query';

// 2. Internal components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// 3. Hooks and utilities
import { useAuth } from '@/providers/auth-provider';
import { cn } from '@/lib/utils';

// 4. Types
import type { User } from '@/hooks/useAuth';
```

## Error Handling

### Backend Services
```javascript
if (!entity) {
  const error = new Error('Entity not found');
  error.statusCode = 404;
  throw error;
}
```

### Backend Controllers
```javascript
const getEntity = asyncHandler(async (req, res) => {
  const entity = await service.getById(req.params.id);
  res.json(entity);
  // asyncHandler catches thrown errors and passes to error middleware
});
```

### Frontend Mutations
```typescript
const mutation = useMutation({
  mutationFn: api.createEntity,
  onSuccess: () => {
    toast.success('Entity created');
    queryClient.invalidateQueries({ queryKey: ['entities'] });
  },
  onError: (error) => {
    toast.error(error.message);
  },
});
```

## Logging

### Backend
```javascript
import logger from '../../utils/logger.js';

// Structured logging
logger.info({ userId, action: 'login' }, 'User logged in');
logger.error({ err, expenseId }, 'Failed to create expense');
logger.warn { threshold: 80 }, 'Budget threshold exceeded');
```

### Rules
- Never use `console.log` in production code
- Never log sensitive data (passwords, tokens, PII)
- Always include context (userId, requestId, etc.)

## Comments

### When to Comment
- **Why**, not what — the code shows what
- Complex business rules
- Non-obvious workarounds
- Public API contracts

### When NOT to Comment
- Obvious code
- `// Get user` before `getUser()`
- Commented-out code (delete it)

## Formatting
- 2 spaces for indentation (JS/TS)
- Single quotes for strings
- No semicolons (frontend follows Prettier config)
- Trailing commas in multi-line
- Max line length: 100 characters
