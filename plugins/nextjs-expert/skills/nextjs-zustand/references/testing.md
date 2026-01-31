---
name: testing
description: Testing Zustand stores with React Testing Library, Jest, and Vitest
when-to-use: Writing unit tests for stores and components using Zustand
keywords: testing, RTL, Jest, Vitest, mock, reset, test utils
priority: medium
requires: store-patterns.md
related: typescript.md
---

# Testing Zustand Stores

Patterns for testing stores with React Testing Library, Jest, and Vitest.

## Reset Store Between Tests

```typescript
// modules/cores/stores/__tests__/setup.ts
import { beforeEach } from 'vitest'
import { useCounterStore } from '../counter.store'
import { useUserStore } from '../user.store'

// Store initial states
const initialCounterState = useCounterStore.getState()
const initialUserState = useUserStore.getState()

beforeEach(() => {
  // Reset all stores before each test
  useCounterStore.setState(initialCounterState, true)
  useUserStore.setState(initialUserState, true)
})
```

---

## Testing Store Actions

```typescript
// modules/cores/stores/__tests__/counter.store.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useCounterStore } from '../counter.store'

describe('useCounterStore', () => {
  beforeEach(() => {
    useCounterStore.setState({ count: 0 })
  })

  it('should increment count', () => {
    const { increment } = useCounterStore.getState()

    increment()

    expect(useCounterStore.getState().count).toBe(1)
  })

  it('should decrement count', () => {
    useCounterStore.setState({ count: 5 })
    const { decrement } = useCounterStore.getState()

    decrement()

    expect(useCounterStore.getState().count).toBe(4)
  })

  it('should reset count', () => {
    useCounterStore.setState({ count: 10 })
    const { reset } = useCounterStore.getState()

    reset()

    expect(useCounterStore.getState().count).toBe(0)
  })
})
```

---

## Testing Components with Stores

```typescript
// modules/cores/components/__tests__/Counter.test.tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Counter } from '../Counter'
import { useCounterStore } from '../../stores/counter.store'

describe('Counter Component', () => {
  beforeEach(() => {
    useCounterStore.setState({ count: 0 })
  })

  it('should display current count', () => {
    useCounterStore.setState({ count: 5 })

    render(<Counter />)

    expect(screen.getByText('Count: 5')).toBeInTheDocument()
  })

  it('should increment on button click', async () => {
    render(<Counter />)

    fireEvent.click(screen.getByRole('button', { name: /increment/i }))

    expect(screen.getByText('Count: 1')).toBeInTheDocument()
  })
})
```

---

## Mocking Stores

```typescript
// modules/auth/src/stores/__mocks__/user.store.ts
import { vi } from 'vitest'

export const useUserStore = vi.fn(() => ({
  user: { id: '1', name: 'Test User', email: 'test@example.com' },
  isLoading: false,
  error: null,
  fetchUser: vi.fn(),
  logout: vi.fn(),
}))
```

```typescript
// Usage in test
import { vi, describe, it } from 'vitest'

vi.mock('../stores/user.store')

describe('UserProfile', () => {
  it('should render user name', () => {
    render(<UserProfile />)
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })
})
```

---

## Testing Async Actions

```typescript
// modules/auth/src/stores/__tests__/user.store.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useUserStore } from '../user.store'

// Mock fetch
global.fetch = vi.fn()

describe('useUserStore async actions', () => {
  beforeEach(() => {
    useUserStore.setState({
      user: null,
      isLoading: false,
      error: null,
    })
    vi.clearAllMocks()
  })

  it('should fetch user successfully', async () => {
    const mockUser = { id: '1', name: 'John', email: 'john@example.com' }

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    } as Response)

    const { fetchUser } = useUserStore.getState()
    await fetchUser('1')

    const state = useUserStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('should handle fetch error', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

    const { fetchUser } = useUserStore.getState()
    await fetchUser('1')

    const state = useUserStore.getState()
    expect(state.user).toBeNull()
    expect(state.isLoading).toBe(false)
    expect(state.error).toBe('Network error')
  })
})
```

---

## Vitest Setup

```typescript
// vitest.setup.ts
import '@testing-library/jest-dom/vitest'
import { beforeEach } from 'vitest'

// Reset stores helper
const storeResetFns = new Set<() => void>()

export const registerStoreReset = (resetFn: () => void) => {
  storeResetFns.add(resetFn)
}

beforeEach(() => {
  storeResetFns.forEach((reset) => reset())
})
```

---

## Best Practices

1. **Reset stores** in `beforeEach` to isolate tests
2. **Test actions directly** via `getState()` for unit tests
3. **Mock fetch/API** calls for async action tests
4. **Use RTL** for component integration tests
5. **Avoid testing implementation** - test behavior
