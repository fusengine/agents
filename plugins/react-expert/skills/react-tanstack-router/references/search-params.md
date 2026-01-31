---
name: search-params
description: Type-safe search parameters with Zod validation and middlewares
when-to-use: Implementing filters, pagination, sort options, URL state
keywords: search, params, query, zod, validation, filters, pagination
priority: high
requires: file-based-routing.md
related: route-params.md, navigation.md
template: templates/search-filters.md
---

# Search Parameters

> **Full code**: See [templates/search-filters.md](templates/search-filters.md)

## Validation with Zod

```typescript
validateSearch: zodValidator(z.object({
  page: z.number().min(1).default(1),
  sort: z.enum(['newest', 'oldest']).default('newest'),
}))
```

**Packages**: `@tanstack/zod-adapter` + `zod`

---

## Schema Patterns

| Type | Zod Schema |
|------|------------|
| Pagination | `page: z.number().default(1)` |
| Sort | `sort: z.enum([...]).default(...)` |
| Text filter | `search: z.string().optional()` |
| Multi-select | `tags: z.array(z.string()).default([])` |
| Price | `minPrice: z.number().min(0).optional()` |

---

## Accessing Search Params

### In Component

```typescript
const { page, sort } = Route.useSearch()
```

### With Select (Performance)

```typescript
const page = Route.useSearch({
  select: (s) => s.page,
  structuralSharing: true,
})
```

### In Loader

```typescript
loaderDeps: ({ search }) => ({ search }),
loader: ({ deps: { search } }) => fetchPosts(search)
```

---

## Navigation with Search

```typescript
// Set
<Link to="/posts" search={{ page: 1, sort: 'newest' }}>

// Update
<Link to="." search={(prev) => ({ ...prev, page: prev.page + 1 })}>

// Programmatic
navigate({ to: '.', search: { ...search, page: 2 }, replace: true })
```

---

## Middlewares

### stripSearchParams

Removes default values from URL:

```typescript
search: {
  middlewares: [stripSearchParams({ page: 1, sort: 'newest' })]
}
```

### retainSearchParams

Preserves certain params between navigations.

---

## Best Practices

| Do ✅ | Don't ❌ |
|-------|---------|
| Validate with Zod | Unvalidated params |
| Defaults in schema | Defaults in component |
| `stripSearchParams` for clean URLs | URL with all defaults |
| Reset page on filter change | Keep page on new filter |
| `structuralSharing: true` | Unnecessary re-renders |
