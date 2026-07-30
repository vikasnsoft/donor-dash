# Error Catalogue

Every error in Donor Dash has a structured code, HTTP status, and message. AI must use these codes instead of inventing messages.

---

## Auth Errors (AUTH_xxx)

| Code | Status | Message |
|------|--------|---------|
| AUTH_001 | 401 | Invalid email or password |
| AUTH_002 | 401 | Not authorized, no token |
| AUTH_003 | 401 | Not authorized, token failed |
| AUTH_004 | 401 | Token expired. Please log in again |
| AUTH_005 | 400 | User already exists |

## User Errors (USER_xxx)

| Code | Status | Message |
|------|--------|---------|
| USER_001 | 404 | User not found |
| USER_002 | 400 | Can not delete admin user |
| USER_003 | 400 | Invalid role. Must be one of: admin, supervisor, volunteer, auditor, support, guest |
| USER_004 | 403 | Role not authorized to access this resource |

## Donation Errors (DON_xxx)

| Code | Status | Message |
|------|--------|---------|
| DON_001 | 404 | Donation not found |
| DON_002 | 409 | Duplicate receipt number |
| DON_003 | 400 | Donation amount must be positive |
| DON_004 | 400 | Cannot delete donation. Use cancel or refund instead |
| DON_005 | 400 | Donation already cancelled |
| DON_006 | 400 | Cannot refund more than original amount |

## Expense Errors (EXP_xxx)

| Code | Status | Message |
|------|--------|---------|
| EXP_001 | 404 | Expense not found |
| EXP_002 | 400 | Split amounts must sum to total expense amount |
| EXP_003 | 400 | Each split must be assigned to a group member |
| EXP_004 | 400 | Expense already deleted |
| EXP_005 | 403 | Not a member of this group |

## Settlement Errors (SET_xxx)

| Code | Status | Message |
|------|--------|---------|
| SET_001 | 404 | Settlement not found |
| SET_002 | 400 | Settlement amount exceeds owed balance |
| SET_003 | 400 | Cannot settle with yourself |
| SET_004 | 400 | Settlement already confirmed |
| SET_005 | 400 | Settlement already rejected |

## Ledger Errors (LED_xxx)

| Code | Status | Message |
|------|--------|---------|
| LED_001 | 400 | Journal entry must have at least 2 lines |
| LED_002 | 400 | Journal entry is not balanced. Debits: {x}, Credits: {y} |
| LED_003 | 400 | Cannot modify a posted entry. Void and re-create instead |
| LED_004 | 400 | Account not found or inactive |
| LED_005 | 400 | Amount must be positive |
| LED_006 | 404 | Ledger entry not found |
| LED_007 | 400 | Entry already voided |

## Group Errors (GRP_xxx)

| Code | Status | Message |
|------|--------|---------|
| GRP_001 | 404 | Group not found |
| GRP_002 | 400 | User is already a group member |
| GRP_003 | 403 | Not a member of this group |
| GRP_004 | 400 | Cannot remove the last admin |
| GRP_005 | 400 | Invalid invite code |
| GRP_006 | 400 | Group is archived |

## Event Errors (EVT_xxx)

| Code | Status | Message |
|------|--------|---------|
| EVT_001 | 404 | Event not found |
| EVT_002 | 400 | Cannot delete event with existing donations |
| EVT_003 | 400 | Invalid event status transition |
| EVT_004 | 400 | Campaign already completed |

## Donor Errors (DNR_xxx)

| Code | Status | Message |
|------|--------|---------|
| DNR_001 | 404 | Donor not found |
| DNR_002 | 400 | Donor has existing donations and cannot be deleted |
| DNR_003 | 409 | Donor with this phone/email already exists |

## Validation Errors (VAL_xxx)

| Code | Status | Message |
|------|--------|---------|
| VAL_001 | 400 | {field} is required |
| VAL_002 | 400 | {field} must be at least {min} characters |
| VAL_003 | 400 | {field} must be a valid email |
| VAL_004 | 400 | {field} must be a positive number |
| VAL_005 | 400 | Invalid ObjectId format |

## Rate Limit Errors (RAT_xxx)

| Code | Status | Message |
|------|--------|---------|
| RAT_001 | 429 | Too many requests. Please try again later |
