# Changelog

All notable changes to Donor Dash will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-30

### Added

#### Platform Foundation (Phase 2.0)
- Modular monolith architecture with 20 domain modules
- Repository pattern for data access
- Domain event bus for cross-module communication
- Permission engine with policy-based authorization
- Request context middleware
- Zod runtime validation
- Pino structured logging
- Sentry error tracking integration
- API versioning (/api/v1/)
- Health checks (/health, /ready, /live)
- Feature flags system

#### Donor Platform (Phase 2.1)
- Organisation management with member roles (owner, admin, member)
- Organisation invites via email tokens
- Event management with state machine (draft → planning → active → completed → closed → archived)
- Campaign management with targets, routes, and volunteer assignment
- Donor management with family grouping and duplicate detection
- Donation recording with receipt generation and multi-method support
- Volunteer collection tracking

#### Accounting Core (Phase 2.2)
- Double-entry accounting engine
- Chart of Accounts (19 default accounts)
- Ledger with journal entries (append-only)
- Accounting Facade as single integration point
- Journal Builder (pure business logic, no database dependency)
- Trial balance, cash book, income statement reports
- 16 financial invariants enforced

#### Shared Expense Engine (Phase 2.3)
- Expense groups with flexible splits (equal, exact, percentage, shares)
- Balance calculation with pairwise caching
- Balance normalization (no bidirectional balances)
- Debt simplification (greedy netting algorithm)
- Settlement workflow with confirmation
- Ledger integration for expenses and settlements

#### Automation (Phase 2.4)
- Notification system (in-app, with email/push/SMS stubs)
- Document generation (HTML receipts, vouchers, settlement confirmations)
- CSV import for donors
- CSV export for donors, donations, and ledger
- Projection engine with 6 read models
- BullMQ background job infrastructure (6 queues)
- Domain event handlers for automatic updates

#### Dashboard UI (Phase 2.5)
- Reusable dashboard primitives (MetricCard, ChartCard, TableCard, ActivityCard, Section)
- Chart abstractions (DonationTrend, CampaignProgress, ExpenseBreakdown)
- Organisation Admin dashboard
- Treasurer dashboard
- Unified search (Cmd+K)
- Shared formatting layer (currency, percentage, date, trends)
- 7 query hooks mirroring projection APIs

#### Infrastructure
- Docker Compose (MongoDB, Redis, Mailpit)
- GitHub Actions CI pipeline
- Dependabot configuration
- GitHub Environments (staging, production)
- Branch protection on main

#### AI Development Kit (DDK)
- 17 AI skills for code review, architecture, finance, security
- 20+ context files covering architecture, standards, and patterns
- 11 module contracts defining ownership and boundaries
- 8 prompt templates for common workflows
- 7 Architectural Decision Records (ADRs)
- Financial invariants documentation
- State machines and error catalogue

### Technical Details
- Backend: Express 5, MongoDB, Mongoose, Node.js 22
- Frontend: Next.js 16.2, React 19.1, TypeScript 5.9
- UI: Tailwind CSS 4, shadcn/ui, Radix UI, Recharts
- State: TanStack Query 5.101, Zustand 5
- Infrastructure: Docker, GitHub Actions, Sentry, Pino

[1.0.0]: https://github.com/vikasnsoft/donor-dash/releases/tag/v1.0.0
