# Donors Module

## Purpose
Manage donor profiles, families, and donor-related data.

## Public API
```
GET    /api/donors           — List donors (searchable)
POST   /api/donors           — Create donor
GET    /api/donors/:id       — Get donor detail
PUT    /api/donors/:id       — Update donor
DELETE /api/donors/:id       — Delete donor (if no donations)
GET    /api/donors/:id/donations — Donation history
POST   /api/donors/import    — Import donors from CSV
GET    /api/families         — List families
POST   /api/families         — Create family
```

## Domain Events
- `donor.created` — New donor registered
- `donor.updated` — Donor profile changed
- `donor.imported` — Bulk import completed

## Dependencies
- Users module (createdBy reference)

## Owned Models
- `Donor`
- `Family`

## Forbidden Imports
- Cannot import from Donations, Events, Ledger, or any financial module

## Responsibilities
- Donor CRUD with search/filter
- Family grouping
- Donor import from CSV
- PII protection (phone, email, address)

## Testing Rules
- Unit test: CRUD, family grouping, search
- Integration test: import, donor history
- Security test: PII protection, role-based access
