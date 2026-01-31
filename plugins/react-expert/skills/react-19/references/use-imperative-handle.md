---
name: use-imperative-handle
description: useImperativeHandle to customize ref exposed to parent
when-to-use: expose limited API to parent, custom focus, scroll methods
keywords: useImperativeHandle, forwardRef, imperative, ref API
priority: low
related: use-ref.md, ref-as-prop.md
---

# useImperativeHandle - Custom Ref APIs

## Overview

`useImperativeHandle` lets you customize the instance value exposed to parent components via ref.

**Signature:**
```typescript
useImperativeHandle(ref, () => ({ method1, method2 }), [deps])
```

---

## Purpose

Control what parent sees when using a ref:
- **Expose only specific methods** - Hide implementation details
- **Create imperative APIs** - Provide methods like `focus()`, `reset()`
- **Abstract away internals** - Parent doesn't access raw DOM

Used with `forwardRef` (React <19) or `ref` prop (React 19+).

---

## When to Use

| Use Case | Example |
|----------|---------|
| Custom focus API | Expose `focus()` without exposing raw DOM |
| Video player controls | Expose `play()`, `pause()`, `seek()` |
| Modal API | Expose `open()`, `close()` |
| Form reset API | Expose `reset()`, `submit()` |

---

## When NOT to Use

| Bad | Why | Use Instead |
|-----|-----|-------------|
| Prefer props for data flow | Breaks React data flow | Props and callbacks |
| Exposing entire DOM node | Breaks encapsulation | Expose only needed methods |
| Replacing state management | Wrong pattern | Controlled component with props |

---

## Anti-Patterns

1. **Exposing too much** - Parent can break component internals
2. **Complex logic in exposed methods** - Keep imperative API simple
3. **Using instead of props** - Prefer declarative when possible

---

## Key Points

- Used with refs (forwardRef or ref props)
- Limits exposure to parent
- Imperative escape hatch (less common)
- Most components should use props
- Type-safe with TypeScript interfaces

→ See `templates/imperative-handle-patterns.md` for complete code examples
