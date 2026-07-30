# API Guide

## Base URL
- Development: `http://localhost:5001/api`
- Production: `https://api.donordash.com/api`

## Authentication
All protected endpoints use JWT in HTTP-only cookies.
- Cookie name: `jwt`
- Expiry: 30 days
- Send with `credentials: 'include'` in fetch/axios

## Endpoint Conventions

### Resource Naming
```
/api/auth/*          — Authentication
/api/users/*         — User management (admin)
/api/donors/*        — Donor management
/api/events/*        — Event management
/api/campaigns/*     — Campaign management
/api/donations/*     — Donation recording
/api/collections/*   — Collection management
/api/groups/*        — Expense groups
/api/expenses/*      — Shared expenses
/api/settlements/*   — Settlements
/api/balances/*      — Balance queries
/api/ledger/*        — Accounting ledger
/api/reports/*       — Financial reports
/api/notifications/* — Notifications
/api/ai/*            — AI assistant
```

### Nested Resources
```
GET /api/events/:eventId/donations      — Donations for an event
GET /api/events/:eventId/campaigns      — Campaigns for an event
GET /api/groups/:groupId/expenses       — Expenses in a group
GET /api/groups/:groupId/settlements    — Settlements in a group
GET /api/groups/:groupId/activity       — Activity feed for a group
GET /api/campaigns/:campaignId/collections — Collections for a campaign
```

## Pagination

All list endpoints support pagination:
```
GET /api/donors?page=1&limit=20
```

Response format:
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5
}
```

## Filtering

Filter via query parameters:
```
GET /api/donors?type=individual&city=Pune
GET /api/donations?method=cash&status=received
GET /api/expenses?category=decoration&from=2025-01-01&to=2025-12-31
```

## Sorting

Sort via `sort` query parameter:
```
GET /api/donors?sort=-createdAt    — Newest first
GET /api/donors?sort=name          — Alphabetical
GET /api/donations?sort=-amount    — Highest amount first
```

Prefix with `-` for descending order.

## Status Codes

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation error, bad input |
| 401 | Unauthorized | Not logged in, invalid token |
| 403 | Forbidden | Logged in but wrong role |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource |
| 429 | Too Many Requests | Rate limited |
| 500 | Server Error | Unexpected error |

## Error Response

```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

In development, `stack` is included:
```json
{
  "success": false,
  "error": "Human-readable error message",
  "stack": "Error: ...\n    at ..."
}
```

## Validation Errors

```json
{
  "success": false,
  "error": "Email is required, Password must be at least 6 characters"
}
```

## Rate Limiting

- 100 requests per 10 minutes per IP
- Applied to all endpoints
- Returns 429 with retry-after information in headers
