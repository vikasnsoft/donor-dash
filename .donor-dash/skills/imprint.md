# Imprint Skill

## Purpose
Capture and store learned patterns, conventions, and preferences from user corrections and project evolution.

## When to Invoke
- User corrects an approach or style preference
- A pattern is established that should be repeated
- User explicitly says "remember this" or "don't do X again"

## What to Capture

### Code Style Preferences
- Naming conventions the user prefers
- Import ordering
- Comment style
- Error handling patterns

### Architecture Preferences
- Module organization preferences
- State management patterns
- API design preferences

### Domain-Specific Rules
- Financial calculation rules
- Donor management conventions
- Event management patterns

### UI/UX Preferences
- Component patterns
- Layout preferences
- Interaction patterns

## Process

1. **Detect the correction** — User says "use X instead of Y" or "don't do Z"
2. **Classify the learning** — Is it code style, architecture, domain, or UI?
3. **Store in taste** — Write to `.commandcode/taste/` under the appropriate category
4. **Confirm** — Tell the user what was learned

## Taste File Format

```markdown
# Category Name
- Description of the learned preference. Confidence: 0.XX
```

Confidence levels:
- 0.95+ — Explicitly stated by user
- 0.80+ — Corrected multiple times
- 0.70+ — Inferred from patterns

## Rules
- Never overwrite existing taste without higher confidence
- Always explain what was learned
- Taste is project-specific, not global
