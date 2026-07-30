# Performance Reviewer Skill

## Purpose
Review code for performance issues, query efficiency, and scalability concerns.

## When to Invoke
- New database queries
- List endpoints that could grow large
- Aggregation pipelines
- Dashboard/report endpoints
- When performance issues are reported

## Common Performance Issues

### N+1 Queries
```javascript
// ❌ N+1: One query for groups, then one per group for members
const groups = await Group.find({});
for (const group of groups) {
  group.members = await User.find({ _id: { $in: group.memberIds } });
}

// ✅ Single query with population
const groups = await Group.find({}).populate('members.user', 'name email avatar');
```

### Missing Indexes
```javascript
// ❌ No index on commonly queried field
await Expense.find({ group: groupId, isDeleted: false });

// ✅ Add compound index
expenseSchema.index({ group: 1, isDeleted: 1, createdAt: -1 });
```

### No Projections
```javascript
// ❌ Returns all fields including large ones
const expenses = await Expense.find({ group: groupId });

// ✅ Only return needed fields
const expenses = await Expense.find({ group: groupId })
  .select('description amount paidBy splitType date category')
  .populate('paidBy', 'name avatar');
```

### No Pagination
```javascript
// ❌ Returns all records
const donations = await Donation.find({ event: eventId });

// ✅ Paginated
const donations = await Donation.find({ event: eventId })
  .sort({ date: -1 })
  .skip((page - 1) * limit)
  .limit(limit);
```

### Unbounded Aggregations
```javascript
// ❌ Aggregates entire collection
const result = await Donation.aggregate([...]);

// ✅ Match early to reduce pipeline input
const result = await Donation.aggregate([
  { $match: { event: eventId, status: 'received' } },  // First!
  { $group: { ... } },
]);
```

## Index Strategy

### Required Indexes
| Collection | Index | Purpose |
|-----------|-------|---------|
| Users | `{ email: 1 }` | Login lookup |
| Donations | `{ event: 1, createdAt: -1 }` | Event donation list |
| Donations | `{ donor: 1, createdAt: -1 }` | Donor history |
| Expenses | `{ group: 1, isDeleted: 1, createdAt: -1 }` | Group expense list |
| Balances | `{ user: 1, group: 1 }` | Balance lookup |
| Activities | `{ groupId: 1, createdAt: -1 }` | Activity feed |
| AuditLogs | `{ userId: 1, createdAt: -1 }` | User audit trail |

### Index Rules
- Compound index: most selective field first
- Include sort field in compound index
- Sparse index for optional unique fields

## Caching Strategy

| Data | Cache Duration | Invalidation |
|------|---------------|--------------|
| User profile | 5 min | On profile update |
| Group balances | Real-time | On expense/settlement |
| Reports | 1 hour | On data change |
| FX rates | 24 hours | Daily cron |

## Review Checklist
- [ ] No N+1 queries (use `populate` or aggregation)
- [ ] Projections limit returned fields
- [ ] Pagination on list endpoints
- [ ] Indexes for query patterns
- [ ] Aggregations match early
- [ ] Large datasets use cursors, not `find({})`
- [ ] No unnecessary `populate` calls
