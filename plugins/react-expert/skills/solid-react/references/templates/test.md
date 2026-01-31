---
name: test-template
description: Vitest + Testing Library test templates
---

# Test Templates (Vitest + Testing Library)

## Component Test

```typescript
// modules/users/components/__tests__/UserCard.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { UserCard } from '../UserCard'

const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: null,
  role: 'user' as const,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
}

describe('UserCard', () => {
  it('renders user information', () => {
    render(<UserCard user={mockUser} onEdit={vi.fn()} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()

    render(<UserCard user={mockUser} onEdit={onEdit} />)

    await user.click(screen.getByRole('button', { name: /edit/i }))

    expect(onEdit).toHaveBeenCalledWith('1')
  })
})
```

---

## Hook Test

```typescript
// modules/users/src/hooks/__tests__/useUser.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi } from 'vitest'
import { useUser } from '../useUser'
import { userService } from '../../services/user.service'

vi.mock('../../services/user.service')

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useUser', () => {
  it('fetches user data', async () => {
    const mockUser = { id: '1', name: 'John' }
    vi.mocked(userService.getById).mockResolvedValue(mockUser)

    const { result } = renderHook(() => useUser('1'), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockUser)
  })

  it('handles error', async () => {
    vi.mocked(userService.getById).mockRejectedValue(new Error('Not found'))

    const { result } = renderHook(() => useUser('999'), { wrapper })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
```

---

## Service Test

```typescript
// modules/users/src/services/__tests__/user.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createUserService } from '../user.service'
import type { HttpClient } from '@/modules/cores/interfaces/http.interface'

const mockClient: HttpClient = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn()
}

describe('userService', () => {
  const service = createUserService(mockClient)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getById calls correct endpoint', async () => {
    const mockUser = { id: '1', name: 'John' }
    vi.mocked(mockClient.get).mockResolvedValue(mockUser)

    const result = await service.getById('1')

    expect(mockClient.get).toHaveBeenCalledWith('/users/1')
    expect(result).toEqual(mockUser)
  })

  it('create sends correct data', async () => {
    const input = { name: 'John', email: 'john@test.com', password: 'pass123' }
    vi.mocked(mockClient.post).mockResolvedValue({ id: '1', ...input })

    await service.create(input)

    expect(mockClient.post).toHaveBeenCalledWith('/users', input)
  })
})
```

---

## Store Test

```typescript
// modules/users/src/stores/__tests__/user.store.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useUserStore } from '../user.store'

describe('useUserStore', () => {
  beforeEach(() => {
    useUserStore.setState({ user: null })
  })

  it('sets user', () => {
    const mockUser = { id: '1', name: 'John' }

    useUserStore.getState().setUser(mockUser)

    expect(useUserStore.getState().user).toEqual(mockUser)
  })

  it('clears user', () => {
    useUserStore.setState({ user: { id: '1', name: 'John' } })

    useUserStore.getState().clear()

    expect(useUserStore.getState().user).toBeNull()
  })
})
```

---

## Validator Test

```typescript
// modules/users/src/validators/__tests__/user.validator.test.ts
import { describe, it, expect } from 'vitest'
import { createUserSchema } from '../user.validator'

describe('createUserSchema', () => {
  it('validates correct input', () => {
    const input = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    }

    const result = createUserSchema.safeParse(input)

    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const input = {
      name: 'John',
      email: 'invalid-email',
      password: 'password123'
    }

    const result = createUserSchema.safeParse(input)

    expect(result.success).toBe(false)
  })
})
```

---

## Test Setup

```typescript
// vitest.setup.ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true
  }
})
```
