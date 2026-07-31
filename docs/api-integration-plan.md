# API Integration Plan

## Current State (10 implemented, 6 pending)

### ✅ Implemented (10 pages)
| Page | Status | Hooks Used |
|------|--------|------------|
| `/` (landing) | Static | None needed |
| `/login` | Complete | `useLogin` |
| `/register` | Complete | `useRegister` |
| `/dashboard` | Complete | Routes to role-specific view |
| `/dashboard/organisation` | Complete | `useOrganisations`, `useFinancialSummary`, `useEventOverviews`, `useDonorRetention` |
| `/dashboard/treasurer` | Complete | `useOrganisations`, `useFinancialSummary`, `useEventOverviews` |
| `/organisations` | Complete | `useOrganisations` |
| `/organisations/new` | Complete | `useCreateOrganisation` |
| `/events` | Complete | `useOrganisations`, `useEvents` |
| `/events/new` | Complete | `useCreateEvent` |
| `/users` | Complete | `useUsers`, `useUpdateUser`, `useDeleteUser` |
| `/profile` | Complete | `useAuth`, `useUpdateProfile` |

### 🔶 Missing Detail Pages (hooks exist, no page)
| Page | Priority | Hooks Available | API Endpoints |
|------|----------|-----------------|---------------|
| `/organisations/:id` | **HIGH** | `useOrganisation` | `GET /organisations/:id` |
| `/events/:id` | **HIGH** | `useEvent`, `useDailyDonations`, `useVolunteerPerformance`, `useCampaignSummaries`, `useEventSummary` | `GET /events/:id`, projection endpoints |
| `/search` | MEDIUM | `useSearch` | `GET /search?q=` |

### 🔶 Placeholder Pages (backend ready, no frontend)
| Page | Priority | Backend Endpoints | Hooks Needed |
|------|----------|-------------------|--------------|
| `/reports` | **HIGH** | `GET /organisations/:id/reports/income-statement`, `cash-book`, `trial-balance`, `donations` | `useIncomeStatement`, `useCashBook`, `useTrialBalance` |
| `/groups` | HIGH | `GET /groups`, `POST /groups`, `GET /groups/:id`, etc. | `useGroups`, `useCreateGroup`, `useGroup` |
| `/expenses` | HIGH | `GET /expenses`, `POST /expenses`, `GET /expenses/:id`, etc. | `useExpenses`, `useCreateExpense`, `useExpense` |
| `/settings/billing` | LOW | None (future) | N/A |

---

## Implementation Phases

### Phase A: Critical Detail Pages (Priority 1)

#### A1. Organisation Detail Page (`/organisations/:id`)
**New files:**
- `frontend/src/app/(routes)/(protected)/organisations/[id]/page.tsx`
- `frontend/src/app/(routes)/(protected)/organisations/[id]/edit/page.tsx`

**Features:**
- Organisation info card (name, type, description, address)
- Member list with roles
- Add/remove members
- Invite via email
- Events linked to this org
- Financial summary (from projection)
- Edit organisation form
- Archive organisation

**API Endpoints:**
```
GET    /api/v1/organisations/:id          — already in useOrganisation hook
PUT    /api/v1/organisations/:id          — already in useUpdateOrganisation hook
POST   /api/v1/organisations/:id/members  — already in useAddMember hook
DELETE /api/v1/organisations/:id/members/:uid — already in useRemoveMember hook
POST   /api/v1/organisations/:id/invites  — already in useSendInvite hook
POST   /api/v1/organisations/:id/archive  — already in useArchiveOrganisation hook
```

#### A2. Event Detail Page (`/events/:id`)
**New files:**
- `frontend/src/app/(routes)/(protected)/events/[id]/page.tsx`
- `frontend/src/app/(routes)/(protected)/events/[id]/edit/page.tsx`

**Features:**
- Event info card (name, type, status, dates, location)
- Financial summary (donations, expenses, balance)
- Daily donations chart
- Campaign progress chart
- Volunteer leaderboard
- Committee member list
- Status change controls (draft → planning → active → completed)
- Edit event form

