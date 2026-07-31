# Implementation Audit Report — Donor Dash v2

**Date:** 2026-07-31
**Scope:** Full codebase analysis (frontend, backend, routes, components, hooks)

---

## 1. Executive Summary

| Metric | Count |
|--------|------:|
| Backend API endpoints | 85 |
| Frontend pages | 17 |
| Fully implemented pages | 12 |
| Placeholder pages | 4 |
| Missing detail pages | 2 (org detail, event detail) |
| Hooks with no consuming page | 10 |
| Backend APIs with no frontend | 35 |
| Dead navigation links | 6 |
| TODO/FIXME comments | 0 |
| console.error statements | 5 |

**Completion Rate: ~55%** — Backend is feature-complete through Phase 2.4. Frontend has 12/17 pages functional but several critical flows (event detail, org detail, reports, groups, expenses) are missing or placeholder.

---

## 2. Backend API Inventory (85 endpoints)

### Auth (5 endpoints)
| Method | Path | Controller | Status |
|--------|------|------------|--------|
| POST | `/api/v1/auth/login` | `login` | ✅ Used |
| POST | `/api/v1/auth/register` | `register` | ✅ Used |
| POST | `/api/v1/auth/logout` | `logout` | ✅ Used |
| GET | `/api/v1/auth/me` | `getMe` | ✅ Used |
| PUT | `/api/v1/auth/profile` | `updateProfile` | ✅ Used |

### Users (4 endpoints)
| Method | Path | Controller | Status |
|--------|------|------------|--------|
| GET | `/api/v1/users` | `getUsers` | ✅ Used |
| GET | `/api/v1/users/:id` | `getUserById` | 🔶 No frontend |
| PUT | `/api/v1/users/:id` | `updateUser` | ✅ Used |
| DELETE | `/api/v1/users/:id` | `deleteUser` | ✅ Used |

### Organisations (11 endpoints)
| Method | Path | Controller | Status |
|--------|------|------------|--------|
| POST | `/api/v1/organisations` | `create` | ✅ Used |
| GET | `/api/v1/organisations` | `getAll` | ✅ Used |
| GET | `/api/v1/organisations/slug/:slug` | `getBySlug` | 🔶 No frontend |
| GET | `/api/v1/organisations/:id` | `getById` | 🔶 Hook exists, no page |
| PUT | `/api/v1/organisations/:id` | `update` | 🔶 Hook exists, no page |
| POST | `/api/v1/organisations/:id/archive` | `archive` | 🔶 Hook exists, no page |
| POST | `/api/v1/organisations/:id/members` | `addMember` | 🔶 Hook exists, no page |
| PUT | `/api/v1/organisations/:id/members/:userId` | `updateMemberRole` | 🔶 Hook exists, no page |
| DELETE | `/api/v1/organisations/:id/members/:userId` | `removeMember` | 🔶 Hook exists, no page |
| POST | `/api/v1/organisations/:id/invites` | `sendInvite` | 🔶 Hook exists, no page |
| POST | `/api/v1/organisations/:id/invites/:token/accept` | `acceptInvite` | 🔶 No frontend |

### Events (12 endpoints)
| Method | Path | Controller | Status |
|--------|------|------------|--------|
| POST | `/api/v1/organisations/:orgId/events` | `create` | ✅ Used |
| GET | `/api/v1/organisations/:orgId/events` | `getAll` | ✅ Used |
| GET | `/api/v1/organisations/:orgId/events/slug/:slug` | `getBySlug` | 🔶 No frontend |
| GET | `/api/v1/events/:id` | `getById` | 🔶 Hook exists, no page |
| PUT | `/api/v1/events/:id` | `update` | 🔶 Hook exists, no page |
| POST | `/api/v1/events/:id/status` | `changeStatus` | 🔶 Hook exists, no page |
| POST | `/api/v1/events/:id/archive` | `archive` | 🔶 Hook exists, no page |
| GET | `/api/v1/events/:id/summary` | `getSummary` | 🔶 Hook exists, no page |
| POST | `/api/v1/events/:id/committee` | `addCommitteeMember` | 🔶 Hook exists, no page |
| PUT | `/api/v1/events/:id/committee/:userId` | `updateCommitteeRole` | 🔶 Hook exists, no page |
| DELETE | `/api/v1/events/:id/committee/:userId` | `removeCommitteeMember` | 🔶 Hook exists, no page |
| PUT | `/api/v1/events/:id/budget` | `updateBudget` | 🔶 No frontend |

