---
name: route-context
description: Route context for dependency injection and shared state
when-to-use: Sharing data between routes, dependency injection, auth state
keywords: context, dependency, injection, queryClient, auth, state
priority: medium
requires: file-based-routing.md
related: loaders.md, auth-guards.md
template: templates/basic-setup.md
---

# Route Context

> **Full code**: See [templates/basic-setup.md](templates/basic-setup.md)

## Concept

Route context enables dependency injection (QueryClient, user, services) accessible in all loaders and components.

---

## Setup

| Step | API |
|------|-----|
| 1. Define interface | `interface RouterContext { queryClient, user }` |
| 2. Root route | `createRootRouteWithContext<RouterContext>()` |
| 3. Provider | `createRouter({ routeTree, context: {...} })` |

---

## Accessing Context

| Where | How |
|-------|-----|
| Loader | `loader: ({ context }) => context.queryClient.ensureQueryData()` |
| beforeLoad | `beforeLoad: ({ context }) => { if (!context.user) throw redirect() }` |
| Component | `useRouteContext({ from: '__root__' })` |

---

## Extending Context

`beforeLoad` can return data to enrich context for child routes.

| Pattern | Usage |
|---------|-------|
| Return object | Adds to child context |
| Extend interface | Strong typing with `extends RouterContext` |

---

## Best Practices

| Do ✅ | Don't ❌ |
|-------|---------|
| `createRootRouteWithContext<T>()` | Untyped context |
| QueryClient in context | Global QueryClient |
| Extend context in beforeLoad | Props drilling |
| `useRouteContext({ from })` | Context without `from` |
