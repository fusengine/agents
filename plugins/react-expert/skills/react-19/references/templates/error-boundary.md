---
name: error-boundary-template
description: ErrorBoundary patterns for use() and Suspense error handling
---

# ErrorBoundary Patterns

## Basic ErrorBoundary

```typescript
// modules/cores/components/ErrorBoundary.tsx
import { Component, ReactNode, ErrorInfo } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode | ((error: Error, reset: () => void) => ReactNode)
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Error boundary for catching render errors.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo)
  }

  reset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const { fallback } = this.props

      if (typeof fallback === 'function') {
        return fallback(this.state.error, this.reset)
      }

      return fallback
    }

    return this.props.children
  }
}
```

---

## Simple Usage

```typescript
// modules/users/components/UserPage.tsx
import { Suspense } from 'react'
import { ErrorBoundary } from '@/modules/cores/components/ErrorBoundary'

export function UserPage({ userId }: { userId: string }) {
  return (
    <ErrorBoundary
      fallback={<div>Something went wrong</div>}
      onError={(error) => console.error('User page error:', error)}
    >
      <Suspense fallback={<UserSkeleton />}>
        <UserProfile userPromise={fetchUser(userId)} />
      </Suspense>
    </ErrorBoundary>
  )
}
```

---

## With Reset Function

```typescript
// modules/cores/components/ErrorFallback.tsx
interface ErrorFallbackProps {
  error: Error
  reset: () => void
}

/**
 * Error fallback with retry button.
 */
export function ErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="text-red-500">
        <svg className="h-12 w-12" /* error icon */ />
      </div>
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground text-sm">
        {error.message}
      </p>
      <button
        onClick={reset}
        className="rounded bg-primary px-4 py-2 text-white"
      >
        Try again
      </button>
    </div>
  )
}

// Usage
function App() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <ErrorFallback error={error} reset={reset} />
      )}
    >
      <MainContent />
    </ErrorBoundary>
  )
}
```

---

## Granular Error Boundaries

```typescript
// modules/dashboard/components/Dashboard.tsx
import { Suspense } from 'react'
import { ErrorBoundary } from '@/modules/cores/components/ErrorBoundary'

/**
 * Dashboard with isolated error handling.
 */
export function Dashboard() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Stats can fail independently */}
      <ErrorBoundary fallback={<StatsError />}>
        <Suspense fallback={<StatsSkeleton />}>
          <StatsPanel statsPromise={fetchStats()} />
        </Suspense>
      </ErrorBoundary>

      {/* Chart can fail independently */}
      <ErrorBoundary fallback={<ChartError />}>
        <Suspense fallback={<ChartSkeleton />}>
          <ChartPanel chartPromise={fetchChartData()} />
        </Suspense>
      </ErrorBoundary>

      {/* Activity can fail independently */}
      <ErrorBoundary fallback={<ActivityError />}>
        <Suspense fallback={<ActivitySkeleton />}>
          <ActivityFeed activityPromise={fetchActivity()} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
```

---

## With Error Reporting

```typescript
// modules/cores/components/ReportingErrorBoundary.tsx
import { Component, ReactNode, ErrorInfo } from 'react'
import { errorReporter } from '@/modules/cores/services/error-reporter.service'

interface Props {
  children: ReactNode
  fallback: ReactNode
  context?: Record<string, unknown>
}

/**
 * Error boundary with automatic error reporting.
 */
export class ReportingErrorBoundary extends Component<Props> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Report to error tracking service
    errorReporter.captureError(error, {
      componentStack: errorInfo.componentStack,
      ...this.props.context
    })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

// Usage with context
function OrderPage({ orderId }: { orderId: string }) {
  return (
    <ReportingErrorBoundary
      fallback={<OrderError />}
      context={{ orderId, page: 'order-details' }}
    >
      <OrderDetails orderId={orderId} />
    </ReportingErrorBoundary>
  )
}
```

---

## Hook-based Alternative (react-error-boundary)

```typescript
// Using react-error-boundary package
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary'

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={resetErrorBoundary}>Reset</button>
    </div>
  )
}

// Child component can trigger reset
function ChildComponent() {
  const { showBoundary, resetBoundary } = useErrorBoundary()

  const handleClick = async () => {
    try {
      await riskyOperation()
    } catch (error) {
      showBoundary(error)
    }
  }

  return <button onClick={handleClick}>Do something risky</button>
}

// Usage
function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset app state here
      }}
    >
      <ChildComponent />
    </ErrorBoundary>
  )
}
```

---

## With use() Hook

```typescript
// modules/products/components/ProductPage.tsx
import { use, Suspense } from 'react'
import { ErrorBoundary } from '@/modules/cores/components/ErrorBoundary'

function ProductContent({ productPromise }: { productPromise: Promise<Product> }) {
  // If promise rejects, error propagates to ErrorBoundary
  const product = use(productPromise)

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  )
}

export function ProductPage({ productId }: { productId: string }) {
  const productPromise = fetchProduct(productId)

  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div>
          <p>Failed to load product: {error.message}</p>
          <button onClick={reset}>Retry</button>
        </div>
      )}
    >
      <Suspense fallback={<ProductSkeleton />}>
        <ProductContent productPromise={productPromise} />
      </Suspense>
    </ErrorBoundary>
  )
}
```

---

## Rules

- Place ErrorBoundary **outside** Suspense
- Use granular boundaries for independent sections
- Always provide a reset mechanism for recoverable errors
- Log errors to monitoring service in componentDidCatch
- Consider using react-error-boundary package for hooks support