### Campaigns (6 endpoints)
| Method | Path | Controller | Status |
|--------|------|------------|--------|
| POST | `/api/v1/events/:eventId/campaigns` | `create` | 🔶 No frontend |
| GET | `/api/v1/events/:eventId/campaigns` | `getAll` | 🔶 No frontend |
| GET | `/api/v1/campaigns/:id` | `getById` | 🔶 No frontend |
| PUT | `/api/v1/campaigns/:id` | `update` | 🔶 No frontend |
| POST | `/api/v1/campaigns/:id/status` | `changeStatus` | 🔶 No frontend |
| POST | `/api/v1/campaigns/:id/archive` | `archive` | 🔶 No frontend |
| POST | `/api/v1/campaigns/:id/routes` | `addRoute` | 🔶 No frontend |
| PUT | `/api/v1/campaigns/:id/routes/:routeId/volunteer` | `assignVolunteer` | 🔶 No frontend |

### Donors (7 endpoints)
| Method | Path | Controller | Status |
|--------|------|------------|--------|
| POST | `/api/v1/organisations/:orgId/donors` | `create` | 🔶 No frontend |
| GET | `/api/v1/organisations/:orgId/donors` | `getAll` | 🔶 No frontend |
| GET | `/api/v1/organisations/:orgId/donors/search` | `search` | 🔶 No frontend |
| GET | `/api/v1/organisations/:orgId/donors/top` | `getTopDonors` | 🔶 No frontend |
| GET | `/api/v1/donors/:id` | `getById` | 🔶 No frontend |
| PUT | `/api/v1/donors/:id` | `update` | 🔶 No frontend |
| DELETE | `/api/v1/donors/:id` | `remove` | 🔶 No frontend |

### Donations (6 endpoints)
| Method | Path | Controller | Status |
|--------|------|------------|--------|
| POST | `/api/v1/events/:eventId/donations` | `record` | 🔶 No frontend |
| GET | `/api/v1/events/:eventId/donations` | `getByEvent` | 🔶 No frontend |
| GET | `/api/v1/events/:eventId/donations/stats` | `getEventStats` | 🔶 No frontend |
| GET | `/api/v1/donors/:donorId/donations` | `getByDonor` | 🔶 No frontend |
| GET | `/api/v1/donations/:id` | `getById` | 🔶 No frontend |
| POST | `/api/v1/donations/:id/cancel` | `cancel` | 🔶 No frontend |

### Groups (9 endpoints)
| Method | Path | Controller | Status |
|--------|------|------------|--------|
| POST | `/api/v1/groups` | `create` | ⚪ Placeholder page |
| GET | `/api/v1/groups` | `getAll` | ⚪ Placeholder page |
| GET | `/api/v1/groups/:id` | `getById` | 🔶 No frontend |
| PUT | `/api/v1/groups/:id` | `update` | 🔶 No frontend |
| POST | `/api/v1/groups/:id/archive` | `archive` | 🔶 No frontend |
| POST | `/api/v1/groups/:id/invite` | `generateInvite` | 🔶 No frontend |
| POST | `/api/v1/groups/join/:code` | `joinByInvite` | 🔶 No frontend |
| POST | `/api/v1/groups/:id/members` | `addMember` | 🔶 No frontend |
| DELETE | `/api/v1/groups/:id/members/:userId` | `removeMember` | 🔶 No frontend |

### Expenses (6 endpoints)
| Method | Path | Controller | Status |
|--------|------|------------|--------|
| POST | `/api/v1/expenses` | `create` | ⚪ Placeholder page |
| GET | `/api/v1/expenses/:id` | `getById` | 🔶 No frontend |
| GET | `/api/v1/expenses/group/:groupId` | `getByGroup` | ⚪ Placeholder page |
| GET | `/api/v1/expenses/group/:groupId/balances` | `getGroupBalances` | 🔶 No frontend |
| GET | `/api/v1/expenses/group/:groupId/simplify` | `getSimplifiedDebts` | 🔶 No frontend |
| GET | `/api/v1/expenses/me/balances` | `getUserBalanceSummary` | 🔶 No frontend |

