---
name: suspense-testing
description: Testing Suspense boundaries and React 19 use() hook
keywords: suspense, use, promise, fallback, loading
---

# Suspense Testing Template

## Basic Suspense Test

```typescript
// src/components/__tests__/AsyncUser.test.tsx
import { render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { describe, it, expect } from 'vitest'
import { AsyncUser } from '../AsyncUser'

describe('AsyncUser with Suspense', () => {
  it('shows fallback then content', async () => {
    const userPromise = Promise.resolve({
      id: 1,
      name: 'Alice',
      email: 'alice@example.com',
    })

    render(
      <Suspense fallback={<div>Loading user...</div>}>
        <AsyncUser userPromise={userPromise} />
      </Suspense>
    )

    // Fallback shown initially
    expect(screen.getByText('Loading user...')).toBeInTheDocument()

    // Content appears after resolution
    await screen.findByText('Alice')

    // Fallback gone
    expect(screen.queryByText('Loading user...')).not.toBeInTheDocument()
  })
})
```

---

## Testing use() Hook with Promise

```typescript
// Component using use()
function UserProfile({ userPromise }) {
  const user = use(userPromise)
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}

// Test
describe('UserProfile with use()', () => {
  it('renders resolved data', async () => {
    const userPromise = Promise.resolve({
      name: 'Alice',
      email: 'alice@example.com',
    })

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <UserProfile userPromise={userPromise} />
      </Suspense>
    )

    await screen.findByRole('heading', { name: 'Alice' })
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
  })

  it('shows error boundary on rejection', async () => {
    const userPromise = Promise.reject(new Error('User not found'))

    render(
      <ErrorBoundary fallback={<div>Error occurred</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <UserProfile userPromise={userPromise} />
        </Suspense>
      </ErrorBoundary>
    )

    await screen.findByText('Error occurred')
  })
})
```

---

## Nested Suspense

```typescript
describe('Nested Suspense', () => {
  it('shows outer fallback first, then inner', async () => {
    const slowPromise = new Promise((resolve) =>
      setTimeout(() => resolve({ name: 'Slow' }), 100)
    )
    const fastPromise = Promise.resolve({ name: 'Fast' })

    render(
      <Suspense fallback={<div>Loading page...</div>}>
        <div>
          <FastComponent dataPromise={fastPromise} />
          <Suspense fallback={<div>Loading details...</div>}>
            <SlowComponent dataPromise={slowPromise} />
          </Suspense>
        </div>
      </Suspense>
    )

    // Outer fallback first
    expect(screen.getByText('Loading page...')).toBeInTheDocument()

    // Fast content appears
    await screen.findByText('Fast')

    // Inner fallback while slow loads
    expect(screen.getByText('Loading details...')).toBeInTheDocument()

    // Slow content appears
    await screen.findByText('Slow')
  })
})
```

---

## Testing use() with Context

```typescript
describe('use() with Context', () => {
  it('reads context conditionally', () => {
    render(
      <ThemeContext value="dark">
        <ThemedComponent showTheme={true} />
      </ThemeContext>
    )

    expect(screen.getByText('Theme: dark')).toBeInTheDocument()
  })

  it('skips context when condition false', () => {
    render(
      <ThemeContext value="dark">
        <ThemedComponent showTheme={false} />
      </ThemeContext>
    )

    expect(screen.queryByText(/theme/i)).not.toBeInTheDocument()
  })
})
```
