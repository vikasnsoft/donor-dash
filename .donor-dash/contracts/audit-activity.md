# Audit Module

## Purpose
Maintain an immutable security log of all data mutations for compliance and debugging.

## Public API
```
GET /api/audit — Query audit logs (admin only)
```

## Domain Events
None (audit is a consumer, not a producer)

## Dependencies
- Users module (userId reference)

## Owned Models
- `AuditLog`

## Forbidden Imports
- Cannot import from any business module

## Responsibilities
- Record every data mutation (who, what, when, before/after)
- Provide query interface for audit trails
- Enforce immutability (no updates or deletes)

## Invariants
- Audit logs are append-only
- Audit logs cannot be modified
- Audit logs cannot be deleted
- Every mutating operation must be logged

---

# Activity Module

## Purpose
Maintain a user-friendly activity feed showing what happened in groups and events.

## Public API
```
GET /api/activity              — User's recent activity
GET /api/groups/:id/activity   — Group activity feed
GET /api/events/:id/activity   — Event activity feed
```

## Domain Events
None (activity is a consumer, not a producer)

## Dependencies
- Users module (userId reference)
- Groups module (groupId reference)
- Events module (eventId reference)

## Owned Models
- `Activity`

## Responsibilities
- Record human-readable activity entries
- Support soft delete (archive)
- Provide paginated feeds scoped to groups/events