### Settlements (3 endpoints)
| Method | Path | Controller | Status |
|--------|------|------------|--------|
| POST | `/api/v1/settlements` | `create` | 🔶 No frontend |
| GET | `/api/v1/settlements/:id` | `getById` | 🔶 No frontend |
| GET | `/api/v1/settlements/group/:groupId` | `getByGroup` | 🔶 No frontend |

### Ledger (6 endpoints)
| Method | Path | Controller | Status |
|--------|------|------------|--------|
| GET | `/api/v1/organisations/:orgId/ledger/entries` | `getEntries` | 🔶 No frontend |
| GET | `/api/v1/organisations/:orgId/ledger/trial-balance` | `getTrialBalance` | ⚪ Placeholder page |
| GET | `/api/v1/organisations/:orgId/ledger/cash-book` | `getCashBook` | ⚪ Placeholder page |
| GET | `/api/v1/events/:eventId/ledger/summary` | `getEventSummary` | 🔶 No frontend |
| GET | `/api/v1/ledger/entries/:id` | `getEntryById` | 🔶 No frontend |
| POST | `/api/v1/ledger/entries/:id/void` | `voidEntry` | 🔶 No frontend |

### Reports (4 endpoints)
| Method | Path | Controller | Status |
|--------|------|------------|--------|
| GET | `/api/v1/organisations/:orgId/reports/income-statement` | `getIncomeStatement` | ⚪ Placeholder page |
| GET | `/api/v1/organisations/:orgId/reports/donations` | `getDonationReport` | 🔶 No frontend |
| GET | `/api/v1/events/:eventId/reports/summary` | `getEventReport` | 🔶 No frontend |
| GET | `/api/v1/events/:eventId/reports/volunteers` | `getVolunteerReport` | 🔶 No frontend |

### Notifications (4 endpoints)
| Method | Path | Controller | Status |
|--------|------|------------|--------|
| GET | `/api/v1/notifications` | `getAll` | 🔶 No frontend |
| GET | `/api/v1/notifications/unread` | `getUnreadCount` | 🔶 No frontend |
| PUT | `/api/v1/notifications/:id/read` | `markRead` | 🔶 No frontend |
| PUT | `/api/v1/notifications/read-all` | `markAllRead` | 🔶 No frontend |

### Import/Export (4 endpoints)
| Method | Path | Controller | Status |
|--------|------|------------|--------|
| POST | `/api/v1/organisations/:orgId/data/import/donors` | `importDonors` | 🔶 No frontend |
| GET | `/api/v1/organisations/:orgId/data/export/donors` | `exportDonors` | 🔶 No frontend |
| GET | `/api/v1/organisations/:orgId/data/export/donations` | `exportDonations` | 🔶 No frontend |
| GET | `/api/v1/organisations/:orgId/data/export/ledger` | `exportLedger` | 🔶 No frontend |

### Projections (9 endpoints)
| Method | Path | Controller | Status |
|--------|------|------------|--------|
| GET | `/api/v1/events/:eventId/projections/daily-donations` | `getDailyDonations` | 🔶 Hook exists, no page |
| GET | `/api/v1/events/:eventId/projections/campaigns` | `getCampaignSummaries` | 🔶 Hook exists, no page |
| GET | `/api/v1/events/:eventId/projections/volunteers` | `getVolunteerPerformance` | 🔶 Hook exists, no page |
| GET | `/api/v1/organisations/:orgId/projections/dashboard` | `getOrganisationDashboard` | 🔶 Hook exists, no page |
| GET | `/api/v1/organisations/:orgId/projections/donor-retention` | `getDonorRetention` | ✅ Used (org dashboard) |
| GET | `/api/v1/organisations/:orgId/projections/financial` | `getFinancialSummary` | ✅ Used (both dashboards) |
| GET | `/api/v1/organisations/:orgId/projections/events` | `getEventOverviews` | ✅ Used (both dashboards) |
| GET | `/api/v1/organisations/:orgId/projections/events/:eventId` | `getEventOverview` | 🔶 No frontend |
| GET | `/api/v1/projections/status` | `getProjectionStatus` | 🔶 No frontend |

### Search (1 endpoint)
| Method | Path | Controller | Status |
|--------|------|------------|--------|
| GET | `/api/v1/search` | `search` | 🔶 Hook exists, no page |

