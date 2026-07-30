# State Machines

Every entity with lifecycle states is documented here. Valid transitions only.

---

## Event Status

```
planning ──→ active ──→ completed ──→ archived
    │           │
    └──→ cancelled ←──┘
```

| From | To | Trigger |
|------|-----|---------|
| planning | active | Event start date reached, committee ready |
| planning | cancelled | Event cancelled before start |
| active | completed | Event end date reached |
| active | cancelled | Event cancelled during |
| completed | archived | After reports generated and reviewed |

**Invalid**: `archived → active`, `completed → planning`

---

## Campaign Status

```
draft ──→ active ──→ completed
  │          │
  └──→ cancelled ←──┘
```

| From | To | Trigger |
|------|-----|---------|
| draft | active | Campaign launched |
| draft | cancelled | Campaign abandoned |
| active | completed | Target reached or end date |
| active | cancelled | Campaign abandoned |

---

## Donation Status

```
pledged ──→ received ──→ verified
               │
               ├──→ cancelled
               └──→ refunded
```

| From | To | Trigger |
|------|-----|---------|
| pledged | received | Payment received |
| pledged | cancelled | Pledge withdrawn |
| received | verified | Supervisor verified |
| received | cancelled | Donation reversed |
| received | refunded | Donor refunded |

**Invalid**: `cancelled → received`, `refunded → received`

---

## Collection Status

```
in_progress ──→ submitted ──→ verified
```

| From | To | Trigger |
|------|-----|---------|
| in_progress | submitted | Volunteer submits batch |
| submitted | verified | Supervisor verifies |

**Invalid**: `verified → in_progress`

---

## Settlement Status

```
pending ──→ confirmed
   │
   └──→ rejected
```

| From | To | Trigger |
|------|-----|---------|
| pending | confirmed | Recipient confirms payment |
| pending | rejected | Recipient rejects payment |

**Invalid**: `confirmed → pending`, `rejected → pending`

---

## Ledger Entry Status

```
draft ──→ posted ──→ void
```

| From | To | Trigger |
|------|-----|---------|
| draft | posted | Entry finalized |
| posted | void | Entry reversed (new reverse entry created) |

**Invalid**: `void → posted`, `posted → draft`

---

## Group Lifecycle

```
active ──→ archived ──→ active (reactivated)
```

| From | To | Trigger |
|------|-----|---------|
| active | archived | Group no longer needed |
| archived | active | Group reactivated |

Groups are never deleted, only archived.

---

## User Account

```
active ──→ suspended ──→ active (reactivated)
```

| From | To | Trigger |
|------|-----|---------|
| active | suspended | Admin suspends account |
| suspended | active | Admin reactivates |

Users are never deleted (referential integrity).
