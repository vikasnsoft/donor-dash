# ADR-0005: Greedy Netting for Debt Simplification

## Status
Accepted

## Context
When multiple group members owe each other, we need to simplify the debts to minimize the number of transactions.

## Decision
Use the **greedy netting algorithm** (same as Splitwise):

1. Compute net balance for each person (total owed - total owing)
2. Separate into debtors (negative) and creditors (positive)
3. Sort both by absolute amount descending
4. Greedily match largest debtor with largest creditor, settle the min amount
5. Repeat until all balances are zero

Time complexity: O(n log n)

## Consequences
**Positive:**
- Simple to implement and understand
- Results are very close to optimal for typical group sizes (< 20 people)
- O(n log n) is fast enough for all practical purposes

**Negative:**
- Not mathematically optimal (min-cost flow would be)
- For very large groups (> 100), may not find the absolute minimum

## Alternatives Considered
- **Min-cost flow optimization**: Mathematically optimal but overkill for typical group sizes
- **No simplification**: Users figure it out themselves (bad UX)
