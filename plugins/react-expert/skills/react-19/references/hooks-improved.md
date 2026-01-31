---
name: hooks-improved
description: React 19 improved hooks - useDeferredValue initialValue, useTransition async
when-to-use: deferred rendering, async transitions, performance optimization
keywords: useDeferredValue, useTransition, async, initialValue, transitions
priority: medium
related: new-hooks.md, templates/use-deferred-value.md, templates/use-transition-async.md
---

# Improved Hooks (React 19)

## Overview

React 19 improves existing hooks with new capabilities.

---

## useDeferredValue - New initialValue

### What Changed

New optional second parameter `initialValue`.

### Signature

```
useDeferredValue(value, initialValue?)
```

### Behavior

| Render | Without initialValue | With initialValue |
|--------|---------------------|-------------------|
| Initial | Returns `value` | Returns `initialValue` |
| Re-render | Returns deferred `value` | Returns deferred `value` |

### When to Use

- Search inputs with initial empty state
- Filters with default value
- Avoid flash of content on mount

---

## useTransition - Async Support

### What Changed

`startTransition` now accepts async functions.

### Benefits

- `isPending` stays true during entire async operation
- No manual pending state management
- Automatic error handling with Actions

### Key Point

Updates after `await` are NOT automatically transitions.
Wrap them in another `startTransition` if needed.

---

## Comparison

| Feature | React 18 | React 19 |
|---------|----------|----------|
| useDeferredValue | `(value)` | `(value, initialValue?)` |
| useTransition | sync only | async supported |
| Pending state | manual | automatic with async |

---

## Where to Find Code Templates?

→ `templates/use-deferred-value.md` - useDeferredValue patterns
→ `templates/use-transition-async.md` - Async transition patterns