**API Endpoints:**
```
GET    /api/v1/events/:id                         — already in useEvent hook
PUT    /api/v1/events/:id                         — already in useUpdateEvent hook
POST   /api/v1/events/:id/status                  — already in useChangeEventStatus hook
GET    /api/v1/events/:id/projections/daily-donations — already in useDailyDonations hook
GET    /api/v1/events/:id/projections/volunteers      — already in useVolunteerPerformance hook
GET    /api/v1/events/:id/projections/campaigns       — already in useCampaignSummaries hook
GET    /api/v1/events/:id/summary                     — already in useEventSummary hook
```

#### A3. Search Results Page (`/search`)
**New files:**
- `frontend/src/app/(routes)/(protected)/search/page.tsx`

**Features:**
- Full-page search results
- Filter by type (donor, event, campaign, donation, group, expense)
- Click to navigate to detail page

**API Endpoints:**
```
GET    /api/v1/search?q=query&orgId=xxx  — already in useSearch hook
```

---

### Phase B: Financial Reports (Priority 2)

#### B1. Reports Hub Page (`/reports`)
**New files:**
- `frontend/src/app/(routes)/(protected)/reports/page.tsx`
- `frontend/src/app/(routes)/(protected)/reports/income-statement/page.tsx`
- `frontend/src/app/(routes)/(protected)/reports/cash-book/page.tsx`
- `frontend/src/app/(routes)/(protected)/reports/trial-balance/page.tsx`
- `frontend/src/app/(routes)/(protected)/reports/donations/page.tsx`

**New hooks:**
- `frontend/src/hooks/useReports.ts`

**Features:**
- Reports hub with cards for each report type
- Income Statement: income vs expenses with surplus/deficit
- Cash Book: daily cash in/out with running balance
- Trial Balance: all accounts with debits/credits
- Donation Report: by method, by status, daily breakdown
- Date range filter on all reports
- Export to CSV button on each report

**API Endpoints:**
```
GET /api/v1/organisations/:id/reports/income-statement?from=&to=
GET /api/v1/organisations/:id/reports/donations?eventId=&from=&to=
GET /api/v1/organisations/:id/ledger/trial-balance?date=
GET /api/v1/organisations/:id/ledger/cash-book?from=&to=
GET /api/v1/events/:id/reports/summary
GET /api/v1/events/:id/reports/volunteers
```

---

### Phase C: Shared Expense UI (Priority 3)

#### C1. Groups Page (`/groups`)
**New files:**
- `frontend/src/app/(routes)/(protected)/groups/[id]/page.tsx`
- `frontend/src/app/(routes)/(protected)/groups/new/page.tsx`

**New hooks:**
- `frontend/src/hooks/useGroups.ts`

**Features:**
- Group list with member avatars, total expenses
- Create group form (name, type, default currency, add members)
- Group detail with tabs: Expenses, Balances, Activity
- Member management (add/remove)
- Invite code generation
- Archive group

**API Endpoints:**
```
GET    /api/v1/groups
POST   /api/v1/groups
GET    /api/v1/groups/:id
PUT    /api/v1/groups/:id
POST   /api/v1/groups/:id/members
DELETE /api/v1/groups/:id/members/:uid
POST   /api/v1/groups/:id/invite
POST   /api/v1/groups/join/:code
```

#### C2. Expenses Page (`/expenses`)
**New files:**
- `frontend/src/app/(routes)/(protected)/expenses/page.tsx`
- `frontend/src/app/(routes)/(protected)/expenses/new/page.tsx`

**New hooks:**
- `frontend/src/hooks/useExpenses.ts`

