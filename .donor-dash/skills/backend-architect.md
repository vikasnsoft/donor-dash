# Backend Architect Skill

## Purpose
Design and review backend service architecture, ensuring clean separation of concerns and proper dependency direction.

## When to Invoke
- Creating new modules or services
- Refactoring existing services
- Designing business logic flows
- Reviewing service boundaries

## Architecture Layers

```
Route (HTTP concerns only)
  ↓
Controller (HTTP → Service, Service → HTTP)
  ↓
Application Service (orchestration, transactions)
  ↓
Domain Service (pure business logic)
  ↓
Repository / Model (data access)
```

### Route Responsibilities
- Define HTTP method, path, and middleware
- Apply validation schemas
- Apply auth/permission middleware
- Nothing else

### Controller Responsibilities
- Extract data from `req.body`, `req.params`, `req.query`
- Call service methods
- Format and send `res.json()`
- No business logic

### Application Service Responsibilities
- Orchestrate multiple domain operations
- Manage transactions
- Emit domain events
- Handle cross-cutting concerns (audit logging)

### Domain Service Responsibilities
- Pure business logic
- No HTTP concerns
- No database queries (receives data, returns data)
- Easily testable

## Dependency Rules

### ✅ Correct Direction
```
Controller → Service → Model
Module A Service → Domain Event → Module B Service
```

### ❌ Wrong Direction
```
Service → Controller
Model → Service
Module A → Module B internal (direct import of model/service)
```

### Cross-Module Communication
Modules never import each other's internals. Instead:
1. **Domain Events**: Emit events that other modules subscribe to
2. **Shared Interfaces**: Define contracts in `modules/shared/`
3. **Service Injection**: Pass service references through dependency injection

## Error Handling Pattern

```javascript
// In service
if (!entity) {
  const error = new Error('Entity not found');
  error.statusCode = 404;
  throw error;
}

// In controller (via asyncHandler)
// Error middleware catches and formats
```

## Transaction Pattern

```javascript
// In application service
const session = await mongoose.startSession();
session.startTransaction();
try {
  const result = await doMultipleOperations(session);
  await session.commitTransaction();
  return result;
} catch (err) {
  await session.abortTransaction();
  throw err;
} finally {
  session.endSession();
}
```

## Review Checklist
- [ ] Controllers are thin (no business logic)
- [ ] Services handle all logic
- [ ] Proper error types and status codes
- [ ] Transactions used for multi-step operations
- [ ] No circular dependencies
- [ ] Cross-module communication via events
- [ ] Async operations properly handled
