# ADR Template

Use this template for all Architectural Decision Records.

```markdown
# ADR-XXXX: [Short Title]

## Status
Proposed | Accepted | Superseded by ADR-XXXX | Deprecated

## Context
[What is the issue that we're seeing that is motivating this decision or change?]

[Include relevant constraints, requirements, or pressures.]

## Decision
[What is the change that we're proposing and/or doing?]

[Be specific about what will change in the codebase.]

## Consequences

### Positive
- [Benefit 1]
- [Benefit 2]

### Negative
- [Trade-off 1]
- [Trade-off 2]

### Risks
- [Risk 1 and mitigation]

## Alternatives Considered

### [Alternative 1]
[Why it was rejected]

### [Alternative 2]
[Why it was rejected]

## Migration
[If this changes existing behavior, how do we handle existing data/systems?]

## References
[Links to relevant context files, external docs, or discussions]
```

## ADR Numbering
- Sequential: ADR-0001, ADR-0002, etc.
- Never reuse a number
- Prefix with year if preferred: ADR-2026-001

## ADR Rules
- ADRs are immutable once accepted
- To change a decision, create a new ADR that supersedes the old one
- Never delete ADRs
- Reference ADRs in code comments when the decision affects implementation
