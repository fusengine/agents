---
name: react-testing
description: Testing Library for React - render, screen, userEvent, waitFor. Use when writing tests for React components with Vitest or Jest.
user-invocable: false
---

# React Testing Library

Test React components the way users interact with them.

## Agent Workflow (MANDATORY)

Before ANY implementation, launch in parallel:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing test patterns and setup
2. **fuse-ai-pilot:research-expert** - Verify latest Testing Library docs via Context7/Exa
3. **mcp__context7__query-docs** - Check userEvent, waitFor, and async patterns

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Installation

```bash
bun add -D @testing-library/react @testing-library/user-event @testing-library/jest-dom vitest jsdom
```

## Vitest Configuration

```typescript
// vite.config.ts
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

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom/vitest'
```

---

## Basic Testing

```typescript
// src/components/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    await userEvent.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

---

## Queries

### Priority Order (Recommended)

1. **getByRole** - Most accessible
2. **getByLabelText** - Form inputs
3. **getByPlaceholderText** - Inputs
4. **getByText** - Text content
5. **getByTestId** - Last resort

```typescript
// Accessible queries
screen.getByRole('button', { name: /submit/i })
screen.getByRole('textbox', { name: /email/i })
screen.getByRole('heading', { level: 1 })
screen.getByLabelText(/password/i)

// Text queries
screen.getByText(/welcome/i)
screen.getByPlaceholderText(/search/i)

// Test ID (avoid if possible)
screen.getByTestId('custom-element')
```

### Query Variants

```typescript
// getBy - Throws if not found (sync)
screen.getByRole('button')

// queryBy - Returns null if not found (sync)
screen.queryByRole('button')

// findBy - Returns promise (async)
await screen.findByRole('button')

// getAllBy, queryAllBy, findAllBy - Multiple elements
screen.getAllByRole('listitem')
```

---

## User Events

```typescript
import userEvent from '@testing-library/user-event'

describe('Form', () => {
  it('submits form data', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()
    render(<LoginForm onSubmit={handleSubmit} />)

    // Type in inputs
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')

    // Click submit
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })

  it('shows error on invalid input', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText(/email/i), 'invalid')
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument()
  })
})
```

---

## Async Testing

```typescript
import { render, screen, waitFor } from '@testing-library/react'

describe('UserProfile', () => {
  it('loads and displays user data', async () => {
    render(<UserProfile userId="1" />)

    // Wait for loading to finish
    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    // Wait for data
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  it('shows error on failure', async () => {
    server.use(
      http.get('/api/users/:id', () => {
        return HttpResponse.error()
      })
    )

    render(<UserProfile userId="1" />)

    expect(await screen.findByText(/error loading/i)).toBeInTheDocument()
  })
})
```

---

## Mocking

### Mock Functions

```typescript
const mockFn = vi.fn()
mockFn.mockReturnValue('value')
mockFn.mockResolvedValue('async value')
mockFn.mockImplementation((x) => x * 2)
```

### Mock Modules

```typescript
vi.mock('../services/api', () => ({
  fetchUser: vi.fn().mockResolvedValue({ name: 'John' }),
}))
```

### MSW for API Mocking

```typescript
// src/test/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json({ id: params.id, name: 'John' })
  }),
]
```

---

## Best Practices

1. **Query by role** - Most accessible and robust
2. **Use userEvent** - More realistic than fireEvent
3. **Avoid implementation details** - Test behavior, not internals
4. **Use async utilities** - waitFor, findBy for async
5. **Mock at network level** - Use MSW for API mocking
6. **Write descriptive test names** - Clear intent
