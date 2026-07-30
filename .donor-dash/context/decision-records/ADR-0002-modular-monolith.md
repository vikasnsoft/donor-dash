# ADR-0002: Modular Monolith

## Status
Accepted

## Context
Donor Dash needs to support multiple business domains (donors, events, expenses, accounting, AI). The question is whether to build as a monolith, modular monolith, or microservices.

## Decision
Build as a **modular monolith** with clear module boundaries.

Each module owns:
- Model, Controller, Service, Validator, Routes, Permissions
- No direct imports from other module internals
- Cross-module communication via domain events

## Consequences
**Positive:**
- Single deployment (simple for solo developer)
- Clear boundaries prevent spaghetti code
- Modules can be extracted to services later if needed
- Shared middleware, auth, and infrastructure
- Fast development (no network overhead between modules)

**Negative:**
- Must enforce boundaries through discipline (no compiler enforcement)
- Single database means shared schema concerns
- All modules scale together (can't scale independently)

## Alternatives Considered
- **Microservices**: Overkill for solo developer. Network latency, deployment complexity, distributed transactions.
- **Flat monolith**: Fast to start but becomes unmaintainable as codebase grows.
