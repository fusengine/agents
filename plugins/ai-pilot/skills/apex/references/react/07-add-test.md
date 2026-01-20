# 07 - Add Test (React/Vite)

**Write tests with Vitest and Testing Library.**

## When to Use

- After implementation complete
- Before creating PR
- When fixing bugs (TDD approach)

---

## Test Types

### Unit Tests (Hooks, Utils)

```text
Purpose: Test individual hooks/functions
Speed: Fast (<50ms per test)
Location: Co-located with source
```

### Component Tests

```text
Purpose: Test component behavior
Speed: Medium (50-200ms per test)
Location: Co-located with component
```

### Integration Tests

```text
Purpose: Test feature workflows
Speed: Slower (200ms-1s per test)
Location: __tests__/ directory
```

---

## Vitest Setup

### Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
```

### Setup File

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom/vitest'
```

---

## Component Test Template

```typescript
// modules/users/components/UserCard.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserCard } from './UserCard'

const mockUser = { id: '1', name: 'John', email: 'john@test.com' }

describe('UserCard', () => {
  it('should render user information', () => {
    render(<UserCard user={mockUser} />)

    expect(screen.getByText('John')).toBeInTheDocument()
    expect(screen.getByText('john@test.com')).toBeInTheDocument()
  })

  it('should call onEdit when edit clicked', async () => {
    const handleEdit = vi.fn()
    render(<UserCard user={mockUser} onEdit={handleEdit} />)

    await userEvent.click(screen.getByRole('button', { name: /edit/i }))

    expect(handleEdit).toHaveBeenCalledWith('1')
  })

  it('should show loading state', () => {
    render(<UserCard loading />)

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })
})
```

---

## Hook Test Template

```typescript
// modules/users/src/hooks/useUser.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { useUser } from './useUser'

vi.mock('../services/user.service', () => ({
  userService: {
    getById: vi.fn().mockResolvedValue({ id: '1', name: 'John' }),
  },
}))

describe('useUser', () => {
  it('should return user after loading', async () => {
    const { result } = renderHook(() => useUser('1'))

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.user).toEqual({ id: '1', name: 'John' })
  })

  it('should return null for invalid id', async () => {
    vi.mocked(userService.getById).mockResolvedValueOnce(null)

    const { result } = renderHook(() => useUser('invalid'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.user).toBeNull()
  })
})
```

---

## Async Testing

### waitFor Pattern

```typescript
it('should load and display data', async () => {
  render(<UserProfile userId="1" />)

  // Wait for loading to finish
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })

  expect(screen.getByText('John')).toBeInTheDocument()
})
```

### findBy Queries

```typescript
it('should show user after fetch', async () => {
  render(<UserProfile userId="1" />)

  // findBy waits automatically
  const name = await screen.findByText('John')
  expect(name).toBeInTheDocument()
})
```

---

## Mocking

### Mock Functions

```typescript
const mockFn = vi.fn()
mockFn.mockReturnValue('value')
mockFn.mockResolvedValue('async value')
```

### Mock Modules

```typescript
vi.mock('../services/api', () => ({
  fetchUser: vi.fn().mockResolvedValue({ id: 1, name: 'Test' }),
}))
```

### Reset Between Tests

```typescript
beforeEach(() => {
  vi.clearAllMocks()
})
```

---

## Query Priority

```text
1. getByRole     - Most accessible
2. getByLabelText - Form inputs
3. getByText     - Visible text
4. getByTestId   - Last resort only
```

---

## Test Checklist

```text
[ ] Unit tests for hooks
[ ] Component tests for UI
[ ] Happy path covered
[ ] Error cases covered
[ ] Loading states tested
[ ] User interactions tested
[ ] Mocks properly reset
[ ] No flaky tests
```

---

## Next Phase

-> Proceed to `08-check-test.md` (run tests)
