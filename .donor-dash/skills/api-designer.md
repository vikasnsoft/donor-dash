# API Designer Skill

## Purpose
Design and review REST API endpoints for consistency, usability, and correctness.

## When to Invoke
- Creating new API endpoints
- Modifying existing endpoints
- Designing API for a new module
- Reviewing API consistency

## Naming Conventions

### Resources
- Use **plural nouns** for collections: `/api/donors`, `/api/events`
- Use **singular** for specific actions: `/api/auth/login`
- Use **kebab-case** for multi-word: `/api/collection-routes`

### HTTP Methods
| Method | Use | Example |
|--------|-----|---------|
| GET | Read | `GET /api/donors` (list), `GET /api/donors/:id` (detail) |
| POST | Create | `POST /api/donors` |
| PUT | Full update | `PUT /api/donors/:id` |
| PATCH | Partial update | `PATCH /api/donors/:id` |
| DELETE | Remove | `DELETE /api/donors/:id` |

### Nested Resources
```
GET /api/events/:eventId/donations     — donations for an event
GET /api/groups/:groupId/expenses      — expenses in a group
GET /api/campaigns/:campaignId/collections — collections for a campaign
```

## Response Format

### Success
```json
{
  "_id": "...",
  "name": "...",
  // Direct object for single resources
}
```

### List (with pagination)
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5
}
```

### Error
```json
{
  "success": false,
  "error": "Human-readable error message",
  "stack": "..." // only in development
}
```

## Status Codes

| Code | Use |
|------|-----|
| 200 | Success (GET, PUT, PATCH) |
| 201 | Created (POST) |
| 204 | No Content (DELETE) |
| 400 | Bad Request / Validation Error |
| 401 | Not Authenticated |
| 403 | Not Authorized (wrong role) |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 422 | Unprocessable Entity |
| 429 | Rate Limited |
| 500 | Server Error |

## Query Parameters

### Filtering
```
GET /api/donors?type=individual&city=Pune
GET /api/donations?method=cash&status=received
```

### Pagination
```
GET /api/donors?page=1&limit=20
```

### Sorting
```
GET /api/donors?sort=-createdAt        — newest first
GET /api/donors?sort=name              — alphabetical
GET /api/donations?sort=-amount        — highest first
```

### Date Range
```
GET /api/donations?from=2025-01-01&to=2025-12-31
```

## Review Checklist
- [ ] Resource names are plural nouns
- [ ] Correct HTTP method used
- [ ] Proper status codes
- [ ] Consistent response format
- [ ] Pagination on list endpoints
- [ ] Filtering via query params
- [ ] Sorting via query params
- [ ] Validation via Zod schemas
- [ ] Error messages are user-friendly
- [ ] Auth middleware applied to protected routes
