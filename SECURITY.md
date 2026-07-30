# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly.

**Do not** open a public GitHub issue for security vulnerabilities.

Instead, email: security@donordash.com (or your preferred contact)

### What to include
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response timeline
- **24 hours**: Acknowledgment of report
- **72 hours**: Initial assessment
- **7 days**: Fix or mitigation plan
- **30 days**: Fix released (for confirmed vulnerabilities)

## Security Features

### Authentication
- JWT tokens in HTTP-only cookies
- 30-day token expiry
- bcrypt password hashing (salt rounds: 10)
- No passwords in API responses

### Authorization
- Role-based access control (6 roles)
- Group-level membership checks
- Organisation-level permission engine
- Admin bypass for platform operations

### Data Protection
- Input validation with Zod
- SQL injection prevention (Mongoose parameterized queries)
- XSS prevention (Helmet.js)
- CORS configuration
- Rate limiting (100 requests/10 minutes)

### Financial Security
- Double-entry accounting (debits = credits)
- Immutable ledger entries (append-only)
- All financial operations through Accounting Facade
- 16 financial invariants enforced
- Audit trail for all mutations

### Infrastructure
- Environment variables for secrets
- GitHub Environments for deployment
- Branch protection on main
- CI pipeline with lint, typecheck, build

## Dependency Security

- Dependabot enabled for automated updates
- Weekly dependency scanning
- npm audit in CI pipeline

## Best Practices

- Never commit `.env` files
- Never log sensitive data (passwords, tokens, PII)
- Use environment-specific secrets (not suffixed names)
- Rotate secrets regularly
- Review Dependabot PRs promptly
