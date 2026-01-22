---
name: 08-check-test
description: Run and verify all Next.js tests pass
prev_step: references/nextjs/07-add-test.md
next_step: references/nextjs/09-create-pr.md
---

# 08 - Check Test (Next.js)

**Run and verify all tests pass.**

## When to Use

- After adding/modifying tests
- Before creating PR
- After any code change

---

## Run All Tests

### Unit Tests (Vitest)

```bash
# Run all tests
pnpm test

# Run with verbose output
pnpm test --reporter=verbose

# Run specific file
pnpm test modules/users/components/UserList.test.tsx

# Run tests matching pattern
pnpm test --testNamePattern="should render"
```

### Watch Mode (Development)

```bash
# Watch mode for TDD
pnpm test --watch

# Watch specific file
pnpm test --watch modules/users/
```

### Coverage Report

```bash
# Generate coverage report
pnpm test --coverage

# Expected output:
# -------------------------|---------|----------|---------|---------|
# File                     | % Stmts | % Branch | % Funcs | % Lines |
# -------------------------|---------|----------|---------|---------|
# All files                |   85.12 |    78.45 |   82.33 |   85.12 |
```

---

## E2E Tests (Playwright)

### Run E2E Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run in headed mode (see browser)
pnpm test:e2e --headed

# Run specific test file
pnpm test:e2e tests/e2e/auth.spec.ts

# Run with UI mode
pnpm test:e2e --ui
```

### Debug E2E Tests

```bash
# Debug mode
pnpm test:e2e --debug

# Generate trace on failure
pnpm test:e2e --trace on
```

---

## CI Simulation

### Run Full Test Suite

```bash
# Simulate CI locally
pnpm tsc --noEmit && \
pnpm eslint . && \
pnpm test --run && \
pnpm test:e2e && \
pnpm build
```

### Expected CI Output

```text
TypeScript: PASS (0 errors)
ESLint: PASS (0 errors, 0 warnings)
Unit Tests: PASS (45 tests, 0 failures)
E2E Tests: PASS (12 tests, 0 failures)
Build: PASS (compiled successfully)
```

---

## Troubleshooting

### Common Test Failures

#### Timeout Errors

```typescript
// Increase timeout for slow tests
test('slow async operation', async () => {
  // ...
}, { timeout: 10000 }) // 10 seconds
```

#### React Testing Library Issues

```typescript
// Wait for async updates
import { waitFor } from '@testing-library/react'

await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})
```

#### Mock Not Working

```typescript
// Ensure mock is before import
vi.mock('../src/services/user.service')

// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks()
})
```

---

## Test Results Analysis

### Passing Tests

```text
PASS  modules/users/components/UserList.test.tsx
  UserList
    should render list of users
    should show empty message when no users

Test Files  1 passed (1)
Tests       2 passed (2)
Duration    0.85s
```

### Failing Tests

```text
FAIL  modules/auth/components/LoginForm.test.tsx
  LoginForm
    should submit form with credentials

    Error: Unable to find element with text: /submit/i
      at getByRole (/path/to/file.tsx:15:10)

Fix: Check that button text matches test selector
```

---

## Coverage Thresholds

### Required Thresholds

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
  },
})
```

### Coverage Report

```text
Target Thresholds:
[ ] Statements: 80% (actual: 85%)
[ ] Branches: 75% (actual: 78%)
[ ] Functions: 80% (actual: 82%)
[ ] Lines: 80% (actual: 85%)
```

---

## Test Validation Checklist

```text
Unit Tests:
[ ] All tests pass
[ ] No skipped tests (.skip)
[ ] No focused tests (.only)
[ ] Coverage thresholds met

E2E Tests:
[ ] All tests pass
[ ] No flaky tests
[ ] Tests run in reasonable time

Quality:
[ ] Tests are deterministic
[ ] Mocks properly reset
[ ] No console errors/warnings
[ ] CI simulation passes
```

---

## Next Phase

Proceed to `09-create-pr.md`
