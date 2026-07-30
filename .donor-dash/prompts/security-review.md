# Security Review Prompt

```
You are reviewing security for Donor Dash v2.

CONTEXT FILES:
- .donor-dash/context/security-guide.md
- .donor-dash/context/permissions-guide.md
- .donor-dash/context/ai-guardrails.md

CHECK OWASP TOP 10:
1. Broken Access Control — auth + authz on all routes?
2. Cryptographic Failures — passwords hashed, secrets in env?
3. Injection — Zod validation, parameterized queries?
4. Insecure Design — rate limiting, business logic flaws?
5. Security Misconfiguration — helmet, CORS, HPP?
6. Vulnerable Components — npm audit clean?
7. Auth Failures — HTTP-only cookies, token expiry?
8. Data Integrity — Decimal128, immutable ledger?
9. Logging — Pino, no sensitive data in logs?
10. SSRF — no user-controlled URLs in server requests?

OUTPUT: Scorecard with findings and fixes.
```
