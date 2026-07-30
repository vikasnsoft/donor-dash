# Database Guide

## MongoDB with Mongoose

Donor Dash uses MongoDB with Mongoose ODM. All models are in their respective module directories.

## Collections

| Collection | Module | Purpose |
|-----------|--------|---------|
| `users` | auth/users | User accounts |
| `donors` | donors | Donor profiles |
| `families` | donors | Family groupings |
| `events` | events | Events |
| `campaigns` | events | Collection campaigns |
| `donations` | donations | Donation records |
| `collections` | collections | Volunteer collection batches |
| `groups` | groups | Expense groups |
| `expenses` | expenses | Shared expenses |
| `settlements` | settlements | Settlement records |
| `balances` | expenses | Cached balance summaries |
| `accounts` | ledger | Chart of accounts |
| `ledgerentries` | ledger | Journal entries |
| `auditlogs` | audit | Immutable audit trail |
| `activities` | activity | User activity feed |
| `notifications` | notifications | Notification records |

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Collection | PascalCase, plural | `Donations`, `LedgerEntries` |
| Document field | camelCase | `createdAt`, `paidBy` |
| Reference field | camelCase + Id | `userId`, `eventId` |
| Boolean field | is/has prefix | `isDeleted`, `hasReceipt` |
| Enum values | snake_case | `door_to_door`, `bank_transfer` |
| Index name | field1_field2 | `event_1_createdAt_-1` |

## Money Handling

### Use Decimal128
```javascript
amount: {
  type: mongoose.Schema.Types.Decimal128,
  required: true,
}
```

### Converting
```javascript
// To Decimal128
const amount = mongoose.Types.Decimal128.fromString('500.00');

// From Decimal128 to number
const num = parseFloat(amount.toString());
```

### Rules
- Never use `Number` type for monetary amounts
- Always store in the smallest unit (paise for INR) OR store as decimal with 2 places
- Be consistent — Donor Dash stores as decimal (500.00, not 50000)

## Indexes

### Required Indexes
```javascript
// Users
userSchema.index({ email: 1 }, { unique: true });

// Donors
donorSchema.index({ phone: 1 });
donorSchema.index({ name: 'text', email: 'text' });

// Donations
donationSchema.index({ event: 1, createdAt: -1 });
donationSchema.index({ donor: 1, createdAt: -1 });
donationSchema.index({ receiptNumber: 1 }, { unique: true, sparse: true });

// Expenses
expenseSchema.index({ group: 1, isDeleted: 1, createdAt: -1 });

// Balances
balanceSchema.index({ user: 1, group: 1 }, { unique: true });

// Ledger
ledgerEntrySchema.index({ status: 1, createdAt: -1 });
ledgerEntrySchema.index({ 'lines.account': 1, status: 1 });

// Activity
activitySchema.index({ groupId: 1, createdAt: -1 });
activitySchema.index({ eventId: 1, createdAt: -1 });

// Audit
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
```

## Transactions

Use MongoDB transactions for multi-collection writes:

```javascript
const session = await mongoose.startSession();
session.startTransaction();
try {
  const donation = await Donation.create([data], { session });
  await LedgerEntry.create([entry], { session });
  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();
  throw err;
} finally {
  session.endSession();
}
```

### When to Use Transactions
- Creating donation + ledger entry
- Creating expense + updating balances + ledger entry
- Settlement + balance update + ledger entry
- Any operation that writes to 2+ collections

### When NOT to Use Transactions
- Single document writes
- Read-only operations
- Non-financial data (activity feed, notifications)

## Projections

Always limit returned fields:
```javascript
// ❌ Returns everything
const users = await User.find({});

// ✅ Returns only needed fields
const users = await User.find({}).select('name email role avatar');
```

## Population

Populate references selectively:
```javascript
// ❌ Populates everything
const expense = await Expense.findById(id).populate('paidBy');

// ✅ Populates only needed fields
const expense = await Expense.findById(id).populate('paidBy', 'name avatar');
```
