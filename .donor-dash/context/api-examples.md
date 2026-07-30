# API Examples

Concrete examples of correct API patterns. AI copies examples better than prose.

---

## Creating a Resource

### Good
```javascript
// POST /api/donors
// Body: { "name": "Ramesh Patil", "phone": "+91 98765 43210", "type": "individual" }

// Controller
const create = asyncHandler(async (req, res) => {
  const donor = await donorService.create(req.body);
  res.status(201).json(donor);
});

// Service
export const create = async (data) => {
  const existing = await Donor.findOne({ phone: data.phone });
  if (existing) {
    const error = new Error('Donor with this phone already exists');
    error.statusCode = 409;
    throw error;
  }
  return await Donor.create(data);
};
```

### Bad
```javascript
// Controller has business logic
const create = asyncHandler(async (req, res) => {
  const existing = await Donor.findOne({ phone: req.body.phone });  // ❌ Direct DB query
  if (existing) return res.status(409).json({ error: 'Duplicate' }); // ❌ Logic in controller
  const donor = await Donor.create(req.body);                        // ❌ Direct DB query
  res.status(201).json(donor);
});
```

---

## Paginated List

### Good
```javascript
// GET /api/donors?page=1&limit=20&sort=-createdAt&type=individual

// Controller
const getAll = asyncHandler(async (req, res) => {
  const result = await donorService.getAll(req.query);
  res.json(result);
});

// Service
export const getAll = async ({ page = 1, limit = 20, sort = '-createdAt', ...filters }) => {
  const filter = {};
  if (filters.type) filter.type = filters.type;
  if (filters.city) filter.address = { $regex: filters.city, $options: 'i' };

  const [data, total] = await Promise.all([
    Donor.find(filter)
      .select('name phone type totalDonated lastDonationDate')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
    Donor.countDocuments(filter),
  ]);

  return {
    data,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
  };
};
```

---

## Financial Operation with Transaction

### Good
```javascript
// Service
export const recordDonation = async (data, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const donation = await Donation.create([{ ...data, createdBy: userId }], { session });

    await postEntry({
      date: new Date(),
      description: `Donation from ${data.donorName}`,
      sourceType: 'donation',
      sourceId: donation[0]._id,
      lines: [
        { account: cashAccountId, type: 'debit', amount: Decimal128.fromString(String(data.amount)) },
        { account: donationIncomeAccountId, type: 'credit', amount: Decimal128.fromString(String(data.amount)) },
      ],
      createdBy: userId,
    }, { session });

    await session.commitTransaction();
    return donation[0];
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};
```

---

## Error Handling

### Good
```javascript
// Service throws with statusCode
if (!expense) {
  const error = new Error('Expense not found');
  error.statusCode = 404;
  throw error;
}

// asyncHandler catches and passes to error middleware
// errorMiddleware formats response:
// { success: false, error: "Expense not found" }
```

### Bad
```javascript
// Controller handles error directly
if (!expense) {
  return res.status(404).json({ success: false, error: 'Not found' }); // ❌
}
```

---

## Validation

### Good
```javascript
// Route
router.post('/', protect, validate(createDonationSchema), controller.create);

// Validator
export const createDonationSchema = z.object({
  body: z.object({
    donorId: z.string().min(1, 'Donor is required'),
    eventId: z.string().min(1, 'Event is required'),
    amount: z.number().positive('Amount must be positive'),
    method: z.enum(['cash', 'upi', 'bank_transfer', 'cheque', 'online', 'qr']),
    notes: z.string().max(500).optional(),
  }),
});
```

---

## Filtering with Date Range

```javascript
// GET /api/donations?from=2025-01-01&to=2025-12-31&method=cash

const filter = {};
if (query.method) filter.method = query.method;
if (query.from || query.to) {
  filter.date = {};
  if (query.from) filter.date.$gte = new Date(query.from);
  if (query.to) filter.date.$lte = new Date(query.to + 'T23:59:59.999Z');
}
```

---

## Populating References

```javascript
// Good: Selective population
const expense = await Expense.findById(id)
  .populate('paidBy', 'name avatar')
  .populate('group', 'name');

// Bad: Populates everything
const expense = await Expense.findById(id).populate('paidBy'); // ❌ Returns all fields
```
