---
name: async-testing
description: Async testing with waitFor, findBy, Suspense
when-to-use: Testing loading states, data fetching
keywords: waitFor, findBy, async, suspense, loading
priority: high
related: msw-setup.md, templates/component-async.md
---

# Async Testing

## Core Principle

Never use `setTimeout` or `sleep()`. Use Testing Library utilities.

---

## Methods Comparison

| Method | Use Case |
|--------|----------|
| `findBy` | Wait for single element |
| `waitFor` | Complex assertions |
| `waitForElementToBeRemoved` | Wait for loading to finish |

---

## findBy vs waitFor

| Aspect | findBy | waitFor |
|--------|--------|---------|
| Returns | Element | Void |
| Timeout | 1000ms default | 1000ms default |
| Best for | Single query | Multiple assertions |

---

## Suspense Testing Pattern

1. Render with Suspense boundary
2. Assert fallback shown
3. Wait for content with `findBy`
4. Assert fallback gone

---

## Anti-Patterns

| Pattern | Problem | Solution |
|---------|---------|----------|
| Empty `waitFor(() => {})` | No assertion | Add expect() |
| `setTimeout` | Flaky | Use waitFor |
| Nested waitFor | Unnecessary | Single waitFor |

---

## When act() Is Needed

RTL handles `act()` automatically. Only use manually if warning appears.

---

## Where to Find Code?

→ `templates/component-async.md` - Loading/error patterns
→ `templates/suspense-testing.md` - Suspense with use()
