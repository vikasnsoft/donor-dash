# Settlements Module

## Purpose
Record payments between group members to resolve shared expense balances.

## Public API
```
GET    /api/settlements              — List user's settlements
POST   /api/settlements              — Create settlement
GET    /api/settlements/:id          — Get settlement detail
PUT    /api/settlements/:id/confirm  — Confirm receipt
PUT    /api/settlements/:id/reject   — Reject settlement
GET    /api/groups/:id/settlements   — List group's settlements
```

## Domain Events
- `settlement.created` — Payment proposed
- `settlement.confirmed` — Payment confirmed
- `settlement.rejected` — Payment rejected

## Dependencies
- Groups module (isMember check)
- Users module (paidBy, paidTo references)
- Ledger module (creates ledger entries)
- Expenses module (updates Balances)

## Owned Models
- `Settlement`

## Forbidden Imports
- Cannot import from Donations, Events, Donors

## Responsibilities
- Settlement CRUD
- Confirm/reject workflow
- Balance updates in same transaction
- Ledger entry creation

## Financial Invariants
- Settlement amount cannot exceed the owed balance
- Both parties must be group members
- Balance updated in same transaction as settlement
- Soft status tracking (pending → confirmed/rejected)

## Testing Rules
- Unit test: settlement creation, confirm/reject logic
- Integration test: settlement with balance verification
- Financial test: balances update correctly after settlement
