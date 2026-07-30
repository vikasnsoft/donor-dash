# Write Tests Prompt

```
You are writing tests for Donor Dash v2.

CONTEXT FILES:
- .donor-dash/context/testing-guide.md
- .donor-dash/context/testing-recipes.md

TEST TYPES:
1. Unit: Test service functions in isolation (mock models)
2. Integration: Test HTTP endpoints with test database
3. Financial: 100% coverage for all financial logic

NAMING:
describe('ServiceName', () => {
  describe('methodName', () => {
    it('should [expected] when [condition]', () => {});
  });
});

COVERAGE TARGETS:
- Services: 90%+
- Controllers: 80%+
- Financial logic: 100%
- Validators: 95%+

FINANCIAL TEST REQUIREMENTS:
- Ledger entries balance
- Balance calculations correct
- Transactions roll back on error
- Void entries reverse correctly
```
