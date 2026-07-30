# Permissions Guide

## Role Hierarchy

| Level | Role | Description |
|-------|------|-------------|
| 5 | `admin` | Full platform access. Can manage all users, events, and settings. |
| 4 | `supervisor` | Can approve large donations, audit records, manage events. |
| 3 | `auditor` | Read-only access to all financial data. Can verify entries. |
| 2 | `volunteer` | Can record collections, view assigned routes, submit reports. |
| 1 | `support` | Can manage donor communication, view donor profiles. |
| 0 | `guest` | Read-only access to public data. Default for new users. |

## Permission Matrix

### Auth
| Action | admin | supervisor | auditor | volunteer | support | guest |
|--------|:-----:|:----------:|:-------:|:---------:|:-------:|:-----:|
| Login | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| View own profile | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Update own profile | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Users (Admin)
| Action | admin | supervisor | auditor | volunteer | support | guest |
|--------|:-----:|:----------:|:-------:|:---------:|:-------:|:-----:|
| List all users | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| View any user | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Update any user | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Delete any user | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Change roles | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |

### Events
| Action | admin | supervisor | auditor | volunteer | support | guest |
|--------|:-----:|:----------:|:-------:|:---------:|:-------:|:-----:|
| Create event | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| View events | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Edit event | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Delete event | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Manage committee | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |

### Donations
| Action | admin | supervisor | auditor | volunteer | support | guest |
|--------|:-----:|:----------:|:-------:|:---------:|:-------:|:-----:|
| Create donation | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| View all donations | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| View own collections | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Edit donation | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Cancel donation | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Approve large (>₹10k) | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |

### Donors
| Action | admin | supervisor | auditor | volunteer | support | guest |
|--------|:-----:|:----------:|:-------:|:---------:|:-------:|:-----:|
| Create donor | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ |
| View donors | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Edit donor | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ |
| Delete donor | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| View donor PII | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ |

### Expenses (Shared)
| Action | admin | supervisor | auditor | volunteer | support | guest |
|--------|:-----:|:----------:|:-------:|:---------:|:-------:|:-----:|
| Create group | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Add expense | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| View group expenses | ✓ | ✓ | ✓ | ✓* | ✗ | ✗ |
| Settle up | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |

*volunteers can only see expenses in groups they belong to

### Financial Reports
| Action | admin | supervisor | auditor | volunteer | support | guest |
|--------|:-----:|:----------:|:-------:|:---------:|:-------:|:-----:|
| View all reports | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| View event reports | ✓ | ✓ | ✓ | ✓* | ✗ | ✗ |
| Export reports | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Verify ledger entries | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ |

*volunteers can only see reports for events they're assigned to

### Ledger
| Action | admin | supervisor | auditor | volunteer | support | guest |
|--------|:-----:|:----------:|:-------:|:---------:|:-------:|:-----:|
| View ledger | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Create manual entry | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Void entry | ✓ | ✗ | ✓* | ✗ | ✗ | ✗ |
| Run reconciliation | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |

*auditors can flag entries for void but admin must approve

## Implementation

### Middleware
```javascript
import { protect, authorize } from '../../middleware/auth.js';

// Admin only
router.get('/users', protect, authorize('admin'), controller.getUsers);

// Admin + Supervisor
router.post('/events', protect, authorize('admin', 'supervisor'), controller.createEvent);

// Any authenticated user
router.get('/dashboard', protect, controller.getDashboard);
```

### Frontend
```tsx
import { RoleBasedComponent } from '@/components/role-based-component';

<RoleBasedComponent allowedRoles={['admin', 'supervisor']}>
  <CreateEventButton />
</RoleBasedComponent>
```

## Rules
- Always check permissions at the middleware level (not in controllers)
- `admin` role bypasses all checks (special case in `authorize()`)
- Group-level permissions are checked in the service layer (is user a member?)
- Financial mutations require appropriate role + group membership
