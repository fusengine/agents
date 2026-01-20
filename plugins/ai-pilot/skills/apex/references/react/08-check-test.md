# 08 - Check Test (React/Vite)

**Run and verify all Vitest tests pass.**

## When to Use

- After writing tests
- Before creating PR
- After any code changes
- As part of CI verification

---

## Run Tests

### Full Test Suite

```bash
# Vitest
bun run test
bun vitest

# With UI
bun vitest --ui
```

### Watch Mode (Development)

```bash
bun vitest --watch
```

### Specific Tests

```bash
# Single file
bun vitest UserCard.test.tsx

# Pattern matching
bun vitest -t "should render"

# Specific directory
bun vitest modules/users/
```

---

## Coverage Report

### Generate Coverage

```bash
bun vitest --coverage
```

### Coverage Thresholds

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
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

### Read Report

```text
----------------------|---------|----------|---------|---------|
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
components/UserCard   |   95.0  |   90.0   |  100.0  |   95.0  |
hooks/useUser         |   88.0  |   75.0   |  100.0  |   88.0  |
----------------------|---------|----------|---------|---------|
```

---

## Analyze Failures

### Read Test Output

```text
FAIL  modules/users/components/UserCard.test.tsx
  UserCard
    x should call onEdit when clicked

  expect(spy).toHaveBeenCalledTimes(expected)

  Expected: 1
  Received: 0

    12 |   await userEvent.click(button)
  > 13 |   expect(handleEdit).toHaveBeenCalledTimes(1)
```

### Common Failure Patterns

| Pattern | Likely Cause | Fix |
| --- | --- | --- |
| `received: undefined` | Missing await | Add await |
| `not.toBeInTheDocument` | Element not rendered | Check conditions |
| `toHaveBeenCalled: 0` | Event not firing | Check handler |
| `timeout` | Async not awaited | Use waitFor |

---

## Debug Strategies

### screen.debug()

```typescript
it('should render', () => {
  render(<Component />)
  screen.debug() // Prints DOM to console
  expect(screen.getByRole('button')).toBeInTheDocument()
})
```

### logRoles

```typescript
import { logRoles } from '@testing-library/react'

it('should have button', () => {
  const { container } = render(<Component />)
  logRoles(container) // Shows all roles
})
```

### Increase Timeout

```typescript
it('should load data', async () => {
  // ...
}, 10000) // 10 second timeout
```

---

## Flaky Test Detection

### Signs

```text
- Passes locally, fails in CI
- Fails randomly
- Depends on test order
- Uses real timers/network
```

### Fixes

```typescript
// Use fake timers
beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

// Properly await async
await waitFor(() => {
  expect(element).toBeInTheDocument()
})

// Isolate test state
beforeEach(() => {
  vi.clearAllMocks()
})
```

---

## CI Simulation

```bash
# Run what CI will run
bun run lint
bun run tsc --noEmit
bun run test
bun run build
```

---

## Test Report Summary

```markdown
## Test Results

### Summary
- Total: 45 tests
- Passed: 44
- Failed: 1
- Duration: 3.2s

### Coverage
- Statements: 87.5%
- Branches: 82.1%
- Functions: 91.0%
- Lines: 87.5%

### Failed Tests
1. UserCard.test.tsx - onClick not called
```

---

## Test Checklist

```text
[ ] Full test suite runs
[ ] All tests pass
[ ] No flaky tests
[ ] Coverage meets thresholds
[ ] New code has tests
[ ] No skipped tests
[ ] Performance acceptable
```

---

## Next Phase

-> If tests fail: `06-fix-issue.md`
-> If tests pass: `09-create-pr.md`
