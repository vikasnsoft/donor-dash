# Expenses Module

## Purpose
Manage shared expenses within groups, including splits, balance calculation, and debt simplification.

## Public API
```
GET    /api/expenses                 — List user's expenses
POST   /api/expenses                 — Create expense
GET    /api/expenses/:id             — Get expense detail
PUT    /api/expenses/:id             — Update expense
DELETE /api/expenses/:id             — Soft delete expense
GET    /api/groups/:id/expenses      — List group's expenses
GET    /api/balances/me              — User's overall balance
GET    /api/balances/group/:id       — Group balance breakdown
GET    /api/balances/group/:id/simplify — Simplified debt suggestions
POST   /api/balances/group/:id/recalculate — Force reconciliation
```

## Domain Events
- `expense.created` — New expense added
- `expense.updated` — Expense modified
- `expense.deleted` — Expense soft deleted
- `balance.updated` — Balance changed

## Dependencies
- Groups module (isMember check, group reference)
- Users module (paidBy, split references)
- Ledger module (creates ledger entries)

## Owned Models
- `Expense`
- `Balance`

## Forbidden Imports
- Cannot import from Donations, Events, Donors, or Reports

## Responsibilities
- Expense CRUD with split validation
- Balance calculation (cached, updated in transactions)
- Debt simplification (greedy netting algorithm)
- Ledger entry creation for expenses
- Balance reconciliation

## Financial Invariants
- Split amounts must sum to total expense amount
- Each split must be assigned to a valid group member
- Balances updated in same MongoDB transaction as expense
- Soft delete only (isDeleted flag)

## Testing Rules
- Unit test: split calculations, balance updates, debt simplification
- Integration test: expense CRUD with balance verification
- Financial test: splits always sum to total, balances always consistent
