# Coding Playbook

## Golden Rules

1. **One service, one responsibility.** A service does one thing well.
2. **Thin controllers.** Controllers extract input, call service, send response. Nothing else.
3. **No business logic in routes.** Routes define HTTP structure. Services define behavior.
4. **Never query another module directly.** Use domain events or shared interfaces.
5. **Always validate input.** Zod at the boundary, Mongoose at the model.
6. **Always use transactions for multi-step writes.** Especially financial operations.
7. **Never use `any`.** Every type must be explicit.
8. **Never duplicate logic.** If two modules need the same logic, extract to shared.
9. **Fail fast, fail loud.** Validate early, throw with statusCode.
10. **Log structured, not string.** Use Pino with objects.

## Adding a New Module

### Step 1: Create Directory
```
backend/src/modules/your-module/
├── model.js
├── controller.js
├── service.js
├── validator.js
├── routes.js
└── __tests__/
```

### Step 2: Define Model
```javascript
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  // fields
}, { timestamps: true });

// Indexes
schema.index({ field: 1 });

const Model = mongoose.model('Model', schema);
export default Model;
```

### Step 3: Define Validator
```javascript
import { z } from 'zod';

export const createSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    amount: z.number().positive(),
  }),
});
```

### Step 4: Implement Service
```javascript
import Model from './model.js';

export const create = async (data) => {
  return await Model.create(data);
};

export const getById = async (id) => {
  const entity = await Model.findById(id);
  if (!entity) {
    const error = new Error('Not found');
    error.statusCode = 404;
    throw error;
  }
  return entity;
};
```

### Step 5: Implement Controller
```javascript
import asyncHandler from '../../middleware/asyncHandler.js';
import * as service from './service.js';

export const create = asyncHandler(async (req, res) => {
  const entity = await service.create(req.body);
  res.status(201).json(entity);
});

export const getById = asyncHandler(async (req, res) => {
  const entity = await service.getById(req.params.id);
  res.json(entity);
});
```

### Step 6: Define Routes
```javascript
import { Router } from 'express';
import * as controller from './controller.js';
import { protect } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createSchema } from './validator.js';

const router = Router();

router.use(protect);

router.route('/')
  .post(validate(createSchema), controller.create)
  .get(controller.getAll);

router.route('/:id')
  .get(controller.getById)
  .put(controller.update)
  .delete(controller.remove);

export default router;
```

### Step 7: Mount in Server
```javascript
// In server.js
import yourModuleRoutes from './src/modules/your-module/routes.js';
apiRouter.use('/your-module', yourModuleRoutes);
```

## Adding a New API Endpoint

1. Add Zod schema in `validator.js`
2. Add service method in `service.js`
3. Add controller method in `controller.js`
4. Add route in `routes.js`
5. Add Swagger JSDoc comment
6. Add tests

## Adding a Financial Operation

1. Read `accounting-guide.md` and `ledger-guide.md`
2. Implement the business operation in service
3. Wrap in MongoDB transaction
4. Create ledger entry in same transaction
5. Update cached balances in same transaction
6. Create audit log entry
7. Emit domain event for other modules
8. Write tests (100% coverage for financial logic)
9. Run `/finance-auditor` review

## Common Patterns

### Pagination
```javascript
export const getAll = async ({ page = 1, limit = 20, sort = '-createdAt', ...filters }) => {
  const query = Model.find(filters).sort(sort);
  const [data, total] = await Promise.all([
    query.skip((page - 1) * limit).limit(limit),
    Model.countDocuments(filters),
  ]);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};
```

### Soft Delete
```javascript
export const remove = async (id) => {
  return await Model.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};
```

### Filtering
```javascript
export const getAll = async (query) => {
  const filter = { isDeleted: false };
  if (query.type) filter.type = query.type;
  if (query.status) filter.status = query.status;
  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) filter.createdAt.$gte = new Date(query.from);
    if (query.to) filter.createdAt.$lte = new Date(query.to);
  }
  return await Model.find(filter);
};
```
