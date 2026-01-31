---
name: error-boundary
description: Testing Error Boundaries for error handling
keywords: error, boundary, fallback, catch, throw
---

# Error Boundary Testing Template

## Basic Error Boundary Test

```typescript
// src/components/__tests__/ErrorBoundary.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ErrorBoundary } from '../ErrorBoundary'

// Component that throws
function ThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>Content</div>
}

describe('ErrorBoundary', () => {
  // Suppress console.error for expected errors
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders children when no error', () => {
    render(
      <ErrorBoundary fallback={<div>Error</div>}>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.queryByText('Error')).not.toBeInTheDocument()
  })

  it('renders fallback when error thrown', () => {
    render(
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })
})
```

---

## Error Boundary with Reset

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('ErrorBoundary with reset', () => {
  it('recovers after reset', async () => {
    const user = userEvent.setup()
    let shouldThrow = true

    function MaybeThrow() {
      if (shouldThrow) {
        throw new Error('Error')
      }
      return <div>Recovered</div>
    }

    const { rerender } = render(
      <ErrorBoundary
        fallback={({ reset }) => (
          <div>
            <p>Error occurred</p>
            <button onClick={reset}>Retry</button>
          </div>
        )}
      >
        <MaybeThrow />
      </ErrorBoundary>
    )

    // Error shown
    expect(screen.getByText('Error occurred')).toBeInTheDocument()

    // Fix the error
    shouldThrow = false

    // Click retry
    await user.click(screen.getByRole('button', { name: /retry/i }))

    // Recovered
    expect(screen.getByText('Recovered')).toBeInTheDocument()
  })
})
```

---

## Testing Async Errors

```typescript
describe('ErrorBoundary with async errors', () => {
  it('catches async render errors with Suspense', async () => {
    const failingPromise = Promise.reject(new Error('Fetch failed'))

    render(
      <ErrorBoundary fallback={<div>Error loading data</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <AsyncComponent dataPromise={failingPromise} />
        </Suspense>
      </ErrorBoundary>
    )

    // Loading first
    expect(screen.getByText('Loading...')).toBeInTheDocument()

    // Then error
    await screen.findByText('Error loading data')
  })
})
```

---

## Error Boundary with Error Info

```typescript
describe('ErrorBoundary logs error info', () => {
  it('receives error and errorInfo', () => {
    const onError = vi.fn()

    render(
      <ErrorBoundary
        fallback={<div>Error</div>}
        onError={onError}
      >
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    )
  })
})
```