### Health (5 endpoints)
| Method | Path | Status |
|--------|------|--------|
| GET | `/health` | ✅ Used (monitoring) |
| GET | `/health/queues` | ✅ Used (monitoring) |
| GET | `/ready` | ✅ Used (monitoring) |
| GET | `/live` | ✅ Used (monitoring) |
| GET | `/` | ✅ Used (API info) |

---

## 3. Frontend Route Inventory

| # | Route | Status | API Connected | Notes |
|---|-------|--------|---------------|-------|
| 1 | `/` | ✅ Complete | None (static) | Landing page |
| 2 | `/login` | ✅ Complete | `POST /auth/login` | |
| 3 | `/register` | ✅ Complete | `POST /auth/register` | |
| 4 | `/dashboard` | ✅ Complete | Role router | |
| 5 | `/dashboard/organisation` | ✅ Complete | 3 projection APIs | |
| 6 | `/dashboard/treasurer` | ✅ Complete | 2 projection APIs | |
| 7 | `/organisations` | ✅ Complete | `GET /organisations` | |
| 8 | `/organisations/new` | ✅ Complete | `POST /organisations` | |
| 9 | `/organisations/:id` | ❌ **Missing** | — | Links from org cards go here |
| 10 | `/events` | ✅ Complete | `GET /organisations/:orgId/events` | |
| 11 | `/events/new` | ✅ Complete | `POST /organisations/:orgId/events` | |
| 12 | `/events/:id` | ❌ **Missing** | — | Links from event cards go here |
| 13 | `/expenses` | ⚪ Placeholder | — | "Coming in Phase 2.3" |
| 14 | `/groups` | ⚪ Placeholder | — | "Coming in Phase 2.3" |
| 15 | `/reports` | ⚪ Placeholder | — | "Coming in Phase 2.2" |
| 16 | `/users` | ✅ Complete | `GET/PUT/DELETE /users` | Admin only |
| 17 | `/profile` | ✅ Complete | `PUT /auth/profile` | |
| 18 | `/settings/profile` | 🟡 Partial | Read-only | Duplicate of /profile |
| 19 | `/settings/billing` | ⚪ Placeholder | — | "Coming in Phase 3.0" |

---

## 4. API ↔ UI Mapping

### APIs Used by Frontend (26 of 85)

| Endpoint | Page(s) |
|----------|---------|
| `POST /auth/login` | Login |
| `POST /auth/register` | Register |
| `POST /auth/logout` | Auth provider |
| `GET /auth/me` | Auth provider |
| `PUT /auth/profile` | Profile |
| `GET /users` | Users page |
| `PUT /users/:id` | Users page |
| `DELETE /users/:id` | Users page |
| `GET /organisations` | Org list, Events, Both dashboards |
| `POST /organisations` | Org create |
| `GET /organisations/:orgId/events` | Events list |
| `POST /organisations/:orgId/events` | Event create |
| `GET /organisations/:orgId/projections/financial` | Both dashboards |
| `GET /organisations/:orgId/projections/events` | Both dashboards |
| `GET /organisations/:orgId/projections/donor-retention` | Org dashboard |

### APIs with Hooks but No Page (10 endpoints)

| Endpoint | Hook | Expected Page |
|----------|------|---------------|
| `GET /events/:id` | `useEvent` | `/events/:id` |
| `PUT /events/:id` | `useUpdateEvent` | `/events/:id/edit` |
| `POST /events/:id/status` | `useChangeEventStatus` | `/events/:id` |
| `GET /events/:id/projections/daily-donations` | `useDailyDonations` | `/events/:id` |
| `GET /events/:id/projections/campaigns` | `useCampaignSummaries` | `/events/:id` |
| `GET /events/:id/projections/volunteers` | `useVolunteerPerformance` | `/events/:id` |
| `GET /organisations/:id` | `useOrganisation` | `/organisations/:id` |
| `PUT /organisations/:id` | `useUpdateOrganisation` | `/organisations/:id/edit` |
| `POST /organisations/:id/members` | `useAddMember` | `/organisations/:id` |
| `DELETE /organisations/:id/members/:userId` | `useRemoveMember` | `/organisations/:id` |

### APIs with No Frontend at All (35 endpoints)

**Donors (7):** All CRUD + search + top donors — no donor pages exist

