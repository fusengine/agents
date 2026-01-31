---
name: typescript
description: TypeScript patterns and type safety for TanStack Router
when-to-use: Understanding type inference, fixing type errors, advanced typing
keywords: typescript, types, inference, generics, type-safe
priority: high
requires: file-based-routing.md
related: route-params.md, search-params.md, hooks.md
template: templates/basic-setup.md
---

# TypeScript Patterns

> **Full code**: See [templates/basic-setup.md](templates/basic-setup.md)

## Type Registration (MANDATORY)

**Required** to enable full type safety. Without this, no auto-complete or validation.

```typescript
declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}
```

**Enables**: Auto-complete paths, params validation, loader data inference.

---

## Key Concepts

### Generated Route Types

The plugin generates `routeTree.gen.ts` with full types:

| Interface | Content |
|-----------|---------|
| `FileRoutesByFullPath` | Mapping path → route |
| `FileRoutesByTo` | Paths for navigation |
| `FileRouteTypes` | Union types paths, params, search |

**Never modify** this file (auto-generated).

---

### Automatic Inference

| Hook | Type inferred from |
|------|-------------------|
| `Route.useParams()` | URL params (`$postId` → `{ postId: string }`) |
| `Route.useSearch()` | Zod schema validateSearch |
| `Route.useLoaderData()` | Loader return type |
| `Route.useRouteContext()` | RouterContext + extensions |

**Advantage**: No manual typing, everything is inferred.

---

### Context Types

Define context interface in `modules/cores/interfaces/`:

| Field | Type | Usage |
|-------|------|-------|
| `queryClient` | `QueryClient` | TanStack Query |
| `user` | `User \| null` | Authentication |

**Pattern**: `beforeLoad` can extend context for child routes.

---

### getRouteApi

To access a route's types **outside the route file**:

```typescript
const postRoute = getRouteApi('/posts/$postId')
const { postId } = postRoute.useParams() // Type-safe
```

**When to use**: Shared components accessing specific route data.

---

## Common Type Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `Property 'router' is missing` | No type registration | Add `declare module` |
| `Property 'postId' is missing` | Missing params | Add `params={{ postId }}` |
| `Type 'number' not assignable to 'string'` | Wrong param type | URL params are strings |

---

## Best Practices

| Do ✅ | Don't ❌ |
|-------|---------|
| Register router types | Skip `declare module` |
| `Route.useParams()` | Global `useParams()` without `from` |
| `getRouteApi` outside route files | Cast with `any` |
| `zodValidator` for search | Manual validation |
| Separate context types | Inline types |
