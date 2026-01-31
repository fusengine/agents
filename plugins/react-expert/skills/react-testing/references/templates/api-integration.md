---
name: api-integration
description: API integration tests with MSW handlers
keywords: msw, api, handlers, integration, mock
---

# API Integration Test Template

## MSW Handlers

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse, delay } from 'msw'

export const handlers = [
  // GET list
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' },
    ])
  }),

  // GET single
  http.get('/api/users/:id', ({ params }) => {
    const { id } = params
    if (id === '999') {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json({
      id: Number(id),
      name: 'Alice',
      email: 'alice@example.com',
    })
  }),

  // POST create
  http.post('/api/users', async ({ request }) => {
    const data = await request.json()
    return HttpResponse.json(
      { id: 3, ...data },
      { status: 201 }
    )
  }),

  // PATCH update
  http.patch('/api/users/:id', async ({ params, request }) => {
    const data = await request.json()
    return HttpResponse.json({
      id: Number(params.id),
      ...data,
    })
  }),

  // DELETE
  http.delete('/api/users/:id', () => {
    return new HttpResponse(null, { status: 204 })
  }),
]
```

---

## Integration Test

```typescript
// src/features/__tests__/UserManagement.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { UserManagement } from '../UserManagement'

describe('UserManagement integration', () => {
  it('loads and displays users', async () => {
    render(<UserManagement />)

    await screen.findByText('Alice')
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('creates new user', async () => {
    const user = userEvent.setup()

    render(<UserManagement />)

    // Wait for initial load
    await screen.findByText('Alice')

    // Open form
    await user.click(screen.getByRole('button', { name: /add user/i }))

    // Fill form
    await user.type(screen.getByLabelText(/name/i), 'Charlie')
    await user.type(screen.getByLabelText(/email/i), 'charlie@example.com')

    // Submit
    await user.click(screen.getByRole('button', { name: /save/i }))

    // New user appears
    await screen.findByText('Charlie')
  })

  it('handles server error gracefully', async () => {
    server.use(
      http.get('/api/users', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )

    render(<UserManagement />)

    await screen.findByRole('alert')
    expect(screen.getByText(/error loading users/i)).toBeInTheDocument()
  })

  it('handles slow network', async () => {
    server.use(
      http.get('/api/users', async () => {
        await delay(2000)
        return HttpResponse.json([{ id: 1, name: 'Alice' }])
      })
    )

    render(<UserManagement />)

    // Loading shown during delay
    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    // Eventually loads
    await screen.findByText('Alice', {}, { timeout: 3000 })
  })

  it('deletes user with confirmation', async () => {
    const user = userEvent.setup()

    render(<UserManagement />)

    await screen.findByText('Alice')

    // Click delete
    await user.click(screen.getAllByRole('button', { name: /delete/i })[0])

    // Confirm
    await user.click(screen.getByRole('button', { name: /confirm/i }))

    // User removed
    await waitFor(() => {
      expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    })
  })
})
```

---

## Testing Optimistic Updates

```typescript
it('shows optimistic update then confirms', async () => {
  const user = userEvent.setup()

  render(<TodoList />)

  await user.type(screen.getByRole('textbox'), 'New todo')
  await user.click(screen.getByRole('button', { name: /add/i }))

  // Optimistic: appears immediately
  expect(screen.getByText('New todo')).toBeInTheDocument()
  expect(screen.getByText('Saving...')).toBeInTheDocument()

  // After server confirms
  await waitFor(() => {
    expect(screen.queryByText('Saving...')).not.toBeInTheDocument()
  })
})
```
