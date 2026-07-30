# Release Manager Skill

## Purpose
Manage releases, migrations, deployments, and rollbacks safely.

## When to Invoke
- Preparing a release
- Database schema changes
- Breaking API changes
- Deployment to production

## Release Checklist

### Pre-Release
- [ ] All tests pass (`npm test`)
- [ ] No lint errors (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Security review complete (if security-related changes)
- [ ] Finance audit complete (if financial changes)
- [ ] API documentation updated (Swagger)
- [ ] Migration scripts tested (if schema changes)

### Database Migrations
When schema changes are needed:

1. **Additive changes** (new optional fields): Safe, no migration needed
2. **Required new fields**: Add with default value, then backfill
3. **Field renames**: Add new field → copy data → update code → remove old field
4. **Field removals**: Remove from code first → verify → remove from schema

Migration script format:
```javascript
// migrations/YYYY-MM-DD-description.js
export async function up(db) {
  // Forward migration
}

export async function down(db) {
  // Rollback
}
```

### Breaking API Changes
1. Add new endpoint alongside old one
2. Update clients to use new endpoint
3. Deprecate old endpoint (add warning header)
4. Remove old endpoint after grace period

### Deployment Order
1. Run database migrations (if any)
2. Deploy backend
3. Deploy frontend
4. Verify health endpoint
5. Smoke test critical paths

### Rollback Plan
1. Keep previous deployment artifacts
2. Document rollback commands
3. Database rollback scripts (if migrations were run)
4. Monitor error rates post-deployment

## Versioning

Follow semver:
- **Major**: Breaking API changes, major schema changes
- **Minor**: New features, new modules
- **Patch**: Bug fixes, performance improvements

## Release Notes Format

```markdown
## v2.1.0 — [Date]

### New Features
- Event management with campaigns and committees
- Donation recording with multi-method support

### Improvements
- Dashboard now shows event-centric summary
- Performance: Added indexes for donation queries

### Bug Fixes
- Fixed balance calculation rounding error

### Breaking Changes
- Auth endpoints moved from /api/users/* to /api/auth/*
  - POST /api/users/auth → POST /api/auth/login
  - POST /api/users → POST /api/auth/register

### Migration Notes
- Run `npm run migrate` to backfill new User fields
```
