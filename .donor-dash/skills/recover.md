# Recover Skill

## Purpose
Diagnose and fix issues, bugs, and errors in the codebase.

## When to Invoke
- Something is broken
- Tests are failing
- Build errors
- Runtime errors
- Unexpected behavior

## Process

### 1. Reproduce
- Understand what the user observes
- Identify the exact error message or behavior
- Determine when it started (if known)

### 2. Investigate
- Read the error message carefully
- Check the stack trace for the originating file
- Read the relevant code
- Check recent changes if available (git log)

### 3. Diagnose
- Identify the root cause (not just the symptom)
- Consider common failure patterns:
  - Import path errors (especially after modular migration)
  - Missing environment variables
  - Type mismatches
  - Async/await issues
  - Middleware ordering

### 4. Fix
- Make the minimal change that fixes the issue
- Don't refactor surrounding code unless it's the cause
- Verify the fix doesn't break other functionality

### 5. Verify
- Run the affected code/tests
- Check for related issues
- Confirm with the user

## Common Issues in Donor Dash

### Backend
- **Import paths**: After modular migration, imports use `../../` paths. Verify they resolve correctly.
- **Mongoose model registration**: Models must be imported before use. Check that the model file is imported somewhere in the module chain.
- **Middleware ordering**: `protect` must run before role checks. `auditMiddleware` needs `req.user` to exist.
- **ES Module syntax**: Backend uses `"type": "module"`. No `require()`, use `import`.

### Frontend
- **Next.js App Router**: Pages must be in `(routes)` directory. "use client" directive required for interactive components.
- **TanStack Query**: Query keys must match between `setQueryData` and `useQuery`.
- **API endpoints**: Auth endpoints are `/api/auth/*`, user management is `/api/users/*`.

## Rules
- Always read the error before guessing
- Always verify the fix works
- Never make unrelated changes while fixing a bug
