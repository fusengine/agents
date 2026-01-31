---
name: use-transition-async-template
description: useTransition with async functions (React 19 Actions)
---

# Async Transitions Patterns

## Basic Async Transition

```typescript
// modules/users/components/UpdateProfile.tsx
import { useState, useTransition } from 'react'
import { userService } from '../src/services/user.service'

export function UpdateProfile({ userId }: { userId: string }) {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = () => {
    startTransition(async () => {
      const result = await userService.updateName(userId, name)

      if (result.error) {
        setError(result.error)
        return
      }

      // Success - isPending becomes false automatically
      setError(null)
    })
  }

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isPending}
      />
      <button onClick={handleSubmit} disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}
```

---

## Multiple Sequential Updates

```typescript
// modules/checkout/components/CheckoutButton.tsx
import { useTransition } from 'react'
import { useRouter } from '@tanstack/react-router'

export function CheckoutButton({ cartId }: { cartId: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleCheckout = () => {
    startTransition(async () => {
      // Step 1: Validate cart
      const validation = await cartService.validate(cartId)
      if (!validation.valid) {
        throw new Error(validation.message)
      }

      // Step 2: Process payment
      const payment = await paymentService.process(cartId)
      if (!payment.success) {
        throw new Error('Payment failed')
      }

      // Step 3: Navigate - wrap in startTransition for transition
      startTransition(() => {
        router.navigate({ to: '/order/$orderId', params: { orderId: payment.orderId } })
      })
    })
  }

  return (
    <button onClick={handleCheckout} disabled={isPending}>
      {isPending ? 'Processing...' : 'Checkout'}
    </button>
  )
}
```

---

## With Error Boundary

```typescript
// modules/posts/components/DeletePost.tsx
import { useTransition } from 'react'
import { postService } from '../src/services/post.service'

interface DeletePostProps {
  postId: string
  onDeleted: () => void
}

export function DeletePost({ postId, onDeleted }: DeletePostProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      await postService.delete(postId)
      // After successful delete
      onDeleted()
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-500"
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  )
}

// Parent with Error Boundary
function PostCard({ post }: { post: Post }) {
  return (
    <ErrorBoundary fallback={<p>Failed to delete</p>}>
      <div>
        <h3>{post.title}</h3>
        <DeletePost
          postId={post.id}
          onDeleted={() => console.log('Deleted')}
        />
      </div>
    </ErrorBoundary>
  )
}
```

---

## Parallel Async Operations

```typescript
// modules/dashboard/components/RefreshDashboard.tsx
import { useTransition } from 'react'

export function RefreshDashboard() {
  const [isPending, startTransition] = useTransition()

  const handleRefresh = () => {
    startTransition(async () => {
      // Run in parallel
      await Promise.all([
        dashboardService.refreshStats(),
        dashboardService.refreshCharts(),
        dashboardService.refreshNotifications()
      ])
    })
  }

  return (
    <button onClick={handleRefresh} disabled={isPending}>
      {isPending ? 'Refreshing...' : 'Refresh All'}
    </button>
  )
}
```

---

## With Optimistic Update

```typescript
// modules/likes/components/LikeButton.tsx
import { useTransition, useOptimistic } from 'react'

interface LikeButtonProps {
  postId: string
  isLiked: boolean
  likeCount: number
}

export function LikeButton({ postId, isLiked, likeCount }: LikeButtonProps) {
  const [isPending, startTransition] = useTransition()

  const [optimistic, setOptimistic] = useOptimistic(
    { isLiked, likeCount },
    (state, newLiked: boolean) => ({
      isLiked: newLiked,
      likeCount: newLiked ? state.likeCount + 1 : state.likeCount - 1
    })
  )

  const handleLike = () => {
    const newLiked = !optimistic.isLiked

    startTransition(async () => {
      // Optimistic update
      setOptimistic(newLiked)

      // Server request
      if (newLiked) {
        await likeService.like(postId)
      } else {
        await likeService.unlike(postId)
      }
    })
  }

  return (
    <button onClick={handleLike} disabled={isPending}>
      {optimistic.isLiked ? '❤️' : '🤍'} {optimistic.likeCount}
    </button>
  )
}
```

---

## Debounced Auto-Save

```typescript
// modules/editor/hooks/useAutoSave.ts
import { useTransition, useEffect, useRef } from 'react'

export function useAutoSave(
  content: string,
  save: (content: string) => Promise<void>,
  delay = 1000
) {
  const [isSaving, startTransition] = useTransition()
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Schedule save
    timeoutRef.current = setTimeout(() => {
      startTransition(async () => {
        await save(content)
      })
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [content, save, delay])

  return { isSaving }
}

// Usage
function Editor({ documentId }: { documentId: string }) {
  const [content, setContent] = useState('')

  const { isSaving } = useAutoSave(
    content,
    (c) => documentService.save(documentId, c)
  )

  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      {isSaving && <span>Saving...</span>}
    </div>
  )
}
```

---

## Rules

- `isPending` stays true for entire async operation
- Errors thrown inside async transition propagate to Error Boundary
- State updates after `await` need their own `startTransition` to be transitions
- Combine with `useOptimistic` for instant feedback
- Prefer `useActionState` for form submissions
