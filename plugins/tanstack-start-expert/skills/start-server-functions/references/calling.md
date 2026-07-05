---
name: calling
description: Invoking server functions from loaders, components, and hooks
when-to-use: Calling a server function, deciding when useServerFn is required, handling redirect/notFound
keywords: useServerFn, loader, useMutation, redirect, notFound, invoke, event handler
priority: high
requires: creating.md
related: security.md
---

# Calling Server Functions

## Overview

A server function is called like any async function, but it takes a single
argument shaped `{ data }` when a validator is present. Where you call it
determines whether you need the `useServerFn` hook.

---

## Where to Call

| Location | How |
|----------|-----|
| Route loader | `loader: () => getPosts()` |
| Component (data) | Direct call, or via `useQuery`/`useMutation` |
| Component (redirect/notFound) | `useServerFn(fn)` — **required** |
| Other server functions | Direct call (compose server logic) |

---

## The useServerFn Rule (CRITICAL)

`useServerFn` wires router-level throws into navigation. It is **mandatory**
when the function does `throw redirect()` or `throw notFound()`; otherwise the
throw is swallowed and no navigation happens.

```tsx
// Throws redirect → MUST wrap
const signupFn = useServerFn(signup)
<button onClick={() => signupFn({ data: form })}>Sign up</button>

// Plain data → direct call or useMutation is fine
<button onClick={() => deletePost({ data: { id } })}>Delete</button>
useMutation({ mutationFn: deletePost })
```

**Rule of thumb:** if in doubt, wrap with `useServerFn`. It is a no-op for
plain-data functions and future-proofs a function that may later add a redirect.

---

## Decision Guide

```
Does the function throw redirect() or notFound()?
├── Yes → useServerFn(fn) in the component
└── No
    ├── Fetching for render → call in loader, or useQuery
    └── Mutation on interaction → direct call, or useMutation
```

---

## Error, Redirect, and Not-Found Throws

```tsx
import { redirect, notFound } from '@tanstack/react-router'

const getPost = createServerFn()
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const post = await db.findPost(data.id)
    if (!post) throw notFound()
    return post
  })
```

When called from a loader or a `useServerFn`-wrapped call, these throws are
handled automatically (navigation / error boundary / not-found component).

---

## Best Practices

### DO
- Use `useServerFn` for any redirect/notFound-throwing function in components
- Call functions directly inside loaders for data fetching
- Pass validated data as `{ data: ... }`

### DON'T
- Call a redirect-throwing function directly in an `onClick` handler
- Forget the `()` — the function is not a Promise until invoked

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Redirect never navigates from a button | Wrap the fn in `useServerFn` |
| `await getUser` returns a function | Invoke it: `await getUser({ data })` |
| Passing raw args instead of `{ data }` | Use the `{ data: ... }` envelope |

---

## Related References

- [creating.md](creating.md) — defining functions and validators
- [security.md](security.md) — protecting the endpoint

## Related Templates

- [crud-server-functions.md](templates/crud-server-functions.md) — calling from a loader
