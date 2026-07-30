# ADR-0001: MongoDB over PostgreSQL

## Status
Accepted

## Context
Donor Dash needs a database that supports:
- Flexible schemas (different event types have different data)
- Rapid iteration (schema changes without migrations)
- Document-based storage (events, donors, expenses are natural documents)
- Embedded subdocuments (splits within expenses, members within groups)

We also need financial data integrity for the accounting module.

## Decision
Use **MongoDB** as the primary database, with Mongoose ODM for schema enforcement.

For financial data integrity:
- Use MongoDB transactions (replica set required in production)
- Use Decimal128 for all monetary amounts
- Implement reconciliation endpoints to detect drift

## Consequences
**Positive:**
- Flexible schema allows rapid prototyping
- Natural fit for document-shaped data (events, donors, expenses)
- Mongoose provides schema validation when needed
- Transactions provide ACID for financial operations

**Negative:**
- No built-in referential integrity (enforced in application code)
- Transactions require replica set (more complex deployment)
- Aggregation pipeline is more complex than SQL for reports
- Decimal128 requires explicit conversion in application code

## Alternatives Considered
- **PostgreSQL**: Strong ACID, SQL for reports, but rigid schema slows iteration
- **Hybrid (MongoDB + PostgreSQL)**: MongoDB for app data, PostgreSQL for ledger. Adds complexity of two databases and sync issues.

## Future Consideration
If reporting complexity becomes painful, consider adding PostgreSQL as a read replica for the ledger/reporting module.
