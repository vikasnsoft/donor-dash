# Architect Skill

## Purpose
Plan and design solutions before implementation. Every non-trivial change starts here.

## When to Invoke
- New feature or module
- Significant refactoring
- Cross-module changes
- Schema design decisions
- API design decisions

## Process

### 1. Understand the Request
- What is the user trying to achieve?
- Which modules are affected?
- Is this a new module or an extension of existing?

### 2. Consult Context
Read these files before planning:
- `context/project-overview.md` — understand the product
- `context/architecture.md` — understand the system
- `context/module-boundaries.md` — understand ownership
- `context/decision-records/` — check for relevant ADRs

### 3. Design the Solution

#### Module Impact Analysis
```
Which modules are affected?
  → What models change?
  → What services change?
  → What controllers change?
  → What routes change?
  → What validations change?
```

#### Dependency Check
```
Does this create new dependencies between modules?
  → If yes, is there a cleaner approach?
  → Should this use domain events instead of direct calls?
```

#### Data Flow
```
Request → Controller → Service → Model → Response
                ↓
          Domain Event → Other modules (async)
```

### 4. Create the Plan
Structure your plan as:
1. **Scope** — what's included, what's not
2. **Module changes** — list each affected module
3. **New files** — list each new file with purpose
4. **API changes** — new/modified endpoints
5. **Schema changes** — new/modified models
6. **Migration strategy** — how to handle existing data
7. **Testing approach** — what tests are needed
8. **Risks** — what could go wrong

### 5. Check for Anti-Patterns
Consult `context/anti-patterns.md` and verify:
- No circular dependencies
- No module boundary violations
- No business logic in controllers
- No direct database access from controllers
- No duplicate logic

### 6. Document Decisions
If the change involves a significant architectural decision, create an ADR in `context/decision-records/`.

## Output Format

```markdown
## Plan: [Feature Name]

### Scope
[What's in/out]

### Module Impact
- [Module]: [Changes needed]

### New Files
- `path/to/file.js` — [purpose]

### API Changes
- `METHOD /api/resource` — [description]

### Schema Changes
- [Model]: [field changes]

### Testing
- [What to test]

### Risks
- [What could go wrong]
```

## Rules
- Never skip the module boundary check
- Never design without consulting existing patterns
- Always consider the ledger impact for financial features
- Always document significant decisions as ADRs
