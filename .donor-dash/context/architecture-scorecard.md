# Architecture Scorecard

Use this scorecard to evaluate any feature, PR, or module change. Rate each dimension 1-10.

---

## Dimensions

### Architecture (weight: 20%)
| Score | Criteria |
|-------|----------|
| 10 | Module boundaries respected, clean dependency direction, domain events for cross-module |
| 8 | Minor boundary issue but easily fixable |
| 6 | Some coupling between modules but functional |
| 4 | Significant coupling, hard to refactor |
| 2 | Direct module imports, circular dependencies |

### Security (weight: 15%)
| Score | Criteria |
|-------|----------|
| 10 | Auth + authz on all routes, input validation, no PII leaks, audit trail |
| 8 | Minor gap (e.g., missing rate limit on one endpoint) |
| 6 | Some endpoints missing auth or validation |
| 4 | Multiple security gaps |
| 2 | No auth, no validation, PII exposed |

### Performance (weight: 10%)
| Score | Criteria |
|-------|----------|
| 10 | Proper indexes, projections, pagination, no N+1 |
| 8 | Minor optimization possible |
| 6 | Some N+1 queries or missing indexes |
| 4 | Multiple performance issues |
| 2 | No indexes, no pagination, N+1 everywhere |

### Financial Integrity (weight: 20%)
| Score | Criteria |
|-------|----------|
| 10 | All invariants satisfied, transactions, balanced ledger, audit trail |
| 8 | Minor gap (e.g., missing audit log for one operation) |
| 6 | Some operations not in transactions |
| 4 | Ledger entries not balanced, missing transactions |
| 2 | No ledger integration, floating-point amounts |

### Code Quality (weight: 10%)
| Score | Criteria |
|-------|----------|
| 10 | Clean code, proper naming, thin controllers, no `any` |
| 8 | Minor style issues |
| 6 | Some business logic in controllers |
| 4 | Significant code smell, duplication |
| 2 | Spaghetti code, no separation of concerns |

### Testing (weight: 10%)
| Score | Criteria |
|-------|----------|
| 10 | Full coverage, unit + integration, edge cases, financial tests |
| 8 | Missing some edge cases |
| 6 | Basic happy path only |
| 4 | Minimal tests |
| 2 | No tests |

### Accessibility (weight: 5%)
| Score | Criteria |
|-------|----------|
| 10 | Keyboard nav, ARIA labels, contrast ratios, screen reader support |
| 8 | Minor ARIA gap |
| 6 | Some interactive elements not keyboard accessible |
| 4 | Multiple accessibility issues |
| 2 | No accessibility consideration |

### Documentation (weight: 10%)
| Score | Criteria |
|-------|----------|
| 10 | Swagger updated, module contract updated, ADR if needed, progress tracker |
| 8 | Minor doc gap |
| 6 | Swagger outdated |
| 4 | No documentation updates |
| 2 | Documentation completely missing |

---

## Usage

```markdown
## Scorecard: [Feature Name]

| Dimension | Score | Notes |
|-----------|------:|-------|
| Architecture | 9/10 | Clean module boundaries |
| Security | 10/10 | Full auth + validation |
| Performance | 8/10 | Missing index on donor search |
| Financial Integrity | 10/10 | All invariants satisfied |
| Code Quality | 9/10 | Clean service layer |
| Testing | 8/10 | Missing edge case for zero-amount |
| Accessibility | 9/10 | Good keyboard support |
| Documentation | 9/10 | Swagger updated |

**Weighted Score: 9.3/10**
**Verdict: PASS**
```

## Scoring Thresholds
- **9.0+**: Excellent. Ship it.
- **8.0-8.9**: Good. Minor improvements noted.
- **7.0-7.9**: Acceptable. Address medium issues.
- **6.0-6.9**: Needs work. Fix before merging.
- **Below 6.0**: Reject. Major rework needed.
