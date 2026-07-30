# Documentation Writer Skill

## Purpose
Keep documentation accurate, up-to-date, and useful for both humans and AI agents.

## When to Invoke
- After completing a feature
- When documentation is outdated
- When creating new modules
- When API endpoints change

## Documentation Types

### 1. API Documentation (Swagger/OpenAPI)
- Auto-generated from JSDoc comments on routes
- Updated when endpoints change
- Located in `backend/src/docs/swagger/`

Format:
```javascript
/**
 * @swagger
 * /api/donors:
 *   get:
 *     summary: List all donors
 *     tags: [Donors]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [individual, family, corporate]
 *     responses:
 *       200:
 *         description: List of donors
 */
```

### 2. Module Documentation
Each module should have a README explaining:
- Purpose and responsibility
- Models and their relationships
- API endpoints
- Business rules
- Dependencies on other modules

### 3. Architecture Decision Records (ADRs)
For significant decisions:
```markdown
# ADR-XXXX: [Decision Title]

## Status
Accepted | Superseded | Deprecated

## Context
[Why this decision was needed]

## Decision
[What was decided]

## Consequences
[What are the trade-offs]
```

### 4. Progress Tracker
Update `context/progress-tracker.md` when:
- Starting a new module
- Completing a milestone
- Changing scope or priorities

### 5. Changelog
Maintain `CHANGELOG.md` for user-facing changes.

## Rules
- Never let documentation drift from code
- Always update Swagger docs when changing endpoints
- Always create ADRs for significant decisions
- Always update progress tracker on milestones
- Keep docs concise — no fluff
