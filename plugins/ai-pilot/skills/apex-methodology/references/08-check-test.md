---
name: 08-check-test
description: Run and verify all tests pass
prev_step: references/07-add-test.md
next_step: references/09-create-pr.md
---

# 08 - Check Test

**Run and verify all tests pass.**

## When to Use

- After writing new tests
- Before creating PR
- After any code changes

---

## Run Tests (Language-Specific)

### Commands by Language

| Language | Run All | Run Single | Coverage |
| --- | --- | --- | --- |
| TypeScript | `npm test` | `npm test -- file.test.ts` | `npm test -- --coverage` |
| PHP | `php artisan test` | `php artisan test --filter=TestName` | `php artisan test --coverage` |
| Python | `pytest` | `pytest test_file.py` | `pytest --cov` |
| Swift | `swift test` | `swift test --filter TestClass` | `swift test --enable-code-coverage` |
| Go | `go test ./...` | `go test -run TestName` | `go test -cover ./...` |
| Rust | `cargo test` | `cargo test test_name` | `cargo tarpaulin` |

---

## Test Execution Workflow

### Step 1: Run All Tests

```text
1. Execute full test suite
2. Wait for completion
3. Check for failures
```

### Step 2: Analyze Failures

```text
If tests fail:
1. Read error message carefully
2. Identify failing test
3. Check assertion that failed
4. Debug the issue
```

### Step 3: Fix and Re-run

```text
1. Fix the bug or test
2. Run failed test only (faster)
3. Run full suite again
4. Repeat until all pass
```

---

## Interpreting Results

### Success Output

```text
✅ All tests passed
✅ No warnings
✅ Coverage meets targets

Example:
Tests: 42 passed, 42 total
Time: 2.5s
Coverage: 85%
```

### Failure Output

```text
❌ Test failed: test_name
   Expected: X
   Received: Y

Analysis:
1. What was expected?
2. What was received?
3. Is the test wrong or the code?
```

---

## Common Failure Patterns

### Assertion Failures

```text
Problem: Expected value doesn't match
Causes:
- Bug in implementation
- Outdated test expectations
- Edge case not handled

Fix: Update code or test based on correct behavior
```

### Timeout Failures

```text
Problem: Test takes too long
Causes:
- Async operation not awaited
- Infinite loop
- Missing mock for slow operation

Fix: Add proper async handling or mocks
```

### Setup Failures

```text
Problem: Test crashes before assertions
Causes:
- Missing dependencies
- Incorrect mock setup
- Database/service not available

Fix: Check beforeEach/setup, verify mocks
```

### Flaky Tests

```text
Problem: Test passes sometimes, fails others
Causes:
- Race conditions
- Time-dependent logic
- Shared state between tests

Fix: Isolate tests, mock time, remove shared state
```

---

## Coverage Analysis

### Reading Coverage Reports

```text
Statements: Lines of code executed
Branches: if/else paths taken
Functions: Functions called
Lines: Physical lines executed
```

### Coverage Targets

| Metric | Minimum | Ideal |
| --- | --- | --- |
| Statements | 80% | 90%+ |
| Branches | 75% | 85%+ |
| Functions | 80% | 90%+ |
| Lines | 80% | 90%+ |

### Improving Coverage

```text
1. Identify uncovered code in report
2. Write tests for missing paths
3. Focus on critical business logic
4. Don't chase 100% blindly
```

---

## CI/CD Integration

### Simulate CI Locally

```text
Run the same commands CI will run:
1. Install dependencies
2. Run linters
3. Run type checks
4. Run tests with coverage
5. Build project
```

### Pre-push Verification

```text
Before pushing:
□ All tests pass locally
□ Coverage meets minimum
□ No flaky tests
□ Build succeeds
```

---

## Debug Strategies

### Isolate Failing Test

```text
1. Run single test in isolation
2. Add debug output/breakpoints
3. Check test data setup
4. Verify mock configuration
```

### Common Debug Steps

```text
1. Print/log intermediate values
2. Check mock call counts
3. Verify async timing
4. Compare expected vs actual types
```

---

## Test Performance

### Speed Guidelines

```text
Unit tests: <100ms each
Integration tests: <1s each
E2E tests: <10s each
Full suite: <5 minutes
```

### Optimization Tips

```text
✅ Mock slow operations
✅ Run tests in parallel
✅ Use test database in memory
✅ Skip E2E in watch mode
❌ Don't hit real APIs
❌ Don't use real file system
```

---

## Test Checklist

```text
□ All tests pass
□ No skipped tests (unless documented)
□ No flaky tests
□ Coverage meets targets
□ New code is tested
□ Edge cases covered
□ CI simulation passes
```

---

## Next Phase

→ Proceed to `05-review.md` (self-review)
