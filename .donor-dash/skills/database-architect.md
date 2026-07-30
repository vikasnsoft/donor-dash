# Database Architect Skill

## Purpose
Design and review MongoDB schemas, indexes, relationships, and query patterns.

## When to Invoke
- Creating or modifying Mongoose models
- Adding indexes
- Designing relationships between collections
- Optimizing queries
- Planning migrations

## Design Principles

### 1. Embed vs Reference
- **Embed** when data is always accessed together and is bounded (e.g., `splits` in Expense)
- **Reference** when data is shared across documents or unbounded (e.g., `userId` references)
- **Rule of thumb**: If the subdocument could grow unbounded, reference it

### 2. Index Strategy
- Index fields used in `find()`, `sort()`, and `match()` stages of aggregation
- Compound indexes for queries that filter + sort on multiple fields
- Unique indexes for natural keys (email, inviteCode, receiptNumber)
- Sparse indexes for optional unique fields

### 3. Decimal128 for Money
```javascript
amount: {
  type: mongoose.Schema.Types.Decimal128,
  required: true,
}
```
Never use `Number` for monetary amounts.

### 4. Timestamps
All models must have `{ timestamps: true }` for audit trail.

### 5. Soft Delete
Use `isDeleted: { type: Boolean, default: false }` instead of actually removing documents. Filter with `{ isDeleted: false }` in queries.

## Schema Review Checklist

### Fields
- [ ] All required fields have `required: true`
- [ ] Enums use `type: String, enum: [...]`
- [ ] References use `type: mongoose.Schema.Types.ObjectId, ref: 'Model'`
- [ ] Monetary amounts use `Decimal128`
- [ ] Defaults are sensible

### Indexes
- [ ] Query patterns identified
- [ ] Compound indexes for multi-field queries
- [ ] Unique constraints on natural keys
- [ ] No redundant indexes

### Relationships
- [ ] One-to-many: reference from "many" side
- [ ] Many-to-many: array of references or junction collection
- [ ] Bidirectional references avoided (unless necessary for performance)

### Performance
- [ ] Projections limit returned fields
- [ ] Pagination implemented (not `.find({})` without limit)
- [ ] Population is selective (only needed fields)

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Collection | PascalCase, plural | `Users`, `Donations` |
| Field | camelCase | `createdAt`, `paidBy` |
| Reference field | camelCase with Id suffix | `userId`, `eventId` |
| Boolean field | is/has prefix | `isDeleted`, `hasReceipt` |
| Enum values | snake_case | `door_to_door`, `bank_transfer` |

## Common Patterns

### Polymorphic Reference (for Audit/Activity)
```javascript
entityId: { type: mongoose.Schema.Types.ObjectId },
entityType: { type: String }  // 'Donation', 'Expense', etc.
```

### Cached Aggregate (for Balances)
```javascript
// Update in same transaction as source data
balance.netBalance = computedBalance;
balance.lastUpdated = new Date();
```

### Soft Delete Pattern
```javascript
// In service layer, always filter
const expenses = await Expense.find({ group: groupId, isDeleted: false });
```

## Rules
- Never add fields to a model without understanding all consumers
- Never remove fields without a migration plan
- Never create indexes without analyzing query patterns
- Always use transactions for multi-collection writes
