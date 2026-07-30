# ADR-0007: Ledger Independence from Business Modules

## Status
Accepted

## Context
The ledger module records all financial transactions. The question is whether the ledger should know about business entities (donations, expenses) or be a pure accounting system.

## Decision
The ledger module is **independent** of business modules. It only knows about:
- Accounts (chart of accounts)
- Journal entries (debit/credit lines)
- Amounts (Decimal128)
- Reference numbers

Business modules **push entries** to the ledger via the Ledger Service. The ledger never queries business collections.

```
Donation Service  →  Ledger Service  →  Ledger Model
Expense Service   →  Ledger Service  →  Ledger Model
Settlement Service →  Ledger Service  →  Ledger Model
```

## Consequences
**Positive:**
- Ledger is reusable across all financial features
- No circular dependencies
- Clean separation of accounting and business logic
- Ledger can be replaced/upgraded independently
- Reports are derived from ledger (single source of truth)

**Negative:**
- Business modules must include reference data when pushing entries
- Cannot join ledger data with business data in a single query
- Must use sourceId + sourceType for linking (polymorphic reference)

## Implementation
Business modules store the `ledgerEntryId` on their documents:
```javascript
donation.ledgerEntry = ledgerEntry._id;
```

The ledger stores a generic reference:
```javascript
ledgerEntry.sourceType = 'donation';
ledgerEntry.sourceId = donation._id;
```
