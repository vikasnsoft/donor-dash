# Groups Module

## Purpose
Manage expense groups — collections of Users who share expenses.

## Public API
```
GET    /api/groups                — List user's groups
POST   /api/groups                — Create group
GET    /api/groups/:id            — Get group detail
PUT    /api/groups/:id            — Update group
DELETE /api/groups/:id            — Archive group
POST   /api/groups/:id/members    — Add member
DELETE /api/groups/:id/members/:uid — Remove member
POST   /api/groups/:id/invite     — Generate invite code
POST   /api/groups/join/:code     — Join via invite code
```

## Domain Events
- `group.created` — New group formed
- `group.member.added` — User joined group
- `group.member.removed` — User left group
- `group.archived` — Group archived

## Dependencies
- Users module (for member references)

## Owned Models
- `Group`

## Forbidden Imports
- Cannot import from Expenses, Settlements, or Ledger modules

## Responsibilities
- Group CRUD
- Member management (add/remove)
- Invite code generation
- Group membership validation (exported for Expenses module)

## Exported Services
```javascript
isMember(groupId, userId)  // Check if user is a group member
getGroupMembers(groupId)   // Get all members of a group
```

## Testing Rules
- Unit test: CRUD, member management, invite codes
- Integration test: membership validation, invite flow
- Security test: only members can see group, only admins can manage
