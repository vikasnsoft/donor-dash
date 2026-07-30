# Auth Module

## Purpose
Handle user authentication: login, register, logout, JWT session management.

## Public API
```
POST /api/auth/login      — Authenticate user, set JWT cookie
POST /api/auth/register   — Create new user, set JWT cookie
POST /api/auth/logout     — Clear JWT cookie
GET  /api/auth/me          — Get current user profile (protected)
PUT  /api/auth/profile     — Update current user profile (protected)
```

## Domain Events
- `user.registered` — New user created
- `user.login` — User authenticated
- `user.logout` — User logged out
- `user.profile.updated` — Profile changed

## Dependencies
- Users module (User model for lookup)

## Owned Models
None (uses User model from Users module)

## Forbidden Imports
- Cannot import from any module except Users (model only)
- Cannot access Donors, Events, Donations, or any other module

## Responsibilities
- Password hashing (bcrypt)
- JWT generation and cookie management
- Credential validation
- Session management

## Testing Rules
- Unit test: authenticateUser, createUser
- Integration test: all endpoints with valid/invalid credentials
- Security test: rate limiting, cookie flags
