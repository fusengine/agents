---
name: boundaries-template
applies-to: "**/src/**/*.ts, **/src/**/*.tsx"
description: Complete copy-paste examples of every TanStack Start execution boundary
---

# Boundary Patterns (complete)

Copy-paste examples for each execution boundary. Boundary creators import from
`@tanstack/react-start`; `<ClientOnly>` / `useHydrated` from
`@tanstack/react-router`.

## Set Up All Boundaries in One Place

```tsx
import {
  createServerFn,
  createServerOnlyFn,
  createClientOnlyFn,
  createIsomorphicFn,
} from '@tanstack/react-start'

// Server function (RPC → fetch on the client)
const getUsers = createServerFn().handler(async () => db.users.findMany())

// Server-only utility (throws on the client)
const getSecret = createServerOnlyFn(() => process.env.API_SECRET)

// Client-only utility (throws on the server)
const saveToStorage = createClientOnlyFn((data: unknown) => {
  localStorage.setItem('data', JSON.stringify(data))
})

// Per-environment implementation
const logger = createIsomorphicFn()
  .server((msg: string) => console.log(`[SERVER]: ${msg}`))
  .client((msg: string) => console.log(`[CLIENT]: ${msg}`))
```

## Progressive Enhancement (works without JS)

```tsx
import { ClientOnly } from '@tanstack/react-router'

function SearchForm() {
  const [query, setQuery] = useState('')
  return (
    <form action="/search" method="get">
      <input name="q" value={query} onChange={(e) => setQuery(e.target.value)} />
      <ClientOnly fallback={<button type="submit">Search</button>}>
        <SearchButton onSearch={() => search(query)} />
      </ClientOnly>
    </form>
  )
}
```

## Environment-Aware Storage

```tsx
import { createIsomorphicFn } from '@tanstack/react-start'

const readCache = createIsomorphicFn()
  .server((key: string) => {
    const fs = require('node:fs')
    return JSON.parse(fs.readFileSync('.cache', 'utf-8'))[key]
  })
  .client((key: string) => JSON.parse(localStorage.getItem(key) || 'null'))
```

## Loader Calling a Server Function (the correct pattern)

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

const getUsersSecurely = createServerFn().handler(async () => {
  const secret = process.env.SECRET // server-only
  return fetch(`https://api.internal/users?key=${secret}`).then((r) => r.json())
})

export const Route = createFileRoute('/users')({
  loader: () => getUsersSecurely(), // isomorphic call → network on the client
})
```

## File Markers (whole-file protection)

```ts
// src/modules/cores/server/db.ts
import '@tanstack/react-start/server-only'
import { PrismaClient } from '@prisma/client'

/** Shared DB client — never reaches a client bundle. */
export const db = new PrismaClient()
```

```ts
// src/modules/cores/lib/prefs.client.ts
import '@tanstack/react-start/client-only'

/** Browser preference store — never runs on the server. */
export function savePrefs(prefs: Record<string, string>) {
  localStorage.setItem('prefs', JSON.stringify(prefs))
}
```

## Hydration-Safe Rendering

```tsx
import { useHydrated } from '@tanstack/react-router'

function LocalTime() {
  const hydrated = useHydrated()
  return <span>{hydrated ? new Date().toLocaleTimeString() : '—'}</span>
}
```

---

## Production Checklist

- Bundle analysis confirms no server-only code in the client bundle.
- Secrets use `createServerOnlyFn()` or `createServerFn()`, never a prefix.
- Loaders only orchestrate — they are isomorphic, not server-only.
- `<ClientOnly>` fallbacks prevent layout shift.
- `process.env` read only inside per-request handlers.
