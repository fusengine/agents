---
name: suspense-patterns
description: Advanced Suspense patterns with use() hook and ErrorBoundary
when-to-use: data fetching, async operations, loading states, error handling
keywords: Suspense, use, ErrorBoundary, loading, fallback, async
priority: high
related: new-hooks.md, templates/use-promise.md, templates/error-boundary.md
---

# Advanced Suspense Patterns (React 19)

## Core Concept

`use()` + `<Suspense>` + `<ErrorBoundary>` = Modern data fetching.

---

## Pattern Types

| Pattern | Use Case |
|---------|----------|
| Single Suspense | One async operation |
| Nested Suspense | Independent loading states |
| Parallel fetching | Multiple independent data |
| Streaming | Show content as it arrives |

---

## Parallel Data Fetching

Start all fetches simultaneously outside component.
All promises start immediately, not sequentially.
Component suspends until all resolve.

**Key:** Create promises before rendering, pass as props.

---

## Nested Suspense (Granular Loading)

Different fallbacks for different sections:
- Each section loads independently
- Fast sections appear first
- Slow sections show their own skeleton

**Use case:** Dashboard with multiple widgets.

---

## Error Boundary Placement

### Per-Section (Granular)

Each section has its own ErrorBoundary.
Failure in one section doesn't break others.

### Global (Page-level)

One ErrorBoundary for entire page.
Any error shows full-page fallback.

---

## Streaming Pattern

Show content as it arrives:
- Critical content first
- Secondary content streams in
- Progressive enhancement

---

## With TanStack Query

Use `useSuspenseQuery` for:
- Automatic caching
- Deduplication
- Background refetching
- Suspense integration

---

## Anti-Patterns to Avoid

### Waterfall

Sequential fetches - each waits for previous.
**Fix:** Start all fetches in parallel.

### Promise in Render

Creating new promise every render.
**Fix:** Create promise outside component or in loader.

---

## Best Practices

1. **Create promises outside component** or in loader
2. **Use parallel fetching** when data is independent
3. **Nest Suspense** for granular loading states
4. **Always pair with ErrorBoundary**
5. **Prefer TanStack Query** for caching

---

## Where to Find Code Templates?

→ `templates/use-promise.md` - Basic use() patterns
→ `templates/error-boundary.md` - ErrorBoundary implementation
