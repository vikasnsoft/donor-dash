# ADR-0004: Cached Balances with Reconciliation

## Status
Accepted

## Context
Group balances need to be displayed frequently (dashboard, group page). Recalculating from all expenses and settlements every time is expensive.

## Decision
Use **cached balance documents** updated in the same MongoDB transaction as the source data, with a reconciliation endpoint for drift detection.

- Write path: Update `Balance` collection in same transaction as expense/settlement
- Read path: Read directly from `Balance` collection (O(1))
- Reconciliation: Periodic job recalculates all balances from source data and fixes drift

## Consequences
**Positive:**
- O(1) balance reads (fast dashboard)
- Always consistent within a transaction
- Reconciliation catches any drift

**Negative:**
- Extra write per transaction
- Must handle concurrent updates carefully
- Balance document becomes a write hotspot for large groups

## Alternatives Considered
- **Real-time aggregation**: Always accurate but slow reads
- **Periodic batch**: Simple but stale data
