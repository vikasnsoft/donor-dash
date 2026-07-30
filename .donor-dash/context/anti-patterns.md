# Anti-Patterns

## Architecture Anti-Patterns

### ❌ Direct Database Access from Controller
```javascript
// BAD: Controller queries database directly
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});  // Business logic in controller
  res.json(users);
});
```

```javascript
// GOOD: Controller delegates to service
const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAll();
  res.json(users);
});
```

### ❌ Cross-Module Direct Import
```javascript
// BAD: Expenses module imports Donation model
import Donation from '../donations/model.js';
```

```javascript
// GOOD: Use domain events
import { emitEvent } from '../shared/events.js';
emitEvent('expense.created', { expenseId, amount });
```

### ❌ Business Logic in Routes
```javascript
// BAD: Route contains logic
router.post('/expenses', protect, async (req, res) => {
  const amount = req.body.amount;
  if (amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
  // ...
});
```

```javascript
// GOOD: Route uses validator + controller
router.post('/expenses', protect, validate(expenseSchema), controller.create);
```

### ❌ Circular Dependencies
```
Module A → imports → Module B
Module B → imports → Module A  // CIRCULAR!
```

Break the cycle with domain events or a shared interface.

## Financial Anti-Patterns

### ❌ Floating-Point for Money
```javascript
// BAD: 0.1 + 0.2 = 0.30000000000000004
amount: { type: Number }
```

```javascript
// GOOD: Exact decimal representation
amount: { type: mongoose.Schema.Types.Decimal128 }
```

### ❌ Balance Update Without Transaction
```javascript
// BAD: What if balance update fails?
await Expense.create(expense);
await Balance.updateOne({ user, group }, { $inc: { netBalance: amount } });
```

```javascript
// GOOD: Both succeed or both fail
const session = await mongoose.startSession();
session.startTransaction();
await Expense.create([expense], { session });
await Balance.updateOne({ user, group }, { $inc: { netBalance: amount } }, { session });
await session.commitTransaction();
```

### ❌ Modifying Posted Ledger Entries
```javascript
// BAD: Changing history
await LedgerEntry.updateOne({ _id }, { amount: newAmount });
```

```javascript
// GOOD: Void and re-create
await voidLedgerEntry(originalId);
await postEntry({ ...newEntry, references: originalId });
```

### ❌ Calculating Reports from Business Data
```javascript
// BAD: Report recalculates from donations/expenses
const totalDonations = await Donation.aggregate([...]);
```

```javascript
// GOOD: Report reads from ledger
const totalIncome = await LedgerEntry.aggregate([
  { $match: { 'lines.account': donationIncomeAccountId, status: 'posted' } },
  // ...
]);
```

### ❌ Storing Calculated Totals
```javascript
// BAD: Can drift out of sync
event.totalDonations = 50000;
```

```javascript
// GOOD: Derive from source data
const total = await LedgerEntry.aggregate([/* sum from ledger */]);
```

## Database Anti-Patterns

### ❌ No Projections
```javascript
// BAD: Returns all fields including large ones
const expenses = await Expense.find({ group: groupId });
```

```javascript
// GOOD: Only return needed fields
const expenses = await Expense.find({ group: groupId })
  .select('description amount paidBy date category');
```

### ❌ No Pagination
```javascript
// BAD: Returns entire collection
const donors = await Donor.find({});
```

```javascript
// GOOD: Paginated
const donors = await Donor.find({})
  .skip((page - 1) * limit).limit(limit);
```

### ❌ N+1 Query
```javascript
// BAD: One query per group
for (const group of groups) {
  group.members = await User.find({ _id: { $in: group.memberIds } });
}
```

```javascript
// GOOD: Single query with population
const groups = await Group.find({}).populate('members.user', 'name avatar');
```

## Frontend Anti-Patterns

### ❌ Custom Primitive Components
```tsx
// BAD: Creating custom button
<button className="custom-button">Click</button>
```

```tsx
// GOOD: Use shadcn/ui
<Button>Click</Button>
```

### ❌ No Loading/Error States
```tsx
// BAD: No feedback during loading
const { data } = useQuery(...);
return <div>{data?.name}</div>;
```

```tsx
// GOOD: Handle all states
const { data, isLoading, error } = useQuery(...);
if (isLoading) return <Skeleton />;
if (error) return <ErrorMessage />;
return <div>{data.name}</div>;
```

### ❌ Direct API Calls in Components
```tsx
// BAD: Axios call in component
const handleClick = async () => {
  const res = await axios.post('/api/donations', data);
};
```

```tsx
// GOOD: Use mutation hook
const mutation = useMutation({ mutationFn: api.createDonation });
const handleClick = () => mutation.mutate(data);
```
