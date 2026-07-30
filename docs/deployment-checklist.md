# Deployment Checklist

## Pre-Deployment

### Code Quality
- [ ] All CI checks pass (lint, typecheck, build)
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Frontend builds successfully

### Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual smoke test completed
- [ ] Financial workflows verified (if applicable)

### Database
- [ ] Database migrations reviewed and tested
- [ ] Backup verified (most recent < 24 hours)
- [ ] Seed data updated (if schema changed)
- [ ] Index performance verified

### Security
- [ ] No secrets in code or commits
- [ ] Dependencies audited (`npm audit`)
- [ ] Authorization coverage verified
- [ ] Rate limiting configured

### Configuration
- [ ] Environment variables documented
- [ ] GitHub Environments configured
- [ ] Secrets rotated (if needed)
- [ ] Feature flags reviewed

## Deployment

### Staging
- [ ] Deploy to staging environment
- [ ] Verify health endpoints (`/health`, `/ready`, `/live`)
- [ ] Test critical workflows
- [ ] Verify queue processing (BullMQ)
- [ ] Check projection updates
- [ ] Monitor error rates (Sentry)

### Production
- [ ] Staging deployment verified
- [ ] Production backup completed
- [ ] Deploy to production
- [ ] Verify health endpoints
- [ ] Monitor error rates for 15 minutes
- [ ] Check queue processing
- [ ] Verify dashboards loading

## Post-Deployment

### Verification
- [ ] Login/authentication working
- [ ] Create organisation
- [ ] Create event
- [ ] Record donation
- [ ] Check ledger entry created
- [ ] Check projection updated
- [ ] Check dashboard reflects new data
- [ ] Check notifications working

### Monitoring
- [ ] Sentry error tracking active
- [ ] Queue health monitoring active
- [ ] Database connection stable
- [ ] Response times acceptable (< 500ms)

### Rollback Plan
- [ ] Previous deployment artifacts available
- [ ] Database rollback scripts ready (if migrations run)
- [ ] Rollback commands documented
- [ ] Team notified of deployment

## Release Notes

### Version: v1.0.0
**Date**: 2026-07-30

### Changes
- Initial platform release
- 20 backend modules
- Double-entry accounting engine
- Projection engine with 6 read models
- BullMQ background job infrastructure
- Dashboard framework with role-based views
- Unified search

### Breaking Changes
- None (initial release)

### Migration Notes
- Run seeders to create initial data: `npm run data:import`
- Create default Chart of Accounts for each organisation

### Known Issues
- OCR not yet integrated (Phase 2.4)
- AI assistant not yet integrated (Phase 2.6)
- Mobile app not yet available (Phase 3.0)
