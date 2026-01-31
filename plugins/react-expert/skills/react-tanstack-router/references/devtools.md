---
name: devtools
description: TanStack Router DevTools setup and usage
when-to-use: Debugging routes, inspecting state, development setup
keywords: devtools, debug, inspect, development
priority: low
requires: installation.md
related: typescript.md
template: templates/basic-setup.md
---

# DevTools

> **Full code**: See [templates/basic-setup.md](templates/basic-setup.md)

## Installation

```bash
bun add -D @tanstack/router-devtools
```

---

## Minimal Setup

Add in `__root.tsx` with DEV condition:

```typescript
{import.meta.env.DEV && <TanStackRouterDevtools />}
```

**Production**: Automatically tree-shaken.

---

## Options

| Option | Values | Default |
|--------|--------|---------|
| `position` | `bottom-right`, `bottom-left`, `top-right`, `top-left` | `bottom-right` |
| `initialIsOpen` | `boolean` | `false` |
| `toggleButtonProps` | `{ style }` | - |

---

## Features

| Tab | What you see |
|-----|--------------|
| **Routes** | Route tree, hierarchy, config |
| **Matches** | Matched routes, params, search, loaderData |
| **History** | Navigation history, pending, timing |
| **State** | Full router state, errors |

---

## Debugging Tips

| To check | Go to |
|----------|-------|
| Route matching | Routes tab → see matched |
| Loader data | Matches → select route → loaderData |
| Navigation issues | History → see events/errors |
| Search params | Matches → route → search object |

---

## With React Query DevTools

Combine both DevTools with different positions:

| DevTools | Recommended position |
|----------|---------------------|
| Router | `bottom-right` |
| Query | `bottom-left` |

---

## Best Practices

| Do ✅ | Don't ❌ |
|-------|---------|
| `import.meta.env.DEV &&` | Include in production |
| Lazy load if desired | Forget Suspense if lazy |
| Position avoiding UI overlap | Default position if conflict |
