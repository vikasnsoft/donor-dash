# Donations Module

## Purpose
Record and manage donations from donors to events.

## Public API
```
GET    /api/donations                — List donations
POST   /api/donations                — Record donation
GET    /api/donations/:id            — Get donation detail
PUT    /api/donations/:id            — Update donation
GET    /api/donations/:id/receipt    — Get receipt
GET    /api/events/:id/donations     — Event's donations
POST   /api/donations/:id/receipt/print — Print receipt
```

## Domain Events
- `donation.recorded` — New donation received
- `donation.updated` — Donation modified
- `donation.cancelled` — Donation cancelled
- `donation.refunded` — Donation refunded

## Dependencies
- Donors module (donor reference)
- Events module (event, campaign references)
- Ledger module (creates ledger entries)

## Owned Models
- `Donation`

## Forbidden Imports
- Cannot import from Expenses, Groups, Settlements

## Responsibilities
- Donation CRUD
- Receipt number generation (unique, sequential)
- Ledger entry creation (in transaction)
- Pledge vs received tracking

## Financial Invariants
- Donations cannot be deleted, only cancelled/refunded
- Every donation creates a balanced ledger entry
- Receipt numbers are never reused
- Amount must be Decimal128

## Testing Rules
- Unit test: CRUD, receipt generation, status transitions
- Integration test: donation with ledger entry verification
- Financial test: ledger entry balances, receipt uniqueness
