# Observability

## Logging

### Pino Structured Logging
```javascript
import logger from '../utils/logger.js';

// Info
logger.info({ userId, action: 'login' }, 'User logged in');

// Error
logger.error({ err, expenseId }, 'Failed to create expense');

// Warning
logger.warn({ threshold: 80 }, 'Budget threshold exceeded');

// Fatal
logger.fatal({ err }, 'Unhandled promise rejection');
```

### Log Levels
| Level | Usage |
|-------|-------|
| `fatal` | System is unusable |
| `error` | Operation failed, needs attention |
| `warn` | Something unexpected, but operation continued |
| `info` | Normal operations (login, create, update) |
| `debug` | Detailed information for debugging |
| `trace` | Very detailed (not for production) |

### Request Logging
Every request is logged with:
```json
{
  "method": "POST",
  "url": "/api/donations",
  "status": 201,
  "ms": 45
}
```

### Rules
- Never log sensitive data (passwords, tokens, PII)
- Use structured objects, not string interpolation
- Include context (userId, requestId, action)

## Error Tracking (Sentry)

### Setup
```javascript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### What Sentry Captures
- Unhandled exceptions
- Unhandled promise rejections
- HTTP 500 errors
- Performance traces (optional)

### What NOT to Send to Sentry
- Validation errors (400)
- Auth errors (401/403)
- Not found errors (404)
- Expected business errors

## Health Monitoring

### Endpoints
```
GET /health → { "status": "ok", "timestamp": "..." }
```

### What to Monitor
- Response time (< 500ms for API calls)
- Error rate (< 1% of requests)
- Database connection status
- Memory usage
- CPU usage

## Correlation IDs

Every request should have a correlation ID for tracing:
```javascript
// Middleware
app.use((req, res, next) => {
  req.requestId = req.headers['x-request-id'] || crypto.randomUUID();
  res.setHeader('x-request-id', req.requestId);
  next();
});
```

Include `requestId` in all log entries for the request.

## Audit Trail

Every data mutation is logged in the `AuditLog` collection:
```json
{
  "userId": "...",
  "action": "donation.create",
  "resourceType": "donation",
  "resourceId": "...",
  "changes": { "body": { "amount": 500 } },
  "metadata": { "ip": "...", "userAgent": "..." },
  "createdAt": "2026-01-15T10:00:00.000Z"
}
```

Audit logs are immutable (no updates or deletes).
