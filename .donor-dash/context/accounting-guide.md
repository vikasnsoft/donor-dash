# Accounting Guide

## Principle
Donor Dash uses **double-entry bookkeeping**. Every financial operation creates a balanced journal entry where total debits equal total credits.

## Chart of Accounts

### Assets (What we own)
| Code | Account | Type | Description |
|------|---------|------|-------------|
| 1000 | Cash | Asset | Physical cash on hand |
| 1010 | Bank Account | Asset | Main bank account |
| 1020 | UPI Wallet | Asset | Digital wallet balance |
| 1030 | Receivables | Asset | Money owed to us (pledges) |
| 1040 | Inventory | Asset | Event assets (decorations, equipment) |

### Liabilities (What we owe)
| Code | Account | Type | Description |
|------|---------|------|-------------|
| 2000 | Payables | Liability | Money we owe (vendor payments) |
| 2010 | Outstanding Settlements | Liability | Pending settlements between members |

### Income (What we earn)
| Code | Account | Type | Description |
|------|---------|------|-------------|
| 3000 | Donation Income | Income | All donations received |
| 3010 | Collection Income | Income | Door-to-door and campaign collections |
| 3020 | Other Income | Income | Interest, miscellaneous |

### Expenses (What we spend)
| Code | Account | Type | Description |
|------|---------|------|-------------|
| 4000 | Decoration Expense | Expense | Event decorations |
| 4010 | Venue Expense | Expense | Hall rental, pandal construction |
| 4020 | Sound & Lighting | Expense | Audio/visual equipment |
| 4030 | Prasad Expense | Expense | Food offerings |
| 4040 | Committee Expense | Expense | Administrative costs |
| 4050 | Volunteer Expense | Expense | Volunteer reimbursements |
| 4060 | Miscellaneous Expense | Expense | Other expenses |

### Equity (Net worth)
| Code | Account | Type | Description |
|------|---------|------|-------------|
| 5000 | Opening Balance | Equity | Starting balance |
| 5010 | Retained Earnings | Equity | Accumulated surplus/deficit |

## Debit/Credit Rules

| Account Type | Increases With | Decreases With |
|-------------|---------------|---------------|
| Asset | Debit | Credit |
| Liability | Credit | Debit |
| Income | Credit | Debit |
| Expense | Debit | Credit |
| Equity | Credit | Debit |

## Transaction Examples

### Donation Received (Cash ₹500)
```
Debit:  Cash (1000)              ₹500
Credit: Donation Income (3000)   ₹500
```

### Donation Received (UPI ₹1000)
```
Debit:  UPI Wallet (1020)        ₹1000
Credit: Donation Income (3000)   ₹1000
```

### Expense: Decoration (Cash ₹2000)
```
Debit:  Decoration Expense (4000)  ₹2000
Credit: Cash (1000)                ₹2000
```

### Transfer: Cash to Bank (₹5000)
```
Debit:  Bank Account (1010)  ₹5000
Credit: Cash (1000)          ₹5000
```

### Vendor Payment (Bank ₹3000)
```
Debit:  Venue Expense (4010)   ₹3000
Credit: Bank Account (1010)    ₹3000
```

### Pledge Recorded (₹10000)
```
Debit:  Receivables (1030)       ₹10000
Credit: Donation Income (3000)   ₹10000
```

### Pledge Fulfilled (Cash ₹10000)
```
Debit:  Cash (1000)          ₹10000
Credit: Receivables (1030)   ₹10000
```

### Opening Balance (₹25000 cash)
```
Debit:  Cash (1000)              ₹25000
Credit: Opening Balance (5000)   ₹25000
```

## Settlement Rules

### Member A settles ₹500 to Member B
```
Debit:  Outstanding Settlements (2010)  ₹500
Credit: Cash (1000)                     ₹500
```

## Void Rules

To void a posted entry:
1. Create a new entry with reversed debits/credits
2. Reference the original entry ID
3. Both entries remain in the ledger (immutable)

### Void Donation of ₹500
```
Original:
  Debit:  Cash ₹500
  Credit: Donation Income ₹500

Void Entry:
  Debit:  Donation Income ₹500
  Credit: Cash ₹500
  Reference: original_entry_id
```

## Reconciliation

Periodically verify that:
1. Cached account balances match ledger sums
2. Cash on hand matches Cash account balance
3. Bank statement matches Bank Account balance
4. Total debits = Total credits across all entries

The reconciliation endpoint recalculates all balances from the ledger and compares with cached values.
