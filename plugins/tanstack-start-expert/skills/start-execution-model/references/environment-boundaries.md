---
name: environment-boundaries
applies-to: "**/src/**/*.ts, **/src/**/*.tsx"
description: TanStack Start boundary APIs - server-only, client-only, isomorphic fns, ClientOnly, useHydrated, import markers
when-to-use: choosing a boundary API, marking a file server/client-only, fixing hydration mismatches
keywords: createServerOnlyFn, createClientOnlyFn, createIsomorphicFn, ClientOnly, useHydrated, server-only, client-only, hydration
priority: high
related: isomorphic-by-default.md, environment-variables.md, templates/boundaries.md
---

# Environment Boundaries

Load when choosing how to pin code to an environment. Imports: boundary creators
from `@tanstack/react-start`; `<ClientOnly>` / `useHydrated` from
`@tanstack/react-router`.

## `createServerFn` — the primary server boundary

RPC. On the client a call becomes a same-origin fetch; on the server it runs
directly. Covered in depth by the server-functions material — use it for anything
returning data.

```tsx
import { createServerFn } from '@tanstack/react-start'

const fetchUser = createServerFn().handler(async () => {
  const secret = process.env.API_SECRET // safe — server only
  return db.users.find()
})
```

## `createServerOnlyFn` — throws on the client

For a server utility that must never execute in the browser (no network round
trip, just a hard guard):

```tsx
import { createServerOnlyFn } from '@tanstack/react-start'

const getSecret = createServerOnlyFn(() => process.env.DATABASE_URL)
// Server → returns value. Client → THROWS.
```

## `createClientOnlyFn` — throws on the server

```tsx
import { createClientOnlyFn } from '@tanstack/react-start'

const saveToStorage = createClientOnlyFn((key: string, value: string) => {
  localStorage.setItem(key, value)
})
```

## `createIsomorphicFn` — one name, per-env implementation

```tsx
import { createIsomorphicFn } from '@tanstack/react-start'

const getDeviceInfo = createIsomorphicFn()
  .server(() => ({ type: 'server', platform: process.platform }))
  .client(() => ({ type: 'client', userAgent: navigator.userAgent }))
```

## `<ClientOnly>` — render only in the browser

```tsx
import { ClientOnly } from '@tanstack/react-router'

function Analytics() {
  return (
    <ClientOnly fallback={null}>
      <GoogleAnalyticsScript />
    </ClientOnly>
  )
}
```

## `useHydrated()` — gate on hydration

```tsx
import { useHydrated } from '@tanstack/react-router'

function TimeZoneDisplay() {
  const hydrated = useHydrated()
  const tz = hydrated ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC'
  return <div>Your timezone: {tz}</div>
}
```

Behavior: SSR → `false`; first client render → `false`; after hydration → `true`
(and stays true). Using it avoids hydration mismatches.

---

## Import Protection: File Markers (experimental)

`*.server.ts` / `*.client.ts` filename suffixes opt a file into import protection.
When you can't rename, add a side-effect import at the top:

```ts
// src/lib/secrets.ts
import '@tanstack/react-start/server-only'
export function getApiKey() { return process.env.API_KEY }
```

```ts
// src/lib/storage.ts
import '@tanstack/react-start/client-only'
export function savePrefs(p: Record<string, string>) {
  localStorage.setItem('prefs', JSON.stringify(p))
}
```

Rules: both markers in one file is an error; type-only imports are ignored;
default is `error` in production builds and `mock` in dev.

---

## Which Tool To Pick

| Need | Use |
|------|-----|
| Return data to the client | `createServerFn` |
| Server utility, hard guard, no network | `createServerOnlyFn` |
| Browser utility, hard guard | `createClientOnlyFn` |
| Same symbol, different impl per env | `createIsomorphicFn` |
| Component renders only after hydration | `<ClientOnly>` / `useHydrated` |
| Whole file must never cross a side | `*.server.ts` / `server-only` marker |

## Hydration Mismatch — the classic bug

```tsx
// WRONG — server and client render different text
function CurrentTime() { return <div>{new Date().toLocaleString()}</div> }

// CORRECT — render deterministically, fill in after mount
function CurrentTime() {
  const [time, setTime] = useState<string>()
  useEffect(() => setTime(new Date().toLocaleString()), [])
  return <div>{time || 'Loading...'}</div>
}
```
