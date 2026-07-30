# Events Module

## Purpose
Manage events, campaigns, committees, and volunteer assignments.

## Public API
```
GET    /api/events                    — List events
POST   /api/events                    — Create event
GET    /api/events/:id                — Get event detail
PUT    /api/events/:id                — Update event
DELETE /api/events/:id                — Archive event
GET    /api/events/:id/summary        — Event financial summary
POST   /api/events/:id/committee      — Assign committee members
GET    /api/campaigns                 — List campaigns
POST   /api/campaigns                 — Create campaign
GET    /api/campaigns/:id             — Get campaign detail
POST   /api/campaigns/:id/volunteers  — Assign volunteers
```

## Domain Events
- `event.created` — New event created
- `event.updated` — Event details changed
- `event.status.changed` — Event status transition
- `campaign.created` — New campaign started
- `campaign.completed` — Campaign finished
- `volunteer.assigned` — Volunteer assigned to campaign

## Dependencies
- Users module (committee, volunteer references)

## Owned Models
- `Event`
- `Campaign`

## Forbidden Imports
- Cannot import from Donations, Expenses, Ledger, or Reports

## Responsibilities
- Event and campaign CRUD
- Committee management
- Volunteer assignment
- Event status lifecycle

## Testing Rules
- Unit test: CRUD, status transitions, committee management
- Integration test: campaign creation, volunteer assignment
- Security test: role-based event access
