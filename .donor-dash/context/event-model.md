# Event Model

## Concept
Everything in Donor Dash revolves around **Events**. An Event is a time-bound activity that involves donations, collections, expenses, volunteers, and reporting.

## Event Types

| Type | Description | Examples |
|------|-------------|---------|
| `ganpati` | Ganpati Utsav celebrations | Ganpati 2025, Ganpati 2026 |
| `shiv_jayanti` | Shiv Jayanti celebrations | Shiv Jayanti 2026 |
| `blood_donation` | Blood donation camps | Annual Blood Camp 2026 |
| `school_donation` | School-related donation drives | School Supplies Drive |
| `other` | Any other community event | Tree Plantation, Cleanliness Drive |

## Event Lifecycle

```
Planning → Active → Completed → Archived
    ↓         ↓         ↓
  Cancelled  Cancelled
```

### Planning
- Event is being set up
- Committee members assigned
- Budget being prepared
- Campaigns being created

### Active
- Event is ongoing
- Collections happening
- Expenses being incurred
- Volunteers deployed

### Completed
- Event has ended
- Final reports being generated
- Outstanding amounts being settled

## Event Structure

```
Organisation
    └── Event
         ├── Committee (users with roles)
         ├── Campaigns (collection drives)
         │    ├── Collections (volunteer batches)
         │    │    └── Donations (individual contributions)
         │    └── Volunteers (assigned users)
         ├── Expenses (event costs)
         ├── Budget (planned vs actual)
         └── Reports (event summary)
```

## Committee Roles

| Role | Responsibilities |
|------|-----------------|
| President | Overall event oversight, final approvals |
| Secretary | Documentation, communication, coordination |
| Treasurer | Financial management, expense approvals, reporting |
| Member | General committee participation |

## Campaigns

A Campaign is a collection drive within an Event. One event can have multiple campaigns.

```
Ganpati 2026 (Event)
    ├── Door-to-Door Collection (Campaign)
    ├── Online Donation Drive (Campaign)
    ├── Corporate Sponsorship (Campaign)
    └── QR Code Collection (Campaign)
```

### Campaign Types
| Type | Description |
|------|-------------|
| `door_to_door` | Volunteers visit houses |
| `online` | Website/app-based donations |
| `corporate` | Business sponsorships |
| `sponsored` | Sponsored events |
| `other` | Misc collection methods |

## Volunteer Assignment

Volunteers are assigned to campaigns with specific collection routes:

```
Campaign: Door-to-Door Collection
    ├── Volunteer A → Route: Ward 1, Main Street
    ├── Volunteer B → Route: Ward 2, Market Area
    └── Volunteer C → Route: Ward 3, Residential Colony
```

Each volunteer records their collections, which are grouped into a Collection record.

## Event Scoping

All financial data is scoped to events:
- Donations belong to an Event (and optionally a Campaign)
- Expenses are linked to an Event
- Reports are generated per Event
- Ledger entries reference an Event
- Balances are calculated per Event (for event-specific reports)

## Cross-Event Operations

- Donors are global (a donor can donate to multiple events)
- Volunteers are global (a user can volunteer for multiple events)
- Accounts are global (chart of accounts is shared)
- Reports can compare across events (year-over-year)