**Donations (6):** All CRUD + stats + cancel — no donation pages exist

**Campaigns (8):** All CRUD + status + routes + volunteers — no campaign pages exist

**Groups (9):** All CRUD + members + invites — placeholder page only

**Expenses (6):** All CRUD + balances + simplify — placeholder page only

**Settlements (3):** All CRUD — no frontend

**Ledger (6):** Entries, trial balance, cash book, void — placeholder for reports only

**Notifications (4):** List, unread, mark read — no frontend

**Import/Export (4):** CSV import/export — no frontend

---

## 5. Missing Integrations

| Feature | Backend Ready | Frontend Status | Gap |
|---------|:-------------:|:---------------:|-----|
| Organisation detail | ✅ | ❌ No page | Create `/organisations/[id]/page.tsx` |
| Event detail | ✅ | ❌ No page | Create `/events/[id]/page.tsx` |
| Donor management | ✅ | ❌ No pages | Create `/donors/` pages |
| Donation recording | ✅ | ❌ No pages | Create `/donations/` pages |
| Campaign management | ✅ | ❌ No pages | Create `/campaigns/` pages |
| Financial reports | ✅ | ⚪ Placeholder | Implement `/reports/` pages |
| Groups | ✅ | ⚪ Placeholder | Implement `/groups/` pages |
| Expenses | ✅ | ⚪ Placeholder | Implement `/expenses/` pages |
| Notifications | ✅ | ❌ No UI | Add notification bell + dropdown |
| Search | ✅ | 🔶 Component only | Add `/search` page |
| Import/Export | ✅ | ❌ No UI | Add to org detail page |
| Ledger viewer | ✅ | ❌ No UI | Add ledger pages |

---

## 6. Incomplete CRUD

| Feature | Create | Read | Update | Delete | Status |
|---------|:------:|:----:|:------:|:------:|--------|
| Organisations | ✅ | ✅ (list) | 🔶 (no page) | 🔶 (archive only) | 🟡 |
| Events | ✅ | ✅ (list) | 🔶 (no page) | 🔶 (archive only) | 🟡 |
| Campaigns | ❌ | ❌ | ❌ | ❌ | 🔴 |
| Donors | ❌ | ❌ | ❌ | ❌ | 🔴 |
| Donations | ❌ | ❌ | ❌ | ❌ (cancel only) | 🔴 |
| Groups | ⚪ | ⚪ | ❌ | ❌ (archive only) | ⚪ |
| Expenses | ⚪ | ⚪ | ❌ | ❌ | ⚪ |
| Settlements | ❌ | ❌ | ❌ | ❌ | 🔴 |
| Users | ✅ | ✅ | ✅ | ✅ | ✅ |
| Profile | — | ✅ | ✅ | — | ✅ |

---

## 7. Unused Backend APIs

| Category | Count | Endpoints |
|----------|------:|-----------|
| Donor management | 7 | All CRUD + search |
| Donation recording | 6 | All CRUD + stats |
| Campaign management | 8 | All CRUD + routes |
| Group management | 9 | All CRUD + members + invites |
| Expense management | 6 | All CRUD + balances |
| Settlement | 3 | All CRUD |
| Ledger | 6 | Entries, trial balance, cash book, void |
| Notifications | 4 | List, unread, mark read |
| Import/Export | 4 | CSV import/export |
| Projections | 6 | Daily donations, campaigns, volunteers, dashboard |
| Search | 1 | Unified search |
| **Total** | **60** | |

---

## 8. Placeholder Pages

| Page | File | Content |
|------|------|---------|
| `/expenses` | `(protected)/expenses/page.tsx` | "Coming in Phase 2.3 — Shared Expense Engine" |
| `/groups` | `(protected)/groups/page.tsx` | "Coming in Phase 2.3 — Shared Expense Engine" |
| `/reports` | `(protected)/reports/page.tsx` | "Coming in Phase 2.2 — Accounting Core & Reports" |
| `/settings/billing` | `(protected)/settings/billing/page.tsx` | "Coming in Phase 3.0 — Premium Features" |

---

## 9. Dead Navigation Links

