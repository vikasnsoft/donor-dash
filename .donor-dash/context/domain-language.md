# Domain Language

Every term in Donor Dash has a precise meaning. Use these terms consistently in code, documentation, and conversation.

---

## Workspace
**What**: The top-level container. A login belongs to a workspace. A workspace can contain multiple organisations.
**Owner**: Auth/Users module
**Creates**: Nothing (organizational concept)
**Cannot**: Contain financial data directly
**Relationships**: Has many Organisations. Has many Users.

---

## Organisation
**What**: A legal entity (mandal, NGO, trust, committee) that operates within a workspace.
**Owner**: Events module
**Creates**: Events, Campaigns
**Cannot**: Exist without a Workspace. Own financial data directly.
**Relationships**: Belongs to Workspace. Has many Events. Has many Members (Users with roles).

---

## Event
**What**: A time-bound community activity (Ganpati 2026, Shiv Jayanti, Blood Camp). The primary organizational unit.
**Owner**: Events module
**Creates**: Campaigns, Committee assignments
**Cannot**: Be deleted if it has Donations or Expenses. Exist without an Organisation.
**Relationships**: Belongs to Organisation. Has many Campaigns. Has many Donations. Has many Expenses. Has Committee (Users).

---

## Campaign
**What**: A collection drive within an Event. One event can have multiple campaigns (door-to-door, online, corporate).
**Owner**: Events module
**Creates**: Collections
**Cannot**: Exist without an Event. Track money directly (that's Donations).
**Relationships**: Belongs to Event. Has many Collections. Has many Volunteers (Users).

---

## Collection
**What**: A batch of donations collected by one volunteer during a campaign. Groups individual donations into a submission.
**Owner**: Collections module
**Creates**: Nothing (container for Donations)
**Cannot**: Exist without a Campaign. Be modified after verification.
**Relationships**: Belongs to Campaign. Has one Volunteer (User). Has many Donations.

---

## Donor
**What**: An individual, family, or corporate entity that makes donations. Exists independently of events.
**Owner**: Donors module
**Creates**: Donations (indirectly — a Donation references a Donor)
**Cannot**: Be deleted if they have Donations. See other donors' data.
**Relationships**: Optionally belongs to Family. Has many Donations.

---

## Family
**What**: A group of Donors who share a household. Enables household-level reporting.
**Owner**: Donors module
**Creates**: Nothing
**Cannot**: Make donations directly (individual Donors do).
**Relationships**: Has many Donors.

---

## Donation
**What**: A financial contribution from a Donor to an Event, optionally through a Campaign.
**Owner**: Donations module
**Creates**: Ledger Entry (via Ledger Service)
**Cannot**: Be deleted (only cancelled/refunded). Modify the Ledger directly. Update Reports directly.
**Relationships**: Belongs to Donor. Belongs to Event. Optionally belongs to Campaign. Optionally belongs to Collection. Has one LedgerEntry.

---

## Expense
**What**: A shared cost recorded in an expense Group. Can be split among members.
**Owner**: Expenses module
**Creates**: Ledger Entry (via Ledger Service). Balance updates.
**Cannot**: Be deleted (soft delete only). Modify Balances directly (done in same transaction).
**Relationships**: Belongs to Group. Paid by one User. Split among Users. Has one LedgerEntry.

---

## Group
**What**: A set of Users who share expenses. Can be linked to an Event or exist independently.
**Owner**: Groups module
**Creates**: Expenses, Settlements (indirectly)
**Cannot**: Own financial data directly (Expenses and Balances do).
**Relationships**: Has many Members (Users). Has many Expenses. Has many Balances. Optionally linked to Event.

---

## Settlement
**What**: A payment from one Group member to another to resolve a balance.
**Owner**: Settlements module
**Creates**: Ledger Entry (via Ledger Service). Balance updates.
**Cannot**: Be deleted (only rejected). Exceed the owed amount.
**Relationships**: Belongs to Group. Paid by one User. Paid to one User. Has one LedgerEntry.

---

## Balance
**What**: A cached summary of what one User owes/is owed within a Group.
**Owner**: Expenses module (calculated)
**Creates**: Nothing (derived data)
**Cannot**: Be modified directly (must be updated through expense/settlement transactions).
**Relationships**: Belongs to User. Belongs to Group.

---

## Account
**What**: A line in the Chart of Accounts (Cash, Bank, Donation Income, Decoration Expense, etc.).
**Owner**: Ledger module
**Creates**: Nothing
**Cannot**: Be deleted if it has posted Ledger Entries.
**Relationships**: Has many LedgerEntries. Optionally has parent Account.

---

## Ledger Entry (Journal Entry)
**What**: A balanced record of financial activity. Every entry has equal debits and credits.
**Owner**: Ledger module
**Creates**: Nothing (it IS the financial record)
**Cannot**: Be modified once posted. Be deleted. Be created without balancing.
**Relationships**: Has many Lines (Account + type + amount). Created by User. References source entity.

---

## Budget
**What**: A spending limit for a category within a time period.
**Owner**: Finance module (Phase 2.5)
**Creates**: Nothing
**Cannot**: Prevent expenses (it's advisory, not blocking).
**Relationships**: Belongs to User. References Category.

---

## Receipt
**What**: A scanned image of a physical receipt attached to an Expense or Donation.
**Owner**: Shared module (OCR)
**Creates**: Nothing (stores in Supabase Storage)
**Cannot**: Be modified after upload. Exist without an Expense or Donation.
**Relationships**: Belongs to Expense or Donation.

---

## Volunteer
**What**: A User assigned to a Campaign for collecting donations.
**Owner**: Events module (assignment), Collections module (activity)
**Creates**: Collections, Donations
**Cannot**: See other volunteers' collections. Edit verified collections.
**Relationships**: User assigned to Campaign with collection Route.

---

## Committee
**What**: Users assigned to an Event with specific roles (President, Secretary, Treasurer, Member).
**Owner**: Events module
**Creates**: Nothing
**Cannot**: Override admin permissions.
**Relationships**: Many Users assigned to one Event with roles.
