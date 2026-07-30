# ADR-0003: Domain Events for Cross-Module Communication

## Status
Accepted

## Context
Modules need to react to changes in other modules (e.g., ledger needs to record when a donation is created). The question is how modules communicate.

## Decision
Use **domain events** for cross-module communication.

Pattern:
```
Module A → emitEvent('entity.action', data) → Event Bus → Module B handler
```

Business modules push events. Consumer modules subscribe to events they care about.

## Consequences
**Positive:**
- Modules stay decoupled (no circular imports)
- Easy to add new consumers without modifying the source
- Natural audit trail (events are logged)
- Async processing possible for non-critical paths

**Negative:**
- Eventual consistency (not immediate)
- Must handle event delivery failures
- Harder to debug (event flow is implicit)
- Must document event contracts

## Alternatives Considered
- **Direct imports**: Simple but creates tight coupling and circular dependencies
- **Shared services**: Moderate coupling, but still creates dependency direction issues