**Features:**
- Expense list (all user's expenses across groups)
- Create expense form with:
  - Description, amount, group selector
  - Split type radio (equal, exact, percentage, shares)
  - Dynamic split editor
  - Category selector
  - Paid-by selector
- Expense detail view
- Balance summary per group
- Settle up flow

**API Endpoints:**
```
POST   /api/v1/expenses
GET    /api/v1/expenses/:id
GET    /api/v1/expenses/group/:groupId
GET    /api/v1/expenses/group/:groupId/balances
GET    /api/v1/expenses/group/:groupId/simplify
GET    /api/v1/expenses/me/balances
POST   /api/v1/settlements
GET    /api/v1/settlements/group/:groupId
```

---

### Phase D: Polish & Integration (Priority 4)

#### D1. Settings Page Consolidation
- Remove `/settings/profile` (duplicate of `/profile`)
- Create proper `/settings` page with:
  - Profile settings (link to /profile)
  - Notification preferences
  - Theme toggle (dark mode)
  - Account settings

#### D2. Organisation Settings
- `/organisations/:id/settings` page
- Edit organisation details
- Manage members
- Branding settings
- Financial settings (default currency, receipt prefix)
- Notification settings

#### D3. Event Settings
- `/events/:id/settings` page
- Edit event details
- Manage committee
- Budget management
- Visibility settings

---

## New Hooks Required

### Phase A (Detail Pages)
No new hooks needed — all hooks already exist.

### Phase B (Reports)
```typescript
// frontend/src/hooks/useReports.ts
useIncomeStatement(orgId, from, to)
useCashBook(orgId, from, to)
useTrialBalance(orgId, date)
useDonationReport(orgId, eventId, from, to)
useEventReport(eventId)
useVolunteerReport(eventId)
```

### Phase C (Groups & Expenses)
```typescript
// frontend/src/hooks/useGroups.ts
useGroups(page, limit)
useGroup(groupId)
useCreateGroup()
useUpdateGroup()
useAddGroupMember()
useRemoveGroupMember()
useGenerateInvite()
useJoinByInvite()

// frontend/src/hooks/useExpenses.ts
useExpenses(groupId, page, limit)
useExpense(expenseId)
useCreateExpense()
useGroupBalances(groupId)
useSimplifiedDebts(groupId)
useUserBalanceSummary()

// frontend/src/hooks/useSettlements.ts
useSettlements(groupId, page, limit)
useCreateSettlement()
```

---

## Implementation Order

| Step | Task | Files | Dependencies |
|------|------|-------|--------------|
| 1 | Create `useReports.ts` hook | 1 new | None |
| 2 | Organisation detail page | 2 new | None |
| 3 | Event detail page | 2 new | None |
| 4 | Reports hub + 4 report pages | 5 new | Step 1 |
| 5 | Create `useGroups.ts` hook | 1 new | None |
| 6 | Groups list + detail pages | 3 new | Step 5 |
| 7 | Create `useExpenses.ts` hook | 1 new | None |
| 8 | Expenses list + create pages | 3 new | Step 7 |
| 9 | Search results page | 1 new | None |
| 10 | Settings consolidation | 2 modified | None |

**Total: ~19 new files, ~5 modified files**

---

## Verification Checklist

### After Phase A
- [ ] Click org card → org detail page loads with real data
- [ ] Click event card → event detail page loads with real data
- [ ] Event detail shows daily donations chart
- [ ] Event detail shows volunteer leaderboard
- [ ] Search returns results and navigates to detail pages

### After Phase B
- [ ] Reports hub shows all report types
- [ ] Income statement shows correct income/expenses/surplus
- [ ] Cash book shows daily cash in/out
- [ ] Trial balance shows debits = credits
- [ ] Date filter works on all reports
- [ ] CSV export works

### After Phase C
- [ ] Create group → group appears in list
- [ ] Add expense with equal split → balances update
- [ ] Add expense with exact split → amounts match
- [ ] Simplify debts → shows optimized settlements
- [ ] Create settlement → balances reduce
- [ ] Ledger entry created for expense and settlement

### After Phase D
- [ ] Settings page consolidated
- [ ] Organisation settings work
- [ ] Event settings work
- [ ] No dead links in sidebar
