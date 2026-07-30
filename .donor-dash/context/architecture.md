# Architecture

## System Overview

Donor Dash is a **modular monolith** built on Express + MongoDB (backend) and Next.js + Tailwind (frontend).

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                    │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ Dashboard│ │  Events │ │ Donors  │ │ Reports │       │
│  └────┬─────┘ └────┬────┘ └────┬────┘ └────┬────┘       │
│       └─────────────┴──────────┴───────────┘             │
│                        TanStack Query                     │
│                        Axios Client                       │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP (JSON)
┌────────────────────────┴────────────────────────────────┐
│                   Backend (Express 5)                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Middleware Layer                       │   │
│  │  Auth │ Audit │ Validate │ RateLimit │ CORS       │   │
│  └──────────────────┬───────────────────────────────┘   │
│  ┌──────────────────┴───────────────────────────────┐   │
│  │              Module Layer                          │   │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │   │
│  │  │ Auth │ │Users │ │Events│ │Donors│ │Finance│   │   │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘   │   │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │   │
│  │  │Groups│ │Expns │ │Ledger│ │Audit │ │Activ.│   │   │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘   │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Infrastructure                        │   │
│  │  MongoDB │ Redis │ Supabase Storage │ Sentry       │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Module Dependency Graph

```
Auth ← Users ← Donors ← Donations
                Events ← Campaigns ← Collections
                Groups ← Expenses ← Settlements
                Ledger (receives from all financial modules)
                Reports (reads from Ledger)
                AI (reads from all modules)
```

Rules:
- Auth has no dependencies (provides auth to all)
- Users depends only on Auth
- Financial modules depend on Users and Events
- Ledger is written to by financial modules (never reads from them)
- Reports reads from Ledger only
- Cross-module communication via domain events

## Data Flow

### Request Flow
```
Client → Express → Middleware (auth, audit, validate) → Controller → Service → Model → MongoDB
                                                              ↓
                                                         Domain Event → Other modules
```

### Financial Flow
```
Donation/Expense/Settlement
    → Service (business logic)
    → MongoDB Transaction
        → Create/Update source document
        → Create Ledger Entry
        → Update cached Balances
        → Create Audit Log
    → Domain Event
        → Activity Feed
        → Notification
```

## Layer Responsibilities

| Layer | Responsibility | Example |
|-------|---------------|---------|
| Route | HTTP method, path, middleware | `router.get('/:id', protect, controller.get)` |
| Controller | Extract req → call service → send res | `const donor = await service.getById(req.params.id); res.json(donor)` |
| Service | Business logic, transactions | `await createDonationWithLedger(data)` |
| Model | Schema, validation, hooks | `donationSchema.pre('save', ...)` |
| Middleware | Cross-cutting concerns | `protect`, `validate`, `auditMiddleware` |

## Technology Decisions

See `decision-records/` for detailed ADRs on:
- Why MongoDB over PostgreSQL
- Why modular monolith over microservices
- Why domain events for cross-module communication
- Why cached balances with reconciliation
