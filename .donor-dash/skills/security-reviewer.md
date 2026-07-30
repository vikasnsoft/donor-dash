# Security Reviewer Skill

## Purpose
Review code for security vulnerabilities, permission issues, and data protection.

## When to Invoke
- Any change to authentication or authorization
- Any change that handles user input
- Any change that accesses financial data
- Periodic security reviews
- When deploying to production

## OWASP Top 10 Checklist

### 1. Broken Access Control
- [ ] Every protected route uses `protect` middleware
- [ ] Role-based access uses `authorize(...roles)` middleware
- [ ] Users can only access their own data (unless admin)
- [ ] Group members can only see their group's data
- [ ] Admin endpoints check `isAdmin` or `role === 'admin'`

### 2. Cryptographic Failures
- [ ] Passwords hashed with bcrypt (salt rounds: 10)
- [ ] JWT secrets are environment variables (not hardcoded)
- [ ] Sensitive fields excluded from queries (`select: false`)
- [ ] No sensitive data in URL parameters

### 3. Injection
- [ ] Mongoose parameterizes queries (no string concatenation)
- [ ] Input validated with Zod before processing
- [ ] No `eval()` or dynamic code execution
- [ ] MongoDB query operators sanitized (`$gt`, `$ne` attacks)

### 4. Insecure Design
- [ ] Rate limiting on auth endpoints (100 req/10 min)
- [ ] Rate limiting on public endpoints
- [ ] No business logic flaws (e.g., negative amounts)

### 5. Security Misconfiguration
- [ ] Helmet.js enabled
- [ ] CORS properly configured
- [ ] HPP middleware enabled
- [ ] No debug info in production responses
- [ ] Stack traces hidden in production

### 6. Vulnerable Components
- [ ] Dependencies up to date
- [ ] No known vulnerabilities (`npm audit`)

### 7. Authentication Failures
- [ ] JWT in HTTP-only cookies (not localStorage)
- [ ] Cookie flags: `httpOnly`, `secure` (production), `sameSite: 'strict'`
- [ ] Token expiry: 30 days
- [ ] Password minimum: 6 characters
- [ ] No user enumeration (same error for "user not found" and "wrong password")

### 8. Data Integrity Failures
- [ ] Financial data uses Decimal128 (not floating point)
- [ ] Ledger entries are immutable once posted
- [ ] Audit trail for all mutations
- [ ] Transactions for multi-step financial operations

### 9. Logging & Monitoring Failures
- [ ] Pino structured logging (not console.log)
- [ ] No sensitive data in logs (passwords, tokens, PII)
- [ ] Sentry for error tracking
- [ ] Audit log for all data mutations

### 10. SSRF
- [ ] No user-controlled URLs in server-side requests
- [ ] External service calls validate URLs

## Cookie Security

```javascript
res.cookie('jwt', token, {
  httpOnly: true,           // No JavaScript access
  secure: isProduction,     // HTTPS only in production
  sameSite: 'strict',       // CSRF protection
  maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days
});
```

## PII Protection

Fields that are PII and must be handled carefully:
- `email` — personal identifier
- `phone` — personal identifier
- `address` — location data
- `panNumber` — tax identifier
- `bankAccount` — financial identifier

Rules:
- Never log PII
- Never include PII in error messages
- Exclude PII from list responses (only show in detail views)
- Encrypt sensitive financial identifiers at rest

## Financial Security

- [ ] Only authorized roles can create/edit financial records
- [ ] Ledger entries cannot be modified after posting
- [ ] Settlements require confirmation from the receiving party
- [ ] Large transactions flagged for supervisor review
- [ ] All financial mutations logged in audit trail

## Output Format

```markdown
## Security Review: [Feature/Change]

### Status: PASS | FAIL

### Findings
1. **[CRITICAL/HIGH/MEDIUM/LOW]** [Category] — [Description]
   - Location: [File:Line]
   - Fix: [How to fix]

### Verdict
[Summary]
```
