---
name: route-template
applies-to: "**/src/routes/**/*.tsx"
description: TanStack Start route template - orchestrator only, loader calls server functions (< 50 lines)
---

# Route (< 50 lines)

A route file is an **orchestrator**: declare the route, fetch via a server
function in the `loader`, render a module component. No types, no DB, no logic.

## Basic Route with Loader

```tsx
// src/routes/users.$id.tsx
import { createFileRoute } from '@tanstack/react-router'
import { getUser } from '~/modules/users/src/functions/users.functions'
import { UserView } from '~/modules/users/components/UserView'

export const Route = createFileRoute('/users/$id')({
  loader: ({ params }) => getUser({ data: { id: params.id } }),
  component: UserPage,
})

function UserPage() {
  const user = Route.useLoaderData()
  return <UserView user={user} />
}
```

Types are fully inferred: `Route.useLoaderData()` is typed from `getUser`'s
return. Never annotate it.

---

## Route with Validated Search Params

```tsx
// src/routes/products.tsx
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { listProducts } from '~/modules/catalog/src/functions/catalog.functions'
import { ProductGrid } from '~/modules/catalog/components/ProductGrid'

const searchSchema = z.object({
  page: z.number().int().min(1).catch(1),
  q: z.string().catch(''),
})

export const Route = createFileRoute('/products')({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => listProducts({ data: deps }),
  component: ProductsPage,
})

function ProductsPage() {
  const products = Route.useLoaderData()
  return <ProductGrid products={products} />
}
```

---

## Root Route (Document Shell)

```tsx
// src/routes/__root.tsx
import type { ReactNode } from 'react'
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import type { Session } from '~/modules/cores/interfaces/session.interface'

interface RouterContext {
  session: Session | null
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'My App' },
    ],
  }),
  component: () => (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  ),
})
```

---

## Rules

- Max 50 lines (root route: 60).
- Loader calls a `createServerFn` — never raw DB/secret access.
- No type declarations here (→ `src/interfaces/`).
- `<Scripts />` and `<HeadContent />` mandatory in `__root.tsx`.
- Never touch `routeTree.gen.ts`.
