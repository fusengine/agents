---
name: hooks
description: TanStack Router hooks API reference
when-to-use: Using router hooks, accessing route state, programmatic navigation
keywords: hooks, useParams, useSearch, useNavigate, useRouter, useLoaderData
priority: high
requires: file-based-routing.md
related: components.md, navigation.md, typescript.md
template: templates/feature-module.md
---

# Hooks API

> **Full code**: See [templates/feature-module.md](templates/feature-module.md)

## Route API Hooks (RECOMMENDED)

Access via `Route.useX()` with **automatic type inference**.

| Hook | Returns | Type source |
|------|---------|-------------|
| `Route.useParams()` | URL params | Route pattern (`$postId`) |
| `Route.useSearch()` | Search params | `validateSearch` schema |
| `Route.useLoaderData()` | Loader data | `loader` return type |
| `Route.useRouteContext()` | Context | RouterContext + extensions |

**Advantage**: No need to specify `from`, types automatically inferred.

---

## Global Hooks

For use **outside route files**. Require `from` for type safety.

### Data Hooks

| Hook | Usage | Key option |
|------|-------|------------|
| `useParams` | URL params | `from`, `select` |
| `useSearch` | Search params | `from`, `select`, `structuralSharing` |
| `useLoaderData` | Loader data | `from`, `select` |
| `useRouteContext` | Context | `from`, `select` |

### Navigation Hooks

| Hook | Usage |
|------|-------|
| `useNavigate` | Programmatic navigation |
| `useRouter` | Full router access |
| `useLocation` | Current location |
| `useBlocker` | Block navigation (unsaved changes) |

### State Hooks

| Hook | Usage |
|------|-------|
| `useRouterState` | Subscribe to router state |
| `useMatches` | Matched routes (breadcrumbs) |
| `useMatch` | Specific match data |

---

## Common Options

| Option | Description |
|--------|-------------|
| `from` | Route path for type inference |
| `strict` | Enforce type safety (default: true with `from`) |
| `select` | Transform/select specific data |
| `structuralSharing` | Optimize re-renders |

---

## useNavigate Options

| Option | Type | Description |
|--------|------|-------------|
| `to` | `string` | Target path |
| `params` | `object` | Route params |
| `search` | `object \| function` | Search params or updater |
| `hash` | `string` | URL hash |
| `replace` | `boolean` | Replace history entry |
| `resetScroll` | `boolean` | Scroll to top |

---

## getRouteApi

To access a route's types **outside the route file**:

```typescript
const postRoute = getRouteApi('/posts/$postId')
```

**When to use**: Shared components accessing specific route data.

---

## Best Practices

| Do ✅ | Don't ❌ |
|-------|---------|
| `Route.useParams()` in route file | `useParams()` without `from` |
| `useSearch({ from, select })` | Subscribe to entire state |
| `structuralSharing: true` for perf | Forget optimization |
| Handle `useBlocker` status | Ignore blocked state |
| `getRouteApi` outside route files | Cast with `any` |
