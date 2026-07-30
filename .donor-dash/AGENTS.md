# Donor Dash v2 — AI Agent System

## Product Identity

Donor Dash is a **community finance platform** for organisations like Ganpati Utsav Mandals, Shiv Jayanti committees, NGOs, trusts, and event-based groups. It combines donor management, event-based collections, shared expenses, accounting, and reporting into a modular platform built on a ledger-first architecture.

## Agent Workflow

Every significant change follows this pipeline:

```
User Request
    ↓
Architect (plan the approach)
    ↓
Database Architect (if schema changes)
    ↓
Backend Architect (service/logic changes)
    ↓
UI Architect (if frontend changes)
    ↓
Implementation
    ↓
Reviewer (code quality)
    ↓
Finance Auditor (if financial logic)
    ↓
Testing Specialist (verify coverage)
    ↓
Documentation Writer (update docs)
    ↓
Done
```

Not every step applies to every change. Use judgment:
- **Simple bug fix**: Reviewer → Done
- **New module**: Full pipeline
- **UI-only change**: UI Architect → Reviewer → Done
- **Financial logic**: Must include Finance Auditor
- **Schema change**: Must include Database Architect + ADR

## Critical Rules

1. **Never violate module boundaries.** Read `context/module-boundaries.md` before writing any code.
2. **Every financial operation must balance.** Read `context/accounting-guide.md` and `context/ledger-guide.md`.
3. **Never invent database fields.** Read the model file before assuming a field exists.
4. **Never change schema without considering migration impact.**
5. **Never duplicate logic across modules.** Use domain events for cross-module communication.
6. **Never skip validation.** Every input boundary must validate with Zod.
7. **Never mix business logic into controllers.** Controllers handle HTTP. Services handle logic.
8. **Never use `any` type.** Every type must be explicit.
9. **Never write raw MongoDB queries in controllers.** Use the service/repository layer.
10. **Never create circular dependencies between modules.**

## Skill Invocation

Skills are invoked with `/skill-name`. Example: `/finance-auditor`

When a skill is invoked, read its full instructions from `skills/` and follow them precisely.

## Context Files

Before starting any work, consult the relevant context files:
- **New feature**: `project-overview.md`, `architecture.md`, `module-boundaries.md`
- **Backend code**: `code-standards.md`, `coding-playbook.md`, `api-guide.md`
- **Frontend code**: `ui-rules.md`, `ui-tokens.md`
- **Database changes**: `database-guide.md`, `module-boundaries.md`
- **Financial logic**: `accounting-guide.md`, `ledger-guide.md`
- **Security concerns**: `security-guide.md`, `permissions-guide.md`
- **Testing**: `testing-guide.md`
- **Deployment**: `deployment-guide.md`, `observability.md`

## Decision Records

Before making or suggesting major architectural changes, check `context/decision-records/` for existing ADRs. If your change conflicts with an accepted ADR, flag it explicitly.

## Progress Tracking

Consult `context/progress-tracker.md` to understand what's built, what's in progress, and what's planned. Update it when completing significant milestones.
