# Finance Auditor Skill

## Purpose
Review all financial logic for correctness, compliance, and integrity. This is the most critical skill in Donor Dash.

## When to Invoke
- ANY change to financial models (Donation, Expense, Settlement, Ledger)
- ANY change to balance calculations
- ANY change to accounting logic
- ANY change to report generation
- When the user asks about financial correctness

## Critical Rules

### Rule 1: Every Financial Operation Must Create a Ledger Entry
```
Donation received   → Debit: Cash,        Credit: Donation Income
Expense recorded    → Debit: Expense,      Credit: Cash
Settlement made     → Debit: Payables,     Credit: Cash
Refund processed    → Debit: Donation Income, Credit: Cash
Opening balance     → Debit: Cash,         Credit: Equity
```

### Rule 2: Every Ledger Entry Must Balance
```
Total Debits === Total Credits
```
No exceptions. If they don't balance, the entry must be rejected.

### Rule 3: Use Decimal128 for All Monetary Amounts
Never use floating-point for money. MongoDB's `Decimal128` prevents rounding errors.

### Rule 4: Use Transactions for Multi-Step Financial Operations
```javascript
const session = await mongoose.startSession();
session.startTransaction();
try {
  // 1. Create the expense
  // 2. Update balances
  // 3. Create ledger entry
  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();
  throw err;
} finally {
  session.endSession();
}
```

### Rule 5: Never Modify Posted Ledger Entries
Posted entries are immutable. To correct an error:
1. Create a voiding entry (reverse debit/credit)
2. Create a new correct entry
3. Both reference the original entry

### Rule 6: Audit Trail Is Mandatory
Every financial mutation must be logged in the Audit Log with:
- Who made the change
- What changed
- When it changed
- The before/after values

## Review Checklist

### Ledger Entries
- [ ] Entry balances (debits = credits)
- [ ] Correct accounts used
- [ ] Amount is Decimal128
- [ ] Entry is within a transaction
- [ ] Source reference exists (donation ID, expense ID, etc.)
- [ ] Status is correct (draft/posted/void)

### Balance Calculations
- [ ] Cached balances updated in same transaction
- [ ] Net balance = sum of all owed - sum of all owing
- [ ] Balance per group is independent
- [ ] Reconciliation endpoint exists for drift correction

### Settlements
- [ ] Settlement amount matches the balance owed
- [ ] Settlement creates ledger entry
- [ ] Both parties' balances updated
- [ ] Settlement status tracked (pending/confirmed/rejected)

### Reports
- [ ] Reports derived from ledger (not recalculated)
- [ ] Date ranges handled correctly (inclusive/exclusive)
- [ ] Currency conversion uses historical rates
- [ ] Totals match sum of line items

### Donations
- [ ] Receipt number generated
- [ ] Donation linked to donor, event, campaign
- [ ] Ledger entry created
- [ ] Pledge vs received status tracked

### Expenses (Shared)
- [ ] Split amounts sum to total expense amount
- [ ] Each split assigned to a valid group member
- [ ] Balance updates in same transaction
- [ ] Category assigned for reporting

## Common Financial Anti-Patterns

### ❌ Storing calculated totals without source
```
donation.totalCollected = 50000  // Where did this come from?
```
Instead: Always derive totals from individual entries.

### ❌ Using floating-point for money
```
amount: Number  // 0.1 + 0.2 = 0.30000000000000004
```
Instead: Use `mongoose.Schema.Types.Decimal128`.

### ❌ Updating balance without transaction
```
await Expense.create(expense);
await Balance.updateOne(balance);  // What if this fails?
```
Instead: Wrap both in a MongoDB transaction.

### ❌ Modifying posted ledger entries
```
await LedgerEntry.updateOne({ _id }, { amount: newAmount });
```
Instead: Void and re-create.

## Output Format

```markdown
## Finance Audit: [Feature/Change]

### Status: PASS | FAIL

### Ledger Review
- [Entry type]: [Correct/Issue]

### Balance Review
- [Calculation]: [Correct/Issue]

### Transaction Review
- [Operation]: [Wrapped in transaction: Yes/No]

### Audit Trail
- [Mutation]: [Logged: Yes/No]

### Issues
1. **[CRITICAL/HIGH]** [Description] → [Fix]

### Verdict
[Summary]
```
