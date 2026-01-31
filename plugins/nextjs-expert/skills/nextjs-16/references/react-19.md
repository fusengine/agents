---
name: react-19
description: React 19 features including useActionState, useOptimistic, use()
when-to-use: advanced hooks, form handling, optimistic UI
keywords: React 19, useActionState, useOptimistic, use, useEffectEvent
priority: medium
requires: forms.md
related: forms.md
---

# React 19 Features

## When to Use

- View transitions (animations)
- Effect event handlers
- Optimistic updates
- Form handling with actions

## Why React 19

| Feature | Purpose |
|---------|---------|
| use() | Suspend on promises |
| useActionState | Form state |
| useOptimistic | Instant UI |
| useEffectEvent | Non-reactive callbacks |

## View Transitions
```typescript
'use client'
import { useViewTransition } from 'react'

export function PageTransition({ children }) {
  const { startTransition } = useViewTransition()
  return <div onClick={() => startTransition(() => router.push('/new'))}>{children}</div>
}
```

## useEffectEvent
```typescript
'use client'
import { useEffectEvent, useEffect } from 'react'

export function Chat({ roomId, onMessage }) {
  const onMsg = useEffectEvent((msg) => onMessage(msg))  // Non-reactive

  useEffect(() => {
    const conn = createConnection(roomId)
    conn.on('message', onMsg)
    return () => conn.disconnect()
  }, [roomId])  // onMessage not needed in deps
}
```

## Activity Component
```typescript
import { Activity } from 'react'

export function Dashboard() {
  return (
    <div>
      <MainContent />
      <Activity mode="hidden">
        <BackgroundSync />
      </Activity>
    </div>
  )
}
```

## use() Hook
```typescript
import { use } from 'react'

export default function Page({ dataPromise }) {
  const data = use(dataPromise)  // Suspends until resolved
  return <div>{data.title}</div>
}
```

## useOptimistic
```typescript
'use client'
import { useOptimistic } from 'react'

export function LikeButton({ likes, onLike }) {
  const [optimistic, addOptimistic] = useOptimistic(likes, (s) => s + 1)

  return <button onClick={() => { addOptimistic(); onLike() }}>{optimistic}</button>
}
```

## useActionState
```typescript
'use client'
import { useActionState } from 'react'

export function Form({ action }) {
  const [state, formAction, isPending] = useActionState(action, null)
  return (
    <form action={formAction}>
      <button disabled={isPending}>Submit</button>
      {state?.error && <p>{state.error}</p>}
    </form>
  )
}
```

## useFormStatus
```typescript
'use client'
import { useFormStatus } from 'react-dom'

export function SubmitButton() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>{pending ? 'Loading...' : 'Submit'}</button>
}
```
