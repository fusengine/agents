---
name: use-id
description: useId for unique IDs - accessibility, SSR-safe, form labels, ARIA attributes
when-to-use: form label/input, ARIA attributes, SSR hydration
keywords: useId, unique ID, accessibility, SSR, hydration
priority: medium
related: templates/accessible-form.md
---

# useId - Unique IDs for Accessibility

## Overview

`useId` generates unique string IDs that are stable across server/client.

**Signature:**
```typescript
const id = useId()
```

---

## Purpose

Generate unique IDs for accessibility attributes and form relationships.

**Characteristics:**
- **Stable** - Same ID on server and client (SSR-safe)
- **Unique** - No collisions within component tree
- **Automatic** - No manual ID management needed

---

## When to Use

| Use Case | Example |
|----------|---------|
| Form label/input pairing | Connect `<label htmlFor={id}>` to `<input id={id}>` |
| ARIA attributes | Link `aria-describedby`, `aria-labelledby` |
| Multiple related fields | Use base ID + suffix (`${id}-first`, `${id}-last`) |
| Listbox/Combobox patterns | Connect listbox to options |

---

## When NOT to Use

| Bad | Why | Use Instead |
|-----|-----|-------------|
| List keys | Not stable across renders | Data IDs (`todo.id`) |
| Non-accessibility IDs | Wrong purpose | `nanoid()`, `uuid()` |
| Dynamic ID generation | Breaks rules of hooks | Generate base ID once, add suffix |

---

## Anti-Patterns

1. **Using Math.random()** - Different on server/client (hydration error)
2. **Global ID counter** - Not SSR-safe
3. **Hardcoded IDs** - Collisions when component reused
4. **Generating IDs in loops** - Breaks rules of hooks

---

## Key Points

- SSR-safe (no hydration mismatch)
- Unique per component instance
- Stable across renders
- Designed for ARIA and form relationships
- Use suffix pattern for multiple fields: `${baseId}-field1`

→ See `templates/accessible-form.md` for complete code examples