| Location | Link Target | Issue |
|----------|-------------|-------|
| Event cards (`/events`) | `/events/${event._id}` | Page doesn't exist → 404 |
| Org cards (`/organisations`) | `/organisations/${org._id}` | Page doesn't exist → 404 |
| Sidebar "Groups" | `/groups` | Placeholder page |
| Sidebar "Expenses" | `/expenses` | Placeholder page |
| Sidebar "Reports" | `/reports` | Placeholder page |
| Treasurer dashboard "View Ledger" | `/organisations/:id/ledger` | Page doesn't exist |
| Treasurer dashboard "Income Statement" | `/organisations/:id/reports/income-statement` | Page doesn't exist |
| Treasurer dashboard "Cash Book" | `/organisations/:id/reports/cash-book` | Page doesn't exist |

---

## 10. Dashboard Widget Gaps

### Organisation Dashboard
| Widget | Status | Notes |
|--------|--------|-------|
| Total Donations card | ✅ Real API | `useFinancialSummary` |
| Total Expenses card | ✅ Real API | `useFinancialSummary` |
| Active Events card | ✅ Real API | `useEventOverviews` |
| Total Donors card | ✅ Real API | `useDonorRetention` |
| Campaign Progress chart | 🟡 Partial | Only shows active events, no actual campaign data |
| Events table | ✅ Real API | `useEventOverviews` |

### Treasurer Dashboard
| Widget | Status | Notes |
|--------|--------|-------|
| Cash Position card | ✅ Real API | `useFinancialSummary` |
| Bank Position card | ✅ Real API | `useFinancialSummary` |
| Total Income card | ✅ Real API | `useFinancialSummary` |
| Surplus/Deficit card | ✅ Derived | Calculated from income - expenses |
| Expense Breakdown chart | ✅ Real API | `useFinancialSummary.expensesByCategory` |
| Ledger Activity table | 🟡 Partial | Shows events, not actual ledger entries |

### Missing Widgets
- No volunteer dashboard
- No coordinator/event dashboard
- No notification widget
- No recent activity feed on any dashboard
- No quick actions widget

---

## 11. TODO/FIXME Report

| Type | Count | Files |
|------|------:|-------|
| TODO | 0 | — |
| FIXME | 0 | — |
| HACK | 0 | — |
| PLACEHOLDER (comment) | 1 | `frontend/src/middleware.ts:48` |
| "Coming in Phase" | 4 | 4 page files |
| console.error | 5 | `axios.ts` (2), `auth.js` (1), `user-menu.tsx` (1), `siteSwitcher.tsx` (1) |
| console.log | 0 | — |

**Note:** The `console.error` in `axios.ts` interceptors should be replaced with proper error handling (toast notifications or Sentry).

---

## 12. Completion Matrix

| Feature | Frontend | Backend | API Connected | CRUD Complete | Status |
|---------|:--------:|:-------:|:-------------:|:-------------:|--------|
| Authentication | ✅ | ✅ | ✅ | ✅ | ✅ Complete |
| User Management | ✅ | ✅ | ✅ | ✅ | ✅ Complete |
| Profile | ✅ | ✅ | ✅ | ✅ | ✅ Complete |
| Organisation List | ✅ | ✅ | ✅ | R only | 🟡 In Progress |
| Organisation Create | ✅ | ✅ | ✅ | ✅ | ✅ Complete |
| Organisation Detail | ❌ | ✅ | ❌ | — | 🔴 Not Implemented |
| Organisation Edit | ❌ | ✅ | ❌ | — | 🔴 Not Implemented |
| Organisation Members | ❌ | ✅ | ❌ | — | 🔴 Not Implemented |
| Event List | ✅ | ✅ | ✅ | R only | 🟡 In Progress |
| Event Create | ✅ | ✅ | ✅ | ✅ | ✅ Complete |
| Event Detail | ❌ | ✅ | ❌ | — | 🔴 Not Implemented |
| Event Edit | ❌ | ✅ | ❌ | — | 🔴 Not Implemented |
| Event Status | ❌ | ✅ | ❌ | — | 🔴 Not Implemented |
| Event Committee | ❌ | ✅ | ❌ | — | 🔴 Not Implemented |
| Campaign Management | ❌ | ✅ | ❌ | — | 🔴 Not Implemented |
| Donor Management | ❌ | ✅ | ❌ | — | 🔴 Not Implemented |
| Donation Recording | ❌ | ✅ | ❌ | — | 🔴 Not Implemented |
| Groups | ⚪ | ✅ | ❌ | — | ⚪ Placeholder |
| Expenses | ⚪ | ✅ | ❌ | — | ⚪ Placeholder |
| Settlements | ❌ | ✅ | ❌ | — | 🔴 Not Implemented |
| Reports | ⚪ | ✅ | ❌ | — | ⚪ Placeholder |
| Ledger Viewer | ❌ | ✅ | ❌ | — | 🔴 Not Implemented |
| Notifications | ❌ | ✅ | ❌ | — | 🔴 Not Implemented |
| Search | 🔶 | ✅ | ❌ | — | 🟡 In Progress |
| Import/Export | ❌ | ✅ | ❌ | — | 🔴 Not Implemented |
| Billing | ⚪ | ❌ | ❌ | — | ⚪ Placeholder |
| Org Dashboard | ✅ | ✅ | ✅ | — | ✅ Complete |
| Treasurer Dashboard | ✅ | ✅ | ✅ | — | ✅ Complete |

