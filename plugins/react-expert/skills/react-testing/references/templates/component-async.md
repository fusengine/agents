---
name: component-async
description: Async component tests with loading, error, success states
keywords: async, loading, error, waitFor, findBy, msw
---

# Async Component Test Template

## Loading → Success Pattern

```typescript
// src/components/__tests__/UserList.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { UserList } from '../UserList'

describe('UserList', () => {
  it('shows loading then users', async () => {
    render(<UserList />)

    // Loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    // Wait for data
    await screen.findByText('Alice')

    // Loading gone
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()

    // Users displayed
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })
})
```

---

## Loading → Error Pattern

```typescript
// src/components/__tests__/UserList.test.tsx
import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { UserList } from '../UserList'

describe('UserList error handling', () => {
  it('shows error on API failure', async () => {
    // Override handler for this test
    server.use(
      http.get('/api/users', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )

    render(<UserList />)

    // Loading first
    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    // Error appears
    await screen.findByRole('alert')

    expect(screen.getByText(/error/i)).toBeInTheDocument()
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
  })

  it('shows not found message for empty list', async () => {
    server.use(
      http.get('/api/users', () => {
        return HttpResponse.json([])
      })
    )

    render(<UserList />)

    await screen.findByText(/no users found/i)
  })
})
```

---

## waitForElementToBeRemoved

```typescript
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'

it('waits for loading to finish', async () => {
  render(<UserList />)

  // Wait for loading to disappear
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))

  // Now assert on content
  expect(screen.getByText('Alice')).toBeInTheDocument()
})
```

---

## Multiple Assertions with waitFor

```typescript
import { render, screen, waitFor } from '@testing-library/react'

it('loads complete user profile', async () => {
  render(<UserProfile userId="1" />)

  await waitFor(() => {
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('src')
  })
})
```

---

## Retry Button After Error

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'

it('retries after error', async () => {
  const user = userEvent.setup()
  let callCount = 0

  server.use(
    http.get('/api/users', () => {
      callCount++
      if (callCount === 1) {
        return new HttpResponse(null, { status: 500 })
      }
      return HttpResponse.json([{ id: 1, name: 'Alice' }])
    })
  )

  render(<UserList />)

  // First call fails
  await screen.findByRole('alert')

  // Click retry
  await user.click(screen.getByRole('button', { name: /retry/i }))

  // Second call succeeds
  await screen.findByText('Alice')
})
```
