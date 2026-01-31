---
name: react-19
description: React 19.2 features - use(), useOptimistic, useActionState, useEffectEvent, Activity component, React Compiler. Use when implementing React 19 patterns.
version: 19.2.0
user-invocable: true
references: references/new-hooks.md, references/activity-component.md, references/actions-api.md, references/react-compiler.md, references/ref-as-prop.md, references/context-improvements.md, references/suspense-patterns.md, references/document-metadata.md, references/resource-loading.md, references/migration-18-19.md, references/templates/action-form.md, references/templates/optimistic-update.md, references/templates/activity-tabs.md, references/templates/use-promise.md, references/templates/use-context.md, references/templates/use-effect-event.md, references/templates/error-boundary.md, references/templates/ref-as-prop.md, references/templates/document-metadata.md, references/templates/resource-loading.md, references/hooks-improved.md, references/templates/use-deferred-value.md, references/templates/use-transition-async.md
---

# React 19.2 Core Features

## Current Date (CRITICAL)

**Today: January 2026** - React 19.2 released October 2025.
ALWAYS verify latest API with Context7 + Exa.

## MANDATORY: Research Before Coding

1. **Use Context7** to query React official documentation
2. **Use Exa web search** with "React 19.2 2026" for latest patterns
3. **Check React Blog** for updates

---

## What's New in React 19.2

### New Hooks

| Hook | Purpose | Guide |
|------|---------|-------|
| `use()` | Read promises/context in render | `references/new-hooks.md` |
| `useOptimistic` | Optimistic UI updates | `references/new-hooks.md` |
| `useActionState` | Form action state management | `references/new-hooks.md` |
| `useFormStatus` | Form pending state (child components) | `references/new-hooks.md` |
| `useEffectEvent` | Non-reactive callbacks in effects | `references/new-hooks.md` |

→ See `references/new-hooks.md` for detailed usage

### Activity Component (19.2)

Hide/show components while preserving state:

```typescript
<Activity mode={isActive ? 'visible' : 'hidden'}>
  <TabContent />
</Activity>
```

→ See `references/activity-component.md` for patterns

### React Compiler (19.1+)

Automatic memoization - useMemo/useCallback mostly obsolete:

- Build-time optimization
- No more manual memoization in most cases
- 2.5× faster interactions reported

→ See `references/react-compiler.md` for details

---

## Quick Reference

### use() Hook

```typescript
// Read promise in render (with Suspense)
const data = use(dataPromise)

// Read context conditionally (unique to use())
if (condition) {
  const theme = use(ThemeContext)
}
```

→ See `references/templates/use-promise.md`

### useOptimistic

```typescript
const [optimisticValue, setOptimistic] = useOptimistic(actualValue)
// Update UI immediately, server updates later
```

→ See `references/templates/optimistic-update.md`

### useActionState

```typescript
const [state, action, isPending] = useActionState(asyncFn, initialState)
```

→ See `references/templates/action-form.md`

### useEffectEvent (19.2)

```typescript
const onEvent = useEffectEvent(() => {
  // Always has fresh props/state, doesn't trigger re-run
})

useEffect(() => {
  connection.on('event', onEvent)
}, []) // No need to add onEvent to deps
```

→ See `references/new-hooks.md`

---

## Breaking Changes from 18

| Change | Migration |
|--------|-----------|
| `ref` is a prop | Remove `forwardRef` wrapper |
| `Context` is provider | Use `<Context value={}>` directly |
| `useFormStatus` | Import from `react-dom` |

→ See `references/migration-18-19.md`

---

## Best Practices

1. **Data fetching**: Use `use()` + Suspense, NOT useEffect
2. **Forms**: Use Actions + useActionState
3. **Optimistic UI**: Use `useOptimistic` for instant feedback
4. **Tabs/Modals**: Use `<Activity>` to preserve state
5. **Effect events**: Use `useEffectEvent` for non-reactive callbacks
6. **Memoization**: Let React Compiler handle it

---

## Templates

| Template | Use Case |
|----------|----------|
| `templates/action-form.md` | Form with useActionState |
| `templates/optimistic-update.md` | useOptimistic pattern |
| `templates/activity-tabs.md` | Activity component tabs |
| `templates/use-promise.md` | use() with promises |

---

## Forbidden (Outdated Patterns)

- ❌ `useEffect` for data fetching → use `use()` + Suspense
- ❌ `forwardRef` → use `ref` as prop
- ❌ `<Context.Provider>` → use `<Context value={}>`
- ❌ Manual useMemo/useCallback everywhere → let Compiler handle it
- ❌ Conditional rendering for state preservation → use `<Activity>`
