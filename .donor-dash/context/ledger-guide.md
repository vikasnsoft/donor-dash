# Ledger Guide

## Architecture
The ledger is the **single source of truth** for all financial data. Every financial operation in Donor Dash creates a ledger entry. Reports, balances, and summaries are all derived from the ledger.

## Key Principle: Ledger Independence
The ledger module **never imports** from business modules (Donations, Expenses, Settlements). Business modules **push entries** to the ledger via the Ledger Service.

```
Donation Service  ──→  Ledger Service  ──→  Ledger Model
Expense Service   ──→  Ledger Service  ──→  Ledger Model
Settlement Service──→  Ledger Service  ──→  Ledger Model
```

## Ledger Entry Structure

```javascript
{
  date: Date,                    // When the transaction occurred
  description: String,           // Human-readable description
  eventId: ObjectId,             // Optional: linked event
  sourceType: String,            // 'donation' | 'expense' | 'settlement' | 'adjustment' | 'opening_balance'
  sourceId: ObjectId,            // ID of the source document (stored in business module)
  lines: [{
    account: ObjectId,           // Reference to Account
    type: 'debit' | 'credit',
    amount: Decimal128
  }],
  status: 'draft' | 'posted' | 'void',
  createdBy: ObjectId,           // User who created the entry
  verifiedBy: ObjectId,          // Optional: auditor who verified
}
```

## Creating Ledger Entries

### Via Ledger Service
```javascript
import { postEntry } from '../ledger/service.js';

await postEntry({
  date: new Date(),
  description: 'Donation from Ramesh Patil - Ganpati 2026',
  eventId: eventId,
  sourceType: 'donation',
  sourceId: donationId,
  lines: [
    { account: cashAccountId, type: 'debit', amount: Decimal128('500') },
    { account: donationIncomeAccountId, type: 'credit', amount: Decimal128('500') },
  ],
  createdBy: userId,
}, { session });  // Pass MongoDB session for transaction
```

### Validation Rules
1. Entry must have at least 2 lines
2. Total debits must equal total credits
3. Each line's amount must be positive
4. Account must exist and be active
5. Entry cannot be modified once status is 'posted'

## Entry Lifecycle

```
draft → posted → void (if correction needed)
```

- **draft**: Entry is created but not finalized. Can be edited.
- **posted**: Entry is finalized and immutable. Cannot be changed.
- **void**: Entry is reversed. A new reverse entry is created.

## Querying the Ledger

### Account Balance
```javascript
const balance = await LedgerEntry.aggregate([
  { $match: { status: 'posted', 'lines.account': accountId } },
  { $unwind: '$lines' },
  { $match: { 'lines.account': accountId } },
  { $group: {
    _id: '$lines.type',
    total: { $sum: { $toDouble: '$lines.amount' } }
  }}
]);
// balance = debits - credits (for assets/expenses) or credits - debits (for liabilities/income/equity)
```

### Trial Balance
```javascript
const trialBalance = await LedgerEntry.aggregate([
  { $match: { status: 'posted' } },
  { $unwind: '$lines' },
  { $group: {
    _id: { account: '$lines.account', type: '$lines.type' },
    total: { $sum: { $toDouble: '$lines.amount' } }
  }}
]);
// Verify: sum of all debits === sum of all credits
```

## Rules
- Never modify a posted entry
- Never delete any ledger entry
- Always use MongoDB transactions when creating entries alongside business operations
- Always verify debits = credits before posting
- The ledger never queries business collections directly
