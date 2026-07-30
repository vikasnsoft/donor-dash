# Financial Invariants

These rules are **absolute**. They must never be violated by any code, module, or process.

---

## INV-001: Journal Balance
**Rule**: Every ledger entry must have total debits equal to total credits.
**Enforcement**: Validated before posting. Rejected if `sum(debits) !== sum(credits)`.
**Exception**: None.

## INV-002: Cash Cannot Be Negative
**Rule**: The Cash account balance must never go below zero.
**Enforcement**: Validated before posting cash-out entries.
**Exception**: None. If cash is insufficient, the operation must be rejected.

## INV-003: Receipt Numbers Never Reused
**Rule**: Receipt numbers are unique and permanently assigned.
**Enforcement**: Unique index on `receiptNumber` field.
**Exception**: None. Even cancelled donations retain their receipt number.

## INV-004: Donations Cannot Be Deleted
**Rule**: Donation records are permanent. They can only be cancelled or refunded.
**Enforcement**: No delete endpoint. Status transitions only.
**Exception**: None. Historical integrity requires all donations to be traceable.

## INV-005: Ledger Entries Are Immutable Once Posted
**Rule**: A posted ledger entry cannot be modified. To correct an error, void the entry and create a new one.
**Enforcement**: Pre-update hook rejects modifications to posted entries.
**Exception**: None. Immutability is fundamental to accounting integrity.

## INV-006: Void Entries Must Reference Original
**Rule**: Every void entry must reference the original entry it reverses.
**Enforcement**: Required field on void entries.
**Exception**: None.

## INV-007: Split Amounts Must Sum to Total
**Rule**: For shared expenses, the sum of all split amounts must equal the expense total.
**Enforcement**: Validated before saving. `sum(splits.amount) === expense.amount`.
**Exception**: None.

## INV-008: Settlement Cannot Exceed Owed Amount
**Rule**: A settlement amount cannot be greater than the balance owed between the two parties.
**Enforcement**: Checked against cached Balance before creating settlement.
**Exception**: None.

## INV-009: Amounts Must Be Decimal128
**Rule**: All monetary amounts must use MongoDB Decimal128 type, never floating-point Number.
**Enforcement**: Schema type enforcement.
**Exception**: None. Floating-point causes rounding errors (0.1 + 0.2 ≠ 0.3).

## INV-010: Transactions for Multi-Step Financial Operations
**Rule**: Any operation that writes to 2+ collections must be wrapped in a MongoDB transaction.
**Enforcement**: Code review. Service layer pattern.
**Exception**: None. Partial writes create inconsistent state.

## INV-011: Audit Trail Is Mandatory
**Rule**: Every financial mutation must be recorded in the Audit Log.
**Enforcement**: Audit middleware + manual logging in services.
**Exception**: None.

## INV-012: Currency Consistency Within Group
**Rule**: All expenses and settlements within a group use the group's default currency.
**Enforcement**: Validated on expense/settlement creation.
**Exception**: None. Cross-currency support is a future feature.

## INV-013: Balance Consistency
**Rule**: Cached balances must match what would be calculated from source data.
**Enforcement**: Reconciliation endpoint recalculates and fixes drift.
**Exception**: Temporary drift possible (detected and fixed by reconciliation).

## INV-014: Event Financial Independence
**Rule**: Financial data for one event cannot affect another event's reports.
**Enforcement**: All financial entries scoped to eventId.
**Exception**: None.

## INV-015: Reports Are Derived
**Rule**: Reports are calculated from ledger data, never from business tables directly.
**Enforcement**: Reports module only queries Ledger and materialized aggregates.
**Exception**: None. This ensures single source of truth.

## INV-016: Balance Normalization
**Rule**: Exactly one balance record may exist between any two users in a group. No bidirectional balances.
**Enforcement**: Balance update logic normalizes by netting opposing directions.
**Exception**: None. If Alice owes Bob ₹50 and Bob owes Alice ₹20, only one record exists: Alice → Bob ₹30.
