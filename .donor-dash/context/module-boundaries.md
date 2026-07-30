# Module Boundaries

## Principle
Each module owns its data and logic. No module may directly access another module's model or service. Cross-module communication happens via domain events or shared interfaces.

## Module Ownership

### Auth
**Owns**: Login, register, logout, JWT tokens, session management
**Models**: None (uses User model from Users module)
**Exports**: `protect`, `authorize`, `admin` middleware

### Users
**Owns**: User profiles, roles, admin user management
**Models**: `User`
**Exports**: User lookup functions (for other modules to populate references)

### Donors (Phase 2.1)
**Owns**: Donor profiles, families, corporate donors, donor communication
**Models**: `Donor`, `Family`
**Rules**:
- Donors are independent of events (a donor can donate to multiple events)
- Family groups donors for household-level reporting
- Never expose donor PII in list responses

### Events (Phase 2.1)
**Owns**: Events, campaigns, committees, volunteer assignments
**Models**: `Event`, `Campaign`
**Rules**:
- Events are the top-level organizational unit
- Campaigns belong to one event
- Committee members are users assigned to an event with specific roles
- Volunteer assignments link users to campaign collection routes

### Donations (Phase 2.1)
**Owns**: Donation records, receipts, pledges
**Models**: `Donation`
**Rules**:
- Every donation references a Donor, Event, and optionally a Campaign
- Every donation creates a Ledger Entry
- Receipt numbers are auto-generated and unique
- Donations are never deleted, only status-changed (cancelled/refunded)

### Collections (Phase 2.1)
**Owns**: Collection routes, volunteer collection records
**Models**: `Collection`
**Rules**:
- Collections belong to a Campaign
- A collection groups multiple donations made by one volunteer
- Collections have a workflow: in_progress → submitted → verified

### Groups (Phase 2.3)
**Owns**: Expense groups, group membership
**Models**: `Group`
**Rules**:
- Groups are for shared expense splitting
- Groups can optionally link to an Event
- Members have roles: admin (can manage group) or member
- Invite codes for joining groups

### Expenses (Phase 2.3)
**Owns**: Shared expenses, splits, items
**Models**: `Expense`
**Rules**:
- Every expense belongs to a Group
- Split amounts must sum to total expense amount
- Every expense updates group Balances in a transaction
- Soft delete (isDeleted flag)

### Settlements (Phase 2.3)
**Owns**: Settlement records between group members
**Models**: `Settlement`
**Rules**:
- Settlements reduce balances between two group members
- Settlements can be confirmed/rejected by the receiving party
- Every settlement creates a Ledger Entry

### Ledger (Phase 2.2)
**Owns**: Chart of Accounts, Journal Entries, Trial Balance
**Models**: `Account`, `LedgerEntry`
**Rules**:
- Ledger never references business tables directly
- Business modules push entries to the ledger via the Ledger Service
- Every entry must balance (debits = credits)
- Posted entries are immutable
- Void entries are created to reverse posted entries

### Reports (Phase 2.2)
**Owns**: Report generation, materialized summaries
**Models**: `DailySummary`, `MonthlySummary`, `EventSummary` (materialized)
**Rules**:
- Reports read from Ledger and materialized aggregates
- Reports never execute business logic
- Reports are generated on-demand or via scheduled jobs

### Audit (Phase 2.0)
**Owns**: Immutable audit logs
**Models**: `AuditLog`
**Rules**:
- Append-only (no updates or deletes)
- Every data mutation is logged
- Includes who, what, when, and before/after values

### Activity (Phase 2.0)
**Owns**: User-friendly activity feed
**Models**: `Activity`
**Rules**:
- Scoped to groups or events
- Human-readable descriptions
- Supports soft delete (archive)

### Notifications (Phase 2.4)
**Owns**: Notification delivery across channels
**Models**: `Notification`
**Rules**:
- Multi-channel: email, push, SMS, WhatsApp, in-app
- Triggered by domain events from other modules
- User preferences control which channels are active

### Finance (Phase 2.5)
**Owns**: Personal budgets, bank sync, spending analytics
**Models**: `Budget`, `Transaction` (bank-synced)
**Rules**:
- Premium feature (gated by role)
- Bank connections via Plaid
- Auto-categorization of transactions

### AI (Phase 2.6)
**Owns**: AI assistant, natural language queries, forecasting
**Models**: None (reads from other modules)
**Rules**:
- Tool-based architecture (specialized tools for different domains)
- Never writes directly to business tables
- Reads via read-only service interfaces

## Cross-Module Communication

### ❌ Wrong: Direct Import
```javascript
// In expenses/service.js
import Donation from '../donations/model.js';  // NEVER
```

### ✅ Right: Domain Event
```javascript
// In expenses/service.js
import { emitEvent } from '../shared/events.js';
emitEvent('expense.created', { expenseId, groupId, amount });

// In ledger/service.js
on('expense.created', async ({ expenseId, amount }) => {
  await createLedgerEntry(...);
});
```

### ✅ Right: Shared Interface
```javascript
// In modules/shared/user-service.js
export const getUserById = async (id) => {
  // Calls users module via internal API or direct service
};
```

## Boundary Violation Detection

If you find yourself:
1. Importing from another module's `model.js` → Use domain events
2. Importing from another module's `service.js` → Use shared interface
3. Querying another module's collection directly → Use the owning module's service
4. Updating another module's data → Use domain events
