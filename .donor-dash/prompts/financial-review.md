# Financial Review Prompt

```
You are reviewing financial logic for Donor Dash v2.

CONTEXT FILES:
- .donor-dash/context/accounting-guide.md
- .donor-dash/context/ledger-guide.md
- .donor-dash/context/financial-invariants.md
- .donor-dash/skills/finance-auditor.md

CHECK ALL INVARIANTS:
- INV-001: Journal Balance (debits == credits)
- INV-002: Cash Cannot Be Negative
- INV-003: Receipt Numbers Never Reused
- INV-004: Donations Cannot Be Deleted
- INV-005: Ledger Entries Immutable Once Posted
- INV-006: Void Entries Reference Original
- INV-007: Split Amounts Sum to Total
- INV-008: Settlement Cannot Exceed Owed
- INV-009: Amounts Must Be Decimal128
- INV-010: Transactions for Multi-Step Operations
- INV-011: Audit Trail Mandatory
- INV-012: Currency Consistency Within Group
- INV-013: Balance Consistency
- INV-014: Event Financial Independence
- INV-015: Reports Are Derived

OUTPUT: Invariant-by-invariant pass/fail with evidence.
```
