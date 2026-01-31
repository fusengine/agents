---
name: hook-basic
description: Custom hook tests with renderHook
keywords: hook, renderHook, act, wrapper, context
---

# Hook Testing Template

## Basic Hook Test

```typescript
// src/hooks/__tests__/useCounter.test.ts
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useCounter } from '../useCounter'

describe('useCounter', () => {
  it('starts with initial value', () => {
    const { result } = renderHook(() => useCounter(10))

    expect(result.current.count).toBe(10)
  })

  it('increments count', () => {
    const { result } = renderHook(() => useCounter(0))

    act(() => {
      result.current.increment()
    })

    expect(result.current.count).toBe(1)
  })

  it('decrements count', () => {
    const { result } = renderHook(() => useCounter(5))

    act(() => {
      result.current.decrement()
    })

    expect(result.current.count).toBe(4)
  })

  it('resets to initial value', () => {
    const { result } = renderHook(() => useCounter(10))

    act(() => {
      result.current.increment()
      result.current.increment()
      result.current.reset()
    })

    expect(result.current.count).toBe(10)
  })
})
```

---

## Hook with Context

```typescript
// src/hooks/__tests__/useTheme.test.tsx
import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { useTheme } from '../useTheme'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider defaultTheme="dark">
    {children}
  </ThemeProvider>
)

describe('useTheme', () => {
  it('returns theme from context', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })

    expect(result.current.theme).toBe('dark')
  })

  it('toggles theme', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('light')
  })
})
```

---

## Async Hook Test

```typescript
// src/hooks/__tests__/useFetch.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useFetch } from '../useFetch'

describe('useFetch', () => {
  it('returns loading initially', () => {
    const { result } = renderHook(() => useFetch('/api/users'))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()
  })

  it('returns data after fetch', async () => {
    const { result } = renderHook(() => useFetch('/api/users'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toEqual([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ])
  })

  it('returns error on failure', async () => {
    const { result } = renderHook(() => useFetch('/api/invalid'))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
  })
})
```

---

## Hook with TanStack Query

```typescript
// src/hooks/__tests__/useUsers.test.tsx
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useUsers } from '../useUsers'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
)

describe('useUsers', () => {
  beforeEach(() => {
    queryClient.clear()
  })

  it('fetches users', async () => {
    const { result } = renderHook(() => useUsers(), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toHaveLength(2)
  })
})
```
