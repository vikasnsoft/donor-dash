# Security Guide

## Authentication

### JWT in HTTP-Only Cookies
- Token stored in `jwt` cookie (not localStorage)
- Cookie flags: `httpOnly`, `secure` (production), `sameSite: 'strict'`
- Token expiry: 30 days
- Token payload: `{ userId }` only (no sensitive data)

### Password Security
- Hashed with bcrypt (salt rounds: 10)
- Minimum length: 6 characters
- Never returned in API responses (use `.select('-password')`)
- Pre-save hook handles hashing automatically

## Authorization

### Role-Based Access Control
6 roles: `admin`, `supervisor`, `volunteer`, `auditor`, `support`, `guest`

Implementation:
```javascript
// Middleware
router.get('/users', protect, authorize('admin'), controller.getUsers);

// Special: admin bypasses all role checks
if (req.user.isAdmin || req.user.role === 'admin') return next();
```

### Group-Level Access
Group membership is checked in the service layer:
```javascript
const isMember = group.members.some(m => m.user.toString() === userId);
if (!isMember) throw new Error('Not a group member');
```

## Input Validation

### Zod at Boundary
```javascript
const schema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    amount: z.number().positive().max(10000000),
  }),
});
```

### Mongoose at Model
```javascript
name: { type: String, required: true, maxlength: 100 }
```

## Security Headers

### Helmet.js
```javascript
app.use(helmet({
  contentSecurityPolicy: false,  // Disabled for Swagger
  crossOriginEmbedderPolicy: false,
}));
```

### CORS
```javascript
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
```

## Rate Limiting
```javascript
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,  // 10 minutes
  max: 100,                    // 100 requests per window
});
```

## Sensitive Data Protection

### Never Log
- Passwords
- JWT tokens
- Email addresses (in production logs)
- Phone numbers
- Bank account numbers
- PAN numbers

### Never Return in API
- Password hash
- `plaidAccessToken`
- `plaidItemId`
- Internal IDs (use `_id` only)

### Encrypt at Rest
- Plaid access tokens (encrypted before storage)
- Bank account numbers (if stored)

## Financial Security

- Ledger entries are immutable once posted
- Void entries require admin role
- Large transactions (>$10k equivalent) flagged for supervisor review
- All financial mutations logged in audit trail
- Settlements require confirmation from receiving party

## Environment Variables

Required:
```
NODE_ENV=development|production
PORT=5000
MONGO_URI=mongodb://...
JWT_SECRET=<strong-random-secret>
```

Optional:
```
SENTRY_DSN=https://...
FRONTEND_URL=https://...
PLAID_CLIENT_ID=...
PLAID_SECRET=...
```

Never commit `.env` files. Use `.env.example` as template.
