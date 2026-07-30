# Event Catalogue

Domain events are the backbone of cross-module communication in Donor Dash. Every event has a publisher and one or more consumers.

---

## User Events

### `user.registered`
- **Publisher**: Auth
- **Consumers**: Notifications (welcome email)
- **Payload**: `{ userId, name, email }`

### `user.login`
- **Publisher**: Auth
- **Consumers**: Audit
- **Payload**: `{ userId, ip, userAgent }`

### `user.profile.updated`
- **Publisher**: Auth
- **Consumers**: Audit
- **Payload**: `{ userId, changes }`

---

## Donation Events

### `donation.recorded`
- **Publisher**: Donations
- **Consumers**: Ledger, Notifications, Activity, Reports, AI
- **Payload**: `{ donationId, donorId, eventId, campaignId, amount, method, collectedBy }`
- **Ledger Action**: Debit Cash, Credit Donation Income

### `donation.cancelled`
- **Publisher**: Donations
- **Consumers**: Ledger, Activity
- **Payload**: `{ donationId, reason }`
- **Ledger Action**: Reverse original entry

### `donation.refunded`
- **Publisher**: Donations
- **Consumers**: Ledger, Notifications, Activity
- **Payload**: `{ donationId, amount, reason }`
- **Ledger Action**: Debit Donation Income, Credit Cash

---

## Expense Events

### `expense.created`
- **Publisher**: Expenses
- **Consumers**: Ledger, Activity, Balances
- **Payload**: `{ expenseId, groupId, amount, paidBy, splits }`
- **Ledger Action**: Debit Expense Category, Credit Cash

### `expense.updated`
- **Publisher**: Expenses
- **Consumers**: Ledger, Activity, Balances
- **Payload**: `{ expenseId, changes }`
- **Ledger Action**: Void old entry, create new entry

### `expense.deleted`
- **Publisher**: Expenses
- **Consumers**: Ledger, Activity, Balances
- **Payload**: `{ expenseId }`
- **Ledger Action**: Void original entry

---

## Settlement Events

### `settlement.created`
- **Publisher**: Settlements
- **Consumers**: Activity, Notifications
- **Payload**: `{ settlementId, groupId, paidBy, paidTo, amount }`

### `settlement.confirmed`
- **Publisher**: Settlements
- **Consumers**: Ledger, Activity, Balances
- **Payload**: `{ settlementId }`
- **Ledger Action**: Debit Payables, Credit Cash

### `settlement.rejected`
- **Publisher**: Settlements
- **Consumers**: Activity, Notifications
- **Payload**: `{ settlementId, reason }`

---

## Event/Campaign Events

### `event.created`
- **Publisher**: Events
- **Consumers**: Activity, Notifications
- **Payload**: `{ eventId, name, type, startDate }`

### `event.status.changed`
- **Publisher**: Events
- **Consumers**: Activity, Notifications
- **Payload**: `{ eventId, from, to }`

### `campaign.created`
- **Publisher**: Events
- **Consumers**: Activity
- **Payload**: `{ campaignId, eventId, type, target }`

### `campaign.completed`
- **Publisher**: Events
- **Consumers**: Activity, Reports
- **Payload**: `{ campaignId, totalCollected }`

### `volunteer.assigned`
- **Publisher**: Events
- **Consumers**: Notifications, Activity
- **Payload**: `{ volunteerId, campaignId, route }`

---

## Group Events

### `group.created`
- **Publisher**: Groups
- **Consumers**: Activity
- **Payload**: `{ groupId, name, createdBy }`

### `group.member.added`
- **Publisher**: Groups
- **Consumers**: Activity, Notifications
- **Payload**: `{ groupId, userId }`

### `group.member.removed`
- **Publisher**: Groups
- **Consumers**: Activity
- **Payload**: `{ groupId, userId }`

---

## Ledger Events

### `ledger.entry.posted`
- **Publisher**: Ledger
- **Consumers**: Reports (materialized views), Analytics
- **Payload**: `{ entryId, sourceType, sourceId, totalAmount }`

### `ledger.entry.voided`
- **Publisher**: Ledger
- **Consumers**: Reports, Analytics
- **Payload**: `{ entryId, voidedEntryId, reason }`

---

## System Events

### `ocr.completed`
- **Publisher**: Shared (OCR)
- **Consumers**: Expenses, Donations
- **Payload**: `{ receiptId, extractedData, confidence }`

### `notification.sent`
- **Publisher**: Notifications
- **Consumers**: Audit
- **Payload**: `{ notificationId, channel, status }`

### `budget.threshold.exceeded`
- **Publisher**: Finance
- **Consumers**: Notifications
- **Payload**: `{ budgetId, userId, category, percentage }`
