# Ledger Module

## Purpose
Maintain the double-entry accounting system. Record all financial transactions as balanced journal entries.

## Public API
```
GET    /api/ledger/entries           — List journal entries
POST   /api/ledger/entries          — Create manual entry (admin only)
GET    /api/ledger/entries/:id      — Get entry detail
PUT    /api/ledger/entries/:id/void — Void an entry (admin only)
GET    /api/ledger/accounts         — List chart of accounts
POST   /api/ledger/accounts         — Create account (admin only)
GET    /api/ledger/trial-balance    — Generate trial balance
GET    /api/ledger/cash-book        — Cash book report
GET    /api/ledger/bank-book        — Bank book report
```

## Domain Events
- `ledger.entry.posted` — Entry finalized
- `ledger.entry.voided` — Entry reversed
- `ledger.reconciliation.complete` — Reconciliation finished

## Dependencies
None (standalone financial module)

## Owned Models
- `Account` (Chart of Accounts)
- `LedgerEntry` (Journal Entries)

## Forbidden Imports
- Cannot import from Donors, Events, Expenses, Donations, or any business module
- Business modules push entries TO the ledger; the ledger never pulls

## Responsibilities
- Validate entries balance (debits = credits)
- Post entries (draft → posted)
- Void entries (create reverse entry)
- Calculate account balances
- Generate trial balance
- Generate cash book and bank book

## Exported Services
```javascript
postEntry(data, session)       // Create and post a journal entry
voidEntry(entryId, userId)     // Reverse a posted entry
getAccountBalance(accountId)   // Get current balance for an account
getTrialBalance()              // Generate trial balance
```

## Financial Invariants
- Every entry must have ≥ 2 lines
- Total debits must equal total credits
- Posted entries are immutable
- Void entries must reference the original entry
- Amounts must be Decimal128, never Number

## Testing Rules
- Unit test: balance validation, void logic, account balance calculation
- Integration test: full entry lifecycle (draft → posted → void)
- Financial test: trial balance always sums to zero
