---
name: new-hooks
description: React 19 hooks - use(), useOptimistic, useActionState, useFormStatus, useEffectEvent
when-to-use: data fetching, forms, optimistic UI, effect callbacks
keywords: hooks, use, useOptimistic, useActionState, useFormStatus, useEffectEvent
priority: high
related: actions-api.md, templates/action-form.md, templates/use-promise.md
---

# React 19 New Hooks

## use() Hook

**First hook that can be called conditionally and in loops.**

### Purpose
- Read promises (with Suspense)
- Read context conditionally

### When to Use
- Data fetching with Suspense
- Conditional context access
- Parallel data loading

### Key Points
- Must be used with `<Suspense>` for promises
- Can be called conditionally (unlike other hooks)
- Can be called in loops
- Replaces most `useEffect` data fetching
- 19.3: DEV warning when a component looks unblocked by a conditional `use()`

### use(browser()) — browser-only rendering (React 19.3)

`browser(reason?)` from `react-dom`, passed to `use`: during server rendering the component
suspends and the closest `<Suspense>` fallback goes into the HTML; in the browser it returns
`undefined` and the component renders normally.

```tsx
import { Suspense, use } from 'react'
import { browser } from 'react-dom'

function SavedDraft() {
  use(browser('The draft is stored in localStorage.'))
  return <p>{localStorage.getItem('draft') ?? ''}</p>
}

// <Suspense fallback={<p>Loading draft...</p>}><SavedDraft /></Suspense>
```

- Replaces `typeof window` checks and `useEffect(() => setMounted(true))`
- Must be inside `<Suspense>` (otherwise the server render fails) and in a Client Component
- May be called conditionally; calling `browser()` without `use` does nothing — never throw it
- Server: `onBrowserBailout(error, errorInfo)` option on `react-dom/server` APIs (`error.cause` = reason); does not fire `onError`

→ See `templates/use-promise.md` for code examples

---

## useOptimistic

**Immediate UI updates during async operations.**

### Purpose
- Show optimistic state before server confirms
- Better perceived performance

### When to Use
- Form submissions
- Toggle actions (like/unlike)
- Any action where you can predict the result

### Key Points
- Signature: `useOptimistic(value, reducer?)` — reducer optional
- Returns `[optimisticState, setOptimistic]` (value or updater)
- Reverts automatically if action fails
- Works with form actions

→ See `templates/optimistic-update.md` for code examples

---

## useActionState

**Handle form actions with state management.**

### Purpose
- Manage form submission state
- Track pending state
- Handle errors

### When to Use
- Forms with error handling
- Forms with server validation
- Multi-step forms

### Key Points
- Returns `[state, formAction, isPending]`
- First argument is async function
- Second argument is initial state
- Error should be returned, not thrown
- 19.3: error messages say "action state" (was "form state")

→ See `templates/action-form.md` for code examples

---

## useFormStatus

**Access form status from child components.**

### Purpose
- Get pending state in submit button
- Access form data during submission

### Limitation
**Must be used in a child component of `<form>`**

### Key Points
- Returns `{ pending, data, method, action }`
- Use for disabling buttons during submission
- Use for showing loading state

→ See `templates/action-form.md` for SubmitButton example

---

## useEffectEvent (React 19.2+)

**Extract non-reactive logic from Effects.**

> **Stable** since React 19.2.0 (October 2025) — `import { useEffectEvent } from 'react'`.
> 19.3: reads the latest values in `forwardRef` and `memo` components too.

### Purpose
- Avoid stale closures in effects
- Prevent unnecessary effect re-runs
- Access latest props/state without adding to deps

### When to Use
- Event handlers called from useEffect
- Callbacks that need fresh values
- Analytics/logging in effects

### Key Points
- Always has latest props/state
- Does NOT cause effect to re-run
- Can only be called from inside effects
- NOT a dependency (don't add to deps array)

### Problem It Solves
Event callbacks in effects that need fresh values without triggering effect re-runs.

---

## Migration from useEffect

| Old Pattern | New Pattern |
|-------------|-------------|
| `useEffect` + `fetch()` | `use()` + `Suspense` |
| `useEffect` + state for async | `useActionState` |
| `useState` + optimistic flag | `useOptimistic` |
| `useCallback` in effect | `useEffectEvent` |

---

## Where to Find Code Templates?

→ `templates/use-promise.md` - use() with Suspense
→ `templates/action-form.md` - useActionState forms
→ `templates/optimistic-update.md` - useOptimistic patterns
