---
name: route-params
description: Dynamic route parameters with type-safe parsing and validation
when-to-use: Creating dynamic routes, accessing URL params, parsing param types
keywords: params, dynamic, $param, parsing, validation, type-safe
priority: high
requires: file-based-routing.md
related: search-params.md, typescript.md
template: templates/feature-module.md
---

# Route Parameters

> **Full code**: See [templates/feature-module.md](templates/feature-module.md)

## Syntax

| Pattern | Example | Result |
|---------|---------|--------|
| `$postId` | `/posts/$postId.tsx` | `params.postId: string` |
| `$userId/$postId` | Multi params | `{ userId, postId }` |
| `$` (splat) | `/docs/$.tsx` | `params._splat: string` |

---

## Accessing Params

### In Component (Route API)

```typescript
const { postId } = Route.useParams()
```

### In Loader

```typescript
loader: async ({ params }) => fetchPost(params.postId)
```

### With Global Hook

```typescript
const { postId } = useParams({ from: '/posts/$postId' })
```

> **Important**: Always specify `from` for type safety.

---

## Type Parsing

By default, params are `string`. To convert:

```typescript
params: {
  parse: (p) => ({ postId: Number(p.postId) }),
  stringify: (p) => ({ postId: String(p.postId) }),
}
```

**With Zod**: Use `z.coerce.number()` for validation + conversion.

---

## Catch-All (Splat)

The `$.tsx` pattern captures the rest of the path.

```text
/docs/getting-started/intro → _splat = "getting-started/intro"
```

**Usage**: Documentation, CMS, complex dynamic routes.

---

## Navigation with Params

```typescript
<Link to="/posts/$postId" params={{ postId: '123' }}>
```

```typescript
navigate({ to: '/posts/$postId', params: { postId } })
```

---

## Best Practices

| Do ✅ | Don't ❌ |
|-------|---------|
| `Route.useParams()` | `useParams()` without `from` |
| Parse in route config | `Number(params.id)` in component |
| Zod validation for params | Unvalidated params |
