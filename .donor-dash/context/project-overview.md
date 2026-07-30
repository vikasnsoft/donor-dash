# Donor Dash v2 — Project Overview

## Purpose
Donor Dash is a **community finance platform** for organisations like Ganpati Utsav Mandals, Shiv Jayanti committees, NGOs, trusts, and event-based groups.

## Mission
Simplify financial management for community organisations by combining donor management, event-based collections, shared expenses, and accounting into one platform.

## Target Users
- **Ganpati Utsav Mandals** — Annual festival committees managing donations, expenses, volunteers
- **Shiv Jayanti Committees** — Event-based organisations with collection campaigns
- **NGOs & Trusts** — Ongoing organisations with recurring donors and programs
- **School Donation Drives** — Time-bound collection events
- **Blood Donation Camps** — Volunteer-coordinated events

## Core Philosophy
1. **Ledger-first**: Every financial operation creates a ledger entry. Reports are derived, not calculated.
2. **Event-centric**: Everything revolves around events. Donations, expenses, and volunteers are scoped to events.
3. **Modular monolith**: Clean module boundaries that could become services if needed.
4. **Audit everything**: Every mutation is logged. Financial records are immutable once posted.

## Product Roadmap

| Phase | Focus | Status |
|-------|-------|--------|
| 2.0 | Platform foundation, modular architecture, cleanup | ✅ Complete |
| 2.1 | Organisations, events, campaigns, donors, collections | 🔲 Planned |
| 2.2 | Ledger, accounting core, reports | 🔲 Planned |
| 2.3 | Shared expense engine | 🔲 Planned |
| 2.4 | Automation (OCR, notifications, recurring jobs) | 🔲 Planned |
| 2.5 | Search, analytics, dashboards | 🔲 Planned |
| 2.6 | AI assistant and forecasting | 🔲 Planned |
| 3.0 | Mobile apps, public portal, payment integrations | 🔲 Planned |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Express 5, MongoDB, Mongoose, Node.js |
| Frontend | Next.js 15, React 18, TypeScript, Tailwind CSS 4 |
| UI Components | shadcn/ui (New York style), Radix UI |
| State | TanStack Query, Zustand |
| Forms | React Hook Form + Zod |
| Tables | TanStack Table |
| Logging | Pino |
| Error Tracking | Sentry |
| Storage | Supabase Storage |
| Auth | JWT in HTTP-only cookies |

## Key Differentiators
- **Indian-first**: INR default, Indian locale, UPI/QR payment support
- **Event-centric**: Not just donors — events, campaigns, committees, volunteers
- **Accounting-grade**: Double-entry ledger, not just expense tracking
- **Shared expenses**: Committee members can split costs without a separate app
- **AI-powered**: Natural language queries about financial data