---

## 13. Prioritized Implementation Backlog

### 🔴 Critical (blocks normal platform usage)

| # | Task | Files | Why Critical |
|---|------|-------|--------------|
| 1 | **Organisation detail page** | `organisations/[id]/page.tsx` | Org cards link to 404 |
| 2 | **Event detail page** | `events/[id]/page.tsx` | Event cards link to 404 |
| 3 | **Donor list + create pages** | `donors/page.tsx`, `donors/new/page.tsx` | Core feature — no donor UI |
| 4 | **Donation recording page** | `donations/new/page.tsx` (within event detail) | Core feature — no donation UI |
| 5 | **Fix dead navigation** | Update sidebar links, dashboard buttons | 6+ links go to 404 or placeholders |

### 🟡 Important (expected in v1.0)

| # | Task | Files | Why Important |
|---|------|-------|---------------|
| 6 | **Reports pages** | `reports/page.tsx`, 4 sub-pages | Backend ready, users expect reports |
| 7 | **Groups pages** | `groups/page.tsx`, `groups/[id]/page.tsx` | Backend ready |
| 8 | **Expenses pages** | `expenses/page.tsx`, `expenses/new/page.tsx` | Backend ready |
| 9 | **Campaign pages** (within event detail) | `events/[id]/campaigns/` | Backend ready |
| 10 | **Notification bell + dropdown** | Component in header | Backend ready |
| 11 | **Search results page** | `search/page.tsx` | Component exists, needs page |
| 12 | **Settlement pages** | Within groups | Backend ready |
| 13 | **Ledger viewer** | `organisations/[id]/ledger/page.tsx` | Backend ready |
| 14 | **Import/Export UI** | Add to org detail | Backend ready |
| 15 | **Fix console.error → proper error handling** | `axios.ts`, `auth.js` | Code quality |

### 🟢 Nice to Have (v1.1+)

| # | Task | Files | Notes |
|---|------|-------|-------|
| 16 | **Settings consolidation** | Merge `/settings/profile` into `/profile` | Reduce duplication |
| 17 | **Volunteer dashboard** | `dashboard/volunteer/page.tsx` | New page |
| 18 | **Coordinator dashboard** | `dashboard/coordinator/page.tsx` | New page |
| 19 | **Dark mode toggle** | Add to settings | CSS variables already set up |
| 20 | **Billing page** | `settings/billing/page.tsx` | No backend yet |
| 21 | **Google OAuth** | Login page button | UI exists, not wired |
| 22 | **PWA support** | Service worker, manifest | Mobile experience |
| 23 | **Offline mode** | Service worker + IndexedDB | Volunteer field work |

---

## Summary Statistics

| Category | Total | Complete | In Progress | Not Implemented | Placeholder |
|----------|------:|:--------:|:-----------:|:---------------:|:-----------:|
| Backend APIs | 85 | — | — | — | — |
| APIs consumed by frontend | 26 | 26 | — | — | — |
| APIs with hooks, no page | 10 | — | 10 | — | — |
| APIs with no frontend | 49 | — | — | 49 | — |
| Frontend pages | 17 | 10 | 1 | 2 | 4 |
| Dead navigation links | 8 | — | — | 8 | — |
| Dashboard widgets | 12 | 9 | 2 | 1 | — |
