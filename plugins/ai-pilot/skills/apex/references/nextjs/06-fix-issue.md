---
name: 06-fix-issue
description: Fix Next.js issues discovered during review or testing
prev_step: references/nextjs/05-review.md
next_step: references/nextjs/07-add-test.md
---

# 06 - Fix Issue (Next.js)

**Fix Next.js issues discovered during review or testing.**

## When to Use

- After review reveals issues
- When bug is reported
- During PR feedback resolution

---

## Common Next.js Issues

### 1. Hydration Errors

```text
Error: Hydration failed because the server rendered HTML didn't match the client.
```

#### Causes and Fixes

```typescript
// Cause: Using Date/Math.random on server
// WRONG
export function Component() {
  return <p>{new Date().toLocaleString()}</p>
}

// FIX: Move to useEffect
'use client'
export function Component() {
  const [date, setDate] = useState('')

  useEffect(() => {
    setDate(new Date().toLocaleString())
  }, [])

  return <p>{date}</p>
}
```

```typescript
// Cause: Browser-only APIs
// WRONG
export function Component() {
  const width = window.innerWidth // Error on server
  return <p>{width}</p>
}

// FIX: Check for browser
'use client'
export function Component() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setWidth(window.innerWidth)
  }, [])

  return <p>{width}</p>
}
```

---

### 2. Server Action Errors

```text
Error: Functions cannot be passed directly to Client Components
```

#### Fix

```typescript
// WRONG - Passing function directly
<ClientComponent onSubmit={serverAction} />

// FIX - Use action prop
<form action={serverAction}>
  <ClientComponent />
</form>

// OR wrap in useActionState
'use client'
import { useActionState } from 'react'

export function Form({ action }: { action: (fd: FormData) => Promise<void> }) {
  const [state, formAction] = useActionState(action, null)
  return <form action={formAction}>...</form>
}
```

---

### 3. Dynamic Import Issues

```text
Error: Attempted to call the default export of a module marked 'use client'
```

#### Fix

```typescript
// WRONG - Server importing Client
import { ClientComponent } from './ClientComponent'

// FIX - Use dynamic import with ssr: false
import dynamic from 'next/dynamic'

const ClientComponent = dynamic(
  () => import('./ClientComponent').then((mod) => mod.ClientComponent),
  { ssr: false }
)
```

---

### 4. Route Handler Issues

```text
Error: Route Handler must export an async function
```

#### Fix

```typescript
// WRONG
export function GET() {
  return Response.json({ data: 'test' })
}

// FIX
export async function GET() {
  return Response.json({ data: 'test' })
}
```

---

### 5. Metadata Errors

```text
Error: You are attempting to export "metadata" from a component marked with "use client"
```

#### Fix

```typescript
// WRONG - Metadata in Client Component
'use client'
export const metadata = { title: 'Page' }

// FIX - Metadata only in Server Components
// page.tsx (Server Component)
export const metadata = { title: 'Page' }

// Keep 'use client' for component, not page
import { ClientForm } from './ClientForm'
export default function Page() {
  return <ClientForm />
}
```

---

### 6. Prisma in Edge Runtime

```text
Error: PrismaClient is unable to run in this browser environment
```

#### Fix

```typescript
// Ensure route uses Node.js runtime
export const runtime = 'nodejs' // Not 'edge'

export async function GET() {
  const users = await prisma.user.findMany()
  return Response.json(users)
}
```

---

## Fix Workflow

### Step 1: Identify Root Cause

```text
1. Read full error message
2. Check stack trace
3. Identify file and line
4. Understand Server/Client boundary
```

### Step 2: Research Solution

```text
1. Check Next.js 16 docs
2. Search for error message
3. Verify correct pattern
```

### Step 3: Apply Fix

```text
1. Make minimal change
2. Test locally
3. Run validation
```

### Step 4: Verify

```bash
# Run full validation
pnpm tsc --noEmit
pnpm eslint .
pnpm build
pnpm test
```

---

## Fix Patterns

### Split Server/Client

```typescript
// Before: Mixed concerns
'use client'
export default async function Page() {
  const data = await getData() // ERROR
  const [state, setState] = useState()
  return <div>{data}</div>
}

// After: Separated concerns
// page.tsx (Server)
export default async function Page() {
  const data = await getData()
  return <ClientComponent data={data} />
}

// ClientComponent.tsx
'use client'
export function ClientComponent({ data }) {
  const [state, setState] = useState(data)
  return <div>{state}</div>
}
```

---

## Validation After Fix

```text
[ ] Error no longer occurs
[ ] No new errors introduced
[ ] TypeScript passes
[ ] ESLint passes
[ ] Build succeeds
[ ] Tests pass
```

---

## Next Phase

Proceed to `07-add-test.md`
