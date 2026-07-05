---
name: interface-segregation
applies-to: "**/src/modules/**/interfaces/*.ts, **/src/routes/**/*.tsx, **/src/router.tsx"
description: ISP for TanStack Start - focused types for loader data, server-fn payloads, router context
when-to-use: designing loader return types, server function payloads, router context, refactoring fat types
keywords: interface segregation, ISP, focused interfaces, loader data, payload, router context
priority: medium
related: single-responsibility.md, dependency-inversion.md, templates/interface.md
---

# Interface Segregation Principle (ISP) — Start

**Many focused interfaces beat one fat interface.** Load when typing what crosses
a boundary: loader data, a `createServerFn` payload, or router `context`.

## The Three Boundary Types

Start pushes data across three seams; each deserves its own narrow type.

```typescript
// src/modules/users/src/interfaces/user.interface.ts

/** Row returned by the DB layer — the full record. */
export interface User {
  id: string
  email: string
  passwordHash: string // NEVER crosses to the client
  createdAt: string
}

/** Payload a client may send to the getUser server function. */
export interface GetUserPayload {
  id: string
}

/** Exactly what the route loader exposes to the component. */
export interface UserView {
  id: string
  email: string
  createdAt: string
}
```

The component depends on `UserView`, not `User` — so `passwordHash` cannot leak
and the UI is not coupled to DB shape.

---

## Router Context Stays Minimal

Type the root context once with only what every route needs:

```typescript
// src/router.tsx / __root.tsx
interface RouterContext {
  session: Session | null
}

export const Route = createRootRouteWithContext<RouterContext>()({ /* ... */ })
```

Do NOT stuff feature-specific data into `RouterContext`. Add per-route data via
`beforeLoad` returning a focused object — Start merges it into that route's typed
context without widening the global one.

---

## Serialization Is Part of the Contract

Server-function inputs/outputs cross the network, so Start type-checks them for
serializability (strict mode). A fat interface carrying a class instance or a
`Map` will fail. Keep boundary types to plain serializable data:

```typescript
// ✅ serializable payload + return
export const getUser = createServerFn({ method: 'GET' })
  .validator((data: GetUserPayload) => data)
  .handler(async ({ data }): Promise<UserView> => toView(await findUser(data.id)))
```

---

## Checklist

- [ ] DB row, payload, and view are separate types.
- [ ] Components import the view type, never the DB type.
- [ ] `RouterContext` holds only app-global data.
- [ ] Boundary types are plain serializable objects.
- [ ] All in `src/interfaces/`, never inline in a route.

Template: `templates/interface.md`.
