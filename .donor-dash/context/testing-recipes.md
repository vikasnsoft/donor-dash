# Testing Recipes

Concrete patterns for testing different types of code in Donor Dash.

---

## Testing a Service

```javascript
import { describe, it, expect, vi } from 'vitest';
import * as service from '../service.js';
import Donor from '../model.js';

vi.mock('../model.js', () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn(),
    findById: vi.fn(),
  },
}));

describe('DonorService', () => {
  describe('create', () => {
    it('should create donor when phone is unique', async () => {
      Donor.findOne.mockResolvedValue(null);
      Donor.create.mockResolvedValue({ _id: '1', name: 'Test', phone: '123' });

      const result = await service.create({ name: 'Test', phone: '123' });
      expect(result.name).toBe('Test');
      expect(Donor.create).toHaveBeenCalled();
    });

    it('should throw 409 when phone already exists', async () => {
      Donor.findOne.mockResolvedValue({ _id: '1', phone: '123' });

      await expect(service.create({ name: 'Test', phone: '123' }))
        .rejects.toThrow('Donor with this phone already exists');
    });
  });
});
```

---

## Testing a Controller (Integration)

```javascript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../../server.js';
import { setupTestDB, teardownTestDB } from '../../../tests/setup.js';

describe('POST /api/donors', () => {
  beforeAll(async () => await setupTestDB());
  afterAll(async () => await teardownTestDB());

  it('should create donor and return 201', async () => {
    const res = await request(app)
      .post('/api/donors')
      .set('Cookie', validAuthCookie)
      .send({ name: 'Test Donor', phone: '+91 98765 43210', type: 'individual' });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Test Donor');
  });

  it('should return 401 without auth', async () => {
    const res = await request(app)
      .post('/api/donors')
      .send({ name: 'Test Donor' });

    expect(res.status).toBe(401);
  });

  it('should return 400 with invalid data', async () => {
    const res = await request(app)
      .post('/api/donors')
      .set('Cookie', validAuthCookie)
      .send({}); // Missing required fields

    expect(res.status).toBe(400);
  });
});
```

---

## Testing Financial Logic (Critical)

```javascript
import { describe, it, expect } from 'vitest';
import Decimal128 from 'bson';

describe('Balance Calculation', () => {
  it('should calculate equal split correctly', () => {
    const total = Decimal128.fromString('100.00');
    const members = 3;
    const splitAmount = parseFloat(total.toString()) / members;

    // Verify splits sum to total
    const splitsSum = splitAmount * members;
    expect(parseFloat(splitsSum.toFixed(2))).toBe(100.00);
  });

  it('should handle uneven splits without losing money', () => {
    const total = 100;
    const members = 3;
    const baseSplit = Math.floor((total / members) * 100) / 100;
    const remainder = total - (baseSplit * members);

    // Last person pays the remainder
    const splits = Array(members - 1).fill(baseSplit);
    splits.push(parseFloat((baseSplit + remainder).toFixed(2)));

    const sum = splits.reduce((a, b) => a + b, 0);
    expect(parseFloat(sum.toFixed(2))).toBe(total);
  });

  it('ledger entry must balance', () => {
    const lines = [
      { type: 'debit', amount: 500 },
      { type: 'credit', amount: 500 },
    ];

    const debits = lines.filter(l => l.type === 'debit').reduce((s, l) => s + l.amount, 0);
    const credits = lines.filter(l => l.type === 'credit').reduce((s, l) => s + l.amount, 0);

    expect(debits).toBe(credits);
  });
});
```

---

## Testing State Transitions

```javascript
describe('Donation Status Transitions', () => {
  it('should allow pledged → received', () => {
    const donation = { status: 'pledged' };
    expect(canTransition(donation.status, 'received')).toBe(true);
  });

  it('should not allow cancelled → received', () => {
    const donation = { status: 'cancelled' };
    expect(canTransition(donation.status, 'received')).toBe(false);
  });

  it('should not allow received → pledged', () => {
    const donation = { status: 'received' };
    expect(canTransition(donation.status, 'pledged')).toBe(false);
  });
});
```

---

## Testing Middleware

```javascript
describe('Auth Middleware', () => {
  it('should set req.user with valid token', async () => {
    const req = { cookies: { jwt: validToken } };
    const res = {};
    const next = vi.fn();

    await protect(req, res, next);

    expect(req.user).toBeDefined();
    expect(next).toHaveBeenCalled();
  });

  it('should throw 401 without token', async () => {
    const req = { cookies: {} };
    const res = { status: vi.fn().mockReturnThis() };
    const next = vi.fn();

    await expect(protect(req, res, next)).rejects.toThrow('Not authorized');
  });
});
```
