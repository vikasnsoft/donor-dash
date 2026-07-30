# Collections Module

## Purpose
Manage volunteer collection batches — groups of donations made by one volunteer during a campaign.

## Public API
```
GET    /api/collections                — List collections
POST   /api/collections                — Create collection
GET    /api/collections/:id            — Get collection detail
PUT    /api/collections/:id/submit     — Submit for verification
PUT    /api/collections/:id/verify     — Verify collection
GET    /api/campaigns/:id/collections  — Campaign's collections
```

## Domain Events
- `collection.created` — New collection started
- `collection.submitted` — Volunteer submitted collection
- `collection.verified` — Collection verified by supervisor

## Dependencies
- Events module (campaign reference)
- Users module (volunteer reference)
- Donations module (donation references)

## Owned Models
- `Collection`

## Testing Rules
- Unit test: CRUD, status transitions, total calculation
- Integration test: collection with donations, verification flow
- Security test: volunteers can only see own collections
