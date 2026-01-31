---
name: reactivity
description: TanStack Form Reactivity & Performance - useStore, form.Subscribe, selector patterns
when-to-use: form state subscriptions, granular updates, avoiding re-renders, performance optimization
keywords: reactivity, useStore, subscribe, selector, performance, TanStack Form, granular updates
priority: high
related: templates/reactivity-form.md
---

# TanStack Form Reactivity & Performance

## useStore Hook

**Granular subscriptions for form state changes.**

### Purpose
- Subscribe to specific form state slices
- Avoid re-rendering entire component tree
- Optimize performance for large forms

### When to Use
- Accessing specific field values or errors
- Building custom form logic
- Performance-critical form sections

### Key Points
- Only re-renders when selected state changes
- Requires selector function to specify what to watch
- More efficient than form.Subscribe for single values
- Integrates with Zustand store pattern

→ See `templates/reactivity-form.md` for code examples

---

## form.Subscribe Method

**Component-level reactivity without hooks.**

### Purpose
- Subscribe to form state updates in render functions
- Fine-grained control over what triggers re-renders
- Render-as-you-fetch pattern support

### When to Use
- Complex conditional rendering based on form state
- Multi-field dependencies
- Combining multiple state selectors
- Components that need granular subscriptions

### Key Points
- Selector function determines subscription scope
- Only re-renders when selector result changes
- More powerful than useStore for multiple selectors
- Best for coordinating field interdependencies

→ See `templates/reactivity-form.md` for code examples

---

## Selector Patterns

**Efficient state slice selection strategies.**

### Purpose
- Define what form state to watch
- Minimize re-render triggers
- Maintain referential equality

### Key Points
- Selectors receive full form state, return subset
- Function must be stable (memoized or defined outside)
- Selector equality determines re-render necessity
- Each selector creates separate subscription

→ See `templates/reactivity-form.md` for code examples

---

## Performance Optimization Strategies

**Avoiding unnecessary re-renders in form components.**

### Granular Subscriptions
- Subscribe only to fields you actually use
- Avoid subscribing to entire form state
- Use separate components for unrelated field groups

### Selector Optimization
- Memoize selector functions with `useCallback`
- Return consistent object shapes
- Avoid creating new objects in selectors

### Component Splitting
- Isolate field components with their own subscriptions
- Parent components should not re-render on field changes
- Use composition to reduce dependency chains

→ See `templates/reactivity-form.md` for code examples

---

## useStore vs form.Subscribe

| Aspect | useStore | form.Subscribe |
|--------|----------|-----------------|
| **API Style** | Hook-based | Render function |
| **Multiple Selectors** | Separate hooks | Single call |
| **Simplicity** | Simpler for single values | Better for coordination |
| **Flexibility** | Standard React patterns | Custom rendering control |
| **Performance** | Identical when used correctly | Identical when used correctly |

---

## When to Optimize

**Only optimize when necessary:**
- Forms with 10+ fields
- Complex interdependencies between fields
- Performance measurable degradation observed
- Multiple re-renders per keystroke

**Premature optimization**
- Small forms (<5 fields) rarely need optimization
- Component splitting overhead may exceed benefit

→ See `templates/reactivity-form.md` for code examples
