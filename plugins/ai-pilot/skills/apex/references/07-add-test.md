# 07 - Add Test

**Write tests for implemented features.**

## When to Use

- After implementation complete
- Before creating PR
- When fixing bugs (TDD approach)

---

## Test Types

### Unit Tests

```text
Purpose: Test individual functions/components
Scope: Single unit in isolation
Speed: Fast (<100ms per test)
Mocks: External dependencies mocked
```

### Integration Tests

```text
Purpose: Test multiple units together
Scope: Feature workflows
Speed: Medium (100ms-1s per test)
Mocks: External services only
```

### E2E Tests

```text
Purpose: Test full user flows
Scope: Entire application
Speed: Slow (seconds per test)
Mocks: Minimal (real services when possible)
```

---

## Test Structure

### AAA Pattern (Universal)

```text
describe: Feature or component name
  describe: Function or method name
    it: "should [behavior] when [condition]"

      // Arrange: Set up test data
      input = create_test_data()

      // Act: Execute code under test
      result = function_to_test(input)

      // Assert: Verify result
      assert result == expected_value
```

### Naming Convention

```text
describe: Feature or function name
it: "should [do something] when [condition]"

Examples:
✅ "should return user when valid ID provided"
✅ "should throw error when ID is missing"
✅ "should render loading state while fetching"

❌ "test user function"
❌ "it works"
❌ "handles error"
```

---

## Test Coverage

### What to Test

```text
✅ Happy path (normal use case)
✅ Edge cases (empty, null, max values)
✅ Error cases (invalid input, failures)
✅ Boundary conditions (min/max limits)
✅ State transitions (before/after)
```

### Coverage Targets

| Type | Target |
| --- | --- |
| Statements | >80% |
| Branches | >75% |
| Functions | >80% |
| Lines | >80% |

### What NOT to Test

```text
❌ Implementation details (HOW it works)
❌ Third-party library internals
❌ Trivial getters/setters
❌ Framework code
❌ Type definitions only
```

---

## Testing Frameworks (Language-Specific)

| Language | Unit Test | Integration | E2E |
| --- | --- | --- | --- |
| TypeScript | Vitest/Jest | Vitest | Playwright |
| PHP | Pest/PHPUnit | Pest | Laravel Dusk |
| Python | pytest | pytest | Playwright |
| Swift | XCTest/Swift Testing | XCTest | XCUITest |
| Go | testing | testing | testify |
| Rust | cargo test | cargo test | - |

---

## Test File Structure

### Co-located Tests (Recommended)

```text
src/
├── components/
│   ├── Button.[ext]
│   └── Button.test.[ext]    # Co-located
├── utils/
│   ├── validation.[ext]
│   └── validation.test.[ext]
└── __tests__/               # Integration tests
    └── auth-flow.test.[ext]
```

### Separate Tests Folder

```text
src/
├── components/
│   └── Button.[ext]
tests/
├── unit/
│   └── Button.test.[ext]
└── integration/
    └── auth-flow.test.[ext]
```

---

## Mocking Principles

### What to Mock

```text
✅ External API calls
✅ Database connections
✅ File system operations
✅ Time/Date functions
✅ Random number generators
```

### What NOT to Mock

```text
❌ The code under test
❌ Simple data structures
❌ Pure functions with no side effects
❌ Internal implementation details
```

### Mock Patterns

```text
1. Stub: Returns fixed data
2. Spy: Records calls, passes through
3. Mock: Verifies interactions
4. Fake: Simplified implementation
```

---

## Test Best Practices

### DRY but Readable

```text
✅ Extract common setup to beforeEach
✅ Use factory functions for test data
✅ Keep assertions focused
❌ Don't over-abstract (tests should be readable)
```

### Independent Tests

```text
✅ Each test runs in isolation
✅ No shared mutable state
✅ Order doesn't matter
✅ Clean up after each test
```

### Fast Tests

```text
✅ Mock slow operations
✅ Avoid unnecessary setup
✅ Parallelize when possible
❌ Don't test network in unit tests
```

---

## Test Checklist

```text
□ Unit tests for new functions
□ Component tests for new components
□ Happy path covered
□ Error cases covered
□ Edge cases covered
□ Mocks properly set up
□ Tests run locally
□ Coverage targets met
□ No flaky tests
```

---

## Next Phase

→ Proceed to `08-check-test.md` (run tests)
