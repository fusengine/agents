---
name: open-closed
description: OCP Guide - Extend via composition and props, not modification
when-to-use: adding features, extending components, plugin systems
keywords: open closed, OCP, extension, composition, props, plugins
priority: high
related: single-responsibility.md, templates/component.md, templates/factory.md
---

# Open/Closed Principle (OCP) for React

**Open for extension, closed for modification**

Add new features by **adding code**, not changing existing code.

---

## When to Apply OCP?

### Symptoms of Violation

1. **Adding variant requires modifying component**
   - Switch/case grows with each variant
   - Component becomes bloated

2. **New feature = modify existing code**
   - Risk of breaking existing functionality
   - Hard to test in isolation

3. **Component has many boolean props**
   - `showHeader`, `showFooter`, `isCompact`, etc.
   - Combinatorial explosion

---

## How to Apply OCP?

### 1. Variant Props (Simple Extension)

Instead of modifying component for each style:

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}
```

Adding new variant = add to type, add style mapping.

→ See `templates/component.md` for implementation

### 2. Composition Pattern (Slots)

Instead of boolean props for optional parts:

```typescript
interface CardProps {
  header?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
}
```

Caller decides what to render in each slot.

→ See `templates/component.md` for Card example

### 3. Render Props (Custom Rendering)

Instead of hardcoded item rendering:

```typescript
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  renderEmpty?: () => React.ReactNode
}
```

Caller controls how items are rendered.

→ See `templates/component.md` for DataList example

### 4. Strategy Pattern (Swappable Behavior)

Instead of conditionals in hooks:

```typescript
interface StorageStrategy {
  get<T>(key: string): T | null
  set<T>(key: string, value: T): void
}

function useStorage(strategy: StorageStrategy) { ... }
```

Pass different strategy = different behavior.

→ See `templates/factory.md` for storage factory

---

## Extension Patterns Summary

| Pattern | Use Case | Example |
|---------|----------|---------|
| Variant Props | Style variations | Button variants |
| Composition | Optional sections | Card with header/footer |
| Render Props | Custom rendering | List with custom items |
| Strategy | Swappable behavior | Storage strategies |

---

## Decision Criteria

### Should I Apply OCP Here?

1. **Will there be more variants?**
   - Yes → Use variant props

2. **Are parts of UI optional?**
   - Yes → Use composition (slots)

3. **Does rendering vary by context?**
   - Yes → Use render props

4. **Does behavior need to be swappable?**
   - Yes → Use strategy pattern

---

## Where to Find Code Templates?

→ `templates/component.md` - Extensible components
→ `templates/factory.md` - Strategy/factory patterns
→ `templates/adapter.md` - Adapter patterns

---

## OCP Checklist

- [ ] Can add variants without modifying component?
- [ ] Uses composition for optional sections?
- [ ] Render functions allow custom rendering?
- [ ] Strategy pattern for swappable behavior?
- [ ] No boolean prop explosion?
