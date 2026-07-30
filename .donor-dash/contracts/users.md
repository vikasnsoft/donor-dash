# Users Module

## Purpose
Manage user accounts, profiles, roles, and admin user operations.

## Public API
```
GET    /api/users          — List all users (admin only)
GET    /api/users/:id      — Get user by ID (admin only)
PUT    /api/users/:id      — Update user (admin only)
DELETE /api/users/:id      — Delete user (admin only)
```

## Domain Events
- `user.created` — Admin created a user
- `user.updated` — Admin updated a user
- `user.deleted` — Admin deleted a user
- `user.role.changed` — Role changed

## Dependencies
None (foundational module)

## Owned Models
- `User`

## Forbidden Imports
- Cannot import from any other module

## Responsibilities
- User CRUD operations
- Role management (admin, supervisor, volunteer, auditor, support, guest)
- Password hashing via model pre-save hook
- User lookup functions (exported for other modules)

## Exported Services
```javascript
getUserById(id)        // Used by other modules to populate references
getUserByEmail(email)  // Used by Auth module
formatUserResponse(user) // Standard user response format
```

## Testing Rules
- Unit test: getAllUsers, getUserById, updateUser, deleteUser
- Integration test: admin-only access, role validation
- Security test: cannot delete admin, cannot escalate own role
